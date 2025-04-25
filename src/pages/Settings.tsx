import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTheme } from "@/contexts/ThemeContext";
import { ArrowLeft, Moon, Key, Award, Info, FileText, Shield, Share, Edit2, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { ProfilePicture } from "@/components/ProfilePicture";

const Settings = () => {
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();
  const { toast } = useToast();
  const [user, setUser] = useState(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState("");
  const isMobile = useIsMobile();
  
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data, error } = await supabase.auth.getUser();
        if (error) {
          console.error("Error fetching user:", error);
        } else {
          setUser(data.user);
          const { data: profile } = await supabase
            .from('profiles')
            .select('nome')
            .eq('id', data.user.id)
            .single();
          
          setNewName(profile?.nome || "");
        }
      } catch (err) {
        console.error("Exception when fetching user:", err);
      }
    };
    
    fetchUser();
  }, []);

  const handleUpdateName = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ nome: newName })
        .eq('id', user.id);

      if (error) throw error;
      
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

  const handleUpdatePassword = async () => {
    setPasswordError("");
    
    if (newPassword.length < 6) {
      setPasswordError("A senha deve ter pelo menos 6 caracteres");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setPasswordError("As senhas não correspondem");
      return;
    }
    
    setIsUpdatingPassword(true);
    
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;
      
      setNewPassword("");
      setConfirmPassword("");
      
      toast({
        title: "Senha atualizada",
        description: "Sua senha foi atualizada com sucesso!"
      });
    } catch (error) {
      console.error("Error updating password:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar sua senha. " + error.message,
        variant: "destructive"
      });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  const handleSaveChanges = async () => {
    if (isEditingName) {
      await handleUpdateName();
    }
    
    if (newPassword && confirmPassword) {
      await handleUpdatePassword();
    }
    
    toast({
      title: "Alterações salvas",
      description: "Todas as alterações foram salvas com sucesso!"
    });
  };

  const handleUpdateAvatar = (newAvatarUrl: string) => {
    setUser(prev => ({
      ...prev,
      user_metadata: { ...prev?.user_metadata, avatar_url: newAvatarUrl }
    }));
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        <div className="flex items-center gap-4 mb-6 sm:mb-8">
          <button
            onClick={() => navigate(-1)}
            className="text-primary hover:text-primary/80"
            aria-label="Go back"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className={`text-xl sm:text-2xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Perfil
          </h1>
        </div>

        <div className="flex flex-col items-center mb-6 sm:mb-8">
          <ProfilePicture
            avatarUrl={user?.user_metadata?.avatar_url}
            userId={user?.id || ''}
            userName={newName}
            size="lg"
            editable={true}
            onImageUpdated={handleUpdateAvatar}
          />
          
          <div className="flex flex-wrap items-center justify-center gap-2 mb-1">
            {isEditingName ? (
              <div className="flex items-center gap-2">
                <Input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="max-w-[200px]"
                />
                <Button size="sm" onClick={handleUpdateName}>
                  <Save className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <>
                <h2 className={`text-lg sm:text-xl font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {newName || 'Nome do usuário'}
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditingName(true)}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
          <p className="text-sm sm:text-base text-muted-foreground text-center break-all">{user?.email}</p>
        </div>

        <div className="space-y-4 sm:space-y-6">
          <div className={`rounded-lg p-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
            <h3 className={`text-base sm:text-lg font-medium mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
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
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Claro & Escuro
                    </p>
                  </div>
                </div>
                <Switch
                  checked={isDarkMode}
                  onCheckedChange={toggleTheme}
                />
              </div>
              
              <div className="space-y-3 pt-2">
                <h4 className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Alterar Senha
                </h4>
                
                <div className="space-y-2">
                  <div>
                    <label className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Nova Senha
                    </label>
                    <Input 
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Digite sua nova senha"
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <label className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Confirmar Senha
                    </label>
                    <Input 
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirme sua nova senha"
                      className="mt-1"
                    />
                  </div>
                  
                  {passwordError && (
                    <p className="text-xs text-red-500">{passwordError}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <Button
                  variant="outline"
                  className={`w-full justify-between ${isDarkMode ? 'text-white hover:text-white hover:bg-white/10' : ''}`}
                  onClick={() => navigate('/premium')}
                >
                  <div className="flex items-center gap-2">
                    <Award className={`h-5 w-5 ${isDarkMode ? 'text-white/70' : ''}`} />
                    <span>Mudar para Premium</span>
                  </div>
                  <ArrowLeft className="h-5 w-5 rotate-180" />
                </Button>
              </div>
            </div>
          </div>

          <div className={`rounded-lg p-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
            <h3 className={`text-base sm:text-lg font-medium mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Informações
            </h3>
            
            <div className="grid grid-cols-1 gap-3">
              <Button
                variant="outline"
                className={`w-full justify-between ${isDarkMode ? 'text-white hover:text-white hover:bg-white/10' : ''}`}
                onClick={() => navigate('/about')}
              >
                <div className="flex items-center gap-2">
                  <Info className={`h-5 w-5 ${isDarkMode ? 'text-white/70' : ''}`} />
                  <span>Sobre App</span>
                </div>
                <ArrowLeft className="h-5 w-5 rotate-180" />
              </Button>

              <Button
                variant="outline"
                className={`w-full justify-between ${isDarkMode ? 'text-white hover:text-white hover:bg-white/10' : ''}`}
                onClick={() => navigate('/terms')}
              >
                <div className="flex items-center gap-2">
                  <FileText className={`h-5 w-5 ${isDarkMode ? 'text-white/70' : ''}`} />
                  <span>Termos & Condições</span>
                </div>
                <ArrowLeft className="h-5 w-5 rotate-180" />
              </Button>

              <Button
                variant="outline"
                className={`w-full justify-between ${isDarkMode ? 'text-white hover:text-white hover:bg-white/10' : ''}`}
                onClick={() => navigate('/privacy')}
              >
                <div className="flex items-center gap-2">
                  <Shield className={`h-5 w-5 ${isDarkMode ? 'text-white/70' : ''}`} />
                  <span>Política de privacidade</span>
                </div>
                <ArrowLeft className="h-5 w-5 rotate-180" />
              </Button>

              <Button
                variant="outline"
                className={`w-full justify-between ${isDarkMode ? 'text-white hover:text-white hover:bg-white/10' : ''}`}
                onClick={() => {/* Implement share functionality */}}
              >
                <div className="flex items-center gap-2">
                  <Share className={`h-5 w-5 ${isDarkMode ? 'text-white/70' : ''}`} />
                  <span>Compartilhar APP</span>
                </div>
                <ArrowLeft className="h-5 w-5 rotate-180" />
              </Button>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button 
              className="w-full sm:w-auto"
              onClick={handleSaveChanges}
            >
              <Save className="mr-2 h-4 w-4" /> Salvar Alterações
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full sm:w-auto"
              onClick={handleBackToDashboard}
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Voltar ao Painel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
