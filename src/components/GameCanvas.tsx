import React, { useEffect, useRef } from 'react';
import { Barrier, CharacterSkin, FloatingText, Lane, LevelConfig, Particle, Shockwave, VerticalState, WorldEnvironment } from '../types/game';
import { sounds } from '../utils/audio';

interface GameCanvasProps {
  lane: Lane;
  verticalState: VerticalState;
  barriers: Barrier[];
  particles: Particle[];
  shockwaves: Shockwave[];
  floatingTexts: FloatingText[];
  currentSkin: CharacterSkin;
  currentLevel: LevelConfig | null;
  isInvulnerable: boolean;
  screenShake: number;
  isPaused: boolean;
  bossHpPercent?: number;
  consecutiveMistakes: number;
  isExploding: boolean;
  enableVisualizer?: boolean;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  lane,
  verticalState,
  barriers,
  particles,
  shockwaves,
  floatingTexts,
  currentSkin,
  currentLevel,
  isInvulnerable,
  screenShake,
  isPaused,
  bossHpPercent,
  consecutiveMistakes,
  isExploding,
  enableVisualizer = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Maintain latest props in a ref to avoid recreating the animation loop every frame
  const propsRef = useRef({
    lane,
    verticalState,
    barriers,
    particles,
    shockwaves,
    floatingTexts,
    currentSkin,
    currentLevel,
    isInvulnerable,
    screenShake,
    bossHpPercent,
    consecutiveMistakes,
    isExploding,
    enableVisualizer,
  });

  useEffect(() => {
    propsRef.current = {
      lane,
      verticalState,
      barriers,
      particles,
      shockwaves,
      floatingTexts,
      currentSkin,
      currentLevel,
      isInvulnerable,
      screenShake,
      bossHpPercent,
      consecutiveMistakes,
      isExploding,
      enableVisualizer,
    };
  });

  // Animated perspective road offset
  const roadScrollRef = useRef<number>(0);
  const playerCurrentXRef = useRef<number>(0.5);
  const playerCurrentYOffsetRef = useRef<number>(0);

  // Environmental and beat timer
  const envTimerRef = useRef<number>(0);
  const beatTimerRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let lastTime = performance.now();

    const render = (time: number) => {
      const dt = Math.min(50, time - lastTime);
      lastTime = time;

      const p = propsRef.current;

      if (!isPaused) {
        roadScrollRef.current = (roadScrollRef.current + dt * 0.0019) % 1;
        envTimerRef.current += dt * 0.001;
        beatTimerRef.current += dt * 0.006;
      }

      // Responsive Canvas Resizing
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const targetW = Math.round(rect.width * dpr);
      const targetH = Math.round(rect.height * dpr);

      if (canvas.width !== targetW || canvas.height !== targetH) {
        canvas.width = targetW;
        canvas.height = targetH;
      }

      // CRITICAL FIX: Always clear full canvas buffer before rendering the new frame
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      ctx.scale(dpr, dpr);

      const width = rect.width;
      const height = rect.height;

      // Solid canvas fill to prevent any ghosting or bleeding from previous frames
      ctx.fillStyle = '#05070e';
      ctx.fillRect(0, 0, width, height);

      // Screen Shake translation
      if (p.screenShake > 0) {
        const shakeMag = p.screenShake * 9;
        const ox = (Math.random() - 0.5) * shakeMag;
        const oy = (Math.random() - 0.5) * shakeMag;
        ctx.translate(ox, oy);
      }

      const env: WorldEnvironment = p.currentLevel?.environment || 'cyber_city';
      const themeColor = p.currentLevel?.themeColor || '#06b6d4';

      // 1. VANISHING POINT & HIGHWAY GEOMETRY
      const vpX = width * 0.5;
      const vpY = height * 0.38;
      const groundBaseY = height * 0.88;
      const roadBaseHalfWidth = width * 0.44;
      const laneWidthAtBase = (roadBaseHalfWidth * 2) / 3;

      // 2. FNF-STYLED ENVIRONMENT BACKGROUND
      drawEnvironmentBackground(ctx, width, height, vpX, vpY, env, themeColor, envTimerRef.current);

      // 3. AUDIO SPECTRUM VISUALIZER
      if (p.enableVisualizer) {
        drawAudioVisualizer(ctx, width, vpY, themeColor);
      }

      // 4. 3D ROAD WITH 3 LANES
      drawPerspectiveRoad(ctx, width, height, vpX, vpY, groundBaseY, roadBaseHalfWidth, roadScrollRef.current, themeColor);

      // 5. SORT & DRAW APPROACHING FRONT OBSTACLES
      const sortedBarriers = [...p.barriers].sort((a, b) => a.progress - b.progress);

      for (const barrier of sortedBarriers) {
        drawFrontObstacle(ctx, barrier, vpX, vpY, groundBaseY, roadBaseHalfWidth, laneWidthAtBase, themeColor, height);
      }

      // 6. PLAYER SMOOTH INTERPOLATION & BEAUTIFUL CARTOON CHARACTER
      let targetLaneIndex = 0; // CENTER is default
      if (p.lane === 'LEFT') targetLaneIndex = -1;
      else if (p.lane === 'RIGHT') targetLaneIndex = 1;

      const targetPlayerX = vpX + targetLaneIndex * laneWidthAtBase;
      playerCurrentXRef.current += (targetPlayerX - playerCurrentXRef.current) * Math.min(1, dt * 0.022);

      let targetYOffset = 0;
      if (p.verticalState === 'JUMPING') {
        targetYOffset = -70; // High leap in air
      } else if (p.verticalState === 'CROUCHING') {
        targetYOffset = 22; // Low duck / slide on ground
      }
      playerCurrentYOffsetRef.current += (targetYOffset - playerCurrentYOffsetRef.current) * Math.min(1, dt * 0.025);

      const playerX = playerCurrentXRef.current;
      const playerGroundY = groundBaseY - 14;
      const playerY = playerGroundY + playerCurrentYOffsetRef.current;

      if (!p.isExploding) {
        drawFNFPlayerCharacter(
          ctx,
          playerX,
          playerY,
          playerGroundY,
          p.lane,
          p.verticalState,
          p.currentSkin,
          p.isInvulnerable,
          p.consecutiveMistakes,
          beatTimerRef.current
        );
      }

      // 7. PARTICLES & SHOCKWAVES
      drawParticles(ctx, p.particles, width, height);
      drawShockwaves(ctx, p.shockwaves, width, height);

      // 8. OVERHEAT VIGNETTE
      if (p.consecutiveMistakes > 0) {
        drawOverheatVignette(ctx, width, height, p.consecutiveMistakes);
      }

      // 9. BOSS HP BAR (If boss stage)
      if (p.currentLevel?.bossStage && p.bossHpPercent !== undefined) {
        drawBossHpBar(ctx, width, p.currentLevel.name, p.bossHpPercent);
      }

      // 10. FLOATING POPUP TEXTS
      drawFloatingTexts(ctx, p.floatingTexts, width, height);

      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [isPaused]);

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-3xl border-4 border-black bg-slate-950 fnf-box-shadow">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
};

// -------------------------------------------------------------
// ENVIRONMENT BACKGROUND (10 WORLDS)
// -------------------------------------------------------------
function drawEnvironmentBackground(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  vpX: number,
  vpY: number,
  env: WorldEnvironment,
  themeColor: string,
  time: number
) {
  const skyGrad = ctx.createLinearGradient(0, 0, 0, vpY);
  switch (env) {
    case 'molten_foundry':
      skyGrad.addColorStop(0, '#2d0904');
      skyGrad.addColorStop(0.7, '#6b1c09');
      skyGrad.addColorStop(1, '#9a3412');
      break;
    case 'emerald_matrix':
      skyGrad.addColorStop(0, '#04170e');
      skyGrad.addColorStop(0.7, '#065f46');
      skyGrad.addColorStop(1, '#022c22');
      break;
    case 'quantum_nebula':
      skyGrad.addColorStop(0, '#100624');
      skyGrad.addColorStop(0.7, '#3b0764');
      skyGrad.addColorStop(1, '#581c87');
      break;
    case 'solar_citadel':
      skyGrad.addColorStop(0, '#241402');
      skyGrad.addColorStop(0.7, '#854d0e');
      skyGrad.addColorStop(1, '#ca8a04');
      break;
    case 'cryo_glacier':
      skyGrad.addColorStop(0, '#041829');
      skyGrad.addColorStop(0.7, '#075985');
      skyGrad.addColorStop(1, '#0284c7');
      break;
    case 'toxic_core':
      skyGrad.addColorStop(0, '#111b03');
      skyGrad.addColorStop(0.7, '#3f6212');
      skyGrad.addColorStop(1, '#65a30d');
      break;
    case 'thunder_canyon':
      skyGrad.addColorStop(0, '#0b0b2b');
      skyGrad.addColorStop(0.7, '#3730a3');
      skyGrad.addColorStop(1, '#4338ca');
      break;
    case 'chrono_rift':
      skyGrad.addColorStop(0, '#220426');
      skyGrad.addColorStop(0.7, '#86198f');
      skyGrad.addColorStop(1, '#a21caf');
      break;
    case 'omega_singularity':
      skyGrad.addColorStop(0, '#1c0303');
      skyGrad.addColorStop(0.7, '#580808');
      skyGrad.addColorStop(1, '#991b1b');
      break;
    case 'cyber_city':
    default:
      skyGrad.addColorStop(0, '#070b14');
      skyGrad.addColorStop(0.7, '#0f172a');
      skyGrad.addColorStop(1, '#0369a1');
      break;
  }

  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, width, vpY);

  // Ground area from horizon down to bottom (behind road)
  const groundGrad = ctx.createLinearGradient(0, vpY, 0, height);
  groundGrad.addColorStop(0, '#060a14');
  groundGrad.addColorStop(1, '#020307');
  ctx.fillStyle = groundGrad;
  ctx.fillRect(0, vpY, width, height - vpY);

  // Distant city silhouette / stylized mountains
  const bWidth = 32;
  const bCount = Math.ceil(width / bWidth) + 1;
  ctx.fillStyle = '#05070e';
  for (let i = 0; i < bCount; i++) {
    const bh = 25 + ((i * 23 + 11) % 65);
    const bx = i * bWidth;
    const by = vpY - bh;
    ctx.fillRect(bx, by, bWidth - 2, bh);

    // Glowing window dots
    ctx.fillStyle = i % 3 === 0 ? themeColor : '#f43f5e';
    ctx.fillRect(bx + 6, by + 10, 3, 5);
    ctx.fillRect(bx + 16, by + 22, 3, 5);
    ctx.fillStyle = '#05070e';
  }

  // Horizon Neon Line
  ctx.strokeStyle = themeColor;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, vpY);
  ctx.lineTo(width, vpY);
  ctx.stroke();
}

// -------------------------------------------------------------
// AUDIO VISUALIZER
// -------------------------------------------------------------
function drawAudioVisualizer(ctx: CanvasRenderingContext2D, width: number, vpY: number, themeColor: string) {
  const levels = sounds.audioVisualizerLevels;
  const barW = 6;
  const spacing = 4;
  const totalW = levels.length * (barW + spacing);
  const startX = width * 0.5 - totalW * 0.5;

  ctx.save();
  for (let i = 0; i < levels.length; i++) {
    const barH = levels[i] * 32;
    const bx = startX + i * (barW + spacing);
    const by = vpY - barH - 2;

    ctx.fillStyle = i % 2 === 0 ? themeColor : '#f43f5e';
    ctx.fillRect(bx, by, barW, barH);
  }
  ctx.restore();
}

// -------------------------------------------------------------
// 3D PERSPECTIVE HIGHWAY ROAD
// -------------------------------------------------------------
function drawPerspectiveRoad(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  vpX: number,
  vpY: number,
  groundBaseY: number,
  roadBaseHalfWidth: number,
  roadScroll: number,
  themeColor: string
) {
  // Road surface
  const roadLeftAtBase = vpX - roadBaseHalfWidth;
  const roadRightAtBase = vpX + roadBaseHalfWidth;
  const roadHalfWidthAtHorizon = 22;

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(vpX - roadHalfWidthAtHorizon, vpY);
  ctx.lineTo(vpX + roadHalfWidthAtHorizon, vpY);
  ctx.lineTo(roadRightAtBase, groundBaseY);
  ctx.lineTo(roadLeftAtBase, groundBaseY);
  ctx.closePath();

  const roadGrad = ctx.createLinearGradient(0, vpY, 0, groundBaseY);
  roadGrad.addColorStop(0, '#0a0f1d');
  roadGrad.addColorStop(1, '#0e1726');
  ctx.fillStyle = roadGrad;
  ctx.fill();

  // Curbs
  ctx.strokeStyle = themeColor;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(vpX - roadHalfWidthAtHorizon, vpY);
  ctx.lineTo(roadLeftAtBase, groundBaseY);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(vpX + roadHalfWidthAtHorizon, vpY);
  ctx.lineTo(roadRightAtBase, groundBaseY);
  ctx.stroke();

  // 2 Lane Dividers (Dividing road into Sol, Orta, Sağ)
  const laneRatios = [-1 / 3, 1 / 3];
  laneRatios.forEach((ratio) => {
    ctx.strokeStyle = '#38bdf888';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(vpX + ratio * roadHalfWidthAtHorizon, vpY);
    ctx.lineTo(vpX + ratio * roadBaseHalfWidth, groundBaseY);
    ctx.stroke();
  });

  // Animated Speed Rings
  ctx.strokeStyle = '#ffffff25';
  ctx.lineWidth = 2.5;
  const countRings = 12;

  for (let i = 0; i < countRings; i++) {
    const rawP = ((i / countRings) + roadScroll) % 1;
    const curveP = Math.pow(rawP, 2.2);

    const curY = vpY + (groundBaseY - vpY) * curveP;
    const curHalfW = roadHalfWidthAtHorizon + (roadBaseHalfWidth - roadHalfWidthAtHorizon) * curveP;

    ctx.beginPath();
    ctx.moveTo(vpX - curHalfW, curY);
    ctx.lineTo(vpX + curHalfW, curY);
    ctx.stroke();
  }

  ctx.restore();

  // Bottom Lane Tags (SOL • ORTA • SAĞ)
  ctx.save();
  ctx.font = 'bold 11px monospace';
  ctx.textAlign = 'center';
  ctx.fillStyle = '#64748b';
  const laneW = (roadBaseHalfWidth * 2) / 3;
  ctx.fillText('SOL ŞERİT', vpX - laneW, groundBaseY + 18);
  ctx.fillText('ORTA ŞERİT', vpX, groundBaseY + 18);
  ctx.fillText('SAĞ ŞERİT', vpX + laneW, groundBaseY + 18);
  ctx.restore();
}

// -------------------------------------------------------------
// FRONT-FACING 3D OBSTACLES
// -------------------------------------------------------------
function drawFrontObstacle(
  ctx: CanvasRenderingContext2D,
  barrier: Barrier,
  vpX: number,
  vpY: number,
  groundBaseY: number,
  roadBaseHalfWidth: number,
  laneWidthAtBase: number,
  themeColor: string,
  totalHeight: number
) {
  const p = barrier.progress;
  if (p < 0.02 || p > 1.25) return;

  const scale = Math.pow(p, 1.85); // 0 at horizon, 1.0 at player plane
  const currY = vpY + (groundBaseY - vpY) * scale;
  const currentLaneW = laneWidthAtBase * scale;

  ctx.save();

  // 1. ALTTAN ENGEL (LOW_HURDLE -> ZIPLA!)
  if (barrier.type === 'LOW_HURDLE') {
    drawLowHurdle(ctx, vpX, currY, roadBaseHalfWidth * scale, scale, barrier.hitProcessed);
  }
  // 2. ÜSTTEN YUKARIDAN İNEN ENGEL (HIGH_BEAM -> EĞİL / KAY!)
  else if (barrier.type === 'HIGH_BEAM') {
    // User requested: "eğilmek gerekince yukardan gelsin"
    // Starts high up in the sky, sweeps down towards character head height!
    drawOverheadDescendingBeam(ctx, vpX, vpY, currY, roadBaseHalfWidth * scale, scale, barrier.hitProcessed);
  }
  // 3. SOL BARİYER GELİNCE ORTAYI DA KAPSASIN, BOŞ YER SADECE SAĞDA KALSIN!
  else if (barrier.type === 'LANE_LEFT_CENTER') {
    drawLeftAndCenterBarrier(ctx, vpX, currY, currentLaneW, scale, barrier.hitProcessed);
  }
  // 4. SAĞ BARİYER GELİNCE ORTAYI DA KAPSASIN, BOŞ YER SADECE SOLDA KALSIN!
  else if (barrier.type === 'LANE_RIGHT_CENTER') {
    drawRightAndCenterBarrier(ctx, vpX, currY, currentLaneW, scale, barrier.hitProcessed);
  }
  // 5. ORTA TEK ENGEL (Center block)
  else {
    drawSingleCenterBarrier(ctx, vpX, currY, currentLaneW, scale, barrier.hitProcessed);
  }

  ctx.restore();
}

// 1. LOW HURDLE (ALTTAN GELEN ENGEL -> ZIPLA!)
function drawLowHurdle(
  ctx: CanvasRenderingContext2D,
  vpX: number,
  currY: number,
  halfRoadW: number,
  scale: number,
  hitProcessed: boolean
) {
  const hurdleH = Math.max(10, 32 * scale);
  const leftX = vpX - halfRoadW;
  const rightX = vpX + halfRoadW;

  ctx.fillStyle = hitProcessed ? '#475569' : '#f59e0b';
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = Math.max(2, 4 * scale);

  // Hurdle bar
  ctx.fillRect(leftX, currY - hurdleH, halfRoadW * 2, hurdleH);
  ctx.strokeRect(leftX, currY - hurdleH, halfRoadW * 2, hurdleH);

  // Hazard diagonal stripes
  ctx.fillStyle = '#000000';
  const stripeW = Math.max(8, 20 * scale);
  for (let sx = leftX; sx < rightX; sx += stripeW * 2) {
    ctx.beginPath();
    ctx.moveTo(sx, currY);
    ctx.lineTo(sx + stripeW, currY - hurdleH);
    ctx.lineTo(sx + stripeW * 1.5, currY - hurdleH);
    ctx.lineTo(sx + stripeW * 0.5, currY);
    ctx.fill();
  }

  // Floating FNF Warning
  if (scale > 0.28) {
    ctx.fillStyle = '#fef08a';
    ctx.font = `bold ${Math.max(12, Math.round(18 * scale))}px 'Luckiest Guy', cursive, sans-serif`;
    ctx.textAlign = 'center';
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#000';
    ctx.strokeText('⬆️ ZIPLA! (W)', vpX, currY - hurdleH - 10 * scale);
    ctx.fillText('⬆️ ZIPLA! (W)', vpX, currY - hurdleH - 10 * scale);
  }
}

// 2. OVERHEAD DESCENDING BEAM (ÜSTTEN YUKARIDAN İNEN ENGEL -> EĞİL / KAY!)
function drawOverheadDescendingBeam(
  ctx: CanvasRenderingContext2D,
  vpX: number,
  vpY: number,
  currY: number,
  halfRoadW: number,
  scale: number,
  hitProcessed: boolean
) {
  // Swoops down from the upper sky / ceiling directly down to head height
  const skyOriginY = vpY * 0.3; // Starts high in sky
  const targetHeadY = currY - Math.max(38, 98 * scale);
  const interpolatedY = skyOriginY + (targetHeadY - skyOriginY) * Math.min(1, scale * 1.15);

  const beamH = Math.max(14, 38 * scale);
  const leftX = vpX - halfRoadW;

  // Giant guillotine / plasma blade
  const grad = ctx.createLinearGradient(leftX, interpolatedY, leftX, interpolatedY + beamH);
  grad.addColorStop(0, '#f43f5e');
  grad.addColorStop(0.5, '#fbcfe8');
  grad.addColorStop(1, '#db2777');
  ctx.fillStyle = hitProcessed ? '#475569' : grad;

  ctx.strokeStyle = '#000000';
  ctx.lineWidth = Math.max(2, 4 * scale);

  ctx.fillRect(leftX, interpolatedY, halfRoadW * 2, beamH);
  ctx.strokeRect(leftX, interpolatedY, halfRoadW * 2, beamH);

  // Overhead chain suspension cables
  ctx.strokeStyle = '#64748b';
  ctx.lineWidth = Math.max(1, 2 * scale);
  ctx.beginPath();
  ctx.moveTo(leftX + 20 * scale, 0);
  ctx.lineTo(leftX + 20 * scale, interpolatedY);
  ctx.moveTo(vpX + halfRoadW - 20 * scale, 0);
  ctx.lineTo(vpX + halfRoadW - 20 * scale, interpolatedY);
  ctx.stroke();

  // Floating FNF Warning
  if (scale > 0.28) {
    ctx.fillStyle = '#f472b6';
    ctx.font = `bold ${Math.max(12, Math.round(18 * scale))}px 'Luckiest Guy', cursive, sans-serif`;
    ctx.textAlign = 'center';
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#000';
    ctx.strokeText('⬇️ EĞİL / KAY! (S)', vpX, interpolatedY - 10 * scale);
    ctx.fillText('⬇️ EĞİL / KAY! (S)', vpX, interpolatedY - 10 * scale);
  }
}

// 3. SOL BARİYER (SOL + ORTAYI KAPLAR, BOŞ YER SADECE SAĞDA!)
function drawLeftAndCenterBarrier(
  ctx: CanvasRenderingContext2D,
  vpX: number,
  currY: number,
  currentLaneW: number,
  scale: number,
  hitProcessed: boolean
) {
  // Spans Left lane (-1) to Center lane (0)
  const leftX = vpX - currentLaneW * 1.5;
  const blockW = currentLaneW * 2.0; // Covers both Left and Center!
  const blockH = Math.max(24, 75 * scale);
  const by = currY - blockH;

  ctx.fillStyle = hitProcessed ? '#334155' : '#ef4444';
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = Math.max(2, 4 * scale);

  // Front face
  ctx.fillRect(leftX, by, blockW, blockH);
  ctx.strokeRect(leftX, by, blockW, blockH);

  // Top 3D face
  const topDepth = Math.max(6, 20 * scale);
  ctx.fillStyle = hitProcessed ? '#1e293b' : '#b91c1c';
  ctx.beginPath();
  ctx.moveTo(leftX, by);
  ctx.lineTo(leftX + 8 * scale, by - topDepth);
  ctx.lineTo(leftX + blockW + 8 * scale, by - topDepth);
  ctx.lineTo(leftX + blockW, by);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Crossed hazard warning
  ctx.strokeStyle = '#ffffffaa';
  ctx.lineWidth = Math.max(1.5, 3 * scale);
  ctx.beginPath();
  ctx.moveTo(leftX + 6 * scale, by + 6 * scale);
  ctx.lineTo(leftX + blockW - 6 * scale, by + blockH - 6 * scale);
  ctx.stroke();

  // Floating FNF telegraph sign: Boş yer sadece sağda!
  if (scale > 0.26) {
    ctx.fillStyle = '#22d3ee';
    ctx.font = `bold ${Math.max(11, Math.round(17 * scale))}px 'Luckiest Guy', cursive, sans-serif`;
    ctx.textAlign = 'center';
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#000';
    ctx.strokeText('➡️ SAĞA KAÇ!', leftX + blockW * 0.5, by - topDepth - 8 * scale);
    ctx.fillText('➡️ SAĞA KAÇ!', leftX + blockW * 0.5, by - topDepth - 8 * scale);
  }
}

// 4. SAĞ BARİYER (SAĞ + ORTAYI KAPLAR, BOŞ YER SADECE SOLDA!)
function drawRightAndCenterBarrier(
  ctx: CanvasRenderingContext2D,
  vpX: number,
  currY: number,
  currentLaneW: number,
  scale: number,
  hitProcessed: boolean
) {
  // Spans Center lane (0) to Right lane (+1)
  const leftX = vpX - currentLaneW * 0.5;
  const blockW = currentLaneW * 2.0; // Covers both Right and Center!
  const blockH = Math.max(24, 75 * scale);
  const by = currY - blockH;

  ctx.fillStyle = hitProcessed ? '#334155' : '#ef4444';
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = Math.max(2, 4 * scale);

  // Front face
  ctx.fillRect(leftX, by, blockW, blockH);
  ctx.strokeRect(leftX, by, blockW, blockH);

  // Top 3D face
  const topDepth = Math.max(6, 20 * scale);
  ctx.fillStyle = hitProcessed ? '#1e293b' : '#b91c1c';
  ctx.beginPath();
  ctx.moveTo(leftX, by);
  ctx.lineTo(leftX + 8 * scale, by - topDepth);
  ctx.lineTo(leftX + blockW + 8 * scale, by - topDepth);
  ctx.lineTo(leftX + blockW, by);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Crossed hazard warning
  ctx.strokeStyle = '#ffffffaa';
  ctx.lineWidth = Math.max(1.5, 3 * scale);
  ctx.beginPath();
  ctx.moveTo(leftX + 6 * scale, by + 6 * scale);
  ctx.lineTo(leftX + blockW - 6 * scale, by + blockH - 6 * scale);
  ctx.stroke();

  // Floating FNF telegraph sign: Boş yer sadece solda!
  if (scale > 0.26) {
    ctx.fillStyle = '#22d3ee';
    ctx.font = `bold ${Math.max(11, Math.round(17 * scale))}px 'Luckiest Guy', cursive, sans-serif`;
    ctx.textAlign = 'center';
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#000';
    ctx.strokeText('⬅️ SOLA KAÇ!', leftX + blockW * 0.5, by - topDepth - 8 * scale);
    ctx.fillText('⬅️ SOLA KAÇ!', leftX + blockW * 0.5, by - topDepth - 8 * scale);
  }
}

// 5. SINGLE CENTER BARRIER
function drawSingleCenterBarrier(
  ctx: CanvasRenderingContext2D,
  vpX: number,
  currY: number,
  currentLaneW: number,
  scale: number,
  hitProcessed: boolean
) {
  const blockW = currentLaneW * 0.88;
  const blockH = Math.max(20, 65 * scale);
  const bx = vpX - blockW * 0.5;
  const by = currY - blockH;

  ctx.fillStyle = hitProcessed ? '#334155' : '#ef4444';
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = Math.max(2, 3.5 * scale);
  ctx.fillRect(bx, by, blockW, blockH);
  ctx.strokeRect(bx, by, blockW, blockH);

  if (scale > 0.28) {
    ctx.fillStyle = '#fde047';
    ctx.font = `bold ${Math.max(11, Math.round(16 * scale))}px 'Luckiest Guy', cursive, sans-serif`;
    ctx.textAlign = 'center';
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#000';
    ctx.strokeText('⬅️ SOL / SAĞA KAÇ ➡️', vpX, by - 8 * scale);
    ctx.fillText('⬅️ SOL / SAĞA KAÇ ➡️', vpX, by - 8 * scale);
  }
}

// -------------------------------------------------------------
// BEAUTIFUL EXPRESSIVE FNF CARTOON CHARACTER (BOYFRIEND STYLE)
// -------------------------------------------------------------
function drawFNFPlayerCharacter(
  ctx: CanvasRenderingContext2D,
  px: number,
  py: number,
  groundY: number,
  lane: Lane,
  vState: VerticalState,
  skin: CharacterSkin,
  isInvulnerable: boolean,
  mistakes: number,
  beatTime: number
) {
  ctx.save();

  // Invulnerability flashing
  if (isInvulnerable && Math.floor(beatTime * 15) % 2 === 0) {
    ctx.globalAlpha = 0.4;
  }

  const isJumping = vState === 'JUMPING';
  const isCrouching = vState === 'CROUCHING';

  // Beat bop bounce animation
  const bopY = isJumping || isCrouching ? 0 : Math.sin(beatTime * 6) * 3;
  const currentY = py + bopY;

  // Ground Shadow
  const shadowScale = isJumping ? 0.5 : isCrouching ? 1.2 : 1.0;
  ctx.fillStyle = '#00000088';
  ctx.beginPath();
  ctx.ellipse(px, groundY, 26 * shadowScale, 8 * shadowScale, 0, 0, Math.PI * 2);
  ctx.fill();

  // Action Dash Smear Lines (when dodging left or right)
  if (lane === 'LEFT') {
    ctx.strokeStyle = '#06b6d488';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(px + 28, currentY - 20);
    ctx.lineTo(px + 55, currentY - 20);
    ctx.stroke();
  } else if (lane === 'RIGHT') {
    ctx.strokeStyle = '#06b6d488';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(px - 28, currentY - 20);
    ctx.lineTo(px - 55, currentY - 20);
    ctx.stroke();
  }

  // Rocket Thruster Fire when jumping
  if (isJumping) {
    ctx.fillStyle = '#06b6d4';
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(px - 14, currentY + 12);
    ctx.lineTo(px, currentY + 36 + Math.random() * 8);
    ctx.lineTo(px + 14, currentY + 12);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  // Ground friction sparks when crouching / sliding
  if (isCrouching) {
    ctx.fillStyle = '#f59e0b';
    for (let i = 0; i < 5; i++) {
      const spx = px + (Math.random() - 0.5) * 45;
      const spy = groundY - Math.random() * 8;
      ctx.fillRect(spx, spy, 4, 4);
    }
  }

  // FNF Character Body & Cap Dimensions
  ctx.save();
  ctx.translate(px, currentY);

  // Slight tilt when dodging
  if (lane === 'LEFT') ctx.rotate(-0.08);
  if (lane === 'RIGHT') ctx.rotate(0.08);

  // Character dimensions
  const charW = isCrouching ? 44 : 36;
  const charH = isCrouching ? 28 : 52;

  // 1. Chunky FNF Sneakers
  ctx.fillStyle = '#ef4444';
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 4;

  if (isCrouching) {
    // Sliding feet forward
    ctx.beginPath();
    ctx.ellipse(-16, 4, 18, 10, -0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.ellipse(16, 4, 18, 10, 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  } else {
    // Normal sneakers
    ctx.beginPath();
    ctx.ellipse(-14, 4, 15, 9, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.ellipse(14, 4, 15, 9, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  // 2. Torso / Jacket (Skin Color)
  ctx.fillStyle = skin.primaryColor;
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 4;
  ctx.beginPath();
  if (isCrouching) {
    ctx.roundRect(-charW * 0.5, -charH, charW, charH, [10, 10, 6, 6]);
  } else {
    ctx.roundRect(-charW * 0.5, -charH + 6, charW, charH - 8, [12, 12, 6, 6]);
  }
  ctx.fill();
  ctx.stroke();

  // FNF Forbidden / Cyber Symbol on Chest
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(0, isCrouching ? -charH * 0.5 : -charH * 0.45, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // 3. Spiky Cyan/Anime Hair (Pokes out from under cap)
  ctx.fillStyle = skin.visorColor;
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  const headTopY = isCrouching ? -charH - 8 : -charH - 14;
  ctx.moveTo(-18, headTopY + 8);
  ctx.lineTo(-28, headTopY);
  ctx.lineTo(-14, headTopY + 4);
  ctx.lineTo(-24, headTopY + 14);
  ctx.lineTo(-12, headTopY + 12);
  ctx.fill();
  ctx.stroke();

  // 4. Backward FNF Baseball Cap / Visor Helmet
  ctx.fillStyle = skin.glowColor;
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 4;

  // Cap Dome
  ctx.beginPath();
  ctx.arc(0, headTopY, 18, Math.PI, 0, false);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Cap Brim pointing backwards
  ctx.fillStyle = '#000000';
  ctx.beginPath();
  ctx.moveTo(12, headTopY + 2);
  ctx.lineTo(28, headTopY - 4);
  ctx.lineTo(16, headTopY + 8);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // 5. Expressive Cartoon Visor / Face
  ctx.fillStyle = '#fef08a';
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(-12, headTopY + 2, 24, 12, [3, 3, 6, 6]);
  ctx.fill();
  ctx.stroke();

  // Expressive Eyes (X_X if mistakes > 0, confident anime eyes otherwise)
  if (mistakes > 0) {
    // Stunned X eyes
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2.5;
    // Left eye X
    ctx.beginPath();
    ctx.moveTo(-8, headTopY + 5);
    ctx.lineTo(-4, headTopY + 10);
    ctx.moveTo(-4, headTopY + 5);
    ctx.lineTo(-8, headTopY + 10);
    // Right eye X
    ctx.moveTo(4, headTopY + 5);
    ctx.lineTo(8, headTopY + 10);
    ctx.moveTo(8, headTopY + 5);
    ctx.lineTo(4, headTopY + 10);
    ctx.stroke();
  } else {
    // Confident cartoon eyes
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(-6, headTopY + 8, 2.5, 0, Math.PI * 2);
    ctx.arc(6, headTopY + 8, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }

  // 6. Microphone in Hand (FNF Signature Item)
  ctx.fillStyle = '#94a3b8';
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 3;
  const micX = lane === 'LEFT' ? -22 : 22;
  const micY = -charH * 0.4;
  ctx.beginPath();
  ctx.arc(micX, micY - 6, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.fillRect(micX - 3, micY - 2, 6, 12);
  ctx.strokeRect(micX - 3, micY - 2, 6, 12);

  ctx.restore();
  ctx.restore();
}

// -------------------------------------------------------------
// OVERHEAT DANGER VIGNETTE
// -------------------------------------------------------------
function drawOverheatVignette(ctx: CanvasRenderingContext2D, width: number, height: number, mistakes: number) {
  ctx.save();
  const vGrad = ctx.createRadialGradient(width * 0.5, height * 0.5, width * 0.3, width * 0.5, height * 0.5, width * 0.7);
  if (mistakes >= 2) {
    vGrad.addColorStop(0, 'transparent');
    vGrad.addColorStop(1, '#ef444466');
  } else {
    vGrad.addColorStop(0, 'transparent');
    vGrad.addColorStop(1, '#f59e0b33');
  }
  ctx.fillStyle = vGrad;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();
}

// -------------------------------------------------------------
// BOSS HEALTH BAR
// -------------------------------------------------------------
function drawBossHpBar(ctx: CanvasRenderingContext2D, width: number, bossName: string, hpPercent: number) {
  ctx.save();
  const barW = Math.min(360, width * 0.75);
  const barH = 16;
  const bx = (width - barW) * 0.5;
  const by = 16;

  ctx.fillStyle = '#000000';
  ctx.fillRect(bx, by, barW, barH);
  ctx.strokeStyle = '#f43f5e';
  ctx.lineWidth = 3;
  ctx.strokeRect(bx, by, barW, barH);

  const fillW = (barW * hpPercent) / 100;
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(bx + 1, by + 1, fillW, barH - 2);

  ctx.font = "bold 11px 'Press Start 2P', monospace";
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.fillText(`⚔️ ${bossName.toUpperCase()} • %${hpPercent}`, width * 0.5, by - 5);
  ctx.restore();
}

// -------------------------------------------------------------
// PARTICLES & SHOCKWAVES & FLOATING TEXTS
// -------------------------------------------------------------
function drawParticles(ctx: CanvasRenderingContext2D, particles: Particle[], width: number, height: number) {
  ctx.save();
  for (const p of particles) {
    ctx.globalAlpha = Math.max(0, Math.min(1, p.alpha));
    ctx.fillStyle = p.color;

    const px = p.x <= 1 ? p.x * width : p.x;
    const py = p.y <= 1 ? p.y * height : p.y;

    if (p.isDebris) {
      ctx.save();
      ctx.translate(px, py);
      if (p.rot) ctx.rotate(p.rot);
      ctx.fillRect(-p.size * 0.5, -p.size * 0.5, p.size, p.size);
      ctx.restore();
    } else {
      ctx.beginPath();
      ctx.arc(px, py, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();
}

function drawShockwaves(ctx: CanvasRenderingContext2D, shockwaves: Shockwave[], width: number, height: number) {
  ctx.save();
  for (const sw of shockwaves) {
    ctx.globalAlpha = Math.max(0, Math.min(1, sw.alpha));
    ctx.strokeStyle = sw.color;
    ctx.lineWidth = 4;
    const sx = sw.x <= 1 ? sw.x * width : sw.x;
    const sy = sw.y <= 1 ? sw.y * height : sw.y;
    const sr = sw.radius <= 1 ? sw.radius * Math.min(width, height) : sw.radius;
    ctx.beginPath();
    ctx.arc(sx, sy, sr, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();
}

function drawFloatingTexts(ctx: CanvasRenderingContext2D, texts: FloatingText[], width: number, height: number) {
  ctx.save();
  ctx.font = "bold 20px 'Luckiest Guy', cursive, sans-serif";
  ctx.textAlign = 'center';

  for (const ft of texts) {
    ctx.globalAlpha = Math.max(0, Math.min(1, ft.alpha));
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 5;
    const fx = ft.x <= 1 ? ft.x * width : ft.x;
    const fy = ft.y <= 1 ? ft.y * height : ft.y;
    ctx.strokeText(ft.text, fx, fy);
    ctx.fillStyle = ft.color;
    ctx.fillText(ft.text, fx, fy);
  }
  ctx.restore();
}
