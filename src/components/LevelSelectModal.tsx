import React, { useState } from 'react';
import { X, Lock, Star, Play, Music, ShieldAlert } from 'lucide-react';
import { LevelConfig } from '../types/game';
import { LEVELS, WORLDS } from '../data/levels';

interface LevelSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLevel: (level: LevelConfig | null) => void;
  unlockedLevelId: number;
  levelStars: Record<number, number>;
  levelHighScores: Record<number, number>;
}

export const LevelSelectModal: React.FC<LevelSelectModalProps> = ({
  isOpen,
  onClose,
  onSelectLevel,
  unlockedLevelId,
  levelStars,
  levelHighScores,
}) => {
  const [selectedWorldId, setSelectedWorldId] = useState<number>(() => {
    const highestLevel = LEVELS.find((l) => l.id === unlockedLevelId);
    return highestLevel ? highestLevel.worldId : 1;
  });

  if (!isOpen) return null;

  const currentWorld = WORLDS.find((w) => w.id === selectedWorldId) || WORLDS[0];
  const levelsInCurrentWorld = LEVELS.filter((l) => l.worldId === selectedWorldId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in select-none">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-[#f9c944] border-8 border-black rounded-3xl p-4 sm:p-6 shadow-[10px_10px_0px_#000] text-black">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b-4 border-black">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-pixel text-[10px] uppercase tracking-wider text-white bg-black px-3 py-1 rounded-xl border-2 border-white">
                ★ 120 BÖLÜM & 10 DÜNYA ★
              </span>
              <span className="font-pixel text-xs text-black font-bold">
                AÇIK: {Math.min(120, unlockedLevelId)} / 120
              </span>
            </div>
            <h2 className="font-fnf text-3xl sm:text-4xl text-white fnf-text-stroke tracking-tight">
              BÖLÜM & MEKAN SEÇİMİ
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-black text-[#f9c944] border-3 border-white flex items-center justify-center hover:bg-slate-900 cursor-pointer"
          >
            <X className="w-6 h-6 stroke-[3]" />
          </button>
        </div>

        {/* 10 World Selector Tabs (horizontal scrollable) */}
        <div className="flex gap-2 py-3 overflow-x-auto no-scrollbar">
          {WORLDS.map((w) => {
            const worldMinLevel = (w.id - 1) * 12 + 1;
            const isUnlocked = unlockedLevelId >= worldMinLevel;
            const isSelected = w.id === selectedWorldId;

            return (
              <button
                key={w.id}
                type="button"
                onClick={() => setSelectedWorldId(w.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl border-3 border-black shrink-0 transition-all font-fnf text-sm cursor-pointer ${
                  isSelected
                    ? 'bg-black text-[#f9c944] scale-105 shadow-md -rotate-1'
                    : isUnlocked
                    ? 'bg-white hover:bg-slate-100 text-black'
                    : 'bg-stone-300 text-stone-500 opacity-70'
                }`}
              >
                {!isUnlocked && <Lock className="w-3.5 h-3.5" />}
                <span>WEEK {w.id}: {w.name}</span>
              </button>
            );
          })}
        </div>

        {/* World Header Info */}
        <div className="bg-black text-white p-3 rounded-2xl border-4 border-black mb-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <span className="font-pixel text-[10px] text-cyan-400">
              MEKAN: {currentWorld.name.toUpperCase()} (WEEK {currentWorld.id})
            </span>
            <p className="text-xs text-slate-300 font-sans mt-0.5">{currentWorld.description}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0 font-pixel text-[10px] text-pink-400">
            <Music className="w-4 h-4" />
            <span>Şarkı: {currentWorld.songId.replace('_', ' ')}</span>
          </div>
        </div>

        {/* Grid of 12 Levels for this World */}
        <div className="flex-1 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 p-1">
          {levelsInCurrentWorld.map((level) => {
            const isUnlocked = unlockedLevelId >= level.id;
            const stars = levelStars[level.id] || 0;
            const highScore = levelHighScores[level.id] || 0;

            return (
              <button
                key={level.id}
                type="button"
                disabled={!isUnlocked}
                onClick={() => {
                  onSelectLevel(level);
                  onClose();
                }}
                className={`relative flex flex-col justify-between p-3 rounded-2xl border-4 border-black text-left transition-all ${
                  isUnlocked
                    ? 'bg-white hover:bg-cyan-100 cursor-pointer hover:scale-102 fnf-box-shadow-sm active:scale-95'
                    : 'bg-stone-300 border-stone-600 opacity-60 cursor-not-allowed'
                }`}
              >
                <div className="flex items-start justify-between">
                  <span className="font-pixel text-[10px] font-bold text-black">
                    #{level.id}
                  </span>
                  {level.bossStage && (
                    <span className="bg-rose-500 text-white font-pixel text-[8px] px-1.5 py-0.5 rounded-lg border border-black animate-pulse">
                      BOSS!
                    </span>
                  )}
                  {!isUnlocked && <Lock className="w-4 h-4 text-stone-700" />}
                </div>

                <div className="my-2">
                  <h4 className="font-fnf text-base text-black leading-tight truncate">
                    {level.name}
                  </h4>
                  <span className="font-pixel text-[9px] text-stone-600">
                    {level.barrierCount} Bariyer • {level.songBpm} BPM
                  </span>
                </div>

                <div className="flex items-center justify-between pt-1 border-t-2 border-black/20">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${
                          s <= stars ? 'fill-[#f9c944] text-[#f9c944]' : 'fill-stone-300 text-stone-400'
                        }`}
                      />
                    ))}
                  </div>
                  {highScore > 0 && (
                    <span className="font-digital text-sm font-bold text-cyan-600">
                      {highScore}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
