import React, { useState } from 'react';
import { Lock, KeyRound, X, ShieldAlert, ArrowRight, ShieldCheck } from 'lucide-react';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPass = password.trim();

    // Verify authorized passwords specified in requirements: 'bajuri39' OR 'smagm2027'
    if (cleanPass === 'bajuri39' || cleanPass === 'smagm2027') {
      setError(false);
      setPassword('');
      onSuccess();
    } else {
      setError(true);
      setErrorMessage('Kata sandi administrator tidak valid. Akses ditolak.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md glass-card rounded-3xl p-6 sm:p-8 border border-purple-500/40 shadow-2xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-amber-500 p-0.5 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center text-amber-400">
              <Lock className="w-6 h-6" />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white font-heading">
              Otorisasi Panel Admin
            </h3>
            <p className="text-xs text-slate-400">
              SMA Genesis Medicare • G-Compass Control
            </p>
          </div>
        </div>

        {/* Password Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Password Administrator
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={e => {
                  setPassword(e.target.value);
                  if (error) setError(false);
                }}
                autoFocus
                placeholder="Masukkan kata sandi resmi..."
                className={`w-full px-4 py-3 pl-11 rounded-xl bg-slate-900/90 border ${
                  error ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-700 focus:border-purple-500 focus:ring-purple-500'
                } text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 transition-all`}
              />
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
            </div>
            {error && (
              <p className="text-xs text-rose-400 mt-2 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </p>
            )}
          </div>

          <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/20 text-[11px] text-purple-300/80">
            Kredensial akses admin dilindungi otorisasi khusus panitia PPDB & guru bimbingan konseling.
          </div>

          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-amber-500 hover:from-purple-500 hover:to-amber-400 text-white font-bold text-xs tracking-wide shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center gap-2"
            >
              <span>Buka Akses</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
