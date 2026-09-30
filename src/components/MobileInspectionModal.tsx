import React, { useState, useRef } from 'react';
import {
  Smartphone,
  Camera,
  MapPin,
  CheckCircle,
  XCircle,
  Wifi,
  WifiOff,
  PenTool,
  UploadCloud,
  Check,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { MobileInspectionSubmission } from '../types';

interface MobileInspectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitMobileReport: (report: MobileInspectionSubmission) => void;
}

export const MobileInspectionModal: React.FC<MobileInspectionModalProps> = ({
  isOpen,
  onClose,
  onSubmitMobileReport,
}) => {
  const [isOffline, setIsOffline] = useState(false);
  const [inspekturNama, setInspekturNama] = useState('Ahmad Fauzan (Auditor SPI Lapangan)');
  const [namaObjek, setNamaObjek] = useState('Jembatan Akses Tol Segmen IV - Pier P-14');
  const [cuaca, setCuaca] = useState('Cerah Berawan (31°C)');
  const [gpsLocation, setGpsLocation] = useState('-6.178492, 106.631891 (Tangerang Proyek)');

  // Checklist items
  const [checklist, setChecklist] = useState([
    { item: 'Uji visual retak beton dan kerapatan bekisting', status: 'OK' as 'OK' | 'NOK', catatan: 'Retak rambut tidak ada' },
    { item: 'Verifikasi pemakaian APD helm dan safety harness', status: 'OK' as 'OK' | 'NOK', catatan: 'Kepatuhan K3 100%' },
    { item: 'Pemeriksaan elevasi bekisting pilar total station', status: 'NOK' as 'OK' | 'NOK', catatan: 'Deviasi +15 mm di atas batas' },
    { item: 'Ketersediaan drainase galian saat hujan', status: 'OK' as 'OK' | 'NOK', catatan: 'Pompa aktif' },
  ]);

  // Photo
  const [fotoUrl, setFotoUrl] = useState('https://images.unsplash.com/photo-1541888946425-d0fbb18f15f7?auto=format&fit=crop&w=600&q=80');

  // Digital Signature Canvas
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  if (!isOpen) return null;

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    setHasSignature(true);
    const rect = canvas.getBoundingClientRect();
    const x = ('clientX' in e ? e.clientX : e.touches[0].clientX) - rect.left;
    const y = ('clientY' in e ? e.clientY : e.touches[0].clientY) - rect.top;

    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#06b6d4'; // cyan
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ('clientX' in e ? e.clientX : e.touches[0].clientX) - rect.left;
    const y = ('clientY' in e ? e.clientY : e.touches[0].clientY) - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };

  const handleToggleChecklist = (index: number, newStatus: 'OK' | 'NOK') => {
    const updated = [...checklist];
    updated[index].status = newStatus;
    setChecklist(updated);
  };

  const handleUpdateChecklistCatatan = (index: number, val: string) => {
    const updated = [...checklist];
    updated[index].catatan = val;
    setChecklist(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const submission: MobileInspectionSubmission = {
      id: `MOB-${Date.now().toString().slice(-4)}`,
      inspekturNama,
      tanggalJam: new Date().toLocaleString('id-ID'),
      lokasiGps: gpsLocation,
      namaObjek,
      kondisiCuaca: cuaca,
      statusOfflineSync: isOffline ? 'Draft Offline' : 'Tersinkronisasi',
      checklistResults: checklist,
      fotoEvidenceUrl: fotoUrl,
      tandaTanganDigital: hasSignature ? 'Valid e-Sign' : 'None',
    };

    onSubmitMobileReport(submission);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3">
      {/* Android Device Simulator Shell */}
      <div className="bg-slate-950 w-full max-w-sm rounded-[2.5rem] border-[6px] border-slate-700 shadow-2xl overflow-hidden flex flex-col h-[740px] max-h-[95vh] relative ring-1 ring-cyan-500/30">
        {/* Device Speaker & Camera Notch */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-4 bg-slate-900 rounded-full flex items-center justify-center gap-2 z-30">
          <div className="w-2 h-2 rounded-full bg-slate-800" />
          <div className="w-8 h-1 rounded-full bg-slate-800" />
        </div>

        {/* Android Status Bar */}
        <div className="pt-6 px-5 pb-2 bg-slate-900 flex items-center justify-between text-[11px] text-slate-400 font-mono select-none">
          <span>09:41</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsOffline(!isOffline)}
              className="flex items-center gap-1 cursor-pointer"
              title="Toggle Offline Mode"
            >
              {isOffline ? (
                <span className="text-amber-400 flex items-center gap-0.5 font-sans font-bold">
                  <WifiOff className="w-3.5 h-3.5" /> Offline
                </span>
              ) : (
                <span className="text-emerald-400 flex items-center gap-0.5 font-sans font-bold">
                  <Wifi className="w-3.5 h-3.5" /> 4G LTE
                </span>
              )}
            </button>
            <span className="text-slate-300">89% 🔋</span>
          </div>
        </div>

        {/* App Title Header Inside Phone */}
        <div className="p-3.5 bg-gradient-to-r from-cyan-900/60 to-blue-900/60 border-b border-cyan-800/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-cyan-400" />
            <div>
              <div className="text-xs font-black text-white">ePTI Mobile Lapangan</div>
              <div className="text-[10px] text-cyan-300 font-medium">Digital Inspection Form</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-xs font-bold px-2 py-1 bg-slate-800 rounded-lg cursor-pointer"
          >
            Keluar
          </button>
        </div>

        {/* Scrollable Form Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs text-slate-200">
          {/* Metadata Section */}
          <div className="space-y-2 p-3 bg-slate-900 rounded-xl border border-slate-800">
            <div>
              <label className="text-[10px] text-slate-400 font-semibold block">Objek Pemeriksaan:</label>
              <input
                type="text"
                value={namaObjek}
                onChange={(e) => setNamaObjek(e.target.value)}
                className="w-full bg-slate-800 px-2.5 py-1.5 rounded-lg text-white font-semibold text-xs border border-slate-700"
              />
            </div>

            {/* GPS Watermark Simulation */}
            <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-mono bg-emerald-950/40 p-2 rounded-lg border border-emerald-800/40">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span>GPS Tag: {gpsLocation}</span>
            </div>
          </div>

          {/* Camera Field Photo Section */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-white flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Camera className="w-3.5 h-3.5 text-cyan-400" /> Foto Lapangan (Geotagged):
              </span>
              <span className="text-[10px] text-cyan-400">Timestamp Watermark Aktif</span>
            </label>

            <div className="relative rounded-xl overflow-hidden border border-slate-700 h-36 bg-slate-900">
              <img
                src={fotoUrl}
                alt="Foto Geotagged Lapangan"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-1.5 left-2 bg-black/75 backdrop-blur-xs px-2 py-1 rounded text-[9px] font-mono text-cyan-300">
                <div>LAT/LONG: {gpsLocation.slice(0, 22)}</div>
                <div>TIME: {new Date().toLocaleString('id-ID')}</div>
              </div>
            </div>
          </div>

          {/* Interactive Inspection Checklist */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-white block">Checklist Kelaikan Lapangan:</label>
            <div className="space-y-2">
              {checklist.map((item, idx) => (
                <div key={idx} className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[11px] font-semibold text-slate-200">{item.item}</span>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleToggleChecklist(idx, 'OK')}
                        className={`px-2 py-1 rounded text-[10px] font-bold cursor-pointer ${
                          item.status === 'OK' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        OK
                      </button>
                      <button
                        type="button"
                        onClick={() => handleToggleChecklist(idx, 'NOK')}
                        className={`px-2 py-1 rounded text-[10px] font-bold cursor-pointer ${
                          item.status === 'NOK' ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        NOK
                      </button>
                    </div>
                  </div>
                  <input
                    type="text"
                    placeholder="Catatan inspektur..."
                    value={item.catatan}
                    onChange={(e) => handleUpdateChecklistCatatan(idx, e.target.value)}
                    className="w-full bg-slate-800 px-2 py-1 rounded text-[10px] text-white border border-slate-700"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Digital Signature Pad */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white flex items-center gap-1">
                <PenTool className="w-3.5 h-3.5 text-cyan-400" />
                Tanda Tangan Elektronik Pengawas:
              </span>
              <button
                type="button"
                onClick={clearSignature}
                className="text-[10px] text-slate-400 hover:text-white flex items-center gap-0.5 cursor-pointer"
              >
                <RotateCcw className="w-2.5 h-2.5" /> Reset
              </button>
            </div>

            <div className="bg-slate-900 rounded-xl border border-slate-700 p-1">
              <canvas
                ref={canvasRef}
                width={300}
                height={80}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className="w-full h-20 rounded-lg cursor-crosshair bg-slate-950"
              />
              <div className="text-center text-[9px] text-slate-500 pb-0.5">
                {hasSignature ? '✓ Tanda Tangan Terekam' : 'Sentuh atau seret kursor untuk menandatangani'}
              </div>
            </div>
          </div>
        </div>

        {/* Android Footer Action Button */}
        <div className="p-3 bg-slate-900 border-t border-slate-800">
          <button
            onClick={handleSubmit}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-950/40 cursor-pointer"
          >
            <UploadCloud className="w-4 h-4" />
            <span>{isOffline ? 'Simpan di Draft Offline' : 'Kirim Laporan Lapangan ke ePTI'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
