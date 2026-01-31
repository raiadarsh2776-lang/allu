
import React, { useState } from 'react';
import { Subject, Chapter, User } from '../types';
import { CHAPTER_DATA } from '../constants';

interface PracticeSectionProps {
  onSelectChapter: (chapter: Chapter, mode: 'practice' | 'test') => void;
  user: User;
}

const PracticeSection: React.FC<PracticeSectionProps> = ({ onSelectChapter, user }) => {
  const [activeSubject, setActiveSubject] = useState<Subject>('Biology');
  const [activeClass, setActiveClass] = useState<'11' | '12'>('11');
  const [searchQuery, setSearchQuery] = useState('');

  const allSubjectChapters = CHAPTER_DATA[activeSubject];
  const filteredChapters = allSubjectChapters.filter(ch => {
    const matchesClass = ch.class === activeClass;
    const matchesSearch = ch.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesClass && matchesSearch;
  });

  const isChapterFree = (chapter: Chapter) => {
    if (activeSubject === 'Biology') return true;
    const index = allSubjectChapters.findIndex(ch => ch.id === chapter.id);
    return index < 2;
  };

  return (
    <section id="practice" className="min-h-screen py-32 px-4 md:px-12 bg-white dark:bg-slate-950 transition-colors">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <div className="inline-block px-4 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-[10px] font-black rounded-full uppercase tracking-widest mb-4">
            Curriculum 2025-26
          </div>
          <h2 className="text-5xl md:text-6xl font-black text-gray-900 dark:text-slate-50 mb-6 tracking-tighter">Mastery Modules</h2>
          <p className="text-lg text-gray-500 dark:text-slate-400 font-medium tracking-wide">
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">A to Z Biology</span> is 100% Free. All 38 Chapters Unlocked.
          </p>
        </div>

        {/* Subject Navigation */}
        <div className="flex flex-col items-center gap-10 mb-16">
          <div className="flex flex-wrap justify-center gap-4">
            {(['Biology', 'Physics', 'Chemistry'] as Subject[]).map(subject => (
              <button 
                key={subject} 
                onClick={() => { setActiveSubject(subject); setSearchQuery(''); }} 
                className={`px-12 py-5 rounded-[2rem] font-black uppercase text-[11px] tracking-[0.2em] transition-all relative ${activeSubject === subject ? 'bg-emerald-600 text-white shadow-2xl shadow-emerald-200 dark:shadow-emerald-900/30 scale-105' : 'bg-slate-50 dark:bg-slate-900 text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
              >
                {activeSubject === subject && <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-white dark:border-slate-800 animate-ping"></div>}
                {subject}
              </button>
            ))}
          </div>

          <div className="w-full max-w-2xl flex flex-col md:flex-row gap-4 items-center">
            <div className="bg-gray-100 dark:bg-slate-900 p-2 rounded-[2rem] flex gap-2 flex-shrink-0">
              {['11', '12'].map(cls => (
                <button 
                  key={cls} 
                  onClick={() => setActiveClass(cls as '11' | '12')} 
                  className={`px-10 py-3 rounded-[1.5rem] text-xs font-black uppercase tracking-widest transition-all ${activeClass === cls ? 'bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 shadow-md' : 'text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300'}`}
                >
                  Class {cls}
                </button>
              ))}
            </div>
            
            <div className="flex-1 w-full relative">
              <input 
                type="text"
                placeholder={`Search ${activeSubject} Chapters...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-8 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] focus:ring-4 focus:ring-emerald-500/5 outline-none font-bold text-slate-700 dark:text-slate-200 text-sm"
              />
              <span className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-600">🔍</span>
            </div>
          </div>
        </div>

        {/* Chapters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredChapters.length > 0 ? filteredChapters.map((chapter) => {
            const isFree = isChapterFree(chapter);
            const canAccess = user.isSubscribed || isFree;
            return (
              <div key={chapter.id} className="group relative bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden">
                {!canAccess && (
                  <div className="absolute inset-0 z-10 bg-white/60 dark:bg-slate-950/60 backdrop-blur-[6px] flex items-center justify-center p-6 text-center">
                     <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-2xl border border-emerald-50 dark:border-slate-800">
                        <div className="text-4xl mb-4">🔐</div>
                        <div className="font-black text-gray-900 dark:text-slate-50 mb-4 uppercase text-[10px] tracking-[0.2em]">Physics/Chem Pro</div>
                        <button onClick={() => document.getElementById('plans')?.scrollIntoView({behavior: 'smooth'})} className="bg-emerald-600 text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest">Unlock Plan</button>
                     </div>
                  </div>
                )}
                
                <div className="flex justify-between items-start mb-8">
                  <div className="flex gap-2">
                    <span className="bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border border-slate-100 dark:border-slate-700">NCERT</span>
                    {isFree && <span className="bg-emerald-500 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg shadow-emerald-100 dark:shadow-emerald-900/30">FREE ACCESS</span>}
                  </div>
                </div>

                <h3 className="text-xl md:text-2xl font-black text-gray-900 dark:text-slate-100 mb-10 leading-tight group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                  {chapter.name}
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <button onClick={() => canAccess && onSelectChapter(chapter, 'practice')} disabled={!canAccess} className="relative py-5 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-700 dark:hover:text-emerald-400 transition-all border border-transparent hover:border-emerald-100 dark:hover:border-emerald-800">
                    Practice
                  </button>
                  <button onClick={() => canAccess && onSelectChapter(chapter, 'test')} disabled={!canAccess} className="relative py-5 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-100 dark:shadow-emerald-900/20">
                    Mastery Test
                  </button>
                </div>
              </div>
            );
          }) : (
            <div className="col-span-full py-20 text-center bg-slate-50 dark:bg-slate-900 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
              <div className="text-5xl mb-4">🏜️</div>
              <h4 className="text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest">No chapters matching your search</h4>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default PracticeSection;
