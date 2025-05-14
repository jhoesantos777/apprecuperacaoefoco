
import React, { useState, useEffect } from 'react';
import { useUserProfile } from '@/hooks/useUserProfile';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { ProfilePicture } from '@/components/ProfilePicture';
import { 
  Siren, 
  Crown, 
  Calendar,
  SmilePlus, 
  BookOpen, 
  CheckSquare, 
  MessageSquare, 
  Award, 
  GraduationCap, 
  AlertTriangle, 
  Thermometer 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from '@/components/ui/sonner';
import { Logo } from '@/components/Logo';
import { SobrietyButton } from '@/components/dashboard/SobrietyButton';
import { SobrietyMedals } from '@/components/dashboard/SobrietyMedals';

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

  // Função para determinar o nível do usuário
  const getUserLevel = (sobrietyDays: number | null | undefined) => {
    const days = sobrietyDays || 0;
    if (days >= 7300) return { name: "🦕 Dinossauro da Recuperação", color: "from-purple-500 to-pink-500" };
    if (days >= 3650) return { name: "👑 Lenda Viva", color: "from-yellow-500 to-orange-500" };
    if (days >= 1825) return { name: "🛡️ Guardião da Sobriedade", color: "from-blue-500 to-indigo-500" };
    if (days >= 1095) return { name: "🧠 Mestre da Consciência", color: "from-green-500 to-teal-500" };
    if (days >= 730) return { name: "🎖️ Guardião da Esperança", color: "from-red-500 to-orange-500" };
    if (days >= 365) return { name: "🏆 Sentinela da Vida", color: "from-yellow-400 to-yellow-600" };
    if (days >= 270) return { name: "🕊️ Liberdade Interior", color: "from-blue-400 to-blue-600" };
    if (days >= 180) return { name: "⚔️ Guerreiro da Esperança", color: "from-purple-400 to-purple-600" };
    if (days >= 90) return { name: "☀️ Clareza da Alma", color: "from-orange-400 to-orange-600" };
    if (days >= 30) return { name: "🧱 Muralha de Vontade", color: "from-green-400 to-green-600" };
    if (days >= 15) return { name: "🌱 Raízes Fortes", color: "from-teal-400 to-teal-600" };
    if (days >= 7) return { name: "🧭 Novo Caminho", color: "from-indigo-400 to-indigo-600" };
    return { name: "🥇 Primeira Luz", color: "from-gray-400 to-gray-600" };
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#2d0036] to-black relative overflow-hidden">
      {/* Textura grain */}
      <div className="pointer-events-none fixed inset-0 z-0 opacity-30 mix-blend-soft-light" style={{backgroundImage: 'url("https://www.transparenttextures.com/patterns/asfalt-dark.png")'}} />
      
      {/* Logo no topo da página */}
      <motion.div 
        className="w-full pt-6 flex justify-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Logo size="lg" />
      </motion.div>
      
      {/* Header com perfil do usuário */}
      <motion.div 
        className="p-6 flex flex-row items-start mt-2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Foto do Usuário no canto esquerdo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full blur-lg opacity-50 animate-pulse"></div>
          <ProfilePicture
            avatarUrl={profile?.avatar_url}
            userId={profile?.id || ''}
            userName={profile?.nome}
            size="lg"
          />
        </motion.div>

        {/* Informações do usuário ao lado da foto */}
        <div className="flex-1 ml-5">
          <motion.div 
            className="space-y-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            {/* "Seja bem-vindo(a)" acima do nome */}
            <p className="text-sm text-white/80">
              Seja bem-vindo(a)
            </p>
            
            {/* Nome do usuário */}
            <h2 className="text-2xl font-bold text-white">
              {profile?.nome || 'Usuário'}
            </h2>
            
            {/* Versão do aplicativo em dourado */}
            <p className="text-xs font-bold text-amber-400 italic tracking-wide">
              PHILOS (BETA)
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Medalhas e insignias */}
      <motion.div 
        className="px-6 py-4 w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
      >
        {/* Container para os dois badges de medalhas lado a lado */}
        <div className="grid grid-cols-2 gap-4">
          {/* Medalha de Sobriedade */}
          <motion.div 
            className="bg-gradient-to-br from-[#2d0036]/60 to-black/60 p-4 rounded-xl backdrop-blur-sm border border-purple-900/50"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center mb-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg relative">
                <Crown className="w-5 h-5 text-white" />
              </div>
              <div className="ml-3">
                <p className="text-xs text-white/80 font-medium">Sobriedade</p>
                <SobrietyMedals 
                  medals={[]} 
                  compact={true} 
                  daysCount={profile?.dias_sobriedade || 0} 
                  variant="sobriety"
                />
              </div>
            </div>
            <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-yellow-400 to-yellow-600"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, (profile?.dias_sobriedade || 0) / 3.65)}%` }}
                transition={{ delay: 1, duration: 1 }}
              />
            </div>
          </motion.div>

          {/* Medalha de Uso do App */}
          <motion.div 
            className="bg-gradient-to-br from-[#2d0036]/60 to-black/60 p-4 rounded-xl backdrop-blur-sm border border-purple-900/50"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center mb-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg relative">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div className="ml-3">
                <p className="text-xs text-white/80 font-medium">No Aplicativo</p>
                <SobrietyMedals 
                  medals={[]} 
                  compact={true} 
                  daysCount={profile?.mood_points || 0} 
                  variant="app"
                />
              </div>
            </div>
            <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-blue-400 to-blue-600"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, (profile?.mood_points || 0) / 3.65)}%` }}
                transition={{ delay: 1, duration: 1 }}
              />
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Botão de confirmação de sobriedade */}
      <motion.div 
        className="mt-4 px-6"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <motion.button
          onClick={handleSobrietyConfirmation}
          disabled={hasConfirmedSobriety}
          className={`w-full py-4 rounded-[16px] text-white font-bold text-lg relative overflow-hidden backdrop-blur-sm ${
            hasConfirmedSobriety 
              ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 shadow-[0_8px_30px_rgba(16,185,129,0.2)]' 
              : 'bg-gradient-to-r from-red-600 to-red-500 shadow-[0_8px_30px_rgba(239,68,68,0.2)] hover:shadow-[0_8px_30px_rgba(239,68,68,0.3)]'
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <motion.div
            className="absolute inset-0 bg-white/20"
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ repeat: Infinity, duration: 2 }}
          />
          <div className="relative z-10 flex items-center justify-center gap-3">
            {hasConfirmedSobriety ? (
              <>
                <span className="drop-shadow-lg">SOBRIEDADE CONFIRMADA HOJE</span>
                <motion.div
                  className="text-2xl"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  ✓
                </motion.div>
              </>
            ) : (
              <>
                <span className="drop-shadow-lg">HOJE EU NÃO VOU USAR!</span>
                <motion.div
                  className="text-2xl"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  !
                </motion.div>
              </>
            )}
          </div>
        </motion.button>
      </motion.div>

      {/* Menu Grid com efeito de vidro e animações */}
      <div className="px-2 sm:px-6 mt-5 flex-1 overflow-x-auto z-10">
        <motion.div 
          className="flex gap-4 sm:gap-5 pb-4 min-w-max"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Como você está? */}
          <motion.div 
            className="aspect-square w-[140px] sm:w-[180px] bg-gradient-to-br from-[#2d0036] to-black rounded-2xl flex flex-col items-center justify-center cursor-pointer border border-[#4b206b] shadow-xl hover:shadow-2xl hover:ring-2 hover:ring-[#a259ec] transition-all duration-300 group"
            onClick={() => navigateTo('/atualizar-humor')}
            variants={itemVariants}
            whileHover={{ scale: 1.08, rotate: 2 }}
            whileTap={{ scale: 0.97 }}
          >
            <motion.div 
              className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-[#a259ec] to-[#4b206b] mb-3 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all"
            >
              <SmilePlus className="w-10 h-10 sm:w-12 sm:h-12 text-white drop-shadow-lg" />
            </motion.div>
            <span className="text-white text-base sm:text-lg text-center font-bold tracking-tight mt-1">Como você está?</span>
          </motion.div>
          
          {/* Diário da Sobriedade */}
          <motion.div 
            className="aspect-square w-[140px] sm:w-[180px] bg-gradient-to-br from-[#2d0036] to-black rounded-2xl flex flex-col items-center justify-center cursor-pointer border border-[#4b206b] shadow-xl hover:shadow-2xl hover:ring-2 hover:ring-[#a259ec] transition-all duration-300 group"
            onClick={() => navigateTo('/sobriety')}
            variants={itemVariants}
            whileHover={{ scale: 1.08, rotate: -2 }}
            whileTap={{ scale: 0.97 }}
          >
            <motion.div 
              className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-[#a259ec] to-[#4b206b] mb-3 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all"
            >
              <Calendar className="w-10 h-10 sm:w-12 sm:h-12 text-white drop-shadow-lg" />
            </motion.div>
            <span className="text-white text-base sm:text-lg text-center font-bold tracking-tight mt-1">Diário da Sobriedade</span>
          </motion.div>
          
          {/* Devocional */}
          <motion.div 
            className="aspect-square w-[140px] sm:w-[180px] bg-gradient-to-br from-[#2d0036] to-black rounded-2xl flex flex-col items-center justify-center cursor-pointer border border-[#4b206b] shadow-xl hover:shadow-2xl hover:ring-2 hover:ring-[#a259ec] transition-all duration-300 group"
            onClick={() => navigateTo('/devotional')}
            variants={itemVariants}
            whileHover={{ scale: 1.08, rotate: 2 }}
            whileTap={{ scale: 0.97 }}
          >
            <motion.div 
              className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-[#a259ec] to-[#4b206b] mb-3 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all"
            >
              <BookOpen className="w-10 h-10 sm:w-12 sm:h-12 text-white drop-shadow-lg" />
            </motion.div>
            <span className="text-white text-base sm:text-lg text-center font-bold tracking-tight mt-1">Devocional</span>
          </motion.div>
          
          {/* Tarefas Diárias */}
          <motion.div 
            className="aspect-square w-[140px] sm:w-[180px] bg-gradient-to-br from-[#2d0036] to-black rounded-2xl flex flex-col items-center justify-center cursor-pointer border border-[#4b206b] shadow-xl hover:shadow-2xl hover:ring-2 hover:ring-[#a259ec] transition-all duration-300 group"
            onClick={() => navigateTo('/tasks')}
            variants={itemVariants}
            whileHover={{ scale: 1.08, rotate: -2 }}
            whileTap={{ scale: 0.97 }}
          >
            <motion.div 
              className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-[#a259ec] to-[#4b206b] mb-3 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all"
            >
              <CheckSquare className="w-10 h-10 sm:w-12 sm:h-12 text-white drop-shadow-lg" />
            </motion.div>
            <span className="text-white text-base sm:text-lg text-center font-bold tracking-tight mt-1">Tarefas Diárias</span>
          </motion.div>
          
          {/* Reflexão do Dia */}
          <motion.div 
            className="aspect-square w-[140px] sm:w-[180px] bg-gradient-to-br from-[#2d0036] to-black rounded-2xl flex flex-col items-center justify-center cursor-pointer border border-[#4b206b] shadow-xl hover:shadow-2xl hover:ring-2 hover:ring-[#a259ec] transition-all duration-300 group"
            onClick={() => navigateTo('/reflection')}
            variants={itemVariants}
            whileHover={{ scale: 1.08, rotate: 2 }}
            whileTap={{ scale: 0.97 }}
          >
            <motion.div 
              className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-[#a259ec] to-[#4b206b] mb-3 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all"
            >
              <MessageSquare className="w-10 h-10 sm:w-12 sm:h-12 text-white drop-shadow-lg" />
            </motion.div>
            <span className="text-white text-base sm:text-lg text-center font-bold tracking-tight mt-1">Reflexão do Dia</span>
          </motion.div>
          
          {/* Termômetro da recuperação */}
          <motion.div 
            className="aspect-square w-[140px] sm:w-[180px] bg-gradient-to-br from-[#2d0036] to-black rounded-2xl flex flex-col items-center justify-center cursor-pointer border border-[#4b206b] shadow-xl hover:shadow-2xl hover:ring-2 hover:ring-[#a259ec] transition-all duration-300 group"
            onClick={() => navigateTo('/recovery')}
            variants={itemVariants}
            whileHover={{ scale: 1.08, rotate: -2 }}
            whileTap={{ scale: 0.97 }}
          >
            <motion.div 
              className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-[#a259ec] to-[#4b206b] mb-3 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all"
            >
              <Thermometer className="w-10 h-10 sm:w-12 sm:h-12 text-white drop-shadow-lg" />
            </motion.div>
            <span className="text-white text-base sm:text-lg text-center font-bold tracking-tight mt-1">Termômetro</span>
          </motion.div>
          
          {/* Minhas conquistas */}
          <motion.div 
            className="aspect-square w-[140px] sm:w-[180px] bg-gradient-to-br from-[#2d0036] to-black rounded-2xl flex flex-col items-center justify-center cursor-pointer border border-[#4b206b] shadow-xl hover:shadow-2xl hover:ring-2 hover:ring-[#a259ec] transition-all duration-300 group"
            onClick={() => navigateTo('/achievements')}
            variants={itemVariants}
            whileHover={{ scale: 1.08, rotate: 2 }}
            whileTap={{ scale: 0.97 }}
          >
            <motion.div 
              className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-[#a259ec] to-[#4b206b] mb-3 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all"
            >
              <Award className="w-10 h-10 sm:w-12 sm:h-12 text-white drop-shadow-lg" />
            </motion.div>
            <span className="text-white text-base sm:text-lg text-center font-bold tracking-tight mt-1">Conquistas</span>
          </motion.div>
          
          {/* Cursos */}
          <motion.div 
            className="aspect-square w-[140px] sm:w-[180px] bg-gradient-to-br from-[#2d0036] to-black rounded-2xl flex flex-col items-center justify-center cursor-pointer border border-[#4b206b] shadow-xl hover:shadow-2xl hover:ring-2 hover:ring-[#a259ec] transition-all duration-300 group"
            onClick={() => navigateTo('/courses')}
            variants={itemVariants}
            whileHover={{ scale: 1.08, rotate: -2 }}
            whileTap={{ scale: 0.97 }}
          >
            <motion.div 
              className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-[#a259ec] to-[#4b206b] mb-3 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all"
            >
              <GraduationCap className="w-10 h-10 sm:w-12 sm:h-12 text-white drop-shadow-lg" />
            </motion.div>
            <span className="text-white text-base sm:text-lg text-center font-bold tracking-tight mt-1">Cursos</span>
          </motion.div>
          
          {/* Gatilhos Diários */}
          <motion.div 
            className="aspect-square w-[140px] sm:w-[180px] bg-gradient-to-br from-[#2d0036] to-black rounded-2xl flex flex-col items-center justify-center cursor-pointer border border-[#4b206b] shadow-xl hover:shadow-2xl hover:ring-2 hover:ring-[#a259ec] transition-all duration-300 group"
            onClick={() => navigateTo('/triggers')}
            variants={itemVariants}
            whileHover={{ scale: 1.08, rotate: 2 }}
            whileTap={{ scale: 0.97 }}
          >
            <motion.div 
              className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-[#a259ec] to-[#4b206b] mb-3 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all"
            >
              <AlertTriangle className="w-10 h-10 sm:w-12 sm:h-12 text-white drop-shadow-lg" />
            </motion.div>
            <span className="text-white text-base sm:text-lg text-center font-bold tracking-tight mt-1">Gatilhos Diários</span>
          </motion.div>
          
          {/* Irmandade */}
          <motion.div 
            className="aspect-square w-[140px] sm:w-[180px] bg-gradient-to-br from-[#2d0036] to-black rounded-2xl flex flex-col items-center justify-center cursor-pointer border border-[#4b206b] shadow-xl hover:shadow-2xl hover:ring-2 hover:ring-[#a259ec] transition-all duration-300 group"
            onClick={() => navigateTo('/usuarios')}
            variants={itemVariants}
            whileHover={{ scale: 1.08, rotate: 2 }}
            whileTap={{ scale: 0.97 }}
          >
            <motion.div 
              className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-[#a259ec] to-[#4b206b] mb-3 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10 sm:w-12 sm:h-12 text-white drop-shadow-lg">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 0 0-3-3.87M9 20H4v-2a4 4 0 0 1 3-3.87m9-6.13a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM6 7a4 4 0 1 0 8 0 4 4 0 0 0-8 0Z" />
              </svg>
            </motion.div>
            <span className="text-white text-base sm:text-lg text-center font-bold tracking-tight mt-1">Irmandade</span>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom Navigation com efeito de vidro */}
      <motion.div 
        className="mt-auto p-4 backdrop-blur-xl bg-white/10 border-t border-white/20 rounded-t-3xl flex justify-around"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <motion.button 
          className="flex flex-col items-center justify-center"
          onClick={() => navigate('/dashboard')}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6 text-white">
            <path d="m3 9 9-7 9 7v11a2 2 0 0 0-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          </div>
          <span className="text-white text-xs mt-2 font-medium">Inicial</span>
        </motion.button>
        
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
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l-.06.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
          <span className="text-white text-xs mt-1">Configuração</span>
        </button>
        
        <button 
          className="flex flex-col items-center justify-center"
          onClick={() => navigate('/profile')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6 text-white">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 1-4 4v2" />
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
