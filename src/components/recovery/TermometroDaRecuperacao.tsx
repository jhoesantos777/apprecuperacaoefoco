
import React, { useEffect, useState } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format, startOfDay, subDays } from 'date-fns';
import { toast } from '@/components/ui/sonner';

const TermometroDaRecuperacao = () => {
  const queryClient = useQueryClient();
  const today = startOfDay(new Date());
  const oneWeekAgo = subDays(today, 7);

  const { data: scoreData, isLoading } = useQuery({
    queryKey: ['recovery-thermometer'],
    queryFn: async () => {
      try {
        const userId = (await supabase.auth.getUser()).data.user?.id;
        if (!userId) throw new Error('User not authenticated');

        // Fetch activities from the past week
        const { data: activities, error } = await supabase
          .from('atividades_usuario')
          .select('*')
          .gte('data_registro', oneWeekAgo.toISOString())
          .eq('user_id', userId);

        if (error) {
          console.error('Error fetching activities:', error);
          throw error;
        }

        console.log('Activities fetched for thermometer:', activities);

        if (!activities || activities.length === 0) {
          return {
            pontuacao: 0,
            detalhes: {
              tarefasDiarias: 0,
              humorDoDia: 0,
              fezDevocional: 0,
              hojeNaoVouUsar: 0,
              fezReflexao: 0,
              gatilhosSelecionados: 0
            }
          };
        }

        // Calculate points for each category
        const tarefasPontos = activities
          .filter(a => a.tipo_atividade === 'Tarefas')
          .reduce((sum, a) => sum + a.pontos, 0);

        const humorPontos = activities
          .filter(a => a.tipo_atividade === 'Humor')
          .reduce((sum, a) => sum + a.pontos, 0);

        const devocionalPontos = activities
          .filter(a => a.tipo_atividade === 'Devocional')
          .reduce((sum, a) => sum + a.pontos, 0);

        const hojeNaoVouUsarPontos = activities
          .filter(a => a.tipo_atividade === 'HojeNãoVouUsar')
          .reduce((sum, a) => sum + a.pontos, 0);

        const reflexaoPontos = activities
          .filter(a => a.tipo_atividade === 'Reflexão')
          .reduce((sum, a) => sum + a.pontos, 0);

        // Gatilhos are negative points
        const gatilhosPenalidade = activities
          .filter(a => a.tipo_atividade === 'Gatilho')
          .reduce((sum, a) => sum + Math.abs(a.pontos), 0); // Using Math.abs since these are negative

        // Cap the points as per requirements
        const cappedTarefasPontos = Math.min(tarefasPontos, 30);
        const cappedHumorPontos = Math.min(humorPontos, 20);
        const cappedDevocionalPontos = Math.min(devocionalPontos, 20);
        const cappedHojeNaoVouUsarPontos = Math.min(hojeNaoVouUsarPontos, 20);
        const cappedReflexaoPontos = Math.min(reflexaoPontos, 10);

        // Calculate total score
        const total = Math.max(0, 
          cappedTarefasPontos + 
          cappedHumorPontos + 
          cappedDevocionalPontos + 
          cappedHojeNaoVouUsarPontos + 
          cappedReflexaoPontos - 
          gatilhosPenalidade
        );

        // Return the calculated score and details
        return {
          pontuacao: Math.min(total, 100), // Ensure max is 100
          detalhes: {
            tarefasDiarias: cappedTarefasPontos,
            humorDoDia: cappedHumorPontos,
            fezDevocional: cappedDevocionalPontos,
            hojeNaoVouUsar: cappedHojeNaoVouUsarPontos,
            fezReflexao: cappedReflexaoPontos,
            gatilhosSelecionados: gatilhosPenalidade
          }
        };
      } catch (error) {
        console.error('Error calculating recovery score:', error);
        throw error;
      }
    }
  });

  // Default values when loading or if there's an error
  const pontuacao = scoreData?.pontuacao || 0;
  const detalhes = scoreData?.detalhes || {
    tarefasDiarias: 0,
    humorDoDia: 0,
    fezDevocional: 0,
    hojeNaoVouUsar: 0,
    fezReflexao: 0,
    gatilhosSelecionados: 0
  };

  const getCor = (valor: number) => {
    if (valor < 40) return '#dc3545'; // vermelho
    if (valor < 70) return '#ffc107'; // amarelo
    return '#28a745'; // verde
  };

  const resetarTermometro = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast("Você precisa estar logado para resetar o termômetro");
        return;
      }

      const { error } = await supabase
        .from('atividades_usuario')
        .delete()
        .gte('data_registro', oneWeekAgo.toISOString())
        .eq('user_id', user.id);

      if (error) throw error;

      // Refresh data
      queryClient.invalidateQueries({ queryKey: ['recovery-thermometer'] });
      toast("Termômetro resetado com sucesso");
    } catch (error) {
      console.error('Error resetting thermometer:', error);
      toast("Erro ao resetar o termômetro");
    }
  };

  return (
    <Card className="max-w-md mx-auto p-6 space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold">🧘 A SOBRIEDADE É UMA CONQUISTA DIÁRIA</h2>
        <p className="text-gray-600">Seu Termômetro de Recuperação</p>
      </div>

      <div className="w-40 h-40 mx-auto">
        <CircularProgressbar
          value={pontuacao}
          text={`${pontuacao}/100`}
          styles={buildStyles({
            pathColor: getCor(pontuacao),
            textColor: getCor(pontuacao),
            trailColor: '#eee'
          })}
        />
      </div>

      <div className="text-center">
        {pontuacao < 40 && <p>⚠️ Risco de recaída. Procure apoio.</p>}
        {pontuacao >= 40 && pontuacao < 70 && <p>😐 Atenção redobrada. Continue se cuidando.</p>}
        {pontuacao >= 70 && <p>💪 Você está indo bem. Continue firme!</p>}
      </div>

      <div className="space-y-2">
        <p>✅ Tarefas Diárias: +{detalhes.tarefasDiarias} pts</p>
        <p>😊 Humor do Dia: +{detalhes.humorDoDia} pts</p>
        <p>🙏 Devocional: +{detalhes.fezDevocional} pts</p>
        <p>🚨 Hoje Eu Não Vou Usar: +{detalhes.hojeNaoVouUsar} pts</p>
        <p>📝 Reflexão do Dia: +{detalhes.fezReflexao} pts</p>
        <p>🔻 Gatilhos: -{detalhes.gatilhosSelecionados} pts</p>
      </div>

      <div className="flex justify-between">
        <Button
          onClick={resetarTermometro}
          variant="destructive"
          className="w-full"
        >
          🔄 Resetar Termômetro
        </Button>
      </div>
    </Card>
  );
};

export default TermometroDaRecuperacao;
