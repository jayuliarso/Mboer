import React, { useState } from 'react';
import {
  Calendar,
  Layers,
  Plus,
  Search,
  Filter,
  Users,
  CheckCircle,
  Clock,
  FileText,
  FileSpreadsheet,
  Building,
  MapPin,
  Sparkles,
  Eye,
  Check
} from 'lucide-react';
import { AuditProgram, ObjekPengawasan, ProgramType, ProgramStatus, UserRole } from '../types';
import { formatRupiah, formatDateIndo, getStatusBadge } from '../utils/helpers';

interface ProgramPKPTProps {
  programs: AuditProgram[];
  onAddProgram: (newProg: AuditProgram) => void;
  onUpdateStatus: (id: string, newStatus: ProgramStatus) => void;
  onGenerateLHP: (prog: AuditProgram) => void;
  currentRole: UserRole;
}

export const ProgramPKPT: React.FC<ProgramPKPTProps> = ({
  programs,
  onAddProgram,
  onUpdateStatus,
  onGenerateLHP,
  currentRole,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'All' | ProgramType>('All');
  const [filterObjek, setFilterObjek] = useState<'All' | ObjekPengawasan>('All');
  const [filterStatus, setFilterStatus] = useState<'All' | ProgramStatus>('All');
  const [viewMode, setViewMode] = useState<'list' | 'calendar' | 'annual-plan'>('list');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedProgramDetail, setSelectedProgramDetail] = useState<AuditProgram | null>(null);

  // Form State for new program
  const [formData, setFormData] = useState({
    judul: '',
    tipe: 'PKPT' as ProgramType,
    objek: 'Konstruksi' as ObjekPengawasan,
    unitKerja: '',
    lokasi: '',
    supervisor: 'Ir. Bambang Trihadi, M.T. (Supervisor Pengawas Teknik)',
    ketuaTim: '',
    anggotaTim: '',
    anggaran: 150000000,
    jadwalMulai: '2026-04-01',
    jadwalSelesai: '2026-05-15',
    uraianTugas: '',
  });

  const filtered = programs.filter((p) => {
    const matchSearch =
      p.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.nomor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.unitKerja.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = filterType === 'All' || p.tipe === filterType;
    const matchObjek = filterObjek === 'All' || p.objek === filterObjek;
    const matchStatus = filterStatus === 'All' || p.status === filterStatus;
    return matchSearch && matchType && matchObjek && matchStatus;
  });

  const handleSubmitNewProgram = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.judul || !formData.unitKerja) return;

    const newProg: AuditProgram = {
      id: `PRG-${Date.now().toString().slice(-4)}`,
      nomor: `${formData.tipe}/2026/04/${Math.floor(100 + Math.random() * 900)}`,
      tahun: 2026,
      tipe: formData.tipe,
      judul: formData.judul,
      objek: formData.objek,
      unitKerja: formData.unitKerja,
      lokasi: formData.lokasi || 'Kantor Pusat / Proyek',
      supervisor: formData.supervisor,
      ketuaTim: formData.ketuaTim || 'Auditor Staf SPI',
      anggotaTim: formData.anggotaTim ? formData.anggotaTim.split(',').map((s) => s.trim()) : ['Staf Teknik'],
      anggaran: Number(formData.anggaran),
      jadwalMulai: formData.jadwalMulai,
      jadwalSelesai: formData.jadwalSelesai,
      status: 'Draft',
      progressPercent: 0,
      jumlahTemuan: 0,
      uraianTugas: formData.uraianTugas || 'Pemeriksaan kelaikan teknis dan kepatuhan standar mutu.',
    };

    onAddProgram(newProg);
    setShowAddModal(false);
    setFormData({
      judul: '',
      tipe: 'PKPT',
      objek: 'Konstruksi',
      unitKerja: '',
      lokasi: '',
      supervisor: 'Ir. Bambang Trihadi, M.T. (Supervisor Pengawas Teknik)',
      ketuaTim: '',
      anggotaTim: '',
      anggaran: 150000000,
      jadwalMulai: '2026-04-01',
      jadwalSelesai: '2026-05-15',
      uraianTugas: '',
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Controls & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-400" />
            Program Kerja Pengawasan (PKPT & Non-PKPT)
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Perencanaan tahunan, penetapan tim pemeriksa, dan monitoring pelaksanaan audit teknis.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View mode toggle */}
          <div className="bg-slate-800 p-1 rounded-xl border border-slate-700 flex items-center gap-1 text-xs">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                viewMode === 'list' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-white'
              }`}
            >
              Daftar Program
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                viewMode === 'calendar' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-white'
              }`}
            >
              Kalender Pengawasan
            </button>
            <button
              onClick={() => setViewMode('annual-plan')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                viewMode === 'annual-plan' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-white'
              }`}
            >
              Cetak Rencana Tahunan
            </button>
          </div>

          {(currentRole === 'supervisor' || currentRole === 'admin_spi') && (
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-lg shadow-cyan-950/40 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Program</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700/80 shadow-md">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nomor, judul, atau unit kerja..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-900/80 text-xs text-white rounded-xl border border-slate-700 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 whitespace-nowrap">Tipe:</span>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="w-full px-3 py-2 bg-slate-900/80 text-xs text-white rounded-xl border border-slate-700 focus:outline-none"
            >
              <option value="All">Semua Tipe (PKPT & Non-PKPT)</option>
              <option value="PKPT">PKPT (Rutin Tahunan)</option>
              <option value="Non-PKPT">Non-PKPT (Khusus / Insidental)</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 whitespace-nowrap">Objek:</span>
            <select
              value={filterObjek}
              onChange={(e) => setFilterObjek(e.target.value as any)}
              className="w-full px-3 py-2 bg-slate-900/80 text-xs text-white rounded-xl border border-slate-700 focus:outline-none"
            >
              <option value="All">Semua Objek</option>
              <option value="Konstruksi">Konstruksi</option>
              <option value="Pengadaan">Pengadaan</option>
              <option value="Operasional">Operasional</option>
              <option value="Pemeliharaan">Pemeliharaan</option>
              <option value="Proyek">Proyek</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 whitespace-nowrap">Status:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="w-full px-3 py-2 bg-slate-900/80 text-xs text-white rounded-xl border border-slate-700 focus:outline-none"
            >
              <option value="All">Semua Status</option>
              <option value="Draft">Draft</option>
              <option value="Berjalan">Berjalan</option>
              <option value="Selesai">Selesai</option>
            </select>
          </div>
        </div>
      </div>

      {/* VIEW: LIST OF PROGRAMS */}
      {viewMode === 'list' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {filtered.map((prog) => (
              <div
                key={prog.id}
                className="p-5 bg-slate-800/80 rounded-2xl border border-slate-700/80 hover:border-slate-600 transition shadow-lg space-y-4"
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center flex-wrap gap-2">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                          prog.tipe === 'PKPT'
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                            : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                        }`}
                      >
                        {prog.tipe}
                      </span>
                      <span className="text-xs font-mono font-bold text-slate-400">{prog.nomor}</span>
                      <span className="text-xs px-2 py-0.5 rounded bg-slate-700/60 text-slate-300">
                        {prog.objek}
                      </span>
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${getStatusBadge(prog.status)}`}>
                        {prog.status}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white hover:text-cyan-300 transition">
                      {prog.judul}
                    </h3>

                    <div className="flex items-center flex-wrap gap-y-1 gap-x-4 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Building className="w-3.5 h-3.5 text-slate-500" />
                        {prog.unitKerja}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-500" />
                        {prog.lokasi}
                      </span>
                      <span className="flex items-center gap-1 text-slate-300">
                        <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                        {formatDateIndo(prog.jadwalMulai)} s.d {formatDateIndo(prog.jadwalSelesai)}
                      </span>
                    </div>
                  </div>

                  {/* Right side stats & buttons */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="text-left sm:text-right bg-slate-900/60 p-2.5 rounded-xl border border-slate-700/50">
                      <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Alokasi Anggaran</div>
                      <div className="text-sm font-black text-emerald-400">{formatRupiah(prog.anggaran)}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{prog.jumlahTemuan} Temuan Tercatat</div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setSelectedProgramDetail(prog)}
                        className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-xs font-semibold transition flex items-center gap-1 cursor-pointer"
                        title="Lihat Detail Program & Tim"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Detail</span>
                      </button>

                      <button
                        onClick={() => onGenerateLHP(prog)}
                        className="px-3 py-2 bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/40 rounded-xl text-xs font-semibold transition flex items-center gap-1 cursor-pointer"
                        title="Susun Laporan Hasil Pemeriksaan (LHP) Otomatis"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                        <span>Draf LHP</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Progress bar & Supervisor Control */}
                <div className="pt-2 border-t border-slate-700/60 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
                  <div className="flex-1 max-w-md">
                    <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                      <span>Progres Pelaksanaan Audit Lapangan</span>
                      <span className="font-bold text-white">{prog.progressPercent}%</span>
                    </div>
                    <div className="w-full bg-slate-700/60 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-cyan-500 h-full rounded-full" style={{ width: `${prog.progressPercent}%` }} />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-400">Tim:</span>
                    <span className="font-semibold text-slate-200">{prog.ketuaTim}</span>
                    <span className="text-slate-500">({prog.anggotaTim.length} Anggota)</span>

                    {/* Supervisor Quick Status Transition */}
                    {currentRole === 'supervisor' && (
                      <div className="ml-2 flex items-center gap-1">
                        {prog.status === 'Draft' && (
                          <button
                            onClick={() => onUpdateStatus(prog.id, 'Berjalan')}
                            className="px-2 py-1 bg-blue-600/30 hover:bg-blue-600 text-blue-200 border border-blue-500/40 rounded-lg text-[10px] font-bold transition cursor-pointer"
                          >
                            Tugaskan Tim (Mulai)
                          </button>
                        )}
                        {prog.status === 'Berjalan' && (
                          <button
                            onClick={() => onUpdateStatus(prog.id, 'Selesai')}
                            className="px-2 py-1 bg-emerald-600/30 hover:bg-emerald-600 text-emerald-200 border border-emerald-500/40 rounded-lg text-[10px] font-bold transition cursor-pointer"
                          >
                            Sahkan Selesai
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {filtered.length === 0 && (
              <div className="text-center py-12 bg-slate-800/40 rounded-2xl border border-slate-800 text-slate-400">
                <Layers className="w-10 h-10 mx-auto text-slate-600 mb-2" />
                <p className="font-semibold text-sm">Tidak ada program pengawasan yang cocok dengan filter.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW: KALENDER PENGAWASAN */}
      {viewMode === 'calendar' && (
        <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700/80 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-cyan-400" />
              Kalender Jadwal Pelaksanaan Audit Tahun 2026
            </h3>
            <span className="text-xs text-slate-400">Periode Triwulan I & II</span>
          </div>

          <div className="space-y-3">
            {['Januari 2026', 'Februari 2026', 'Maret 2026', 'April 2026', 'Mei 2026'].map((month, idx) => {
              const monthPrograms = programs.filter((p) => {
                const startM = new Date(p.jadwalMulai).getMonth();
                return startM === idx;
              });

              return (
                <div key={month} className="p-4 bg-slate-900/60 rounded-xl border border-slate-700/60 space-y-2">
                  <div className="text-xs font-bold text-cyan-300 uppercase tracking-wider flex items-center justify-between">
                    <span>{month}</span>
                    <span className="text-[11px] text-slate-400">{monthPrograms.length} Audit Dimulai</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                    {monthPrograms.map((p) => (
                      <div key={p.id} className="p-3 bg-slate-800/80 rounded-lg border border-slate-700 flex items-start justify-between gap-2">
                        <div>
                          <div className="text-xs font-bold text-white line-clamp-1">{p.judul}</div>
                          <div className="text-[11px] text-slate-400">
                            {formatDateIndo(p.jadwalMulai)} - {formatDateIndo(p.jadwalSelesai)}
                          </div>
                          <div className="text-[10px] text-cyan-400 font-semibold mt-1">Tim: {p.ketuaTim}</div>
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${getStatusBadge(p.status)}`}>
                          {p.status}
                        </span>
                      </div>
                    ))}
                    {monthPrograms.length === 0 && (
                      <div className="text-xs text-slate-500 italic py-2">Tidak ada jadwal pemeriksaan baru pada bulan ini.</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW: RENCANA PENGAWASAN TAHUNAN (PRINT / EXPORT READY) */}
      {viewMode === 'annual-plan' && (
        <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700/80 shadow-lg space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-700">
            <div>
              <span className="text-[11px] uppercase tracking-wider font-bold text-cyan-400">Dokumen Resmi SPI</span>
              <h3 className="text-lg font-bold text-white">Rencana Pengawasan Tahunan (PKPT) 2026</h3>
              <p className="text-xs text-slate-400">Format standar lampiran Surat Keputusan Direksi</p>
            </div>
            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            >
              <FileText className="w-4 h-4 text-cyan-400" />
              <span>Cetak / Simpan PDF</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-900/80 text-slate-300 font-bold border-b border-slate-700">
                  <th className="p-3">No</th>
                  <th className="p-3">Nomor Registrasi</th>
                  <th className="p-3">Objek / Paket Pemeriksaan</th>
                  <th className="p-3">Unit Kerja</th>
                  <th className="p-3">Jadwal Pelaksanaan</th>
                  <th className="p-3">Anggaran (Rp)</th>
                  <th className="p-3">Penanggung Jawab</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {programs.map((p, idx) => (
                  <tr key={p.id} className="hover:bg-slate-750">
                    <td className="p-3 font-semibold">{idx + 1}</td>
                    <td className="p-3 font-mono text-[11px] text-cyan-300">{p.nomor}</td>
                    <td className="p-3 font-semibold text-white max-w-xs">{p.judul}</td>
                    <td className="p-3">{p.unitKerja}</td>
                    <td className="p-3 whitespace-nowrap">{formatDateIndo(p.jadwalMulai)} - {formatDateIndo(p.jadwalSelesai)}</td>
                    <td className="p-3 font-mono text-emerald-400">{formatRupiah(p.anggaran)}</td>
                    <td className="p-3">{p.supervisor}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${getStatusBadge(p.status)}`}>
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: DETAIL PROGRAM */}
      {selectedProgramDetail && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-2xl max-w-2xl w-full border border-slate-700 shadow-2xl overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700">
              <div>
                <span className="text-xs text-cyan-400 font-bold">{selectedProgramDetail.nomor}</span>
                <h3 className="text-lg font-bold text-white">{selectedProgramDetail.judul}</h3>
              </div>
              <button
                onClick={() => setSelectedProgramDetail(null)}
                className="text-slate-400 hover:text-white text-xl font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400">Unit Kerja Objek:</span>
                <p className="font-semibold text-white mt-0.5">{selectedProgramDetail.unitKerja}</p>
              </div>
              <div>
                <span className="text-slate-400">Lokasi:</span>
                <p className="font-semibold text-white mt-0.5">{selectedProgramDetail.lokasi}</p>
              </div>
              <div>
                <span className="text-slate-400">Supervisor Pengawas:</span>
                <p className="font-semibold text-cyan-300 mt-0.5">{selectedProgramDetail.supervisor}</p>
              </div>
              <div>
                <span className="text-slate-400">Ketua Tim Pemeriksa:</span>
                <p className="font-semibold text-white mt-0.5">{selectedProgramDetail.ketuaTim}</p>
              </div>
              <div>
                <span className="text-slate-400">Anggota Tim:</span>
                <p className="font-semibold text-slate-300 mt-0.5">{selectedProgramDetail.anggotaTim.join(', ')}</p>
              </div>
              <div>
                <span className="text-slate-400">Anggaran Audit:</span>
                <p className="font-bold text-emerald-400 mt-0.5">{formatRupiah(selectedProgramDetail.anggaran)}</p>
              </div>
            </div>

            <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-700/60 text-xs">
              <span className="text-slate-400 font-semibold block mb-1">Uraian Ruang Lingkup & Kriteria Pemeriksaan:</span>
              <p className="text-slate-200 leading-relaxed">{selectedProgramDetail.uraianTugas}</p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedProgramDetail(null)}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-xs font-semibold cursor-pointer"
              >
                Tutup
              </button>
              <button
                onClick={() => {
                  const p = selectedProgramDetail;
                  setSelectedProgramDetail(null);
                  onGenerateLHP(p);
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                <span>Susun Draf LHP</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: TAMBAH PROGRAM PKPT / NON-PKPT */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-2xl max-w-xl w-full border border-slate-700 shadow-2xl overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-cyan-400" />
                Tambah Program Kerja Pengawasan Baru
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white text-xl font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitNewProgram} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Judul Kegiatan Pengawasan *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Audit Kelaikan Struktur Gedung Laboratorium Terpadu"
                  value={formData.judul}
                  onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 text-white rounded-xl border border-slate-700 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Tipe Pengawasan</label>
                  <select
                    value={formData.tipe}
                    onChange={(e) => setFormData({ ...formData, tipe: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-900 text-white rounded-xl border border-slate-700"
                  >
                    <option value="PKPT">PKPT (Program Tahunan)</option>
                    <option value="Non-PKPT">Non-PKPT (Khusus / Investigasi)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Objek Pengawasan</label>
                  <select
                    value={formData.objek}
                    onChange={(e) => setFormData({ ...formData, objek: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-900 text-white rounded-xl border border-slate-700"
                  >
                    <option value="Konstruksi">Konstruksi</option>
                    <option value="Pengadaan">Pengadaan Barang/Jasa</option>
                    <option value="Operasional">Operasional</option>
                    <option value="Pemeliharaan">Pemeliharaan</option>
                    <option value="Proyek">Proyek</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Unit Kerja Objek *</label>
                  <input
                    type="text"
                    required
                    placeholder="Divisi / Balai / PPK"
                    value={formData.unitKerja}
                    onChange={(e) => setFormData({ ...formData, unitKerja: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 text-white rounded-xl border border-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Lokasi Pemeriksaan</label>
                  <input
                    type="text"
                    placeholder="Kota / Wilayah Proyek"
                    value={formData.lokasi}
                    onChange={(e) => setFormData({ ...formData, lokasi: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 text-white rounded-xl border border-slate-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Ketua Tim Pemeriksa</label>
                  <input
                    type="text"
                    placeholder="Nama Auditor / Staf"
                    value={formData.ketuaTim}
                    onChange={(e) => setFormData({ ...formData, ketuaTim: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 text-white rounded-xl border border-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Anggota Tim (Pisahkan Koma)</label>
                  <input
                    type="text"
                    placeholder="Staf A, Staf B"
                    value={formData.anggotaTim}
                    onChange={(e) => setFormData({ ...formData, anggotaTim: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 text-white rounded-xl border border-slate-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Jadwal Mulai</label>
                  <input
                    type="date"
                    value={formData.jadwalMulai}
                    onChange={(e) => setFormData({ ...formData, jadwalMulai: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 text-white rounded-xl border border-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Jadwal Selesai</label>
                  <input
                    type="date"
                    value={formData.jadwalSelesai}
                    onChange={(e) => setFormData({ ...formData, jadwalSelesai: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 text-white rounded-xl border border-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Anggaran (Rp)</label>
                  <input
                    type="number"
                    value={formData.anggaran}
                    onChange={(e) => setFormData({ ...formData, anggaran: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-900 text-white rounded-xl border border-slate-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Uraian Ruang Lingkup Audit</label>
                <textarea
                  rows={2}
                  placeholder="Uraikan fokus pengujian mutu atau sasaran pemeriksaan..."
                  value={formData.uraianTugas}
                  onChange={(e) => setFormData({ ...formData, uraianTugas: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 text-white rounded-xl border border-slate-700 focus:outline-none"
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
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-bold transition cursor-pointer"
                >
                  Simpan Program
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
