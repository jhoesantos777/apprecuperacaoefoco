
import React from 'react';
import { useNavigate } from "react-router-dom";
import { 
  ChevronLeft, 
  Users, 
  Crown, 
  LayoutDashboard, 
  FileEdit,
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const AdminSidebar = ({ activeTab, setActiveTab }: AdminSidebarProps) => {
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    try {
      localStorage.removeItem("userRole");
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast("Logout realizado com sucesso");
      navigate('/');
    } catch (error) {
      toast.error("Erro ao fazer logout");
      console.error('Logout error:', error);
    }
  };

  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <div className="w-64 bg-teal-900 text-white min-h-screen p-4 flex flex-col">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-teal-700">
        <h1 className="text-xl font-bold">Painel Admin</h1>
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-white hover:bg-teal-800" 
          onClick={handleBackToDashboard}
        >
          <ChevronLeft size={20} />
        </Button>
      </div>

      <nav className="flex-1 space-y-2">
        <Button 
          variant={activeTab === "dashboard" ? "secondary" : "ghost"} 
          className="w-full justify-start" 
          onClick={() => setActiveTab("dashboard")}
        >
          <LayoutDashboard className="mr-2 h-5 w-5" />
          Dashboard
        </Button>
        
        <Button 
          variant={activeTab === "users" ? "secondary" : "ghost"} 
          className="w-full justify-start" 
          onClick={() => setActiveTab("users")}
        >
          <Users className="mr-2 h-5 w-5" />
          Usuários
        </Button>
        
        <Button 
          variant={activeTab === "premium" ? "secondary" : "ghost"} 
          className="w-full justify-start" 
          onClick={() => setActiveTab("premium")}
        >
          <Crown className="mr-2 h-5 w-5" />
          Contas Premium
        </Button>
        
        <Button 
          variant={activeTab === "content" ? "secondary" : "ghost"} 
          className="w-full justify-start" 
          onClick={() => setActiveTab("content")}
        >
          <FileEdit className="mr-2 h-5 w-5" />
          Conteúdo
        </Button>
      </nav>

      <div className="pt-4 border-t border-teal-700">
        <Button 
          variant="ghost" 
          className="w-full justify-start text-white hover:bg-teal-800" 
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-5 w-5" />
          Sair
        </Button>
      </div>
    </div>
  );
};
