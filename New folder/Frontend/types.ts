
export type SkinTone = 'light' | 'medium' | 'dark';
export type BodyFrame = 'slim' | 'average' | 'athletic' | 'heavy';

export interface UserProfile {
  name: string;
  skinTone: SkinTone;
  height: number;
  bodyFrame: BodyFrame;
}

export interface ClothingItem {
  type: 'shirt' | 'jeans' | 'shoes';
  image: string; // base64
}

export interface RecommendationResponse {
  outfitName: string;
  description: string;
  styleTips: string[];
  colorPalette: string[];
  confidenceScore: number;
  occasionSuitability: string;
}

export type AppStep = 'auth' | 'setup' | 'upload' | 'dashboard';
