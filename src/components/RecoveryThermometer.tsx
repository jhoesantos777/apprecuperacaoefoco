
import React, { useState, useEffect } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Alert } from '@/components/ui/alert';
import { AlertCircle, Flag, CheckCircle, Gauge } from 'lucide-react';
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
      level: 'Zona Saudável', 
      color: 'bg-green-500', 
      textColor: 'text-green-500',
      bgColor: 'bg-green-50',
      icon: CheckCircle,
      emoji: '😄',
      message: "Excelente! Hoje foi um dia de vitória!"
    };
    if (score >= 61) return { 
      level: 'Zona Saudável', 
      color: 'bg-green-500', 
      textColor: 'text-green-500',
      bgColor: 'bg-green-50',
      icon: CheckCircle,
      emoji: '🙂',
      message: "Você está se fortalecendo a cada dia!"
    };
    if (score >= 31) return { 
      level: 'Zona de Atenção', 
      color: 'bg-yellow-500', 
      textColor: 'text-yellow-500',
      bgColor: 'bg-yellow-50',
      icon: Flag,
      emoji: '😐',
      message: "Avanço visível, mantenha o foco!"
    };
    return { 
      level: 'Zona Crítica', 
      color: 'bg-red-500', 
      textColor: 'text-red-500',
      bgColor: 'bg-red-50',
      icon: AlertCircle,
      emoji: '😟',
      message: "Continue tentando, você está no caminho."
    };
  };

  const status = getStatus();

  // Get gradient color based on score
  const getGradientColor = () => {
    if (score >= 91) return 'from-green-500 to-green-400';
    if (score >= 61) return 'from-green-500 to-yellow-400';
    if (score >= 31) return 'from-yellow-500 to-yellow-300';
    return 'from-red-500 to-red-400';
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
          <Gauge className={cn("w-8 h-8", status.textColor)} />
        </div>
        <div>
          <h3 className="font-semibold text-xl">Seu Termômetro de Recuperação</h3>
          <p className="text-lg text-gray-500">Pontuação: {score}/100</p>
        </div>
      </div>

      <Card className={cn("p-4 transition-all duration-300", status.bgColor)}>
        <CardContent className="space-y-4 p-0">
          <div className="flex justify-between items-center mb-2">
            <span className="text-red-500 font-medium">0</span>
            <span className="text-green-500 font-medium">100</span>
          </div>
          <motion.div
            initial={{ width: '0%' }}
            animate={{ width: `${score}%` }}
            transition={{ duration: 1, ease: "easeInOut" }}
          >
            <Progress 
              value={score} 
              className={cn("h-6 rounded-full bg-gradient-to-r", getGradientColor())} 
            />
          </motion.div>
          <div className="flex items-center gap-2 mt-4">
            <span className="text-2xl">{status.emoji}</span>
            <p className="text-lg font-medium">{status.message}</p>
          </div>
        </CardContent>
      </Card>

      {details && (
        <Card className="p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl shadow-lg">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="text-lg font-semibold">Detalhes da Pontuação</CardTitle>
          </CardHeader>
          <CardContent className="p-0 space-y-3">
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}
              className="flex justify-between items-center p-2 rounded-lg bg-gradient-to-r from-blue-500/10 to-transparent"
            >
              <span className="flex items-center gap-2">
                <span className="text-lg">✅</span>
                <span>Tarefas completadas</span>
              </span>
              <span className="font-semibold">+{details.taskPoints}/30</span>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className="flex justify-between items-center p-2 rounded-lg bg-gradient-to-r from-blue-500/10 to-transparent"
            >
              <span className="flex items-center gap-2">
                <span className="text-lg">😊</span>
                <span>Humor do dia</span>
              </span>
              <span className="font-semibold">+{details.moodPoints}/20</span>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.3 }}
              className="flex justify-between items-center p-2 rounded-lg bg-gradient-to-r from-blue-500/10 to-transparent"
            >
              <span className="flex items-center gap-2">
                <span className="text-lg">🙏</span>
                <span>Devocional</span>
              </span>
              <span className="font-semibold">+{details.devotionalPoints}/20</span>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.3 }}
              className="flex justify-between items-center p-2 rounded-lg bg-gradient-to-r from-blue-500/10 to-transparent"
            >
              <span className="flex items-center gap-2">
                <span className="text-lg">🚨</span>
                <span>Hoje Eu Não Vou Usar</span>
              </span>
              <span className="font-semibold">+{details.sobrietyPoints}/20</span>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.3 }}
              className="flex justify-between items-center p-2 rounded-lg bg-gradient-to-r from-blue-500/10 to-transparent"
            >
              <span className="flex items-center gap-2">
                <span className="text-lg">📝</span>
                <span>Reflexão do Dia</span>
              </span>
              <span className="font-semibold">+{details.reflectionPoints}/10</span>
            </motion.div>
          </CardContent>
        </Card>
      )}

      {(score < 31 || hasMultipleTriggers) && (
        <Alert variant="destructive" className="mt-4 border border-red-300 bg-red-50/80 backdrop-blur-sm">
          <AlertCircle className="h-4 w-4" />
          <div className="ml-2">
            <p className="font-medium">Alerta de Risco</p>
            <p>Você está precisando de apoio. Não hesite em buscar ajuda.</p>
            <Button 
              className="w-full mt-2 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 transition-all shadow-md"
              onClick={() => window.location.href = '/support'}
            >
              Preciso de ajuda agora
            </Button>
          </div>
        </Alert>
      )}
    </motion.div>
  );
};

export default RecoveryThermometer;
