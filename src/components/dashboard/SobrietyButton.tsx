
import React from 'react';
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { registerActivity } from "@/utils/activityPoints";
import { motion } from "framer-motion";

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

      // Declaração de sobriedade
      const { error } = await supabase
        .from('sobriety_declarations')
        .insert([
          {
            user_id: user.id,
            declared_at: new Date().toISOString()
          }
        ]);

      if (error) throw error;

      // Registrar atividade para o termômetro de recuperação
      await registerActivity('HojeNãoVouUsar', 5, 'Declaração de sobriedade');
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
    <motion.button
      onClick={() => sobrietyDeclaration.mutate()}
      disabled={hasConfirmedSobriety}
      className={`w-full py-4 rounded-[16px] text-white font-bold text-lg relative overflow-hidden backdrop-blur-sm ${
        hasConfirmedSobriety 
          ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 shadow-[0_8px_30px_rgba(16,185,129,0.2)]' 
          : 'bg-gradient-to-r from-red-600 to-red-500 shadow-[0_8px_30px_rgba(239,68,68,0.2)] hover:shadow-[0_8px_30px_rgba(239,68,68,0.3)]'
      }`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <motion.div
        className="absolute inset-0 bg-white/20"
        initial={{ x: '-100%' }}
        animate={{ x: '100%' }}
        transition={{ repeat: Infinity, duration: 2 }}
      />
      <div className="relative z-10 flex items-center justify-center gap-3">
        {hasConfirmedSobriety ? (
          <>
            <span className="drop-shadow-lg">SOBRIEDADE CONFIRMADA HOJE</span>
            <motion.div
              className="text-2xl"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              ✓
            </motion.div>
          </>
        ) : (
          <>
            <span className="drop-shadow-lg">HOJE EU NÃO VOU USAR!</span>
            <motion.div
              className="text-2xl"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              !
            </motion.div>
          </>
        )}
      </div>
    </motion.button>
  );
};
