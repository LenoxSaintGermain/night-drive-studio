import React from 'react';
import { CloudRain, Moon, Zap, Music, Video, Car, Navigation, Wind } from 'lucide-react';
import { Moment, Scene } from './types';

export const INITIAL_SCENE: Scene = {
  id: 'default-scene',
  name: 'Midnight Tokio Run',
  route: 'city',
  vibe: 'cyberpunk',
  weather: 'rain',
  description: 'A neon-soaked drive through a futuristic metropolis at 2 AM. Reflections on wet pavement.',
};

export const MOCK_MOMENTS: Moment[] = [
  { id: 'm1', title: 'Neon Flicker', description: 'Passing a broken neon sign that flickers ominously.', duration: 3, category: 'visual', icon: 'zap' },
  { id: 'm2', title: 'Sudden Downpour', description: 'Heavy rain suddenly hits the windshield.', duration: 5, category: 'visual', icon: 'rain' },
  { id: 'm3', title: 'Tunnel Entry', description: 'Entering a brightly lit tunnel, sound changes.', duration: 8, category: 'action', icon: 'tunnel' },
  { id: 'm4', title: 'Retro Synth Swell', description: 'Music swells with a nostalgic synthwave beat.', duration: 10, category: 'audio', icon: 'music' },
  { id: 'm5', title: 'Overtake', description: 'Smoothly overtaking a slow moving truck.', duration: 4, category: 'action', icon: 'car' },
  { id: 'm6', title: 'Fog Bank', description: 'Visibility drops as the car enters thick fog.', duration: 6, category: 'visual', icon: 'wind' },
];

export const VIBE_COLORS = {
  noir: 'from-gray-900 to-black',
  cyberpunk: 'from-purple-900/50 to-cyan-900/50',
  retro: 'from-orange-900/50 to-pink-900/50',
  cinematic: 'from-blue-900/50 to-black',
};

export const getIcon = (name?: string) => {
  switch (name) {
    case 'zap': return <Zap className="w-4 h-4" />;
    case 'rain': return <CloudRain className="w-4 h-4" />;
    case 'tunnel': return <Navigation className="w-4 h-4" />; // Approximate
    case 'music': return <Music className="w-4 h-4" />;
    case 'car': return <Car className="w-4 h-4" />;
    case 'wind': return <Wind className="w-4 h-4" />;
    default: return <Video className="w-4 h-4" />;
  }
};
