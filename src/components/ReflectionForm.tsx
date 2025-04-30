
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Save, HelpCircle, List } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { registerActivity } from "@/utils/activityPoints";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHead,
  TableRow
} from "@/components/ui/table";
import { getTodaysMotivation } from '@/data/dailyMotivations';

const GUIDING_QUESTIONS = [
  "O que me fez bem hoje?",
  "Com o que eu aprendi?",
  "Que vitórias celebrei?",
  "Como me senti ao longo do dia?",
  "O que me ajudou a manter minha sobriedade?",
  "O que posso fazer melhor amanhã?"
];

export const ReflectionForm = () => {
  const [reflection, setReflection] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const todaysMotivation = getTodaysMotivation();

  const { data: reflectionHistory, isLoading: isLoadingHistory } = useQuery({
    queryKey: ['reflection-history'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('reflections')
        .select('content, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching reflections:', error);
        return [];
      }

      return data;
    },
    enabled: showHistory
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { error } = await supabase
        .from('reflections')
        .insert({
          user_id: user.id,
          content: reflection,
          created_at: new Date().toISOString()
        });

      if (error) throw error;

      // Register activity for recovery thermometer
      await registerActivity('Reflexão', 3, 'Reflexão diária concluída');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reflection-history'] });
      queryClient.invalidateQueries({ queryKey: ['recovery-score'] });
      toast({
        title: "Reflexão salva!",
        description: "Sua reflexão do dia foi salva com sucesso. (+3 pontos)",
      });
      setReflection('');
    },
    onError: (error) => {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar sua reflexão.",
        variant: "destructive"
      });
      console.error('Error saving reflection:', error);
    },
  });

  const handleSave = () => {
    if (!reflection.trim()) {
      toast({
        title: "Campo vazio",
        description: "Por favor, escreva sua reflexão antes de salvar.",
        variant: "destructive"
      });
      return;
    }

    saveMutation.mutate();
  };

  if (showHistory) {
    return (
      <Card className="bg-white/95 shadow-lg border-none">
        <CardContent className="p-6">
          <div className="flex items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-2">
              <List className="w-5 h-5 text-rose-500" />
              <h3 className="text-lg font-medium">Histórico de Reflexões</h3>
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
          ) : reflectionHistory && reflectionHistory.length > 0 ? (
            <div className="overflow-auto max-h-[60vh]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Reflexão</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reflectionHistory.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="whitespace-nowrap">
                        {format(new Date(item.created_at), "dd/MM/yyyy", { locale: ptBR })}
                      </TableCell>
                      <TableCell className="max-w-md break-words">{item.content}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              Nenhuma reflexão encontrada.
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/95 shadow-lg border-none">
      <CardContent className="p-6">
        <div className="mb-6">
          <div className="border-l-4 border-rose-400 pl-4 mb-4">
            <h3 className="font-serif text-xl text-gray-700 mb-1">{todaysMotivation.phrase}</h3>
            <p className="text-gray-600 text-sm italic">{todaysMotivation.reflection}</p>
          </div>
          
          <div className="flex items-center gap-2 mb-3">
            <HelpCircle className="h-5 w-5 text-rose-400" />
            <h3 className="font-serif text-lg text-gray-700">Perguntas para reflexão:</h3>
          </div>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {GUIDING_QUESTIONS.map((question, index) => (
              <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                <span className="text-rose-400">•</span>
                {question}
              </li>
            ))}
          </ul>
        </div>
        
        <Textarea
          placeholder="Escreva aqui sua reflexão do dia..."
          className="min-h-[200px] mb-4 text-gray-700 bg-gray-50/50 border-gray-200 focus:border-rose-200 focus:ring-rose-200"
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
        />
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Button 
            onClick={handleSave}
            className="w-full bg-gradient-to-r from-rose-400 to-rose-500 hover:from-rose-500 hover:to-rose-600 transition-all duration-300"
            disabled={saveMutation.isPending}
          >
            <Save className="h-4 w-4 mr-2" />
            Salvar Reflexão
          </Button>
          
          <Button
            onClick={() => setShowHistory(true)}
            variant="outline"
            className="w-full border-rose-200 text-rose-600 hover:bg-rose-50"
          >
            <List className="h-4 w-4 mr-2" />
            Ver Histórico
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
