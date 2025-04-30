
import React, { useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, Share2, Trophy, Medal, Calendar, Activity } from "lucide-react";
import { BackButton } from '@/components/BackButton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from "@/hooks/use-toast";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Achievements = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("sobriety");
  
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

  // Sobriety medals tier
  const sobrietyMedalTiers = [
    { days: 1, title: "🥇 Primeira Luz", icon: "🥇", description: "Seu primeiro dia de sobriedade!", reward: "Parabéns animado + desbloqueio de frase especial" },
    { days: 7, title: "🧭 Novo Caminho", icon: "🧭", description: "7 dias de caminhada na sobriedade", reward: "Imagem personalizada para compartilhar" },
    { days: 15, title: "🌱 Raízes Fortes", icon: "🌱", description: "15 dias construindo sua base", reward: "Desbloqueio de reflexão especial" },
    { days: 30, title: "🧱 Muralha de Vontade", icon: "🧱", description: "1 mês de resistência inabalável!", reward: "Fundo de tela exclusivo no app" },
    { days: 90, title: "☀️ Clareza da Alma", icon: "☀️", description: "3 meses de clareza e renovação!", reward: "Vídeo de homenagem surpresa" },
    { days: 180, title: "⚔️ Guerreiro da Esperança", icon: "⚔️", description: "6 meses de batalha constante!", reward: "Desconto ou sessão bônus (premium)" },
    { days: 270, title: "🕊️ Liberdade Interior", icon: "🕊️", description: "9 meses de caminhada consistente", reward: "Acesso a módulo premium" },
    { days: 365, title: "🏆 Sentinela da Vida", icon: "🏆", description: "Um ano de vigilância e superação!", reward: "Brasão dourado no perfil + certificado em PDF" },
    { days: 730, title: "🎖️ Guardião da Esperança", icon: "🎖️", description: "Dois anos protegendo sua sobriedade!", reward: "Vídeo personalizado" },
    { days: 1095, title: "🧠 Mestre da Consciência", icon: "🧠", description: "Três anos de sabedoria e autoconsciência!", reward: "Acesso a um curso bônus ou devocional premium" },
    { days: 1825, title: "🔥 Fênix Renascida", icon: "🔥", description: "Cinco anos de transformação contínua!", reward: "Emblema animado no app" },
    { days: 2920, title: "🌟 Estrela Guia", icon: "🌟", description: "Oito anos iluminando o caminho!", reward: "Mensagem surpresa + camiseta" },
    { days: 3650, title: "👑 Lenda Viva", icon: "👑", description: "Dez anos de história inspiradora!", reward: "Hall da Fama + recompensa especial" },
    { days: 4380, title: "📜 Sábio da Jornada", icon: "📜", description: "Doze anos de sabedoria acumulada", reward: "Livro personalizado com sua jornada" },
    { days: 5475, title: "🧙 Mestre da Superação", icon: "🧙", description: "Quinze anos de maestria na recuperação", reward: "Reconhecimento especial" },
    { days: 6570, title: "🏛️ Patriarca da Recuperação", icon: "🏛️", description: "Dezoito anos de liderança e exemplo", reward: "Mentorias especiais desbloqueadas" },
    { days: 7300, title: "🦕 DINOSSAURO da Recuperação", icon: "🦕", description: "Vinte anos ou mais de resistência lendária!", reward: "Legado permanente no app" },
  ];

  // App usage medals tier
  const appUsageMedalTiers = [
    { days: 1, title: "🚪 Primeiro Contato", icon: "🚪", description: "Seu primeiro dia no app!", reward: "Boas-vindas especial" },
    { days: 3, title: "🔍 Despertar da Curiosidade", icon: "🔍", description: "3 dias explorando o app", reward: "Desbloqueio de tema" },
    { days: 7, title: "🔗 Laço Inicial", icon: "🔗", description: "Uma semana de conexão", reward: "Acesso a reflexão especial" },
    { days: 12, title: "🧩 Conectado ao Propósito", icon: "🧩", description: "12 dias de propósito", reward: "Novas ferramentas desbloqueadas" },
    { days: 15, title: "🧗 Ritual de Subida", icon: "🧗", description: "15 dias de escalada constante", reward: "Avatar exclusivo" },
    { days: 30, title: "📆 Aliado da Rotina", icon: "📆", description: "Um mês de compromisso", reward: "Notas de gratidão especiais" },
    { days: 45, title: "🛡️ Guardião da Constância", icon: "🛡️", description: "45 dias de constância", reward: "Meditação guiada exclusiva" },
    { days: 60, title: "🔥 Chama Acesa", icon: "🔥", description: "60 dias de dedicação", reward: "Coleção de citações inspiradoras" },
    { days: 75, title: "🌿 Crescimento Silencioso", icon: "🌿", description: "75 dias de cultivo interno", reward: "Guia de autoavaliação" },
    { days: 84, title: "🧠 Mente Disciplinada", icon: "🧠", description: "84 dias de consistência mental", reward: "Exercícios de mindfulness" },
    { days: 90, title: "✨ Consistência Iluminada", icon: "✨", description: "90 dias de prática iluminada", reward: "Histórias de superação" },
    { days: 111, title: "🚀 Ascensão Interna", icon: "🚀", description: "111 dias de evolução", reward: "Acesso a módulo premium" },
    { days: 120, title: "🧲 Força Magnética", icon: "🧲", description: "120 dias de atração positiva", reward: "Desafio exclusivo" },
    { days: 150, title: "🎯 Comprometido com a Jornada", icon: "🎯", description: "150 dias de compromisso", reward: "Ferramenta de planejamento" },
    { days: 180, title: "🛤️ Trilho Sólido", icon: "🛤️", description: "180 dias nos trilhos", reward: "Workshop exclusivo" },
    { days: 210, title: "🧬 Identidade Transformada", icon: "🧬", description: "210 dias de transformação", reward: "Análise de progresso personalizada" },
    { days: 240, title: "🌊 Fluxo Equilibrado", icon: "🌊", description: "240 dias em harmonia", reward: "Ritual de celebração" },
    { days: 270, title: "🧘 Mestre do Hábito", icon: "🧘", description: "270 dias de maestria", reward: "Áudio guiado especial" },
    { days: 300, title: "🎉 Celebração da Perseverança", icon: "🎉", description: "300 dias de persistência", reward: "Cerimônia virtual" },
    { days: 330, title: "⏳ Tempo como Aliado", icon: "⏳", description: "330 dias com o tempo a favor", reward: "Reconhecimento na comunidade" },
    { days: 360, title: "🐉 Dragão da Disciplina", icon: "🐉", description: "Um ano de disciplina inabalável", reward: "Badge exclusivo para perfil" },
  ];

  // Get current data based on active tab
  const currentMedalTiers = activeTab === "sobriety" ? sobrietyMedalTiers : appUsageMedalTiers;
  const dias = activeTab === "sobriety" ? (profile?.dias_sobriedade || 0) : (profile?.mood_points || 0); // Usando mood_points como proxy para acessos ao app

  // Find next medal to achieve
  const nextMedal = currentMedalTiers.find(medal => medal.days > dias);

  // Calculate time until next medal
  const daysUntilNextMedal = nextMedal ? nextMedal.days - dias : 0;
  
  // Get achievements that should be unlocked based on days
  const unlockedMedals = currentMedalTiers.filter(medal => dias >= medal.days);
  
  // Get achievements that are still locked
  const lockedMedals = currentMedalTiers.filter(medal => dias < medal.days);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-600 to-indigo-900 p-6">
      <BackButton />
      
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Trophy className="h-12 w-12 text-yellow-300" />
          <div>
            <h1 className="text-3xl font-bold text-white">Minhas Conquistas</h1>
            <p className="text-white/70">Suas vitórias reconhecidas</p>
          </div>
        </div>

        {/* Toggle between achievement types */}
        <div className="mb-8">
          <Tabs 
            defaultValue="sobriety" 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 bg-purple-900/50 mb-4">
              <TabsTrigger value="sobriety" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Minha jornada de sobriedade</span>
              </TabsTrigger>
              <TabsTrigger value="app" className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                <span>Minha jornada no App</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="sobriety">
              <Card className="bg-gradient-to-r from-purple-800/40 to-indigo-800/40 border-none text-white mb-6">
                <CardHeader>
                  <CardTitle className="text-xl">
                    {activeTab === "sobriety" ? 
                      "Sua jornada de sobriedade" : 
                      "Sua jornada no aplicativo"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white/80">
                    {activeTab === "sobriety" ? 
                      `Você tem ${dias} dias de sobriedade` : 
                      `Você tem ${dias} pontos de acesso ao aplicativo`}
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="app">
              <Card className="bg-gradient-to-r from-purple-800/40 to-indigo-800/40 border-none text-white mb-6">
                <CardHeader>
                  <CardTitle className="text-xl">
                    {activeTab === "sobriety" ? 
                      "Sua jornada de sobriedade" : 
                      "Sua jornada no aplicativo"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white/80">
                    {activeTab === "sobriety" ? 
                      `Você tem ${dias} dias de sobriedade` : 
                      `Você tem ${dias} pontos de acesso ao aplicativo`}
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
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
                          Conquista aos {medal.days} dia{medal.days > 1 ? 's' : ''} 
                          {activeTab === "sobriety" ? " de sobriedade" : " de uso do app"}
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
            <Award className="h-6 w-6 text-gray-400" />
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
                        Desbloqueie aos {medal.days} dia{medal.days > 1 ? 's' : ''} 
                        {activeTab === "sobriety" ? " de sobriedade" : " de uso do app"}
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
              <Trophy className="h-6 w-6 text-blue-300" />
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
