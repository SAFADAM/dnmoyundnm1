export type GameState = 'MENU' | 'PLAYING' | 'PAUSED' | 'LEVEL_CLEAR' | 'GAME_OVER';

export type Lane = 'LEFT' | 'CENTER' | 'RIGHT';
export type VerticalState = 'NORMAL' | 'JUMPING' | 'CROUCHING';

// Front-facing 3D Obstacle Target
// Obstacle approaches from the horizon straight down the track towards the player
export type ObstacleType =
  | 'LANE_LEFT'           // Blocks left lane -> Player must be in Center or Right
  | 'LANE_CENTER'         // Blocks center lane -> Player must be in Left or Right
  | 'LANE_RIGHT'          // Blocks right lane -> Player must be in Left or Center
  | 'LANE_LEFT_CENTER'    // Blocks left and center -> Player must be in Right!
  | 'LANE_RIGHT_CENTER'   // Blocks right and center -> Player must be in Left!
  | 'LOW_HURDLE'          // Spans across ground -> Player must JUMP!
  | 'HIGH_BEAM';          // Spans across overhead -> Player must CROUCH / SLIDE!

export interface Barrier {
  id: number;
  type: ObstacleType;
  progress: number; // 0.0 (far at horizon) to 1.0 (at player) to 1.25 (behind player)
  speed: number;
  hitProcessed: boolean;
  color: string;
  typeLabel: string;
  subType?: 'cube' | 'laser' | 'spikes' | 'blade' | 'pillar' | 'fire';
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  alpha: number;
  life: number;
  maxLife: number;
  isDebris?: boolean;
  rot?: number;
  vRot?: number;
}

export interface Shockwave {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  color: string;
  alpha: number;
}

export interface FloatingText {
  id: number;
  text: string;
  x: number;
  y: number;
  color: string;
  alpha: number;
  vy: number;
}

export interface CharacterSkin {
  id: string;
  name: string;
  title: string;
  primaryColor: string;
  glowColor: string;
  visorColor: string;
  unlockRequirement: string;
  unlockedByDefault: boolean;
  minLevelToUnlock?: number;
  minScoreToUnlock?: number;
}

export type WorldEnvironment =
  | 'cyber_city'
  | 'molten_foundry'
  | 'emerald_matrix'
  | 'quantum_nebula'
  | 'solar_citadel'
  | 'cryo_glacier'
  | 'toxic_core'
  | 'thunder_canyon'
  | 'chrono_rift'
  | 'omega_singularity';

export interface LevelConfig {
  id: number;
  worldId: number; // 1 to 10
  worldName: string;
  levelNumberInWorld: number; // 1 to 12
  name: string;
  chapter: string;
  description: string;
  barrierCount: number;
  baseSpeed: number; // barrier speed multiplier
  spawnInterval: number; // ms between barriers
  allowedTypes: ObstacleType[];
  themeColor: string;
  environment: WorldEnvironment;
  bgGradient: [string, string];
  bossStage?: boolean;
  songId: string;
  songTitle: string;
  songBpm: number;
}

export interface KeyBindings {
  moveLeft: string[];   // e.g. ['KeyA', 'ArrowLeft']
  moveRight: string[];  // e.g. ['KeyD', 'ArrowRight']
  jump: string[];       // e.g. ['KeyW', 'ArrowUp', 'Space']
  crouch: string[];     // e.g. ['KeyS', 'ArrowDown']
  pause: string[];      // e.g. ['KeyP', 'Escape']
}

export interface GameSettings {
  masterVolume: number; // 0 to 1
  sfxVolume: number;    // 0 to 1
  musicVolume: number;  // 0 to 1
  selectedSong: string;
  screenShake: boolean;
  particles: boolean;
  audioVisualizer: boolean;
  keyBindings: KeyBindings;
}
