
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";
import { BackButton } from '@/components/BackButton';
import { Logo } from '@/components/Logo';

const About = () => {
  const { isDarkMode } = useTheme();

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <BackButton />
          <Logo size="sm" />
        </div>

        <h1 className={`text-3xl font-bold mb-8 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Sobre o App
        </h1>

        <div className={`prose max-w-none ${isDarkMode ? 'prose-invert' : ''}`}>
          <section className="mb-8">
            <h2>Nossa Missão</h2>
            <p>
              Ajudar pessoas a superarem vícios e dependências, fornecendo suporte
              e ferramentas para uma vida mais saudável e equilibrada.
            </p>
          </section>

          <section className="mb-8">
            <h2>Recursos</h2>
            <ul>
              <li>Acompanhamento diário de sobriedade</li>
              <li>Suporte da comunidade</li>
              <li>Ferramentas de mindfulness</li>
              <li>Recursos educacionais</li>
            </ul>
          </section>

          <section>
            <h2>Versão</h2>
            <p>1.0.0</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default About;
