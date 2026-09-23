import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, ChevronLeft, ChevronRight, Play, ArrowLeft } from 'lucide-react';
import { CharacterSkin, LevelConfig } from '../types/game';
import { WORLDS } from '../data/levels';

interface TitleMenuProps {
  onStartCampaign: () => void;
  onOpenLevelSelect: () => void;
  onStartEndless: () => void;
  onOpenSkins: () => void;
  onOpenHowToPlay: () => void;
  onOpenReadMe: () => void;
  onOpenSettings: () => void;
  onToggleMute: () => void;
  isMuted: boolean;
  unlockedLevelId: number;
  selectedSkin: CharacterSkin;
  totalScore: number;
  highestEndlessScore: number;
  currentLevel: LevelConfig;
  activeSongTitle: string;
}

type MenuScreen = 'MAIN' | 'STORY_SELECT';
type MenuItem = 'STORY' | 'FREEPLAY' | 'ENDLESS' | 'SKINS' | 'OPTIONS' | 'HOWTOPLAY';
type Difficulty = 'EASY' | 'NORMAL' | 'HARD' | 'ERECT';

export const TitleMenu: React.FC<TitleMenuProps> = ({
  onStartCampaign,
  onOpenLevelSelect,
  onStartEndless,
  onOpenSkins,
  onOpenHowToPlay,
  onOpenReadMe,
  onOpenSettings,
  onToggleMute,
  isMuted,
  unlockedLevelId,
  selectedSkin,
  highestEndlessScore,
  currentLevel,
  activeSongTitle,
}) => {
  const [screen, setScreen] = useState<MenuScreen>('MAIN');
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem>('STORY');
  const [selectedWorldIdx, setSelectedWorldIdx] = useState<number>(0);
  const [difficulty, setDifficulty] = useState<Difficulty>('NORMAL');

  const activeWorld = WORLDS[selectedWorldIdx] || WORLDS[0];
  const worldMinLevel = (activeWorld.id - 1) * 12 + 1;
  const isWorldUnlocked = unlockedLevelId >= worldMinLevel;

  const cycleDifficulty = (dir: number) => {
    const diffs: Difficulty[] = ['EASY', 'NORMAL', 'HARD', 'ERECT'];
    const idx = diffs.indexOf(difficulty);
    const nextIdx = (idx + dir + diffs.length) % diffs.length;
    setDifficulty(diffs[nextIdx]);
  };

  const cycleWorld = (dir: number) => {
    const nextIdx = (selectedWorldIdx + dir + WORLDS.length) % WORLDS.length;
    setSelectedWorldIdx(nextIdx);
  };

  return (
    <div className="relative w-full max-w-5xl h-[88vh] min-h-[580px] max-h-[760px] mx-auto rounded-3xl overflow-hidden border-8 border-black shadow-[12px_12px_0px_#000] bg-[#f9c944] flex flex-col justify-between select-none">
      {/* Dynamic FNF Comic Background with sketches */}
      <div className="absolute inset-0 pointer-events-none opacity-20 overflow-hidden">
        {/* Comic crosshatch & speaker lines */}
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="fnf-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 40 M 0 0 L 40 40" fill="none" stroke="#000" strokeWidth="1.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#fnf-grid)" />
        </svg>
      </div>

      {/* TOP BAR: FNF RETRO PIXEL BAR */}
      <div className="relative z-10 w-full bg-black text-white px-4 py-2.5 flex items-center justify-between font-pixel text-xs sm:text-sm tracking-wider border-b-4 border-black">
        <div className="flex items-center gap-3">
          <span className="text-[#f9c944]">CLEARED</span>
          <span className="text-cyan-400">{Math.min(100, Math.round((unlockedLevelId / 120) * 100))}%</span>
          <span className="text-slate-500 hidden sm:inline">|</span>
          <span className="text-slate-400 text-[10px] hidden sm:inline">120 BÖLÜM & 10 DÜNYA</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenReadMe}
            className="bg-rose-600 hover:bg-rose-500 text-white font-pixel text-[10px] sm:text-xs px-2.5 py-1 rounded-lg border-2 border-white flex items-center gap-1.5 cursor-pointer shadow-sm transition-transform hover:scale-105 active:scale-95 animate-pulse"
            title="Oku Beni: Önemli Bilgilendirme"
          >
            <span>📖 OKU BENİ</span>
          </button>
          <div className="text-right text-[11px] sm:text-xs truncate max-w-[200px] sm:max-w-xs text-pink-400">
            {activeSongTitle.toUpperCase()}
          </div>
          <button
            type="button"
            onClick={onToggleMute}
            className="p-1 hover:text-cyan-400 cursor-pointer"
            title={isMuted ? 'Sesi Aç' : 'Sesi Kapat'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SCREEN 1: FNF MAIN MENU (Image 3: STORY MODE / FREE PLAY / OPTIONS) */}
      {/* ========================================================================= */}
      {screen === 'MAIN' && (
        <div className="relative z-10 flex-1 flex flex-col justify-center items-center px-4 py-6">
          {/* Animated Background Boyfriend Cartoon Silhouette */}
          <div className="absolute right-4 sm:right-16 bottom-6 opacity-30 pointer-events-none transform scale-90 sm:scale-110">
            <svg width="220" height="260" viewBox="0 0 200 240" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Backward Cap */}
              <path d="M 60 40 C 90 20, 140 20, 160 50 C 180 80, 170 100, 140 100 L 50 90 Z" fill="#000" />
              <path d="M 140 60 L 195 70 C 190 85, 170 95, 140 90 Z" fill="#000" />
              {/* Head / Hair */}
              <circle cx="95" cy="80" r="45" fill="#000" />
              {/* Spiky cyan hair peaks */}
              <path d="M 40 70 L 10 50 L 35 90 L 15 110 L 50 110 Z" fill="#000" />
              {/* Body & Shirt with forbidden symbol */}
              <path d="M 60 120 L 130 120 L 150 180 L 40 180 Z" fill="#000" />
              {/* Microphone Hand */}
              <circle cx="35" cy="135" r="22" fill="#000" />
              <rect x="30" y="145" width="10" height="25" rx="3" fill="#000" />
              {/* Chunky Sneakers */}
              <ellipse cx="60" cy="210" rx="35" ry="18" fill="#000" />
              <ellipse cx="140" cy="215" rx="38" ry="18" fill="#000" />
            </svg>
          </div>

          {/* FNF Logo Badge */}
          <div className="mb-2 animate-fnf-beat">
            <span className="inline-block bg-black text-[#f9c944] font-fnf text-lg sm:text-2xl px-5 py-1.5 rounded-2xl transform -rotate-2 fnf-box-shadow tracking-wide border-2 border-white">
              ★ REFLEKS FUNKİN 3D ★
            </span>
          </div>

          {/* OKU BENİ Notification Banner */}
          <button
            type="button"
            onClick={onOpenReadMe}
            className="mb-2.5 group bg-rose-600/95 hover:bg-rose-500 text-white font-pixel text-[10px] sm:text-xs px-3.5 py-1.5 rounded-xl border-2 border-white shadow-[3px_3px_0px_#000] flex items-center gap-2 cursor-pointer transition-all hover:scale-102 active:scale-98 max-w-lg text-left"
            title="Önemli Bilgilendirme: Oku Beni"
          >
            <span className="bg-yellow-400 text-black px-1.5 py-0.5 rounded text-[9px] font-bold shrink-0">
              OKU BENİ
            </span>
            <span className="font-sans font-bold text-rose-100 group-hover:text-white truncate">
              bu oyun tavsiye için yapılmıştır öneri oyundur lütfen PAYLAŞMAYINIZ
            </span>
          </button>

          {/* Giant FNF Bubble Menu Options (Matches Image 3) */}
          <div className="flex flex-col items-center gap-1 sm:gap-2 w-full max-w-md">
            {/* 1. STORY MODE */}
            <button
              type="button"
              onMouseEnter={() => setSelectedMenuItem('STORY')}
              onClick={() => setScreen('STORY_SELECT')}
              className={`group transition-all duration-150 cursor-pointer text-center select-none ${
                selectedMenuItem === 'STORY'
                  ? 'scale-110 sm:scale-115 -rotate-2'
                  : 'hover:scale-105 opacity-85 hover:opacity-100'
              }`}
            >
              <h2
                className={`font-fnf text-4xl sm:text-6xl uppercase tracking-tight ${
                  selectedMenuItem === 'STORY'
                    ? 'text-white fnf-text-stroke fnf-text-shadow'
                    : 'text-white fnf-text-stroke-md'
                }`}
              >
                STORY MODE
              </h2>
            </button>

            {/* 2. FREE PLAY */}
            <button
              type="button"
              onMouseEnter={() => setSelectedMenuItem('FREEPLAY')}
              onClick={onOpenLevelSelect}
              className={`group transition-all duration-150 cursor-pointer text-center select-none ${
                selectedMenuItem === 'FREEPLAY'
                  ? 'scale-110 sm:scale-115 rotate-2'
                  : 'hover:scale-105 opacity-85 hover:opacity-100'
              }`}
            >
              <h2
                className={`font-fnf text-4xl sm:text-6xl uppercase tracking-tight ${
                  selectedMenuItem === 'FREEPLAY'
                    ? 'text-[#06b6d4] fnf-text-stroke fnf-text-shadow'
                    : 'text-white fnf-text-stroke-md'
                }`}
              >
                FREE PLAY
              </h2>
            </button>

            {/* 3. ENDLESS */}
            <button
              type="button"
              onMouseEnter={() => setSelectedMenuItem('ENDLESS')}
              onClick={onStartEndless}
              className={`group transition-all duration-150 cursor-pointer text-center select-none ${
                selectedMenuItem === 'ENDLESS'
                  ? 'scale-110 sm:scale-115 -rotate-1'
                  : 'hover:scale-105 opacity-85 hover:opacity-100'
              }`}
            >
              <h2
                className={`font-fnf text-3xl sm:text-5xl uppercase tracking-tight ${
                  selectedMenuItem === 'ENDLESS'
                    ? 'text-[#f59e0b] fnf-text-stroke fnf-text-shadow'
                    : 'text-white fnf-text-stroke-md'
                }`}
              >
                ENDLESS
              </h2>
            </button>

            {/* 4. CHARACTERS / SKINS */}
            <button
              type="button"
              onMouseEnter={() => setSelectedMenuItem('SKINS')}
              onClick={onOpenSkins}
              className={`group transition-all duration-150 cursor-pointer text-center select-none ${
                selectedMenuItem === 'SKINS'
                  ? 'scale-110 sm:scale-115 rotate-1'
                  : 'hover:scale-105 opacity-85 hover:opacity-100'
              }`}
            >
              <h2
                className={`font-fnf text-3xl sm:text-5xl uppercase tracking-tight ${
                  selectedMenuItem === 'SKINS'
                    ? 'text-[#ec4899] fnf-text-stroke fnf-text-shadow'
                    : 'text-white fnf-text-stroke-md'
                }`}
              >
                SKINS
              </h2>
            </button>

            {/* 5. OPTIONS */}
            <button
              type="button"
              onMouseEnter={() => setSelectedMenuItem('OPTIONS')}
              onClick={onOpenSettings}
              className={`group transition-all duration-150 cursor-pointer text-center select-none ${
                selectedMenuItem === 'OPTIONS'
                  ? 'scale-110 sm:scale-115 -rotate-2'
                  : 'hover:scale-105 opacity-85 hover:opacity-100'
              }`}
            >
              <h2
                className={`font-fnf text-3xl sm:text-5xl uppercase tracking-tight ${
                  selectedMenuItem === 'OPTIONS'
                    ? 'text-[#10b981] fnf-text-stroke fnf-text-shadow'
                    : 'text-white fnf-text-stroke-md'
                }`}
              >
                OPTIONS
              </h2>
            </button>
          </div>

          {/* Bottom helper prompt */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
            <button
              type="button"
              onClick={onOpenReadMe}
              className="bg-rose-600 hover:bg-rose-500 text-white font-pixel text-[11px] px-3.5 py-1.5 rounded-xl border-2 border-white shadow-[2px_2px_0px_#000] hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5 font-bold"
            >
              <span>📖 OKU BENİ</span>
            </button>
            <button
              type="button"
              onClick={onOpenHowToPlay}
              className="bg-black text-white font-pixel text-[11px] px-3 py-1.5 rounded-xl border-2 border-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              ? NASIL OYNANIR
            </button>
            <span className="font-digital text-xl text-black font-bold">
              REKOR: {highestEndlessScore.toString().padStart(6, '0')}
            </span>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCREEN 2: FNF WEEK / STORY MODE SELECT (Image 1: TANKMAN / BF / GF & CONSOLE) */}
      {/* ========================================================================= */}
      {screen === 'STORY_SELECT' && (
        <div className="relative z-10 flex-1 flex flex-col justify-between">
          {/* Back button */}
          <div className="absolute top-2 left-3 z-20">
            <button
              type="button"
              onClick={() => setScreen('MAIN')}
              className="flex items-center gap-1.5 bg-black text-[#f9c944] font-pixel text-xs px-3 py-1.5 rounded-xl border-2 border-white hover:bg-slate-900 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>GERİ</span>
            </button>
          </div>

          {/* TOP HALF: CARTOON STAGE WITH CHARACTERS (Matches Image 1) */}
          <div className="flex-1 flex items-center justify-around px-4 sm:px-12 relative overflow-hidden">
            {/* Left Character: Boss / Rival Silhouette */}
            <div className="flex flex-col items-center transform animate-fnf-beat">
              <div className="w-24 sm:w-36 h-36 sm:h-48 flex items-center justify-center">
                <svg viewBox="0 0 160 200" className="w-full h-full fill-black drop-shadow-[4px_4px_0px_#fff]">
                  {/* Tankman / Rival Helmet & Visor */}
                  <rect x="35" y="20" width="90" height="75" rx="30" />
                  <rect x="45" y="40" width="70" height="28" rx="10" fill="#f9c944" stroke="#000" strokeWidth="4" />
                  <path d="M 60 75 Q 80 82 100 75" stroke="#000" strokeWidth="5" fill="none" />
                  {/* Arms & Microphone */}
                  <rect x="15" y="85" width="28" height="55" rx="10" />
                  <rect x="115" y="85" width="28" height="55" rx="10" />
                  <circle cx="130" cy="80" r="14" fill="#000" />
                  {/* Torso & Armor */}
                  <path d="M 40 95 L 120 95 L 110 160 L 50 160 Z" />
                  {/* Chunky Feet */}
                  <rect x="40" y="160" width="32" height="30" rx="8" />
                  <rect x="88" y="160" width="32" height="30" rx="8" />
                </svg>
              </div>
              <span className="font-pixel text-[10px] sm:text-xs text-black font-bold mt-1 uppercase">
                {activeWorld.name.split(' ')[0]} (BOSS)
              </span>
            </div>

            {/* Center Character: BOYFRIEND WITH MIC (Matches Image 1) */}
            <div className="flex flex-col items-center transform animate-fnf-beat -rotate-1">
              <div className="w-28 sm:w-44 h-40 sm:h-52 flex items-center justify-center">
                <svg viewBox="0 0 180 220" className="w-full h-full drop-shadow-[5px_5px_0px_#000]">
                  {/* Cap Brim */}
                  <path d="M 50 35 C 80 15, 130 15, 150 45 C 170 70, 160 85, 135 85 L 45 75 Z" fill="#000" />
                  <path d="M 135 55 L 180 65 C 175 78, 155 85, 135 80 Z" fill="#000" />
                  {/* Face */}
                  <circle cx="95" cy="75" r="42" fill="#f9c944" stroke="#000" strokeWidth="6" />
                  {/* Anime Eyes */}
                  <path d="M 75 65 L 90 75 L 75 80 Z" fill="#000" />
                  <path d="M 105 75 L 120 65 L 120 80 Z" fill="#000" />
                  {/* Mouth */}
                  <path d="M 85 92 Q 95 100 110 90" stroke="#000" strokeWidth="5" fill="none" />
                  {/* Spiky cyan hair peaks */}
                  <path d="M 40 65 L 15 45 L 35 85 L 18 105 L 50 100 Z" fill="#06b6d4" stroke="#000" strokeWidth="5" />
                  {/* Mic in Hand */}
                  <circle cx="40" cy="115" r="16" fill="#000" />
                  <rect x="36" y="125" width="8" height="20" rx="3" fill="#000" />
                  {/* Torso & Shirt */}
                  <path d="M 60 115 L 130 115 L 140 170 L 50 170 Z" fill="#ffffff" stroke="#000" strokeWidth="6" />
                  <circle cx="95" cy="142" r="12" fill="#ef4444" stroke="#000" strokeWidth="3" />
                  {/* Giant Shoes */}
                  <ellipse cx="65" cy="195" rx="32" ry="16" fill="#ef4444" stroke="#000" strokeWidth="5" />
                  <ellipse cx="135" cy="200" rx="35" ry="16" fill="#06b6d4" stroke="#000" strokeWidth="5" />
                </svg>
              </div>
              <span className="font-pixel text-[10px] sm:text-xs text-black font-bold mt-1 uppercase">
                SİBER KOŞUCU (BF)
              </span>
            </div>

            {/* Right Character: GIRLFRIEND ON STEREO SPEAKERS (Matches Image 1) */}
            <div className="hidden sm:flex flex-col items-center transform animate-fnf-beat">
              <div className="w-28 sm:w-40 h-36 sm:h-48 flex items-center justify-center">
                <svg viewBox="0 0 160 190" className="w-full h-full">
                  {/* Speakers Base */}
                  <rect x="15" y="85" width="130" height="95" rx="6" fill="#000" stroke="#f9c944" strokeWidth="3" />
                  <circle cx="45" cy="132" r="22" fill="#f9c944" stroke="#000" strokeWidth="4" />
                  <circle cx="115" cy="132" r="22" fill="#f9c944" stroke="#000" strokeWidth="4" />
                  {/* Girlfriend sitting on top */}
                  <circle cx="80" cy="38" r="18" fill="#f9c944" stroke="#000" strokeWidth="4" />
                  {/* Auburn Hair flow */}
                  <path d="M 60 25 C 80 10, 100 15, 105 35 C 115 55, 120 80, 100 85 L 60 85 Z" fill="#000" />
                  <path d="M 70 55 L 90 55 L 85 90 L 75 90 Z" fill="#ef4444" stroke="#000" strokeWidth="3" />
                </svg>
              </div>
              <span className="font-pixel text-[10px] sm:text-xs text-black font-bold mt-1 uppercase">
                GF (RİTİM GÖZCÜSÜ)
              </span>
            </div>
          </div>

          {/* ================================================================= */}
          {/* BOTTOM CONSOLE COCKPIT DECK (Matches Image 1 Bottom console) */}
          {/* ================================================================= */}
          <div className="w-full bg-[#2a2b38] border-t-8 border-black p-3 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Left Console: Tracks Cassette */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="w-16 h-20 bg-gradient-to-br from-purple-700 to-rose-700 rounded-xl border-3 border-black p-1 flex flex-col justify-between shrink-0 shadow-md">
                <span className="text-[8px] font-pixel text-yellow-300">★ FNF OST</span>
                <span className="text-[9px] font-fnf text-white text-center leading-tight">VOL. {activeWorld.id}</span>
                <div className="h-1 bg-white/40 rounded-full" />
              </div>

              <div className="bg-[#181822] p-2.5 rounded-xl border-3 border-black min-w-[130px]">
                <span className="font-pixel text-[9px] text-pink-400 block mb-1">PARÇALAR:</span>
                <div className="font-pixel text-[10px] text-white space-y-0.5">
                  <div className="text-cyan-300">▶ {activeWorld.songId.replace('_', ' ')}</div>
                  <div className="text-slate-400">12 Bölüm Aşaması</div>
                  <div className="text-rose-400 font-bold">12. Bölüm BOSS</div>
                </div>
              </div>
            </div>

            {/* Center Console: Curved CRT World Monitor */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => cycleWorld(-1)}
                className="w-8 h-8 rounded-lg bg-black text-cyan-400 border-2 border-white flex items-center justify-center hover:bg-slate-800 cursor-pointer active:scale-95"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="bg-[#11121d] border-4 border-black px-6 py-2.5 rounded-2xl min-w-[180px] sm:min-w-[220px] text-center shadow-inner">
                <span className="font-digital text-cyan-400 text-xs tracking-widest block">
                  FM. {activeWorld.id * 10 + 88}.5 MHz
                </span>
                <h3 className="font-fnf text-2xl sm:text-3xl text-white tracking-wide fnf-text-stroke-md my-0.5">
                  WEEK {activeWorld.id}
                </h3>
                <span className="font-pixel text-[10px] text-[#f9c944] block truncate">
                  {activeWorld.name}
                </span>
              </div>

              <button
                type="button"
                onClick={() => cycleWorld(1)}
                className="w-8 h-8 rounded-lg bg-black text-cyan-400 border-2 border-white flex items-center justify-center hover:bg-slate-800 cursor-pointer active:scale-95"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Right Console: Difficulty Selector & 7-Segment Highscore */}
            <div className="flex flex-col items-center sm:items-end w-full sm:w-auto">
              {/* Difficulty selector with cyan arrow markers */}
              <div className="flex items-center gap-2 bg-[#181822] border-3 border-black px-3 py-1.5 rounded-xl mb-1.5">
                <button
                  type="button"
                  onClick={() => cycleDifficulty(-1)}
                  className="text-cyan-400 hover:text-cyan-200 font-pixel text-base cursor-pointer"
                >
                  ◀
                </button>
                <span
                  className={`font-pixel text-xs sm:text-sm font-black px-2 tracking-wider ${
                    difficulty === 'EASY'
                      ? 'text-emerald-400'
                      : difficulty === 'NORMAL'
                      ? 'text-yellow-400'
                      : difficulty === 'HARD'
                      ? 'text-rose-500 animate-pulse'
                      : 'text-purple-400 animate-bounce'
                  }`}
                >
                  {difficulty}
                </span>
                <button
                  type="button"
                  onClick={() => cycleDifficulty(1)}
                  className="text-cyan-400 hover:text-cyan-200 font-pixel text-base cursor-pointer"
                >
                  ▶
                </button>
              </div>

              {/* 7-Segment Digital Highscore */}
              <div className="text-center sm:text-right">
                <span className="font-fnf text-[11px] text-[#f59e0b] tracking-wider block">HIGHSCORE</span>
                <span className="font-digital text-2xl sm:text-3xl text-cyan-300 font-black tracking-widest bg-black px-3 py-0.5 rounded-lg border-2 border-black inline-block">
                  {highestEndlessScore.toString().padStart(6, '0')}
                </span>
              </div>
            </div>
          </div>

          {/* Big Green/Cyan START PLAY Button */}
          <div className="bg-black py-3 px-4 flex items-center justify-between">
            <div className="text-white font-pixel text-[10px] hidden sm:block">
              {isWorldUnlocked ? '✅ DÜNYA AÇIK - BAŞLAMAYA HAZIR' : '🔒 HENÜZ KİLİTLİ'}
            </div>

            <button
              type="button"
              onClick={onStartCampaign}
              className="w-full sm:w-auto py-2.5 px-8 rounded-2xl bg-[#06b6d4] hover:bg-[#22d3ee] text-black font-fnf text-xl sm:text-2xl border-4 border-black fnf-box-shadow flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-95 mx-auto sm:mx-0"
            >
              <Play className="w-6 h-6 fill-black" />
              <span>WEEK {activeWorld.id} OYNA!</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
