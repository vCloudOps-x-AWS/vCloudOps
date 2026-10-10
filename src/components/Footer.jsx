import { useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { scrollToTarget, scrollToTop } from '../utils/smoothScroll'
import { usePageTransition } from '../hooks/usePageTransition'
import {
  GithubLogo,
  DiscordLogo,
  LinkedinLogo,
  InstagramLogo,
  EnvelopeSimple,
  MapPin,
  ArrowUpRight,
} from '@phosphor-icons/react'

gsap.registerPlugin(ScrollTrigger)

const QUICK_LINKS = [
  { label: 'Our Mission', href: '#about' },
  { label: 'Events & Workshops', href: '#events' },
  { label: 'Core Leadership', href: '#team' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Apply to Join', href: '/join' },
]

const SOCIAL_LINKS = [
  {
    icon: InstagramLogo,
    label: 'Instagram',
    href: 'https://www.instagram.com/awssbg.vit?utm_source=ig_web_button_share_sheet&rpxt=ZDNlZDc0MzIxNw==',
  },
  {
    icon: LinkedinLogo,
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/company/awssbgvit/home/',
  },
  {
    icon: GithubLogo,
    label: 'GitHub',
    href: 'https://github.com/vCloudOps-x-AWS',
  },
  {
    icon: DiscordLogo,
    label: 'Discord',
    href: 'https://discord.gg/yMZhKMhc2n',
  },
]

export default function Footer() {
  const footerRef = useRef(null)
  const watermarkRef = useRef(null)
  const location = useLocation()
  const { transitionTo } = usePageTransition()
  const isHomePage = location.pathname === '/'

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: watermarkRef.current,
          start: 'top 88%',
          toggleActions: 'restart reverse restart reverse',
        },
      })

      tl.fromTo(
        '.watermark-awssbg',
        { x: -80, opacity: 0 },
        { x: 0, opacity: 1, duration: 1.1, ease: 'power3.out' },
        0
      )
        .fromTo(
          '.watermark-x',
          { y: 45, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.95, ease: 'back.out(1.5)' },
          0.1
        )
        .fromTo(
          '.watermark-vit',
          { x: 80, opacity: 0 },
          { x: 0, opacity: 1, duration: 1.1, ease: 'power3.out' },
          0.15
        )
    },
    { scope: footerRef }
  )

  const handleBackToTop = (e) => {
    e.preventDefault()
    scrollToTop()
  }

  const handleNav = (e, href) => {
    e.preventDefault()
    if (href.startsWith('#')) {
      if (isHomePage) {
        scrollToTarget(href, -85)
      } else {
        transitionTo(`/${href}`)
      }
    } else if (href === '/join' && !isHomePage) {
      scrollToTop()
    } else {
      transitionTo(href)
    }
  }

  return (
    <footer ref={footerRef} className="relative z-10 pt-16 sm:pt-20 md:pt-24 pb-0 overflow-hidden text-left">
      {/* Subtle cosmic background glow behind the card */}
      <div className="absolute top-24 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-r from-sky-500/15 via-blue-600/10 to-indigo-500/15 rounded-full blur-[130px] pointer-events-none -z-10" />

      {/* Floating Island Footer Card */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="relative rounded-[2rem] sm:rounded-[2.5rem] bg-[#050B18]/90 border border-white/10 backdrop-blur-2xl p-6 sm:p-10 md:p-12 shadow-[0_24px_70px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.12)]">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10">
            {/* Column 1: Brand & Mission & Socials (md:col-span-5) */}
            <div className="md:col-span-5 flex flex-col justify-between">
              <div>
                {/* Logo & Brand */}
                <a
                  href={isHomePage ? '#home' : '/'}
                  onClick={(e) => handleNav(e, '#home')}
                  className="inline-flex items-center gap-2.5 mb-4 group cursor-pointer select-none"
                >
                  <img
                    src="/Logo/aws-logo-white.png"
                    alt="AWS SBG Logo"
                    className="h-8 w-auto object-contain drop-shadow-[0_0_12px_rgba(255,153,0,0.5)] group-hover:scale-105 transition-transform"
                  />
                  <span className="font-extrabold text-white text-2xl tracking-tight">
                    AWS <span className="text-amber-400">SBG</span> <span className="text-white/60 font-semibold text-xl mx-1">x</span> <span className="text-sky-400">VIT</span>
                  </span>
                </a>

                {/* Description */}
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md mb-6 font-normal">
                  AWS SBG x VIT is a student-led engineering collective passionate about cloud architecture, DevOps pipelines, container systems, and open-source infrastructure. Empowering student builders, one deployment at a time.
                </p>
              </div>

              {/* Social Icons row matching GDG style */}
              <div className="flex items-center gap-3">
                {SOCIAL_LINKS.map(({ icon: Icon, label, href }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                    className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 hover:border-sky-400/30 hover:scale-105 transition-all duration-200"
                  >
                    <Icon weight="bold" className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Column 2: Quick Links (md:col-span-3) */}
            <div className="md:col-span-3 text-left">
              <h3 className="font-bold text-white text-sm sm:text-base tracking-tight mb-4">
                Quick Links
              </h3>
              <ul className="flex flex-col gap-2.5 list-none p-0 m-0">
                {QUICK_LINKS.map(({ label, href }) => (
                  <li key={label}>
                    <a
                      href={href}
                      onClick={(e) => handleNav(e, href)}
                      className="text-xs sm:text-sm text-slate-400 hover:text-sky-300 transition-colors inline-block"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Contact Us (md:col-span-4) */}
            <div className="md:col-span-4 text-left">
              <h3 className="font-bold text-white text-sm sm:text-base tracking-tight mb-4">
                Contact Us
              </h3>
              <div className="flex flex-col gap-4">
                {/* Email */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-400/20 flex items-center justify-center shrink-0 mt-0.5">
                    <EnvelopeSimple weight="duotone" className="w-4 h-4 text-sky-400" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block">
                      Email
                    </span>
                    <a
                      href="mailto:vcloudops@vit.edu"
                      className="text-xs sm:text-sm text-slate-200 hover:text-sky-400 transition-colors whitespace-nowrap"
                    >
                      vcloudops@vit.edu
                    </a>
                  </div>
                </div>

                {/* Campus Location */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-400/20 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin weight="duotone" className="w-4 h-4 text-sky-400" />
                  </div>
                  <div>
                    <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block">
                      Campus
                    </span>
                    <span className="text-xs sm:text-sm text-slate-200">
                      VIT Pune · Bibwewadi
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card Bottom Divider & Copyright */}
          <div className="mt-8 sm:mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-400">
            <p className="text-center sm:text-left">
              © {new Date().getFullYear()} AWS SBG x VIT. All rights reserved.
            </p>
            <button
              type="button"
              onClick={handleBackToTop}
              className="inline-flex items-center gap-1.5 text-slate-400 hover:text-sky-400 transition-colors cursor-pointer select-none"
            >
              <span>Back to top</span>
              <ArrowUpRight weight="bold" className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Giant Typographic Watermark Below Footer ── */}
      <div
        ref={watermarkRef}
        className="relative w-full overflow-hidden flex items-center justify-center pt-8 sm:pt-12 md:pt-14 pb-0 select-none pointer-events-none"
      >
        <span
          className="font-black tracking-tight text-center whitespace-nowrap leading-none select-none pointer-events-none drop-shadow-[0_0_35px_rgba(255,153,0,0.08)] inline-flex items-center justify-center"
          style={{ fontSize: 'clamp(2.75rem, 11vw, 11rem)', letterSpacing: '-0.04em' }}
        >
          <span className="watermark-awssbg inline-flex items-center">
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white/65 via-white/35 to-white/5 mr-[0.2em]">
              AWS
            </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-amber-400/90 via-orange-400/50 to-amber-500/10">
              SBG
            </span>
          </span>
          <span className="watermark-x inline-block text-transparent bg-clip-text bg-gradient-to-b from-white/45 via-white/20 to-transparent mx-[0.22em]">
            x
          </span>
          <span className="watermark-vit inline-block text-transparent bg-clip-text bg-gradient-to-b from-sky-400/85 via-sky-400/45 to-sky-400/10">
            VIT
          </span>
        </span>
      </div>
    </footer>
  )
}
