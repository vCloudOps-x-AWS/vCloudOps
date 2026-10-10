import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, GithubLogo, InstagramLogo, LinkedinLogo, X } from '@phosphor-icons/react'
import { createPortal } from 'react-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { getLenis } from '../utils/smoothScroll'
import { wheelGestureDirection } from '../utils/wheelGesture'
import { startTouchGesture, touchGestureDelta } from '../utils/touchGesture'
import './TeamSection.css'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const MEMBERS = [
  { id: 'aditya-katare', name: 'Aditya Katare', role: 'President', domain: 'Core leadership', github: 'https://github.com/ADITYA-K-07', linkedin: 'https://www.linkedin.com/in/aditya-katare-873a56385', instagram: 'https://www.instagram.com/being_adiiiiiii?stkn=ODI5c2NsdjVzOHdy&utm_source=qr', accent: '#4aa9db', portrait: '/team-members/roster/aditya-katare.png' },
  { id: 'aryan-khade', name: 'Aryan Khade', role: 'Vice President', domain: 'Core leadership', github: 'https://github.com/Aryan886', linkedin: 'https://www.linkedin.com/in/aryankhade005', accent: '#4aa9db', portrait: '/team-members/roster/aryan-khade.jpeg' },
  { id: 'mrugesh-kulkarni', name: 'Mrugesh Kulkarni', role: 'Head', domain: 'Cloud', github: 'https://github.com/Pixel-Stock', linkedin: 'https://www.linkedin.com/in/mrugeshkulkarni/', instagram: 'https://www.instagram.com/its.mrugesh/', accent: '#57c7ff', portrait: '/team-members/roster/mrugesh-kulkarni.png' },
  { id: 'anup-dubey', name: 'Anup Dubey', role: 'Co-Head', domain: 'Cloud', github: 'https://github.com/Anup1dubey', linkedin: 'https://www.linkedin.com/in/anup-dubey-646433328/', instagram: 'https://www.instagram.com/anup1dubey/?hl=en', accent: '#57c7ff', portrait: '/team-members/roster/anup-dubey.png' },
  { id: 'pranav-amdekar', name: 'Pranav Amdekar', role: 'Co-Head', domain: 'Cloud', github: 'https://github.com/0xprxnav', linkedin: 'https://www.linkedin.com/in/pranav-amdekar-04b304386', accent: '#57c7ff', portrait: '/team-members/roster/pranav-amdekar.png' },
  { id: 'ishani-bharsakade', name: 'Ishani Bharsakade', role: 'Co-Head', domain: 'Finance & Sponsorship', github: 'https://github.com/RealSpidey69', linkedin: 'https://www.linkedin.com/in/ishani-bharsakade-3a1866229/', instagram: 'https://www.instagram.com/seriously_ish/', accent: '#a98bff', portrait: '/team-members/roster/ishani-bharsakade.png' },
  { id: 'govind-agrawal', name: 'Govind Agrawal', role: 'Co-Head', domain: 'Finance & Sponsorship', linkedin: 'https://www.linkedin.com/in/govind-agrawal-a85806384', accent: '#a98bff', portrait: '/team-members/roster/govind-agrawal.png' },
  { id: 'krishna-gangshettiwar', name: 'Krishna Gangshettiwar', role: 'Co-Head', domain: 'Finance & Sponsorship', github: 'https://github.com/Krishna5670', linkedin: 'https://www.linkedin.com/in/krishna-gangshettiwar-198a5a385', accent: '#a98bff', portrait: '/team-members/roster/krishna-gangshettiwar.png' },
  { id: 'satyajit-gaikwad', name: 'Satyajit Gaikwad', role: 'Head', domain: 'Web Development', github: 'https://github.com/CodeBySatyajit', linkedin: 'https://www.linkedin.com/in/satyajit-gaikwad-092381372/', instagram: 'https://www.instagram.com/itz_satyajit._07/', accent: '#6b9cff', portrait: '/team-members/roster/satyajit-gaikwad.png' },
  { id: 'tanushka-patil', name: 'Tanushka Patil', role: 'Co-Head', domain: 'Web Development', github: 'https://github.com/Tanushka-sp2007', linkedin: 'https://www.linkedin.com/in/tanushka-sunil-patil-a87090389', accent: '#6b9cff', portrait: '/team-members/roster/tanushka-patil.png' },
  { id: 'aryan-durgude', name: 'Aryan Durgude', role: 'Head', domain: 'Multimedia', github: 'https://github.com/NotAl2', linkedin: 'https://www.linkedin.com/in/aryan-durgude-777816385', instagram: 'https://www.instagram.com/not.al2?stkn=aG1pdHBiMGowbjJx', accent: '#36d9c4', portrait: '/team-members/roster/aryan-durgude.png' },
  { id: 'harsh-chendwankar', name: 'Harsh Chendwankar', role: 'Co-Head', domain: 'Multimedia', github: 'https://github.com/Harsh20-06', linkedin: 'https://www.linkedin.com/in/harsh-chendwankar', instagram: 'https://www.instagram.com/harsh_chendwankar?stkn=cWd6aGRjMm5xdnAz&utm_source=qr', accent: '#36d9c4', portrait: '/team-members/roster/harsh-chendwankar.png' },
  { id: 'vaishnavi-bhagwat', name: 'Vaishnavi Bhagwat', role: 'Co-Head', domain: 'Multimedia', github: 'https://github.com/vaishnavibhagwat', linkedin: 'https://www.linkedin.com/in/vaishnavi-bhagwat-509a5037a', instagram: 'https://www.instagram.com/v_are_aesthetic?stkn=dWtmYms5NHY4ZmFl&utm_source=qr', accent: '#36d9c4', portrait: '/team-members/roster/vaishnavi-bhagwat.png' },
  { id: 'naisha-sahni', name: 'Naisha Sahni', role: 'Co-Head', domain: 'Multimedia', github: 'https://github.com/naishasahni', accent: '#36d9c4', portrait: '/team-members/roster/naisha-sahni.png' },
  { id: 'sanskar-babar', name: 'Sanskar Babar', role: 'Video Editor', domain: 'Multimedia', github: 'https://github.com/sanskarbabar', linkedin: 'https://www.linkedin.com/in/sanskar-babar-1079021b9', accent: '#36d9c4', portrait: '/team-members/roster/sanskar-babar.jpeg' },
  { id: 'jiteesh-ghodke', name: 'Jiteesh Ghodke', role: 'Co-Head', domain: 'Competitive Programming', github: 'https://github.com/jiteeshghodke456-del', linkedin: 'https://www.linkedin.com/in/jiteesh-ghodke-642832398', instagram: 'https://instagram.com/jiteez._?stkn=MXg1aHJuaG5qN2o1Mg%3D%3D', accent: '#58d8e8', portrait: '/team-members/roster/jiteesh-ghodke.png' },
  { id: 'jayesh-khandelwal', name: 'Jayesh Khandelwal', role: 'Co-Head', domain: 'Competitive Programming', github: 'https://github.com/itsjayeshk', linkedin: 'https://www.linkedin.com/in/jayesh-khandelwal-vit', accent: '#58d8e8', portrait: '/team-members/roster/jayesh-khandelwal.png' },
  { id: 'manthan-devi', name: 'Manthan Devi', role: 'Co-Head', domain: 'Competitive Programming', github: 'https://github.com/coder-manthan-007', linkedin: 'https://www.linkedin.com/in/manthan-devi-8764a3386/', instagram: 'https://www.instagram.com/devimanthan/', accent: '#58d8e8', portrait: '/team-members/roster/manthan-devi.png' },
  { id: 'vipul-bangar', name: 'Vipul Bangar', role: 'Co-Head', domain: 'Operations', github: 'https://github.com/thevipulbangar', linkedin: 'https://www.linkedin.com/in/vipul-bangar-8a4a9937b/', accent: '#f6b75d', portrait: '/team-members/roster/vipul-bangar.png' },
  { id: 'aryaan-antarkar', name: 'Aryaan Antarkar', role: 'Co-Head', domain: 'Operations', github: 'https://github.com/aryaanantarkar-byte', linkedin: 'https://www.linkedin.com/in/aryaan-antarkar-74565b386/', instagram: 'https://www.instagram.com/vvant0394/', accent: '#f6b75d', portrait: '/team-members/roster/aryaan-antarkar.png' },
  { id: 'sanskar-dhonde', name: 'Sanskar Dhonde', role: 'Head', domain: 'App Development', github: 'https://github.com/dhonde290-netizen', linkedin: 'https://www.linkedin.com/in/sanskardhonde/', accent: '#ff8fbd', portrait: '/team-members/roster/sanskar-dhonde.png' },
  { id: 'arnav-agarwal', name: 'Arnav Agarwal', role: 'Co-Head', domain: 'App Development', github: 'https://github.com/Arnav-Code-hub', linkedin: 'https://www.linkedin.com/in/arnav-agarwal-727323375', accent: '#ff8fbd', portrait: '/team-members/roster/arnav-agarwal.png' },
  { id: 'sara-tamboli', name: 'Sara Tamboli', role: 'Co-Head', domain: 'App Development', github: 'https://github.com/TamboliSara', linkedin: 'https://www.linkedin.com/in/sara-tamboli-bb0823385/', accent: '#ff8fbd', portrait: '/team-members/roster/sara-tamboli.png' },
  { id: 'srushti-saner', name: 'Srushti Saner', role: 'Co-Head', domain: 'App Development', github: 'https://github.com/srushtisaner06-ops', linkedin: 'https://www.linkedin.com/in/srushti-saner-b7b55422a', instagram: 'https://www.instagram.com/nisarga_sru/?hl=en', accent: '#ff8fbd', portrait: '/team-members/roster/srushti-saner.png' },
  { id: 'raghav-kumar', name: 'Raghav Kumar', role: 'Head', domain: 'AI/ML', github: 'https://github.com/Raghs3', linkedin: 'https://www.linkedin.com/in/raghav-kumar2803', instagram: 'https://www.instagram.com/_raghs3', accent: '#b3a0ff', portrait: '/team-members/roster/raghav-kumar.png' },
  { id: 'anand-nair', name: 'Anand Nair', role: 'Co-Head', domain: 'AI/ML', github: 'https://github.com/Dazzanova', linkedin: 'https://www.linkedin.com/in/heyy-anand-here', accent: '#b3a0ff', portrait: '/team-members/roster/anand-nair.png' },
  { id: 'varad-takale', name: 'Varad Takale', role: 'Head', domain: 'Publicity and Outreach', github: 'https://github.com/varadtakale45-sudo', linkedin: 'https://www.linkedin.com/in/varad-takale-189967378', instagram: 'https://www.instagram.com/varad.takale55?stkn=aWYxcjcyMjVpNWJx&utm_source=qr', accent: '#7ce4a5', portrait: '/team-members/roster/varad-takale.png' },
  { id: 'shubham-jadhav', name: 'Shubham Jadhav', role: 'Head', domain: 'Publicity and Outreach', github: 'https://github.com/Shoya0002', linkedin: 'https://www.linkedin.com/in/shubham-jadhav-2615093b6', instagram: 'https://www.instagram.com/shoya_0002?stkn=a2kxdGR3NnZrczk4', accent: '#7ce4a5', portrait: '/team-members/roster/shubham-jadhav.png' },
  { id: 'harsh-kukade', name: 'Harsh Kukade', role: 'Co-Head', domain: 'Publicity and Outreach', github: 'https://github.com/Harsh150707', linkedin: 'https://www.linkedin.com/in/harsh-kukade-83b81a385', instagram: 'https://www.instagram.com/harsh_150707?stkn=MTl3N3V3dnplZ2hmZg==', accent: '#7ce4a5', portrait: '/team-members/roster/harsh-kukade.png' },
  { id: 'parth-birari', name: 'Parth Birari', role: 'Co-Head', domain: 'Publicity and Outreach', github: 'https://github.com/birariparth-ui', linkedin: 'https://www.linkedin.com/in/parth-birari-07344b383', instagram: 'https://www.instagram.com/birariparth?stkn=NGR3NGQ2YTR6Zmxt', accent: '#7ce4a5', portrait: '/team-members/roster/parth-birari.png' },
]

const TEAMS = [
  { id: 'core', label: 'Core leadership', color: '#4aa9db', members: MEMBERS.filter((member) => member.domain === 'Core leadership') },
  { id: 'cloud', label: 'Cloud', color: '#57c7ff', logo: '/team-logos/cloud.png', members: MEMBERS.filter((member) => member.domain === 'Cloud') },
  { id: 'delivery', label: 'Finance & Sponsorship', color: '#a98bff', logo: '/team-logos/finance.png', members: MEMBERS.filter((member) => member.domain === 'Finance & Sponsorship') },
  { id: 'platform', label: 'Web Development', color: '#6b9cff', logo: '/team-logos/web-development.png', members: MEMBERS.filter((member) => member.domain === 'Web Development') },
  { id: 'security', label: 'Multimedia', color: '#36d9c4', logo: '/team-logos/multimedia.png', members: MEMBERS.filter((member) => member.domain === 'Multimedia') },
  { id: 'containers', label: 'Competitive Programming', color: '#58d8e8', logo: '/team-logos/competitive-programming.png', members: MEMBERS.filter((member) => member.domain === 'Competitive Programming') },
  { id: 'automation', label: 'Operations', color: '#f6b75d', logo: '/team-logos/operations.png', members: MEMBERS.filter((member) => member.domain === 'Operations') },
  { id: 'labs', label: 'App Development', color: '#ff8fbd', logo: '/team-logos/app-development.png', members: MEMBERS.filter((member) => member.domain === 'App Development') },
  { id: 'opensource', label: 'AI/ML', color: '#b3a0ff', logo: '/team-logos/ai-ml.png', members: MEMBERS.filter((member) => member.domain === 'AI/ML') },
  { id: 'community', label: 'Publicity and Outreach', color: '#7ce4a5', logo: '/team-logos/publicity.png', members: MEMBERS.filter((member) => member.domain === 'Publicity and Outreach') },
]

const AUTO_OPEN_DELAY = 900
const CARD_TRANSITION_MS = 620
const CLOSE_TRANSITION_MS = 520
const DOMAIN_TRANSITION_MS = 620
const PIN_EDGE_INSET = 32
const DOMAIN_BOX_WIDTH = 260
const DOMAIN_GAP = 52

function PlanetFace({ color, label, variant = 'default' }) {
  const rawId = useId()
  const id = rawId.replace(/:/g, '')
  if (variant === 'core') {
    return (
      <svg className="team-planet-image team-planet-image--core" viewBox="0 0 123 85" role="img" aria-label={`${label} planet`}>
        <defs>
          <radialGradient id={`core-glow-${id}`} cx="50%" cy="50%" r="50%"><stop stopColor="#83eaff" stopOpacity=".55" /><stop offset="1" stopColor="#1b7cff" stopOpacity="0" /></radialGradient>
          <linearGradient id={`core-orbit-${id}`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#20206c" /><stop offset=".52" stopColor="#61e5ff" /><stop offset="1" stopColor="#17145e" /></linearGradient>
        </defs>
        <circle cx="61.5" cy="42.5" r="34" fill={`url(#core-glow-${id})`} />
        <ellipse cx="61.5" cy="42.5" rx="24" ry="12" fill="none" stroke={`url(#core-orbit-${id})`} strokeWidth="2.2" transform="rotate(39 61.5 42.5)" />
        <ellipse cx="61.5" cy="42.5" rx="24" ry="12" fill="none" stroke="#2c237c" strokeWidth="2.1" transform="rotate(-39 61.5 42.5)" />
        <circle cx="61.5" cy="42.5" r="18" fill="#172267" stroke="#6bdfff" strokeWidth="1.1" />
        <path d="M61.5 25.5 66 37.8l12.2 4.7L66 47l-4.5 12.5L57 47l-12.2-4.5L57 37.8z" fill="#b7f8ff" stroke="#6bdaff" strokeWidth=".8" />
        <circle cx="43" cy="29" r="3.4" fill="#1bbcff" stroke="#122d80" strokeWidth="1.4" />
        <circle cx="81" cy="25" r="3.4" fill="#b8f5ff" stroke="#122d80" strokeWidth="1.4" />
        <circle cx="44" cy="56" r="3.4" fill="#5fe0ff" stroke="#122d80" strokeWidth="1.4" />
        <circle cx="70" cy="59" r="3.4" fill="#19bfff" stroke="#122d80" strokeWidth="1.4" />
      </svg>
    )
  }
  return (
    <svg className="team-planet-image" viewBox="0 0 123 85" role="img" aria-label={`${label} planet`} style={{ '--planet-accent': color }}>
      <defs>
        <radialGradient id={`team-planet-${id}`} cx="34%" cy="27%" r="72%"><stop stopColor="#8be8ff" /><stop offset=".46" stopColor="#1b9dce" /><stop offset="1" stopColor="#071a4b" /></radialGradient>
        <linearGradient id={`team-rim-${id}`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#d2f8ff" /><stop offset=".6" stopColor="#4bc8ef" /><stop offset="1" stopColor="#0d386c" /></linearGradient>
        <clipPath id={`team-clip-${id}`}><circle cx="62" cy="42" r="20" /></clipPath>
      </defs>
      <ellipse cx="62" cy="42" rx="43" ry="13" fill="none" stroke="#62dfff" strokeWidth="1.5" opacity=".85" transform="rotate(-8 62 42)" />
      <circle cx="62" cy="42" r="23" fill="#37c9f7" opacity=".12" />
      <circle cx="62" cy="42" r="20" fill={`url(#team-planet-${id})`} stroke={`url(#team-rim-${id})`} strokeWidth="1.2" />
      <g clipPath={`url(#team-clip-${id})`} opacity=".72">
        <path d="M38 34c14-6 31-5 49 1v5c-17-5-33-5-49 1z" fill="#9aeaff" opacity=".34" />
        <path d="M39 47c16-5 32-4 48 2v5c-17-5-31-5-48 1z" fill="#063d79" opacity=".52" />
        <ellipse cx="53" cy="36" rx="4" ry="2.5" fill="#7ae4ff" opacity=".5" />
        <ellipse cx="70" cy="49" rx="3.4" ry="2" fill="#062d62" opacity=".7" />
        <path d="M44 55c10-4 23-4 35 0" stroke="#baf3ff" strokeWidth="1" opacity=".45" />
      </g>
      <path d="M20 47c20 9 63 11 84-5" fill="none" stroke="#75e5ff" strokeWidth="1.7" opacity=".9" transform="rotate(-8 62 42)" />
    </svg>
  )
}

function DomainBox({ team, onOpen, isCore = false, isOpen = false, tabIndex }) {
  return (
    <button type="button" data-team-id={team.id} className={`team-domain-box ${isCore ? 'is-core' : ''} ${isOpen ? 'is-open' : ''}`} style={{ '--box-accent': team.color }} tabIndex={tabIndex} onClick={(event) => onOpen(team, event.currentTarget, event.currentTarget.querySelector('.team-domain-box__face > *'))} aria-label={`Open ${team.label}`}>
      <span className="team-domain-box__face">{team.logo ? <img className="team-domain-logo" src={team.logo} alt="" /> : <PlanetFace color={team.color} label={team.label} variant={isCore ? 'core' : 'default'} />}</span>
      <span className="team-domain-lens" aria-hidden="true" />
      <span className="team-domain-box__label">{team.label}</span>
    </button>
  )
}

function DomainCarousel({ index, onNavigate, onOpen, locked, selectedTeam }) {
  const viewportRef = useRef(null)
  const [width, setWidth] = useState(0)

  useEffect(() => {
    const viewport = viewportRef.current
    if (!viewport) return
    const resize = () => setWidth(viewport.clientWidth)
    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(viewport)
    return () => observer.disconnect()
  }, [])

  const navigate = useCallback((direction) => {
    if (locked || index + direction < 0 || index + direction >= TEAMS.length) return false
    onNavigate(index + direction, direction)
    return true
  }, [index, locked, onNavigate])

  return (
    <div className="team-domain-carousel" style={{ '--domain-box-width': `${DOMAIN_BOX_WIDTH}px`, '--domain-gap': `${DOMAIN_GAP}px` }}>
      <div ref={viewportRef} className="team-domain-carousel__viewport" aria-label="Team domains carousel">
        <div className="team-domain-carousel__track" style={{ transform: `translate3d(${width / 2 - DOMAIN_BOX_WIDTH / 2 - index * (DOMAIN_BOX_WIDTH + DOMAIN_GAP)}px, 0, 0)` }}>
          {TEAMS.map((team, teamIndex) => {
            const distance = teamIndex - index
            const bend = Math.min(Math.abs(distance), 3)
            return <div key={team.id} className="team-domain-carousel__slide" style={{ '--arch-y': `${bend * bend * 7}px`, '--arch-tilt': `${Math.sign(distance) * -bend * 3}deg`, '--arch-twist': `${Math.sign(distance) * -bend * 6}deg`, '--arch-scale': 1 - bend * .035 }}>
              <DomainBox team={team} onOpen={onOpen} isCore={teamIndex === 0} isOpen={selectedTeam?.id === team.id} tabIndex={teamIndex === index ? 0 : -1} />
            </div>
          })}
        </div>
      </div>
      <div className="team-domain-carousel__caption" aria-live="polite"><span>{TEAMS[index].label}</span><small>{String(index + 1).padStart(2, '0')} / {TEAMS.length}</small></div>
      <div className="team-domain-carousel__controls"><button type="button" onClick={() => navigate(-1)} disabled={locked || index === 0} aria-label="Previous domain"><ArrowLeft aria-hidden="true" />Previous</button><button type="button" onClick={() => navigate(1)} disabled={locked || index === TEAMS.length - 1} aria-label="Next domain">Next<ArrowRight aria-hidden="true" /></button></div>
    </div>
  )
}

function MemberCard({ member, index, active, reduced }) {
  const [portraitFailed, setPortraitFailed] = useState(false)
  const distance = index - active
  const isRear = distance !== 0
  const style = reduced ? { '--card-opacity': isRear ? 0 : 1 } : {
    '--card-x': `${distance * 300}px`,
    '--card-z': `${-Math.abs(distance) * 180}px`,
    '--card-rotate': `${distance > 0 ? Math.min(distance, 1) * 19 : 0}deg`,
    '--card-scale': `${1 - Math.min(Math.abs(distance) * .045, .18)}`,
    '--card-opacity': distance === 0 ? 1 : (Math.abs(distance) === 1 ? .72 : 0),
  }
  return (
    <article className={`team-member-card ${active === index ? 'is-active' : ''} ${isRear ? 'is-rear' : ''}`} style={style} aria-hidden={active !== index}>
      <div className={`team-member-card__portrait${member.portrait ? ' has-image' : ''}`} style={{ '--portrait-accent': member.accent }}>
        {member.portrait && !portraitFailed ? <img className="team-member-portrait-image" src={member.portrait} alt={`${member.name} portrait`} onError={() => setPortraitFailed(true)} /> : null}
        <span className="team-portrait-particles" aria-hidden="true" />
        {!member.portrait || portraitFailed ? <span className="team-member-initial">{member.name.charAt(0)}</span> : null}
        <span className="team-member-index">0{index + 1}</span>
      </div>
      <div className="team-member-card__content">
        <h3>{member.name}</h3>
        <p className="team-member-role">{member.role}</p>
        <p className="team-member-domain">{member.domain}</p>
        <div className="team-member-links">
          {member.github ? <a href={member.github} target="_blank" rel="noreferrer" aria-label={`${member.name} GitHub`}><GithubLogo weight="fill" /></a> : null}
          {member.linkedin ? <a href={member.linkedin} target="_blank" rel="noreferrer" aria-label={`${member.name} LinkedIn`}><LinkedinLogo weight="fill" /></a> : null}
          {member.instagram ? <a href={member.instagram} target="_blank" rel="noreferrer" aria-label={`${member.name} Instagram`}><InstagramLogo weight="fill" /></a> : null}
        </div>
      </div>
    </article>
  )
}

function MemberView({ team, activeIndex, setActiveIndex, onClose, reduced, openerRef, originRect, wheelGestureRef, touchGestureRef }) {
  const viewRef = useRef(null)
  const gestureLock = useRef(!reduced)
  const unlockTimer = useRef(null)
  const closeTimer = useRef(null)
  const activeIndexRef = useRef(activeIndex)
  const closingRef = useRef(false)
  const entranceDoneRef = useRef(reduced)
  const pendingGestureRef = useRef(0)
  const [closing, setClosing] = useState(false)
  const [navigating, setNavigating] = useState(!reduced)
  useEffect(() => { activeIndexRef.current = activeIndex }, [activeIndex])
  useEffect(() => {
    gestureLock.current = !reduced
    // oxlint-disable-next-line react/set-state-in-effect -- Synchronize controls with a changed motion preference.
    setNavigating(!reduced)
    entranceDoneRef.current = reduced
    if (!reduced) unlockTimer.current = window.setTimeout(() => {
      gestureLock.current = false
      setNavigating(false)
      entranceDoneRef.current = true
    }, CARD_TRANSITION_MS)
    return () => { if (unlockTimer.current) window.clearTimeout(unlockTimer.current) }
  }, [reduced])

  const close = useCallback((reason = 'completed', direction) => {
    if (closingRef.current) return
    if (unlockTimer.current) window.clearTimeout(unlockTimer.current)
    pendingGestureRef.current = 0
    touchGestureRef.current = null
    closingRef.current = true
    if (reduced) {
      onClose(reason, direction)
      return
    }
    const view = viewRef.current
    const carousel = view?.querySelector('.team-carousel')
    if (view && carousel) {
      const carouselStyle = window.getComputedStyle(carousel)
      view.style.setProperty('--exit-opacity', window.getComputedStyle(view).opacity)
      view.style.setProperty('--exit-card-opacity', carouselStyle.opacity)
      view.style.setProperty('--exit-transform', carouselStyle.transform)
    }
    setClosing(true)
    closeTimer.current = window.setTimeout(() => onClose(reason, direction), CLOSE_TRANSITION_MS)
  }, [onClose, reduced, touchGestureRef])

  const move = useCallback(function moveMember(direction) {
    if (closingRef.current || gestureLock.current) return
    gestureLock.current = true
    setNavigating(true)
    const current = activeIndexRef.current
    if (direction > 0 && current < team.members.length - 1) {
      setActiveIndex((index) => index + 1)
    } else if (direction < 0 && current > 0) {
      setActiveIndex((index) => index - 1)
    } else if (direction < 0 && current === 0) {
      close('completed', direction)
      return
    } else {
      close('completed', direction)
      return
    }
    unlockTimer.current = window.setTimeout(() => {
      gestureLock.current = false
      setNavigating(false)
      const pending = pendingGestureRef.current
      pendingGestureRef.current = 0
      if (pending) moveMember(pending)
    }, reduced ? 40 : CARD_TRANSITION_MS)
  }, [close, reduced, setActiveIndex, team.members.length])

  useEffect(() => {
    const html = document.documentElement
    const body = document.body
    const lenis = getLenis()
    const lenisWasStopped = Boolean(lenis?.isStopped)
    const saved = {
      htmlOverflow: html.style.overflow,
      bodyOverflow: body.style.overflow,
    }
    const savedFocus = document.activeElement
    const focusTarget = openerRef.current
    // Stop Lenis before locking overflow. Native scroll position remains
    // untouched, so closing does not need to call window.scrollTo().
    lenis?.stop()
    html.style.overflow = 'hidden'
    body.style.overflow = 'hidden'
    viewRef.current?.focus({ preventScroll: true })

    const onWheel = (event) => {
      if (event.ctrlKey) return
      const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1
      const deltaY = event.deltaY * unit
      const deltaX = event.deltaX * (event.deltaMode === 2 ? window.innerWidth : unit)
      if (deltaY === 0 && deltaX === 0) return
      event.preventDefault()
      const gesture = wheelGestureRef.current
      const previousDirection = gesture.direction
      const direction = wheelGestureDirection(gesture, deltaY, performance.now(), deltaX)
      if (previousDirection && gesture.direction !== previousDirection) pendingGestureRef.current = 0
      if (closingRef.current) return
      if (!direction) return
      if (gestureLock.current) {
        if (entranceDoneRef.current) pendingGestureRef.current = direction
        return
      }
      move(direction)
    }
    const onTouchStart = (event) => { touchGestureRef.current = startTouchGesture(event.touches) }
    const onTouchMove = (event) => {
      if (event.touches.length !== 1) touchGestureRef.current = null
      touchGestureDelta(touchGestureRef.current, event.touches)
      if (event.cancelable) event.preventDefault()
    }
    const onTouchEnd = (event) => {
      const delta = touchGestureDelta(touchGestureRef.current, event.changedTouches)
      const axis = touchGestureRef.current?.axis
      touchGestureRef.current = null
      if (!delta || !axis || closingRef.current || Math.abs(delta[axis]) < 40) return
      const direction = Math.sign(delta[axis])
      if (gestureLock.current) {
        if (entranceDoneRef.current) pendingGestureRef.current = direction
      } else move(direction)
    }
    const onTouchCancel = () => { touchGestureRef.current = null }
    const onKeyDown = (event) => {
      if (event.key === 'Escape') { event.preventDefault(); close('dismissed'); return }
      if (event.repeat) return
      if (event.key === ' ' && event.target instanceof Element && event.target.closest('button')) return
      const down = ['ArrowDown', 'ArrowRight', 'PageDown'].includes(event.key) || (event.key === ' ' && !event.shiftKey)
      const up = ['ArrowUp', 'ArrowLeft', 'PageUp'].includes(event.key) || (event.key === ' ' && event.shiftKey)
      if (down || up) { event.preventDefault(); move(down ? 1 : -1) }
    }
    const view = viewRef.current
    view?.addEventListener('wheel', onWheel, { passive: false, capture: true })
    view?.addEventListener('touchstart', onTouchStart, { passive: true })
    view?.addEventListener('touchmove', onTouchMove, { passive: false })
    view?.addEventListener('touchend', onTouchEnd, { passive: true })
    view?.addEventListener('touchcancel', onTouchCancel, { passive: true })
    view?.addEventListener('pointercancel', onTouchCancel)
    view?.addEventListener('keydown', onKeyDown)
    return () => {
      if (unlockTimer.current) window.clearTimeout(unlockTimer.current)
      if (closeTimer.current) window.clearTimeout(closeTimer.current)
      view?.removeEventListener('wheel', onWheel, true)
      view?.removeEventListener('touchstart', onTouchStart)
      view?.removeEventListener('touchmove', onTouchMove)
      view?.removeEventListener('touchend', onTouchEnd)
      view?.removeEventListener('touchcancel', onTouchCancel)
      view?.removeEventListener('pointercancel', onTouchCancel)
      touchGestureRef.current = null
      view?.removeEventListener('keydown', onKeyDown)
      html.style.overflow = saved.htmlOverflow
      body.style.overflow = saved.bodyOverflow
      if (lenis && !lenisWasStopped) lenis.start()
      if (savedFocus instanceof HTMLElement) savedFocus.focus({ preventScroll: true })
      else focusTarget?.focus({ preventScroll: true })
    }
  }, [close, move, openerRef, touchGestureRef, wheelGestureRef])

  return (
    <div ref={viewRef} className={`team-member-view ${closing ? 'is-closing' : ''}`} style={{ '--box-accent': team.color, '--card-transition': `${CARD_TRANSITION_MS}ms`, '--close-transition': `${CLOSE_TRANSITION_MS}ms`, '--origin-x': `${originRect?.x ?? window.innerWidth / 2}px`, '--origin-y': `${originRect?.y ?? window.innerHeight / 2}px` }} role="dialog" aria-modal="true" aria-label={`${team.label} members`} tabIndex={-1}>
      <div className="team-member-view__topline"><span>{team.label}</span><button type="button" onClick={() => close('button')} aria-label="Close team members"><X /></button></div>
      <div className="team-carousel" aria-label={`${team.label} member profiles`}>
        {team.members.map((member, index) => <MemberCard key={`${team.id}-${member.id}`} member={member} index={index} active={activeIndex} reduced={reduced} />)}
      </div>
      <div className={`team-orbit-dock ${closing ? 'is-closing' : ''}`} data-team-id={team.id} aria-hidden="true">
        <div className="team-orbit-dock__rings"><span className="team-orbit-dock__slot" /></div>
        <span className="team-orbit-dock__logo">{team.logo ? <img src={team.logo} alt="" /> : <PlanetFace color={team.color} label={team.label} variant={team.id === 'core' ? 'core' : 'default'} />}</span>
        <span className="team-orbit-dock__label">{team.label}</span>
      </div>
      <p className="team-member-view__hint">{team.members.length > 1 ? 'Scroll or swipe to move through the team' : 'Scroll or swipe down to return to the overview'}</p>
      <button type="button" className="team-member-nav team-member-nav--previous" disabled={navigating || closing} onClick={() => move(-1)} aria-label="Previous member"><ArrowLeft aria-hidden="true" /></button>
      <button type="button" className="team-member-nav team-member-nav--next" disabled={navigating || closing} onClick={() => move(1)} aria-label="Next member"><ArrowRight aria-hidden="true" /></button>
    </div>
  )
}

export default function TeamSection() {
  const reduced = useReducedMotion()
  const [webglAvailable] = useState(() => {
    try { return Boolean(document.createElement('canvas').getContext('webgl2')) } catch { return false }
  })
  const carouselEnabled = !reduced && webglAvailable
  const [selectedTeam, setSelectedTeam] = useState(null)
  const [autoOpenDisabled, setAutoOpenDisabled] = useState(false)
  const [originRect, setOriginRect] = useState(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [domainIndex, setDomainIndex] = useState(0)
  const [domainNavigating, setDomainNavigating] = useState(false)
  const domainStepRef = useRef(null)
  const domainIndexRef = useRef(0)
  const openerRef = useRef(null)
  const sectionRef = useRef(null)
  const selectedTeamRef = useRef(null)
  const autoOpenDisabledRef = useRef(false)
  const nextExpectedTeamIdRef = useRef(TEAMS[0].id)
  const autoOpenInFlightRef = useRef(false)
  const automaticallyOpenedTeamRef = useRef(null)
  const sequenceDirectionRef = useRef(1)
  const automaticDirectionRef = useRef(1)
  const autoOpenReadyRef = useRef(true)
  const autoOpenDelayTimerRef = useRef(null)
  const pendingAdjacentTeamIdRef = useRef(null)
  const domainUnlockTimerRef = useRef(null)
  const pendingPinIndexRef = useRef(null)
  const pinAnimationActiveRef = useRef(false)
  const pinTriggerRef = useRef(null)
  const pinActiveRef = useRef(false)
  const domainGestureRef = useRef({ lastAt: -Infinity, direction: 0, distance: 0, consumed: false, lockedUntil: 0, pending: 0 })
  const touchGestureRef = useRef(null)
  const bypassPinUntilRef = useRef(0)
  const pulseTweenRef = useRef(null)
  const pulseStateRef = useRef({ index: 0, played: false, visible: false, readyAt: 0 })
  const stopDomainPulse = useCallback(() => {
    const tween = pulseTweenRef.current
    if (!tween) return
    tween.kill()
    const box = tween.targets()[0]
    box.style.removeProperty('--domain-cue-scale')
    box.style.removeProperty('will-change')
    pulseTweenRef.current = null
  }, [])

  const stopPinMovement = useCallback(() => {
    if (!pinAnimationActiveRef.current) return
    const lenis = getLenis()
    if (lenis) lenis.scrollTo(lenis.scroll, { immediate: true, force: true })
    pinAnimationActiveRef.current = false
  }, [])

  const syncPinPosition = useCallback((index, animated = false, restorePin = false) => {
    const pin = pinTriggerRef.current
    if (!pin || (!pin.isActive && !restorePin)) return
    const progress = index / (TEAMS.length - 1)
    const target = Math.min(pin.end - PIN_EDGE_INSET, Math.max(pin.start + PIN_EDGE_INSET, pin.start + (pin.end - pin.start) * progress))
    const lenis = getLenis()
    pinAnimationActiveRef.current = Boolean(lenis && animated)
    if (lenis) lenis.scrollTo(target, animated ? {
      duration: DOMAIN_TRANSITION_MS / 1000,
      easing: (t) => 1 - (1 - t) ** 3,
      onComplete: () => { pinAnimationActiveRef.current = false },
    } : { immediate: true, force: true })
    else window.scrollTo({ top: target, behavior: 'instant' })
    if (!animated) ScrollTrigger.update()
  }, [])

  const selectDomain = useCallback((index, mode = 'immediate') => {
    if (index !== domainIndexRef.current) {
      stopDomainPulse()
      pulseStateRef.current = { index, played: false, visible: false, readyAt: mode === 'immediate' ? 0 : performance.now() + DOMAIN_TRANSITION_MS }
    }
    domainIndexRef.current = index
    setDomainIndex(index)
    if (mode === 'after-close') pendingPinIndexRef.current = index
    else syncPinPosition(index, mode === 'animated')
  }, [stopDomainPulse, syncPinPosition])

  const cancelQueuedOpening = useCallback(() => {
    stopPinMovement()
    if (autoOpenDelayTimerRef.current) window.clearTimeout(autoOpenDelayTimerRef.current)
    autoOpenDelayTimerRef.current = null
    pendingAdjacentTeamIdRef.current = null
    pendingPinIndexRef.current = null
    domainGestureRef.current.pending = 0
    touchGestureRef.current = null
    if (domainUnlockTimerRef.current) window.clearTimeout(domainUnlockTimerRef.current)
    domainUnlockTimerRef.current = null
    setDomainNavigating(false)
    autoOpenReadyRef.current = true
  }, [stopPinMovement])

  useEffect(() => {
    if (!carouselEnabled) return
    const onLinkClick = (event) => {
      const link = event.target instanceof Element ? event.target.closest('a[href^="#"]') : null
      const target = link?.getAttribute('href')
      if (target === '#team') { bypassPinUntilRef.current = 0; return }
      if (!target) return
      bypassPinUntilRef.current = performance.now() + 2500
      cancelQueuedOpening()
    }
    document.addEventListener('click', onLinkClick, true)
    return () => document.removeEventListener('click', onLinkClick, true)
  }, [cancelQueuedOpening, carouselEnabled])

  useEffect(() => {
    selectedTeamRef.current = selectedTeam
  }, [selectedTeam])

  useEffect(() => {
    if (selectedTeam || pendingPinIndexRef.current == null) return
    const index = pendingPinIndexRef.current
    pendingPinIndexRef.current = null
    const frame = requestAnimationFrame(() => syncPinPosition(index, true, Boolean(pendingAdjacentTeamIdRef.current)))
    return () => cancelAnimationFrame(frame)
  }, [selectedTeam, syncPinPosition])

  const openTeam = useCallback((team, opener, logo, source = 'manual') => {
    if (selectedTeamRef.current) return
    if (source === 'auto') {
      if (
        autoOpenDisabledRef.current ||
        selectedTeamRef.current ||
        autoOpenInFlightRef.current ||
        !autoOpenReadyRef.current ||
        nextExpectedTeamIdRef.current !== team.id
      ) return
      autoOpenInFlightRef.current = true
      autoOpenReadyRef.current = false
      pendingAdjacentTeamIdRef.current = null
      automaticallyOpenedTeamRef.current = team.id
      automaticDirectionRef.current = sequenceDirectionRef.current
    } else {
      cancelQueuedOpening()
      automaticallyOpenedTeamRef.current = null
      // An explicit click starts a new traversal after the previous one was canceled.
      autoOpenDisabledRef.current = false
      setAutoOpenDisabled(false)
    }

    stopDomainPulse()
    pulseStateRef.current.played = true
    pulseStateRef.current.suppressUntil = Infinity
    // Remove the lens transform before measuring the original logo for the dock.
    sectionRef.current.classList.add('has-open-member')
    selectedTeamRef.current = team
    const initialIndex = source === 'auto' && automaticDirectionRef.current < 0
      ? team.members.length - 1
      : 0
    setActiveIndex(initialIndex)
    openerRef.current = opener
    const rect = (logo ?? opener).getBoundingClientRect()
    setOriginRect({ x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 })
    setSelectedTeam(team)
  }, [cancelQueuedOpening, stopDomainPulse])

  const tryOpenExpectedTeam = useCallback((box = null, direction = sequenceDirectionRef.current) => {
    if (
      autoOpenDisabledRef.current ||
      selectedTeamRef.current ||
      autoOpenInFlightRef.current ||
      !autoOpenReadyRef.current ||
      (carouselEnabled && performance.now() < bypassPinUntilRef.current) ||
      sequenceDirectionRef.current !== direction
    ) return

    const expectedTeam = TEAMS.find((team) => team.id === nextExpectedTeamIdRef.current)
    if (carouselEnabled && (!pinActiveRef.current || TEAMS[domainIndexRef.current]?.id !== expectedTeam?.id)) return
    const expectedBox = box?.dataset.teamId === expectedTeam?.id
      ? box
      : sectionRef.current?.querySelector(`[data-team-id="${expectedTeam?.id}"]`)
    if (!expectedTeam || !expectedBox) return

    const rect = expectedBox.getBoundingClientRect()
    const viewportHeight = window.innerHeight
    const carouselRect = carouselEnabled ? sectionRef.current?.querySelector('.team-domain-carousel__viewport')?.getBoundingClientRect() : rect
    if (carouselRect && carouselRect.top <= viewportHeight * .85 && carouselRect.bottom >= viewportHeight * .25) {
      openTeam(expectedTeam, expectedBox, expectedBox.querySelector('.team-domain-box__face > *'), 'auto')
    }
  }, [carouselEnabled, openTeam])

  const navigateDomain = useCallback((index, direction) => {
    if (selectedTeamRef.current) return
    cancelQueuedOpening()
    selectDomain(index, 'animated')
    sequenceDirectionRef.current = direction
    automaticDirectionRef.current = direction
    nextExpectedTeamIdRef.current = TEAMS[index].id
  }, [cancelQueuedOpening, selectDomain])

  useEffect(() => {
    if (!carouselEnabled) return
    const domainGesture = domainGestureRef.current
    const holdQueuedBoundary = (direction) => {
      const index = domainIndexRef.current
      return (index + direction < 0 || index + direction >= TEAMS.length) &&
        pendingAdjacentTeamIdRef.current === TEAMS[index].id
    }
    const step = (direction, fromGesture = false) => {
      const index = domainIndexRef.current
      if (selectedTeamRef.current || performance.now() < bypassPinUntilRef.current || index + direction < 0 || index + direction >= TEAMS.length) return false
      const now = performance.now()
      const gesture = domainGesture
      if (!autoOpenReadyRef.current) return true
      if (now < gesture.lockedUntil) {
        if (fromGesture) gesture.pending = direction
        return false
      }
      gesture.lockedUntil = now + DOMAIN_TRANSITION_MS
      navigateDomain(index + direction, direction)
      setDomainNavigating(true)
      domainUnlockTimerRef.current = window.setTimeout(() => {
        domainUnlockTimerRef.current = null
        setDomainNavigating(false)
        const pending = gesture.pending
        gesture.pending = 0
        if (pending && pinActiveRef.current && !selectedTeamRef.current) step(pending)
      }, DOMAIN_TRANSITION_MS)
      return true
    }
    domainStepRef.current = step
    const onWheel = (event) => {
      const insideCarousel = event.target instanceof Element && Boolean(event.target.closest('.team-domain-carousel'))
      if ((!pinActiveRef.current && !insideCarousel) || selectedTeamRef.current || event.ctrlKey || performance.now() < bypassPinUntilRef.current) return
      const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1
      const dx = event.deltaX * (event.deltaMode === 2 ? window.innerWidth : unit)
      const dy = event.deltaY * unit
      if (!dx && !dy) return
      const now = performance.now()
      const axis = now - domainGesture.lastAt < 180 && domainGesture.axis
        ? domainGesture.axis : Math.abs(dx) > Math.abs(dy) ? 'x' : 'y'
      if (axis === 'y' && !pinActiveRef.current) return
      const direction = Math.sign(axis === 'x' ? dx : dy)
      if (domainIndexRef.current + direction < 0 || domainIndexRef.current + direction >= TEAMS.length) {
        if (axis === 'y' && !holdQueuedBoundary(direction)) return
        event.preventDefault()
        event.stopImmediatePropagation()
        return
      }
      event.preventDefault()
      event.stopImmediatePropagation()
      const gesture = domainGesture
      const previousDirection = gesture.direction
      const intent = wheelGestureDirection(gesture, dy, now, dx)
      if (previousDirection && previousDirection !== gesture.direction) gesture.pending = 0
      if (intent) step(intent, true)
    }
    const onTouchStart = (event) => {
      if (selectedTeamRef.current) return
      const insideCarousel = event.target instanceof Element && Boolean(event.target.closest('.team-domain-carousel'))
      touchGestureRef.current = (pinActiveRef.current || insideCarousel) && performance.now() >= bypassPinUntilRef.current
        ? startTouchGesture(event.touches)
        : null
    }
    const onTouchMove = (event) => {
      if (selectedTeamRef.current) return
      if (event.touches.length !== 1) { touchGestureRef.current = null; return }
      if (pendingAdjacentTeamIdRef.current && event.cancelable) event.preventDefault()
      const delta = touchGestureDelta(touchGestureRef.current, event.touches)
      const axis = touchGestureRef.current?.axis
      if (!delta || !axis || (axis === 'y' && !pinActiveRef.current)) return
      const direction = Math.sign(delta[axis])
      if (axis === 'y' && (domainIndexRef.current + direction < 0 || domainIndexRef.current + direction >= TEAMS.length) && !holdQueuedBoundary(direction)) return
      if (event.cancelable) event.preventDefault()
      event.stopImmediatePropagation()
    }
    const onTouchEnd = (event) => {
      if (selectedTeamRef.current) return
      const delta = touchGestureDelta(touchGestureRef.current, event.changedTouches)
      const axis = touchGestureRef.current?.axis
      touchGestureRef.current = null
      if (delta && axis && (axis === 'x' || pinActiveRef.current) && Math.abs(delta[axis]) >= 40) step(Math.sign(delta[axis]), true)
    }
    const onKeyDown = (event) => {
      const insideCarousel = event.target instanceof Element && Boolean(event.target.closest('.team-domain-carousel'))
      const horizontal = ['ArrowLeft', 'ArrowRight'].includes(event.key)
      if ((!pinActiveRef.current && !(horizontal && insideCarousel)) || selectedTeamRef.current || event.repeat || performance.now() < bypassPinUntilRef.current) return
      if (event.target instanceof HTMLElement && event.target.closest('input, textarea, select, [contenteditable="true"]')) return
      const direction = ['ArrowDown', 'ArrowRight', 'PageDown'].includes(event.key) ? 1 : ['ArrowUp', 'ArrowLeft', 'PageUp'].includes(event.key) ? -1 : 0
      if (!direction) return
      if (domainIndexRef.current + direction < 0 || domainIndexRef.current + direction >= TEAMS.length) {
        if (!horizontal && !holdQueuedBoundary(direction)) return
        event.preventDefault()
        event.stopImmediatePropagation()
        return
      }
      event.preventDefault()
      event.stopImmediatePropagation()
      if (step(direction) && horizontal && event.target instanceof Element && event.target.closest('.team-domain-box')) {
        sectionRef.current.querySelector(`[data-team-id="${TEAMS[domainIndexRef.current].id}"]`)?.focus({ preventScroll: true })
      }
    }
    window.addEventListener('wheel', onWheel, { passive: false, capture: true })
    window.addEventListener('touchstart', onTouchStart, { passive: true, capture: true })
    window.addEventListener('touchmove', onTouchMove, { passive: false, capture: true })
    window.addEventListener('touchend', onTouchEnd, { passive: true, capture: true })
    const onTouchCancel = () => { touchGestureRef.current = null }
    window.addEventListener('touchcancel', onTouchCancel, { passive: true, capture: true })
    window.addEventListener('pointercancel', onTouchCancel, true)
    window.addEventListener('keydown', onKeyDown, true)
    return () => {
      domainStepRef.current = null
      if (domainUnlockTimerRef.current) window.clearTimeout(domainUnlockTimerRef.current)
      domainUnlockTimerRef.current = null
      domainGesture.pending = 0
      touchGestureRef.current = null
      window.removeEventListener('wheel', onWheel, true)
      window.removeEventListener('touchstart', onTouchStart, true)
      window.removeEventListener('touchmove', onTouchMove, true)
      window.removeEventListener('touchend', onTouchEnd, true)
      window.removeEventListener('touchcancel', onTouchCancel, true)
      window.removeEventListener('pointercancel', onTouchCancel, true)
      window.removeEventListener('keydown', onKeyDown, true)
    }
  }, [carouselEnabled, navigateDomain])

  const closeTeam = useCallback((reason = 'completed', direction) => {
    const automaticallyOpenedTeamId = automaticallyOpenedTeamRef.current
    const closingTeamId = selectedTeamRef.current?.id

    if (autoOpenDelayTimerRef.current) {
      window.clearTimeout(autoOpenDelayTimerRef.current)
      autoOpenDelayTimerRef.current = null
    }
    pendingAdjacentTeamIdRef.current = null
    autoOpenReadyRef.current = true

    if (reason === 'button') {
      autoOpenDisabledRef.current = true
      setAutoOpenDisabled(true)
      cancelQueuedOpening()
      if (carouselEnabled && closingTeamId) selectDomain(TEAMS.findIndex((team) => team.id === closingTeamId), 'after-close')
    } else if (automaticallyOpenedTeamId || (reason === 'completed' && closingTeamId && !autoOpenDisabledRef.current && !reduced)) {
      // Dismissal retains its existing sequence behavior; only completed
      // traversal changes direction based on the final member gesture.
      const completionDirection = reason === 'completed' ? direction : automaticDirectionRef.current
      if (reason === 'completed') {
        sequenceDirectionRef.current = completionDirection
        automaticDirectionRef.current = completionDirection
      }
      const currentIndex = TEAMS.findIndex((team) => team.id === closingTeamId)
      const nextTeam = TEAMS[currentIndex + completionDirection]
      nextExpectedTeamIdRef.current = nextTeam?.id ?? null
      if (carouselEnabled && nextTeam && !autoOpenDisabledRef.current) pendingAdjacentTeamIdRef.current = nextTeam.id
      if (carouselEnabled && nextTeam) selectDomain(currentIndex + completionDirection, 'after-close')
      if (nextTeam && !autoOpenDisabledRef.current) {
        autoOpenReadyRef.current = false
        autoOpenDelayTimerRef.current = window.setTimeout(() => {
          autoOpenDelayTimerRef.current = null
          autoOpenReadyRef.current = true
          tryOpenExpectedTeam(null, completionDirection)
          pendingAdjacentTeamIdRef.current = null
        }, AUTO_OPEN_DELAY)
      }
    } else if (carouselEnabled && closingTeamId) {
      selectDomain(TEAMS.findIndex((team) => team.id === closingTeamId), 'after-close')
    }

    automaticallyOpenedTeamRef.current = null
    autoOpenInFlightRef.current = false
    if (!pendingAdjacentTeamIdRef.current) {
      pulseStateRef.current.played = true
      pulseStateRef.current.suppressUntil = performance.now() + DOMAIN_TRANSITION_MS + 250
    }
    selectedTeamRef.current = null
    setSelectedTeam(null)
  }, [cancelQueuedOpening, carouselEnabled, reduced, selectDomain, tryOpenExpectedTeam])

  useEffect(() => () => {
    if (autoOpenDelayTimerRef.current) window.clearTimeout(autoOpenDelayTimerRef.current)
  }, [])

  useGSAP((context, contextSafe) => {
    if (!carouselEnabled || selectedTeam) return
    const box = sectionRef.current.querySelector(`[data-team-id="${TEAMS[domainIndex].id}"]`)
    const state = pulseStateRef.current
    let timer = null
    let suppressReentryUntil = performance.now() + 100
    const suppressRefresh = () => { suppressReentryUntil = performance.now() + 250 }
    const start = contextSafe(() => {
      timer = null
      if (state.played || selectedTeamRef.current || domainIndexRef.current !== state.index) return
      const rect = box.getBoundingClientRect()
      const visibleWidth = Math.max(0, Math.min(rect.right, window.innerWidth) - Math.max(rect.left, 0))
      const visibleHeight = Math.max(0, Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0))
      if (visibleWidth * visibleHeight < rect.width * rect.height * .55) return
      state.played = true
      box.style.willChange = 'scale'
      pulseTweenRef.current = gsap.to(box, {
        '--domain-cue-scale': 1.055, duration: .4375, repeat: -1, yoyo: true,
        ease: 'sine.inOut',
      })
    })
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) {
        if (state.visible && performance.now() >= Math.max(suppressReentryUntil, state.suppressUntil ?? 0)) state.played = false
        state.visible = false
        if (timer !== null) window.clearTimeout(timer)
        timer = null
        stopDomainPulse()
      } else {
        state.visible = true
        if (entry.intersectionRatio >= .55 && !state.played && timer === null) {
          const wait = Math.max(0, state.readyAt - performance.now())
          if (wait) timer = window.setTimeout(start, wait)
          else start()
        }
      }
    }, { threshold: [0, .55] })
    observer.observe(box)
    window.addEventListener('resize', suppressRefresh)
    ScrollTrigger.addEventListener('refreshInit', suppressRefresh)
    return () => {
      observer.disconnect()
      if (timer !== null) window.clearTimeout(timer)
      window.removeEventListener('resize', suppressRefresh)
      ScrollTrigger.removeEventListener('refreshInit', suppressRefresh)
      stopDomainPulse()
    }
  }, { scope: sectionRef, dependencies: [carouselEnabled, domainIndex, selectedTeam], revertOnUpdate: true })

  useGSAP(() => {
    const media = gsap.matchMedia()
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const boxes = sectionRef.current.querySelectorAll('.team-domain-box')
      const reveal = gsap.timeline({ paused: true })
        .fromTo('.team-header > *', { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: .5, stagger: .08, ease: 'power2.out' }, 0)
        .fromTo(boxes, { opacity: 0 }, { opacity: 1, duration: .4, stagger: .035, ease: 'power2.out' }, .15)

      const cancelEntry = () => cancelQueuedOpening()
      const restorePendingPin = (self) => {
        pinActiveRef.current = false
        if (!pendingAdjacentTeamIdRef.current || performance.now() < bypassPinUntilRef.current) {
          cancelEntry()
          return
        }
        requestAnimationFrame(() => {
          if (pinTriggerRef.current === self && pendingAdjacentTeamIdRef.current) {
            syncPinPosition(domainIndexRef.current, false, true)
          }
        })
      }
      const enterSection = (direction, initialIndex = direction > 0 ? 0 : TEAMS.length - 1) => {
        cancelEntry()
        if (selectedTeamRef.current || performance.now() < bypassPinUntilRef.current) return
        sequenceDirectionRef.current = direction
        automaticDirectionRef.current = direction
        if (carouselEnabled) selectDomain(initialIndex)
        nextExpectedTeamIdRef.current = TEAMS[initialIndex].id
      }
      ScrollTrigger.create({ trigger: sectionRef.current.querySelector('.team-header'), start: 'top 90%', onEnter: () => reveal.restart(), onEnterBack: () => reveal.restart() })
      const pinTarget = sectionRef.current.querySelector('.team-domain-carousel')
      const trigger = ScrollTrigger.create(carouselEnabled ? {
        trigger: pinTarget,
        pin: pinTarget,
        pinSpacing: true,
        anticipatePin: 1,
        start: 'center center',
        end: () => `+=${Math.max(window.innerHeight * .75, 500) * (TEAMS.length - 1)}`,
        invalidateOnRefresh: true,
        onEnter: () => { pinActiveRef.current = true; if (!ScrollTrigger.isRefreshing && !selectedTeamRef.current && !pendingAdjacentTeamIdRef.current) enterSection(1) },
        onEnterBack: () => { pinActiveRef.current = true; if (!ScrollTrigger.isRefreshing && !selectedTeamRef.current && !pendingAdjacentTeamIdRef.current) enterSection(-1) },
        onLeave: restorePendingPin,
        onLeaveBack: restorePendingPin,
        onRefresh: (self) => {
          pinTriggerRef.current = self
          pinActiveRef.current = self.isActive
          if (self.isActive || selectedTeamRef.current || pendingAdjacentTeamIdRef.current) requestAnimationFrame(() => {
            if (pinTriggerRef.current === self && (selectedTeamRef.current || pendingAdjacentTeamIdRef.current || (self.isActive && pendingPinIndexRef.current == null))) {
              syncPinPosition(domainIndexRef.current, false, Boolean(selectedTeamRef.current || pendingAdjacentTeamIdRef.current))
            }
          })
        },
      } : {
        trigger: sectionRef.current,
        start: 'top 85%',
        end: 'bottom 25%',
        onEnter: () => enterSection(1),
        onEnterBack: () => enterSection(-1),
        onLeave: cancelEntry,
        onLeaveBack: cancelEntry,
      })
      if (carouselEnabled) pinTriggerRef.current = trigger

      if (!carouselEnabled) boxes.forEach((box) => {
        gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: box,
            start: 'top 85%',
            end: 'bottom 25%',
            scrub: true,
          },
        })
          .fromTo(box, { '--lens-sweep': '-40%' }, { '--lens-sweep': '140%', duration: 1 }, 0)
          .fromTo(box, { '--lens-strength': 0, '--lens-tilt': '0deg' }, { '--lens-strength': 1, '--lens-tilt': '6deg', duration: .5 }, 0)
          .to(box, { '--lens-strength': 0, '--lens-tilt': '0deg', duration: .5 }, .5)
      })

      return () => {
        cancelEntry()
        pinTriggerRef.current = null
        pinActiveRef.current = false
      }
    })
    return () => media.revert()
  }, { scope: sectionRef, dependencies: [carouselEnabled], revertOnUpdate: true })

  return (
    <section ref={sectionRef} id="team" className={`team-section${carouselEnabled ? ' has-domain-carousel' : ''}${selectedTeam ? ' has-open-member' : ''}`} data-auto-open-disabled={autoOpenDisabled ? 'true' : undefined} aria-labelledby="team-heading">
      <div className="team-header">
        <span className="team-kicker"><img src="/Logo/logo-icon.png" alt="vCloudOps" /> Core above the constellation</span>
        <h2 id="team-heading">Built by students, for students</h2>
        <p>The team running workshops, mentoring lab sessions, and maintaining community infrastructure.</p>
      </div>
      <div className={`team-overview${carouselEnabled ? ' is-carousel' : ''}`} aria-label="Team domains">
        {carouselEnabled ? <DomainCarousel index={domainIndex} onNavigate={(_, direction) => domainStepRef.current?.(direction)} onOpen={openTeam} locked={Boolean(selectedTeam) || domainNavigating} selectedTeam={selectedTeam} /> : <>
          <DomainBox team={TEAMS[0]} onOpen={openTeam} isCore isOpen={selectedTeam?.id === TEAMS[0].id} />
          <div className="team-domain-grid">
            {TEAMS.slice(1).map((team) => <DomainBox key={team.id} team={team} onOpen={openTeam} isOpen={selectedTeam?.id === team.id} />)}
          </div>
        </>}
      </div>
      {selectedTeam && createPortal(<MemberView team={selectedTeam} activeIndex={activeIndex} setActiveIndex={setActiveIndex} onClose={closeTeam} reduced={reduced} openerRef={openerRef} originRect={originRect} wheelGestureRef={domainGestureRef} touchGestureRef={touchGestureRef} />, document.body)}
    </section>
  )
}
