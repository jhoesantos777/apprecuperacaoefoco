import React from 'react';
import { BackButton } from '@/components/BackButton';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

const Premium = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [selectedPlan, setSelectedPlan] = useState<"free" | "premium">("free");

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <div className="p-6">
        <BackButton />
        
        <h1 className={`text-3xl font-bold mb-8 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Escolha seu plano
        </h1>

        <div className="grid gap-6 max-w-md mx-auto">
          <div
            className={`p-6 rounded-lg border-2 cursor-pointer transition-all ${
              selectedPlan === "free"
                ? "border-primary"
                : "border-gray-200 hover:border-primary/50"
            } ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'}`}
            onClick={() => setSelectedPlan("free")}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Gratuito</h2>
              {selectedPlan === "free" && <Check className="text-primary" />}
            </div>
            <p className="text-2xl font-bold mb-4">R$ 0,00</p>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <Check size={16} className="text-green-500" />
                Recursos básicos
              </li>
              <li className="flex items-center gap-2">
                <Check size={16} className="text-green-500" />
                Suporte por email
              </li>
            </ul>
          </div>

          <div
            className={`p-6 rounded-lg border-2 cursor-pointer transition-all ${
              selectedPlan === "premium"
                ? "border-primary"
                : "border-gray-200 hover:border-primary/50"
            } ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'}`}
            onClick={() => setSelectedPlan("premium")}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Premium</h2>
              {selectedPlan === "premium" && <Check className="text-primary" />}
            </div>
            <p className="text-2xl font-bold mb-4">R$ 19,90/mês</p>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <Check size={16} className="text-green-500" />
                Todos os recursos básicos
              </li>
              <li className="flex items-center gap-2">
                <Check size={16} className="text-green-500" />
                Suporte prioritário
              </li>
              <li className="flex items-center gap-2">
                <Check size={16} className="text-green-500" />
                Recursos exclusivos
              </li>
            </ul>
          </div>
        </div>

        <Button
          className="w-full mt-8 max-w-md mx-auto block"
          onClick={() => {
            if (selectedPlan === "premium") {
              // Implement premium upgrade logic here
              console.log("Upgrading to premium...");
            }
            navigate("/settings");
          }}
        >
          {selectedPlan === "premium" ? "Fazer upgrade" : "Continuar com plano gratuito"}
        </Button>
      </div>
    </div>
  );
};

export default Premium;
