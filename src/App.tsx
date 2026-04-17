import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, MotionConfig, useMotionValue, useSpring, useTransform, AnimatePresence, useScroll, useAnimationFrame } from 'framer-motion';
import {
  Github, Mail, ChevronRight,
  ExternalLink, Code2, Layers, Cpu, Globe, Rocket,
  Lock, X, Menu, Settings,
  Terminal, Zap, Database, Smartphone, Palette, Share2, Instagram, Linkedin, MessageCircle,
  Sparkles, Briefcase, Award, FileText
} from 'lucide-react';
import Lenis from 'lenis';
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import type { Engine } from "tsparticles-engine";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Document, Page, pdfjs } from 'react-pdf';

// Configure PDF.js worker using local file (most stable for Vite)
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();
import Typed from "typed.js";
import profilePic from './assets/lb0.png';
import { supabase } from './lib/supabase';

// Lazy-load heavy admin components — only needed after login interaction
const LoginModal = React.lazy(() => import('./components/LoginModal'));
const Dashboard = React.lazy(() => import('./components/Dashboard'));

gsap.registerPlugin(useGSAP);

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

// Icon mapping for Supabase strings
const ICON_MAP: Record<string, any> = {
  Cpu, Globe, Layers, Rocket, Code2,
  Terminal, Zap, Database, Smartphone, Palette, Share2
};

const DEFAULT_PROJECTS = [
  {
    title: "Pusat Kendali Kehumasan",
    description: "Advanced monitoring dashboard for organizational metrics with real-time data sync and cosmic visualization.",
    image: "/src/assets/IMG_2306.JPG.jpeg",
    tech: ["React", "Tailwind", "GSAP"],
    github: "https://github.com/Rexzkyyy",
    link: "#",
    icon_name: "Cpu"
  },
  {
    title: "Solar Monitoring IoT",
    description: "Smart energy tracking system with predictive analysis and low-latency data streams.",
    image: "/src/assets/IMG_2307.JPG.jpeg",
    tech: ["TypeScript", "Next.js", "MQTT"],
    github: "https://github.com/Rexzkyyy",
    link: "#",
    icon_name: "Globe"
  },
  {
    title: "E-Commerce Nebula",
    description: "A premium store experience with seamless transitions and high-performance server-side rendering.",
    image: "/src/assets/IMG_2308.JPG.jpeg",
    tech: ["Next.js", "Prisma", "Stripe"],
    github: "https://github.com/Rexzkyyy",
    link: "#",
    icon_name: "Layers"
  },
  {
    title: "AI Image Processor",
    description: "Neuro-linked image processing tool optimized for high-resolution graphics and cloud scaling.",
    image: "/src/assets/IMG_2309.JPG.jpeg",
    tech: ["Python", "Flask", "React"],
    github: "https://github.com/Rexzkyyy",
    link: "#",
    icon_name: "Rocket"
  },
  {
    title: "Cosmic Portfolio",
    description: "The very portfolio you are browsing—built for speed, aesthetics, and cinematic impact.",
    image: "/src/assets/lb0.png",
    tech: ["React", "Three.js", "Framer"],
    github: "https://github.com/Rexzkyyy",
    link: "#",
    icon_name: "Code2"
  }
];

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
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef(null);
  const ringRef = useRef(null);

  const activeRoles = profile?.roles || ['Web Developer', 'Data Analyst', 'IT Support', 'Graphic Designer'];
  const fullName = profile?.full_name || "Ikhsanuddin Rezki";

  useEffect(() => {
    if (!typedRef.current) return;
    const typed = new Typed(typedRef.current, {
      strings: activeRoles,
      typeSpeed: 80,
      backSpeed: 40,
      backDelay: 2000,
      loop: true,
      cursorChar: '|',
    });
    return () => typed.destroy();
  }, [activeRoles]);

  useGSAP(() => {
    const tl = gsap.timeline();
    tl.from(leftRef.current ? Array.from(leftRef.current.children) : [], { opacity: 0, x: -50, duration: 1, stagger: 0.1, ease: "power4.out" })
      .from(rightRef.current, {
        opacity: 0,
        scale: 0.8,
        x: 100,
        duration: 1.5,
        ease: "power3.out"
      }, "-=0.8")
      .to(ringRef.current, { rotation: 360, duration: 20, repeat: -1, ease: "none" });
  }, { scope: heroRef });

  return (
    <section id="home" ref={heroRef} className="relative min-h-screen lg:h-screen pt-64 pb-12 lg:pt-20 lg:pb-0 flex items-center justify-center overflow-hidden px-6 md:px-12">
      <FloatingParticles />
      <div className="absolute inset-0 pointer-events-none select-none hidden lg:flex items-center justify-center overflow-hidden z-0">
        <h2 className="text-[20vw] font-black text-white/[0.03] uppercase leading-none transform -rotate-12 translate-x-20">REXYZKY</h2>
      </div>
      <div className="relative z-10 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        <div className="flex flex-col gap-10 lg:gap-12 text-center lg:text-left order-1">
          <div ref={leftRef} className="space-y-4 md:space-y-6">
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
          </div>
          <div ref={rightRef} className="relative flex justify-center items-center lg:hidden order-2">
            <MobilePortrait profilePic={profilePic} ringRef={ringRef} />
          </div>
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
      <div className="absolute inset-0 bg-purple-600/30 blur-[100px] opacity-60" />
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

// --- About Section ---
const About = ({ profile }: { profile: any }) => {
  const bioMain = profile?.bio_main || "Fresh graduate Sistem Informasi dengan pengalaman dalam pengolahan data statistik, pengembangan web, dan IT support.";
  const bioSub = profile?.bio_sub || "Siap berkontribusi dalam pengembangan sistem berbasis teknologi dengan mengedepankan analisis data untuk mendukung pengambilan keputusan";

  const stats = [
    { label: "Role", value: profile?.role_label || "Fresh Graduate", icon: Cpu },
    { label: "Tech", value: profile?.tech_label || "Design & Web", icon: Globe },
    { label: "Focus", value: profile?.focus_label || "Gov & Cooperatives", icon: Layers }
  ];

  return (
    <section id="about" className="relative py-24 px-6 md:px-12 bg-[#030014] overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left: Bio Content */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-black font-display uppercase tracking-tight text-white">
              The <span className="text-purple-500">Explorer</span> <br />
              Behind The Code
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-purple-500 to-transparent" />
          </div>

          <p className="text-gray-300 text-lg md:text-xl leading-relaxed font-body">
            {bioMain}
          </p>

          <p className="text-gray-400 text-base md:text-lg leading-relaxed border-l-2 border-purple-500/30 pl-6 italic">
            "{bioSub}"
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5 }}
                className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md"
              >
                <stat.icon className="w-6 h-6 text-purple-400 mb-4" />
                <h4 className="text-gray-500 text-[10px] uppercase tracking-widest font-bold mb-1">{stat.label}</h4>
                <p className="text-white font-bold text-sm tracking-tight">{stat.value}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right: Decorative Skills Grid */}
        <div className="relative hidden lg:block">
          <div className="absolute inset-0 bg-purple-600/20 blur-[120px] rounded-full" />
          <div className="grid grid-cols-2 gap-4 relative z-10">
            {[
              { title: "Statistik", desc: "Data Analysis" },
              { title: "Graphic Design", desc: "Visual Arts" },
              { title: "Web Dev", desc: "Fullstack" },
              { title: "Support", desc: "IT Solutions" }
            ].map((skill, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`p-8 rounded-3xl border border-white/10 glass-morphism ${i % 2 === 1 ? 'mt-8' : ''}`}
              >
                <h3 className="text-xl font-bold text-white mb-2">{skill.title}</h3>
                <p className="text-gray-400 text-sm">{skill.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// --- Expertise Section ---
const Expertise = () => {
  const [skills, setSkills] = useState<any[]>([]);
  const [isSkillsLoading, setIsSkillsLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const { data, error } = await supabase.from('skills').select('*').order('id', { ascending: true });
        if (error) throw error;
        if (data) setSkills(data);
      } catch (err) {
        console.error('Error fetching skills:', err);
      } finally {
        setIsSkillsLoading(false);
      }
    };
    fetchSkills();
  }, []);

  if (isSkillsLoading && skills.length === 0) return null;

  // Split skills into two rows
  const midPoint = Math.ceil(skills.length / 2);
  const row1 = skills.slice(0, midPoint);
  const row2 = skills.slice(midPoint);

  return (
    <section id="expertise" className="relative py-32 bg-[#030014] overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-600/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-600/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 mb-20 text-center md:text-left">
        <div className="flex flex-col max-w-2xl">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-center md:justify-start gap-4 mb-6"
          >
            <div className="w-16 h-[2px] bg-gradient-to-r from-indigo-500 to-transparent" />
            <span className="text-indigo-400 font-mono tracking-[0.4em] uppercase text-xs font-bold whitespace-nowrap">Technical Arsenal</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-7xl font-black font-display uppercase tracking-tighter text-white"
          >
            Core <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-indigo-400">Expertise</span>
          </motion.h2>
        </div>
      </div>

      <div 
        className="flex flex-col gap-0 md:gap-1" // Extra tight gap
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <SkillRow items={row1} direction="left" isPaused={isHovered} />
        <SkillRow items={row2} direction="right" isPaused={isHovered} />
      </div>

    </section>
  );
};

const SkillRow = ({ items, direction, isPaused }: { items: any[], direction: 'left' | 'right', isPaused: boolean }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const baseX = useMotionValue(0);
  
  // Dynamic width calculation based on card + gap
  // Desktop: 400px + 32px gap = 432
  // Mobile: 280px + 16px gap = 296
  const isMobile = useIsMobile();
  const unitWidth = isMobile ? 296 : 432;
  const totalWidth = items.length * unitWidth;

  useAnimationFrame((_t, delta) => {
    if (isPaused) return;

    let moveBy = (delta / 1000) * 50; // 50px per second
    if (direction === 'right') moveBy = -moveBy;

    const newX = baseX.get() - moveBy;
    
    // Manual Wrap Logic
    if (newX <= -totalWidth) {
      baseX.set(newX + totalWidth);
    } else if (newX > 0) {
      baseX.set(newX - totalWidth);
    } else {
      baseX.set(newX);
    }
  });

  const x = useTransform(baseX, (v) => `${v}px`);

  return (
    <div 
      className="relative w-full py-4 touch-pan-y overflow-hidden"
      style={{
        maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
        WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)'
      }}
    >
      <div className="flex px-6 md:px-12" ref={containerRef}>
        <motion.div 
          className="flex gap-4 md:gap-8 active:cursor-grabbing cursor-grab"
          style={{ x }}
          drag="x"
          dragMomentum={false}
          onDrag={(_e, info) => {
            baseX.set(baseX.get() + info.delta.x);
          }}
          onDragEnd={() => {
            // Normalize
            const currentX = baseX.get();
            if (currentX <= -totalWidth) baseX.set(currentX + totalWidth);
            if (currentX > 0) baseX.set(currentX - totalWidth);
          }}
        >
          {[...items, ...items].map((skill, index) => (
            <SkillCard 
              key={`${skill.id}-${index}`} 
              skill={skill} 
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
};

const SkillCard = ({ skill }: { skill: any }) => {
  const Icon = ICON_MAP[skill.icon_name] || Sparkles;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{
        scale: 1.06,
        zIndex: 50,
        transition: { type: "spring", stiffness: 350, damping: 30 }
      }}
      className="inline-block w-[280px] md:w-[400px] p-8 md:p-10 rounded-[2rem] md:rounded-[2.5rem] border border-white/5 glass-morphism shrink-0 group hover:border-purple-500/30 hover:shadow-[0_20px_50px_rgba(168,85,247,0.2)] whitespace-normal pointer-events-auto cursor-pointer will-change-transform"
      style={{ contain: 'layout style' }}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/5 blur-[50px] group-hover:bg-purple-600/10 transition-colors duration-500" />
      <div className="relative z-10 flex flex-col items-start text-left">
        <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 md:mb-10 group-hover:bg-purple-600/20 group-hover:border-purple-500/30 transition-colors duration-500 shadow-xl">
          <Icon className="w-6 h-6 md:w-8 md:h-8 text-purple-400 group-hover:text-purple-300 transition-colors duration-300" />
        </div>
        <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight text-white mb-3 md:mb-4 group-hover:text-purple-400 transition-colors duration-300">
          {skill.title}
        </h3>
        <p className="text-sm md:text-base text-gray-400 leading-relaxed font-medium line-clamp-3">
          {skill.description}
        </p>
      </div>
    </motion.div>
  );
};

// --- Projects Section ---
const Projects = () => {
  const [projects, setProjects] = useState<any[]>(DEFAULT_PROJECTS);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedProject, setSelectedProject] = useState<any>(null);

  // Ambil hanya kategori yang benar-benar ada di data proyek
  const availableCategories = Array.from(new Set(projects.map(p => p.category || 'Web Programming')));
  const filters = ['All', ...availableCategories];

  const filteredProjects = activeFilter === 'All'
    ? projects
    : projects.filter(p => (p.category || 'Web Programming') === activeFilter);

  useEffect(() => {
    async function fetchProjects() {
      if (!supabase) {
        setLoading(false);
        return;
      }
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .order('id', { ascending: true });

        if (error) throw error;
        if (data && data.length > 0) {
          setProjects(data);
        }
      } catch (err) {
        console.error('Error fetching projects:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  return (
    <section id="projects" className="relative py-32 px-6 md:px-12 bg-[#030014]">
      <div className="absolute top-20 left-10 pointer-events-none select-none hidden lg:block overflow-hidden">
        <h2 className="text-[12vw] font-black text-white/[0.02] uppercase leading-none">PROJECTS</h2>
      </div>
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col mb-24 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-4 mb-6"
          >
            <div className="w-16 h-[2px] bg-gradient-to-r from-purple-500 to-transparent" />
            <span className="text-purple-400 font-mono tracking-[0.4em] uppercase text-xs font-bold">Project Portfolio</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-6xl md:text-8xl font-black font-display uppercase tracking-tighter leading-none mb-8"
          >
            Selected <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-400 to-purple-400 bg-[length:200%_auto] animate-gradient-flow">Artifacts</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-lg md:text-xl leading-relaxed font-medium font-body"
          >
            A collection of digital experiences crafted with precision,
            focusing on <span className="text-white">performance</span>,
            <span className="text-white">scalability</span>, and <span className="text-white">cinematic aesthetics</span>.
          </motion.p>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap gap-2 mb-12 p-2 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl w-fit">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${activeFilter === filter
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-[0_0_20px_rgba(79,70,229,0.3)]'
                : 'text-gray-500 hover:text-white hover:bg-white/5'
                }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-12 h-12 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, index) => (
                <ProjectCard
                  key={project.id || index}
                  project={project}
                  index={index}
                  onOpenDetails={setSelectedProject}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {selectedProject && (
          <ProjectDetailModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

const ProjectDetailModal = ({ project, onClose }: { project: any, onClose: () => void }) => {
  const IconComponent = ICON_MAP[project.icon_name] || Code2;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6"
    >
      <div
        className="absolute inset-0 bg-[#030014]/90 backdrop-blur-xl"
        onClick={onClose}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
        className="relative w-full max-w-4xl bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-[0_0_50px_rgba(168,85,247,0.2)] flex flex-col md:flex-row max-h-[90vh]"
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-50 p-3 rounded-full bg-black/50 border border-white/10 text-white/50 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Project Image */}
        <div className="w-full md:w-1/2 h-64 md:h-auto relative overflow-hidden bg-black/40 flex items-center justify-center">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-contain relative z-10"
          />
          <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#030014] via-transparent to-transparent z-20" />
        </div>

        {/* Project Info */}
        <div className="w-full md:w-1/2 p-8 md:p-12 overflow-y-auto custom-scrollbar">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <IconComponent className="w-6 h-6" />
            </div>
            <div>
              <span className="text-purple-400 font-mono text-[10px] uppercase tracking-widest font-bold">
                {project.category || 'Web Programming'}
              </span>
              <h2 className="text-3xl md:text-4xl font-black font-display uppercase tracking-tight text-white mt-1">
                {project.title}
              </h2>
            </div>
          </div>

          <div className="space-y-8">
            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">Project Overview</h4>
              <p className="text-gray-300 leading-relaxed text-lg font-medium">
                {project.description}
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">Built With</h4>
              <div className="flex flex-wrap gap-2">
                {project.tech.map((t: string) => (
                  <span key={t} className="px-4 py-2 text-[11px] font-mono tracking-widest uppercase bg-purple-500/5 text-purple-300 border border-purple-500/10 rounded-xl">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row gap-4">
              {project.link && (
                <motion.a
                  href={project.link}
                  target="_blank"
                  rel="noreferrer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 px-8 py-5 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl text-white font-bold text-[11px] tracking-[0.2em] uppercase transition-all flex items-center justify-center gap-3 shadow-lg shadow-purple-500/20"
                >
                  <Globe className="w-4 h-4" />
                  Kunjungi Proyek
                </motion.a>
              )}
              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-5 border border-white/10 rounded-2xl text-white font-bold text-[11px] tracking-[0.2em] uppercase transition-all flex items-center justify-center bg-white/5 hover:bg-white/10"
              >
                Tutup Detail
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const ProjectCard = ({ project, index, onOpenDetails }: { project: any, index: number, onOpenDetails: (p: any) => void }) => {
  const isMobile = useIsMobile();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-100, 100], [10, -10]), { stiffness: 100, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-100, 100], [-10, 10]), { stiffness: 100, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (isMobile) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(e.clientX - centerX);
    y.set(e.clientY - centerY);
  };

  const IconComponent = ICON_MAP[project.icon_name] || Code2;

  return (
    <motion.div initial={{ opacity: 0, y: isMobile ? 20 : 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ delay: isMobile ? 0 : index * 0.1, duration: isMobile ? 0.4 : 0.8 }} onMouseMove={handleMouseMove} onMouseLeave={() => { x.set(0); y.set(0); }} style={{ perspective: 1000 }} className="group">
      <motion.div style={!isMobile ? { rotateX, rotateY } : {}} className="relative min-h-[500px] h-full rounded-3xl overflow-hidden glass-morphism border border-white/5 group-hover:border-purple-500/30 transition-all duration-300 flex flex-col">
        <div className="h-64 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-[#030014] to-transparent z-10" />
          <img src={project.image} alt={project.title} width="600" height="400" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
          <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
            <span className="px-3 py-1 rounded-lg bg-indigo-500/20 backdrop-blur-md border border-indigo-500/30 text-[9px] font-black uppercase tracking-widest text-indigo-300">
              {project.category || 'Web Programming'}
            </span>
          </div>
          <div className="absolute top-4 right-4 z-20 flex gap-2">
            <div className="p-3 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 text-purple-400">
              <IconComponent className="w-5 h-5" />
            </div>
          </div>
        </div>
        <div className="p-8 flex-1 flex flex-col">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {project.tech.map((t: string) => <span key={t} className="px-3 py-1 text-[10px] font-mono tracking-widest uppercase bg-purple-500/10 text-purple-300 border border-purple-500/20 rounded-full">{t}</span>)}
            </div>
            <h3 className="text-3xl font-black font-display tracking-tight text-white group-hover:text-purple-400 transition-colors duration-500">
              {project.title}
            </h3>

            <p className="text-gray-400/80 text-base leading-relaxed line-clamp-3 font-medium">
              {project.description}
            </p>
          </div>

          <div className="mt-auto pt-6 border-t border-white/5">
            <div className="flex items-center justify-between gap-4">
              <motion.button
                onClick={() => onOpenDetails(project)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-bold text-[10px] tracking-widest uppercase transition-all flex items-center justify-center gap-2 hover:bg-white/10"
              >
                <Sparkles className="w-3 h-3 text-purple-400" />
                Detail Artifak
              </motion.button>

              <motion.button
                onClick={() => onOpenDetails(project)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl text-white font-bold text-[10px] tracking-widest uppercase transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20"
              >
                <Globe className="w-3 h-3" />
                Lihat Artiffak
              </motion.button>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-transparent" />
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 blur-[80px]" />
        </div>
      </motion.div>
    </motion.div>
  );
};

// --- Journey (Experience) Section ---
const Journey = () => {
  const [experiences, setExperiences] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const { data, error } = await supabase.from('experiences').select('*').order('id', { ascending: false });
        if (error) throw error;
        if (data) setExperiences(data);
      } catch (err) {
        console.error('Error fetching experiences:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchExperiences();
  }, []);

  if (loading && experiences.length === 0) return null;

  return (
    <section id="journey" className="relative py-32 px-6 md:px-12 bg-[#030014] overflow-hidden text-left">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col mb-24 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-4 mb-6"
          >
            <div className="w-16 h-[2px] bg-gradient-to-r from-indigo-500 to-transparent" />
            <span className="text-indigo-400 font-mono tracking-[0.4em] uppercase text-xs font-bold">The Career Path</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-7xl font-black font-display uppercase tracking-tighter text-white"
          >
            Professional <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-indigo-400">Journey</span>
          </motion.h2>
        </div>

        <div className="relative">
          <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-white/10 to-transparent md:-translate-x-1/2" />

          <div className="space-y-24">
            {experiences.map((exp, index) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className={`relative flex flex-col md:flex-row items-center justify-between w-full ${index % 2 === 0 ? 'md:flex-row-reverse' : ''
                  }`}
              >
                <div className="absolute left-0 md:left-1/2 w-4 h-4 rounded-full bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)] border-4 border-[#030014] z-20 md:-translate-x-1/2 group-hover:scale-125 transition-transform duration-500" />
                <div className={`w-full md:w-[45%] pl-10 md:pl-0 ${index % 2 === 0 ? 'md:text-left' : 'md:text-right'
                  }`}>
                  <div className="group relative p-8 md:p-10 rounded-[2.5rem] border border-white/5 glass-morphism overflow-hidden hover:border-indigo-500/30 transition-all duration-500 hover:-translate-y-2">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 blur-[50px] group-hover:bg-indigo-600/10 transition-colors" />
                    <div className="relative z-10">
                      <div className={`flex items-center gap-4 mb-6 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                        }`}>
                        <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                          <Briefcase className="w-5 h-5 text-indigo-400" />
                        </div>
                        <span className="text-indigo-400 font-mono tracking-widest text-[10px] font-bold uppercase">{exp.period}</span>
                      </div>
                      <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white mb-2 group-hover:text-indigo-400 transition-colors">{exp.role}</h3>
                      <p className="text-lg font-bold text-gray-300 mb-6 uppercase tracking-wider">{exp.company}</p>
                      <p className="text-gray-400 leading-relaxed font-medium">{exp.description}</p>
                    </div>
                  </div>
                </div>
                <div className="hidden md:block w-[45%]" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// --- PDF Thumbnail Component ---
const PdfThumbnail = ({ fileUrl }: { fileUrl: string }) => {

  return (
    <div className="w-full h-full flex items-center justify-center overflow-hidden">
      <Document
        file={fileUrl}
        onLoadSuccess={() => {}}
        loading={
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#05001a]/50 backdrop-blur-sm">
            <div className="relative w-24 h-32 border border-white/10 rounded-lg overflow-hidden bg-white/5">
              {/* Pulsing Ghost Content */}
              <motion.div
                className="absolute inset-4 bg-white/5 rounded"
                animate={{ opacity: [0.2, 0.5, 0.2] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <motion.div
                className="absolute inset-x-4 top-16 h-2 bg-white/5 rounded"
                animate={{ opacity: [0.2, 0.5, 0.2] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
              />
              {/* Scanning Laser */}
              <motion.div
                className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent shadow-[0_0_15px_rgba(168,85,247,0.8)] z-10"
                animate={{ top: ['0%', '100%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
            </div>
            <motion.span
              className="mt-4 text-[9px] font-mono text-purple-400 font-black uppercase tracking-[0.3em]"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              Decoding Metadata...
            </motion.span>
          </div>
        }
        error={
          <div className="flex flex-col items-center gap-2">
            <FileText className="w-10 h-10 text-red-500/20" />
            <span className="text-[8px] font-mono text-red-500/40 uppercase tracking-widest">Load Error</span>
          </div>
        }
      >
        <Page
          pageNumber={1}
          width={280}
          devicePixelRatio={1}
          renderTextLayer={false}
          renderAnnotationLayer={false}
          className="shadow-2xl"
        />
      </Document>
    </div>
  );
};

// --- Certificates/Credentials Section ---
const Certificates = () => {
  const [certs, setCerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCerts = async () => {
      try {
        const { data, error } = await supabase.from('certificates').select('*').order('id', { ascending: false });
        if (error) throw error;
        if (data) setCerts(data);
      } catch (err) {
        console.error('Error fetching certs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCerts();
  }, []);

  if (loading && certs.length === 0) return null;

  return (
    <section id="credentials" className="relative py-32 px-6 md:px-12 bg-[#030014] overflow-hidden text-left">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-600/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col mb-20 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-4 mb-6"
          >
            <div className="w-16 h-[2px] bg-gradient-to-r from-purple-500 to-transparent" />
            <span className="text-purple-400 font-mono tracking-[0.4em] uppercase text-xs font-bold">Validated Excellence</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-7xl font-black font-display uppercase tracking-tighter text-white"
          >
            Credential <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">& Analytics</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {certs.map((cert, index) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative rounded-[2.5rem] border border-white/5 glass-morphism overflow-hidden hover:border-purple-500/30 transition-all duration-500 flex flex-col"
            >
              {/* Image Preview / PDF Preview */}
              <div className="relative h-48 w-full overflow-hidden bg-[#0a0a0a]">
                {cert.file_url && (
                  (() => {
                    const isPdf = cert.file_url.split('?')[0].toLowerCase().endsWith('.pdf');
                    if (isPdf) {
                      return <PdfThumbnail fileUrl={cert.file_url} />;
                    } else {
                      return (
                        <img
                          src={cert.file_url}
                          alt={cert.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-50 group-hover:opacity-100"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                            const parent = (e.target as HTMLImageElement).parentElement;
                            if (parent) {
                              const fallback = document.createElement('div');
                              fallback.className = "w-full h-full flex items-center justify-center bg-white/5";
                              fallback.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-10 h-10 text-white/10"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><line x1="10" y1="9" x2="8" y2="9"></line></svg>`;
                              parent.appendChild(fallback);
                            }
                          }}
                        />
                      );
                    }
                  })()
                )}

                {/* Mencolok Score Badge */}
                {cert.score && (
                  <div className="absolute top-6 right-6 z-20">
                    <div className="px-5 py-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.4)] border border-white/20">
                      <span className="text-[11px] font-black uppercase text-white tracking-widest leading-none">GRADE: {cert.score}</span>
                    </div>
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-[#030014] via-transparent to-transparent opacity-80" />
              </div>

              <div className="p-8 relative z-10 flex-1 flex flex-col">
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                      <Award className="w-5 h-5 text-purple-400" />
                    </div>
                    <p className="text-indigo-400 font-mono text-[10px] uppercase tracking-[0.2em] font-bold">
                      {cert.issuer}
                    </p>
                  </div>
                  <h3 className="text-2xl font-black uppercase tracking-tight text-white leading-tight group-hover:text-purple-400 transition-colors">
                    {cert.title}
                  </h3>
                </div>

                <div className="mt-auto pt-6 border-t border-white/5 flex flex-wrap gap-4 items-center justify-between">
                  <span className="text-gray-500 font-mono text-[10px] uppercase tracking-widest font-bold">
                    {cert.start_year === cert.end_year ? cert.start_year : `${cert.start_year} — ${cert.end_year}`}
                  </span>

                  {cert.file_url && (
                    <div className="flex gap-2">
                      <motion.a
                        href={cert.file_url}
                        target="_blank"
                        rel="noreferrer"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest text-white transition-all"
                      >
                        <ExternalLink className="w-3 h-3 text-purple-400" />
                        Full View
                      </motion.a>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- Contact Section ---
const Contact = ({ profile, socials }: { profile: any, socials: any[] }) => {
  const socialLinks = socials.map(s => {
    let Icon = Globe;
    let label = s.platform;
    let url = s.url;
    let color = "hover:text-purple-400";
    let bg = "hover:bg-purple-400/10";

    if (s.platform === 'GitHub') { Icon = Github; color = "hover:text-white"; bg = "hover:bg-white/10"; }
    else if (s.platform === 'LinkedIn') { Icon = Linkedin; color = "hover:text-blue-400"; bg = "hover:bg-blue-400/10"; }
    else if (s.platform === 'Instagram') { Icon = Instagram; color = "hover:text-pink-400"; bg = "hover:bg-pink-400/10"; }
    else if (s.platform === 'WhatsApp') {
      Icon = MessageCircle;
      color = "hover:text-green-400";
      bg = "hover:bg-green-400/10";
      url = `https://wa.me/${s.url.replace(/\D/g, '')}`;
    }
    else if (s.platform === 'Email') {
      Icon = Mail;
      color = "hover:text-purple-400";
      bg = "hover:bg-purple-400/10";
      url = `mailto:${s.url}`;
    }
    else if (s.platform === 'X') { Icon = Share2; color = "hover:text-gray-300"; bg = "hover:bg-white/5"; }
    else if (s.platform === 'Web') { Icon = Globe; color = "hover:text-indigo-400"; bg = "hover:bg-indigo-400/10"; }
    else if (s.platform === 'Portfolio') { Icon = Rocket; color = "hover:text-orange-400"; bg = "hover:bg-orange-400/10"; }

    return { icon: Icon, label, url, color, bg };
  });

  // Fallback to profile if socials are empty (for backward compatibility during migration)
  if (socialLinks.length === 0) {
    const legacyLinks = [
      { icon: Github, label: "GitHub", url: profile?.github_url, color: "hover:text-white", bg: "hover:bg-white/10" },
      { icon: Linkedin, label: "LinkedIn", url: profile?.linkedin_url, color: "hover:text-blue-400", bg: "hover:bg-blue-400/10" },
      { icon: Instagram, label: "Instagram", url: profile?.instagram_url, color: "hover:text-pink-400", bg: "hover:bg-pink-400/10" },
      {
        icon: MessageCircle,
        label: "WhatsApp",
        url: profile?.whatsapp_url ? `https://wa.me/${profile.whatsapp_url.replace(/\D/g, '')}` : null,
        color: "hover:text-green-400",
        bg: "hover:bg-green-400/10"
      },
      {
        icon: Mail,
        label: "Email",
        url: "mailto:ikhsanuddin.rz@gmail.com",
        color: "hover:text-purple-400",
        bg: "hover:bg-purple-400/10"
      }
    ].filter(s => s.url);
    socialLinks.push(...legacyLinks as any);
  }

  return (
    <section id="contact" className="relative py-32 px-6 md:px-12 bg-[#030014] overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/10 blur-[120px] rounded-full opacity-50" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col items-center text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-4 mb-6"
          >
            <div className="w-12 h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
            <span className="text-purple-400 font-mono tracking-[0.4em] uppercase text-xs font-bold">Get In Touch</span>
            <div className="w-12 h-[2px] bg-gradient-to-r from-purple-500 via-purple-500 to-transparent rotate-180" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-8xl font-black font-display uppercase tracking-tighter text-white mb-8"
          >
            Available For <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-500 to-indigo-400 bg-[length:200%_auto] animate-gradient-flow">Projects</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl text-gray-400 text-lg md:text-xl leading-relaxed font-medium"
          >
            Focused on building exceptional digital experiences.
            Whether you have a question or a proposal, my inbox is always open.
          </motion.p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {socialLinks.map((social, index) => (
            <motion.a
              key={index}
              href={social.url}
              target="_blank"
              rel="noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className={`group p-8 rounded-[2rem] border border-white/5 glass-morphism flex flex-col items-center justify-center gap-4 transition-all duration-300 ${social.bg} ${social.color}`}
            >
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-white/10 transition-all duration-500">
                <social.icon className="w-8 h-8" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">{social.label}</span>
            </motion.a>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-32 p-12 rounded-[3rem] border border-white/5 glass-morphism overflow-hidden relative"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 blur-[80px] -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/10 blur-[80px] -ml-32 -mb-32" />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12 text-center md:text-left">
            <div>
              <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-white mb-2">Ready to Start?</h3>
              <p className="text-gray-400 font-medium">Let's turn your vision into a digital masterpiece.</p>
            </div>

            <motion.a
              href="mailto:ikhsanuddin.rz@gmail.com"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-12 py-6 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl text-white font-black text-xs uppercase tracking-[0.3em] shadow-[0_0_30px_rgba(79,70,229,0.4)] flex items-center gap-4"
            >
              Start a Project
              <Rocket className="w-4 h-4" />
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// --- Particles ---
const FloatingParticles = React.memo(() => {
  const isMobile = useIsMobile();
  const particlesInit = useCallback(async (engine: Engine) => { await loadSlim(engine); }, []);
  // On mobile: skip heavy particle engine entirely — use a simple static gradient instead
  if (isMobile) return null;
  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
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
  const [loadProgress, setLoadProgress] = useState(0);

  // Smooth visual progress — springs behind the raw integer value
  const progressMV = useMotionValue(0);
  const smoothProgress = useSpring(progressMV, { stiffness: 40, damping: 18, mass: 0.8 });
  const displayProgress = useTransform(smoothProgress, v => `${Math.round(v)}%`);
  const smoothBarX = useTransform(smoothProgress, v => `${v - 100}%`);

  useEffect(() => {
    progressMV.set(loadProgress);
  }, [loadProgress, progressMV]);

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
      setLoadProgress(prev => {
        if (prev >= 85) {
          clearInterval(timer);
          return 85;
        }
        return prev + Math.floor(Math.random() * 10) + 3;
      });
    }, 60);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!profileLoaded) return;
    // Phase 2: When data is ready, jump to 100 and dismiss
    setLoadProgress(100);
    const dismiss = setTimeout(() => setIsSiteLoading(false), 600);
    return () => clearTimeout(dismiss);
  }, [profileLoaded]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: s } }: any) => {
      setSession(s);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: any, s: any) => {
      setSession(s);
      if (!s) setIsAdminView(false);
    });

    // Fetch Profile Data
    const fetchProfile = async () => {
      try {
        const { data } = await supabase.from('profile').select('*').single();
        if (data) {
          setDynamicProfile({
            ...data,
            email: 'ikhsanuddin.rz@gmail.com'
          });
        }

        const { data: socialsData } = await supabase.from('socials').select('*').order('id', { ascending: true });
        if (socialsData) setDynamicSocials(socialsData);
      } finally {
        setProfileLoaded(true);
      }
    };
    fetchProfile();

    return () => subscription.unsubscribe();
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
                      {loadProgress < 30 ? 'Neural Check' : loadProgress < 60 ? 'Porting Data' : loadProgress < 90 ? 'Finalizing' : 'Ready'}
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
            <About profile={dynamicProfile} />
            <Expertise />
            <Projects />
            <Journey />
            <Certificates />
            <Contact profile={dynamicProfile} socials={dynamicSocials} />
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
