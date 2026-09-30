// Utility helpers for ePTI

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDateIndo(dateStr: string): string {
  if (!dateStr) return '-';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

export function getRiskColor(level: 'Rendah' | 'Sedang' | 'Tinggi' | 'Ekstrem'): {
  bg: string;
  text: string;
  border: string;
  badge: string;
} {
  switch (level) {
    case 'Ekstrem':
      return {
        bg: 'bg-red-950/40',
        text: 'text-red-400',
        border: 'border-red-800/60',
        badge: 'bg-red-500/20 text-red-300 border border-red-500/30',
      };
    case 'Tinggi':
      return {
        bg: 'bg-amber-950/40',
        text: 'text-amber-400',
        border: 'border-amber-800/60',
        badge: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
      };
    case 'Sedang':
      return {
        bg: 'bg-yellow-950/40',
        text: 'text-yellow-400',
        border: 'border-yellow-800/60',
        badge: 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30',
      };
    case 'Rendah':
    default:
      return {
        bg: 'bg-emerald-950/40',
        text: 'text-emerald-400',
        border: 'border-emerald-800/60',
        badge: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
      };
  }
}

export function getStatusBadge(status: string): string {
  switch (status.toLowerCase()) {
    case 'closed':
    case 'selesai':
    case 'tuntas terkendali':
    case 'disetujui':
    case 'bap terbit':
    case 'sangat baik':
    case 'layak':
    case 'sesuai 100%':
      return 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30';
    case 'progress':
    case 'berjalan':
    case 'on progress':
    case 'baik':
    case 'diverifikasi pphp':
    case 'sedang bertugas':
    case 'deviasi minor':
    case 'layak dengan catatan':
      return 'bg-blue-500/20 text-blue-300 border border-blue-500/30';
    case 'verifikasi':
    case 'terjadwal':
    case 'cukup':
      return 'bg-purple-500/20 text-purple-300 border border-purple-500/30';
    case 'open':
    case 'draft':
    case 'belum mitigasi':
    case 'siap tugas':
    case 'kurang':
    case 'tidak layak':
    case 'deviasi mayor':
      return 'bg-amber-500/20 text-amber-300 border border-amber-500/30';
    case 'ekstrem':
    case 'revisi':
    case 'cuti / non-aktif':
      return 'bg-rose-500/20 text-rose-300 border border-rose-500/30';
    default:
      return 'bg-slate-700/50 text-slate-300 border border-slate-600/30';
  }
}
