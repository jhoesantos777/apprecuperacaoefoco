
import React, { useEffect, useState } from 'react';
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
import { Button } from '@/components/ui/button';
import { registerActivity } from '@/utils/activityPoints';
import { useQueryClient } from '@tanstack/react-query';

const Recovery = () => {
  const today = startOfDay(new Date());
  const oneWeekAgo = subDays(today, 7);
  const [hasConfirmedSobriety, setHasConfirmedSobriety] = useState(false);
  const queryClient = useQueryClient();

  const { data: recoveryScore, isLoading, error } = useQuery({
    queryKey: ['recovery-score'],
    queryFn: async () => {
      try {
        const userId = (await supabase.auth.getUser()).data.user?.id;
        if (!userId) throw new Error('User not authenticated');

        console.log('Fetching activities for user:', userId);

        // Check if user has confirmed sobriety today
        const { data: sobrietyDeclarations } = await supabase
          .from('sobriety_declarations')
          .select('*')
          .eq('user_id', userId)
          .gte('declared_at', new Date().toISOString().split('T')[0]);

        if (sobrietyDeclarations && sobrietyDeclarations.length > 0) {
          setHasConfirmedSobriety(true);
        }

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

        if (!activities || activities.length === 0) {
          return {
            score: 0,
            hasMultipleTriggers: false,
            details: {
              taskPoints: 0,
              moodPoints: 0,
              devotionalPoints: 0,
              sobrietyPoints: 0,
              reflectionPoints: 0
            }
          };
        }

        // NOVO ALGORITMO: 
        // 1. Agrupar atividades por dia
        const activitiesByDate = activities.reduce((acc, activity) => {
          const date = new Date(activity.data_registro).toISOString().split('T')[0];
          if (!acc[date]) {
            acc[date] = [];
          }
          acc[date].push(activity);
          return acc;
        }, {} as Record<string, typeof activities>);
        
        // 2. Calcular dias únicos com registros
        const diasComRegistros = Object.keys(activitiesByDate).length;
        
        // 3. Somar todos os pontos (positivos e negativos)
        const pontuacaoTotalSemana = activities.reduce((acc, activity) => acc + activity.pontos, 0);
        
        // 4. Calcular a pontuação máxima possível (42 pontos por dia com registro)
        const pontuacaoMaximaSemana = diasComRegistros * 42;
        
        // 5. Calcular o termômetro normalizado (escala 0-10)
        let termometroFinal = (pontuacaoTotalSemana / pontuacaoMaximaSemana) * 10;
        
        // Garantir que o valor está entre 0 e 10
        termometroFinal = Math.max(0, Math.min(10, termometroFinal));
        
        // Calcular detalhes para diferentes tipos de atividade (para exibição)
        const taskPoints = activities.filter(a => a.tipo_atividade === 'Tarefas').reduce((acc, a) => acc + a.pontos, 0) || 0;
        const moodPoints = activities.filter(a => a.tipo_atividade === 'Humor').reduce((acc, a) => acc + a.pontos, 0) || 0;
        const devotionalPoints = activities.filter(a => a.tipo_atividade === 'Devocional').reduce((acc, a) => acc + a.pontos, 0) || 0;
        const sobrietyPoints = activities.filter(a => a.tipo_atividade === 'HojeNãoVouUsar').reduce((acc, a) => acc + a.pontos, 0) || 0;
        const reflectionPoints = activities.filter(a => a.tipo_atividade === 'Reflexão').reduce((acc, a) => acc + a.pontos, 0) || 0;
        
        // Verificar múltiplos gatilhos como fator de risco
        const hasMultipleTriggers = activities.filter(
          a => a.tipo_atividade === 'Gatilho'
        ).length > 1;

        console.log('Novo cálculo do termômetro:', {
          score: parseFloat(termometroFinal.toFixed(1)),
          pontuacaoTotalSemana,
          diasComRegistros,
          pontuacaoMaximaSemana,
          hasMultipleTriggers,
          details: {
            taskPoints,
            moodPoints,
            devotionalPoints,
            sobrietyPoints,
            reflectionPoints
          }
        });

        return {
          score: parseFloat(termometroFinal.toFixed(1)),
          hasMultipleTriggers,
          details: {
            taskPoints,
            moodPoints,
            devotionalPoints,
            sobrietyPoints,
            reflectionPoints
          }
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

  // Handle sobriety declaration
  const handleSobrietyDeclaration = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast("Você precisa estar logado para fazer esta declaração");
        return;
      }

      const { error } = await supabase
        .from('sobriety_declarations')
        .insert([
          {
            user_id: user.id,
            declared_at: new Date().toISOString()
          }
        ]);

      if (error) throw error;

      // Register activity for the recovery thermometer
      await registerActivity('HojeNãoVouUsar', 5, 'Declaração de sobriedade');
      
      // Update queries
      queryClient.invalidateQueries({ queryKey: ['recovery-score'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['sobriety-medals'] });
      
      setHasConfirmedSobriety(true);
      toast("Parabéns!", {
        description: "Sua determinação é inspiradora. Continue firme!"
      });
    } catch (error) {
      console.error('Error registering sobriety declaration:', error);
      toast("Erro", {
        description: "Não foi possível registrar sua declaração.",
        style: { backgroundColor: 'hsl(var(--destructive))' }
      });
    }
  };

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
          <Button 
            className={`w-full py-6 text-lg font-bold transition-all duration-300 mb-6 ${
              hasConfirmedSobriety 
                ? 'bg-green-600 hover:bg-green-700' 
                : 'bg-red-600 hover:bg-red-700'
            } text-white`}
            onClick={handleSobrietyDeclaration}
            disabled={hasConfirmedSobriety}
          >
            {hasConfirmedSobriety 
              ? "A SOBRIEDADE É UMA CONQUISTA DIÁRIA ✨" 
              : "HOJE EU NAO VOU USAR!"}
          </Button>

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
