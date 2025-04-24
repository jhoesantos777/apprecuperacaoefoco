import { ArrowDown } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-800 to-teal-900 flex flex-col items-center justify-between px-4 py-8">
      <div className="w-full max-w-md flex flex-col items-center text-center mt-12">
        <div className="mb-8">
          <div className="w-24 h-24 rounded-full bg-teal-700 border-2 border-yellow-300 flex items-center justify-center mb-4">
            <div className="text-green-400 text-4xl">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-12 h-12">
                <path d="M20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12C4 7.58172 7.58172 4 12 4" />
                <path d="M8 12L11 15L16 9" />
              </svg>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">RECUPERAÇÃO</h1>
          <h2 className="text-2xl font-medium text-white mb-8">EM FOCO</h2>
        </div>

        <p className="text-white text-lg mb-12 max-w-sm">
          "Hoje começa um novo capítulo da sua história. Você não está sozinho — um dia de cada vez, com fé, força e foco, a vitória é possível."
        </p>

        <div className="flex flex-col gap-4 w-full max-w-xs">
          <a
            href="/auth?mode=login"
            className="bg-yellow-300 text-teal-900 px-8 py-3 rounded-full font-bold text-lg hover:bg-yellow-400 transition-colors"
          >
            ENTRAR
          </a>
          <a
            href="/auth?mode=signup"
            className="border-2 border-yellow-300 text-yellow-300 px-8 py-3 rounded-full font-bold text-lg hover:bg-yellow-300/10 transition-colors"
          >
            SE INSCREVER
          </a>
        </div>
      </div>

      <div className="mt-12 text-white/50 animate-bounce">
        <ArrowDown size={32} />
      </div>
    </div>
  );
};

export default Index;
