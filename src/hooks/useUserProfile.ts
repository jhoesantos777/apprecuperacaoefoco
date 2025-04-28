
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useUserProfile = (userRole: string) => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      if (userRole === 'admin') {
        return {
          nome: 'Administrador',
          tipoUsuario: 'admin',
          id: 'admin-id',
          avatar_url: null
        };
      }
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      return {
        ...profile,
        tipoUsuario: userRole
      };
    },
  });
};
