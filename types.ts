
export enum AgentMode {
  VOICE = 'VOICE',
  CHAT = 'CHAT'
}

export enum BehaviorMode {
  DARK = 'DARK',
  LIGHT = 'LIGHT',
  STUDY = 'STUDY'
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
  groundingUrls?: Array<{ uri: string; title: string }>;
}

export interface GroundingLink {
  uri: string;
  title: string;
}
