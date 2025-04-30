
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import TermometroDaRecuperacao from '@/components/recovery/TermometroDaRecuperacao';
import DailyMotivation from '@/components/DailyMotivation';
import { Card } from '@/components/ui/card';
import { BackButton } from '@/components/BackButton';
import { toast } from '@/components/ui/sonner';
import { ResetButton } from '@/components/recovery/ResetButton';
import { Button } from '@/components/ui/button';
import { registerActivity } from '@/utils/activityPoints';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

const Recovery = () => {
  const [hasConfirmedSobriety, setHasConfirmedSobriety] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Check if user has already confirmed sobriety today
  useQuery({
    queryKey: ['sobriety-check'],
    queryFn: async () => {
      try {
        const userId = (await supabase.auth.getUser()).data.user?.id;
        if (!userId) return { hasConfirmed: false };

        // Check if user has confirmed sobriety today
        const { data: sobrietyDeclarations } = await supabase
          .from('sobriety_declarations')
          .select('*')
          .eq('user_id', userId)
          .gte('declared_at', new Date().toISOString().split('T')[0]);

        setHasConfirmedSobriety(sobrietyDeclarations && sobrietyDeclarations.length > 0);
        return { hasConfirmed: sobrietyDeclarations && sobrietyDeclarations.length > 0 };
      } catch (error) {
        console.error('Error checking sobriety status:', error);
        return { hasConfirmed: false };
      }
    },
  });

  // Handle sobriety declaration
  const handleSobrietyDeclaration = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast("Você precisa estar logado para fazer esta declaração");
        return;
      }

      const { error } = await supabase
        .from('sobriety_declarations')
        .insert([
          {
            user_id: user.id,
            declared_at: new Date().toISOString()
          }
        ]);

      if (error) throw error;

      // Register activity for the recovery thermometer
      await registerActivity('HojeNãoVouUsar', 5, 'Declaração de sobriedade');
      
      // Update queries
      queryClient.invalidateQueries({ queryKey: ['recovery-thermometer'] });
      queryClient.invalidateQueries({ queryKey: ['sobriety-check'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['sobriety-medals'] });
      
      setHasConfirmedSobriety(true);
      toast("Parabéns!", {
        description: "Sua determinação é inspiradora. Continue firme!"
      });
    } catch (error) {
      console.error('Error registering sobriety declaration:', error);
      toast("Erro", {
        description: "Não foi possível registrar sua declaração.",
        style: { backgroundColor: 'hsl(var(--destructive))' }
      });
    }
  };

  const handleGoToTriggers = () => {
    navigate('/triggers');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-600 to-teal-900 p-6">
      <BackButton />
      
      <div className="max-w-md mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-white mb-6">
          🧠 Termômetro da Recuperação
        </h1>
        
        <DailyMotivation />

        <Card className="p-6">
          <Button 
            className={`w-full py-6 text-lg font-bold transition-all duration-300 mb-6 ${
              hasConfirmedSobriety 
                ? 'bg-green-600 hover:bg-green-700' 
                : 'bg-red-600 hover:bg-red-700'
            } text-white`}
            onClick={handleSobrietyDeclaration}
            disabled={hasConfirmedSobriety}
          >
            {hasConfirmedSobriety 
              ? "A SOBRIEDADE É UMA CONQUISTA DIÁRIA ✨" 
              : "HOJE EU NAO VOU USAR!"}
          </Button>

          <div>
            <TermometroDaRecuperacao />
          </div>
          
          <div className="mt-4">
            <ResetButton />
          </div>
        </Card>

        <Card className="p-6">
          <Button 
            variant="outline" 
            onClick={handleGoToTriggers} 
            className="w-full"
          >
            Identifique seus Gatilhos de Hoje
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default Recovery;
