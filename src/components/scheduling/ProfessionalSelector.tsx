
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { User } from 'lucide-react';
import type { Database } from "@/integrations/supabase/types";

type Professional = Database['public']['Tables']['professionals']['Row'];

interface ProfessionalSelectorProps {
  value: string | null;
  onChange: (value: string) => void;
  specialty?: string;
}

export const ProfessionalSelector = ({ value, onChange, specialty }: ProfessionalSelectorProps) => {
  const { data: professionals, isLoading } = useQuery({
    queryKey: ['professionals', specialty],
    queryFn: async () => {
      let query = supabase
        .from('professionals')
        .select('*')
        .order('name');
      
      if (specialty) {
        query = query.eq('specialty', specialty);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as Professional[];
    },
  });

  if (isLoading) {
    return <div>Carregando profissionais...</div>;
  }

  if (!professionals?.length) {
    return <div>Nenhum profissional encontrado para esta especialidade.</div>;
  }

  return (
    <div className="space-y-2">
      <h3 className="font-medium">Selecione um profissional</h3>
      <div className="grid grid-cols-1 gap-4">
        {professionals?.map((professional) => (
          <Card
            key={professional.id}
            className={`cursor-pointer transition-all ${
              value === professional.id
                ? 'border-primary ring-2 ring-primary'
                : 'hover:border-primary/50'
            }`}
            onClick={() => onChange(professional.id)}
          >
            <CardContent className="flex items-center gap-4 p-4">
              {professional.image_url ? (
                <img
                  src={professional.image_url}
                  alt={professional.name}
                  className="h-12 w-12 rounded-full object-cover"
                />
              ) : (
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                  <User className="h-6 w-6 text-muted-foreground" />
                </div>
              )}
              <div>
                <h4 className="font-medium">{professional.name}</h4>
                <p className="text-sm text-muted-foreground">{professional.specialty}</p>
                <p className="text-sm font-medium text-primary">
                  R$ {(professional.hourly_rate / 100).toFixed(2)}/hora
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
