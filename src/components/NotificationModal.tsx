import React from 'react';
import {
  Bell,
  CheckCircle,
  AlertTriangle,
  Info,
  Clock,
  ArrowRight,
  ShieldAlert,
  Send,
  ExternalLink
} from 'lucide-react';
import { NotifikasiAlert } from '../types';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotifikasiAlert[];
  onMarkAsRead: (id: string) => void;
  onNavigateTab: (tabId: string) => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onNavigateTab,
}) => {
  if (!isOpen) return null;

  const getIcon = (type: NotifikasiAlert['tipe']) => {
    switch (type) {
      case 'critical':
        return <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />;
      case 'info':
      default:
        return <Info className="w-5 h-5 text-cyan-400 shrink-0" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-2xl max-w-lg w-full border border-slate-700 shadow-2xl p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-700">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white">
              Pusat Notifikasi & Reminder ePTI
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-xl font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Integration Channels indicator */}
        <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-700/60 flex items-center justify-between text-[11px] text-slate-300">
          <span>Kanal Notifikasi Terhubung:</span>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-800/60 font-semibold">
              WhatsApp Gateway
            </span>
            <span className="px-2 py-0.5 rounded bg-blue-950/60 text-blue-300 border border-blue-800/60 font-semibold">
              Email Dinas
            </span>
          </div>
        </div>

        {/* Notification list */}
        <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => onMarkAsRead(notif.id)}
              className={`p-3.5 rounded-xl border transition cursor-pointer flex items-start gap-3 ${
                notif.dibaca
                  ? 'bg-slate-900/40 border-slate-800 text-slate-400'
                  : 'bg-slate-900/90 border-slate-700 text-slate-200 shadow-md'
              }`}
            >
              {getIcon(notif.tipe)}

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white">{notif.judul}</h4>
                  <span className="text-[10px] text-slate-400">{notif.waktu}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{notif.pesan}</p>

                {notif.linkTab && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onClose();
                      onNavigateTab(notif.linkTab!);
                    }}
                    className="mt-1 text-[11px] text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <span>Buka Modul Terkait</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          ))}

          {notifications.length === 0 && (
            <div className="text-center py-8 text-xs text-slate-400">
              Tidak ada notifikasi aktif saat ini.
            </div>
          )}
        </div>

        <div className="flex justify-end pt-2 border-t border-slate-700">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-xs font-semibold cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
