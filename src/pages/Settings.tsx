import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTheme } from "@/contexts/ThemeContext";
import { ArrowLeft, Moon, Key, Award, Info, FileText, Shield, Share, Edit2, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();
  const { toast } = useToast();
  const [user, setUser] = useState(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState("");
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data, error } = await supabase.auth.getUser();
        if (error) {
          console.error("Error fetching user:", error);
        } else {
          setUser(data.user);
          setNewName(data.user?.user_metadata?.full_name || "");
        }
      } catch (err) {
        console.error("Exception when fetching user:", err);
      }
    };
    
    fetchUser();
  }, []);

  const handleUpdateName = async () => {
    try {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: newName }
      });

      if (error) throw error;

      setUser(prev => ({
        ...prev,
        user_metadata: { ...prev?.user_metadata, full_name: newName }
      }));
      
      setIsEditingName(false);
      toast({
        title: "Nome atualizado",
        description: "Seu nome foi atualizado com sucesso!"
      });
    } catch (error) {
      console.error("Error updating name:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar seu nome.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <div className="p-6">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="text-primary hover:text-primary/80"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className={`text-2xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Perfil
          </h1>
        </div>

        <div className="flex flex-col items-center mb-8">
          <Avatar className="h-24 w-24 mb-4">
            <AvatarImage src={user?.user_metadata?.avatar_url} />
            <AvatarFallback>
              {user?.email?.[0]?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex items-center gap-2 mb-1">
            {isEditingName ? (
              <div className="flex items-center gap-2">
                <Input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="max-w-[200px]"
                />
                <Button size="icon" onClick={handleUpdateName}>
                  <Save className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <>
                <h2 className={`text-xl font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {user?.user_metadata?.full_name || 'Nome do usuário'}
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsEditingName(true)}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
          <p className="text-muted-foreground">{user?.email}</p>
        </div>

        <div className="space-y-6">
          <div className={`rounded-lg p-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h3 className={`text-lg font-medium mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Configurações gerais
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Moon className="h-5 w-5 text-primary" />
                  <div>
                    <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Modo
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Claro & Escuro
                    </p>
                  </div>
                </div>
                <Switch
                  checked={isDarkMode}
                  onCheckedChange={toggleTheme}
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

          <div className={`rounded-lg p-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h3 className={`text-lg font-medium mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Informações
            </h3>
            
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
