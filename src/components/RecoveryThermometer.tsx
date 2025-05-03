import React, { useState, useEffect } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Alert } from '@/components/ui/alert';
import { AlertCircle, Thermometer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';

interface ScoreBreakdown {
  taskPoints: number;
  moodPoints: number;
  devotionalPoints: number;
  sobrietyPoints: number;
  reflectionPoints: number;
}

interface ThermometerProps {
  score: number;
  hasMultipleTriggers: boolean;
  details?: ScoreBreakdown;
}

const RecoveryThermometer = ({ score, hasMultipleTriggers, details }: ThermometerProps) => {
  const [animatedScore, setAnimatedScore] = useState(0);

  // Animate score change
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScore(score);
    }, 100);
    return () => clearTimeout(timer);
  }, [score]);

  const getStatus = () => {
    if (score >= 91) return { 
      level: 'Zona de Crescimento', 
      color: 'bg-gradient-to-r from-green-500 to-emerald-600', 
      textColor: 'text-green-400',
      bgColor: 'bg-green-50/30',
      icon: Thermometer,
      emoji: '😄',
      message: "Seu compromisso com o processo terapêutico está evidente"
    };
    if (score >= 61) return { 
      level: 'Zona de Estabilidade', 
      color: 'bg-gradient-to-r from-blue-500 to-indigo-600', 
      textColor: 'text-blue-400',
      bgColor: 'bg-blue-50/30',
      icon: Thermometer,
      emoji: '🙂',
      message: "Você está desenvolvendo recursos internos valiosos"
    };
    if (score >= 31) return { 
      level: 'Zona de Atenção', 
      color: 'bg-gradient-to-r from-yellow-500 to-orange-600', 
      textColor: 'text-yellow-400',
      bgColor: 'bg-yellow-50/30',
      icon: Thermometer,
      emoji: '😐',
      message: "Momento para reforçar suas estratégias de autocuidado"
    };
    return { 
      level: 'Zona de Vulnerabilidade', 
      color: 'bg-gradient-to-r from-red-500 to-rose-600', 
      textColor: 'text-red-400',
      bgColor: 'bg-red-50/30',
      icon: Thermometer,
      emoji: '😟',
      message: "Importante buscar apoio terapêutico adicional"
    };
  };

  const status = getStatus();

  // Get therapeutic messages based on score and details
  const getTherapeuticInsight = () => {
    // Low score insights
    if (score < 30) {
      if (details?.sobrietyPoints === 0) {
        return "Reconhecer os desafios é o primeiro passo. Mesmo nos momentos mais difíceis, cada pequena ação positiva tem valor terapêutico. Qual pequeno passo você poderia dar hoje?";
      }
      return "Este momento de vulnerabilidade é parte natural do processo de recuperação. Lembre-se que a jornada não é linear e estes períodos oferecem importantes oportunidades de aprendizado.";
    }
    
    // Medium-low score insights
    if (score < 50) {
      if (details?.reflectionPoints > 0 && details?.devotionalPoints > 0) {
        return "Sua prática de reflexão e conexão espiritual demonstra um comprometimento significativo com seu bem-estar integral, mesmo em momentos desafiadores.";
      }
      return "Você está navegando por um período de transição. A construção de práticas diárias consistentes, mesmo pequenas, fortalece progressivamente sua capacidade de autorregulação emocional.";
    }
    
    // Medium-high score insights
    if (score < 70) {
      if (details?.taskPoints > 15) {
        return "Sua consistência em completar tarefas diárias demonstra um importante desenvolvimento de estrutura e autodisciplina, fundamentais para a recuperação sustentável.";
      }
      return "Este equilíbrio que você está construindo reflete um processo terapêutico ativo. Continue explorando quais práticas específicas mais contribuem para seu bem-estar e fortalecimento.";
    }
    
    // High score insights
    if (score < 90) {
      if (hasMultipleTriggers && details?.sobrietyPoints > 20) {
        return "Sua capacidade de manter o compromisso com a sobriedade mesmo identificando múltiplos gatilhos demonstra notável desenvolvimento de resiliência e autoeficácia.";
      }
      return "O equilíbrio que você está alcançando entre diferentes áreas da sua vida reflete um processo de recuperação integrado e holístico. Continue nutrindó este trabalho significativo.";
    }
    
    // Very high score insights
    return "Sua dedicação ao processo terapêutico está refletida nestes resultados impressionantes. Esta consistência transforma práticas conscientes em novos padrões neurais duradouros.";
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="bg-gradient-to-br from-[#2d0036] to-black border border-[#4b206b] rounded-2xl shadow-xl p-8">
          <div className="space-y-6">
          <div className="flex items-center justify-between">
                  <span className="text-lg font-medium text-white">Avaliação:</span>
            <span className={`text-3xl font-bold ${status.textColor}`}>
                    {score}/100
                  </span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-8 shadow-inner border border-white/10 overflow-hidden">
                  <div 
                    className={`h-8 rounded-full transition-all duration-500 ease-out shadow-lg ${status.color}`}
                    style={{ width: `${score}%` }}
                  />
                </div>
          <div className="text-base text-white/90">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{status.emoji}</span>
                    <span className="font-semibold text-white">{status.level}</span>
                  </div>
                  <p className="text-white/80">{getTherapeuticInsight()}</p>
                </div>
              </div>
            </div>

      {(score < 31 || hasMultipleTriggers) && (
        <div className="bg-gradient-to-br from-red-900/40 to-rose-900/40 border border-red-300/50 rounded-2xl p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-400 mt-1" />
            <div>
              <p className="font-medium text-white mb-2">Momento de Vulnerabilidade Identificado</p>
              <p className="text-gray-200 mb-4">O processo terapêutico inclui momentos desafiadores. É recomendável intensificar seu suporte neste momento.</p>
              <button 
                className="w-full px-6 py-3 rounded-full bg-red-600 text-white font-bold shadow-lg hover:bg-red-700 transition-all transform hover:scale-105"
              onClick={() => window.location.href = '/support'}
            >
                Um dia de cada vez
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default RecoveryThermometer;
