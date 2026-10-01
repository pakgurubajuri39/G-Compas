import React from 'react';
import { Compass, Sparkles, MapPin, Heart, Shield } from 'lucide-react';
import { AppSettings } from '../types';

interface FooterProps {
  settings: AppSettings;
  onAdminClick?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ settings, onAdminClick }) => {
  return (
    <footer className="w-full border-t border-purple-500/15 bg-[#090d18] text-slate-400 py-10 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-purple-600/10 blur-[90px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-slate-800/80 items-center">
          {/* Brand info */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="flex items-center gap-2 mb-2">
              <Compass className="w-5 h-5 text-amber-400" />
              <span className="text-lg font-bold text-white font-heading">
                G-COMPASS
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-sm">
              Genesis Talent & Career Compass. Platform asesmen pemetaan bakat & penjurusan futuristik untuk generasi juara.
            </p>
          </div>

          {/* School info */}
          <div className="flex flex-col items-center text-center">
            <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-purple-400" />
              <span>{settings.schoolName || 'SMA Genesis Medicare'}</span>
            </div>
            <p className="text-[11px] text-slate-400 max-w-xs">
              {settings.schoolAddress || 'Jl. Gas Alam No. 9, Curug, Kec. Cimanggis, Kota Depok, Jawa Barat 16453'}
            </p>
          </div>

          {/* Official badge */}
          <div className="flex flex-col items-center md:items-end text-center md:text-right">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs text-amber-300 font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{settings.eventName || 'Open House & Talent Discovery'}</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5">
              {settings.eventDate || 'Tahun Ajaran 2026/2027'}
            </p>
          </div>
        </div>

        {/* Required Mandatory Attribution & Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="text-slate-400">
            © {new Date().getFullYear()} {settings.schoolName || 'SMA Genesis Medicare'}. Hak Cipta Dilindungi.
          </div>

          {/* MANDATORY POWERED BY IDENTITY */}
          <div className="flex items-center gap-2 bg-gradient-to-r from-purple-900/30 via-indigo-900/30 to-purple-900/30 px-4 py-1.5 rounded-full border border-purple-500/30 shadow-inner">
            <span className="text-slate-300 font-medium">Platform Engine:</span>
            <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-200 tracking-wide font-heading">
              Powered by Pak GuruAI
            </span>
          </div>

          {/* Discreet Admin Link */}
          <div>
            <button
              onClick={onAdminClick}
              className="text-[11px] text-slate-400 hover:text-purple-300 transition-colors flex items-center gap-1"
            >
              <Shield className="w-3 h-3 text-slate-400" />
              <span>Admin Portal</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
