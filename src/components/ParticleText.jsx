'use client';

import { useEffect, useRef } from 'react';
import './ParticleText.css';
import { getHasIntroAnimated, markIntroStarted } from '../utils/introState';

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const resolveFontSize = (value, container, fontWeight, fontFamily) => {
  if (typeof value === 'number') return value;

  const probe = document.createElement('span');
  probe.textContent = 'M';
  probe.style.position = 'absolute';
  probe.style.visibility = 'hidden';
  probe.style.pointerEvents = 'none';
  probe.style.fontSize = value;
  probe.style.fontWeight = String(fontWeight);
  probe.style.fontFamily = fontFamily;
  container.appendChild(probe);
  const size = parseFloat(window.getComputedStyle(probe).fontSize) || 72;
  probe.remove();
  return size;
};

const waitForFonts = async font => {
  if (!('fonts' in document)) return;
  try {
    await document.fonts.load(font);
  } catch {}
  await document.fonts.ready;
};

// Segment splitter to isolate "Cloud" / "Cloud." and "Future" / "Future." as blue accents
const splitLineSegments = line => {
  const regex = /(Cloud\.?|Future\.?)/g;
  const parts = [];
  let lastIdx = 0;
  let match;
  while ((match = regex.exec(line)) !== null) {
    if (match.index > lastIdx) {
      parts.push({ text: line.substring(lastIdx, match.index), isAccent: false });
    }
    parts.push({ text: match[0], isAccent: true });
    lastIdx = regex.lastIndex;
  }
  if (lastIdx < line.length) {
    parts.push({ text: line.substring(lastIdx), isAccent: false });
  }
  return parts;
};

// Format headline text: 4 spacious lines on mobile for massive readable letters; 2 lines on desktop
const getActiveContent = (rawText, isMobile) => {
  if (isMobile && rawText.includes('Architect the Cloud') && rawText.includes('Deploy the Future')) {
    return "Architect the\nCloud.\nDeploy the\nFuture.";
  }
  return rawText;
};

// Pre-render GPU-accelerated particle sprites once to replace expensive 60fps shadowBlur
const createParticleSprite = (coreColor, glowColor, size = 32) => {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  const center = size / 2;
  const radius = size * 0.44;

  // Outer radial gradient glow (soft, luminous, zero-cost during rendering)
  const grad = ctx.createRadialGradient(center, center, radius * 0.12, center, center, radius);
  grad.addColorStop(0, glowColor);
  grad.addColorStop(0.55, glowColor);
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(center, center, radius, 0, Math.PI * 2);
  ctx.fill();

  // Solid intense core in the center for razor-sharp typography definition
  ctx.fillStyle = coreColor;
  ctx.beginPath();
  ctx.arc(center, center, radius * 0.58, 0, Math.PI * 2);
  ctx.fill();

  return canvas;
};

const ParticleText = ({
  text = 'Architect the Cloud.\nDeploy the Future.',
  particleSize = 2.6,
  density = 4,
  color = '#ffffff',
  highlightColor = '#0088ff',
  gatherDuration = 1750,
  stagger = 480,
  pointerRepel = 45,
  repelRadius = 120,
  idleDrift = 0.85,
  trigger = 'mount',
  fontSize = 'clamp(1.65rem, 5.8vw, 4.4rem)',
  fontWeight = 800,
  fontFamily = "'Plus Jakarta Sans', sans-serif",
  glow = true,
  className = '',
  style
}) => {
  const anchorRef = useRef(null);
  const canvasRef = useRef(null);
  const hasGatheredRef = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const anchor = anchorRef.current;
    const canvas = canvasRef.current;
    if (!anchor || !canvas) return undefined;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return undefined;

    // Pre-create GPU texture sprites for white and blue particles (100x faster than shadowBlur)
    const whiteSprite = createParticleSprite('#ffffff', 'rgba(255, 255, 255, 0.9)', 32);
    const blueSprite = createParticleSprite('#0099ff', 'rgba(0, 85, 255, 0.9)', 32);

    let particles = [];
    let animationFrame = null;
    let resizeFrame = null;
    let buildId = 0;
    let gathering = false;
    let gatherStart = 0;
    let reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let isVisible = true;
    let isMobileView = false;

    const pointer = {
      active: false,
      x: 0,
      y: 0,
      smoothX: 0,
      smoothY: 0
    };

    // Calculate seamless whole-screen 360-degree organic scatter distribution
    const getWholeScreenScatter = (seed, depth, w, h) => {
      const rand1 = ((seed * 9301 + 49297) % 233280) / 233280;
      const rand2 = ((depth * 1399 + 3121) % 10000) / 10000;
      const rand3 = (seed * 6271 + depth * 3889) % 1;

      const angle = rand1 * Math.PI * 2;
      const maxRadius = Math.hypot(w, h) * 0.72;
      const radius = 70 + Math.pow(rand2, 0.65) * maxRadius;

      const sx = w / 2 + Math.cos(angle) * radius + (rand3 - 0.5) * w * 0.45;
      const sy = h / 2 + Math.sin(angle) * radius + (rand2 - 0.5) * h * 0.45;

      return { sx, sy };
    };

    const startGather = (fromScatter = true) => {
      if (!particles.length) return;

      const now = performance.now();

      particles.forEach(particle => {
        if (fromScatter) {
          const { sx, sy } = getWholeScreenScatter(particle.seed, particle.depth, width, height);
          particle.startX = sx;
          particle.startY = sy;
          particle.x = sx;
          particle.y = sy;
        } else {
          particle.startX = particle.x;
          particle.startY = particle.y;
        }

        const dx = particle.targetX - particle.startX;
        const dy = particle.targetY - particle.startY;
        const dist = Math.hypot(dx, dy) || 1;
        particle.nx = -dy / dist;
        particle.ny = dx / dist;
        particle.arcAmp = (particle.seed - 0.5) * Math.min(340, dist * 0.75);

        particle.delay = reducedMotion ? 0 : Math.pow((particle.seed * 3137) % 1, 1.4) * stagger;
      });

      gatherStart = now;
      gathering = true;
    };

    const render = now => {
      // Pause drawing completely when hero is out of view to free CPU & GPU
      if (!isVisible) {
        animationFrame = null;
        return;
      }

      ctx.clearRect(0, 0, width, height);

      pointer.smoothX += (pointer.x - pointer.smoothX) * 0.18;
      pointer.smoothY += (pointer.y - pointer.smoothY) * 0.18;

      let complete = true;

      // Restrict idle drift on mobile to subtle shimmer (0.12px) so small letters NEVER distort
      const activeDrift = isMobileView ? (idleDrift * 0.15) : idleDrift;

      for (let i = 0; i < particles.length; i++) {
        const particle = particles[i];
        let baseX = particle.targetX;
        let baseY = particle.targetY;
        let progress = 1;

        if (gathering) {
          const local = (now - gatherStart - particle.delay) / Math.max(1, reducedMotion ? 1 : gatherDuration);
          progress = clamp(local, 0, 1);

          if (reducedMotion) {
            baseX = particle.startX + (particle.targetX - particle.startX) * progress;
            baseY = particle.startY + (particle.targetY - particle.startY) * progress;
          } else {
            const eased = 1 - Math.pow(1 - progress, particle.easePower);
            const flightX = particle.startX + (particle.targetX - particle.startX) * eased;
            const flightY = particle.startY + (particle.targetY - particle.startY) * eased;
            const arc = Math.sin(eased * Math.PI) * particle.arcAmp;
            const wave = Math.sin(eased * Math.PI * particle.waveCycles + particle.phase) * (1 - eased) * particle.waveAmp;

            baseX = flightX + particle.nx * (arc + wave);
            baseY = flightY + particle.ny * (arc + wave);
          }

          if (progress < 1) complete = false;
        } else if (!reducedMotion && activeDrift > 0) {
          const t = now * 0.001;
          const driftX = (
            Math.sin(t * particle.driftFreqX1 + particle.phase1) * 1.1 +
            Math.cos(t * particle.driftFreqX2 + particle.phase2) * 0.65 +
            Math.sin(t * 0.3 + particle.phase3) * 0.45
          ) * activeDrift;

          const driftY = (
            Math.cos(t * particle.driftFreqY1 + particle.phase2) * 1.1 +
            Math.sin(t * particle.driftFreqY2 + particle.phase1) * 0.65 +
            Math.cos(t * 0.28 + particle.phase3) * 0.45
          ) * activeDrift;

          baseX += driftX;
          baseY += driftY;
        }

        if (pointer.active && !reducedMotion && pointerRepel > 0 && repelRadius > 0) {
          const dx = baseX - pointer.smoothX;
          const dy = baseY - pointer.smoothY;
          const distance = Math.hypot(dx, dy);
          if (distance > 0 && distance < repelRadius) {
            const force = Math.pow(1 - distance / repelRadius, 2) * pointerRepel;
            const pushX = (dx / distance) * force;
            const pushY = (dy / distance) * force;
            const swirlForce = force * 0.38 * particle.spinDir;
            const swirlX = (-dy / distance) * swirlForce;
            const swirlY = (dx / distance) * swirlForce;

            baseX += pushX + swirlX;
            baseY += pushY + swirlY;
          }
        }

        const follow = reducedMotion ? 1 : particle.inertia;
        particle.x += (baseX - particle.x) * follow;
        particle.y += (baseY - particle.y) * follow;

        // Blazing-fast GPU texture blit (drawImage) replacing expensive CPU shadowBlur
        const sprite = particle.isAccent ? blueSprite : whiteSprite;
        const d = particle.drawSize;
        ctx.globalAlpha = clamp(0.55 + progress * 0.45, 0, 1);
        ctx.drawImage(sprite, particle.x - d / 2, particle.y - d / 2, d, d);
      }

      ctx.globalAlpha = 1;

      if (gathering && complete) {
        gathering = false;
      }

      animationFrame = window.requestAnimationFrame(render);
    };

    const ensureRenderLoop = () => {
      if (animationFrame === null && isVisible) {
        animationFrame = window.requestAnimationFrame(render);
      }
    };

    const sampleText = async () => {
      const currentBuild = ++buildId;
      const section = anchor.closest('section') || anchor.parentElement || anchor;
      const sectionRect = section.getBoundingClientRect();
      const anchorRect = anchor.getBoundingClientRect();

      width = Math.floor(sectionRect.width);
      height = Math.floor(sectionRect.height);

      if (width <= 0 || height <= 0) return;

      isMobileView = width < 640;

      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const computed = window.getComputedStyle(anchor);
      const resolvedFamily = fontFamily === 'inherit' ? computed.fontFamily || 'sans-serif' : fontFamily;

      // On mobile, use larger font size (~32px) with 4 short lines so letters are big, bold, and crystal clear
      const targetFontSize = isMobileView ? 'clamp(1.9rem, 7.8vw, 2.5rem)' : fontSize;
      let resolvedSize = resolveFontSize(targetFontSize, anchor, fontWeight, resolvedFamily);
      let font = `${fontWeight} ${resolvedSize}px ${resolvedFamily}`;

      await waitForFonts(font);
      if (currentBuild !== buildId) return;

      const offscreen = document.createElement('canvas');
      const offCtx = offscreen.getContext('2d', { willReadFrequently: true });
      if (!offCtx) return;

      // Format content: 4 punchy lines on mobile, 2 lines on desktop
      const content = getActiveContent(String(text || ' '), isMobileView);
      const lines = content.split('\n');
      const maxAllowedWidth = Math.min(width * 0.94, (anchorRect.width || width) * 0.98);
      offCtx.font = font;

      let maxLineWidth = 1;
      lines.forEach(line => {
        const m = offCtx.measureText(line);
        if (m.width > maxLineWidth) maxLineWidth = m.width;
      });

      if (maxLineWidth > maxAllowedWidth) {
        resolvedSize = Math.max(20, resolvedSize * (maxAllowedWidth / maxLineWidth));
        font = `${fontWeight} ${resolvedSize}px ${resolvedFamily}`;
        await waitForFonts(font);
        if (currentBuild !== buildId) return;
        offCtx.font = font;
        maxLineWidth = 1;
        lines.forEach(line => {
          const m = offCtx.measureText(line);
          if (m.width > maxLineWidth) maxLineWidth = m.width;
        });
      }

      const lineHeight = isMobileView ? Math.round(resolvedSize * 1.2) : Math.round(resolvedSize * 1.15);
      const ascent = Math.ceil(resolvedSize * 0.82);
      const descent = Math.ceil(resolvedSize * 0.2);
      const padding = Math.max(4, Math.ceil(resolvedSize * 0.04));
      const textWidth = Math.ceil(maxLineWidth);
      const textHeight = Math.ceil(ascent + descent + (lines.length - 1) * lineHeight);

      offscreen.width = textWidth + padding * 2;
      offscreen.height = textHeight + padding * 2;
      offCtx.clearRect(0, 0, offscreen.width, offscreen.height);
      offCtx.font = font;
      offCtx.textBaseline = 'alphabetic';

      const accentBoxes = [];
      lines.forEach((line, lineIdx) => {
        const lineY = padding + ascent + lineIdx * lineHeight;
        const segments = splitLineSegments(line);
        
        let totalLineWidth = 0;
        segments.forEach((seg, sIdx) => {
          const w = offCtx.measureText(seg.text).width;
          totalLineWidth += w + (seg.isAccent && sIdx > 0 ? Math.max(6, resolvedSize * 0.08) : 0);
        });

        let curX = (offscreen.width - totalLineWidth) / 2;

        segments.forEach((seg, sIdx) => {
          if (seg.isAccent && sIdx > 0) {
            curX += Math.max(6, resolvedSize * 0.08);
          }

          const segWidth = offCtx.measureText(seg.text).width;
          if (seg.isAccent) {
            accentBoxes.push({
              x1: curX - 1.5,
              x2: curX + segWidth + 1.5,
              y1: lineY - ascent - 1.5,
              y2: lineY + descent + 1.5
            });
            offCtx.fillStyle = '#0088ff';
          } else {
            offCtx.fillStyle = '#ffffff';
          }
          offCtx.fillText(seg.text, curX, lineY);
          curX += segWidth;
        });
      });

      const imageData = offCtx.getImageData(0, 0, offscreen.width, offscreen.height);
      const targets = [];
      // Dense 2px sampling so every letter stroke has continuous, unbroken points
      const step = 2;

      const anchorOffsetX = anchorRect.left - sectionRect.left;
      const anchorOffsetY = anchorRect.top - sectionRect.top;
      const startTargetX = anchorOffsetX + (anchorRect.width - offscreen.width) / 2;
      const startTargetY = anchorOffsetY + (anchorRect.height - offscreen.height) / 2;

      for (let y = 0; y < offscreen.height; y += step) {
        for (let x = 0; x < offscreen.width; x += step) {
          const idx = (y * offscreen.width + x) * 4;
          const alpha = imageData.data[idx + 3];
          if (alpha > 40) {
            const isAccent = accentBoxes.some(box => x >= box.x1 && x <= box.x2 && y >= box.y1 && y <= box.y2);

            targets.push({
              x: startTargetX + x,
              y: startTargetY + y,
              alpha: alpha / 255,
              isAccent
            });
          }
        }
      }

      // Preserve full typography contours without dropping key pixels
      const maxParticles = isMobileView
        ? Math.max(800, Math.min(1400, Math.floor((width * height) / 160)))
        : Math.max(2400, Math.min(4500, Math.floor((width * height) / 80)));
      const stride = Math.max(1, Math.floor(targets.length / maxParticles));
      const selected = targets.filter((_, index) => index % stride === 0);

      const baseParticleSize = isMobileView ? 2.8 : (particleSize || 2.7);

      const shouldScatter = !getHasIntroAnimated() && !hasGatheredRef.current && !reducedMotion;

      particles = selected.map((target, index) => {
        const seed = ((index * 9301 + 49297) % 233280) / 233280;
        const depth = 0.45 + (((index * 233 + 97) % 1000) / 1000) * 0.9;
        
        const { sx, sy } = shouldScatter
          ? getWholeScreenScatter(seed, depth, width, height)
          : { sx: target.x, sy: target.y };

        const dx = target.x - sx;
        const dy = target.y - sy;
        const dist = Math.hypot(dx, dy) || 1;
        const nx = -dy / dist;
        const ny = dx / dist;

        const arcAmp = (seed - 0.5) * Math.min(340, dist * 0.75);
        const waveCycles = 1 + Math.floor(((seed * 37) % 1) * 3);
        const waveAmp = ((depth * 53) % 1) * 28;
        const phase = ((seed * 197) % 1) * Math.PI * 2;
        const easePower = 2.0 + ((depth * 73) % 1) * 1.8;
        const delay = shouldScatter ? Math.pow((seed * 3137) % 1, 1.4) * stagger : 0;
        const inertia = 0.14 + ((depth * 41) % 1) * 0.12;
        const spinDir = seed > 0.5 ? 1 : -1;

        const driftFreqX1 = 0.4 + ((seed * 179) % 1) * 1.1;
        const driftFreqX2 = 0.9 + ((seed * 283) % 1) * 1.4;
        const driftFreqY1 = 0.35 + ((seed * 311) % 1) * 1.2;
        const driftFreqY2 = 0.85 + ((seed * 439) % 1) * 1.5;
        const phase1 = ((seed * 997) % 1) * Math.PI * 2;
        const phase2 = ((depth * 883) % 1) * Math.PI * 2;
        const phase3 = (seed * 523 + depth * 349) % 1 * Math.PI * 2;

        // Texture draw size (diameter) for GPU blit: overlaps adjacent particles to form SOLID, CONTINUOUS letter strokes
        const drawSize = isMobileView
          ? Math.max(4.0, (baseParticleSize * 1.95) * (0.9 + target.alpha * 0.3))
          : Math.max(4.6, (baseParticleSize * 2.2) * (0.85 + target.alpha * 0.35));

        return {
          x: shouldScatter ? sx : target.x,
          y: shouldScatter ? sy : target.y,
          startX: sx,
          startY: sy,
          targetX: target.x,
          targetY: target.y,
          nx,
          ny,
          arcAmp,
          waveCycles,
          waveAmp,
          phase,
          easePower,
          inertia,
          spinDir,
          driftFreqX1,
          driftFreqX2,
          driftFreqY1,
          driftFreqY2,
          phase1,
          phase2,
          phase3,
          drawSize,
          isAccent: target.isAccent,
          seed,
          depth,
          delay
        };
      });

      pointer.x = width / 2;
      pointer.y = height / 2;
      pointer.smoothX = pointer.x;
      pointer.smoothY = pointer.y;

      if (shouldScatter) {
        hasGatheredRef.current = true;
        markIntroStarted();
        startGather(false);
      } else {
        particles.forEach(particle => {
          particle.x = particle.targetX;
          particle.y = particle.targetY;
          particle.startX = particle.targetX;
          particle.startY = particle.targetY;
          particle.delay = 0;
        });
        gathering = false;
      }

      ensureRenderLoop();
    };

    const queueSample = () => {
      if (resizeFrame) window.cancelAnimationFrame(resizeFrame);
      resizeFrame = window.requestAnimationFrame(sampleText);
    };

    const section = anchor.closest('section') || anchor.parentElement || anchor;
    let cachedRect = section.getBoundingClientRect();

    const updateCachedRect = () => {
      cachedRect = section.getBoundingClientRect();
    };

    const handlePointerMove = event => {
      const clientX = event.touches ? event.touches[0].clientX : event.clientX;
      const clientY = event.touches ? event.touches[0].clientY : event.clientY;

      pointer.x = clientX - cachedRect.left;
      pointer.y = clientY - cachedRect.top;
      pointer.active = (
        clientX >= cachedRect.left &&
        clientX <= cachedRect.right &&
        clientY >= cachedRect.top &&
        clientY <= cachedRect.bottom
      );
    };

    const handlePointerLeave = () => {
      pointer.active = false;
    };

    const reduceMotionQuery = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    const handleReduceMotionChange = event => {
      reducedMotion = event.matches;
      sampleText();
    };

    reduceMotionQuery?.addEventListener('change', handleReduceMotionChange);
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });
    window.addEventListener('pointerleave', handlePointerLeave, { passive: true });
    window.addEventListener('scroll', updateCachedRect, { passive: true });
    window.addEventListener('resize', updateCachedRect, { passive: true });

    const handleDocVisibility = () => {
      if (document.hidden) {
        if (animationFrame !== null) {
          window.cancelAnimationFrame(animationFrame);
          animationFrame = null;
        }
      } else if (isVisible) {
        ensureRenderLoop();
      }
    };
    document.addEventListener('visibilitychange', handleDocVisibility);

    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible) {
          ensureRenderLoop();
        } else if (animationFrame !== null) {
          window.cancelAnimationFrame(animationFrame);
          animationFrame = null;
        }
      },
      { threshold: 0.05 }
    );
    visibilityObserver.observe(section);

    const resizeObserver = new ResizeObserver(queueSample);
    resizeObserver.observe(anchor);
    if (section && section !== anchor) {
      resizeObserver.observe(section);
    }
    sampleText();

    return () => {
      buildId += 1;
      visibilityObserver.disconnect();
      resizeObserver.disconnect();
      document.removeEventListener('visibilitychange', handleDocVisibility);
      reduceMotionQuery?.removeEventListener('change', handleReduceMotionChange);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('pointerleave', handlePointerLeave);
      window.removeEventListener('scroll', updateCachedRect);
      window.removeEventListener('resize', updateCachedRect);

      if (animationFrame !== null) window.cancelAnimationFrame(animationFrame);
      if (resizeFrame !== null) window.cancelAnimationFrame(resizeFrame);
    };
  }, [
    text,
    particleSize,
    density,
    color,
    highlightColor,
    gatherDuration,
    stagger,
    pointerRepel,
    repelRadius,
    idleDrift,
    trigger,
    fontSize,
    fontWeight,
    fontFamily,
    glow
  ]);

  return (
    <>
      <div ref={anchorRef} className={`particle-text-anchor ${className}`} style={style} aria-label={text}>
        <span className="particle-text__sr">{text}</span>
      </div>
      <canvas ref={canvasRef} className="particle-text__canvas pointer-events-none absolute inset-0 w-full h-full" style={{ zIndex: 2 }} aria-hidden="true" />
    </>
  );
};

export default ParticleText;
