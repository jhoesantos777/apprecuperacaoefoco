
import React, { useEffect, useState } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format, startOfDay, subDays } from 'date-fns';
import { toast } from '@/components/ui/sonner';
import { Thermometer, AlertCircle, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

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

        // Enhanced scoring algorithm with holistic approach
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

        // New formula: Gatilhos have progressively increasing impact
        const gatilhosAtividades = activities.filter(a => a.tipo_atividade === 'Gatilho');
        const gatilhosPenalidade = gatilhosAtividades.length > 0 
          ? gatilhosAtividades.reduce((sum, _, index) => sum + (index + 1) * 3, 0) // Increasing penalty for each trigger
          : 0;

        // Apply caps with more balanced weight distribution for holistic recovery
        const cappedTarefasPontos = Math.min(tarefasPontos, 25); // Reduced slightly for more balance
        const cappedHumorPontos = Math.min(humorPontos, 15);
        const cappedDevocionalPontos = Math.min(devocionalPontos, 20);
        const cappedHojeNaoVouUsarPontos = Math.min(hojeNaoVouUsarPontos, 25); // Increased for sobriety commitment
        const cappedReflexaoPontos = Math.min(reflexaoPontos, 15); // Increased for self-awareness

        // Calculate total score with weighted formula
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

  const getTerapeuticMessage = (score: number) => {
    if (score < 30) {
      return "Estou percebendo que você pode estar precisando de um apoio mais próximo neste momento. É normal passar por fases desafiadoras no processo de recuperação. Que tal explorarmos juntos algumas estratégias que podem ajudar quando essas dificuldades surgem?";
    } else if (score < 50) {
      return "Vejo que você está navegando por um período de altos e baixos, algo muito comum na jornada de recuperação. Cada pequeno esforço que você faz tem valor. Quer compartilhar o que tem sido mais desafiador para você recentemente?";
    } else if (score < 70) {
      return "Percebo que você está construindo uma base mais consistente para sua recuperação. Este é um sinal significativo de progresso. Continue desenvolvendo suas práticas diárias e lembre-se que cada dia é uma oportunidade de fortalecer sua resiliência.";
    } else if (score < 90) {
      return "Você está demonstrando um compromisso notável com seu processo de recuperação. Esta consistência é fundamental para transformar práticas saudáveis em hábitos duradouros. O que você sente que está contribuindo mais para seu progresso atual?";
    } else {
      return "Seu comprometimento com a recuperação está refletido nestes resultados impressionantes. Você está construindo não apenas sobriedade, mas uma nova relação consigo mesmo. Este é um momento para reconhecer e valorizar sua força e resiliência.";
    }
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
    <Card className="max-w-md mx-auto p-6 space-y-6 bg-gradient-to-br from-indigo-900/60 to-purple-900/60 backdrop-blur-sm border border-white/10">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-white">🧘 A SOBRIEDADE É UMA CONQUISTA DIÁRIA</h2>
        <p className="text-gray-200">Seu Termômetro de Recuperação</p>
      </div>

      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-52 h-52 mx-auto"
      >
        <CircularProgressbar
          value={pontuacao}
          text={`${pontuacao}%`}
          circleRatio={0.75}
          styles={buildStyles({
            rotation: 1 / 2 + 1 / 8,
            strokeLinecap: 'round',
            textSize: '16px',
            pathTransitionDuration: 1,
            pathColor: getCor(pontuacao),
            textColor: '#ffffff',
            trailColor: 'rgba(255, 255, 255, 0.2)',
            backgroundColor: '#3e98c7',
          })}
        />
      </motion.div>

      <div className="text-center p-4 rounded-xl bg-white/10 backdrop-blur-sm">
        {pontuacao < 40 && (
          <div className="flex items-center justify-center gap-2 text-red-300">
            <AlertCircle className="h-5 w-5" />
            <p>Atenção especial necessária</p>
          </div>
        )}
        {pontuacao >= 40 && pontuacao < 70 && (
          <div className="flex items-center justify-center gap-2 text-yellow-200">
            <Thermometer className="h-5 w-5" />
            <p>Progresso em desenvolvimento</p>
          </div>
        )}
        {pontuacao >= 70 && (
          <div className="flex items-center justify-center gap-2 text-green-300">
            <Heart className="h-5 w-5" />
            <p>Excelente progresso na jornada</p>
          </div>
        )}
        <p className="mt-3 text-white italic">{getTerapeuticMessage(pontuacao)}</p>
      </div>

      <div className="space-y-3 bg-white/5 backdrop-blur-sm rounded-xl p-4">
        <h3 className="text-lg font-medium text-white text-center mb-3">Detalhes da sua Pontuação</h3>
        <div className="flex justify-between items-center text-white">
          <p>✅ Tarefas Diárias:</p>
          <p className="font-semibold">+{detalhes.tarefasDiarias} pts</p>
        </div>
        <div className="flex justify-between items-center text-white">
          <p>😊 Humor do Dia:</p>
          <p className="font-semibold">+{detalhes.humorDoDia} pts</p>
        </div>
        <div className="flex justify-between items-center text-white">
          <p>🙏 Devocional:</p>
          <p className="font-semibold">+{detalhes.fezDevocional} pts</p>
        </div>
        <div className="flex justify-between items-center text-white">
          <p>🚨 Hoje Eu Não Vou Usar:</p>
          <p className="font-semibold">+{detalhes.hojeNaoVouUsar} pts</p>
        </div>
        <div className="flex justify-between items-center text-white">
          <p>📝 Reflexão do Dia:</p>
          <p className="font-semibold">+{detalhes.fezReflexao} pts</p>
        </div>
        <div className="flex justify-between items-center text-white">
          <p>🔻 Gatilhos:</p>
          <p className="font-semibold">-{detalhes.gatilhosSelecionados} pts</p>
        </div>
      </div>

      <div className="flex justify-between">
        <Button
          onClick={resetarTermometro}
          variant="destructive"
          className="w-full text-white bg-red-500/70 hover:bg-red-600/70"
        >
          🔄 Resetar Termômetro
        </Button>
      </div>
    </Card>
  );
};

export default TermometroDaRecuperacao;
