
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { format, startOfDay } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import RecoveryThermometer from '@/components/RecoveryThermometer';
import TriggerForm from '@/components/TriggerForm';
import DailyMotivation from '@/components/DailyMotivation';
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

      // Calculate points from tasks (each task = +1)
      const taskPoints = (taskCompletions.data?.length || 0);

      // Calculate points from mood (positive = +2, neutral = +1, negative = 0)
      let moodPoints = 0;
      if (moodEntries.data?.[0]) {
        const mood = moodEntries.data[0];
        if (mood.points > 0) moodPoints = 2;
        else if (mood.points === 0) moodPoints = 1;
      }

      // Points from devotional visit (+1)
      const devotionalPoints = devotionalVisits.data?.length ? 1 : 0;

      // Points from sobriety declaration (+1)
      const sobrietyPoints = sobrietyDeclarations.data?.length ? 1 : 0;

      // Negative points from triggers (-1 per trigger)
      const triggerPoints = (recoveryTriggers.data?.length || 0) * -1;

      // Calculate total score
      const totalScore = taskPoints + moodPoints + devotionalPoints + sobrietyPoints + triggerPoints;

      // Check for multiple triggers
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
        <h1 className="text-3xl font-bold text-white mb-6">
          🧠 Termômetro da Recuperação
        </h1>
        
        <DailyMotivation />
        
        <Card className="p-6">
          <RecoveryThermometer 
            score={dailyScore?.score || 0}
            hasMultipleTriggers={dailyScore?.hasMultipleTriggers || false}
            details={dailyScore?.details}
          />
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
