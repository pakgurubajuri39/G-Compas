import React, { useState } from 'react';
import { StudentRegistration, AppSettings } from '../types';
import { Compass, Sparkles, User, School, BookOpen, MapPin, Phone, ArrowRight, ShieldCheck, Zap, Brain, Target, AlertCircle } from 'lucide-react';

interface StudentFormProps {
  settings: AppSettings;
  onSubmit: (data: StudentRegistration) => void;
  initialData?: StudentRegistration | null;
}

export const StudentForm: React.FC<StudentFormProps> = ({ settings, onSubmit, initialData }) => {
  const [formData, setFormData] = useState<StudentRegistration>({
    fullName: initialData?.fullName || '',
    schoolOrigin: initialData?.schoolOrigin || '',
    grade: initialData?.grade || '9',
    address: initialData?.address || '',
    studentPhone: initialData?.studentPhone || '',
    parentPhone: initialData?.parentPhone || '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof StudentRegistration, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof StudentRegistration, boolean>>>({});

  const validate = (): boolean => {
    const errs: Partial<Record<keyof StudentRegistration, string>> = {};

    if (!formData.fullName.trim() || formData.fullName.trim().length < 3) {
      errs.fullName = 'Nama lengkap wajib diisi minimal 3 karakter.';
    }
    if (!formData.schoolOrigin.trim()) {
      errs.schoolOrigin = 'Asal sekolah (SMP/MTs) wajib diisi.';
    }
    if (!formData.grade.trim()) {
      errs.grade = 'Kelas wajib dipilih / diisi.';
    }
    if (!formData.address.trim() || formData.address.trim().length < 5) {
      errs.address = 'Alamat domisili wajib diisi dengan jelas.';
    }
    if (!formData.studentPhone.trim() || !/^(\+62|62|0)[0-9]{8,13}$/.test(formData.studentPhone.replace(/[\s-]/g, ''))) {
      errs.studentPhone = 'Nomor WhatsApp siswa tidak valid (contoh: 081234567890).';
    }
    if (!formData.parentPhone.trim() || !/^(\+62|62|0)[0-9]{8,13}$/.test(formData.parentPhone.replace(/[\s-]/g, ''))) {
      errs.parentPhone = 'Nomor WhatsApp orang tua tidak valid (contoh: 081398765432).';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (field: keyof StudentRegistration, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (touched[field]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleBlur = (field: keyof StudentRegistration) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({
      fullName: true,
      schoolOrigin: true,
      grade: true,
      address: true,
      studentPhone: true,
      parentPhone: true,
    });

    if (validate()) {
      onSubmit(formData);
    }
  };

  // If application is turned off by admin
  if (!settings.isAppActive) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
        <div className="max-w-lg w-full glass-card p-8 rounded-2xl border border-rose-500/30 text-center shadow-2xl relative overflow-hidden">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center mb-4">
            <AlertCircle className="w-8 h-8 text-rose-400" />
          </div>
          <h2 className="text-2xl font-black text-white font-heading">
            Sesi Asesmen Sedang Ditutup
          </h2>
          <p className="text-sm text-slate-300 mt-2 leading-relaxed">
            Terima kasih atas antusiasme Anda. Saat ini sesi asesmen G-Compass di <strong className="text-amber-400">{settings.schoolName || 'SMA Genesis Medicare'}</strong> sedang dinonaktifkan oleh panitia.
          </p>
          <div className="mt-6 p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-400 text-left">
            <div className="font-semibold text-slate-200 mb-1">Informasi Penerimaan Siswa Baru:</div>
            <div>Sekretariat: {settings.schoolAddress || 'Cimanggis, Depok'}</div>
            <div>Agenda: {settings.eventName || 'Open House'}</div>
          </div>
          <p className="text-xs text-slate-400 mt-6">
            Silakan hubungi pihak panitia sekolah untuk pembukaan gelombang berikutnya.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Background Cyber Accents */}
      <div className="absolute top-10 left-1/4 w-72 h-72 bg-purple-600/15 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-40 right-1/4 w-80 h-80 bg-amber-500/10 rounded-full blur-[110px] pointer-events-none" />

      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-950/60 border border-purple-500/40 text-purple-300 text-xs font-semibold uppercase tracking-wider mb-5 shadow-lg shadow-purple-500/10">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Genesis Talent & Career Compass • {settings.eventName}</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight font-heading leading-tight">
          Unlock Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-amber-400">DNA Potential</span>
        </h1>

        <p className="mt-4 text-base sm:text-lg text-slate-300 font-medium max-w-2xl mx-auto leading-relaxed">
          Temukan Jurusan Impian & Top 3 Bakat Rahasiamu dalam 15 Menit di{' '}
          <span className="text-amber-300 font-semibold">{settings.schoolName || 'SMA Genesis Medicare'}</span>!
        </p>

        {/* Feature Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-8 max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-200">
            <Brain className="w-4 h-4 text-purple-400 shrink-0" />
            <span>8 Gardner Intelligences</span>
          </div>
          <div className="flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-200">
            <Zap className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Talent Me (Thinking & Doing)</span>
          </div>
          <div className="flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-200">
            <Target className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Rekomendasi IPA/IPS/Hybrid</span>
          </div>
        </div>
      </div>

      {/* Main Registration Card */}
      <div className="max-w-2xl mx-auto">
        <div className="glass-card rounded-3xl p-6 sm:p-10 border border-purple-500/25 shadow-2xl relative">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-300">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-heading">
                Formulir Identitas Siswa
              </h2>
              <p className="text-xs text-slate-400">
                Lengkapi data diri dengan benar untuk penerbitan analisis bakat resmi
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Nama Lengkap */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Nama Lengkap Siswa <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={e => handleChange('fullName', e.target.value)}
                  onBlur={() => handleBlur('fullName')}
                  placeholder="Contoh: Muhammad Rayhan Pratama"
                  className={`w-full px-4 py-3 rounded-xl bg-slate-900/80 border ${
                    errors.fullName && touched.fullName
                      ? 'border-rose-500 focus:ring-rose-500'
                      : 'border-slate-700/80 focus:border-purple-500 focus:ring-purple-500'
                  } text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 transition-all`}
                />
              </div>
              {errors.fullName && touched.fullName && (
                <p className="text-xs text-rose-400 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.fullName}</span>
                </p>
              )}
            </div>

            {/* Asal Sekolah & Kelas Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Asal Sekolah (SMP/MTs) <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.schoolOrigin}
                    onChange={e => handleChange('schoolOrigin', e.target.value)}
                    onBlur={() => handleBlur('schoolOrigin')}
                    placeholder="Contoh: SMPN 1 Depok / MTs Al-Azhar"
                    className={`w-full px-4 py-3 rounded-xl bg-slate-900/80 border ${
                      errors.schoolOrigin && touched.schoolOrigin
                        ? 'border-rose-500 focus:ring-rose-500'
                        : 'border-slate-700/80 focus:border-purple-500 focus:ring-purple-500'
                    } text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 transition-all`}
                  />
                </div>
                {errors.schoolOrigin && touched.schoolOrigin && (
                  <p className="text-xs text-rose-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.schoolOrigin}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Kelas Saat Ini <span className="text-rose-400">*</span>
                </label>
                <select
                  value={formData.grade}
                  onChange={e => handleChange('grade', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-700/80 text-white text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500 transition-all"
                >
                  <option value="9 (Kelas IX SMP)">Kelas IX (9 SMP)</option>
                  <option value="8 (Kelas VIII SMP)">Kelas VIII (8 SMP)</option>
                  <option value="10 (Kelas X SMA/Alih Jurusan)">Kelas X (SMA)</option>
                  <option value="Alumni / Pendaftar Baru">Pendaftar Umum</option>
                </select>
              </div>
            </div>

            {/* Alamat Lengkap */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Alamat Domisili <span className="text-rose-400">*</span>
              </label>
              <textarea
                rows={2}
                value={formData.address}
                onChange={e => handleChange('address', e.target.value)}
                onBlur={() => handleBlur('address')}
                placeholder="Contoh: Jl. Gas Alam No. 15, Cimanggis, Depok"
                className={`w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border ${
                  errors.address && touched.address
                    ? 'border-rose-500 focus:ring-rose-500'
                    : 'border-slate-700/80 focus:border-purple-500 focus:ring-purple-500'
                } text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 transition-all resize-none`}
              />
              {errors.address && touched.address && (
                <p className="text-xs text-rose-400 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.address}</span>
                </p>
              )}
            </div>

            {/* Kontak HP Siswa & Orang Tua Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  No. WhatsApp Siswa <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    value={formData.studentPhone}
                    onChange={e => handleChange('studentPhone', e.target.value)}
                    onBlur={() => handleBlur('studentPhone')}
                    placeholder="Contoh: 081289123456"
                    className={`w-full px-4 py-3 rounded-xl bg-slate-900/80 border ${
                      errors.studentPhone && touched.studentPhone
                        ? 'border-rose-500 focus:ring-rose-500'
                        : 'border-slate-700/80 focus:border-purple-500 focus:ring-purple-500'
                    } text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 transition-all`}
                  />
                </div>
                {errors.studentPhone && touched.studentPhone && (
                  <p className="text-xs text-rose-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.studentPhone}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  No. WhatsApp Orang Tua <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    value={formData.parentPhone}
                    onChange={e => handleChange('parentPhone', e.target.value)}
                    onBlur={() => handleBlur('parentPhone')}
                    placeholder="Contoh: 081398765432"
                    className={`w-full px-4 py-3 rounded-xl bg-slate-900/80 border ${
                      errors.parentPhone && touched.parentPhone
                        ? 'border-rose-500 focus:ring-rose-500'
                        : 'border-slate-700/80 focus:border-purple-500 focus:ring-purple-500'
                    } text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 transition-all`}
                  />
                </div>
                {errors.parentPhone && touched.parentPhone && (
                  <p className="text-xs text-rose-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.parentPhone}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Privacy note */}
            <div className="flex items-start gap-2 pt-2 text-[11px] text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                Data Anda dilindungi oleh sistem keamanan SMA Genesis Medicare dan hanya digunakan untuk keperluan asesmen & rekomendasi bimbingan akademik.
              </span>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-amber-500 hover:from-purple-500 hover:via-indigo-500 hover:to-amber-400 text-white font-extrabold text-base tracking-wide shadow-xl shadow-purple-600/30 hover:shadow-purple-600/50 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-3 group"
              >
                <span>Mulai Petualangan Bakat / Next</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
