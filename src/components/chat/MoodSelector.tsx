
import React from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { SmileIcon, FrownIcon, MehIcon } from 'lucide-react';

interface MoodSelectorProps {
  mood: string;
  onMoodChange: (value: string) => void;
}

const MoodSelector = ({ mood, onMoodChange }: MoodSelectorProps) => {
  return (
    <div className="space-y-3">
      <Label className="text-gray-700">Como você está se sentindo hoje?</Label>
      <RadioGroup
        defaultValue="neutral"
        className="flex justify-center gap-8"
        value={mood}
        onValueChange={onMoodChange}
      >
        <div className="flex flex-col items-center gap-1">
          <RadioGroupItem value="happy" id="happy" className="sr-only" />
          <Label
            htmlFor="happy"
            className={`p-2 rounded-full cursor-pointer transition-colors ${
              mood === 'happy' ? 'bg-green-100' : 'hover:bg-gray-100'
            }`}
          >
            <SmileIcon className="w-8 h-8 text-green-500" />
          </Label>
          <span className="text-sm text-gray-600">Bem</span>
        </div>

        <div className="flex flex-col items-center gap-1">
          <RadioGroupItem value="neutral" id="neutral" className="sr-only" />
          <Label
            htmlFor="neutral"
            className={`p-2 rounded-full cursor-pointer transition-colors ${
              mood === 'neutral' ? 'bg-blue-100' : 'hover:bg-gray-100'
            }`}
          >
            <MehIcon className="w-8 h-8 text-blue-500" />
          </Label>
          <span className="text-sm text-gray-600">Regular</span>
        </div>

        <div className="flex flex-col items-center gap-1">
          <RadioGroupItem value="sad" id="sad" className="sr-only" />
          <Label
            htmlFor="sad"
            className={`p-2 rounded-full cursor-pointer transition-colors ${
              mood === 'sad' ? 'bg-red-100' : 'hover:bg-gray-100'
            }`}
          >
            <FrownIcon className="w-8 h-8 text-red-500" />
          </Label>
          <span className="text-sm text-gray-600">Mal</span>
        </div>
      </RadioGroup>
    </div>
  );
};

export default MoodSelector;
