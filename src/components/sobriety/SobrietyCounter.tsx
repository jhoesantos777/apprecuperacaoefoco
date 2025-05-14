
import { CalendarDays } from "lucide-react";
import { motion } from "framer-motion";
import { format, differenceInDays } from "date-fns";

type SobrietyCounterProps = {
  daysCount: number;
  sobrietyStartDate?: string | null;
};

export const SobrietyCounter = ({ daysCount, sobrietyStartDate }: SobrietyCounterProps) => {
  // Calcular dias com base na data de início, se disponível
  const calculatedDaysCount = sobrietyStartDate 
    ? differenceInDays(new Date(), new Date(sobrietyStartDate))
    : daysCount || 0;
  
  // Usar o maior valor entre o calculado e o informado
  const displayDaysCount = Math.max(calculatedDaysCount, daysCount || 0);
  
  const motivationalPhrases = [
    "Você está vencendo um dia de cada vez!",
    "Cada dia limpo é uma vitória!",
    "Sua força é maior que qualquer desafio!",
  ];

  const randomPhrase = motivationalPhrases[Math.floor(Math.random() * motivationalPhrases.length)];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-xl p-8 text-center text-white backdrop-blur-sm border border-white/10 shadow-lg"
    >
      <motion.div 
        className="flex items-center justify-center mb-6"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="bg-gradient-to-br from-purple-500/30 to-blue-500/30 p-6 rounded-full shadow-lg border border-white/20">
          <CalendarDays className="w-12 h-12 text-purple-300" />
        </div>
      </motion.div>

      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="relative"
      >
        <h1 className="text-7xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-blue-300 drop-shadow-lg">
          {displayDaysCount}
        </h1>
        <motion.div
          className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-purple-300 to-blue-300 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: "6rem" }}
          transition={{ delay: 0.5, duration: 0.5 }}
        />
      </motion.div>

      <motion.p 
        className="text-2xl mb-6 font-medium text-white/90 mt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        Minha Sobriedade
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="bg-white/5 p-4 rounded-lg border border-white/10"
      >
        <p className="text-white/80 italic text-lg">{randomPhrase}</p>
      </motion.div>

      <motion.div
        className="mt-6 grid grid-cols-3 gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.5 }}
      >
        <div className="bg-white/5 p-3 rounded-lg border border-white/10">
          <p className="text-sm text-white/60">Dias</p>
          <p className="text-xl font-bold text-white">{displayDaysCount}</p>
        </div>
        <div className="bg-white/5 p-3 rounded-lg border border-white/10">
          <p className="text-sm text-white/60">Meses</p>
          <p className="text-xl font-bold text-white">{Math.floor(displayDaysCount / 30)}</p>
        </div>
        <div className="bg-white/5 p-3 rounded-lg border border-white/10">
          <p className="text-sm text-white/60">Anos</p>
          <p className="text-xl font-bold text-white">{(displayDaysCount / 365).toFixed(1)}</p>
        </div>
      </motion.div>
    </motion.div>
  );
};
