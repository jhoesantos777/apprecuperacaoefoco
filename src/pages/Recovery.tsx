
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { format, startOfDay } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import RecoveryThermometer from '@/components/RecoveryThermometer';
import TriggerForm from '@/components/TriggerForm';
import { Card } from '@/components/ui/card';

const Recovery = () => {
  const today = startOfDay(new Date());

  const { data: dailyScore } = useQuery({
    queryKey: ['recovery-score'],
    queryFn: async () => {
      const userId = (await supabase.auth.getUser()).data.user?.id;
      if (!userId) throw new Error('User not authenticated');

      const [
        taskCompletions,
        moodEntries,
        devotionalVisits,
        sobrietyDeclarations,
        recoveryTriggers
      ] = await Promise.all([
        supabase
          .from('user_task_completions')
          .select('*')
          .gte('completed_at', today.toISOString())
          .eq('user_id', userId),
        supabase
          .from('mood_entries')
          .select('*')
          .gte('created_at', today.toISOString())
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(1),
        supabase
          .from('devotional_visits')
          .select('*')
          .gte('visited_at', today.toISOString())
          .eq('user_id', userId),
        supabase
          .from('sobriety_declarations')
          .select('*')
          .gte('declared_at', today.toISOString())
          .eq('user_id', userId),
        supabase
          .from('recovery_triggers')
          .select('*')
          .gte('created_at', today.toISOString())
          .eq('user_id', userId)
      ]);

      // Calculate points from tasks
      const taskPoints = (taskCompletions.data?.length || 0);

      // Calculate points from mood
      let moodPoints = 0;
      if (moodEntries.data?.[0]) {
        const mood = moodEntries.data[0];
        if (mood.points > 0) moodPoints = 2;
        else if (mood.points === 0) moodPoints = 1;
      }

      // Points from devotional visit
      const devotionalPoints = devotionalVisits.data?.length ? 1 : 0;

      // Points from sobriety declaration
      const sobrietyPoints = sobrietyDeclarations.data?.length ? 1 : 0;

      // Negative points from triggers
      const triggerPoints = (recoveryTriggers.data?.length || 0) * -1;

      const totalScore = taskPoints + moodPoints + devotionalPoints + sobrietyPoints + triggerPoints;
      const hasMultipleTriggers = (recoveryTriggers.data?.length || 0) > 1;

      return {
        score: Math.max(totalScore, 0),
        hasMultipleTriggers,
        details: {
          taskPoints,
          moodPoints,
          devotionalPoints,
          sobrietyPoints,
          triggerPoints
        }
      };
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-600 to-teal-900 p-6">
      <div className="max-w-md mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-white mb-6">Termômetro da Recuperação</h1>
        
        <Card className="p-6">
          <RecoveryThermometer 
            score={dailyScore?.score || 0}
            hasMultipleTriggers={dailyScore?.hasMultipleTriggers || false}
          />

          {dailyScore?.details && (
            <div className="mt-6 pt-6 border-t">
              <h3 className="text-lg font-semibold mb-4">Pontuação do Dia</h3>
              <div className="space-y-2 text-sm">
                <p>Tarefas completadas: +{dailyScore.details.taskPoints}</p>
                <p>Humor do dia: +{dailyScore.details.moodPoints}</p>
                <p>Devocional: +{dailyScore.details.devotionalPoints}</p>
                <p>Declaração de sobriedade: +{dailyScore.details.sobrietyPoints}</p>
                {dailyScore.details.triggerPoints < 0 && (
                  <p className="text-red-500">Gatilhos registrados: {dailyScore.details.triggerPoints}</p>
                )}
              </div>
            </div>
          )}
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Registrar Gatilho</h2>
          <TriggerForm />
        </Card>
      </div>
    </div>
  );
};

export default Recovery;
