
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import RecoveryThermometer from '@/components/RecoveryThermometer';

interface ScoreBreakdown {
  taskPoints: number;
  moodPoints: number;
  devotionalPoints: number;
  sobrietyPoints: number;
  reflectionPoints: number;
}

const TermometroDaRecuperacao = () => {
  // Calculate overall thermometer score based on registered activities
  const { data: activityPoints, isLoading } = useQuery({
    queryKey: ['activity-points'],
    queryFn: async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');
        
        const today = new Date();
        today.setDate(today.getDate() - 7); // Last 7 days
        
        const { data, error } = await supabase
          .from('atividades_usuario')
          .select('*')
          .eq('user_id', user.id)
          .gte('created_at', today.toISOString());
        
        if (error) throw error;
        
        // Calculate points by category
        const pointsByCategory: ScoreBreakdown = {
          taskPoints: calculatePointsByType(data, 'Tarefas'),
          moodPoints: calculatePointsByType(data, 'Humor'),
          devotionalPoints: calculatePointsByType(data, 'Devocional'),
          sobrietyPoints: calculatePointsByType(data, 'HojeNãoVouUsar'),
          reflectionPoints: calculatePointsByType(data, 'Reflexão')
        };
        
        // Calculate total score (max 100)
        const totalPoints = data?.reduce((sum, item) => sum + (item.pontos || 0), 0) || 0;
        const score = Math.min(Math.round(totalPoints / 1.5), 100); // Scale score to max 100
        
        return {
          score,
          details: pointsByCategory,
          hasPoints: totalPoints > 0
        };
      } catch (error) {
        console.error('Failed to fetch activity points:', error);
        return { 
          score: 0, 
          details: {
            taskPoints: 0,
            moodPoints: 0,
            devotionalPoints: 0,
            sobrietyPoints: 0,
            reflectionPoints: 0
          }, 
          hasPoints: false 
        };
      }
    }
  });
  
  // Query for triggers to check vulnerability
  const { data: triggerData } = useQuery({
    queryKey: ['recovery-triggers'],
    queryFn: async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');
        
        const { data, error } = await supabase
          .from('recovery_triggers')
          .select('*')
          .eq('user_id', user.id);
          
        if (error) throw error;
        
        return data || [];
      } catch (error) {
        console.error('Failed to fetch triggers:', error);
        return [];
      }
    }
  });

  function calculatePointsByType(data: any[] | null, type: string): number {
    if (!data) return 0;
    return data
      .filter(item => item.tipo_atividade === type)
      .reduce((sum, item) => sum + (item.pontos || 0), 0);
  }

  if (isLoading) {
    return (
      <div className="bg-white/5 backdrop-blur-md rounded-xl p-8 border border-white/10 flex justify-center items-center min-h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 md:p-8 border border-white/10 text-white">
      <h2 className="text-2xl font-bold mb-4">Termômetro da Recuperação</h2>
      <p className="text-white/80 mb-6">
        Este indicador reflete seu progresso com base em todas as suas atividades, 
        reflexões e tarefas realizadas nos últimos 7 dias. Continue registrando suas atividades para
        manter seu termômetro atualizado.
      </p>
      
      <RecoveryThermometer 
        score={activityPoints?.score || 0} 
        hasMultipleTriggers={(triggerData?.length || 0) > 3}
        details={activityPoints?.details}
      />
    </div>
  );
};

export default TermometroDaRecuperacao;
