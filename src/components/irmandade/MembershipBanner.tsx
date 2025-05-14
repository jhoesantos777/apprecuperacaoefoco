
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useIrmandade } from "@/contexts/IrmandadeContext";
import { ShieldCheck, Users, Lock } from "lucide-react";

interface MembershipBannerProps {
  compact?: boolean;
}

export const MembershipBanner: React.FC<MembershipBannerProps> = ({ compact = false }) => {
  const { isMember, joinIrmandade, leaveIrmandade, remainingViews, loading } = useIrmandade();

  if (loading) {
    return (
      <Card className="p-4 animate-pulse bg-gradient-to-r from-purple-100 to-indigo-100">
        <div className="h-24"></div>
      </Card>
    );
  }

  if (compact) {
    return (
      <Card className={`p-4 ${isMember ? 'bg-gradient-to-r from-green-100 to-teal-100' : 'bg-gradient-to-r from-purple-100 to-indigo-100'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {isMember ? (
              <ShieldCheck className="h-5 w-5 text-green-500 mr-2" />
            ) : (
              <Lock className="h-5 w-5 text-purple-500 mr-2" />
            )}
            <span className="font-medium text-sm">
              {isMember ? 'Membro da Irmandade' : `${remainingViews} visualizações restantes`}
            </span>
          </div>
          <Button
            size="sm"
            variant={isMember ? "outline" : "default"}
            onClick={isMember ? leaveIrmandade : joinIrmandade}
          >
            {isMember ? 'Sair' : 'Participar'}
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className={`p-6 ${isMember ? 'bg-gradient-to-r from-green-100 to-teal-100' : 'bg-gradient-to-r from-purple-100 to-indigo-100'}`}>
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
        <div className={`rounded-full p-3 ${isMember ? 'bg-green-200' : 'bg-purple-200'}`}>
          {isMember ? (
            <ShieldCheck className="h-8 w-8 text-green-700" />
          ) : (
            <Users className="h-8 w-8 text-purple-700" />
          )}
        </div>
        
        <div className="flex-1 text-center sm:text-left">
          <h3 className="text-lg font-bold mb-1">
            {isMember ? 'Você é membro da Irmandade' : 'Junte-se à Irmandade'}
          </h3>
          
          <p className="text-sm mb-4">
            {isMember 
              ? 'Obrigado por fazer parte da nossa comunidade. Você tem acesso completo a todos os perfis e histórias dos membros.'
              : `Como visitante, você pode visualizar apenas ${remainingViews} perfis por dia. Junte-se à Irmandade para acesso ilimitado e compartilhe sua própria jornada.`
            }
          </p>
          
          <Button
            onClick={isMember ? leaveIrmandade : joinIrmandade}
            variant={isMember ? "outline" : "default"}
            className={isMember ? "border-green-500 text-green-700" : ""}
          >
            {isMember ? 'Sair da Irmandade' : 'Participar da Irmandade'}
          </Button>
        </div>
      </div>
    </Card>
  );
};
