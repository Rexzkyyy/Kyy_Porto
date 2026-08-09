import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ShoppingCart, Loader2, Rocket, Share2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import Lenis from 'lenis';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
    
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();

        const { data: profData } = await supabase
          .from('profile')
          .select('*')
          .single();

        if (error) throw error;
        setProduct(data);
        if (profData) setProfile(profData);
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030014] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#030014] flex flex-col items-center justify-center text-white">
        <h1 className="text-4xl font-black mb-4">Produk Tidak Ditemukan</h1>
        <button onClick={() => navigate('/#products')} className="px-6 py-3 bg-white/10 rounded-xl hover:bg-white/20 transition">Kembali ke Beranda</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030014] text-white font-body overflow-x-hidden">
      {/* Background Cinematic */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-indigo-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-purple-600/10 blur-[120px] rounded-full" />
      </div>

      {/* Navbar Minimalis */}
      <nav className="fixed top-0 inset-x-0 h-24 z-50 flex items-center px-6 md:px-12 bg-gradient-to-b from-[#030014] to-transparent pointer-events-none">
        <button 
          onClick={() => navigate('/#products')}
          className="pointer-events-auto flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all backdrop-blur-md group"
        >
          <ArrowLeft className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
          <span className="text-xs font-black uppercase tracking-widest text-gray-300 group-hover:text-white transition-colors">Kembali</span>
        </button>
      </nav>

      {/* Konten Utama */}
      <main className="relative z-10 pt-32 pb-40 px-6 md:px-12 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          
          {/* Kolom Gambar/Visual */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative"
          >
            <div className="sticky top-32">
              <div className="relative rounded-[3rem] overflow-hidden border border-white/10 glass-morphism shadow-[0_0_80px_rgba(99,102,241,0.15)] group">
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10 pointer-events-none" />
                
                {product.image_url ? (
                  <img 
                    src={product.image_url} 
                    alt={product.title} 
                    className="w-full aspect-[4/5] md:aspect-square object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full aspect-square flex items-center justify-center bg-black/40">
                    <span className="text-white/20 font-mono">Tanpa Gambar</span>
                  </div>
                )}
                
                <div className="absolute top-6 left-6 z-20">
                  <span className="px-4 py-2 bg-indigo-500/20 border border-indigo-500/30 rounded-full text-[10px] font-black uppercase tracking-widest text-indigo-300 backdrop-blur-md">
                    Premium Asset
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Kolom Detail */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="flex flex-col pt-4 lg:pt-12"
          >
            <h1 className="text-5xl md:text-7xl font-black font-display uppercase tracking-tighter leading-[1.1] mb-6">
              {product.title}
            </h1>
            
            <div className="text-3xl md:text-4xl font-mono text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 font-bold mb-10">
              {product.price || 'Gratis'}
            </div>

            <div className="w-full h-[1px] bg-white/10 mb-10" />

            <div className="prose prose-invert prose-p:text-gray-300 prose-p:leading-relaxed prose-p:text-lg mb-12">
              <p className="whitespace-pre-wrap">{product.description}</p>
            </div>

            {/* Fitur Tambahan (Dummy/Kosmetik untuk memperkaya desain) */}
            <div className="grid grid-cols-2 gap-4 mb-16">
              <div className="p-6 rounded-3xl bg-white/5 border border-white/10 flex flex-col gap-3">
                <Rocket className="w-6 h-6 text-indigo-400" />
                <h3 className="text-sm font-black uppercase tracking-widest text-white">Akses Instan</h3>
                <p className="text-xs text-gray-500 font-medium">Langsung dapat diunduh setelah konfirmasi.</p>
              </div>
              <div className="p-6 rounded-3xl bg-white/5 border border-white/10 flex flex-col gap-3">
                <Share2 className="w-6 h-6 text-purple-400" />
                <h3 className="text-sm font-black uppercase tracking-widest text-white">Kualitas Premium</h3>
                <p className="text-xs text-gray-500 font-medium">Dibuat dengan standar profesional tertinggi.</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Storytelling Sections */}
        {product.content_sections && product.content_sections.length > 0 && (
          <div className="mt-32 space-y-32">
            {product.content_sections.map((section: any, index: number) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="flex flex-col items-center"
              >
                {section.image_url && (
                  <div className="w-full max-w-5xl rounded-[2rem] overflow-hidden glass-morphism border border-white/10 shadow-[0_0_100px_rgba(139,92,246,0.1)] mb-12">
                    <img src={section.image_url} alt={`Detail ${index + 1}`} className="w-full h-auto object-cover" />
                  </div>
                )}
                {section.description && (
                  <div className="w-full max-w-3xl text-center prose prose-invert prose-p:text-gray-300 prose-p:leading-relaxed prose-p:text-xl">
                    <p className="whitespace-pre-wrap font-medium">{section.description}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* Floating CTA Action Bar */}
      <motion.div 
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5, type: "spring" }}
        className="fixed bottom-8 inset-x-0 z-50 px-6 pointer-events-none flex justify-center"
      >
        <div className="pointer-events-auto w-full max-w-md bg-[#05001a]/80 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-3 flex items-center justify-between shadow-[0_20px_60px_rgba(99,102,241,0.2)]">
          <div className="px-5 hidden sm:block">
            <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Total</p>
            <p className="text-base font-bold text-white">{product.price || 'Gratis'}</p>
          </div>
          
          <a 
            href={(() => {
              const baseWa = profile?.whatsapp_url;
              const number = baseWa ? baseWa.replace(/\D/g, '') : '';
              if (!number) return product.checkout_url || '#';
              const message = encodeURIComponent(`Halo Mas Ikhsan, saya tertarik untuk berdiskusi/memiliki karya digital: *${product.title}*. Apakah kita bisa ngobrol lebih lanjut?`);
              return `https://wa.me/${number}?text=${message}`;
            })()}
            onClick={(e) => {
              const baseWa = profile?.whatsapp_url;
              const number = baseWa ? baseWa.replace(/\D/g, '') : '';
              if (!number && !product.checkout_url) {
                e.preventDefault();
                alert('Peringatan: Tautan checkout atau nomor WhatsApp belum dikonfigurasi di halaman Admin (Profile/Socials).');
              }
            }}
            target="_blank"
            rel="noreferrer"
            className="flex-1 sm:flex-none flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-[2rem] text-white font-black text-xs uppercase tracking-[0.2em] transition-all shadow-[0_0_30px_rgba(99,102,241,0.4)] hover:scale-105 active:scale-95"
          >
            <ShoppingCart className="w-4 h-4" />
            Miliki Karya Ini
          </a>
        </div>
      </motion.div>
    </div>
  );
}
