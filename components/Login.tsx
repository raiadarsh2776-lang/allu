
import React, { useState } from 'react';
import { User, AuthMethod } from '../types';
import { CONTACT_INFO } from '../constants';
import { DB } from '../services/db';
import { syncUserToFirestore } from '../services/firebase';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [authMethod, setAuthMethod] = useState<AuthMethod>('phone');
  const [name, setName] = useState('');
  const [identifier, setIdentifier] = useState(''); // Email or Phone
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !identifier) return;

    setLoading(true);
    
    // Simulate Server Latency
    setTimeout(async () => {
      const isAuthor = identifier === CONTACT_INFO.phone || identifier === CONTACT_INFO.secondaryPhone || identifier === CONTACT_INFO.email;
      
      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        name,
        authMethod,
        phone: authMethod === 'phone' ? identifier : undefined,
        email: authMethod === 'email' ? identifier : undefined,
        isSubscribed: isAuthor,
        joinedAt: new Date().toISOString()
      };

      // 1. Maintain existing localStorage logic
      DB.saveUser(newUser);

      // 2. Parallel Firebase layer for global tracking
      await syncUserToFirestore(newUser);

      onLogin(newUser);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[#022c22] p-4 overflow-y-auto">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-600/10 blur-[120px] rounded-full"></div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-[0_32px_80px_-12px_rgba(0,0,0,0.6)] animate-in zoom-in-95 fade-in duration-700 relative z-10">
        
        {/* Premium Header Section */}
        <div className="bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-800 p-10 md:p-12 text-white text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-400/20 rounded-full -ml-16 -mb-16 blur-2xl"></div>
          
          <div className="w-20 h-20 bg-white/15 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-xl border border-white/20 shadow-2xl ring-4 ring-white/5">
            <span className="text-4xl filter drop-shadow-md">🧬</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-black mb-2 tracking-tight uppercase leading-tight">
            Mastery Portal
          </h2>
          <p className="text-emerald-100 text-[9px] font-black tracking-[0.4em] uppercase opacity-90 mb-1">
            National Entrance Standard Prep
          </p>
          <div className="h-[1px] w-12 bg-emerald-400/50 mx-auto my-3"></div>
          <p className="text-emerald-200/80 text-[10px] font-bold tracking-wide italic">
            Trusted by NEET Aspirants Across India
          </p>
        </div>

        {/* Optimized Form Section */}
        <form onSubmit={handleSubmit} className="p-8 md:p-12">
          
          {/* Auth Method Switcher - Refined UI */}
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl mb-8 gap-1 border border-slate-200/50 dark:border-slate-700/50">
            <button 
              type="button"
              onClick={() => { setAuthMethod('phone'); setIdentifier(''); }}
              className={`flex-1 py-3.5 rounded-xl text-[10px] font-black tracking-widest transition-all duration-300 ${authMethod === 'phone' ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-400 shadow-md scale-[1.02]' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600'}`}
            >
              PHONE NUMBER
            </button>
            <button 
              type="button"
              onClick={() => { setAuthMethod('email'); setIdentifier(''); }}
              className={`flex-1 py-3.5 rounded-xl text-[10px] font-black tracking-widest transition-all duration-300 ${authMethod === 'email' ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-400 shadow-md scale-[1.02]' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600'}`}
            >
              EMAIL ADDRESS
            </button>
          </div>

          <div className="space-y-6 mb-8">
            <div className="group">
              <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2.5 px-1 group-focus-within:text-emerald-600 transition-colors">Candidate Full Name</label>
              <div className="relative">
                <input 
                  required 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="Ex: Adarsh Rai" 
                  className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 dark:focus:border-emerald-500/50 outline-none transition-all duration-300 font-bold text-slate-700 dark:text-slate-200 placeholder:opacity-30" 
                />
              </div>
            </div>

            <div className="group">
              <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2.5 px-1 group-focus-within:text-emerald-600 transition-colors">
                {authMethod === 'phone' ? '10-Digit Mobile Number' : 'Official Email ID'}
              </label>
              <div className="relative">
                <input 
                  required 
                  type={authMethod === 'phone' ? 'tel' : 'email'} 
                  value={identifier} 
                  onChange={(e) => setIdentifier(e.target.value)} 
                  placeholder={authMethod === 'phone' ? "99XXXXXXXX" : "name@example.com"} 
                  className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 dark:focus:border-emerald-500/50 outline-none transition-all duration-300 font-bold text-slate-700 dark:text-slate-200 placeholder:opacity-30" 
                />
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="group relative w-full py-5 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-[1.5rem] font-black text-lg hover:from-emerald-700 hover:to-emerald-800 active:scale-[0.98] transition-all duration-300 shadow-[0_20px_40px_-10px_rgba(16,185,129,0.3)] uppercase tracking-widest flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                VERIFYING...
              </>
            ) : (
              <>
                START NEET PRACTICE
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </>
            )}
          </button>
          
          {/* Trust Indicators Section */}
          <div className="mt-10 pt-8 border-t border-slate-100 dark:border-slate-800">
             <div className="flex flex-wrap justify-center items-center gap-y-4 gap-x-6 text-center">
                <div className="flex items-center gap-1.5 opacity-60">
                  <span className="text-emerald-500 text-sm">🔒</span>
                  <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-tighter">Secure Login</span>
                </div>
                <div className="w-[1px] h-3 bg-slate-200 dark:bg-slate-700 hidden sm:block"></div>
                <div className="flex items-center gap-1.5 opacity-60">
                  <span className="text-emerald-500 text-sm">📝</span>
                  <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-tighter">NTA Exam Pattern</span>
                </div>
                <div className="w-[1px] h-3 bg-slate-200 dark:bg-slate-700 hidden sm:block"></div>
                <div className="flex items-center gap-1.5 opacity-60">
                  <span className="text-emerald-500 text-sm">📊</span>
                  <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-tighter">AI Score Analysis</span>
                </div>
             </div>
             
             <p className="mt-8 text-center text-[8px] text-slate-300 dark:text-slate-600 font-bold uppercase tracking-[0.2em]">
               Authorized Personal Study Environment
             </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
