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
      <Card className="bg-gradient-to-br from-blue-900/90 to-purple-900/90 text-white shadow-lg border border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Thermometer className="w-6 h-6 text-blue-300" />
            <span className="font-bold">Termômetro da Recuperação</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-blue-900/80 to-purple-900/80 backdrop-blur-lg rounded-xl p-6 border border-white/20 shadow-xl">
              <div className="space-y-6">
                <div className="flex items-center justify-between bg-white/10 p-4 rounded-lg border border-white/10">
                  <span className="text-lg font-medium text-white">Avaliação:</span>
                  <span className={`text-3xl font-bold ${status.textColor} bg-clip-text text-transparent`}>
                    {score}/100
                  </span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-8 shadow-inner border border-white/10 overflow-hidden">
                  <div 
                    className={`h-8 rounded-full transition-all duration-500 ease-out shadow-lg ${status.color}`}
                    style={{ width: `${score}%` }}
                  />
                </div>
                <div className="text-base text-white/90 bg-white/5 p-4 rounded-lg border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{status.emoji}</span>
                    <span className="font-semibold text-white">{status.level}</span>
                  </div>
                  <p className="text-white/80">{getTherapeuticInsight()}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {(score < 31 || hasMultipleTriggers) && (
        <Alert variant="destructive" className="mt-4 border border-red-300/50 bg-gradient-to-r from-red-900/40 to-rose-900/40 backdrop-blur-sm">
          <AlertCircle className="h-4 w-4" />
          <div className="ml-2">
            <p className="font-medium text-white">Momento de Vulnerabilidade Identificado</p>
            <p className="text-gray-200">O processo terapêutico inclui momentos desafiadores. É recomendável intensificar seu suporte neste momento.</p>
            <Button 
              className="w-full mt-2 bg-gradient-to-r from-red-600/90 to-rose-600/90 hover:from-red-700 hover:to-rose-700 transition-all shadow-md border border-red-400/30"
              onClick={() => window.location.href = '/support'}
            >
              <span className="text-sm sm:text-base whitespace-normal text-center px-2">
                Um dia de cada vez
              </span>
            </Button>
          </div>
        </Alert>
      )}
    </motion.div>
  );
};

export default RecoveryThermometer;
