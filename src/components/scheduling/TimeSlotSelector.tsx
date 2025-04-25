
import React from 'react';
import { Button } from "@/components/ui/button";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface TimeSlotSelectorProps {
  slots: any[];
  selectedSlot: string | null;
  onSelectSlot: (slotId: string) => void;
  isLoading: boolean;
}

export const TimeSlotSelector = ({
  slots,
  selectedSlot,
  onSelectSlot,
  isLoading,
}: TimeSlotSelectorProps) => {
  if (isLoading) {
    return <div>Carregando horários disponíveis...</div>;
  }

  if (slots.length === 0) {
    return (
      <div className="text-center p-4 text-muted-foreground">
        Nenhum horário disponível para esta data.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h3 className="font-medium">Horários Disponíveis</h3>
      <div className="grid grid-cols-3 gap-2">
        {slots.map((slot) => (
          <Button
            key={slot.id}
            variant={selectedSlot === slot.id ? "default" : "outline"}
            onClick={() => onSelectSlot(slot.id)}
            className="w-full"
          >
            {format(new Date(`2000-01-01 ${slot.start_time}`), 'HH:mm', { locale: ptBR })}
          </Button>
        ))}
      </div>
    </div>
  );
};
