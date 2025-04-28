
import React from 'react';
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type SobrietyButtonProps = {
  hasConfirmedSobriety: boolean;
  onConfirm: () => void;
};

export const SobrietyButton = ({ hasConfirmedSobriety, onConfirm }: SobrietyButtonProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const sobrietyDeclaration = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { error } = await supabase
        .from('sobriety_declarations')
        .insert([
          {
            user_id: user.id,
            declared_at: new Date().toISOString()
          }
        ]);

      if (error) throw error;
    },
    onSuccess: () => {
      onConfirm();
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['recovery-score'] });
      queryClient.invalidateQueries({ queryKey: ['sobriety-medals'] });
      toast({
        title: "Parabéns!",
        description: "Sua determinação é inspiradora. Continue firme!",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Não foi possível registrar sua declaração.",
        variant: "destructive",
      });
      console.error('Error registering sobriety declaration:', error);
    },
  });

  return (
    <div className="px-6 mb-8">
      <Button 
        className={`w-full py-6 text-lg font-bold transition-all duration-300 ${
          hasConfirmedSobriety 
            ? 'bg-green-600 hover:bg-green-700' 
            : 'bg-red-600 hover:bg-red-700'
        } text-white`}
        onClick={() => sobrietyDeclaration.mutate()}
        disabled={hasConfirmedSobriety}
      >
        {hasConfirmedSobriety 
          ? "A SOBRIEDADE É UMA CONQUISTA DIÁRIA ✨" 
          : "HOJE EU NAO VOU USAR!"}
      </Button>
    </div>
  );
};
