
import React from 'react';
import { Stethoscope, User, Brain } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Card, CardContent } from "@/components/ui/card";

type ConsultationType = 'counselor' | 'psychologist' | 'psychiatrist' | 'mentor';

interface ConsultationTypeProps {
  value: ConsultationType | undefined;
  onChange: (value: ConsultationType) => void;
}

export function ConsultationType({ value, onChange }: ConsultationTypeProps) {
  return (
    <div className="space-y-2">
      <h3 className="font-medium">Selecione o tipo de consulta</h3>
      <Card>
        <CardContent className="p-4">
          <ToggleGroup 
            type="single" 
            value={value} 
            onValueChange={(val) => onChange(val as ConsultationType)}
            className="justify-start flex-wrap gap-2"
          >
            <ToggleGroupItem value="counselor" aria-label="Conselheiro" className="gap-2">
              <User className="h-4 w-4" />
              <span>Conselheiro</span>
            </ToggleGroupItem>
            <ToggleGroupItem value="psychologist" aria-label="Psicólogo" className="gap-2">
              <Brain className="h-4 w-4" />
              <span>Psicólogo</span>
            </ToggleGroupItem>
            <ToggleGroupItem value="psychiatrist" aria-label="Psiquiatra" className="gap-2">
              <Stethoscope className="h-4 w-4" />
              <span>Psiquiatra</span>
            </ToggleGroupItem>
            <ToggleGroupItem value="mentor" aria-label="Mentor" className="gap-2">
              <User className="h-4 w-4" />
              <span>Mentor</span>
            </ToggleGroupItem>
          </ToggleGroup>
        </CardContent>
      </Card>
    </div>
  );
}
