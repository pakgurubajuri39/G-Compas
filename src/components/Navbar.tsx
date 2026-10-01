import React from 'react';
import { Compass, ShieldCheck, Lock, Sparkles } from 'lucide-react';
import { AppSettings } from '../types';

interface NavbarProps {
  settings: AppSettings;
  onOpenAdmin: () => void;
  isAdminLoggedIn: boolean;
  onLogoutAdmin?: () => void;
  currentStep: 'landing' | 'orientation' | 'quiz' | 'result' | 'admin';
  onNavigateHome: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  settings,
  onOpenAdmin,
  isAdminLoggedIn,
  onLogoutAdmin,
  currentStep,
  onNavigateHome,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-purple-500/20 bg-[#0c101d]/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand / Logo */}
        <div
          onClick={onNavigateHome}
          className="flex items-center gap-3 cursor-pointer group transition-transform active:scale-95"
        >
          <div className="relative">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-amber-500 p-0.5 shadow-lg shadow-purple-500/25 group-hover:shadow-purple-500/40 transition-all">
              <div className="w-full h-full bg-[#0d1326] rounded-[10px] flex items-center justify-center">
                <Compass className="w-6 h-6 text-amber-400 group-hover:rotate-45 transition-transform duration-500" />
              </div>
            </div>
            <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-slate-900"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-tight text-white font-heading">
                G-COMPASS
              </span>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30">
                v2.5 AI
              </span>
            </div>
            <div className="text-[11px] font-medium text-slate-400 -mt-0.5">
              {settings.schoolName || 'SMA Genesis Medicare'}
            </div>
          </div>
        </div>

        {/* Center Event Badge */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-medium text-slate-300">{settings.eventName || 'Open House 2026/2027'}</span>
          <span className="w-1 h-1 rounded-full bg-slate-600" />
          <span className={`font-semibold ${settings.isAppActive ? 'text-emerald-400' : 'text-rose-400'}`}>
            {settings.isAppActive ? 'Sesi Terbuka' : 'Sesi Ditutup'}
          </span>
        </div>

        {/* Admin Secret Portal Trigger */}
        <div className="flex items-center gap-3">
          {isAdminLoggedIn ? (
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenAdmin}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  currentStep === 'admin'
                    ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                    : 'bg-purple-900/50 hover:bg-purple-800/60 text-purple-200 border border-purple-500/40'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Panel Admin</span>
              </button>
              {onLogoutAdmin && (
                <button
                  onClick={onLogoutAdmin}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-rose-300 hover:bg-rose-950/40 transition-colors"
                  title="Keluar Admin"
                >
                  Logout
                </button>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAdmin}
              className="p-2 rounded-lg bg-slate-900/50 hover:bg-purple-950/40 text-slate-400 hover:text-purple-300 border border-slate-800 hover:border-purple-500/30 transition-all text-xs flex items-center gap-1.5 group"
              title="Akses Administrator"
            >
              <Lock className="w-3.5 h-3.5 group-hover:text-amber-400 transition-colors" />
              <span className="hidden sm:inline text-[11px] font-medium">Admin</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
