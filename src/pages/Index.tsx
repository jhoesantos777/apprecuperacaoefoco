import { ArrowDown } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-between px-4 py-8"
      style={{
        backgroundImage: 'url("/bg-pattern-modern.svg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundBlendMode: 'soft-light'
      }}
    >
      <motion.div 
        className="w-full max-w-md flex flex-col items-center text-center mt-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div 
          className="mb-8"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div className="w-40 h-40 flex items-center justify-center mb-4">
            <img src="/logo-filos.png" alt="Logo Filos" className="w-full h-full object-contain" />
          </div>
        </motion.div>

        <motion.p 
          className="text-white text-lg mb-12 max-w-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          "Hoje começa um novo capítulo da sua história. Você não está sozinho — um dia de cada vez, com fé, força e foco, a vitória é possível."
        </motion.p>

        <motion.div 
          className="flex flex-col gap-4 w-full max-w-xs"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <Button
            asChild
            size="xl"
            className="bg-gradient-to-r from-yellow-400 to-yellow-300 text-blue-900 hover:from-yellow-500 hover:to-yellow-400 shadow-lg"
          >
            <a href="/auth?mode=login">
              ENTRAR
            </a>
          </Button>
          <Button
            asChild
            variant="outline"
            size="xl"
            className="border-2 border-yellow-300 text-yellow-300 hover:bg-yellow-300/10"
          >
            <a href="/cadastro-simplificado">
              SE INSCREVER
            </a>
          </Button>
        </motion.div>
      </motion.div>

      <motion.div 
        className="mt-12 text-white/50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        whileHover={{ scale: 1.2 }}
      >
        <div className="animate-bounce">
          <ArrowDown size={32} />
        </div>
      </motion.div>
    </div>
  );
};

export default Index;
