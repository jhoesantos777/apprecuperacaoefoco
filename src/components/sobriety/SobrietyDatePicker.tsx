
import { format } from "date-fns";
import { CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type SobrietyDatePickerProps = {
  startDate?: Date | null;
  onDateSelect: (date: Date | undefined) => void;
};

export const SobrietyDatePicker = ({ startDate, onDateSelect }: SobrietyDatePickerProps) => {
  return (
    <div className="bg-white/10 rounded-lg p-6 text-white backdrop-blur-sm">
      <h2 className="text-lg font-semibold mb-4">Data de Início</h2>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            {startDate ? (
              format(new Date(startDate), "dd/MM/yyyy")
            ) : (
              "Escolher data"
            )}
            <CalendarDays className="ml-2 h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={startDate || undefined}
            onSelect={onDateSelect}
            disabled={(date) => date > new Date()}
            initialFocus
            className="pointer-events-auto"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};
