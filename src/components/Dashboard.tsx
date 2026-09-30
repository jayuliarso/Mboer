import React, { useState } from 'react';
import {
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ShieldAlert,
  Award,
  Users,
  Building2,
  Calendar,
  ArrowRight,
  FileCheck,
  Activity,
  Layers,
  Sparkles,
  PieChart,
  BarChart3
} from 'lucide-react';
import {
  AuditProgram,
  Temuan,
  RiskItem,
  QAInspection,
  PersonelPPHP,
  EvaluasiBarangJasa,
  UserRole
} from '../types';
import { formatRupiah, getRiskColor, getStatusBadge } from '../utils/helpers';

interface DashboardProps {
  programs: AuditProgram[];
  temuanList: Temuan[];
  risks: RiskItem[];
  qaList: QAInspection[];
  pphpList: PersonelPPHP[];
  evaluasiList: EvaluasiBarangJasa[];
  onNavigateTab: (tabId: string) => void;
  currentRole: UserRole;
  onOpenAiAssistant: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  programs,
  temuanList,
  risks,
  qaList,
  pphpList,
  evaluasiList,
  onNavigateTab,
  currentRole,
  onOpenAiAssistant,
}) => {
  const [subDashboardView, setSubDashboardView] = useState<
    'eksekutif' | 'pengawasan' | 'temuan' | 'risiko' | 'qa' | 'pphp' | 'tindak-lanjut' | 'unit-kerja'
  >('eksekutif');

  // Calculations & KPIs
  const totalPKPT = programs.filter((p) => p.tipe === 'PKPT').length;
  const totalNonPKPT = programs.filter((p) => p.tipe === 'Non-PKPT').length;
  const runningPrograms = programs.filter((p) => p.status === 'Berjalan').length;
  const finishedPrograms = programs.filter((p) => p.status === 'Selesai').length;

  const allRekomendasi = temuanList.flatMap((t) => t.rekomendasiList);
  const totalRekomendasi = allRekomendasi.length;
  const closedRekomendasi = allRekomendasi.filter((r) => r.status === 'Closed').length;
  const verifikasiRekomendasi = allRekomendasi.filter((r) => r.status === 'Verifikasi').length;
  const openOrProgress = allRekomendasi.filter((r) => r.status === 'Open' || r.status === 'Progress').length;
  const percentTindakLanjut = totalRekomendasi > 0 ? Math.round((closedRekomendasi / totalRekomendasi) * 100) : 0;

  const highRisksCount = risks.filter((r) => r.levelRisiko === 'Tinggi' || r.levelRisiko === 'Ekstrem').length;
  const avgRiskScore = (risks.reduce((acc, curr) => acc + curr.skorInherent, 0) / (risks.length || 1)).toFixed(1);

  // SLA calculation approximation
  const avgSlaDays = 14;

  // Temuan by Category
  const temuanByCat: Record<string, number> = {
    Administratif: 0,
    Teknis: 0,
    Mutu: 0,
    Risiko: 0,
    Kepatuhan: 0,
  };
  temuanList.forEach((t) => {
    if (temuanByCat[t.kategori] !== undefined) {
      temuanByCat[t.kategori]++;
    }
  });

  // PPHP Availability
  const readyPphpCount = pphpList.filter((p) => p.statusKetersediaan === 'Siap Tugas').length;

  const subDashboardOptions = [
    { id: 'eksekutif', label: '1. Ringkasan Eksekutif & Direksi', icon: TrendingUp },
    { id: 'pengawasan', label: '2. Pengawasan (PKPT/Non-PKPT)', icon: Layers },
    { id: 'temuan', label: '3. Temuan & Rekomendasi', icon: AlertTriangle },
    { id: 'tindak-lanjut', label: '4. Tindak Lanjut & SLA', icon: CheckCircle2 },
    { id: 'risiko', label: '5. Manajemen Risiko (5x5)', icon: ShieldAlert },
    { id: 'qa', label: '6. Quality Assurance (QA)', icon: Award },
    { id: 'pphp', label: '7. Kinerja PPHP', icon: Users },
    { id: 'unit-kerja', label: '8. Kinerja Unit Kerja', icon: Building2 },
  ];

  return (
    <div className="space-y-6">
      {/* Top Welcome & Sub-Dashboard Switcher */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 p-5 rounded-2xl border border-slate-700/80 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                Pusat Komando Pengawasan Teknik
              </span>
              <span className="text-xs text-slate-400">
                Siklus Terintegrasi: Rencana → Audit → Temuan → Tindak Lanjut
              </span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white">
              Executive Technical Oversight Dashboard
            </h1>
            <p className="text-sm text-slate-300 mt-0.5">
              Pemantauan real-time kegiatan pengawasan internal SPI, kelaikan mutu teknis, kepatuhan PBJ, dan tata kelola risiko.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onOpenAiAssistant}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-indigo-950/40 border border-indigo-400/30 transition cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span>AI Analisa & Draf LHP</span>
            </button>
          </div>
        </div>

        {/* 8 Sub-dashboards navigation buttons */}
        <div className="mt-5 pt-4 border-t border-slate-700/60">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            PILIH SUDUT PANDANG DASHBOARD:
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-1.5">
            {subDashboardOptions.map((opt) => {
              const Icon = opt.icon;
              const isSelected = subDashboardView === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => setSubDashboardView(opt.id as any)}
                  className={`p-2 rounded-xl text-left transition flex flex-col gap-1 cursor-pointer border ${
                    isSelected
                      ? 'bg-cyan-500/20 text-cyan-200 border-cyan-400/50 shadow-md shadow-cyan-950/40'
                      : 'bg-slate-800/60 text-slate-400 border-slate-700/50 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span className="text-[11px] font-semibold line-clamp-1 leading-snug">
                    {opt.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* TOP KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Tindak Lanjut Selesai */}
        <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700/80 hover:border-slate-600 transition shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Persentase Tindak Lanjut</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{percentTindakLanjut}%</span>
            <span className="text-xs text-emerald-400 font-semibold">Tuntas (Closed)</span>
          </div>
          <div className="mt-2 w-full bg-slate-700 rounded-full h-2 overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-700"
              style={{ width: `${percentTindakLanjut}%` }}
            />
          </div>
          <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400">
            <span>{closedRekomendasi} Rekomendasi Selesai</span>
            <span>{verifikasiRekomendasi} Menunggu Verifikasi</span>
          </div>
        </div>

        {/* KPI 2: Temuan Aktif */}
        <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700/80 hover:border-slate-600 transition shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Temuan Aktif & Rekomendasi</span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 border border-amber-500/20">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-amber-400">{temuanList.length}</span>
            <span className="text-xs text-slate-400">Temuan di {programs.length} Objek Audit</span>
          </div>
          <p className="mt-2 text-xs text-slate-300">
            {openOrProgress} rekomendasi dalam tahap progres perbaikan unit kerja.
          </p>
          <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-cyan-400">
            <Clock className="w-3.5 h-3.5" />
            <span>Avg SLA Respon: {avgSlaDays} hari kalender</span>
          </div>
        </div>

        {/* KPI 3: Risiko Tinggi & Ekstrem */}
        <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700/80 hover:border-slate-600 transition shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Tingkat Risiko Rata-rata</span>
            <div className="w-9 h-9 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-400 border border-rose-500/20">
              <ShieldAlert className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-rose-400">{avgRiskScore}</span>
            <span className="text-xs text-slate-400">/ 25 (Matriks 5x5)</span>
          </div>
          <p className="mt-2 text-xs text-slate-300">
            {highRisksCount} item risiko berada di zona <strong className="text-rose-400">Tinggi / Ekstrem</strong>.
          </p>
          <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-slate-400">
            <Activity className="w-3.5 h-3.5 text-amber-400" />
            <span>Mitigasi On-Progress: {risks.filter((r) => r.statusMitigasi === 'On Progress').length}</span>
          </div>
        </div>

        {/* KPI 4: Kesiapan PPHP & Mutu QA */}
        <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700/80 hover:border-slate-600 transition shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Kesiapan Tim PPHP & QA</span>
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 border border-purple-500/20">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-purple-400">{readyPphpCount} / {pphpList.length}</span>
            <span className="text-xs text-slate-400">Personel Siap Tugas</span>
          </div>
          <p className="mt-2 text-xs text-slate-300">
            QA Inspeksi: {qaList.length} paket pekerjaan dengan rata-rata skor 88.2 (Baik).
          </p>
          <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-emerald-400">
            <FileCheck className="w-3.5 h-3.5" />
            <span>{evaluasiList.filter((e) => e.statusBA === 'Disetujui Supervisor').length} Berita Acara Disahkan</span>
          </div>
        </div>
      </div>

      {/* CONDITIONAL SUB-DASHBOARD VIEWS */}
      {subDashboardView === 'eksekutif' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Left: Program PKPT Progress & Quick Status */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700/80 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Layers className="w-4 h-4 text-cyan-400" />
                    Status Program Pengawasan (PKPT & Non-PKPT)
                  </h3>
                  <p className="text-xs text-slate-400">Tahun Anggaran 2026</p>
                </div>
                <button
                  onClick={() => onNavigateTab('pkpt')}
                  className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
                >
                  Buka Rencana Lengkap <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-3.5">
                {programs.slice(0, 4).map((prog) => (
                  <div
                    key={prog.id}
                    className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-700/60 hover:border-slate-600 transition"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                              prog.tipe === 'PKPT'
                                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                                : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                            }`}
                          >
                            {prog.tipe}
                          </span>
                          <span className="text-xs font-bold text-white">{prog.judul}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1">
                          {prog.unitKerja} • {prog.lokasi}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className={`text-[11px] font-semibold px-2 py-1 rounded ${getStatusBadge(prog.status)}`}>
                          {prog.status}
                        </span>
                        <div className="text-right min-w-[70px]">
                          <div className="text-xs font-bold text-white">{prog.progressPercent}%</div>
                          <div className="text-[10px] text-slate-400">Progress</div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-2.5 w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-cyan-500 h-full rounded-full"
                        style={{ width: `${prog.progressPercent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Action Matrix: 4 Pillars of ePTI */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                onClick={() => onNavigateTab('pemeriksaan')}
                className="p-4 bg-slate-800/80 hover:bg-slate-750 rounded-2xl border border-slate-700/80 transition cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center mb-3">
                  <Activity className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-white group-hover:text-blue-300 transition">
                  Pemeriksaan Digital & KKA
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  Pengisian checklist teknis digital lapangan dengan foto dokumentasi & verifikasi instan.
                </p>
              </div>

              <div
                onClick={() => onNavigateTab('evaluasi-bj')}
                className="p-4 bg-slate-800/80 hover:bg-slate-750 rounded-2xl border border-slate-700/80 transition cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
                  <FileCheck className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-white group-hover:text-emerald-300 transition">
                  Evaluasi PBJ & Berita Acara (Huruf G)
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  Pemeriksaan fisik barang/jasa, kelaikan volume/spesifikasi, dan cetak BAP otomatis.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Temuan Per Bidang & Aging Tracker */}
          <div className="space-y-6">
            {/* Category Breakdown */}
            <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700/80 shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-cyan-400" />
                  Jumlah Temuan Per Bidang
                </h3>
              </div>

              <div className="space-y-2.5">
                {Object.entries(temuanByCat).map(([cat, count]) => {
                  const percentage = temuanList.length > 0 ? Math.round((count / temuanList.length) * 100) : 0;
                  return (
                    <div key={cat} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-300 font-medium">{cat}</span>
                        <span className="text-slate-400 font-semibold">{count} temuan ({percentage}%)</span>
                      </div>
                      <div className="w-full bg-slate-700/60 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-indigo-500 h-full rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs text-slate-400">
                <span>Total Estimasi Temuan:</span>
                <span className="font-bold text-amber-400">
                  {formatRupiah(temuanList.reduce((acc, t) => acc + (t.estimasiKerugian || 0), 0))}
                </span>
              </div>
            </div>

            {/* Workflow Tindak Lanjut Quick Tracker */}
            <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700/80 shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  Siklus Rekomendasi Pas. 15c
                </h3>
              </div>

              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="p-2.5 bg-slate-900/60 rounded-xl border border-slate-700/50">
                  <div className="text-lg font-black text-amber-400">
                    {allRekomendasi.filter((r) => r.status === 'Open').length}
                  </div>
                  <div className="text-[10px] text-slate-400 font-medium">Open</div>
                </div>
                <div className="p-2.5 bg-slate-900/60 rounded-xl border border-slate-700/50">
                  <div className="text-lg font-black text-blue-400">
                    {allRekomendasi.filter((r) => r.status === 'Progress').length}
                  </div>
                  <div className="text-[10px] text-slate-400 font-medium">Progress</div>
                </div>
                <div className="p-2.5 bg-slate-900/60 rounded-xl border border-slate-700/50">
                  <div className="text-lg font-black text-purple-400">
                    {allRekomendasi.filter((r) => r.status === 'Verifikasi').length}
                  </div>
                  <div className="text-[10px] text-slate-400 font-medium">Verifikasi</div>
                </div>
                <div className="p-2.5 bg-slate-900/60 rounded-xl border border-slate-700/50">
                  <div className="text-lg font-black text-emerald-400">
                    {allRekomendasi.filter((r) => r.status === 'Closed').length}
                  </div>
                  <div className="text-[10px] text-slate-400 font-medium">Closed</div>
                </div>
              </div>

              <button
                onClick={() => onNavigateTab('tindak-lanjut')}
                className="mt-4 w-full py-2 bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 rounded-xl text-xs font-bold border border-cyan-500/30 transition flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>Kelola Tindak Lanjut & Verifikasi</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUB-DASHBOARD: PENGAWASAN */}
      {subDashboardView === 'pengawasan' && (
        <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700/80 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h3 className="text-lg font-bold text-white">Dashboard Program Kerja Pengawasan (PKPT & Non-PKPT)</h3>
              <p className="text-xs text-slate-400">Status perencanaan, pelaksanaan tim pengawas, dan serapan anggaran pengawasan</p>
            </div>
            <button
              onClick={() => onNavigateTab('pkpt')}
              className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition cursor-pointer"
            >
              + Buka Master PKPT
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-700/60">
              <span className="text-xs text-slate-400">Total Program Terjadwal</span>
              <div className="text-2xl font-black text-white mt-1">{programs.length} Paket</div>
              <span className="text-[11px] text-cyan-400">{totalPKPT} PKPT Tahunan • {totalNonPKPT} Non-PKPT Khusus</span>
            </div>
            <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-700/60">
              <span className="text-xs text-slate-400">Anggaran Audit Disetujui</span>
              <div className="text-2xl font-black text-emerald-400 mt-1">
                {formatRupiah(programs.reduce((acc, p) => acc + p.anggaran, 0))}
              </div>
              <span className="text-[11px] text-slate-400">Alokasi Biaya Uji Petik & Honorarium SPI</span>
            </div>
            <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-700/60">
              <span className="text-xs text-slate-400">Status Penyelesaian</span>
              <div className="text-2xl font-black text-cyan-400 mt-1">
                {finishedPrograms} / {programs.length} Selesai
              </div>
              <span className="text-[11px] text-slate-400">{runningPrograms} Paket Sedang Berjalan di Lapangan</span>
            </div>
          </div>
        </div>
      )}

      {/* SUB-DASHBOARD: TEMUAN & AGING */}
      {subDashboardView === 'temuan' && (
        <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700/80 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white">Dashboard Registrasi Temuan & Aging Rekomendasi</h3>
              <p className="text-xs text-slate-400">Daftar temuan 4-unsur (kondisi, kriteria, sebab, akibat) dan analisis waktu penyelesaian</p>
            </div>
            <button
              onClick={() => onNavigateTab('temuan')}
              className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition cursor-pointer"
            >
              Lihat Register Temuan
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-emerald-950/20 border border-emerald-800/40 rounded-xl">
              <span className="text-xs text-emerald-300 font-semibold">&lt; 30 Hari (Normal SLA)</span>
              <div className="text-2xl font-black text-emerald-400 mt-1">3 Rekomendasi</div>
              <span className="text-[11px] text-slate-400">Dalam masa tenggang perbaikan standar</span>
            </div>
            <div className="p-4 bg-yellow-950/20 border border-yellow-800/40 rounded-xl">
              <span className="text-xs text-yellow-300 font-semibold">30 - 60 Hari (Peringatan)</span>
              <div className="text-2xl font-black text-yellow-400 mt-1">1 Rekomendasi</div>
              <span className="text-[11px] text-slate-400">Perlu surat penegasan Supervisor</span>
            </div>
            <div className="p-4 bg-rose-950/20 border border-rose-800/40 rounded-xl">
              <span className="text-xs text-rose-300 font-semibold">&gt; 60 Hari (Overdue)</span>
              <div className="text-2xl font-black text-rose-400 mt-1">0 Rekomendasi</div>
              <span className="text-[11px] text-emerald-400">Tidak ada rekomendasi mangkrak</span>
            </div>
          </div>
        </div>
      )}

      {/* SUB-DASHBOARD: RISIKO */}
      {subDashboardView === 'risiko' && (
        <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700/80 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white">Dashboard Monitoring Manajemen Risiko Teknik</h3>
              <p className="text-xs text-slate-400">Korelasi inherent risk vs residual risk pasca mitigasi teknik</p>
            </div>
            <button
              onClick={() => onNavigateTab('risiko')}
              className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition cursor-pointer"
            >
              Buka Matriks 5x5 Interaktif
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {(['Rendah', 'Sedang', 'Tinggi', 'Ekstrem'] as const).map((lvl) => {
              const count = risks.filter((r) => r.levelRisiko === lvl).length;
              const color = getRiskColor(lvl);
              return (
                <div key={lvl} className={`p-4 rounded-xl border ${color.bg} ${color.border}`}>
                  <span className={`text-xs font-bold ${color.text}`}>{lvl}</span>
                  <div className="text-2xl font-black text-white mt-1">{count} Risiko</div>
                  <span className="text-[11px] text-slate-400">Tingkat bahaya teknis</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB-DASHBOARD: QA */}
      {subDashboardView === 'qa' && (
        <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700/80 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white">Dashboard Penjaminan Kualitas (Quality Assurance)</h3>
              <p className="text-xs text-slate-400">Evaluasi pemenuhan spesifikasi teknis, uji laboratorium, dan status NCR</p>
            </div>
            <button
              onClick={() => onNavigateTab('qa')}
              className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition cursor-pointer"
            >
              Kelola QA
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {qaList.map((qa) => (
              <div key={qa.id} className="p-4 bg-slate-900/60 rounded-xl border border-slate-700/60">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{qa.paketPekerjaan}</span>
                  <span className={`text-xs px-2 py-0.5 rounded font-bold ${getStatusBadge(qa.rating)}`}>
                    Rating: {qa.rating} ({qa.skorRataRata})
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Kontraktor: {qa.kontraktor} • Lokasi: {qa.lokasi}</p>
                <div className="mt-2 text-xs text-amber-300">
                  Laporan Ketidaksesuaian (NCR): {qa.ncrCount} item
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-DASHBOARD: PPHP */}
      {subDashboardView === 'pphp' && (
        <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700/80 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white">Dashboard Kinerja Personel PPHP</h3>
              <p className="text-xs text-slate-400">Distribusi beban kerja penugasan dan ketersediaan personel bersertifikat</p>
            </div>
            <button
              onClick={() => onNavigateTab('pphp')}
              className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition cursor-pointer"
            >
              Database PPHP
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {pphpList.map((p) => (
              <div key={p.id} className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-700/60">
                <div className="text-xs font-bold text-white">{p.nama}</div>
                <div className="text-[11px] text-slate-400">{p.jabatan}</div>
                <div className="mt-2 flex items-center justify-between text-xs">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${getStatusBadge(p.statusKetersediaan)}`}>
                    {p.statusKetersediaan}
                  </span>
                  <span className="text-slate-300 font-bold">{p.bebanKerjaAktif} Tugas Aktif</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-DASHBOARD: TINDAK LANJUT */}
      {subDashboardView === 'tindak-lanjut' && (
        <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700/80 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white">Dashboard Pemutakhiran Tindak Lanjut (Pasal 15c)</h3>
              <p className="text-xs text-slate-400">Verifikasi berkas perbaikan dan validasi fisik lapangan sebelum penutupan status rekomendasi</p>
            </div>
            <button
              onClick={() => onNavigateTab('tindak-lanjut')}
              className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition cursor-pointer"
            >
              Proses Verifikasi
            </button>
          </div>

          <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-700/60 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs text-slate-400 font-semibold">Tindak Lanjut Menunggu Verifikasi Supervisor</span>
              <div className="text-xl font-bold text-purple-300">{verifikasiRekomendasi} Rekomendasi Diajukan Auditee</div>
              <p className="text-[11px] text-slate-400">Bukti perbaikan dan As-Built Drawing telah diunggah.</p>
            </div>
            <button
              onClick={() => onNavigateTab('tindak-lanjut')}
              className="px-3 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-bold transition cursor-pointer"
            >
              Tinjau Sekarang
            </button>
          </div>
        </div>
      )}

      {/* SUB-DASHBOARD: UNIT KERJA */}
      {subDashboardView === 'unit-kerja' && (
        <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700/80 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white">Dashboard Kinerja Kepatuhan Unit Kerja</h3>
              <p className="text-xs text-slate-400">Tingkat responsivitas auditee dalam menindaklanjuti temuan pengawasan teknik</p>
            </div>
          </div>

          <div className="space-y-3">
            {[
              { unit: 'Divisi Teknik & Konstruksi Infrastruktur', temuan: 3, resolved: 1, rate: 33 },
              { unit: 'Divisi Pengadaan Barang & Jasa Strategis', temuan: 2, resolved: 2, rate: 100 },
              { unit: 'Unit Pembangkitan Energi Barat', temuan: 2, resolved: 1, rate: 50 },
              { unit: 'Divisi Proyek Regional III', temuan: 1, resolved: 0, rate: 0 },
            ].map((u) => (
              <div key={u.unit} className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-700/60 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white">{u.unit}</div>
                  <div className="text-[11px] text-slate-400">{u.temuan} Total Temuan • {u.resolved} Telah Ditutup</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-extrabold text-cyan-400">{u.rate}% Selesai</div>
                  <div className="text-[10px] text-slate-400">Tingkat Kepatuhan</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
