import React, { useState } from 'react';
import { TestResult, AppSettings } from '../types';
import {
  X,
  Brain,
  Zap,
  Sparkles,
  Award,
  BookOpen,
  Briefcase,
  Users,
  Compass,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Phone,
  Printer,
  FileText,
  School,
  HeartHandshake,
  Target
} from 'lucide-react';

interface CounselorDetailModalProps {
  student: TestResult;
  settings: AppSettings;
  onClose: () => void;
}

export const CounselorDetailModal: React.FC<CounselorDetailModalProps> = ({ student, settings, onClose }) => {
  const [activeSubTab, setActiveSubTab] = useState<'diagnosis' | 'gardner' | 'talentme' | 'interview_guide' | 'curriculum'>('diagnosis');

  const diffScore = student.ipaScore - student.ipsScore;

  // Gardner categorizer
  const getGardnerCategory = (score: number) => {
    if (score >= 80) return { label: 'Sangat Dominan (Tinggi)', color: 'text-emerald-400 bg-emerald-950/60 border-emerald-500/40' };
    if (score >= 65) return { label: 'Berkembang Baik (Optimal)', color: 'text-blue-400 bg-blue-950/60 border-blue-500/40' };
    return { label: 'Perlu Stimulasi / Dukungan', color: 'text-amber-400 bg-amber-950/60 border-amber-500/40' };
  };

  const gardnerInterpretations: Record<keyof typeof student.gardnerScores, { title: string; desc: string; counselTip: string }> = {
    logical: {
      title: 'Logis-Matematis',
      desc: 'Kemampuan mengurai pola angka, penalaran deduktif, kalkulasi sistematis, dan pemecahan masalah algoritmis.',
      counselTip: 'Siswa cepat memahami konsep abstrak matematis. Sangat cocok diberikan tantangan soal HOTS (Higher Order Thinking Skills).',
    },
    spatial: {
      title: 'Visual-Spasial',
      desc: 'Imajinasi bentuk 3D, orientasi ruang, kepekaan warna visual, dan kemampuan mengubah gagasan konsep menjadi visual.',
      counselTip: 'Gunakan diagram alur, mind map berwarna, atau model maket fisik ketika menjelaskan materi rumit.',
    },
    naturalist: {
      title: 'Naturalis',
      desc: 'Kepekaan terhadap fenomena alam, klasifikasi flora-fauna, ekologi lingkungan hidup, dan proses biologis.',
      counselTip: 'Sangat responsif pada praktikum lab luar ruangan (outdoor research) dan studi kasus isu lingkungan hidup nyata.',
    },
    linguistic: {
      title: 'Linguistik-Verbal',
      desc: 'Kecakapan memilih kata, menyusun kalimat persuasif, membaca kritis, dan berekspresi secara lisan/tulisan.',
      counselTip: 'Dorong siswa aktif dalam debat ilmiah, penulisan esai, atau menjadi juru bicara kelompok.',
    },
    interpersonal: {
      title: 'Interpersonal (Sosial)',
      desc: 'Kemampuan membaca bahasa tubuh orang lain, empati tinggi, memimpin kelompok, dan mencairkan konflik sosial.',
      counselTip: 'Potensial sebagai ketua tim, koordinator riset, atau perwakilan sekolah dalam ajang kepemimpinan siswa.',
    },
    intrapersonal: {
      title: 'Intrapersonal (Refleksi)',
      desc: 'Pemahaman mendalam terhadap kekuatan, kelemahan, regulasi emosi, dan motivasi intrinsik diri sendiri.',
      counselTip: 'Berikan ruang untuk refleksi mandiri. Siswa ini bekerja paling produktif ketika memahami tujuan filosofis dari suatu tugas.',
    },
    musical: {
      title: 'Musikal-Ritmik',
      desc: 'Kepekaan terhadap harmoni nada, tempo ritme ketukan, struktur pola suara, dan ekspresi auditif.',
      counselTip: 'Belajar dengan iringan ritme atau musik instrumental membantu mempertahankan fokus konsentrasinya.',
    },
    kinesthetic: {
      title: 'Kinestetik-Badani',
      desc: 'Koordinasi fisik motorik halus/kasar, kelincahan, daya tahan gerak, dan memori belajar berbasis tindakan fisik nyata.',
      counselTip: 'Hindari metode ceramah pasif berdurasi panjang. Libatkan gerakan tangan, eksperimen langsung, atau simulasi gerak.',
    },
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="w-full max-w-5xl glass-card rounded-3xl border border-purple-500/40 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Modal Top Bar */}
        <div className="p-5 sm:p-6 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-amber-500 p-0.5 flex items-center justify-center shadow-lg">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-amber-400">
                <Brain className="w-6 h-6" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-purple-900/60 border border-purple-500/40 text-[10px] font-bold text-purple-300 uppercase tracking-wider">
                  Dossier Konselor Khusus Admin
                </span>
                <span className="text-slate-400 text-xs">• ID: {student.id.substring(0, 10)}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white font-heading mt-0.5">
                {student.fullName}
              </h2>
              <p className="text-xs text-slate-400">
                {student.schoolOrigin} • Kelas {student.grade} • No. WA: {student.studentPhone} (Ortu: {student.parentPhone})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="Cetak Lembar Konseling"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Cetak</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Tutup"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Modal Navigation Subtabs */}
        <div className="px-6 border-b border-slate-800/80 bg-slate-950/60 flex gap-2 overflow-x-auto shrink-0 text-xs font-bold">
          <button
            onClick={() => setActiveSubTab('diagnosis')}
            className={`py-3 px-3.5 border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
              activeSubTab === 'diagnosis'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>1. Diagnostik & Rekomendasi Penjurusan</span>
          </button>

          <button
            onClick={() => setActiveSubTab('gardner')}
            className={`py-3 px-3.5 border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
              activeSubTab === 'gardner'
                ? 'border-purple-400 text-purple-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Brain className="w-4 h-4" />
            <span>2. Rincian 8 Kecerdasan Gardner</span>
          </button>

          <button
            onClick={() => setActiveSubTab('talentme')}
            className={`py-3 px-3.5 border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
              activeSubTab === 'talentme'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>3. Klaster Bakat Talent Me</span>
          </button>

          <button
            onClick={() => setActiveSubTab('interview_guide')}
            className={`py-3 px-3.5 border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
              activeSubTab === 'interview_guide'
                ? 'border-emerald-400 text-emerald-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <HeartHandshake className="w-4 h-4" />
            <span>4. Panduan Wawancara Konselor & Ortu</span>
          </button>

          <button
            onClick={() => setActiveSubTab('curriculum')}
            className={`py-3 px-3.5 border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
              activeSubTab === 'curriculum'
                ? 'border-pink-400 text-pink-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <School className="w-4 h-4" />
            <span>5. Kurikulum & Ekskul SMA GM</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-200">
          {/* TAB 1: DIAGNOSTIK & REKOMENDASI PENJURUSAN */}
          {activeSubTab === 'diagnosis' && (
            <div className="space-y-6">
              {/* Highlight Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-950/70 via-slate-900/90 to-indigo-950/70 border border-purple-500/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                    Hasil Rekomendasi Resmi Sistem
                  </div>
                  <h3 className="text-2xl font-black text-white font-heading mt-1">
                    {student.recommendationTitle}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 max-w-xl">
                    Berdasarkan selisih skor logika penalaran sains (IPA: {student.ipaScore}) vs sosial-ekonomi (IPS: {student.ipsScore}) dengan selisih {Math.abs(diffScore)} poin.
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-center p-3 rounded-xl bg-slate-900/80 border border-blue-500/40">
                    <span className="text-[10px] text-blue-400 font-bold block">Skor Sains (IPA)</span>
                    <span className="text-2xl font-black text-white">{student.ipaScore}</span>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-slate-900/80 border border-purple-500/40">
                    <span className="text-[10px] text-purple-400 font-bold block">Skor Sosial (IPS)</span>
                    <span className="text-2xl font-black text-white">{student.ipsScore}</span>
                  </div>
                </div>
              </div>

              {/* Comprehensive Diagnostic Insights Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Gaya Kognitif */}
                <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                  <div className="flex items-center gap-2 text-sm font-bold text-white font-heading">
                    <BookOpen className="w-4 h-4 text-purple-400" />
                    <span>Gaya Belajar & Proses Informasi Kognitif</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    <strong>Gaya Dominan:</strong> {student.learningStyle}
                  </p>
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-300 space-y-1">
                    <div className="font-semibold text-amber-300">Catatan Khusus Pengajar Kelas X:</div>
                    <p>
                      Siswa ini memiliki kemampuan terbaik saat konsep abstrak langsung dikaitkan dengan aplikasi nyata. Guru pengampu disarankan memberikan proyek studi terapan daripada hafalan rumus tekstual murni.
                    </p>
                  </div>
                </div>

                {/* Potensi Karir Strategis */}
                <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                  <div className="flex items-center gap-2 text-sm font-bold text-white font-heading">
                    <Briefcase className="w-4 h-4 text-amber-400" />
                    <span>Peta Prospek Karir Masa Depan (Era Society 5.0)</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {student.careerProspects.map((c, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Identitas Kontak Lengkap Siswa & Wali */}
              <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Rekapitulasi Identitas & Kontak Pendaftaran
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Nama Lengkap Siswa</span>
                    <strong className="text-white text-sm">{student.fullName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Asal Sekolah & Kelas</span>
                    <strong className="text-white">{student.schoolOrigin} ({student.grade})</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Alamat Domisili</span>
                    <span className="text-slate-300">{student.address}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">No. WhatsApp Siswa</span>
                    <a
                      href={`https://wa.me/${student.studentPhone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-emerald-400 hover:underline font-semibold flex items-center gap-1 mt-0.5"
                    >
                      <Phone className="w-3 h-3" />
                      <span>{student.studentPhone}</span>
                    </a>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">No. WhatsApp Orang Tua</span>
                    <a
                      href={`https://wa.me/${student.parentPhone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-emerald-400 hover:underline font-semibold flex items-center gap-1 mt-0.5"
                    >
                      <Phone className="w-3 h-3" />
                      <span>{student.parentPhone}</span>
                    </a>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Tanggal Asesmen G-Compass</span>
                    <span className="text-slate-300 font-mono">
                      {new Date(student.createdAt).toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: RINCIAN 8 KECERDASAN GARDNER */}
          {activeSubTab === 'gardner' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-500/30 text-xs text-purple-200">
                💡 <strong>Prinsip Konseling Gardner:</strong> Setiap siswa memiliki konfigurasi profil kecerdasan yang unik. Konselor perlu berfokus pada 2–3 kecerdasan tertinggi siswa sebagai lokomotif pendorong, sembari memberikan strategi kompensasi untuk area yang masih membutuhkan pengembangan.
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(Object.keys(student.gardnerScores) as Array<keyof typeof student.gardnerScores>).map((key) => {
                  const score = student.gardnerScores[key];
                  const info = gardnerInterpretations[key];
                  const category = getGardnerCategory(score);

                  return (
                    <div key={key} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/40 transition-all flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="font-bold text-white text-sm font-heading">{info.title}</span>
                          <span className="text-lg font-black text-white font-mono">{score}%</span>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mb-2.5">
                          <div
                            className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full"
                            style={{ width: `${score}%` }}
                          />
                        </div>

                        <div className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border mb-2 uppercase" style={{ background: 'transparent' }}>
                          <span className={category.color.split(' ')[0]}>{category.label}</span>
                        </div>

                        <p className="text-xs text-slate-300 leading-relaxed mb-3">
                          {info.desc}
                        </p>
                      </div>

                      <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 text-[11px] text-purple-200">
                        <strong>Tips Pendampingan Guru:</strong> {info.counselTip}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: KLASTER BAKAT TALENT ME */}
          {activeSubTab === 'talentme' && (
            <div className="space-y-6">
              {/* 3 Pillars of Talent Me */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-slate-900/80 border border-blue-500/30">
                  <div className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-1">
                    Klaster Thinking
                  </div>
                  <div className="text-3xl font-black text-white font-heading">{student.talentDnaScores.thinking}%</div>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                    Kapasitas berpikir konseptual, analisa data sebab-akibat, perancangan rencana jangka panjang, dan pemecahan masalah rumit.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900/80 border border-amber-500/30">
                  <div className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
                    Klaster Doing
                  </div>
                  <div className="text-3xl font-black text-white font-heading">{student.talentDnaScores.doing}%</div>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                    Daya tahan eksekusi di lapangan, disiplin target waktu, ketangkasan operasional praktis, dan ketahanan terhadap tekanan kerja.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900/80 border border-purple-500/30">
                  <div className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-1">
                    Klaster Relating
                  </div>
                  <div className="text-3xl font-black text-white font-heading">{student.talentDnaScores.relating}%</div>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                    Kepekaan komunikasi sosial, empati mendengarkan, persuasi verbal, kolaborasi tim, dan kemampuan negosiasi kepemimpinan.
                  </p>
                </div>
              </div>

              {/* Top 3 Talents Detailed Dossier */}
              <div className="p-6 rounded-2xl bg-slate-900/70 border border-amber-500/30">
                <h4 className="text-sm font-bold text-white font-heading mb-4 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Penjelasan Mendalam Top 3 Bakat Dominan (Talent Me)</span>
                </h4>

                <div className="space-y-4">
                  {student.topTalents.map((talent, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start gap-4">
                      <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 font-black text-sm flex items-center justify-center shrink-0 border border-amber-500/40">
                        #{idx + 1}
                      </div>
                      <div className="space-y-1">
                        <h5 className="font-bold text-white text-sm">{talent}</h5>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          Bakat ini menandakan bahwa siswa memiliki kecakapan alami di atas rata-rata sebaya dalam mengeksekusi tanggung jawab yang membutuhkan fokus, ketelitian, serta koordinasi mandiri.
                        </p>
                        <div className="text-[11px] text-amber-400 font-semibold pt-1">
                          Peran ideal dalam kepanitiaan/organisasi SMA: Ketua Divisi Strategi / Koordinator Lapangan / Public Relations.
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PANDUAN WAWANCARA KONSELOR & ORTU */}
          {activeSubTab === 'interview_guide' && (
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
                <div className="flex items-center gap-2 text-sm font-bold text-white font-heading">
                  <Target className="w-4 h-4 text-emerald-400" />
                  <span>Script & Pertanyaan Pemantik untuk Konselor saat Wawancara PPDB</span>
                </div>
                <div className="space-y-3 text-xs text-slate-300">
                  <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
                    <strong className="text-amber-300 block mb-1">Pertanyaan 1 (Validasi Minat Intrinsik):</strong>
                    "Halo {student.fullName}, dari hasil tes G-Compass, kamu menunjukkan potensi kuat pada jurusan <strong>{student.recommendation}</strong>. Sejauh ini, saat belajar di SMP {student.schoolOrigin}, materi pelajaran apa yang membuatmu lupa waktu saat mengerjakannya?"
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
                    <strong className="text-amber-300 block mb-1">Pertanyaan 2 (Eksplorasi Ambisi Karir):</strong>
                    "G-Compass mendeteksi bakat utamamu adalah <em>{student.topTalents.join(', ')}</em>. Apakah kamu sudah punya bayangan ingin kuliah di fakultas apa nanti, atau impian profesi spesifik setelah lulus SMA?"
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
                    <strong className="text-amber-300 block mb-1">Pertanyaan 3 (Penyelarasan Ekspektasi Orang Tua):</strong>
                    "Kepada Bapak/Ibu wali murid, apakah hasil asesmen G-Compass ini selaras dengan pengamatan di rumah? Di SMA Genesis Medicare, kami siap mendampingi agar ananda tetap berprestasi tinggi tanpa tekanan psikologis berlebih."
                  </div>
                </div>
              </div>

              {/* Strategi Konseling Khusus */}
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                <div className="flex items-center gap-2 text-sm font-bold text-white font-heading">
                  <HeartHandshake className="w-4 h-4 text-purple-400" />
                  <span>Tips Menghadapi Potensi Disparitas Minat (Siswa vs Orang Tua)</span>
                </div>
                <ul className="space-y-2 text-xs text-slate-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                    <span>
                      <strong>Jika orang tua memaksakan IPA sementara hasil siswa dominan IPS:</strong> Tunjukkan data skor penalaran sosial dan prospek karir modern seperti Corporate Lawyer, FinTech Investment, Hubungan Internasional, dan Digital Marketing yang memiliki prospek gaji dan karir sangat bergengsi.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                    <span>
                      <strong>Jika hasil adalah HYBRID:</strong> Jelaskan kepada orang tua bahwa tipe Hybrid adalah profil <em>polymath</em> paling dicari dalam era AI saat ini (misal Tech Product Manager atau Bio-Entrepreneur), di mana pemahaman teknis sains harus dipadukan dengan kecakapan komunikasi bisnis.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 5: KURIKULUM & EKSKUL SMA GENESIS MEDICARE */}
          {activeSubTab === 'curriculum' && (
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
                <div className="flex items-center gap-2 text-sm font-bold text-white font-heading">
                  <School className="w-4 h-4 text-cyan-400" />
                  <span>Rekomendasi Paket Mata Pelajaran Pilihan (Kurikulum Merdeka)</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
                    <strong className="text-white block mb-1">Mata Pelajaran Pendukung Utama:</strong>
                    <p className="text-slate-300 leading-relaxed">
                      {student.recommendation === 'IPA'
                        ? 'Matematika Tingkat Lanjut, Fisika, Kimia, Biologi, dan Informatika.'
                        : student.recommendation === 'IPS'
                        ? 'Ekonomi, Sosiologi, Geografi, Bahasa Inggris Tingkat Lanjut, dan Antropologi.'
                        : 'Kombinasi Matematika Tingkat Lanjut, Ekonomi, Informatika, dan Bahasa Inggris.'}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
                    <strong className="text-white block mb-1">Rekomendasi Ekstrakurikuler di SMA GM:</strong>
                    <ul className="space-y-1 text-slate-300 mt-1">
                      {student.recommendedExtracurriculars.map((e, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                          <span>{e}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 text-xs text-cyan-200">
                📌 <strong>Catatan Komite Kurikulum SMA Genesis Medicare:</strong> Siswa ini direkomendasikan untuk dimasukkan ke dalam pemantauan program bimbingan intensif persiapan Olimpiade Sains / Debat Bahasa Inggris sejak semester pertama Kelas X.
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Actions */}
        <div className="p-4 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between shrink-0">
          <div className="text-xs text-slate-400">
            Konselor Pendamping: <strong>Tim BK SMA Genesis Medicare</strong>
          </div>
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs tracking-wide shadow-lg shadow-purple-600/30 transition-all"
          >
            Selesai Meninjau
          </button>
        </div>
      </div>
    </div>
  );
};
