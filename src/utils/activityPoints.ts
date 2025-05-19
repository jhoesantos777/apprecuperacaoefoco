
import { supabase } from '@/integrations/supabase/client';

export type ActivityType = 
  | 'Humor'
  | 'Reflexão' 
  | 'Tarefas'
  | 'Devocional'
  | 'HojeNãoVouUsar'
  | 'NotaMotivação'
  | 'Gatilho'
  | 'Exercício'
  | 'Alimentação'
  | 'Sono'
  | 'Hidratação'
  | 'GrupoApoio'
  | 'Lazer'
  | 'Criatividade'
  | 'Trabalho'
  | 'Estudo'
  | 'Leitura'
  | 'Meditação'
  | 'Família';

// Point values for each activity type
export const ACTIVITY_POINTS = {
  'HojeNãoVouUsar': 20,
  'Devocional': 30,
  'Tarefas': 1, // Per task
  'Humor': {
    'Ótimo': 10,
    'Bem': 5,
    'Desmotivado': 0,
    'Triste': -5,
    'Irritado': -10
  },
  'Reflexão': 10,
  'NotaMotivação': 20
};

export const registerActivity = async (
  tipo: ActivityType,
  pontos: number,
  descricao?: string
) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('atividades_usuario')
      .insert({
        user_id: user.id,
        tipo_atividade: tipo,
        pontos,
        descricao
      });

    if (error) {
      console.error('Error registering activity:', error);
      throw error;
    }

    console.log('Activity registered successfully:', tipo, pontos);
    return true;
  } catch (error) {
    console.error('Failed to register activity:', error);
    throw error;
  }
};

export const getActivityPointValue = (tipo: ActivityType, valor?: string): number => {
  if (tipo === 'Humor' && valor) {
    return ACTIVITY_POINTS.Humor[valor as keyof typeof ACTIVITY_POINTS.Humor] || 0;
  }
  return (ACTIVITY_POINTS[tipo as keyof typeof ACTIVITY_POINTS] as number) || 0;
};

export const calculateTotalPoints = (activities: any[]): number => {
  if (!activities || activities.length === 0) return 0;
  return activities.reduce((sum, activity) => sum + (activity.pontos || 0), 0);
};
