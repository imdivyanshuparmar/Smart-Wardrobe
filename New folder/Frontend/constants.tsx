
import React from 'react';
import { Shirt, Footprints, Layers, User, Settings, Sparkles, Box } from 'lucide-react';

export const SKIN_TONES = [
  { id: 'light', label: 'Light', color: '#FCE4D6' },
  { id: 'medium', label: 'Medium', color: '#D2B48C' },
  { id: 'dark', label: 'Dark', color: '#5C4033' },
];

export const BODY_FRAMES = [
  { id: 'slim', label: 'Slim', icon: <User className="w-5 h-5" /> },
  { id: 'average', label: 'Average', icon: <User className="w-6 h-6" /> },
  { id: 'athletic', label: 'Athletic', icon: <User className="w-6 h-6" /> },
  { id: 'heavy', label: 'Heavy', icon: <User className="w-7 h-7" /> },
];

export const NAV_LINKS = [
  { name: 'Home', path: '#' },
  { name: 'Collections', path: '#' },
  { name: 'Style Guide', path: '#' },
  { name: 'About', path: '#' },
];
