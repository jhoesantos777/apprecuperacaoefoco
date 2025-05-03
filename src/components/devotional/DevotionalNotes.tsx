import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { registerActivity } from "@/utils/activityPoints";
import { Book, List } from "lucide-react";
import { 
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHead,
  TableRow
} from "@/components/ui/table";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface DevotionalNotesProps {
  currentNotes?: string;
}

export const DevotionalNotes = ({ currentNotes }: DevotionalNotesProps) => {
  const [notes, setNotes] = useState(currentNotes || '');
  const [showHistory, setShowHistory] = useState(false);
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
      queryClient.invalidateQueries({ queryKey: ['devotional-notes-history'] });
      queryClient.invalidateQueries({ queryKey: ['recovery-score'] });
      toast("Anotações salvas!", {
        description: "Suas reflexões foram salvas com sucesso. (+2 pontos)",
      });
    },
    onError: (error) => {
      toast("Erro ao salvar", {
        description: "Não foi possível salvar suas anotações.",
      });
      console.error('Error saving devotional notes:', error);
    },
  });

  const { data: notesHistory, isLoading: isLoadingHistory } = useQuery({
    queryKey: ['devotional-notes-history'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('devotional_notes')
        .select('notes, verse_date')
        .eq('user_id', user.id)
        .order('verse_date', { ascending: false });

      if (error) {
        console.error('Error fetching devotional notes history:', error);
        return [];
      }

      return data;
    },
    enabled: showHistory
  });

  const handleSave = () => {
    saveMutation.mutate();
  };

  if (showHistory) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <List className="w-5 h-5 text-purple-500" />
            <h3 className="text-lg font-medium">Histórico de Anotações</h3>
          </div>
          <Button 
            variant="outline" 
            onClick={() => setShowHistory(false)}
            className="text-sm"
          >
            Voltar
          </Button>
        </div>
        
        {isLoadingHistory ? (
          <div className="text-center py-4">Carregando...</div>
        ) : notesHistory && notesHistory.length > 0 ? (
          <div className="overflow-auto max-h-[60vh]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Anotações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {notesHistory.map((note, index) => (
                  <TableRow key={index}>
                    <TableCell className="whitespace-nowrap">
                      {format(new Date(note.verse_date), "dd/MM/yyyy", { locale: ptBR })}
                    </TableCell>
                    <TableCell className="max-w-md break-words">{note.notes}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-4 text-gray-500">
            Nenhuma anotação encontrada.
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Book className="w-5 h-5 text-purple-700" />
        <h3 className="text-lg font-medium text-gray-900">Minhas Anotações</h3>
      </div>
      
      <Textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Escreva suas reflexões sobre o versículo..."
        className="min-h-[150px] text-gray-900 placeholder-gray-500"
      />
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Button 
          onClick={handleSave}
          className="w-full bg-purple-700 hover:bg-purple-800 text-white font-medium"
          disabled={saveMutation.isPending}
        >
          Finalizar Devocional
        </Button>
        
        <Button
          onClick={() => setShowHistory(true)}
          className="w-full bg-blue-700 hover:bg-blue-800 text-white font-medium"
        >
          Ver Minhas Anotações
        </Button>
      </div>
    </div>
  );
};
