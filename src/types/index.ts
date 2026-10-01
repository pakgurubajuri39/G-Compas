export type MajorRecommendation = 'IPA' | 'IPS' | 'HYBRID';

export interface GardnerScores {
  linguistic: number;      // Linguistik-Verbal
  logical: number;         // Logis-Matematis
  spatial: number;         // Visual-Spasial
  naturalist: number;      // Naturalis
  interpersonal: number;   // Interpersonal
  intrapersonal: number;   // Intrapersonal
  musical: number;         // Musikal
  kinesthetic: number;     // Kinestetik
}

export interface TalentDnaScores {
  thinking: number;  // Analitis, Konseptual, Strategis
  doing: number;     // Eksekutor, Praktis, Disiplin
  relating: number;  // Komunikator, Kolaborasi, Empati
}

export interface StudentRegistration {
  fullName: string;
  schoolOrigin: string;
  grade: string;
  address: string;
  studentPhone: string;
  parentPhone: string;
}

export interface TestResult extends StudentRegistration {
  id: string;
  ipaScore: number;
  ipsScore: number;
  gardnerScores: GardnerScores;
  talentDnaScores: TalentDnaScores;
  recommendation: MajorRecommendation;
  recommendationTitle: string;
  topTalents: string[];
  learningStyle: string;
  careerProspects: string[];
  recommendedExtracurriculars: string[];
  createdAt: string;
}

export interface AppSettings {
  isAppActive: boolean;
  schoolName: string;
  schoolAddress: string;
  eventName: string;
  eventDate: string;
  principalName?: string;
  whatsappNumber?: string;
  updatedAt?: string;
}

export interface QuestionOption {
  id: string;
  text: string;
  ipaPoints: number;
  ipsPoints: number;
  gardnerCategory: keyof GardnerScores;
  gardnerPoints: number;
  talentDnaCategory: keyof TalentDnaScores;
  talentDnaPoints: number;
}

export interface Question {
  id: number;
  module: 1 | 2 | 3;
  moduleTitle: string;
  scenario: string;
  options: QuestionOption[];
}
