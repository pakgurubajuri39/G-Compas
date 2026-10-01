import React from 'react';
import { TestResult, AppSettings } from '../types';
import { Award, Compass, Sparkles, ShieldCheck } from 'lucide-react';

interface CertificateProps {
  result: TestResult;
  settings: AppSettings;
  certificateRef?: React.RefObject<HTMLDivElement | null>;
}

export const CertificateTemplate: React.FC<CertificateProps> = ({ result, settings, certificateRef }) => {
  const dateFormatted = new Date(result.createdAt || Date.now()).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  // Extract clean signature name from principal's full name (stripping titles like Dra., Hj., M.Pd.)
  const getSignatureName = (fullName?: string) => {
    const raw = (fullName || 'Dra. Hj. Brimayanti').trim();
    const cleaned = raw
      .replace(/\b(Dra|Drs|Dr|Hj|H|Prof|Ir|M\.Pd|S\.Pd|M\.M|M\.Si|S\.T|S\.Kom|B\.A|M\.A|S\.Sos|S\.E|M\.Kom|S\.Psi|M\.Psi|Bpk|Ibu)\b\.?/gi, '')
      .replace(/[,.]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    return cleaned || raw;
  };

  const signatureName = getSignatureName(settings.principalName);

  const getBadgeStyle = () => {
    switch (result.recommendation) {
      case 'IPA':
        return {
          bg: 'rgba(6, 78, 59, 0.65)',
          border: '1px solid rgba(16, 185, 129, 0.8)',
          color: '#6ee7b7',
          title: 'Dominan Sains & Teknologi (IPA)',
          tag: 'THE FUTURE TECHNOLOGIST & SCIENTIST',
        };
      case 'IPS':
        return {
          bg: 'rgba(88, 28, 135, 0.65)',
          border: '1px solid rgba(168, 85, 247, 0.8)',
          color: '#d8b4fe',
          title: 'Dominan Sosial & Humaniora (IPS)',
          tag: 'THE FUTURE LEADER & STRATEGIST',
        };
      default:
        return {
          bg: 'rgba(120, 53, 15, 0.65)',
          border: '1px solid rgba(245, 158, 11, 0.8)',
          color: '#fcd34d',
          title: 'Multitalenta & Terintegrasi (HYBRID)',
          tag: 'THE INNOVATIVE POLYMATH',
        };
    }
  };

  const badge = getBadgeStyle();

  return (
    <div className="w-full overflow-x-auto flex justify-center py-4 rounded-2xl" style={{ backgroundColor: 'rgba(2, 6, 23, 0.4)' }}>
      <div
        ref={certificateRef}
        id="certificate-print-container"
        className="relative flex flex-col justify-between overflow-hidden"
        style={{
          width: '1020px',
          minWidth: '1020px',
          height: '720px',
          minHeight: '720px',
          background: 'linear-gradient(135deg, #0c1222 0%, #0f172a 50%, #151a30 100%)',
          color: '#f8fafc',
          padding: '40px',
          border: '4px solid #f59e0b',
          borderRadius: '12px',
          boxSizing: 'border-box',
          fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.75)',
        }}
      >
        {/* Decorative Luxury Certificate Guilloche Borders */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: '8px',
            left: '8px',
            right: '8px',
            bottom: '8px',
            border: '2px solid rgba(245, 158, 11, 0.4)',
            borderRadius: '8px',
          }}
        />
        <div
          className="absolute pointer-events-none"
          style={{
            top: '16px',
            left: '16px',
            right: '16px',
            bottom: '16px',
            border: '1px solid rgba(129, 140, 248, 0.25)',
            borderRadius: '6px',
          }}
        />

        {/* Corner Ornaments */}
        <div className="absolute pointer-events-none" style={{ top: '20px', left: '20px', width: '48px', height: '48px', borderTop: '2px solid #f59e0b', borderLeft: '2px solid #f59e0b' }} />
        <div className="absolute pointer-events-none" style={{ top: '20px', right: '20px', width: '48px', height: '48px', borderTop: '2px solid #f59e0b', borderRight: '2px solid #f59e0b' }} />
        <div className="absolute pointer-events-none" style={{ bottom: '20px', left: '20px', width: '48px', height: '48px', borderBottom: '2px solid #f59e0b', borderLeft: '2px solid #f59e0b' }} />
        <div className="absolute pointer-events-none" style={{ bottom: '20px', right: '20px', width: '48px', height: '48px', borderBottom: '2px solid #f59e0b', borderRight: '2px solid #f59e0b' }} />

        {/* Subtle Watermark in background */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
          style={{ opacity: 0.03 }}
        >
          <Compass style={{ width: '500px', height: '500px', color: '#ffffff' }} />
        </div>

        {/* Header Section */}
        <div
          className="relative flex items-center justify-between"
          style={{ zIndex: 10, borderBottom: '1px solid rgba(245, 158, 11, 0.35)', paddingBottom: '16px' }}
        >
          <div className="flex items-center gap-4">
            <div
              className="flex items-center justify-center shadow-lg"
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #7c3aed, #4f46e5, #f59e0b)',
                padding: '2px',
              }}
            >
              <div
                className="w-full h-full flex items-center justify-center"
                style={{ backgroundColor: '#0d1326', borderRadius: '10px' }}
              >
                <Compass style={{ width: '36px', height: '36px', color: '#f59e0b' }} />
              </div>
            </div>
            <div>
              <div
                style={{
                  fontSize: '11px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.25em',
                  color: '#f59e0b',
                  fontWeight: 600,
                }}
              >
                Sertifikat Resmi Asesmen Bakat & Penjurusan
              </div>
              <h1
                style={{
                  fontSize: '24px',
                  fontWeight: 800,
                  color: '#ffffff',
                  letterSpacing: '0.05em',
                  fontFamily: "'Outfit', sans-serif",
                  margin: '2px 0 0 0',
                }}
              >
                {settings.schoolName || 'SMA GENESIS MEDICARE'}
              </h1>
              <p style={{ fontSize: '12px', color: '#94a3b8', margin: '2px 0 0 0' }}>
                {settings.eventName || 'Open House & Talent Discovery'} • {settings.schoolAddress || 'Cimanggis, Kota Depok'}
              </p>
            </div>
          </div>

          <div className="text-right">
            <div
              className="inline-flex items-center gap-1.5"
              style={{
                padding: '4px 12px',
                borderRadius: '9999px',
                backgroundColor: 'rgba(88, 28, 135, 0.4)',
                border: '1px solid rgba(192, 132, 252, 0.4)',
                fontSize: '11px',
                fontWeight: 600,
                color: '#d8b4fe',
              }}
            >
              <ShieldCheck style={{ width: '14px', height: '14px', color: '#c084fc' }} />
              <span>G-Compass Verified</span>
            </div>
            <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px', fontFamily: 'monospace' }}>
              NO: G-CP/{new Date(result.createdAt || Date.now()).getFullYear()}/{result.id.substring(0, 10).toUpperCase()}
            </div>
          </div>
        </div>

        {/* Certificate Recipient Body */}
        <div className="relative text-center my-auto" style={{ zIndex: 10, padding: '8px 0' }}>
          <p
            style={{
              fontSize: '12px',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#cbd5e1',
              fontWeight: 600,
              margin: 0,
            }}
          >
            Dengan bangga diberikan kepada peserta:
          </p>

          <h2
            style={{
              fontSize: '34px',
              fontWeight: 900,
              color: '#fde047',
              letterSpacing: '0.05em',
              margin: '8px 0',
              fontFamily: "'Outfit', sans-serif",
              textShadow: '0 2px 10px rgba(245, 158, 11, 0.3)',
            }}
          >
            {result.fullName.toUpperCase()}
          </h2>

          <div
            className="flex items-center justify-center gap-6"
            style={{ fontSize: '13px', color: '#cbd5e1', fontWeight: 500 }}
          >
            <span>Asal Sekolah: <strong style={{ color: '#ffffff' }}>{result.schoolOrigin}</strong></span>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'rgba(245, 158, 11, 0.6)' }} />
            <span>Kelas: <strong style={{ color: '#ffffff' }}>{result.grade}</strong></span>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'rgba(245, 158, 11, 0.6)' }} />
            <span>Waktu Asesmen: <strong style={{ color: '#ffffff' }}>{dateFormatted}</strong></span>
          </div>

          <p
            className="max-w-2xl mx-auto"
            style={{ fontSize: '12px', color: '#cbd5e1', marginTop: '12px', lineHeight: 1.6 }}
          >
            Telah menyelesaikan seluruh rangkaian asesmen diagnostik potensi diri berbasis Logika Akademik,
            Teori 8 Kecerdasan Majemuk Howard Gardner, serta Klaster Pemetaan Bakat Talent Me dengan hasil:
          </p>

          {/* Main Recommendation Banner */}
          <div className="flex flex-col items-center justify-center" style={{ marginTop: '14px' }}>
            <div
              className="flex items-center gap-3 shadow-xl"
              style={{
                padding: '10px 24px',
                borderRadius: '12px',
                backgroundColor: badge.bg,
                border: badge.border,
                color: badge.color,
              }}
            >
              <Award style={{ width: '24px', height: '24px', color: '#f59e0b' }} />
              <div className="text-left">
                <div style={{ fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 800, color: '#f59e0b' }}>
                  REKOMENDASI PENJURUSAN UTAMA:
                </div>
                <div style={{ fontSize: '18px', fontWeight: 900, fontFamily: "'Outfit', sans-serif" }}>
                  {badge.title}
                </div>
              </div>
            </div>
            <div style={{ fontSize: '11px', fontFamily: 'monospace', letterSpacing: '0.15em', color: '#94a3b8', marginTop: '4px', textTransform: 'uppercase' }}>
              {badge.tag}
            </div>
          </div>
        </div>

        {/* Results Metrics Grid (Kecerdasan Majemuk & Top 3 Bakat) */}
        <div
          className="relative grid grid-cols-12 gap-4"
          style={{
            zIndex: 10,
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            padding: '14px 16px',
            borderRadius: '12px',
            border: '1px solid rgba(71, 85, 105, 0.5)',
            fontSize: '12px',
          }}
        >
          {/* Top 3 Talents */}
          <div className="col-span-5" style={{ borderRight: '1px solid rgba(71, 85, 105, 0.5)', paddingRight: '16px' }}>
            <div
              className="flex items-center gap-1.5"
              style={{ fontSize: '11px', fontWeight: 700, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}
            >
              <Sparkles style={{ width: '14px', height: '14px' }} />
              <span>Top 3 Bakat Dominan (Talent Me)</span>
            </div>
            <div className="space-y-1.5">
              {result.topTalents.map((talent, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2"
                  style={{
                    backgroundColor: 'rgba(30, 41, 59, 0.85)',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    border: '1px solid rgba(71, 85, 105, 0.5)',
                  }}
                >
                  <span
                    style={{
                      width: '16px',
                      height: '16px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(245, 158, 11, 0.25)',
                      color: '#fcd34d',
                      fontSize: '10px',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {idx + 1}
                  </span>
                  <span style={{ fontWeight: 600, color: '#e2e8f0', fontSize: '11px' }}>{talent}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Gardner Intelligences Mini Grid */}
          <div className="col-span-7" style={{ paddingLeft: '8px' }}>
            <div
              style={{ fontSize: '11px', fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}
            >
              Distribusi 8 Kecerdasan Majemuk (Gardner Scale)
            </div>
            <div className="grid grid-cols-4 gap-2" style={{ fontSize: '10px' }}>
              <div style={{ backgroundColor: 'rgba(30, 41, 59, 0.6)', padding: '6px', borderRadius: '6px', textAlign: 'center', border: '1px solid rgba(71, 85, 105, 0.4)' }}>
                <span style={{ color: '#94a3b8', display: 'block' }}>Logika</span>
                <span style={{ fontWeight: 800, color: '#ffffff', fontSize: '12px' }}>{result.gardnerScores.logical}%</span>
              </div>
              <div style={{ backgroundColor: 'rgba(30, 41, 59, 0.6)', padding: '6px', borderRadius: '6px', textAlign: 'center', border: '1px solid rgba(71, 85, 105, 0.4)' }}>
                <span style={{ color: '#94a3b8', display: 'block' }}>Spasial</span>
                <span style={{ fontWeight: 800, color: '#ffffff', fontSize: '12px' }}>{result.gardnerScores.spatial}%</span>
              </div>
              <div style={{ backgroundColor: 'rgba(30, 41, 59, 0.6)', padding: '6px', borderRadius: '6px', textAlign: 'center', border: '1px solid rgba(71, 85, 105, 0.4)' }}>
                <span style={{ color: '#94a3b8', display: 'block' }}>Naturalis</span>
                <span style={{ fontWeight: 800, color: '#ffffff', fontSize: '12px' }}>{result.gardnerScores.naturalist}%</span>
              </div>
              <div style={{ backgroundColor: 'rgba(30, 41, 59, 0.6)', padding: '6px', borderRadius: '6px', textAlign: 'center', border: '1px solid rgba(71, 85, 105, 0.4)' }}>
                <span style={{ color: '#94a3b8', display: 'block' }}>Bahasa</span>
                <span style={{ fontWeight: 800, color: '#ffffff', fontSize: '12px' }}>{result.gardnerScores.linguistic}%</span>
              </div>
              <div style={{ backgroundColor: 'rgba(30, 41, 59, 0.6)', padding: '6px', borderRadius: '6px', textAlign: 'center', border: '1px solid rgba(71, 85, 105, 0.4)' }}>
                <span style={{ color: '#94a3b8', display: 'block' }}>Sosial</span>
                <span style={{ fontWeight: 800, color: '#ffffff', fontSize: '12px' }}>{result.gardnerScores.interpersonal}%</span>
              </div>
              <div style={{ backgroundColor: 'rgba(30, 41, 59, 0.6)', padding: '6px', borderRadius: '6px', textAlign: 'center', border: '1px solid rgba(71, 85, 105, 0.4)' }}>
                <span style={{ color: '#94a3b8', display: 'block' }}>Refleksi</span>
                <span style={{ fontWeight: 800, color: '#ffffff', fontSize: '12px' }}>{result.gardnerScores.intrapersonal}%</span>
              </div>
              <div style={{ backgroundColor: 'rgba(30, 41, 59, 0.6)', padding: '6px', borderRadius: '6px', textAlign: 'center', border: '1px solid rgba(71, 85, 105, 0.4)' }}>
                <span style={{ color: '#94a3b8', display: 'block' }}>Kinestetik</span>
                <span style={{ fontWeight: 800, color: '#ffffff', fontSize: '12px' }}>{result.gardnerScores.kinesthetic}%</span>
              </div>
              <div style={{ backgroundColor: 'rgba(30, 41, 59, 0.6)', padding: '6px', borderRadius: '6px', textAlign: 'center', border: '1px solid rgba(71, 85, 105, 0.4)' }}>
                <span style={{ color: '#94a3b8', display: 'block' }}>Musikal</span>
                <span style={{ fontWeight: 800, color: '#ffffff', fontSize: '12px' }}>{result.gardnerScores.musical}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer & Signature Section */}
        <div
          className="relative flex items-end justify-between"
          style={{ zIndex: 10, borderTop: '1px solid rgba(71, 85, 105, 0.5)', paddingTop: '16px', fontSize: '12px' }}
        >
          <div className="flex items-center gap-3">
            <div
              style={{
                width: '56px',
                height: '56px',
                backgroundColor: '#ffffff',
                padding: '4px',
                borderRadius: '8px',
                border: '1px solid rgba(245, 158, 11, 0.4)',
              }}
            >
              {/* Simulated QR Code */}
              <div className="w-full h-full p-1 grid grid-cols-4 gap-0.5 rounded" style={{ backgroundColor: '#0f172a' }}>
                {Array.from({ length: 16 }).map((_, i) => (
                  <div
                    key={i}
                    style={{
                      borderRadius: '1px',
                      backgroundColor: i % 2 === 0 || i % 3 === 0 ? '#f59e0b' : 'transparent',
                    }}
                  />
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontFamily: 'monospace', fontSize: '10px', color: '#94a3b8' }}>Verifikasi Resmi Dokumen</div>
              <div style={{ fontFamily: 'monospace', fontSize: '10px', color: '#fcd34d', fontWeight: 600 }}>https://genesis-medicare.sch.id</div>
              <div style={{ fontSize: '9px', color: '#64748b', marginTop: '2px' }}>Powered by Pak GuruAI</div>
            </div>
          </div>

          <div className="text-center" style={{ width: '240px' }}>
            <div style={{ color: '#94a3b8', fontSize: '11px' }}>Kota Depok, {dateFormatted}</div>
            <div style={{ color: '#cbd5e1', fontSize: '11px', fontWeight: 600, marginTop: '2px' }}>SMA Genesis Medicare</div>

            {/* Stamp & Signature simulation */}
            <div className="relative flex items-center justify-center" style={{ height: '52px', margin: '4px 0' }}>
              <div
                className="absolute flex items-center justify-center pointer-events-none"
                style={{
                  width: '80px',
                  height: '38px',
                  border: '2px solid rgba(168, 85, 247, 0.4)',
                  borderRadius: '9999px',
                  transform: 'rotate(-12deg)',
                }}
              >
                <span style={{ fontSize: '8px', fontWeight: 900, textTransform: 'uppercase', color: '#c084fc', letterSpacing: '-0.05em', opacity: 0.8 }}>
                  GENESIS MEDICARE
                </span>
              </div>
              <div
                className="select-none"
                style={{
                  fontFamily: "'Great Vibes', 'Dancing Script', 'Caveat', cursive, serif",
                  fontStyle: 'italic',
                  fontSize: '26px',
                  color: '#fef08a',
                  opacity: 0.95,
                  transform: 'rotate(-4deg)',
                  letterSpacing: '1px',
                }}
              >
                {signatureName}
              </div>
            </div>

            <div style={{ fontWeight: 700, color: '#ffffff', fontSize: '12px', borderTop: '1px solid rgba(100, 116, 139, 0.8)', paddingTop: '4px' }}>
              {settings.principalName || 'Dra. Hj. Brimayanti'}
            </div>
            <div style={{ fontSize: '10px', color: '#94a3b8' }}>Kepala SMA Genesis Medicare</div>
          </div>
        </div>
      </div>
    </div>
  );
};
