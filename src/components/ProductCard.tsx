import React, { memo } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ShoppingCart, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ProductCard = memo(({ product, isMobile }: any) => {
  const navigate = useNavigate();
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

  return (
    <motion.div
      initial={{ opacity: 0, y: isMobile ? 16 : 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={!isMobile ? { perspective: 1000 } : {}}
      className="group h-full"
    >
      <motion.div
        style={!isMobile ? { rotateX, rotateY } : {}}
        className="relative h-full rounded-2xl md:rounded-3xl overflow-hidden glass-morphism border border-white/5 group-hover:border-indigo-500/30 transition-all duration-300 flex flex-col bg-[#05001a]/50 will-change-transform"
      >
        {/* Glow behind */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-indigo-500/10 group-hover:via-purple-500/10 group-hover:to-pink-500/10 transition-all duration-500 pointer-events-none" />
        
        {/* Image */}
        <div className="h-40 sm:h-48 md:h-56 relative overflow-hidden bg-black/40">
          <div className="absolute inset-0 bg-gradient-to-t from-[#05001a] to-transparent z-10" />
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white/20">No Image</div>
          )}
          
          <div className="absolute top-3 right-3 z-20">
            <div className="px-3 py-1 rounded-full bg-indigo-500/20 backdrop-blur-md border border-indigo-500/30 font-bold text-xs text-indigo-300">
              {product.price || 'Free'}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 md:p-6 flex-1 flex flex-col z-20 relative">
          <h3 className="text-xl md:text-2xl font-black font-display tracking-tight text-white group-hover:text-indigo-400 transition-colors duration-500 line-clamp-1 mb-2">
            {product.title}
          </h3>
          <p className="text-gray-400/80 text-xs md:text-sm leading-relaxed line-clamp-2 font-medium mb-4">
            {product.description}
          </p>

          <div className="mt-auto pt-4 border-t border-white/5 flex items-center gap-2">
            <button
              onClick={() => navigate(`/product/${product.id}`)}
              className="flex-1 min-h-[40px] px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white font-bold text-[10px] tracking-widest uppercase transition-all flex items-center justify-center gap-2 hover:bg-white/10 active:scale-95"
            >
              <Sparkles className="w-3 h-3 text-indigo-400" />
              Detail
            </button>
            {product.checkout_url && (
              <a
                href={product.checkout_url}
                target="_blank"
                rel="noreferrer"
                className="flex-1 min-h-[40px] px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl text-white font-bold text-[10px] tracking-widest uppercase transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 active:scale-95"
              >
                <ShoppingCart className="w-3 h-3" />
                Get It
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
});
