/**
 * Procedural Multi-Song Web Audio API Synthesizer
 * Supports 10 world-themed synthesized soundtracks, SFX, and instant-explosion sound.
 */

export interface SongTrack {
  id: string;
  name: string;
  artist: string;
  bpm: number;
  melodyNotes: number[];
  bassNotes: number[];
}

export const SONGS: Record<string, SongTrack> = {
  cyber_city: {
    id: 'cyber_city',
    name: 'Siber Dalga (Cyber Synthwave)',
    artist: 'Refleks Core',
    bpm: 124,
    melodyNotes: [329.63, 0, 392, 440, 0, 493.88, 440, 392, 329.63, 349.23, 392, 0, 440, 0, 392, 329.63],
    bassNotes: [82.41, 82.41, 98, 98, 110, 110, 98, 82.41, 82.41, 82.41, 87.31, 87.31, 98, 98, 73.42, 82.41],
  },
  molten_foundry: {
    id: 'molten_foundry',
    name: 'Lav Kıvılcımı (Molten Overdrive)',
    artist: 'Refleks Core',
    bpm: 132,
    melodyNotes: [220, 261.63, 329.63, 440, 415.3, 329.63, 261.63, 220, 246.94, 293.66, 369.99, 440, 392, 329.63, 293.66, 246.94],
    bassNotes: [55, 55, 65.41, 65.41, 55, 55, 73.42, 65.41, 61.74, 61.74, 73.42, 73.42, 55, 55, 65.41, 55],
  },
  emerald_matrix: {
    id: 'emerald_matrix',
    name: 'Matris Asidi (Matrix Acid)',
    artist: 'Refleks Core',
    bpm: 136,
    melodyNotes: [440, 523.25, 659.25, 880, 783.99, 659.25, 523.25, 587.33, 659.25, 783.99, 880, 1046.5, 987.77, 880, 783.99, 659.25],
    bassNotes: [110, 110, 130.81, 130.81, 146.83, 146.83, 164.81, 164.81, 110, 110, 130.81, 130.81, 174.61, 164.81, 146.83, 130.81],
  },
  quantum_nebula: {
    id: 'quantum_nebula',
    name: 'Kozmik Trance (Quantum Nebula)',
    artist: 'Refleks Core',
    bpm: 140,
    melodyNotes: [587.33, 0, 659.25, 880, 0, 783.99, 659.25, 587.33, 523.25, 0, 659.25, 783.99, 880, 0, 987.77, 880],
    bassNotes: [73.42, 73.42, 82.41, 82.41, 110, 110, 98, 73.42, 65.41, 65.41, 82.41, 82.41, 110, 110, 98, 73.42],
  },
  solar_citadel: {
    id: 'solar_citadel',
    name: 'Güneş Hücresi (Solar Rush)',
    artist: 'Refleks Core',
    bpm: 134,
    melodyNotes: [392, 440, 523.25, 659.25, 783.99, 659.25, 523.25, 440, 392, 493.88, 587.33, 783.99, 659.25, 523.25, 440, 392],
    bassNotes: [98, 98, 110, 110, 130.81, 130.81, 110, 98, 98, 98, 123.47, 123.47, 130.81, 110, 98, 87.31],
  },
  cryo_glacier: {
    id: 'cryo_glacier',
    name: 'Buzul Titanyum (Cryo Frost)',
    artist: 'Refleks Core',
    bpm: 138,
    melodyNotes: [523.25, 659.25, 783.99, 1046.5, 987.77, 783.99, 659.25, 523.25, 587.33, 698.46, 880, 1174.66, 1046.5, 880, 698.46, 587.33],
    bassNotes: [65.41, 65.41, 82.41, 82.41, 98, 98, 82.41, 65.41, 73.42, 73.42, 87.31, 87.31, 110, 110, 87.31, 73.42],
  },
  toxic_core: {
    id: 'toxic_core',
    name: 'Toksik Ritim (Industrial Acid)',
    artist: 'Refleks Core',
    bpm: 142,
    melodyNotes: [293.66, 311.13, 369.99, 440, 415.3, 369.99, 311.13, 293.66, 277.18, 329.63, 392, 440, 415.3, 392, 329.63, 277.18],
    bassNotes: [73.42, 73.42, 77.78, 77.78, 92.5, 92.5, 77.78, 73.42, 69.3, 69.3, 82.41, 82.41, 98, 98, 82.41, 69.3],
  },
  thunder_canyon: {
    id: 'thunder_canyon',
    name: 'Şimşek Bası (Thunder Bass)',
    artist: 'Refleks Core',
    bpm: 144,
    melodyNotes: [220, 277.18, 329.63, 440, 554.37, 440, 329.63, 277.18, 246.94, 293.66, 369.99, 493.88, 440, 369.99, 293.66, 246.94],
    bassNotes: [55, 55, 69.3, 69.3, 82.41, 82.41, 69.3, 55, 61.74, 61.74, 73.42, 73.42, 92.5, 92.5, 73.42, 61.74],
  },
  chrono_rift: {
    id: 'chrono_rift',
    name: 'Zaman Tüneli (Chrono Drift)',
    artist: 'Refleks Core',
    bpm: 148,
    melodyNotes: [440, 493.88, 554.37, 659.25, 739.99, 659.25, 554.37, 493.88, 392, 440, 523.25, 659.25, 587.33, 523.25, 440, 392],
    bassNotes: [110, 110, 123.47, 123.47, 138.59, 138.59, 123.47, 110, 98, 98, 110, 110, 130.81, 130.81, 110, 98],
  },
  omega_singularity: {
    id: 'omega_singularity',
    name: 'Omega Kıyamet (Final Boss Tekno)',
    artist: 'Refleks Core',
    bpm: 152,
    melodyNotes: [220, 293.66, 329.63, 440, 220, 329.63, 440, 587.33, 220, 293.66, 329.63, 440, 220, 587.33, 523.25, 440],
    bassNotes: [55, 55, 55, 73.42, 55, 55, 82.41, 55, 55, 55, 55, 73.42, 55, 82.41, 87.31, 73.42],
  },
};

type BeatCallback = (beat: number, totalBeats: number, bpm: number) => void;

class SoundSystem {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private masterVolume: number = 0.8;
  private sfxVolume: number = 0.7;
  private musicVolume: number = 0.45;

  private currentSongId: string = 'cyber_city';
  private beatInterval: number | null = null;
  private step: number = 0;
  private totalBeats: number = 0;
  private isMusicPlaying: boolean = false;

  private beatListeners: Set<BeatCallback> = new Set();
  public audioVisualizerLevels: number[] = [0.2, 0.4, 0.6, 0.3, 0.5, 0.7, 0.4, 0.3];

  constructor() {
    const savedMute = localStorage.getItem('reflex_mute');
    if (savedMute !== null) {
      this.isMuted = savedMute === 'true';
    }
    const savedMaster = localStorage.getItem('reflex_vol_master');
    if (savedMaster !== null) this.masterVolume = parseFloat(savedMaster);
    const savedSfx = localStorage.getItem('reflex_vol_sfx');
    if (savedSfx !== null) this.sfxVolume = parseFloat(savedSfx);
    const savedMusic = localStorage.getItem('reflex_vol_music');
    if (savedMusic !== null) this.musicVolume = parseFloat(savedMusic);
    const savedSong = localStorage.getItem('reflex_selected_song');
    if (savedSong && SONGS[savedSong]) {
      this.currentSongId = savedSong;
    }
  }

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolumes(master: number, sfx: number, music: number) {
    this.masterVolume = Math.max(0, Math.min(1, master));
    this.sfxVolume = Math.max(0, Math.min(1, sfx));
    this.musicVolume = Math.max(0, Math.min(1, music));

    localStorage.setItem('reflex_vol_master', String(this.masterVolume));
    localStorage.setItem('reflex_vol_sfx', String(this.sfxVolume));
    localStorage.setItem('reflex_vol_music', String(this.musicVolume));
  }

  public getVolumes() {
    return {
      master: this.masterVolume,
      sfx: this.sfxVolume,
      music: this.musicVolume,
    };
  }

  public setSong(songId: string) {
    if (!SONGS[songId]) return;
    this.currentSongId = songId;
    localStorage.setItem('reflex_selected_song', songId);
    if (this.isMusicPlaying) {
      this.stopBeat();
      this.startBeat(songId);
    }
  }

  public getCurrentSong(): SongTrack {
    return SONGS[this.currentSongId] || SONGS.cyber_city;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    localStorage.setItem('reflex_mute', String(this.isMuted));
    if (this.isMuted) {
      this.stopBeat();
    } else if (this.isMusicPlaying) {
      this.startBeat(this.currentSongId);
    }
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public onBeat(cb: BeatCallback) {
    this.beatListeners.add(cb);
    return () => this.beatListeners.delete(cb);
  }

  // SOUND EFFECTS
  public playJump() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(240, now);
    osc.frequency.exponentialRampToValueAtTime(760, now + 0.16);

    const vol = this.masterVolume * this.sfxVolume * 0.45;
    gain.gain.setValueAtTime(vol, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.2);
  }

  public playCrouch() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(420, now);
    osc.frequency.exponentialRampToValueAtTime(120, now + 0.18);

    const vol = this.masterVolume * this.sfxVolume * 0.45;
    gain.gain.setValueAtTime(vol, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.19);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.19);
  }

  public playMoveLane(direction: 'left' | 'right') {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const panner = this.ctx.createStereoPanner ? this.ctx.createStereoPanner() : null;
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    const startFreq = direction === 'left' ? 340 : 400;
    osc.frequency.setValueAtTime(startFreq, now);
    osc.frequency.exponentialRampToValueAtTime(210, now + 0.12);

    const vol = this.masterVolume * this.sfxVolume * 0.35;
    gain.gain.setValueAtTime(vol, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.13);

    if (panner) {
      panner.pan.setValueAtTime(direction === 'left' ? -0.7 : 0.7, now);
      osc.connect(panner);
      panner.connect(gain);
    } else {
      osc.connect(gain);
    }

    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.13);
  }

  public playWarning() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.setValueAtTime(1100, now + 0.04);

    const vol = this.masterVolume * this.sfxVolume * 0.18;
    gain.gain.setValueAtTime(vol, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.08);
  }

  public playWarningSiren() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.linearRampToValueAtTime(1200, now + 0.12);
    osc.frequency.linearRampToValueAtTime(800, now + 0.24);

    const vol = this.masterVolume * this.sfxVolume * 0.35;
    gain.gain.setValueAtTime(vol, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.26);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.26);
  }

  public playDodgeSuccess(combo: number = 1) {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const baseFreq = Math.min(1300, 460 + Math.min(combo, 16) * 36);

    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'sine';
    osc2.type = 'triangle';

    osc1.frequency.setValueAtTime(baseFreq, now);
    osc2.frequency.setValueAtTime(baseFreq * 1.5, now);

    const vol = this.masterVolume * this.sfxVolume * 0.35;
    gain.gain.setValueAtTime(vol, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.2);
    osc2.stop(now + 0.2);
  }

  public playHit() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(170, now);
    osc.frequency.exponentialRampToValueAtTime(45, now + 0.28);

    const vol = this.masterVolume * this.sfxVolume * 0.6;
    gain.gain.setValueAtTime(vol, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.3);
  }

  public playExplosion() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    // Sub-bass rumble
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(140, now);
    subOsc.frequency.exponentialRampToValueAtTime(25, now + 0.85);

    const masterVol = this.masterVolume * this.sfxVolume;
    subGain.gain.setValueAtTime(masterVol * 0.95, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);

    subOsc.connect(subGain);
    subGain.connect(this.ctx.destination);
    subOsc.start(now);
    subOsc.stop(now + 0.9);

    // Blast noise
    const bufferSize = this.ctx.sampleRate * 0.55;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = 'lowpass';
    noiseFilter.frequency.setValueAtTime(2400, now);
    noiseFilter.frequency.exponentialRampToValueAtTime(100, now + 0.65);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(masterVol * 0.8, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);

    noise.start(now);
    noise.stop(now + 0.7);
  }

  public playLevelClear() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const startTime = this.ctx.currentTime + idx * 0.11;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);

      const vol = this.masterVolume * this.sfxVolume * 0.35;
      gain.gain.setValueAtTime(vol, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + 0.35);
    });
  }

  public playGameOver() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const notes = [440, 392, 349.23, 261.63];
    notes.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const startTime = this.ctx.currentTime + idx * 0.16;

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, startTime);

      const vol = this.masterVolume * this.sfxVolume * 0.35;
      gain.gain.setValueAtTime(vol, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.28);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + 0.28);
    });
  }

  // MULTI-VOICE SYNCHRONIZED BACKGROUND MUSIC
  public startBeat(songId?: string, customBpm?: number) {
    if (songId && SONGS[songId]) this.currentSongId = songId;
    this.isMusicPlaying = true;
    if (this.isMuted) return;

    if (this.beatInterval) {
      clearInterval(this.beatInterval);
      this.beatInterval = null;
    }

    const song = SONGS[this.currentSongId] || SONGS.cyber_city;
    const bpm = customBpm || song.bpm;
    const intervalMs = (60 / bpm / 4) * 1000;

    this.beatInterval = window.setInterval(() => {
      this.playMusicStep(song, bpm);
    }, intervalMs);
  }

  private playMusicStep(song: SongTrack, bpm: number) {
    if (this.isMuted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const currentStep = this.step % 16;
    this.step = (this.step + 1) % 16;
    this.totalBeats++;

    this.beatListeners.forEach((cb) => cb(currentStep, this.totalBeats, bpm));

    const musicVol = this.masterVolume * this.musicVolume;

    // Kick Drum
    if (currentStep % 4 === 0) {
      const kickOsc = this.ctx.createOscillator();
      const kickGain = this.ctx.createGain();

      kickOsc.frequency.setValueAtTime(125, now);
      kickOsc.frequency.exponentialRampToValueAtTime(40, now + 0.09);

      kickGain.gain.setValueAtTime(musicVol * 0.55, now);
      kickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

      kickOsc.connect(kickGain);
      kickGain.connect(this.ctx.destination);
      kickOsc.start(now);
      kickOsc.stop(now + 0.1);

      this.audioVisualizerLevels[0] = 0.9;
      this.audioVisualizerLevels[1] = 0.75;
    }

    // Snare / Clap
    if (currentStep === 4 || currentStep === 12) {
      const snareOsc = this.ctx.createOscillator();
      const snareGain = this.ctx.createGain();

      snareOsc.type = 'triangle';
      snareOsc.frequency.setValueAtTime(250, now);
      snareOsc.frequency.exponentialRampToValueAtTime(75, now + 0.07);

      snareGain.gain.setValueAtTime(musicVol * 0.28, now);
      snareGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      snareOsc.connect(snareGain);
      snareGain.connect(this.ctx.destination);
      snareOsc.start(now);
      snareOsc.stop(now + 0.08);

      this.audioVisualizerLevels[4] = 0.85;
      this.audioVisualizerLevels[5] = 0.7;
    }

    // Hi-Hat
    if (currentStep % 2 === 1) {
      const hatOsc = this.ctx.createOscillator();
      const hatGain = this.ctx.createGain();

      hatOsc.type = 'square';
      hatOsc.frequency.setValueAtTime(8000, now);

      hatGain.gain.setValueAtTime(musicVol * 0.07, now);
      hatGain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

      hatOsc.connect(hatGain);
      hatGain.connect(this.ctx.destination);
      hatOsc.start(now);
      hatOsc.stop(now + 0.035);

      this.audioVisualizerLevels[6] = 0.6;
      this.audioVisualizerLevels[7] = 0.5;
    }

    // Bassline
    const bassFreq = song.bassNotes[currentStep];
    if (bassFreq > 0) {
      const bassOsc = this.ctx.createOscillator();
      const bassGain = this.ctx.createGain();

      bassOsc.type = 'sawtooth';
      bassOsc.frequency.setValueAtTime(bassFreq, now);

      bassGain.gain.setValueAtTime(musicVol * 0.22, now);
      bassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

      bassOsc.connect(bassGain);
      bassGain.connect(this.ctx.destination);
      bassOsc.start(now);
      bassOsc.stop(now + 0.14);

      this.audioVisualizerLevels[2] = 0.8;
    }

    // Lead Melody
    const melodyFreq = song.melodyNotes[currentStep];
    if (melodyFreq > 0) {
      const leadOsc = this.ctx.createOscillator();
      const leadGain = this.ctx.createGain();

      leadOsc.type = 'sine';
      leadOsc.frequency.setValueAtTime(melodyFreq, now);

      leadGain.gain.setValueAtTime(musicVol * 0.2, now);
      leadGain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

      leadOsc.connect(leadGain);
      leadGain.connect(this.ctx.destination);
      leadOsc.start(now);
      leadOsc.stop(now + 0.16);

      this.audioVisualizerLevels[3] = 0.75;
    }

    for (let i = 0; i < this.audioVisualizerLevels.length; i++) {
      this.audioVisualizerLevels[i] = Math.max(0.1, this.audioVisualizerLevels[i] * 0.88);
    }
  }

  public stopBeat() {
    if (this.beatInterval) {
      clearInterval(this.beatInterval);
      this.beatInterval = null;
    }
    this.isMusicPlaying = false;
  }
}

export const sounds = new SoundSystem();
