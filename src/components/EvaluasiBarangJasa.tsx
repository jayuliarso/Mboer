import React, { useState } from 'react';
import {
  FileCheck,
  Plus,
  Search,
  Printer,
  CheckCircle2,
  AlertCircle,
  FileText,
  Image,
  Building,
  Calendar,
  Check,
  Download,
  Eye,
  Award
} from 'lucide-react';
import { EvaluasiBarangJasa, UserRole } from '../types';
import { formatRupiah, formatDateIndo, getStatusBadge } from '../utils/helpers';

interface EvaluasiBarangJasaProps {
  evaluasiList: EvaluasiBarangJasa[];
  onAddEvaluasi: (newEv: EvaluasiBarangJasa) => void;
  onUpdateEvaluasi: (updated: EvaluasiBarangJasa) => void;
  currentRole: UserRole;
}

export const EvaluasiBarangJasaModule: React.FC<EvaluasiBarangJasaProps> = ({
  evaluasiList,
  onAddEvaluasi,
  onUpdateEvaluasi,
  currentRole,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeModalDocument, setActiveModalDocument] = useState<{
    type: 'BAP' | 'BAPP' | 'LaporanEvaluasi';
    item: EvaluasiBarangJasa;
  } | null>(null);

  const [showAddModal, setShowAddModal] = useState(false);

  const [formData, setFormData] = useState({
    nomorKontrak: `KTR/PBJ-TEK/2026/03/${Math.floor(100 + Math.random() * 900)}`,
    namaPaket: '',
    penyedia: '',
    nilaiKontrak: 1200000000,
    tanggalPemeriksaan: new Date().toISOString().split('T')[0],
    lokasi: 'Tangerang',
    volumeKontrak: '100% Sesuai Gambar Rencana',
    volumeRealisasi: '100% Terpasang',
    persentaseVolume: 100,
    spesifikasiKesesuaian: 'Sesuai 100%' as 'Sesuai 100%' | 'Deviasi Minor' | 'Deviasi Mayor',
    mutuKelaikan: 'Layak' as 'Layak' | 'Layak dengan Catatan' | 'Tidak Layak',
    catatanEvaluasi: 'Pemeriksaan fisik menunjukkan mutu material dan uji fungsi berjalan normal tanpa deviasi kritikal.',
  });

  const handleSaveNewEvaluasi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.namaPaket) return;

    const newEv: EvaluasiBarangJasa = {
      id: `EV-${Date.now().toString().slice(-4)}`,
      nomorKontrak: formData.nomorKontrak,
      namaPaket: formData.namaPaket,
      penyedia: formData.penyedia || 'PT Karya Utama Mandiri',
      nilaiKontrak: Number(formData.nilaiKontrak),
      tanggalPemeriksaan: formData.tanggalPemeriksaan,
      lokasi: formData.lokasi,
      volumeKontrak: formData.volumeKontrak,
      volumeRealisasi: formData.volumeRealisasi,
      persentaseVolume: Number(formData.persentaseVolume),
      spesifikasiKesesuaian: formData.spesifikasiKesesuaian,
      mutuKelaikan: formData.mutuKelaikan,
      statusBA: currentRole === 'supervisor' ? 'Disetujui Supervisor' : 'Diverifikasi PPHP',
      dokumentasi: {
        foto1: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=600&q=80',
        foto2: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
        drawingRef: 'DWG-ASBUILT-2026-FINAL',
        asBuiltStatus: 'Tersedia Lengkap',
      },
      catatanEvaluasi: formData.catatanEvaluasi,
    };

    onAddEvaluasi(newEv);
    setShowAddModal(false);
  };

  const handleApproveBA = (ev: EvaluasiBarangJasa) => {
    onUpdateEvaluasi({
      ...ev,
      statusBA: 'Disetujui Supervisor',
    });
  };

  const filteredList = evaluasiList.filter((e) => {
    const s = searchTerm.toLowerCase();
    return (
      e.namaPaket.toLowerCase().includes(s) ||
      e.nomorKontrak.toLowerCase().includes(s) ||
      e.penyedia.toLowerCase().includes(s)
    );
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
              Tugas Supervisor Pengawas Teknik (Huruf G)
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-emerald-400" />
            Evaluasi Hasil Pekerjaan Pengadaan Barang & Jasa (PBJ)
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Pemeriksaan volume fisik, kesesuaian spesifikasi kontrak, uji kelaikan fungsi, dan otomasi penerbitan Berita Acara (BAP/BAPP).
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-950/40 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Input Evaluasi Paket Baru</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700/80 shadow-md">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nomor kontrak, nama paket pengadaan, penyedia barang/jasa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-900 text-xs text-white rounded-xl border border-slate-700 focus:outline-none focus:border-cyan-400"
          />
        </div>
      </div>

      {/* EVALUATION LIST CARDS */}
      <div className="space-y-4">
        {filteredList.map((item) => (
          <div
            key={item.id}
            className="p-5 bg-slate-800/80 rounded-2xl border border-slate-700/80 hover:border-slate-600 transition shadow-lg space-y-4"
          >
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3">
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center flex-wrap gap-2">
                  <span className="font-mono text-xs font-bold text-cyan-300">{item.nomorKontrak}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${getStatusBadge(item.statusBA)}`}>
                    {item.statusBA}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400">
                    Kelaikan: <strong className="text-white">{item.mutuKelaikan}</strong>
                  </span>
                </div>

                <h3 className="text-base font-bold text-white">{item.namaPaket}</h3>

                <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400">
                  <span>Penyedia: <strong className="text-slate-300">{item.penyedia}</strong></span>
                  <span>Nilai Kontrak: <strong className="text-emerald-400">{formatRupiah(item.nilaiKontrak)}</strong></span>
                  <span>Tanggal Pemeriksaan: {formatDateIndo(item.tanggalPemeriksaan)}</span>
                  <span>Lokasi: {item.lokasi}</span>
                </div>
              </div>

              {/* Action Buttons for Document Generation */}
              <div className="flex items-center flex-wrap gap-2">
                <button
                  onClick={() => setActiveModalDocument({ type: 'BAPP', item })}
                  className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                  title="Generate Berita Acara Pemeriksaan Pekerjaan"
                >
                  <FileText className="w-3.5 h-3.5 text-cyan-400" />
                  <span>BA Pemeriksaan (BAPP)</span>
                </button>

                <button
                  onClick={() => setActiveModalDocument({ type: 'BAP', item })}
                  className="px-3 py-1.5 bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 border border-blue-500/40 rounded-xl text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                  title="Generate Berita Acara Pembayaran"
                >
                  <FileCheck className="w-3.5 h-3.5 text-blue-400" />
                  <span>BA Pembayaran (BAP)</span>
                </button>

                <button
                  onClick={() => setActiveModalDocument({ type: 'LaporanEvaluasi', item })}
                  className="px-3 py-1.5 bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/40 rounded-xl text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                  title="Generate Laporan Evaluasi Teknis Kelaikan"
                >
                  <Award className="w-3.5 h-3.5 text-yellow-300" />
                  <span>Laporan Evaluasi</span>
                </button>

                {currentRole === 'supervisor' && item.statusBA !== 'Disetujui Supervisor' && (
                  <button
                    onClick={() => handleApproveBA(item)}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1 transition cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Sahkan BA</span>
                  </button>
                )}
              </div>
            </div>

            {/* 4 Pillars of Evaluation (Volume, Spesifikasi, Mutu, Dokumentasi) */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-3.5 bg-slate-900/60 rounded-xl border border-slate-700/60 text-xs">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">1. Uji Volume Fisik</span>
                <div className="text-white font-bold">{item.persentaseVolume}% Terpenuhi</div>
                <p className="text-[11px] text-slate-400">{item.volumeRealisasi}</p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">2. Spesifikasi Teknis</span>
                <div className={`font-bold ${item.spesifikasiKesesuaian === 'Sesuai 100%' ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {item.spesifikasiKesesuaian}
                </div>
                <p className="text-[11px] text-slate-400">Toleransi standar pabrikan</p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">3. Mutu & Kelaikan</span>
                <div className="font-bold text-cyan-300">{item.mutuKelaikan}</div>
                <p className="text-[11px] text-slate-400">Pengujian fungsi & commissioning</p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">4. As-Built Drawing</span>
                <div className="font-bold text-purple-300">{item.dokumentasi.asBuiltStatus}</div>
                <p className="text-[11px] font-mono text-slate-400">{item.dokumentasi.drawingRef}</p>
              </div>
            </div>

            <div className="text-xs text-slate-300 pl-1 leading-relaxed">
              <strong className="text-slate-400">Catatan Hasil Evaluasi Lapangan:</strong> {item.catatanEvaluasi}
            </div>
          </div>
        ))}
      </div>

      {/* MODAL PREVIEW DOKUMEN RESMI (BAP / BAPP / Laporan Evaluasi) */}
      {activeModalDocument && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-2xl max-w-3xl w-full border border-slate-700 shadow-2xl overflow-y-auto max-h-[92vh] p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Printer className="w-4 h-4 text-cyan-400" />
                Preview Dokumen Resmi: {activeModalDocument.type === 'BAP' ? 'Berita Acara Pembayaran (BAP)' : activeModalDocument.type === 'BAPP' ? 'Berita Acara Pemeriksaan Pekerjaan (BAPP)' : 'Laporan Evaluasi Kelaikan Teknis'}
              </h3>
              <button
                onClick={() => setActiveModalDocument(null)}
                className="text-slate-400 hover:text-white text-xl font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Document Sheet */}
            <div className="bg-white text-slate-900 p-8 rounded-xl shadow font-serif text-xs leading-relaxed space-y-4 print:p-0">
              {/* Header Surat Resmi */}
              <div className="text-center border-b-2 border-black pb-3">
                <h4 className="font-black text-sm uppercase tracking-wide">
                  PANITIA / PEJABAT PENELITI HASIL PEKERJAAN (PPHP)
                </h4>
                <h5 className="font-bold text-xs uppercase">
                  SATUAN PENGAWASAN INTERN • BIDANG PENGAWASAN TEKNIK
                </h5>
                <p className="text-[10px] font-sans text-slate-600 mt-0.5">
                  Gedung Graha Pengawasan Lt. 4, Jalan Gatot Subroto No. 42, Jakarta Selatan
                </p>
              </div>

              {/* Title Dokumen */}
              <div className="text-center my-3">
                <div className="font-black text-sm uppercase underline decoration-1">
                  {activeModalDocument.type === 'BAP'
                    ? 'BERITA ACARA PEMBAYARAN (BAP)'
                    : activeModalDocument.type === 'BAPP'
                    ? 'BERITA ACARA PEMERIKSAAN HASIL PEKERJAAN (BAPP)'
                    : 'LAPORAN EVALUASI KELAIKAN TEKNIS PENGADAAN BARANG/JASA'}
                </div>
                <div className="text-[11px] font-sans font-semibold text-slate-700 mt-0.5">
                  Nomor: {activeModalDocument.type}/SPI-TEK/2026/03/044
                </div>
              </div>

              <p className="text-justify indent-6">
                Pada hari ini, tanggal <strong>{formatDateIndo(activeModalDocument.item.tanggalPemeriksaan)}</strong>, bertempat di <strong>{activeModalDocument.item.lokasi}</strong>, Panitia Peneliti Hasil Pekerjaan (PPHP) bersama dengan <strong>Supervisor Pengawas Teknik</strong> telah melaksanakan pemeriksaan fisik kelaikan teknis terhadap hasil pelaksanaan pekerjaan pengadaan:
              </p>

              {/* Rincian Kontrak */}
              <div className="p-3 bg-slate-50 border border-slate-300 rounded font-sans text-[11px] space-y-1">
                <div className="grid grid-cols-3">
                  <span className="text-slate-600">Nama Paket Pekerjaan:</span>
                  <span className="col-span-2 font-bold">{activeModalDocument.item.namaPaket}</span>
                </div>
                <div className="grid grid-cols-3">
                  <span className="text-slate-600">Nomor Kontrak:</span>
                  <span className="col-span-2 font-mono font-bold">{activeModalDocument.item.nomorKontrak}</span>
                </div>
                <div className="grid grid-cols-3">
                  <span className="text-slate-600">Penyedia Jasa:</span>
                  <span className="col-span-2 font-bold">{activeModalDocument.item.penyedia}</span>
                </div>
                <div className="grid grid-cols-3">
                  <span className="text-slate-600">Nilai Kontrak:</span>
                  <span className="col-span-2 font-bold text-emerald-800">{formatRupiah(activeModalDocument.item.nilaiKontrak)}</span>
                </div>
              </div>

              {/* Hasil Pengujian */}
              <p className="font-sans font-bold text-xs uppercase pt-1">Hasil Evaluasi Teknis 4 Aspek (Huruf G):</p>
              <ol className="list-decimal pl-5 space-y-1 font-sans text-[11px]">
                <li><strong>Volume Fisik:</strong> Telah terpasang {activeModalDocument.item.persentaseVolume}% ({activeModalDocument.item.volumeRealisasi}).</li>
                <li><strong>Spesifikasi Teknis:</strong> Telah memenuhi kriteria teknis ({activeModalDocument.item.spesifikasiKesesuaian}).</li>
                <li><strong>Mutu & Kelaikan:</strong> Hasil pengujian kelaikan dinyatakan <strong>{activeModalDocument.item.mutuKelaikan}</strong>.</li>
                <li><strong>Dokumentasi:</strong> As-Built Drawing dan sertifikasi mutu terlampir lengkap ({activeModalDocument.item.dokumentasi.drawingRef}).</li>
              </ol>

              <p className="text-justify font-sans text-[11px]">
                {activeModalDocument.type === 'BAP'
                  ? 'Berdasarkan hasil pemeriksaan tersebut di atas, pekerjaan dinyatakan telah memenuhi syarat untuk diproses pembayaran termin sesuai ketentuan perjanjian kontrak.'
                  : 'Demikian Berita Acara ini dibuat dalam rangkap secukupnya untuk dipergunakan sebagaimana mestinya.'}
              </p>

              {/* Signatures */}
              <div className="grid grid-cols-2 pt-6 font-sans text-center text-[11px]">
                <div>
                  <p className="text-slate-600">Ketua Panitia PPHP,</p>
                  <div className="h-14 flex items-center justify-center font-serif italic text-blue-700 font-bold">
                    [Tanda Tangan Elektronik PPHP]
                  </div>
                  <p className="font-bold underline">Ir. Agus Wijanarko, S.T., IPU</p>
                  <p className="text-[10px] text-slate-500">NIP. 19790512 200501 1 004</p>
                </div>
                <div>
                  <p className="text-slate-600">Menyetujui & Mengesahkan,<br/><strong>Supervisor Pengawas Teknik</strong></p>
                  <div className="h-14 flex items-center justify-center font-serif italic text-emerald-700 font-bold">
                    [Tanda Tangan Elektronik Supervisor]
                  </div>
                  <p className="font-bold underline">Ir. Bambang Trihadi, M.T.</p>
                  <p className="text-[10px] text-slate-500">NIP. 19780415 200312 1 002</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setActiveModalDocument(null)}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-xs font-semibold cursor-pointer"
              >
                Tutup
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Cetak / Ekspor PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: INPUT EVALUASI BARU */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-2xl max-w-xl w-full border border-slate-700 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-emerald-400" />
                Input Evaluasi Hasil Pekerjaan Barang & Jasa
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white text-xl font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveNewEvaluasi} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Nama Paket Pengadaan *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Pengadaan 5 Unit Panel ATS Generator Emergency"
                  value={formData.namaPaket}
                  onChange={(e) => setFormData({ ...formData, namaPaket: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 text-white rounded-xl border border-slate-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Nomor Kontrak</label>
                  <input
                    type="text"
                    value={formData.nomorKontrak}
                    onChange={(e) => setFormData({ ...formData, nomorKontrak: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 text-white rounded-xl border border-slate-700 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Penyedia Jasa</label>
                  <input
                    type="text"
                    placeholder="PT Rekayasa Utama"
                    value={formData.penyedia}
                    onChange={(e) => setFormData({ ...formData, penyedia: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 text-white rounded-xl border border-slate-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Nilai Kontrak (Rp)</label>
                  <input
                    type="number"
                    value={formData.nilaiKontrak}
                    onChange={(e) => setFormData({ ...formData, nilaiKontrak: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-900 text-white rounded-xl border border-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Realisasi Volume (%)</label>
                  <input
                    type="number"
                    value={formData.persentaseVolume}
                    onChange={(e) => setFormData({ ...formData, persentaseVolume: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-900 text-white rounded-xl border border-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Mutu Kelaikan</label>
                  <select
                    value={formData.mutuKelaikan}
                    onChange={(e) => setFormData({ ...formData, mutuKelaikan: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-900 text-white rounded-xl border border-slate-700"
                  >
                    <option value="Layak">Layak</option>
                    <option value="Layak dengan Catatan">Layak dengan Catatan</option>
                    <option value="Tidak Layak">Tidak Layak</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Catatan Evaluasi Lapangan</label>
                <textarea
                  rows={2}
                  placeholder="Catatan hasil pengujian fungsi, kelengkapan suku cadang, dan dokumen manual..."
                  value={formData.catatanEvaluasi}
                  onChange={(e) => setFormData({ ...formData, catatanEvaluasi: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 text-white rounded-xl border border-slate-700"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition cursor-pointer"
                >
                  Simpan Evaluasi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
