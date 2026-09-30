import React, { useState } from 'react';
import {
  Search,
  CheckCircle,
  XCircle,
  AlertCircle,
  Camera,
  Upload,
  FileText,
  Plus,
  Send,
  Sparkles,
  ClipboardCheck,
  FolderOpen
} from 'lucide-react';
import { AuditProgram, ObjekPengawasan, KategoriTemuan, Temuan, UserRole } from '../types';

interface PemeriksaanInternalProps {
  programs: AuditProgram[];
  onDirectCreateTemuan: (newTemuan: Partial<Temuan>) => void;
  currentRole: UserRole;
  onOpenMobileInspector: () => void;
}

interface ChecklistItem {
  id: string;
  aspek: KategoriTemuan;
  item: string;
  standar: string;
  status: 'Memenuhi' | 'Tidak Memenuhi' | 'Belum Diperiksa';
  catatan: string;
  fotoBukti?: string;
}

export const PemeriksaanInternal: React.FC<PemeriksaanInternalProps> = ({
  programs,
  onDirectCreateTemuan,
  currentRole,
  onOpenMobileInspector,
}) => {
  const [selectedProgramId, setSelectedProgramId] = useState<string>(programs[0]?.id || '');
  const selectedProgram = programs.find((p) => p.id === selectedProgramId) || programs[0];

  const [activeAspek, setActiveAspek] = useState<KategoriTemuan | 'Semua'>('Semua');

  // Interactive KKA (Kertas Kerja Audit) Checklist
  const [checklists, setChecklists] = useState<Record<string, ChecklistItem[]>>({
    'PRG-01': [
      {
        id: 'CHK-01',
        aspek: 'Mutu',
        item: 'Uji Slump Beton dan Pencatatan Batching Plant Pier Head P-14',
        standar: 'Spesifikasi Bina Marga Divisi 7 (10 ± 2 cm)',
        status: 'Tidak Memenuhi',
        catatan: 'Nilai slump 16 cm (terlalu encer). Potensi segregasi dan penurunan mutu f\'c.',
        fotoBukti: 'https://images.unsplash.com/photo-1541888946425-d0fbb18f15f7?auto=format&fit=crop&w=400&q=80',
      },
      {
        id: 'CHK-02',
        aspek: 'Teknis',
        item: 'Pemeriksaan Selimut Beton & Pemasangan Beton Tahu (Spacer) Pilar',
        standar: 'SNI 2847:2019 min 50 mm',
        status: 'Memenuhi',
        catatan: 'Ketebalan terukur rata-rata 52 mm, ikatan kawat bendrat rapi.',
      },
      {
        id: 'CHK-03',
        aspek: 'Administratif',
        item: 'Kelengkapan As-Built Drawing Fondasi Bore Pile P10 s.d P13',
        standar: 'SOP Penatausahaan Gambar Kerja CDE',
        status: 'Tidak Memenuhi',
        catatan: 'Belum dimutakhirkan dengan data ukur total station aktual.',
        fotoBukti: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=400&q=80',
      },
      {
        id: 'CHK-04',
        aspek: 'Kepatuhan',
        item: 'Kepatuhan Pemakaian APD Full Body Harness pada Ketinggian Pier Head',
        standar: 'Permenaker No 9/2016 tentang K3 Ketinggian',
        status: 'Memenuhi',
        catatan: 'Pekerja dan supervisor mengenakan double lanyard dengan shock absorber.',
      },
      {
        id: 'CHK-05',
        aspek: 'Risiko',
        item: 'Pemeriksaan Kesiapan Pompa Dewatering Galian Pile Cap Saat Hujan Deras',
        standar: 'Rencana Mitigasi Banjir Proyek 2026',
        status: 'Memenuhi',
        catatan: '3 unit pompa submersible stand-by dalam kondisi prima.',
      },
    ],
  });

  const currentChecklist = checklists[selectedProgramId] || [
    {
      id: 'CHK-DEF-1',
      aspek: 'Administratif',
      item: 'Verifikasi kelengkapan dokumen kontrak dan jaminan pelaksanaan bank',
      standar: 'Perpres 12/2021',
      status: 'Memenuhi',
      catatan: 'Jaminan pelaksanaan senilai 5% aktif di bank persepsi.',
    },
    {
      id: 'CHK-DEF-2',
      aspek: 'Teknis',
      item: 'Uji kesesuaian spesifikasi material utama dengan katalog pabrikan',
      standar: 'Rencana Kerja & Syarat (RKS)',
      status: 'Belum Diperiksa',
      catatan: '',
    },
    {
      id: 'CHK-DEF-3',
      aspek: 'Mutu',
      item: 'Pemeriksaan sertifikasi uji laboratorium independen terakreditasi KAN',
      standar: 'ISO 17025',
      status: 'Belum Diperiksa',
      catatan: '',
    },
  ];

  const handleUpdateStatus = (itemId: string, newStatus: 'Memenuhi' | 'Tidak Memenuhi' | 'Belum Diperiksa') => {
    const updated = currentChecklist.map((item) => {
      if (item.id === itemId) {
        return { ...item, status: newStatus };
      }
      return item;
    });
    setChecklists({ ...checklists, [selectedProgramId]: updated });
  };

  const handleUpdateCatatan = (itemId: string, newCatatan: string) => {
    const updated = currentChecklist.map((item) => {
      if (item.id === itemId) {
        return { ...item, catatan: newCatatan };
      }
      return item;
    });
    setChecklists({ ...checklists, [selectedProgramId]: updated });
  };

  const handleAddCustomChecklistItem = () => {
    const newItem: ChecklistItem = {
      id: `CHK-${Date.now().toString().slice(-4)}`,
      aspek: 'Teknis',
      item: 'Pemeriksaan item uji spesifik lapangan tambahan',
      standar: 'Standar Teknis Lapangan',
      status: 'Belum Diperiksa',
      catatan: '',
    };
    setChecklists({
      ...checklists,
      [selectedProgramId]: [...currentChecklist, newItem],
    });
  };

  const handleConvertToChecklistToTemuan = (item: ChecklistItem) => {
    onDirectCreateTemuan({
      programId: selectedProgram.id,
      programJudul: selectedProgram.judul,
      unitKerja: selectedProgram.unitKerja,
      kategori: item.aspek,
      kondisi: `Ditemukan ketidaksesuaian pada pemeriksaan "${item.item}". Fakta lapangan: ${item.catatan || 'Kondisi belum memenuhi standar yang dipersyaratkan.'}`,
      kriteria: item.standar,
      sebab: 'Prosedur quality control internal auditee belum berjalan optimal saat pelaksanaan di lapangan.',
      akibat: 'Potensi penurunan keandalan mutu teknis dan temuan audit berulang.',
      nilaiRisiko: item.aspek === 'Mutu' || item.aspek === 'Teknis' ? 'Tinggi' : 'Sedang',
      buktiKeterangan: item.item,
    });
  };

  const filteredChecklist = activeAspek === 'Semua'
    ? currentChecklist
    : currentChecklist.filter((c) => c.aspek === activeAspek);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-cyan-400" />
            Lembar Pemeriksaan Digital & KKA (Kertas Kerja Audit)
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Pemeriksaan aspek Administratif, Teknis, Mutu, K3, dan Kepatuhan dengan konversi instan ke temuan.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenMobileInspector}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-bold border border-cyan-700/50 transition cursor-pointer"
          >
            <span>Buka Mode Android Lapangan</span>
          </button>

          <button
            onClick={handleAddCustomChecklistItem}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-lg shadow-cyan-950/40 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Item Uji</span>
          </button>
        </div>
      </div>

      {/* Program Selector & Object Meta Banner */}
      <div className="p-5 bg-slate-800/80 rounded-2xl border border-slate-700/80 shadow-lg space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              Pilih Paket Audit / Objek Pemeriksaan Aktif:
            </label>
            <select
              value={selectedProgramId}
              onChange={(e) => setSelectedProgramId(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-900 text-white rounded-xl border border-slate-700 font-semibold text-xs focus:outline-none focus:border-cyan-400 cursor-pointer"
            >
              {programs.map((p) => (
                <option key={p.id} value={p.id}>
                  [{p.tipe}] {p.nomor} - {p.judul}
                </option>
              ))}
            </select>
          </div>

          <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-700/60 flex flex-col justify-center text-xs">
            <span className="text-slate-400">Tim Pengawas Bertugas:</span>
            <span className="font-bold text-cyan-300 mt-0.5">{selectedProgram.ketuaTim}</span>
            <span className="text-[11px] text-slate-400">{selectedProgram.supervisor}</span>
          </div>
        </div>

        {/* Filter Aspek Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-slate-700/60">
          <span className="text-xs text-slate-400 mr-2 font-semibold">Kategori Aspek:</span>
          {(['Semua', 'Mutu', 'Teknis', 'Administratif', 'Kepatuhan', 'Risiko'] as const).map((asp) => (
            <button
              key={asp}
              onClick={() => setActiveAspek(asp)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer whitespace-nowrap ${
                activeAspek === asp
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-700/60'
              }`}
            >
              {asp}
            </button>
          ))}
        </div>
      </div>

      {/* CHECKLIST ITEMS LIST */}
      <div className="space-y-4">
        {filteredChecklist.map((item, idx) => (
          <div
            key={item.id}
            className={`p-5 rounded-2xl border transition shadow-md space-y-3.5 ${
              item.status === 'Tidak Memenuhi'
                ? 'bg-rose-950/20 border-rose-800/40'
                : item.status === 'Memenuhi'
                ? 'bg-emerald-950/20 border-emerald-800/40'
                : 'bg-slate-800/80 border-slate-700/80'
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-700 text-slate-300 text-[10px] font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-700 text-slate-300">
                    Aspek {item.aspek}
                  </span>
                  <span className="text-xs font-bold text-white">{item.item}</span>
                </div>
                <p className="text-xs text-slate-400 pl-7">
                  <strong className="text-slate-300">Standar Acuan / Kriteria:</strong> {item.standar}
                </p>
              </div>

              {/* Status Radio / Buttons */}
              <div className="flex items-center gap-1.5 self-start pl-7 md:pl-0">
                <button
                  onClick={() => handleUpdateStatus(item.id, 'Memenuhi')}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer border ${
                    item.status === 'Memenuhi'
                      ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-950/40'
                      : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                  }`}
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Sesuai</span>
                </button>

                <button
                  onClick={() => handleUpdateStatus(item.id, 'Tidak Memenuhi')}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer border ${
                    item.status === 'Tidak Memenuhi'
                      ? 'bg-rose-600 text-white border-rose-500 shadow-md shadow-rose-950/40'
                      : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                  }`}
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Tidak Sesuai</span>
                </button>
              </div>
            </div>

            {/* Catatan Lapangan & Bukti Foto */}
            <div className="pl-7 grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 border-t border-slate-700/40 text-xs">
              <div className="md:col-span-2">
                <label className="block text-slate-400 font-semibold mb-1">Catatan Hasil Pemeriksaan Lapangan:</label>
                <textarea
                  rows={2}
                  placeholder="Catat deviasi, hasil ukur alat, atau kondisi fisik yang ditemukan..."
                  value={item.catatan}
                  onChange={(e) => handleUpdateCatatan(item.id, e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-900/80 text-white rounded-xl border border-slate-700 focus:outline-none focus:border-cyan-400 text-xs"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-slate-400 font-semibold">Dokumentasi Bukti Fisik:</label>
                {item.fotoBukti ? (
                  <div className="relative group rounded-xl overflow-hidden border border-slate-700 h-20 w-32">
                    <img
                      src={item.fotoBukti}
                      alt="Bukti Foto Pemeriksaan"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-[10px] text-white font-bold">
                      Lihat Foto
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={onOpenMobileInspector}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-[11px] font-semibold flex items-center gap-1 transition cursor-pointer"
                    >
                      <Camera className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Ambil Foto</span>
                    </button>
                    <span className="text-[10px] text-slate-500">Belum ada foto</span>
                  </div>
                )}

                {/* Instant Create Finding if status is 'Tidak Memenuhi' */}
                {item.status === 'Tidak Memenuhi' && (
                  <button
                    onClick={() => handleConvertToChecklistToTemuan(item)}
                    className="w-full py-1.5 rounded-lg bg-rose-600/30 hover:bg-rose-600/50 text-rose-300 border border-rose-500/40 text-[11px] font-bold transition flex items-center justify-center gap-1.5 cursor-pointer mt-1"
                  >
                    <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                    <span>Catat Sebagai Temuan Resmi</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
