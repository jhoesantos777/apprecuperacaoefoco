
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { QuoteIcon } from "lucide-react";
import { getTodaysMotivation } from '@/data/dailyMotivations';

const DailyMotivation: React.FC = () => {
  const todaysMotivation = getTodaysMotivation();

  return (
    <Card className="bg-white/80 shadow-md border border-rose-100">
      <CardContent className="p-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-start gap-3">
            <QuoteIcon className="text-rose-400 w-6 h-6 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-xl font-serif text-gray-800 mb-1">
                {todaysMotivation.phrase}
              </h3>
              <p className="text-gray-600">
                {todaysMotivation.reflection}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DailyMotivation;
