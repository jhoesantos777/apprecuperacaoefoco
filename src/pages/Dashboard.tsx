import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Home, Heart, Settings, User, CalendarDays, Smile, Thermometer, ListTodo, MessageSquare, Star, Award, BookOpen, LogOut } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProfilePicture } from "@/components/ProfilePicture";
import { useToast } from "@/hooks/use-toast";
import FamilyDashboard from "@/components/FamilyDashboard";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [hasConfirmedSobriety, setHasConfirmedSobriety] = useState(false);
  
  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
        
      return profile;
    },
  });

  const sobrietyDeclaration = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { error } = await supabase
        .from('sobriety_declarations')
        .insert([
          {
            user_id: user.id,
            declared_at: new Date().toISOString()
          }
        ]);

      if (error) throw error;
    },
    onSuccess: () => {
      setHasConfirmedSobriety(true);
      queryClient.invalidateQueries({ queryKey: ['recovery-score'] });
      toast({
        title: "Parabéns!",
        description: "Sua determinação é inspiradora. Continue firme!",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Não foi possível registrar sua declaração.",
        variant: "destructive",
      });
      console.error('Error registering sobriety declaration:', error);
    },
  });

  const handleNotUsingToday = () => {
    sobrietyDeclaration.mutate();
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
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

  const categories = [
    {
      id: 'sobriety',
      title: 'Dias em sobriedade',
      description: 'Aqui ficará contabilidades dos dias, somando 1 a cada dia que registrar hoje eu não vou usar',
      icon: CalendarDays,
      path: '/sobriety'
    },
    {
      id: 'humor',
      title: 'Humor hoje',
      description: 'Registre como está seu humor',
      icon: Smile,
      path: '/mood'
    },
    {
      id: 'tasks',
      title: 'Tarefas Diárias',
      description: 'Complete suas atividades do dia',
      icon: ListTodo,
      path: '/tasks'
    },
    {
      id: 'thermometer',
      title: 'Termômetro da recuperação',
      description: 'Acompanhe seu progresso',
      icon: Thermometer,
      path: '/recovery'
    },
    {
      id: 'reflection',
      title: 'Reflexão do dia',
      description: 'Momento de reflexão',
      icon: Star,
      path: '/reflection'
    },
    {
      id: 'achievements',
      title: 'Minhas Conquistas',
      description: 'Suas vitórias e marcos importantes',
      icon: Award,
      path: '/achievements'
    },
    {
      id: 'courses',
      title: 'Cursos',
      description: 'Aprenda mais',
      icon: BookOpen,
      path: '/courses'
    },
    {
      id: 'consultations',
      title: 'Consultas',
      description: 'Agende consultas',
      icon: MessageSquare,
      path: '/schedule'
    },
    {
      id: 'devotional',
      title: 'Devocional',
      description: 'Momento espiritual',
      icon: Star,
      path: '/devotional'
    },
    {
      id: 'chat',
      title: 'Fale comigo',
      description: 'Converse conosco',
      icon: MessageSquare,
      path: '/chat'
    },
    {
      id: 'treatments',
      title: 'Tratamentos',
      description: 'Seus tratamentos',
      icon: Heart,
      path: '/treatments'
    },
    {
      id: 'support',
      title: 'centro de apoio',
      description: 'Busque ajuda',
      icon: Heart,
      path: '/support'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-600 to-teal-900">
      {/* Header */}
      <div className="p-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <ProfilePicture
            avatarUrl={profile?.avatar_url}
            userId={profile?.id || ''}
            userName={profile?.nome}
            size="lg"
          />
          <div>
            <h1 className="text-2xl font-bold text-white">Bem vindo</h1>
            <p className="text-white/90">{profile?.nome || 'Usuário'}</p>
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

      {/* Conditional Content Based on User Type */}
      {profile?.tipoUsuario === "family" ? (
        <FamilyDashboard />
      ) : (
        <>
          {/* Not Using Today Button */}
          <div className="px-6 mb-8">
            <Button 
              className={`w-full py-6 text-lg font-bold transition-all duration-300 ${
                hasConfirmedSobriety 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'bg-red-600 hover:bg-red-700'
              } text-white`}
              onClick={handleNotUsingToday}
              disabled={hasConfirmedSobriety}
            >
              {hasConfirmedSobriety 
                ? "A SOBRIEDADE É UMA CONQUISTA DIÁRIA ✨" 
                : "HOJE EU NAO VOU USAR!"}
            </Button>
          </div>

          {/* Categories */}
          <div className="px-6 pb-20">
            <h2 className="text-xl font-semibold text-white mb-4">Categorias</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {categories.map((category) => (
                <Card 
                  key={category.id}
                  className="p-4 flex flex-col items-center text-center cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => navigate(category.path)}
                >
                  <category.icon className="h-8 w-8 text-blue-600 mb-2" />
                  <h3 className="text-sm font-medium">{category.title}</h3>
                  <p className="text-xs text-gray-500">{category.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Bottom Navigation */}
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
    </div>
  );
};

export default Dashboard;
