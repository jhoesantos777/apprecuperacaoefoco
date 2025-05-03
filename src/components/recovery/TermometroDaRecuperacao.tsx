import React, { useEffect, useState } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format, startOfDay, subDays } from 'date-fns';
import { toast } from '@/components/ui/sonner';
import { Thermometer, AlertCircle, Heart, BookOpen, Users, Calendar, HelpCircle, Cross } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const atividadesRecuperacao = [
  {
    categoria: "Diário",
    atividades: [
      { titulo: "Escrevi no diário", descricao: "Registrei meus pensamentos no diário de recuperação" },
      { titulo: "Meditação guiada", descricao: "Fiz uma sessão de meditação guiada" },
      { titulo: "Vídeo motivacional", descricao: "Assisti a um vídeo motivacional" },
      { titulo: "Gratidão", descricao: "Pratiquei a gratidão listando 3 coisas boas do dia" },
      { titulo: "Leitura inspiradora", descricao: "Li um trecho de um livro inspirador" }
    ]
  },
  {
    categoria: "Oração/Devocional",
    atividades: [
      { titulo: "Oração/Devocional", descricao: "Fiz minha oração ou devocional diário" },
      { titulo: "Leitura espiritual", descricao: "Li um trecho da Bíblia ou texto espiritual" },
      { titulo: "Gratidão pela sobriedade", descricao: "Agradeci a Deus por mais um dia sóbrio" },
      { titulo: "Compartilhar fé", descricao: "Compartilhei uma palavra de fé com alguém" }
    ]
  },
  {
    categoria: "Autocuidado",
    atividades: [
      { titulo: "Autocuidado", descricao: "Tomei banho e cuidei da minha aparência" },
      { titulo: "Alimentação", descricao: "Me alimentei bem nas principais refeições" },
      { titulo: "Hidratação", descricao: "Bebi pelo menos 2L de água" },
      { titulo: "Exercício", descricao: "Fiz uma caminhada ou alongamento" },
      { titulo: "Sono adequado", descricao: "Dormi pelo menos 7 horas" }
    ]
  },
  {
    categoria: "Grupo de apoio",
    atividades: [
      { titulo: "Grupo de apoio", descricao: "Conversei com alguém do meu grupo de apoio" },
      { titulo: "Reconhecimento", descricao: "Agradeci ou pedi desculpas a alguém" },
      { titulo: "Paciência", descricao: "Evitei discussões e pratiquei a paciência" },
      { titulo: "Conexão familiar", descricao: "Abracei ou falei com alguém da família" }
    ]
  },
  {
    categoria: "Reunião",
    atividades: [
      { titulo: "Reunião", descricao: "Participei de um grupo de apoio ou reunião" },
      { titulo: "Análise de gatilho", descricao: "Escrevi sobre um gatilho e como lidei com ele" },
      { titulo: "Ficha limpa", descricao: "Marquei minha 'ficha limpa' de hoje" },
      { titulo: "Compromisso diário", descricao: "Lembrei que 'hoje eu não vou usar'" },
      { titulo: "Planejamento", descricao: "Planejei meu dia de amanhã" }
    ]
  },
  {
    categoria: "Ajuda",
    atividades: [
      { titulo: "Ajuda", descricao: "Ajudei alguém hoje" },
      { titulo: "Orgulho", descricao: "Fiz algo que me deu orgulho" },
      { titulo: "Alegria", descricao: "Ri de algo hoje" },
      { titulo: "Motivação", descricao: "Relembrei por que estou lutando" }
    ]
  }
];

const AtividadesRecuperacao = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categoryIcons = {
    "Diário": BookOpen,
    "Oração/Devocional": Cross,
    "Autocuidado": Heart,
    "Grupo de apoio": Users,
    "Reunião": Calendar,
    "Ajuda": HelpCircle
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {atividadesRecuperacao.map((categoria, index) => {
            const Icon = categoryIcons[categoria.categoria as keyof typeof categoryIcons];
            return (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedCategory(selectedCategory === categoria.categoria ? null : categoria.categoria)}
                className="cursor-pointer"
              >
                <Card className="p-6 bg-white/10 backdrop-blur-lg border border-white/20 hover:bg-white/20 transition-all duration-300">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-white/20">
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">{categoria.categoria}</h3>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <AnimatePresence>
          {selectedCategory && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
            >
              <h2 className="text-3xl font-bold text-white mb-6">
                {selectedCategory}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {atividadesRecuperacao
                  .find(cat => cat.categoria === selectedCategory)
                  ?.atividades.map((atividade, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="bg-white/5 p-4 rounded-lg border border-white/10 hover:bg-white/10 transition-all duration-300"
                    >
                      <h4 className="text-xl font-bold text-white mb-2">{atividade.titulo}</h4>
                      <p className="text-white/90">{atividade.descricao}</p>
                    </motion.div>
                  ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

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
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-4xl mx-auto p-6"
      >
        <Card className="p-8 bg-white/10 backdrop-blur-lg border border-white/20">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center mb-8"
          >
            <h2 className="text-3xl font-bold text-white mb-2">🧘 A SOBRIEDADE É UMA CONQUISTA DIÁRIA</h2>
            <p className="text-xl text-white/90">Seu Termômetro de Recuperação</p>
          </motion.div>

      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="w-64 h-64 mx-auto mb-8"
      >
        <CircularProgressbar
          value={pontuacao}
          text={`${pontuacao}%`}
          circleRatio={0.75}
          styles={buildStyles({
            rotation: 1 / 2 + 1 / 8,
            strokeLinecap: 'round',
                textSize: '24px',
            pathTransitionDuration: 1,
            pathColor: getCor(pontuacao),
            textColor: '#ffffff',
            trailColor: 'rgba(255, 255, 255, 0.2)',
          })}
        />
      </motion.div>

          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center p-6 rounded-xl bg-white/10 backdrop-blur-sm mb-8"
          >
        {pontuacao < 40 && (
              <div className="flex items-center justify-center gap-3 text-white">
                <AlertCircle className="h-8 w-8" />
                <p className="text-2xl font-bold">Atenção especial necessária</p>
          </div>
        )}
        {pontuacao >= 40 && pontuacao < 70 && (
              <div className="flex items-center justify-center gap-3 text-white">
                <Thermometer className="h-8 w-8" />
                <p className="text-2xl font-bold">Progresso em desenvolvimento</p>
          </div>
        )}
        {pontuacao >= 70 && (
              <div className="flex items-center justify-center gap-3 text-white">
                <Heart className="h-8 w-8" />
                <p className="text-2xl font-bold">Excelente progresso na jornada</p>
          </div>
        )}
            <p className="mt-4 text-xl text-white font-medium italic">{getTerapeuticMessage(pontuacao)}</p>
          </motion.div>

          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white/5 backdrop-blur-sm rounded-xl p-6 mb-8"
          >
            <h3 className="text-2xl font-bold text-white text-center md:col-span-2 mb-4">Detalhes da sua Pontuação</h3>
            {Object.entries(detalhes).map(([key, value], index) => (
              <motion.div
                key={key}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className="flex justify-between items-center text-white p-3 rounded-lg bg-white/5"
              >
                <p className="text-lg font-bold">{key}:</p>
                <p className="text-lg font-bold">{value} pts</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1 }}
            className="flex justify-center"
          >
        <Button
          onClick={resetarTermometro}
          variant="destructive"
              className="w-full max-w-md text-lg font-bold text-white bg-red-500/70 hover:bg-red-600/70 transition-all duration-300"
        >
          🔄 Resetar Termômetro
        </Button>
          </motion.div>
        </Card>
      </motion.div>
      </div>
  );
};

export default TermometroDaRecuperacao;
