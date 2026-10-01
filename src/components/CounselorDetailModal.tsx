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
  Target,
  Download
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

  // Dynamic Individual Computations
  const sortedGardner = (Object.keys(student.gardnerScores) as Array<keyof typeof student.gardnerScores>)
    .map(key => ({
      key,
      score: student.gardnerScores[key],
      info: gardnerInterpretations[key],
      category: getGardnerCategory(student.gardnerScores[key]),
    }))
    .sort((a, b) => b.score - a.score);

  const topTwoGardner = sortedGardner.slice(0, 2);
  const lowestGardner = sortedGardner[sortedGardner.length - 1];

  // Talent Me Cluster Breakdown
  const talentClusters = [
    { name: 'Thinking', score: student.talentDnaScores.thinking, role: 'Pemikir & Konseptor Analitis' },
    { name: 'Doing', score: student.talentDnaScores.doing, role: 'Eksekutor Tangkas & Disiplin' },
    { name: 'Relating', score: student.talentDnaScores.relating, role: 'Komunikator & Kolaborator Empatis' },
  ].sort((a, b) => b.score - a.score);

  const dominantCluster = talentClusters[0];

  // Degree of certainty
  const getCertaintyLevel = () => {
    const absDiff = Math.abs(diffScore);
    if (absDiff >= 6) return { level: 'Sangat Pasti & Dominan', badge: 'bg-emerald-950/80 border-emerald-500 text-emerald-300', desc: 'Rekomendasi jurusan sangat tegas tanpa keraguan kognitif.' };
    if (absDiff >= 3) return { level: 'Signifikan & Terarah', badge: 'bg-blue-950/80 border-blue-500 text-blue-300', desc: 'Kecenderungan jurusan cukup kuat dan mudah diakselerasi.' };
    return { level: 'Seimbang / Fleksibel (Hybrid)', badge: 'bg-amber-950/80 border-amber-500 text-amber-300', desc: 'Siswa memiliki potensi seimbang, sangat cocok untuk kombinasi lintas minat Kurikulum Merdeka.' };
  };

  const certainty = getCertaintyLevel();

  // Individual Blind Spot explanation
  const getBlindSpotAnalysis = () => {
    if (dominantCluster.name === 'Thinking') {
      return {
        title: 'Titik Rawan: Kecenderungan Overthinking & Perfeksionisme',
        desc: `Ananda ${student.fullName} memiliki kekuatan berpikir konseptual yang sangat dalam (${dominantCluster.score}%), namun rentan mengalami kelambatan eksekusi jika merasa informasinya belum lengkap. Guru dan konselor perlu memberikan batas waktu yang jelas dan mengajarkan bahwa progres nyata lebih bernilai daripada menunggu kesempurnaan.`,
        action: 'Berikan apresiasi pada setiap langkah awal eksekusi, bukan hanya hasil akhir sempurna.'
      };
    } else if (dominantCluster.name === 'Doing') {
      return {
        title: 'Titik Rawan: Cepat Jenuh dengan Teori Abstrak Berkepanjangan',
        desc: `Ananda ${student.fullName} adalah tipe eksekutor handal (${dominantCluster.score}%) yang berorientasi hasil cepat. Titik rawannya adalah mudah bosan saat dihadapkan pada materi ceramah satu arah atau analisis konseptual tanpa contoh nyata.`,
        action: 'Libatkan dalam studi kasus terapan, praktikum laboratorium, dan tugas berbasis target harian.'
      };
    } else {
      return {
        title: 'Titik Rawan: Kepekaan Emosional & Rentan Distraksi Dinamika Sosial',
        desc: `Ananda ${student.fullName} memiliki kecakapan relasi sosial yang menonjol (${dominantCluster.score}%). Titik rawannya adalah sangat sensitif terhadap suasana hati kelompok atau konflik antar teman, yang dapat mempengaruhi motivasi belajarnya jika lingkungan kelas kurang kondusif.`,
        action: 'Bantu Ananda menetapkan batasan emosi sehat dan berikan apresiasi atas kontribusi diplomatisnya.'
      };
    }
  };

  const blindSpot = getBlindSpotAnalysis();

  // Extract clean signature name from principal's full name
  const getSignatureName = (fullName?: string) => {
    const raw = (fullName || 'Dra. Hj. Brimayanti').trim();
    const cleaned = raw
      .replace(/\b(Dra|Drs|Dr|Hj|H|Prof|Ir|M\.Pd|S\.Pd|M\.M|M\.Si|S\.T|S\.Kom|B\.A|M\.A|S\.Sos|S\.E|M\.Kom|S\.Psi|M\.Psi)\.?\b/gi, '')
      .replace(/[,.]/g, '')
      .trim();
    if (!cleaned) return 'Brimayanti';
    const parts = cleaned.split(/\s+/).filter(Boolean);
    return parts.length > 1 ? parts[parts.length - 1] : parts[0];
  };

  const signatureName = getSignatureName(settings.principalName);
  const principalFullName = settings.principalName || 'Dra. Hj. Brimayanti';
  const formattedDate = new Date(student.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  const printDate = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

  // Generate comprehensive, high-contrast, pure-white printable HTML dossier
  const generateCounselorPrintHtml = () => {
    const gardnerRowsHtml = sortedGardner.map((item, idx) => `
      <tr style="background: ${idx % 2 === 0 ? '#ffffff' : '#f8fafc'};">
        <td style="text-align: center; font-weight: 700; color: #475569; width: 28px; padding: 7px 8px; border: 1px solid #cbd5e1;">${idx + 1}</td>
        <td style="font-weight: 700; color: #0f172a; width: 140px; padding: 7px 8px; border: 1px solid #cbd5e1;">${item.info.title}</td>
        <td style="text-align: center; width: 70px; padding: 7px 8px; border: 1px solid #cbd5e1;">
          <span style="font-weight: 900; font-size: 13px; color: ${item.score >= 80 ? '#047857' : item.score >= 65 ? '#1d4ed8' : '#b45309'};">${item.score}</span>
          <span style="font-size: 10px; color: #64748b;">/100</span>
        </td>
        <td style="width: 135px; padding: 7px 8px; border: 1px solid #cbd5e1;">
          <span style="display: inline-block; padding: 2px 6px; border-radius: 4px; font-size: 9.5px; font-weight: 700; background: ${item.score >= 80 ? '#ecfdf5; color: #047857; border: 1px solid #a7f3d0' : item.score >= 65 ? '#eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe' : '#fffbeb; color: #b45309; border: 1px solid #fde68a'};">
            ${item.category.label}
          </span>
        </td>
        <td style="color: #334155; font-size: 10px; line-height: 1.4; padding: 7px 8px; border: 1px solid #cbd5e1;">${item.info.desc}</td>
        <td style="color: #0f172a; font-size: 10px; line-height: 1.4; padding: 7px 8px; border: 1px solid #cbd5e1; background: #fafafa;"><strong>📌 Tips Tindakan BK:</strong> ${item.info.counselTip}</td>
      </tr>
    `).join('');

    const topTalentsHtml = student.topTalents.map((talent, idx) => `
      <div style="padding: 8px 12px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; margin-bottom: 6px; break-inside: avoid;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 3px;">
          <span style="font-size: 11.5px; font-weight: 800; color: #0f172a;">#${idx + 1} ${talent}</span>
          <span style="font-size: 9.5px; font-weight: 700; color: #0284c7; background: #e0f2fe; padding: 1.5px 6px; border-radius: 4px;">Bakat Alami Unggulan</span>
        </div>
        <p style="font-size: 10px; color: #334155; margin: 0 0 3px 0; line-height: 1.35;">
          Bakat ini menandakan bahwa siswa memiliki kecakapan alami di atas rata-rata sebaya dalam mengeksekusi tanggung jawab yang membutuhkan fokus, ketelitian, serta koordinasi mandiri.
        </p>
        <div style="font-size: 10px; color: #7c2d12; font-weight: 600;">
          🌟 Peran Organisasi/Kepanitiaan SMA: Koordinator Lapangan / Ketua Divisi Strategis / Public Relations.
        </div>
      </div>
    `).join('');

    const extracurricularsHtml = student.recommendedExtracurriculars.map(e => `
      <li style="margin-bottom: 2px; color: #1e293b;">• ${e}</li>
    `).join('');

    const careersHtml = student.careerProspects.map(c => `
      <li style="margin-bottom: 2px; color: #1e293b;">• ${c}</li>
    `).join('');

    const interviewQuestionsHtml = `
      <div style="padding: 8px 12px; background: #f8fafc; border-left: 3px solid #059669; border-radius: 0 6px 6px 0; margin-bottom: 6px;">
        <div style="font-size: 10.5px; font-weight: 800; color: #059669; margin-bottom: 2px;">Pertanyaan 1 (Validasi Minat Intrinsik):</div>
        <div style="font-size: 10px; color: #1e293b; font-style: italic;">
          "Halo ${student.fullName}, dari hasil asesmen G-Compass, kamu menunjukkan potensi kuat pada jurusan <strong>${student.recommendation}</strong>. Sejauh ini, saat belajar di SMP ${student.schoolOrigin}, materi pelajaran apa yang membuatmu lupa waktu saat mengerjakannya?"
        </div>
      </div>
      <div style="padding: 8px 12px; background: #f8fafc; border-left: 3px solid #2563eb; border-radius: 0 6px 6px 0; margin-bottom: 6px;">
        <div style="font-size: 10.5px; font-weight: 800; color: #2563eb; margin-bottom: 2px;">Pertanyaan 2 (Eksplorasi Ambisi Karir):</div>
        <div style="font-size: 10px; color: #1e293b; font-style: italic;">
          "G-Compass mendeteksi bakat utamamu adalah <em>${student.topTalents.join(', ')}</em>. Apakah kamu sudah punya bayangan ingin kuliah di fakultas apa nanti, atau impian profesi spesifik setelah lulus SMA?"
        </div>
      </div>
      <div style="padding: 8px 12px; background: #f8fafc; border-left: 3px solid #7c3aed; border-radius: 0 6px 6px 0;">
        <div style="font-size: 10.5px; font-weight: 800; color: #7c3aed; margin-bottom: 2px;">Pertanyaan 3 (Penyelarasan Ekspektasi Orang Tua):</div>
        <div style="font-size: 10px; color: #1e293b; font-style: italic;">
          "Kepada Bapak/Ibu wali murid, apakah hasil asesmen G-Compass ini selaras dengan pengamatan di rumah? Di SMA Genesis Medicare, kami siap mendampingi agar ananda tetap berprestasi tinggi tanpa tekanan psikologis berlebih."
        </div>
      </div>
    `;

    const disparityGuideHtml = `
      <div style="font-size: 10px; color: #334155; line-height: 1.45;">
        <div style="margin-bottom: 5px;">
          <strong>• Jika Orang Tua Menghendaki IPA sedangkan Hasil Dominan IPS:</strong>
          <span style="color: #475569;">Paparkan data skor penalaran sosial siswa dan tren karir modern berpenghasilan tinggi seperti Corporate Lawyer, Investment Portfolio Manager, Hubungan Internasional, dan Creative Brand Director yang membutuhkan pondasi IPS kokoh.</span>
        </div>
        <div>
          <strong>• Jika Hasil Asesmen Adalah MULTITALENTA (HYBRID):</strong>
          <span style="color: #475569;">Jelaskan bahwa tipe Hybrid memiliki fleksibilitas kognitif tinggi dan sangat diuntungkan dalam skema Kurikulum Merdeka untuk mengambil kombinasi mata pelajaran IPA & IPS terarah.</span>
        </div>
      </div>
    `;

    const signaturesHtml = `
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-top: 20px; padding-top: 12px; border-top: 1px dashed #cbd5e1; page-break-inside: avoid;">
        <div style="width: 45%; text-align: center;">
          <div style="font-size: 10px; color: #64748b; margin-bottom: 3px;">Mengetahui & Menyetujui,</div>
          <div style="font-size: 11px; font-weight: 700; color: #0f172a; margin-bottom: 45px;">Guru Bimbingan Konseling (BK)</div>
          <div style="font-size: 11px; font-weight: 700; color: #0f172a; text-decoration: underline;">( Tim Konselor BK SMA Genesis Medicare )</div>
          <div style="font-size: 9.5px; color: #64748b;">NIP. Guru Bimbingan Konseling</div>
        </div>
        <div style="width: 45%; text-align: center; position: relative;">
          <div style="font-size: 10px; color: #64748b; margin-bottom: 3px;">Depok, ${formattedDate}</div>
          <div style="font-size: 11px; font-weight: 700; color: #0f172a; margin-bottom: 6px;">Kepala Sekolah SMA Genesis Medicare</div>
          
          <!-- Signature & Stamp -->
          <div style="height: 42px; display: flex; align-items: center; justify-content: center; position: relative; margin-bottom: 3px;">
            <div style="font-family: 'Great Vibes', 'Dancing Script', 'Caveat', cursive, serif; font-size: 26px; color: #1e3a8a; font-style: italic; transform: rotate(-3deg);">
              ${signatureName}
            </div>
            <!-- Stamp simulation -->
            <div style="position: absolute; right: 20px; top: -6px; width: 60px; height: 60px; border: 2px dashed #dc2626; border-radius: 50%; opacity: 0.28; display: flex; align-items: center; justify-content: center; font-size: 7.5px; font-weight: 900; color: #dc2626; transform: rotate(12deg); pointer-events: none; text-align: center; line-height: 1;">
              SMA GM<br/>DEPOK<br/>VALID
            </div>
          </div>

          <div style="font-size: 11px; font-weight: 700; color: #0f172a; text-decoration: underline;">( ${principalFullName} )</div>
          <div style="font-size: 9.5px; color: #64748b;">NIP. Kepala Sekolah SMA Genesis Medicare</div>
        </div>
      </div>
    `;

    return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Dossier_Konselor_${student.fullName.replace(/\s+/g, '_')}_${student.id.substring(0, 8)}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&family=Dancing+Script:wght@700&family=Great+Vibes&family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    @page {
      size: A4 portrait;
      margin: 12mm 15mm;
    }
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    body {
      margin: 0;
      padding: 0;
      background: #ffffff;
      color: #0f172a;
      font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
      font-size: 11px;
      line-height: 1.45;
    }
    .print-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 10px 0;
    }
    /* Toolbar for preview */
    .no-print {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #0f172a;
      color: #ffffff;
      padding: 12px 20px;
      margin-bottom: 20px;
      border-radius: 8px;
    }
    .btn-action {
      background: #f59e0b;
      color: #0f172a;
      border: none;
      padding: 8px 16px;
      border-radius: 6px;
      font-weight: 800;
      font-size: 12px;
      cursor: pointer;
    }
    @media print {
      .no-print {
        display: none !important;
      }
      body {
        padding: 0;
      }
    }
    /* Kop Surat */
    .kop-header {
      border-bottom: 3px double #0f172a;
      padding-bottom: 12px;
      margin-bottom: 14px;
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .kop-emblem {
      width: 58px;
      height: 58px;
      background: #0f172a;
      color: #f59e0b;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 22px;
      font-weight: 900;
      letter-spacing: -1px;
      shrink-0: 0;
    }
    .kop-title {
      font-size: 12px;
      font-weight: 800;
      letter-spacing: 0.15em;
      color: #64748b;
      text-transform: uppercase;
    }
    .kop-school {
      font-size: 20px;
      font-weight: 900;
      color: #0f172a;
      margin: 1px 0;
      font-family: 'Plus Jakarta Sans', sans-serif;
    }
    .kop-details {
      font-size: 10px;
      color: #475569;
      line-height: 1.35;
    }
    /* Document Title */
    .doc-banner {
      background: #f1f5f9;
      border: 1px solid #cbd5e1;
      border-left: 5px solid #7c3aed;
      padding: 10px 14px;
      border-radius: 0 6px 6px 0;
      margin-bottom: 14px;
    }
    .doc-title {
      font-size: 14px;
      font-weight: 900;
      color: #0f172a;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin: 0 0 2px 0;
    }
    .doc-subtitle {
      font-size: 11px;
      color: #475569;
      margin-bottom: 4px;
    }
    .doc-meta {
      font-size: 9.5px;
      color: #64748b;
    }
    /* Section Formatting */
    .section-box {
      margin-bottom: 14px;
      break-inside: avoid;
    }
    .section-title {
      font-size: 11.5px;
      font-weight: 800;
      color: #0f172a;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      border-bottom: 1.5px solid #e2e8f0;
      padding-bottom: 4px;
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    table.data-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 10.5px;
    }
    table.data-table th {
      background: #f1f5f9;
      color: #0f172a;
      font-weight: 800;
      padding: 7px 8px;
      border: 1px solid #cbd5e1;
      text-align: left;
      font-size: 10px;
      text-transform: uppercase;
    }
    table.data-table td {
      border: 1px solid #cbd5e1;
      padding: 6px 8px;
    }
    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    }
    .grid-3 {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 8px;
    }
    .card-info {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 10px 12px;
    }
    .badge {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 10px;
      font-weight: 800;
      text-transform: uppercase;
    }
    .page-break {
      page-break-before: always;
      break-before: page;
    }
  </style>
</head>
<body>
  <div class="print-container">
    <!-- Toolbar (Hidden during print) -->
    <div class="no-print">
      <div>
        <strong style="color: #f59e0b; font-size: 13px;">G-Compass Dossier Konselor</strong>
        <span style="font-size: 11px; color: #94a3b8; margin-left: 8px;">Pratinjau Cetak Lembar Analisis Lengkap (A4 Bersih & Jelas)</span>
      </div>
      <button class="btn-action" onclick="window.print()">
        🖨️ Cetak Dokumen / Simpan PDF (Ctrl + P)
      </button>
    </div>

    <!-- KOP SURAT RESMI -->
    <div class="kop-header">
      <div class="kop-emblem">GM</div>
      <div style="flex: 1;">
        <div class="kop-title">Perguruan Genesis Medicare • Bimbingan & Konseling</div>
        <div class="kop-school">${settings.schoolName || 'SMA GENESIS MEDICARE DEPOK'}</div>
        <div class="kop-details">
          Akreditasi A • NPSN: 69989823 • Kurikulum Merdeka<br/>
          Alamat: ${settings.schoolAddress || 'Jl. Gas Alam No. 9, Curug, Kec. Cimanggis, Kota Depok, Jawa Barat 16453'}<br/>
          No. Layanan Konseling: ${settings.whatsappNumber || '081289123456'} • Web Sistem: g-compas.web.app
        </div>
      </div>
      <div style="text-align: right; font-size: 10px; color: #64748b;">
        <div style="font-weight: 800; color: #7c3aed;">G-COMPASS 2026/2027</div>
        <div>Dokumen Khusus Konselor</div>
        <div style="font-size: 9px; margin-top: 4px; color: #059669; font-weight: 700;">VERIFIED RECORD</div>
      </div>
    </div>

    <!-- DOCUMENT TITLE -->
    <div class="doc-banner">
      <div class="doc-title">BERKAS LENGKAP ANALISIS DIAGNOSTIK & PANDUAN KONSELOR BK</div>
      <div class="doc-subtitle">Pemetaan Potensi Kognitif, Kecerdasan Majemuk & Penjurusan Siswa Kelas X SMA</div>
      <div class="doc-meta">
        No. Dokumen: <strong>BK-GM/${student.id.toUpperCase()}</strong> • Tanggal Asesmen: <strong>${formattedDate}</strong> • Dicetak: <strong>${printDate}</strong>
      </div>
    </div>

    <!-- BAGIAN 1: IDENTITAS PESERTA DIDIK -->
    <div class="section-box">
      <div class="section-title">
        <span>📋 Bagian I: Identitas Lengkap Peserta Didik</span>
      </div>
      <table class="data-table">
        <tbody>
          <tr>
            <td style="width: 22%; font-weight: 700; background: #f8fafc; color: #475569;">Nama Lengkap Siswa</td>
            <td style="width: 40%; font-weight: 800; color: #0f172a; font-size: 12px;">${student.fullName}</td>
            <td style="width: 18%; font-weight: 700; background: #f8fafc; color: #475569;">NISN / ID Tes</td>
            <td style="width: 20%; font-weight: 700; color: #0f172a;">${student.id.substring(0, 14)}</td>
          </tr>
          <tr>
            <td style="font-weight: 700; background: #f8fafc; color: #475569;">Asal Sekolah (SMP)</td>
            <td style="font-weight: 700; color: #0f172a;">${student.schoolOrigin}</td>
            <td style="font-weight: 700; background: #f8fafc; color: #475569;">Kelas / Jenjang</td>
            <td style="font-weight: 700; color: #0f172a;">Kelas ${student.grade}</td>
          </tr>
          <tr>
            <td style="font-weight: 700; background: #f8fafc; color: #475569;">Kontak WhatsApp Siswa</td>
            <td style="color: #0f172a;">${student.studentPhone}</td>
            <td style="font-weight: 700; background: #f8fafc; color: #475569;">Kontak WhatsApp Ortu</td>
            <td style="color: #0f172a;">${student.parentPhone}</td>
          </tr>
          <tr>
            <td style="font-weight: 700; background: #f8fafc; color: #475569;">Alamat Domisili</td>
            <td colspan="3" style="color: #334155;">${student.address}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- BAGIAN 2: DIAGNOSTIK KOGNITIF & REKOMENDASI PENJURUSAN -->
    <div class="section-box">
      <div class="section-title">
        <span>🎯 Bagian II: Diagnostik Kognitif & Rekomendasi Penjurusan</span>
      </div>
      <div class="grid-2">
        <div class="card-info" style="border-left: 4px solid ${student.recommendation === 'IPA' ? '#2563eb' : student.recommendation === 'IPS' ? '#7c3aed' : '#f59e0b'};">
          <div style="font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase;">Hasil Rekomendasi Peminatan</div>
          <div style="display: flex; align-items: center; gap: 8px; margin: 4px 0;">
            <span class="badge" style="background: ${student.recommendation === 'IPA' ? '#eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe' : student.recommendation === 'IPS' ? '#f5f3ff; color: #6d28d9; border: 1px solid #ddd6fe' : '#fffbeb; color: #b45309; border: 1px solid #fde68a'}; font-size: 12px; padding: 3px 10px;">
              JURUSAN ${student.recommendation}
            </span>
            <span style="font-size: 10.5px; font-weight: 700; color: #0f172a;">${student.recommendationTitle}</span>
          </div>
          <div style="font-size: 10px; color: #475569; margin-top: 4px;">
            Tingkat Kepastian: <strong>${certainty.level}</strong> • ${certainty.desc}
          </div>
        </div>

        <div class="card-info">
          <div style="font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase;">Komparasi Poin Peminatan</div>
          <div style="display: flex; justify-content: space-between; align-items: baseline; margin: 4px 0;">
            <div>
              <span style="font-size: 18px; font-weight: 900; color: #1d4ed8;">${student.ipaScore}</span>
              <span style="font-size: 10px; color: #64748b;">Poin IPA</span>
            </div>
            <div style="font-size: 11px; font-weight: 800; color: #475569;">
              Selisih: ${Math.abs(diffScore)} Poin
            </div>
            <div>
              <span style="font-size: 18px; font-weight: 900; color: #6d28d9;">${student.ipsScore}</span>
              <span style="font-size: 10px; color: #64748b;">Poin IPS</span>
            </div>
          </div>
          <div style="font-size: 10px; color: #475569;">
            Gaya Belajar Optimal: <strong>${student.learningStyle}</strong>
          </div>
        </div>
      </div>
    </div>

    <!-- BAGIAN 3: MATRIKS LENGKAP 8 KECERDASAN HOWARD GARDNER -->
    <div class="section-box">
      <div class="section-title">
        <span>🧠 Bagian III: Matriks Lengkap 8 Kecerdasan Majemuk (Howard Gardner)</span>
      </div>
      <table class="data-table">
        <thead>
          <tr>
            <th style="text-align: center; width: 28px;">No</th>
            <th style="width: 140px;">Dimensi Kecerdasan</th>
            <th style="text-align: center; width: 70px;">Skor</th>
            <th style="width: 135px;">Tingkat Dominansi</th>
            <th>Karakteristik Kognitif Siswa</th>
            <th>Arahan Bimbingan Guru BK</th>
          </tr>
        </thead>
        <tbody>
          ${gardnerRowsHtml}
        </tbody>
      </table>
      <div style="margin-top: 6px; padding: 6px 10px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 4px; font-size: 10px; display: flex; justify-content: space-between;">
        <span>🌟 <strong>2 Kecerdasan Tertinggi:</strong> ${topTwoGardner.map(g => `${g.info.title} (${g.score}/100)`).join(', ')}</span>
        <span>⚠️ <strong>Area Pendampingan Stimulasi:</strong> ${lowestGardner.info.title} (${lowestGardner.score}/100)</span>
      </div>
    </div>

    <!-- BAGIAN 4: KLASTER BAKAT TALENT ME & BEDAH TITIK RAWAN -->
    <div class="section-box">
      <div class="section-title">
        <span>⚡ Bagian IV: Pemetaan Klaster Bakat Talent Me & Bedah Titik Rawan (Blind Spot)</span>
      </div>
      
      <!-- 3 Klaster -->
      <div class="grid-3" style="margin-bottom: 8px;">
        <div class="card-info" style="border-top: 3px solid ${dominantCluster.name === 'Thinking' ? '#0284c7' : '#94a3b8'};">
          <div style="display: flex; justify-content: space-between; font-size: 10px; font-weight: 700; color: #0284c7;">
            <span>THINKING (ANALITIS)</span>
            ${dominantCluster.name === 'Thinking' ? '<span class="badge" style="background: #e0f2fe; color: #0369a1; padding: 1px 4px; font-size: 8.5px;">Dominan</span>' : ''}
          </div>
          <div style="font-size: 18px; font-weight: 900; color: #0f172a; margin: 2px 0;">${student.talentDnaScores.thinking}%</div>
          <div style="font-size: 9.5px; color: #475569;">Pemikir konseptual, logika terstruktur, strategi sistematis.</div>
        </div>

        <div class="card-info" style="border-top: 3px solid ${dominantCluster.name === 'Doing' ? '#d97706' : '#94a3b8'};">
          <div style="display: flex; justify-content: space-between; font-size: 10px; font-weight: 700; color: #d97706;">
            <span>DOING (EKSEKUSI)</span>
            ${dominantCluster.name === 'Doing' ? '<span class="badge" style="background: #fef3c7; color: #b45309; padding: 1px 4px; font-size: 8.5px;">Dominan</span>' : ''}
          </div>
          <div style="font-size: 18px; font-weight: 900; color: #0f172a; margin: 2px 0;">${student.talentDnaScores.doing}%</div>
          <div style="font-size: 9.5px; color: #475569;">Eksekusi praktis, disiplin target, ketangkasan operasional.</div>
        </div>

        <div class="card-info" style="border-top: 3px solid ${dominantCluster.name === 'Relating' ? '#7c3aed' : '#94a3b8'};">
          <div style="display: flex; justify-content: space-between; font-size: 10px; font-weight: 700; color: #7c3aed;">
            <span>RELATING (KOMUNIKASI)</span>
            ${dominantCluster.name === 'Relating' ? '<span class="badge" style="background: #f5f3ff; color: #6d28d9; padding: 1px 4px; font-size: 8.5px;">Dominan</span>' : ''}
          </div>
          <div style="font-size: 18px; font-weight: 900; color: #0f172a; margin: 2px 0;">${student.talentDnaScores.relating}%</div>
          <div style="font-size: 9.5px; color: #475569;">Empati sosial, diplomasi verbal, negosiasi tim kolaboratif.</div>
        </div>
      </div>

      <!-- Blind Spot Box -->
      <div style="padding: 9px 12px; background: #fffbeb; border: 1px solid #fde68a; border-left: 4px solid #d97706; border-radius: 0 6px 6px 0; margin-bottom: 8px;">
        <div style="font-size: 11px; font-weight: 800; color: #b45309; margin-bottom: 2px;">⚠️ ${blindSpot.title}</div>
        <div style="font-size: 10px; color: #334155; line-height: 1.4; margin-bottom: 4px;">${blindSpot.desc}</div>
        <div style="font-size: 10px; color: #78350f; font-weight: 700;">📌 Rekomendasi Intervensi Guru BK: ${blindSpot.action}</div>
      </div>

      <!-- Top 3 Talents -->
      <div>
        <div style="font-size: 10.5px; font-weight: 800; color: #0f172a; margin-bottom: 4px;">Penjelasan Mendalam Top 3 Bakat Alami Dominan:</div>
        ${topTalentsHtml}
      </div>
    </div>

    <!-- BAGIAN 5: PANDUAN SESI WAWANCARA & KONSELING ORANG TUA -->
    <div class="section-box">
      <div class="section-title">
        <span>🗣️ Bagian V: Panduan Sesi Wawancara PPDB & Penyelarasan Harapan Orang Tua</span>
      </div>
      
      <div style="margin-bottom: 8px;">
        ${interviewQuestionsHtml}
      </div>

      <div style="padding: 8px 12px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px;">
        <div style="font-size: 10.5px; font-weight: 800; color: #0f172a; margin-bottom: 4px;">Strategi Konseling Menghadapi Disparitas Minat (Siswa vs Orang Tua):</div>
        ${disparityGuideHtml}
      </div>
    </div>

    <!-- BAGIAN 6: REKOMENDASI KURIKULUM MERDEKA & PROSPEK KARIER -->
    <div class="section-box">
      <div class="section-title">
        <span>🏫 Bagian VI: Rekomendasi Kurikulum Merdeka & Ekstrakurikuler SMA Genesis Medicare</span>
      </div>
      
      <div class="grid-2">
        <div class="card-info">
          <div style="font-size: 10.5px; font-weight: 800; color: #0f172a; margin-bottom: 4px;">Paket Mapel Pilihan Terarah:</div>
          <p style="font-size: 10px; color: #334155; margin: 0 0 6px 0; line-height: 1.4;">
            ${student.recommendation === 'IPA'
              ? 'Matematika Tingkat Lanjut, Fisika, Kimia, Biologi, dan Informatika.'
              : student.recommendation === 'IPS'
              ? 'Ekonomi, Sosiologi, Geografi, Bahasa Inggris Tingkat Lanjut, dan Antropologi.'
              : 'Kombinasi Matematika Tingkat Lanjut, Ekonomi Terapan, Informatika, dan Bahasa Inggris.'}
          </p>
          <div style="font-size: 10.5px; font-weight: 800; color: #0f172a; margin-bottom: 2px;">Ekstrakurikuler Unggulan SMA GM:</div>
          <ul style="margin: 0; padding-left: 14px; font-size: 10px;">
            ${extracurricularsHtml}
          </ul>
        </div>

        <div class="card-info">
          <div style="font-size: 10.5px; font-weight: 800; color: #0f172a; margin-bottom: 4px;">Prospek Karier Masa Depan yang Selaras:</div>
          <ul style="margin: 0 0 6px 0; padding-left: 14px; font-size: 10px;">
            ${careersHtml}
          </ul>
          <div style="font-size: 9.5px; color: #0284c7; background: #e0f2fe; padding: 6px 8px; border-radius: 4px; border-left: 3px solid #0284c7;">
            <strong>Catatan Kurikulum GM:</strong> Siswa direkomendasikan masuk pemantauan bimbingan intensif persiapan Olimpiade Sains / Debat Bahasa Inggris / Inkubator Bisnis.
          </div>
        </div>
      </div>
    </div>

    <!-- BAGIAN 7: LEMBAR OBSERVASI & PENGESAHAN DOKUMEN -->
    <div class="section-box" style="margin-top: 14px;">
      <div class="section-title">
        <span>✍️ Bagian VII: Lembar Observasi & Pengesahan Dokumen Konseling</span>
      </div>

      <div style="border: 1px dashed #cbd5e1; border-radius: 6px; padding: 8px 12px; margin-bottom: 12px; background: #fafafa;">
        <div style="font-size: 10px; font-weight: 700; color: #64748b; margin-bottom: 4px;">CATATAN KONSULTASI / HASIL KESEPAKATAN DENGAN ORANG TUA SISWA:</div>
        <div style="height: 38px; border-bottom: 1px dotted #cbd5e1; margin-bottom: 6px;"></div>
        <div style="height: 20px; border-bottom: 1px dotted #cbd5e1;"></div>
      </div>

      ${signaturesHtml}
    </div>
  </div>
</body>
</html>`;
  };

  // Direct High-Fidelity Print Engine using invisible iframe for clean print dialog
  const handlePrint = () => {
    const printContent = generateCounselorPrintHtml();
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (doc) {
      doc.open();
      doc.write(printContent);
      doc.close();
      setTimeout(() => {
        try {
          iframe.contentWindow?.focus();
          iframe.contentWindow?.print();
        } catch (e) {
          console.error('Print iframe error', e);
        }
        setTimeout(() => {
          if (document.body.contains(iframe)) {
            document.body.removeChild(iframe);
          }
        }, 2000);
      }, 500);
    } else {
      // Popup fallback
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(printContent);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
          printWindow.print();
        }, 500);
      }
    }
  };

  // Download Standalone Full Dossier HTML File
  const handleDownloadHtml = () => {
    const printContent = generateCounselorPrintHtml();
    const blob = new Blob([printContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Dossier_Konselor_${student.fullName.replace(/\s+/g, '_')}_${student.id.substring(0, 8)}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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
            {/* Tombol Cetak Berkas Lengkap */}
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
              title="Cetak Seluruh Berkas Konselor Lengkap (Format Resmi A4)"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Cetak Berkas Lengkap</span>
            </button>

            {/* Tombol Unduh Dokumen Lengkap (HTML) */}
            <button
              onClick={handleDownloadHtml}
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Unduh Arsip Lengkap Dossier Format Dokumen HTML"
            >
              <Download className="w-4 h-4" />
              <span className="hidden md:inline">Unduh HTML</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
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
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                      Diagnosis Resmi G-Compass
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${certainty.badge}`}>
                      {certainty.level}
                    </span>
                  </div>
                  <h3 className="text-2xl font-black text-white font-heading mt-1">
                    {student.recommendationTitle}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 max-w-xl">
                    Selisih penalaran sains (IPA: {student.ipaScore}) vs sosial-ekonomi (IPS: {student.ipsScore}) adalah {Math.abs(diffScore)} poin. {certainty.desc}
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

              {/* Executive Counselor Quick-Briefing Card */}
              <div className="p-5 rounded-2xl bg-slate-900/90 border border-amber-500/30 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Ringkasan Eksekutif Bimbingan Konseling untuk Ananda {student.fullName}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                    <span className="text-emerald-400 font-bold block mb-1">🚀 2 Lokomotif Kekuatan Utama:</span>
                    <p className="text-slate-200">
                      <strong>{topTwoGardner[0].info.title}</strong> ({topTwoGardner[0].score}%) &amp; <strong>{topTwoGardner[1].info.title}</strong> ({topTwoGardner[1].score}%). Jadikan ini pijakan rasa percaya diri siswa.
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                    <span className="text-amber-400 font-bold block mb-1">⚠️ Area Perlu Pendampingan:</span>
                    <p className="text-slate-200">
                      <strong>{lowestGardner.info.title}</strong> ({lowestGardner.score}%). Bukan kelemahan fatal, melainkan memerlukan metode belajar adaptif.
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                    <span className="text-purple-400 font-bold block mb-1">🎯 Profil Kerja Talent Me:</span>
                    <p className="text-slate-200">
                      Dominan <strong>{dominantCluster.name}</strong> ({dominantCluster.score}%). Berperan sebagai {dominantCluster.role}.
                    </p>
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

              {/* Top 2 vs Lowest Banner */}
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
                <div>
                  <span className="text-emerald-400 font-bold">⭐ 2 Kecerdasan Tertinggi Siswa Ini:</span>
                  <div className="text-white font-extrabold text-sm mt-0.5">
                    {topTwoGardner[0].info.title} ({topTwoGardner[0].score}%) &bull; {topTwoGardner[1].info.title} ({topTwoGardner[1].score}%)
                  </div>
                </div>
                <div className="text-right sm:text-right">
                  <span className="text-amber-400 font-bold">🎯 Perlu Dukungan:</span>
                  <div className="text-slate-300 font-semibold mt-0.5">
                    {lowestGardner.info.title} ({lowestGardner.score}%)
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(Object.keys(student.gardnerScores) as Array<keyof typeof student.gardnerScores>).map((key) => {
                  const score = student.gardnerScores[key];
                  const info = gardnerInterpretations[key];
                  const category = getGardnerCategory(score);
                  const isTop = topTwoGardner.some(t => t.key === key);
                  const isLowest = lowestGardner.key === key;

                  return (
                    <div key={key} className={`p-4 rounded-2xl bg-slate-900/80 border ${isTop ? 'border-emerald-500/50 shadow-emerald-500/10 shadow-lg' : isLowest ? 'border-amber-500/40' : 'border-slate-800'} hover:border-purple-500/40 transition-all flex flex-col justify-between`}>
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-white text-sm font-heading">{info.title}</span>
                            {isTop && (
                              <span className="px-2 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 text-[9px] font-extrabold border border-emerald-500/40">
                                Unggulan
                              </span>
                            )}
                          </div>
                          <span className="text-lg font-black text-white font-mono">{score}%</span>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mb-2.5">
                          <div
                            className={`h-full ${isTop ? 'bg-gradient-to-r from-emerald-500 to-cyan-400' : 'bg-gradient-to-r from-purple-500 to-indigo-400'} rounded-full`}
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
                <div className={`p-5 rounded-2xl bg-slate-900/80 border ${dominantCluster.name === 'Thinking' ? 'border-blue-400 shadow-blue-500/20 shadow-lg' : 'border-blue-500/30'}`}>
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-1">
                      Klaster Thinking
                    </div>
                    {dominantCluster.name === 'Thinking' && (
                      <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-extrabold border border-blue-500/40">
                        Dominan Siswa
                      </span>
                    )}
                  </div>
                  <div className="text-3xl font-black text-white font-heading">{student.talentDnaScores.thinking}%</div>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                    Kapasitas berpikir konseptual, analisa data sebab-akibat, perancangan rencana jangka panjang, dan pemecahan masalah rumit.
                  </p>
                </div>

                <div className={`p-5 rounded-2xl bg-slate-900/80 border ${dominantCluster.name === 'Doing' ? 'border-amber-400 shadow-amber-500/20 shadow-lg' : 'border-amber-500/30'}`}>
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
                      Klaster Doing
                    </div>
                    {dominantCluster.name === 'Doing' && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-extrabold border border-amber-500/40">
                        Dominan Siswa
                      </span>
                    )}
                  </div>
                  <div className="text-3xl font-black text-white font-heading">{student.talentDnaScores.doing}%</div>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                    Daya tahan eksekusi di lapangan, disiplin target waktu, ketangkasan operasional praktis, dan ketahanan terhadap tekanan kerja.
                  </p>
                </div>

                <div className={`p-5 rounded-2xl bg-slate-900/80 border ${dominantCluster.name === 'Relating' ? 'border-purple-400 shadow-purple-500/20 shadow-lg' : 'border-purple-500/30'}`}>
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-1">
                      Klaster Relating
                    </div>
                    {dominantCluster.name === 'Relating' && (
                      <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-extrabold border border-purple-500/40">
                        Dominan Siswa
                      </span>
                    )}
                  </div>
                  <div className="text-3xl font-black text-white font-heading">{student.talentDnaScores.relating}%</div>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                    Kepekaan komunikasi sosial, empati mendengarkan, persuasi verbal, kolaborasi tim, dan kemampuan negosiasi kepemimpinan.
                  </p>
                </div>
              </div>

              {/* Personalized Blind Spot Analysis */}
              <div className="p-5 rounded-2xl bg-slate-900/90 border border-amber-500/40 space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>{blindSpot.title}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {blindSpot.desc}
                </p>
                <div className="pt-1 text-[11px] text-amber-300 font-semibold">
                  📌 <strong>Rekomendasi Intervensi Guru BK:</strong> {blindSpot.action}
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
        <div className="p-4 bg-slate-900/90 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Konselor Pendamping: <strong>Tim BK SMA Genesis Medicare</strong></span>
          </div>
          
          <div className="flex items-center gap-2.5">
            <button
              onClick={handleDownloadHtml}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4 text-amber-400" />
              <span>Unduh Arsip HTML</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Berkas Konselor (Lengkap & Bersih)</span>
            </button>

            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs tracking-wide shadow-lg shadow-purple-600/30 transition-all cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
