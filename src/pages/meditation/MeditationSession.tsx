
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { meditations } from '@/data/meditations';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Pause, Play, Volume2, VolumeX } from "lucide-react";
import { BackButton } from "@/components/BackButton";
import { useToast } from "@/hooks/use-toast";
import { useTherapeuticActivities } from '@/hooks/useTherapeuticActivities';
import { useAudio } from '@/hooks/useAudio';

const MeditationSession = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { data: dbMeditations } = useTherapeuticActivities();
  const staticMeditation = meditations.find(m => m.id === id);
  const dbMeditation = dbMeditations?.find(m => m.id === id);
  
  const meditation = staticMeditation || (dbMeditation ? {
    id: dbMeditation.id,
    title: dbMeditation.title,
    objective: dbMeditation.description,
    description: dbMeditation.description,
    duration: "10-15 minutos",
    benefits: ["Reduz ansiedade", "Melhora o foco", "Promove bem-estar"],
    audioUrl: dbMeditation.audio_url
  } : null);

  const {
    audioRef,
    audioState,
    isLoading,
    isMuted,
    handlePlay,
    toggleMute,
    handleTimeUpdate,
  } = useAudio(meditation?.audioUrl);

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

            <audio 
              ref={audioRef}
              onTimeUpdate={handleTimeUpdate}
              onEnded={() => handlePlay()}
              onError={(e) => {
                console.error('Audio error:', e);
                toast({
                  title: "Erro",
                  description: "Ocorreu um erro ao reproduzir o áudio.",
                  variant: "destructive",
                });
              }}
            />

            <div className="flex items-center justify-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={handlePlay}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="animate-pulse">...</span>
                ) : audioState.isPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>
              
              <Button
                variant="outline"
                size="icon"
                onClick={toggleMute}
                disabled={!meditation.audioUrl || isLoading}
              >
                {isMuted ? (
                  <VolumeX className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </Button>
            </div>

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
