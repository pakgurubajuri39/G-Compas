import React from 'react';
import { StudentRegistration, AppSettings } from '../types';
import { Compass, Clock, CheckCircle2, Cpu, Zap, ArrowLeft, Rocket, AlertTriangle, ShieldCheck } from 'lucide-react';

interface OrientationProps {
  student: StudentRegistration;
  settings: AppSettings;
  onStartQuiz: () => void;
  onBack: () => void;
}

export const Orientation: React.FC<OrientationProps> = ({ student, settings, onStartQuiz, onBack }) => {
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      {/* Back button */}
      <button
        onClick={onBack}
        className="mb-6 inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Ubah Data Identitas</span>
      </button>

      {/* Main Orientation Box */}
      <div className="glass-card rounded-3xl p-6 sm:p-10 border border-purple-500/30 shadow-2xl relative overflow-hidden">
        {/* Decorative corner glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/20 rounded-full blur-[90px] pointer-events-none" />

        {/* Title & Personalized Greeting */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="text-xs font-semibold text-amber-400 uppercase tracking-widest flex items-center gap-1.5 mb-1">
              <Zap className="w-3.5 h-3.5" />
              <span>Protokol Inisialisasi Bakat</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white font-heading">
              Selamat Datang, <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-amber-300">{student.fullName}</span>!
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              SMP Asal: {student.schoolOrigin} • Kelas: {student.grade}
            </p>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-900/40 border border-purple-500/30 text-xs text-purple-200 self-start sm:self-center">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>Estimasi: <strong>10 – 15 Menit</strong></span>
          </div>
        </div>

        {/* Futuristic Mission Statement */}
        <div className="my-8 p-5 rounded-2xl bg-gradient-to-r from-purple-950/50 via-slate-900/80 to-indigo-950/50 border border-purple-500/30">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-600/30 border border-purple-500/50 flex items-center justify-center shrink-0 text-amber-400">
              <Cpu className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-heading">
                Orientasi Asesmen Potensi G-Compass
              </h2>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Asesmen ini <strong className="text-amber-300">bukanlah ujian tes kelulusan yang memiliki jawaban benar atau salah</strong>. G-Compass dirancang dengan algoritma multi-dimensi untuk memetakan kecenderungan alami cara berpikir, kepekaan indera, dan kekuatan terbesar yang tersimpan dalam DNA kepribadianmu.
              </p>
            </div>
          </div>
        </div>

        {/* 3 Modules Architecture */}
        <div className="space-y-4 mb-8">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Arsitektur 3 Modul Asesmen:
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Modul 1 */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/40 transition-all">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 font-bold text-xs flex items-center justify-center mb-3">
                01
              </div>
              <h4 className="text-sm font-bold text-white font-heading">
                Logika Akademik Dasar
              </h4>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                Mengevaluasi kecenderungan penalaran Sains (IPA) vs Pemikiran Sosial-Ekonomi & Kebijakan Publik (IPS).
              </p>
            </div>

            {/* Modul 2 */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/40 transition-all">
              <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 font-bold text-xs flex items-center justify-center mb-3">
                02
              </div>
              <h4 className="text-sm font-bold text-white font-heading">
                Kecerdasan Majemuk
              </h4>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                Mengukur 8 spektrum kecerdasan Howard Gardner: Logis, Spasial, Naturalis, Linguistik, Sosial, Reflektif, Musikal, & Kinestetik.
              </p>
            </div>

            {/* Modul 3 */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/40 transition-all">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 font-bold text-xs flex items-center justify-center mb-3">
                03
              </div>
              <h4 className="text-sm font-bold text-white font-heading">
                Talent Me
              </h4>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                Memetakan 3 klaster aksi utama: Thinking (Analitis/Strategis), Doing (Eksekusi/Praktis), dan Relating (Komunikasi/Empati).
              </p>
            </div>
          </div>
        </div>

        {/* Important Tips Checklist */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 mb-8 space-y-2 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Pilihlah jawaban yang paling menggambarkan <strong>diri Anda yang sebenarnya</strong>, bukan apa yang diharapkan orang lain.</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Tidak perlu terburu-buru. Percayalah pada insting spontan pertamamu.</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Kamu dapat meninjau kembali atau mengubah pilihan jawaban sebelum mengirim hasil final.</span>
          </div>
        </div>

        {/* Futuristic Action Button */}
        <div className="text-center pt-2">
          <button
            onClick={onStartQuiz}
            className="w-full sm:w-auto min-w-[280px] py-4 px-8 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-amber-500 hover:from-purple-500 hover:via-indigo-500 hover:to-amber-400 text-white font-extrabold text-base tracking-wider shadow-2xl shadow-purple-600/40 hover:shadow-purple-600/60 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 mx-auto group"
          >
            <Rocket className="w-5 h-5 text-amber-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
            <span>Aktifkan G-Compass AI</span>
          </button>
          <p className="text-[11px] text-slate-400 mt-3 font-mono">
            STATUS ENGINE: READY • SYSTEM ONLINE • SMA GENESIS MEDICARE
          </p>
        </div>
      </div>
    </div>
  );
};
