
import React, { useState, useEffect } from 'react';
import { useUserProfile } from '@/hooks/useUserProfile';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { ProfilePicture } from '@/components/ProfilePicture';
import { Crown, Siren, BarChart3, Calendar, BookOpen, CheckCircle, MessageSquare, Award, GraduationCap, MessageCircle, Thermometer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { toast } from '@/components/ui/sonner';

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

    // Check if sobriety has been confirmed today
    const checkSobrietyStatus = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const today = new Date().toISOString().split('T')[0];
        
        const { data } = await supabase
          .from('sobriety_declarations')
          .select('*')
          .eq('user_id', user.id)
          .gte('declared_at', today);
          
        setHasConfirmedSobriety(data && data.length > 0);
      } catch (error) {
        console.error("Error checking sobriety status:", error);
      }
    };
    
    checkSobrietyStatus();
  }, []);

  const { data: profile } = useUserProfile(userRole);

  const handleSobrietyConfirmation = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Você precisa estar logado para confirmar sobriedade");
        return;
      }

      const { error } = await supabase
        .from('sobriety_declarations')
        .insert([{ 
          user_id: user.id,
          declared_at: new Date().toISOString()
        }]);
        
      if (error) throw error;
      
      setHasConfirmedSobriety(true);
      
      // Register activity points
      await supabase
        .from('atividades_usuario')
        .insert([{
          user_id: user.id,
          tipo_atividade: 'HojeNãoVouUsar',
          pontos: 20,
          descricao: 'Declaração de sobriedade',
          data_registro: new Date().toISOString()
        }]);
        
      toast.success("Parabéns pela sua decisão hoje!");
    } catch (error) {
      console.error("Error confirming sobriety:", error);
      toast.error("Não foi possível registrar sua declaração");
    }
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      } 
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <motion.div 
        className="p-6 glass"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-white text-lg mb-1 opacity-90">Seja bem vindo</h2>
            <h1 className="text-white text-2xl font-bold">{profile?.nome || '(nome do usuário)'}</h1>
            <div className="flex items-center mt-1">
              <Crown className="h-4 w-4 text-yellow-300" />
              <span className="text-white text-sm ml-1 opacity-80">Versão beta</span>
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
        <motion.div 
          className="mt-6"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <button
            onClick={handleSobrietyConfirmation}
            disabled={hasConfirmedSobriety}
            className={`w-full py-4 rounded-[18px] text-white font-bold text-lg shadow-lg hover-scale ${
              hasConfirmedSobriety 
                ? 'bg-gradient-to-r from-emerald-600 to-emerald-500' 
                : 'bg-gradient-to-r from-red-600 to-red-500'
            }`}
          >
            {hasConfirmedSobriety ? 'SOBRIEDADE CONFIRMADA HOJE ✓' : 'HOJE EU NÃO VOU USAR!'}
          </button>
        </motion.div>
      </motion.div>

      {/* Menu Grid */}
      <div className="px-6 mt-4 flex-1">
        <motion.div 
          className="grid grid-cols-3 gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Atualiza Humor */}
          <motion.div 
            className="aspect-square glass flex flex-col items-center justify-center cursor-pointer hover-scale"
            onClick={() => navigateTo('/atualizar-humor')}
            variants={itemVariants}
          >
            <div className="h-12 w-12 flex items-center justify-center mb-2">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
            <span className="text-white text-sm text-center font-medium">Atualiza Humor</span>
          </motion.div>
          
          {/* Dias em sobriedade */}
          <motion.div 
            className="aspect-square glass flex flex-col items-center justify-center cursor-pointer hover-scale"
            onClick={() => navigateTo('/sobriety')}
            variants={itemVariants}
          >
            <div className="h-12 w-12 flex items-center justify-center mb-2">
              <Calendar className="w-8 h-8 text-white" />
            </div>
            <span className="text-white text-sm text-center font-medium">Dias em sobriedade</span>
          </motion.div>
          
          {/* Devocional */}
          <motion.div 
            className="aspect-square glass flex flex-col items-center justify-center cursor-pointer hover-scale"
            onClick={() => navigateTo('/devotional')}
            variants={itemVariants}
          >
            <div className="h-12 w-12 flex items-center justify-center mb-2">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <span className="text-white text-sm text-center font-medium">Devocional</span>
          </motion.div>
          
          {/* Tarefas Diárias */}
          <motion.div 
            className="aspect-square glass flex flex-col items-center justify-center cursor-pointer hover-scale"
            onClick={() => navigateTo('/tasks')}
            variants={itemVariants}
          >
            <div className="h-12 w-12 flex items-center justify-center mb-2">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <span className="text-white text-sm text-center font-medium">Tarefas Diárias</span>
          </motion.div>
          
          {/* Reflexão do Dia */}
          <motion.div 
            className="aspect-square glass flex flex-col items-center justify-center cursor-pointer hover-scale"
            onClick={() => navigateTo('/reflection')}
            variants={itemVariants}
          >
            <div className="h-12 w-12 flex items-center justify-center mb-2">
              <MessageSquare className="w-8 h-8 text-white" />
            </div>
            <span className="text-white text-sm text-center font-medium">Reflexão do Dia</span>
          </motion.div>
          
          {/* Termômetro da recuperação */}
          <motion.div 
            className="aspect-square glass flex flex-col items-center justify-center cursor-pointer hover-scale"
            onClick={() => navigateTo('/recovery')}
            variants={itemVariants}
          >
            <div className="h-12 w-12 flex items-center justify-center mb-2">
              <Thermometer className="w-8 h-8 text-white" />
            </div>
            <span className="text-white text-sm text-center font-medium">Termômetro</span>
          </motion.div>
          
          {/* Minhas conquistas */}
          <motion.div 
            className="aspect-square glass flex flex-col items-center justify-center cursor-pointer hover-scale"
            onClick={() => navigateTo('/achievements')}
            variants={itemVariants}
          >
            <div className="h-12 w-12 flex items-center justify-center mb-2">
              <Award className="w-8 h-8 text-white" />
            </div>
            <span className="text-white text-sm text-center font-medium">Conquistas</span>
          </motion.div>
          
          {/* Cursos */}
          <motion.div 
            className="aspect-square glass flex flex-col items-center justify-center cursor-pointer hover-scale"
            onClick={() => navigateTo('/courses')}
            variants={itemVariants}
          >
            <div className="h-12 w-12 flex items-center justify-center mb-2">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <span className="text-white text-sm text-center font-medium">Cursos</span>
          </motion.div>
          
          {/* Fale comigo */}
          <motion.div 
            className="aspect-square glass flex flex-col items-center justify-center cursor-pointer hover-scale"
            onClick={() => navigateTo('/talk-to-me')}
            variants={itemVariants}
          >
            <div className="h-12 w-12 flex items-center justify-center mb-2">
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
            <span className="text-white text-sm text-center font-medium">Fale comigo</span>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom Navigation */}
      <motion.div 
        className="mt-auto p-4 glass rounded-t-3xl flex justify-around"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
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
      </motion.div>
    </div>
  );
};

export default Dashboard;

import FamilyDashboard from '@/components/FamilyDashboard';
