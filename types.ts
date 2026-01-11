export interface Scene {
  id: string;
  name: string;
  route: 'city' | 'coastal' | 'mountain' | 'tunnel';
  vibe: 'noir' | 'cyberpunk' | 'retro' | 'cinematic';
  weather: 'clear' | 'rain' | 'fog';
  description: string;
}

export interface Moment {
  id: string;
  title: string;
  description: string;
  duration: number; // in seconds
  icon?: string;
  category: 'visual' | 'action' | 'audio';
}

export interface TimelineItem extends Moment {
  instanceId: string;
  startTime: number;
}

export type Tab = 'dna' | 'moments' | 'preview' | 'publish';

export interface GeneratedVideo {
  uri: string;
  prompt: string;
}
