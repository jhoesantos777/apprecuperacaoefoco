
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useUserProfile = (userRole: string) => {
  return useQuery({
    queryKey: ['profile', userRole],
    queryFn: async () => {
      try {
        // Special handling for admin user
        if (userRole === 'admin') {
          return {
            nome: 'Administrador',
            tipoUsuario: 'admin',
            id: 'admin-id',
            avatar_url: null
          };
        }
        
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          throw new Error("User not authenticated");
        }
        
        // Fetch the profile data from the profiles table
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (error) {
          // If there's no profile yet, return basic user info
          return {
            nome: user.user_metadata?.nome || user.email?.split('@')[0] || 'Usuário',
            tipoUsuario: userRole,
            id: user.id,
            avatar_url: user.user_metadata?.avatar_url || null
          };
        }
        
        return {
          ...profile,
          tipoUsuario: userRole
        };
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
        
        // Fallback to display something rather than error
        return {
          nome: 'Usuário',
          tipoUsuario: userRole,
          id: 'user-id',
          avatar_url: null
        };
      }
    },
    enabled: !!userRole // Only run query when userRole is available
  });
};
