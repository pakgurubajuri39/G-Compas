import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { TestResult, AppSettings } from '../types';
import { RadarChart } from './RadarChart';
import {
  Compass,
  Award,
  Sparkles,
  Brain,
  Zap,
  Target,
  BookOpen,
  Briefcase,
  Users,
  HeartHandshake,
  RotateCcw,
  MessageCircle,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

interface ResultViewProps {
  result: TestResult;
  settings: AppSettings;
  onRetake: () => void;
}

export const ResultView: React.FC<ResultViewProps> = ({ result, settings, onRetake }) => {
  // Fire confetti celebration on mount
  useEffect(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#8b5cf6', '#f59e0b', '#3b82f6', '#10b981'],
      });
    } catch (e) {
      // Ignore if canvas-confetti fails
    }
  }, []);

  const getThemeDetails = () => {
    switch (result.recommendation) {
      case 'IPA':
        return {
          gradient: 'from-blue-600 via-indigo-600 to-cyan-500',
          badgeBg: 'bg-blue-950/70 border-blue-500/60 text-blue-300',
          iconColor: 'text-cyan-400',
          archetype: 'The Future Technologist & Scientist',
          tagline: 'Pemikir Logis, Eksperimenter Empiris, & Pencipta Masa Depan',
        };
      case 'IPS':
        return {
          gradient: 'from-purple-600 via-pink-600 to-amber-500',
          badgeBg: 'bg-purple-950/70 border-purple-500/60 text-purple-300',
          iconColor: 'text-amber-400',
          archetype: 'The Future Leader & Strategist',
          tagline: 'Komunikator Karismatik, Pembuat Kebijakan, & Visioner Sosial',
        };
      default:
        return {
          gradient: 'from-amber-500 via-purple-600 to-indigo-600',
          badgeBg: 'bg-amber-950/70 border-amber-500/60 text-amber-300',
          iconColor: 'text-amber-400',
          archetype: 'The Innovative Polymath',
          tagline: 'Penghubung Lintas Disiplin, Agile Innovator, & Problem Solver Holistik',
        };
    }
  };

  const theme = getThemeDetails();

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-10">
      {/* 1. HERO CONGRATULATIONS & MAIN RECOMMENDATION BANNER */}
      <div className="glass-card rounded-3xl p-6 sm:p-10 border border-purple-500/30 shadow-2xl relative overflow-hidden text-center">
        {/* Ambient Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-purple-600/20 rounded-full blur-[100px] pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-900/50 border border-purple-500/40 text-purple-300 text-xs font-semibold uppercase tracking-wider mb-4 shadow">
          <Award className="w-4 h-4 text-amber-400" />
          <span>Hasil Asesmen Resmi G-Compass AI</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-black text-white font-heading tracking-tight">
          Selamat, <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-purple-300 to-cyan-300">{result.fullName}</span>!
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          {result.schoolOrigin} • Kelas {result.grade} • ID: {result.id}
        </p>

        {/* Major Recommendation Card */}
        <div className="mt-8 max-w-3xl mx-auto p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-amber-500/40 shadow-xl relative">
          <div className="text-xs uppercase font-extrabold tracking-widest text-amber-400 mb-1">
            REKOMENDASI PENJURUSAN UTAMA:
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white font-heading mt-1">
            {result.recommendationTitle}
          </h2>

          <p className="text-sm font-medium text-slate-300 mt-2 max-w-xl mx-auto">
            {theme.tagline}
          </p>

          {/* Academic Logic Score Comparison */}
          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mt-6 pt-6 border-t border-slate-800">
            <div className="p-3 rounded-xl bg-slate-900/70 border border-blue-500/30">
              <div className="text-xs text-blue-400 font-semibold">Penalaran Sains (IPA)</div>
              <div className="text-2xl font-black text-white mt-0.5">{result.ipaScore} Poin</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/70 border border-purple-500/30">
              <div className="text-xs text-purple-400 font-semibold">Penalaran Sosial (IPS)</div>
              <div className="text-2xl font-black text-white mt-0.5">{result.ipsScore} Poin</div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. DUAL ANALYSIS GRID: RADAR CHART (GARDNER) & TALENT ME BAR */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Radar Chart Spider-Web */}
        <div className="lg:col-span-7 glass-card rounded-3xl p-6 sm:p-8 border border-purple-500/25 shadow-xl">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
            <div className="flex items-center gap-2.5">
              <Brain className="w-5 h-5 text-purple-400" />
              <div>
                <h3 className="text-base font-bold text-white font-heading">
                  Jaring Skor 8 Kecerdasan Majemuk
                </h3>
                <p className="text-xs text-slate-400">
                  Model Teori Kecerdasan Howard Gardner (0–100%)
                </p>
              </div>
            </div>
            <span className="text-xs font-mono text-cyan-400 font-semibold">
              Spider-Web Matrix
            </span>
          </div>

          {/* The Visual Radar Component */}
          <div className="py-2">
            <RadarChart scores={result.gardnerScores} size={420} />
          </div>

          <div className="mt-4 p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-center text-xs text-slate-400">
            Arahkan kursor atau sentuh titik sudut radar untuk melihat detail persentase tiap kecerdasan.
          </div>
        </div>

        {/* Right: Klaster Bakat Talent Me (Thinking, Doing, Relating) & Top 3 Bakat */}
        <div className="lg:col-span-5 space-y-6">
          {/* Talent Me Breakdown */}
          <div className="glass-card rounded-3xl p-6 sm:p-7 border border-purple-500/25 shadow-xl">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800 mb-4">
              <Zap className="w-5 h-5 text-amber-400" />
              <div>
                <h3 className="text-base font-bold text-white font-heading">
                  Klaster Bakat Talent Me
                </h3>
                <p className="text-xs text-slate-400">
                  Distribusi Energi Cara Kerja & Eksekusi
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Thinking */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-blue-300">THINKING (Analitis & Strategi)</span>
                  <span className="font-bold text-white">{result.talentDnaScores.thinking}%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-700"
                    style={{ width: `${result.talentDnaScores.thinking}%` }}
                  />
                </div>
              </div>

              {/* Doing */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-amber-300">DOING (Eksekusi & Praktis)</span>
                  <span className="font-bold text-white">{result.talentDnaScores.doing}%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-orange-400 rounded-full transition-all duration-700"
                    style={{ width: `${result.talentDnaScores.doing}%` }}
                  />
                </div>
              </div>

              {/* Relating */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-purple-300">RELATING (Komunikasi & Empati)</span>
                  <span className="font-bold text-white">{result.talentDnaScores.relating}%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-400 rounded-full transition-all duration-700"
                    style={{ width: `${result.talentDnaScores.relating}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Top 3 Bakat Dominan Cards */}
          <div className="glass-card rounded-3xl p-6 sm:p-7 border border-amber-500/30 shadow-xl">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800 mb-4">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <div>
                <h3 className="text-base font-bold text-white font-heading">
                  Top 3 Bakat Rahasiamu
                </h3>
                <p className="text-xs text-slate-400">
                  Potensi Keunggulan Terbesar Berdasarkan DNA Profilmu
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {result.topTalents.map((talent, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-amber-400/40 transition-all flex items-start gap-3"
                >
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-500 to-purple-600 text-slate-950 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                    #{idx + 1}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white font-heading">{talent}</h4>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Kombinasi nalar unggul yang menjadi motor penggerak prestasimu di masa depan.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3. DEEP DIVE: GAYA BELAJAR, KARIR, & EKSKUL GENESIS MEDICARE */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Gaya Belajar */}
        <div className="glass-card rounded-3xl p-6 border border-purple-500/25 shadow-xl flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-4">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white font-heading mb-2">
              Gaya Belajar Ideal
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {result.learningStyle}
            </p>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-800 text-[11px] text-purple-300 font-medium">
            💡 Terapkan gaya ini agar nilai akademis melonjak maksimal.
          </div>
        </div>

        {/* Karir Masa Depan */}
        <div className="glass-card rounded-3xl p-6 border border-purple-500/25 shadow-xl flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-4">
              <Briefcase className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white font-heading mb-2">
              Peluang Karir Masa Depan
            </h3>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {result.careerProspects.map((career, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                  <span>{career}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-800 text-[11px] text-amber-300 font-medium">
            🚀 Karir berpenghasilan tinggi & relevan era Society 5.0.
          </div>
        </div>

        {/* Ekskul SMA Genesis Medicare */}
        <div className="glass-card rounded-3xl p-6 border border-purple-500/25 shadow-xl flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white font-heading mb-2">
              Ekskul Pendukung di SMA GM
            </h3>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {result.recommendedExtracurriculars.map((ekskul, i) => (
                <li key={i} className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{ekskul}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-800 text-[11px] text-emerald-300 font-medium">
            🏫 Tersedia fasilitas laboratorium & bimbingan pelatih profesional.
          </div>
        </div>
      </div>

      {/* 4. PESAN PENYEMANGAT & SURAT MOTIVASI DARI SMA GENESIS MEDICARE */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-amber-500/30 shadow-2xl relative overflow-hidden">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-white font-heading">
              Pesan Penyemangat Khusus untuk Ananda {result.fullName}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic">
              "Setiap individu terlahir dengan kombinasi DNA keunikan yang tak ternilai. Rekomendasi <strong>{result.recommendationTitle}</strong> ini adalah peta kompas awal untuk menavigasi masa depanmu. Di <strong>SMA Genesis Medicare</strong>, kami tidak hanya mendidik kecerdasan akademis, namun kami memfasilitasi setiap percikan bakat unikmu untuk bertransformasi menjadi mahakarya dan kepemimpinan masa depan. Beranilah bermimpi besar, melangkahlah dengan keyakinan penuh!"
            </p>
            <div className="pt-2 text-xs font-semibold text-amber-300">
              — Tim Konseling & Pembinaan Karir SMA Genesis Medicare
            </div>
          </div>
        </div>
      </div>

      {/* 5. NOTICE TENTANG SERTIFIKAT (Sertifikat Eksklusif Diunduh oleh Admin) & CALL TO ACTIONS */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-purple-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-xs text-slate-300 text-center sm:text-left">
          <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0" />
          <span>
            <strong>Catatan Dokumen Resmi:</strong> Sertifikat Profil Bakat & Penjurusan Resmi Open House yang bertanda tangan dan berstempel resmi kepala sekolah diterbitkan dan diunduh oleh panitia/Admin SMA Genesis Medicare.
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
          {(() => {
            const rawWa = (settings.whatsappNumber || '081289123456').replace(/[^0-9]/g, '');
            const targetWa = rawWa.startsWith('0') ? '62' + rawWa.slice(1) : rawWa;
            return (
              <a
                href={`https://wa.me/${targetWa}?text=Halo%20Panitia%20SMA%20Genesis%20Medicare,%20saya%20${encodeURIComponent(result.fullName)}%20dari%20${encodeURIComponent(result.schoolOrigin)}%20telah%20menyelesaikan%20asesmen%20G-Compass%20dengan%20rekomendasi%20${encodeURIComponent(result.recommendation)}.%20Saya%20ingin%20berkonsultasi%20lebih%20lanjut.`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Konsultasi via WhatsApp</span>
              </a>
            );
          })()}

          <button
            onClick={onRetake}
            className="px-5 py-3 rounded-xl bg-purple-900/60 hover:bg-purple-800/80 text-purple-200 border border-purple-500/40 font-bold text-xs flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Asesmen Ulang</span>
          </button>
        </div>
      </div>
    </div>
  );
};
