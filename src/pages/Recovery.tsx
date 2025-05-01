
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import RecoveryThermometer from '@/components/RecoveryThermometer';
import DailyMotivation from '@/components/DailyMotivation';
import { Card } from '@/components/ui/card';
import { BackButton } from '@/components/BackButton';
import { toast } from '@/components/ui/sonner';
import { ResetButton } from '@/components/recovery/ResetButton';
import { Button } from '@/components/ui/button';
import { registerActivity } from '@/utils/activityPoints';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain, AlertTriangle, Thermometer } from 'lucide-react';

const Recovery = () => {
  const [hasConfirmedSobriety, setHasConfirmedSobriety] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Check if user has already confirmed sobriety today
  const { data: sobrietyData } = useQuery({
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

  // Calculate recovery score and details for the thermometer
  const { data: recoveryData } = useQuery({
    queryKey: ['recovery-thermometer'],
    queryFn: async () => {
      try {
        const userId = (await supabase.auth.getUser()).data.user?.id;
        if (!userId) throw new Error('User not authenticated');

        // Get today's activities
        const today = new Date().toISOString().split('T')[0];
        const { data: activities, error } = await supabase
          .from('atividades_usuario')
          .select('*')
          .eq('user_id', userId)
          .gte('data_registro', today);

        if (error) throw error;

        // Enhanced calculation with therapeutic focus
        // Calculate points for each category with improved weighting
        const taskPoints = Math.min(25, activities
          ?.filter(a => a.tipo_atividade === 'Tarefas')
          .reduce((sum, a) => sum + a.pontos, 0) || 0);

        const moodPoints = Math.min(15, activities
          ?.filter(a => a.tipo_atividade === 'Humor')
          .reduce((sum, a) => sum + a.pontos, 0) || 0);

        const devotionalPoints = Math.min(20, activities
          ?.filter(a => a.tipo_atividade === 'Devocional')
          .reduce((sum, a) => sum + a.pontos, 0) || 0);

        const sobrietyPoints = Math.min(25, activities
          ?.filter(a => a.tipo_atividade === 'HojeNãoVouUsar')
          .reduce((sum, a) => sum + a.pontos, 0) || 0);

        const reflectionPoints = Math.min(15, activities
          ?.filter(a => a.tipo_atividade === 'Reflexão')
          .reduce((sum, a) => sum + a.pontos, 0) || 0);

        // Progressive penalty for triggers - increasing impact
        const gatilhosList = activities
          ?.filter(a => a.tipo_atividade === 'Gatilho') || [];
          
        const triggerPoints = gatilhosList.reduce((sum, _, index) => {
          // Each subsequent trigger has more impact
          return sum + (index + 1) * 3;
        }, 0);

        // Calculate total score with holistic approach
        const totalScore = Math.max(0, 
          taskPoints + 
          moodPoints + 
          devotionalPoints + 
          sobrietyPoints + 
          reflectionPoints - 
          triggerPoints
        );

        // Check if there are multiple triggers
        const hasMultipleTriggers = gatilhosList.length > 1;

        return {
          score: Math.min(totalScore, 100),
          hasMultipleTriggers,
          details: {
            taskPoints,
            moodPoints,
            devotionalPoints,
            sobrietyPoints,
            reflectionPoints
          }
        };
      } catch (error) {
        console.error('Error calculating recovery score:', error);
        return {
          score: 0,
          hasMultipleTriggers: false,
          details: {
            taskPoints: 0,
            moodPoints: 0,
            devotionalPoints: 0,
            sobrietyPoints: 0,
            reflectionPoints: 0
          }
        };
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
      await registerActivity('HojeNãoVouUsar', 20, 'Declaração de sobriedade');
      
      // Update queries
      queryClient.invalidateQueries({ queryKey: ['recovery-thermometer'] });
      queryClient.invalidateQueries({ queryKey: ['sobriety-check'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['sobriety-medals'] });
      
      setHasConfirmedSobriety(true);
      toast("Parabéns pela sua determinação!", {
        description: "Cada decisão consciente fortalece seu caminho na recuperação. Continue cultivando este compromisso diário consigo mesmo."
      });
    } catch (error) {
      console.error('Error registering sobriety declaration:', error);
      toast("Encontramos um obstáculo", {
        description: "Não foi possível registrar sua declaração no momento. Vamos tentar novamente?",
        style: { backgroundColor: 'hsl(var(--destructive))' }
      });
    }
  };

  const handleGoToTriggers = () => {
    navigate('/triggers');
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-b from-blue-700 to-indigo-900 p-6"
      style={{
        backgroundImage: 'url("/bg-pattern-blue.svg")',
        backgroundSize: 'cover',
        backgroundBlendMode: 'soft-light'
      }}
    >
      <BackButton />
      
      <div className="max-w-md mx-auto space-y-6">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <Thermometer className="h-8 w-8 text-blue-300" />
            <h1 className="text-3xl font-bold text-white">
              Termômetro da Recuperação
            </h1>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <DailyMotivation />
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Card className="p-6 border border-white/20 bg-white/10 backdrop-blur-md rounded-xl shadow-xl">
            <Button 
              className={`w-full py-6 text-lg font-bold transition-all duration-300 mb-6 ${
                hasConfirmedSobriety 
                  ? 'bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600' 
                  : 'bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600'
              } text-white rounded-xl shadow-lg transform hover:scale-[1.02] active:scale-[0.98]`}
              onClick={handleSobrietyDeclaration}
              disabled={hasConfirmedSobriety}
            >
              {hasConfirmedSobriety 
                ? "A SOBRIEDADE É UMA CONQUISTA DIÁRIA ✨" 
                : "HOJE EU NAO VOU USAR!"}
            </Button>

            {recoveryData && (
              <RecoveryThermometer 
                score={recoveryData.score} 
                hasMultipleTriggers={recoveryData.hasMultipleTriggers}
                details={recoveryData.details}
              />
            )}
            
            <div className="mt-6">
              <ResetButton />
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Card className="p-6 border border-white/20 bg-white/10 backdrop-blur-md rounded-xl shadow-md">
            <Button 
              variant="outline" 
              onClick={handleGoToTriggers} 
              className="w-full rounded-lg bg-white/20 border-white/30 text-white hover:bg-white/30 hover:text-white flex items-center gap-2 justify-center transform hover:scale-[1.02] transition-all"
            >
              <AlertTriangle className="h-5 w-5" />
              <span>Identifique seus Gatilhos de Hoje</span>
            </Button>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Recovery;
