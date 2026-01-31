import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import PracticeSection from './components/PracticeSection';
import TestDetails from './components/TestDetails';
import QuizEngine from './components/QuizEngine';
import Pricing from './components/Pricing';
import PaymentOverlay from './components/PaymentOverlay';
import Footer from './components/Footer';
import Login from './components/Login';
import { Chapter, Plan, User } from './types';
import { DB } from './services/db';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [quizMode, setQuizMode] = useState<'practice' | 'test'>('test');
  const [activeQuizChapter, setActiveQuizChapter] = useState<Chapter | null>(null);
  const [lastMarks, setLastMarks] = useState<number>(0);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [initializing, setInitializing] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Initial data hydration
    const savedUser = DB.getUser();
    if (savedUser) setUser(savedUser);
    
    const savedTheme = DB.getTheme();
    setIsDarkMode(savedTheme);
    setInitializing(false);
  }, []);

  // Centralized Theme management
  useEffect(() => {
    const html = document.documentElement;
    if (isDarkMode) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
    DB.setTheme(isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    // Scroll locking for overlays
    if (!user || selectedPlan || activeQuizChapter || selectedChapter) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [user, selectedPlan, activeQuizChapter, selectedChapter]);

  const handleLogin = (userData: User) => {
    setUser(userData);
  };

  const handleLogout = () => {
    DB.logout();
    setUser(null);
  };

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);

  if (initializing) return (
    <div className="fixed inset-0 bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center transition-colors">
      <div className="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mb-4"></div>
      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest animate-pulse">Establishing Secure Environment</span>
    </div>
  );

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <Navigation 
        user={user} 
        onLogout={handleLogout} 
        isDarkMode={isDarkMode} 
        onToggleDarkMode={toggleDarkMode} 
      />
      
      <main>
        <Hero />
        <PracticeSection 
          onSelectChapter={(ch, mode) => { 
            setQuizMode(mode); 
            setSelectedChapter(ch); 
          }} 
          user={user} 
        />
        
        {selectedChapter && (
          <TestDetails 
            chapter={selectedChapter} 
            onClose={() => setSelectedChapter(null)}
            onStartQuiz={(marks) => { 
              setLastMarks(marks); 
              setActiveQuizChapter(selectedChapter); 
              setSelectedChapter(null); 
            }}
            mode={quizMode}
          />
        )}
        
        {activeQuizChapter && (
          <QuizEngine 
            chapter={activeQuizChapter}
            onClose={() => setActiveQuizChapter(null)}
            mode={quizMode}
            lastMarks={lastMarks}
            isDarkMode={isDarkMode}
            onToggleDarkMode={toggleDarkMode}
          />
        )}
        
        <Pricing onSubscribe={setSelectedPlan} />
        
        {selectedPlan && (
          <PaymentOverlay 
            plan={selectedPlan} 
            onClose={() => setSelectedPlan(null)} 
            onSuccess={() => { 
              const updatedUser = { ...user, isSubscribed: true };
              setUser(updatedUser); 
              DB.saveUser(updatedUser); 
              setSelectedPlan(null); 
            }}
          />
        )}
        
        <Footer />
      </main>
    </div>
  );
};

export default App;