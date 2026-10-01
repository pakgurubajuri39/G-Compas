import React, { useState, useRef, useEffect } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { TestResult, AppSettings, MajorRecommendation } from '../types';
import { CertificateTemplate } from './CertificateTemplate';
import { CounselorDetailModal } from './CounselorDetailModal';
import {
  ShieldCheck,
  Settings,
  Database,
  Award,
  Power,
  Search,
  Filter,
  Download,
  Trash2,
  FileSpreadsheet,
  FileText,
  Brain,
  Eye,
  Check,
  X,
  Phone,
  Calendar,
  Building,
  MapPin,
  RefreshCw,
  Sparkles,
  Users,
  Compass,
  Printer,
  BookOpen,
  Target,
  HeartHandshake,
  School,
  CheckCircle2,
  HelpCircle,
  ChevronRight,
  Info
} from 'lucide-react';

interface AdminDashboardProps {
  results: TestResult[];
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => Promise<void>;
  onDeleteResult: (id: string) => Promise<void>;
  onRefreshData: () => Promise<void>;
  onClose: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  results,
  settings,
  onUpdateSettings,
  onDeleteResult,
  onRefreshData,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'database' | 'settings' | 'counselor_guide' | 'certificate_preview'>('database');
  const [filterRecommendation, setFilterRecommendation] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudentForCert, setSelectedStudentForCert] = useState<TestResult | null>(results[0] || null);
  const [selectedCounselorStudent, setSelectedCounselorStudent] = useState<TestResult | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Event Settings Form State
  const [formData, setFormData] = useState<AppSettings>({
    ...settings,
    whatsappNumber: settings.whatsappNumber || '081289123456',
  });

  // Keep formData in sync when settings prop updates
  useEffect(() => {
    setFormData({
      ...settings,
      whatsappNumber: settings.whatsappNumber || '081289123456',
    });
  }, [settings]);

  const certificatePrintRef = useRef<HTMLDivElement>(null);

  // Filtered Results
  const filteredResults = results.filter(item => {
    const matchesSearch =
      item.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.schoolOrigin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.studentPhone.includes(searchQuery) ||
      item.parentPhone.includes(searchQuery);

    const matchesFilter =
      filterRecommendation === 'ALL' || item.recommendation === filterRecommendation;

    return matchesSearch && matchesFilter;
  });

  // Analytics Stats
  const totalCount = results.length;
  const ipaCount = results.filter(r => r.recommendation === 'IPA').length;
  const ipsCount = results.filter(r => r.recommendation === 'IPS').length;
  const hybridCount = results.filter(r => r.recommendation === 'HYBRID').length;

  // Toggle App Status
  const handleToggleAppStatus = async () => {
    const nextStatus = !settings.isAppActive;
    await onUpdateSettings({ isAppActive: nextStatus });
    setFormData(prev => ({ ...prev, isAppActive: nextStatus }));
  };

  // Save Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await onUpdateSettings(formData);
    setSaveSuccessMsg('Pengaturan umum berhasil disimpan ke database!');
    setTimeout(() => setSaveSuccessMsg(''), 4000);
  };

  // Export Database & All Certificates to a Standalone, Offline HTML file
  const handleExportHTML = () => {
    if (results.length === 0) {
      alert('Belum ada data siswa untuk diekspor.');
      return;
    }

    const exportDate = new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    const getSigName = (name?: string) => {
      const raw = (name || 'Dra. Hj. Brimayanti').trim();
      const cleaned = raw
        .replace(/\b(Dra|Drs|Dr|Hj|H|Prof|Ir|M\.Pd|S\.Pd|M\.M|M\.Si|S\.T|S\.Kom|B\.A|M\.A|S\.Sos|S\.E|M\.Kom|S\.Psi|M\.Psi|Bpk|Ibu)\b\.?/gi, '')
        .replace(/[,.]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      return cleaned || raw;
    };

    const signatureName = getSigName(settings.principalName);

    const htmlContent = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Rekapitulasi Lengkap Database & Sertifikat G-Compass - ${settings.schoolName || 'SMA Genesis Medicare'}</title>
  <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&family=Dancing+Script:wght@700&family=Great+Vibes&family=Outfit:wght@400;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif; background-color: #0b0f19; color: #f8fafc; padding: 24px; line-height: 1.5; }
    h1, h2, h3, h4, .font-heading { font-family: 'Outfit', sans-serif; }
    .container { max-width: 1400px; margin: 0 auto; }
    .header-box { background: linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%); border: 1px solid rgba(168, 85, 247, 0.4); border-radius: 20px; padding: 32px; margin-bottom: 24px; text-align: center; }
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 24px; }
    .stat-card { background: #111827; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 16px; padding: 20px; text-align: center; }
    .stat-val { font-size: 28px; font-weight: 900; color: #ffffff; font-family: 'Outfit', sans-serif; margin-top: 4px; }
    .toolbar-box { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; margin-bottom: 20px; background: #111827; padding: 16px; border-radius: 14px; border: 1px solid rgba(255, 255, 255, 0.08); }
    .search-input { padding: 10px 16px; border-radius: 10px; background: #1f2937; border: 1px solid #374151; color: #ffffff; font-size: 13px; width: 320px; outline: none; }
    .search-input:focus { border-color: #a855f7; }
    .btn-print { padding: 10px 20px; border-radius: 10px; background: linear-gradient(135deg, #f59e0b, #d97706); color: #0f172a; font-weight: 800; font-size: 13px; border: none; cursor: pointer; display: flex; align-items: center; gap: 8px; box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3); }
    .btn-print:hover { opacity: 0.95; }
    .section-title { font-size: 20px; font-weight: 800; color: #f59e0b; margin-bottom: 16px; display: flex; align-items: center; gap: 8px; font-family: 'Outfit', sans-serif; }
    .table-container { background: #111827; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 16px; overflow-x: auto; margin-bottom: 48px; }
    table { width: 100%; border-collapse: collapse; font-size: 12px; text-align: left; }
    th { background: #1f2937; color: #94a3b8; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; padding: 12px 14px; border-bottom: 1px solid #374151; font-size: 10px; white-space: nowrap; }
    td { padding: 12px 14px; border-bottom: 1px solid #1f2937; color: #cbd5e1; vertical-align: top; }
    tr:hover td { background: rgba(255, 255, 255, 0.03); }
    .badge { display: inline-block; padding: 3px 8px; border-radius: 6px; font-weight: 800; font-size: 11px; }
    .badge-ipa { background: rgba(6, 78, 59, 0.8); color: #6ee7b7; border: 1px solid #10b981; }
    .badge-ips { background: rgba(88, 28, 135, 0.8); color: #d8b4fe; border: 1px solid #a855f7; }
    .badge-hybrid { background: rgba(120, 53, 15, 0.8); color: #fcd34d; border: 1px solid #f59e0b; }
    .cert-wrapper { margin-bottom: 48px; page-break-after: always; display: flex; justify-content: center; }
    .certificate-card { width: 1000px; height: 700px; background: linear-gradient(135deg, #0c1222 0%, #0f172a 50%, #151a30 100%); color: #f8fafc; padding: 36px; border: 4px solid #f59e0b; border-radius: 12px; position: relative; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 20px 40px rgba(0,0,0,0.5); }
    .cert-guilloche-1 { position: absolute; inset: 8px; border: 2px solid rgba(245, 158, 11, 0.35); border-radius: 8px; pointer-events-none; }
    .cert-guilloche-2 { position: absolute; inset: 16px; border: 1px solid rgba(129, 140, 248, 0.2); border-radius: 6px; pointer-events-none; }
    .footer-note { text-align: center; font-size: 11px; color: #64748b; margin-top: 32px; padding-top: 16px; border-top: 1px solid #1f2937; }
    @media print {
      body { background: #ffffff !important; color: #000000 !important; padding: 0 !important; }
      .no-print { display: none !important; }
      .table-container { border: 1px solid #ccc !important; }
      table th { background: #eee !important; color: #000 !important; }
      table td { color: #000 !important; border-bottom: 1px solid #ddd !important; }
      .certificate-card { box-shadow: none !important; page-break-inside: avoid; margin: 0 auto; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .cert-wrapper { page-break-after: always; margin-bottom: 0; }
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="header-box">
      <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: #f59e0b; letter-spacing: 0.2em; margin-bottom: 8px;">
        Dokumen Arsip & Database Resmi
      </div>
      <h1 style="font-size: 32px; font-weight: 900; color: #ffffff; margin-bottom: 4px; font-family: 'Outfit', sans-serif;">${settings.schoolName || 'SMA GENESIS MEDICARE'}</h1>
      <p style="font-size: 14px; color: #cbd5e1;">${settings.eventName || 'Open House & Talent Discovery'} • Periode: ${settings.eventDate || '2026/2027'}</p>
      <p style="font-size: 12px; color: #94a3b8; margin-top: 6px;">Alamat: ${settings.schoolAddress || 'Jl. Gas Alam No. 9, Curug, Kec. Cimanggis, Kota Depok'}</p>
      <div style="font-size: 11px; color: #a855f7; font-weight: 700; margin-top: 12px;">Tanggal Ekspor Arsip: ${exportDate} • Powered by Pak GuruAI</div>
    </div>

    <!-- Toolbar: Search & Print Button -->
    <div class="toolbar-box no-print">
      <div style="display: flex; align-items: center; gap: 10px;">
        <span style="font-size: 12px; color: #94a3b8; font-weight: 600;">Cari Data:</span>
        <input
          type="text"
          id="tableSearchInput"
          class="search-input"
          placeholder="Ketik nama siswa, sekolah, jurusan, atau HP..."
          onkeyup="filterStudentTable()"
        />
      </div>
      <button class="btn-print" onclick="window.print()">
        <span>🖨️ Cetak / Simpan PDF (Ctrl + P)</span>
      </button>
    </div>

    <!-- Statistics -->
    <div class="stats-grid no-print">
      <div class="stat-card">
        <div style="font-size: 11px; color: #94a3b8; font-weight: 600;">TOTAL SISWA TERDATA</div>
        <div class="stat-val">${totalCount} Siswa</div>
      </div>
      <div class="stat-card">
        <div style="font-size: 11px; color: #6ee7b7; font-weight: 600;">DOMINAN IPA</div>
        <div class="stat-val" style="color: #6ee7b7;">${ipaCount} <span style="font-size: 14px; font-weight: 600; color: #94a3b8;">(${totalCount > 0 ? Math.round((ipaCount / totalCount) * 100) : 0}%)</span></div>
      </div>
      <div class="stat-card">
        <div style="font-size: 11px; color: #d8b4fe; font-weight: 600;">DOMINAN IPS</div>
        <div class="stat-val" style="color: #d8b4fe;">${ipsCount} <span style="font-size: 14px; font-weight: 600; color: #94a3b8;">(${totalCount > 0 ? Math.round((ipsCount / totalCount) * 100) : 0}%)</span></div>
      </div>
      <div class="stat-card">
        <div style="font-size: 11px; color: #fcd34d; font-weight: 600;">MULTITALENTA / HYBRID</div>
        <div class="stat-val" style="color: #fcd34d;">${hybridCount} <span style="font-size: 14px; font-weight: 600; color: #94a3b8;">(${totalCount > 0 ? Math.round((hybridCount / totalCount) * 100) : 0}%)</span></div>
      </div>
    </div>

    <!-- Section 1: Full Database Table -->
    <div class="section-title">
      <span>📋 Tabel Database Lengkap Seluruh Peserta Asesmen (${results.length} Siswa Terdaftar)</span>
    </div>

    <div class="table-container">
      <table id="mainStudentTable">
        <thead>
          <tr>
            <th>No</th>
            <th>Identitas Lengkap Siswa</th>
            <th>Asal Sekolah & Kelas</th>
            <th>Alamat Domisili</th>
            <th>Kontak WhatsApp (Siswa / Ortu)</th>
            <th>Skor IPA / IPS</th>
            <th>Rekomendasi</th>
            <th>Klaster Talent Me</th>
            <th>Top 3 Bakat Dominan</th>
            <th>8 Kecerdasan Gardner</th>
            <th>Gaya Belajar & Karir</th>
            <th>Ekskul Rekomendasi</th>
          </tr>
        </thead>
        <tbody>
          ${results.map((r, i) => `
            <tr>
              <td style="font-family: monospace; font-weight: 700; color: #64748b;">${i + 1}</td>
              <td>
                <strong style="color: #ffffff; font-size: 13px;">${r.fullName}</strong>
                <div style="font-size: 9px; color: #64748b; font-family: monospace;">ID: ${r.id}</div>
                <div style="font-size: 9px; color: #94a3b8;">${new Date(r.createdAt).toLocaleString('id-ID')}</div>
              </td>
              <td>
                <strong style="color: #e2e8f0;">${r.schoolOrigin}</strong>
                <div style="color: #94a3b8; font-size: 11px;">Kelas: ${r.grade}</div>
              </td>
              <td style="max-width: 180px; font-size: 11px;">${r.address}</td>
              <td style="font-size: 11px; white-space: nowrap;">
                <div>Siswa: <a href="https://wa.me/${r.studentPhone.replace(/[^0-9]/g, '')}" target="_blank" style="color: #10b981; text-decoration: none; font-weight: 600;">${r.studentPhone}</a></div>
                <div style="color: #94a3b8;">Ortu: <a href="https://wa.me/${r.parentPhone.replace(/[^0-9]/g, '')}" target="_blank" style="color: #94a3b8; text-decoration: none;">${r.parentPhone}</a></div>
              </td>
              <td style="text-align: center; font-weight: 800; white-space: nowrap;">
                <span style="color: #60a5fa;">${r.ipaScore}</span> / <span style="color: #c084fc;">${r.ipsScore}</span>
              </td>
              <td>
                <span class="badge ${r.recommendation === 'IPA' ? 'badge-ipa' : r.recommendation === 'IPS' ? 'badge-ips' : 'badge-hybrid'}">
                  ${r.recommendation}
                </span>
                <div style="font-size: 9px; color: #94a3b8; margin-top: 2px;">${r.recommendationTitle}</div>
              </td>
              <td style="font-size: 10px; color: #cbd5e1; white-space: nowrap;">
                <div>Thinking: <strong style="color: #60a5fa;">${r.talentDnaScores.thinking}%</strong></div>
                <div>Doing: <strong style="color: #f59e0b;">${r.talentDnaScores.doing}%</strong></div>
                <div>Relating: <strong style="color: #c084fc;">${r.talentDnaScores.relating}%</strong></div>
              </td>
              <td style="font-size: 11px; min-width: 140px;">
                ${r.topTalents.map((t, idx) => `<div style="margin-bottom: 2px;">${idx + 1}. <strong style="color: #fcd34d;">${t}</strong></div>`).join('')}
              </td>
              <td style="font-size: 10px; color: #94a3b8; min-width: 160px;">
                <div>Logika: <strong style="color:#fff">${r.gardnerScores.logical}%</strong> | Spasial: <strong style="color:#fff">${r.gardnerScores.spatial}%</strong></div>
                <div>Naturalis: <strong style="color:#fff">${r.gardnerScores.naturalist}%</strong> | Bahasa: <strong style="color:#fff">${r.gardnerScores.linguistic}%</strong></div>
                <div>Sosial: <strong style="color:#fff">${r.gardnerScores.interpersonal}%</strong> | Refleksi: <strong style="color:#fff">${r.gardnerScores.intrapersonal}%</strong></div>
                <div>Kinestetik: <strong style="color:#fff">${r.gardnerScores.kinesthetic}%</strong> | Musikal: <strong style="color:#fff">${r.gardnerScores.musical}%</strong></div>
              </td>
              <td style="font-size: 11px; max-width: 200px;">
                <div style="color: #e2e8f0; font-weight: 600;">${r.learningStyle}</div>
                <div style="color: #f59e0b; font-size: 10px; margin-top: 3px;">${r.careerProspects.slice(0, 3).join(', ')}</div>
              </td>
              <td style="font-size: 10px; color: #94a3b8; min-width: 140px;">
                ${r.recommendedExtracurriculars.map(e => `<div>• ${e}</div>`).join('')}
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <!-- Section 2: Complete Certificates Dossier -->
    <div class="section-title">
      <span>🎓 Berkas Sertifikat Profil Bakat Resmi Seluruh Siswa (${results.length} Dokumen Lengkap)</span>
    </div>

    ${results.map((r) => {
      const recColor = r.recommendation === 'IPA' ? '#10b981' : r.recommendation === 'IPS' ? '#a855f7' : '#f59e0b';
      const recBg = r.recommendation === 'IPA' ? 'rgba(6, 78, 59, 0.7)' : r.recommendation === 'IPS' ? 'rgba(88, 28, 135, 0.7)' : 'rgba(120, 53, 15, 0.7)';
      const recTitle = r.recommendation === 'IPA' ? 'Dominan Sains & Teknologi (IPA)' : r.recommendation === 'IPS' ? 'Dominan Sosial & Humaniora (IPS)' : 'Multitalenta & Terintegrasi (HYBRID)';
      const recTag = r.recommendation === 'IPA' ? 'THE FUTURE TECHNOLOGIST & SCIENTIST' : r.recommendation === 'IPS' ? 'THE FUTURE LEADER & STRATEGIST' : 'THE INNOVATIVE POLYMATH';
      const certDate = new Date(r.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

      return `
      <div class="cert-wrapper">
        <div class="certificate-card">
          <div class="cert-guilloche-1"></div>
          <div class="cert-guilloche-2"></div>

          <!-- Top Header -->
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(245, 158, 11, 0.35); padding-bottom: 12px; position: relative; z-index: 10;">
            <div style="display: flex; align-items: center; gap: 14px;">
              <div style="width: 52px; height: 52px; border-radius: 10px; background: linear-gradient(135deg, #7c3aed, #f59e0b); padding: 2px;">
                <div style="width: 100%; height: 100%; background: #0c1222; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 24px; color: #f59e0b;">
                  🧭
                </div>
              </div>
              <div>
                <div style="font-size: 10px; font-weight: 700; text-transform: uppercase; color: #f59e0b; letter-spacing: 0.2em;">SERTIFIKAT RESMI ASESMEN BAKAT & PENJURUSAN</div>
                <h2 style="font-size: 22px; font-weight: 800; color: #ffffff; margin-top: 2px; font-family: 'Outfit', sans-serif;">${settings.schoolName || 'SMA GENESIS MEDICARE'}</h2>
                <div style="font-size: 11px; color: #94a3b8;">${settings.eventName || 'Open House'} • ${settings.schoolAddress || 'Depok'}</div>
              </div>
            </div>
            <div style="text-align: right;">
              <div style="display: inline-block; padding: 4px 10px; border-radius: 9999px; background: rgba(88, 28, 135, 0.4); border: 1px solid rgba(192, 132, 252, 0.4); font-size: 10px; font-weight: 700; color: #d8b4fe;">
                G-Compass Verified
              </div>
              <div style="font-size: 10px; color: #94a3b8; font-family: monospace; margin-top: 4px;">NO: G-CP/${new Date(r.createdAt).getFullYear()}/${r.id.substring(0, 10).toUpperCase()}</div>
            </div>
          </div>

          <!-- Recipient -->
          <div style="text-align: center; margin: auto 0; position: relative; z-index: 10;">
            <div style="font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #cbd5e1; font-weight: 600;">Diberikan dengan bangga kepada:</div>
            <h3 style="font-size: 32px; font-weight: 900; color: #fde047; letter-spacing: 0.05em; margin: 8px 0; font-family: 'Outfit', sans-serif;">${r.fullName.toUpperCase()}</h3>
            <div style="font-size: 12px; color: #cbd5e1;">
              Asal Sekolah: <strong style="color: #ffffff;">${r.schoolOrigin}</strong> • Kelas: <strong style="color: #ffffff;">${r.grade}</strong> • Waktu Asesmen: <strong style="color: #ffffff;">${certDate}</strong>
            </div>
            <div style="font-size: 11px; color: #94a3b8; max-width: 600px; margin: 8px auto 0; line-height: 1.5;">
              Telah menyelesaikan seluruh rangkaian asesmen potensi diri berbasis Logika Akademik, Teori 8 Kecerdasan Majemuk Howard Gardner, serta Klaster Pemetaan Bakat Talent Me dengan hasil:
            </div>

            <!-- Recommendation Box -->
            <div style="margin-top: 14px; display: inline-flex; align-items: center; gap: 12px; padding: 10px 24px; border-radius: 12px; background: ${recBg}; border: 1px solid ${recColor};">
              <span style="font-size: 24px;">🏆</span>
              <div style="text-align: left;">
                <div style="font-size: 10px; font-weight: 800; color: #f59e0b; letter-spacing: 0.1em; text-transform: uppercase;">REKOMENDASI PENJURUSAN UTAMA:</div>
                <div style="font-size: 18px; font-weight: 900; color: #ffffff; font-family: 'Outfit', sans-serif;">${recTitle}</div>
              </div>
            </div>
            <div style="font-size: 10px; font-family: monospace; letter-spacing: 0.15em; color: #94a3b8; margin-top: 4px;">${recTag}</div>
          </div>

          <!-- Bottom Metrics -->
          <div style="display: grid; grid-template-columns: 5fr 7fr; gap: 16px; background: rgba(15, 23, 42, 0.75); padding: 14px 16px; border-radius: 12px; border: 1px solid rgba(71, 85, 105, 0.5); font-size: 11px; position: relative; z-index: 10;">
            <div style="border-right: 1px solid rgba(71, 85, 105, 0.5); padding-right: 12px;">
              <div style="font-size: 10px; font-weight: 800; color: #f59e0b; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px;">Top 3 Bakat Dominan (Talent Me)</div>
              ${r.topTalents.map((t, idx) => `
                <div style="background: rgba(30, 41, 59, 0.85); padding: 3px 8px; border-radius: 6px; margin-bottom: 4px; display: flex; align-items: center; gap: 6px;">
                  <span style="width: 14px; height: 14px; border-radius: 50%; background: rgba(245, 158, 11, 0.25); color: #fcd34d; font-size: 9px; font-weight: 800; display: flex; align-items: center; justify-content: center;">${idx + 1}</span>
                  <span style="font-weight: 600; color: #e2e8f0; font-size: 11px;">${t}</span>
                </div>
              `).join('')}
            </div>
            <div>
              <div style="font-size: 10px; font-weight: 800; color: #38bdf8; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px;">Distribusi 8 Kecerdasan Majemuk (Gardner Scale)</div>
              <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; font-size: 9px; text-align: center;">
                <div style="background: rgba(30, 41, 59, 0.6); padding: 4px; border-radius: 4px; border: 1px solid rgba(71, 85, 105, 0.4);">
                  <div style="color: #94a3b8;">Logika</div><strong style="color: #fff; font-size: 11px;">${r.gardnerScores.logical}%</strong>
                </div>
                <div style="background: rgba(30, 41, 59, 0.6); padding: 4px; border-radius: 4px; border: 1px solid rgba(71, 85, 105, 0.4);">
                  <div style="color: #94a3b8;">Spasial</div><strong style="color: #fff; font-size: 11px;">${r.gardnerScores.spatial}%</strong>
                </div>
                <div style="background: rgba(30, 41, 59, 0.6); padding: 4px; border-radius: 4px; border: 1px solid rgba(71, 85, 105, 0.4);">
                  <div style="color: #94a3b8;">Naturalis</div><strong style="color: #fff; font-size: 11px;">${r.gardnerScores.naturalist}%</strong>
                </div>
                <div style="background: rgba(30, 41, 59, 0.6); padding: 4px; border-radius: 4px; border: 1px solid rgba(71, 85, 105, 0.4);">
                  <div style="color: #94a3b8;">Bahasa</div><strong style="color: #fff; font-size: 11px;">${r.gardnerScores.linguistic}%</strong>
                </div>
                <div style="background: rgba(30, 41, 59, 0.6); padding: 4px; border-radius: 4px; border: 1px solid rgba(71, 85, 105, 0.4);">
                  <div style="color: #94a3b8;">Sosial</div><strong style="color: #fff; font-size: 11px;">${r.gardnerScores.interpersonal}%</strong>
                </div>
                <div style="background: rgba(30, 41, 59, 0.6); padding: 4px; border-radius: 4px; border: 1px solid rgba(71, 85, 105, 0.4);">
                  <div style="color: #94a3b8;">Refleksi</div><strong style="color: #fff; font-size: 11px;">${r.gardnerScores.intrapersonal}%</strong>
                </div>
                <div style="background: rgba(30, 41, 59, 0.6); padding: 4px; border-radius: 4px; border: 1px solid rgba(71, 85, 105, 0.4);">
                  <div style="color: #94a3b8;">Kinestetik</div><strong style="color: #fff; font-size: 11px;">${r.gardnerScores.kinesthetic}%</strong>
                </div>
                <div style="background: rgba(30, 41, 59, 0.6); padding: 4px; border-radius: 4px; border: 1px solid rgba(71, 85, 105, 0.4);">
                  <div style="color: #94a3b8;">Musikal</div><strong style="color: #fff; font-size: 11px;">${r.gardnerScores.musical}%</strong>
                </div>
              </div>
            </div>
          </div>

          <!-- Signature Footer -->
          <div style="display: flex; justify-content: space-between; align-items: flex-end; border-top: 1px solid rgba(71, 85, 105, 0.5); padding-top: 12px; position: relative; z-index: 10;">
            <div>
              <div style="font-family: monospace; font-size: 9px; color: #94a3b8;">Verifikasi Dokumen Resmi</div>
              <div style="font-family: monospace; font-size: 9px; color: #fcd34d; font-weight: 600;">https://genesis-medicare.sch.id</div>
              <div style="font-size: 8px; color: #64748b; margin-top: 2px;">Powered by Pak GuruAI</div>
            </div>
            <div style="text-align: center; width: 220px;">
              <div style="color: #94a3b8; font-size: 10px;">Kota Depok, ${certDate}</div>
              <div style="color: #cbd5e1; font-size: 10px; font-weight: 600;">SMA Genesis Medicare</div>
              <div style="height: 44px; display: flex; align-items: center; justify-content: center; position: relative; margin: 2px 0;">
                <div style="font-family: 'Great Vibes', 'Dancing Script', 'Caveat', cursive, serif; font-style: italic; font-size: 26px; color: #fef08a; transform: rotate(-4deg); letter-spacing: 1px;">
                  ${signatureName}
                </div>
              </div>
              <div style="font-weight: 700; color: #ffffff; font-size: 11px; border-top: 1px solid rgba(100, 116, 139, 0.8); padding-top: 4px;">
                ${settings.principalName || 'Dra. Hj. Brimayanti'}
              </div>
              <div style="font-size: 9px; color: #94a3b8;">Kepala SMA Genesis Medicare</div>
            </div>
          </div>
        </div>
      </div>
      `;
    }).join('')}

    <div class="footer-note">
      Dokumen ini diterbitkan secara otomatis oleh Sistem G-Compass (Genesis Talent & Career Compass) • SMA Genesis Medicare • Powered by Pak GuruAI
    </div>
  </div>

  <script>
    function filterStudentTable() {
      const query = document.getElementById('tableSearchInput').value.toLowerCase();
      const rows = document.querySelectorAll('#mainStudentTable tbody tr');
      rows.forEach(row => {
        const text = row.innerText.toLowerCase();
        row.style.display = text.includes(query) ? '' : 'none';
      });
    }
  </script>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Rekap_Lengkap_Siswa_Sertifikat_SMA_Genesis_Medicare_${new Date().toISOString().slice(0, 10)}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Export Table to CSV
  const handleExportCSV = () => {
    if (results.length === 0) {
      alert('Belum ada data siswa untuk diekspor.');
      return;
    }

    const headers = [
      'No',
      'ID Asesmen',
      'Nama Lengkap',
      'Asal Sekolah',
      'Kelas',
      'Alamat',
      'No HP Siswa',
      'No HP Orang Tua',
      'Skor IPA',
      'Skor IPS',
      'Rekomendasi',
      'Top 1 Bakat',
      'Top 2 Bakat',
      'Top 3 Bakat',
      'Waktu Asesmen',
    ];

    const rows = results.map((r, i) => [
      i + 1,
      r.id,
      `"${r.fullName.replace(/"/g, '""')}"`,
      `"${r.schoolOrigin.replace(/"/g, '""')}"`,
      `"${r.grade.replace(/"/g, '""')}"`,
      `"${r.address.replace(/"/g, '""')}"`,
      `'${r.studentPhone}`,
      `'${r.parentPhone}`,
      r.ipaScore,
      r.ipsScore,
      r.recommendation,
      `"${(r.topTalents[0] || '').replace(/"/g, '""')}"`,
      `"${(r.topTalents[1] || '').replace(/"/g, '""')}"`,
      `"${(r.topTalents[2] || '').replace(/"/g, '""')}"`,
      `"${new Date(r.createdAt).toLocaleString('id-ID')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Rekap_Siswa_G-Compass_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Download Certificate as PDF via html2canvas & jsPDF
  const handleDownloadCertificate = async (student: TestResult) => {
    setSelectedStudentForCert(student);
    setIsGeneratingPdf(true);

    try {
      // Ensure the certificate container is rendered with the chosen student data
      await new Promise(resolve => setTimeout(resolve, 200));
      const element = document.getElementById('certificate-print-container');
      if (!element) {
        throw new Error('Elemen sertifikat tidak ditemukan');
      }

      const canvas = await html2canvas(element, {
        scale: 2, // High resolution for professional print
        useCORS: true,
        backgroundColor: '#0c1222',
        logging: false,
        onclone: (clonedDoc) => {
          // Fix Tailwind v4 unsupported color function "oklab" / "oklch" error in html2canvas
          const styleElements = clonedDoc.querySelectorAll('style');
          styleElements.forEach((s) => {
            if (s.textContent) {
              s.textContent = s.textContent
                .replace(/oklab\([^)]+\)/gi, 'rgba(124, 58, 237, 0.8)')
                .replace(/oklch\([^)]+\)/gi, 'rgba(245, 158, 11, 0.8)');
            }
          });

          // Also sanitize any inline styles in the cloned tree
          const allCloned = clonedDoc.querySelectorAll('*');
          allCloned.forEach((node) => {
            const el = node as HTMLElement;
            if (el.style) {
              ['color', 'backgroundColor', 'borderColor', 'outlineColor'].forEach((prop) => {
                const val = (el.style as any)[prop];
                if (val && typeof val === 'string' && (val.includes('oklab') || val.includes('oklch'))) {
                  (el.style as any)[prop] = '#ffffff';
                }
              });
            }
          });
        },
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Sertifikat_${student.fullName.replace(/\s+/g, '_')}_GCompass.pdf`);
    } catch (err) {
      console.error('Error generating PDF:', err);
      alert('Gagal menghasilkan sertifikat PDF. Silakan coba kembali.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await onRefreshData();
    setIsRefreshing(false);
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Top Header & Status Switcher */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-purple-500/30 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Dashboard Administrator Resmi</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-heading">
            G-Compass Management Control
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {settings.schoolName} • Database Asesmen & Konfigurasi Sistem
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* TOGGLE SWITCH STATUS APLIKASI */}
          <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-slate-900/90 border border-slate-800">
            <div className="flex flex-col text-left">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Status Sistem</span>
              <span className={`text-xs font-extrabold ${settings.isAppActive ? 'text-emerald-400' : 'text-rose-400'}`}>
                {settings.isAppActive ? 'Sesi Aktif' : 'Sesi Ditutup'}
              </span>
            </div>
            <button
              onClick={handleToggleAppStatus}
              className={`relative inline-flex h-7 w-13 items-center rounded-full transition-colors focus:outline-none ${
                settings.isAppActive ? 'bg-emerald-500' : 'bg-slate-700'
              }`}
              title="Klik untuk mengubah status aplikasi"
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform ${
                  settings.isAppActive ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-3 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-all text-xs flex items-center gap-2"
            title="Sinkronisasi Data Firestore"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-purple-400' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          {/* Exit Admin Button */}
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-2xl bg-purple-900/40 hover:bg-purple-800/60 border border-purple-500/30 text-purple-200 text-xs font-bold transition-all flex items-center gap-2"
          >
            <Compass className="w-4 h-4" />
            <span>Kembali ke Web Siswa</span>
          </button>
        </div>
      </div>

      {/* Nav Tabs */}
      <div className="flex border-b border-slate-800 gap-2 overflow-x-auto pb-1 scrollbar-thin">
        <button
          onClick={() => setActiveTab('database')}
          className={`pb-3 px-5 text-sm font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap shrink-0 ${
            activeTab === 'database'
              ? 'border-amber-400 text-amber-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Database Siswa & Sertifikat ({totalCount})</span>
        </button>

        <button
          onClick={() => setActiveTab('counselor_guide')}
          className={`pb-3 px-5 text-sm font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap shrink-0 ${
            activeTab === 'counselor_guide'
              ? 'border-emerald-400 text-emerald-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Brain className="w-4 h-4 text-emerald-400" />
          <span>Panduan & Interpretasi Konselor BK</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`pb-3 px-5 text-sm font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap shrink-0 ${
            activeTab === 'settings'
              ? 'border-purple-400 text-purple-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Pengaturan Umum Event & Lembaga</span>
        </button>

        {selectedStudentForCert && (
          <button
            onClick={() => setActiveTab('certificate_preview')}
            className={`pb-3 px-5 text-sm font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap shrink-0 ${
              activeTab === 'certificate_preview'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Pratinjau Sertifikat ({selectedStudentForCert.fullName})</span>
          </button>
        )}
      </div>

      {/* TAB 1: DATABASE SISWA */}
      {activeTab === 'database' && (
        <div className="space-y-6">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="glass-card p-4 rounded-2xl border border-purple-500/20">
              <div className="text-xs text-slate-400 font-semibold">Total Peserta Asesmen</div>
              <div className="text-2xl font-black text-white mt-1 font-heading">{totalCount} Siswa</div>
            </div>
            <div className="glass-card p-4 rounded-2xl border border-blue-500/20">
              <div className="text-xs text-blue-400 font-semibold">Dominan IPA</div>
              <div className="text-2xl font-black text-white mt-1 font-heading">
                {ipaCount} <span className="text-xs text-slate-400 font-normal">({totalCount > 0 ? Math.round((ipaCount / totalCount) * 100) : 0}%)</span>
              </div>
            </div>
            <div className="glass-card p-4 rounded-2xl border border-purple-500/20">
              <div className="text-xs text-purple-400 font-semibold">Dominan IPS</div>
              <div className="text-2xl font-black text-white mt-1 font-heading">
                {ipsCount} <span className="text-xs text-slate-400 font-normal">({totalCount > 0 ? Math.round((ipsCount / totalCount) * 100) : 0}%)</span>
              </div>
            </div>
            <div className="glass-card p-4 rounded-2xl border border-amber-500/20">
              <div className="text-xs text-amber-400 font-semibold">Multitalenta / Hybrid</div>
              <div className="text-2xl font-black text-white mt-1 font-heading">
                {hybridCount} <span className="text-xs text-slate-400 font-normal">({totalCount > 0 ? Math.round((hybridCount / totalCount) * 100) : 0}%)</span>
              </div>
            </div>
          </div>

          {/* Filters, Search & Export Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Cari nama, asal sekolah, atau nomor HP..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-purple-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-3 text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Filter Tabs & Export */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex rounded-xl bg-slate-900/80 p-1 border border-slate-800 text-xs">
                {['ALL', 'IPA', 'IPS', 'HYBRID'].map(tag => (
                  <button
                    key={tag}
                    onClick={() => setFilterRecommendation(tag)}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                      filterRecommendation === tag
                        ? 'bg-purple-600 text-white shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {tag === 'ALL' ? 'Semua' : tag}
                  </button>
                ))}
              </div>

              {/* Export to CSV Button */}
              <button
                onClick={handleExportCSV}
                className="px-3.5 py-2 rounded-xl bg-emerald-700/80 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-700/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                title="Unduh Rekapitulasi Excel/CSV untuk Panitia PPDB"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Ekspor CSV</span>
              </button>

              {/* Export to HTML Button */}
              <button
                onClick={handleExportHTML}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-600 hover:to-indigo-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-purple-700/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
                title="Unduh Database & Seluruh Sertifikat Resmi dalam format HTML"
              >
                <FileText className="w-4 h-4 text-amber-300" />
                <span>Unduh Rekap (HTML)</span>
              </button>
            </div>
          </div>

          {/* Database Table */}
          <div className="glass-card rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900/90 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="py-3.5 px-4 font-bold">No</th>
                    <th className="py-3.5 px-4 font-bold">Nama Siswa</th>
                    <th className="py-3.5 px-4 font-bold">Asal Sekolah & Kelas</th>
                    <th className="py-3.5 px-4 font-bold">Kontak (WA Siswa / Ortu)</th>
                    <th className="py-3.5 px-4 font-bold text-center">Skor IPA / IPS</th>
                    <th className="py-3.5 px-4 font-bold">Rekomendasi</th>
                    <th className="py-3.5 px-4 font-bold text-center">Aksi Eksklusif Admin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-medium">
                  {filteredResults.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-500">
                        Tidak ada data siswa yang cocok dengan kriteria pencarian.
                      </td>
                    </tr>
                  ) : (
                    filteredResults.map((student, idx) => (
                      <tr key={student.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3.5 px-4 text-slate-500 font-mono">{idx + 1}</td>
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-white text-sm">{student.fullName}</div>
                          <div className="text-[10px] text-slate-400 font-mono">ID: {student.id.substring(0, 12)}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="text-slate-200">{student.schoolOrigin}</div>
                          <div className="text-[10px] text-slate-400">Kelas: {student.grade}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5">
                            <span className="text-slate-400 text-[10px]">Siswa:</span>
                            <a
                              href={`https://wa.me/${student.studentPhone.replace(/[^0-9]/g, '')}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-emerald-400 hover:underline flex items-center gap-1"
                            >
                              <Phone className="w-3 h-3" />
                              <span>{student.studentPhone}</span>
                            </a>
                          </div>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-slate-400 text-[10px]">Ortu:</span>
                            <a
                              href={`https://wa.me/${student.parentPhone.replace(/[^0-9]/g, '')}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-slate-300 hover:underline"
                            >
                              {student.parentPhone}
                            </a>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className="font-bold text-blue-400">{student.ipaScore}</span>
                          <span className="text-slate-500 mx-1">/</span>
                          <span className="font-bold text-purple-400">{student.ipsScore}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex px-2.5 py-1 rounded-md text-[11px] font-extrabold border ${
                              student.recommendation === 'IPA'
                                ? 'bg-blue-950/60 border-blue-500/50 text-blue-300'
                                : student.recommendation === 'IPS'
                                ? 'bg-purple-950/60 border-purple-500/50 text-purple-300'
                                : 'bg-amber-950/60 border-amber-500/50 text-amber-300'
                            }`}
                          >
                            {student.recommendation}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex flex-wrap items-center justify-center gap-1.5">
                            {/* TOMBOL PANDUAN KONSELOR & ANALISIS DETAIL EKSKLUSIF ADMIN */}
                            <button
                              onClick={() => setSelectedCounselorStudent(student)}
                              className="px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-purple-800 to-indigo-800 hover:from-purple-700 hover:to-indigo-700 text-purple-200 border border-purple-500/40 font-bold text-[11px] shadow-sm flex items-center gap-1.5 transition-all hover:scale-[1.02] active:scale-[0.98]"
                              title="Buka Lembar Panduan Konselor & Analisis Diagnostik Detail"
                            >
                              <Brain className="w-3.5 h-3.5 text-amber-300" />
                              <span className="hidden sm:inline">Analisis Konselor</span>
                            </button>

                            {/* TOMBOL CETAK / UNDUH SERTIFIKAT EKSKLUSIF ADMIN */}
                            <button
                              onClick={() => {
                                setSelectedStudentForCert(student);
                                handleDownloadCertificate(student);
                              }}
                              disabled={isGeneratingPdf}
                              className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-slate-950 font-extrabold text-[11px] shadow-md shadow-amber-500/20 flex items-center gap-1.5 transition-all hover:scale-[1.02] active:scale-[0.98]"
                              title="Cetak & Unduh Sertifikat Resmi PDF (Fitur Eksklusif Admin)"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>Unduh Sertifikat</span>
                            </button>

                            {/* Pratinjau Sertifikat */}
                            <button
                              onClick={() => {
                                setSelectedStudentForCert(student);
                                setActiveTab('certificate_preview');
                              }}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
                              title="Pratinjau Sertifikat"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>

                            {/* Hapus Data */}
                            <button
                              onClick={async () => {
                                if (window.confirm(`Yakin ingin menghapus data asesmen ${student.fullName}?`)) {
                                  await onDeleteResult(student.id);
                                }
                              }}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 border border-slate-700 transition-colors"
                              title="Hapus Data"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PENGATURAN UMUM EVENT */}
      {activeTab === 'settings' && (
        <div className="max-w-2xl mx-auto glass-card rounded-3xl p-6 sm:p-10 border border-purple-500/30 shadow-2xl">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-800 mb-6">
            <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-300">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-heading">
                Pengaturan Umum Event & Lembaga
              </h2>
              <p className="text-xs text-slate-400">
                Data ini akan tercetak otomatis pada Sertifikat Resmi dan tampilan aplikasi
              </p>
            </div>
          </div>

          {saveSuccessMsg && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{saveSuccessMsg}</span>
            </div>
          )}

          <form onSubmit={handleSaveSettings} className="space-y-5">
            {/* Nama Lembaga / Sekolah */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Nama Lembaga / Sekolah
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.schoolName}
                  onChange={e => setFormData({ ...formData, schoolName: e.target.value })}
                  placeholder="SMA Genesis Medicare"
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            {/* Alamat Sekolah */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Alamat Lengkap Lembaga
              </label>
              <textarea
                rows={2}
                value={formData.schoolAddress}
                onChange={e => setFormData({ ...formData, schoolAddress: e.target.value })}
                placeholder="Jl. Gas Alam No. 9, Curug, Kec. Cimanggis, Kota Depok, Jawa Barat 16453"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-purple-500 resize-none"
              />
            </div>

            {/* Nama Acara / Event */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Nama Acara / Event
              </label>
              <input
                type="text"
                value={formData.eventName}
                onChange={e => setFormData({ ...formData, eventName: e.target.value })}
                placeholder="Open House & Talent Discovery 2026/2027"
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-purple-500"
              />
            </div>

            {/* Tanggal / Periode Pelaksanaan */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Tanggal / Periode Pelaksanaan
              </label>
              <input
                type="text"
                value={formData.eventDate}
                onChange={e => setFormData({ ...formData, eventDate: e.target.value })}
                placeholder="Tahun Ajaran 2026/2027 / 15 Oktober 2026"
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-purple-500"
              />
            </div>

            {/* Nama Kepala Sekolah */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Nama Kepala Sekolah / Penandatangan Sertifikat
              </label>
              <input
                type="text"
                value={formData.principalName || ''}
                onChange={e => setFormData({ ...formData, principalName: e.target.value })}
                placeholder="Dra. Hj. Sri Wahyuni, M.Pd."
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-purple-500"
              />
            </div>

            {/* No. WhatsApp Konselor / Layanan Sekolah */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>No. WhatsApp Konselor / Layanan Sekolah (Untuk Konsultasi Siswa & Ortu)</span>
              </label>
              <input
                type="text"
                value={formData.whatsappNumber || ''}
                onChange={e => setFormData({ ...formData, whatsappNumber: e.target.value })}
                placeholder="081289123456"
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-purple-500"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Nomor WhatsApp ini otomatis terintegrasi pada tombol "Konsultasi via WhatsApp" di hasil asesmen siswa dan berkas panduan.
              </p>
            </div>

            {/* Submit */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-sm tracking-wide shadow-xl shadow-purple-600/30 transition-all flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>Simpan Perubahan Pengaturan</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 3: PANDUAN & INTERPRETASI KONSELOR BK (KHUSUS ADMIN) */}
      {activeTab === 'counselor_guide' && (
        <div className="space-y-8 animate-fade-in text-slate-200">
          {/* Header Banner */}
          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-emerald-500/40 relative overflow-hidden bg-gradient-to-r from-emerald-950/70 via-slate-900/90 to-purple-950/70">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/60 border border-emerald-500/50 text-emerald-300 text-xs font-bold uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Dossier Rahasia & Panduan Konselor BK Resmi</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white font-heading">
                  Panduan Lengkap Interpretasi Asesmen G-Compass
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
                  Modul ini dirancang khusus bagi Tim Bimbingan Konseling (BK) dan Konsultan Pendidikan di <strong>SMA Genesis Medicare</strong> untuk membedah hasil asesmen secara objektif, mendalam, dan profesional saat sesi wawancara PPDB maupun penjurusan Kurikulum Merdeka.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-center shrink-0">
                <div className="text-[11px] text-slate-400 font-bold uppercase">No. WhatsApp Konseling</div>
                <div className="text-base font-black text-emerald-400 font-mono mt-0.5">
                  {settings.whatsappNumber || '081289123456'}
                </div>
                <div className="text-[10px] text-purple-300 mt-1">SMA Genesis Medicare</div>
              </div>
            </div>
          </div>

          {/* Module 1: Metodologi 3 Pilar Penilaian */}
          <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h3 className="text-lg font-bold text-white font-heading">
                  Landasan Metodologi 3 Pilar Analisis Potensi G-Compass
                </h3>
                <p className="text-xs text-slate-400">
                  G-Compass tidak menggunakan tes akademis hafalan konvensional, melainkan sintesis multi-algoritma:
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-blue-500/30">
                <div className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-1">
                  Pilar I: Logika Akademik Dasar
                </div>
                <h4 className="text-sm font-extrabold text-white">Penalaran Sains vs Sosial</h4>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Menguji kecepatan deduktif, penalaran kuantitatif, sebab-akibat fenomena alam, serta penalaran struktur ekonomi dan dinamika sosial.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-purple-500/30">
                <div className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-1">
                  Pilar II: Teori Howard Gardner
                </div>
                <h4 className="text-sm font-extrabold text-white">8 Kecerdasan Majemuk</h4>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Memetakan distribusi kepekaan kognitif: Logika, Spasial, Naturalis, Linguistik, Interpersonal, Intrapersonal, Kinestetik, dan Musikal.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-amber-500/30">
                <div className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
                  Pilar III: Adopsi Talent Me
                </div>
                <h4 className="text-sm font-extrabold text-white">Klaster Thinking, Doing, Relating</h4>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Mengidentifikasi gaya kerja dominan siswa: apakah seorang perancang konsep (*Thinking*), eksekutor tangkas (*Doing*), atau komunikator relasional (*Relating*).
                </p>
              </div>
            </div>
          </div>

          {/* Module 2: Rubrik & Matriks Diagnostik Penjurusan */}
          <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h3 className="text-lg font-bold text-white font-heading">
                  Rubrik & Standar Diagnostik Rekomendasi Penjurusan
                </h3>
                <p className="text-xs text-slate-400">
                  Pedoman bagi konselor dalam mengarahkan siswa ke peminatan yang paling menjamin keberhasilan masa depan:
                </p>
              </div>
            </div>

            <div className="space-y-4 pt-2">
              {/* IPA */}
              <div className="p-5 rounded-2xl bg-slate-900/90 border border-emerald-500/40 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500 text-emerald-300 font-extrabold text-xs">
                      Dominan IPA
                    </span>
                    <strong className="text-white text-sm font-heading">The Future Technologist & Scientist</strong>
                  </div>
                  <span className="text-xs text-emerald-400 font-mono font-bold">Skor Sains &gt; Sosial (Selisih &ge; 3 poin)</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-300">
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                    <strong className="text-white block mb-1">Karakter Kognitif:</strong>
                    Berpikir analitis empiris, menyukai verifikasi data, teliti pada variabel teknis, dan kuat pada penalaran sebab-akibat objektif.
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                    <strong className="text-white block mb-1">Rekomendasi Prodi Kuliah:</strong>
                    Kedokteran, Farmasi, Teknik Informatika/Software Engineering, Bioteknologi, Arsitektur, Sistem Siber, Ilmu Biomedis.
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                    <strong className="text-white block mb-1">Paket Pilihan SMA GM:</strong>
                    Matematika Tingkat Lanjut, Fisika, Kimia, Biologi, Informatika, dan Lab Riset Sains/Robotika.
                  </div>
                </div>
              </div>

              {/* IPS */}
              <div className="p-5 rounded-2xl bg-slate-900/90 border border-purple-500/40 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-purple-950/80 border border-purple-500 text-purple-300 font-extrabold text-xs">
                      Dominan IPS
                    </span>
                    <strong className="text-white text-sm font-heading">The Future Leader & Strategist</strong>
                  </div>
                  <span className="text-xs text-purple-400 font-mono font-bold">Skor Sosial &gt; Sains (Selisih &ge; 3 poin)</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-300">
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                    <strong className="text-white block mb-1">Karakter Kognitif:</strong>
                    Peka terhadap dinamika sosial, cakap membaca perilaku pasar, persuasif dalam komunikasi, diplomatis, dan strategis dalam negosiasi.
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                    <strong className="text-white block mb-1">Rekomendasi Prodi Kuliah:</strong>
                    Ilmu Hukum, Hubungan Internasional, Manajemen Bisnis & Keuangan, Akuntansi, Ilmu Komunikasi, Psikologi, Kebijakan Publik.
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                    <strong className="text-white block mb-1">Paket Pilihan SMA GM:</strong>
                    Ekonomi, Sosiologi, Geografi, Bahasa Inggris Tingkat Lanjut, Antropologi, dan Forum Debat/OSIS.
                  </div>
                </div>
              </div>

              {/* HYBRID */}
              <div className="p-5 rounded-2xl bg-slate-900/90 border border-amber-500/40 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-amber-950/80 border border-amber-500 text-amber-300 font-extrabold text-xs">
                      Multitalenta / HYBRID
                    </span>
                    <strong className="text-white text-sm font-heading">The Innovative Polymath</strong>
                  </div>
                  <span className="text-xs text-amber-400 font-mono font-bold">Skor Sains &amp; Sosial Seimbang (Selisih &le; 2 poin)</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-300">
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                    <strong className="text-white block mb-1">Karakter Kognitif:</strong>
                    Kemampuan sintesis lintas ranah (*agile multi-disciplinary*), cepat beralih dari kalkulasi teknis ke narasi konseptual bisnis.
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                    <strong className="text-white block mb-1">Rekomendasi Prodi Kuliah:</strong>
                    Product Management, Data Science for Business, Bio-Entrepreneurship, Hukum Siber, Desain Komunikasi Visual Terapan.
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                    <strong className="text-white block mb-1">Paket Pilihan SMA GM:</strong>
                    Kombinasi fleksibel: Matematika Tingkat Lanjut + Ekonomi + Informatika + Bahasa Asing.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Module 3: Panduan 8 Kecerdasan Majemuk Howard Gardner */}
          <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h3 className="text-lg font-bold text-white font-heading">
                  Interpretasi & Rekomendasi Kelas: 8 Kecerdasan Majemuk Gardner
                </h3>
                <p className="text-xs text-slate-400">
                  Gunakan tolok ukur skor: &ge; 80% (Sangat Dominan), 65–79% (Optimal), &lt; 65% (Perlu Stimulasi):
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1.5 text-xs">
                <strong className="text-white text-sm block">1. Logis-Matematis</strong>
                <p className="text-slate-300">Kemampuan memecahkan teka-teki logika, numerik, dan silogisme abstrak.</p>
                <div className="text-[11px] text-amber-300">💡 Arahan Konselor: Dorong mengikuti kompetisi Olimpiade Sains dan proyek komputasi.</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1.5 text-xs">
                <strong className="text-white text-sm block">2. Visual-Spasial</strong>
                <p className="text-slate-300">Imajinasi bentuk tiga dimensi, orientasi medan, dan kepekaan estetika visual.</p>
                <div className="text-[11px] text-amber-300">💡 Arahan Konselor: Berikan materi dengan bantuan diagram alur, mind mapping grafis, atau arsitektur 3D.</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1.5 text-xs">
                <strong className="text-white text-sm block">3. Naturalis</strong>
                <p className="text-slate-300">Kepekaan terhadap keanekaragaman hayati, ekosistem lingkungan, dan eksperimen lab alam.</p>
                <div className="text-[11px] text-amber-300">💡 Arahan Konselor: Optimal pada praktikum lab basah, bioteknologi, dan studi lingkungan hidup nyata.</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1.5 text-xs">
                <strong className="text-white text-sm block">4. Linguistik-Verbal</strong>
                <p className="text-slate-300">Kekuatan retorika, penguasaan diksi, membaca komparatif, dan penulisan persuasif.</p>
                <div className="text-[11px] text-amber-300">💡 Arahan Konselor: Salurkan ke debat bahasa Inggris, jurnalisme sekolah, atau kompetisi esai ilmiah.</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1.5 text-xs">
                <strong className="text-white text-sm block">5. Interpersonal (Sosial)</strong>
                <p className="text-slate-300">Empati tinggi, kemampuan membaca emosi orang lain, dan mencairkan gesekan tim.</p>
                <div className="text-[11px] text-amber-300">💡 Arahan Konselor: Ideal sebagai ketua delegasi, pemimpin kepanitiaan, atau juru bicara sekolah.</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1.5 text-xs">
                <strong className="text-white text-sm block">6. Intrapersonal (Refleksi)</strong>
                <p className="text-slate-300">Pemahaman mendalam terhadap motivasi diri, regulasi emosi mandiri, dan fokus visi masa depan.</p>
                <div className="text-[11px] text-amber-300">💡 Arahan Konselor: Berikan otonomi belajar tinggi. Siswa ini mandiri dan berkinerja terbaik tanpa mikromanajemen.</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1.5 text-xs">
                <strong className="text-white text-sm block">7. Kinestetik-Badani</strong>
                <p className="text-slate-300">Koordinasi motorik halus/kasar, kelincahan, ketangkasan tangan, dan ketahanan gerak fisik.</p>
                <div className="text-[11px] text-amber-300">💡 Arahan Konselor: Belajar paling cepat lewat 'learning by doing', simulasi peragaan, dan eksperimen fisik.</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1.5 text-xs">
                <strong className="text-white text-sm block">8. Musikal-Ritmik</strong>
                <p className="text-slate-300">Kepekaan terhadap pola nada, tempo ketukan, struktur harmoni, dan memori auditif tinggi.</p>
                <div className="text-[11px] text-amber-300">💡 Arahan Konselor: Belajar paling fokus dengan metode audio, podcast edukatif, atau iringan instrumental lembut.</div>
              </div>
            </div>
          </div>

          {/* Module 4: Protokol Khusus Wawancara Konselor dengan Orang Tua */}
          <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                4
              </div>
              <div>
                <h3 className="text-lg font-bold text-white font-heading">
                  Protokol Khusus Wawancara Konselor dengan Orang Tua (Resolusi Perbedaan Minat)
                </h3>
                <p className="text-xs text-slate-400">
                  Strategi komunikasi persuasif saat terdapat ketidakselarasan antara harapan orang tua dan potensi alami siswa:
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-2 text-xs text-slate-300">
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                <div className="font-bold text-amber-300 text-sm flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  <span>Skenario A: Orang tua bersikeras anak masuk IPA, padahal hasil tes dominan IPS</span>
                </div>
                <p className="leading-relaxed">
                  <strong>Pola Dialog Konselor:</strong> "Bapak/Ibu yang kami hormati, kami sangat mengapresiasi perhatian besar Bapak/Ibu terhadap masa depan Ananda. Berdasarkan data asesmen G-Compass yang menggabungkan 18 indikator logika dan 8 kecerdasan Gardner, Ananda memiliki keunggulan luar biasa pada penalaran sosial dan diplomasi. Di era Society 5.0 saat ini, lulusan rumpun Sosial seperti Corporate Lawyer, International Business Strategist, dan FinTech Analyst memiliki prospek karir bergengsi dengan penghasilan setara bahkan melampaui bidang teknis. Memaksakan jurusan IPA berisiko menurunkan motivasi dan kepercayaan diri Ananda, sedangkan di IPS Ananda diproyeksikan menjadi juara dan lulusan terbaik."
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                <div className="font-bold text-purple-300 text-sm flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-400" />
                  <span>Skenario B: Siswa bertipe Hybrid yang bingung memilih prioritas peminatan</span>
                </div>
                <p className="leading-relaxed">
                  <strong>Pola Dialog Konselor:</strong> "Profil Hybrid Ananda adalah profil istimewa yang hanya dimiliki kurang dari 15% peserta tes. Di SMA Genesis Medicare dengan Kurikulum Merdeka, Ananda tidak perlu merasa terkotak-kotakkan. Ananda dapat memilih mata pelajaran kombinasi seperti Matematika Tingkat Lanjut bersanding dengan Ekonomi dan Informatika. Ini adalah fondasi sempurna untuk prodi masa depan seperti Tech Product Management atau Business Analytics."
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                <div className="font-bold text-cyan-300 text-sm flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  <span>5 Langkah Standar Sesi Konseling 15 Menit PPDB SMA Genesis Medicare:</span>
                </div>
                <ol className="list-decimal list-inside space-y-1.5 pl-2">
                  <li><strong>Apresiasi & Sambutan Hangat (2 Menit):</strong> Ucapkan selamat atas keberhasilan menyelesaikan asesmen G-Compass.</li>
                  <li><strong>Paparan Data Objektif (4 Menit):</strong> Buka layar atau lembar cetak hasil tes, jelaskan rasio skor IPA vs IPS dan Top 3 Bakat Talent Me.</li>
                  <li><strong>Eksplorasi Impian Siswa (3 Menit):</strong> Tanyakan cita-cita dan materi yang paling dinikmati saat di SMP.</li>
                  <li><strong>Harmonisasi Pandangan Wali Murid (4 Menit):</strong> Berikan keyakinan kepada orang tua dengan bukti prospek karir dan mapel pendukung.</li>
                  <li><strong>Komitmen Rencana Belajar (2 Menit):</strong> Tentukan mata pelajaran pilihan dan ekskul unggulan yang akan diikuti di SMA GM.</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Quick Action to Database */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-900/40 via-indigo-900/40 to-slate-900 border border-purple-500/40 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <h4 className="text-base font-bold text-white font-heading">
                Siap Membimbing Siswa Berdasarkan Panduan Ini?
              </h4>
              <p className="text-xs text-slate-300">
                Pilih salah satu siswa di Tab Database Siswa untuk membuka lembar analisis khusus konselor per individu.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('database')}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-slate-950 font-extrabold text-xs shadow-xl shadow-amber-500/20 flex items-center gap-2 shrink-0 transition-all"
            >
              <Database className="w-4 h-4" />
              <span>Buka Database & Analisis Siswa</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 4: PRATINJAU & UNDUH SERTIFIKAT */}
      {activeTab === 'certificate_preview' && selectedStudentForCert && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 glass-card p-4 rounded-2xl border border-amber-500/30">
            <div>
              <div className="text-xs text-amber-400 font-bold uppercase tracking-wider">
                Pratinjau Dokumen Resmi
              </div>
              <h3 className="text-base font-extrabold text-white">
                Sertifikat Profil Bakat: {selectedStudentForCert.fullName}
              </h3>
            </div>

            {/* Tombol Unduh Sertifikat PDF */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleDownloadCertificate(selectedStudentForCert)}
                disabled={isGeneratingPdf}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-slate-950 font-black text-xs shadow-xl shadow-amber-500/30 flex items-center gap-2 transition-all"
              >
                <Download className="w-4 h-4" />
                <span>{isGeneratingPdf ? 'Memproses PDF...' : 'Unduh Sertifikat PDF'}</span>
              </button>

              <button
                onClick={() => window.print()}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs flex items-center gap-2 transition-all"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak</span>
              </button>
            </div>
          </div>

          {/* Certificate Container Rendered */}
          <CertificateTemplate
            result={selectedStudentForCert}
            settings={settings}
            certificateRef={certificatePrintRef}
          />
        </div>
      )}

      {/* Offscreen container for reliable PDF rendering when user clicks download from database table */}
      <div
        style={{
          position: 'fixed',
          left: '-9999px',
          top: '0',
          width: '1020px',
          height: '720px',
          zIndex: -100,
          pointerEvents: 'none',
          overflow: 'hidden',
        }}
      >
        {selectedStudentForCert && (
          <CertificateTemplate
            result={selectedStudentForCert}
            settings={settings}
            certificateRef={certificatePrintRef}
          />
        )}
      </div>

      {/* MODAL ANALISIS KONSELOR INDIVIDUAL (Eksklusif Admin & Tim Konselor BK) */}
      {selectedCounselorStudent && (
        <CounselorDetailModal
          student={selectedCounselorStudent}
          settings={settings}
          onClose={() => setSelectedCounselorStudent(null)}
        />
      )}
    </div>
  );
};
