
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Check, CalendarDays, Smile } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from '@/components/ui/sonner';
import { Checkbox } from '@/components/ui/checkbox';
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

const Tasks = () => {
  const queryClient = useQueryClient();
  const [showCelebration, setShowCelebration] = useState(false);

  const { data: tasks, isLoading: tasksLoading } = useQuery({
    queryKey: ['daily-tasks'],
    queryFn: async () => {
      const { data: tasks, error } = await supabase
        .from('daily_tasks' as any)
        .select('*') as unknown as { 
          data: Task[] | null; 
          error: Error | null 
        };
      
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
        .from('user_task_completions' as any)
        .select('*')
        .gte('completed_at', today.toISOString())
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id) as unknown as {
          data: TaskCompletion[] | null; 
          error: Error | null 
        };
      
      if (error) {
        console.error("Error fetching completions:", error);
        throw error;
      }
      return completions || [];
    },
  });

  const completeTask = useMutation({
    mutationFn: async (taskId: string) => {
      const userId = (await supabase.auth.getUser()).data.user?.id;
      const { error } = await supabase
        .from('user_task_completions' as any)
        .insert({ 
          task_id: taskId, 
          user_id: userId
        }) as unknown as { error: Error | null };
      
      if (error) throw error;
      return { success: true };
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

  if (tasksLoading || completionsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-500 to-indigo-600 p-6">
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
          {tasks.map((task) => {
            const completed = isTaskCompleted(task.id);
            return (
              <Card 
                key={task.id} 
                className={`p-4 relative overflow-hidden transition-all duration-300 ${
                  completed ? 'bg-opacity-90 border-green-200' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  <Checkbox
                    checked={completed}
                    onCheckedChange={() => !completed && completeTask.mutate(task.id)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">{task.name}</h3>
                    <p className="text-sm text-gray-500">{task.description}</p>
                    <div className="mt-2 text-xs text-purple-600 font-medium">
                      +{task.points} pontos
                    </div>
                  </div>
                  {completed && (
                    <Smile className="w-5 h-5 text-green-500" />
                  )}
                </div>
                {completed && (
                  <div className="absolute inset-0 bg-green-50/10 pointer-events-none" />
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
