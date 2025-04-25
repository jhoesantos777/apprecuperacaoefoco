import React from 'react';
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Home, Heart, Settings, User, CalendarDays, Smile, Thermometer, ListTodo, MessageSquare, Star, Award, BookOpen } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProfilePicture } from "@/components/ProfilePicture";

const Dashboard = () => {
  const navigate = useNavigate();
  
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

  const handleNotUsingToday = () => {
    // TODO: Implement registration of not using today
    // This should update the sobriety counter
    console.log("Registering not using today");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-600 to-teal-900">
      {/* Header */}
      <div className="p-6 flex items-center gap-4">
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

      {/* Not Using Today Button */}
      <div className="px-6 mb-8">
        <Button 
          className="w-full bg-red-600 hover:bg-red-700 text-white py-6 text-lg font-bold"
          onClick={handleNotUsingToday}
        >
          HOJE EU NAO VOU USAR!
        </Button>
      </div>

      {/* Categories */}
      <div className="px-6 pb-20"> {/* Added padding bottom to account for the navigation bar */}
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
