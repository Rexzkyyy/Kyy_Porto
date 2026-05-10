import React, { useState, useEffect, useRef } from 'react';
import { motion, MotionConfig, useMotionValue, useSpring, useTransform, AnimatePresence, useScroll } from 'framer-motion';
import {
  Github, Mail, Cpu, Globe, Rocket,
  X, Menu, Share2, Instagram, Linkedin, MessageCircle, Lock, ChevronRight, Terminal, Settings
} from 'lucide-react';
import Lenis from 'lenis';

// Hero portrait — optimized WebP served from public/ for instant preloading
const profilePic = '/hero-portrait.webp';

const BelowTheFold = React.lazy(() => import('./components/BelowTheFold'));
import { supabase } from './lib/supabase';

// Lazy-load heavy admin components — only needed after login interaction
const LoginModal = React.lazy(() => import('./components/LoginModal'));
const Dashboard = React.lazy(() => import('./components/Dashboard'));


// --- Lenis Smooth Scroll Configuration ---
const LENIS_OPTIONS = {
  duration: 1.2,
  easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  direction: 'vertical' as const,
  gestureDirection: 'vertical' as const,
  smooth: true,
  mouseMultiplier: 1,
  smoothTouch: false,
  touchMultiplier: 2,
  infinite: false,
};

// --- Mobile Detection Hook ---
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 768 || 'ontouchstart' in window;
  });

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return isMobile;
};



// --- Performance Background ---
const PerformanceBackground = React.memo(() => {
  const isMobile = useIsMobile();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    if (isMobile) return;
    const handleMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, [isMobile]);

  const spotlightX = useSpring(mouseX, { stiffness: 80, damping: 30 });
  const spotlightY = useSpring(mouseY, { stiffness: 80, damping: 30 });

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-[#030014]">
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at 50% -10%, rgba(139, 92, 246, 0.15) 0%, transparent 60%),
            radial-gradient(circle at 80% 20%, rgba(138, 43, 226, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 20% 80%, rgba(99, 102, 241, 0.08) 0%, transparent 50%)
          `
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(139, 92, 246, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(139, 92, 246, 0.2) 1px, transparent 1px)`,
          backgroundSize: '120px 120px'
        }}
      />
      {!isMobile && (
        <motion.div
          style={{ x: spotlightX, y: spotlightY, translateX: '-50%', translateY: '-50%' }}
          className="absolute w-[800px] h-[800px] bg-purple-600/5 rounded-full blur-[120px] will-change-transform"
        />
      )}
      {isMobile && (
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/10 via-transparent to-transparent opacity-50" />
      )}
    </div>
  );
});
PerformanceBackground.displayName = 'PerformanceBackground';

// --- Navbar ---
const Navbar = React.memo(({ onLoginClick, isLoggedIn }: { onLoginClick: () => void, isLoggedIn: boolean }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', id: 'home' },
    { name: 'About', id: 'about' },
    { name: 'Skills', id: 'expertise' },
    { name: 'Projects', id: 'projects' },
    { name: 'Journey', id: 'journey' },
    { name: 'Credentials', id: 'credentials' },
    { name: 'Contact', id: 'contact' }
  ];

  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    // Increased delay to ensure the menu overlay cleanup doesn't interrupt scroll
    setTimeout(() => {
      if (id === 'home') {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      } else {
        const el = document.getElementById(id);
        if (el) {
          const offset = 80; // Account for navbar height
          const bodyRect = document.body.getBoundingClientRect().top;
          const elementRect = el.getBoundingClientRect().top;
          const elementPosition = elementRect - bodyRect;
          const offsetPosition = elementPosition - offset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }
    }, 300);
  };

  return (
    <>
      <nav className="fixed top-0 w-full z-[100] px-6 md:px-12 h-24 flex justify-between items-center bg-transparent pointer-events-none">
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          className="text-xl font-bold tracking-tight text-white font-display pointer-events-auto cursor-pointer"
          onClick={() => scrollToSection('home')}
        >
          REZKI<span className="text-indigo-400">.</span>DEV
        </motion.div>

        {/* Desktop Navigation */}
        <div className="flex space-x-8 items-center pointer-events-auto">
          <div className="hidden md:flex items-center space-x-8 mr-8 border-r border-white/10 pr-8">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 hover:text-purple-400 transition-colors"
              >
                {link.name}
              </button>
            ))}
          </div>

          <button
            onClick={onLoginClick}
            className="hidden md:flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-all group"
          >
            {isLoggedIn ? (
              <>
                <Settings className="w-3 h-3 group-hover:text-purple-400 transition-colors" />
                Dashboard
              </>
            ) : (
              <>
                <Lock className="w-3 h-3 group-hover:text-purple-400 transition-colors" />
                Admin Area
              </>
            )}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden p-3 rounded-xl bg-white/5 border border-white/10 text-white pointer-events-auto"
            aria-label="Open mobile menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] bg-[#030014] flex flex-col p-8 md:hidden overflow-y-auto overflow-x-hidden"
          >
            {/* Close Button Inside Menu */}
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed top-8 right-8 z-[1001] p-4 text-white hover:text-purple-400 transition-colors bg-white/5 rounded-full backdrop-blur-md"
              aria-label="Close mobile menu"
            >
              <X className="w-8 h-8" />
            </button>

            <div className="flex flex-col items-center space-y-4 pt-32 pb-20 w-full">
              {navLinks.map((link, i) => (
                <motion.button
                  key={link.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => scrollToSection(link.id)}
                  className="w-full py-6 px-4 text-3xl font-black font-display uppercase tracking-[0.2em] text-white hover:text-purple-500 active:bg-white/5 rounded-2xl transition-all text-center"
                >
                  {link.name}
                </motion.button>
              ))}

              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                onClick={() => {
                  onLoginClick();
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center gap-3 px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold text-sm tracking-widest uppercase"
              >
                <Lock className="w-4 h-4 text-purple-400" />
                Admin Access
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
});
Navbar.displayName = 'Navbar';

// --- Hero Section ---
const Hero = ({ profile, socials }: { profile: any, socials: any[] }) => {
  const typedRef = useRef<HTMLSpanElement>(null);
  const heroRef = useRef(null);

  const ringRef = useRef(null);

  const activeRoles = profile?.roles || ['Web Developer', 'Data Analyst', 'IT Support', 'Graphic Designer'];
  const fullName = profile?.full_name || "Ikhsanuddin Rezki";

  useEffect(() => {
    if (!typedRef.current) return;
    let typed: any;
    let cancelled = false;
    // Dynamically import typed.js (~30KB) — not needed at initial paint
    import('typed.js').then(({ default: Typed }) => {
      if (cancelled || !typedRef.current) return;
      typed = new Typed(typedRef.current, {
        strings: activeRoles,
        typeSpeed: 80,
        backSpeed: 40,
        backDelay: 2000,
        loop: true,
        cursorChar: '|',
      });
    });
    return () => { cancelled = true; typed?.destroy(); };
  }, [activeRoles]);
  return (
    <section id="home" ref={heroRef} className="relative min-h-screen lg:h-screen pt-64 pb-12 lg:pt-20 lg:pb-0 flex items-center justify-center overflow-hidden px-6 md:px-12">
      <FloatingParticles />
      <div className="absolute inset-0 pointer-events-none select-none hidden lg:flex items-center justify-center overflow-hidden z-0">
        <h2 className="text-[20vw] font-black text-white/[0.03] uppercase leading-none transform -rotate-12 translate-x-20">REXYZKY</h2>
      </div>
      <div className="relative z-10 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        <div className="flex flex-col gap-10 lg:gap-12 text-center lg:text-left order-1">
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, ease: "easeOut", staggerChildren: 0.1 }} className="space-y-4 md:space-y-6">
            <h1 className="font-black font-display uppercase tracking-tight leading-[1.1] mb-8" style={{ fontSize: 'clamp(2.5rem, 10vw, 5.5rem)' }}>
              <span className="text-2xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500 block mb-1 tracking-tight">HI, I'M</span>
              {fullName.split(' ')[0]} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400">
                {fullName.split(' ').slice(1).join(' ')}
              </span>
            </h1>
            <div className="flex items-center justify-center lg:justify-start gap-4">
              <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(168,85,247,0.9)]" />
              <p className="text-[#c4b5fd] font-mono text-[10px] md:text-base tracking-[0.3em] md:tracking-[0.6em] uppercase font-bold" style={{ textShadow: '0 0 12px rgba(139,92,246,0.8)' }}>
                <span ref={typedRef} />
              </p>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.8, x: 100 }} animate={{ opacity: 1, scale: 1, x: 0 }} transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }} className="relative flex justify-center items-center lg:hidden order-2">
            <MobilePortrait profilePic={profilePic} ringRef={ringRef} />
          </motion.div>
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-5 order-3">
            <motion.button
              onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
              whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(139, 92, 246, 0.5)" }}
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto px-12 py-5 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl text-white font-bold text-[11px] tracking-[0.2em] uppercase transition-all flex items-center justify-center gap-3 group relative overflow-hidden shadow-lg shadow-purple-900/20"
            >
              <span className="relative z-10">Explore Works</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform relative z-10" />
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.08)" }}
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto px-12 py-5 border border-white/10 rounded-2xl text-white font-bold text-[11px] tracking-[0.2em] uppercase transition-all flex items-center justify-center bg-white/5 backdrop-blur-sm"
            >
              Get In Touch
            </motion.button>
          </div>
          <div className="flex items-center justify-center lg:justify-start gap-8 pt-6 border-t border-white/5 order-4">
            {socials.length > 0 ? socials.map((social, i) => {
              let Icon = Globe;
              let url = social.url;
              if (social.platform === 'GitHub') Icon = Github;
              else if (social.platform === 'LinkedIn') Icon = Linkedin;
              else if (social.platform === 'Instagram') Icon = Instagram;
              else if (social.platform === 'WhatsApp') { Icon = MessageCircle; url = `https://wa.me/${social.url.replace(/\D/g, '')}`; }
              else if (social.platform === 'Email') { Icon = Mail; url = `mailto:${social.url}`; }
              else if (social.platform === 'X') Icon = Share2;
              else if (social.platform === 'Portfolio') Icon = Rocket;
              else if (social.platform === 'Web') Icon = Globe;

              return (
                <a key={i} href={url} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-purple-400 transition-all hover:scale-110" title={social.platform}>
                  <Icon className="w-5 h-5 md:w-6 md:h-6" />
                </a>
              );
            }) : [
              { icon: Github, url: profile?.github_url },
              { icon: Linkedin, url: profile?.linkedin_url },
              { icon: Instagram, url: profile?.instagram_url },
              { icon: MessageCircle, url: profile?.whatsapp_url ? `https://wa.me/${profile.whatsapp_url.replace(/\D/g, '')}` : null },
              { icon: Mail, url: "mailto:ikhsanuddin.rz@gmail.com" }
            ].filter((s): s is { icon: any; url: string } => !!s.url).map((social, i) => (
              <a key={i} href={social.url} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-purple-400 transition-all hover:scale-110">
                <social.icon className="w-5 h-5 md:w-6 md:h-6" />
              </a>
            ))}
          </div>
        </div>
        <div className="hidden lg:flex justify-center items-center order-2">
          <DesktopPortrait profilePic={profilePic} ringRef={ringRef} />
        </div>
      </div>
    </section>
  );
};

// --- Sub-components ---
const MobilePortrait = ({ profilePic, ringRef }: any) => {
  return (
    <div className="relative group scale-90 sm:scale-100">
      <div ref={ringRef} className="absolute inset-[-24px] rounded-[2.5rem] border-2 border-purple-500/30 border-t-purple-500 opacity-80" style={{ animation: 'spin 20s linear infinite', willChange: 'transform' }} />
      <div className="absolute inset-0 bg-purple-600/30 blur-[40px] opacity-60" />
      <div className="relative w-[300px] h-[350px] rounded-[24px] overflow-hidden border border-white/5 shadow-[0_0_100px_rgba(139,92,246,0.5)]" style={{ maskImage: 'linear-gradient(to bottom, black 75%, rgba(0,0,0,0.4) 90%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 75%, rgba(0,0,0,0.4) 90%, transparent 100%)' }}>
        <img src={profilePic} alt="Portrait" width="300" height="350" className="w-full h-full object-cover object-top scale-[1.25] -translate-y-1 shadow-2xl" loading="eager" />
        <div className="absolute bottom-[-10px] left-1/2 -translate-x-1/2 w-[220px] h-[80px] bg-purple-500/40 blur-2xl pointer-events-none" />
        <div className="absolute inset-0 bg-[#0a0a1e]/20 pointer-events-none" />
      </div>
    </div>
  );
};

const DesktopPortrait = ({ profilePic, ringRef }: any) => (
  <div className="relative group lg:-translate-x-24 flex items-center justify-center z-10 gpu-accelerated">
    <div ref={ringRef} className="absolute inset-[-65px] rounded-[4rem] border-2 border-purple-500/20 border-t-purple-500 opacity-90" style={{ animation: 'spin 25s linear infinite', willChange: 'transform' }} />
    <div className="absolute inset-[-45px] rounded-[3rem] border-2 border-indigo-500/10 border-b-indigo-400 opacity-70" style={{ animation: 'spin 15s linear reverse infinite', willChange: 'transform' }} />
    <div className="absolute inset-[-80px] rounded-[5rem] bg-purple-600/10 blur-[100px] opacity-40" />
    <div className="relative w-[500px] xl:w-[580px] h-[75vh] max-h-[850px] rounded-[32px] overflow-hidden border border-white/10 shadow-[0_0_150px_rgba(139,92,246,0.3)] flex items-center justify-center bg-[#0a0a1e]/10" style={{ maskImage: 'linear-gradient(to bottom, black 88%, rgba(0,0,0,0.4) 95%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 88%, rgba(0,0,0,0.4) 95%, transparent 100%)' }}>
      <img src={profilePic} alt="Portrait" width="580" height="850" className="w-full h-full object-contain scale-[1.25] translate-y-8 group-hover:scale-[1.23] group-hover:translate-y-10 filter brightness-[1.08] contrast-[1.15] saturate-[1.05] drop-shadow-[0_40px_80px_rgba(0,0,0,0.8)]" loading="eager" style={{ transition: 'transform 0.8s ease-in-out', animated: true, willChange: 'transform' } as any} />
      <div className="absolute inset-0 pointer-events-none mix-blend-screen opacity-30" style={{ background: 'radial-gradient(circle at 50% 30%, rgba(139,92,246,0.4), transparent 70%)' }} />
      <div className="absolute bottom-0 left-0 right-0 h-[200px] bg-gradient-to-t from-purple-900/15 to-transparent pointer-events-none" />
      <div className="absolute bottom-[-30px] left-1/2 -translate-x-1/2 w-[400px] h-[120px] bg-purple-600/30 blur-[60px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 bg-[#0a0a1e]/10 pointer-events-none" />
    </div>
  </div>
);


// --- Particles (lazy-loaded — 146KB only fetched on desktop after mount) ---
const FloatingParticles = React.memo(() => {
  const isMobile = useIsMobile();
  const [ParticlesComp, setParticlesComp] = useState<React.ComponentType<any> | null>(null);
  const initFnRef = useRef<((engine: any) => Promise<void>) | null>(null);

  useEffect(() => {
    if (isMobile) return;
    let cancelled = false;
    // Dynamically import particle engine (~146KB) — purely decorative, non-critical
    Promise.all([
      import('react-tsparticles'),
      import('tsparticles-slim')
    ]).then(([particlesModule, slimModule]) => {
      if (cancelled) return;
      initFnRef.current = async (engine: any) => { await slimModule.loadSlim(engine); };
      setParticlesComp(() => particlesModule.default);
    });
    return () => { cancelled = true; };
  }, [isMobile]);

  if (isMobile || !ParticlesComp) return null;
  const Comp = ParticlesComp;

  return (
    <Comp
      id="tsparticles"
      init={initFnRef.current}
      className="absolute inset-0 z-0 pointer-events-none"
      options={{
        fpsLimit: 60,
        particles: {
          color: { value: ["#8b5cf6", "#6366f1", "#ffffff"] },
          number: { value: 50, density: { enable: true, area: 1200 } },
          opacity: { value: { min: 0.1, max: 0.35 }, random: true, anim: { enable: true, speed: 0.5, opacity_min: 0.05, sync: false } },
          shape: { type: "circle" },
          size: { value: { min: 0.5, max: 2 }, random: true },
          move: { enable: true, speed: 0.3, direction: "none", random: true, straight: false, outModes: { default: "out" } }
        },
        detectRetina: false
      }}
    />
  );
});

// --- Cursor ---
const FluidCursor = () => {
  const isMobile = useIsMobile();
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  const cursorX = useSpring(mouseX, { stiffness: 200, damping: 25 });
  const cursorY = useSpring(mouseY, { stiffness: 200, damping: 25 });
  useEffect(() => {
    if (isMobile) return;
    const handleMove = (e: MouseEvent) => { mouseX.set(e.clientX); mouseY.set(e.clientY); };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, [isMobile, mouseX, mouseY]);
  if (isMobile) return null;
  return (
    <motion.div style={{ x: cursorX, y: cursorY, translateX: '-50%', translateY: '-50%' }} className="fixed top-0 left-0 z-[9999] pointer-events-none w-8 h-8 border border-white/20 rounded-full flex items-center justify-center hidden md:flex will-change-transform">
      <div className="w-1 h-1 bg-white/40 rounded-full" />
    </motion.div>
  );
};



export default function App() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [isAdminView, setIsAdminView] = useState(false);
  const [dynamicProfile, setDynamicProfile] = useState<any>(null);
  const [dynamicSocials, setDynamicSocials] = useState<any[]>([]);
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [isSiteLoading, setIsSiteLoading] = useState(true);
  // Smooth visual progress — springs behind the raw integer value
  const progressMV = useMotionValue(0);
  const smoothProgress = useSpring(progressMV, { stiffness: 40, damping: 18, mass: 0.8 });
  const displayProgress = useTransform(smoothProgress, v => `${Math.round(v)}%`);
  const loadingText = useTransform(smoothProgress, (v): string => {
    if (v < 30) return 'Neural Check';
    if (v < 60) return 'Porting Data';
    if (v < 90) return 'Finalizing';
    return 'Ready';
  }) as any;
  const smoothBarX = useTransform(smoothProgress, v => `${v - 100}%`);

  // Scroll Progress Logic
  const { scrollYProgress } = useScroll();
  const progressScale = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Site Initialization Progress — starts immediately, completes when Supabase data is ready
  useEffect(() => {
    // Phase 1: Start auto-progress from 0 to ~85% immediately
    const timer = setInterval(() => {
      const current = progressMV.get();
      if (current >= 85) {
        clearInterval(timer);
      } else {
        progressMV.set(current + Math.floor(Math.random() * 10) + 3);
      }
    }, 60);
    return () => clearInterval(timer);
  }, [progressMV]);

  useEffect(() => {
    if (!profileLoaded) return;
    // Phase 2: When data is ready, jump to 100 and dismiss
    progressMV.set(100);
    const dismiss = setTimeout(() => setIsSiteLoading(false), 600);
    return () => clearTimeout(dismiss);
  }, [profileLoaded, progressMV]);

  useEffect(() => {
    if (!supabase) {
      setProfileLoaded(true);
      setIsSiteLoading(false);
      return;
    }

    let mounted = true;

    const initSession = async () => {
      try {
        const { data: { session: s } } = await supabase.auth.getSession();
        if (mounted) {
          setSession(s);
        }
      } catch (err: any) {
        // Handle or ignore the lock stealing error which can happen with multiple tabs or re-renders
        if (err.message?.includes('lock') || err.name === 'AbortError') {
          console.warn('Supabase auth lock handled:', err.message);
        } else {
          console.error('Supabase getSession error:', err);
        }
      }
    };

    initSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: any, s: any) => {
      if (mounted) {
        setSession(s);
        if (!s) setIsAdminView(false);
      }
    });

    // Fetch Profile Data
    const fetchProfile = async () => {
      try {
        const { data } = await supabase.from('profile').select('*').single();
        if (data && mounted) {
          setDynamicProfile({
            ...data,
            email: 'ikhsanuddin.rz@gmail.com'
          });
        }

        const { data: socialsData } = await supabase.from('socials').select('*').order('id', { ascending: true });
        if (socialsData && mounted) setDynamicSocials(socialsData);
      } catch (err) {
        console.error('Error fetching profile:', err);
      } finally {
        if (mounted) setProfileLoaded(true);
      }
    };
    fetchProfile();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);


  useEffect(() => {
    if (typeof window !== 'undefined' && (window.innerWidth < 768 || 'ontouchstart' in window)) return;
    const lenis = new Lenis(LENIS_OPTIONS);
    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return (
    <MotionConfig reducedMotion="user">
    <div className="bg-[#030014] text-white selection:bg-purple-500 selection:text-white relative min-h-screen font-body">
      <AnimatePresence mode="wait">
        {isSiteLoading && (
          <motion.div
            key="preloader"
            className="fixed inset-0 z-[9999] bg-[#030014] flex flex-col items-center justify-center overflow-hidden"
            exit={{
              opacity: 0,
              y: -20,
              transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] }
            }}
          >
            {/* Neural Background */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.12)_0,transparent_70%)] opacity-20" />
              <div className="absolute inset-0" style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(99,102,241,0.03) 40px, rgba(99,102,241,0.03) 41px), repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(99,102,241,0.03) 40px, rgba(99,102,241,0.03) 41px)' }} />
            </div>

            <div className="relative flex flex-col items-center gap-12 z-10">
              {/* Central Core Animation */}
              <div className="relative w-40 h-40">
                <motion.div
                  className="absolute inset-0 border-[3px] border-indigo-500/20 rounded-[2.5rem]"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                />
                <motion.div
                  className="absolute inset-4 border-[2px] border-purple-500/30 rounded-[2rem]"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                />
                <motion.div
                  className="absolute inset-8 border-[1px] border-indigo-400/40 rounded-[1.5rem]"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    <Cpu className="w-12 h-12 text-white animate-pulse" />
                    <motion.div
                      className="absolute inset-0 bg-indigo-500/30 blur-xl rounded-full"
                      animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.6, 0.3] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </div>
                </div>
              </div>

              {/* Identity & Status */}
              <div className="flex flex-col items-center text-center">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3 mb-4"
                >
                  <Terminal className="w-4 h-4 text-indigo-400" />
                  <span className="text-[10px] font-mono text-indigo-400/60 uppercase tracking-[0.5em]">Initialising Core Systems</span>
                </motion.div>

                <h1 className="text-4xl md:text-6xl font-black font-display text-white uppercase tracking-tighter mb-2 relative">
                  PORTFOLIO<span className="text-indigo-500">.</span>OS
                </h1>

                {/* Hacker Typing Name */}
                <div className="flex items-center gap-2 mb-8 bg-indigo-500/10 px-4 py-1.5 rounded-full border border-indigo-500/20 backdrop-blur-sm">
                  <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest">System:</span>
                  <motion.span
                    className="text-[10px] font-mono text-white uppercase tracking-[0.3em] font-bold"
                    initial={{ width: 0 }}
                    animate={{ width: "auto" }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  >
                    {"INITIALIZING".split("").map((char, i) => (
                      <motion.span
                        key={i}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 + (i * 0.05) }}
                      >
                        {char}
                      </motion.span>
                    ))}
                  </motion.span>
                  <motion.div
                    className="w-1.5 h-3 bg-indigo-500"
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity }}
                  />
                </div>

                {/* Progress Visual */}
                <div className="flex flex-col items-center gap-6">
                  <div className="w-80 h-[2px] bg-white/5 relative rounded-full overflow-hidden">
                    <motion.div
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-indigo-600 via-purple-500 to-indigo-600 w-full shadow-[0_0_25px_rgba(99,102,241,0.6)]"
                      style={{ x: smoothBarX }}
                    />
                  </div>
                  <div className="flex justify-between w-80 text-[10px] font-mono uppercase tracking-[0.2em] text-gray-400">
                    <motion.span
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {loadingText}
                    </motion.span>
                    <motion.span className="text-white font-black tabular-nums">{displayProgress}</motion.span>
                  </div>
                </div>
              </div>
            </div>

            {/* Scanning Line */}
            <motion.div
              className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent shadow-[0_0_20px_rgba(99,102,241,0.5)] opacity-30 pointer-events-none"
              animate={{ top: ['0%', '100%'] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <FluidCursor />
      <PerformanceBackground />

      {isAdminView && session ? (
        <React.Suspense fallback={
          <div className="fixed inset-0 bg-[#030014] flex items-center justify-center z-[9999]">
            <div className="w-10 h-10 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
          </div>
        }>
          <Dashboard onBack={() => setIsAdminView(false)} />
        </React.Suspense>
      ) : (
        <>
          <Navbar
            onLoginClick={() => session ? setIsAdminView(true) : setIsLoginOpen(true)}
            isLoggedIn={!!session}
          />
          <main>
            <Hero profile={dynamicProfile} socials={dynamicSocials} />
            <React.Suspense fallback={null}>
              <BelowTheFold profile={dynamicProfile} socials={dynamicSocials} />
            </React.Suspense>
          </main>

          {/* Scroll Progress Indicator */}
          <motion.div
            className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 z-[100] origin-left"
            style={{ scaleX: progressScale }}
          />
        </>
      )}

      <AnimatePresence>
        {isLoginOpen && (
          <React.Suspense fallback={null}>
            <LoginModal
              onClose={() => setIsLoginOpen(false)}
              onSuccess={() => setIsAdminView(true)}
            />
          </React.Suspense>
        )}
      </AnimatePresence>
      <style dangerouslySetInnerHTML={{
        __html: `
        :root { --font-display: 'Space Grotesk', sans-serif; --font-body: 'Inter', sans-serif; --font-mono: 'IBM Plex Mono', monospace; scrollbar-width: none; }
        ::-webkit-scrollbar { display: none; }
        html.lenis, html.lenis body { height: auto; }
        .lenis.lenis-smooth { scroll-behavior: auto !important; }
        .lenis.lenis-stopped { overflow: hidden; }
        
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes spin-reverse { from { transform: rotate(360deg); } to { transform: rotate(0deg); } }
        @keyframes gradient-flow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient-flow {
          animation: gradient-flow 6s ease infinite;
          animation-fill-mode: both;
        }

        body { 
          font-family: var(--font-body); 
          background: #030014; 
          color: white; 
          cursor: crosshair; 
          margin: 0; 
          padding: 0; 
          -webkit-font-smoothing: antialiased; 
          -moz-osx-font-smoothing: grayscale;
          overflow-x: hidden;
        }
        .font-display { font-family: var(--font-display); }
        .font-mono { font-family: var(--font-mono); }

        /* Glass morphism — GPU composited layer */
        .glass-morphism {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          will-change: transform;
          transform: translateZ(0);
        }
        @media (max-width: 768px) {
          .glass-morphism {
            backdrop-filter: none !important;
            -webkit-backdrop-filter: none !important;
            background: rgba(255, 255, 255, 0.08);
          }
          .animate-pulse { animation-duration: 3s !important; }
          .animate-gradient-flow { animation: none !important; }
        }

        /* Only transition the properties we actually animate */
        .transition-colors { transition-property: color, background-color, border-color !important; transition-timing-function: ease !important; }
        .transition-transform { transition-property: transform !important; transition-timing-function: ease !important; }
        
        * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
        img { backface-visibility: hidden; -webkit-backface-visibility: hidden; }
        .gpu-accelerated { transform: translateZ(0); will-change: transform; }
     `}} />
    </div>
    </MotionConfig>
  );
}
