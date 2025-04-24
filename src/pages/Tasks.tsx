
import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Check, CalendarDays } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from '@/components/ui/sonner';
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

  const { data: tasks, isLoading: tasksLoading } = useQuery({
    queryKey: ['daily-tasks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('daily_tasks')
        .select('*');
      
      if (error) {
        console.error("Error fetching tasks:", error);
        throw error;
      }
      return data as Task[];
    },
  });

  const { data: completions, isLoading: completionsLoading } = useQuery({
    queryKey: ['task-completions'],
    queryFn: async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { data, error } = await supabase
        .from('user_task_completions')
        .select('*')
        .gte('completed_at', today.toISOString())
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id);
      
      if (error) {
        console.error("Error fetching completions:", error);
        throw error;
      }
      return data as TaskCompletion[];
    },
  });

  const completeTask = useMutation({
    mutationFn: async (taskId: string) => {
      const userId = (await supabase.auth.getUser()).data.user?.id;
      const { error } = await supabase
        .from('user_task_completions')
        .insert({ 
          task_id: taskId, 
          user_id: userId
        });
      
      if (error) throw error;
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['task-completions'] });
      toast("Tarefa concluída! Continue assim!");
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

  if (tasksLoading || completionsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-600 to-teal-900 p-6">
        <div className="max-w-md mx-auto">
          <div className="text-white text-center">Carregando tarefas...</div>
        </div>
      </div>
    );
  }

  if (!tasks) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-600 to-teal-900 p-6">
      <div className="max-w-md mx-auto space-y-6">
        <div className="flex items-center justify-between text-white">
          <h1 className="text-2xl font-bold">Tarefas Diárias</h1>
          <div className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5" />
            <span>{format(new Date(), 'dd/MM/yyyy')}</span>
          </div>
        </div>

        <div className="grid gap-4">
          {tasks.map((task) => (
            <Card key={task.id} className="p-4 relative overflow-hidden">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-semibold">{task.name}</h3>
                  <p className="text-sm text-gray-500">{task.description}</p>
                  <div className="mt-2 text-xs text-blue-600 font-medium">
                    +{task.points} pontos
                  </div>
                </div>
                <Button
                  variant={isTaskCompleted(task.id) ? "secondary" : "default"}
                  size="sm"
                  onClick={() => completeTask.mutate(task.id)}
                  disabled={isTaskCompleted(task.id)}
                >
                  <Check className="w-4 h-4" />
                </Button>
              </div>
              {isTaskCompleted(task.id) && (
                <div className="absolute inset-0 bg-green-50/10 pointer-events-none" />
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Tasks;
