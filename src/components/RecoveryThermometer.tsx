
import React, { useState, useEffect } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Alert } from '@/components/ui/alert';
import { AlertCircle, Flag, CheckCircle, Gauge, Thermometer } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
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
      color: 'bg-green-500', 
      textColor: 'text-green-500',
      bgColor: 'bg-green-50/30',
      icon: CheckCircle,
      emoji: '😄',
      message: "Seu compromisso com o processo terapêutico está evidente"
    };
    if (score >= 61) return { 
      level: 'Zona de Estabilidade', 
      color: 'bg-green-500', 
      textColor: 'text-green-500',
      bgColor: 'bg-green-50/30',
      icon: CheckCircle,
      emoji: '🙂',
      message: "Você está desenvolvendo recursos internos valiosos"
    };
    if (score >= 31) return { 
      level: 'Zona de Atenção', 
      color: 'bg-yellow-500', 
      textColor: 'text-yellow-500',
      bgColor: 'bg-yellow-50/30',
      icon: Flag,
      emoji: '😐',
      message: "Momento para reforçar suas estratégias de autocuidado"
    };
    return { 
      level: 'Zona de Vulnerabilidade', 
      color: 'bg-red-500', 
      textColor: 'text-red-500',
      bgColor: 'bg-red-50/30',
      icon: AlertCircle,
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
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20">
          <Thermometer className={cn("w-8 h-8", status.textColor)} />
        </div>
        <div>
          <h3 className="font-semibold text-xl text-white">Seu Progresso Terapêutico</h3>
          <p className="text-lg text-gray-300">Avaliação: {score}/100</p>
        </div>
      </div>

      <Card className={cn("p-4 transition-all duration-300 border border-white/10", status.bgColor)}>
        <CardContent className="space-y-4 p-0">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="w-48 h-48 mx-auto"
          >
            <CircularProgressbar
              value={animatedScore}
              text={`${score}%`}
              circleRatio={1}
              styles={buildStyles({
                rotation: 0.25,
                strokeLinecap: 'round',
                textSize: '16px',
                pathTransitionDuration: 1.5,
                pathColor: `${score < 30 ? '#ef4444' : score < 60 ? '#f59e0b' : '#10b981'}`,
                textColor: '#ffffff',
                trailColor: 'rgba(255, 255, 255, 0.2)',
              })}
            />
          </motion.div>

          <div className="flex items-center gap-2 mt-4">
            <span className="text-2xl">{status.emoji}</span>
            <p className="text-lg font-medium text-white">{status.message}</p>
          </div>
          <p className="text-gray-200 italic mt-2 text-sm">{getTherapeuticInsight()}</p>
        </CardContent>
      </Card>

      {details && (
        <Card className="p-4 bg-white/5 backdrop-blur-sm border border-white/15 rounded-xl shadow-lg">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="text-lg font-semibold text-white">Componentes Terapêuticos</CardTitle>
          </CardHeader>
          <CardContent className="p-0 space-y-3">
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}
              className="flex justify-between items-center p-2 rounded-lg bg-gradient-to-r from-blue-500/10 to-transparent"
            >
              <span className="flex items-center gap-2 text-white">
                <span className="text-lg">✅</span>
                <span>Estrutura diária</span>
              </span>
              <span className="font-semibold text-white">+{details.taskPoints}/25</span>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className="flex justify-between items-center p-2 rounded-lg bg-gradient-to-r from-blue-500/10 to-transparent"
            >
              <span className="flex items-center gap-2 text-white">
                <span className="text-lg">😊</span>
                <span>Regulação emocional</span>
              </span>
              <span className="font-semibold text-white">+{details.moodPoints}/15</span>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.3 }}
              className="flex justify-between items-center p-2 rounded-lg bg-gradient-to-r from-blue-500/10 to-transparent"
            >
              <span className="flex items-center gap-2 text-white">
                <span className="text-lg">🙏</span>
                <span>Conexão espiritual</span>
              </span>
              <span className="font-semibold text-white">+{details.devotionalPoints}/20</span>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.3 }}
              className="flex justify-between items-center p-2 rounded-lg bg-gradient-to-r from-blue-500/10 to-transparent"
            >
              <span className="flex items-center gap-2 text-white">
                <span className="text-lg">🚨</span>
                <span>Compromisso diário</span>
              </span>
              <span className="font-semibold text-white">+{details.sobrietyPoints}/25</span>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.3 }}
              className="flex justify-between items-center p-2 rounded-lg bg-gradient-to-r from-blue-500/10 to-transparent"
            >
              <span className="flex items-center gap-2 text-white">
                <span className="text-lg">📝</span>
                <span>Autoconsciência</span>
              </span>
              <span className="font-semibold text-white">+{details.reflectionPoints}/15</span>
            </motion.div>
          </CardContent>
        </Card>
      )}

      {(score < 31 || hasMultipleTriggers) && (
        <Alert variant="destructive" className="mt-4 border border-red-300/50 bg-red-900/30 backdrop-blur-sm">
          <AlertCircle className="h-4 w-4" />
          <div className="ml-2">
            <p className="font-medium text-white">Momento de Vulnerabilidade Identificado</p>
            <p className="text-gray-200">O processo terapêutico inclui momentos desafiadores. É recomendável intensificar seu suporte neste momento.</p>
            <Button 
              className="w-full mt-2 bg-gradient-to-r from-red-600/90 to-red-500/90 hover:from-red-700 hover:to-red-600 transition-all shadow-md border border-red-400/30"
              onClick={() => window.location.href = '/support'}
            >
              Solicitar suporte terapêutico
            </Button>
          </div>
        </Alert>
      )}
    </motion.div>
  );
};

export default RecoveryThermometer;
