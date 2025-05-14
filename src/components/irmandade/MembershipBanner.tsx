
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useIrmandade } from '@/contexts/IrmandadeContext';
import { ShieldCheck, Lock } from 'lucide-react';

export const MembershipBanner: React.FC = () => {
  const { isMember, joinIrmandade, leaveIrmandade, loading } = useIrmandade();

  return (
    <Card className={`p-6 border transition-all ${isMember ? 'bg-gradient-to-r from-green-900/40 to-green-800/20 border-green-600' : 'bg-gradient-to-r from-purple-900/30 to-purple-800/10 border-purple-600/50'}`}>
      <div className="flex flex-col sm:flex-row justify-between items-center">
        <div className="flex items-center mb-4 sm:mb-0">
          {isMember ? (
            <ShieldCheck className="h-10 w-10 text-green-400 mr-4" />
          ) : (
            <Lock className="h-10 w-10 text-purple-400 mr-4" />
          )}
          
          <div>
            <h3 className="text-xl font-semibold text-white">
              {isMember ? 'Você é membro da Irmandade' : 'Acesso Exclusivo da Irmandade'}
            </h3>
            <p className="text-gray-300 mt-1">
              {isMember 
                ? 'Você tem acesso completo a todos os recursos da comunidade.' 
                : 'Entre para a Irmandade e conecte-se com outros membros em recuperação.'}
            </p>
          </div>
        </div>
        
        <Button 
          onClick={isMember ? leaveIrmandade : joinIrmandade}
          variant={isMember ? "outline" : "default"}
          className={isMember 
            ? "border-red-500 text-red-400 hover:bg-red-950 hover:text-red-300" 
            : "bg-purple-600 hover:bg-purple-700"
          }
          disabled={loading}
        >
          {isMember ? 'Sair da Irmandade' : 'Participar da Irmandade'}
        </Button>
      </div>
    </Card>
  );
};
