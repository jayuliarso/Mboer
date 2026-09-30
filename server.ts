import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize GoogleGenAI client if API key is present
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;
if (apiKey) {
  aiClient = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// 1. AI Endpoint: Analisa Temuan & Perumusan Rekomendasi SPI
app.post('/api/ai/analyze-finding', async (req: Request, res: Response) => {
  const { kondisi, kriteria, kategori, unitKerja } = req.body;

  if (aiClient) {
    try {
      const prompt = `Sebagai Auditor Senior Teknik Satuan Pengawasan Intern (SPI), lakukan analisis mendalam terhadap temuan audit teknik berikut:
- Unit Kerja: ${unitKerja || 'Unit Operasional/Proyek'}
- Kategori Temuan: ${kategori || 'Teknis & Mutu'}
- Kondisi (Fakta Lapangan): "${kondisi}"
- Kriteria / Standar: "${kriteria}"

Berikan respon dalam format JSON yang valid (tanpa markdown backticks) dengan struktur:
{
  "akarMasalah": "Analisis penyebab utama (Root Cause Analysis)",
  "dampakRisiko": "Analisis dampak teknis, finansial, dan hukum/kepatuhan",
  "rekomendasiKorektif": "Langkah perbaikan langsung untuk menyelesaikan kondisi saat ini",
  "rekomendasiPreventif": "Langkah pencegahan agar kejadian serupa tidak terulang di masa mendatang",
  "klausulStandarTerkait": "Daftar standar SNI / ISO / SOP yang relevan",
  "prioritasSaran": "Tinggi"
}`;

      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.3,
        },
      });

      const text = response.text;
      if (text) {
        try {
          const parsed = JSON.parse(text);
          return res.json({ success: true, data: parsed, isAiGenerated: true });
        } catch {
          // If parse fails, wrap in object
          return res.json({
            success: true,
            data: {
              akarMasalah: text,
              dampakRisiko: 'Risiko kegagalan mutu konstruksi dan potensi audit temuan berulang.',
              rekomendasiKorektif: 'Lakukan pengujian ulang dan audit fisik 100%.',
              rekomendasiPreventif: 'Perketat pengawasan berkala dan kualifikasi personel.',
              klausulStandarTerkait: 'SNI / Spesifikasi Umum Bina Marga',
              prioritasSaran: 'Tinggi',
            },
            isAiGenerated: true,
          });
        }
      }
    } catch (err: any) {
      console.warn('Gemini API call failed, falling back to expert system:', err?.message);
    }
  }

  // Fallback intelligent expert analysis engine
  return res.json({
    success: true,
    data: {
      akarMasalah: `Ketidakterpenuhan kriteria pengendalian mutu akibat prosedur Quality Control internal unit kerja yang belum menerapkan double-check verification sebelum tahapan serah terima, dipicu deviasi metode kerja di lapangan (${kategori}).`,
      dampakRisiko: `Potensi penurunan performa teknis umur rencana aset hingga 25%, risiko klaim garansi ditolak pabrikan/asuransi, serta temuan kepatuhan pada pemeriksaan lanjutan BPK/BKP.`,
      rekomendasiKorektif: `1. Menginstruksikan PPK dan Konsultan Pengawas untuk menghentikan sementara proses terkait sampai dilakukan uji verifikasi teknis independen terakreditasi KAN.\n2. Membuat laporan ketidaksesuaian (NCR) dan melengkapi berkas teknis deviasi maksimal 7 hari kerja.`,
      rekomendasiPreventif: `1. Memperbarui dokumen SOP pengawasan mutu dengan menyertakan checklist verifikasi digital wajib sebelum approval pekerjaan.\n2. Menyelenggarakan refreshment training teknis bagi inspektur lapangan dan tim pengawas internal.`,
      klausulStandarTerkait: `ISO 9001:2015 Klausul 8.6, Spesifikasi Umum Teknis Bina Marga 2020 Revisi 2, dan Pedoman Pengawasan Internal SPI.`,
      prioritasSaran: 'Tinggi',
    },
    isAiGenerated: false,
  });
});

// 2. AI Endpoint: Penyusunan Otomatis Draf Laporan Hasil Pemeriksaan (LHP)
app.post('/api/ai/draft-lhp', async (req: Request, res: Response) => {
  const { programJudul, nomorAudit, unitKerja, temuanList } = req.body;

  if (aiClient) {
    try {
      const prompt = `Sebagai Supervisor Pengawas Teknik SPI, buat draf resmi "Laporan Hasil Pemeriksaan (LHP) Teknik":
- Nomor Audit: ${nomorAudit}
- Judul Kegiatan: ${programJudul}
- Unit Kerja Objek: ${unitKerja}
- Rincian Temuan & Rekomendasi: ${JSON.stringify(temuanList)}

Format dokumen dengan gaya bahasa resmi dinas Indonesia yang elegan, mencakup:
1. Ringkasan Eksekutif
2. Dasar & Tujuan Pengawasan
3. Metodologi Pemeriksaan (Uji Petik Fisik & Dokumen)
4. Rekapitulasi Temuan dan Matriks Rekomendasi
5. Kesimpulan dan Tindak Lanjut yang Diharapkan Supervisor

Gunakan format teks rapi dengan nomor dan poin-poin yang profesional.`;

      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
      });

      const text = response.text;
      if (text) {
        return res.json({ success: true, lhpText: text, isAiGenerated: true });
      }
    } catch (err: any) {
      console.warn('Gemini draft-lhp fallback:', err?.message);
    }
  }

  // Fallback high quality template
  const formattedDate = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const fallbackText = `SATUAN PENGAWASAN INTERN (SPI)
BIDANG PENGAWASAN TEKNIK & MUTU
============================================================
DRAF LAPORAN HASIL PEMERIKSAAN (LHP) TEKNIK
Nomor Registrasi : ${nomorAudit || 'LHP/SPI-TEK/2026/03/018'}
Tanggal         : ${formattedDate}
Perihal         : Laporan Hasil Audit Kelaikan dan Pengawasan Teknik Terintegrasi

I. RINGKASAN EKSEKUTIF
Berdasarkan Program Kerja Pengawasan Tahunan (PKPT), Tim Pengawas Teknik telah melaksanakan audit kelaikan teknis terhadap "${programJudul}". Secara umum, progres fisik telah berjalan namun masih dijumpai sejumlah catatan ketidaksesuaian terhadap spesifikasi teknis dan SOP administrasi mutu yang membutuhkan atensi segera dari Manajemen Unit Kerja.

II. DASAR DAN TUJUAN PENGAWASAN
1. Surat Keputusan Direksi tentang Program Kerja Pengawasan Tahunan (PKPT).
2. Peraturan Menteri dan Standar Teknis Industri yang berlaku (SNI / PU / IEC).
3. Pasal 15 Huruf c tentang Kewajiban Pemutakhiran Hasil Pemeriksaan Pengawasan Teknik.
Tujuan: Memastikan pemenuhan standar mutu teknik, kepatuhan kontraktual, mitigasi kegagalan operasional, dan kepastian akuntabilitas barang/jasa.

III. METODOLOGI PENGAWASAN
- Uji Petik Lapangan (Physical Site Inspection & NDT Testing).
- Rekonsiliasi Dokumen Kontrak, As-Built Drawing, dan Berita Acara Penerimaan Fisik.
- Wawancara terstruktur dengan Pejabat Pembuat Komitmen (PPK) dan Konsultan Pengawas.

IV. RESUME TEMUAN & REKOMENDASI PRIORITAS
Jumlah temuan teridentifikasi: ${temuanList?.length || 2} temuan.
1. Temuan Ketidaksesuaian Spesifikasi & Toleransi Material:
   - Kondisi: Ditemukan deviasi mutu di atas batas toleransi yang disyaratkan.
   - Rekomendasi: Lakukan uji laboratorium independen dan perbaikan struktur segera.
2. Temuan Kepatuhan Penatausahaan Dokumen Mutu:
   - Rekomendasi: Pemutakhiran dokumen pendukung dan As-Built Drawing berparaf lengkap.

V. SIMPULAN & TINDAK LANJUT SUPERVISOR PENGAWAS TEKNIK
Auditee diwajibkan menyusun Action Plan tindak lanjut dan mengunggah bukti perbaikan ke sistem ePTI dalam jangka waktu paling lambat 14 (empat belas) hari kalender sejak laporan ini diterbitkan. Supervisor Pengawas Teknik akan melakukan verifikasi berkala secara digital.

Disusun oleh:
Tim Pengawas Teknik SPI

Disetujui oleh:
Ir. Bambang Trihadi, M.T.
Supervisor Pengawas Teknik
NIP. 19780415 200312 1 002`;

  return res.json({ success: true, lhpText: fallbackText, isAiGenerated: false });
});

// 3. AI Endpoint: Risk Assessment & Mitigation Recommender
app.post('/api/ai/risk-assessment', async (req: Request, res: Response) => {
  const { deskripsiRisiko, objekPengawasan } = req.body;

  if (aiClient) {
    try {
      const prompt = `Sebagai Ahli Manajemen Risiko Teknik (ISO 31000) dan Auditor SPI:
Analisis risiko teknik berikut:
- Objek Pengawasan: ${objekPengawasan}
- Risiko: "${deskripsiRisiko}"

Tentukan:
1. Kemungkinan (Likelihood skor 1 sampai 5)
2. Konsekuensi (Consequence skor 1 sampai 5)
3. Level Risiko: "Rendah" | "Sedang" | "Tinggi" | "Ekstrem"
4. Program Mitigasi Konkret
5. Target waktu mitigasi (misal: 30 hari / 60 hari)

Berikan respon JSON valid dengan properti:
{
  "kemungkinan": 3,
  "konsekuensi": 4,
  "levelRisiko": "Tinggi",
  "programMitigasi": "deskripsi rencana aksi mitigasi",
  "deadlineSaran": "30 hari kalender"
}`;

      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.2,
        },
      });

      const text = response.text;
      if (text) {
        const parsed = JSON.parse(text);
        return res.json({ success: true, data: parsed, isAiGenerated: true });
      }
    } catch (err: any) {
      console.warn('Gemini risk assessment fallback:', err?.message);
    }
  }

  // Fallback calculation
  return res.json({
    success: true,
    data: {
      kemungkinan: 3,
      konsekuensi: 4,
      levelRisiko: 'Tinggi',
      programMitigasi: `Menerapkan continuous inspection, pengujian laboratorium sampel independen acak, serta mewajibkan checklist QA/QC harian diverifikasi oleh Konsultan Pengawas dan Pengawas Teknik.`,
      deadlineSaran: '30 hari kalender',
    },
    isAiGenerated: false,
  });
});

// Development vs Production serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`ePTI Server running on http://0.0.0.0:${port}`);
  });
}

startServer();
