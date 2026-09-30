/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  initialPrograms,
  initialTemuan,
  initialRisks,
  initialQAInspections,
  initialEvaluasiBarangJasa,
  initialPPHP,
  initialSuratTugas,
  initialKnowledge,
  initialNotifikasi
} from './data/mockData';
import {
  UserRole,
  AuditProgram,
  Temuan,
  RiskItem,
  QAInspection,
  EvaluasiBarangJasa,
  PersonelPPHP,
  SuratTugasPPHP,
  KnowledgeItem,
  NotifikasiAlert,
  Rekomendasi,
  ProgramStatus,
  MobileInspectionSubmission
} from './types';

import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { ProgramPKPT } from './components/ProgramPKPT';
import { PemeriksaanInternal } from './components/PemeriksaanInternal';
import { TemuanRekomendasi } from './components/TemuanRekomendasi';
import { TindakLanjut } from './components/TindakLanjut';
import { ManajemenRisiko } from './components/ManajemenRisiko';
import { QualityAssurance } from './components/QualityAssurance';
import { EvaluasiBarangJasaModule } from './components/EvaluasiBarangJasa';
import { PengelolaanPPHP } from './components/PengelolaanPPHP';
import { KnowledgeCenter } from './components/KnowledgeCenter';
import { MobileInspectionModal } from './components/MobileInspectionModal';
import { NotificationModal } from './components/NotificationModal';
import { AIAssistantModal } from './components/AIAssistantModal';

export default function App() {
  // Global States
  const [currentRole, setCurrentRole] = useState<UserRole>('supervisor');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedYear, setSelectedYear] = useState<number>(2026);

  // Data Collections
  const [programs, setPrograms] = useState<AuditProgram[]>(initialPrograms);
  const [temuanList, setTemuanList] = useState<Temuan[]>(initialTemuan);
  const [risks, setRisks] = useState<RiskItem[]>(initialRisks);
  const [qaList, setQaList] = useState<QAInspection[]>(initialQAInspections);
  const [evaluasiList, setEvaluasiList] = useState<EvaluasiBarangJasa[]>(initialEvaluasiBarangJasa);
  const [pphpList, setPphpList] = useState<PersonelPPHP[]>(initialPPHP);
  const [suratTugasList, setSuratTugasList] = useState<SuratTugasPPHP[]>(initialSuratTugas);
  const [knowledgeList] = useState<KnowledgeItem[]>(initialKnowledge);
  const [notifications, setNotifications] = useState<NotifikasiAlert[]>(initialNotifikasi);

  // Modals
  const [isMobileInspectorOpen, setIsMobileInspectorOpen] = useState(false);
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Inter-module Bridge States
  const [initialNewTemuanData, setInitialNewTemuanData] = useState<Partial<Temuan> | null>(null);
  const [selectedProgramForLHP, setSelectedProgramForLHP] = useState<AuditProgram | null>(null);

  // Toast banner state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // --- Handlers ---
  const handleAddProgram = (newProg: AuditProgram) => {
    setPrograms([newProg, ...programs]);
    showToast(`Program baru "${newProg.judul}" berhasil didaftarkan ke PKPT.`);
  };

  const handleUpdateProgramStatus = (id: string, newStatus: ProgramStatus) => {
    setPrograms(
      programs.map((p) => {
        if (p.id === id) {
          return {
            ...p,
            status: newStatus,
            progressPercent: newStatus === 'Selesai' ? 100 : newStatus === 'Berjalan' ? Math.max(p.progressPercent, 25) : 0,
          };
        }
        return p;
      })
    );
    showToast(`Status program berhasil diubah menjadi "${newStatus}".`);
  };

  const handleAddTemuan = (newTemuan: Temuan) => {
    setTemuanList([newTemuan, ...temuanList]);
    showToast(`Temuan No. ${newTemuan.nomorTemuan} berhasil didaftarkan.`);
  };

  const handleUpdateTemuan = (updated: Temuan) => {
    setTemuanList(temuanList.map((t) => (t.id === updated.id ? updated : t)));
    showToast(`Temuan No. ${updated.nomorTemuan} disetujui Supervisor.`);
  };

  const handleUpdateRekomendasi = (
    temuanId: string,
    rekomendasiId: string,
    updatedRekomendasi: Rekomendasi
  ) => {
    setTemuanList(
      temuanList.map((t) => {
        if (t.id === temuanId) {
          return {
            ...t,
            rekomendasiList: t.rekomendasiList.map((r) =>
              r.id === rekomendasiId ? updatedRekomendasi : r
            ),
          };
        }
        return t;
      })
    );
    showToast(`Tindak lanjut Rekomendasi No. ${updatedRekomendasi.nomor} berhasil dimutakhirkan (Status: ${updatedRekomendasi.status}).`);
  };

  const handleAddRisk = (newRisk: RiskItem) => {
    setRisks([newRisk, ...risks]);
    showToast(`Item Risiko ${newRisk.kode} berhasil dicatat dalam Matriks Risiko.`);
  };

  const handleUpdateRisk = (updated: RiskItem) => {
    setRisks(risks.map((r) => (r.id === updated.id ? updated : r)));
  };

  const handleAddQA = (newQA: QAInspection) => {
    setQaList([newQA, ...qaList]);
    showToast(`Jadwal QA ${newQA.nomorQA} berhasil disimpan.`);
  };

  const handleAddEvaluasi = (newEv: EvaluasiBarangJasa) => {
    setEvaluasiList([newEv, ...evaluasiList]);
    showToast(`Evaluasi pengadaan "${newEv.namaPaket}" berhasil dicatat.`);
  };

  const handleUpdateEvaluasi = (updated: EvaluasiBarangJasa) => {
    setEvaluasiList(evaluasiList.map((e) => (e.id === updated.id ? updated : e)));
    showToast(`Berita Acara paket ${updated.namaPaket} disahkan.`);
  };

  const handleAddSuratTugas = (newST: SuratTugasPPHP) => {
    setSuratTugasList([newST, ...suratTugasList]);
    // update workload of assigned personel
    setPphpList(
      pphpList.map((p) => {
        if (newST.personelIds.includes(p.id)) {
          return {
            ...p,
            bebanKerjaAktif: p.bebanKerjaAktif + 1,
            statusKetersediaan: 'Sedang Bertugas',
          };
        }
        return p;
      })
    );
    showToast(`Surat Tugas No. ${newST.nomorST} berhasil diterbitkan.`);
  };

  const handleUpdatePPHPStatus = (
    id: string,
    newStatus: PersonelPPHP['statusKetersediaan']
  ) => {
    setPphpList(
      pphpList.map((p) => (p.id === id ? { ...p, statusKetersediaan: newStatus } : p))
    );
    showToast('Status ketersediaan personel berhasil diubah.');
  };

  const handleDirectCreateTemuanFromChecklist = (partialTemuan: Partial<Temuan>) => {
    setInitialNewTemuanData(partialTemuan);
    setActiveTab('temuan');
  };

  const handleGenerateLHPFromProgram = (prog: AuditProgram) => {
    setSelectedProgramForLHP(prog);
    setIsAiAssistantOpen(true);
  };

  const handleMobileReportSubmission = (submission: MobileInspectionSubmission) => {
    const newNotif: NotifikasiAlert = {
      id: `NOTIF-${Date.now()}`,
      judul: 'Laporan Mobile Lapangan Diterima',
      pesan: `Laporan inspeksi fisik ${submission.namaObjek} telah disinkronkan oleh ${submission.inspekturNama}.`,
      tipe: 'info',
      waktu: 'Baru saja',
      dibaca: false,
      linkTab: 'pemeriksaan',
    };
    setNotifications([newNotif, ...notifications]);
    showToast(`✓ Hasil inspeksi mobile "${submission.namaObjek}" berhasil dikirim ke server ePTI!`);
  };

  const handleMarkNotificationAsRead = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, dibaca: true } : n))
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-white">
      {/* Global Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 border border-cyan-500/60 text-cyan-200 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-semibold animate-slide-up backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Application Header & Role Selector */}
      <Header
        currentRole={currentRole}
        setCurrentRole={setCurrentRole}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        onOpenMobileInspector={() => setIsMobileInspectorOpen(true)}
        onOpenAiAssistant={() => setIsAiAssistantOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        notifications={notifications}
      />

      {/* Main App Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && (
          <Dashboard
            programs={programs}
            temuanList={temuanList}
            risks={risks}
            qaList={qaList}
            pphpList={pphpList}
            evaluasiList={evaluasiList}
            onNavigateTab={setActiveTab}
            currentRole={currentRole}
            onOpenAiAssistant={() => setIsAiAssistantOpen(true)}
          />
        )}

        {activeTab === 'pkpt' && (
          <ProgramPKPT
            programs={programs}
            onAddProgram={handleAddProgram}
            onUpdateStatus={handleUpdateProgramStatus}
            onGenerateLHP={handleGenerateLHPFromProgram}
            currentRole={currentRole}
          />
        )}

        {activeTab === 'pemeriksaan' && (
          <PemeriksaanInternal
            programs={programs}
            onDirectCreateTemuan={handleDirectCreateTemuanFromChecklist}
            currentRole={currentRole}
            onOpenMobileInspector={() => setIsMobileInspectorOpen(true)}
          />
        )}

        {activeTab === 'temuan' && (
          <TemuanRekomendasi
            temuanList={temuanList}
            onAddTemuan={handleAddTemuan}
            onUpdateTemuan={handleUpdateTemuan}
            currentRole={currentRole}
            initialNewTemuanData={initialNewTemuanData}
            onClearInitialData={() => setInitialNewTemuanData(null)}
          />
        )}

        {activeTab === 'tindak-lanjut' && (
          <TindakLanjut
            temuanList={temuanList}
            onUpdateRekomendasi={handleUpdateRekomendasi}
            currentRole={currentRole}
          />
        )}

        {activeTab === 'risiko' && (
          <ManajemenRisiko
            risks={risks}
            onAddRisk={handleAddRisk}
            onUpdateRisk={handleUpdateRisk}
            currentRole={currentRole}
          />
        )}

        {activeTab === 'qa' && (
          <QualityAssurance
            qaList={qaList}
            onAddQA={handleAddQA}
            currentRole={currentRole}
          />
        )}

        {activeTab === 'evaluasi-bj' && (
          <EvaluasiBarangJasaModule
            evaluasiList={evaluasiList}
            onAddEvaluasi={handleAddEvaluasi}
            onUpdateEvaluasi={handleUpdateEvaluasi}
            currentRole={currentRole}
          />
        )}

        {activeTab === 'pphp' && (
          <PengelolaanPPHP
            pphpList={pphpList}
            suratTugasList={suratTugasList}
            onAddSuratTugas={handleAddSuratTugas}
            onUpdatePPHPStatus={handleUpdatePPHPStatus}
            currentRole={currentRole}
          />
        )}

        {activeTab === 'knowledge' && (
          <KnowledgeCenter
            knowledgeList={knowledgeList}
            currentRole={currentRole}
          />
        )}
      </main>

      {/* Global Modals */}
      <MobileInspectionModal
        isOpen={isMobileInspectorOpen}
        onClose={() => setIsMobileInspectorOpen(false)}
        onSubmitMobileReport={handleMobileReportSubmission}
      />

      <AIAssistantModal
        isOpen={isAiAssistantOpen}
        onClose={() => {
          setIsAiAssistantOpen(false);
          setSelectedProgramForLHP(null);
        }}
        programs={programs}
        temuanList={temuanList}
        selectedProgramForLHP={selectedProgramForLHP}
      />

      <NotificationModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAsRead={handleMarkNotificationAsRead}
        onNavigateTab={setActiveTab}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-4 text-center text-xs text-slate-500">
        <p>ePTI (e-Pengawas Teknik Terintegrasi) • Satuan Pengawasan Intern (SPI) • Tata Kelola Pengawasan Teknik</p>
      </footer>
    </div>
  );
}
