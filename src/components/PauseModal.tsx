import React from 'react';
import { Play, RotateCcw, Home } from 'lucide-react';

interface PauseModalProps {
  isOpen: boolean;
  onResume: () => void;
  onRestart: () => void;
  onMainMenu: () => void;
  onOpenReadMe?: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  isOpen,
  onResume,
  onRestart,
  onMainMenu,
  onOpenReadMe,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-sm bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl text-center text-slate-100">
        <h2 className="text-xl font-bold text-white mb-2">Oyun Duraklatıldı</h2>
        <p className="text-xs text-slate-400 mb-6">
          Hazır olduğunda devam et veya baştan başla.
        </p>

        <div className="flex flex-col gap-2.5">
          <button
            type="button"
            onClick={onResume}
            className="w-full py-3 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Play className="w-4 h-4" />
            <span>Devam Et</span>
          </button>

          <button
            type="button"
            onClick={onRestart}
            className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Yeniden Başlat</span>
          </button>

          <button
            type="button"
            onClick={onMainMenu}
            className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Ana Menü</span>
          </button>

          {onOpenReadMe && (
            <button
              type="button"
              onClick={onOpenReadMe}
              className="mt-2 py-2 px-3 rounded-xl bg-rose-950/70 hover:bg-rose-900/80 border border-rose-500/80 text-rose-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>📖 OKU BENİ (Öneri & Tavsiye)</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
