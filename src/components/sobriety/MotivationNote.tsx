
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
    <div className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-xl p-6 text-white backdrop-blur-sm border border-white/10 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-blue-300">
          Nota de Motivação
        </h2>
        {!isEditing ? (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onEditToggle}
            className="hover:bg-white/10 text-white"
          >
            <Edit2 className="h-4 w-4" />
          </Button>
        ) : (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onSave}
            className="hover:bg-white/10 text-white"
          >
            <Save className="h-4 w-4" />
          </Button>
        )}
      </div>
      {isEditing ? (
        <Textarea
          value={note}
          onChange={(e) => onNoteChange(e.target.value)}
          placeholder="Escreva aqui sua motivação..."
          className="bg-white/5 border-white/10 text-white placeholder:text-white/50 focus-visible:ring-purple-400"
        />
      ) : (
        <p className="text-white/80 italic bg-white/5 p-4 rounded-lg min-h-[100px]">
          {note || "Adicione uma nota de motivação..."}
        </p>
      )}
    </div>
  );
};
