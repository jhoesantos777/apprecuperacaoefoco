
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProfilePicture } from "@/components/ProfilePicture";
import { useIrmandade } from "@/contexts/IrmandadeContext";
import { toast } from "@/components/ui/sonner";

interface ProfileCardProps {
  profile: {
    id: string;
    nome: string;
    avatar_url: string | null;
    dias_sobriedade?: number | null;
    cidade?: string | null;
    story?: string | null;
  };
  preview?: boolean;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ profile, preview = false }) => {
  const navigate = useNavigate();
  const { isMember, remainingViews, decrementViews } = useIrmandade();

  const handleViewProfile = () => {
    if (isMember) {
      navigate(`/perfil/${profile.id}`);
    } else if (remainingViews > 0) {
      decrementViews();
      navigate(`/perfil/${profile.id}`);
    } else {
      toast("Limite de visualizações diárias atingido. Junte-se à Irmandade para acesso ilimitado.", {
        action: {
          label: "Saiba mais",
          onClick: () => navigate("/irmandade")
        }
      });
    }
  };

  return (
    <Card className={`overflow-hidden transition-all duration-300 ${
      preview ? "opacity-90 hover:opacity-100" : "hover:shadow-lg transform hover:scale-105"
    }`}>
      <CardContent className="p-6">
        <div className="flex flex-col items-center">
          <div className="mb-4 relative">
            {preview ? (
              <div className="relative">
                <ProfilePicture 
                  avatarUrl={profile.avatar_url} 
                  userId={profile.id} 
                  userName={profile.nome} 
                  size="lg" 
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-full">
                  <span className="text-white font-bold text-xs">PRÉVIA</span>
                </div>
              </div>
            ) : (
              <ProfilePicture 
                avatarUrl={profile.avatar_url} 
                userId={profile.id} 
                userName={profile.nome} 
                size="lg" 
              />
            )}
          </div>
          
          <h3 className="text-xl font-bold text-center mb-2">{profile.nome}</h3>
          
          {profile.dias_sobriedade !== undefined && (
            <div className="text-yellow-500 font-semibold text-center mb-2">
              {profile.dias_sobriedade || 0} dias em sobriedade
            </div>
          )}
          
          {profile.cidade && (
            <div className="text-gray-600 text-sm text-center mb-3">
              {profile.cidade}
            </div>
          )}
          
          {profile.story && !preview && (
            <div className="text-sm text-gray-700 text-center mb-4 line-clamp-3">
              "{profile.story}"
            </div>
          )}
          
          {preview && (
            <div className="text-sm text-gray-500 italic text-center mb-4">
              Entre na Irmandade para ver a história completa
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="bg-gray-50 p-4 flex justify-center">
        <Button 
          onClick={handleViewProfile} 
          variant={preview ? "outline" : "default"} 
          size="sm" 
          className={preview ? "border-purple-400 text-purple-700" : ""}
        >
          {preview ? "Visualizar Prévia" : "Ver Perfil Completo"}
        </Button>
      </CardFooter>
    </Card>
  );
};
