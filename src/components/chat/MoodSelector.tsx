
import React from 'react';

interface MoodSelectorProps {
  mood: string;
  onMoodChange: (mood: string) => void;
}

const MoodSelector = ({ mood, onMoodChange }: MoodSelectorProps) => {
  const moods = [
    { id: 'happy', emoji: '😊', label: 'Feliz' },
    { id: 'neutral', emoji: '😐', label: 'Neutro' },
    { id: 'sad', emoji: '😢', label: 'Triste' },
    { id: 'angry', emoji: '😠', label: 'Irritado' }
  ];

  return (
    <div className="mb-4">
      <p className="text-sm text-gray-600 mb-2">Como você está se sentindo hoje?</p>
      <div className="flex justify-center gap-4">
        {moods.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => onMoodChange(m.id)}
            className={`flex flex-col items-center p-2 rounded-lg transition-all ${
              mood === m.id ? 'bg-blue-100 shadow-sm' : 'hover:bg-gray-100'
            }`}
            title={m.label}
          >
            <span className="text-2xl">{m.emoji}</span>
            <span className="text-xs mt-1">{m.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MoodSelector;
