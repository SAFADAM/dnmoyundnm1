import React from 'react';
import { RotateCcw, Home, Skull, Bomb, Trophy } from 'lucide-react';
import { LevelConfig } from '../types/game';

interface GameOverModalProps {
  isOpen: boolean;
  score: number;
  highestCombo: number;
  level: LevelConfig | null;
  onRetry: () => void;
  onMainMenu: () => void;
  highScore: number;
  clearedBarriers: number;
  wasExplosion?: boolean;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  isOpen,
  score,
  highestCombo,
  level,
  onRetry,
  onMainMenu,
  highScore,
  clearedBarriers,
  wasExplosion = false,
}) => {
  if (!isOpen) return null;

  const isNewRecord = score > 0 && score >= highScore;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in select-none">
      <div className="w-full max-w-md bg-[#f9c944] border-8 border-black rounded-3xl p-6 shadow-[10px_10px_0px_#000] text-center text-black relative">
        {/* FNF Cartoon Skull / Bomb Icon */}
        <div className="w-16 h-16 mx-auto rounded-2xl bg-black flex items-center justify-center mb-3 border-4 border-white shadow-md animate-bounce">
          {wasExplosion ? <Bomb className="w-9 h-9 text-rose-500" /> : <Skull className="w-9 h-9 text-[#06b6d4]" />}
        </div>

        {/* FNF Game Over Title */}
        <h2 className="font-fnf text-3xl sm:text-4xl text-white fnf-text-stroke uppercase tracking-tight mb-2">
          {wasExplosion ? '💥 PATLAMA!' : 'GAME OVER!'}
        </h2>

        <p className="font-pixel text-xs text-black leading-relaxed mb-4">
          {wasExplosion
            ? 'Üst üste 3 hata yaptın! Reaktör aşırı yüklendi ve patladı!'
            : level
            ? `${level.name} aşamasında engellere çarptın!`
            : 'Sonsuz mod sona erdi!'}
        </p>

        {isNewRecord && (
          <div className="mb-4 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-black text-[#f9c944] border-2 border-white font-pixel text-xs font-bold animate-pulse">
            <Trophy className="w-4 h-4 text-yellow-400" /> YENİ REKOR!
          </div>
        )}

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

          <div className="bg-[#181822] p-2 rounded-xl border-2 border-white/20">
            <span className="font-fnf text-xs text-slate-400 block">GEÇİLEN ENGEL</span>
            <span className="font-digital text-3xl font-black text-emerald-400 tracking-wider">{clearedBarriers}</span>
          </div>

          <div className="bg-[#181822] p-2 rounded-xl border-2 border-white/20">
            <span className="font-fnf text-xs text-slate-400 block">EN YÜKSEK REKOR</span>
            <span className="font-digital text-3xl font-black text-pink-400 tracking-wider">{highScore}</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={onRetry}
            className="flex-1 py-3 px-4 rounded-2xl bg-[#06b6d4] hover:bg-[#22d3ee] text-black font-fnf text-xl border-4 border-black fnf-box-shadow flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-95"
          >
            <RotateCcw className="w-5 h-5 stroke-[3]" />
            <span>TEKRAR DENE</span>
          </button>

          <button
            type="button"
            onClick={onMainMenu}
            className="py-3 px-5 rounded-2xl bg-black hover:bg-slate-900 text-white font-fnf text-xl border-4 border-black fnf-box-shadow flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-95"
          >
            <Home className="w-5 h-5" />
            <span>MENÜ</span>
          </button>
        </div>
      </div>
    </div>
  );
};
