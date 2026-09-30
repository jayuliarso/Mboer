import React, { useState } from 'react';
import {
  Users,
  Plus,
  Search,
  FileCheck,
  Award,
  Phone,
  Calendar,
  CheckCircle,
  Briefcase,
  Printer,
  Clock,
  ShieldCheck
} from 'lucide-react';
import { PersonelPPHP, SuratTugasPPHP, UserRole } from '../types';
import { formatDateIndo, getStatusBadge } from '../utils/helpers';

interface PengelolaanPPHPProps {
  pphpList: PersonelPPHP[];
  suratTugasList: SuratTugasPPHP[];
  onAddSuratTugas: (newST: SuratTugasPPHP) => void;
  onUpdatePPHPStatus: (id: string, newStatus: PersonelPPHP['statusKetersediaan']) => void;
  currentRole: UserRole;
}

export const PengelolaanPPHP: React.FC<PengelolaanPPHPProps> = ({
  pphpList,
  suratTugasList,
  onAddSuratTugas,
  onUpdatePPHPStatus,
  currentRole,
}) => {
  const [activeTab, setActiveTab] = useState<'personel' | 'surat-tugas'>('personel');
  const [searchTerm, setSearchTerm] = useState('');
  const [showSTModal, setShowSTModal] = useState(false);
  const [selectedSTPreview, setSelectedSTPreview] = useState<SuratTugasPPHP | null>(null);

  // Form for Surat Tugas
  const [stFormData, setStFormData] = useState({
    namaPekerjaan: '',
    lokasi: 'Tangerang',
    personelIds: [] as string[],
    tanggalMulai: new Date().toISOString().split('T')[0],
    tanggalSelesai: '2026-04-10',
  });

  const handleTogglePersonelSelection = (id: string) => {
    if (stFormData.personelIds.includes(id)) {
      setStFormData({
        ...stFormData,
        personelIds: stFormData.personelIds.filter((p) => p !== id),
      });
    } else {
      setStFormData({
        ...stFormData,
        personelIds: [...stFormData.personelIds, id],
      });
    }
  };

  const handleCreateSuratTugas = (e: React.FormEvent) => {
    e.preventDefault();
    if (!stFormData.namaPekerjaan || stFormData.personelIds.length === 0) {
      alert('Pilih nama pekerjaan dan minimal 1 orang personel PPHP.');
      return;
    }

    const newST: SuratTugasPPHP = {
      id: `ST-${Date.now().toString().slice(-4)}`,
      nomorST: `ST-PPHP/2026/03/${Math.floor(100 + Math.random() * 900)}`,
      tanggalST: new Date().toISOString().split('T')[0],
      namaPekerjaan: stFormData.namaPekerjaan,
      lokasi: stFormData.lokasi,
      personelIds: stFormData.personelIds,
      tanggalMulai: stFormData.tanggalMulai,
      tanggalSelesai: stFormData.tanggalSelesai,
      ditandatanganiOleh: 'Ir. Bambang Trihadi, M.T. (Supervisor Pengawas Teknik)',
      status: 'Diterbitkan',
    };

    onAddSuratTugas(newST);
    setShowSTModal(false);
    setStFormData({
      namaPekerjaan: '',
      lokasi: 'Tangerang',
      personelIds: [],
      tanggalMulai: new Date().toISOString().split('T')[0],
      tanggalSelesai: '2026-04-10',
    });
  };

  const filteredPersonel = pphpList.filter(
    (p) =>
      p.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.nip.includes(searchTerm) ||
      p.jabatan.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-400" />
            Pengelolaan Personel PPHP & Penugasan Pemeriksa
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Database sertifikasi personel, pemerataan beban kerja (workload balancing), dan generator Surat Tugas (ST) otomatis.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Sub-tab toggle */}
          <div className="bg-slate-800 p-1 rounded-xl border border-slate-700 flex items-center gap-1 text-xs">
            <button
              onClick={() => setActiveTab('personel')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                activeTab === 'personel'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Database Personel ({pphpList.length})
            </button>
            <button
              onClick={() => setActiveTab('surat-tugas')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                activeTab === 'surat-tugas'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Surat Tugas ({suratTugasList.length})
            </button>
          </div>

          <button
            onClick={() => setShowSTModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-950/40 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Terbitkan Surat Tugas</span>
          </button>
        </div>
      </div>

      {/* SEARCH AND KPI BAR */}
      <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700/80 shadow-md">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative sm:col-span-2">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama personel, NIP, atau spesialisasi sertifikasi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-900 text-xs text-white rounded-xl border border-slate-700 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="flex items-center justify-around bg-slate-900/60 p-2 rounded-xl border border-slate-700/50 text-xs">
            <div>
              <span className="text-slate-400 text-[10px]">Siap Tugas:</span>
              <div className="text-emerald-400 font-bold">
                {pphpList.filter((p) => p.statusKetersediaan === 'Siap Tugas').length} Orang
              </div>
            </div>
            <div>
              <span className="text-slate-400 text-[10px]">Bertugas:</span>
              <div className="text-blue-400 font-bold">
                {pphpList.filter((p) => p.statusKetersediaan === 'Sedang Bertugas').length} Orang
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TAB 1: DATABASE PERSONEL */}
      {activeTab === 'personel' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredPersonel.map((p) => (
            <div
              key={p.id}
              className="p-5 bg-slate-800/80 rounded-2xl border border-slate-700/80 hover:border-slate-600 transition shadow-lg space-y-3.5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{p.nama}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${getStatusBadge(p.statusKetersediaan)}`}>
                      {p.statusKetersediaan}
                    </span>
                  </div>
                  <p className="text-[11px] font-mono text-cyan-300">NIP: {p.nip}</p>
                  <p className="text-xs text-slate-300 font-medium">{p.jabatan}</p>
                  <p className="text-[11px] text-slate-400">{p.unitAsal}</p>
                </div>

                {/* Workload Index */}
                <div className="text-right bg-slate-900/60 p-2.5 rounded-xl border border-slate-700/50">
                  <span className="text-[10px] text-slate-400 block font-semibold">Beban Kerja:</span>
                  <span className={`text-base font-black ${p.bebanKerjaAktif >= 3 ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {p.bebanKerjaAktif} Tugas
                  </span>
                  <span className="text-[10px] text-slate-500 block">{p.totalPenugasanSelesai} Selesai</span>
                </div>
              </div>

              {/* Sertifikasi Tags */}
              <div className="space-y-1.5 pt-2 border-t border-slate-700/60 text-xs">
                <span className="text-[11px] text-slate-400 font-semibold flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-yellow-300" />
                  Sertifikasi Keahlian:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {p.sertifikasi.map((s, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-purple-950/60 text-purple-300 border border-purple-800/60 text-[10px] font-medium"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Contact & Status Change */}
              <div className="flex items-center justify-between text-xs pt-1">
                <span className="flex items-center gap-1 text-slate-400 text-[11px]">
                  <Phone className="w-3 h-3 text-cyan-400" />
                  {p.kontak}
                </span>

                {currentRole === 'supervisor' && (
                  <select
                    value={p.statusKetersediaan}
                    onChange={(e) => onUpdatePPHPStatus(p.id, e.target.value as any)}
                    className="px-2 py-1 bg-slate-900 text-slate-200 rounded-lg border border-slate-700 text-[10px] font-semibold cursor-pointer"
                  >
                    <option value="Siap Tugas">Set: Siap Tugas</option>
                    <option value="Sedang Bertugas">Set: Sedang Bertugas</option>
                    <option value="Cuti / Non-aktif">Set: Cuti</option>
                  </select>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: SURAT TUGAS RESMI */}
      {activeTab === 'surat-tugas' && (
        <div className="space-y-4">
          {suratTugasList.map((st) => {
            const assignedPersonel = pphpList.filter((p) => st.personelIds.includes(p.id));
            return (
              <div
                key={st.id}
                className="p-5 bg-slate-800/80 rounded-2xl border border-slate-700/80 hover:border-slate-600 transition shadow-lg space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-cyan-300">{st.nomorST}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${getStatusBadge(st.status)}`}>
                        {st.status}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-white">{st.namaPekerjaan}</h3>
                    <p className="text-xs text-slate-400">
                      Lokasi: {st.lokasi} • Masa Tugas: {formatDateIndo(st.tanggalMulai)} s.d {formatDateIndo(st.tanggalSelesai)}
                    </p>
                  </div>

                  <button
                    onClick={() => setSelectedSTPreview(st)}
                    className="px-3.5 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Cetak Surat Tugas</span>
                  </button>
                </div>

                <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-700/60 text-xs">
                  <span className="text-slate-400 block font-semibold mb-1">Personel Pemeriksa Ditugaskan:</span>
                  <div className="flex flex-wrap gap-2">
                    {assignedPersonel.map((p) => (
                      <span key={p.id} className="px-2.5 py-1 rounded bg-slate-800 text-slate-200 border border-slate-700 text-[11px] font-semibold">
                        {p.nama} ({p.jabatan})
                      </span>
                    ))}
                  </div>
                </div>

                <div className="text-[11px] text-slate-400">
                  Ditetapkan & Ditandatangani Oleh: <strong className="text-cyan-300">{st.ditandatanganiOleh}</strong>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL PREVIEW SURAT TUGAS RESMI */}
      {selectedSTPreview && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-2xl max-w-2xl w-full border border-slate-700 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Printer className="w-4 h-4 text-cyan-400" />
                Format Resmi Surat Tugas PPHP
              </h3>
              <button
                onClick={() => setSelectedSTPreview(null)}
                className="text-slate-400 hover:text-white text-xl font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="bg-white text-slate-900 p-8 rounded-xl font-serif text-xs leading-relaxed space-y-4 shadow">
              <div className="text-center border-b-2 border-black pb-2">
                <h4 className="font-black text-sm uppercase">SURAT TUGAS PEMERIKSAAN HASIL PEKERJAAN</h4>
                <p className="text-[11px] font-sans font-bold text-slate-700 mt-0.5">
                  Nomor: {selectedSTPreview.nomorST}
                </p>
              </div>

              <p className="text-justify indent-6">
                Yang bertanda tangan di bawah ini, <strong>Supervisor Pengawas Teknik Satuan Pengawasan Intern</strong>, dengan ini menugaskan kepada personel Panitia/Pejabat Peneliti Hasil Pekerjaan (PPHP):
              </p>

              <div className="space-y-1.5 font-sans pl-6">
                {pphpList
                  .filter((p) => selectedSTPreview.personelIds.includes(p.id))
                  .map((p, idx) => (
                    <div key={p.id}>
                      <strong>{idx + 1}. {p.nama}</strong> (NIP: {p.nip}) - {p.jabatan}
                    </div>
                  ))}
              </div>

              <p className="text-justify font-sans text-[11px]">
                Untuk melaksanakan pemeriksaan fisik kelaikan, volume, dan spesifikasi teknis atas paket pekerjaan: <strong>{selectedSTPreview.namaPekerjaan}</strong> yang berlokasi di <strong>{selectedSTPreview.lokasi}</strong>, terhitung sejak <strong>{formatDateIndo(selectedSTPreview.tanggalMulai)}</strong> sampai dengan <strong>{formatDateIndo(selectedSTPreview.tanggalSelesai)}</strong>.
              </p>

              <div className="pt-8 text-right font-sans text-[11px]">
                <p className="text-slate-600">Ditetapkan di Jakarta, {formatDateIndo(selectedSTPreview.tanggalST)}</p>
                <p className="font-bold mt-1">Supervisor Pengawas Teknik SPI,</p>
                <div className="h-12 flex items-center justify-end font-serif italic text-emerald-800 font-bold pr-6">
                  [Tanda Tangan Elektronik]
                </div>
                <p className="font-bold underline">Ir. Bambang Trihadi, M.T.</p>
                <p className="text-[10px] text-slate-500">NIP. 19780415 200312 1 002</p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedSTPreview(null)}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-xs font-semibold cursor-pointer"
              >
                Tutup
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Cetak Surat Tugas</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: TERBITKAN SURAT TUGAS BARU */}
      {showSTModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-2xl max-w-xl w-full border border-slate-700 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-purple-400" />
                Terbitkan Surat Tugas Pemeriksaan PPHP Baru
              </h3>
              <button
                onClick={() => setShowSTModal(false)}
                className="text-slate-400 hover:text-white text-xl font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSuratTugas} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Nama Paket Pekerjaan Pengadaan *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Pemeriksaan Fisik Pemasangan Trafo 60 MVA Gardu Induk"
                  value={stFormData.namaPekerjaan}
                  onChange={(e) => setStFormData({ ...stFormData, namaPekerjaan: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 text-white rounded-xl border border-slate-700"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Lokasi Pemeriksaan</label>
                <input
                  type="text"
                  value={stFormData.lokasi}
                  onChange={(e) => setStFormData({ ...stFormData, lokasi: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 text-white rounded-xl border border-slate-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Tanggal Mulai Tugas</label>
                  <input
                    type="date"
                    value={stFormData.tanggalMulai}
                    onChange={(e) => setStFormData({ ...stFormData, tanggalMulai: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 text-white rounded-xl border border-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Tanggal Selesai Tugas</label>
                  <input
                    type="date"
                    value={stFormData.tanggalSelesai}
                    onChange={(e) => setStFormData({ ...stFormData, tanggalSelesai: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 text-white rounded-xl border border-slate-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Pilih Personel PPHP yang Ditugaskan (Centang Minimal 1):
                </label>
                <div className="space-y-2 max-h-48 overflow-y-auto p-2 bg-slate-900/60 rounded-xl border border-slate-700">
                  {pphpList.map((p) => {
                    const isChecked = stFormData.personelIds.includes(p.id);
                    return (
                      <label
                        key={p.id}
                        className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition ${
                          isChecked ? 'bg-purple-950/50 border border-purple-600/50' : 'hover:bg-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleTogglePersonelSelection(p.id)}
                            className="rounded text-purple-600 focus:ring-0 cursor-pointer"
                          />
                          <div>
                            <div className="font-semibold text-white">{p.nama}</div>
                            <div className="text-[10px] text-slate-400">{p.jabatan}</div>
                          </div>
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${getStatusBadge(p.statusKetersediaan)}`}>
                          {p.statusKetersediaan} ({p.bebanKerjaAktif} Beban)
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSTModal(false)}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold transition cursor-pointer"
                >
                  Terbitkan Surat Tugas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
