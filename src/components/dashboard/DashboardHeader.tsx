
import React from 'react';
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ProfilePicture } from "@/components/ProfilePicture";

type DashboardHeaderProps = {
  profile: any;
  userRole: string;
};

export const DashboardHeader = ({ profile, userRole }: DashboardHeaderProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      localStorage.removeItem("userRole");
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Logout Successful",
        description: "Você foi desconectado do aplicativo.",
      });
      
      navigate('/');
    } catch (error) {
      toast({
        title: "Erro no Logout",
        description: "Não foi possível sair do aplicativo. Por favor, tente novamente.",
        variant: "destructive"
      });
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="p-6 flex items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <ProfilePicture
          avatarUrl={profile?.avatar_url}
          userId={profile?.id || ''}
          userName={profile?.nome}
          size="lg"
        />
        <div>
          <h1 className="text-2xl font-bold text-white">
            {userRole === 'admin' 
              ? 'Painel Administrativo' 
              : userRole === 'family' 
                ? 'Painel Familiar' 
                : 'Bem vindo'}
          </h1>
          <p className="text-white/90">{profile?.nome || 'Usuário'}</p>
          {userRole === 'admin' && (
            <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
              Administrador
            </span>
          )}
        </div>
      </div>
      <Button 
        variant="ghost" 
        className="text-white hover:bg-white/20"
        onClick={handleLogout}
      >
        <LogOut className="mr-2 h-5 w-5" /> Sair
      </Button>
    </div>
  );
};
