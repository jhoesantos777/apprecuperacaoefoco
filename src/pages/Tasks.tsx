import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Check, CalendarDays, Smile, Brain, HandHeart, Dumbbell, MessageCircle, Wrench, Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from '@/components/ui/sonner';
import { Checkbox } from '@/components/ui/checkbox';
import { BackButton } from '@/components/BackButton';
import { registerActivity } from '@/utils/activityPoints';
import { motion, AnimatePresence } from 'framer-motion';
import type { Database } from '@/integrations/supabase/types';

interface Task {
  id: string;
  name: string;
  description: string;
  points: number;
}

interface TaskCompletion {
  task_id: string;
  completed_at: string;
}

const TaskCategories = [
  { 
    id: 'mental', 
    title: '🧠 Cuidado Mental', 
    icon: Brain,
    color: 'text-blue-500'
  },
  { 
    id: 'spirituality', 
    title: '🙏 Espiritualidade', 
    icon: HandHeart,
    color: 'text-purple-500'
  },
  { 
    id: 'health', 
    title: '🧘 Corpo e Saúde', 
    icon: Dumbbell,
    color: 'text-green-500'
  },
  { 
    id: 'relationships', 
    title: '💬 Relacionamentos e Conexão', 
    icon: MessageCircle,
    color: 'text-pink-500'
  },
  { 
    id: 'recovery', 
    title: '🛠️ Recuperação Ativa', 
    icon: Wrench,
    color: 'text-orange-500'
  },
  { 
    id: 'extras', 
    title: '🧩 Extras Opcionais', 
    icon: Star,
    color: 'text-yellow-500'
  }
];

const Tasks = () => {
  const queryClient = useQueryClient();
  const [showCelebration, setShowCelebration] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  const { data: tasks, isLoading: tasksLoading } = useQuery({
    queryKey: ['daily-tasks'],
    queryFn: async () => {
      const { data: tasks, error } = await supabase
        .from('daily_tasks')
        .select('*') as { data: Task[] | null; error: Error | null };
      
      if (error) {
        console.error("Error fetching tasks:", error);
        throw error;
      }
      return tasks || [];
    },
  });

  const { data: completions, isLoading: completionsLoading } = useQuery({
    queryKey: ['task-completions'],
    queryFn: async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { data: completions, error } = await supabase
        .from('user_task_completions')
        .select('*')
        .gte('completed_at', today.toISOString())
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id) as { data: TaskCompletion[] | null; error: Error | null };
      
      if (error) {
        console.error("Error fetching completions:", error);
        throw error;
      }
      return completions || [];
    },
  });

  const completeTask = useMutation({
    mutationFn: async (taskId: string) => {
      try {
        const userId = (await supabase.auth.getUser()).data.user?.id;
        if (!userId) throw new Error("User not authenticated");
        
        // Encontrar a tarefa para obter os pontos
        const task = tasks?.find(t => t.id === taskId);
        if (!task) throw new Error("Task not found");
        
        // Registrar na tabela de completions (manter a funcionalidade original)
        const { error } = await supabase
          .from('user_task_completions')
          .insert({ 
            task_id: taskId, 
            user_id: userId
          });
        
        if (error) throw error;
        
        // Registrar também como atividade para o termômetro
        await registerActivity(
          'Tarefas', 
          task.points, 
          `Tarefa: ${task.name}`
        );
        
        // Invalidar consultas
        await queryClient.invalidateQueries({ queryKey: ['recovery-score'] });
        
        return { success: true };
      } catch (error) {
        console.error("Error completing task:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['task-completions'] });
      checkAllTasksCompleted();
    },
    onError: (error) => {
      console.error("Error completing task:", error);
      toast("Você já completou esta tarefa hoje!", {
        description: "Volte amanhã para completá-la novamente."
      });
    }
  });

  const isTaskCompleted = (taskId: string) => {
    return completions?.some(completion => completion.task_id === taskId);
  };

  const checkAllTasksCompleted = () => {
    if (!tasks || !completions) return;
    
    const allCompleted = tasks.every(task => isTaskCompleted(task.id));
    if (allCompleted) {
      setShowCelebration(true);
      toast("Parabéns! 🎉", {
        description: "Você completou todas as tarefas de hoje! Continue assim, você está no caminho certo!",
      });
    }
  };

  const toggleCategoryExpansion = (categoryId: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId) 
        : [...prev, categoryId]
    );
  };

  if (tasksLoading || completionsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6">
        <BackButton />
        <div className="max-w-md mx-auto">
          <div className="text-white text-center">Carregando tarefas...</div>
        </div>
      </div>
    );
  }

  if (!tasks) return null;

  const totalPoints = completions?.reduce((acc, completion) => {
    const task = tasks.find(t => t.id === completion.task_id);
    return acc + (task?.points || 0);
  }, 0) || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6">
      <BackButton />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md mx-auto space-y-6"
      >
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-slate-100 space-y-4"
        >
          <div className="flex items-center justify-between bg-slate-800/80 p-4 rounded-xl backdrop-blur-sm border border-slate-700 shadow-lg">
            <h1 className="text-2xl font-bold text-white">Tarefas Diárias</h1>
            <div className="flex items-center gap-2 bg-slate-700/50 px-3 py-1 rounded-lg">
              <CalendarDays className="w-5 h-5 text-blue-400" />
              <span className="text-slate-200">{format(new Date(), 'dd/MM/yyyy')}</span>
            </div>
          </div>
          
          <motion.div 
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="bg-gradient-to-r from-blue-600/30 to-indigo-600/30 rounded-xl p-4 flex justify-between items-center border border-slate-700 shadow-lg"
          >
            <span className="text-lg font-medium text-slate-200">Pontos de hoje</span>
            <span className="text-2xl font-bold bg-slate-800/80 px-4 py-1 rounded-lg text-blue-400">{totalPoints}</span>
          </motion.div>
        </motion.div>

        <AnimatePresence>
          {TaskCategories.map((category, index) => {
            const categoryTasks = tasks.filter(task => {
              const categoryTitles = {
                'mental': ['Escrevi no diário', 'Meditação guiada', 'Vídeo motivacional', 'Gratidão', 'Leitura inspiradora'],
                'spirituality': ['Oração/Devocional', 'Leitura espiritual', 'Gratidão pela sobriedade', 'Compartilhar fé'],
                'health': ['Autocuidado', 'Alimentação', 'Hidratação', 'Exercício', 'Sono adequado'],
                'relationships': ['Grupo de apoio', 'Reconhecimento', 'Paciência', 'Conexão familiar'],
                'recovery': ['Reunião', 'Análise de gatilho', 'Ficha limpa', 'Compromisso diário', 'Planejamento'],
                'extras': ['Ajuda', 'Orgulho', 'Alegria', 'Motivação']
              };
              return categoryTitles[category.id].includes(task.name);
            });

            const categoryCompleted = categoryTasks.every(task => isTaskCompleted(task.id));

            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Card 
                  className={`p-4 space-y-2 backdrop-blur-sm border border-slate-700 ${
                    categoryCompleted 
                      ? 'bg-gradient-to-r from-emerald-600/20 to-green-600/20' 
                      : 'bg-gradient-to-r from-slate-800/80 to-slate-700/80'
                  }`}
                >
                  <motion.div 
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => toggleCategoryExpansion(category.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${category.color} bg-slate-800/50`}>
                        <category.icon className="w-6 h-6" />
                      </div>
                      <h2 className="font-semibold text-slate-100 text-lg">{category.title}</h2>
                      {categoryCompleted && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 200, damping: 10 }}
                        >
                          <Smile className="w-6 h-6 text-emerald-400" />
                        </motion.div>
                      )}
                    </div>
                    <motion.div
                      animate={{ rotate: expandedCategories.includes(category.id) ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="text-slate-400"
                    >
                      ▼
                    </motion.div>
                  </motion.div>

                  <AnimatePresence>
                    {expandedCategories.includes(category.id) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-2 overflow-hidden"
                      >
                        {categoryTasks.map((task) => {
                          const completed = isTaskCompleted(task.id);
                          return (
                            <motion.div 
                              key={task.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 20 }}
                              className="flex items-start gap-3 p-3 bg-slate-800/50 rounded-lg hover:bg-slate-700/50 transition-colors"
                            >
                              <Checkbox
                                checked={completed}
                                onCheckedChange={() => !completed && completeTask.mutate(task.id)}
                                className="mt-1"
                              />
                              <div className="flex-1">
                                <h3 className={`text-base font-medium ${completed ? 'line-through text-slate-500' : 'text-slate-100'}`}>
                                  {task.name}
                                </h3>
                                <p className="text-sm text-slate-400">{task.description}</p>
                              </div>
                              {completed && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ type: "spring", stiffness: 200, damping: 10 }}
                                >
                                  <Check className="w-5 h-5 text-emerald-400" />
                                </motion.div>
                              )}
                            </motion.div>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {showCelebration && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 flex items-center justify-center bg-slate-900/80 z-50"
            onClick={() => setShowCelebration(false)}
          >
            <motion.div 
              className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-8 text-center space-y-6 max-w-sm mx-4 text-slate-100 shadow-2xl border border-slate-700"
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
              >
                <Smile className="w-20 h-20 mx-auto text-emerald-400" />
              </motion.div>
              <h2 className="text-3xl font-bold text-white">Parabéns! 🎉</h2>
              <p className="text-lg text-slate-300">
                Você completou todas as tarefas de hoje! Continue assim, você está fazendo um ótimo trabalho no seu processo de recuperação.
              </p>
              <Button 
                onClick={() => setShowCelebration(false)}
                className="bg-emerald-500 text-white hover:bg-emerald-600"
              >
                Continuar
              </Button>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Tasks;
