import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Lock, User, LogIn } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface LoginModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const LoginModal = ({ onClose, onSuccess }: LoginModalProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="relative w-full max-w-md p-10 rounded-[2.5rem] bg-[#030014] border border-white/10 shadow-[0_0_100px_rgba(139,92,246,0.2)]"
      >
        <button onClick={onClose} className="absolute top-8 right-8 text-gray-400 hover:text-white transition-colors">
          <X className="w-6 h-6" />
        </button>

        <div className="space-y-8">
          <div className="text-center space-y-2">
            <div className="inline-flex p-4 rounded-2xl bg-purple-600/10 text-purple-400 mb-4">
              <Lock className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-black font-display uppercase tracking-tight text-white">Admin Access</h2>
            <p className="text-gray-400 text-sm">Secure cosmic gateway for curators</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 ml-1">Email Terminal</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all font-body"
                  placeholder="admin@galaxy.dev"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 ml-1">Access Protocol</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all font-body"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {error && (
              <p className="text-red-400 text-xs bg-red-400/10 p-4 rounded-xl border border-red-400/20">{error}</p>
            )}

            <button 
              disabled={loading}
              className="w-full py-5 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl text-white font-bold text-[11px] tracking-[0.2em] uppercase transition-all flex items-center justify-center gap-3 relative overflow-hidden group shadow-lg shadow-purple-900/20"
            >
              {loading ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : (
                <>
                  <LogIn className="w-4 h-4" />
                  Initialize Access
                </>
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default LoginModal;
