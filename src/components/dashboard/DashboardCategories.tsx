
import React from 'react';
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { 
  Smile, 
  CalendarDays, 
  ListTodo, 
  Thermometer, 
  Star, 
  Award, 
  BookOpen, 
  MessageCircle, 
  Book,
  User,
  Heart,
  Settings
} from "lucide-react";

type Category = {
  id: string;
  title: string;
  description: string;
  icon: any;
  path: string;
};

const getDashboardCategories = (userRole: string): Category[] => {
  const commonCategories = [
    {
      id: 'mood',
      title: 'Atualizar Humor',
      description: 'Como você está se sentindo hoje?',
      icon: Smile,
      path: '/atualizar-humor'
    }
  ];
  
  const adminCategories = [
    ...commonCategories,
    {
      id: 'users',
      title: 'Gerenciar Usuários',
      description: 'Administrar usuários do sistema',
      icon: User,
      path: '/admin/users'
    },
    {
      id: 'admin-dashboard',
      title: 'Painel de Administração',
      description: 'Configurações do sistema',
      icon: Settings,
      path: '/admin/dashboard'
    }
  ];
  
  const dependentCategories = [
    ...commonCategories,
    {
      id: 'sobriety',
      title: 'Dias em sobriedade',
      description: 'Aqui ficará contabilidades dos dias, somando 1 a cada dia que registrar hoje eu não vou usar',
      icon: CalendarDays,
      path: '/sobriety'
    },
    {
      id: 'devotional',
      title: 'Devocional',
      description: 'Reflexão diária e meditação',
      icon: Book,
      path: '/devotional'
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
      id: 'chat',
      title: 'Fale comigo',
      description: 'Converse com um terapeuta especializado em dependência química',
      icon: MessageCircle,
      path: '/chat'
    },
    {
      id: 'therapeutic',
      title: 'Atividades Terapêuticas',
      description: 'Exercícios e ferramentas para sua recuperação',
      icon: Heart,
      path: '/therapeutic'
    }
  ];

  if (userRole === 'admin') return adminCategories;
  if (userRole === 'family') return commonCategories;
  return dependentCategories;
};

type DashboardCategoriesProps = {
  userRole: string;
};

export const DashboardCategories = ({ userRole }: DashboardCategoriesProps) => {
  const navigate = useNavigate();
  const categories = getDashboardCategories(userRole);

  return (
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
  );
};
