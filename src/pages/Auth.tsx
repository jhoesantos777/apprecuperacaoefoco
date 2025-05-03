
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { BackButton } from '@/components/BackButton';

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
    <div className="min-h-screen bg-gradient-to-b from-teal-800 to-teal-900 flex flex-col px-6 py-8">
      <BackButton text="Início" className="text-white/70 hover:text-white" />

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
            OLÁ!
          </h1>
          <h2 className="text-yellow-300 text-2xl font-bold">
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

          <div className="flex items-center justify-between text-sm text-white/70">
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
            <button type="button" className="hover:text-white">
              ESQUECEU A SENHA?
            </button>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-yellow-300 hover:bg-yellow-400 text-teal-900 font-bold py-6 rounded-full text-lg"
          >
            {isLoading ? "Entrando..." : "ENTRAR"}
          </Button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-white/70">
            NÃO TEM UMA CONTA?{" "}
            <a
              href="/cadastro-simplificado"
              className="text-yellow-300 hover:underline font-bold"
            >
              CADASTRE-SE
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
