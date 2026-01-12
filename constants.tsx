import React from 'react';
import { CloudRain, Moon, Zap, Music, Video, Car, Navigation, Wind, Camera, Sun, Aperture, Radio } from 'lucide-react';
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
  // New Camera Movements
  { id: 'c1', title: 'Low Angle Tracking', description: 'Camera drops low to the asphalt, emphasizing speed.', duration: 4, category: 'camera_movements', icon: 'camera_low' },
  { id: 'c2', title: 'Drone Flyover', description: 'Aerial view tracking the car from above city lights.', duration: 7, category: 'camera_movements', icon: 'drone' },
  { id: 'c3', title: 'Dutch Angle', description: 'Camera tilts to create a sense of unease and tension.', duration: 3, category: 'camera_movements', icon: 'tilt' },
  // New Lighting Effects
  { id: 'l1', title: 'Lens Flare Bloom', description: 'Anamorphic lens flare from oncoming headlights.', duration: 2, category: 'lighting_effects', icon: 'flare' },
  { id: 'l2', title: 'Strobe Lights', description: 'Rhythmic flashing lights from a passing club or emergency vehicle.', duration: 4, category: 'lighting_effects', icon: 'strobe' },
  { id: 'l3', title: 'Silhouette Contrast', description: 'Backlit shot creating a sharp silhouette of the driver.', duration: 5, category: 'lighting_effects', icon: 'contrast' },
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
    case 'camera_low': return <Video className="w-4 h-4" />;
    case 'drone': return <Aperture className="w-4 h-4" />;
    case 'tilt': return <Camera className="w-4 h-4" />;
    case 'flare': return <Sun className="w-4 h-4" />;
    case 'strobe': return <Zap className="w-4 h-4" />;
    case 'contrast': return <Moon className="w-4 h-4" />;
    default: return <Video className="w-4 h-4" />;
  }
};