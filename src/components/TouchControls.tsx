import React from 'react';
import { ArrowLeft, ArrowRight, ArrowUp, ArrowDown } from 'lucide-react';
import { KeyBindings, Lane, VerticalState } from '../types/game';

interface TouchControlsProps {
  onMoveLeft: () => void;
  onMoveRight: () => void;
  onJump: () => void;
  onCrouch: () => void;
  activeLane: Lane;
  activeVertical: VerticalState;
  disabled?: boolean;
  keyBindings?: KeyBindings;
}

const formatKey = (code: string) => {
  if (!code) return '';
  if (code.startsWith('Key')) return code.replace('Key', '');
  if (code.startsWith('Arrow')) {
    if (code === 'ArrowLeft') return 'Sol';
    if (code === 'ArrowRight') return 'Sağ';
    if (code === 'ArrowUp') return 'Yukarı';
    if (code === 'ArrowDown') return 'Aşağı';
    return code.replace('Arrow', '');
  }
  if (code === 'Space') return 'Boşluk';
  return code;
};

export const TouchControls: React.FC<TouchControlsProps> = ({
  onMoveLeft,
  onMoveRight,
  onJump,
  onCrouch,
  activeLane,
  activeVertical,
  disabled = false,
  keyBindings,
}) => {
  const leftLabel = (keyBindings?.moveLeft || ['KeyA', 'ArrowLeft']).map(formatKey).join(' / ');
  const rightLabel = (keyBindings?.moveRight || ['KeyD', 'ArrowRight']).map(formatKey).join(' / ');
  const jumpLabel = (keyBindings?.jump || ['KeyW', 'ArrowUp', 'Space']).map(formatKey).join(' / ');
  const crouchLabel = (keyBindings?.crouch || ['KeyS', 'ArrowDown']).map(formatKey).join(' / ');

  return (
    <div className="w-full max-w-xl mx-auto px-2 py-2 select-none">
      {/* 3-Lane Status Indicator: SOL • ORTA • SAĞ */}
      <div className="grid grid-cols-3 gap-2 mb-2 text-center text-xs font-pixel">
        <div
          className={`py-1.5 rounded-xl border-3 border-black transition-all ${
            activeLane === 'LEFT'
              ? 'bg-[#06b6d4] text-black font-bold fnf-box-sm shadow-md'
              : 'bg-[#181822] text-slate-500'
          }`}
        >
          SOL
        </div>
        <div
          className={`py-1.5 rounded-xl border-3 border-black transition-all ${
            activeLane === 'CENTER'
              ? 'bg-[#f9c944] text-black font-bold fnf-box-sm shadow-md'
              : 'bg-[#181822] text-slate-500'
          }`}
        >
          ORTA (MERKEZ)
        </div>
        <div
          className={`py-1.5 rounded-xl border-3 border-black transition-all ${
            activeLane === 'RIGHT'
              ? 'bg-[#06b6d4] text-black font-bold fnf-box-sm shadow-md'
              : 'bg-[#181822] text-slate-500'
          }`}
        >
          SAĞ
        </div>
      </div>

      {/* 4 Big FNF Style Arcade Buttons */}
      <div className="grid grid-cols-4 gap-2 sm:gap-3">
        {/* Sola Kaç */}
        <button
          type="button"
          disabled={disabled}
          onClick={onMoveLeft}
          className="flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-2xl border-4 border-black bg-[#06b6d4] hover:bg-[#22d3ee] text-black font-fnf transition-transform active:scale-90 cursor-pointer shadow-[3px_4px_0px_#000]"
        >
          <ArrowLeft className="w-6 h-6 stroke-[3]" />
          <span className="text-sm tracking-tight">Sola Kaç</span>
          <span className="font-pixel text-[8px] text-slate-800">{leftLabel}</span>
        </button>

        {/* Zıpla */}
        <button
          type="button"
          disabled={disabled}
          onClick={onJump}
          className={`flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-2xl border-4 border-black font-fnf transition-transform active:scale-90 cursor-pointer shadow-[3px_4px_0px_#000] ${
            activeVertical === 'JUMPING'
              ? 'bg-amber-300 text-black scale-95'
              : 'bg-[#f59e0b] hover:bg-amber-400 text-black'
          }`}
        >
          <ArrowUp className="w-6 h-6 stroke-[3]" />
          <span className="text-sm tracking-tight">Zıpla</span>
          <span className="font-pixel text-[8px] text-slate-800">{jumpLabel}</span>
        </button>

        {/* Eğil / Kay */}
        <button
          type="button"
          disabled={disabled}
          onClick={onCrouch}
          className={`flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-2xl border-4 border-black font-fnf transition-transform active:scale-90 cursor-pointer shadow-[3px_4px_0px_#000] ${
            activeVertical === 'CROUCHING'
              ? 'bg-pink-300 text-black scale-95'
              : 'bg-[#ec4899] hover:bg-pink-400 text-white'
          }`}
        >
          <ArrowDown className="w-6 h-6 stroke-[3]" />
          <span className="text-sm tracking-tight">Eğil / Kay</span>
          <span className="font-pixel text-[8px] text-pink-950">{crouchLabel}</span>
        </button>

        {/* Sağa Kaç */}
        <button
          type="button"
          disabled={disabled}
          onClick={onMoveRight}
          className="flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-2xl border-4 border-black bg-[#06b6d4] hover:bg-[#22d3ee] text-black font-fnf transition-transform active:scale-90 cursor-pointer shadow-[3px_4px_0px_#000]"
        >
          <ArrowRight className="w-6 h-6 stroke-[3]" />
          <span className="text-sm tracking-tight">Sağa Kaç</span>
          <span className="font-pixel text-[8px] text-slate-800">{rightLabel}</span>
        </button>
      </div>
    </div>
  );
};
