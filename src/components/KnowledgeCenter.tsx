import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  Download,
  CheckCircle,
  HelpCircle,
  FileText,
  Award,
  ExternalLink,
  Sparkles,
  Users,
  Eye
} from 'lucide-react';
import { KnowledgeItem, UserRole } from '../types';

interface KnowledgeCenterProps {
  knowledgeList: KnowledgeItem[];
  currentRole: UserRole;
}

export const KnowledgeCenter: React.FC<KnowledgeCenterProps> = ({
  knowledgeList,
  currentRole,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeQuizDoc, setActiveQuizDoc] = useState<KnowledgeItem | null>(null);

  // Quiz state
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);

  // Reading status tracker
  const [readItems, setReadItems] = useState<Record<string, boolean>>({
    'KNOW-01': true,
  });

  const handleMarkAsRead = (id: string) => {
    setReadItems({ ...readItems, [id]: true });
  };

  const handleStartQuiz = (doc: KnowledgeItem) => {
    setActiveQuizDoc(doc);
    setUserAnswers({});
    setQuizSubmitted(false);
    setQuizScore(null);
  };

  const handleSubmitQuiz = () => {
    if (!activeQuizDoc || !activeQuizDoc.kuisSoal) return;

    let correctCount = 0;
    activeQuizDoc.kuisSoal.forEach((q, idx) => {
      if (userAnswers[idx] === q.kunciJawaban) {
        correctCount++;
      }
    });

    const score = Math.round((correctCount / activeQuizDoc.kuisSoal.length) * 100);
    setQuizScore(score);
    setQuizSubmitted(true);
    handleMarkAsRead(activeQuizDoc.id);
  };

  const filtered = knowledgeList.filter((k) => {
    const matchSearch =
      k.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
      k.nomorDokumen.toLowerCase().includes(searchTerm.toLowerCase()) ||
      k.ringkasan.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = selectedCategory === 'All' || k.kategori === selectedCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-cyan-400" />
            SOP, Regulasi & Knowledge Center SPI
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Pusat pedoman teknis, standar SNI PUPR, regulasi PBJ, dan evaluasi pemahaman (Kuis SOP) bagi seluruh auditor & pengawas.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-800 p-2 rounded-xl border border-slate-700 text-xs">
          <span className="text-slate-400">Tingkat Literasi SOP Anda:</span>
          <span className="font-bold text-emerald-400">
            {Object.keys(readItems).length} / {knowledgeList.length} Pedoman Telah Dibaca
          </span>
        </div>
      </div>

      {/* Filter and Category Pills */}
      <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700/80 shadow-md space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Cari SOP, nomor dokumen, pedoman uji petik, SNI..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-900 text-xs text-white rounded-xl border border-slate-700 focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-slate-400 font-semibold mr-1">Kategori:</span>
          {['All', 'SOP', 'Pedoman', 'Standar SNI', 'Regulasi'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-700'
              }`}
            >
              {cat === 'All' ? 'Semua Dokumen' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* REPOSITORY GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((item) => {
          const isRead = !!readItems[item.id];
          return (
            <div
              key={item.id}
              className="p-5 bg-slate-800/80 rounded-2xl border border-slate-700/80 hover:border-slate-600 transition shadow-lg space-y-3.5 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] uppercase font-bold px-2.5 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-800/60">
                    {item.kategori}
                  </span>
                  <span className="font-mono text-[11px] text-slate-400 font-bold">{item.nomorDokumen}</span>
                </div>

                <h3 className="text-sm font-bold text-white leading-snug">{item.judul}</h3>

                <p className="text-xs text-slate-300 leading-relaxed">{item.ringkasan}</p>
              </div>

              <div className="pt-3 border-t border-slate-700/60 space-y-2 text-xs">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-slate-500" />
                    Dibaca {item.totalDibaca} kali oleh staf
                  </span>
                  {isRead ? (
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      ✓ Telah Dipelajari
                    </span>
                  ) : (
                    <span className="text-amber-400">Belum Dibaca</span>
                  )}
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => handleMarkAsRead(item.id)}
                    className="flex-1 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Unduh Dokumen</span>
                  </button>

                  {item.kuisTersedia && (
                    <button
                      onClick={() => handleStartQuiz(item)}
                      className="px-3.5 py-1.5 bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/40 rounded-xl text-xs font-bold flex items-center gap-1 transition cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                      <span>Uji Pemahaman (Kuis)</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL: KUIS PEMAHAMAN SOP */}
      {activeQuizDoc && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-2xl max-w-xl w-full border border-slate-700 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700">
              <div>
                <span className="text-[10px] uppercase font-bold text-yellow-300">Evaluasi Pemahaman Staf</span>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-cyan-400" />
                  Kuis: {activeQuizDoc.judul}
                </h3>
              </div>
              <button
                onClick={() => setActiveQuizDoc(null)}
                className="text-slate-400 hover:text-white text-xl font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Questions List */}
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1 text-xs">
              {activeQuizDoc.kuisSoal?.map((soal, idx) => (
                <div key={idx} className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-700/60 space-y-2">
                  <div className="font-bold text-white">
                    {idx + 1}. {soal.pertanyaan}
                  </div>

                  <div className="space-y-1.5 pl-2">
                    {soal.pilihan.map((pil, pIdx) => {
                      const isSelected = userAnswers[idx] === pIdx;
                      const isCorrect = pIdx === soal.kunciJawaban;

                      let pillClass = 'bg-slate-800 text-slate-300 hover:bg-slate-700';
                      if (quizSubmitted) {
                        if (isCorrect) pillClass = 'bg-emerald-950/80 border-emerald-500 text-emerald-300 font-bold';
                        else if (isSelected && !isCorrect) pillClass = 'bg-rose-950/80 border-rose-500 text-rose-300';
                      } else if (isSelected) {
                        pillClass = 'bg-cyan-600/30 border-cyan-400 text-cyan-200 font-semibold';
                      }

                      return (
                        <button
                          key={pIdx}
                          type="button"
                          disabled={quizSubmitted}
                          onClick={() => setUserAnswers({ ...userAnswers, [idx]: pIdx })}
                          className={`w-full text-left p-2 rounded-lg border border-slate-700 text-xs transition cursor-pointer flex items-center gap-2 ${pillClass}`}
                        >
                          <span className="w-4 h-4 rounded-full border border-slate-500 flex items-center justify-center text-[10px]">
                            {String.fromCharCode(65 + pIdx)}
                          </span>
                          <span>{pil}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Score Result */}
            {quizSubmitted && quizScore !== null && (
              <div className="p-4 bg-slate-900 rounded-xl border border-slate-700 text-center space-y-1">
                <span className="text-xs text-slate-400 font-semibold">Skor Pemahaman SOP Anda:</span>
                <div className={`text-3xl font-black ${quizScore >= 70 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {quizScore} / 100
                </div>
                <p className="text-xs font-semibold text-slate-300">
                  {quizScore >= 70
                    ? '🎉 Selamat! Anda telah LULUS evaluasi pemahaman SOP dan tersertifikasi secara internal.'
                    : 'Mohon pelajari kembali dokumen SOP dan ulangi kuis evaluasi.'}
                </p>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-700">
              <button
                onClick={() => setActiveQuizDoc(null)}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-xs font-semibold cursor-pointer"
              >
                Tutup
              </button>
              {!quizSubmitted ? (
                <button
                  onClick={handleSubmitQuiz}
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  Kirim Jawaban Kuis
                </button>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
