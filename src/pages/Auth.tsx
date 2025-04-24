import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { DrugSelection } from "@/components/DrugSelection";
import { Calendar, User, MapPin } from "lucide-react";
import { toast } from "sonner";
import type { SignUpFormData, UserType } from "@/types/signup";

const Auth = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDrugs, setSelectedDrugs] = useState<string[]>([]);
  const [formData, setFormData] = useState<SignUpFormData>({
    nome: "",
    dataNascimento: "",
    genero: "",
    cidade: "",
    estado: "",
    tipoUsuario: "dependent",
    contatoEmergencia: "",
    tempoUso: "",
    drogas: [],
    aceitaTermos: false,
    email: "",
    password: "",
  });

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
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
            tipoUsuario: formData.tipoUsuario,
            contatoEmergencia: formData.contatoEmergencia,
            tempoUso: formData.tempoUso,
            drogas: selectedDrugs,
          },
        },
      });

      if (error) throw error;

      toast.success("Cadastro realizado com sucesso! Verifique seu email.");
      navigate("/");
    } catch (error) {
      toast.error("Erro ao criar conta: " + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrugToggle = (drug: string) => {
    setSelectedDrugs((prev) =>
      prev.includes(drug) ? prev.filter((d) => d !== drug) : [...prev, drug]
    );
  };

  const userTypes: { value: UserType; label: string }[] = [
    { value: "dependent", label: "Dependente químico em recuperação" },
    { value: "family", label: "Familiar de dependente químico" },
    { value: "professional", label: "Profissional da área" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-800 to-teal-900 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-xl p-6 md:p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-teal-900 mb-4">
            👋 Olá! Antes de seguir, precisamos conhecer um pouco sobre você.
          </h2>
          <p className="text-teal-700">
            Não se preocupe, seus dados são sigilosos e usados apenas para te ajudar melhor na sua recuperação.
          </p>
          <p className="text-teal-700 font-medium mt-2">
            💚 Estamos com você, um dia de cada vez.
          </p>
        </div>

        <form onSubmit={handleSignUp} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu.email@exemplo.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Sua senha"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <Label htmlFor="nome">Nome completo</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    id="nome"
                    placeholder="Seu nome completo"
                    className="pl-10"
                    value={formData.nome}
                    onChange={(e) =>
                      setFormData({ ...formData, nome: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="dataNascimento">Data de nascimento</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    id="dataNascimento"
                    type="date"
                    className="pl-10"
                    value={formData.dataNascimento}
                    onChange={(e) =>
                      setFormData({ ...formData, dataNascimento: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="genero">Gênero</Label>
                <Select
                  value={formData.genero}
                  onValueChange={(value) =>
                    setFormData({ ...formData, genero: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione seu gênero" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="masculino">Masculino</SelectItem>
                    <SelectItem value="feminino">Feminino</SelectItem>
                    <SelectItem value="outro">Outro</SelectItem>
                    <SelectItem value="nao_informar">Prefiro não dizer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="cidade">Cidade</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    id="cidade"
                    placeholder="Sua cidade"
                    className="pl-10"
                    value={formData.cidade}
                    onChange={(e) =>
                      setFormData({ ...formData, cidade: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="estado">Estado</Label>
                <Input
                  id="estado"
                  placeholder="Seu estado"
                  value={formData.estado}
                  onChange={(e) =>
                    setFormData({ ...formData, estado: e.target.value })
                  }
                />
              </div>

              <div>
                <Label htmlFor="tipoUsuario">Você é:</Label>
                <Select
                  value={formData.tipoUsuario}
                  onValueChange={(value: UserType) =>
                    setFormData({ ...formData, tipoUsuario: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione seu perfil" />
                  </SelectTrigger>
                  <SelectContent>
                    {userTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="contatoEmergencia">
                  Contato de emergência (opcional)
                </Label>
                <Input
                  id="contatoEmergencia"
                  placeholder="Nome e telefone"
                  value={formData.contatoEmergencia}
                  onChange={(e) =>
                    setFormData({ ...formData, contatoEmergencia: e.target.value })
                  }
                />
              </div>

              <div>
                <Label htmlFor="tempoUso">Tempo de uso de substâncias</Label>
                <Input
                  id="tempoUso"
                  placeholder="Ex: 2 anos"
                  value={formData.tempoUso}
                  onChange={(e) =>
                    setFormData({ ...formData, tempoUso: e.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <Label className="block mb-4">
                Drogas que já usou ou ainda enfrenta dificuldades:
              </Label>
              <DrugSelection
                selectedDrugs={selectedDrugs}
                onDrugToggle={handleDrugToggle}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2 mt-6">
            <Checkbox
              id="terms"
              checked={formData.aceitaTermos}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, aceitaTermos: checked as boolean })
              }
            />
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Estou buscando ajuda e aceito começar essa jornada
            </label>
          </div>

          <Button
            type="submit"
            className="w-full bg-teal-600 hover:bg-teal-700"
            disabled={isLoading || !formData.aceitaTermos}
          >
            {isLoading ? "Cadastrando..." : "Começar minha recuperação"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Auth;
