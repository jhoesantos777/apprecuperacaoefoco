
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ProfessionalSelector } from '@/components/scheduling/ProfessionalSelector';
import { TimeSlotSelector } from '@/components/scheduling/TimeSlotSelector';
import { AppointmentsList } from '@/components/scheduling/AppointmentsList';
import { ConsultationType } from '@/components/scheduling/ConsultationType';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AvailableSlot } from '@/types/scheduling';

type ConsultationType = 'counselor' | 'psychologist' | 'psychiatrist' | 'mentor';

const Schedule = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedProfessional, setSelectedProfessional] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [consultationType, setConsultationType] = useState<ConsultationType>();
  const { toast } = useToast();
  const navigate = useNavigate();

  const { data: slots, isLoading: slotsLoading } = useQuery({
    queryKey: ['availableSlots', selectedDate, selectedProfessional],
    queryFn: async () => {
      if (!selectedDate || !selectedProfessional) return [];
      
      const { data, error } = await supabase
        .from('available_slots')
        .select('*')
        .eq('professional_id', selectedProfessional)
        .eq('date', format(selectedDate, 'yyyy-MM-dd'))
        .eq('is_available', true);

      if (error) throw error;
      return data as AvailableSlot[];
    },
    enabled: !!selectedDate && !!selectedProfessional,
  });

  const handleScheduleAppointment = async () => {
    if (!selectedSlot || !selectedProfessional || !selectedDate) {
      toast({
        title: "Erro",
        description: "Por favor, selecione todos os campos necessários.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await supabase.functions.invoke('create-appointment-checkout', {
        body: {
          professionalId: selectedProfessional,
          slotId: selectedSlot,
          date: format(selectedDate, 'yyyy-MM-dd'),
        },
      });

      if (response.error) throw response.error;
      
      window.location.href = response.data.url;
    } catch (error) {
      toast({
        title: "Erro ao agendar consulta",
        description: "Ocorreu um erro ao processar seu agendamento. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  // Reset professional selection when consultation type changes
  const handleConsultationTypeChange = (type: ConsultationType) => {
    setConsultationType(type);
    setSelectedProfessional(null);
    setSelectedSlot(null);
  };

  // Reset slot selection when professional or date changes
  const handleProfessionalChange = (professionalId: string) => {
    setSelectedProfessional(professionalId);
    setSelectedSlot(null);
  };
  
  const handleDateChange = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedSlot(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6">
      <Button
        variant="ghost"
        onClick={() => navigate('/dashboard')}
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Voltar ao Dashboard
      </Button>

      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Agendar Consulta</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <ConsultationType
                value={consultationType}
                onChange={handleConsultationTypeChange}
              />

              {consultationType && (
                <ProfessionalSelector
                  value={selectedProfessional}
                  onChange={handleProfessionalChange}
                  specialty={consultationType}
                />
              )}

              {selectedProfessional && (
                <div className="space-y-2">
                  <h3 className="font-medium">Selecione uma data</h3>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateChange}
                    locale={ptBR}
                    disabled={(date) => 
                      date < new Date() || 
                      date > new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                    }
                    className="rounded-md border shadow pointer-events-auto"
                  />
                </div>
              )}

              {selectedDate && selectedProfessional && (
                <TimeSlotSelector
                  slots={slots || []}
                  selectedSlot={selectedSlot}
                  onSelectSlot={setSelectedSlot}
                  isLoading={slotsLoading}
                  selectedDate={selectedDate}
                />
              )}

              <Button 
                className="w-full"
                onClick={handleScheduleAppointment}
                disabled={!selectedSlot || !selectedProfessional || !selectedDate}
              >
                Agendar e Pagar Consulta
              </Button>
            </CardContent>
          </Card>
        </div>

        <div>
          <AppointmentsList />
        </div>
      </div>
    </div>
  );
};

export default Schedule;
