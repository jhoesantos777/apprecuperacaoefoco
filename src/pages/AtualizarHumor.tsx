
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { Card } from "@/components/ui/card";
import { BackButton } from '@/components/BackButton';
import { registerActivity } from '@/utils/activityPoints';
import { useQueryClient } from '@tanstack/react-query';

const AtualizarHumor = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedMood, setSelectedMood] = useState('');
  const [motivationalMessage, setMotivationalMessage] = useState('');
  const [showMotivation, setShowMotivation] = useState(false);

  const handleMoodChange = (mood: string) => {
    setSelectedMood(mood);
    setShowMotivation(false);
  };

  const getMotivationalMessage = (mood: string) => {
    const messages = {
      'otimo': "Que ótimo que você está se sentindo bem hoje! Continue cultivando essa energia positiva.",
      'bem': "Sentir-se bem é uma grande conquista. Aproveite esse momento e continue avançando.",
      'desmotivado': "A desmotivação é apenas temporária. Lembre-se de seu valor e de que cada dia é uma nova oportunidade.",
      'triste': "Momentos de tristeza também passam. Seja gentil consigo mesmo e lembre-se de suas forças.",
      'irritado': "A irritação é uma energia que pode ser transformada. Respire fundo e lembre-se do seu compromisso com sua recuperação."
    };

    return messages[mood as keyof typeof messages] || "Obrigado por compartilhar como está se sentindo hoje.";
  };

  const getMoodData = (mood: string) => {
    const moodData = {
      'otimo': { emocao: 'Ótimo', pontos: 5 },
      'bem': { emocao: 'Bem', pontos: 4 },
      'desmotivado': { emocao: 'Desmotivado', pontos: 2 },
      'triste': { emocao: 'Triste', pontos: 2 },
      'irritado': { emocao: 'Irritado', pontos: 1 }
    };

    return moodData[mood as keyof typeof moodData] || { emocao: 'Indefinido', pontos: 0 };
  };

  const handleConfirm = async () => {
    if (!selectedMood) {
      toast("Aviso", {
        description: "Por favor, selecione como você está se sentindo hoje.",
      });
      return;
    }

    try {
      const moodData = getMoodData(selectedMood);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast("Erro: Você precisa estar logado para registrar seu humor.", {
          description: "Faça login e tente novamente.",
          style: { backgroundColor: 'hsl(var(--destructive))' }
        });
        return;
      }

      const { error: humorError } = await supabase.from('humores').insert({
        user_id: user.id,
        emocao: moodData.emocao,
        pontos: moodData.pontos
      });

      if (humorError) throw humorError;

      await registerActivity('Humor', moodData.pontos, `Humor: ${moodData.emocao}`);
      
      await queryClient.invalidateQueries({ queryKey: ['recovery-score'] });

      // Show motivational message
      setMotivationalMessage(getMotivationalMessage(selectedMood));
      setShowMotivation(true);
      
      toast("Sucesso!", {
        description: "Seu humor foi registrado com sucesso."
      });
    } catch (error) {
      console.error('Erro ao registrar humor:', error);
      toast("Erro", {
        description: "Não foi possível registrar seu humor. Tente novamente.",
        style: { backgroundColor: 'hsl(var(--destructive))' }
      });
    }
  };

  const handleReturn = () => {
    if (showMotivation) {
      setShowMotivation(false);
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-blue-900 to-teal-500 flex flex-col p-6">
      <div className="mb-6">
        <BackButton text="Voltar" className="text-white" />
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Como você está se sentindo hoje?</h1>
          <p className="text-white/80 text-sm">aperte o botão da emoção</p>
        </div>

        {!showMotivation ? (
          <div className="w-full space-y-4">
            <Button 
              onClick={() => handleMoodChange('otimo')}
              className={`w-full py-4 text-xl font-medium bg-gradient-to-r from-teal-500 to-green-500 hover:brightness-110 ${selectedMood === 'otimo' ? 'ring-2 ring-white' : ''}`}
            >
              ÓTIMO
            </Button>
            
            <Button 
              onClick={() => handleMoodChange('bem')}
              className={`w-full py-4 text-xl font-medium bg-gradient-to-r from-blue-600 to-blue-500 hover:brightness-110 ${selectedMood === 'bem' ? 'ring-2 ring-white' : ''}`}
            >
              BEM
            </Button>
            
            <Button 
              onClick={() => handleMoodChange('desmotivado')}
              className={`w-full py-4 text-xl font-medium bg-gradient-to-r from-yellow-500 to-yellow-400 hover:brightness-110 ${selectedMood === 'desmotivado' ? 'ring-2 ring-white' : ''}`}
            >
              DESMOTIVADO
            </Button>
            
            <Button 
              onClick={() => handleMoodChange('triste')}
              className={`w-full py-4 text-xl font-medium bg-gradient-to-r from-amber-700 to-amber-500 hover:brightness-110 ${selectedMood === 'triste' ? 'ring-2 ring-white' : ''}`}
            >
              TRISTE
            </Button>
            
            <Button 
              onClick={() => handleMoodChange('irritado')}
              className={`w-full py-4 text-xl font-medium bg-gradient-to-r from-red-700 to-red-500 hover:brightness-110 ${selectedMood === 'irritado' ? 'ring-2 ring-white' : ''}`}
            >
              IRRITADO
            </Button>
            
            <Button 
              onClick={handleConfirm}
              className="w-full py-4 mt-8 text-xl font-medium bg-green-500 hover:bg-green-400"
            >
              CONFIRMAR
            </Button>
          </div>
        ) : (
          <div className="w-full">
            <Card className="p-6 text-center space-y-6 bg-white/90">
              <h2 className="text-xl font-semibold text-teal-700">Mensagem para você:</h2>
              <p className="text-lg text-gray-700 py-4 px-2 bg-blue-50 rounded-lg">
                {motivationalMessage}
              </p>
              <Button 
                onClick={() => navigate('/dashboard')}
                className="w-full py-4 text-xl font-medium bg-green-500 hover:bg-green-400"
              >
                Voltar ao Painel
              </Button>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default AtualizarHumor;
