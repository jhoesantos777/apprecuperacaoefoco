
import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format, startOfDay, subDays } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import RecoveryThermometer from '@/components/RecoveryThermometer';
import TriggerForm from '@/components/TriggerForm';
import DailyMotivation from '@/components/DailyMotivation';
import { Card } from '@/components/ui/card';
import { BackButton } from '@/components/BackButton';
import { toast } from '@/components/ui/sonner';
import { ResetButton } from '@/components/recovery/ResetButton';

const Recovery = () => {
  const today = startOfDay(new Date());
  const oneWeekAgo = subDays(today, 7);

  const { data: recoveryScore, isLoading, error } = useQuery({
    queryKey: ['recovery-score'],
    queryFn: async () => {
      try {
        const userId = (await supabase.auth.getUser()).data.user?.id;
        if (!userId) throw new Error('User not authenticated');

        console.log('Fetching activities for user:', userId);

        const { data: activities, error } = await supabase
          .from('atividades_usuario')
          .select('*')
          .gte('data_registro', oneWeekAgo.toISOString())
          .eq('user_id', userId);

        if (error) {
          console.error('Error fetching activities:', error);
          throw error;
        }

        console.log('Activities fetched:', activities);

        // Calculate points from all activities
        const points = activities?.reduce((acc, activity) => {
          return acc + activity.pontos;
        }, 0) || 0;

        // Normalize score to 0-10 scale
        const MAX_POSSIBLE_POINTS = 42; // 27 + 5 + 2 + 5 + 3
        const normalizedScore = (points / MAX_POSSIBLE_POINTS) * 10;

        // Check for multiple triggers as a risk factor
        const hasMultipleTriggers = activities?.filter(
          a => a.tipo_atividade === 'Gatilho'
        ).length > 1;

        // Calculate details for different activity types
        const details = {
          taskPoints: activities?.filter(a => a.tipo_atividade === 'Tarefas').reduce((acc, a) => acc + a.pontos, 0) || 0,
          moodPoints: activities?.filter(a => a.tipo_atividade === 'Humor').reduce((acc, a) => acc + a.pontos, 0) || 0,
          devotionalPoints: activities?.filter(a => a.tipo_atividade === 'Devocional').reduce((acc, a) => acc + a.pontos, 0) || 0,
          sobrietyPoints: activities?.filter(a => a.tipo_atividade === 'HojeNãoVouUsar').reduce((acc, a) => acc + a.pontos, 0) || 0,
          reflectionPoints: activities?.filter(a => a.tipo_atividade === 'Reflexão').reduce((acc, a) => acc + a.pontos, 0) || 0
        };

        console.log('Recovery score details:', {
          score: parseFloat(normalizedScore.toFixed(1)),
          hasMultipleTriggers,
          details
        });

        return {
          score: parseFloat(normalizedScore.toFixed(1)),
          hasMultipleTriggers,
          details
        };
      } catch (error) {
        console.error('Error calculating recovery score:', error);
        toast("Erro ao carregar o termômetro de recuperação");
        throw error;
      }
    }
  });

  // Log the recovery score when it changes
  useEffect(() => {
    if (recoveryScore) {
      console.log('Recovery score updated:', recoveryScore);
    }
  }, [recoveryScore]);

  // Handle loading and error states
  if (isLoading) {
    console.log('Loading recovery score...');
  }
  
  if (error) {
    console.error('Recovery score error:', error);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-600 to-teal-900 p-6">
      <BackButton />
      
      <div className="max-w-md mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-white mb-6">
          🧠 Termômetro da Recuperação
        </h1>
        
        <DailyMotivation />
        
        <Card className="p-6">
          <RecoveryThermometer 
            score={recoveryScore?.score || 0}
            hasMultipleTriggers={recoveryScore?.hasMultipleTriggers || false}
            details={recoveryScore?.details}
          />
          <div className="mt-4">
            <ResetButton />
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Identifique seus Gatilhos de Hoje</h2>
          <TriggerForm />
        </Card>
      </div>
    </div>
  );
};

export default Recovery;
