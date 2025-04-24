
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { CalendarDays, Edit2, Save } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const Sobriety = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [motivationNote, setMotivationNote] = useState("");

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
        
      if (profile?.motivation_note) {
        setMotivationNote(profile.motivation_note);
      }
      return profile;
    },
  });

  const updateProfile = useMutation({
    mutationFn: async (updates: { sobriety_start_date?: string; motivation_note?: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast({
        title: "Sucesso!",
        description: "Suas informações foram atualizadas.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar suas informações.",
        variant: "destructive",
      });
      console.error('Error updating profile:', error);
    },
  });

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      updateProfile.mutate({ sobriety_start_date: date.toISOString() });
    }
  };

  const handleSaveNote = () => {
    updateProfile.mutate({ motivation_note: motivationNote });
    setIsEditingNote(false);
  };

  const motivationalPhrases = [
    "Você está vencendo um dia de cada vez!",
    "Cada dia limpo é uma vitória!",
    "Sua força é maior que qualquer desafio!",
  ];

  const randomPhrase = motivationalPhrases[Math.floor(Math.random() * motivationalPhrases.length)];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-600 to-teal-900 p-6">
      <div className="max-w-md mx-auto space-y-8">
        {/* Dias em Sobriedade */}
        <div className="bg-white/10 rounded-lg p-6 text-center text-white backdrop-blur-sm">
          <div className="flex items-center justify-center mb-4">
            <CalendarDays className="w-8 h-8 text-yellow-300" />
          </div>
          <h1 className="text-5xl font-bold mb-2">
            {profile?.dias_sobriedade || 0}
          </h1>
          <p className="text-xl mb-4">Dias em Sobriedade</p>
          <p className="text-white/80 italic">{randomPhrase}</p>
        </div>

        {/* Data de Início */}
        <div className="bg-white/10 rounded-lg p-6 text-white backdrop-blur-sm">
          <h2 className="text-lg font-semibold mb-4">Data de Início</h2>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                {profile?.sobriety_start_date ? (
                  format(new Date(profile.sobriety_start_date), "dd/MM/yyyy")
                ) : (
                  "Escolher data"
                )}
                <CalendarDays className="ml-2 h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={profile?.sobriety_start_date ? new Date(profile.sobriety_start_date) : undefined}
                onSelect={handleDateSelect}
                disabled={(date) => date > new Date()}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Nota de Motivação */}
        <div className="bg-white/10 rounded-lg p-6 text-white backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Nota de Motivação</h2>
            {!isEditingNote ? (
              <Button variant="ghost" size="sm" onClick={() => setIsEditingNote(true)}>
                <Edit2 className="h-4 w-4" />
              </Button>
            ) : (
              <Button variant="ghost" size="sm" onClick={handleSaveNote}>
                <Save className="h-4 w-4" />
              </Button>
            )}
          </div>
          {isEditingNote ? (
            <Textarea
              value={motivationNote}
              onChange={(e) => setMotivationNote(e.target.value)}
              placeholder="Escreva aqui sua motivação..."
              className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
            />
          ) : (
            <p className="text-white/80 italic">
              {profile?.motivation_note || "Adicione uma nota de motivação..."}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sobriety;
