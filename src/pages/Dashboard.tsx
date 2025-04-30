import React, { useState, useEffect } from 'react';
import { useUserProfile } from '@/hooks/useUserProfile';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { ProfilePicture } from '@/components/ProfilePicture';
import { Crown, Siren } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Dashboard = () => {
  const [hasConfirmedSobriety, setHasConfirmedSobriety] = useState(false);
  const [userRole, setUserRole] = useState<string>("dependent");
  const navigate = useNavigate();
  
  useEffect(() => {
    const savedRole = localStorage.getItem("userRole");
    if (savedRole) {
      setUserRole(savedRole);
    } else {
      const checkUserRole = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user?.user_metadata?.tipoUsuario) {
          setUserRole(user.user_metadata.tipoUsuario);
          localStorage.setItem("userRole", user.user_metadata.tipoUsuario);
        }
      };
      checkUserRole();
    }
  }, []);

  const { data: profile } = useUserProfile(userRole);

  const handleSobrietyConfirmation = () => {
    setHasConfirmedSobriety(true);
    // Implementar lógica para registrar a confirmação de sobriedade
  };

  const navigateTo = (path: string) => {
    navigate(path);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  if (userRole === "family") {
    return <FamilyDashboard />;
  }

  if (userRole === "admin") {
    navigate('/admin');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-500 to-emerald-600 flex flex-col">
      {/* Header */}
      <div className="p-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-white text-lg mb-1">Seja bem vindo</h2>
            <h1 className="text-white text-2xl font-bold">{profile?.nome || '(nome do usuário)'}</h1>
            <div className="flex items-center mt-1">
              <Crown className="h-4 w-4 text-yellow-300" />
              <span className="text-white text-sm ml-1">Versão beta</span>
            </div>
          </div>
          <div>
            <ProfilePicture
              avatarUrl={profile?.avatar_url}
              userId={profile?.id || ''}
              userName={profile?.nome}
              size="lg"
            />
          </div>
        </div>

        {/* Sobriety Button */}
        <div className="mt-6">
          <button
            onClick={handleSobrietyConfirmation}
            disabled={hasConfirmedSobriety}
            className={`w-full py-4 rounded-xl text-white font-bold text-lg ${
              hasConfirmedSobriety ? 'bg-green-600' : 'bg-red-600'
            }`}
          >
            HOJE EU NÃO VOU USAR!
          </button>
        </div>
      </div>

      {/* Menu Grid */}
      <div className="px-6 mt-4 flex-1">
        <div className="grid grid-cols-3 gap-4">
          {/* Atualiza Humor */}
          <div 
            className="aspect-square bg-gray-800 rounded-xl flex flex-col items-center justify-center cursor-pointer"
            onClick={() => navigateTo('/atualizar-humor')}
          >
            <div className="h-12 w-12 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="w-8 h-8">
                <circle cx="12" cy="12" r="10" />
                <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                <line x1="9" y1="9" x2="9.01" y2="9" />
                <line x1="15" y1="9" x2="15.01" y2="9" />
              </svg>
            </div>
            <span className="text-yellow-500 text-sm mt-2 text-center">Atualiza Humor</span>
          </div>
          
          {/* Dias em sobriedade */}
          <div 
            className="aspect-square bg-gray-800 rounded-xl flex flex-col items-center justify-center cursor-pointer"
            onClick={() => navigateTo('/sobriety')}
          >
            <div className="h-12 w-12 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="w-8 h-8">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
                <path d="M9 16l2 2 4-4" />
              </svg>
            </div>
            <span className="text-yellow-500 text-sm mt-2 text-center">Dias em sobriedade</span>
          </div>
          
          {/* Devocional - Replacing the duplicate sobriety tile */}
          <div 
            className="aspect-square bg-gray-800 rounded-xl flex flex-col items-center justify-center cursor-pointer"
            onClick={() => navigateTo('/devotional')}
          >
            <div className="h-12 w-12 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="w-8 h-8">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <path d="M14 2v4a2 2 0 0 0 2 2h4" />
                <path d="M10 9v7" />
                <path d="M14 13h-8" />
              </svg>
            </div>
            <span className="text-yellow-500 text-sm mt-2 text-center">Devocional</span>
          </div>
          
          {/* Tarefas Diárias */}
          <div 
            className="aspect-square bg-gray-800 rounded-xl flex flex-col items-center justify-center cursor-pointer"
            onClick={() => navigateTo('/tasks')}
          >
            <div className="h-12 w-12 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="w-8 h-8">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <path d="M14 2v4a2 2 0 0 0 2 2h4" />
                <path d="M9 16l-3-3 1-1 2 2 4-4 1 1-5 5z" />
              </svg>
            </div>
            <span className="text-yellow-500 text-sm mt-2 text-center">Tarefas Diárias</span>
          </div>
          
          {/* Reflexão do Dia */}
          <div 
            className="aspect-square bg-gray-800 rounded-xl flex flex-col items-center justify-center cursor-pointer"
            onClick={() => navigateTo('/reflection')}
          >
            <div className="h-12 w-12 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="w-8 h-8">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v4" />
                <path d="M12 16h.01" />
              </svg>
            </div>
            <span className="text-yellow-500 text-sm mt-2 text-center">Reflexão do Dia</span>
          </div>
          
          {/* Termômetro da recuperação */}
          <div 
            className="aspect-square bg-gray-800 rounded-xl flex flex-col items-center justify-center cursor-pointer"
            onClick={() => navigateTo('/recovery')}
          >
            <div className="h-12 w-12 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="w-8 h-8">
                <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" />
              </svg>
            </div>
            <span className="text-yellow-500 text-sm mt-2 text-center">Termômetro da recuperação</span>
          </div>
          
          {/* Minhas conquistas */}
          <div 
            className="aspect-square bg-gray-800 rounded-xl flex flex-col items-center justify-center cursor-pointer"
            onClick={() => navigateTo('/achievements')}
          >
            <div className="h-12 w-12 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="w-8 h-8">
                <circle cx="12" cy="8" r="7" />
                <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
              </svg>
            </div>
            <span className="text-yellow-500 text-sm mt-2 text-center">Minhas conquistas</span>
          </div>
          
          {/* Cursos */}
          <div 
            className="aspect-square bg-gray-800 rounded-xl flex flex-col items-center justify-center cursor-pointer"
            onClick={() => navigateTo('/courses')}
          >
            <div className="h-12 w-12 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="w-8 h-8">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c3 3 9 3 12 0v-5" />
              </svg>
            </div>
            <span className="text-yellow-500 text-sm mt-2 text-center">Cursos</span>
          </div>
          
          {/* Fale comigo */}
          <div 
            className="aspect-square bg-gray-800 rounded-xl flex flex-col items-center justify-center cursor-pointer"
            onClick={() => navigateTo('/talk-to-me')}
          >
            <div className="h-12 w-12 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="w-8 h-8">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <span className="text-yellow-500 text-sm mt-2 text-center">Fale comigo</span>
          </div>
        </div>
      </div>

      {/* Bottom Navigation with updated links */}
      <div className="mt-auto p-4 bg-teal-400 rounded-t-3xl flex justify-around">
        <button 
          className="flex flex-col items-center justify-center"
          onClick={() => navigate('/dashboard')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6 text-white">
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          <span className="text-white text-xs mt-1">Inicial</span>
        </button>
        
        <button 
          className="flex flex-col items-center justify-center"
          onClick={handleLogout}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6 text-white">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          <span className="text-white text-xs mt-1">Sair</span>
        </button>
        
        <button 
          className="flex flex-col items-center justify-center"
          onClick={() => navigate('/emergency')}
        >
          <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center">
            <Siren className="h-6 w-6 text-white" />
          </div>
          <span className="text-white text-xs mt-1">Emergência</span>
        </button>
        
        <button 
          className="flex flex-col items-center justify-center"
          onClick={() => navigate('/settings')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6 text-white">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
          <span className="text-white text-xs mt-1">Configuração</span>
        </button>
        
        <button 
          className="flex flex-col items-center justify-center"
          onClick={() => navigate('/profile')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6 text-white">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          <span className="text-white text-xs mt-1">Perfil</span>
        </button>
      </div>
    </div>
  );
};

export default Dashboard;

import FamilyDashboard from '@/components/FamilyDashboard';
