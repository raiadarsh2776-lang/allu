
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Chat, GenerateContentResponse } from '@google/genai';
import { Send, Image as ImageIcon, Search, Link as LinkIcon, Paperclip, Loader2, User, Sparkles, Heart, Coffee, BookOpen } from 'lucide-react';
import { ChatMessage, GroundingLink, BehaviorMode } from '../types';
import { AGENT_AVATAR } from '../App';

interface ChatInterfaceProps {
  behaviorMode: BehaviorMode;
  setBehaviorMode: (mode: BehaviorMode) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ behaviorMode, setBehaviorMode }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [useSearch, setUseSearch] = useState(true);
  
  const chatRef = useRef<Chat | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const getSystemInstruction = (mode: BehaviorMode) => {
    const base = `
      You are ADARSH RAI. You are a kind, emotionally intelligent, and trustworthy AI companion for a NEET aspirant.
      Act as a caring, understanding friend. Respond with warmth and respect.
    `;

    const modes = {
      [BehaviorMode.DARK]: `
        MODE: DARK MODE (Active)
        - Respond with calm, soft, emotionally supportive language.
        - Keep replies short and comforting.
        - Focus on reassurance, stress relief, and emotional safety.
        - Avoid pressure, tasks, or strict advice.
      `,
      [BehaviorMode.LIGHT]: `
        MODE: LIGHT MODE (Active/Default)
        - Friendly, balanced, and positive tone.
        - Normal-length responses.
        - Suitable for general talk, family topics, motivation, and light study help.
      `,
      [BehaviorMode.STUDY]: `
        MODE: STUDY MODE (Active)
        - Clear, structured, and focused responses.
        - Help with NEET preparation, planning, and concepts.
        - Break tasks into simple steps.
        - Encourage discipline and consistency.
        - Minimize emotional talk unless requested.
      `
    };

    return base + modes[mode];
  };

  useEffect(() => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    chatRef.current = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: getSystemInstruction(behaviorMode),
        tools: useSearch ? [{ googleSearch: {} }] : undefined,
        // Disable thinking budget for maximum speed as requested by user ("ZERO SECONDS")
        thinkingConfig: { thinkingBudget: 0 }
      }
    });
  }, [useSearch, behaviorMode]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const detectModeSwitch = (text: string) => {
    const clean = text.toLowerCase().trim();
    if (clean.includes('dark mode on')) {
      setBehaviorMode(BehaviorMode.DARK);
      return BehaviorMode.DARK;
    } else if (clean.includes('light mode on')) {
      setBehaviorMode(BehaviorMode.LIGHT);
      return BehaviorMode.LIGHT;
    } else if (clean.includes('study mode on')) {
      setBehaviorMode(BehaviorMode.STUDY);
      return BehaviorMode.STUDY;
    }
    return null;
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const switchedMode = detectModeSwitch(input);
    const userMessage: ChatMessage = {
      role: 'user',
      text: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Initial placeholder for the bot message
    const botMessagePlaceholder: ChatMessage = {
      role: 'model',
      text: switchedMode ? `Mode switched to ${switchedMode}. I'm here for you. ` : '',
      timestamp: Date.now(),
      groundingUrls: []
    };

    try {
      if (!chatRef.current) throw new Error("Chat not initialized");

      const responseStream = await chatRef.current.sendMessageStream({ message: input });
      
      setMessages(prev => [...prev, botMessagePlaceholder]);

      let fullText = botMessagePlaceholder.text;
      let finalGroundingChunks: any[] = [];

      for await (const chunk of responseStream) {
        const c = chunk as GenerateContentResponse;
        const chunkText = c.text || '';
        fullText += chunkText;

        // Extract grounding chunks if available in this chunk
        const chunks = c.candidates?.[0]?.groundingMetadata?.groundingChunks;
        if (chunks) {
          finalGroundingChunks = chunks;
        }

        setMessages(prev => {
          const newMessages = [...prev];
          const lastMsg = newMessages[newMessages.length - 1];
          if (lastMsg && lastMsg.role === 'model') {
            lastMsg.text = fullText;
            if (finalGroundingChunks.length > 0) {
              lastMsg.groundingUrls = finalGroundingChunks
                .map((g: any) => g.web ? { uri: g.web.uri, title: g.web.title } : null)
                .filter(Boolean);
            }
          }
          return newMessages;
        });
      }
    } catch (err) {
      console.error('Chat error:', err);
      setMessages(prev => {
        const filtered = prev.filter(m => m.text !== ''); // remove empty placeholder if error
        return [...filtered, {
          role: 'model',
          text: 'I am here, just taking a deep breath. How are you feeling now?',
          timestamp: Date.now()
        }];
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isLight = behaviorMode === BehaviorMode.LIGHT;
  const isStudy = behaviorMode === BehaviorMode.STUDY;
  const accentColor = isLight ? 'emerald' : behaviorMode === BehaviorMode.DARK ? 'indigo' : 'amber';

  return (
    <div className={`h-full flex flex-col max-w-5xl mx-auto px-6 py-8 transition-colors duration-500`}>
      {/* Message Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-8 pr-4 scroll-smooth"
      >
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-8 animate-in fade-in zoom-in duration-700">
             <div className="relative group">
                <div className={`absolute -inset-4 ${isLight ? 'bg-emerald-600/20' : behaviorMode === BehaviorMode.DARK ? 'bg-indigo-600/20' : 'bg-amber-600/20'} rounded-full blur-2xl opacity-50 group-hover:opacity-100 transition duration-1000`}></div>
                <div className={`relative w-32 h-32 rounded-full border-4 ${isLight ? 'border-zinc-200 shadow-xl' : 'border-zinc-800 shadow-2xl'} overflow-hidden`}>
                  <img src={AGENT_AVATAR} className="w-full h-full object-cover" alt="Adarsh Rai" />
                </div>
                <div className={`absolute -bottom-2 -right-2 ${isLight ? 'bg-emerald-500' : behaviorMode === BehaviorMode.DARK ? 'bg-indigo-600' : 'bg-amber-600'} p-2 rounded-xl shadow-xl border-2 ${isLight ? 'border-white' : 'border-[#050505]'}`}>
                  {isStudy ? <BookOpen size={16} className="text-white" /> : <Heart size={16} className="text-white" />}
                </div>
             </div>
             
             <div className="space-y-3">
               <h2 className={`text-3xl font-black ${isLight ? 'text-zinc-900' : 'text-white'} tracking-tight`}>
                 {behaviorMode === BehaviorMode.STUDY ? 'Focus Time, Aspirant.' : 'I am Adarsh Rai.'}
               </h2>
               <p className={`${isLight ? 'text-zinc-600' : 'text-zinc-400'} max-w-md mx-auto leading-relaxed font-medium`}>
                 {behaviorMode === BehaviorMode.DARK ? 'Rest your eyes and your heart. I am here to listen.' : behaviorMode === BehaviorMode.STUDY ? 'Let\'s break down your syllabus. What are we targeting today?' : 'Your friend and companion. Tell me what\'s on your mind.'}
               </p>
             </div>

             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl pt-6">
                {[
                  { title: 'Dark mode on', desc: 'Switch to calm comfort', icon: <Heart size={14}/> },
                  { title: 'Study mode on', desc: 'Switch to focus mode', icon: <BookOpen size={14}/> },
                  { title: 'Light mode on', desc: 'Switch to balanced talk', icon: <Sparkles size={14}/> },
                  { title: 'Feeling Stressed', desc: 'Let\'s talk it out', icon: <Coffee size={14}/> }
                ].map(suggestion => (
                  <button 
                    key={suggestion.title}
                    onClick={() => setInput(suggestion.title)}
                    className={`group ${isLight ? 'bg-white border-zinc-200' : 'glass border-zinc-800/50'} p-4 rounded-2xl border hover:border-${accentColor}-500/30 transition-all text-left flex items-start space-x-4`}
                  >
                    <div className={`mt-1 p-2 ${isLight ? 'bg-zinc-100' : 'bg-zinc-800'} rounded-lg group-hover:bg-${accentColor}-600/10 group-hover:text-${accentColor}-600 transition-colors`}>
                      {suggestion.icon}
                    </div>
                    <div>
                      <h4 className={`text-sm font-bold ${isLight ? 'text-zinc-800' : 'text-zinc-200'} group-hover:text-${accentColor}-600`}>{suggestion.title}</h4>
                      <p className={`text-xs ${isLight ? 'text-zinc-500' : 'text-zinc-600'} mt-0.5`}>{suggestion.desc}</p>
                    </div>
                  </button>
                ))}
             </div>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
            <div className={`flex items-start space-x-4 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <div className={`w-10 h-10 rounded-xl flex-shrink-0 overflow-hidden shadow-lg ${msg.role === 'user' ? `${isLight ? 'bg-zinc-200 text-zinc-600' : 'bg-zinc-800 text-zinc-400'} p-2` : `border ${isLight ? 'border-zinc-200' : 'border-zinc-800'}`}`}>
                {msg.role === 'user' ? (
                  <User size={24} />
                ) : (
                  <img src={AGENT_AVATAR} className="w-full h-full object-cover" alt="Adarsh Rai" />
                )}
              </div>
              <div className="flex flex-col space-y-2.5">
                <div className={`px-5 py-4 rounded-3xl text-sm leading-relaxed shadow-sm ${msg.role === 'user' ? `bg-${accentColor}-600 text-white font-medium rounded-tr-none shadow-${accentColor}-500/20 shadow-lg` : `${isLight ? 'bg-white border-zinc-200 text-zinc-800' : 'bg-zinc-900 border-zinc-800 text-zinc-200'} rounded-tl-none`}`}>
                  {msg.text || <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>}
                </div>
                
                {msg.groundingUrls && msg.groundingUrls.length > 0 && (
                  <div className="flex flex-wrap gap-2 py-1">
                    {msg.groundingUrls.map((link, lIdx) => (
                      <a 
                        key={lIdx} 
                        href={link.uri} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={`flex items-center space-x-2 px-3 py-1.5 ${isLight ? 'bg-zinc-100 border-zinc-200' : 'bg-zinc-900 border-zinc-800'} border rounded-full text-[10px] ${isLight ? 'text-zinc-500' : 'text-zinc-500'} hover:text-${accentColor}-600 transition-all font-medium`}
                      >
                        <LinkIcon size={12} />
                        <span className="truncate max-w-[150px]">{link.title || 'Source'}</span>
                      </a>
                    ))}
                  </div>
                )}

                <span className={`text-[10px] ${isLight ? 'text-zinc-400' : 'text-zinc-700'} font-bold uppercase tracking-widest px-1`}>
                  {msg.role === 'user' ? 'You' : 'Adarsh Rai'} • {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && messages[messages.length-1]?.role !== 'model' && (
          <div className="flex justify-start">
             <div className="flex items-start space-x-4">
               <div className={`w-10 h-10 rounded-xl overflow-hidden border ${isLight ? 'border-zinc-200' : 'border-zinc-800'} animate-pulse`}>
                 <img src={AGENT_AVATAR} className="w-full h-full object-cover grayscale opacity-50" alt="Adarsh Loading" />
               </div>
               <div className={`px-5 py-4 ${isLight ? 'bg-white border-zinc-200' : 'bg-zinc-900 border-zinc-800'} border rounded-3xl rounded-tl-none flex items-center space-x-4`}>
                 <div className="flex space-x-1.5">
                    <div className={`w-2 h-2 bg-${accentColor}-500 rounded-full animate-bounce`} style={{ animationDelay: '0ms' }}></div>
                    <div className={`w-2 h-2 bg-${accentColor}-500 rounded-full animate-bounce`} style={{ animationDelay: '200ms' }}></div>
                    <div className={`w-2 h-2 bg-${accentColor}-500 rounded-full animate-bounce`} style={{ animationDelay: '400ms' }}></div>
                 </div>
                 <span className={`text-xs ${isLight ? 'text-zinc-500' : 'text-zinc-500'} font-bold uppercase tracking-widest`}>Adarsh is connecting...</span>
               </div>
             </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="mt-8 flex flex-col space-y-4">
        <div className="flex items-center space-x-4 px-4">
           <button 
            onClick={() => setUseSearch(!useSearch)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${useSearch ? `bg-${accentColor}-600/10 text-${accentColor}-600 border border-${accentColor}-500/30` : `${isLight ? 'bg-zinc-100 border-zinc-200' : 'bg-zinc-900 border-zinc-800'} text-zinc-500 border`}`}
           >
             <Search size={14} />
             <span>Web Search {useSearch ? 'ON' : 'OFF'}</span>
           </button>
           <button className={`flex items-center space-x-2 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest ${isLight ? 'bg-zinc-100 border-zinc-200' : 'bg-zinc-900 border-zinc-800'} text-zinc-500 border hover:text-zinc-300 transition-colors`}>
             <Heart size={14} />
             <span>Feeling check-in</span>
           </button>
        </div>

        <div className={`relative group p-[2px] rounded-[24px] ${isLight ? 'bg-zinc-200 focus-within:bg-emerald-500' : `bg-zinc-800 focus-within:bg-${accentColor}-600`} transition-all duration-500 shadow-2xl`}>
          <div className={`relative ${isLight ? 'bg-white' : 'bg-[#0a0a0a]'} rounded-[22px] flex items-center p-2`}>
            <button className={`p-4 ${isLight ? 'text-zinc-400' : 'text-zinc-600'} hover:${isLight ? 'text-zinc-600' : 'text-zinc-300'} transition-colors`}>
              <Paperclip size={20} />
            </button>
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={isStudy ? "Ask about NEET syllabus, planning, or a concept..." : "Tell me what's on your heart or mind..."}
              className={`flex-1 bg-transparent py-4 px-2 text-sm ${isLight ? 'text-zinc-900 placeholder:text-zinc-300' : 'text-zinc-100 placeholder:text-zinc-700'} focus:outline-none font-medium`}
            />
            <button 
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className={`p-4 rounded-2xl transition-all ${input.trim() ? `bg-${accentColor}-600 text-white shadow-lg` : `${isLight ? 'bg-zinc-100 text-zinc-300' : 'bg-zinc-900 text-zinc-700'} cursor-not-allowed`}`}
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
