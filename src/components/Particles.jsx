import { useEffect, useRef } from 'react';
import { Renderer, Camera, Geometry, Program, Mesh } from 'ogl';

import './Particles.css';

const defaultColors = ['#7DD3FC', '#38BDF8', '#BAE6FD', '#67E8F9', '#93C5FD'];

const hexToRgb = (hex) => {
  hex = hex.replace(/^#/, '');
  if (hex.length === 3) {
    hex = hex
      .split('')
      .map((c) => c + c)
      .join('');
  }
  const int = parseInt(hex.slice(0, 6), 16);
  const r = ((int >> 16) & 255) / 255;
  const g = ((int >> 8) & 255) / 255;
  const b = (int & 255) / 255;
  return [r, g, b];
};

const vertex = /* glsl */ `
  attribute vec3 position;
  attribute vec4 random;
  attribute vec3 color;
  
  uniform mat4 modelMatrix;
  uniform mat4 viewMatrix;
  uniform mat4 projectionMatrix;
  uniform float uTime;
  uniform float uSpreadX;
  uniform float uSpreadY;
  uniform float uSpreadZ;
  uniform float uBaseSize;
  uniform float uSizeRandomness;
  uniform float uDpr;
  
  varying vec4 vRandom;
  varying vec3 vColor;
  
  void main() {
    vRandom = random;
    vColor = color;
    
    // Scale position coordinates to exactly match full viewport bounds with margin
    vec3 pos = vec3(
      position.x * uSpreadX,
      position.y * uSpreadY,
      position.z * uSpreadZ
    );
    
    vec4 mPos = modelMatrix * vec4(pos, 1.0);
    float t = uTime;
    
    // Gentle floating idle drift across space
    mPos.x += sin(t * random.z + 6.28 * random.w) * 0.16;
    mPos.y += cos(t * random.y + 6.28 * random.x) * 0.16;
    mPos.z += sin(t * random.w + 6.28 * random.y) * 0.12;
    
    vec4 mvPos = viewMatrix * mPos;

    // Organic celestial twinkling pulse
    float twinkle = 0.88 + 0.22 * sin(uTime * (1.6 + random.w * 2.2) + random.y * 6.28);

    // Controlled point size with strict upper and lower bounds
    float dist = max(length(mvPos.xyz), 12.0);
    float sizeFactor = 1.0 + uSizeRandomness * (random.x - 0.5);
    float calculatedSize = (uBaseSize * sizeFactor * twinkle * uDpr) / dist;

    // Clamp size strictly so stars are delicate and dainty: min 4.5px, max 9.5px (relative to DPR)
    gl_PointSize = clamp(calculatedSize, 4.5 * uDpr, 9.5 * uDpr);

    gl_Position = projectionMatrix * mvPos;
  }
`;

const fragment = /* glsl */ `
  precision highp float;
  
  uniform float uTime;
  uniform float uAlphaParticles;
  varying vec4 vRandom;
  varying vec3 vColor;
  
  void main() {
    // Coordinates from sprite center [-0.5, 0.5]
    vec2 p = abs(gl_PointCoord.xy - vec2(0.5));
    
    // Pixel '+' cross star dimensions:
    // armThickness = half thickness of each bar (0.16 of point size)
    // armLength = half length of each bar (0.46 of point size)
    float armThickness = 0.17;
    float armLength = 0.46;
    
    // Signed distance tests for horizontal and vertical cross arms
    float dHoriz = max(p.x - armLength, p.y - armThickness);
    float dVert = max(p.y - armLength, p.x - armThickness);
    float crossDist = min(dHoriz, dVert);
    
    // Discard any fragments outside the '+' cross shape
    if (crossDist > 0.0) {
      discard;
    }
    
    // Luminous center intersection core of the '+'
    bool isCenter = (p.x <= armThickness * 0.95 && p.y <= armThickness * 0.95);
    
    // Give all stars a distinct, luminous bluish celestial touch
    // Blend with cool ice-blue starlight base:
    vec3 coolStarlight = vec3(0.72, 0.88, 1.0);
    vec3 unifiedColor = mix(coolStarlight, vColor, 0.65);
    
    // Subtle chromatic shimmer with cyan-blue starlight breathing
    float shimmer = 0.10 * sin(uTime * 2.5 + vRandom.y * 6.28);
    vec3 armColor = clamp(unifiedColor + vec3(shimmer * 0.3, shimmer * 0.7, shimmer), 0.0, 1.0);
    
    // Brilliant diamond white-cyan center core, surrounded by glowing bluish arms
    vec3 centerCore = vec3(0.92, 0.98, 1.0);
    vec3 finalColor = isCenter ? centerCore : armColor;
    
    // Edge anti-aliasing if alphaParticles is enabled, else crisp pixel edges
    float alpha = 1.0;
    if (uAlphaParticles > 0.5) {
      alpha = smoothstep(0.0, -0.04, crossDist);
    }
    
    gl_FragColor = vec4(finalColor, alpha);
  }
`;

const Particles = ({
  particleCount = 140,
  speed = 0.07,
  particleColors,
  moveParticlesOnHover = true,
  particleHoverFactor = 0.5,
  alphaParticles = false,
  particleBaseSize = 130,
  sizeRandomness = 0.6,
  cameraDistance = 20,
  disableRotation = false,
  pixelRatio = 1,
  className = ''
}) => {
  const containerRef = useRef(null);
  const targetMouseRef = useRef({ x: 0, y: 0 });
  const currentMouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const renderer = new Renderer({
      dpr: pixelRatio,
      depth: false,
      alpha: true
    });
    const gl = renderer.gl;
    container.appendChild(gl.canvas);
    gl.clearColor(0, 0, 0, 0);

    const camera = new Camera(gl, { fov: 15 });
    camera.position.set(0, 0, cameraDistance);

    // Stratified jittered distribution to guarantee 100% even coverage across the entire screen
    const count = particleCount;
    const positions = new Float32Array(count * 3);
    const randoms = new Float32Array(count * 4);
    const colors = new Float32Array(count * 3);
    const palette = particleColors && particleColors.length > 0 ? particleColors : defaultColors;

    // Grid of columns x rows for stratified sampling (prevents clustering and empty corners)
    const cols = 14;
    const rows = Math.ceil(count / cols);
    let idx = 0;

    for (let r = 0; r < rows && idx < count; r++) {
      for (let c = 0; c < cols && idx < count; c++) {
        // Jitter within each cell with a 75% span for natural placement with zero clumping
        const u = (c + 0.125 + Math.random() * 0.75) / cols;
        const v = (r + 0.125 + Math.random() * 0.75) / rows;

        // Normalized [-1, 1] range covering screen bounds
        const x = u * 2.0 - 1.0;
        const y = (1.0 - v) * 2.0 - 1.0;
        const z = Math.random() * 2.0 - 1.0;

        positions.set([x, y, z], idx * 3);
        randoms.set([Math.random(), Math.random(), Math.random(), Math.random()], idx * 4);
        const col = hexToRgb(palette[Math.floor(Math.random() * palette.length)]);
        colors.set(col, idx * 3);
        idx++;
      }
    }

    const geometry = new Geometry(gl, {
      position: { size: 3, data: positions },
      random: { size: 4, data: randoms },
      color: { size: 3, data: colors }
    });

    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        uTime: { value: 0 },
        uSpreadX: { value: 6.0 },
        uSpreadY: { value: 3.5 },
        uSpreadZ: { value: 4.5 },
        uBaseSize: { value: particleBaseSize },
        uSizeRandomness: { value: sizeRandomness },
        uDpr: { value: pixelRatio },
        uAlphaParticles: { value: alphaParticles ? 1 : 0 }
      },
      transparent: true,
      depthTest: false
    });

    const particles = new Mesh(gl, { mode: gl.POINTS, geometry, program });

    let lastW = 0;
    let lastH = 0;
    const resize = () => {
      const width = container.clientWidth || window.innerWidth;
      const height = container.clientHeight || window.innerHeight;
      if (width === lastW && Math.abs(height - lastH) < 120) return;
      lastW = width;
      lastH = height;
      renderer.setSize(width, height);
      const aspect = (width && height) ? (width / height) : (16 / 9);
      camera.perspective({ aspect });

      // Compute exact visible dimensions at cameraDistance (20) with fov (15 deg)
      const fovRad = (camera.fov || 15) * (Math.PI / 180);
      const visibleHeight = 2.0 * Math.tan(fovRad / 2.0) * cameraDistance;
      const visibleWidth = visibleHeight * aspect;

      // 25% margin ensures full-bleed coverage even during mouse parallax and scroll tilt
      const margin = 1.25;
      program.uniforms.uSpreadX.value = (visibleWidth / 2.0) * margin;
      program.uniforms.uSpreadY.value = (visibleHeight / 2.0) * margin;
      program.uniforms.uSpreadZ.value = 4.5;
      program.uniforms.uDpr.value = pixelRatio;
    };
    window.addEventListener('resize', resize, false);
    resize();

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const w = rect.width || window.innerWidth;
      const h = rect.height || window.innerHeight;
      const x = ((e.clientX - rect.left) / w) * 2 - 1;
      const y = -(((e.clientY - rect.top) / h) * 2 - 1);
      targetMouseRef.current = { x, y };
    };

    if (moveParticlesOnHover) {
      window.addEventListener('mousemove', handleMouseMove, { passive: true });
    }

    let animationFrameId;
    let lastTime = performance.now();
    let elapsed = 0;
    let isHidden = false;

    const onVisibilityChange = () => {
      isHidden = document.hidden;
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    const update = (t) => {
      animationFrameId = requestAnimationFrame(update);
      if (isHidden) return;

      const delta = t - lastTime;
      lastTime = t;
      elapsed += delta * speed;

      program.uniforms.uTime.value = elapsed * 0.001;

      if (moveParticlesOnHover) {
        // Smooth lerp toward mouse for silky fluid 3D parallax
        currentMouseRef.current.x += (targetMouseRef.current.x - currentMouseRef.current.x) * 0.05;
        currentMouseRef.current.y += (targetMouseRef.current.y - currentMouseRef.current.y) * 0.05;

        // Controlled position sway
        particles.position.x = -currentMouseRef.current.x * particleHoverFactor;
        particles.position.y = -currentMouseRef.current.y * particleHoverFactor;

        // Subtle 3D perspective tilt
        if (!disableRotation) {
          particles.rotation.x = Math.sin(elapsed * 0.0002) * 0.04 + currentMouseRef.current.y * 0.04;
          particles.rotation.y = Math.cos(elapsed * 0.0005) * 0.06 - currentMouseRef.current.x * 0.05;
          particles.rotation.z += 0.006 * speed;
        }
      } else {
        particles.position.x = 0;
        particles.position.y = 0;

        if (!disableRotation) {
          particles.rotation.x = Math.sin(elapsed * 0.0002) * 0.08;
          particles.rotation.y = Math.cos(elapsed * 0.0005) * 0.12;
          particles.rotation.z += 0.008 * speed;
        }
      }

      renderer.render({ scene: particles, camera });
    };

    animationFrameId = requestAnimationFrame(update);

    return () => {
      window.removeEventListener('resize', resize);
      if (moveParticlesOnHover) {
        window.removeEventListener('mousemove', handleMouseMove);
      }
      document.removeEventListener('visibilitychange', onVisibilityChange);
      cancelAnimationFrame(animationFrameId);
      if (container && gl.canvas && container.contains(gl.canvas)) {
        container.removeChild(gl.canvas);
      }
      const loseExt = gl.getExtension('WEBGL_lose_context');
      if (loseExt) loseExt.loseContext();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    particleCount,
    speed,
    moveParticlesOnHover,
    particleHoverFactor,
    alphaParticles,
    particleBaseSize,
    sizeRandomness,
    cameraDistance,
    disableRotation,
    pixelRatio
  ]);

  return <div ref={containerRef} className={`particles-container ${className}`} />;
};

export default Particles;
