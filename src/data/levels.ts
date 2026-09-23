import { CharacterSkin, LevelConfig, ObstacleType, WorldEnvironment } from '../types/game';
import { SONGS } from '../utils/audio';

export interface WorldInfo {
  id: number;
  name: string;
  subtitle: string;
  themeColor: string;
  environment: WorldEnvironment;
  bgGradient: [string, string];
  songId: string;
  description: string;
}

export const WORLDS: WorldInfo[] = [
  {
    id: 1,
    name: 'Siber Neon Şehri',
    subtitle: 'Dünya 1',
    themeColor: '#06b6d4',
    environment: 'cyber_city',
    bgGradient: ['#0f172a', '#082f49'],
    songId: 'cyber_city',
    description: 'Neon gökdelenler ve otoyollar arasında temel refleks eğitimi.',
  },
  {
    id: 2,
    name: 'Volkanik Lav Çekirdeği',
    subtitle: 'Dünya 2',
    themeColor: '#f97316',
    environment: 'molten_foundry',
    bgGradient: ['#1c1008', '#431407'],
    songId: 'molten_foundry',
    description: 'Kızgın lav nehirleri ve fışkıran magma sütunları.',
  },
  {
    id: 3,
    name: 'Zümrüt Matris',
    subtitle: 'Dünya 3',
    themeColor: '#10b981',
    environment: 'emerald_matrix',
    bgGradient: ['#061a14', '#064e3b'],
    songId: 'emerald_matrix',
    description: 'Dijital veri ormanı ve yeşil şifreli kod yağmurları.',
  },
  {
    id: 4,
    name: 'Kuantum Hiperuzay',
    subtitle: 'Dünya 4',
    themeColor: '#8b5cf6',
    environment: 'quantum_nebula',
    bgGradient: ['#130a2a', '#2e1065'],
    songId: 'quantum_nebula',
    description: 'Derin uzay bulutsusu, parlayan galaksiler ve antimadde geçitleri.',
  },
  {
    id: 5,
    name: 'Güneş Tapınağı',
    subtitle: 'Dünya 5',
    themeColor: '#f59e0b',
    environment: 'solar_citadel',
    bgGradient: ['#231709', '#78350f'],
    songId: 'solar_citadel',
    description: 'Altın kum piramitleri ve parıldayan güneş plazması.',
  },
  {
    id: 6,
    name: 'Buzul Siberkutup',
    subtitle: 'Dünya 6',
    themeColor: '#38bdf8',
    environment: 'cryo_glacier',
    bgGradient: ['#082032', '#0c4a6e'],
    songId: 'cryo_glacier',
    description: 'Donmuş kristal dağlar ve siber kutup auroraları.',
  },
  {
    id: 7,
    name: 'Toksik Reaktör',
    subtitle: 'Dünya 7',
    themeColor: '#84cc16',
    environment: 'toxic_core',
    bgGradient: ['#142008', '#365314'],
    songId: 'toxic_core',
    description: 'Asit fıskiyeleri ve ağır sanayi toksik buhar kirişleri.',
  },
  {
    id: 8,
    name: 'Şimşek Kanyonu',
    subtitle: 'Dünya 8',
    themeColor: '#6366f1',
    environment: 'thunder_canyon',
    bgGradient: ['#111132', '#312e81'],
    songId: 'thunder_canyon',
    description: 'Sürekli şimşek çakan fırtınalı elektrik vadisi.',
  },
  {
    id: 9,
    name: 'Zaman Yarığı',
    subtitle: 'Dünya 9',
    themeColor: '#d946ef',
    environment: 'chrono_rift',
    bgGradient: ['#280b2a', '#701a75'],
    songId: 'chrono_rift',
    description: 'Zamanın büküldüğü ve hızın katlandığı boyut girdapları.',
  },
  {
    id: 10,
    name: 'Kıyamet Çekirdeği (Nihai)',
    subtitle: 'Dünya 10',
    themeColor: '#ef4444',
    environment: 'omega_singularity',
    bgGradient: ['#240909', '#450a0a'],
    songId: 'omega_singularity',
    description: 'Nihai tekillik! Omega Çekirdeği son savunma duvarlarını yağdırıyor.',
  },
];

// Helper to generate 120 rich, calibrated levels (12 per world)
function generate120Levels(): LevelConfig[] {
  const levels: LevelConfig[] = [];
  let globalId = 1;

  WORLDS.forEach((world) => {
    const song = SONGS[world.songId] || SONGS.cyber_city;

    for (let i = 1; i <= 12; i++) {
      const isBoss = i === 12;
      const barrierCount = 12 + (world.id - 1) * 3 + i * 2;
      const baseSpeed = 1.0 + (world.id - 1) * 0.08 + i * 0.035;
      const spawnInterval = Math.max(900, 1850 - (world.id - 1) * 70 - i * 40);

      // Core 4 actions available right from Stage 1:
      // - Sol bariyer (LANE_LEFT_CENTER -> Sağa Kaç!)
      // - Sağ bariyer (LANE_RIGHT_CENTER -> Sola Kaç!)
      // - Alttan engel (LOW_HURDLE -> Zıpla!)
      // - Üstten yukardan inen engel (HIGH_BEAM -> Eğil / Kay!)
      let allowedTypes: ObstacleType[] = [
        'LANE_LEFT_CENTER',
        'LANE_RIGHT_CENTER',
        'LOW_HURDLE',
        'HIGH_BEAM',
      ];

      if (i >= 5 || world.id > 2) {
        allowedTypes.push('LANE_CENTER'); // Orta engel
      }

      let levelName = `${world.name} - Aşama ${i}`;
      let description = `${world.name} parkurunda gelen engellerden kaç!`;

      if (isBoss) {
        const bossTitles = [
          'Siber Gözcü (Boss)',
          'Lav Devi (Boss)',
          'Matris Çekirdeği (Boss)',
          'Kuantum Yutucu (Boss)',
          'Güneş Koruyucusu (Boss)',
          'Buzul Titan (Boss)',
          'Toksik Reaktör Beyni (Boss)',
          'Fırtına Efendisi (Boss)',
          'Zaman Muhafızı (Boss)',
          'NİHAİ OMEGA ÇEKİRDEK (FİNAL BOSS)',
        ];
        levelName = bossTitles[world.id - 1];
        description = `Dünya ${world.id} Boss Savaşı! Çekirdek engellerini ardı ardına fırlatıyor!`;
      }

      levels.push({
        id: globalId,
        worldId: world.id,
        worldName: world.name,
        levelNumberInWorld: i,
        name: levelName,
        chapter: `${world.subtitle} • Bölüm ${i}`,
        description,
        barrierCount,
        baseSpeed,
        spawnInterval,
        allowedTypes,
        themeColor: world.themeColor,
        environment: world.environment,
        bgGradient: world.bgGradient,
        bossStage: isBoss,
        songId: world.songId,
        songTitle: song.name,
        songBpm: song.bpm,
      });

      globalId++;
    }
  });

  return levels;
}

export const LEVELS: LevelConfig[] = generate120Levels();

export const SKINS: CharacterSkin[] = [
  {
    id: 'cyber-cyan',
    name: 'Siber Koşucu',
    title: 'Neon Prototipi',
    primaryColor: '#06b6d4',
    glowColor: '#22d3ee',
    visorColor: '#67e8f9',
    unlockRequirement: 'Başlangıç Karakteri',
    unlockedByDefault: true,
  },
  {
    id: 'blaze-orange',
    name: 'Alev Kıvılcımı',
    title: 'Termal Sürat',
    primaryColor: '#f97316',
    glowColor: '#fb923c',
    visorColor: '#fed7aa',
    unlockRequirement: 'Bölüm 12 (Dünya 1 Boss) Tamamla',
    unlockedByDefault: false,
    minLevelToUnlock: 13,
  },
  {
    id: 'emerald-blade',
    name: 'Zümrüt Hayalet',
    title: 'Gölge Ninja',
    primaryColor: '#10b981',
    glowColor: '#34d399',
    visorColor: '#a7f3d0',
    unlockRequirement: 'Bölüm 24 (Dünya 2 Boss) Tamamla',
    unlockedByDefault: false,
    minLevelToUnlock: 25,
  },
  {
    id: 'quantum-nebula',
    name: 'Kuantum Gezgini',
    title: 'Boyut Kırıcı',
    primaryColor: '#8b5cf6',
    glowColor: '#c084fc',
    visorColor: '#e9d5ff',
    unlockRequirement: 'Bölüm 48 (Dünya 4 Boss) Tamamla',
    unlockedByDefault: false,
    minLevelToUnlock: 49,
  },
  {
    id: 'solar-gold',
    name: 'Güneş Şampiyonu',
    title: 'Işık Efendisi',
    primaryColor: '#f59e0b',
    glowColor: '#fbbf24',
    visorColor: '#fef08a',
    unlockRequirement: 'Bölüm 60 (Dünya 5 Boss) Tamamla',
    unlockedByDefault: false,
    minLevelToUnlock: 61,
  },
  {
    id: 'frost-ice',
    name: 'Buzul Titanyum',
    title: 'Sıfır Derece',
    primaryColor: '#38bdf8',
    glowColor: '#7dd3fc',
    visorColor: '#e0f2fe',
    unlockRequirement: 'Bölüm 72 (Dünya 6 Boss) Tamamla',
    unlockedByDefault: false,
    minLevelToUnlock: 73,
  },
  {
    id: 'omega-god',
    name: 'Kıyamet Tanrısı',
    title: '120. Bölüm Fatihi',
    primaryColor: '#ef4444',
    glowColor: '#f87171',
    visorColor: '#fee2e2',
    unlockRequirement: 'Bölüm 120 Final Boss Tamamla veya 10.000 Puan',
    unlockedByDefault: false,
    minLevelToUnlock: 120,
    minScoreToUnlock: 10000,
  },
];
