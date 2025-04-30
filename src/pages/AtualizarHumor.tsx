
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { Card } from "@/components/ui/card";
import { BackButton } from '@/components/BackButton';
import { registerActivity } from '@/utils/activityPoints';
import { useQueryClient } from '@tanstack/react-query';
import MoodSelector from '@/components/chat/MoodSelector';

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
      'happy': "Que bom que você está tranquilo hoje! Continue cultivando essa paz interior.",
      'neutral': "Equilíbrio é uma grande conquista. Cada dia neutro é um dia que você está no controle.",
      'sad': "Momentos difíceis também passam. Lembre-se de suas forças e de quão longe você já chegou.",
      'angry': "A raiva é apenas uma emoção temporária. Respire fundo e lembre-se do seu compromisso com sua recuperação.",
      'anxious': "A ansiedade não define você. Foque no momento presente, um passo de cada vez."
    };

    return messages[mood as keyof typeof messages] || "Obrigado por compartilhar como está se sentindo hoje.";
  };

  const getMoodData = (mood: string) => {
    const moodData = {
      'happy': { emocao: 'Tranquilo', pontos: 5 },
      'neutral': { emocao: 'Neutro', pontos: 3 },
      'sad': { emocao: 'Triste', pontos: 2 },
      'angry': { emocao: 'Irritado', pontos: 1 },
      'anxious': { emocao: 'Ansioso', pontos: 1 }
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
    <div className="min-h-screen bg-gradient-to-b from-blue-400 to-teal-500 p-6">
      <div className="flex items-center mb-6">
        <BackButton text="Voltar" onClick={handleReturn} className="text-white" />
      </div>
      
      <div className="max-w-md mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Como você está se sentindo hoje?</h1>
        </div>

        <Card className="p-6 rounded-xl">
          {!showMotivation ? (
            <div className="space-y-8">
              <MoodSelector mood={selectedMood} onMoodChange={handleMoodChange} />
              
              <Button 
                onClick={handleConfirm}
                className="w-full py-6 h-auto text-lg font-semibold bg-teal-600 hover:bg-teal-700"
              >
                Confirmar
              </Button>
            </div>
          ) : (
            <div className="text-center space-y-6">
              <h2 className="text-xl font-semibold text-teal-700">Mensagem para você:</h2>
              <p className="text-lg text-gray-700 py-4 px-2 bg-blue-50 rounded-lg">
                {motivationalMessage}
              </p>
              <Button 
                onClick={() => navigate('/dashboard')}
                className="w-full py-6 h-auto text-lg font-semibold bg-teal-600 hover:bg-teal-700"
              >
                Voltar ao Painel
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default AtualizarHumor;
