import React from 'react';
import { Volume2, VolumeX, Pause, Play, HelpCircle, Sliders, Music, Flame, AlertTriangle } from 'lucide-react';
import { LevelConfig } from '../types/game';

interface GameHudProps {
  score: number;
  combo: number;
  health: number;
  maxHealth: number;
  consecutiveMistakes: number;
  maxMistakesBeforeExplosion: number;
  currentLevel: LevelConfig | null;
  clearedBarriers: number;
  totalBarriers: number;
  isPaused: boolean;
  isMuted: boolean;
  activeSongTitle: string;
  onTogglePause: () => void;
  onToggleMute: () => void;
  onOpenHowToPlay: () => void;
  onOpenReadMe?: () => void;
  onOpenSettings: () => void;
  highScore: number;
}

export const GameHud: React.FC<GameHudProps> = ({
  score,
  combo,
  health,
  maxHealth,
  consecutiveMistakes,
  maxMistakesBeforeExplosion,
  currentLevel,
  clearedBarriers,
  totalBarriers,
  isPaused,
  isMuted,
  activeSongTitle,
  onTogglePause,
  onToggleMute,
  onOpenHowToPlay,
  onOpenReadMe,
  onOpenSettings,
  highScore,
}) => {
  const progressPercent = totalBarriers > 0 ? Math.min(100, Math.round((clearedBarriers / totalBarriers) * 100)) : 0;
  const healthPercent = Math.max(0, Math.min(100, (health / maxHealth) * 100));

  return (
    <header className="w-full bg-black text-white px-3 sm:px-4 py-2 border-b-4 border-black select-none z-20 flex flex-col gap-1.5 shadow-md">
      {/* Top Row: Track info & Action controls */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="bg-[#f9c944] text-black font-fnf text-xs px-2.5 py-0.5 rounded-lg border-2 border-white">
            {currentLevel ? `WEEK ${currentLevel.worldId}` : 'ENDLESS'}
          </span>
          <span className="font-pixel text-[10px] sm:text-xs text-white truncate max-w-[150px] sm:max-w-xs">
            {currentLevel ? currentLevel.name : 'Sonsuz Mod'}
          </span>
          <span className="font-pixel text-[9px] text-pink-400 hidden sm:flex items-center gap-1">
            <Music className="w-3 h-3" /> {activeSongTitle}
          </span>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-2">
          {onOpenReadMe && (
            <button
              type="button"
              onClick={onOpenReadMe}
              className="px-2 py-0.5 bg-rose-600 hover:bg-rose-500 text-white font-pixel text-[9px] rounded border border-rose-300 flex items-center gap-1 cursor-pointer transition-colors shadow-sm animate-pulse"
              title="OKU BENİ (Önemli Bilgilendirme)"
            >
              <span>📖 OKU BENİ</span>
            </button>
          )}
          <button
            type="button"
            onClick={onOpenHowToPlay}
            className="p-1 text-slate-400 hover:text-white cursor-pointer"
            title="Nasıl Oynanır"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onOpenSettings}
            className="p-1 text-slate-400 hover:text-cyan-400 cursor-pointer"
            title="Ayarlar"
          >
            <Sliders className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onToggleMute}
            className="p-1 text-slate-400 hover:text-white cursor-pointer"
            title={isMuted ? 'Sesi Aç' : 'Sesi Kapat'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>
          <button
            type="button"
            onClick={onTogglePause}
            className="bg-[#2a2b38] hover:bg-slate-700 text-white p-1 rounded-lg border-2 border-white cursor-pointer"
            title={isPaused ? 'Devam Et' : 'Duraklat'}
          >
            {isPaused ? <Play className="w-4 h-4 fill-white" /> : <Pause className="w-4 h-4 fill-white" />}
          </button>
        </div>
      </div>

      {/* Center Row: FNF DUAL HEALTH BAR & ICONS */}
      <div className="flex items-center justify-between gap-3 px-1">
        {/* Boss / Enemy Icon (Left) */}
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="w-6 h-6 rounded-md bg-rose-600 border border-black flex items-center justify-center font-pixel text-[9px] font-bold text-white">
            👾
          </div>
          <span className="font-pixel text-[9px] text-rose-400 hidden sm:inline">ENGEL</span>
        </div>

        {/* FNF Health Tug-of-War Bar */}
        <div className="flex-1 max-w-lg relative h-4 bg-rose-600 rounded-full border-2 border-white overflow-hidden shadow-inner">
          {/* Player Cyan Side */}
          <div
            className="absolute right-0 top-0 bottom-0 bg-[#06b6d4] transition-all duration-200"
            style={{ width: `${healthPercent}%` }}
          />

          {/* Center Dividing Notch with BF Head icon */}
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-[#f9c944] border-2 border-black rounded-full flex items-center justify-center text-[8px] transition-all duration-200"
            style={{ left: `${100 - healthPercent}%` }}
          >
            🎤
          </div>
        </div>

        {/* Player Boyfriend Icon (Right) */}
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="font-pixel text-[9px] text-cyan-400 hidden sm:inline">BF</span>
          <div className="w-6 h-6 rounded-md bg-[#06b6d4] border border-black flex items-center justify-center font-pixel text-[9px] font-bold text-black">
            🧢
          </div>
        </div>
      </div>

      {/* Bottom Info Strip: FNF Score, Combo & Reactor Heat */}
      <div className="flex items-center justify-between font-pixel text-[10px] text-slate-300 px-1 pt-0.5">
        <div>
          <span>SKOR: </span>
          <strong className="text-cyan-400">{score}</strong>
          {combo > 1 && (
            <span className="text-[#f9c944] ml-2 animate-bounce inline-block">
              🔥 {combo}x COMBO!
            </span>
          )}
        </div>

        {/* Overheat warning */}
        <div className="flex items-center gap-1.5">
          {consecutiveMistakes >= 2 ? (
            <span className="text-rose-500 font-bold animate-pulse flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>KRİTİK ISINMA: 1 HATA DAHA PATLATIR!</span>
            </span>
          ) : consecutiveMistakes === 1 ? (
            <span className="text-amber-400 flex items-center gap-1">
              <Flame className="w-3 h-3" />
              <span>ISINMA: 1/3 HATA</span>
            </span>
          ) : (
            <span className="text-emerald-400">
              REAKTÖR: GÜVENLİ (0/3)
            </span>
          )}
        </div>

        <div className="hidden sm:block">
          <span>İLERLEME: </span>
          <strong className="text-white">%{progressPercent}</strong>
        </div>
      </div>
    </header>
  );
};
