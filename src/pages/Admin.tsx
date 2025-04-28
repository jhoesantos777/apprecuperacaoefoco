
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminUsers } from "@/components/admin/AdminUsers";
import { AdminPremium } from "@/components/admin/AdminPremium";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { AdminContent } from "@/components/admin/AdminContent";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("dashboard");

  // Check if user is admin
  React.useEffect(() => {
    const checkAdminStatus = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const userRole = localStorage.getItem("userRole");
      
      if (!session || userRole !== "admin") {
        toast({
          title: "Acesso negado",
          description: "Você não tem permissões de administrador.",
          variant: "destructive"
        });
        navigate("/dashboard");
      }
    };
    
    checkAdminStatus();
  }, [navigate, toast]);

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <AdminDashboard />;
      case "users":
        return <AdminUsers />;
      case "premium":
        return <AdminPremium />;
      case "content":
        return <AdminContent />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 p-6">
        {renderContent()}
      </div>
    </div>
  );
};

export default Admin;
