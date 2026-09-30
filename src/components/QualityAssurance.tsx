import React, { useState } from 'react';
import {
  Award,
  Plus,
  Search,
  CheckCircle,
  AlertTriangle,
  FileCheck,
  Calendar,
  Building,
  MapPin,
  ClipboardList,
  Sparkles,
  Check,
  X
} from 'lucide-react';
import { QAInspection, QARating, UserRole } from '../types';
import { formatDateIndo, getStatusBadge } from '../utils/helpers';

interface QualityAssuranceProps {
  qaList: QAInspection[];
  onAddQA: (newQA: QAInspection) => void;
  currentRole: UserRole;
}

export const QualityAssurance: React.FC<QualityAssuranceProps> = ({
  qaList,
  onAddQA,
  currentRole,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRating, setFilterRating] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedInspection, setSelectedInspection] = useState<QAInspection | null>(null);

  const [formData, setFormData] = useState({
    paketPekerjaan: '',
    lokasi: '',
    kontraktor: '',
    jadwalInspeksi: new Date().toISOString().split('T')[0],
    timInspektur: 'Ir. Bambang Trihadi, M.T., Rina Kusuma, S.T.',
    rating: 'Baik' as QARating,
    skorRataRata: 85,
    ncrCount: 0,
    correctiveActionPlan: '',
  });

  const getRatingBadge = (rating: QARating) => {
    switch (rating) {
      case 'Sangat Baik':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'Baik':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'Cukup':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'Kurang':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
      default:
        return 'bg-slate-700 text-slate-300';
    }
  };

  const handleSaveNewQA = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.paketPekerjaan) return;

    const newQA: QAInspection = {
      id: `QA-${Date.now().toString().slice(-4)}`,
      nomorQA: `QA-INSP/2026/04/${Math.floor(100 + Math.random() * 900)}`,
      paketPekerjaan: formData.paketPekerjaan,
      lokasi: formData.lokasi || 'Lokasi Proyek Lapangan',
      kontraktor: formData.kontraktor || 'PT Rekayasa Teknika',
      jadwalInspeksi: formData.jadwalInspeksi,
      timInspektur: formData.timInspektur.split(',').map((s) => s.trim()),
      status: 'Terjadwal',
      rating: formData.rating,
      skorRataRata: Number(formData.skorRataRata),
      ncrCount: Number(formData.ncrCount),
      correctiveActionPlan: formData.correctiveActionPlan || 'Penerapan checklist pengujian material bertahap.',
      checklist: [
        {
          id: `CK-${Date.now()}-1`,
          standarRef: 'SNI Teknis PUPR',
          parameter: 'Pengujian Mutu Bahan Material & Sertifikasi Uji Tarik',
          kriteriaUji: 'Kuat tarik baja dan kuat tekan beton sesuai toleransi',
          hasilUji: 'Sesuai',
          skor: 90,
          keterangan: 'Memenuhi spesifikasi teknis RKS.',
        },
      ],
    };

    onAddQA(newQA);
    setShowAddModal(false);
  };

  const filteredQA = qaList.filter((q) => {
    const matchSearch =
      q.paketPekerjaan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.kontraktor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.nomorQA.toLowerCase().includes(searchTerm.toLowerCase());
    const matchRating = filterRating === 'All' || q.rating === filterRating;
    return matchSearch && matchRating;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-purple-400" />
            Modul Quality Assurance (QA) & Penjaminan Kualitas
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Perencanaan program mutu, pengawasan ketidaksesuaian (NCR), dan penetapan rating kualitatif (Sangat Baik / Baik / Cukup / Kurang).
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-950/40 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Jadwalkan Inspeksi QA</span>
        </button>
      </div>

      {/* QA Metrics Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[
          { label: 'Sangat Baik (A ≥ 90)', count: qaList.filter((q) => q.rating === 'Sangat Baik').length, color: 'text-emerald-400', border: 'border-emerald-800/40' },
          { label: 'Baik (B: 75-89)', count: qaList.filter((q) => q.rating === 'Baik').length, color: 'text-blue-400', border: 'border-blue-800/40' },
          { label: 'Cukup (C: 60-74)', count: qaList.filter((q) => q.rating === 'Cukup').length, color: 'text-yellow-400', border: 'border-yellow-800/40' },
          { label: 'Kurang (D < 60)', count: qaList.filter((q) => q.rating === 'Kurang').length, color: 'text-rose-400', border: 'border-rose-800/40' },
        ].map((m) => (
          <div key={m.label} className={`p-4 bg-slate-800/80 rounded-2xl border ${m.border} shadow-lg`}>
            <span className="text-xs text-slate-400 font-semibold">{m.label}</span>
            <div className={`text-2xl font-black mt-1 ${m.color}`}>{m.count} Paket</div>
            <span className="text-[11px] text-slate-500">Hasil Audit Mutu Lapangan</span>
          </div>
        ))}
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700/80 shadow-md">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nomor QA, paket pekerjaan, kontraktor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-900 text-xs text-white rounded-xl border border-slate-700 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Rating QA:</span>
            <select
              value={filterRating}
              onChange={(e) => setFilterRating(e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 text-xs text-white rounded-xl border border-slate-700 focus:outline-none"
            >
              <option value="All">Semua Rating</option>
              <option value="Sangat Baik">Sangat Baik (A)</option>
              <option value="Baik">Baik (B)</option>
              <option value="Cukup">Cukup (C)</option>
              <option value="Kurang">Kurang (D)</option>
            </select>
          </div>
        </div>
      </div>

      {/* QA LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredQA.map((qa) => (
          <div
            key={qa.id}
            className="p-5 bg-slate-800/80 rounded-2xl border border-slate-700/80 hover:border-slate-600 transition shadow-lg space-y-3.5"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-cyan-300">{qa.nomorQA}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${getRatingBadge(qa.rating)}`}>
                    Rating: {qa.rating} ({qa.skorRataRata})
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white leading-snug">{qa.paketPekerjaan}</h3>
                <div className="text-xs text-slate-400 flex items-center gap-3">
                  <span>Kontraktor: <strong className="text-slate-300">{qa.kontraktor}</strong></span>
                  <span>Lokasi: {qa.lokasi}</span>
                </div>
              </div>

              <div className="text-right">
                <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${getStatusBadge(qa.status)}`}>
                  {qa.status}
                </span>
                <div className="text-[11px] text-slate-400 mt-1">{formatDateIndo(qa.jadwalInspeksi)}</div>
              </div>
            </div>

            {/* Checklist items summary */}
            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-700/60 text-xs space-y-2">
              <span className="font-bold text-slate-300 block">Kriteria & Parameter Uji Mutu Terverifikasi:</span>
              {qa.checklist.map((ck) => (
                <div key={ck.id} className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-300">• {ck.parameter}</span>
                  <span
                    className={`font-bold px-1.5 py-0.5 rounded text-[10px] ${
                      ck.hasilUji === 'Sesuai' ? 'text-emerald-400 bg-emerald-950/40' : 'text-rose-400 bg-rose-950/40'
                    }`}
                  >
                    {ck.hasilUji} ({ck.skor})
                  </span>
                </div>
              ))}
            </div>

            {/* NCR (Non-conformance report) alert */}
            <div className="flex items-center justify-between text-xs pt-1">
              <span className="flex items-center gap-1.5 text-amber-300">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Ketidaksesuaian (NCR): <strong>{qa.ncrCount} item</strong></span>
              </span>

              <button
                onClick={() => setSelectedInspection(qa)}
                className="text-cyan-400 hover:text-cyan-300 text-xs font-semibold cursor-pointer"
              >
                Lihat Lembar Mutu Lengkap &rarr;
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL: DETAIL LEMBAR MUTU */}
      {selectedInspection && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-2xl max-w-xl w-full border border-slate-700 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700">
              <div>
                <span className="text-xs font-mono text-cyan-300">{selectedInspection.nomorQA}</span>
                <h3 className="text-base font-bold text-white">{selectedInspection.paketPekerjaan}</h3>
              </div>
              <button
                onClick={() => setSelectedInspection(null)}
                className="text-slate-400 hover:text-white text-xl font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-700/60 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-400">Tim Inspektur QA:</span>
                <span className="text-white font-semibold">{selectedInspection.timInspektur.join(', ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Rating Kualitas:</span>
                <span className="text-cyan-300 font-bold">{selectedInspection.rating} (Skor: {selectedInspection.skorRataRata})</span>
              </div>
              <div className="pt-2 border-t border-slate-700/60">
                <span className="text-slate-400 font-semibold block mb-1">Rencana Tindakan Korektif (Corrective Action Plan):</span>
                <p className="text-slate-200">{selectedInspection.correctiveActionPlan}</p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedInspection(null)}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-xs font-semibold cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: TAMBAH QA BARU */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-2xl max-w-xl w-full border border-slate-700 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-purple-400" />
                Jadwalkan Program Quality Assurance (QA) Baru
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white text-xl font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveNewQA} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Paket Pekerjaan / Fasilitas *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Pekerjaan Pengaspalan Hotmix AC-WC Tol Lingkar Luar"
                  value={formData.paketPekerjaan}
                  onChange={(e) => setFormData({ ...formData, paketPekerjaan: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 text-white rounded-xl border border-slate-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Kontraktor Pelaksana</label>
                  <input
                    type="text"
                    placeholder="PT Pelaksana Konstruksi"
                    value={formData.kontraktor}
                    onChange={(e) => setFormData({ ...formData, kontraktor: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 text-white rounded-xl border border-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Lokasi</label>
                  <input
                    type="text"
                    placeholder="Kota / Wilayah"
                    value={formData.lokasi}
                    onChange={(e) => setFormData({ ...formData, lokasi: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 text-white rounded-xl border border-slate-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Jadwal Inspeksi</label>
                  <input
                    type="date"
                    value={formData.jadwalInspeksi}
                    onChange={(e) => setFormData({ ...formData, jadwalInspeksi: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 text-white rounded-xl border border-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Rating Target</label>
                  <select
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-900 text-white rounded-xl border border-slate-700"
                  >
                    <option value="Sangat Baik">Sangat Baik (A)</option>
                    <option value="Baik">Baik (B)</option>
                    <option value="Cukup">Cukup (C)</option>
                    <option value="Kurang">Kurang (D)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Skor Mutu (0-100)</label>
                  <input
                    type="number"
                    value={formData.skorRataRata}
                    onChange={(e) => setFormData({ ...formData, skorRataRata: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-900 text-white rounded-xl border border-slate-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Rencana Tindakan Korektif (CAP)</label>
                <textarea
                  rows={2}
                  placeholder="Instruksi perbaikan bagi kontraktor jika ada deviasi..."
                  value={formData.correctiveActionPlan}
                  onChange={(e) => setFormData({ ...formData, correctiveActionPlan: e.target.value })}
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
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold transition cursor-pointer"
                >
                  Simpan Jadwal QA
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
