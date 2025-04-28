import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Smile,
  Book,
  ListTodo,
  MessageSquare,
  Award,
  BookOpen,
  Brain,
  ArrowLeft
} from "lucide-react";
import { toast } from "sonner";

const AdminDashboard = () => {
  const navigate = useNavigate();

  React.useEffect(() => {
    // Verificar se o usuário é administrador
    const userRole = localStorage.getItem("userRole");
    if (userRole !== "admin") {
      toast.error("Acesso não autorizado");
      navigate("/dashboard");
    }
  }, [navigate]);

  const adminCategories = [
    {
      id: 'users',
      title: 'Gerenciar Usuários',
      description: 'Visualize, edite ou desative contas de usuários',
      icon: LayoutDashboard,
      path: '/admin/users'
    },
    {
      id: 'mood',
      title: 'Editor de Humor',
      description: 'Configure emoções disponíveis e suas pontuações',
      icon: Smile,
      path: '/admin/mood-editor'
    },
    {
      id: 'devotional',
      title: 'Devocional',
      description: 'Gerencie versículos e reflexões diárias',
      icon: Book,
      path: '/admin/devotional-editor'
    },
    {
      id: 'tasks',
      title: 'Tarefas Diárias',
      description: 'Configure tarefas e pontuações',
      icon: ListTodo,
      path: '/admin/tasks-editor'
    },
    {
      id: 'reflections',
      title: 'Reflexões do Dia',
      description: 'Adicione e edite reflexões com texto e áudio',
      icon: MessageSquare,
      path: '/admin/reflections-editor'
    },
    {
      id: 'achievements',
      title: 'Conquistas',
      description: 'Configure medalhas e metas de sobriedade',
      icon: Award,
      path: '/admin/achievements-editor'
    },
    {
      id: 'courses',
      title: 'Cursos',
      description: 'Gerencie cursos disponíveis',
      icon: BookOpen,
      path: '/admin/courses-editor'
    },
    {
      id: 'therapeutic',
      title: 'Atividades Terapêuticas',
      description: 'Configure atividades com texto e áudio',
      icon: Brain,
      path: '/admin/therapeutic-editor'
    },
    {
      id: 'devotional',
      title: 'Devocional',
      description: 'Gerencie versículos e reflexões diárias',
      icon: Book,
      path: '/admin/devotional-editor'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-600 to-teal-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">Painel de Administração</h1>
          <Button 
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar ao Dashboard
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {adminCategories.map((category) => (
            <Card 
              key={category.id}
              className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => navigate(category.path)}
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <category.icon className="w-12 h-12 text-blue-600" />
                <h3 className="text-lg font-semibold">{category.title}</h3>
                <p className="text-sm text-gray-600">{category.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
