
import { useState, useRef, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { AudioState } from '@/types/meditation';

export const useAudio = (initialAudioUrl?: string) => {
  const [audioState, setAudioState] = useState<AudioState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (initialAudioUrl) {
      initializeAudio(initialAudioUrl);
    }
  }, [initialAudioUrl]);

  const initializeAudio = async (path: string) => {
    try {
      setIsLoading(true);
      
      const { data: audioData } = await supabase.storage
        .from('audio')
        .getPublicUrl(path);
      
      if (audioData?.publicUrl && audioRef.current) {
        audioRef.current.src = audioData.publicUrl;
        audioRef.current.load();
      }
    } catch (error) {
      console.error('Error initializing audio:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar o áudio.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlay = async () => {
    if (isLoading || !audioRef.current) return;
    
    try {
      if (audioState.isPlaying) {
        audioRef.current.pause();
        setAudioState(prev => ({ ...prev, isPlaying: false }));
      } else {
        await audioRef.current.play();
        setAudioState(prev => ({ ...prev, isPlaying: true }));
      }
    } catch (error) {
      console.error('Error playing audio:', error);
      toast({
        title: "Erro",
        description: "Não foi possível reproduzir o áudio.",
        variant: "destructive",
      });
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !audioRef.current.muted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setAudioState(prev => ({
        ...prev,
        currentTime: audioRef.current?.currentTime || 0,
        duration: audioRef.current?.duration || 0
      }));
    }
  };

  return {
    audioRef,
    audioState,
    isLoading,
    isMuted,
    handlePlay,
    toggleMute,
    handleTimeUpdate,
    initializeAudio
  };
};
