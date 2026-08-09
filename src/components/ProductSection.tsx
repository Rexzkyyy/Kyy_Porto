import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { ProductCard } from './ProductCard';
import { Loader2 } from 'lucide-react';

export const ProductSection = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 768 || 'ontouchstart' in window;
  });

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    async function fetchProducts() {
      if (!supabase) {
        setLoading(false);
        return;
      }
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false });

        if (error) throw error;
        if (data) setProducts(data);
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="py-20 flex justify-center items-center">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  // Hide section if no products are active
  if (products.length === 0) return null;

  return (
    <section id="products" className="relative py-24 px-6 md:px-12 bg-[#030014]">
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
         <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-indigo-600/5 blur-[120px] rounded-full" />
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col mb-16 max-w-2xl text-center md:text-left">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-center md:justify-start gap-4 mb-4"
          >
            <div className="w-12 md:w-16 h-[2px] bg-gradient-to-r from-indigo-500 to-transparent" />
            <span className="text-indigo-400 font-mono tracking-[0.4em] uppercase text-[10px] md:text-xs font-bold">Premium Labs</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-5xl md:text-7xl font-black font-display uppercase tracking-tighter leading-none mb-6"
          >
            Digital <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">Assets</span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-sm md:text-lg leading-relaxed font-medium font-body"
          >
            Karya digital premium dan aset eksplorasi yang dapat Anda miliki untuk mempercepat alur kerja kreatif Anda.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {products.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product}
              isMobile={isMobile}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
