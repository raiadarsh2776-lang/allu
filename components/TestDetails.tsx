
import React, { useState } from 'react';
import { Chapter } from '../types';

interface TestDetailsProps {
  chapter: Chapter | null;
  onClose: () => void;
  onStartQuiz: (lastMarks: number) => void;
  mode: 'practice' | 'test';
}

const TestDetails: React.FC<TestDetailsProps> = ({ chapter, onClose, onStartQuiz, mode }) => {
  const [lastMarks, setLastMarks] = useState<string>('');

  if (!chapter) return null;

  const handleStart = () => {
    const marks = parseInt(lastMarks) || 0;
    onStartQuiz(marks);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 rounded-[3rem] w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500 transition-colors">
        <div className="p-10">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-black text-gray-900 dark:text-slate-100 tracking-tight">
                Mastery Challenge
              </h2>
              <p className="text-sm text-gray-500 dark:text-slate-400 font-medium tracking-wide uppercase mt-1">NTA 2025 Protocol</p>
            </div>
            <button onClick={onClose} className="text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300 p-2 bg-gray-50 dark:bg-slate-800 rounded-full transition">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>

          <div className="bg-emerald-50 dark:bg-emerald-900/20 p-8 rounded-[2rem] mb-8 border border-emerald-100/50 dark:border-emerald-800/30">
            <div className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-[0.2em] mb-3">Selected Module</div>
            <h3 className="text-2xl font-black text-emerald-900 dark:text-emerald-100 mb-6 leading-tight">{chapter.name}</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm transition-colors">
                <div className="text-[10px] text-gray-400 dark:text-slate-500 font-black uppercase mb-1">Total Q</div>
                <div className="text-lg font-black text-gray-900 dark:text-slate-100">50 MCQs</div>
              </div>
              <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm transition-colors">
                <div className="text-[10px] text-gray-400 dark:text-slate-500 font-black uppercase mb-1">Architecture</div>
                <div className="text-lg font-black text-gray-900 dark:text-slate-100">5 Mastery Sections</div>
              </div>
            </div>
          </div>

          <div className="mb-10">
            <label className="block text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-4">Your Recent Mock Score (Out of 720)</label>
            <input 
              type="number" 
              value={lastMarks}
              onChange={(e) => setLastMarks(e.target.value)}
              placeholder="e.g. 450"
              className="w-full px-8 py-5 bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:bg-white dark:focus:bg-slate-700 outline-none transition text-xl font-black text-emerald-700 dark:text-emerald-400"
            />
            <p className="mt-3 text-[10px] text-gray-400 dark:text-slate-500 font-bold uppercase tracking-wider italic text-center">
              Our Expert Mastery Engine will generate 5 adaptive sections based on this score
            </p>
          </div>

          <div className="space-y-4">
            <button 
              onClick={handleStart}
              className="w-full bg-emerald-600 text-white py-5 rounded-[1.5rem] font-black text-xl hover:bg-emerald-700 transition shadow-2xl shadow-emerald-200 dark:shadow-emerald-900/30 uppercase tracking-widest"
            >
              Initialize Mastery Session
            </button>
            <div className="flex items-center justify-center gap-2 text-[10px] text-gray-400 dark:text-slate-500 font-black uppercase tracking-widest">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
              Internal Academy Standards Active
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestDetails;
