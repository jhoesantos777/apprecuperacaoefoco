
import React from 'react';
import { meditations } from '@/data/meditations';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlayCircle, Clock, Target } from "lucide-react";
import { BackButton } from "@/components/BackButton";
import { useNavigate } from "react-router-dom";
import { useTherapeuticActivities } from '@/hooks/useTherapeuticActivities';

const MeditationPage = () => {
  const navigate = useNavigate();
  const { data: dbMeditations, isLoading } = useTherapeuticActivities();

  const allMeditations = [
    ...meditations,
    ...(dbMeditations?.filter(m => m.active) || []).map(m => ({
      id: m.id,
      title: m.title,
      objective: m.description,
      description: m.description,
      duration: "10-15 minutos",
      benefits: ["Reduz ansiedade", "Melhora o foco", "Promove bem-estar"],
      audioUrl: m.audio_url
    }))
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-600 to-indigo-900 p-6">
      <BackButton />
      
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center text-white mb-8">
          <h1 className="text-3xl font-bold mb-4">Meditação Guiada</h1>
          <p className="text-lg opacity-90">
            Escolha uma meditação para começar sua jornada de mindfulness
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {isLoading ? (
            <div className="col-span-2 text-center text-white">
              Carregando meditações...
            </div>
          ) : (
            allMeditations.map((meditation) => (
              <Card key={meditation.id} className="p-6 hover:shadow-xl transition-all">
                <h3 className="text-xl font-semibold mb-3">{meditation.title}</h3>
                
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <Clock className="w-4 h-4" />
                  <span>{meditation.duration}</span>
                </div>

                <div className="flex items-start gap-2 text-sm text-gray-600 mb-4">
                  <Target className="w-4 h-4 mt-1" />
                  <p>{meditation.objective}</p>
                </div>

                <div className="space-y-4">
                  <Button 
                    className="w-full"
                    onClick={() => navigate(`/meditation/${meditation.id}`)}
                  >
                    <PlayCircle className="mr-2 h-4 w-4" />
                    Começar Meditação
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MeditationPage;
