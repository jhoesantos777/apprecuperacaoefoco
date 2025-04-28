
import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { meditations } from '@/data/meditations';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Pause, Play, Volume2 } from "lucide-react";
import { BackButton } from "@/components/BackButton";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const MeditationSession = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const meditation = meditations.find(m => m.id === id);

  if (!meditation) {
    return <div>Meditação não encontrada</div>;
  }

  const handleComplete = () => {
    toast({
      title: "Meditação Concluída",
      description: "Parabéns por dedicar este tempo ao seu bem-estar!",
    });
    navigate('/meditation');
  };

  const handlePlayAudio = async () => {
    if (isLoading) return;

    // If we already have audio, just play/pause it
    if (audioUrl) {
      if (audioRef.current) {
        if (isPlaying) {
          audioRef.current.pause();
          setIsPlaying(false);
        } else {
          audioRef.current.play();
          setIsPlaying(true);
        }
      }
      return;
    }

    try {
      setIsLoading(true);
      
      // Call the Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('text-to-speech', {
        body: {
          text: meditation.description,
          voice: 'alloy'
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!data || !data.audioContent) {
        throw new Error('No audio content returned from the API');
      }

      const audio = `data:audio/mp3;base64,${data.audioContent}`;
      setAudioUrl(audio);
      
      // Play the audio
      if (audioRef.current) {
        audioRef.current.src = audio;
        audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error generating audio:', error);
      toast({
        title: "Erro",
        description: "Não foi possível gerar o áudio da meditação.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-600 to-indigo-900 p-6">
      <BackButton />
      
      <div className="max-w-2xl mx-auto space-y-6">
        <Card className="p-6">
          <h1 className="text-2xl font-bold mb-4">{meditation.title}</h1>
          
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-2">Objetivo:</h2>
              <p className="text-gray-600">{meditation.objective}</p>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2">Instruções:</h2>
              <div className="flex items-start gap-4">
                <p className="text-gray-600 whitespace-pre-line flex-1">
                  {meditation.description}
                </p>
                <Button
                  variant="outline"
                  size="icon"
                  className="flex-shrink-0"
                  onClick={handlePlayAudio}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="animate-pulse">...</span>
                  ) : isPlaying ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            
            <div>
              <h2 className="text-lg font-semibold mb-2">Duração:</h2>
              <p className="text-gray-600">{meditation.duration}</p>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2">Benefícios:</h2>
              <ul className="list-disc pl-5 text-gray-600">
                {meditation.benefits.map((benefit, index) => (
                  <li key={index}>{benefit}</li>
                ))}
              </ul>
            </div>

            <audio ref={audioRef} onEnded={() => setIsPlaying(false)} />

            <Button 
              onClick={handleComplete}
              className="w-full mt-8"
            >
              <Check className="mr-2 h-4 w-4" />
              Concluir Meditação
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default MeditationSession;
