/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GameCanvas } from './components/GameCanvas';
import { GameHud } from './components/GameHud';
import { TouchControls } from './components/TouchControls';
import { TitleMenu } from './components/TitleMenu';
import { LevelSelectModal } from './components/LevelSelectModal';
import { SkinSelectorModal } from './components/SkinSelectorModal';
import { HowToPlayModal } from './components/HowToPlayModal';
import { ReadMeModal } from './components/ReadMeModal';
import { OfflineIndicator } from './components/OfflineIndicator';
import { SettingsModal } from './components/SettingsModal';
import { LevelClearModal } from './components/LevelClearModal';
import { GameOverModal } from './components/GameOverModal';
import { PauseModal } from './components/PauseModal';
import {
  Barrier,
  CharacterSkin,
  FloatingText,
  GameSettings,
  GameState,
  Lane,
  LevelConfig,
  ObstacleType,
  Particle,
  Shockwave,
  VerticalState,
} from './types/game';
import { LEVELS, SKINS } from './data/levels';
import { sounds } from './utils/audio';

const DEFAULT_SETTINGS: GameSettings = {
  masterVolume: 0.8,
  sfxVolume: 0.7,
  musicVolume: 0.45,
  selectedSong: 'cyber_city',
  screenShake: true,
  particles: true,
  audioVisualizer: true,
  keyBindings: {
    moveLeft: ['KeyA', 'ArrowLeft'],
    moveRight: ['KeyD', 'ArrowRight'],
    jump: ['KeyW', 'ArrowUp', 'Space'],
    crouch: ['KeyS', 'ArrowDown'],
    pause: ['KeyP', 'Escape'],
  },
};

function sanitizeSettings(raw: any): GameSettings {
  if (!raw || typeof raw !== 'object') return DEFAULT_SETTINGS;
  const rawBindings = raw.keyBindings;

  const moveLeft = Array.isArray(rawBindings?.moveLeft) && rawBindings.moveLeft.length > 0
    ? rawBindings.moveLeft
    : Array.isArray(rawBindings?.dodgeLeft) && rawBindings.dodgeLeft.length > 0
    ? rawBindings.dodgeLeft
    : DEFAULT_SETTINGS.keyBindings.moveLeft;

  const moveRight = Array.isArray(rawBindings?.moveRight) && rawBindings.moveRight.length > 0
    ? rawBindings.moveRight
    : Array.isArray(rawBindings?.dodgeRight) && rawBindings.dodgeRight.length > 0
    ? rawBindings.dodgeRight
    : DEFAULT_SETTINGS.keyBindings.moveRight;

  const jump = Array.isArray(rawBindings?.jump) && rawBindings.jump.length > 0
    ? rawBindings.jump
    : DEFAULT_SETTINGS.keyBindings.jump;

  const crouch = Array.isArray(rawBindings?.crouch) && rawBindings.crouch.length > 0
    ? rawBindings.crouch
    : DEFAULT_SETTINGS.keyBindings.crouch;

  const pause = Array.isArray(rawBindings?.pause) && rawBindings.pause.length > 0
    ? rawBindings.pause
    : DEFAULT_SETTINGS.keyBindings.pause;

  return {
    masterVolume: typeof raw.masterVolume === 'number' ? raw.masterVolume : DEFAULT_SETTINGS.masterVolume,
    sfxVolume: typeof raw.sfxVolume === 'number' ? raw.sfxVolume : DEFAULT_SETTINGS.sfxVolume,
    musicVolume: typeof raw.musicVolume === 'number' ? raw.musicVolume : DEFAULT_SETTINGS.musicVolume,
    selectedSong: typeof raw.selectedSong === 'string' ? raw.selectedSong : DEFAULT_SETTINGS.selectedSong,
    screenShake: typeof raw.screenShake === 'boolean' ? raw.screenShake : DEFAULT_SETTINGS.screenShake,
    particles: typeof raw.particles === 'boolean' ? raw.particles : DEFAULT_SETTINGS.particles,
    audioVisualizer: typeof raw.audioVisualizer === 'boolean' ? raw.audioVisualizer : DEFAULT_SETTINGS.audioVisualizer,
    keyBindings: {
      moveLeft,
      moveRight,
      jump,
      crouch,
      pause,
    },
  };
}

export default function App() {
  // Game Flow State
  const [gameState, setGameState] = useState<GameState>('MENU');
  const [currentLevel, setCurrentLevel] = useState<LevelConfig | null>(LEVELS[0]);
  const [unlockedLevelId, setUnlockedLevelId] = useState<number>(() => {
    return parseInt(localStorage.getItem('reflex_unlocked_level') || '1', 10);
  });
  const [levelStars, setLevelStars] = useState<Record<number, number>>(() => {
    try {
      return JSON.parse(localStorage.getItem('reflex_stars') || '{}');
    } catch {
      return {};
    }
  });
  const [levelHighScores, setLevelHighScores] = useState<Record<number, number>>(() => {
    try {
      return JSON.parse(localStorage.getItem('reflex_highscores') || '{}');
    } catch {
      return {};
    }
  });
  const [highestEndlessScore, setHighestEndlessScore] = useState<number>(() => {
    return parseInt(localStorage.getItem('reflex_endless_high') || '0', 10);
  });

  // Settings State
  const [settings, setSettings] = useState<GameSettings>(() => {
    try {
      const saved = localStorage.getItem('reflex_game_settings');
      if (saved) return sanitizeSettings(JSON.parse(saved));
    } catch {
      // fallback
    }
    return DEFAULT_SETTINGS;
  });

  // Selected Skin
  const [selectedSkin, setSelectedSkin] = useState<CharacterSkin>(SKINS[0]);

  // Active Player Mechanics (3-Lane Front Runner)
  const [lane, setLane] = useState<Lane>('CENTER');
  const [verticalState, setVerticalState] = useState<VerticalState>('NORMAL');
  const [health, setHealth] = useState<number>(3);
  const maxHealth = 3;
  const [score, setScore] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const [highestCombo, setHighestCombo] = useState<number>(0);
  const [clearedBarriers, setClearedBarriers] = useState<number>(0);
  const [isInvulnerable, setIsInvulnerable] = useState<boolean>(false);
  const [screenShake, setScreenShake] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(() => sounds.getMuted());

  // Overheat & Explosion Mechanics
  const [consecutiveMistakes, setConsecutiveMistakes] = useState<number>(0);
  const maxMistakesBeforeExplosion = 3;
  const [isExploding, setIsExploding] = useState<boolean>(false);
  const [wasExplosion, setWasExplosion] = useState<boolean>(false);

  // Entities Approaching from Front Horizon
  const [barriers, setBarriers] = useState<Barrier[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [shockwaves, setShockwaves] = useState<Shockwave[]>([]);
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);

  // Modals
  const [isLevelSelectOpen, setIsLevelSelectOpen] = useState(false);
  const [isSkinSelectOpen, setIsSkinSelectOpen] = useState(false);
  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState(false);
  const [isReadMeOpen, setIsReadMeOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Timers & Counters
  const verticalResetTimerRef = useRef<number | null>(null);
  const laneResetTimerRef = useRef<number | null>(null);
  const invulnerableTimerRef = useRef<number | null>(null);
  const lastSpawnTimeRef = useRef<number>(0);
  const lastSpawnedTypeRef = useRef<ObstacleType | null>(null);
  const barrierIdCounterRef = useRef<number>(1);
  const floatingIdCounterRef = useRef<number>(1);

  // Dynamic 16:9 aspect-ratio container tracking to prevent flex-box overflow & keep aspect ratio consistent
  const canvasContainerRef = useRef<HTMLDivElement | null>(null);
  const [canvasDimensions, setCanvasDimensions] = useState<{ width: number; height: number } | null>(null);

  useEffect(() => {
    if (gameState === 'MENU') return;

    const updateCanvasDimensions = () => {
      const el = canvasContainerRef.current;
      if (!el) return;
      const { clientWidth, clientHeight } = el;
      if (clientWidth <= 0 || clientHeight <= 0) return;

      // Lock to standard 16:9 arcade rhythm widescreen ratio
      const TARGET_RATIO = 16 / 9;
      let width = clientWidth;
      let height = width / TARGET_RATIO;

      if (height > clientHeight) {
        height = clientHeight;
        width = height * TARGET_RATIO;
      }

      setCanvasDimensions({
        width: Math.floor(width),
        height: Math.floor(height),
      });
    };

    updateCanvasDimensions();
    const observer = new ResizeObserver(updateCanvasDimensions);
    if (canvasContainerRef.current) {
      observer.observe(canvasContainerRef.current);
    }
    window.addEventListener('resize', updateCanvasDimensions);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateCanvasDimensions);
    };
  }, [gameState]);

  // Synchronized state refs for requestAnimationFrame game loop
  const stateRef = useRef({
    gameState,
    lane,
    verticalState,
    health,
    score,
    combo,
    highestCombo,
    clearedBarriers,
    currentLevel,
    isInvulnerable,
    barriers,
    consecutiveMistakes,
    settings,
  });

  useEffect(() => {
    stateRef.current = {
      gameState,
      lane,
      verticalState,
      health,
      score,
      combo,
      highestCombo,
      clearedBarriers,
      currentLevel,
      isInvulnerable,
      barriers,
      consecutiveMistakes,
      settings,
    };
  }, [
    gameState,
    lane,
    verticalState,
    health,
    score,
    combo,
    highestCombo,
    clearedBarriers,
    currentLevel,
    isInvulnerable,
    barriers,
    consecutiveMistakes,
    settings,
  ]);

  // Save settings when changed
  const handleUpdateSettings = (newSettings: GameSettings) => {
    setSettings(newSettings);
    localStorage.setItem('reflex_game_settings', JSON.stringify(newSettings));
  };

  // Audio mute toggle
  const handleToggleMute = () => {
    const nextMuted = sounds.toggleMute();
    setIsMuted(nextMuted);
  };

  // Add floating text feedback
  const addFloatingText = (text: string, color: string, x: number = 0.5, y: number = 0.55) => {
    const id = floatingIdCounterRef.current++;
    setFloatingTexts((prev) => [
      ...prev,
      { id, text, color, x, y, alpha: 1.0, vy: -0.012 },
    ]);
  };

  // Particle bursts
  const addParticleBurst = (color: string, count: number = 14) => {
    if (!settings.particles) return;
    const newParticles: Particle[] = [];

    let laneOffset = 0;
    if (stateRef.current.lane === 'LEFT') laneOffset = -0.22;
    else if (stateRef.current.lane === 'RIGHT') laneOffset = 0.22;

    const spawnX = 0.5 + laneOffset;
    const spawnY = 0.82;

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.003 + Math.random() * 0.006;
      newParticles.push({
        x: spawnX + (Math.random() - 0.5) * 0.04,
        y: spawnY + (Math.random() - 0.5) * 0.04,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color,
        size: 3 + Math.random() * 4,
        alpha: 1.0,
        life: 0,
        maxLife: 20 + Math.random() * 15,
      });
    }

    setParticles((prev) => [...prev.slice(-40), ...newParticles]);
  };

  // Trigger Sudden Instant Explosion when user keeps making consecutive mistakes
  const triggerSuddenExplosion = useCallback(() => {
    setIsExploding(true);
    setWasExplosion(true);
    sounds.stopBeat();
    sounds.playExplosion();

    if (settings.screenShake) {
      setScreenShake(2.5);
    }

    addFloatingText('💥 KRİTİK AŞIRI ISINMA PATLAMASI!', '#ef4444', 0.5, 0.42);

    let laneOffset = 0;
    if (stateRef.current.lane === 'LEFT') laneOffset = -0.22;
    else if (stateRef.current.lane === 'RIGHT') laneOffset = 0.22;

    const spawnX = 0.5 + laneOffset;
    const spawnY = 0.82;

    // Create 45 shattered debris particles
    const explosionParticles: Particle[] = [];
    const debrisColors = ['#ef4444', '#f97316', '#fbbf24', '#ffffff', selectedSkin.primaryColor];

    for (let i = 0; i < 45; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.004 + Math.random() * 0.01;
      explosionParticles.push({
        x: spawnX + (Math.random() - 0.5) * 0.04,
        y: spawnY + (Math.random() - 0.5) * 0.04,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.004,
        color: debrisColors[Math.floor(Math.random() * debrisColors.length)],
        size: 5 + Math.random() * 6,
        alpha: 1.0,
        life: 0,
        maxLife: 35 + Math.random() * 20,
        isDebris: true,
        rot: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.35,
      });
    }

    setParticles((prev) => [...prev, ...explosionParticles]);

    // Expanding shockwave rings
    setShockwaves([
      { x: spawnX, y: spawnY, radius: 0.02, maxRadius: 0.45, color: '#ef4444', alpha: 1.0 },
      { x: spawnX, y: spawnY, radius: 0.01, maxRadius: 0.35, color: '#fbbf24', alpha: 0.9 },
    ]);

    // Delay game over transition slightly
    window.setTimeout(() => {
      setGameState('GAME_OVER');
      setIsExploding(false);
    }, 750);
  }, [settings.screenShake, selectedSkin.primaryColor]);

  // 3-Lane Movement Actions (SOL • ORTA • SAĞ)
  // Character rests at CENTER; dodging left or right snaps back to CENTER automatically
  const moveLeft = useCallback(() => {
    if (stateRef.current.gameState !== 'PLAYING') return;

    if (laneResetTimerRef.current) {
      clearTimeout(laneResetTimerRef.current);
    }

    sounds.playMoveLane('left');
    setLane('LEFT');

    // Auto-return to CENTER after dodge!
    laneResetTimerRef.current = window.setTimeout(() => {
      setLane('CENTER');
    }, 560);
  }, []);

  const moveRight = useCallback(() => {
    if (stateRef.current.gameState !== 'PLAYING') return;

    if (laneResetTimerRef.current) {
      clearTimeout(laneResetTimerRef.current);
    }

    sounds.playMoveLane('right');
    setLane('RIGHT');

    // Auto-return to CENTER after dodge!
    laneResetTimerRef.current = window.setTimeout(() => {
      setLane('CENTER');
    }, 560);
  }, []);

  const jump = useCallback(() => {
    if (stateRef.current.gameState !== 'PLAYING') return;
    if (verticalState !== 'NORMAL') return;

    if (verticalResetTimerRef.current) clearTimeout(verticalResetTimerRef.current);
    setVerticalState('JUMPING');
    sounds.playJump();

    verticalResetTimerRef.current = window.setTimeout(() => {
      setVerticalState('NORMAL');
    }, 620);
  }, [verticalState]);

  const crouch = useCallback(() => {
    if (stateRef.current.gameState !== 'PLAYING') return;
    if (verticalState !== 'NORMAL') return;

    if (verticalResetTimerRef.current) clearTimeout(verticalResetTimerRef.current);
    setVerticalState('CROUCHING');
    sounds.playCrouch();

    verticalResetTimerRef.current = window.setTimeout(() => {
      setVerticalState('NORMAL');
    }, 600);
  }, [verticalState]);

  // Start a game session (Campaign Level or Endless)
  const startGame = useCallback((level: LevelConfig | null) => {
    setCurrentLevel(level);
    setHealth(3);
    setScore(0);
    setCombo(0);
    setHighestCombo(0);
    setClearedBarriers(0);
    setConsecutiveMistakes(0);
    setIsExploding(false);
    setWasExplosion(false);
    setBarriers([]);
    setParticles([]);
    setShockwaves([]);
    setFloatingTexts([]);
    setLane('CENTER');
    setVerticalState('NORMAL');
    setIsInvulnerable(false);
    setScreenShake(0);
    lastSpawnedTypeRef.current = null;
    lastSpawnTimeRef.current = performance.now() + 800; // grace period
    setGameState('PLAYING');

    // Start background music corresponding to the world or settings
    const songIdToPlay = level ? level.songId : settings.selectedSong;
    sounds.startBeat(songIdToPlay, level?.songBpm);
  }, [settings.selectedSong]);

  const restartCurrentGame = () => {
    startGame(currentLevel);
  };

  const handleNextLevel = () => {
    if (!currentLevel) {
      startGame(LEVELS[0]);
      return;
    }
    const nextLvl = LEVELS.find((l) => l.id === currentLevel.id + 1);
    if (nextLvl) {
      startGame(nextLvl);
    } else {
      setGameState('MENU');
    }
  };

  // Keyboard Event Listeners with Customizable Keybindings
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore OS keyboard auto-repeating to prevent stuttering
      if (e.repeat) return;

      if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
        e.preventDefault();
      }

      const bindings = settings.keyBindings;

      // Pause toggle
      if (bindings?.pause?.includes(e.code)) {
        if (stateRef.current.gameState === 'PLAYING') {
          setGameState('PAUSED');
          sounds.stopBeat();
        } else if (stateRef.current.gameState === 'PAUSED') {
          setGameState('PLAYING');
          sounds.startBeat();
        }
        return;
      }

      if (stateRef.current.gameState !== 'PLAYING') return;

      if (bindings?.moveLeft?.includes(e.code)) {
        moveLeft();
      } else if (bindings?.moveRight?.includes(e.code)) {
        moveRight();
      } else if (bindings?.jump?.includes(e.code)) {
        jump();
      } else if (bindings?.crouch?.includes(e.code)) {
        crouch();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [settings.keyBindings, moveLeft, moveRight, jump, crouch]);

  // Main 3D Game Loop
  useEffect(() => {
    if (gameState !== 'PLAYING') return;

    let animId: number;
    let lastTime = performance.now();

    const loop = (time: number) => {
      const dt = Math.min(50, time - lastTime);
      lastTime = time;

      // 1. Shake decay
      setScreenShake((prev) => Math.max(0, prev - dt * 0.003));

      // 2. Shockwave expansion
      setShockwaves((prev) =>
        prev
          .map((sw) => ({
            ...sw,
            radius: sw.radius + dt * 0.0006,
            alpha: 1 - sw.radius / sw.maxRadius,
          }))
          .filter((sw) => sw.radius < sw.maxRadius && sw.alpha > 0)
      );

      // 3. Floating text animations
      setFloatingTexts((prev) =>
        prev
          .map((ft) => ({
            ...ft,
            y: ft.y + ft.vy,
            alpha: ft.alpha - 0.02,
          }))
          .filter((ft) => ft.alpha > 0)
      );

      // 4. Particle physics
      setParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy + (p.isDebris ? 0.0002 : 0),
            rot: p.rot !== undefined && p.vRot !== undefined ? p.rot + p.vRot : undefined,
            alpha: 1 - p.life / p.maxLife,
            life: p.life + 1,
          }))
          .filter((p) => p.life < p.maxLife)
      );

      // 5. Spawn Approaching Front Obstacles
      const lvl = stateRef.current.currentLevel;
      const totalBarriersInLevel = lvl ? lvl.barrierCount : Infinity;
      const currentCleared = stateRef.current.clearedBarriers;

      const baseInterval = lvl ? lvl.spawnInterval : Math.max(850, 1650 - currentCleared * 15);
      const baseSpeed = lvl ? lvl.baseSpeed : 1.1 + currentCleared * 0.02;

      const activeBarriers = stateRef.current.barriers;
      const spawnedCount = currentCleared + activeBarriers.length;
      const newestBarrier = activeBarriers[activeBarriers.length - 1];

      // Anti-overlap: ensure obstacles do not spawn on top of each other
      const hasEnoughSpacing = !newestBarrier || newestBarrier.progress >= 0.38;

      if (spawnedCount < totalBarriersInLevel && time - lastSpawnTimeRef.current >= baseInterval && hasEnoughSpacing) {
        lastSpawnTimeRef.current = time;

        const allowedTypes: ObstacleType[] = lvl
          ? lvl.allowedTypes
          : ['LANE_LEFT_CENTER', 'LANE_RIGHT_CENTER', 'LOW_HURDLE', 'HIGH_BEAM'];

        // Anti-repetition: never choose the exact same barrier twice in a row if alternatives exist
        let candidateTypes = allowedTypes;
        if (allowedTypes.length > 1 && lastSpawnedTypeRef.current) {
          const nonRepeating = allowedTypes.filter((t) => t !== lastSpawnedTypeRef.current);
          if (nonRepeating.length > 0) {
            candidateTypes = nonRepeating;
          }
        }

        const chosenType = candidateTypes[Math.floor(Math.random() * candidateTypes.length)];
        lastSpawnedTypeRef.current = chosenType;

        let typeLabel = 'ENGEL!';
        if (chosenType === 'LANE_LEFT') typeLabel = 'SAĞA GEÇ!';
        else if (chosenType === 'LANE_RIGHT') typeLabel = 'SOLA GEÇ!';
        else if (chosenType === 'LANE_CENTER') typeLabel = 'SOL/SAĞA GEÇ!';
        else if (chosenType === 'LANE_LEFT_CENTER') typeLabel = 'SAĞ ŞERİT!';
        else if (chosenType === 'LANE_RIGHT_CENTER') typeLabel = 'SOL ŞERİT!';
        else if (chosenType === 'LOW_HURDLE') typeLabel = 'ZIPLA!';
        else if (chosenType === 'HIGH_BEAM') typeLabel = 'EĞİL / KAY!';

        const newBarrier: Barrier = {
          id: barrierIdCounterRef.current++,
          type: chosenType,
          progress: 0.02, // Starts far at the horizon
          speed: baseSpeed * 0.00078,
          hitProcessed: false,
          color: chosenType === 'LOW_HURDLE' ? '#f59e0b' : chosenType === 'HIGH_BEAM' ? '#ec4899' : '#ef4444',
          typeLabel,
        };

        sounds.playWarning();
        setBarriers((prev) => [...prev, newBarrier]);
      }

      // 6. Update Front Obstacles & Evaluate Collision Plane (progress >= 0.88)
      setBarriers((prevBarriers) => {
        const nextBarriers: Barrier[] = [];
        const currentLane = stateRef.current.lane;
        const currentVertical = stateRef.current.verticalState;

        for (const b of prevBarriers) {
          const nextProgress = b.progress + b.speed * dt;

          // Contact window at the player's 3D ground plane (0.88)
          if (!b.hitProcessed && nextProgress >= 0.88) {
            let isSafe = false;

            if (b.type === 'LANE_LEFT') {
              // Safe if player is in CENTER or RIGHT
              isSafe = currentLane !== 'LEFT';
            } else if (b.type === 'LANE_RIGHT') {
              // Safe if player is in LEFT or CENTER
              isSafe = currentLane !== 'RIGHT';
            } else if (b.type === 'LANE_CENTER') {
              // Safe if player is in LEFT or RIGHT
              isSafe = currentLane !== 'CENTER';
            } else if (b.type === 'LANE_LEFT_CENTER') {
              // Safe only if in RIGHT
              isSafe = currentLane === 'RIGHT';
            } else if (b.type === 'LANE_RIGHT_CENTER') {
              // Safe only if in LEFT
              isSafe = currentLane === 'LEFT';
            } else if (b.type === 'LOW_HURDLE') {
              // Safe if jumping in the air
              isSafe = currentVertical === 'JUMPING';
            } else if (b.type === 'HIGH_BEAM') {
              // Safe if crouching/sliding low
              isSafe = currentVertical === 'CROUCHING';
            }

            if (isSafe) {
              // SUCCESSFUL DODGE!
              b.hitProcessed = true;
              const nextCombo = stateRef.current.combo + 1;
              const points = 100 * nextCombo;

              setCombo(nextCombo);
              setHighestCombo((prevH) => Math.max(prevH, nextCombo));
              setScore((prevScore) => prevScore + points);
              setClearedBarriers((prevC) => prevC + 1);

              // Cool down reactor
              setConsecutiveMistakes((prevM) => Math.max(0, prevM - 1));

              sounds.playDodgeSuccess(nextCombo);
              addFloatingText(`+${points} GEÇİŞ!`, '#34d399', 0.5, 0.46);
              addParticleBurst('#34d399', 14);

              // Check Level Clear
              if (lvl && stateRef.current.clearedBarriers + 1 >= lvl.barrierCount) {
                sounds.stopBeat();
                sounds.playLevelClear();
                setGameState('LEVEL_CLEAR');

                const nextUnlocked = Math.max(unlockedLevelId, lvl.id + 1);
                setUnlockedLevelId(nextUnlocked);
                localStorage.setItem('reflex_unlocked_level', String(nextUnlocked));

                const stars = Math.max(1, stateRef.current.health);
                setLevelStars((prevS) => {
                  const updated = { ...prevS, [lvl.id]: Math.max(prevS[lvl.id] || 0, stars) };
                  localStorage.setItem('reflex_stars', JSON.stringify(updated));
                  return updated;
                });

                setLevelHighScores((prevH) => {
                  const updated = {
                    ...prevH,
                    [lvl.id]: Math.max(prevH[lvl.id] || 0, stateRef.current.score + points),
                  };
                  localStorage.setItem('reflex_highscores', JSON.stringify(updated));
                  return updated;
                });

                return [];
              }
            } else {
              // FAILED / HIT COLLISION!
              b.hitProcessed = true;

              if (!stateRef.current.isInvulnerable) {
                const nextMistakes = stateRef.current.consecutiveMistakes + 1;
                setConsecutiveMistakes(nextMistakes);

                // REPEATED MISTAKES (3 ARDIŞIK HATA) -> SUDDEN INSTANT EXPLOSION!
                if (nextMistakes >= maxMistakesBeforeExplosion) {
                  triggerSuddenExplosion();
                  return [];
                }

                // Normal hit
                const nextHealth = stateRef.current.health - 1;
                setHealth(nextHealth);
                setCombo(0);
                if (settings.screenShake) setScreenShake(1.3);

                if (nextMistakes >= 2) {
                  sounds.playWarningSiren();
                  addFloatingText('🚨 KRİTİK ISINMA! 1 HATA DAHA PATLATIR!', '#ef4444', 0.5, 0.44);
                } else {
                  sounds.playHit();
                  addFloatingText('-1 CAN! ÇEKİRDEK ISINDI!', '#f87171', 0.5, 0.5);
                }

                addParticleBurst('#ef4444', 18);

                setIsInvulnerable(true);
                if (invulnerableTimerRef.current) clearTimeout(invulnerableTimerRef.current);
                invulnerableTimerRef.current = window.setTimeout(() => {
                  setIsInvulnerable(false);
                }, 1200);

                if (nextHealth <= 0) {
                  sounds.stopBeat();
                  sounds.playGameOver();
                  setGameState('GAME_OVER');

                  if (!lvl) {
                    const finalScore = stateRef.current.score;
                    if (finalScore > highestEndlessScore) {
                      setHighestEndlessScore(finalScore);
                      localStorage.setItem('reflex_endless_high', String(finalScore));
                    }
                  }
                  return [];
                }
              }
            }
          }

          // Keep barrier until it passes behind the screen (progress 1.25)
          if (nextProgress < 1.25) {
            nextBarriers.push({
              ...b,
              progress: nextProgress,
            });
          }
        }

        return nextBarriers;
      });

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [
    gameState,
    unlockedLevelId,
    highestEndlessScore,
    settings.screenShake,
    triggerSuddenExplosion,
  ]);

  const currentBestScore = currentLevel
    ? levelHighScores[currentLevel.id] || 0
    : highestEndlessScore;

  const bossHpPercent =
    currentLevel?.bossStage
      ? Math.max(0, Math.round(((currentLevel.barrierCount - clearedBarriers) / currentLevel.barrierCount) * 100))
      : undefined;

  const activeSong = sounds.getCurrentSong();

  return (
    <div className="h-screen h-[100dvh] w-full bg-slate-950 text-slate-100 flex flex-col items-center justify-center font-sans select-none antialiased overflow-hidden">
      {/* Viewport content */}
      {gameState === 'MENU' ? (
        <main className="w-full flex-1 min-h-0 flex items-center justify-center p-2 sm:p-4 overflow-hidden">
          <TitleMenu
            onStartCampaign={() => {
              const activeLevel = LEVELS.find((l) => l.id === unlockedLevelId) || LEVELS[0];
              startGame(activeLevel);
            }}
            onOpenLevelSelect={() => setIsLevelSelectOpen(true)}
            onStartEndless={() => startGame(null)}
            onOpenSkins={() => setIsSkinSelectOpen(true)}
            onOpenHowToPlay={() => setIsHowToPlayOpen(true)}
            onOpenReadMe={() => setIsReadMeOpen(true)}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onToggleMute={handleToggleMute}
            isMuted={isMuted}
            unlockedLevelId={unlockedLevelId}
            selectedSkin={selectedSkin}
            totalScore={score}
            highestEndlessScore={highestEndlessScore}
            currentLevel={LEVELS.find((l) => l.id === unlockedLevelId) || LEVELS[0]}
            activeSongTitle={activeSong.name}
          />
        </main>
      ) : (
        <div className="w-full max-w-5xl mx-auto flex flex-col flex-1 h-full min-h-0 overflow-hidden">
          {/* Top HUD */}
          <div className="shrink-0 w-full z-20">
            <GameHud
              score={score}
              combo={combo}
              health={health}
              maxHealth={maxHealth}
              consecutiveMistakes={consecutiveMistakes}
              maxMistakesBeforeExplosion={maxMistakesBeforeExplosion}
              currentLevel={currentLevel}
              clearedBarriers={clearedBarriers}
              totalBarriers={currentLevel ? currentLevel.barrierCount : 0}
              isPaused={gameState === 'PAUSED'}
              isMuted={isMuted}
              activeSongTitle={currentLevel?.songTitle || activeSong.name}
              onTogglePause={() => {
                if (gameState === 'PLAYING') {
                  setGameState('PAUSED');
                  sounds.stopBeat();
                } else if (gameState === 'PAUSED') {
                  setGameState('PLAYING');
                  sounds.startBeat();
                }
              }}
              onToggleMute={handleToggleMute}
              onOpenHowToPlay={() => setIsHowToPlayOpen(true)}
              onOpenReadMe={() => setIsReadMeOpen(true)}
              onOpenSettings={() => setIsSettingsOpen(true)}
              highScore={currentBestScore}
            />
          </div>

          {/* Center 3D Action Canvas with Locked 16:9 Aspect Ratio & Zero Flex Overflow */}
          <div
            ref={canvasContainerRef}
            className="flex-1 w-full min-h-0 min-w-0 p-1 sm:p-2 relative flex items-center justify-center overflow-hidden"
          >
            <div
              className="relative flex items-center justify-center max-w-full max-h-full"
              style={{
                width: canvasDimensions ? `${canvasDimensions.width}px` : '100%',
                height: canvasDimensions ? `${canvasDimensions.height}px` : 'auto',
                aspectRatio: '16 / 9',
              }}
            >
              <GameCanvas
                lane={lane}
                verticalState={verticalState}
                barriers={barriers}
                particles={particles}
                shockwaves={shockwaves}
                floatingTexts={floatingTexts}
                currentSkin={selectedSkin}
                currentLevel={currentLevel}
                isInvulnerable={isInvulnerable}
                screenShake={settings.screenShake ? screenShake : 0}
                isPaused={gameState === 'PAUSED'}
                bossHpPercent={bossHpPercent}
                consecutiveMistakes={consecutiveMistakes}
                isExploding={isExploding}
                enableVisualizer={settings.audioVisualizer}
              />
            </div>
          </div>

          {/* Bottom Responsive 3-Lane Controller Pad */}
          <div className="shrink-0 w-full bg-slate-950/95 border-t border-slate-800/80 z-20">
            <TouchControls
              onMoveLeft={moveLeft}
              onMoveRight={moveRight}
              onJump={jump}
              onCrouch={crouch}
              activeLane={lane}
              activeVertical={verticalState}
              disabled={gameState !== 'PLAYING'}
              keyBindings={settings.keyBindings}
            />
          </div>
        </div>
      )}

      {/* Modals & Overlays */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
      />

      <LevelSelectModal
        isOpen={isLevelSelectOpen}
        onClose={() => setIsLevelSelectOpen(false)}
        onSelectLevel={(level) => startGame(level)}
        unlockedLevelId={unlockedLevelId}
        levelStars={levelStars}
        levelHighScores={levelHighScores}
      />

      <SkinSelectorModal
        isOpen={isSkinSelectOpen}
        onClose={() => setIsSkinSelectOpen(false)}
        selectedSkin={selectedSkin}
        onSelectSkin={(skin) => setSelectedSkin(skin)}
        unlockedLevelId={unlockedLevelId}
        highestEndlessScore={highestEndlessScore}
      />

      <HowToPlayModal
        isOpen={isHowToPlayOpen}
        onClose={() => setIsHowToPlayOpen(false)}
      />

      <ReadMeModal
        isOpen={isReadMeOpen}
        onClose={() => setIsReadMeOpen(false)}
      />

      <OfflineIndicator />

      <PauseModal
        isOpen={gameState === 'PAUSED'}
        onResume={() => {
          setGameState('PLAYING');
          sounds.startBeat();
        }}
        onRestart={restartCurrentGame}
        onMainMenu={() => {
          sounds.stopBeat();
          setGameState('MENU');
        }}
        onOpenReadMe={() => setIsReadMeOpen(true)}
      />

      <LevelClearModal
        isOpen={gameState === 'LEVEL_CLEAR'}
        score={score}
        highestCombo={highestCombo}
        healthRemaining={health}
        maxHealth={maxHealth}
        level={currentLevel}
        onNextLevel={handleNextLevel}
        onReplay={restartCurrentGame}
        onMainMenu={() => {
          sounds.stopBeat();
          setGameState('MENU');
        }}
        hasNextLevel={Boolean(currentLevel && currentLevel.id < LEVELS.length)}
      />

      <GameOverModal
        isOpen={gameState === 'GAME_OVER'}
        score={score}
        highestCombo={highestCombo}
        level={currentLevel}
        onRetry={restartCurrentGame}
        onMainMenu={() => {
          sounds.stopBeat();
          setGameState('MENU');
        }}
        highScore={currentBestScore}
        clearedBarriers={clearedBarriers}
        wasExplosion={wasExplosion}
      />
    </div>
  );
}
