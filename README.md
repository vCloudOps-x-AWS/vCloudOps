# ☁️ vCloudOps — Official Cloud & DevOps Community Portal

> **"Architect The Cloud. Deploy The Future."**  
> Where student engineers build, deploy, and scale — real cloud infrastructure, real CI/CD pipelines, real community.

[![React](https://img.shields.io/badge/React-19.2.8-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.3.0-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.3.3-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![GSAP](https://img.shields.io/badge/GSAP-3.15.2-0AE448?style=flat-square&logo=greensock&logoColor=white)](https://greensock.com/)
[![Lenis](https://img.shields.io/badge/Lenis-1.3.1-black?style=flat-square)](https://lenis.darkroom.engineering/)
[![Phosphor Icons](https://img.shields.io/badge/Phosphor_Icons-2.1.10-6366F1?style=flat-square)](https://phosphoricons.com/)
[![Oxlint](https://img.shields.io/badge/Oxlint-1.81.0-F59E0B?style=flat-square&logo=rust&logoColor=white)](https://oxc.rs/)
[![Repository](https://img.shields.io/badge/GitHub-vCloudOps--x--AWS-181717?style=flat-square&logo=github)](https://github.com/vCloudOps-x-AWS/vCloudOps)

---

## 📖 Overview

**vCloudOps** is a modern, high-performance community portal engineered for the official student-led Cloud Computing and DevOps community. The platform serves as the central nexus for hands-on bootcamps, workshops, hackathons, cloud labs, and live infrastructure deployments.

The application is built on an **Ethereal Glass** architectural design system with an interactive cosmic space theme. It combines canvas particle physics, buttery 60+ FPS Lenis smooth scrolling, non-linear GSAP timelines, and tactile responsive design across desktop and mobile devices.

---

## 🛠️ Complete Tech Stack

| Domain | Technology / Tool | Version | Purpose & Implementation Details |
| :--- | :--- | :--- | :--- |
| **Frontend Core** | **React** | `^19.2.8` | Component-based UI library utilizing modern hooks, concurrent rendering, and clean functional architecture. |
| **DOM Engine** | **ReactDOM** | `^19.2.8` | React DOM renderer supporting React 19 fiber reconciler features. |
| **Build System** | **Vite** | `^8.3.0` | Ultra-fast build engine with Hot Module Replacement configured for port 3000. |
| **Styling Engine**| **Tailwind CSS** | `^4.3.3` | Next-generation Tailwind v4 engine using `@tailwindcss/vite` integration and custom tokens. |
| **Primary Animation**| **GSAP & @gsap/react** | `^3.15.2` / `^2.1.2` | Core cinematic timeline animation engine, ScrollTrigger kinetic reveals, and number count-up interpolation. |
| **Smooth Scrolling**| **Lenis** | `^1.3.1` | Hardware-accelerated inertial smooth scrolling synchronized with the GSAP ticker and lag smoothing. |
| **Parallax Engine**| **Framer Motion** | `^13.4.4` | Powering scroll-linked celestial transforms (`useScroll`, `useTransform`) in the cosmic background. |
| **Particle Physics**| **HTML5 Canvas 2D** | Native | Custom GPU-accelerated particle system with pre-rendered texture blitting, 360° scatter trajectories, and cursor repulsion. |
| **Iconography** | **Phosphor Icons** | `^2.1.10` | High-precision linework iconography (`@phosphor-icons/react`) tailored for modern developer interfaces. |
| **Linter & Quality**| **Oxlint** | `^1.81.0` | High-speed Rust-based linter enforcing clean React patterns and zero-warning syntax hygiene. |
| **WebGL Cursor Engine**| **OGL** | `^1.0.11` | Minimal, high-performance WebGL library rendering custom vertex & fragment shaders for the global glowing cursor trail. |
| **Typography** | **Plus Jakarta Sans & Space Grotesk** | `@fontsource` / Google Fonts | Modern geometric grotesk typography for razor-sharp legibility and futuristic headings. |

---

## 🌟 Key Features & Architecture

### 1. Interactive Particle Headline (`ParticleText.jsx`)
- **Fluid Gathering Animation**: Text forms organically from a 360° screen-wide particle scatter using parametric trajectory curves.
- **Color Segmentation**: Seamlessly highlights words—pure white (`#FFFFFF`) for `"Architect the"` / `"Deploy the"` and vibrant electric blue (`#0088FF`) for `"Cloud."` / `"Future."`.
- **Mobile Responsive Layout**: Automatically reformats to a spacious 4-line layout on viewports under 640px for maximum readability.
- **GPU-Accelerated Blitting**: Employs pre-rendered canvas sprites (`ctx.drawImage`) instead of runtime `ctx.shadowBlur` for solid 60+ FPS rendering.
- **Cursor Repulsion & Brownian Drift**: Multi-harmonic organic drift with interactive spring-damped pointer repulsion.

### 2. Ethereal Glass Hero Section (`Hero.jsx`)
- **Multi-Stage Entrance Timeline**: Orchestrated arrival sequence (particles gather → navbar slides down → tagline clears blur → CTAs spring in → stats cards cascade).
- **Radiant Energy Bloom**: Primary CTA button receives a soft cyan glow pulse (`rgba(56, 189, 248, 0.65)`).
- **Tactile Spring Physics**: Stats cards arrive with `back.out(1.25)` overshoot and neon border flash.
- **Dynamic Rolling Counters**: Live animated number counters (`0 -> 40+`, `0 -> 12+`, `0 -> 6+`, `0 -> 100%`) configured with monospace `tabular-nums`.

### 3. Floating Capsule Navbar (`Navbar.jsx`)
- **Detached Glass Pill**: Frosted glass backdrop blur (`backdrop-blur-xl`) with sleek white/10 borders.
- **Active Section Tracking**: Throttled with `requestAnimationFrame` to ensure zero scroll lag.
- **Mobile Drawer**: Responsive glass drawer navigation with smooth slide animations.

### 4. Mission Briefing & Bento Grid (`AboutTeaser.jsx`)
- **Asymmetrical Bento Grid**: Double-bezel (`Doppelrand`) cards highlighting Cloud Architecture, CI/CD Pipelines, Containers & Kubernetes, and DevSecOps.
- **ScrollTrigger Kinetics**: Staggered scroll reveals with smooth blur clearing.

### 5. Interactive Accordion Workshops & Events (`EventsSection.jsx` & `AccordionGallery.jsx`)
- **Pinned Responsive Storyboard**: Pinned full-viewport track with dynamically scaled scroll distance and responsive scrub (`0.35s` on mobile, `0.8s` on desktop).
- **Fluid Mobile Accordion Morphing**: Seamless height transitions (`64px` collapsed -> `clamp(350px, 49vh, 395px)` expanded) with coordinated content slide-and-fade, eliminating jarring `display: none` snapping.
- **Desktop 3D Tilt Kinetics**: Expanded cards track mouse coordinates for subtle perspective rotation.

### 6. Interactive Roster & Domains (`TeamSection.jsx`)
- **Orbital Dock Carousel**: Interactive 3D deck displaying team leads and members across 10 specialized domains.
- **Ultra-Lightweight WebP Portraits**: 30 portraits compressed to high-fidelity WebP format with `loading="lazy"` and `decoding="async"`, reducing payload from 35.7 MB to 0.57 MB.

### 7. Orbiting Moments Community Gallery (`GallerySection.jsx`)
- **Cinematic Community Highlights**: Curated snapshots from cloud workshops, hackathons, and sprint sessions.

### 8. Cosmic Parallax Universe (`SpaceBackground.jsx` & `SpaceJourneyCanvas.jsx`)
- **Multi-Layered Planetary Field**: Layered SVGs including Moon, Ocean Exoplanet, Ringed Titan, Dwarf planets, and twinkling starfields.
- **GPU Hardware Layering**: `will-change: transform, opacity` hints ensure silky 60+ FPS compositor-driven scroll parallax.

### 9. Interactive Shader Glow Cursor (`GlowCursor.jsx`)
- **Custom OGL Shaders**: Full-viewport WebGL cursor trail with cyan/violet dual-color gradient, pulse dynamics, and film grain noise.
- **Touch & Mobile Bypass**: Automatically bypasses WebGL canvas on touch devices (`pointer: coarse` / `hover: none`) to conserve mobile battery and GPU fill-rate.
- **Deep Sleep Optimization**: Automatically suspends the WebGL loop when the cursor is idle or tab is hidden.

---

## 📁 Project Structure

```text
vCloudOps/
├── public/
│   ├── Logo/                 # Official brand icons and marks (PNG/SVG)
│   ├── images/events/        # High-resolution optimized WebP event banners
│   ├── team-logos/           # Domain insignia and logos (WebP/PNG)
│   └── team-members/roster/  # 30 optimized WebP team portraits
├── src/
│   ├── components/
│   │   ├── AboutTeaser.jsx   # Mission briefing & asymmetrical bento grid
│   │   ├── AccordionGallery.css # Fluid accordion transitions & responsive styles
│   │   ├── AccordionGallery.jsx # Interactive horizontal/vertical event accordion
│   │   ├── CosmicWarpTransition.jsx # Route warp gateway transition effect
│   │   ├── EventsSection.jsx # Workshop cards & ScrollTrigger pinned story
│   │   ├── Footer.jsx        # Dual-tier footer with navigation & social links
│   │   ├── GallerySection.jsx# Community moments & snapshot gallery
│   │   ├── GlowCursor.jsx    # Hardware-accelerated OGL WebGL glow cursor
│   │   ├── GlowCursor.css    # Cursor canvas layering and viewport styling
│   │   ├── Hero.jsx          # Hero section with CTAs & live rolling stats
│   │   ├── Navbar.jsx        # Floating capsule island navigation
│   │   ├── ParticleText.jsx  # 2D canvas particle physics headline
│   │   ├── ParticleText.css  # Particle text layout & responsive anchors
│   │   ├── ScrollCue.jsx     # Animated scroll guidance indicator
│   │   ├── SpaceBackground.jsx# Parallax cosmic vector background
│   │   ├── TeamSection.jsx   # Core leadership cards & 3D carousel
│   │   └── space/            # Modular deep-space journey celestial bodies
│   ├── hooks/
│   │   ├── usePageTransition.js # Route transition trigger hook
│   │   ├── useReducedMotion.js # Accessibility hook for motion preferences
│   │   └── useScrolled.js    # Scroll threshold detection hook
│   ├── pages/
│   │   ├── Home.jsx          # Primary single-page composition
│   │   └── JoinPage.jsx      # Code-split recruitment application portal
│   ├── utils/
│   │   └── smoothScroll.js   # Lenis initialization & mobile touch inertia
│   ├── App.css               # Global utility rules
│   ├── App.jsx               # Root application component with code splitting
│   ├── index.css             # Tailwind v4 directives & keyframes
│   └── main.jsx              # DOM entry point
├── scripts/
│   ├── check-roster.mjs      # Automated integrity verification for roster
│   ├── make-favicon.js       # Favicon generator
│   └── optimize-images.mjs   # Sharp image compression pipeline (WebP)
├── index.html                # HTML entry template with font preconnects & SEO
├── package.json              # Project dependencies & scripts
├── vite.config.js            # Vite config (port 3000, manual vendor chunks)
└── README.md                 # Complete project documentation
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: `v18.0.0` or higher
- **npm**: `v9.0.0` or higher

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/vCloudOps-x-AWS/vCloudOps.git
   cd vCloudOps
   ```

2. **Checkout the active branch**:
   ```bash
   git checkout updates
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

### Running the Development Server

Start Vite on port 3000 with Hot Module Replacement (HMR):
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

Compile optimized static assets to the `dist/` directory:
```bash
npm run build
```

Preview the production build locally:
```bash
npm run preview
```

### Code Quality & Lint Checks

Run the high-speed Rust-based linter:
```bash
npm run lint
```

---

## 🤝 Contribution Guidelines

1. **Branching Strategy**:
   - `main`: Production-ready code.
   - `<feature-or-contributor-branch>`: Feature and development branches.
2. **Commit Standard**: Follow [Conventional Commits](https://www.conventionalcommits.org/):
   - `feat:` for new capabilities.
   - `fix:` for bug fixes.
   - `perf:` for performance optimizations.
   - `style:` for UI/CSS modifications.
   - `docs:` for documentation updates.
3. **Verification**: Always run `npm run lint` and verify build correctness prior to opening a pull request.

---

## 📄 License

Maintained for the **vCloudOps** Community.  
Built by students, for students.
