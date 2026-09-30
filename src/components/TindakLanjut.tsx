import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  Upload,
  FileCheck,
  Send,
  AlertCircle,
  FileText,
  UserCheck,
  Check,
  X,
  MessageSquare,
  ShieldCheck,
  Share2
} from 'lucide-react';
import { Temuan, Rekomendasi, StatusRekomendasi, UserRole } from '../types';
import { formatDateIndo, getStatusBadge } from '../utils/helpers';

interface TindakLanjutProps {
  temuanList: Temuan[];
  onUpdateRekomendasi: (temuanId: string, rekomendasiId: string, updatedRekomendasi: Rekomendasi) => void;
  currentRole: UserRole;
}

export const TindakLanjut: React.FC<TindakLanjutProps> = ({
  temuanList,
  onUpdateRekomendasi,
  currentRole,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'All' | StatusRekomendasi>('All');
  const [activeModalAction, setActiveModalAction] = useState<{
    type: 'submit-tindak-lanjut' | 'verify' | 'reminder';
    temuan: Temuan;
    rekomendasi: Rekomendasi;
  } | null>(null);

  // Form states for submitting action plan
  const [uraianTindakLanjut, setUraianTindakLanjut] = useState('');
  const [namaBukti, setNamaBukti] = useState('');
  const [fileBuktiName, setFileBuktiName] = useState('Bukti_Perbaikan_Fisik_Signed.pdf');

  // Form states for verifying
  const [catatanVerifikasi, setCatatanVerifikasi] = useState('');
  const [verifikasiDecision, setVerifikasiDecision] = useState<'Closed' | 'Revisi'>('Closed');

  // Reminder alert status
  const [reminderSent, setReminderSent] = useState(false);

  // Flatten recommendations with their parent finding
  const items = temuanList.flatMap((t) =>
    t.rekomendasiList.map((r) => ({
      temuan: t,
      rekomendasi: r,
    }))
  );

  const filteredItems = items.filter((item) => {
    if (selectedFilter === 'All') return true;
    return item.rekomendasi.status === selectedFilter;
  });

  const handleSubmitTindakLanjut = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeModalAction || !uraianTindakLanjut) return;

    const { temuan, rekomendasi } = activeModalAction;

    const updatedRekomendasi: Rekomendasi = {
      ...rekomendasi,
      status: 'Verifikasi', // moves to Verifikasi
      tindakLanjut: {
        uraian: uraianTindakLanjut,
        tanggalSubmit: new Date().toISOString().split('T')[0],
        submittedBy: currentRole === 'auditee' ? 'PPK & Tim Pelaksana Unit Kerja' : 'Staf Proyek',
        buktiFile: fileBuktiName,
        buktiNama: namaBukti || 'Dokumen Berita Acara & Foto Perbaikan',
      },
    };

    onUpdateRekomendasi(temuan.id, rekomendasi.id, updatedRekomendasi);
    setActiveModalAction(null);
    setUraianTindakLanjut('');
    setNamaBukti('');
  };

  const handleProcessVerifikasi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeModalAction) return;

    const { temuan, rekomendasi } = activeModalAction;

    const updatedRekomendasi: Rekomendasi = {
      ...rekomendasi,
      status: verifikasiDecision === 'Closed' ? 'Closed' : 'Progress',
      catatanSupervisor: catatanVerifikasi,
      tindakLanjut: rekomendasi.tindakLanjut
        ? {
            ...rekomendasi.tindakLanjut,
            catatanAuditor: catatanVerifikasi,
            tanggalVerifikasi: new Date().toISOString().split('T')[0],
            verifiedBy: 'Ir. Bambang Trihadi, M.T. (Supervisor Pengawas Teknik)',
          }
        : undefined,
    };

    onUpdateRekomendasi(temuan.id, rekomendasi.id, updatedRekomendasi);
    setActiveModalAction(null);
    setCatatanVerifikasi('');
  };

  const handleSendReminder = () => {
    setReminderSent(true);
    setTimeout(() => {
      setReminderSent(false);
      setActiveModalAction(null);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
              Kewajiban Pengawasan Pasal 15 Huruf c
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            Pemutakhiran Tindak Lanjut Hasil Pemeriksaan
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Siklus validasi: Rekomendasi ➔ Upload Bukti Perbaikan ➔ Verifikasi Supervisor SPI ➔ Penutupan Rekomendasi (Closed).
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto bg-slate-800 p-1.5 rounded-xl border border-slate-700 text-xs">
          {(['All', 'Open', 'Progress', 'Verifikasi', 'Closed'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setSelectedFilter(st)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                selectedFilter === st
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Visual Workflow Steps */}
      <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700/80 shadow-md">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-center text-xs">
          <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-700/50">
            <span className="text-[10px] uppercase font-bold text-amber-400">Tahap 1</span>
            <div className="font-bold text-white mt-0.5">Temuan & Rekomendasi</div>
            <p className="text-[11px] text-slate-400 mt-1">Diterbitkan oleh Tim Auditor SPI</p>
          </div>
          <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-700/50">
            <span className="text-[10px] uppercase font-bold text-blue-400">Tahap 2</span>
            <div className="font-bold text-white mt-0.5">Pelaksanaan Tindak Lanjut</div>
            <p className="text-[11px] text-slate-400 mt-1">Unit Kerja / Auditee mengunggah bukti</p>
          </div>
          <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-700/50">
            <span className="text-[10px] uppercase font-bold text-purple-400">Tahap 3</span>
            <div className="font-bold text-white mt-0.5">Verifikasi Pengawas</div>
            <p className="text-[11px] text-slate-400 mt-1">Supervisor & Auditor meneliti keabsahan</p>
          </div>
          <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-700/50">
            <span className="text-[10px] uppercase font-bold text-emerald-400">Tahap 4</span>
            <div className="font-bold text-white mt-0.5">Tuntas (Closed)</div>
            <p className="text-[11px] text-slate-400 mt-1">Status resmi ditutup dalam sistem SPI</p>
          </div>
        </div>
      </div>

      {/* ITEMS LIST */}
      <div className="space-y-4">
        {filteredItems.map(({ temuan, rekomendasi }) => (
          <div
            key={rekomendasi.id}
            className="p-5 bg-slate-800/80 rounded-2xl border border-slate-700/80 hover:border-slate-600 transition shadow-lg space-y-4"
          >
            {/* Header info */}
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3">
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center flex-wrap gap-2">
                  <span className="font-mono text-xs font-bold text-cyan-300">{rekomendasi.nomor}</span>
                  <span className="text-[11px] text-slate-400">Ref: {temuan.nomorTemuan}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${getStatusBadge(rekomendasi.status)}`}>
                    Status: {rekomendasi.status}
                  </span>
                  <span className="text-[10px] text-slate-400">Prioritas: {rekomendasi.prioritas}</span>
                </div>

                <h3 className="text-sm font-bold text-white leading-relaxed">
                  {rekomendasi.uraian}
                </h3>

                <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400">
                  <span>Unit Kerja: <strong className="text-slate-300">{temuan.unitKerja}</strong></span>
                  <span>PIC: <strong className="text-slate-300">{rekomendasi.pic}</strong></span>
                  <span className="flex items-center gap-1 text-amber-300">
                    <Clock className="w-3.5 h-3.5" />
                    Target Selesai: {formatDateIndo(rekomendasi.targetSelesai)}
                  </span>
                </div>
              </div>

              {/* Action Buttons depending on role & status */}
              <div className="flex items-center gap-2">
                {/* Send Reminder button */}
                <button
                  onClick={() =>
                    setActiveModalAction({
                      type: 'reminder',
                      temuan,
                      rekomendasi,
                    })
                  }
                  className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold rounded-xl transition flex items-center gap-1 cursor-pointer"
                  title="Kirim Reminder Otomatis ke PIC via WhatsApp & Email"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Kirim Reminder</span>
                </button>

                {/* Auditee Submit Evidence Button */}
                {(rekomendasi.status === 'Open' || rekomendasi.status === 'Progress') && (
                  <button
                    onClick={() =>
                      setActiveModalAction({
                        type: 'submit-tindak-lanjut',
                        temuan,
                        rekomendasi,
                      })
                    }
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition flex items-center gap-1 cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Bukti Perbaikan</span>
                  </button>
                )}

                {/* Supervisor / Auditor Verify Button */}
                {rekomendasi.status === 'Verifikasi' && (
                  <button
                    onClick={() =>
                      setActiveModalAction({
                        type: 'verify',
                        temuan,
                        rekomendasi,
                      })
                    }
                    className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl transition flex items-center gap-1 cursor-pointer"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-yellow-300" />
                    <span>Verifikasi Bukti</span>
                  </button>
                )}
              </div>
            </div>

            {/* Audit Trail / Tindak Lanjut Submission History */}
            {rekomendasi.tindakLanjut ? (
              <div className="p-4 bg-slate-900/70 rounded-xl border border-slate-700/60 text-xs space-y-2">
                <div className="flex items-center justify-between text-slate-300 pb-2 border-b border-slate-700/60">
                  <span className="font-bold flex items-center gap-1 text-cyan-300">
                    <FileText className="w-4 h-4" />
                    Dokumen & Uraian Tindak Lanjut Unit Kerja:
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Diajukan pada: {formatDateIndo(rekomendasi.tindakLanjut.tanggalSubmit)} oleh {rekomendasi.tindakLanjut.submittedBy}
                  </span>
                </div>

                <p className="text-slate-200 leading-relaxed">{rekomendasi.tindakLanjut.uraian}</p>

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">Lampiran Bukti:</span>
                    <span className="font-mono text-cyan-400 font-semibold px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/60 flex items-center gap-1">
                      <FileCheck className="w-3.5 h-3.5" />
                      {rekomendasi.tindakLanjut.buktiFile}
                    </span>
                  </div>

                  {rekomendasi.tindakLanjut.verifiedBy && (
                    <span className="text-[11px] text-emerald-400 font-semibold">
                      ✓ Telah diverifikasi oleh: {rekomendasi.tindakLanjut.verifiedBy}
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-xs text-slate-500 italic flex items-center gap-1.5 pl-2">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Belum ada pengajuan bukti tindak lanjut dari auditee.</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* MODAL 1: SUBMIT TINDAK LANJUT BUKTI */}
      {activeModalAction?.type === 'submit-tindak-lanjut' && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-2xl max-w-xl w-full border border-slate-700 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Upload className="w-4 h-4 text-cyan-400" />
                Unggah Bukti Perbaikan Rekomendasi
              </h3>
              <button
                onClick={() => setActiveModalAction(null)}
                className="text-slate-400 hover:text-white text-xl font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-700/60 text-xs">
              <span className="text-slate-400">Rekomendasi:</span>
              <p className="font-bold text-white mt-0.5">{activeModalAction.rekomendasi.uraian}</p>
            </div>

            <form onSubmit={handleSubmitTindakLanjut} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Uraian Lengkap Tindakan Perbaikan yang Dilakukan *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Jelaskan tindakan korektif fisik yang telah dikerjakan, nomor surat/BA terkait, dan perbaikan metode kerja..."
                  value={uraianTindakLanjut}
                  onChange={(e) => setUraianTindakLanjut(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 text-white rounded-xl border border-slate-700 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Nama Dokumen / Keterangan Bukti *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Dokumen Hasil Uji Core Drill Lab Independen & As-Built Drawing Rev 2"
                  value={namaBukti}
                  onChange={(e) => setNamaBukti(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 text-white rounded-xl border border-slate-700"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">File Berkas Lampiran (PDF / Foto)</label>
                <div className="p-3 bg-slate-900 rounded-xl border border-dashed border-slate-600 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-cyan-400" />
                    <div>
                      <div className="font-semibold text-white">{fileBuktiName}</div>
                      <div className="text-[10px] text-slate-400">Ukuran: 2.4 MB • Format: PDF terotentikasi</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-cyan-400 px-2 py-1 bg-cyan-950/60 rounded border border-cyan-800">
                    Siap Upload
                  </span>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveModalAction(null)}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-bold transition cursor-pointer"
                >
                  Kirim untuk Diverifikasi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: VERIFIKASI SUPERVISOR PENGAWAS TEKNIK */}
      {activeModalAction?.type === 'verify' && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-2xl max-w-xl w-full border border-slate-700 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-purple-400" />
                Verifikasi Tindak Lanjut oleh Pengawas Teknik
              </h3>
              <button
                onClick={() => setActiveModalAction(null)}
                className="text-slate-400 hover:text-white text-xl font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-700/60">
                <span className="text-slate-400 block font-semibold">Tindak Lanjut yang Diajukan Auditee:</span>
                <p className="text-slate-200 mt-1">{activeModalAction.rekomendasi.tindakLanjut?.uraian}</p>
                <div className="mt-2 text-cyan-300 font-mono text-[11px]">
                  Berkas Bukti: {activeModalAction.rekomendasi.tindakLanjut?.buktiFile}
                </div>
              </div>
            </div>

            <form onSubmit={handleProcessVerifikasi} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Keputusan Verifikasi:</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setVerifikasiDecision('Closed')}
                    className={`p-3 rounded-xl border font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                      verifikasiDecision === 'Closed'
                        ? 'bg-emerald-600/30 text-emerald-300 border-emerald-500 shadow'
                        : 'bg-slate-900 text-slate-400 border-slate-700'
                    }`}
                  >
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Setujui & Tutup (Closed)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setVerifikasiDecision('Revisi')}
                    className={`p-3 rounded-xl border font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                      verifikasiDecision === 'Revisi'
                        ? 'bg-rose-600/30 text-rose-300 border-rose-500 shadow'
                        : 'bg-slate-900 text-slate-400 border-slate-700'
                    }`}
                  >
                    <X className="w-4 h-4 text-rose-400" />
                    <span>Minta Revisi Tambahan</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Catatan Evaluasi / Berita Acara Verifikasi *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Berikan alasan persetujuan penutupan atau poin deviasi yang masih harus diperbaiki auditee..."
                  value={catatanVerifikasi}
                  onChange={(e) => setCatatanVerifikasi(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 text-white rounded-xl border border-slate-700 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveModalAction(null)}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold transition cursor-pointer"
                >
                  Simpan Hasil Verifikasi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: NOTIFIKASI REMINDER OTOMATIS */}
      {activeModalAction?.type === 'reminder' && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-2xl max-w-lg w-full border border-slate-700 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-cyan-400" />
                Kirim Pengingat Jatuh Tempo (Reminder)
              </h3>
              <button
                onClick={() => setActiveModalAction(null)}
                className="text-slate-400 hover:text-white text-xl font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-700/60 space-y-1">
                <span className="text-slate-400">Penerima Pesan:</span>
                <p className="font-bold text-white">{activeModalAction.rekomendasi.pic}</p>
                <span className="text-[11px] text-cyan-400">WhatsApp Gateway SPI & Email Dinas</span>
              </div>

              <div className="p-3 bg-slate-900 rounded-xl border border-slate-700 space-y-1 text-slate-300">
                <span className="text-[10px] uppercase font-bold text-slate-400">Template Pesan Otomatis:</span>
                <p className="font-mono text-[11px] leading-relaxed text-emerald-300">
                  &quot;[ePTI SPI Notification] Yth. {activeModalAction.rekomendasi.pic}, Rekomendasi No. {activeModalAction.rekomendasi.nomor} terkait {activeModalAction.temuan.unitKerja} akan jatuh tempo pada {formatDateIndo(activeModalAction.rekomendasi.targetSelesai)}. Mohon segera unggah berkas tindak lanjut di portal ePTI.&quot;
                </p>
              </div>

              {reminderSent ? (
                <div className="p-3 bg-emerald-950/40 border border-emerald-500/50 rounded-xl text-center text-emerald-300 font-bold">
                  ✓ Pengingat Berhasil Terkirim ke WhatsApp Gateway & Email PIC!
                </div>
              ) : null}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setActiveModalAction(null)}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-semibold cursor-pointer text-xs"
              >
                Tutup
              </button>
              <button
                type="button"
                onClick={handleSendReminder}
                disabled={reminderSent}
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-bold transition cursor-pointer text-xs flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Kirim Sekarang</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
