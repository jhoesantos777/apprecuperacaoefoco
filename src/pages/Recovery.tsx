
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { format, startOfDay } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import RecoveryThermometer from '@/components/RecoveryThermometer';
import TriggerForm from '@/components/TriggerForm';
import DailyMotivation from '@/components/DailyMotivation';
import { Card } from '@/components/ui/card';
import { BackButton } from '@/components/BackButton';
import { toast } from '@/components/ui/sonner';

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
          .select('task_id')
          .gte('completed_at', today.toISOString())
          .eq('user_id', userId),
        supabase
          .from('mood_entries')
          .select('points')
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

      // Tasks points (max 27)
      const taskPoints = taskCompletions.data?.length || 0;

      // Mood points (max 5)
      const moodPoints = moodEntries.data?.[0]?.points || 0;

      // Devotional points (max 2)
      const devotionalPoints = devotionalVisits.data?.length ? 2 : 0;

      // Sobriety declaration points (max 5)
      const sobrietyPoints = sobrietyDeclarations.data?.length ? 5 : 0;

      // Reflection points (max 3) - temporarily hardcoded to 0 until reflections table is created
      const reflectionPoints = 0;

      // Calculate total score and normalize to 0-10 scale
      const totalPoints = taskPoints + moodPoints + devotionalPoints + sobrietyPoints + reflectionPoints;
      const MAX_POSSIBLE_POINTS = 42; // 27 + 5 + 2 + 5 + 3
      const normalizedScore = (totalPoints / MAX_POSSIBLE_POINTS) * 10;

      // Check for multiple triggers as a risk factor
      const hasMultipleTriggers = (recoveryTriggers.data?.length || 0) > 1;

      return {
        score: parseFloat(normalizedScore.toFixed(1)),
        hasMultipleTriggers,
        details: {
          taskPoints,
          moodPoints,
          devotionalPoints,
          sobrietyPoints,
          reflectionPoints
        }
      };
    }
  });

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
