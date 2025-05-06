
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface UserProfile {
  nome: string | null;
  tipoUsuario: string;
  id: string;
  avatar_url: string | null;
  dias_sobriedade?: number | null;
  mood_points?: number | null;
  [key: string]: any; // Allow for additional properties from the database
}

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
            avatar_url: null,
            dias_sobriedade: 0,
            mood_points: 0
          } as UserProfile;
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
            avatar_url: user.user_metadata?.avatar_url || null,
            dias_sobriedade: 0,
            mood_points: 0
          } as UserProfile;
        }
        
        return {
          ...profile,
          tipoUsuario: userRole,
          dias_sobriedade: profile.dias_sobriedade || 0,
          mood_points: profile.mood_points || 0
        } as UserProfile;
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
        
        // Fallback to display something rather than error
        return {
          nome: 'Usuário',
          tipoUsuario: userRole,
          id: 'user-id',
          avatar_url: null,
          dias_sobriedade: 0,
          mood_points: 0
        } as UserProfile;
      }
    },
    enabled: !!userRole // Only run query when userRole is available
  });
};
