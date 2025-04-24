
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Award, Calendar, Clock, User } from "lucide-react";

const Profile = () => {
  const navigate = useNavigate();

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

        {/* Profile Header */}
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

        {/* Stats Cards */}
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
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-5 w-5 text-yellow-300" />
                <p className="font-medium">Tempo de Uso</p>
              </div>
              <p className="text-lg">
                {profile?.tempo_uso || 'Não informado'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Drogas de Uso */}
        <Card className="bg-white/10 border-none text-white mb-8">
          <CardHeader className="p-4 pb-2">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <User className="h-5 w-5 text-yellow-300" />
              Drogas de Uso
            </h2>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="flex flex-wrap gap-2">
              {profile?.drogas_uso?.map((droga) => (
                <Badge key={droga} variant="secondary" className="bg-white/20">
                  {droga}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Medals */}
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
