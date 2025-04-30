
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useUserProfile = (userRole: string) => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      // Always return admin profile, no authentication check required
      return {
        nome: 'Administrador',
        tipoUsuario: 'admin',
        id: 'admin-id',
        avatar_url: null
      };
    },
  });
};
