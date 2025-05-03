import React, { useState, useEffect } from 'react';
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
  completed: boolean;
  category_id: string;
}

interface TaskCompletion {
  task_id: string;
  completed_at: string;
}

const TaskCategories = [
  { 
    id: 'mental', 
    title: 'Cuidado Mental',
    emoji: '🧠',
    icon: Brain,
    color: 'text-blue-500',
    bgColor: 'from-blue-600/10 to-indigo-600/10',
    borderColor: 'border-blue-400/20',
    cardBg: 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20'
  },
  { 
    id: 'spirituality', 
    title: 'Espiritualidade',
    emoji: '🙏',
    icon: HandHeart,
    color: 'text-purple-500',
    bgColor: 'from-purple-600/10 to-indigo-600/10',
    borderColor: 'border-purple-400/20',
    cardBg: 'bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20'
  },
  { 
    id: 'health', 
    title: 'Corpo e Saúde',
    emoji: '🧘',
    icon: Dumbbell,
    color: 'text-green-500',
    bgColor: 'from-green-600/10 to-teal-600/10',
    borderColor: 'border-green-400/20',
    cardBg: 'bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20'
  },
  { 
    id: 'relationships', 
    title: 'Relacionamentos e Conexão',
    emoji: '💬',
    icon: MessageCircle,
    color: 'text-pink-500',
    bgColor: 'from-pink-600/10 to-rose-600/10',
    borderColor: 'border-pink-400/20',
    cardBg: 'bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20'
  },
  { 
    id: 'recovery', 
    title: 'Recuperação Ativa',
    emoji: '🛠️',
    icon: Wrench,
    color: 'text-orange-500',
    bgColor: 'from-orange-600/10 to-amber-600/10',
    borderColor: 'border-orange-400/20',
    cardBg: 'bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20'
  },
  { 
    id: 'extras', 
    title: 'Emocionais',
    emoji: '💝',
    icon: Star,
    color: 'text-yellow-500',
    bgColor: 'from-yellow-600/10 to-amber-600/10',
    borderColor: 'border-yellow-400/20',
    cardBg: 'bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20'
  }
];

const Tasks = () => {
  const queryClient = useQueryClient();
  const [showCelebration, setShowCelebration] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
        const { error } = await supabase
          .from('user_task_completions')
        .insert({ task_id: taskId, user_id: (await supabase.auth.getUser()).data.user?.id, completed_at: new Date().toISOString() });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['task-completions'] });
      toast.success('Tarefa completada com sucesso!');
    },
    onError: (error) => {
      toast.error('Erro ao completar tarefa');
      console.error('Erro ao completar tarefa:', error);
    }
  });

  const uncompleteTask = useMutation({
    mutationFn: async (taskId: string) => {
      const { error } = await supabase
        .from('user_task_completions')
        .delete()
        .eq('task_id', taskId)
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id);
        if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['task-completions'] });
      toast.success('Tarefa descompletada com sucesso!');
    },
    onError: (error) => {
      toast.error('Erro ao descompletar tarefa');
      console.error('Erro ao descompletar tarefa:', error);
    }
  });

  const handleTaskComplete = (taskId: string) => {
    completeTask.mutate(taskId);
  };

  const handleTaskUncomplete = (taskId: string) => {
    uncompleteTask.mutate(taskId);
  };

  const isTaskCompleted = (taskId: string) => {
    return completions?.some(completion => completion.task_id === taskId) || false;
  };

  const getTaskPoints = (taskId: string) => {
    const task = tasks?.find(t => t.id === taskId);
    return task?.points || 0;
  };

  const getCategoryPoints = (categoryId: string) => {
    const categoryTasks = tasks?.filter(task => task.category_id === categoryId) || [];
    return categoryTasks.reduce((acc, task) => {
      if (isTaskCompleted(task.id)) {
        return acc + getTaskPoints(task.id);
      }
      return acc;
    }, 0);
  };

  const getCategoryMaxPoints = (categoryId: string) => {
    const categoryTasks = tasks?.filter(task => task.category_id === categoryId) || [];
    return categoryTasks.reduce((acc, task) => acc + getTaskPoints(task.id), 0);
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

  const getProgressColor = (points: number, maxPoints: number) => {
    const percentage = (points / maxPoints) * 100;
    if (percentage >= 80) return 'text-emerald-500';
    if (percentage >= 60) return 'text-blue-500';
    if (percentage >= 40) return 'text-yellow-500';
    if (percentage >= 20) return 'text-orange-500';
    return 'text-red-500';
  };

  const getBarColor = (points: number, maxPoints: number) => {
    const percentage = (points / maxPoints) * 100;
    if (percentage >= 80) return 'bg-emerald-500';
    if (percentage >= 60) return 'bg-blue-500';
    if (percentage >= 40) return 'bg-yellow-500';
    if (percentage >= 20) return 'bg-orange-500';
    return 'bg-red-500';
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (tasksLoading || completionsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 p-6">
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

  const totalPoints = tasks.reduce((acc, task) => {
    if (task.completed) {
      return acc + (task.points || 0);
    }
    return acc;
  }, 0);

  const maxPoints = 30;
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
          <div className="flex items-center justify-between bg-white/15 p-5 rounded-2xl backdrop-blur-md border border-white/20 shadow-lg">
            <h1 className="text-2xl md:text-3xl font-bold text-white font-montserrat">Tarefas Diárias</h1>
            <div className="flex items-center gap-2 bg-white/15 px-3 py-2 rounded-lg border border-white/10">
              <CalendarDays className="w-5 h-5 text-blue-300" />
              <span className="text-slate-200 text-sm md:text-base font-medium">{format(new Date(), 'dd/MM/yyyy')}</span>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h2 className="text-2xl font-bold text-white">Minha Pontuação</h2>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
              <span className={`text-lg font-bold ${getProgressColor(totalPoints, maxPoints)}`}>
                {totalPoints}/{maxPoints} pontos
              </span>
              <div className="w-full sm:w-48 h-3 bg-slate-700 rounded-full overflow-hidden relative">
                <motion.div 
                  className={`h-full transition-all duration-500 ${
                    isLoading ? 'bg-emerald-500 animate-pulse' : getBarColor(totalPoints, maxPoints)
                  }`}
                  initial={{ width: 0 }}
                  animate={{ 
                    width: isLoading ? '100%' : `${(totalPoints / maxPoints) * 100}%`
                  }}
                  transition={{ 
                    duration: isLoading ? 1.2 : 0.5,
                    ease: "easeInOut"
                  }}
                />
                {isLoading && (
                  <motion.div 
                    className="absolute inset-0 bg-emerald-400 opacity-50"
                    animate={{
                      x: ['-100%', '100%'],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Tasks; 