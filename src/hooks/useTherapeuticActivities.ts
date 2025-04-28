
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useTherapeuticActivities = () => {
  return useQuery({
    queryKey: ['therapeutic-activities'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_therapeutic_activities');
      
      if (error) {
        console.error('Error fetching therapeutic activities:', error);
        throw error;
      }
      
      return data;
    }
  });
};
