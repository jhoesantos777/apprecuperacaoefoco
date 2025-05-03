import { format } from "date-fns";
import { CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type SobrietyDatePickerProps = {
  startDate?: Date | null;
  onDateSelect: (date: Date | undefined) => void;
};

export const SobrietyDatePicker = ({ startDate, onDateSelect }: SobrietyDatePickerProps) => {
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value ? new Date(e.target.value) : undefined;
    onDateSelect(date);
  };

  return (
    <div className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-xl p-6 text-white backdrop-blur-sm border border-white/10 shadow-lg">
      <h2 className="text-xl font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-blue-300">
        Data de Início da Sobriedade
      </h2>
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <CalendarDays className="w-5 h-5 text-purple-300" />
          <Input
            type="date"
            value={startDate ? format(startDate, "yyyy-MM-dd") : ""}
            onChange={handleDateChange}
            max={format(new Date(), "yyyy-MM-dd")}
            className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
          />
        </div>
        {startDate && (
          <p className="text-sm text-white/80">
            Data selecionada: {format(startDate, "dd/MM/yyyy")}
          </p>
        )}
      </div>
    </div>
  );
};
