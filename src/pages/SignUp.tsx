import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, ArrowRight, Calendar, Mail, Lock, MapPin, User } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { SignUpFormData, UserType, RelationType } from "@/types/signup";
import { Link } from "react-router-dom";

const SignUp = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const totalSteps = 4;
  
  const [formData, setFormData] = useState<SignUpFormData>({
    nome: "",
    dataNascimento: "",
    genero: "",
    cidade: "",
    estado: "",
    tipoUsuario: "family",
    grauParentesco: undefined,
    contatoEmergencia: "",
    tempoUso: "",
    drogas: [],
    aceitaTermos: false,
    email: "",
    password: "",
  });

  const updateFormData = (field: keyof SignUpFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDrugToggle = (drug: string) => {
    setFormData((prev) => {
      if (prev.drogas.includes(drug)) {
        return { ...prev, drogas: prev.drogas.filter((d) => d !== drug) };
      } else {
        return { ...prev, drogas: [...prev.drogas, drug] };
      }
    });
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep((prevStep) => prevStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep((prevStep) => prevStep - 1);
      window.scrollTo(0, 0);
    } else {
      navigate("/auth");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.aceitaTermos) {
      toast.error("Você precisa aceitar os termos para continuar");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            nome: formData.nome,
            dataNascimento: formData.dataNascimento,
            genero: formData.genero,
            cidade: formData.cidade,
            estado: formData.estado,
            grauParentesco: formData.grauParentesco,
            tipoUsuario: formData.tipoUsuario,
          },
        },
      });
      
      if (error) {
        if (error.message.includes("User already registered")) {
          toast.error("Este email já está cadastrado. Tente fazer login ou use outro email.");
          if (step === 4) {
            const emailInput = document.getElementById("email");
            if (emailInput) {
              emailInput.focus();
            }
          }
        } else {
          throw error;
        }
        return;
      }
      
      toast.success("Cadastro realizado com sucesso! Verifique seu email para confirmar sua conta.");
      navigate("/auth?mode=login");
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("Erro ao criar conta: " + (error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const validateCurrentStep = () => {
    if (step === 1) {
      return !!formData.nome && !!formData.dataNascimento && !!formData.genero;
    } else if (step === 2) {
      if (formData.tipoUsuario === "family") {
        return !!formData.cidade && !!formData.estado && !!formData.grauParentesco;
      }
      return !!formData.cidade && !!formData.estado && !!formData.tipoUsuario;
    } else if (step === 3) {
      return true;
    } else if (step === 4) {
      return !!formData.email && formData.password.length >= 6 && formData.aceitaTermos;
    }
    return false;
  };
  
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome completo</Label>
              <div className="relative">
                <Input
                  id="nome"
                  type="text"
                  value={formData.nome}
                  onChange={(e) => updateFormData("nome", e.target.value)}
                  placeholder="Digite seu nome completo"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50 pl-10"
                />
                <User className="absolute left-3 top-2.5 h-5 w-5 text-white/50" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dataNascimento">Data de nascimento</Label>
              <div className="relative">
                <Input
                  id="dataNascimento"
                  type="date"
                  value={formData.dataNascimento}
                  onChange={(e) => updateFormData("dataNascimento", e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50 pl-10"
                />
                <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-white/50" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Gênero</Label>
              <RadioGroup
                value={formData.genero}
                onValueChange={(value) => updateFormData("genero", value)}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="masculino" id="masculino" />
                  <Label htmlFor="masculino">Masculino</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="feminino" id="feminino" />
                  <Label htmlFor="feminino">Feminino</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="nao_informar" id="nao_informar" />
                  <Label htmlFor="nao_informar">Prefiro não dizer</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="outro" id="outro" />
                  <Label htmlFor="outro">Outro</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        );
        
      case 2:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="cidade">Cidade</Label>
              <div className="relative">
                <Input
                  id="cidade"
                  type="text"
                  value={formData.cidade}
                  onChange={(e) => updateFormData("cidade", e.target.value)}
                  placeholder="Digite sua cidade"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50 pl-10"
                />
                <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-white/50" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="estado">Estado</Label>
              <Select
                value={formData.estado}
                onValueChange={(value) => updateFormData("estado", value)}
              >
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Selecione seu estado" />
                </SelectTrigger>
                <SelectContent>
                  {["AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", 
                    "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", 
                    "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"].map((estado) => (
                    <SelectItem key={estado} value={estado}>
                      {estado}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Grau de Parentesco</Label>
              <Select
                value={formData.grauParentesco}
                onValueChange={(value) => updateFormData("grauParentesco", value as RelationType)}
              >
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Selecione seu grau de parentesco" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="spouse">Cônjuge</SelectItem>
                  <SelectItem value="father">Pai</SelectItem>
                  <SelectItem value="mother">Mãe</SelectItem>
                  <SelectItem value="sibling">Irmão/Irmã</SelectItem>
                  <SelectItem value="uncle">Tio(a)</SelectItem>
                  <SelectItem value="cousin">Primo(a)</SelectItem>
                  <SelectItem value="friend">Amigo(a)</SelectItem>
                  <SelectItem value="other">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="space-y-6 text-center">
            <h3 className="text-xl text-white font-semibold">
              Obrigado por fazer parte dessa jornada
            </h3>
            <p className="text-white/70">
              Seu apoio é fundamental para a recuperação do seu ente querido.
              Vamos para o último passo: criar suas credenciais de acesso.
            </p>
          </div>
        );
        
      case 4:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormData("email", e.target.value)}
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
                  type="password"
                  value={formData.password}
                  onChange={(e) => updateFormData("password", e.target.value)}
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
                onCheckedChange={(checked) => updateFormData("aceitaTermos", checked === true)}
                className="border-white/50"
              />
              <Label htmlFor="terms" className="text-sm">
                Aceito apoiar e fazer parte desta jornada de recuperação
              </Label>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };
  
  const isCurrentStepValid = validateCurrentStep();
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-800 to-teal-900 flex flex-col px-6 py-8">
      <button
        onClick={handlePrevious}
        className="text-white/70 hover:text-white flex items-center gap-2 mb-6"
      >
        <ArrowLeft size={24} />
        Voltar
      </button>

      <div className="flex-1 flex flex-col max-w-2xl mx-auto w-full">
        <div className="text-center mb-8">
          <h1 className="text-yellow-300 text-3xl font-bold mb-4">
            CADASTRO DE FAMILIAR
          </h1>
          
          <div className="flex justify-center items-center mb-6">
            <div className="w-full max-w-xs bg-white/10 h-2 rounded-full">
              <div
                className="bg-yellow-300 h-2 rounded-full transition-all"
                style={{ width: `${(step / totalSteps) * 100}%` }}
              />
            </div>
            <span className="text-white/70 ml-3">
              {step}/{totalSteps}
            </span>
          </div>
          
          <div className="text-white/70 px-4 text-sm">
            {step === 1 && (
              <p>
                👋 Olá! Antes de seguir, precisamos conhecer um pouco sobre você.
                Não se preocupe, seus dados são sigilosos e usados apenas para te ajudar melhor na sua recuperação.
                💚 Estamos com você, um dia de cada vez.
              </p>
            )}
            {step === 2 && (
              <p>
                Precisamos saber um pouco mais sobre você para personalizar seu atendimento.
                Seus dados são confidenciais e protegidos.
              </p>
            )}
            {step === 3 && (
              <p>
                Esta informação nos ajudará a entender melhor sua relação com substâncias
                e a oferecer o suporte mais adequado para sua situação.
              </p>
            )}
            {step === 4 && (
              <p>
                Estamos quase lá! Crie suas credenciais para acessar o sistema
                e começar sua jornada de recuperação.
              </p>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-teal-700/30 backdrop-blur p-6 rounded-lg shadow-lg">
            {renderStep()}
          </div>

          <div className="flex justify-between pt-6">
            {step < totalSteps ? (
              <Button
                type="button"
                onClick={handleNext}
                disabled={!isCurrentStepValid}
                className="ml-auto bg-yellow-300 hover:bg-yellow-400 text-teal-900 font-bold py-5 px-8 rounded-full"
              >
                Próximo <ArrowRight size={18} />
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={isSubmitting || !isCurrentStepValid}
                className="ml-auto bg-yellow-300 hover:bg-yellow-400 text-teal-900 font-bold py-5 px-8 rounded-full flex items-center gap-2"
              >
                {isSubmitting ? "Processando..." : "Começar minha recuperação"} <Check size={18} />
              </Button>
            )}
          </div>
        </form>

        {step === 4 && (
          <div className="mt-6 text-center text-white/70">
            <p>
              Já tem uma conta?{" "}
              <Link to="/auth?mode=login" className="text-yellow-300 hover:underline">
                Faça login aqui
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignUp;
