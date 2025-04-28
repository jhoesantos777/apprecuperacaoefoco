
import { Edit2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type MotivationNoteProps = {
  isEditing: boolean;
  note: string;
  onNoteChange: (note: string) => void;
  onEditToggle: () => void;
  onSave: () => void;
};

export const MotivationNote = ({
  isEditing,
  note,
  onNoteChange,
  onEditToggle,
  onSave,
}: MotivationNoteProps) => {
  return (
    <div className="bg-white/10 rounded-lg p-6 text-white backdrop-blur-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Nota de Motivação</h2>
        {!isEditing ? (
          <Button variant="ghost" size="sm" onClick={onEditToggle}>
            <Edit2 className="h-4 w-4" />
          </Button>
        ) : (
          <Button variant="ghost" size="sm" onClick={onSave}>
            <Save className="h-4 w-4" />
          </Button>
        )}
      </div>
      {isEditing ? (
        <Textarea
          value={note}
          onChange={(e) => onNoteChange(e.target.value)}
          placeholder="Escreva aqui sua motivação..."
          className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
        />
      ) : (
        <p className="text-white/80 italic">
          {note || "Adicione uma nota de motivação..."}
        </p>
      )}
    </div>
  );
};
