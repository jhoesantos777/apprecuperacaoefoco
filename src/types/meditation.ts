
export interface MeditationType {
  id: string;
  title: string;
  objective: string;
  description: string;
  duration: string;
  benefits: string[];
}

export interface AudioState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
}
