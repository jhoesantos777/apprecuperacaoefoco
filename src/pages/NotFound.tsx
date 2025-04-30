
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { BackButton } from '@/components/BackButton';
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div 
      className="min-h-screen flex flex-col p-6"
      style={{
        backgroundImage: 'url("/bg-pattern-modern.svg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundBlendMode: 'soft-light'
      }}
    >
      <BackButton />
      
      <div className="flex-1 flex items-center justify-center">
        <motion.div 
          className="text-center glass p-8 rounded-[20px]"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.h1 
            className="text-6xl font-bold mb-4 text-white"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            404
          </motion.h1>
          <motion.p 
            className="text-xl text-white/80 mb-6"
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Oops! Página não encontrada
          </motion.p>
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <Button asChild variant="default">
              <a href="/" className="hover-scale">
                Voltar para o Início
              </a>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
