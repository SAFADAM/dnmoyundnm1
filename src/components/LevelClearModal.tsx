import React from 'react';
import { Star, RotateCcw, ArrowRight, Home } from 'lucide-react';
import { LevelConfig } from '../types/game';

interface LevelClearModalProps {
  isOpen: boolean;
  score: number;
  highestCombo: number;
  healthRemaining: number;
  maxHealth: number;
  level: LevelConfig | null;
  onNextLevel: () => void;
  onReplay: () => void;
  onMainMenu: () => void;
  hasNextLevel: boolean;
}

export const LevelClearModal: React.FC<LevelClearModalProps> = ({
  isOpen,
  score,
  highestCombo,
  healthRemaining,
  level,
  onNextLevel,
  onReplay,
  onMainMenu,
  hasNextLevel,
}) => {
  if (!isOpen) return null;

  const starsEarned = Math.max(1, Math.min(3, healthRemaining));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in select-none">
      <div className="w-full max-w-md bg-[#f9c944] border-8 border-black rounded-3xl p-6 shadow-[10px_10px_0px_#000] text-center text-black">
        <span className="font-pixel text-xs font-bold text-black uppercase tracking-wider block mb-1">
          ★ LEVEL CLEARED! ★
        </span>
        <h2 className="font-fnf text-3xl sm:text-4xl text-white fnf-text-stroke uppercase tracking-tight mb-2">
          {level ? `${level.name}` : 'AŞAMA TAMAM!'}
        </h2>
        <p className="font-pixel text-[11px] text-black mb-4">
          Harika ritim ve refleks! Tüm bariyerleri geçtin!
        </p>

        {/* Stars */}
        <div className="flex items-center justify-center gap-2 mb-4 bg-black py-2.5 rounded-2xl border-4 border-black">
          {[1, 2, 3].map((starNum) => (
            <Star
              key={starNum}
              className={`w-9 h-9 transition-transform duration-300 ${
                starNum <= starsEarned
                  ? 'fill-[#f9c944] text-[#f9c944] scale-110 drop-shadow-[0_0_8px_rgba(249,201,68,0.8)]'
                  : 'fill-slate-800 text-slate-700'
              }`}
            />
          ))}
        </div>

        {/* Stats card */}
        <div className="bg-black text-white p-4 rounded-2xl border-4 border-black mb-5 grid grid-cols-2 gap-3 text-center">
          <div className="bg-[#181822] p-2 rounded-xl border-2 border-white/20">
            <span className="font-fnf text-xs text-slate-400 block">SKOR</span>
            <span className="font-digital text-3xl font-black text-cyan-300 tracking-wider">{score}</span>
          </div>

          <div className="bg-[#181822] p-2 rounded-xl border-2 border-white/20">
            <span className="font-fnf text-xs text-slate-400 block">EN İYİ COMBO</span>
            <span className="font-digital text-3xl font-black text-amber-400 tracking-wider">{highestCombo}x</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          {hasNextLevel ? (
            <button
              type="button"
              onClick={onNextLevel}
              className="flex-1 py-3 px-4 rounded-2xl bg-[#06b6d4] hover:bg-[#22d3ee] text-black font-fnf text-xl border-4 border-black fnf-box-shadow flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-95"
            >
              <span>SONRAKİ BÖLÜM</span>
              <ArrowRight className="w-5 h-5 stroke-[3]" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onMainMenu}
              className="flex-1 py-3 px-4 rounded-2xl bg-[#06b6d4] hover:bg-[#22d3ee] text-black font-fnf text-xl border-4 border-black fnf-box-shadow flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-95"
            >
              <Home className="w-5 h-5" />
              <span>ANA MENÜ</span>
            </button>
          )}

          <button
            type="button"
            onClick={onReplay}
            className="py-3 px-4 rounded-2xl bg-white hover:bg-slate-100 text-black font-fnf text-xl border-4 border-black fnf-box-shadow flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-95"
          >
            <RotateCcw className="w-5 h-5 stroke-[3]" />
            <span>TEKRAR</span>
          </button>
        </div>
      </div>
    </div>
  );
};
