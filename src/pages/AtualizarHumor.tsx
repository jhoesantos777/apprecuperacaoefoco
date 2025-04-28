import React from 'react';
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

  const registrarHumor = async (emocao: string, pontos: number) => {
    try {
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
        emocao,
        pontos
      });

      if (humorError) throw humorError;

      await registerActivity('Humor', pontos, `Humor: ${emocao}`);
      
      await queryClient.invalidateQueries({ queryKey: ['recovery-score'] });

      toast("Sucesso!", {
        description: "Seu humor foi registrado com sucesso."
      });

      navigate('/dashboard');
    } catch (error) {
      console.error('Erro ao registrar humor:', error);
      toast("Erro", {
        description: "Não foi possível registrar seu humor. Tente novamente.",
        style: { backgroundColor: 'hsl(var(--destructive))' }
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-600 to-teal-900 p-6">
      <BackButton />
      
      <div className="max-w-md mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Como você está se sentindo hoje?</h1>
        </div>

        <Card className="p-6">
          <div className="grid grid-cols-1 gap-4">
            <Button 
              className="h-16 text-lg bg-green-500 hover:bg-green-600"
              onClick={() => registrarHumor('Ótimo', 5)}
            >
              Ótimo
            </Button>
            <Button 
              className="h-16 text-lg bg-blue-500 hover:bg-blue-600"
              onClick={() => registrarHumor('Bem', 4)}
            >
              Bem
            </Button>
            <Button 
              className="h-16 text-lg bg-gray-500 hover:bg-gray-600"
              onClick={() => registrarHumor('Neutro', 2)}
            >
              Neutro
            </Button>
            <Button 
              className="h-16 text-lg bg-yellow-500 hover:bg-yellow-600"
              onClick={() => registrarHumor('Desafiado', 1)}
            >
              Desafiado
            </Button>
            <Button 
              className="h-16 text-lg bg-red-500 hover:bg-red-600"
              onClick={() => registrarHumor('Difícil', 0)}
            >
              Difícil
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AtualizarHumor;
