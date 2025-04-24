
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Moon, Key, Award, Info, FileText, Shield, Share } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Settings = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);

  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-900 to-emerald-900">
      <div className="p-6">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="text-white/70 hover:text-white"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-2xl font-semibold text-white">Perfil</h1>
        </div>

        <div className="flex flex-col items-center mb-8">
          <Avatar className="h-24 w-24 mb-4">
            <AvatarImage src={user?.user_metadata?.avatar_url} />
            <AvatarFallback>
              {user?.email?.[0]?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <h2 className="text-xl font-medium text-white mb-1">
            {user?.user_metadata?.full_name || 'Nome do usuário'}
          </h2>
          <p className="text-white/70">{user?.email}</p>
        </div>

        <div className="space-y-6">
          <div className="bg-white/10 rounded-lg p-4">
            <h3 className="text-lg font-medium text-white mb-4">Configurações gerais</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Moon className="h-5 w-5 text-white/70" />
                  <div>
                    <p className="font-medium text-white">Modo</p>
                    <p className="text-sm text-white/70">Claro & Escuro</p>
                  </div>
                </div>
                <Switch
                  checked={darkMode}
                  onCheckedChange={setDarkMode}
                />
              </div>

              <Button
                variant="ghost"
                className="w-full justify-between text-white hover:text-white hover:bg-white/10"
                onClick={() => navigate('/change-password')}
              >
                <div className="flex items-center gap-3">
                  <Key className="h-5 w-5 text-white/70" />
                  <span>Mudar Senha</span>
                </div>
                <ArrowLeft className="h-5 w-5 rotate-180" />
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-between text-white hover:text-white hover:bg-white/10"
                onClick={() => navigate('/premium')}
              >
                <div className="flex items-center gap-3">
                  <Award className="h-5 w-5 text-white/70" />
                  <span>Mudar para Premium</span>
                </div>
                <ArrowLeft className="h-5 w-5 rotate-180" />
              </Button>
            </div>
          </div>

          <div className="bg-white/10 rounded-lg p-4">
            <h3 className="text-lg font-medium text-white mb-4">Informações</h3>
            
            <div className="space-y-4">
              <Button
                variant="ghost"
                className="w-full justify-between text-white hover:text-white hover:bg-white/10"
                onClick={() => navigate('/about')}
              >
                <div className="flex items-center gap-3">
                  <Info className="h-5 w-5 text-white/70" />
                  <span>Sobre App</span>
                </div>
                <ArrowLeft className="h-5 w-5 rotate-180" />
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-between text-white hover:text-white hover:bg-white/10"
                onClick={() => navigate('/terms')}
              >
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-white/70" />
                  <span>Termos & Condições</span>
                </div>
                <ArrowLeft className="h-5 w-5 rotate-180" />
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-between text-white hover:text-white hover:bg-white/10"
                onClick={() => navigate('/privacy')}
              >
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-white/70" />
                  <span>Política de privacidade</span>
                </div>
                <ArrowLeft className="h-5 w-5 rotate-180" />
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-between text-white hover:text-white hover:bg-white/10"
                onClick={() => {/* Implement share functionality */}}
              >
                <div className="flex items-center gap-3">
                  <Share className="h-5 w-5 text-white/70" />
                  <span>Compartilhar APP</span>
                </div>
                <ArrowLeft className="h-5 w-5 rotate-180" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
