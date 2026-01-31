
import React from 'react';
import { CONTACT_INFO } from '../constants';
import { User } from '../types';

interface NavigationProps {
  user: User;
  onLogout: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ user, onLogout, isDarkMode, onToggleDarkMode }) => {
  const isAuthor = user.phone === CONTACT_INFO.phone || user.phone === CONTACT_INFO.secondaryPhone;

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <div className="bg-emerald-950 dark:bg-black text-white py-3.5 px-8 md:px-16 flex justify-between items-center text-[10px] md:text-xs font-black uppercase tracking-[0.3em] transition-colors">
        <div className="flex items-center gap-4">
          <span className="hidden md:block opacity-60">Authorized Portal by DR MAM</span>
          {isAuthor && (
            <span className="bg-emerald-500 text-white px-3 py-1 rounded-full animate-pulse flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
              MASTER ACCESS ACTIVE
            </span>
          )}
        </div>
        <div className="flex gap-8 items-center">
          <span className="flex items-center gap-2 hover:text-emerald-400 transition cursor-pointer">📞 {CONTACT_INFO.phone}</span>
          <span className="hidden sm:inline opacity-30">|</span>
          <span className="flex items-center gap-2 hover:text-emerald-400 transition cursor-pointer lowercase tracking-normal font-bold">✉ {CONTACT_INFO.email}</span>
        </div>
      </div>
      
      <nav className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl shadow-2xl shadow-emerald-900/10 dark:shadow-none border-b border-emerald-50 dark:border-slate-800 py-6 px-8 md:px-16 flex justify-between items-center transition-colors">
        <div className="flex items-center gap-4">
          <div className="bg-emerald-600 w-12 h-12 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg shadow-emerald-200 dark:shadow-emerald-900/20">🩺</div>
          <div className="text-4xl font-black text-emerald-700 dark:text-emerald-500 tracking-tighter uppercase leading-none">
            NEET<span className="text-gray-900 dark:text-slate-100">Mastery</span>
            <span className="block text-[9px] font-black tracking-[0.5em] text-gray-400 dark:text-slate-500 mt-1">NTA CHAPTER-WISE HUB</span>
          </div>
        </div>
        
        <div className="hidden lg:flex gap-12 font-black text-[10px] uppercase tracking-[0.4em] text-gray-400 dark:text-slate-500">
          <a href="#hero" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition">Dashboard</a>
          <a href="#practice" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition">Practice</a>
          <a href="#plans" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition">Unlock Full</a>
          <a href="#footer" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition">Help</a>
        </div>

        <div className="flex items-center gap-6">
           {/* Dark Mode Toggle */}
           <button 
             onClick={onToggleDarkMode}
             className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-emerald-400 hover:scale-110 transition-all border border-slate-100 dark:border-slate-700"
             aria-label="Toggle Dark Mode"
           >
             {isDarkMode ? '🌞' : '🌙'}
           </button>

           <div className="hidden md:flex flex-col items-end">
              <span className="text-[9px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest">Logged in as</span>
              <div className="flex items-center gap-3">
                <span className="text-xs font-black text-gray-900 dark:text-slate-100">{user.name}</span>
                <button 
                  onClick={onLogout}
                  className="text-[8px] font-black text-red-500 hover:text-red-700 uppercase tracking-tighter transition-colors"
                >
                  Logout
                </button>
              </div>
           </div>
           <a href="#practice" className="bg-gray-900 dark:bg-emerald-600 text-white px-10 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-emerald-600 dark:hover:bg-emerald-700 transition shadow-xl shadow-gray-200 dark:shadow-emerald-900/20">
            Start Practice
          </a>
        </div>
      </nav>
    </div>
  );
};

export default Navigation;
