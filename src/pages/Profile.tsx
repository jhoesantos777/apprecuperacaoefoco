import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Award, Calendar, Clock, Edit2, User, Save } from "lucide-react";
import { DrugSelection } from "@/components/DrugSelection";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditingDrugs, setIsEditingDrugs] = useState(false);
  const [isEditingTempoUso, setIsEditingTempoUso] = useState(false);
  const [selectedDrugs, setSelectedDrugs] = useState<string[]>([]);
  const [tempoUso, setTempoUso] = useState("");

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
        
      if (profile?.drogas_uso) {
        setSelectedDrugs(profile.drogas_uso);
      }
      if (profile?.tempo_uso) {
        setTempoUso(profile.tempo_uso);
      }
      return profile;
    },
  });

  const updateProfile = useMutation({
    mutationFn: async (updates: { drogas_uso?: string[], tempo_uso?: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast({
        title: "Sucesso!",
        description: "Suas informações foram atualizadas.",
      });
      setIsEditingDrugs(false);
      setIsEditingTempoUso(false);
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar suas informações.",
        variant: "destructive",
      });
      console.error('Error updating profile:', error);
    },
  });

  const handleDrugToggle = (drug: string) => {
    setSelectedDrugs(prev => 
      prev.includes(drug) 
        ? prev.filter(d => d !== drug)
        : [...prev, drug]
    );
  };

  const handleSaveDrugs = () => {
    updateProfile.mutate({ drogas_uso: selectedDrugs });
  };

  const handleSaveTempoUso = () => {
    updateProfile.mutate({ tempo_uso: tempoUso });
  };

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

  const calculateAge = (birthDate: string) => {
    if (!birthDate) return null;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-600 to-teal-900">
      <div className="p-6">
        <button
          onClick={() => navigate('/dashboard')}
          className="text-white/70 hover:text-white flex items-center gap-2 mb-6"
        >
          <ArrowLeft size={24} />
          Voltar
        </button>

        <div className="flex items-center gap-6 mb-8">
          <Avatar className="h-24 w-24 border-4 border-white">
            <AvatarImage src={profile?.avatar_url || "/placeholder.svg"} />
            <AvatarFallback>
              {profile?.nome?.[0] || 'U'}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold text-white">{profile?.nome}</h1>
            <p className="text-white/70">
              {calculateAge(profile?.data_nascimento)} anos
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <Card className="bg-white/10 border-none text-white">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-5 w-5 text-yellow-300" />
                <p className="font-medium">Dias em Sobriedade</p>
              </div>
              <p className="text-2xl font-bold text-yellow-300">
                {profile?.dias_sobriedade || 0}
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/10 border-none text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-yellow-300" />
                  <p className="font-medium">Tempo de Uso</p>
                </div>
                {!isEditingTempoUso ? (
                  <Button variant="ghost" size="sm" onClick={() => setIsEditingTempoUso(true)}>
                    <Edit2 className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button variant="ghost" size="sm" onClick={handleSaveTempoUso}>
                    <Save className="h-4 w-4" />
                  </Button>
                )}
              </div>
              {isEditingTempoUso ? (
                <Input
                  value={tempoUso}
                  onChange={(e) => setTempoUso(e.target.value)}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
                  placeholder="Ex: 5 anos"
                />
              ) : (
                <p className="text-lg">
                  {profile?.tempo_uso || 'Não informado'}
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="bg-white/10 border-none text-white mb-8">
          <CardHeader className="p-4 pb-2">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <User className="h-5 w-5 text-yellow-300" />
                Drogas de Uso
              </h2>
              {!isEditingDrugs ? (
                <Button variant="ghost" size="sm" onClick={() => setIsEditingDrugs(true)}>
                  <Edit2 className="h-4 w-4" />
                </Button>
              ) : (
                <Button variant="ghost" size="sm" onClick={handleSaveDrugs}>
                  <Save className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            {isEditingDrugs ? (
              <DrugSelection 
                selectedDrugs={selectedDrugs}
                onDrugToggle={handleDrugToggle}
              />
            ) : (
              <div className="flex flex-wrap gap-2">
                {profile?.drogas_uso?.map((droga) => (
                  <Badge key={droga} variant="secondary" className="bg-white/20">
                    {droga}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-white/10 border-none text-white">
          <CardHeader className="p-4 pb-2">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Award className="h-5 w-5 text-yellow-300" />
              Medalhas Conquistadas
            </h2>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="grid grid-cols-2 gap-4">
              {medals?.map((medal) => (
                <div 
                  key={medal.id} 
                  className="flex items-center gap-3 bg-white/5 rounded-lg p-3"
                >
                  <div className="text-2xl">{medal.medal.icon}</div>
                  <div>
                    <p className="font-medium">{medal.medal.title}</p>
                    <p className="text-sm text-white/70">{medal.medal.description}</p>
                  </div>
                </div>
              ))}
              {!medals?.length && (
                <p className="text-white/70 col-span-2 text-center py-4">
                  Ainda não conquistou medalhas
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
