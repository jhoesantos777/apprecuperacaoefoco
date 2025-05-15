
import React from 'react';
import { RotateCcw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';
import { useQueryClient } from '@tanstack/react-query';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export const ResetButton = () => {
  const queryClient = useQueryClient();

  const handleReset = async () => {
    try {
      const { error } = await supabase
        .from('atividades_usuario')
        .delete()
        .gte('data_registro', new Date(new Date().setDate(new Date().getDate() - 7)).toISOString());

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ['recovery-score'] });
      
      toast("Termômetro resetado com sucesso! Todas as atividades dos últimos 7 dias foram removidas");
    } catch (error) {
      console.error('Error resetting activities:', error);
      toast("Erro ao resetar o termômetro. Tente novamente mais tarde");
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <RotateCcw className="mr-2 h-4 w-4" />
          Resetar Termômetro
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta ação vai remover todas as atividades dos últimos 7 dias, incluindo gatilhos, tarefas e outras ações que afetam o termômetro. Esta ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleReset}>
            Resetar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
