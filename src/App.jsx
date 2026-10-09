import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { lazy, Suspense, useEffect } from 'react'
import './index.css'
import Home from './pages/Home'
import GlowCursor from './components/GlowCursor'
import { TransitionProvider } from './context/TransitionContext'
import CosmicWarpTransition from './components/CosmicWarpTransition'

const JoinPage = lazy(() => import('./pages/JoinPage'))

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname])
  return null
}

function App() {
  return (
    <BrowserRouter>
      <TransitionProvider>
        <ScrollToTop />
        <CosmicWarpTransition />
        <GlowCursor
          color="#67E8F9"
          secondaryColor="#A78BFA"
          trailLength={40}
          trailWidth={8}
          trailTaper={0.8}
          followSpeed={0.16}
          glowIntensity={1.9}
          glowSpread={1.2}
          hotspot={0.65}
          brightness={1.25}
          opacity={1}
          pulseSpeed={1.1}
          noiseStrength={0.035}
          idleFade
          idleTimeout={700}
          fadeDuration={900}
          blendMode="screen"
          maxDevicePixelRatio={1.25}
          global
        >
          <Suspense fallback={null}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/join" element={<JoinPage />} />
              <Route path="/apply" element={<Navigate to="/join" replace />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </GlowCursor>
      </TransitionProvider>
    </BrowserRouter>
  )
}

export default App
