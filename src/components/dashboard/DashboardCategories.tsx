
import React from 'react';
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { 
  SmilePlus, CalendarDays, CheckSquare, Thermometer, Star, 
  Award, BookOpen, Brain, Book, UserCircle, Settings
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
      icon: SmilePlus,
      path: '/atualizar-humor'
    }
  ];
  
  const adminCategories = [
    ...commonCategories,
    {
      id: 'users',
      title: 'Gerenciar Usuários',
      description: 'Administrar usuários do sistema',
      icon: UserCircle,
      path: '/admin/users'
    },
    {
      id: 'admin',
      title: 'Painel Administrativo',
      description: 'Acesso completo ao sistema',
      icon: Settings,
      path: '/admin'
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
      icon: CheckSquare,
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
      id: 'triggers',
      title: 'Gatilhos Diários',
      description: 'Reconheça e gerencie seus gatilhos',
      icon: Brain,
      path: '/triggers'
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
            className="p-4 flex flex-col items-center text-center cursor-pointer hover:bg-gray-50 transition-colors hover:scale-105 duration-200"
            onClick={() => navigate(category.path)}
          >
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-3 shadow-md">
              <category.icon className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-sm font-medium">{category.title}</h3>
            <p className="text-xs text-gray-500">{category.description}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};
