
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Check, CalendarDays, Smile, Brain, HandHeart, Dumbbell, MessageCircle, Wrench, Star, ArrowDown } from 'lucide-react';
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
    color: 'text-blue-500',
    bgColor: 'from-blue-600/20 to-indigo-600/20',
    borderColor: 'border-blue-400/20'
  },
  { 
    id: 'spirituality', 
    title: '🙏 Espiritualidade', 
    icon: HandHeart,
    color: 'text-purple-500',
    bgColor: 'from-purple-600/20 to-indigo-600/20',
    borderColor: 'border-purple-400/20'
  },
  { 
    id: 'health', 
    title: '🧘 Corpo e Saúde', 
    icon: Dumbbell,
    color: 'text-green-500',
    bgColor: 'from-green-600/20 to-teal-600/20',
    borderColor: 'border-green-400/20'
  },
  { 
    id: 'relationships', 
    title: '💬 Relacionamentos e Conexão', 
    icon: MessageCircle,
    color: 'text-pink-500',
    bgColor: 'from-pink-600/20 to-rose-600/20',
    borderColor: 'border-pink-400/20'
  },
  { 
    id: 'recovery', 
    title: '🛠️ Recuperação Ativa', 
    icon: Wrench,
    color: 'text-orange-500',
    bgColor: 'from-orange-600/20 to-amber-600/20',
    borderColor: 'border-orange-400/20'
  },
  { 
    id: 'extras', 
    title: '🧩 Extras Opcionais', 
    icon: Star,
    color: 'text-yellow-500',
    bgColor: 'from-yellow-600/20 to-amber-600/20',
    borderColor: 'border-yellow-400/20'
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
        <div className="max-w-lg mx-auto">
          <div className="text-center mt-12">
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </div>
            <p className="text-white text-lg mt-4 font-medium">Carregando suas tarefas...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!tasks) return null;

  const totalPoints = completions?.reduce((acc, completion) => {
    const task = tasks.find(t => t.id === completion.task_id);
    return acc + (task?.points || 0);
  }, 0) || 0;

  const totalTasks = tasks.length;
  const completedTasks = completions?.length || 0;
  const completionPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 p-4 md:p-6 font-inter">
      <BackButton className="text-white/90 hover:text-white" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md mx-auto space-y-6 pt-4"
      >
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-slate-100 space-y-4"
        >
          <div className="flex items-center justify-between bg-white/10 p-5 rounded-2xl backdrop-blur-md border border-white/20 shadow-lg">
            <h1 className="text-2xl md:text-3xl font-bold text-white font-montserrat">Tarefas Diárias</h1>
            <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-lg border border-white/10">
              <CalendarDays className="w-5 h-5 text-blue-300" />
              <span className="text-slate-200 text-sm md:text-base font-medium">{format(new Date(), 'dd/MM/yyyy')}</span>
            </div>
          </div>
          
          <motion.div 
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="bg-gradient-to-r from-blue-600/30 to-indigo-600/30 rounded-xl p-5 flex flex-col border border-white/20 shadow-lg"
          >
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-medium text-white">Progresso diário</span>
              <span className="text-xl font-bold bg-white/10 px-4 py-1 rounded-lg text-blue-300">{totalPoints} pts</span>
            </div>
            
            <div className="w-full bg-white/10 rounded-full h-3 mb-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-indigo-500 h-3 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
            
            <div className="flex justify-between text-sm text-white/70">
              <span>{completedTasks} de {totalTasks} tarefas</span>
              <span>{Math.round(completionPercentage)}% concluído</span>
            </div>
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
            const categoryProgress = categoryTasks.length > 0
              ? (categoryTasks.filter(task => isTaskCompleted(task.id)).length / categoryTasks.length) * 100
              : 0;

            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Card 
                  className={`p-4 space-y-3 backdrop-blur-md border ${category.borderColor} shadow-lg ${
                    categoryCompleted 
                      ? 'bg-gradient-to-r from-emerald-600/20 to-green-600/20 border-emerald-400/30' 
                      : `bg-gradient-to-r ${category.bgColor}`
                  }`}
                >
                  <motion.div 
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => toggleCategoryExpansion(category.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-xl ${category.color} bg-white/10 border border-white/10`}>
                        <category.icon className="w-5 h-5" />
                      </div>
                      <h2 className="font-semibold text-white text-lg font-montserrat">{category.title}</h2>
                      {categoryCompleted && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 200, damping: 10 }}
                        >
                          <Smile className="w-5 h-5 text-emerald-300" />
                        </motion.div>
                      )}
                    </div>
                    <motion.div
                      animate={{ rotate: expandedCategories.includes(category.id) ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="bg-white/10 rounded-full p-1.5"
                    >
                      <ArrowDown className="w-4 h-4 text-white/80" />
                    </motion.div>
                  </motion.div>
                  
                  {/* Progress bar */}
                  <div className="w-full bg-white/10 rounded-full h-1.5">
                    <div 
                      className={`h-1.5 rounded-full transition-all duration-500 ease-out ${
                        categoryCompleted ? 'bg-emerald-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${categoryProgress}%` }}
                    ></div>
                  </div>

                  <AnimatePresence>
                    {expandedCategories.includes(category.id) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-2.5 overflow-hidden pt-2"
                      >
                        {categoryTasks.map((task) => {
                          const completed = isTaskCompleted(task.id);
                          return (
                            <motion.div 
                              key={task.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 20 }}
                              className="flex items-start gap-3 p-3 bg-white/10 rounded-xl hover:bg-white/15 transition-colors border border-white/10"
                            >
                              <Checkbox
                                checked={completed}
                                onCheckedChange={() => !completed && completeTask.mutate(task.id)}
                                className={`mt-1 ${completed ? 'bg-emerald-500 border-emerald-500' : 'border-white/30'}`}
                              />
                              <div className="flex-1">
                                <h3 className={`text-base font-medium ${completed ? 'line-through text-white/50' : 'text-white'}`}>
                                  {task.name}
                                </h3>
                                <p className={`text-sm ${completed ? 'text-white/40' : 'text-white/70'}`}>{task.description}</p>
                              </div>
                              {completed && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ type: "spring", stiffness: 200, damping: 10 }}
                                  className="bg-emerald-500/20 rounded-full p-1"
                                >
                                  <Check className="w-4 h-4 text-emerald-300" />
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
            className="fixed inset-0 flex items-center justify-center bg-slate-900/90 backdrop-blur-sm z-50"
            onClick={() => setShowCelebration(false)}
          >
            <motion.div 
              className="bg-gradient-to-br from-indigo-800/90 to-purple-900/90 rounded-2xl p-8 text-center space-y-6 max-w-sm mx-4 text-white shadow-2xl border border-white/20"
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
                className="bg-gradient-to-br from-emerald-400/30 to-emerald-600/30 p-4 rounded-full w-24 h-24 mx-auto border border-emerald-400/30"
              >
                <Smile className="w-16 h-16 mx-auto text-emerald-300" />
              </motion.div>
              <h2 className="text-3xl font-bold text-white font-montserrat">Parabéns! 🎉</h2>
              <p className="text-lg text-white/90">
                Você completou todas as tarefas de hoje! Continue assim, você está fazendo um ótimo trabalho no seu processo de recuperação.
              </p>
              <Button 
                onClick={() => setShowCelebration(false)}
                className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:opacity-90 border-none px-8 py-6 text-lg font-semibold rounded-xl w-full"
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
