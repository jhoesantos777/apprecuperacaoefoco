
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { ProfileCard } from '@/components/irmandade/ProfileCard';
import { MembershipBanner } from '@/components/irmandade/MembershipBanner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useIrmandade } from '@/contexts/IrmandadeContext';
import { Search, UserPlus, Users, Filter } from 'lucide-react';
import { Lock } from 'lucide-react'; // Updated import from lucide-react

interface UserProfile {
  id: string;
  nome: string;
  avatar_url: string | null;
  dias_sobriedade?: number | null;
  cidade?: string | null;
  story?: string | null;
}

const Irmandade: React.FC = () => {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [filteredProfiles, setFilteredProfiles] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const { isMember, remainingViews } = useIrmandade();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfiles = async () => {
      setLoading(true);
      try {
        // Not querying for story field since it may not exist yet
        const { data, error } = await supabase
          .from('profiles')
          .select('id, nome, avatar_url, dias_sobriedade, cidade')
          .eq('is_active', true)
          .order('dias_sobriedade', { ascending: false });
        
        if (error) {
          console.error('Erro ao buscar perfis:', error);
          return;
        }
        
        // Cast data to UserProfile[] to allow for story property
        setProfiles(data || [] as UserProfile[]);
        setFilteredProfiles(data || [] as UserProfile[]);
      } catch (error) {
        console.error('Erro inesperado:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfiles();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredProfiles(profiles);
      return;
    }
    
    const filtered = profiles.filter(profile => 
      profile.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.cidade?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setFilteredProfiles(filtered);
  }, [searchTerm, profiles]);

  // Show preview profiles for non-members
  const getProfilesForDisplay = () => {
    if (isMember) {
      return filteredProfiles;
    } else {
      // For non-members, only show limited profiles
      return filteredProfiles.slice(0, 2);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#2d0036] to-black px-4 sm:px-6 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-extrabold text-red-600 mb-2 tracking-[-0.06em] uppercase drop-shadow">
              Irmandade
            </h1>
            <p className="text-gray-300 max-w-2xl">
              Uma comunidade social privada onde pessoas em recuperação podem se conectar, 
              compartilhar suas histórias e se apoiar mutuamente.
            </p>
          </div>
          
          <Button
            onClick={() => navigate('/profile')}
            className="mt-4 sm:mt-0 bg-purple-700 hover:bg-purple-800"
            size="sm"
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Atualizar Meu Perfil
          </Button>
        </div>
        
        <div className="mb-8">
          <MembershipBanner />
        </div>
        
        <Tabs defaultValue="members">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
            <TabsList className="mb-4 sm:mb-0">
              <TabsTrigger value="members" className="flex items-center">
                <Users className="mr-2 h-4 w-4" /> Membros
              </TabsTrigger>
              <TabsTrigger value="activity" className="flex items-center">
                Histórias
              </TabsTrigger>
            </TabsList>
            
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar por nome ou cidade..."
                className="pl-10 w-full sm:w-[250px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <TabsContent value="members">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <Card key={i} className="p-6 h-[300px] animate-pulse">
                    <div className="flex flex-col items-center">
                      <div className="h-24 w-24 rounded-full bg-gray-300 mb-4"></div>
                      <div className="h-6 w-2/3 bg-gray-300 rounded mb-2"></div>
                      <div className="h-4 w-1/3 bg-gray-300 rounded mb-4"></div>
                      <div className="h-16 w-full bg-gray-300 rounded"></div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <>
                {filteredProfiles.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-300 text-lg">Nenhum membro encontrado com os critérios de busca.</p>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center">
                        <Badge variant="outline" className="text-gray-300 border-gray-500">
                          {filteredProfiles.length} membros
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {getProfilesForDisplay().map(profile => (
                        <ProfileCard 
                          key={profile.id} 
                          profile={profile} 
                          preview={!isMember} 
                        />
                      ))}
                      
                      {!isMember && filteredProfiles.length > 2 && (
                        <Card className="flex flex-col justify-center items-center p-6 border-dashed border-2">
                          <Lock className="h-16 w-16 text-gray-400 mb-4" />
                          <h3 className="text-lg font-semibold text-center mb-2">
                            +{filteredProfiles.length - 2} perfis bloqueados
                          </h3>
                          <p className="text-sm text-gray-500 text-center mb-4">
                            Junte-se à Irmandade para acessar todos os perfis
                          </p>
                          <Button onClick={() => navigate('/irmandade')} size="sm">
                            Desbloquear Acesso
                          </Button>
                        </Card>
                      )}
                    </div>
                  </>
                )}
                
                {!isMember && (
                  <div className="mt-8 text-center text-gray-300 text-sm">
                    <p>Você tem {remainingViews} visualizações restantes hoje.</p>
                  </div>
                )}
              </>
            )}
          </TabsContent>
          
          <TabsContent value="activity">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Histórias da Comunidade</h2>
              
              {isMember ? (
                <div className="space-y-6">
                  <p className="text-gray-300">
                    Em breve, os membros poderão compartilhar suas histórias de recuperação aqui. 
                    Fique ligado para atualizações!
                  </p>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Lock className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Conteúdo exclusivo para membros
                  </h3>
                  <p className="text-gray-300 mb-6 max-w-md mx-auto">
                    Junte-se à Irmandade para ler histórias inspiradoras de recuperação e compartilhar a sua jornada
                  </p>
                  <Button onClick={() => navigate('/irmandade')}>
                    Participar da Irmandade
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Irmandade;
