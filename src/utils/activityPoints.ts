
import { supabase } from '@/integrations/supabase/client';

export type ActivityType = 
  | 'Humor'
  | 'Reflexão' 
  | 'Tarefas'
  | 'Devocional'
  | 'HojeNãoVouUsar'
  | 'Gatilho';

export const registerActivity = async (
  tipo: ActivityType,
  pontos: number,
  descricao?: string
) => {
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

  if (error) throw error;
};
