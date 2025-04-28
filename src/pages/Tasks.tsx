
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
      <div className="min-h-screen bg-gradient-to-br from-purple-500 to-indigo-600 p-6">
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
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-indigo-600 p-6">
      <BackButton />
      
      <div className="max-w-md mx-auto space-y-6">
        <div className="text-white space-y-2">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Tarefas Diárias</h1>
            <div className="flex items-center gap-2">
              <CalendarDays className="w-5 h-5" />
              <span>{format(new Date(), 'dd/MM/yyyy')}</span>
            </div>
          </div>
          
          <div className="bg-white/10 rounded-lg p-3 flex justify-between items-center">
            <span>Pontos de hoje</span>
            <span className="font-bold">{totalPoints}</span>
          </div>
        </div>

        <div className="grid gap-4">
          {TaskCategories.map((category) => {
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
              <Card 
                key={category.id} 
                className={`p-4 space-y-2 ${categoryCompleted ? 'bg-green-50/10' : ''}`}
              >
                <div 
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => toggleCategoryExpansion(category.id)}
                >
                  <div className="flex items-center gap-3">
                    <category.icon className={`w-6 h-6 ${category.color}`} />
                    <h2 className="font-semibold text-white">{category.title}</h2>
                    {categoryCompleted && (
                      <Smile className="w-5 h-5 text-green-500" />
                    )}
                  </div>
                  <div>
                    {expandedCategories.includes(category.id) ? '▼' : '▶'}
                  </div>
                </div>

                {expandedCategories.includes(category.id) && (
                  <div className="space-y-2">
                    {categoryTasks.map((task) => {
                      const completed = isTaskCompleted(task.id);
                      return (
                        <div 
                          key={task.id} 
                          className="flex items-start gap-3 p-2 bg-white/5 rounded"
                        >
                          <Checkbox
                            checked={completed}
                            onCheckedChange={() => !completed && completeTask.mutate(task.id)}
                            className="mt-1"
                          />
                          <div>
                            <h3 className={`text-sm ${completed ? 'line-through text-gray-500' : 'text-white'}`}>
                              {task.name}
                            </h3>
                            <p className="text-xs text-gray-400">{task.description}</p>
                          </div>
                          {completed && (
                            <Check className="w-4 h-4 ml-auto text-green-500" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        {showCelebration && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50" onClick={() => setShowCelebration(false)}>
            <div className="bg-white rounded-lg p-6 text-center space-y-4 max-w-sm mx-4">
              <Smile className="w-16 h-16 mx-auto text-yellow-400" />
              <h2 className="text-2xl font-bold">Parabéns!</h2>
              <p className="text-gray-600">
                Você completou todas as tarefas de hoje! Continue assim, você está fazendo um ótimo trabalho no seu processo de recuperação.
              </p>
              <Button onClick={() => setShowCelebration(false)}>Continuar</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tasks;
