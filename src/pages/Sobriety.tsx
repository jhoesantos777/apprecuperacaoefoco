
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { SobrietyCounter } from "@/components/sobriety/SobrietyCounter";
import { SobrietyDatePicker } from "@/components/sobriety/SobrietyDatePicker";
import { SobrietyMedals } from "@/components/sobriety/SobrietyMedals";
import { MotivationNote } from "@/components/sobriety/MotivationNote";

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

  const { data: medals } = useQuery({
    queryKey: ['sobriety-medals'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');
      
      const { data: medals } = await supabase
        .from('sobriety_medals')
        .select('*')
        .eq('user_id', user.id)
        .order('days_milestone', { ascending: true });
        
      return medals;
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#2d0036] to-black px-4 sm:px-6 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-extrabold text-center text-red-600 mb-8 tracking-[-0.06em] uppercase drop-shadow">
          Diário da Sobriedade
        </h1>

        <div className="bg-gradient-to-br from-[#2d0036] to-black border border-[#4b206b] rounded-2xl shadow-xl p-8">
          <div className="space-y-8">
            <SobrietyCounter 
              daysCount={profile?.dias_sobriedade || 0} 
              sobrietyStartDate={profile?.sobriety_start_date}
            />
            
            <SobrietyDatePicker 
              startDate={profile?.sobriety_start_date ? new Date(profile.sobriety_start_date) : null}
              onDateSelect={handleDateSelect}
            />

            {medals && <SobrietyMedals medals={medals} />}

            <MotivationNote 
              isEditing={isEditingNote}
              note={motivationNote}
              onNoteChange={setMotivationNote}
              onEditToggle={() => setIsEditingNote(true)}
              onSave={handleSaveNote}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sobriety;
