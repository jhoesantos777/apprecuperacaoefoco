
import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { IrmandadeMember } from "@/types/supabase";

interface IrmandadeContextType {
  isMember: boolean;
  remainingViews: number;
  checkMembership: () => Promise<boolean>;
  joinIrmandade: () => Promise<void>;
  leaveIrmandade: () => Promise<void>;
  decrementViews: () => void;
  loading: boolean;
}

const IrmandadeContext = createContext<IrmandadeContextType | undefined>(undefined);

export const IrmandadeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMember, setIsMember] = useState<boolean>(false);
  const [remainingViews, setRemainingViews] = useState<number>(2); // Non-members get 2 profile views per day
  const [loading, setLoading] = useState<boolean>(true);

  const checkMembership = async (): Promise<boolean> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setIsMember(false);
        return false;
      }

      // Check if the user exists in the irmandade_members table
      const { data, error } = await supabase
        .from('irmandade_members')
        .select('user_id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error("Error checking membership:", error);
        setIsMember(false);
        return false;
      }

      const membershipExists = !!data;
      setIsMember(membershipExists);
      return membershipExists;
    } catch (error) {
      console.error("Error checking membership:", error);
      setIsMember(false);
      return false;
    }
  };

  const joinIrmandade = async (): Promise<void> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          description: "Você precisa estar logado para participar da Irmandade"
        });
        return;
      }

      // Add the user to the irmandade_members table using direct query
      const { error } = await supabase
        .from('irmandade_members')
        .insert({ user_id: user.id });

      if (error) {
        console.error("Error joining Irmandade:", error);
        toast({
          description: "Erro ao entrar na Irmandade. Tente novamente."
        });
        return;
      }

      setIsMember(true);
      toast({
        description: "Bem-vindo à Irmandade! Você agora tem acesso completo à comunidade."
      });
    } catch (error) {
      console.error("Error joining Irmandade:", error);
      toast({
        description: "Erro ao entrar na Irmandade. Tente novamente."
      });
    }
  };

  const leaveIrmandade = async (): Promise<void> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      // Remove the user from the irmandade_members table using direct query
      const { error } = await supabase
        .from('irmandade_members')
        .delete()
        .eq('user_id', user.id);

      if (error) {
        console.error("Error leaving Irmandade:", error);
        toast({
          description: "Erro ao sair da Irmandade. Tente novamente."
        });
        return;
      }

      setIsMember(false);
      toast({
        description: "Você saiu da Irmandade. Esperamos vê-lo novamente em breve."
      });
    } catch (error) {
      console.error("Error leaving Irmandade:", error);
      toast({
        description: "Erro ao sair da Irmandade. Tente novamente."
      });
    }
  };

  const decrementViews = () => {
    if (!isMember && remainingViews > 0) {
      setRemainingViews(prev => prev - 1);
    }
  };

  useEffect(() => {
    const initialize = async () => {
      setLoading(true);
      await checkMembership();
      setLoading(false);
    };

    initialize();

    // Reset views count at midnight
    const resetViewsAtMidnight = () => {
      const now = new Date();
      const night = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1,
        0, 0, 0
      );
      const msToMidnight = night.getTime() - now.getTime();
      
      return setTimeout(() => {
        setRemainingViews(2);
        // Set up the next day's reset
        resetViewsAtMidnight();
      }, msToMidnight);
    };

    const timerId = resetViewsAtMidnight();
    return () => clearTimeout(timerId);
  }, []);

  const value = {
    isMember,
    remainingViews,
    checkMembership,
    joinIrmandade,
    leaveIrmandade,
    decrementViews,
    loading
  };

  return (
    <IrmandadeContext.Provider value={value}>
      {children}
    </IrmandadeContext.Provider>
  );
};

export const useIrmandade = (): IrmandadeContextType => {
  const context = useContext(IrmandadeContext);
  if (context === undefined) {
    throw new Error('useIrmandade must be used within an IrmandadeProvider');
  }
  return context;
};
