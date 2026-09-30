import React, { useState } from 'react';
import {
  AlertTriangle,
  Plus,
  Search,
  Sparkles,
  Calendar,
  Building,
  CheckCircle,
  Clock,
  ShieldAlert,
  ArrowRight,
  Filter,
  FileCheck,
  Check,
  ChevronDown,
  X
} from 'lucide-react';
import { Temuan, Rekomendasi, KategoriTemuan, PrioritasRekomendasi, UserRole } from '../types';
import { formatRupiah, formatDateIndo, getRiskColor, getStatusBadge } from '../utils/helpers';

interface TemuanRekomendasiProps {
  temuanList: Temuan[];
  onAddTemuan: (newTemuan: Temuan) => void;
  onUpdateTemuan: (updated: Temuan) => void;
  currentRole: UserRole;
  initialNewTemuanData?: Partial<Temuan> | null;
  onClearInitialData?: () => void;
}

export const TemuanRekomendasi: React.FC<TemuanRekomendasiProps> = ({
  temuanList,
  onAddTemuan,
  onUpdateTemuan,
  currentRole,
  initialNewTemuanData,
  onClearInitialData,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterKategori, setFilterKategori] = useState<string>('All');
  const [filterRisiko, setFilterRisiko] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState(!!initialNewTemuanData);
  const [selectedTemuanDetail, setSelectedTemuanDetail] = useState<Temuan | null>(null);

  // AI Analysis state inside modal
  const [isAnalyzingAi, setIsAnalyzingAi] = useState(false);
  const [aiAnalysisResult, setAiAnalysisResult] = useState<any | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Temuan>>({
    nomorTemuan: `TMN/2026/03/${Math.floor(100 + Math.random() * 900)}`,
    programJudul: 'Audit Kelaikan Konstruksi Jembatan Akses Tol Segmen IV',
    tanggal: new Date().toISOString().split('T')[0],
    unitKerja: 'Divisi Teknik & Konstruksi Infrastruktur',
    kategori: 'Mutu',
    kondisi: initialNewTemuanData?.kondisi || '',
    kriteria: initialNewTemuanData?.kriteria || '',
    sebab: initialNewTemuanData?.sebab || '',
    akibat: initialNewTemuanData?.akibat || '',
    nilaiRisiko: (initialNewTemuanData?.nilaiRisiko as any) || 'Tinggi',
    estimasiKerugian: 50000000,
    buktiFoto: 'https://images.unsplash.com/photo-1541888946425-d0fbb18f15f7?auto=format&fit=crop&w=600&q=80',
    buktiKeterangan: 'Dokumentasi visual hasil pengujian lapangan',
    statusApprovalSupervisor: 'Draft',
    rekomendasiList: [
      {
        id: `REK-${Date.now()}-1`,
        nomor: `REK/2026/03/001-A`,
        uraian: 'Menginstruksikan perbaikan segera dan pengujian verifikasi laboratorium independen terakreditasi KAN.',
        pic: 'Pejabat Pembuat Komitmen (PPK)',
        targetSelesai: '2026-04-15',
        prioritas: 'Tinggi',
        status: 'Open',
      },
    ],
  });

  // Call AI finding analyzer
  const handleTriggerAiAnalysis = async () => {
    if (!formData.kondisi) {
      alert('Silakan isi kolom "Kondisi (Fakta Temuan)" terlebih dahulu untuk dianalisis oleh AI.');
      return;
    }

    setIsAnalyzingAi(true);
    setAiAnalysisResult(null);

    try {
      const res = await fetch('/api/ai/analyze-finding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kondisi: formData.kondisi,
          kriteria: formData.kriteria,
          kategori: formData.kategori,
          unitKerja: formData.unitKerja,
        }),
      });

      const data = await res.json();
      if (data.success && data.data) {
        setAiAnalysisResult(data.data);
        // Autofill cause, consequence, and recommendations if empty
        setFormData((prev) => ({
          ...prev,
          sebab: prev.sebab || data.data.akarMasalah,
          akibat: prev.akibat || data.data.dampakRisiko,
          rekomendasiList: [
            {
              id: `REK-${Date.now()}-1`,
              nomor: `REK/${new Date().getFullYear()}/01`,
              uraian: data.data.rekomendasiKorektif,
              pic: 'Pejabat Pembuat Komitmen (PPK)',
              targetSelesai: '2026-04-30',
              prioritas: data.data.prioritasSaran || 'Tinggi',
              status: 'Open',
            },
            {
              id: `REK-${Date.now()}-2`,
              nomor: `REK/${new Date().getFullYear()}/02`,
              uraian: data.data.rekomendasiPreventif,
              pic: 'Kepala Bagian Pengendalian Mutu & Auditee',
              targetSelesai: '2026-05-15',
              prioritas: 'Sedang',
              status: 'Open',
            },
          ],
        }));
      }
    } catch (err) {
      console.error('Error analyzing finding:', err);
    } finally {
      setIsAnalyzingAi(false);
    }
  };

  const handleSaveTemuan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.kondisi || !formData.kriteria) return;

    const newTemuan: Temuan = {
      id: `TMN-${Date.now().toString().slice(-4)}`,
      nomorTemuan: formData.nomorTemuan || `TMN/2026/03/999`,
      programId: formData.programId || 'PRG-01',
      programJudul: formData.programJudul || 'Program Audit Lapangan 2026',
      tanggal: formData.tanggal || new Date().toISOString().split('T')[0],
      unitKerja: formData.unitKerja || 'Unit Operasional',
      kategori: formData.kategori as KategoriTemuan,
      kondisi: formData.kondisi,
      kriteria: formData.kriteria,
      sebab: formData.sebab || 'Kurang optimalnya pengawasan lapangan.',
      akibat: formData.akibat || 'Potensi deviasi mutu teknis.',
      nilaiRisiko: formData.nilaiRisiko as any,
      estimasiKerugian: Number(formData.estimasiKerugian || 0),
      buktiFoto: formData.buktiFoto,
      buktiKeterangan: formData.buktiKeterangan,
      statusApprovalSupervisor: currentRole === 'supervisor' ? 'Disetujui' : 'Draft',
      rekomendasiList: formData.rekomendasiList || [],
    };

    onAddTemuan(newTemuan);
    setShowAddModal(false);
    if (onClearInitialData) onClearInitialData();
  };

  // Supervisor Quick Approval
  const handleApproveTemuan = (temuan: Temuan) => {
    onUpdateTemuan({
      ...temuan,
      statusApprovalSupervisor: 'Disetujui',
    });
  };

  const filteredTemuan = temuanList.filter((t) => {
    const matchSearch =
      t.nomorTemuan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.kondisi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.unitKerja.toLowerCase().includes(searchTerm.toLowerCase());
    const matchKategori = filterKategori === 'All' || t.kategori === filterKategori;
    const matchRisiko = filterRisiko === 'All' || t.nilaiRisiko === filterRisiko;
    return matchSearch && matchKategori && matchRisiko;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            Modul Temuan dan Rekomendasi SPI
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Registrasi temuan berstandar 4 unsur (Kondisi, Kriteria, Sebab, Akibat) dan perumusan rekomendasi perbaikan.
          </p>
        </div>

        <button
          onClick={() => {
            setFormData({
              nomorTemuan: `TMN/2026/03/${Math.floor(100 + Math.random() * 900)}`,
              programJudul: 'Audit Kelaikan Konstruksi Jembatan Akses Tol Segmen IV',
              tanggal: new Date().toISOString().split('T')[0],
              unitKerja: 'Divisi Teknik & Konstruksi Infrastruktur',
              kategori: 'Mutu',
              kondisi: '',
              kriteria: '',
              sebab: '',
              akibat: '',
              nilaiRisiko: 'Tinggi',
              estimasiKerugian: 75000000,
              rekomendasiList: [
                {
                  id: `REK-${Date.now()}`,
                  nomor: `REK/2026/03/001-A`,
                  uraian: 'Menginstruksikan pengujian ulang dan perbaikan dokumen mutu sesuai spesifikasi.',
                  pic: 'Pejabat Pembuat Komitmen (PPK)',
                  targetSelesai: '2026-04-15',
                  prioritas: 'Tinggi',
                  status: 'Open',
                },
              ],
            });
            setShowAddModal(true);
          }}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-lg shadow-amber-950/40 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Registrasi Temuan Baru</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700/80 shadow-md">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nomor temuan, uraian, unit kerja..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-900 text-xs text-white rounded-xl border border-slate-700 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Kategori:</span>
            <select
              value={filterKategori}
              onChange={(e) => setFilterKategori(e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 text-xs text-white rounded-xl border border-slate-700 focus:outline-none"
            >
              <option value="All">Semua Kategori</option>
              <option value="Mutu">Mutu</option>
              <option value="Teknis">Teknis</option>
              <option value="Administratif">Administratif</option>
              <option value="Kepatuhan">Kepatuhan</option>
              <option value="Risiko">Risiko</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Level Risiko:</span>
            <select
              value={filterRisiko}
              onChange={(e) => setFilterRisiko(e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 text-xs text-white rounded-xl border border-slate-700 focus:outline-none"
            >
              <option value="All">Semua Level Risiko</option>
              <option value="Ekstrem">Ekstrem</option>
              <option value="Tinggi">Tinggi</option>
              <option value="Sedang">Sedang</option>
              <option value="Rendah">Rendah</option>
            </select>
          </div>
        </div>
      </div>

      {/* TEMUAN LIST */}
      <div className="space-y-4">
        {filteredTemuan.map((t) => {
          const riskColor = getRiskColor(t.nilaiRisiko);
          return (
            <div
              key={t.id}
              className="p-5 bg-slate-800/80 rounded-2xl border border-slate-700/80 hover:border-slate-600 transition shadow-lg space-y-4"
            >
              {/* Header Card */}
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center flex-wrap gap-2">
                    <span className="text-xs font-mono font-bold text-amber-400">{t.nomorTemuan}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-700 text-slate-300">
                      {t.kategori}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${riskColor.badge}`}>
                      Risiko {t.nilaiRisiko}
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        t.statusApprovalSupervisor === 'Disetujui'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                      }`}
                    >
                      Supervisor: {t.statusApprovalSupervisor}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white leading-snug">
                    {t.programJudul}
                  </h3>

                  <div className="flex items-center gap-4 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Building className="w-3.5 h-3.5 text-slate-500" />
                      {t.unitKerja}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      Tanggal Registrasi: {formatDateIndo(t.tanggal)}
                    </span>
                  </div>
                </div>

                {/* Right Action & Financial Impact */}
                <div className="flex items-center gap-3">
                  {t.estimasiKerugian && t.estimasiKerugian > 0 ? (
                    <div className="text-left lg:text-right bg-slate-900/60 p-2 rounded-xl border border-slate-700/50">
                      <span className="text-[10px] text-slate-400 font-semibold block">Estimasi Dampak:</span>
                      <span className="text-xs font-bold text-rose-400">{formatRupiah(t.estimasiKerugian)}</span>
                    </div>
                  ) : null}

                  {currentRole === 'supervisor' && t.statusApprovalSupervisor === 'Draft' && (
                    <button
                      onClick={() => handleApproveTemuan(t)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Setujui Temuan</span>
                    </button>
                  )}
                </div>
              </div>

              {/* 4 Unsur Temuan Grid (Kondisi, Kriteria, Sebab, Akibat) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3.5 bg-slate-900/60 rounded-xl border border-slate-700/60 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider">1. Kondisi (Fakta Lapangan):</span>
                  <p className="text-slate-200 mt-1 leading-relaxed">{t.kondisi}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-blue-400 tracking-wider">2. Kriteria (Standar / SOP):</span>
                  <p className="text-slate-300 mt-1 leading-relaxed">{t.kriteria}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">3. Sebab (Root Cause):</span>
                  <p className="text-slate-300 mt-1 leading-relaxed">{t.sebab}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-rose-400 tracking-wider">4. Akibat (Dampak Kerugian/Risiko):</span>
                  <p className="text-slate-300 mt-1 leading-relaxed">{t.akibat}</p>
                </div>
              </div>

              {/* Rekomendasi List Subsection */}
              <div className="space-y-2 pt-2 border-t border-slate-700/60">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <FileCheck className="w-4 h-4 text-emerald-400" />
                    Rekomendasi Perbaikan ({t.rekomendasiList.length}):
                  </span>
                  <span className="text-slate-400 text-[11px]">
                    SLA Standar: 14 s.d 30 Hari Kalender
                  </span>
                </div>

                <div className="space-y-2">
                  {t.rekomendasiList.map((rek) => (
                    <div
                      key={rek.id}
                      className="p-3 bg-slate-800 rounded-xl border border-slate-700 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs"
                    >
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[11px] font-bold text-cyan-300">{rek.nomor}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${getStatusBadge(rek.status)}`}>
                            {rek.status}
                          </span>
                          <span className="text-[10px] text-slate-400">Prioritas: {rek.prioritas}</span>
                        </div>
                        <p className="text-slate-200">{rek.uraian}</p>
                        <div className="text-[11px] text-slate-400 flex items-center gap-3">
                          <span>PIC: <strong className="text-slate-300">{rek.pic}</strong></span>
                          <span>Target: <strong className="text-slate-300">{formatDateIndo(rek.targetSelesai)}</strong></span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL REGISTRASI TEMUAN BARU */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-2xl max-w-3xl w-full border border-slate-700 shadow-2xl overflow-y-auto max-h-[90vh] p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  Registrasi Temuan & Rekomendasi Teknik Baru
                </h3>
                <p className="text-xs text-slate-400">Pengisian lembar temuan berstandar SPI (4 Unsur Pokok)</p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white text-xl font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveTemuan} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Nomor Registrasi Temuan</label>
                  <input
                    type="text"
                    value={formData.nomorTemuan}
                    onChange={(e) => setFormData({ ...formData, nomorTemuan: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 text-white rounded-xl border border-slate-700 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Kategori Temuan</label>
                  <select
                    value={formData.kategori}
                    onChange={(e) => setFormData({ ...formData, kategori: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-900 text-white rounded-xl border border-slate-700"
                  >
                    <option value="Mutu">Mutu</option>
                    <option value="Teknis">Teknis</option>
                    <option value="Administratif">Administratif</option>
                    <option value="Kepatuhan">Kepatuhan</option>
                    <option value="Risiko">Risiko</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Tingkat Risiko</label>
                  <select
                    value={formData.nilaiRisiko}
                    onChange={(e) => setFormData({ ...formData, nilaiRisiko: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-900 text-white rounded-xl border border-slate-700 font-bold text-amber-400"
                  >
                    <option value="Rendah">Rendah</option>
                    <option value="Sedang">Sedang</option>
                    <option value="Tinggi">Tinggi</option>
                    <option value="Ekstrem">Ekstrem</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Unit Kerja / Auditee</label>
                <input
                  type="text"
                  value={formData.unitKerja}
                  onChange={(e) => setFormData({ ...formData, unitKerja: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 text-white rounded-xl border border-slate-700"
                />
              </div>

              {/* 4 UNSUR AUDIT FIELDS */}
              <div className="space-y-3 p-4 bg-slate-900/60 rounded-xl border border-slate-700/60">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs">Uraian 4 Unsur Temuan:</span>
                  {/* AI Analyze Trigger Button */}
                  <button
                    type="button"
                    onClick={handleTriggerAiAnalysis}
                    disabled={isAnalyzingAi}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-[11px] font-bold transition shadow cursor-pointer disabled:opacity-50"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                    <span>{isAnalyzingAi ? 'Menganalisis...' : 'AI Analisa Akar Masalah & Rekomendasi'}</span>
                  </button>
                </div>

                <div>
                  <label className="block text-cyan-300 font-semibold mb-1">1. Kondisi (Fakta Lapangan) *</label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Contoh: Ditemukan lendutan balok girder melebihi toleransi desain saat uji beban..."
                    value={formData.kondisi}
                    onChange={(e) => setFormData({ ...formData, kondisi: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 text-white rounded-xl border border-slate-700 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-blue-300 font-semibold mb-1">2. Kriteria (Klausul Standar / SNI / SOP) *</label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Contoh: SNI 2847:2019 dan Rencana Kerja Syarat Teknis Kontrak Pasal 4..."
                    value={formData.kriteria}
                    onChange={(e) => setFormData({ ...formData, kriteria: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 text-white rounded-xl border border-slate-700 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-amber-300 font-semibold mb-1">3. Sebab (Akar Masalah)</label>
                    <textarea
                      rows={2}
                      placeholder="Analisis penyebab..."
                      value={formData.sebab}
                      onChange={(e) => setFormData({ ...formData, sebab: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900 text-white rounded-xl border border-slate-700"
                    />
                  </div>
                  <div>
                    <label className="block text-rose-300 font-semibold mb-1">4. Akibat (Dampak Kerugian / Risiko Mutu)</label>
                    <textarea
                      rows={2}
                      placeholder="Dampak kegagalan..."
                      value={formData.akibat}
                      onChange={(e) => setFormData({ ...formData, akibat: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900 text-white rounded-xl border border-slate-700"
                    />
                  </div>
                </div>
              </div>

              {/* AI Suggestion Box if triggered */}
              {aiAnalysisResult && (
                <div className="p-3 bg-indigo-950/40 border border-indigo-500/40 rounded-xl space-y-1.5 text-xs text-indigo-200">
                  <div className="flex items-center gap-1.5 font-bold text-yellow-300">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Hasil Analisis AI Auditor Senior SPI:</span>
                  </div>
                  <p><strong>Standar Terkait:</strong> {aiAnalysisResult.klausulStandarTerkait}</p>
                  <p><strong>Saran Korektif:</strong> {aiAnalysisResult.rekomendasiKorektif}</p>
                </div>
              )}

              {/* Rekomendasi Section */}
              <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-700/60 space-y-2">
                <span className="font-bold text-white text-xs block">Rekomendasi SPI Tindak Lanjut:</span>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Uraian Rekomendasi *</label>
                  <textarea
                    rows={2}
                    required
                    value={formData.rekomendasiList?.[0]?.uraian || ''}
                    onChange={(e) => {
                      const updated = [...(formData.rekomendasiList || [])];
                      if (updated[0]) updated[0].uraian = e.target.value;
                      setFormData({ ...formData, rekomendasiList: updated });
                    }}
                    className="w-full px-3 py-2 bg-slate-900 text-white rounded-xl border border-slate-700"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">PIC Tindak Lanjut</label>
                    <input
                      type="text"
                      value={formData.rekomendasiList?.[0]?.pic || ''}
                      onChange={(e) => {
                        const updated = [...(formData.rekomendasiList || [])];
                        if (updated[0]) updated[0].pic = e.target.value;
                        setFormData({ ...formData, rekomendasiList: updated });
                      }}
                      className="w-full px-3 py-2 bg-slate-900 text-white rounded-xl border border-slate-700"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Target Batas Waktu (Due Date)</label>
                    <input
                      type="date"
                      value={formData.rekomendasiList?.[0]?.targetSelesai || '2026-04-30'}
                      onChange={(e) => {
                        const updated = [...(formData.rekomendasiList || [])];
                        if (updated[0]) updated[0].targetSelesai = e.target.value;
                        setFormData({ ...formData, rekomendasiList: updated });
                      }}
                      className="w-full px-3 py-2 bg-slate-900 text-white rounded-xl border border-slate-700"
                    />
                  </div>
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
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-bold transition cursor-pointer"
                >
                  Simpan Temuan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
