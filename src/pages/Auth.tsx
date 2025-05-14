
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { Logo } from '@/components/Logo';

const Auth = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isSignUp = searchParams.get("mode") === "signup";
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  // Redirect to cadastro-simplificado if mode is signup
  useEffect(() => {
    if (isSignUp) {
      navigate("/cadastro-simplificado");
    }
  }, [isSignUp, navigate]);

  // Check if user is already logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        // Check user role for redirection
        const userRole = localStorage.getItem("userRole");
        if (userRole === "admin") {
          navigate("/admin");
        } else {
          navigate("/dashboard");
        }
      }
    };
    
    checkSession();
  }, [navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast.error("Por favor, preencha todos os campos.");
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (isSignUp) {
        // Redireciona para o formulário simplificado de cadastro
        navigate("/cadastro-simplificado");
        return;
      } else {
        // Special case for admin login
        if (formData.email.toLowerCase() === "admin@example.com" && formData.password === "Admin123!") {
          console.log("Admin login detected");
          localStorage.setItem("userRole", "admin");
          toast.success("Login administrador realizado com sucesso!");
          // Redirect admin directly to the admin panel
          navigate("/admin");
          return;
        }
        
        // Regular user login via Supabase
        console.log(`Attempting login with email: ${formData.email}`);
        
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });
        
        if (error) {
          console.error("Login error:", error);
          throw error;
        }
        
        if (data?.user) {
          console.log("Login successful:", data.user.email);
          
          // Check user type from metadata
          const userRole = data.user.user_metadata?.tipoUsuario || "dependent";
          localStorage.setItem("userRole", userRole);
          
          toast.success("Login realizado com sucesso!");
          navigate("/dashboard");
        }
      }
    } catch (error) {
      console.error("Full error details:", error);
      const action = isSignUp ? "fazer cadastro" : "fazer login";
      
      // More specific error messages
      let errorMessage = `Erro ao ${action}: ` + (error as Error).message;
      
      if ((error as Error).message.includes("Invalid login credentials")) {
        errorMessage = "Email ou senha incorretos. Por favor, verifique suas credenciais.";
      }
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Form input change handler
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // If we're in signup mode, don't render anything as we'll redirect
  if (isSignUp) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#461475] to-[#300b50] flex flex-col px-6 py-8">
      {/* Logo centralizada */}
      <div className="flex justify-center items-center">
        <Logo size="lg" className="mb-4" />
      </div>

      <div className="flex-1 flex flex-col max-w-md mx-auto w-full">
        <div className="text-center mb-12">
          <h1 className="text-white text-3xl font-bold mb-2">
            OLÁ!
          </h1>
          <h2 className="text-white text-2xl font-bold">
            QUE BOM TE VER NOVAMENTE!
          </h2>
        </div>

        <form onSubmit={handleAuth} className="space-y-6">
          <div>
            <Input
              type="email"
              name="email"
              placeholder="ESCREVE SEU EMAIL AQUI"
              value={formData.email}
              onChange={handleChange}
              className="bg-transparent border-b border-white/20 rounded-none px-0 text-white placeholder:text-white/50"
            />
          </div>

          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="SENHA"
              value={formData.password}
              onChange={handleChange}
              className="bg-transparent border-b border-white/20 rounded-none px-0 text-white placeholder:text-white/50 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-0 top-2 text-white/50"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="flex items-center justify-between text-sm text-white">
            <div className="flex items-center gap-2">
              <Checkbox
                id="remember"
                checked={formData.rememberMe}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, rememberMe: checked as boolean })
                }
                className="border-white/50"
              />
              <label htmlFor="remember">ME LEMBRE</label>
            </div>
            <button type="button" className="hover:text-white/80">
              ESQUECEU A SENHA?
            </button>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-white hover:bg-white/90 text-[#461475] font-bold py-6 rounded-full text-lg"
          >
            {isLoading ? "Entrando..." : "ENTRAR"}
          </Button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-white">
            NÃO TEM UMA CONTA?{" "}
            <a
              href="/cadastro-simplificado"
              className="text-white hover:underline font-bold"
            >
              CADASTRE-SE
            </a>
          </p>
        </div>
        
        {/* Imagem atualizada abaixo dos textos */}
        <div className="mt-8 flex justify-center">
          <img 
            src="/lovable-uploads/598d5387-baa6-493c-bbe3-2f6a74da95d2.png" 
            alt="Philos Logo" 
            className="max-w-full h-auto max-h-48"
          />
        </div>
      </div>
    </div>
  );
};

export default Auth;
