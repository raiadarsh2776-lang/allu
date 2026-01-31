import React, { useState, useEffect } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { Chapter, QuizQuestion } from '../types';
import { DB } from '../services/db';

interface QuizEngineProps {
  chapter: Chapter;
  onClose: () => void;
  mode: 'practice' | 'test';
  lastMarks: number;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

const QuizEngine: React.FC<QuizEngineProps> = ({ 
  chapter, 
  onClose, 
  mode, 
  lastMarks,
  isDarkMode,
  onToggleDarkMode 
}) => {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [status, setStatus] = useState<'loading' | 'active' | 'levelComplete' | 'result' | 'error'>('loading');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [levelScores, setLevelScores] = useState<number[]>(new Array(5).fill(0));
  const [errorMsg, setErrorMsg] = useState('');

  const isBiology = chapter.id.startsWith('b');
  
  // Logic for Question Counts as requested
  const getQuestionCount = (level: number) => {
    if (isBiology) {
      return level === 5 ? 100 : 50;
    } else {
      return level === 5 ? 50 : 25;
    }
  };

  useEffect(() => {
    fetchLevelQuestions();
  }, [currentLevel]);

  const fetchLevelQuestions = async () => {
    setStatus('loading');
    setCurrentIndex(0);
    setSelectedAnswer(null);

    try {
      const apiKey = process.env.API_KEY;
      if (!apiKey) throw new Error("API Key configuration error.");

      const ai = new GoogleGenAI({ apiKey });
      const count = getQuestionCount(currentLevel);
      
      const prompt = `Generate exactly ${count} NEET-UG level MCQs for Level ${currentLevel} of the chapter: "${chapter.name}".
      Subject: ${isBiology ? 'Biology (NCERT based)' : 'Physics/Chemistry (NCERT based)'}.
      
      Structure Requirement:
      - ${currentLevel < 5 ? `Level ${currentLevel}/4: Focus on specific topic-wise sub-sections of the chapter for deep practice.` : `Level 5/5 (MASTERY): This is the FINAL GRADUATION test. Include questions from the FULL CHAPTER COMBINED, covering every possible NCERT line.`}
      
      Student Context:
      - Latest Mock Score: ${lastMarks}/720. Adjust difficulty to be challenging yet instructional.
      
      Format: JSON array of objects with {question, options, correctAnswer (0-3), explanation}.`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                options: { type: Type.ARRAY, items: { type: Type.STRING } },
                correctAnswer: { type: Type.INTEGER },
                explanation: { type: Type.STRING }
              },
              required: ["question", "options", "correctAnswer", "explanation"]
            }
          }
        }
      });

      const data = JSON.parse(response.text || "[]");
      if (!data || data.length === 0) throw new Error("No questions returned from engine.");
      
      setQuestions(data);
      setStatus('active');
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Failed to load questions. Check connection.");
      setStatus('error');
    }
  };

  const handleAnswer = (idx: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(idx);
    if (idx === questions[currentIndex].correctAnswer) {
      const newScores = [...levelScores];
      newScores[currentLevel - 1]++;
      setLevelScores(newScores);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
    } else {
      if (currentLevel < 5) {
        setStatus('levelComplete');
      } else {
        const totalScore = levelScores.reduce((a, b) => a + b, 0);
        const totalQs = [1,2,3,4,5].reduce((acc, lvl) => acc + getQuestionCount(lvl), 0);
        DB.saveExamResult({
          chapterId: chapter.id,
          score: totalScore,
          total: totalQs,
          timestamp: new Date().toISOString()
        });
        setStatus('result');
      }
    }
  };

  if (status === 'loading') {
    return (
      <div className="fixed inset-0 z-[300] bg-white dark:bg-slate-950 flex flex-col items-center justify-center p-10 text-center transition-colors">
        <div className="w-20 h-20 border-8 border-emerald-100 dark:border-slate-800 border-t-emerald-600 rounded-full animate-spin mb-8 shadow-2xl"></div>
        <div className="space-y-4">
          <h2 className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight uppercase">
            {currentLevel === 5 ? 'Generating Grand Test' : `Preparing Level ${currentLevel}`}
          </h2>
          <div className="flex items-center justify-center gap-2">
            <span className="bg-emerald-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
              {isBiology ? 'Biology' : 'Physics/Chemistry'} Mastery
            </span>
            <span className="bg-slate-100 dark:bg-slate-800 text-slate-500 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
              {getQuestionCount(currentLevel)} MCQs
            </span>
          </div>
          <p className="text-slate-400 dark:text-slate-500 font-bold text-xs max-w-sm mx-auto leading-relaxed">
            Our AI engine is curating NCERT-specific questions based on your mock score of {lastMarks}/720.
          </p>
        </div>
      </div>
    );
  }

  if (status === 'levelComplete') {
    return (
      <div className="fixed inset-0 z-[300] bg-emerald-600 flex flex-col items-center justify-center p-8 text-center text-white">
        <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center text-5xl mb-8 animate-bounce">🎯</div>
        <h2 className="text-5xl font-black mb-4 uppercase tracking-tighter">Level {currentLevel} Conquered</h2>
        <p className="text-emerald-100 text-xl mb-12 max-w-md font-medium">Topic-wise mastery achieved. Your logic is getting sharper!</p>
        <button 
          onClick={() => setCurrentLevel(prev => prev + 1)}
          className="px-16 py-6 bg-white text-emerald-700 rounded-[2rem] font-black text-2xl hover:scale-105 transition shadow-[0_20px_50px_rgba(0,0,0,0.2)] uppercase tracking-widest"
        >
          {currentLevel === 4 ? 'START FINAL GRAND TEST' : `PROCEED TO LEVEL ${currentLevel + 1}`}
        </button>
      </div>
    );
  }

  if (status === 'result') {
    const totalScore = levelScores.reduce((a, b) => a + b, 0);
    const totalPossible = [1,2,3,4,5].reduce((acc, lvl) => acc + getQuestionCount(lvl), 0);
    const perc = (totalScore / totalPossible) * 100;
    
    return (
      <div className="fixed inset-0 z-[300] bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 text-center transition-colors">
        <div className="max-w-2xl w-full bg-white dark:bg-slate-900 p-12 md:p-16 rounded-[4rem] border border-slate-200 dark:border-slate-800 shadow-2xl">
          <div className="text-8xl mb-8 drop-shadow-2xl">🎖️</div>
          <h2 className="text-4xl font-black text-slate-900 dark:text-slate-100 mb-2 tracking-tight">Chapter Mastery Certified</h2>
          <p className="text-emerald-600 font-black text-xs uppercase tracking-[0.3em] mb-12">{chapter.name}</p>
          
          <div className="grid grid-cols-2 gap-6 mb-12">
            <div className="bg-emerald-50 dark:bg-emerald-900/10 p-10 rounded-[2.5rem] border border-emerald-100 dark:border-emerald-800">
              <div className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-2">Efficiency</div>
              <div className="text-5xl font-black text-emerald-700 dark:text-emerald-400">{perc.toFixed(0)}%</div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/50 p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-700">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Final Correct</div>
              <div className="text-5xl font-black text-slate-900 dark:text-slate-100">{totalScore} <span className="text-lg opacity-20">/ {totalPossible}</span></div>
            </div>
          </div>

          <button onClick={onClose} className="w-full py-7 bg-emerald-600 text-white rounded-[2rem] font-black text-2xl hover:bg-emerald-700 transition shadow-2xl shadow-emerald-200 dark:shadow-none uppercase tracking-widest">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="fixed inset-0 z-[300] bg-white dark:bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
        <div className="text-7xl mb-6">⚠️</div>
        <h2 className="text-2xl font-black text-red-600 mb-4">{errorMsg}</h2>
        <button onClick={onClose} className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest">Return to Menu</button>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const qNum = currentIndex + 1;

  return (
    <div className="fixed inset-0 z-[250] bg-white dark:bg-slate-950 flex flex-col transition-colors duration-300">
      {/* Dynamic Header */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800 px-6 md:px-16 py-6 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-5">
          <button onClick={onClose} className="p-3 bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-red-500 rounded-2xl transition-all active:scale-90">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest ${currentLevel === 5 ? 'bg-orange-500 text-white' : 'bg-emerald-600 text-white'}`}>
                {currentLevel === 5 ? 'Final Mastery' : `Level ${currentLevel}/4`}
              </span>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                {isBiology ? 'Biology NCERT' : 'Physics/Chem NCERT'}
              </span>
            </div>
            <h3 className="font-black text-slate-900 dark:text-slate-100 text-sm md:text-xl truncate max-w-[200px] md:max-w-md">{chapter.name}</h3>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <button 
            onClick={onToggleDarkMode}
            className="w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 text-2xl border border-slate-200 dark:border-slate-700 hover:scale-110 active:scale-95 transition-all shadow-sm"
          >
            {isDarkMode ? '🌞' : '🌙'}
          </button>
          <div className="text-right hidden sm:block">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Level Progress</span>
            <div className="text-2xl font-black text-emerald-600 mono">
              {qNum.toString().padStart(2, '0')} <span className="opacity-20">/</span> {questions.length}
            </div>
          </div>
        </div>
      </div>

      {/* Main Question Interface */}
      <div className="flex-1 overflow-y-auto p-6 md:p-16 bg-slate-50/50 dark:bg-slate-950 transition-colors">
        <div className="max-w-5xl mx-auto py-10">
          <div className="bg-white dark:bg-slate-900 p-10 md:p-20 rounded-[4rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.05)] dark:shadow-none border border-slate-100 dark:border-slate-800 mb-10 relative overflow-hidden transition-colors">
            {/* Visual Indicator for level type */}
            <div className={`absolute top-0 left-0 w-full h-2 ${currentLevel === 5 ? 'bg-orange-500' : 'bg-emerald-600'}`}></div>
            
            <h4 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-slate-100 leading-tight mb-16">
              {currentQ?.question}
            </h4>
            
            <div className="grid grid-cols-1 gap-5">
              {currentQ?.options.map((opt, idx) => (
                <button 
                  key={idx} 
                  onClick={() => handleAnswer(idx)} 
                  className={`group relative w-full p-8 rounded-[2rem] border-2 text-left transition-all flex items-center gap-6 ${
                    selectedAnswer === null 
                      ? 'border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 hover:border-emerald-300 dark:hover:border-emerald-700 hover:bg-white dark:hover:bg-slate-800' 
                      : idx === currentQ.correctAnswer 
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-900 dark:text-emerald-400' 
                        : selectedAnswer === idx 
                          ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-900 dark:text-red-400' 
                          : 'opacity-30 grayscale pointer-events-none'
                  }`}
                >
                  <span className={`w-12 h-12 min-w-[3rem] rounded-2xl flex items-center justify-center font-black text-lg transition-all ${
                    selectedAnswer === idx ? 'bg-current text-white' : 'bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600'
                  }`}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="font-bold text-lg md:text-xl leading-snug">{opt}</span>
                  
                  {selectedAnswer !== null && idx === currentQ.correctAnswer && (
                    <span className="ml-auto text-emerald-600 text-2xl animate-in zoom-in">✓</span>
                  )}
                  {selectedAnswer === idx && idx !== currentQ.correctAnswer && (
                    <span className="ml-auto text-red-600 text-2xl animate-in zoom-in">✕</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* AI Explanation Insight */}
          {selectedAnswer !== null && (
            <div className="bg-emerald-50 dark:bg-emerald-900/10 p-10 rounded-[3rem] border border-emerald-100 dark:border-emerald-800/50 animate-in fade-in slide-in-from-top-6 shadow-xl transition-colors">
               <div className="flex items-center gap-4 mb-6">
                  <div className="bg-emerald-600 text-white px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-emerald-200 dark:shadow-none">
                    NCERT Logic Insight
                  </div>
                  {selectedAnswer === currentQ.correctAnswer ? (
                    <span className="text-emerald-700 dark:text-emerald-400 font-black uppercase text-[10px] tracking-widest">✓ Correct Approach</span>
                  ) : (
                    <span className="text-red-700 dark:text-red-400 font-black uppercase text-[10px] tracking-widest">⚠ Logic Correction Needed</span>
                  )}
               </div>
               <p className="text-slate-700 dark:text-slate-300 text-xl font-bold italic leading-relaxed">
                 {currentQ.explanation}
               </p>
            </div>
          )}
        </div>
      </div>

      {/* Interactive Navigation Footer */}
      <div className="px-8 md:px-16 py-8 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex justify-center shadow-[0_-10px_40px_rgba(0,0,0,0.03)] z-10 transition-colors">
        <div className="w-full max-w-5xl flex items-center gap-6">
          <div className="hidden md:flex flex-col flex-1">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Difficulty</span>
            <div className="flex gap-1 mt-1">
              {[1,2,3,4,5].map(dot => (
                <div key={dot} className={`h-1.5 flex-1 rounded-full ${dot <= currentLevel ? (currentLevel === 5 ? 'bg-orange-500' : 'bg-emerald-500') : 'bg-slate-100 dark:bg-slate-800'}`}></div>
              ))}
            </div>
          </div>
          
          <button 
            onClick={handleNext} 
            disabled={selectedAnswer === null} 
            className={`relative flex-[2] md:flex-[1.5] py-6 rounded-[2rem] font-black text-xl transition-all uppercase tracking-widest active:scale-[0.97] disabled:grayscale disabled:opacity-30 ${
              selectedAnswer !== null 
                ? 'bg-emerald-600 text-white shadow-2xl shadow-emerald-200 dark:shadow-none hover:bg-emerald-700' 
                : 'bg-slate-100 dark:bg-slate-800 text-slate-300 dark:text-slate-700 cursor-not-allowed'
            }`}
          >
            {qNum === questions.length 
              ? (currentLevel === 5 ? 'Finalize Certification →' : `Complete Level ${currentLevel} →`) 
              : 'Secure & Next Question →'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizEngine;