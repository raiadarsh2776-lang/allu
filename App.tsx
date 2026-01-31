import React, { useState, useEffect } from 'react';
import { AgentMode, BehaviorMode } from './types';
import VoiceInterface from './components/VoiceInterface';
import ChatInterface from './components/ChatInterface';
import { Mic, MessageSquare, Heart, Settings, ChevronRight, BookOpen, Moon, Sun, Zap, Download } from 'lucide-react';

// Supportive male companion avatar for Adarsh Rai
export const AGENT_AVATAR = "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1000&auto=format&fit=crop";

const App: React.FC = () => {
  const [mode, setMode] = useState<AgentMode>(AgentMode.CHAT);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [behaviorMode, setBehaviorMode] = useState<BehaviorMode>(BehaviorMode.LIGHT);

  const exportAgent = () => {
    const agentConfig = {
      name: "Adarsh Rai",
      role: "NEET Aspirant Emotional Companion",
      version: "2.1.0",
      capabilities: ["Streaming Voice", "Instant Chat", "Google Search", "Multi-Mode"],
      persona: "Kind, structured, and supportive male AI mentor",
      systemInstruction: "You are ADARSH RAI. You support a NEET aspirant in studies and well-being..."
    };
    
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(agentConfig, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "adarsh_rai_v2.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const themeStyles = {
    [BehaviorMode.LIGHT]: {
      bg: 'bg-zinc-50',
      sidebar: 'bg-white',
      header: 'bg-white/80',
      text: 'text-zinc-900',
      subtext: 'text-zinc-500',
      border: 'border-zinc-200',
      accent: 'emerald',
      accentColor: 'text-emerald-600',
      accentBg: 'bg-emerald-600/10',
      accentBorder: 'border-emerald-500/20'
    },
    [BehaviorMode.DARK]: {
      bg: 'bg-[#020202]',
      sidebar: 'bg-[#050505]',
      header: 'bg-[#050505]/80',
      text: 'text-zinc-100',
      subtext: 'text-zinc-500',
      border: 'border-zinc-800',
      accent: 'indigo',
      accentColor: 'text-indigo-400',
      accentBg: 'bg-indigo-600/10',
      accentBorder: 'border-indigo-500/20'
    },
    [BehaviorMode.STUDY]: {
      bg: 'bg-[#0c0a09]',
      sidebar: 'bg-[#1c1917]',
      header: 'bg-[#1c1917]/80',
      text: 'text-stone-100',
      subtext: 'text-stone-500',
      border: 'border-stone-800',
      accent: 'amber',
      accentColor: 'text-amber-500',
      accentBg: 'bg-amber-600/10',
      accentBorder: 'border-amber-500/20'
    }
  };

  const style = themeStyles[behaviorMode] || themeStyles[BehaviorMode.LIGHT];

  return (
    <div className={`flex h-screen w-full ${style.bg} ${style.text} overflow-hidden font-sans transition-colors duration-700`}>
      {/* Sidebar */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-24'} transition-all duration-500 border-r ${style.border} ${style.sidebar} flex flex-col items-center py-8 hidden md:flex relative z-20`}>
        <div className="mb-12 flex flex-col items-center">
          <div className="relative group cursor-pointer">
            <div className={`absolute -inset-1 bg-gradient-to-r ${behaviorMode === BehaviorMode.LIGHT ? 'from-emerald-500 to-teal-400' : behaviorMode === BehaviorMode.DARK ? 'from-indigo-600 to-blue-500' : 'from-amber-600 to-orange-500'} rounded-full blur opacity-40 group-hover:opacity-100 transition duration-1000`}></div>
            <div className={`relative w-16 h-16 rounded-full overflow-hidden border-2 ${style.border} shadow-2xl`}>
              <img src={AGENT_AVATAR} alt="Adarsh Rai Avatar" className="w-full h-full object-cover" />
            </div>
            <div className={`absolute bottom-0 right-0 w-4 h-4 ${behaviorMode === BehaviorMode.LIGHT ? 'bg-emerald-500' : behaviorMode === BehaviorMode.DARK ? 'bg-indigo-500' : 'bg-amber-500'} border-2 ${style.sidebar} rounded-full`}></div>
          </div>
          {isSidebarOpen && (
            <div className="mt-4 text-center">
              <span className={`font-bold text-lg tracking-tight uppercase ${style.text}`}>Adarsh Rai</span>
              <p className={`text-[10px] ${style.subtext} font-mono tracking-widest uppercase mt-1`}>Your Companion</p>
            </div>
          )}
        </div>

        <nav className="flex-1 flex flex-col space-y-3 w-full px-4">
          <button 
            onClick={() => setMode(AgentMode.CHAT)}
            className={`w-full flex items-center p-3.5 rounded-2xl transition-all duration-300 ${mode === AgentMode.CHAT ? `${style.accentBg} ${style.accentColor} border ${style.accentBorder} shadow-lg` : `${style.subtext} hover:${style.text} hover:bg-zinc-500/5 border border-transparent`}`}
          >
            <MessageSquare size={22} />
            {isSidebarOpen && <span className="ml-4 font-semibold text-sm">Chat</span>}
          </button>
          
          <button 
            onClick={() => setMode(AgentMode.VOICE)}
            className={`w-full flex items-center p-3.5 rounded-2xl transition-all duration-300 ${mode === AgentMode.VOICE ? `${style.accentBg} ${style.accentColor} border ${style.accentBorder} shadow-lg` : `${style.subtext} hover:${style.text} hover:bg-zinc-500/5 border border-transparent`}`}
          >
            <Mic size={22} />
            {isSidebarOpen && <span className="ml-4 font-semibold text-sm">Voice</span>}
          </button>
        </nav>

        <div className={`w-full px-4 border-t ${style.border} pt-8 mt-4 space-y-2`}>
          <div className={`flex items-center p-3 ${style.subtext} hover:${style.text} cursor-pointer rounded-xl transition-colors`}>
            <Heart size={20} />
            {isSidebarOpen && <span className="ml-4 text-xs font-medium uppercase tracking-wider">Well-being</span>}
          </div>
          <button 
            onClick={exportAgent}
            className={`w-full flex items-center p-3 ${style.subtext} hover:${style.text} cursor-pointer rounded-xl transition-colors`}
          >
            <Download size={20} />
            {isSidebarOpen && <span className="ml-4 text-xs font-medium uppercase tracking-wider">Export</span>}
          </button>
        </div>

        <button 
          onClick={() => setSidebarOpen(!isSidebarOpen)}
          className={`absolute -right-3 top-24 w-6 h-6 ${style.sidebar} border ${style.border} rounded-full flex items-center justify-center ${style.subtext} hover:${style.text} transition-all shadow-xl`}
        >
          <ChevronRight size={14} className={`transform transition-transform duration-300 ${isSidebarOpen ? 'rotate-180' : ''}`} />
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative">
        <header className={`h-20 border-b ${style.border} flex items-center justify-between px-6 md:px-10 ${style.header} backdrop-blur-xl z-30 transition-colors duration-500`}>
          <div className="flex items-center space-x-6">
            <div className="hidden lg:flex flex-col">
              <span className={`text-sm font-bold ${style.text} tracking-wide uppercase`}>
                Adarsh Rai
              </span>
              <span className={`text-[10px] ${style.subtext} font-medium`}>
                AI Presence Active
              </span>
            </div>
          </div>

          {/* TOP MODE SELECTOR */}
          <div className={`flex items-center p-1.5 ${style.bg} border ${style.border} rounded-2xl shadow-sm transition-all duration-500`}>
            <button 
              onClick={() => setBehaviorMode(BehaviorMode.LIGHT)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-tight transition-all ${behaviorMode === BehaviorMode.LIGHT ? 'bg-emerald-600 text-white shadow-lg' : 'text-zinc-400 hover:text-zinc-600'}`}
            >
              <Sun size={14} />
              <span className="hidden sm:inline">Light</span>
            </button>
            <button 
              onClick={() => setBehaviorMode(BehaviorMode.DARK)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-tight transition-all ${behaviorMode === BehaviorMode.DARK ? 'bg-indigo-600 text-white shadow-lg' : 'text-zinc-400 hover:text-zinc-200'}`}
            >
              <Moon size={14} />
              <span className="hidden sm:inline">Dark</span>
            </button>
            <button 
              onClick={() => setBehaviorMode(BehaviorMode.STUDY)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-tight transition-all ${behaviorMode === BehaviorMode.STUDY ? 'bg-amber-500 text-white shadow-lg' : 'text-zinc-400 hover:text-stone-300'}`}
            >
              <Zap size={14} />
              <span className="hidden sm:inline">Study</span>
            </button>
          </div>

          <div className="flex items-center space-x-4">
             <div className={`w-10 h-10 rounded-full overflow-hidden border ${style.border} ring-2 ${behaviorMode === BehaviorMode.LIGHT ? 'ring-emerald-500/20' : behaviorMode === BehaviorMode.DARK ? 'ring-indigo-500/20' : 'ring-amber-500/20'}`}>
                <img src={AGENT_AVATAR} className="w-full h-full object-cover" alt="Adarsh Rai" />
             </div>
          </div>
        </header>

        <div className="flex-1 overflow-hidden">
          {mode === AgentMode.CHAT ? (
            <ChatInterface behaviorMode={behaviorMode} setBehaviorMode={setBehaviorMode} />
          ) : (
            <VoiceInterface behaviorMode={behaviorMode} setBehaviorMode={setBehaviorMode} />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;