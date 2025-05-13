
import React from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Smile, Meh, Frown, Angry, AlertCircle } from 'lucide-react';

interface MoodSelectorProps {
  mood: string;
  onMoodChange: (value: string) => void;
}

const MoodSelector = ({ mood, onMoodChange }: MoodSelectorProps) => {
  return (
    <div className="space-y-3">
      <Label className="text-white">Como você está se sentindo hoje?</Label>
      <RadioGroup
        value={mood}
        onValueChange={onMoodChange}
        className="flex flex-wrap justify-center gap-4 sm:gap-6"
      >
        <div className="flex flex-col items-center gap-1">
          <RadioGroupItem value="happy" id="happy" className="sr-only" />
          <Label
            htmlFor="happy"
            className={`p-2 rounded-full cursor-pointer transition-colors ${
              mood === 'happy' ? 'bg-green-100' : 'hover:bg-gray-100'
            }`}
          >
            <Smile className="w-8 h-8 text-green-500" />
          </Label>
          <span className="text-sm text-gray-600">Tranquilo</span>
        </div>

        <div className="flex flex-col items-center gap-1">
          <RadioGroupItem value="neutral" id="neutral" className="sr-only" />
          <Label
            htmlFor="neutral"
            className={`p-2 rounded-full cursor-pointer transition-colors ${
              mood === 'neutral' ? 'bg-blue-100' : 'hover:bg-gray-100'
            }`}
          >
            <Meh className="w-8 h-8 text-blue-500" />
          </Label>
          <span className="text-sm text-gray-600">Neutro</span>
        </div>

        <div className="flex flex-col items-center gap-1">
          <RadioGroupItem value="sad" id="sad" className="sr-only" />
          <Label
            htmlFor="sad"
            className={`p-2 rounded-full cursor-pointer transition-colors ${
              mood === 'sad' ? 'bg-red-100' : 'hover:bg-gray-100'
            }`}
          >
            <Frown className="w-8 h-8 text-red-500" />
          </Label>
          <span className="text-sm text-gray-600">Triste</span>
        </div>

        <div className="flex flex-col items-center gap-1">
          <RadioGroupItem value="angry" id="angry" className="sr-only" />
          <Label
            htmlFor="angry"
            className={`p-2 rounded-full cursor-pointer transition-colors ${
              mood === 'angry' ? 'bg-orange-100' : 'hover:bg-gray-100'
            }`}
          >
            <Angry className="w-8 h-8 text-orange-500" />
          </Label>
          <span className="text-sm text-gray-600">Irritado</span>
        </div>

        <div className="flex flex-col items-center gap-1">
          <RadioGroupItem value="anxious" id="anxious" className="sr-only" />
          <Label
            htmlFor="anxious"
            className={`p-2 rounded-full cursor-pointer transition-colors ${
              mood === 'anxious' ? 'bg-purple-100' : 'hover:bg-gray-100'
            }`}
          >
            <AlertCircle className="w-8 h-8 text-purple-500" />
          </Label>
          <span className="text-sm text-gray-600">Ansioso</span>
        </div>
      </RadioGroup>
    </div>
  );
};

export default MoodSelector;
