
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { BackButton } from '@/components/BackButton';
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Logo } from '@/components/Logo';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  // Determine if we should use Portuguese or English based on the URL path
  const isPortuguese = !location.pathname.match(/^\/[a-z-]+$/);

  return (
    <div 
      className="min-h-screen flex flex-col p-6"
      style={{
        backgroundImage: 'url("/bg-gradient-teal.svg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="flex justify-between items-center">
        <BackButton />
        <Logo size="sm" />
      </div>
      
      <div className="flex-1 flex items-center justify-center">
        <motion.div 
          className="text-center glass p-8 rounded-[20px]"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.h1 
            className="text-6xl font-bold mb-4 text-black"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            404
          </motion.h1>
          <motion.p 
            className="text-xl text-black/80 mb-6"
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            {isPortuguese ? 'Oops! Página não encontrada' : 'Oops! Page not found'}
          </motion.p>
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <Button asChild variant="default">
              <a href="/" className="hover-scale">
                {isPortuguese ? 'Voltar para o Início' : 'Back to Home'}
              </a>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
