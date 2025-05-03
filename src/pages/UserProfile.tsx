import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { ProfilePicture } from '@/components/ProfilePicture';

interface UserProfile {
  id: string;
  nome: string;
  avatar_url: string;
  dias_sobriedade?: number;
  cidade?: string;
}

const UserProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('id, nome, avatar_url, dias_sobriedade, cidade')
        .eq('id', id)
        .single();
      if (!error && data) setUser(data);
      setLoading(false);
    };
    if (id) fetchUser();
  }, [id]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#2d0036] to-black"><span className="text-white text-lg">Carregando perfil...</span></div>;
  }

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#2d0036] to-black"><span className="text-white text-lg">Usuário não encontrado.</span></div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#2d0036] to-black px-4 sm:px-6 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-br from-[#2d0036] to-black border border-[#4b206b] rounded-2xl shadow-xl p-8">
          <div className="flex flex-col items-center">
            <div className="mb-6">
              <ProfilePicture avatarUrl={user?.avatar_url} userId={user?.id} userName={user?.nome} size="lg" />
            </div>
            <h1 className="text-3xl font-extrabold text-white mb-2 text-center">{user?.nome}</h1>
            <div className="text-yellow-400 text-xl font-semibold mb-6">
              {user?.dias_sobriedade ?? 0} dias em sobriedade
            </div>
            {user?.cidade && (
              <div className="text-gray-300 text-lg mb-6">
                <i className="fas fa-map-marker-alt mr-2"></i>
                {user.cidade}
              </div>
            )}
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-3 rounded-full bg-red-600 text-white font-bold shadow-lg hover:bg-red-700 transition-all transform hover:scale-105"
            >
              Voltar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage; 