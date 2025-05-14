import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { BackButton } from "@/components/BackButton";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/sonner";
import { DrugSelection } from "@/components/DrugSelection";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from '@/components/Logo';

// Defining profile interface to include story property
interface ProfileData {
  drogas_uso?: string[];
  tempo_uso?: string;
  tratamentos_tentados?: number;
  tratamentos_concluidos?: number;
  historico_familiar_uso?: boolean;
  idade?: number;
  cidade?: string;
  story?: string;
}

const Profile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [selectedDrugs, setSelectedDrugs] = useState<string[]>([]);
  const [tempoUso, setTempoUso] = useState("");
  const [tratamentosTentados, setTratamentosTentados] = useState(0);
  const [tratamentosConcluidos, setTratamentosConcluidos] = useState(0);
  const [historicoFamiliar, setHistoricoFamiliar] = useState(false);
  const [idade, setIdade] = useState<number>(0);
  const [cidade, setCidade] = useState<string>("");
  const [story, setStory] = useState<string>("");

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profile) {
        setSelectedDrugs(profile.drogas_uso || []);
        setTempoUso(profile.tempo_uso || "");
        setTratamentosTentados(profile.tratamentos_tentados || 0);
        setTratamentosConcluidos(profile.tratamentos_concluidos || 0);
        setHistoricoFamiliar(profile.historico_familiar_uso || false);
        setIdade(profile.idade || 0);
        setCidade(profile.cidade || "");
        // Use type assertion to access story property
        setStory((profile as ProfileData).story || "");
      }
    } catch (error) {
      console.error("Error loading profile:", error);
      toast("Não foi possível carregar seu perfil");
    }
  };

  const handleDrugToggle = (drug: string) => {
    setSelectedDrugs(prev => 
      prev.includes(drug) 
        ? prev.filter(d => d !== drug)
        : [...prev, drug]
    );
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate("/auth");
        return;
      }

      // Update profile with story field
      const { error } = await supabase
        .from("profiles")
        .update({
          drogas_uso: selectedDrugs,
          tempo_uso: tempoUso,
          tratamentos_tentados: tratamentosTentados,
          tratamentos_concluidos: tratamentosConcluidos,
          historico_familiar_uso: historicoFamiliar,
          idade: idade,
          cidade: cidade,
          story: story,
        } as ProfileData)
        .eq("id", user.id);

      if (error) throw error;

      toast("Suas informaç��es foram salvas com sucesso!");
    } catch (error) {
      console.error("Error saving profile:", error);
      toast("Não foi possível salvar suas informações");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-600 to-teal-900 p-6">
      <div className="flex justify-between items-center mb-6">
        <BackButton />
        <Logo size="sm" />
      </div>
      
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-white mb-6">
          Gerenciar Perfil
        </h1>

        <Card className="p-6 space-y-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Informações Pessoais</h2>
            
            <div>
              <Label htmlFor="idade">Idade</Label>
              <Input
                id="idade"
                type="number"
                min={0}
                max={120}
                value={idade}
                onChange={(e) => setIdade(Number(e.target.value))}
              />
            </div>

            <div>
              <Label htmlFor="cidade">Cidade</Label>
              <Input
                id="cidade"
                placeholder="Sua cidade"
                value={cidade}
                onChange={(e) => setCidade(e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="story">Minha História de Recuperação</Label>
              <Textarea
                id="story"
                placeholder="Compartilhe sua jornada de recuperação (opcional)"
                value={story}
                onChange={(e) => setStory(e.target.value)}
                rows={5}
              />
              <p className="text-sm text-gray-500 mt-1">
                Esta história será compartilhada apenas com membros da Irmandade
              </p>
            </div>

            <h2 className="text-xl font-semibold pt-4">Histórico de Uso</h2>
            
            <div>
              <Label>Tipo(s) de Droga(s) Usada(s)</Label>
              <DrugSelection
                selectedDrugs={selectedDrugs}
                onDrugToggle={handleDrugToggle}
              />
            </div>

            <div>
              <Label htmlFor="tempoUso">Tempo de Uso</Label>
              <Input
                id="tempoUso"
                placeholder="Ex: 2 anos e 3 meses"
                value={tempoUso}
                onChange={(e) => setTempoUso(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="tratamentosTentados">Tentativas de Tratamento</Label>
                <Input
                  id="tratamentosTentados"
                  type="number"
                  min={0}
                  value={tratamentosTentados}
                  onChange={(e) => setTratamentosTentados(Number(e.target.value))}
                />
              </div>

              <div>
                <Label htmlFor="tratamentosConcluidos">Tratamentos Concluídos</Label>
                <Input
                  id="tratamentosConcluidos"
                  type="number"
                  min={0}
                  max={tratamentosTentados}
                  value={tratamentosConcluidos}
                  onChange={(e) => setTratamentosConcluidos(Number(e.target.value))}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="historicoFamiliar">Histórico de Uso na Família</Label>
              <Switch
                id="historicoFamiliar"
                checked={historicoFamiliar}
                onCheckedChange={setHistoricoFamiliar}
              />
            </div>
          </div>
          
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full"
          >
            {loading ? "Salvando..." : "Salvar Perfil"}
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
