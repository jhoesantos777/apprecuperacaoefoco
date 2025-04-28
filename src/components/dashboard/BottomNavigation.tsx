
import React from 'react';
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, Heart, Settings, User } from "lucide-react";

export const BottomNavigation = () => {
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around items-center p-3">
      <Button variant="ghost" className="flex flex-col items-center gap-1" onClick={() => navigate('/dashboard')}>
        <Home className="h-5 w-5" />
        <span className="text-xs">Home</span>
      </Button>
      <Button variant="ghost" className="flex flex-col items-center gap-1" onClick={() => navigate('/emergency')}>
        <Heart className="h-5 w-5 text-red-500" />
        <span className="text-xs">Emergência</span>
      </Button>
      <Button variant="ghost" className="flex flex-col items-center gap-1" onClick={() => navigate('/settings')}>
        <Settings className="h-5 w-5" />
        <span className="text-xs">Configurações</span>
      </Button>
      <Button variant="ghost" className="flex flex-col items-center gap-1" onClick={() => navigate('/profile')}>
        <User className="h-5 w-5" />
        <span className="text-xs">Perfil</span>
      </Button>
    </div>
  );
};
