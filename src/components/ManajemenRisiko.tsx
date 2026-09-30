import React, { useState } from 'react';
import {
  ShieldAlert,
  Plus,
  Search,
  Sparkles,
  Calendar,
  AlertOctagon,
  CheckCircle,
  Clock,
  Filter,
  Activity,
  Layers,
  HelpCircle
} from 'lucide-react';
import { RiskItem, UserRole } from '../types';
import { formatDateIndo, getRiskColor, getStatusBadge } from '../utils/helpers';

interface ManajemenRisikoProps {
  risks: RiskItem[];
  onAddRisk: (newRisk: RiskItem) => void;
  onUpdateRisk: (updated: RiskItem) => void;
  currentRole: UserRole;
}

export const ManajemenRisiko: React.FC<ManajemenRisikoProps> = ({
  risks,
  onAddRisk,
  onUpdateRisk,
  currentRole,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCellFilter, setSelectedCellFilter] = useState<{ l: number; c: number } | null>(null);

  // AI scoring state
  const [isAiScoring, setIsAiScoring] = useState(false);

  // New Risk Form
  const [formData, setFormData] = useState({
    kode: `RSK-2026-${Math.floor(10 + Math.random() * 90)}`,
    objekPengawasan: 'Konstruksi Jembatan & Jalan Tol',
    deskripsiRisiko: '',
    penyebab: '',
    dampak: '',
    kemungkinan: 3 as 1 | 2 | 3 | 4 | 5,
    konsekuensi: 4 as 1 | 2 | 3 | 4 | 5,
    programMitigasi: '',
    pic: 'Supervisor Pengawas Teknik & Tim Auditor Konstruksi',
    deadline: '2026-05-30',
  });

  // Calculate risk level from score
  const getLevelFromScore = (score: number): 'Rendah' | 'Sedang' | 'Tinggi' | 'Ekstrem' => {
    if (score >= 15) return 'Ekstrem';
    if (score >= 10) return 'Tinggi';
    if (score >= 5) return 'Sedang';
    return 'Rendah';
  };

  // AI assessment trigger
  const handleTriggerAiRiskScoring = async () => {
    if (!formData.deskripsiRisiko) {
      alert('Isi deskripsi risiko terlebih dahulu agar AI dapat melakukan asesmen.');
      return;
    }

    setIsAiScoring(true);
    try {
      const res = await fetch('/api/ai/risk-assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deskripsiRisiko: formData.deskripsiRisiko,
          objekPengawasan: formData.objekPengawasan,
        }),
      });

      const data = await res.json();
      if (data.success && data.data) {
        const item = data.data;
        setFormData((prev) => ({
          ...prev,
          kemungkinan: item.kemungkinan || prev.kemungkinan,
          konsekuensi: item.konsekuensi || prev.konsekuensi,
          programMitigasi: item.programMitigasi || prev.programMitigasi,
        }));
      }
    } catch (e) {
      console.error('Error in AI risk assessment:', e);
    } finally {
      setIsAiScoring(false);
    }
  };

  const handleSubmitNewRisk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.deskripsiRisiko) return;

    const inherent = formData.kemungkinan * formData.konsekuensi;
    const newRisk: RiskItem = {
      id: `RSK-${Date.now().toString().slice(-4)}`,
      kode: formData.kode,
      objekPengawasan: formData.objekPengawasan,
      deskripsiRisiko: formData.deskripsiRisiko,
      penyebab: formData.penyebab || 'Faktor teknis lapangan dan pengendalian mutu.',
      dampak: formData.dampak || 'Potensi pembengkakan biaya dan deviasi mutu.',
      kemungkinan: formData.kemungkinan,
      konsekuensi: formData.konsekuensi,
      skorInherent: inherent,
      levelRisiko: getLevelFromScore(inherent),
      programMitigasi: formData.programMitigasi || 'Inspeksi berkala dan audit kepatuhan spesifikasi.',
      pic: formData.pic,
      deadline: formData.deadline,
      statusMitigasi: 'On Progress',
      residualScore: Math.max(1, Math.round(inherent * 0.5)),
    };

    onAddRisk(newRisk);
    setShowAddModal(false);
    setFormData({
      kode: `RSK-2026-${Math.floor(10 + Math.random() * 90)}`,
      objekPengawasan: 'Konstruksi Jembatan & Jalan Tol',
      deskripsiRisiko: '',
      penyebab: '',
      dampak: '',
      kemungkinan: 3,
      konsekuensi: 4,
      programMitigasi: '',
      pic: 'Supervisor Pengawas Teknik & Tim Auditor Konstruksi',
      deadline: '2026-05-30',
    });
  };

  // Matrix Cell Colors
  const getMatrixCellClass = (score: number) => {
    if (score >= 15) return 'bg-rose-950/80 hover:bg-rose-900 border-rose-700/80 text-rose-300';
    if (score >= 10) return 'bg-amber-950/80 hover:bg-amber-900 border-amber-700/80 text-amber-300';
    if (score >= 5) return 'bg-yellow-950/80 hover:bg-yellow-900 border-yellow-700/80 text-yellow-300';
    return 'bg-emerald-950/80 hover:bg-emerald-900 border-emerald-700/80 text-emerald-300';
  };

  const filteredRisks = risks.filter((r) => {
    const matchSearch =
      r.deskripsiRisiko.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.objekPengawasan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.kode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchLevel = filterLevel === 'All' || r.levelRisiko === filterLevel;

    const matchCell =
      !selectedCellFilter ||
      (r.kemungkinan === selectedCellFilter.l && r.konsekuensi === selectedCellFilter.c);

    return matchSearch && matchLevel && matchCell;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-400" />
            Modul Manajemen Risiko Teknik (Risk Register & 5x5 Matrix)
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Analisis Inherent vs Residual Risk, pemetaan Heatmap 5x5, dan mitigasi preventif berstandar ISO 31000.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-950/40 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Item Risiko</span>
        </button>
      </div>

      {/* 5x5 RISK MATRIX HEATMAP INTERACTIVE SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* The 5x5 Grid (7 Cols) */}
        <div className="lg:col-span-7 bg-slate-800/80 rounded-2xl p-5 border border-slate-700/80 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                Matriks Analisis Risiko 5x5 (Heatmap)
              </h3>
              <p className="text-[11px] text-slate-400">
                Klik salah satu kotak koordinat untuk memfilter risiko terkait secara instan.
              </p>
            </div>
            {selectedCellFilter && (
              <button
                onClick={() => setSelectedCellFilter(null)}
                className="text-[11px] px-2.5 py-1 rounded bg-slate-700 hover:bg-slate-600 text-cyan-300 font-semibold cursor-pointer"
              >
                Reset Filter Sel
              </button>
            )}
          </div>

          {/* Matrix Table */}
          <div className="overflow-x-auto">
            <div className="min-w-[420px]">
              <div className="grid grid-cols-6 gap-1.5 text-center text-xs">
                {/* Header row: Consequence Labels */}
                <div className="text-[10px] font-bold text-slate-400 p-1 flex items-center justify-center">
                  Kemungkinan \ Dampak
                </div>
                {[1, 2, 3, 4, 5].map((c) => (
                  <div key={c} className="text-[10px] font-bold text-slate-300 bg-slate-900/60 p-1.5 rounded-lg">
                    {c} ({c === 1 ? 'Ringan' : c === 2 ? 'Kecil' : c === 3 ? 'Sedang' : c === 4 ? 'Besar' : 'Katastropik'})
                  </div>
                ))}

                {/* Rows from Likelihood 5 down to 1 */}
                {[5, 4, 3, 2, 1].map((l) => (
                  <React.Fragment key={l}>
                    {/* Row Header */}
                    <div className="text-[10px] font-bold text-slate-300 bg-slate-900/60 p-2 rounded-lg flex items-center justify-center">
                      L{l} ({l === 5 ? 'Pasti' : l === 4 ? 'Sangat Sering' : l === 3 ? 'Sedang' : l === 2 ? 'Jarang' : 'Sangat Jarang'})
                    </div>

                    {/* 5 columns */}
                    {[1, 2, 3, 4, 5].map((c) => {
                      const score = l * c;
                      const countInCell = risks.filter((r) => r.kemungkinan === l && r.konsekuensi === c).length;
                      const isSelected = selectedCellFilter?.l === l && selectedCellFilter?.c === c;

                      return (
                        <button
                          key={`${l}-${c}`}
                          onClick={() =>
                            setSelectedCellFilter(isSelected ? null : { l, c })
                          }
                          className={`p-2.5 rounded-xl border transition flex flex-col items-center justify-center gap-0.5 cursor-pointer ${getMatrixCellClass(
                            score
                          )} ${isSelected ? 'ring-2 ring-white scale-105 z-10 shadow-lg' : ''}`}
                        >
                          <span className="text-[10px] font-extrabold opacity-70">{score}</span>
                          {countInCell > 0 ? (
                            <span className="w-5 h-5 rounded-full bg-white text-slate-900 font-black text-[11px] flex items-center justify-center shadow">
                              {countInCell}
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-500">•</span>
                          )}
                        </button>
                      );
                    })}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          {/* Matrix Legend */}
          <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-700/60 text-center text-[10px] font-bold">
            <div className="p-1.5 rounded-lg bg-emerald-950/60 text-emerald-300 border border-emerald-800/60">
              Rendah (1 - 4)
            </div>
            <div className="p-1.5 rounded-lg bg-yellow-950/60 text-yellow-300 border border-yellow-800/60">
              Sedang (5 - 9)
            </div>
            <div className="p-1.5 rounded-lg bg-amber-950/60 text-amber-300 border border-amber-800/60">
              Tinggi (10 - 14)
            </div>
            <div className="p-1.5 rounded-lg bg-rose-950/60 text-rose-300 border border-rose-800/60">
              Ekstrem (15 - 25)
            </div>
          </div>
        </div>

        {/* Matrix Insights & Residual Risk Summary (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700/80 shadow-lg space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              Tingkat Risiko Terkini & Mitigasi
            </h3>

            <div className="space-y-2 text-xs">
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-700/60 flex items-center justify-between">
                <div>
                  <span className="text-slate-400">Total Item Terdaftar:</span>
                  <div className="text-lg font-black text-white">{risks.length} Risiko</div>
                </div>
                <div className="text-right">
                  <span className="text-slate-400">Risiko Ekstrem:</span>
                  <div className="text-lg font-black text-rose-400">
                    {risks.filter((r) => r.levelRisiko === 'Ekstrem').length}
                  </div>
                </div>
              </div>

              <p className="text-slate-300 leading-relaxed text-[11px]">
                Risiko dengan kategori <strong>Ekstrem</strong> wajib mendapatkan mitigasi langsung dalam tempo 48 jam dan persetujuan tindakan darurat dari <strong>Supervisor Pengawas Teknik</strong>.
              </p>
            </div>
          </div>

          <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700/80 shadow-lg space-y-2 text-xs">
            <span className="font-bold text-white block">Status Rencana Aksi Mitigasi:</span>
            <div className="space-y-1.5">
              {[
                { label: 'Tuntas Terkendali', count: risks.filter((r) => r.statusMitigasi === 'Tuntas Terkendali').length, color: 'text-emerald-400' },
                { label: 'On Progress', count: risks.filter((r) => r.statusMitigasi === 'On Progress').length, color: 'text-blue-400' },
                { label: 'Belum Mitigasi', count: risks.filter((r) => r.statusMitigasi === 'Belum Mitigasi').length, color: 'text-rose-400' },
              ].map((s) => (
                <div key={s.label} className="flex justify-between p-2 bg-slate-900/60 rounded-lg border border-slate-700/50">
                  <span className="text-slate-300">{s.label}</span>
                  <span className={`font-bold ${s.color}`}>{s.count} Item</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar for Risk Register */}
      <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700/80 shadow-md">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Cari kode risiko, objek, deskripsi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-900 text-xs text-white rounded-xl border border-slate-700 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Level:</span>
            <select
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 text-xs text-white rounded-xl border border-slate-700 focus:outline-none"
            >
              <option value="All">Semua Level Risiko</option>
              <option value="Ekstrem">Ekstrem (Skor 15 - 25)</option>
              <option value="Tinggi">Tinggi (Skor 10 - 14)</option>
              <option value="Sedang">Sedang (Skor 5 - 9)</option>
              <option value="Rendah">Rendah (Skor 1 - 4)</option>
            </select>
          </div>
        </div>
      </div>

      {/* RISK REGISTER TABLE */}
      <div className="bg-slate-800/80 rounded-2xl border border-slate-700/80 shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-900/80 text-slate-300 font-bold border-b border-slate-700">
                <th className="p-3.5">Kode</th>
                <th className="p-3.5">Objek Pengawasan</th>
                <th className="p-3.5">Deskripsi Risiko & Penyebab</th>
                <th className="p-3.5 text-center">L × C = Inherent</th>
                <th className="p-3.5">Level</th>
                <th className="p-3.5">Program Mitigasi & PIC</th>
                <th className="p-3.5 text-center">Residual Score</th>
                <th className="p-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {filteredRisks.map((r) => {
                const color = getRiskColor(r.levelRisiko);
                return (
                  <tr key={r.id} className="hover:bg-slate-750 transition">
                    <td className="p-3.5 font-mono text-[11px] font-bold text-cyan-300 whitespace-nowrap">
                      {r.kode}
                    </td>
                    <td className="p-3.5 font-semibold text-white whitespace-nowrap">
                      {r.objekPengawasan}
                    </td>
                    <td className="p-3.5 max-w-xs space-y-1">
                      <p className="font-semibold text-slate-100">{r.deskripsiRisiko}</p>
                      <p className="text-[11px] text-slate-400">Penyebab: {r.penyebab}</p>
                    </td>
                    <td className="p-3.5 text-center font-bold whitespace-nowrap">
                      {r.kemungkinan} × {r.konsekuensi} = <span className="text-white font-black">{r.skorInherent}</span>
                    </td>
                    <td className="p-3.5 whitespace-nowrap">
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${color.badge}`}>
                        {r.levelRisiko}
                      </span>
                    </td>
                    <td className="p-3.5 max-w-xs space-y-1">
                      <p className="text-slate-200">{r.programMitigasi}</p>
                      <p className="text-[11px] text-cyan-400 font-semibold">PIC: {r.pic} • Due: {formatDateIndo(r.deadline)}</p>
                    </td>
                    <td className="p-3.5 text-center font-mono font-bold text-emerald-400 whitespace-nowrap">
                      {r.residualScore}
                    </td>
                    <td className="p-3.5 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${getStatusBadge(r.statusMitigasi)}`}>
                        {r.statusMitigasi}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: TAMBAH RISIKO BARU */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-2xl max-w-xl w-full border border-slate-700 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                Tambah Register Risiko Teknik Baru
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white text-xl font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitNewRisk} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Kode Risiko</label>
                  <input
                    type="text"
                    value={formData.kode}
                    onChange={(e) => setFormData({ ...formData, kode: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 text-white rounded-xl border border-slate-700 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Objek Pengawasan</label>
                  <input
                    type="text"
                    value={formData.objekPengawasan}
                    onChange={(e) => setFormData({ ...formData, objekPengawasan: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 text-white rounded-xl border border-slate-700"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-slate-300 font-semibold">Deskripsi Kejadian Risiko *</label>
                  <button
                    type="button"
                    onClick={handleTriggerAiRiskScoring}
                    disabled={isAiScoring}
                    className="text-[10px] text-yellow-300 font-bold flex items-center gap-1 hover:text-yellow-200 cursor-pointer disabled:opacity-50"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>{isAiScoring ? 'Menghitung...' : 'AI Risk Scoring Otomatis'}</span>
                  </button>
                </div>
                <textarea
                  rows={2}
                  required
                  placeholder="Uraikan potensi kegagalan teknis, kegagalan material, atau malfungsi sistem..."
                  value={formData.deskripsiRisiko}
                  onChange={(e) => setFormData({ ...formData, deskripsiRisiko: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 text-white rounded-xl border border-slate-700 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Kemungkinan (Likelihood: 1-5)
                  </label>
                  <select
                    value={formData.kemungkinan}
                    onChange={(e) => setFormData({ ...formData, kemungkinan: Number(e.target.value) as any })}
                    className="w-full px-3 py-2 bg-slate-900 text-white rounded-xl border border-slate-700"
                  >
                    <option value={1}>1 - Sangat Jarang</option>
                    <option value={2}>2 - Jarang Terjadi</option>
                    <option value={3}>3 - Sedang / Kadang</option>
                    <option value={4}>4 - Sangat Sering</option>
                    <option value={5}>5 - Hampir Pasti Terjadi</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Konsekuensi (Consequence: 1-5)
                  </label>
                  <select
                    value={formData.konsekuensi}
                    onChange={(e) => setFormData({ ...formData, konsekuensi: Number(e.target.value) as any })}
                    className="w-full px-3 py-2 bg-slate-900 text-white rounded-xl border border-slate-700"
                  >
                    <option value={1}>1 - Ringan / Tanpa Kerugian</option>
                    <option value={2}>2 - Kecil / Teratasi Cepat</option>
                    <option value={3}>3 - Sedang / Menengah</option>
                    <option value={4}>4 - Besar / Berbahaya</option>
                    <option value={5}>5 - Katastropik / Fatal</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Rencana Aksi Mitigasi</label>
                <textarea
                  rows={2}
                  placeholder="Langkah preventif atau perbaikan yang wajib dilaksanakan..."
                  value={formData.programMitigasi}
                  onChange={(e) => setFormData({ ...formData, programMitigasi: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 text-white rounded-xl border border-slate-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">PIC Mitigasi</label>
                  <input
                    type="text"
                    value={formData.pic}
                    onChange={(e) => setFormData({ ...formData, pic: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 text-white rounded-xl border border-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Batas Waktu (Deadline)</label>
                  <input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 text-white rounded-xl border border-slate-700"
                  />
                </div>
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
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-bold transition cursor-pointer"
                >
                  Simpan Risiko
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
