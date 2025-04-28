
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { registerActivity } from "@/utils/activityPoints";
import { Book } from "lucide-react";

interface DevotionalNotesProps {
  currentNotes?: string;
}

export const DevotionalNotes = ({ currentNotes }: DevotionalNotesProps) => {
  const [notes, setNotes] = useState(currentNotes || '');
  const queryClient = useQueryClient();

  const saveMutation = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { error } = await supabase
        .from('devotional_notes')
        .upsert({
          user_id: user.id,
          notes,
          verse_date: new Date().toISOString()
        });

      if (error) throw error;

      // Register activity for recovery thermometer
      await registerActivity('Devocional', 2, 'Devocional diário concluído');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['devotional-notes'] });
      queryClient.invalidateQueries({ queryKey: ['recovery-score'] });
      toast("Anotações salvas!", {
        description: "Suas reflexões foram salvas com sucesso. (+2 pontos)",
      });
    },
    onError: (error) => {
      toast("Erro ao salvar", {
        description: "Não foi possível salvar suas anotações.",
        variant: "destructive",
      });
      console.error('Error saving devotional notes:', error);
    },
  });

  const handleSave = () => {
    saveMutation.mutate();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Book className="w-5 h-5 text-purple-500" />
        <h3 className="text-lg font-medium">Minhas Anotações</h3>
      </div>
      
      <Textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Escreva suas reflexões sobre o versículo..."
        className="min-h-[150px]"
      />
      
      <Button 
        onClick={handleSave}
        className="w-full bg-purple-600 hover:bg-purple-700"
        disabled={saveMutation.isPending}
      >
        Finalizar Devocional
      </Button>
    </div>
  );
};
