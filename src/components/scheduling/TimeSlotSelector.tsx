
import React from 'react';
import { Button } from "@/components/ui/button";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AvailableSlot } from '@/types/scheduling';

interface TimeSlotSelectorProps {
  slots: AvailableSlot[];
  selectedSlot: string | null;
  onSelectSlot: (slotId: string) => void;
  isLoading: boolean;
  selectedDate?: Date;
}

export const TimeSlotSelector = ({
  slots,
  selectedSlot,
  onSelectSlot,
  isLoading,
  selectedDate,
}: TimeSlotSelectorProps) => {
  if (isLoading) {
    return <div className="py-4 text-center text-muted-foreground">Carregando horários disponíveis...</div>;
  }

  if (slots.length === 0) {
    return (
      <Alert>
        <AlertTitle>Nenhum horário disponível</AlertTitle>
        <AlertDescription>
          {selectedDate ? (
            <>
              Não encontramos horários disponíveis para {format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}.
              Por favor, selecione outra data ou profissional.
            </>
          ) : (
            <>
              Nenhum horário disponível para a data selecionada.
              Por favor, selecione outra data ou profissional.
            </>
          )}
        </AlertDescription>
      </Alert>
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
