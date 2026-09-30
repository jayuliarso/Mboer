import React, { useState } from 'react';
import {
  Sparkles,
  FileText,
  ShieldAlert,
  Search,
  Copy,
  Check,
  Printer,
  Download,
  Send,
  HelpCircle,
  Lightbulb
} from 'lucide-react';
import { AuditProgram, Temuan } from '../types';

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  programs: AuditProgram[];
  temuanList: Temuan[];
  selectedProgramForLHP?: AuditProgram | null;
}

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({
  isOpen,
  onClose,
  programs,
  temuanList,
  selectedProgramForLHP,
}) => {
  const [activeAITab, setActiveAITab] = useState<'lhp' | 'analyze' | 'risk'>('lhp');

  // LHP Generation states
  const [targetProgramId, setTargetProgramId] = useState<string>(
    selectedProgramForLHP?.id || programs[0]?.id || ''
  );
  const [isGeneratingLhp, setIsGeneratingLhp] = useState(false);
  const [generatedLhpText, setGeneratedLhpText] = useState<string>('');
  const [copied, setCopied] = useState(false);

  // Finding Analysis states
  const [analisaKondisi, setAnalisaKondisi] = useState(
    'Ditemukan retak struktural pada dinding penahan tanah retaining wall STA 42+200 sepanjang 12 meter dengan lebar retak 8 mm saat hujan lebat.'
  );
  const [analisaKriteria, setAnalisaKriteria] = useState(
    'Pedoman Perencanaan Dinding Penahan Tanah Pd T-08-2005-B dan SNI 8460:2017 tentang Persyaratan Perancangan Geoteknik.'
  );
  const [isAnalyzingFinding, setIsAnalyzingFinding] = useState(false);
  const [findingAnalysisResult, setFindingAnalysisResult] = useState<any | null>(null);

  if (!isOpen) return null;

  const currentProgram = programs.find((p) => p.id === targetProgramId) || programs[0];

  const handleGenerateLHP = async () => {
    setIsGeneratingLhp(true);
    setGeneratedLhpText('');

    const relatedTemuan = temuanList.filter((t) => t.programId === currentProgram.id);

    try {
      const res = await fetch('/api/ai/draft-lhp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          programJudul: currentProgram.judul,
          nomorAudit: currentProgram.nomor,
          unitKerja: currentProgram.unitKerja,
          temuanList: relatedTemuan.map((t) => ({
            nomor: t.nomorTemuan,
            kondisi: t.kondisi,
            kriteria: t.kriteria,
            rekomendasi: t.rekomendasiList.map((r) => r.uraian).join('; '),
          })),
        }),
      });

      const data = await res.json();
      if (data.success && data.lhpText) {
        setGeneratedLhpText(data.lhpText);
      }
    } catch (e) {
      console.error('Failed generating LHP:', e);
    } finally {
      setIsGeneratingLhp(false);
    }
  };

  const handleRunAnalysis = async () => {
    setIsAnalyzingFinding(true);
    setFindingAnalysisResult(null);

    try {
      const res = await fetch('/api/ai/analyze-finding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kondisi: analisaKondisi,
          kriteria: analisaKriteria,
          kategori: 'Teknis & Mutu',
          unitKerja: currentProgram?.unitKerja || 'Divisi Konstruksi',
        }),
      });

      const data = await res.json();
      if (data.success && data.data) {
        setFindingAnalysisResult(data.data);
      }
    } catch (e) {
      console.error('Failed analyzing finding:', e);
    } finally {
      setIsAnalyzingFinding(false);
    }
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-3xl max-w-4xl w-full border border-slate-700 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Top Header */}
        <div className="p-5 bg-gradient-to-r from-indigo-950 via-purple-950 to-slate-900 border-b border-indigo-800/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-yellow-400 to-amber-600 flex items-center justify-center shadow-lg shadow-yellow-950/40">
              <Sparkles className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-white">
                  AI Asisten Auditor Teknik SPI
                </h3>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                  Roadmap Fase 3 (Live)
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Penyusunan Draf LHP Otomatis, Analisa Temuan 4-Unsur, dan Rekomendasi Standar Mutu.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-xl font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Tab selection */}
        <div className="px-6 py-2 bg-slate-950/60 border-b border-slate-800 flex items-center gap-2 text-xs">
          <button
            onClick={() => setActiveAITab('lhp')}
            className={`px-4 py-2 rounded-xl font-bold flex items-center gap-1.5 transition cursor-pointer ${
              activeAITab === 'lhp'
                ? 'bg-indigo-600/30 text-indigo-200 border border-indigo-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4 text-cyan-400" />
            <span>Penyusunan Draf LHP Otomatis</span>
          </button>

          <button
            onClick={() => setActiveAITab('analyze')}
            className={`px-4 py-2 rounded-xl font-bold flex items-center gap-1.5 transition cursor-pointer ${
              activeAITab === 'analyze'
                ? 'bg-indigo-600/30 text-indigo-200 border border-indigo-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Lightbulb className="w-4 h-4 text-yellow-400" />
            <span>AI Analisa Akar Masalah (Root Cause)</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4 text-xs text-slate-200">
          {/* TAB 1: DRAF LHP OTOMATIS */}
          {activeAITab === 'lhp' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700/80 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="md:col-span-2">
                    <label className="block text-slate-300 font-semibold mb-1">
                      Pilih Paket Program Audit untuk Penyusunan LHP:
                    </label>
                    <select
                      value={targetProgramId}
                      onChange={(e) => setTargetProgramId(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 text-white rounded-xl border border-slate-700 font-semibold"
                    >
                      {programs.map((p) => (
                        <option key={p.id} value={p.id}>
                          [{p.tipe}] {p.nomor} - {p.judul}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-end">
                    <button
                      onClick={handleGenerateLHP}
                      disabled={isGeneratingLhp}
                      className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-950/40 cursor-pointer disabled:opacity-50"
                    >
                      <Sparkles className="w-4 h-4 text-yellow-300" />
                      <span>{isGeneratingLhp ? 'Menyusun LHP...' : 'Generate Draf LHP Lengkap'}</span>
                    </button>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 flex items-center gap-4">
                  <span>Unit Kerja: <strong className="text-slate-300">{currentProgram.unitKerja}</strong></span>
                  <span>Supervisor: <strong className="text-cyan-300">{currentProgram.supervisor}</strong></span>
                  <span>Temuan Terintegrasi: <strong className="text-amber-400">{temuanList.filter((t) => t.programId === currentProgram.id).length} temuan</strong></span>
                </div>
              </div>

              {/* Generated LHP Display */}
              {generatedLhpText ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-cyan-400" />
                      Draf Resmi Laporan Hasil Pemeriksaan (LHP) Teknik:
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopyText(generatedLhpText)}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-cyan-400" />}
                        <span>{copied ? 'Tersalin!' : 'Salin Teks'}</span>
                      </button>
                      <button
                        onClick={() => window.print()}
                        className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Cetak LHP</span>
                      </button>
                    </div>
                  </div>

                  <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 font-mono text-xs text-slate-200 leading-relaxed whitespace-pre-wrap max-h-96 overflow-y-auto">
                    {generatedLhpText}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 p-6 bg-slate-950/60 rounded-2xl border border-slate-800 text-slate-400 space-y-2">
                  <Sparkles className="w-8 h-8 mx-auto text-yellow-400/80 mb-1" />
                  <p className="font-bold text-white text-sm">Klik tombol &quot;Generate Draf LHP Lengkap&quot; di atas.</p>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    AI akan mengompilasi rincian temuan, kriteria kelaikan teknis, metodologi uji petik, dan kesimpulan supervisor sesuai format baku pengawasan SPI.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: ANALISA TEMUAN 4-UNSUR */}
          {activeAITab === 'analyze' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700/80 space-y-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Fakta Temuan Lapangan (Kondisi):
                  </label>
                  <textarea
                    rows={2}
                    value={analisaKondisi}
                    onChange={(e) => setAnalisaKondisi(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 text-white rounded-xl border border-slate-700"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Kriteria / Standar yang Digunakan:
                  </label>
                  <input
                    type="text"
                    value={analisaKriteria}
                    onChange={(e) => setAnalisaKriteria(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 text-white rounded-xl border border-slate-700"
                  />
                </div>

                <button
                  onClick={handleRunAnalysis}
                  disabled={isAnalyzingFinding}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4 text-yellow-300" />
                  <span>{isAnalyzingFinding ? 'Menganalisis...' : 'Jalankan Analisis Akar Masalah (Root Cause)'}</span>
                </button>
              </div>

              {findingAnalysisResult && (
                <div className="p-5 bg-slate-950 rounded-2xl border border-indigo-500/40 space-y-3 text-xs">
                  <div className="flex items-center gap-2 font-bold text-yellow-300 text-sm">
                    <Sparkles className="w-4 h-4" />
                    <span>Hasil Diagnosa Cerdas SPI:</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                      <span className="text-[10px] uppercase font-bold text-amber-400 block mb-1">
                        Akar Masalah (Root Cause):
                      </span>
                      <p className="text-slate-200 leading-relaxed">{findingAnalysisResult.akarMasalah}</p>
                    </div>

                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                      <span className="text-[10px] uppercase font-bold text-rose-400 block mb-1">
                        Dampak & Risiko Berkelanjutan:
                      </span>
                      <p className="text-slate-200 leading-relaxed">{findingAnalysisResult.dampakRisiko}</p>
                    </div>

                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                      <span className="text-[10px] uppercase font-bold text-cyan-400 block mb-1">
                        Usulan Tindakan Korektif:
                      </span>
                      <p className="text-slate-200 leading-relaxed">{findingAnalysisResult.rekomendasiKorektif}</p>
                    </div>

                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                      <span className="text-[10px] uppercase font-bold text-purple-400 block mb-1">
                        Usulan Tindakan Preventif:
                      </span>
                      <p className="text-slate-200 leading-relaxed">{findingAnalysisResult.rekomendasiPreventif}</p>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 flex justify-between items-center text-[11px]">
                    <span className="text-slate-400">Standar Acuan Terkait:</span>
                    <span className="text-indigo-300 font-bold">{findingAnalysisResult.klausulStandarTerkait}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
