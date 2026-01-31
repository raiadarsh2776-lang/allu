
import React, { useState, useEffect } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { Chapter } from '../types';

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface AIQuizProps {
  chapter: Chapter;
  onClose: () => void;
  mode: 'practice' | 'test';
}

const AIQuiz: React.FC<AIQuizProps> = ({ chapter, onClose, mode }) => {
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const generateQuestions = async () => {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const prompt = `Generate 5 high-quality NEET-UG level MCQs for the chapter: "${chapter.name}" (Subject: ${chapter.class === '11' || chapter.class === '12' ? 'Biology/Science' : 'Science'}). 
        ${mode === 'test' ? 'Focus on high-yield exam-pattern questions.' : 'Include conceptual and diagrammatic reasoning questions.'}
        Each question must have exactly 4 options. Format the response as JSON.`;

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
                  correctAnswer: { type: Type.INTEGER, description: "Index of the correct option (0-3)" },
                  explanation: { type: Type.STRING }
                },
                required: ["question", "options", "correctAnswer", "explanation"]
              }
            }
          }
        });

        const data = JSON.parse(response.text || "[]");
        setQuestions(data);
        setLoading(false);
      } catch (err) {
        console.error("AI Generation Error:", err);
        setError("Our AI engine is currently busy. This usually happens due to temporary network issues. Please try again.");
        setLoading(false);
      }
    };

    generateQuestions();
  }, [chapter, mode]);

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);
    if (index === questions[currentIndex].correctAnswer) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
    } else {
      setShowResult(true);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-[150] bg-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin mb-6"></div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Analyzing NEET Data Points...</h2>
        <p className="text-gray-500">AI is curating high-yield MCQs for {chapter.name}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 z-[150] bg-white flex flex-col items-center justify-center p-6 text-center">
        <div className="text-5xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Internal Error</h2>
        <p className="text-gray-500 mb-6 max-w-sm">{error}</p>
        <button onClick={onClose} className="px-8 py-3 bg-emerald-600 text-white rounded-xl font-bold">Go Back</button>
      </div>
    );
  }

  if (showResult) {
    const percentage = (score / questions.length) * 100;
    return (
      <div className="fixed inset-0 z-[150] bg-white flex flex-col items-center justify-center p-6 overflow-y-auto">
        <div className="max-w-md w-full text-center">
          <div className="text-6xl mb-6">{percentage >= 80 ? '🏆' : '📚'}</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{percentage >= 80 ? 'Outstanding!' : 'Keep Practicing'}</h2>
          <p className="text-gray-500 mb-8">You got {score} out of {questions.length} questions correct in {chapter.name}.</p>
          
          <div className="w-full bg-gray-100 rounded-full h-4 mb-10 overflow-hidden">
            <div className="bg-emerald-500 h-full transition-all duration-1000" style={{ width: `${percentage}%` }}></div>
          </div>

          <div className="space-y-4">
            <button onClick={onClose} className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-emerald-200">Finish Session</button>
            <button onClick={() => window.location.reload()} className="w-full py-4 bg-gray-100 text-gray-800 rounded-xl font-bold">Try Different Set</button>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];

  return (
    <div className="fixed inset-0 z-[150] bg-white flex flex-col">
      <div className="border-b border-gray-100 p-4 flex justify-between items-center bg-gray-50">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">{mode.toUpperCase()} MODE</span>
          <span className="font-bold text-gray-900 truncate max-w-[200px]">{chapter.name}</span>
        </div>
        <div className="bg-white border border-gray-200 px-4 py-2 rounded-full font-bold text-emerald-700 shadow-sm flex items-center gap-2">
          <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
          {currentIndex + 1} / {questions.length}
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 md:p-12">
        <div className="max-w-3xl mx-auto">
          <div className="mb-10">
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 leading-relaxed">
              {currentQ.question}
            </h3>
          </div>

          <div className="space-y-4 mb-10">
            {currentQ.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                className={`w-full p-5 rounded-2xl border-2 text-left transition-all relative ${
                  selectedAnswer === null
                    ? 'border-gray-100 hover:border-emerald-200 hover:bg-emerald-50/50'
                    : idx === currentQ.correctAnswer
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-900'
                    : selectedAnswer === idx
                    ? 'border-red-500 bg-red-50 text-red-900'
                    : 'border-gray-50 text-gray-400 opacity-60'
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                    selectedAnswer === idx ? 'bg-current text-white' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="font-medium">{option}</span>
                </div>
              </button>
            ))}
          </div>

          {selectedAnswer !== null && (
            <div className="bg-emerald-50 p-6 rounded-2xl mb-10 border border-emerald-100 animate-in fade-in slide-in-from-top-4">
              <h4 className="font-bold text-emerald-800 mb-2 flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1a1 1 0 112 0v1a1 1 0 11-2 0zM13.536 14.95a1 1 0 011.414 0l.707.707a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 010-1.414zM15.657 14.243a1 1 0 010 1.414l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 0zM5.05 13.536a1 1 0 011.414 0l.707.707a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 010-1.414z"/></svg>
                AI Analysis
              </h4>
              <p className="text-emerald-700 text-sm leading-relaxed">{currentQ.explanation}</p>
            </div>
          )}
        </div>
      </div>

      <div className="p-6 border-t border-gray-100 bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={handleNext}
            disabled={selectedAnswer === null}
            className={`w-full py-4 rounded-xl font-bold text-lg transition shadow-lg ${
              selectedAnswer !== null ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            {currentIndex === questions.length - 1 ? 'View Result' : 'Next Question'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIQuiz;
