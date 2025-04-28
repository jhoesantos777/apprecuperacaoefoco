
import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { meditations } from '@/data/meditations';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Pause, Play, Upload } from "lucide-react";
import { BackButton } from "@/components/BackButton";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useTherapeuticActivities } from '@/hooks/useTherapeuticActivities';

const MeditationSession = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false); // Added missing isUploading state
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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

    try {
      if (meditation.audioUrl) {
        // If we have a direct audio URL from the database
        const { data: audioData } = await supabase.storage
          .from('audio')
          .getPublicUrl(meditation.audioUrl);

        if (audioRef.current) {
          audioRef.current.src = audioData.publicUrl;
          if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
          } else {
            await audioRef.current.play();
            setIsPlaying(true);
          }
        }
        return;
      }

      try {
        setIsLoading(true);
        
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
    } catch (error) {
      console.error('Error playing audio:', error);
      toast({
        title: "Erro",
        description: "Não foi possível reproduzir o áudio da meditação.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadAudio = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);

      const fileExt = file.name.split('.').pop();
      const fileName = `${meditation.id}-${Date.now()}.${fileExt}`;
      const filePath = `meditations/${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from('audio')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('audio')
        .getPublicUrl(filePath);

      setAudioUrl(publicUrl);
      
      if (audioRef.current) {
        audioRef.current.src = publicUrl;
      }

      toast({
        title: "Sucesso",
        description: "Áudio enviado com sucesso!",
      });
    } catch (error) {
      console.error('Erro ao fazer upload do áudio:', error);
      toast({
        title: "Erro",
        description: "Não foi possível fazer o upload do áudio.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
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
                <div className="flex-shrink-0 space-y-2">
                  <Button
                    variant="outline"
                    size="icon"
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
                  
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="animate-pulse">...</span>
                    ) : (
                      <Upload className="h-4 w-4" />
                    )}
                  </Button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="audio/*"
                    onChange={handleUploadAudio}
                  />
                </div>
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
