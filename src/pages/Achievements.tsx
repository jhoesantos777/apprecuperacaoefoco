
import React from 'react';
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, Share2, Trophy, Medal, Crown, Shield } from "lucide-react";
import { BackButton } from '@/components/BackButton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from "@/hooks/use-toast";

const Achievements = () => {
  const { toast } = useToast();
  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
        
      return profile;
    },
  });

  const { data: medals } = useQuery({
    queryKey: ['user-medals'],
    queryFn: async () => {
      const { data } = await supabase
        .from('user_medals')
        .select(`
          *,
          medal:medals (
            title,
            description,
            icon
          )
        `)
        .order('earned_at', { ascending: false });
      
      return data;
    },
  });

  const handleShare = () => {
    // In a real app, this would share via social media or messaging
    toast({
      title: "Compartilhado!",
      description: "Sua conquista foi compartilhada com seu grupo de apoio.",
    });
  };

  // Define medal tiers based on sobriety days
  const medalTiers = [
    { days: 1, title: "Medalha do Primeiro Passo", icon: "🏅", description: "Você deu o primeiro e mais importante passo!", reward: "Parabéns animado + desbloqueio de frase especial" },
    { days: 7, title: "Medalha dos 7 Leões", icon: "🦁", description: "Uma semana de força e coragem!", reward: "Imagem personalizada para compartilhar" },
    { days: 30, title: "Medalha da Muralha", icon: "🧱", description: "Um mês de resistência inabalável!", reward: "Fundo de tela exclusivo no app" },
    { days: 90, title: "Medalha do Despertar", icon: "🌅", description: "Três meses de clareza e renovação!", reward: "Vídeo de homenagem surpresa" },
    { days: 180, title: "Medalha do Guerreiro Fiel", icon: "⚔️", description: "Seis meses de batalha constante!", reward: "Desconto ou sessão bônus (premium)" },
    { days: 365, title: "Patente: Sentinela", icon: "🏆", description: "Um ano de vigilância e superação!", reward: "Brasão dourado no perfil + certificado em PDF" },
    { days: 730, title: "Patente: Guardião", icon: "🛡️", description: "Dois anos protegendo sua sobriedade!", reward: "Vídeo personalizado" },
    { days: 1095, title: "Patente: Lenda Viva", icon: "⚔️", description: "Três anos de história inspiradora!", reward: "Acesso a um curso bônus ou devocional premium" },
    { days: 1460, title: "Patente: Vencedor Supremo", icon: "👑", description: "Quatro anos de vitória contínua!", reward: "Emblema animado no app" },
    { days: 1825, title: "Patente: Mestre do Tempo", icon: "🐉", description: "Cinco anos dominando o tempo!", reward: "Mensagem surpresa + camiseta" },
    { days: 3650, title: "Patente: Dinossauro da Sobriedade", icon: "🦕", description: "Dez anos de resistência lendária!", reward: "Hall da Fama + recompensa especial" },
  ];

  // Find next medal to achieve
  const dias = profile?.dias_sobriedade || 0;
  const nextMedal = medalTiers.find(medal => medal.days > dias);

  // Calculate time until next medal
  const daysUntilNextMedal = nextMedal ? nextMedal.days - dias : 0;
  
  // Get achievements that should be unlocked based on sobriety days
  const unlockedMedals = medalTiers.filter(medal => dias >= medal.days);
  
  // Get achievements that are still locked
  const lockedMedals = medalTiers.filter(medal => dias < medal.days);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-600 to-indigo-900 p-6">
      <BackButton />
      
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Trophy className="h-12 w-12 text-yellow-300" />
          <div>
            <h1 className="text-3xl font-bold text-white">Minha Jornada</h1>
            <p className="text-white/70">Cada dia vencido é uma medalha que ninguém pode te tirar</p>
          </div>
        </div>

        {/* Next Medal Progress */}
        {nextMedal && (
          <Card className="bg-gradient-to-r from-purple-800/40 to-indigo-800/40 border-none text-white mb-8">
            <CardHeader>
              <CardTitle className="text-xl">Próxima Conquista</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="text-4xl">{nextMedal.icon}</div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold">{nextMedal.title}</h3>
                  <p className="text-white/70 mb-2">{nextMedal.description}</p>
                  <div className="w-full bg-white/10 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-yellow-400 to-yellow-300 h-3 rounded-full" 
                      style={{ width: `${Math.min(100, (dias / nextMedal.days) * 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-sm mt-1 text-white/80">
                    Faltam <span className="text-yellow-300 font-bold">{daysUntilNextMedal} dias</span> para desbloquear!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Unlocked Medals */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <Medal className="h-6 w-6 text-yellow-300" />
            Conquistas Desbloqueadas
          </h2>
          
          <div className="space-y-4">
            {unlockedMedals.length > 0 ? (
              unlockedMedals.map((medal, index) => (
                <Card key={index} className="bg-white/10 border-none text-white overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="text-4xl">{medal.icon}</div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-xl font-semibold">{medal.title}</h3>
                            <p className="text-white/70">{medal.description}</p>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-yellow-300 hover:text-yellow-100 hover:bg-yellow-500/20"
                            onClick={handleShare}
                          >
                            <Share2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="mt-2">
                          <Badge className="bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/30">
                            Recompensa: {medal.reward}
                          </Badge>
                        </div>
                        <p className="text-sm text-yellow-300 mt-2">
                          Conquista aos {medal.days} dia{medal.days > 1 ? 's' : ''} de sobriedade
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="bg-white/10 border-none text-white">
                <CardContent className="p-6 text-center">
                  <p className="text-white/70">
                    Continue sua jornada para conquistar suas primeiras medalhas!
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
        
        {/* Locked Medals */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <Crown className="h-6 w-6 text-gray-400" />
            Próximas Conquistas
          </h2>
          
          <div className="space-y-4">
            {lockedMedals.slice(0, 3).map((medal, index) => (
              <Card key={index} className="bg-white/5 border-none text-white/50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="text-4xl opacity-50">{medal.icon}</div>
                    <div>
                      <h3 className="text-xl font-semibold">{medal.title}</h3>
                      <p className="text-white/50">{medal.description}</p>
                      <p className="text-sm text-gray-400 mt-1">
                        Desbloqueie aos {medal.days} dia{medal.days > 1 ? 's' : ''} de sobriedade
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {lockedMedals.length > 3 && (
              <p className="text-center text-white/50 text-sm">
                +{lockedMedals.length - 3} mais conquistas para desbloquear na sua jornada
              </p>
            )}
          </div>
        </div>
        
        {/* Previous Earned Medals from Database */}
        {medals && medals.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <Shield className="h-6 w-6 text-blue-300" />
              Medalhas do Sistema
            </h2>
            
            <div className="space-y-4">
              {medals.map((medal) => (
                <Card key={medal.id} className="bg-indigo-800/30 border-none text-white">
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="text-4xl">{medal.medal.icon}</div>
                    <div>
                      <h3 className="text-xl font-semibold">{medal.medal.title}</h3>
                      <p className="text-white/70">{medal.medal.description}</p>
                      <p className="text-sm text-blue-300 mt-1">
                        Conquistada em {format(new Date(medal.earned_at), 'dd/MM/yyyy')}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Achievements;
