import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence, useAnimationFrame } from 'framer-motion';
import {
  Github, Mail,
  ExternalLink, Code2, Layers, Cpu, Globe, Rocket,
  X,
  Terminal, Zap, Database, Smartphone, Palette, Share2, Instagram, Linkedin, MessageCircle,
  Sparkles, Briefcase, Award
} from 'lucide-react';
import { supabase } from '../lib/supabase';

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

// Defer heavy components (like PDF viewer) until they scroll into view
const InViewRender = ({ children }: { children: React.ReactNode }) => {
  const [inView, setInView] = useState(false);
  return (
    <motion.div
      onViewportEnter={() => setInView(true)}
      viewport={{ once: true, margin: "200px" }}
      className="w-full h-full"
    >
      {inView ? children : null}
    </motion.div>
  );
};

const ICON_MAP: Record<string, any> = {
  Cpu, Globe, Layers, Rocket, Code2,
  Terminal, Zap, Database, Smartphone, Palette, Share2, Sparkles, Award
};

const DEFAULT_PROJECTS = [
  {
    title: "Pusat Kendali Kehumasan",
    description: "Advanced monitoring dashboard for organizational metrics with real-time data sync and cosmic visualization.",
    image: "/src/assets/IMG_2306.JPG.webp",
    tech: ["React", "Tailwind", "GSAP"],
    github: "https://github.com/Rexzkyyy",
    link: "#",
    icon_name: "Cpu"
  },
  {
    title: "Solar Monitoring IoT",
    description: "Smart energy tracking system with predictive analysis and low-latency data streams.",
    image: "/src/assets/IMG_2307.JPG.webp",
    tech: ["TypeScript", "Next.js", "MQTT"],
    github: "https://github.com/Rexzkyyy",
    link: "#",
    icon_name: "Globe"
  },
  {
    title: "E-Commerce Nebula",
    description: "A premium store experience with seamless transitions and high-performance server-side rendering.",
    image: "/src/assets/IMG_2308.JPG.webp",
    tech: ["Next.js", "Prisma", "Stripe"],
    github: "https://github.com/Rexzkyyy",
    link: "#",
    icon_name: "Layers"
  },
  {
    title: "AI Image Processor",
    description: "Neuro-linked image processing tool optimized for high-resolution graphics and cloud scaling.",
    image: "/src/assets/IMG_2309.JPG.webp",
    tech: ["Python", "Flask", "React"],
    github: "https://github.com/Rexzkyyy",
    link: "#",
    icon_name: "Rocket"
  },
  {
    title: "Cosmic Portfolio",
    description: "The very portfolio you are browsing—built for speed, aesthetics, and cinematic impact.",
    image: "/src/assets/lb0.webp",
    tech: ["React", "Three.js", "Framer"],
    github: "https://github.com/Rexzkyyy",
    link: "#",
    icon_name: "Code2"
  }
];

const LazyPdfThumbnail = React.lazy(() => import('./PdfThumbnail'));

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
                <h4 className="text-gray-400 text-[10px] uppercase tracking-widest font-bold mb-1">{stat.label}</h4>
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
// Item per halaman: 4 di mobile (2×2), 6 di desktop (3×2)
const ITEMS_PER_PAGE_MOBILE = 4;
const ITEMS_PER_PAGE_DESKTOP = 6;

const ProjectsGrid = ({ filteredProjects, onOpenDetails }: { filteredProjects: any[], onOpenDetails: (p: any) => void }) => {
  const isMobile = useIsMobile();
  const itemsPerPage = isMobile ? ITEMS_PER_PAGE_MOBILE : ITEMS_PER_PAGE_DESKTOP;
  const [currentPage, setCurrentPage] = useState(1);

  // Reset ke halaman 1 saat filter atau ukuran layar berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredProjects, itemsPerPage]);

  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // useCallback agar fungsi tidak dibuat ulang tiap render
  const handlePageChange = React.useCallback((page: number) => {
    if (page === currentPage) return;

    const section = document.getElementById('projects');
    if (section) {
      const offset = section.getBoundingClientRect().top + window.scrollY - 80;
      const distance = Math.abs(window.scrollY - offset);

      if (distance > 50) {
        // Instant scroll — synchronous, terjadi SEBELUM React re-render
        // Tidak ada animasi = tidak ada race condition, selalu akurat 100%
        window.scrollTo(0, offset);
      }
    }
    // Ganti halaman setelah posisi scroll sudah benar
    setCurrentPage(page);
  }, [currentPage]);

  return (
    <div>
      {/* Grid: 2 kolom di mobile, 2 di tablet, 3 di desktop */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
        <AnimatePresence mode="popLayout">
          {paginatedProjects.map((project, index) => (
            <ProjectCard
              key={project.id || index}
              project={project}
              index={index}
              onOpenDetails={onOpenDetails}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-center gap-2 mt-10 md:mt-16"
        >
          {/* Prev Button — touch target min 44px */}
          <motion.button
            whileHover={currentPage > 1 ? { scale: 1.05 } : {}}
            whileTap={currentPage > 1 ? { scale: 0.95 } : {}}
            onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Halaman sebelumnya"
            className={`flex items-center gap-1.5 md:gap-2 px-3 md:px-5 min-h-[44px] py-2 md:py-3 rounded-xl md:rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 border ${
              currentPage === 1
                ? 'border-white/5 text-white/20 cursor-not-allowed'
                : 'border-white/10 text-gray-300 hover:text-white hover:bg-white/10 bg-white/5 cursor-pointer active:scale-95'
            }`}
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="hidden sm:inline">Prev</span>
          </motion.button>

          {/* Page Numbers */}
          <div className="flex items-center gap-1 md:gap-1.5 px-1 md:px-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <motion.button
                key={page}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handlePageChange(page)}
                aria-label={`Halaman ${page}`}
                aria-current={currentPage === page ? 'page' : undefined}
                className={`w-10 h-10 md:w-11 md:h-11 rounded-xl text-[11px] font-black tracking-wider transition-all duration-300 border ${
                  currentPage === page
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-transparent shadow-[0_0_20px_rgba(99,102,241,0.4)]'
                    : 'border-white/10 text-gray-400 hover:text-white hover:bg-white/10 bg-white/5 active:scale-95'
                }`}
              >
                {page}
              </motion.button>
            ))}
          </div>

          {/* Next Button — touch target min 44px */}
          <motion.button
            whileHover={currentPage < totalPages ? { scale: 1.05 } : {}}
            whileTap={currentPage < totalPages ? { scale: 0.95 } : {}}
            onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label="Halaman berikutnya"
            className={`flex items-center gap-1.5 md:gap-2 px-3 md:px-5 min-h-[44px] py-2 md:py-3 rounded-xl md:rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 border ${
              currentPage === totalPages
                ? 'border-white/5 text-white/20 cursor-not-allowed'
                : 'border-white/10 text-gray-300 hover:text-white hover:bg-white/10 bg-white/5 cursor-pointer active:scale-95'
            }`}
          >
            <span className="hidden sm:inline">Next</span>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
            </svg>
          </motion.button>
        </motion.div>
      )}

      {/* Info halaman */}
      {totalPages > 1 && (
        <p className="text-center text-gray-600 text-[10px] font-mono uppercase tracking-widest mt-3 md:mt-4">
          Hal. {currentPage}/{totalPages} &mdash; {filteredProjects.length} Proyek
        </p>
      )}
    </div>
  );
};

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

        {/* Filter Bar — scrollable horizontal di mobile */}
        <div className="mb-8 md:mb-12">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 p-2 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl w-full md:w-fit">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`flex-shrink-0 min-h-[40px] px-4 md:px-6 py-2 md:py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                  activeFilter === filter
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-[0_0_20px_rgba(79,70,229,0.3)]'
                    : 'text-gray-400 active:text-white hover:text-white hover:bg-white/5'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-12 h-12 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
          </div>
        ) : (
          <ProjectsGrid
            filteredProjects={filteredProjects}
            onOpenDetails={setSelectedProject}
          />
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
          aria-label="Close modal"
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

const ProjectCard = React.memo(({ project, index, onOpenDetails }: { project: any, index: number, onOpenDetails: (p: any) => void }) => {
  const isMobile = useIsMobile();
  // Motion values hanya dibuat saat desktop — hemat memori di mobile
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-100, 100], [10, -10]), { stiffness: 100, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-100, 100], [-10, 10]), { stiffness: 100, damping: 30 });

  const handleMouseMove = React.useCallback((e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (isMobile) return;
    const rect = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - (rect.left + rect.width / 2));
    y.set(e.clientY - (rect.top + rect.height / 2));
  }, [isMobile, x, y]);

  const handleMouseLeave = React.useCallback(() => {
    x.set(0); y.set(0);
  }, [x, y]);

  const IconComponent = ICON_MAP[project.icon_name] || Code2;

  return (
    <motion.div
      initial={{ opacity: 0, y: isMobile ? 16 : 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ delay: isMobile ? 0 : index * 0.08, duration: isMobile ? 0.3 : 0.6 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={!isMobile ? { perspective: 1000 } : {}}
      className="group"
    >
      <motion.div
        style={!isMobile ? { rotateX, rotateY } : {}}
        className="relative h-full rounded-2xl md:rounded-3xl overflow-hidden glass-morphism border border-white/5 group-hover:border-purple-500/30 transition-all duration-300 flex flex-col"
      >
        {/* Image */}
        <div className="h-36 sm:h-44 md:h-56 lg:h-64 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-[#030014] to-transparent z-10" />
          <img
            src={project.image}
            alt={project.title}
            width="600" height="400"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
            decoding="async"
          />
          <div className="absolute top-2 md:top-4 left-2 md:left-4 z-20">
            <span className="px-2 md:px-3 py-0.5 md:py-1 rounded-md md:rounded-lg bg-indigo-500/20 backdrop-blur-md border border-indigo-500/30 text-[8px] md:text-[9px] font-black uppercase tracking-widest text-indigo-300">
              {project.category || 'Web'}
            </span>
          </div>
          <div className="absolute top-2 md:top-4 right-2 md:right-4 z-20">
            <div className="p-2 md:p-3 rounded-lg md:rounded-xl bg-black/40 backdrop-blur-md border border-white/10 text-purple-400">
              <IconComponent className="w-3.5 h-3.5 md:w-5 md:h-5" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 md:p-6 lg:p-8 flex-1 flex flex-col">
          <div className="space-y-2 md:space-y-4">
            {/* Tech tags — max 3 di mobile */}
            <div className="flex flex-wrap gap-1 md:gap-2">
              {project.tech.slice(0, isMobile ? 2 : project.tech.length).map((t: string) => (
                <span key={t} className="px-2 md:px-3 py-0.5 md:py-1 text-[8px] md:text-[10px] font-mono tracking-widest uppercase bg-purple-500/10 text-purple-300 border border-purple-500/20 rounded-full">
                  {t}
                </span>
              ))}
            </div>
            <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-black font-display tracking-tight text-white group-hover:text-purple-400 transition-colors duration-500 line-clamp-2">
              {project.title}
            </h3>
            <p className="text-gray-400/80 text-xs md:text-sm lg:text-base leading-relaxed line-clamp-2 md:line-clamp-3 font-medium">
              {project.description}
            </p>
          </div>

          <div className="mt-auto pt-3 md:pt-6 border-t border-white/5">
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenDetails(project)}
                className="flex-1 min-h-[40px] px-2 md:px-4 py-2 md:py-3 bg-white/5 border border-white/10 rounded-lg md:rounded-xl text-white font-bold text-[9px] md:text-[10px] tracking-widest uppercase transition-all flex items-center justify-center gap-1.5 hover:bg-white/10 active:scale-95"
              >
                <Sparkles className="w-3 h-3 text-purple-400 flex-shrink-0" />
                <span className="hidden sm:inline">Detail</span>
                <span className="sm:hidden">Info</span>
              </button>
              <button
                onClick={() => onOpenDetails(project)}
                className="flex-1 min-h-[40px] px-2 md:px-4 py-2 md:py-3 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg md:rounded-xl text-white font-bold text-[9px] md:text-[10px] tracking-widest uppercase transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-purple-500/20 active:scale-95"
              >
                <Globe className="w-3 h-3 flex-shrink-0" />
                <span className="hidden sm:inline">Lihat</span>
                <span className="sm:hidden">Open</span>
              </button>
            </div>
          </div>
        </div>

        {/* Hover glow — hanya desktop */}
        {!isMobile && (
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-transparent" />
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 blur-[80px]" />
          </div>
        )}
      </motion.div>
    </motion.div>
  );
});

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

// PdfThumbnail is lazy-loaded from ./components/PdfThumbnail.tsx
// This wrapper adds Suspense fallback so the 1.5MB react-pdf bundle
// is only fetched when a PDF certificate is actually in view.
const PdfThumbnail = ({ fileUrl }: { fileUrl: string }) => (
  <React.Suspense
    fallback={
      <div className="w-full h-full flex flex-col items-center justify-center bg-[#05001a]/50">
        <div className="w-8 h-8 border-2 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
        <span className="mt-3 text-[9px] font-mono text-purple-400/60 uppercase tracking-[0.3em]">Loading PDFâ€¦</span>
      </div>
    }
  >
    <LazyPdfThumbnail fileUrl={fileUrl} />
  </React.Suspense>
);

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
                  <InViewRender>
                  {(() => {
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
                  })()}
                  </InViewRender>
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
                  <span className="text-gray-400 font-mono text-[10px] uppercase tracking-widest font-bold">
                    {cert.start_year === cert.end_year ? cert.start_year : `${cert.start_year} â€” ${cert.end_year}`}
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



export default function BelowTheFold({ profile, socials }: { profile: any, socials: any[] }) {
  return (
    <>
      <About profile={profile} />
      <Expertise />
      <Projects />
      <Journey />
      <Certificates />
      <Contact profile={profile} socials={socials} />
    </>
  );
}
