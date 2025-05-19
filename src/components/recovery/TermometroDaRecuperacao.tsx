
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import RecoveryThermometer from '@/components/RecoveryThermometer';
import { registerActivity, ACTIVITY_POINTS } from '@/utils/activityPoints';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

interface ScoreBreakdown {
  taskPoints: number;
  moodPoints: number;
  devotionalPoints: number;
  sobrietyPoints: number;
  reflectionPoints: number;
  motivationNotePoints: number;
}

const TermometroDaRecuperacao = () => {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Calculate overall thermometer score based on registered activities
  const { data: activityPoints, isLoading } = useQuery({
    queryKey: ['activity-points'],
    queryFn: async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const { data, error } = await supabase
          .from('atividades_usuario')
          .select('*')
          .eq('user_id', user.id)
          .gte('created_at', today.toISOString());
        
        if (error) throw error;
        
        // Calculate points by category
        const pointsByCategory: ScoreBreakdown = {
          taskPoints: calculatePointsByType(data, 'Tarefas'),
          moodPoints: calculatePointsByType(data, 'Humor'),
          devotionalPoints: calculatePointsByType(data, 'Devocional'),
          sobrietyPoints: calculatePointsByType(data, 'HojeNãoVouUsar'),
          reflectionPoints: calculatePointsByType(data, 'Reflexão'),
          motivationNotePoints: calculatePointsByType(data, 'NotaMotivação')
        };
        
        // Calculate total score (max 100)
        const totalPoints = data?.reduce((sum, item) => sum + (item.pontos || 0), 0) || 0;
        const score = Math.min(totalPoints, 100); // Cap score at 100
        
        return {
          score,
          details: pointsByCategory,
          hasPoints: totalPoints > 0,
          isComplete: totalPoints >= 100
        };
      } catch (error) {
        console.error('Failed to fetch activity points:', error);
        return { 
          score: 0, 
          details: {
            taskPoints: 0,
            moodPoints: 0,
            devotionalPoints: 0,
            sobrietyPoints: 0,
            reflectionPoints: 0,
            motivationNotePoints: 0
          }, 
          hasPoints: false,
          isComplete: false
        };
      }
    }
  });
  
  // Query for triggers to check vulnerability
  const { data: triggerData } = useQuery({
    queryKey: ['recovery-triggers'],
    queryFn: async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');
        
        const { data, error } = await supabase
          .from('recovery_triggers')
          .select('*')
          .eq('user_id', user.id);
          
        if (error) throw error;
        
        return data || [];
      } catch (error) {
        console.error('Failed to fetch triggers:', error);
        return [];
      }
    }
  });

  const submitThermometerMutation = useMutation({
    mutationFn: async () => {
      const score = activityPoints?.score || 0;
      await registerActivity('Recuperação', score, `Termômetro com pontuação: ${score}/100`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activity-points'] });
      toast.success("Pontuação do termômetro registrada com sucesso!");
    },
    onError: (error) => {
      console.error("Erro ao registrar pontuação:", error);
      toast.error("Não foi possível registrar a pontuação");
    }
  });

  function calculatePointsByType(data: any[] | null, type: string): number {
    if (!data) return 0;
    return data
      .filter(item => item.tipo_atividade === type)
      .reduce((sum, item) => sum + (item.pontos || 0), 0);
  }

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      await submitThermometerMutation.mutateAsync();
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate the maximum possible points
  const maxPossiblePoints = 
    ACTIVITY_POINTS.HojeNãoVouUsar + 
    ACTIVITY_POINTS.Devocional + 
    ACTIVITY_POINTS.Reflexão + 
    ACTIVITY_POINTS.NotaMotivação + 
    ACTIVITY_POINTS.Humor.Ótimo; // Using the maximum mood points
  
  // Plus 20 tasks (arbitrary estimate)
  const estimatedMaxPoints = maxPossiblePoints + (20 * ACTIVITY_POINTS.Tarefas);

  if (isLoading) {
    return (
      <div className="bg-white/5 backdrop-blur-md rounded-xl p-8 border border-white/10 flex justify-center items-center min-h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 md:p-8 border border-white/10 text-white">
      <h2 className="text-2xl font-bold mb-4">Termômetro da Recuperação</h2>
      <p className="text-white/80 mb-6">
        Este indicador reflete seu progresso com base nas atividades realizadas hoje.
        Complete atividades para aumentar sua pontuação até 100 pontos.
      </p>
      
      <div className="space-y-4 my-8">
        <div className="bg-white/10 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Pontuação por Atividades</h3>
          <ul className="space-y-2">
            <li className="flex justify-between">
              <span>Hoje Não Vou Usar:</span>
              <span className="font-medium">{ACTIVITY_POINTS.HojeNãoVouUsar} pontos</span>
            </li>
            <li className="flex justify-between">
              <span>Devocional:</span>
              <span className="font-medium">{ACTIVITY_POINTS.Devocional} pontos</span>
            </li>
            <li className="flex justify-between">
              <span>Tarefas Diárias:</span>
              <span className="font-medium">{ACTIVITY_POINTS.Tarefas} ponto por tarefa</span>
            </li>
            <li className="flex justify-between">
              <span>Como Você Está Hoje:</span>
              <span className="font-medium">-10 a +10 pontos</span>
            </li>
            <li className="flex justify-between">
              <span>Reflexão do Dia:</span>
              <span className="font-medium">{ACTIVITY_POINTS.Reflexão} pontos</span>
            </li>
            <li className="flex justify-between">
              <span>Nota de Motivação:</span>
              <span className="font-medium">{ACTIVITY_POINTS.NotaMotivação} pontos</span>
            </li>
          </ul>
        </div>
      </div>
      
      <RecoveryThermometer 
        score={activityPoints?.score || 0} 
        hasMultipleTriggers={(triggerData?.length || 0) > 3}
        details={activityPoints?.details}
      />

      <div className="mt-8 flex justify-center">
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting || (activityPoints?.isComplete)}
          size="lg"
          className={`w-full md:w-auto px-8 py-6 text-lg font-bold rounded-full shadow-lg ${
            activityPoints?.isComplete 
              ? 'bg-gradient-to-r from-green-600 to-emerald-700' 
              : 'bg-gradient-to-r from-purple-700 to-indigo-800 hover:from-purple-800 hover:to-indigo-900'
          }`}
        >
          <Check className="mr-2 h-6 w-6" />
          {isSubmitting 
            ? "Registrando..." 
            : activityPoints?.isComplete 
              ? "Termômetro Completo!" 
              : "Registrar Pontuação"}
        </Button>
      </div>
    </div>
  );
};

export default TermometroDaRecuperacao;
