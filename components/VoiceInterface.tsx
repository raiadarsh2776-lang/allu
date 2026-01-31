
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality, Blob } from '@google/genai';
import { Mic, MicOff, Activity, Zap, Heart, BookOpen, Sun, Moon } from 'lucide-react';
import { decode, encode, decodeAudioData } from '../services/audioUtils';
import { AGENT_AVATAR } from '../App';
import { BehaviorMode } from '../types';

interface VoiceInterfaceProps {
  behaviorMode: BehaviorMode;
  setBehaviorMode: (mode: BehaviorMode) => void;
}

const VoiceInterface: React.FC<VoiceInterfaceProps> = ({ behaviorMode, setBehaviorMode }) => {
  const [isActive, setIsActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [visualizerData, setVisualizerData] = useState<number[]>(new Array(30).fill(5));
  const [transcript, setTranscript] = useState<string>('');
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const sessionRef = useRef<any>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  const getSystemInstruction = (mode: BehaviorMode) => {
    const base = `
      You are ADARSH RAI. You are a kind, emotionally intelligent AI companion.
      Your role is to support a NEET aspirant. Act as a caring, understanding friend.
      Respond with warmth, empathy, and respect.
      
      SWITCH MODES BASED ON USER COMMANDS:
      - "Dark mode on" -> Switch to DARK behavior.
      - "Light mode on" -> Switch to LIGHT behavior.
      - "Study mode on" -> Switch to STUDY behavior.
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
        - Break tasks into steps.
        - Minimize emotional talk unless requested.
      `
    };

    return base + modes[mode];
  };

  const toggleSession = async () => {
    if (isActive) {
      stopSession();
    } else {
      startSession();
    }
  };

  const startSession = async () => {
    setIsConnecting(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioContextRef.current = inputCtx;
      outputAudioContextRef.current = outputCtx;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setIsConnecting(false);
            setIsActive(true);
            const source = inputCtx.createMediaStreamSource(stream);
            const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
            
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const sum = inputData.reduce((a, b) => a + Math.abs(b), 0);
              const avg = (sum / inputData.length) * 150;
              setVisualizerData(prev => [...prev.slice(1), Math.max(8, avg)]);

              const int16 = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) {
                int16[i] = inputData[i] * 32768;
              }
              
              const pcmBlob: Blob = {
                data: encode(new Uint8Array(int16.buffer)),
                mimeType: 'audio/pcm;rate=16000',
              };

              sessionPromise.then((session) => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };

            source.connect(scriptProcessor);
            scriptProcessor.connect(inputCtx.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            if (message.serverContent?.inputTranscription) {
              const text = message.serverContent.inputTranscription.text.toLowerCase();
              if (text.includes('dark mode on')) setBehaviorMode(BehaviorMode.DARK);
              if (text.includes('light mode on')) setBehaviorMode(BehaviorMode.LIGHT);
              if (text.includes('study mode on')) setBehaviorMode(BehaviorMode.STUDY);
            }

            if (message.serverContent?.outputTranscription) {
              setTranscript(prev => prev + message.serverContent!.outputTranscription!.text);
            }

            const audioData = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (audioData) {
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
              const buffer = await decodeAudioData(decode(audioData), outputCtx, 24000, 1);
              const source = outputCtx.createBufferSource();
              source.buffer = buffer;
              source.connect(outputCtx.destination);
              source.onended = () => sourcesRef.current.delete(source);
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += buffer.duration;
              sourcesRef.current.add(source);
            }

            if (message.serverContent?.interrupted) {
              for (const source of sourcesRef.current.values()) {
                source.stop();
              }
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
            
            if (message.serverContent?.turnComplete) {
              setTranscript('');
            }
          },
          onerror: (e) => {
            console.error('Session Error:', e);
            stopSession();
          },
          onclose: () => {
            stopSession();
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          outputAudioTranscription: {},
          inputAudioTranscription: {},
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } }
          },
          systemInstruction: getSystemInstruction(behaviorMode)
        }
      });

      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error('Failed to start session:', err);
      setIsConnecting(false);
    }
  };

  const stopSession = () => {
    if (sessionRef.current) {
      try { sessionRef.current.close(); } catch {}
    }
    if (audioContextRef.current) audioContextRef.current.close();
    if (outputAudioContextRef.current) outputAudioContextRef.current.close();
    
    setIsActive(false);
    setIsConnecting(false);
    setVisualizerData(new Array(30).fill(5));
    setTranscript('');
  };

  useEffect(() => {
    return () => stopSession();
  }, []);

  const isLight = behaviorMode === BehaviorMode.LIGHT;
  const isStudy = behaviorMode === BehaviorMode.STUDY;
  const accentColor = isLight ? 'emerald' : behaviorMode === BehaviorMode.DARK ? 'indigo' : 'amber';
  const accentHex = isLight ? '#10b981' : behaviorMode === BehaviorMode.DARK ? '#6366f1' : '#f59e0b';

  return (
    <div className={`h-full w-full flex flex-col items-center justify-center p-12 transition-all duration-700 bg-gradient-to-t from-${accentColor}-600/5 to-transparent`}>
      <div className="max-w-4xl w-full flex flex-col items-center">
        
        {/* Visualizer Face Orb */}
        <div className="relative group">
          <div className={`absolute -inset-10 rounded-full blur-[100px] transition-all duration-1000 ${isActive ? `bg-${accentColor}-600/30` : 'bg-transparent'}`}></div>
          <div className={`absolute -inset-1 border border-${accentColor}-500/20 rounded-full transition-all duration-1000 ${isActive ? 'scale-110 opacity-100' : 'scale-100 opacity-0'}`}></div>

          <div className={`relative w-80 h-80 rounded-full flex items-center justify-center transition-all duration-1000 shadow-2xl ${isActive ? 'scale-105' : 'scale-100'}`}>
            {/* Pulsating Visualizer Ring */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-full flex items-center justify-center space-x-[2px]">
                {visualizerData.map((val, idx) => (
                  <div 
                    key={idx} 
                    className={`w-[3px] rounded-full transition-all duration-75 ${isActive ? `bg-${accentColor}-400/60` : `${isLight ? 'bg-zinc-200' : 'bg-zinc-800'}`}`}
                    style={{ height: `${val * 1.5}%`, transform: `translateY(${idx % 2 === 0 ? '10px' : '-10px'})` }}
                  ></div>
                ))}
              </div>
            </div>

            {/* The Agent Face - Adarsh Rai */}
            <div className={`relative w-64 h-64 rounded-full overflow-hidden border-4 z-10 transition-all duration-700 ${isActive ? `border-${accentColor}-500 shadow-[0_0_80px_rgba(16,185,129,0.4)]` : `border-${isLight ? 'zinc-200' : 'zinc-800'}`}`}>
              <img src={AGENT_AVATAR} className={`w-full h-full object-cover transition-all duration-1000 ${isActive ? 'scale-110 grayscale-0' : 'scale-100 grayscale-[0.5] opacity-50'}`} alt="Adarsh Rai" />
              {isActive && <div className={`absolute inset-0 bg-${accentColor}-500/10 animate-pulse`}></div>}
            </div>
            
            {isActive && (
               <div className={`absolute -bottom-8 bg-${accentColor}-600 text-[10px] font-black uppercase tracking-[0.3em] px-4 py-1.5 rounded-full shadow-lg border border-${accentColor}-400 z-20 animate-in fade-in slide-in-from-top-4 duration-500 text-white`}>
                 {behaviorMode} Presence Active
               </div>
            )}
          </div>
        </div>

        {/* Support Metrics */}
        <div className="mt-32 w-full grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className={`${isLight ? 'bg-white border-zinc-200' : 'glass border-zinc-800/50'} p-8 rounded-[32px] border flex items-start space-x-6 shadow-sm transition-colors duration-500`}>
             <div className={`p-4 bg-${accentColor}-500/10 rounded-2xl text-${accentColor}-600 shadow-inner`}>
                {isStudy ? <BookOpen size={24} /> : <Heart size={24} />}
             </div>
             <div>
               <h3 className={`font-bold ${isLight ? 'text-zinc-800' : 'text-zinc-100'} tracking-tight`}>
                 {isStudy ? 'Structured Mentorship' : 'Emotional Intelligence'}
               </h3>
               <p className={`text-sm ${isLight ? 'text-zinc-500' : 'text-zinc-500'} mt-2 leading-relaxed font-medium`}>
                 {isStudy ? 'Switching focus to NEET preparation. I will prioritize discipline and clarity.' : 'I am trained to detect stress and provide supportive, non-judgmental comfort.'}
               </p>
             </div>
          </div>
          <div className={`${isLight ? 'bg-white border-zinc-200' : 'glass border-zinc-800/50'} p-8 rounded-[32px] border flex items-start space-x-6 shadow-sm transition-colors duration-500`}>
             <div className={`p-4 bg-${accentColor}-500/10 rounded-2xl text-${accentColor}-600 shadow-inner`}>
                <Activity size={24} />
             </div>
             <div>
               <h3 className={`font-bold ${isLight ? 'text-zinc-800' : 'text-zinc-100'} tracking-tight`}>Steady Presence</h3>
               <p className={`text-sm ${isLight ? 'text-zinc-500' : 'text-zinc-500'} mt-2 leading-relaxed font-medium`}>Ready to talk anytime you need a break or some motivation for your goals.</p>
             </div>
          </div>
        </div>

        {/* Transcription Overlay */}
        {transcript && (
          <div className={`mt-12 w-full max-w-xl ${isLight ? 'bg-white border-zinc-200' : 'glass border-zinc-800/50'} p-6 rounded-3xl border border-${accentColor}-500/30 ${isLight ? 'text-zinc-700' : 'text-zinc-200'} text-center italic text-base font-medium shadow-2xl animate-in zoom-in-95 duration-300`}>
            "{transcript}"
          </div>
        )}

        {/* Session Control */}
        <div className="mt-16 flex flex-col items-center">
          <button
            onClick={toggleSession}
            disabled={isConnecting}
            className={`group relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-500 transform active:scale-90 ${isActive ? 'bg-red-500 hover:bg-red-600 shadow-lg' : `bg-${accentColor}-600 hover:bg-${accentColor}-700 shadow-lg`} ${isConnecting ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isConnecting ? (
              <div className="w-10 h-10 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
            ) : isActive ? (
              <MicOff size={36} className="text-white" />
            ) : (
              <Mic size={36} className="text-white" />
            )}
          </button>
          <span className={`mt-6 text-[10px] font-black ${isLight ? 'text-zinc-400' : 'text-zinc-600'} uppercase tracking-[0.4em]`}>
            {isActive ? 'End Conversation' : 'Start Voice Support'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default VoiceInterface;
