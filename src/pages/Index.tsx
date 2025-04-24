
const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Bem-vindo ao Sistema</h1>
        <p className="text-xl text-gray-600 mb-8">Comece criando sua conta!</p>
        <a
          href="/auth"
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Criar Conta
        </a>
      </div>
    </div>
  );
};

export default Index;
