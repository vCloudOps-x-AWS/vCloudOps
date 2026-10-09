# Antigravity Handoff & Architecture Log

This document tracks modifications made to the `vCloudOps` repository by the Antigravity agent, outlining architecture decisions, performance optimizations, and integration guidelines for future sessions.

---

## 1. Key Architectural Implementations

### A. Dynamic Particle Typography (`ParticleText.jsx` & `ParticleText.css`)
- **Canvas Particle Physics Engine**: Replaced static headline text with an interactive 2D canvas particle system.
- **360° Screen-Wide Scatter**: Particles originate across the entire screen perimeter rather than a localized box, converging along sinusoidal trajectory arcs into letter target coordinates.
- **Color Segmentation**:
  - Foundational words (*"Architect the"*, *"Deploy the"*) render in **Pure White** (`#FFFFFF`).
  - Tech accents (*"Cloud."*, *"Future."*) render in **Electric Blue** (`#0088FF`).
- **Mobile Responsive Adaptation**:
  - Automatically reformats to a 4-line layout on screens `<640px` (`"Architect the \n Cloud. \n Deploy the \n Future."`).
  - Upscaled font sizing (`clamp(1.9rem, 7.8vw, 2.5rem)`) with dense 2px sampling ensures solid, readable letter strokes on small screens.
  - Idle drift dampened on mobile (0.12px) to prevent small glyph distortion.
- **Interactive Physics**: Cursor/touch repulsion with rotational swirl and subtle Brownian harmonic idle drift.

### B. Cinematic Hero Entrance & Rolling Counters (`Hero.jsx`)
- **Synchronized Choreography**: The timeline begins as particle text settles (~1.75s), avoiding dead delay and orchestrating:
  - Floating island navbar slide-in with optical focus (`y: -24 -> 0`, blur clearing).
  - Tagline fade and blur resolution (`y: 18 -> 0`).
  - CTA buttons spring-in (`y: 26 -> 0`, `scale: 0.92 -> 1`, `back.out(1.18)`).
  - Primary CTA luminous cyan bloom (`0 0 35px rgba(56, 189, 248, 0.65)`).
  - Stats cards cascade with spring overshoot (`back.out(1.25)`) and illuminated neon border boot-up flash.
- **Live Metric Rolling Counters**:
  - Metrics animate dynamically on card arrival: `0 -> 40+`, `0 -> 12+`, `0 -> 6+`, `0 -> 100%`.
  - Formatted with `tabular-nums font-mono` to prevent width jitter during roll-up.

### C. Performance & Frame Rate Engineering (60+ FPS)
- **Eliminated CPU `shadowBlur`**: Replaced per-frame `ctx.shadowBlur` with pre-rendered offscreen GPU texture sprites (`createParticleSprite` + `ctx.drawImage`), eliminating canvas frame drop.
- **IntersectionObserver Suspension**: The particle animation loop pauses completely when scrolled offscreen.
- **Scroll Throttling**: Navbar scroll position detection is throttled with `window.requestAnimationFrame`.
- **Lenis Smooth Scroll Synchronization**: GSAP ticker coupled with Lenis smooth scroll and lag smoothing (`gsap.ticker.lagSmoothing(500, 33)`).

### D. Interactive WebGL Glow Cursor (`GlowCursor.jsx` & `GlowCursor.css`)
- **Hardware-Accelerated OGL Engine**: Installed `ogl` (`^1.0.11`) to render high-efficiency GLSL shaders for a global trailing glow cursor across the entire viewport.
- **Dual-Tone Cosmic Shading**: Electric cyan (`#67E8F9`) core with cosmic lavender (`#A78BFA`) falloff, hotspot expansion, and film grain noise.
- **Deep Sleep State (0% Idle Overhead)**: Automatically pauses the animation loop when the mouse is still, waking instantly on motion.
- **Seamless Fixed Overlay**: Positioned in a fixed full-screen overlay with `pointer-events: none` and `mix-blend-mode: screen`, leaving all page elements, links, and scrolling 100% unobstructed.

### E. 3D WebGL Plus-Shape Cosmic Starfield (`Particles.jsx` & `Particles.css`)
- **Hardware-Accelerated OGL Particles Engine**: Built with `ogl` (`Renderer`, `Camera`, `Geometry`, `Program`, `Mesh`).
- **Plus (`+`) Shape Fragment Shader**: Signed distance field in GLSL carves out crisp retro pixel cross stars with brilliant diamond-white center core and luminous cyan-blue arms (`#7DD3FC`, `#38BDF8`, `#BAE6FD`, `#67E8F9`, `#93C5FD`).
- **Stratified Full-Bleed Grid Distribution**: 14x10 jittered grid sampling covering the exact visible camera frustum with 25% margin, guaranteeing 100% even screen coverage with no clustering or empty corners.
- **Controlled Scale Clamping**: Strictly clamped `gl_PointSize` between 4.5px and 9.5px, preventing oversized stars when moving closer to the camera.
- **Unified 3D Mouse Parallax**: Fluid mouse tracking with smooth lerping, translational sway, and subtle perspective tilt synchronized across every star.
- **Preserved Planetary System**: All SVG celestial bodies, atmospheres, and meteors in `SpaceBackground.jsx` remain intact.

### F. Performance Optimization & Asset Pipeline
- **Sharp WebP Pipeline (`scripts/optimize-images.mjs`)**: Compressed 30 team portraits, event banners, and logos to high-quality WebP.
  - Roster photo payload dropped by **98.4%** (from 35.71 MB to 0.57 MB).
  - All images include `loading="lazy"` and `decoding="async"`.
- **GlowCursor Touch Device Bypass**: Checks `(pointer: coarse)` and `(hover: none)`. If mobile touch device, bypasses WebGL canvas rendering completely to eliminate GPU drain and overheating.
- **Vite 8 Rolldown Chunk Splitting**: Configured `manualChunks` in `vite.config.js` into modular cached vendor bundles (`vendor-react`, `vendor-animation`, `vendor-webgl`, `vendor-icons`).
  - Main entry JS bundle reduced by **81%** (from 836 kB down to 157 kB).
- **Route Code Splitting**: Implemented `React.lazy` for `JoinPage.jsx` wrapped in `<Suspense>`.
- **Non-Blocking Fonts**: Replaced `@import` in `index.css` with `<link rel="preconnect">` and asynchronous stylesheet loading in `index.html`.
- **Lenis Mobile Decoupling**: Set `smoothTouch: false` and `syncTouch: false` to allow native 120Hz mobile touch scrolling while keeping smooth wheel glide on desktop.

### G. Mobile Accordion Expand Transition (`AccordionGallery.jsx` & `EventsSection.jsx`)
- **Fluid Numerical Height Morphing**: Replaced `display: none` and `height: auto` with interpolatable numerical heights (`64px` collapsed -> `clamp(350px, 49vh, 395px)` expanded) animated via `cubic-bezier(0.16, 1, 0.3, 1)`.
- **Coordinated Content Crossfade & Slide**:
  - Collapsed header bar gently fades out and slides up (`translateY(-8px)`).
  - Expanded event details glide in from `translateY(14px)` with opacity fade and staggered delay.
- **Mobile ScrollTrigger Pinning**:
  - Dynamically scaled pin scroll distance on mobile (`window.innerWidth < 768`) to ~750px (`window.innerHeight * (totalCards * 0.55)`) so each card advances with 1 natural thumb swipe.
  - Reduced scrub latency to `0.35s` on mobile for instantaneous gesture responsiveness.

---

## 2. Upstream Git & Branch Status

- **Branch**: `updates`
- **Synchronized with**: `origin/main`
- **Status**: Production build verified with Vite 8 (`npm run build`), roster checks passed (`npm run roster:check`).

---

## 3. Tooling & Development Standards

- **Dev Server**: Run on port 3000 (`npm run dev`) configured in `vite.config.js` to avoid PWA port collisions.
- **Roster Verification**: Run `npm run roster:check` before pushing any team changes.
- **Build Verification**: Run `npm run build` to verify rolldown chunking and bundle constraints.
- **Design Guidelines**: Always reference `design.md` for the *Ethereal Glass* design system.
