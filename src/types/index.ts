// Types for ePTI - e-Pengawas Teknik Terintegrasi

export type UserRole =
  | 'supervisor' // Supervisor Pengawas Teknik (Full approval & coordination)
  | 'auditor'    // Auditor / Staf Pengawas (Input checklist & findings)
  | 'auditee'    // Unit Kerja / PPK (Submit action plans & evidence)
  | 'pphp'       // Personel PPHP (Pemeriksaan fisik barang/jasa & BA)
  | 'admin_spi'; // Admin SPI / Direksi (Executive monitoring)

export type ProgramType = 'PKPT' | 'Non-PKPT';
export type ProgramStatus = 'Draft' | 'Berjalan' | 'Selesai';
export type ObjekPengawasan = 'Proyek' | 'Pengadaan' | 'Operasional' | 'Konstruksi' | 'Pemeliharaan';

export interface AuditProgram {
  id: string;
  nomor: string;
  tahun: number;
  tipe: ProgramType;
  judul: string;
  objek: ObjekPengawasan;
  unitKerja: string;
  lokasi: string;
  supervisor: string;
  ketuaTim: string;
  anggotaTim: string[];
  anggaran: number;
  jadwalMulai: string;
  jadwalSelesai: string;
  status: ProgramStatus;
  progressPercent: number;
  jumlahTemuan: number;
  uraianTugas: string;
}

export type KategoriTemuan = 'Administratif' | 'Teknis' | 'Mutu' | 'Risiko' | 'Kepatuhan';
export type PrioritasRekomendasi = 'Tinggi' | 'Sedang' | 'Rendah';
export type StatusRekomendasi = 'Open' | 'Progress' | 'Verifikasi' | 'Closed';

export interface Rekomendasi {
  id: string;
  nomor: string;
  uraian: string;
  pic: string;
  targetSelesai: string;
  prioritas: PrioritasRekomendasi;
  status: StatusRekomendasi;
  catatanSupervisor?: string;
  // Tindak lanjut data
  tindakLanjut?: {
    uraian: string;
    tanggalSubmit: string;
    submittedBy: string;
    buktiFile: string;
    buktiNama: string;
    catatanAuditor?: string;
    tanggalVerifikasi?: string;
    verifiedBy?: string;
  };
}

export interface Temuan {
  id: string;
  nomorTemuan: string;
  programId: string;
  programJudul: string;
  tanggal: string;
  unitKerja: string;
  kategori: KategoriTemuan;
  kondisi: string;
  kriteria: string;
  sebab: string;
  akibat: string;
  nilaiRisiko: 'Rendah' | 'Sedang' | 'Tinggi' | 'Ekstrem';
  estimasiKerugian?: number;
  buktiFoto?: string;
  buktiKeterangan?: string;
  rekomendasiList: Rekomendasi[];
  statusApprovalSupervisor: 'Draft' | 'Disetujui' | 'Revisi';
}

export interface RiskItem {
  id: string;
  kode: string;
  objekPengawasan: string;
  deskripsiRisiko: string;
  penyebab: string;
  dampak: string;
  kemungkinan: 1 | 2 | 3 | 4 | 5; // Likelihood (1-5)
  konsekuensi: 1 | 2 | 3 | 4 | 5; // Consequence (1-5)
  skorInherent: number; // kemungkinan * konsekuensi
  levelRisiko: 'Rendah' | 'Sedang' | 'Tinggi' | 'Ekstrem';
  programMitigasi: string;
  pic: string;
  deadline: string;
  statusMitigasi: 'Belum Mitigasi' | 'On Progress' | 'Tuntas Terkendali';
  residualScore: number;
}

export type QARating = 'Sangat Baik' | 'Baik' | 'Cukup' | 'Kurang';

export interface QACheckItem {
  id: string;
  standarRef: string;
  parameter: string;
  kriteriaUji: string;
  hasilUji: 'Sesuai' | 'Tidak Sesuai' | 'Observasi';
  skor: number; // 0 - 100
  keterangan: string;
}

export interface QAInspection {
  id: string;
  nomorQA: string;
  paketPekerjaan: string;
  lokasi: string;
  kontraktor: string;
  jadwalInspeksi: string;
  timInspektur: string[];
  status: 'Terjadwal' | 'Proses' | 'Selesai';
  rating: QARating;
  skorRataRata: number;
  checklist: QACheckItem[];
  ncrCount: number; // Non-conformance report
  correctiveActionPlan: string;
}

export interface EvaluasiBarangJasa {
  id: string;
  nomorKontrak: string;
  namaPaket: string;
  penyedia: string;
  nilaiKontrak: number;
  tanggalPemeriksaan: string;
  lokasi: string;
  volumeKontrak: string;
  volumeRealisasi: string;
  persentaseVolume: number;
  spesifikasiKesesuaian: 'Sesuai 100%' | 'Deviasi Minor' | 'Deviasi Mayor';
  mutuKelaikan: 'Layak' | 'Layak dengan Catatan' | 'Tidak Layak';
  statusBA: 'Draft' | 'Diverifikasi PPHP' | 'Disetujui Supervisor' | 'BAP Terbit';
  dokumentasi: {
    foto1: string;
    foto2: string;
    drawingRef: string;
    asBuiltStatus: 'Tersedia Lengkap' | 'Belum Lengkap';
  };
  catatanEvaluasi: string;
}

export interface PersonelPPHP {
  id: string;
  nip: string;
  nama: string;
  jabatan: string;
  unitAsal: string;
  sertifikasi: string[];
  bebanKerjaAktif: number; // jumlah penugasan berjalan
  statusKetersediaan: 'Siap Tugas' | 'Sedang Bertugas' | 'Cuti / Non-aktif';
  totalPenugasanSelesai: number;
  kontak: string;
}

export interface SuratTugasPPHP {
  id: string;
  nomorST: string;
  tanggalST: string;
  namaPekerjaan: string;
  lokasi: string;
  personelIds: string[];
  tanggalMulai: string;
  tanggalSelesai: string;
  ditandatanganiOleh: string;
  status: 'Diterbitkan' | 'Selesai' | 'Dibatalkan';
}

export interface KnowledgeItem {
  id: string;
  judul: string;
  nomorDokumen: string;
  kategori: 'SOP' | 'Pedoman' | 'Standar SNI' | 'Regulasi';
  tahun: number;
  ringkasan: string;
  linkDownload: string;
  totalDibaca: number;
  kuisTersedia: boolean;
  kuisSoal?: {
    pertanyaan: string;
    pilihan: string[];
    kunciJawaban: number;
  }[];
}

export interface MobileInspectionSubmission {
  id: string;
  inspekturNama: string;
  tanggalJam: string;
  lokasiGps: string;
  namaObjek: string;
  kondisiCuaca: string;
  statusOfflineSync: 'Tersinkronisasi' | 'Draft Offline';
  checklistResults: { item: string; status: 'OK' | 'NOK'; catatan: string }[];
  fotoEvidenceUrl: string;
  tandaTanganDigital: string;
}

export interface NotifikasiAlert {
  id: string;
  judul: string;
  pesan: string;
  tipe: 'warning' | 'info' | 'critical' | 'success';
  waktu: string;
  dibaca: boolean;
  linkTab?: string;
}
