
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Brain, Book, Lamp, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BackButton } from "@/components/BackButton";

const TherapeuticActivities = [
  {
    title: "Meditação Guiada",
    description: "Práticas de mindfulness para reduzir ansiedade e estresse",
    icon: Brain,
    route: "/meditation", // Updated route
    color: "text-purple-500"
  },
  {
    title: "Diário Terapêutico",
    description: "Registre seus pensamentos e emoções diariamente",
    icon: Book,
    route: "/journal",
    color: "text-blue-500"
  },
  {
    title: "Técnicas de Relaxamento",
    description: "Exercícios para momentos de ansiedade",
    icon: Heart,
    route: "/relaxation",
    color: "text-red-500"
  },
  {
    title: "Auto-reflexão",
    description: "Perguntas para desenvolver autoconhecimento",
    icon: Lamp,
    route: "/self-reflection",
    color: "text-yellow-500"
  },
  {
    title: "Grupo de Apoio Virtual",
    description: "Conecte-se com pessoas que compartilham experiências similares",
    icon: MessageCircle,
    route: "/support-group",
    color: "text-green-500"
  }
];

const Therapeutic = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-600 to-teal-900 p-6">
      <BackButton />
      
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center text-white mb-8">
          <h1 className="text-3xl font-bold mb-4">Atividades Terapêuticas</h1>
          <p className="text-lg opacity-90">
            Ferramentas e exercícios para auxiliar no seu tratamento e prevenção de recaídas
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TherapeuticActivities.map((activity, index) => (
            <Card 
              key={index}
              className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => navigate(activity.route)}
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <activity.icon className={`w-12 h-12 ${activity.color}`} />
                <h3 className="text-lg font-semibold">{activity.title}</h3>
                <p className="text-sm text-gray-600">{activity.description}</p>
                <Button variant="outline" className="mt-4">
                  Começar
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Therapeutic;
