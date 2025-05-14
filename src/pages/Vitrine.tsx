
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { ProfileCard } from '@/components/irmandade/ProfileCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useIrmandade } from '@/contexts/IrmandadeContext';
import { Search, Users, Award, SlidersHorizontal } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { UserProfile } from '@/types/supabase';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const Vitrine: React.FC = () => {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [filteredProfiles, setFilteredProfiles] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('sobriedade');
  const { isMember } = useIrmandade();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfiles = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, nome, avatar_url, dias_sobriedade, cidade, story, rank, badges')
          .eq('is_active', true)
          .order('dias_sobriedade', { ascending: false });
        
        if (error) {
          console.error('Erro ao buscar perfis:', error);
          toast({
            title: "Erro",
            description: "Não foi possível carregar os perfis",
            variant: "destructive"
          });
          return;
        }
        
        // Cast data to UserProfile[] to allow for story property
        setProfiles(data || [] as UserProfile[]);
        setFilteredProfiles(data || [] as UserProfile[]);
      } catch (error) {
        console.error('Erro inesperado:', error);
        toast({
          title: "Erro",
          description: "Ocorreu um erro ao carregar os dados",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfiles();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      handleSort(sortBy);
      return;
    }
    
    const filtered = profiles.filter(profile => 
      profile.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.cidade?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    handleSort(sortBy);
  }, [searchTerm, profiles, sortBy]);

  // Modified handleSort to use the current state instead of accepting profiles as an argument
  const handleSort = (sortValue: string) => {
    let profilesToSort = searchTerm.trim() === '' 
      ? [...profiles] 
      : [...profiles.filter(profile => 
          profile.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          profile.cidade?.toLowerCase().includes(searchTerm.toLowerCase())
        )];
    
    let sorted = [...profilesToSort];
    
    switch (sortValue) {
      case 'sobriedade':
        sorted.sort((a, b) => (b.dias_sobriedade || 0) - (a.dias_sobriedade || 0));
        break;
      case 'nome':
        sorted.sort((a, b) => (a.nome || '').localeCompare(b.nome || ''));
        break;
      case 'cidade':
        sorted.sort((a, b) => (a.cidade || '').localeCompare(b.cidade || ''));
        break;
      default:
        break;
    }
    
    setFilteredProfiles(sorted);
    setSortBy(sortValue);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#2d0036] to-black px-4 sm:px-6 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-extrabold text-red-600 mb-2 tracking-[-0.06em] uppercase drop-shadow">
              Vitrine de Membros
            </h1>
            <p className="text-gray-300 max-w-2xl">
              Conecte-se com pessoas em jornada de recuperação, compartilhe experiências e encontre inspiração.
            </p>
          </div>
        </div>
        
        <div className="bg-purple-900/30 rounded-lg p-6 mb-8 border border-purple-600/40">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar por nome ou cidade..."
                className="pl-10 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-gray-400" />
              <Select value={sortBy} onValueChange={handleSort}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sobriedade">Dias de sobriedade</SelectItem>
                  <SelectItem value="nome">Nome</SelectItem>
                  <SelectItem value="cidade">Cidade</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-400" />
              <h2 className="text-xl font-bold text-white">Membros da Comunidade</h2>
            </div>
            <Badge variant="outline" className="text-gray-300 border-gray-500">
              {filteredProfiles.length} membros
            </Badge>
          </div>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
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
              <div className="text-center py-12 bg-purple-900/20 rounded-lg border border-purple-600/20">
                <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-300 text-lg mb-2">Nenhum membro encontrado com os critérios de busca.</p>
                <p className="text-gray-400">Tente ajustar sua busca para ver mais resultados.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProfiles.map(profile => (
                  <ProfileCard 
                    key={profile.id} 
                    profile={profile} 
                    preview={!isMember}
                  />
                ))}
              </div>
            )}
          </>
        )}
        
        <div className="flex justify-center mt-12">
          <Button onClick={() => navigate('/irmandade')} variant="outline" className="border-purple-500 text-purple-400">
            Voltar para Irmandade
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Vitrine;
