import React from 'react';
import { X, Lock, Check } from 'lucide-react';
import { CharacterSkin } from '../types/game';
import { SKINS } from '../data/levels';

interface SkinSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSkin: CharacterSkin;
  onSelectSkin: (skin: CharacterSkin) => void;
  unlockedLevelId: number;
  highestEndlessScore: number;
}

export const SkinSelectorModal: React.FC<SkinSelectorModalProps> = ({
  isOpen,
  onClose,
  selectedSkin,
  onSelectSkin,
  unlockedLevelId,
  highestEndlessScore,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in select-none">
      <div className="relative w-full max-w-xl bg-[#f9c944] border-8 border-black rounded-3xl p-5 sm:p-6 shadow-[10px_10px_0px_#000] text-black">
        <div className="flex items-center justify-between pb-3 border-b-4 border-black">
          <div>
            <span className="font-pixel text-[10px] uppercase tracking-wider text-black font-bold">
              ★ GARDROP ★
            </span>
            <h2 className="font-fnf text-3xl sm:text-4xl text-white fnf-text-stroke uppercase">
              KARAKTERLER & KOSTÜMLER
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4 max-h-[60vh] overflow-y-auto p-1">
          {SKINS.map((skin) => {
            const isUnlocked =
              skin.unlockedByDefault ||
              (skin.minLevelToUnlock && unlockedLevelId >= skin.minLevelToUnlock) ||
              (skin.minScoreToUnlock && highestEndlessScore >= skin.minScoreToUnlock);

            const isSelected = selectedSkin.id === skin.id;

            return (
              <button
                key={skin.id}
                type="button"
                disabled={!isUnlocked}
                onClick={() => {
                  if (isUnlocked) onSelectSkin(skin);
                }}
                className={`p-3.5 rounded-2xl border-4 border-black text-left flex items-center gap-3 transition-all ${
                  isSelected
                    ? 'bg-black text-white fnf-box-shadow scale-102'
                    : isUnlocked
                    ? 'bg-white hover:bg-slate-100 text-black cursor-pointer'
                    : 'bg-stone-300 text-stone-600 opacity-60 cursor-not-allowed'
                }`}
              >
                {/* Visual Avatar Preview */}
                <div
                  className="w-12 h-12 rounded-xl border-3 border-black flex items-center justify-center shrink-0 shadow-inner relative"
                  style={{ backgroundColor: skin.primaryColor }}
                >
                  {/* Visor / cap marker */}
                  <div
                    className="w-6 h-3 rounded-full border border-black"
                    style={{ backgroundColor: skin.visorColor }}
                  />
                  {isSelected && (
                    <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#f9c944] border-2 border-black flex items-center justify-center">
                      <Check className="w-3 h-3 text-black stroke-[3]" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-fnf text-lg leading-tight truncate">
                      {skin.name}
                    </h3>
                    {!isUnlocked && <Lock className="w-4 h-4 text-stone-700 shrink-0" />}
                  </div>
                  <p className="font-pixel text-[9px] text-stone-500 line-clamp-1">
                    {skin.title}
                  </p>
                  {!isUnlocked && (
                    <span className="font-pixel text-[8px] text-rose-600 block mt-1">
                      {skin.unlockRequirement}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-3 rounded-2xl bg-black text-[#f9c944] font-fnf text-2xl border-4 border-white hover:bg-slate-900 cursor-pointer fnf-box-shadow active:scale-95 transition-transform"
        >
          SEÇ VE ÇIK
        </button>
      </div>
    </div>
  );
};
