import React from 'react';
import {
  ShieldCheck,
  UserCheck,
  Smartphone,
  Sparkles,
  Bell,
  Search,
  ChevronDown
} from 'lucide-react';
import { UserRole, NotifikasiAlert } from '../types';

interface HeaderProps {
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedYear: number;
  setSelectedYear: (year: number) => void;
  onOpenMobileInspector: () => void;
  onOpenAiAssistant: () => void;
  onOpenNotifications: () => void;
  notifications: NotifikasiAlert[];
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  setCurrentRole,
  activeTab,
  setActiveTab,
  selectedYear,
  setSelectedYear,
  onOpenMobileInspector,
  onOpenAiAssistant,
  onOpenNotifications,
  notifications,
}) => {
  const unreadCount = notifications.filter((n) => !n.dibaca).length;

  const roleLabels: Record<UserRole, { title: string; color: string; desc: string }> = {
    supervisor: {
      title: 'Supervisor Pengawas Teknik',
      color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      desc: 'Pengendali Mutu & Approval Akhir',
    },
    auditor: {
      title: 'Auditor / Staf Pengawas',
      color: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
      desc: 'Input KKA & Uraian Temuan',
    },
    auditee: {
      title: 'Unit Kerja / Auditee',
      color: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      desc: 'Pelaksana Tindak Lanjut & Bukti',
    },
    pphp: {
      title: 'Personel PPHP',
      color: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
      desc: 'Pemeriksa Hasil PBJ & BA',
    },
    admin_spi: {
      title: 'Admin SPI / Direksi',
      color: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
      desc: 'Pengawasan Menyeluruh & Governance',
    },
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'pkpt', label: 'Program PKPT', icon: '📋' },
    { id: 'pemeriksaan', label: 'Pemeriksaan Digital', icon: '🔍' },
    { id: 'temuan', label: 'Temuan & Rekomendasi', icon: '⚠️' },
    { id: 'tindak-lanjut', label: 'Tindak Lanjut (Ps. 15c)', icon: '🔄' },
    { id: 'risiko', label: 'Manajemen Risiko (5x5)', icon: '🛡️' },
    { id: 'qa', label: 'Quality Assurance (QA)', icon: '🎯' },
    { id: 'evaluasi-bj', label: 'Evaluasi Barang/Jasa', icon: '📦' },
    { id: 'pphp', label: 'Pengelolaan PPHP', icon: '👥' },
    { id: 'knowledge', label: 'SOP & Knowledge', icon: '📚' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800">
      {/* Top Banner / Role & Global Actions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* Logo & Identity */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-950/40 ring-1 ring-cyan-400/30">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyan-300 bg-clip-text text-transparent">
                  ePTI
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-cyan-900/60 text-cyan-300 border border-cyan-700/50">
                  v2.6 Enterprise
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                e-Pengawas Teknik Terintegrasi • Satuan Pengawasan Intern
              </p>
            </div>
          </div>

          {/* Role Switcher & Action Tools */}
          <div className="flex items-center flex-wrap gap-2.5">
            {/* Year Selector */}
            <div className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1.5 rounded-lg border border-slate-700 text-xs">
              <span className="text-slate-400 font-medium">TA:</span>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer"
              >
                <option value={2026} className="bg-slate-800 text-white">2026 (Aktif)</option>
                <option value={2025} className="bg-slate-800 text-white">2025</option>
              </select>
            </div>

            {/* Role Switcher dropdown */}
            <div className="relative group">
              <div className="flex items-center gap-2 bg-slate-800/90 px-3 py-1.5 rounded-lg border border-slate-700 hover:border-slate-600 transition cursor-pointer">
                <UserCheck className="w-4 h-4 text-cyan-400" />
                <div className="text-left">
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider">Peran Pengguna</div>
                  <div className="text-xs font-semibold text-slate-100 flex items-center gap-1.5">
                    {roleLabels[currentRole].title}
                    <ChevronDown className="w-3 h-3 text-slate-400" />
                  </div>
                </div>
              </div>

              {/* Dropdown Menu */}
              <div className="absolute right-0 mt-1 w-64 bg-slate-800 rounded-xl shadow-2xl border border-slate-700 p-2 hidden group-hover:block z-50">
                <div className="text-[11px] font-semibold text-slate-400 px-2 py-1 mb-1">
                  PILIH PERSPEKTIF HAK AKSES
                </div>
                {(Object.keys(roleLabels) as UserRole[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => setCurrentRole(r)}
                    className={`w-full text-left px-2.5 py-2 rounded-lg text-xs transition flex flex-col gap-0.5 ${
                      currentRole === r
                        ? 'bg-cyan-500/20 text-cyan-300 font-medium border border-cyan-500/30'
                        : 'text-slate-300 hover:bg-slate-700/60'
                    }`}
                  >
                    <span className="font-semibold">{roleLabels[r].title}</span>
                    <span className="text-[10px] text-slate-400">{roleLabels[r].desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* AI Assistant Button */}
            <button
              onClick={onOpenAiAssistant}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-indigo-600/80 to-purple-600/80 hover:from-indigo-600 hover:to-purple-600 text-white text-xs font-semibold shadow-md shadow-indigo-950/30 border border-indigo-400/30 transition cursor-pointer"
              title="Buka AI Asisten Auditor Teknik"
            >
              <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
              <span>AI Asisten</span>
            </button>

            {/* Mobile Inspector Launcher */}
            <button
              onClick={onOpenMobileInspector}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700/80 text-cyan-300 hover:text-cyan-200 text-xs font-semibold border border-cyan-700/40 transition cursor-pointer"
              title="Simulasi Mobile Android Inspeksi Lapangan"
            >
              <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Mobile Lapangan</span>
            </button>

            {/* Notification Bell */}
            <button
              onClick={onOpenNotifications}
              className="relative p-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
              title="Notifikasi & Reminder"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Tab Navigation bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-1 overflow-x-auto scrollbar-none py-1.5 border-t border-slate-800/80">
          {navItems.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-950/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
