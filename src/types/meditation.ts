
export interface MeditationType {
  id: string;
  title: string;
  objective: string;
  description: string;
  duration: string;
  benefits: string[];
  audioUrl?: string; // Added audioUrl as an optional property
}

export interface AudioState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
}
