
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useIrmandade } from '@/contexts/IrmandadeContext';
import { Lock, MessageSquare, User, MapPin, Award } from 'lucide-react';
import { ProfilePicture } from '@/components/ProfilePicture';
import { UserProfile } from '@/types/supabase';

interface ProfileCardProps {
  profile: UserProfile;
  preview?: boolean;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ profile, preview = false }) => {
  const navigate = useNavigate();
  const { decrementViews } = useIrmandade();
  
  const handleViewProfile = () => {
    if (!preview) {
      navigate(`/perfil/${profile.id}`);
    } else {
      decrementViews();
      navigate(`/perfil/${profile.id}`);
    }
  };

  return (
    <Card className={`p-6 border border-purple-600/40 bg-gradient-to-b from-[#2d0036]/60 to-black overflow-hidden relative ${preview ? 'opacity-90' : ''} hover:shadow-xl hover:shadow-purple-900/20 transition-all`}>
      {preview && (
        <div className="absolute top-2 right-2">
          <Badge variant="secondary" className="bg-purple-900 text-purple-100">Preview</Badge>
        </div>
      )}

      <div className="flex flex-col items-center">
        <div className="mb-4">
          <ProfilePicture 
            avatarUrl={profile.avatar_url} 
            userId={profile.id} 
            userName={profile.nome}
            size="lg" 
          />
        </div>

        <h3 className="text-xl font-bold text-white mb-1">
          {profile.nome}
        </h3>

        {profile.dias_sobriedade !== null && profile.dias_sobriedade !== undefined && (
          <div className="text-yellow-400 text-sm font-semibold mb-2">
            {profile.dias_sobriedade} dias em sobriedade
          </div>
        )}

        {profile.rank && (
          <Badge variant="outline" className="bg-green-900/40 text-green-300 border-green-600/50 mb-2">
            <Award className="h-3 w-3 mr-1" />
            {profile.rank}
          </Badge>
        )}

        {profile.cidade && (
          <div className="flex items-center text-gray-400 text-sm mb-4">
            <MapPin className="h-3 w-3 mr-1" /> {profile.cidade}
          </div>
        )}

        <div className="w-full mt-2 mb-4">
          {profile.story ? (
            <p className="text-gray-300 text-sm line-clamp-3 text-center">
              "{profile.story.substring(0, 120)}..."
            </p>
          ) : (
            <div className="text-gray-500 text-sm text-center italic">
              Este membro ainda não compartilhou sua história
            </div>
          )}
        </div>

        <Button
          onClick={handleViewProfile}
          className="w-full bg-purple-700 hover:bg-purple-800 mt-auto"
          size="sm"
        >
          {preview ? (
            <>
              <Lock className="h-4 w-4 mr-1" /> Visualizar Perfil
            </>
          ) : (
            <>
              <MessageSquare className="h-4 w-4 mr-1" /> Conectar
            </>
          )}
        </Button>
      </div>
    </Card>
  );
};
