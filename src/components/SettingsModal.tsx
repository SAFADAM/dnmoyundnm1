import React, { useState, useEffect } from 'react';
import { X, Volume2, Keyboard, Sliders, Music, RotateCcw } from 'lucide-react';
import { GameSettings, KeyBindings } from '../types/game';
import { SONGS, sounds } from '../utils/audio';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: GameSettings;
  onUpdateSettings: (newSettings: GameSettings) => void;
}

type RebindingAction = keyof KeyBindings | null;

const DEFAULT_BINDINGS: KeyBindings = {
  moveLeft: ['KeyA', 'ArrowLeft'],
  moveRight: ['KeyD', 'ArrowRight'],
  jump: ['KeyW', 'ArrowUp', 'Space'],
  crouch: ['KeyS', 'ArrowDown'],
  pause: ['KeyP', 'Escape'],
};

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
}) => {
  const [activeTab, setActiveTab] = useState<'audio' | 'controls' | 'graphics'>('audio');
  const [rebindingAction, setRebindingAction] = useState<RebindingAction>(null);

  // Key listening when rebinding is active
  useEffect(() => {
    if (!rebindingAction) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const newKey = e.code;
      const updatedBindings = {
        ...settings.keyBindings,
        [rebindingAction]: [newKey],
      };

      onUpdateSettings({
        ...settings,
        keyBindings: updatedBindings,
      });

      setRebindingAction(null);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [rebindingAction, settings, onUpdateSettings]);

  if (!isOpen) return null;

  const formatKeyName = (code: string) => {
    if (!code) return '';
    if (code.startsWith('Key')) return code.replace('Key', '');
    if (code.startsWith('Arrow')) {
      if (code === 'ArrowLeft') return 'Sol Ok';
      if (code === 'ArrowRight') return 'Sağ Ok';
      if (code === 'ArrowUp') return 'Yukarı Ok';
      if (code === 'ArrowDown') return 'Aşağı Ok';
      return code.replace('Arrow', '');
    }
    if (code === 'Space') return 'BOŞLUK';
    if (code === 'Escape') return 'ESC';
    return code;
  };

  const handleResetDefaults = () => {
    onUpdateSettings({
      ...settings,
      keyBindings: DEFAULT_BINDINGS,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in select-none">
      <div className="relative w-full max-w-xl bg-[#f9c944] border-8 border-black rounded-3xl p-5 sm:p-6 shadow-[10px_10px_0px_#000] text-black overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b-4 border-black">
          <div>
            <span className="font-pixel text-[10px] uppercase tracking-wider text-black font-bold">
              ★ KONFİGÜRASYON ★
            </span>
            <h2 className="font-fnf text-3xl sm:text-4xl text-white fnf-text-stroke uppercase">
              AYARLAR
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

        {/* Tab Navigation */}
        <div className="flex my-3 gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('audio')}
            className={`py-2 px-3.5 rounded-xl font-fnf text-sm border-3 border-black transition-all cursor-pointer ${
              activeTab === 'audio'
                ? 'bg-black text-[#f9c944] shadow-md scale-105'
                : 'bg-white hover:bg-slate-100 text-black'
            }`}
          >
            <span>SES & ŞARKILAR</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('controls')}
            className={`py-2 px-3.5 rounded-xl font-fnf text-sm border-3 border-black transition-all cursor-pointer ${
              activeTab === 'controls'
                ? 'bg-black text-[#f9c944] shadow-md scale-105'
                : 'bg-white hover:bg-slate-100 text-black'
            }`}
          >
            <span>TUŞ AYARLARI</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('graphics')}
            className={`py-2 px-3.5 rounded-xl font-fnf text-sm border-3 border-black transition-all cursor-pointer ${
              activeTab === 'graphics'
                ? 'bg-black text-[#f9c944] shadow-md scale-105'
                : 'bg-white hover:bg-slate-100 text-black'
            }`}
          >
            <span>EFEKTLER</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-4">
          {/* TAB 1: AUDIO */}
          {activeTab === 'audio' && (
            <div className="space-y-3.5">
              {/* Master Volume */}
              <div className="bg-slate-800/50 p-3 rounded-2xl border border-slate-800">
                <div className="flex justify-between text-xs font-bold text-slate-200 mb-1.5">
                  <span>Ana Ses (Master)</span>
                  <span className="font-mono text-cyan-400">{Math.round(settings.masterVolume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={settings.masterVolume}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    sounds.setVolumes(val, settings.sfxVolume, settings.musicVolume);
                    onUpdateSettings({ ...settings, masterVolume: val });
                  }}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>

              {/* Music Volume */}
              <div className="bg-slate-800/50 p-3 rounded-2xl border border-slate-800">
                <div className="flex justify-between text-xs font-bold text-slate-200 mb-1.5">
                  <span>Müzik Sesi</span>
                  <span className="font-mono text-cyan-400">{Math.round(settings.musicVolume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={settings.musicVolume}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    sounds.setVolumes(settings.masterVolume, settings.sfxVolume, val);
                    onUpdateSettings({ ...settings, musicVolume: val });
                  }}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>

              {/* SFX Volume */}
              <div className="bg-slate-800/50 p-3 rounded-2xl border border-slate-800">
                <div className="flex justify-between text-xs font-bold text-slate-200 mb-1.5">
                  <span>Ses Efektleri (SFX)</span>
                  <span className="font-mono text-cyan-400">{Math.round(settings.sfxVolume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={settings.sfxVolume}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    sounds.setVolumes(settings.masterVolume, val, settings.musicVolume);
                    onUpdateSettings({ ...settings, sfxVolume: val });
                  }}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>

              {/* 10 Procedural Songs Selection */}
              <div className="bg-slate-800/50 p-3 rounded-2xl border border-slate-800">
                <label className="text-xs font-bold text-slate-200 block mb-2">
                  10 Farklı Şarkı / Mekan Müziği Seçimi
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                  {Object.keys(SONGS).map((songKey) => {
                    const s = SONGS[songKey];
                    const isSelected = settings.selectedSong === songKey;
                    return (
                      <button
                        key={songKey}
                        type="button"
                        onClick={() => {
                          sounds.setSong(songKey);
                          onUpdateSettings({ ...settings, selectedSong: songKey });
                        }}
                        className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-md shadow-cyan-500/20'
                            : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-0.5">
                          <Music className={`w-3 h-3 ${isSelected ? 'text-cyan-400' : 'text-slate-500'}`} />
                          <span className="text-[10px] font-mono text-slate-400">{s.bpm} BPM</span>
                        </div>
                        <div className="text-xs font-bold truncate">{s.name}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sound Test Button */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => sounds.playDodgeSuccess(3)}
                  className="py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium cursor-pointer"
                >
                  🔊 Ses Testi Yap
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: CONTROLS / KEYBINDINGS */}
          {activeTab === 'controls' && (
            <div className="space-y-2.5">
              <p className="text-xs text-slate-400 mb-1">
                Tuşu değiştirmek için butona tıkla ve klavyendeki istediğin tuşa bas!
              </p>

              {rebindingAction && (
                <div className="p-2.5 bg-amber-500/20 border border-amber-500/50 rounded-xl text-amber-200 text-xs text-center font-bold animate-pulse">
                  Yeni bir tuşa bas...
                </div>
              )}

              <div className="space-y-2">
                {/* Sola Geç */}
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/50 border border-slate-800">
                  <div>
                    <span className="text-xs font-bold text-white block">Sola Geç</span>
                    <span className="text-[11px] text-slate-400">Sol şeride kay</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setRebindingAction('moveLeft')}
                    className="py-1.5 px-3 rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-400 text-cyan-400 font-mono text-xs font-bold cursor-pointer"
                  >
                    {rebindingAction === 'moveLeft'
                      ? 'Tuşa Bas...'
                      : (settings.keyBindings?.moveLeft || DEFAULT_BINDINGS.moveLeft).map(formatKeyName).join(' / ')}
                  </button>
                </div>

                {/* Sağa Geç */}
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/50 border border-slate-800">
                  <div>
                    <span className="text-xs font-bold text-white block">Sağa Geç</span>
                    <span className="text-[11px] text-slate-400">Sağ şeride kay</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setRebindingAction('moveRight')}
                    className="py-1.5 px-3 rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-400 text-cyan-400 font-mono text-xs font-bold cursor-pointer"
                  >
                    {rebindingAction === 'moveRight'
                      ? 'Tuşa Bas...'
                      : (settings.keyBindings?.moveRight || DEFAULT_BINDINGS.moveRight).map(formatKeyName).join(' / ')}
                  </button>
                </div>

                {/* Zıpla */}
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/50 border border-slate-800">
                  <div>
                    <span className="text-xs font-bold text-white block">Zıpla</span>
                    <span className="text-[11px] text-slate-400">Alttan gelen engelin üzerinden atla</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setRebindingAction('jump')}
                    className="py-1.5 px-3 rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-400 text-cyan-400 font-mono text-xs font-bold cursor-pointer"
                  >
                    {rebindingAction === 'jump'
                      ? 'Tuşa Bas...'
                      : (settings.keyBindings?.jump || DEFAULT_BINDINGS.jump).map(formatKeyName).join(' / ')}
                  </button>
                </div>

                {/* Eğil */}
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/50 border border-slate-800">
                  <div>
                    <span className="text-xs font-bold text-white block">Eğil / Kay</span>
                    <span className="text-[11px] text-slate-400">Yüksekten gelen lazerin altından kay</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setRebindingAction('crouch')}
                    className="py-1.5 px-3 rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-400 text-cyan-400 font-mono text-xs font-bold cursor-pointer"
                  >
                    {rebindingAction === 'crouch'
                      ? 'Tuşa Bas...'
                      : (settings.keyBindings?.crouch || DEFAULT_BINDINGS.crouch).map(formatKeyName).join(' / ')}
                  </button>
                </div>

                {/* Duraklat */}
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/50 border border-slate-800">
                  <div>
                    <span className="text-xs font-bold text-white block">Duraklat (Pause)</span>
                    <span className="text-[11px] text-slate-400">Oyunu duraklat</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setRebindingAction('pause')}
                    className="py-1.5 px-3 rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-400 text-cyan-400 font-mono text-xs font-bold cursor-pointer"
                  >
                    {rebindingAction === 'pause'
                      ? 'Tuşa Bas...'
                      : (settings.keyBindings?.pause || DEFAULT_BINDINGS.pause).map(formatKeyName).join(' / ')}
                  </button>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleResetDefaults}
                  className="py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Varsayılan Tuşlara Sıfırla</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: GRAPHICS */}
          {activeTab === 'graphics' && (
            <div className="space-y-3">
              {/* Screen Shake */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-800/50 border border-slate-800">
                <div>
                  <span className="text-xs font-bold text-white block">Ekran Sarsıntısı (Screen Shake)</span>
                  <span className="text-[11px] text-slate-400">Çarpışmalarda ekranın dinamik titremesi</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.screenShake}
                  onChange={(e) => onUpdateSettings({ ...settings, screenShake: e.target.checked })}
                  className="w-5 h-5 accent-cyan-400 cursor-pointer rounded"
                />
              </div>

              {/* Particle Effects */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-800/50 border border-slate-800">
                <div>
                  <span className="text-xs font-bold text-white block">Parçacık Efektleri (Particles)</span>
                  <span className="text-[11px] text-slate-400">Kıvılcım, roket alevi ve enkaz parçacıkları</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.particles}
                  onChange={(e) => onUpdateSettings({ ...settings, particles: e.target.checked })}
                  className="w-5 h-5 accent-cyan-400 cursor-pointer rounded"
                />
              </div>

              {/* Audio Spectrum Visualizer */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-800/50 border border-slate-800">
                <div>
                  <span className="text-xs font-bold text-white block">Ritim Spektrumu (Visualizer)</span>
                  <span className="text-[11px] text-slate-400">Ufukta müziğe göre dans eden neon ses barları</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.audioVisualizer}
                  onChange={(e) => onUpdateSettings({ ...settings, audioVisualizer: e.target.checked })}
                  className="w-5 h-5 accent-cyan-400 cursor-pointer rounded"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 mt-3 border-t border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="py-2 px-5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
          >
            Kaydet & Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
