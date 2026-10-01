import { GardnerScores, MajorRecommendation, TalentDnaScores, TestResult, StudentRegistration } from '../types';

export interface TalentDescriptor {
  title: string;
  category: 'Thinking' | 'Doing' | 'Relating';
  description: string;
  badgeColor: string;
}

export const TALENT_LIBRARY: Record<string, TalentDescriptor> = {
  analytical_mind: {
    title: 'Analytical Pioneer',
    category: 'Thinking',
    description: 'Kemampuan mengurai data rumit, menganalisis hubungan sebab-akibat secara objektif, dan menemukan pola rasional tersembunyi.',
    badgeColor: 'from-blue-500 to-indigo-600',
  },
  strategic_visionary: {
    title: 'Strategic Visionary',
    category: 'Thinking',
    description: 'Visi jangka panjang yang tajam, mampu merancang skenario masa depan dan menyusun peta jalan taktis penyelesaian masalah.',
    badgeColor: 'from-purple-500 to-pink-600',
  },
  algorithmic_thinker: {
    title: 'Algorithmic Architect',
    category: 'Thinking',
    description: 'Nalar komputasional tinggi, menyukai algoritma terstruktur, optimasi sistem, dan otomasi pemecahan masalah.',
    badgeColor: 'from-cyan-500 to-blue-600',
  },
  spatial_designer: {
    title: 'Spatial Innovation Designer',
    category: 'Doing',
    description: 'Imajinasi 3D dan visualisasi ruang yang kaya, mampu mengubah gagasan abstrak menjadi prototype visual berdaya cipta tinggi.',
    badgeColor: 'from-emerald-500 to-teal-600',
  },
  tactical_executor: {
    title: 'Master Tactical Executor',
    category: 'Doing',
    description: 'Ketahanan eksekusi luar biasa, disiplin tinggi menuntaskan target operasional tanpa menunda waktu hingga tuntas.',
    badgeColor: 'from-amber-500 to-orange-600',
  },
  charismatic_speaker: {
    title: 'Charismatic Communicator',
    category: 'Relating',
    description: 'Keahlian artikulasi bahasa persuasif yang memukau audiens, luwes merangkul gagasan dan menggerakkan orang banyak.',
    badgeColor: 'from-violet-500 to-purple-600',
  },
  empathy_catalyst: {
    title: 'Empathy Catalyst Leader',
    category: 'Relating',
    description: 'Kepekaan sosial mendalam, mendengarkan aktif dengan ketulusan hati, serta mahir menjembatani perbedaan dalam tim.',
    badgeColor: 'from-rose-500 to-pink-600',
  },
  ecological_solutionist: {
    title: 'Ecological Solutionist',
    category: 'Thinking',
    description: 'Koneksi intuitif dengan alam dan keanekaragaman hayati, fokus pada solusi ramah lingkungan berkelanjutan (sustainability).',
    badgeColor: 'from-teal-500 to-green-600',
  },
  holistic_synthesizer: {
    title: 'Holistic Polymath Synthesizer',
    category: 'Thinking',
    description: 'Kecakapan menghubungkan berbagai cabang ilmu pengetahuan (interdisipliner) untuk melahirkan inovasi terobosan baru.',
    badgeColor: 'from-amber-500 to-yellow-600',
  },
};

export function computeAssessmentResult(
  registration: StudentRegistration,
  answers: { questionId: number; optionId: string }[],
  allQuestions: { id: number; options: { id: string; ipaPoints: number; ipsPoints: number; gardnerCategory: keyof GardnerScores; gardnerPoints: number; talentDnaCategory: keyof TalentDnaScores; talentDnaPoints: number }[] }[]
): TestResult {
  let ipaTotal = 0;
  let ipsTotal = 0;

  const rawGardner: GardnerScores = {
    linguistic: 0,
    logical: 0,
    spatial: 0,
    naturalist: 0,
    interpersonal: 0,
    intrapersonal: 0,
    musical: 0,
    kinesthetic: 0,
  };

  const rawTalentDna: TalentDnaScores = {
    thinking: 0,
    doing: 0,
    relating: 0,
  };

  answers.forEach(ans => {
    const q = allQuestions.find(item => item.id === ans.questionId);
    if (!q) return;
    const opt = q.options.find(o => o.id === ans.optionId);
    if (!opt) return;

    ipaTotal += opt.ipaPoints;
    ipsTotal += opt.ipsPoints;

    rawGardner[opt.gardnerCategory] += opt.gardnerPoints;
    rawTalentDna[opt.talentDnaCategory] += opt.talentDnaPoints;
  });

  // Normalize Gardner Scores to 0 - 100 range with baseline
  const gardnerScores: GardnerScores = {
    logical: Math.min(100, Math.round(35 + (rawGardner.logical / 30) * 65)),
    spatial: Math.min(100, Math.round(35 + (rawGardner.spatial / 30) * 65)),
    naturalist: Math.min(100, Math.round(35 + (rawGardner.naturalist / 25) * 65)),
    linguistic: Math.min(100, Math.round(35 + (rawGardner.linguistic / 25) * 65)),
    interpersonal: Math.min(100, Math.round(35 + (rawGardner.interpersonal / 30) * 65)),
    intrapersonal: Math.min(100, Math.round(35 + (rawGardner.intrapersonal / 25) * 65)),
    musical: Math.min(100, Math.round(35 + (rawGardner.musical / 20) * 65)),
    kinesthetic: Math.min(100, Math.round(35 + (rawGardner.kinesthetic / 25) * 65)),
  };

  // Normalize Talent Me Scores
  const talentDnaScores: TalentDnaScores = {
    thinking: Math.min(100, Math.round(40 + (rawTalentDna.thinking / 35) * 60)),
    doing: Math.min(100, Math.round(40 + (rawTalentDna.doing / 35) * 60)),
    relating: Math.min(100, Math.round(40 + (rawTalentDna.relating / 35) * 60)),
  };

  // Determine Recommendation
  let recommendation: MajorRecommendation = 'HYBRID';
  let recommendationTitle = 'Multitalenta / Hybrid (The Innovative Polymath)';
  let learningStyle = 'Project-Based Learning (Integrasi Sains Eksperimental & Diskusi Sosial)';
  let careerProspects: string[] = [];
  let recommendedExtracurriculars: string[] = [];

  const diff = ipaTotal - ipsTotal;

  if (diff >= 6) {
    recommendation = 'IPA';
    recommendationTitle = 'Dominan IPA (The Future Technologist/Scientist)';
    learningStyle = 'Eksperimental & Problem-Solving (Hands-on Laboratorium, Simulasi Coding & Deduksi Logis)';
    careerProspects = [
      'Artificial Intelligence & Robotics Engineer',
      'Biomedical & Genomic Scientist',
      'Aero-Space & Data System Architect',
      'Dokter Spesialis & Rekayasa Kesehatan Medis',
      'Cybersecurity & Cloud Infrastructure Specialist',
      'Renewable Energy & Environmental Technologist',
    ];
    recommendedExtracurriculars = [
      'Robotics & IoT Innovation Club',
      'KIR (Kelompok Ilmiah Remaja) & Olimpiade Sains',
      'Genesis Coding & Software Lab',
      'Palang Merah Remaja (PMR) Medical Squad',
      'Aeromodelling & Drone Navigation',
    ];
  } else if (diff <= -6) {
    recommendation = 'IPS';
    recommendationTitle = 'Dominan IPS (The Future Leader/Strategist)';
    learningStyle = 'Diskutif & Analisis Kasus (Interactive Forum, Debat Publik, Simulasi Pasar & Studi Diplomasi)';
    careerProspects = [
      'Diplomat & Ahli Hubungan Internasional',
      'Investment Strategist & FinTech Portfolio Manager',
      'Corporate Legal Counsel / International Lawyer',
      'Chief Marketing Officer & Creative Brand Director',
      'Sociologist & Public Policy Strategist',
      'Social Entrepreneur & Venture Capitalist',
    ];
    recommendedExtracurriculars = [
      'English Debate & Model United Nations (MUN)',
      'Genesis Young Entrepreneurs & Business Incubator',
      'Jurnalistik, Podcast & Creative Content Lab',
      'Paskibra & Leadership Youth Council',
      'Teater & Public Speaking Guild',
    ];
  } else {
    recommendation = 'HYBRID';
    recommendationTitle = 'Multitalenta / Hybrid (The Innovative Polymath)';
    learningStyle = 'Integratif & Multidisipliner (Kombinasi Logika Sains Presisi dengan Kecakapan Komunikasi & Bisnis)';
    careerProspects = [
      'Tech Product Manager & UX Strategist',
      'Sustainable Urban Planner & Smart City Architect',
      'Bio-Business & Medical Technology Entrepreneur',
      'Digital Economy & Creative Tech Producer',
      'Data Journalist & Scientific Storyteller',
      'Industrial Organization & Human-AI Consultant',
    ];
    recommendedExtracurriculars = [
      'Genesis Innovation Incubator (Tech & Social Biz)',
      'Robotics & English Debate Cross-Society',
      'Multimedia Production & Scientific Journalism',
      'KIR Lingkungan Hidup & Green Economy Club',
      'Band & Komunitas Seni Kreatif SMA Genesis Medicare',
    ];
  }

  // Derive Top 3 Talents based on highest metrics
  const candidateTalents: { name: string; score: number }[] = [
    { name: 'Analytical Pioneer', score: gardnerScores.logical * 0.6 + talentDnaScores.thinking * 0.4 },
    { name: 'Strategic Visionary', score: talentDnaScores.thinking * 0.7 + gardnerScores.spatial * 0.3 },
    { name: 'Algorithmic Architect', score: gardnerScores.logical * 0.7 + talentDnaScores.doing * 0.3 },
    { name: 'Spatial Innovation Designer', score: gardnerScores.spatial * 0.7 + talentDnaScores.doing * 0.3 },
    { name: 'Master Tactical Executor', score: talentDnaScores.doing * 0.7 + gardnerScores.kinesthetic * 0.3 },
    { name: 'Charismatic Communicator', score: gardnerScores.linguistic * 0.5 + talentDnaScores.relating * 0.5 },
    { name: 'Empathy Catalyst Leader', score: gardnerScores.interpersonal * 0.6 + talentDnaScores.relating * 0.4 },
    { name: 'Ecological Solutionist', score: gardnerScores.naturalist * 0.7 + talentDnaScores.thinking * 0.3 },
    { name: 'Holistic Polymath Synthesizer', score: (gardnerScores.logical + gardnerScores.interpersonal + talentDnaScores.thinking) / 3 },
  ];

  candidateTalents.sort((a, b) => b.score - a.score);
  const topTalents = candidateTalents.slice(0, 3).map(t => t.name);

  const id = `gcompass-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;

  return {
    ...registration,
    id,
    ipaScore: ipaTotal,
    ipsScore: ipsTotal,
    gardnerScores,
    talentDnaScores,
    recommendation,
    recommendationTitle,
    topTalents,
    learningStyle,
    careerProspects,
    recommendedExtracurriculars,
    createdAt: new Date().toISOString(),
  };
}
