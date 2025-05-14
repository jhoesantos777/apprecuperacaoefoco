
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { ProfilePicture } from '@/components/ProfilePicture';

interface UserProfile {
  id: string;
  nome: string;
  avatar_url: string;
  dias_sobriedade?: number;
}

const Users: React.FC = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, nome, avatar_url, dias_sobriedade');
        
        console.log('Dados retornados:', data);
        console.log('Erro se houver:', error);
        
        if (error) {
          console.error('Erro ao buscar usuários:', error.message);
          return;
        }
        
        if (data) {
          console.log('Número de usuários encontrados:', data.length);
          setUsers(data);
        }
      } catch (err) {
        console.error('Erro inesperado:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#2d0036] to-black px-4 sm:px-6 py-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center text-red-600 mb-8 tracking-[-0.06em] uppercase drop-shadow">
          Membros da Comunidade
        </h1>
        {loading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <div className="text-white text-lg">Carregando...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {users.map((user) => (
              <div
                key={user.id}
                className="bg-gradient-to-br from-[#2d0036] to-black border border-[#4b206b] rounded-2xl shadow-xl p-6 flex flex-col items-center group hover:ring-2 hover:ring-[#a259ec] transition-all duration-300 cursor-pointer transform hover:scale-105"
                onClick={() => navigate(`/perfil/${user.id}`)}
              >
                <div className="mb-4">
                  <ProfilePicture avatarUrl={user.avatar_url} userId={user.id} userName={user.nome} size="lg" />
                </div>
                <div className="text-white font-bold text-xl mb-2 text-center group-hover:text-[#a259ec] transition-all">
                  {user.nome}
                </div>
                <div className="text-yellow-400 text-sm font-semibold mb-4">
                  {user.dias_sobriedade ?? 0} dias em sobriedade
                </div>
                <button
                  className="mt-auto w-full px-6 py-3 rounded-full bg-red-600 text-white font-bold shadow-lg hover:bg-red-700 transition-all text-sm transform hover:scale-105"
                  onClick={e => { e.stopPropagation(); navigate(`/perfil/${user.id}`); }}
                >
                  Ver Perfil
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Users; 
