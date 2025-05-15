import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type AppointmentWithProfessional = Database['public']['Tables']['appointments']['Row'] & {
  professionals: Database['public']['Tables']['professionals']['Row'];
};

export const AppointmentsList = () => {
  const { toast } = useToast();
  
  const { data: appointments, isLoading, refetch } = useQuery({
    queryKey: ['myAppointments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          professionals (
            name,
            specialty
          )
        `)
        .order('appointment_date', { ascending: true })
        .order('start_time', { ascending: true });
      
      if (error) throw error;
      return data as AppointmentWithProfessional[];
    },
  });

  const handleCancelAppointment = async (appointmentId: string) => {
    try {
      const { error } = await supabase.functions.invoke('cancel-appointment', {
        body: { appointmentId },
      });

      if (error) throw error;

      toast("Consulta cancelada com sucesso.");

      refetch();
    } catch (error) {
      toast("Não foi possível cancelar sua consulta. Tente novamente.");
    }
  };

  const canCancel = (appointmentDate: string, startTime: string) => {
    const appointmentDateTime = new Date(`${appointmentDate} ${startTime}`);
    const now = new Date();
    const diffHours = (appointmentDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);
    return diffHours >= 24;
  };

  if (isLoading) {
    return <div>Carregando suas consultas...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Minhas Consultas</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {appointments?.length === 0 ? (
          <p className="text-center text-muted-foreground">
            Você não tem consultas agendadas.
          </p>
        ) : (
          appointments?.map((appointment) => (
            <Card key={appointment.id} className="p-4">
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{appointment.professionals?.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {appointment.professionals?.specialty}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      {format(new Date(appointment.appointment_date), "dd 'de' MMMM", { locale: ptBR })}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(`2000-01-01 ${appointment.start_time}`), 'HH:mm', { locale: ptBR })}
                    </p>
                  </div>
                </div>
                {canCancel(appointment.appointment_date, appointment.start_time) && (
                  <Button
                    variant="destructive"
                    size="sm"
                    className="w-full mt-2"
                    onClick={() => handleCancelAppointment(appointment.id)}
                  >
                    Cancelar Consulta
                  </Button>
                )}
              </div>
            </Card>
          ))
        )}
      </CardContent>
    </Card>
  );
};
