
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { ProfilePicture } from '@/components/ProfilePicture';
import { Button } from '@/components/ui/button';
import { useIrmandade } from '@/contexts/IrmandadeContext';
import { MembershipBanner } from '@/components/irmandade/MembershipBanner';
import { Card } from '@/components/ui/card';
import { Shield, MapPin, Calendar, MessageSquare } from 'lucide-react';

interface UserProfile {
  id: string;
  nome: string;
  avatar_url: string;
  dias_sobriedade?: number;
  cidade?: string;
  story?: string;
  rank?: string;
  badges?: string[];
}

const UserProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { isMember, decrementViews, remainingViews } = useIrmandade();

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        // Include story field in the selection
        const { data, error } = await supabase
          .from('profiles')
          .select('id, nome, avatar_url, dias_sobriedade, cidade, story, rank, badges')
          .eq('id', id)
          .single();
        
        if (!error && data) {
          // Cast data to UserProfile
          setUser(data as UserProfile);
          
          // If not a member, decrement the view count
          if (!isMember && remainingViews > 0) {
            decrementViews();
          }
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setLoading(false);
      }
    };
    
    if (id) fetchUser();
  }, [id, isMember, decrementViews, remainingViews]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#2d0036] to-black"><span className="text-white text-lg">Carregando perfil...</span></div>;
  }

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#2d0036] to-black"><span className="text-white text-lg">Usuário não encontrado.</span></div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#2d0036] to-black px-4 sm:px-6 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <MembershipBanner compact />
        </div>
        
        <div className="bg-gradient-to-br from-[#2d0036] to-black border border-[#4b206b] rounded-2xl shadow-xl p-8">
          <div className="flex flex-col items-center">
            <div className="mb-6">
              <ProfilePicture avatarUrl={user?.avatar_url} userId={user?.id} userName={user?.nome} size="lg" />
            </div>
            <h1 className="text-3xl font-extrabold text-white mb-2 text-center">{user?.nome}</h1>
            
            <div className="flex flex-wrap justify-center gap-4 mb-6">
              {user?.dias_sobriedade !== undefined && (
                <div className="flex items-center text-yellow-400">
                  <Shield className="mr-1 h-4 w-4" />
                  <span className="text-xl font-semibold">{user.dias_sobriedade ?? 0} dias em sobriedade</span>
                </div>
              )}
              
              {user?.cidade && (
                <div className="flex items-center text-gray-300">
                  <MapPin className="mr-1 h-4 w-4" />
                  <span>{user.cidade}</span>
                </div>
              )}

              {user?.rank && (
                <div className="flex items-center text-green-300">
                  <Shield className="mr-1 h-4 w-4" />
                  <span>{user.rank}</span>
                </div>
              )}
            </div>
            
            {user?.story && isMember && (
              <Card className="bg-white/10 w-full mb-6 p-4">
                <div className="flex items-start gap-3">
                  <MessageSquare className="text-purple-400 h-5 w-5 mt-1" />
                  <div>
                    <h3 className="text-purple-300 font-semibold mb-2">Minha História</h3>
                    <p className="text-gray-200 italic">"{user.story}"</p>
                  </div>
                </div>
              </Card>
            )}
            
            {!isMember && (
              <Card className="bg-white/10 w-full mb-6 p-4">
                <div className="text-center p-4">
                  <MessageSquare className="mx-auto text-gray-400 h-8 w-8 mb-2" />
                  <h3 className="text-gray-300 font-semibold mb-2">História disponível apenas para membros</h3>
                  <Button 
                    variant="outline" 
                    className="mt-2 border-purple-500 text-purple-300" 
                    size="sm"
                    onClick={() => navigate('/irmandade')}
                  >
                    Participar da Irmandade
                  </Button>
                </div>
              </Card>
            )}
            
            <div className="flex space-x-3">
              <Button
                onClick={() => navigate(-1)}
                variant="outline"
                className="border-red-600 text-white"
              >
                Voltar
              </Button>
              
              <Button
                onClick={() => navigate('/irmandade')}
                className="bg-purple-700 hover:bg-purple-800 text-white"
              >
                Ver Comunidade
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
