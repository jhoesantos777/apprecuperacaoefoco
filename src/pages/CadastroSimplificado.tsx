
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Mail, Lock, User, Check } from "lucide-react";
import { toast } from "sonner";
import { BackButton } from '@/components/BackButton';
import { Logo } from '@/components/Logo';

const CadastroSimplificado = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    password: "",
    aceitaTermos: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome || !formData.email || !formData.password) {
      toast.error("Por favor, preencha todos os campos.");
      return;
    }

    if (!formData.aceitaTermos) {
      toast.error("Você precisa aceitar os termos para continuar.");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Registrar o usuário com Supabase
      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            nome: formData.nome,
            tipoUsuario: "dependent",
          },
        },
      });
      
      if (error) {
        if (error.message.includes("User already registered")) {
          toast.error("Este email já está cadastrado. Tente fazer login ou use outro email.");
        } else {
          throw error;
        }
        return;
      }
      
      // Login automático após cadastro
      const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });
      
      if (loginError) {
        console.error("Erro no login automático:", loginError);
        toast.success("Cadastro realizado com sucesso! Por favor, faça login.");
        navigate("/auth?mode=login");
        return;
      }
      
      if (loginData?.user) {
        localStorage.setItem("userRole", "dependent");
        toast.success("Cadastro realizado com sucesso!");
        navigate("/dashboard");
      }
      
    } catch (error) {
      console.error("Erro no cadastro:", error);
      toast.error("Erro ao criar conta: " + (error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-800 to-teal-900 flex flex-col px-6 py-8">
      <div className="flex justify-between items-center">
        <BackButton text="Voltar" className="text-white/70 hover:text-white" />
        <Logo size="sm" className="mr-2" />
      </div>

      <div className="flex-1 flex flex-col max-w-md mx-auto w-full">
        <div className="w-20 h-20 mb-8 mx-auto">
          <div className="w-full h-full rounded-full border-4 border-yellow-300 flex items-center justify-center relative">
            <div className="text-yellow-300 absolute">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-10 h-10">
                <path d="M20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12C4 7.58172 7.58172 4 12 4" />
                <path d="M8 12L11 15L16 9" />
              </svg>
            </div>
          </div>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-yellow-300 text-3xl font-bold mb-2">
            CADASTRO DE USUÁRIO
          </h1>
          <h2 className="text-yellow-300 text-2xl font-bold">
            EM RECUPERAÇÃO
          </h2>
          
          <p className="text-white/70 mt-4 px-4 text-sm">
            👋 Olá! Vamos criar sua conta para começar sua jornada de recuperação.
            Seus dados são confidenciais e protegidos.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-teal-700/30 backdrop-blur p-6 rounded-lg shadow-lg space-y-6">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome completo</Label>
              <div className="relative">
                <Input
                  id="nome"
                  name="nome"
                  type="text"
                  value={formData.nome}
                  onChange={handleChange}
                  placeholder="Digite seu nome completo"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50 pl-10"
                />
                <User className="absolute left-3 top-2.5 h-5 w-5 text-white/50" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Digite seu email"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50 pl-10"
                />
                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-white/50" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Crie sua senha (mínimo 6 caracteres)"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50 pl-10"
                />
                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-white/50" />
              </div>
            </div>
            
            <div className="flex items-center space-x-2 pt-4">
              <Checkbox
                id="terms"
                checked={formData.aceitaTermos}
                onCheckedChange={(checked) => 
                  setFormData(prev => ({ ...prev, aceitaTermos: checked === true }))
                }
                className="border-white/50"
              />
              <Label htmlFor="terms" className="text-sm">
                Aceito iniciar minha jornada de recuperação
              </Label>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-yellow-300 hover:bg-yellow-400 text-teal-900 font-bold py-6 rounded-full text-lg flex items-center justify-center gap-2"
          >
            {isSubmitting ? "Processando..." : "COMEÇAR MINHA RECUPERAÇÃO"} 
            {!isSubmitting && <Check size={18} />}
          </Button>
        </form>

        <div className="mt-6 text-center text-white/70">
          <p>
            Já tem uma conta?{" "}
            <a href="/auth?mode=login" className="text-yellow-300 hover:underline">
              Faça login aqui
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CadastroSimplificado;
