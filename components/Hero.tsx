
import React from 'react';

const Hero: React.FC = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section id="hero" className="section-height flex flex-col items-center justify-center pt-40 pb-20 px-6 bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="max-w-6xl text-center">
        <div className="inline-flex items-center gap-3 bg-white dark:bg-slate-900 border border-emerald-100 dark:border-slate-800 px-6 py-2.5 rounded-full text-[10px] font-black mb-12 tracking-[0.3em] uppercase shadow-xl dark:text-slate-100 transition-colors">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
          </span>
          DR MAM'S OFFICIAL PREP PORTAL
        </div>
        
        <h1 className="text-7xl md:text-9xl font-black text-gray-900 dark:text-slate-50 mb-8 leading-[1] tracking-tighter">
          Target <span className="text-emerald-600">720/720</span>
        </h1>
        <p className="text-xl md:text-3xl text-gray-500 dark:text-slate-400 max-w-4xl mx-auto mb-16 font-bold leading-relaxed">
          Master every NCERT chapter with 5-Section Adaptive Practice.<br/>
          <span className="text-emerald-700 dark:text-emerald-400 font-black">Biology • Physics • Chemistry</span>
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-24">
          {[
            { val: "25K+", lab: "NCERT Questions", icon: "📊" },
            { id: "free", val: "FREE", lab: "First 2 Chapters", icon: "🎁" },
            { val: "DR MAM", lab: "Verified Logic", icon: "🩺" },
            { val: "5-SEC", lab: "Mastery Flow", icon: "🎯" }
          ].map((stat, i) => (
            <div key={i} className="bg-white/90 dark:bg-slate-900/90 p-8 rounded-[2rem] border border-white dark:border-slate-800 shadow-xl backdrop-blur-md hover:translate-y-[-5px] transition-all">
              <div className="text-4xl mb-3">{stat.icon}</div>
              <div className="text-3xl font-black text-gray-900 dark:text-slate-50 mb-1">{stat.val}</div>
              <div className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest">{stat.lab}</div>
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] shadow-2xl shadow-emerald-900/10 dark:shadow-none mb-20 text-left border border-emerald-50 dark:border-slate-800 max-w-4xl mx-auto transition-colors">
          <h3 className="text-2xl font-black text-gray-900 dark:text-slate-50 mb-6 flex items-center gap-3">
            <span className="bg-emerald-600 text-white w-8 h-8 rounded-lg flex items-center justify-center text-sm">?</span>
            How to start your Mastery?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <div className="font-black text-emerald-600 dark:text-emerald-400 text-xs uppercase tracking-widest">Step 1</div>
              <p className="text-sm text-gray-500 dark:text-slate-400 font-bold">Pick any subject below (Biology is recommended first).</p>
            </div>
            <div className="space-y-2">
              <div className="font-black text-emerald-600 dark:text-emerald-400 text-xs uppercase tracking-widest">Step 2</div>
              <p className="text-sm text-gray-500 dark:text-slate-400 font-bold">Try the first 2 chapters for free to see the level of questions.</p>
            </div>
            <div className="space-y-2">
              <div className="font-black text-emerald-600 dark:text-emerald-400 text-xs uppercase tracking-widest">Step 3</div>
              <p className="text-sm text-gray-500 dark:text-slate-400 font-bold">Subscribe to unlock all 100+ chapters for full access.</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <button onClick={() => scrollToSection('practice')} className="px-14 py-6 bg-emerald-600 text-white rounded-[1.5rem] font-black text-xl hover:bg-emerald-700 transition shadow-2xl shadow-emerald-200 dark:shadow-emerald-900/30 uppercase tracking-widest">Start Free Practice</button>
          <button onClick={() => scrollToSection('plans')} className="px-14 py-6 bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 border-2 border-emerald-600 dark:border-emerald-500 rounded-[1.5rem] font-black text-xl hover:bg-emerald-50 dark:hover:bg-slate-700 transition uppercase tracking-widest">See Pricing</button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
