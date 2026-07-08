import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, Plus, Trash2, LogOut, Code2, Cpu, Globe, Layers, Rocket,
  FolderKanban, UserCog, Save, Github, 
  Globe as GlobeIcon, Mail, Edit3, X, Upload, Loader2, Filter, Link2,
  Terminal, Zap, Database, Smartphone, Palette, Share2, Instagram, Linkedin, MessageCircle,
  Gem, Sparkles, Wand2, Briefcase, GraduationCap, Award, ExternalLink
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface DashboardProps {
  onBack: () => void;
}

const CATEGORIES = [
  "Web Programming",
  "Web Crawling",
  "Python Dashboard",
  "Data Analysis",
  "Design",
  "Tools/Utility"
];

const ICON_OPTIONS = [
  { name: 'Code2', icon: Code2 },
  { name: 'Cpu', icon: Cpu },
  { name: 'Globe', icon: Globe },
  { name: 'Layers', icon: Layers },
  { name: 'Rocket', icon: Rocket },
  { name: 'Terminal', icon: Terminal },
  { name: 'Zap', icon: Zap },
  { name: 'Database', icon: Database },
  { name: 'Smartphone', icon: Smartphone },
  { name: 'Palette', icon: Palette },
  { name: 'Share2', icon: Share2 },
  { name: 'Sparkles', icon: Sparkles },
  { name: 'Gem', icon: Gem },
  { name: 'Wand2', icon: Wand2 },
  { name: 'Briefcase', icon: Briefcase },
  { name: 'GraduationCap', icon: GraduationCap },
  { name: 'Award', icon: Award }
];

const Dashboard = ({ onBack }: DashboardProps) => {
  const [activeTab, setActiveTab] = useState<'projects' | 'profile' | 'skills' | 'experiences' | 'certificates' | 'socials'>('projects');
  
  // States
  const [projects, setProjects] = useState<any[]>([]);
  const [skills, setSkills] = useState<any[]>([]);
  const [experiences, setExperiences] = useState<any[]>([]);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [socials, setSocials] = useState<any[]>([]);
  
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [isEditingSkill, setIsEditingSkill] = useState<number | null>(null);
  const [isEditingExp, setIsEditingExp] = useState<number | null>(null);
  const [isEditingCert, setIsEditingCert] = useState<number | null>(null);
  const [isEditingSocial, setIsEditingSocial] = useState<number | null>(null);
  
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [uploading, setUploading] = useState(false);

  // Form States
  const [formData, setFormData] = useState({
    title: '', description: '', image: '', tech: '', link: '', icon_name: 'Code2', category: 'Web Programming'
  });
  const [skillForm, setSkillForm] = useState({
    title: '', description: '', icon_name: 'Sparkles'
  });
  const [expForm, setExpForm] = useState({
    company: '', role: '', period: '', description: '', images: '', tags: ''
  });
  const [certForm, setCertForm] = useState({
    title: '', issuer: '', start_year: '', end_year: '', description: '', file_url: '', score: ''
  });
  const [socialForm, setSocialForm] = useState({
    platform: 'GitHub', url: '', icon_name: 'Github'
  });
  const [profile, setProfile] = useState<any>({
    full_name: '', roles: '', bio_main: '', bio_sub: '',
    role_label: '', tech_label: '', focus_label: '',
    github_url: '', email: '', linkedin_url: '', instagram_url: '', whatsapp_url: ''
  });

  const fetchData = async () => {
    const { data: projData } = await supabase.from('projects').select('*').order('id', { ascending: false });
    if (projData) setProjects(projData);

    const { data: skillData } = await supabase.from('skills').select('*').order('id', { ascending: true });
    if (skillData) setSkills(skillData);

    const { data: expData } = await supabase.from('experiences').select('*').order('id', { ascending: false });
    if (expData) setExperiences(expData);

    const { data: certData } = await supabase.from('certificates').select('*').order('id', { ascending: false });
    if (certData) setCertificates(certData);

    const { data: socialData } = await supabase.from('socials').select('*').order('id', { ascending: true });
    if (socialData) setSocials(socialData || []);

    const { data: profData } = await supabase.from('profile').select('*').single();
    if (profData) {
      setProfile({
        ...profData,
        email: 'ikhsanuddin.rz@gmail.com',
        roles: Array.isArray(profData.roles) ? profData.roles.join(', ') : profData.roles
      });
    }
  };

  useEffect(() => { fetchData(); }, []);

  // --- Image Compression Helper ---
  const compressImage = (file: File, maxWidth = 1200, maxHeight = 1200, quality = 0.8): Promise<File> => {
    return new Promise((resolve) => {
      if (!file.type.startsWith('image/')) {
        return resolve(file); // Don't compress non-image files (e.g. PDFs)
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Resize logic
          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) return resolve(file);

          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                // Convert blob back to File
                const newFileName = file.name.replace(/\.[^/.]+$/, "") + ".jpg";
                const compressedFile = new File([blob], newFileName, {
                  type: 'image/jpeg',
                  lastModified: Date.now()
                });
                resolve(compressedFile);
              } else {
                resolve(file);
              }
            },
            'image/jpeg',
            quality
          );
        };
        img.onerror = () => resolve(file);
      };
      reader.onerror = () => resolve(file);
    });
  };

  // --- Common Handlers ---
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: 'project' | 'cert') => {
    const originalFile = e.target.files?.[0];
    if (!originalFile) return;
    setUploading(true);
    try {
      // Compress image if it is an image
      const file = await compressImage(originalFile);
      const fileName = `${Date.now()}-${file.name}`;
      const { error } = await supabase.storage.from('images').upload(fileName, file);
      if (error) throw error;
      const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(fileName);
      if (target === 'project') setFormData({ ...formData, image: publicUrl });
      else setCertForm({ ...certForm, file_url: publicUrl });
    } catch (err) {
      console.error('Upload error:', err);
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  // --- Project Handlers ---
  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const techArray = formData.tech ? formData.tech.split(',').map(t => t.trim()) : [];
    const payload = { ...formData, tech: techArray };
    if (isEditing) {
      await supabase.from('projects').update(payload).eq('id', isEditing);
      setIsEditing(null);
    } else {
      await supabase.from('projects').insert([payload]);
    }
    setFormData({ title: '', description: '', image: '', tech: '', link: '', icon_name: 'Code2', category: 'Web Programming' });
    fetchData();
  };

  const startEdit = (p: any) => {
    setIsEditing(p.id);
    setFormData({
      title: p.title,
      description: p.description || '',
      image: p.image || '',
      tech: Array.isArray(p.tech) ? p.tech.join(', ') : '',
      link: p.link || '',
      icon_name: p.icon_name || 'Code2',
      category: p.category || 'Web Programming'
    });
  };

  // --- Skill Handlers ---
  const handleSkillSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditingSkill) {
      await supabase.from('skills').update(skillForm).eq('id', isEditingSkill);
      setIsEditingSkill(null);
    } else {
      await supabase.from('skills').insert([skillForm]);
    }
    setSkillForm({ title: '', description: '', icon_name: 'Sparkles' });
    fetchData();
  };

  // --- Experience Handlers ---
  const handleExpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const tagsArray = expForm.tags ? expForm.tags.split(',').map(t => t.trim()).filter(Boolean) : [];
    const imagesArray = expForm.images ? expForm.images.split('\n').map(u => u.trim()).filter(Boolean) : [];
    const payload = { 
      company: expForm.company, 
      role: expForm.role, 
      period: expForm.period, 
      description: expForm.description,
      tags: tagsArray,
      images: imagesArray
    };
    if (isEditingExp) {
      await supabase.from('experiences').update(payload).eq('id', isEditingExp);
      setIsEditingExp(null);
    } else {
      await supabase.from('experiences').insert([payload]);
    }
    setExpForm({ company: '', role: '', period: '', description: '', images: '', tags: '' });
    fetchData();
  };

  const handleExpImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const uploadedUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const originalFile = files[i];
        // Compress the image client-side first
        const file = await compressImage(originalFile);
        const fileName = `exp-${Date.now()}-${i}-${file.name}`;
        const { error } = await supabase.storage.from('images').upload(fileName, file);
        if (error) throw error;
        const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(fileName);
        uploadedUrls.push(publicUrl);
      }
      const existing = expForm.images ? expForm.images.split('\n').map(u => u.trim()).filter(Boolean) : [];
      setExpForm({ ...expForm, images: [...existing, ...uploadedUrls].join('\n') });
    } catch (err) {
      console.error('Upload error:', err);
      alert('Upload failed');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  // --- Certificate Handlers ---
  const handleCertSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditingCert) {
      await supabase.from('certificates').update(certForm).eq('id', isEditingCert);
      setIsEditingCert(null);
    } else {
      await supabase.from('certificates').insert([certForm]);
    }
    setCertForm({ title: '', issuer: '', start_year: '', end_year: '', description: '', file_url: '', score: '' });
    fetchData();
  };

  const handleDeleteCert = async (id: number) => {
    if (confirm('Delete this certificate?')) {
      await supabase.from('certificates').delete().eq('id', id);
      fetchData();
    }
  };

  // --- Social Handlers ---
  const handleSocialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditingSocial) {
      await supabase.from('socials').update(socialForm).eq('id', isEditingSocial);
      setIsEditingSocial(null);
    } else {
      await supabase.from('socials').insert([socialForm]);
    }
    setSocialForm({ platform: 'GitHub', url: '', icon_name: 'Github' });
    fetchData();
  };

  const deleteSocial = async (id: number) => {
    if (confirm('Remove this connection?')) {
      await supabase.from('socials').delete().eq('id', id);
      fetchData();
    }
  };

  // --- Profile Handlers ---
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const rolesArray = typeof profile.roles === 'string' ? profile.roles.split(',').map((r: string) => r.trim()) : profile.roles;
    if (profile.id) {
      const { id, created_at, ...updateData } = profile; 
      await supabase.from('profile').update({ ...updateData, roles: rolesArray }).eq('id', id);
      alert('Identity Updated!');
    } else {
      await supabase.from('profile').insert([{ ...profile, roles: rolesArray }]);
      alert('Identity Initialized!');
      fetchData();
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    onBack();
  };

  return (
    <div className="flex min-h-screen bg-[#030014] text-white">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 bg-[#05001a] flex flex-col fixed h-full z-10 font-body">
        <div className="p-8">
          <div className="text-xl font-black tracking-tight font-display mb-1">
            REZKI<span className="text-indigo-400">.</span>ADMIN
          </div>
          <p className="text-[10px] text-gray-500 font-mono uppercase tracking-[0.2em] mt-2">v3.5 Credentials Ed.</p>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {[
            { id: 'projects', name: 'Artifacts', icon: FolderKanban },
            { id: 'skills', name: 'Expertise', icon: Sparkles },
            { id: 'experiences', name: 'Journey', icon: Briefcase },
            { id: 'certificates', name: 'Credentials', icon: Award },
            { id: 'profile', name: 'Identity', icon: UserCog },
            { id: 'socials', name: 'Connections', icon: Share2 },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-500 text-[10px] font-black uppercase tracking-[0.15em] ${activeTab === item.id ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-[0_0_20px_rgba(79,70,229,0.3)]' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
            >
              <item.icon className="w-4 h-4" /> {item.name}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-white/10">
          <button onClick={onBack} className="w-full mb-3 flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white text-[10px] font-bold uppercase tracking-wider transition-all">
            <ChevronRight className="w-4 h-4 rotate-180" /> Launch Site
          </button>
          <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-4 py-4 bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 rounded-2xl text-[10px] font-bold text-red-500 uppercase tracking-widest transition-all">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1 p-12 overflow-y-auto">
        <div className="max-w-6xl mx-auto text-left">
          
          {activeTab === 'projects' && (
            <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
              <div className="mb-14">
                <h2 className="text-5xl font-black font-display uppercase tracking-tighter">Project Matrix</h2>
                <p className="text-gray-500 font-mono text-[10px] uppercase mt-3 tracking-[0.4em]">Artifact Orchestration</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-14">
                <div className="lg:col-span-1">
                  <div className={`glass-morphism border rounded-[2.5rem] p-8 md:p-10 space-y-8 sticky top-10 transition-all duration-500 ${isEditing ? 'border-indigo-500/40' : 'border-white/10'}`}>
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-black uppercase tracking-[0.2em] flex items-center gap-3">
                        {isEditing ? <Edit3 className="w-5 h-5 text-indigo-400" /> : <Plus className="w-5 h-5 text-purple-400" />}
                        {isEditing ? 'Edit Artifact' : 'New Artifact'}
                      </h3>
                      {isEditing && <button onClick={() => setIsEditing(null)} className="p-2 text-gray-500 hover:text-white"><X className="w-5 h-5" /></button>}
                    </div>

                    <form onSubmit={handleProjectSubmit} className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Title</label>
                        <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl outline-none focus:border-purple-500/50 text-sm" required />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Image Archetype</label>
                        <div className="relative group/upload">
                          <input type="file" accept="image/*" onChange={e => handleFileUpload(e, 'project')} className="hidden" id="proj-file" />
                          <label htmlFor="proj-file" className="w-full flex flex-col items-center justify-center p-8 bg-white/5 border-2 border-dashed border-white/10 rounded-[2rem] hover:border-purple-500/50 transition-all cursor-pointer">
                            {uploading ? <Loader2 className="w-6 h-6 animate-spin text-purple-400" /> : (
                              <>
                                <Upload className="w-6 h-6 text-gray-500 mb-2" />
                                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 group-hover/upload:text-purple-400">Transmit File</span>
                              </>
                            )}
                          </label>
                        </div>
                        {formData.image && <p className="text-[9px] text-green-500 font-mono tracking-widest mt-2 uppercase">File Sync Successful</p>}
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-2">Description</label>
                        <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl outline-none focus:border-purple-500/50 text-sm h-32" placeholder="Describe the artifact..." />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-2">Category</label>
                        <select 
                          value={formData.category} 
                          onChange={e => setFormData({...formData, category: e.target.value})}
                          className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl outline-none focus:border-purple-500/50 text-sm appearance-none cursor-pointer"
                        >
                          {CATEGORIES.map(cat => <option key={cat} value={cat} className="bg-[#05001a]">{cat}</option>)}
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-2">Tech Stack (Comma Separated)</label>
                        <input type="text" value={formData.tech} onChange={e => setFormData({...formData, tech: e.target.value})} className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl outline-none focus:border-purple-500/50 text-sm" placeholder="e.g. React, Tailwind, Supabase" />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-2">Project URL / Live Link</label>
                        <input type="text" value={formData.link} onChange={e => setFormData({...formData, link: e.target.value})} className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl outline-none focus:border-purple-500/50 text-sm" placeholder="https://..." />
                      </div>

                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-2">Artifact Icon</label>
                        <div className="grid grid-cols-5 gap-2">
                          {ICON_OPTIONS.map(opt => (
                            <button
                              key={opt.name}
                              type="button"
                              onClick={() => setFormData({...formData, icon_name: opt.name})}
                              className={`p-3 rounded-xl border transition-all ${formData.icon_name === opt.name ? 'bg-purple-600 border-purple-500 text-white' : 'bg-white/5 border-white/10 text-gray-500 hover:text-white'}`}
                              title={opt.name}
                            >
                              <opt.icon className="w-4 h-4" />
                            </button>
                          ))}
                        </div>
                      </div>
                      <button type="submit" className="w-full py-5 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl font-black uppercase tracking-[0.3em] text-[10px]">
                        {isEditing ? 'COMMIT UPDATE' : 'INITIALIZE LAUNCH'}
                      </button>
                    </form>
                  </div>
                </div>
                  <div className="lg:col-span-2">
                   <div className="grid grid-cols-1 gap-6">
                      {projects.map((p) => (
                        <div key={p.id} className="group glass-morphism border border-white/10 p-8 rounded-[2.5rem] flex flex-col gap-8 hover:border-indigo-500/30 transition-all duration-300">
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-6">
                              <img src={p.image} className="w-20 h-20 rounded-[1.5rem] object-cover border border-white/10" />
                              <div>
                                  <h4 className="text-xl font-black uppercase tracking-tight text-white mb-1">{p.title}</h4>
                                  <span className="text-[10px] font-mono p-1 px-2 bg-indigo-500/10 text-indigo-400 rounded-lg border border-indigo-500/20">{p.category}</span>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button onClick={() => startEdit(p)} className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl text-gray-400 hover:text-indigo-400 transition-all" title="Edit Artifact"><Edit3 className="w-5 h-5" /></button>
                              <button onClick={async () => { if(confirm('Delete?')) { await supabase.from('projects').delete().eq('id', p.id); fetchData(); } }} className="p-4 bg-white/5 hover:bg-red-500/10 rounded-2xl text-gray-400 hover:text-red-400 transition-all" title="Delete Artifact"><Trash2 className="w-5 h-5" /></button>
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-white/5">
                            <button
                              onClick={() => setSelectedProject(p)}
                              className="flex-1 px-6 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-white font-bold text-[10px] tracking-widest uppercase transition-all flex items-center justify-center gap-3"
                            >
                              <Sparkles className="w-4 h-4 text-purple-400" />
                              Detail Artifak
                            </button>
                            <button
                              onClick={() => setSelectedProject(p)}
                              className="flex-1 px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl text-white font-bold text-[10px] tracking-widest uppercase transition-all flex items-center justify-center gap-3 shadow-lg shadow-indigo-500/20"
                            >
                              <GlobeIcon className="w-4 h-4" />
                              Lihat Artiffak
                            </button>
                          </div>
                        </div>
                      ))}
                   </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'certificates' && (
            <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
              <div className="mb-14">
                <h2 className="text-5xl font-black font-display uppercase tracking-tighter">Credentials Hub</h2>
                <p className="text-gray-500 font-mono text-[10px] uppercase mt-3 tracking-[0.3em]">Authenticate Qualifications</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-14">
                <div className="lg:col-span-1">
                  <form onSubmit={handleCertSubmit} className="glass-morphism border border-white/10 rounded-[2.5rem] p-10 space-y-6 sticky top-10">
                    <h3 className="text-sm font-black uppercase tracking-[0.2em] flex items-center gap-3">
                      <Award className="w-5 h-5 text-purple-400" /> {isEditingCert ? 'Modify Credential' : 'New Credential'}
                    </h3>
                    <div className="space-y-4">
                      <input type="text" placeholder="Certification Title" value={certForm.title} onChange={e => setCertForm({...certForm, title: e.target.value})} className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-sm" required />
                      <input type="text" placeholder="Issuing Institution" value={certForm.issuer} onChange={e => setCertForm({...certForm, issuer: e.target.value})} className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-sm" required />
                      <div className="grid grid-cols-2 gap-4">
                        <input type="text" placeholder="Start (e.g. Jan 2023)" value={certForm.start_year} onChange={e => setCertForm({...certForm, start_year: e.target.value})} className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-xs" />
                        <input type="text" placeholder="End (e.g. Des 2023)" value={certForm.end_year} onChange={e => setCertForm({...certForm, end_year: e.target.value})} className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-xs" />
                      </div>
                      <input type="text" placeholder="Score / Grade (Optional)" value={certForm.score} onChange={e => setCertForm({...certForm, score: e.target.value})} className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-sm" />
                      
                      <div className="relative group/upload">
                        <input type="file" accept="image/*,application/pdf" onChange={e => handleFileUpload(e, 'cert')} className="hidden" id="cert-file" />
                        <label htmlFor="cert-file" className="w-full flex flex-col items-center justify-center p-6 bg-white/5 border-2 border-dashed border-white/10 rounded-[2rem] hover:border-purple-500/50 transition-all cursor-pointer">
                          {uploading ? <Loader2 className="w-6 h-6 animate-spin text-purple-400" /> : (
                            <>
                              <Upload className="w-5 h-5 text-gray-500 mb-2" />
                              <span className="text-[9px] font-black uppercase tracking-widest text-gray-500 group-hover:text-purple-400">Upload Certificate</span>
                            </>
                          )}
                        </label>
                      </div>
                      {certForm.file_url && <p className="text-[9px] text-green-500 font-mono tracking-widest uppercase">Artifact Linked</p>}
                    </div>
                    <button type="submit" className="w-full py-5 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl font-black uppercase text-[10px] tracking-widest">{isEditingCert ? 'Update Credential' : 'Finalize Credential'}</button>
                    {isEditingCert && <button type="button" onClick={() => { setIsEditingCert(null); setCertForm({title:'', issuer:'', start_year:'', end_year:'', description:'', file_url:'', score:''}); }} className="w-full text-gray-500 uppercase text-[9px] font-black">Cancel</button>}
                  </form>
                </div>

                <div className="lg:col-span-2 space-y-4">
                  {certificates.map(cert => (
                    <div key={cert.id} className="group glass-morphism border border-white/10 p-8 rounded-[2.5rem] flex items-center justify-between hover:border-purple-500/30 transition-all duration-300">
                      <div className="flex gap-6 items-center">
                        <div className="p-5 rounded-2xl bg-purple-500/5 border border-white/10"><Award className="w-6 h-6 text-purple-400" /></div>
                        <div>
                          <h4 className="font-black uppercase text-xl text-white tracking-tight">{cert.title}</h4>
                          <p className="text-indigo-400 text-xs font-mono uppercase tracking-widest font-bold">{cert.issuer} • {cert.start_year === cert.end_year ? cert.start_year : `${cert.start_year} - ${cert.end_year}`}</p>
                          {cert.score && <span className="inline-block mt-2 px-3 py-1 bg-green-500/10 text-green-400 text-[9px] font-black border border-green-500/20 rounded-full uppercase tracking-tighter">Score: {cert.score}</span>}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {cert.file_url && <a href={cert.file_url} target="_blank" rel="noreferrer" className="p-4 bg-white/5 rounded-2xl hover:text-purple-400 transition-colors"><ExternalLink className="w-5 h-5" /></a>}
                        <button onClick={() => { setIsEditingCert(cert.id); setCertForm({title:cert.title, issuer:cert.issuer, start_year:cert.start_year||'', end_year:cert.end_year||'', description:cert.description||'', file_url:cert.file_url||'', score:cert.score||''}); }} className="p-4 bg-white/5 rounded-2xl hover:text-indigo-400 transition-colors"><Edit3 className="w-5 h-5" /></button>
                        <button onClick={() => handleDeleteCert(cert.id)} className="p-4 bg-white/5 rounded-2xl hover:text-red-400 transition-colors"><Trash2 className="w-5 h-5" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Expertise (Skills) Tab */}
          {activeTab === 'skills' && (
            <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
              <div className="mb-14">
                <h2 className="text-5xl font-black font-display uppercase tracking-tighter">Expertise Hub</h2>
                <p className="text-gray-500 font-mono text-[10px] uppercase mt-3 tracking-[0.3em]">Configure Core Competencies</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-14">
                <div className="lg:col-span-1">
                  <form onSubmit={handleSkillSubmit} className="glass-morphism border border-white/10 rounded-[2.5rem] p-10 space-y-6 sticky top-10">
                    <h3 className="text-sm font-black uppercase tracking-[0.2em] flex items-center gap-3">
                      <Sparkles className="w-5 h-5 text-indigo-400" /> {isEditingSkill ? 'Update skill' : 'New skill'}
                    </h3>
                    <div className="space-y-4">
                      <input type="text" placeholder="Skill Title" value={skillForm.title} onChange={e => setSkillForm({...skillForm, title: e.target.value})} className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-sm" required />
                      <textarea placeholder="Description" value={skillForm.description} onChange={e => setSkillForm({...skillForm, description: e.target.value})} className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-sm h-32" />
                      
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-2">Select Icon</label>
                        <div className="grid grid-cols-5 gap-2">
                          {ICON_OPTIONS.map(opt => (
                            <button
                              key={opt.name}
                              type="button"
                              onClick={() => setSkillForm({...skillForm, icon_name: opt.name})}
                              className={`p-3 rounded-xl border transition-all ${skillForm.icon_name === opt.name ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-white/5 border-white/10 text-gray-500 hover:text-white'}`}
                            >
                              <opt.icon className="w-4 h-4" />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                    <button type="submit" className="w-full py-5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl font-black uppercase text-[10px] tracking-widest">{isEditingSkill ? 'Sync Changes' : 'Add to Stack'}</button>
                  </form>
                </div>

                <div className="lg:col-span-2 space-y-4">
                  {skills.map(skill => (
                    <div key={skill.id} className="group glass-morphism border border-white/10 p-8 rounded-[2.5rem] flex items-center justify-between hover:border-indigo-500/30 transition-all duration-300">
                      <div className="flex gap-6 items-center">
                        <div className="p-5 rounded-2xl bg-indigo-500/5 border border-white/10">
                          {React.createElement(ICON_OPTIONS.find(i => i.name === (skill.icon_name || 'Sparkles'))?.icon || Sparkles, { className: "w-6 h-6 text-indigo-400" })}
                        </div>
                        <div>
                          <h4 className="font-black uppercase text-xl text-white tracking-tight">{skill.title}</h4>
                          <p className="text-gray-500 text-xs leading-relaxed max-w-md line-clamp-1">{skill.description}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => { setIsEditingSkill(skill.id); setSkillForm({title: skill.title, description: skill.description || '', icon_name: skill.icon_name || 'Sparkles'}); }} className="p-4 bg-white/5 rounded-2xl hover:text-indigo-400 transition-colors"><Edit3 className="w-5 h-5" /></button>
                        <button onClick={async () => { if(confirm('Delete skill?')) { await supabase.from('skills').delete().eq('id', skill.id); fetchData(); } }} className="p-4 bg-white/5 rounded-2xl hover:text-red-400 transition-colors"><Trash2 className="w-5 h-5" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Journey (Experiences) Tab */}
          {activeTab === 'experiences' && (
            <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
              <div className="mb-14">
                <h2 className="text-5xl font-black font-display uppercase tracking-tighter">Journey Hub</h2>
                <p className="text-gray-500 font-mono text-[10px] uppercase mt-3 tracking-[0.3em]">Professional Milestones</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-14">
                <div className="lg:col-span-1">
                  <form onSubmit={handleExpSubmit} className="glass-morphism border border-white/10 rounded-[2.5rem] p-10 space-y-6 sticky top-10">
                    <h3 className="text-sm font-black uppercase tracking-[0.2em] flex items-center gap-3">
                      <Briefcase className="w-5 h-5 text-indigo-400" /> {isEditingExp ? 'Edit Episode' : 'New Episode'}
                    </h3>
                    <div className="space-y-4">
                      <input type="text" placeholder="Instance / Company" value={expForm.company} onChange={e => setExpForm({...expForm, company: e.target.value})} className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-sm" required />
                      <input type="text" placeholder="Professional Role" value={expForm.role} onChange={e => setExpForm({...expForm, role: e.target.value})} className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-sm" required />
                      <input type="text" placeholder="Period (e.g. 2021 — Present)" value={expForm.period} onChange={e => setExpForm({...expForm, period: e.target.value})} className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-sm" required />
                      <textarea placeholder="Contribution Description" value={expForm.description} onChange={e => setExpForm({...expForm, description: e.target.value})} className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-sm h-32" />

                      {/* Tags field */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-2">Tags / Skills (pisahkan koma)</label>
                        <input
                          type="text"
                          placeholder="React, Python, Figma, ..."
                          value={expForm.tags}
                          onChange={e => setExpForm({...expForm, tags: e.target.value})}
                          className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-sm"
                        />
                      </div>

                      {/* Image upload */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-2">Upload Foto/Dokumentasi</label>
                        <label className={`flex items-center gap-3 w-full p-4 rounded-2xl border border-dashed border-white/20 cursor-pointer hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
                          {uploading ? <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" /> : <Upload className="w-4 h-4 text-indigo-400" />}
                          <span className="text-[11px] text-gray-400 font-mono">{uploading ? 'Uploading...' : 'Pilih 1 atau beberapa foto'}</span>
                          <input type="file" accept="image/*" multiple className="hidden" onChange={handleExpImageUpload} disabled={uploading} />
                        </label>
                        {/* URL list textarea */}
                        <textarea
                          placeholder="URL gambar (1 per baris) — otomatis terisi setelah upload"
                          value={expForm.images}
                          onChange={e => setExpForm({...expForm, images: e.target.value})}
                          className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-xs font-mono h-24 leading-relaxed"
                        />
                        {expForm.images && (
                          <p className="text-[10px] text-indigo-400 font-mono px-2">
                            {expForm.images.split('\n').filter(Boolean).length} foto terdaftar
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-3">
                      {isEditingExp && (
                        <button type="button" onClick={() => { setIsEditingExp(null); setExpForm({ company: '', role: '', period: '', description: '', images: '', tags: '' }); }} className="flex-1 py-5 bg-white/5 border border-white/10 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-white/10 transition-all">
                          Batal
                        </button>
                      )}
                      <button type="submit" className="flex-1 py-5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl font-black uppercase text-[10px] tracking-widest">{isEditingExp ? 'Update Journey' : 'Log Milestone'}</button>
                    </div>
                  </form>
                </div>

                <div className="lg:col-span-2 space-y-4">
                  {experiences.map(exp => (
                    <div key={exp.id} className="group glass-morphism border border-white/10 p-8 rounded-[2.5rem] hover:border-indigo-500/30 transition-all duration-300">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex gap-6 items-start flex-1 min-w-0">
                          <div className="p-5 rounded-2xl bg-indigo-500/5 border border-white/10 flex-shrink-0"><Briefcase className="w-6 h-6 text-indigo-400" /></div>
                          <div className="min-w-0">
                            <h4 className="font-black uppercase text-xl text-white tracking-tight">{exp.role}</h4>
                            <p className="text-indigo-400 text-xs font-mono uppercase tracking-widest font-bold">{exp.company} • {exp.period}</p>
                            {/* Badges row */}
                            <div className="flex flex-wrap gap-2 mt-3">
                              {exp.images && exp.images.length > 0 && (
                                <span className="flex items-center gap-1 px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-[9px] font-black uppercase tracking-widest text-purple-400">
                                  <Upload className="w-2.5 h-2.5" /> {exp.images.length} foto
                                </span>
                              )}
                              {exp.tags && exp.tags.length > 0 && exp.tags.slice(0, 3).map((tag: string) => (
                                <span key={tag} className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[9px] font-mono uppercase tracking-widest text-indigo-400">{tag}</span>
                              ))}
                              {exp.tags && exp.tags.length > 3 && (
                                <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] font-mono text-gray-500">+{exp.tags.length - 3}</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          <button
                            onClick={() => {
                              setIsEditingExp(exp.id);
                              setExpForm({
                                company: exp.company,
                                role: exp.role,
                                period: exp.period,
                                description: exp.description || '',
                                images: Array.isArray(exp.images) ? exp.images.join('\n') : '',
                                tags: Array.isArray(exp.tags) ? exp.tags.join(', ') : ''
                              });
                            }}
                            className="p-4 bg-white/5 rounded-2xl hover:text-indigo-400 transition-colors"
                          >
                            <Edit3 className="w-5 h-5" />
                          </button>
                          <button onClick={async () => { if(confirm('Remove milestone?')) { await supabase.from('experiences').delete().eq('id', exp.id); fetchData(); } }} className="p-4 bg-white/5 rounded-2xl hover:text-red-400 transition-colors"><Trash2 className="w-5 h-5" /></button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {activeTab === 'profile' && (
            <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
              <div className="mb-14">
                <h2 className="text-5xl font-black font-display uppercase tracking-tighter">Identity Matrix</h2>
                <p className="text-gray-500 font-mono text-[10px] uppercase mt-3 tracking-[0.4em]">Personal Branding & Data</p>
              </div>

              <form onSubmit={handleUpdateProfile} className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Basic Info */}
                  <div className="glass-morphism border border-white/10 rounded-[2.5rem] p-8 space-y-6">
                    <h3 className="text-sm font-black uppercase tracking-[0.2em] flex items-center gap-3">
                      <UserCog className="w-5 h-5 text-purple-400" /> Core Identity
                    </h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-2">Full Name</label>
                        <input type="text" value={profile.full_name||''} onChange={e => setProfile({...profile, full_name: e.target.value})} className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl outline-none focus:border-purple-500/50 text-sm" placeholder="e.g. Ikhsanuddin Rezki" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-2">Roles (Comma Separated)</label>
                        <input type="text" value={profile.roles||''} onChange={e => setProfile({...profile, roles: e.target.value})} className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl outline-none focus:border-purple-500/50 text-sm" placeholder="e.g. Frontend Developer, UI Designer" />
                      </div>
                    </div>
                  </div>

                  {/* Bio Data */}
                  <div className="glass-morphism border border-white/10 rounded-[2.5rem] p-8 space-y-6">
                    <h3 className="text-sm font-black uppercase tracking-[0.2em] flex items-center gap-3">
                      <Edit3 className="w-5 h-5 text-indigo-400" /> Biographical Narratives
                    </h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-2">Main Bio</label>
                        <textarea value={profile.bio_main||''} onChange={e => setProfile({...profile, bio_main: e.target.value})} className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl outline-none focus:border-indigo-500/50 text-sm h-24" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-2">Sub Bio</label>
                        <textarea value={profile.bio_sub||''} onChange={e => setProfile({...profile, bio_sub: e.target.value})} className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl outline-none focus:border-indigo-500/50 text-sm h-16" />
                      </div>
                    </div>
                  </div>

                  {/* About Labels */}
                  <div className="glass-morphism border border-white/10 rounded-[2.5rem] p-8 space-y-6">
                    <h3 className="text-sm font-black uppercase tracking-[0.2em] flex items-center gap-3">
                      <Filter className="w-5 h-5 text-purple-400" /> Section Labels
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-2">Role Label</label>
                        <input type="text" value={profile.role_label||''} onChange={e => setProfile({...profile, role_label: e.target.value})} className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-purple-500/50 text-xs" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-2">Tech Label</label>
                        <input type="text" value={profile.tech_label||''} onChange={e => setProfile({...profile, tech_label: e.target.value})} className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-purple-500/50 text-xs" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-2">Focus Label</label>
                        <input type="text" value={profile.focus_label||''} onChange={e => setProfile({...profile, focus_label: e.target.value})} className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-purple-500/50 text-xs" />
                      </div>
                    </div>
                  </div>

                  {/* Social Links */}
                  <div className="glass-morphism border border-white/10 rounded-[2.5rem] p-8 space-y-6">
                    <h3 className="text-sm font-black uppercase tracking-[0.2em] flex items-center gap-3">
                      <Link2 className="w-5 h-5 text-indigo-400" /> Digital Connection
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-2xl">
                        <Github className="w-4 h-4 text-gray-400" />
                        <input type="text" value={profile.github_url||''} onChange={e => setProfile({...profile, github_url: e.target.value})} className="flex-1 bg-transparent border-none outline-none text-[10px]" placeholder="GitHub URL" />
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-2xl">
                        <Linkedin className="w-4 h-4 text-blue-400" />
                        <input type="text" value={profile.linkedin_url||''} onChange={e => setProfile({...profile, linkedin_url: e.target.value})} className="flex-1 bg-transparent border-none outline-none text-[10px]" placeholder="LinkedIn URL" />
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-2xl">
                        <Instagram className="w-4 h-4 text-pink-400" />
                        <input type="text" value={profile.instagram_url||''} onChange={e => setProfile({...profile, instagram_url: e.target.value})} className="flex-1 bg-transparent border-none outline-none text-[10px]" placeholder="Instagram URL" />
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-2xl">
                        <MessageCircle className="w-4 h-4 text-green-400" />
                        <input type="text" value={profile.whatsapp_url||''} onChange={e => setProfile({...profile, whatsapp_url: e.target.value})} className="flex-1 bg-transparent border-none outline-none text-[10px]" placeholder="WhatsApp Number" />
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-2xl">
                        <Mail className="w-4 h-4 text-purple-400" />
                        <input type="email" value={profile.email||''} onChange={e => setProfile({...profile, email: e.target.value})} className="flex-1 bg-transparent border-none outline-none text-[10px]" placeholder="Professional Email" />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button type="submit" className="px-16 py-6 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-[2rem] font-black uppercase tracking-[0.4em] text-[10px] shadow-[0_0_40px_rgba(79,70,229,0.3)] hover:scale-[1.02] transition-all flex items-center gap-4 group">
                    <Save className="w-4 h-4 group-hover:rotate-12 transition-transform" /> Sync Identity
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'socials' && (
            <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
              <div className="mb-14">
                <h2 className="text-5xl font-black font-display uppercase tracking-tighter">Connection Hub</h2>
                <p className="text-gray-500 font-mono text-[10px] uppercase mt-3 tracking-[0.4em]">Dynamic Social Integration</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-14">
                <div className="lg:col-span-1">
                  <form onSubmit={handleSocialSubmit} className="glass-morphism border border-white/10 rounded-[2.5rem] p-10 space-y-6 sticky top-10">
                    <h3 className="text-sm font-black uppercase tracking-[0.2em] flex items-center gap-3">
                      {isEditingSocial ? <Edit3 className="w-5 h-5 text-indigo-400" /> : <Plus className="w-5 h-5 text-purple-400" />}
                      {isEditingSocial ? 'Update Link' : 'New Link'}
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-2">Select Platform</label>
                        <div className="grid grid-cols-4 gap-2">
                          {[
                            { name: 'GitHub', icon: Github },
                            { name: 'LinkedIn', icon: Linkedin },
                            { name: 'Instagram', icon: Instagram },
                            { name: 'WhatsApp', icon: MessageCircle },
                            { name: 'Email', icon: Mail },
                            { name: 'X', icon: Share2 },
                            { name: 'Web', icon: GlobeIcon },
                            { name: 'Portfolio', icon: Rocket },
                          ].map(plat => (
                            <button
                              key={plat.name}
                              type="button"
                              onClick={() => setSocialForm({...socialForm, platform: plat.name, icon_name: plat.name})}
                              className={`p-4 rounded-xl border transition-all flex items-center justify-center ${socialForm.platform === plat.name ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-white/5 border-white/10 text-gray-500 hover:text-white'}`}
                              title={plat.name}
                            >
                              <plat.icon className="w-5 h-5" />
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-2">Profile URL</label>
                        <input 
                          type="text" 
                          value={socialForm.url} 
                          onChange={e => setSocialForm({...socialForm, url: e.target.value})} 
                          className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl outline-none focus:border-indigo-500/50 text-sm" 
                          placeholder="https://..."
                          required 
                        />
                      </div>
                    </div>

                    <button type="submit" className="w-full py-5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-indigo-500/20">
                      {isEditingSocial ? 'Sync Connection' : 'Establish Link'}
                    </button>
                    
                    {isEditingSocial && (
                      <button 
                        type="button" 
                        onClick={() => { setIsEditingSocial(null); setSocialForm({platform: 'GitHub', url: '', icon_name: 'Github'}); }} 
                        className="w-full text-gray-500 uppercase text-[9px] font-black hover:text-white transition-colors"
                      >
                        Cancel Edit
                      </button>
                    )}
                  </form>
                </div>

                <div className="lg:col-span-2">
                  <div className="grid grid-cols-1 gap-4">
                    {socials.map((s) => (
                      <div key={s.id} className="group glass-morphism border border-white/10 p-8 rounded-[2.5rem] flex items-center justify-between hover:border-indigo-500/30 transition-all duration-300">
                        <div className="flex items-center gap-6">
                          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 group-hover:scale-110 transition-transform duration-500">
                             {/* Icon Mapping Helper would be better but let's do a simple one here */}
                             {s.platform === 'GitHub' && <Github className="w-6 h-6 text-gray-300" />}
                             {s.platform === 'LinkedIn' && <Linkedin className="w-6 h-6 text-blue-400" />}
                             {s.platform === 'Instagram' && <Instagram className="w-6 h-6 text-pink-400" />}
                             {s.platform === 'WhatsApp' && <MessageCircle className="w-6 h-6 text-green-400" />}
                             {s.platform === 'Email' && <Mail className="w-6 h-6 text-purple-400" />}
                             {s.platform === 'X' && <Share2 className="w-6 h-6 text-gray-400" />}
                             {s.platform === 'Web' && <GlobeIcon className="w-6 h-6 text-indigo-400" />}
                             {s.platform === 'Portfolio' && <Rocket className="w-6 h-6 text-orange-400" />}
                          </div>
                          <div className="overflow-hidden">
                            <h4 className="text-xl font-black uppercase tracking-tight text-white mb-1">{s.platform}</h4>
                            <p className="text-[10px] font-mono text-gray-500 truncate max-w-[200px] md:max-w-md">{s.url}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => { setIsEditingSocial(s.id); setSocialForm({platform: s.platform, url: s.url, icon_name: s.icon_name}); }} className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl text-gray-400 hover:text-indigo-400 transition-colors">
                            <Edit3 className="w-5 h-5" />
                          </button>
                          <button onClick={() => deleteSocial(s.id)} className="p-4 bg-white/5 hover:bg-red-500/10 rounded-2xl text-gray-400 hover:text-red-400 transition-colors">
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                    {socials.length === 0 && (
                      <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-[3rem]">
                        <p className="text-gray-600 font-mono text-[10px] uppercase tracking-[0.4em]">No Active Connections Established</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Preview Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 overflow-hidden">
          <div 
            className="absolute inset-0 bg-[#030014]/90 backdrop-blur-xl"
            onClick={() => setSelectedProject(null)}
          />
          
          <div className="relative w-full max-w-4xl bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-[0_0_50px_rgba(168,85,247,0.2)] flex flex-col md:flex-row max-h-[90vh] animate-in fade-in zoom-in-95 duration-300">
            <button 
              onClick={() => setSelectedProject(null)}
              className="absolute top-6 right-6 z-50 p-3 rounded-full bg-black/50 border border-white/10 text-white/50 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Project Image */}
            <div className="w-full md:w-1/2 h-64 md:h-auto relative overflow-hidden bg-black/40 flex items-center justify-center">
              <img 
                src={selectedProject.image} 
                alt={selectedProject.title} 
                className="w-full h-full object-contain relative z-10"
              />
              <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#030014] via-transparent to-transparent z-20" />
            </div>

            {/* Project Info */}
            <div className="w-full md:w-1/2 p-8 md:p-12 overflow-y-auto custom-scrollbar">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                  {React.createElement(ICON_OPTIONS.find(i => i.name === selectedProject.icon_name)?.icon || Code2, { className: "w-6 h-6" })}
                </div>
                <div>
                  <span className="text-purple-400 font-mono text-[10px] uppercase tracking-widest font-bold">
                    {selectedProject.category || 'Web Programming'}
                  </span>
                  <h2 className="text-3xl md:text-4xl font-black font-display uppercase tracking-tight text-white mt-1">
                    {selectedProject.title}
                  </h2>
                </div>
              </div>

              <div className="space-y-8">
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">Project Overview</h4>
                  <p className="text-gray-300 leading-relaxed text-lg font-medium">
                    {selectedProject.description}
                  </p>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">Built With</h4>
                  <div className="flex flex-wrap gap-2">
                    {(Array.isArray(selectedProject.tech) ? selectedProject.tech : []).map((t: string) => (
                      <span key={t} className="px-4 py-2 text-[11px] font-mono tracking-widest uppercase bg-purple-500/5 text-purple-300 border border-purple-500/10 rounded-xl">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row gap-4">
                  {selectedProject.link && (
                    <a
                      href={selectedProject.link}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 px-8 py-5 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl text-white font-bold text-[11px] tracking-[0.2em] uppercase transition-all flex items-center justify-center gap-3 shadow-lg shadow-purple-500/20"
                    >
                      <GlobeIcon className="w-4 h-4" />
                      Kunjungi Proyek
                    </a>
                  )}
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="px-8 py-5 border border-white/10 rounded-2xl text-white font-bold text-[11px] tracking-[0.2em] uppercase transition-all flex items-center justify-center bg-white/5 hover:bg-white/10"
                  >
                    Tutup Preview
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
