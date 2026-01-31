
export interface Chapter {
  id: string;
  name: string;
  class: '11' | '12';
  difficulty: string;
  questionCount: number;
  timeLimit: number;
}

export interface Plan {
  id: string;
  price: number;
  duration: string;
}

export type Subject = 'Biology' | 'Physics' | 'Chemistry';
export type AuthMethod = 'phone' | 'email';

export interface User {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  authMethod: AuthMethod;
  isSubscribed: boolean;
  joinedAt: string;
}

export interface ExamRecord {
  chapterId: string;
  score: number;
  total: number;
  timestamp: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface QuizSection {
  title: string;
  questions: QuizQuestion[];
}
