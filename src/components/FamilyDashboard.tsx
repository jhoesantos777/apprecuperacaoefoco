
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, BookOpen, MessageSquare, Star, Award, Calendar, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";

const FamilyDashboard = () => {
  const navigate = useNavigate();

  const familyCategories = [
    {
      id: 'support',
      title: 'Grupo de Apoio',
      description: 'Conecte-se com outras famílias',
      icon: Heart,
      path: '/support'
    },
    {
      id: 'courses',
      title: 'Cursos para Familiares',
      description: 'Aprenda sobre codependência',
      icon: BookOpen,
      path: '/courses'
    },
    {
      id: 'emergency',
      title: 'Contatos de Emergência',
      description: 'Acesso rápido aos contatos',
      icon: Bell,
      path: '/emergency'
    },
    {
      id: 'schedule',
      title: 'Agendar Consulta',
      description: 'Marque atendimento profissional',
      icon: Calendar,
      path: '/schedule'
    },
    {
      id: 'chat',
      title: 'Fale com Profissional',
      description: 'Tire suas dúvidas',
      icon: MessageSquare,
      path: '/chat'
    },
    {
      id: 'achievements',
      title: 'Jornada Familiar',
      description: 'Acompanhe seu progresso',
      icon: Award,
      path: '/achievements'
    },
  ];

  return (
    <div className="px-6 pb-20">
      <h2 className="text-xl font-semibold text-white mb-4">Apoio Familiar</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {familyCategories.map((category) => (
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

export default FamilyDashboard;
