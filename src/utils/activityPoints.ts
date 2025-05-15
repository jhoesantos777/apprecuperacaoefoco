
import { supabase } from '@/integrations/supabase/client';

export type ActivityType = 
  | 'Humor'
  | 'Reflexão' 
  | 'Tarefas'
  | 'Devocional'
  | 'HojeNãoVouUsar'
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
