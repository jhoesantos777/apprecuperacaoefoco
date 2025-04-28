
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowLeft, Plus, Save, Trash, Edit } from "lucide-react";

type Emotion = {
  id: string;
  emocao: string;
  pontos: number;
};

const MoodEditor = () => {
  const navigate = useNavigate();
  const [emotions, setEmotions] = useState<Emotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingEmotion, setEditingEmotion] = useState<Emotion | null>(null);
  const [newEmotion, setNewEmotion] = useState({ emocao: '', pontos: 0 });
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    // Verificar se o usuário é administrador
    const userRole = localStorage.getItem("userRole");
    if (userRole !== "admin") {
      toast.error("Acesso não autorizado");
      navigate("/dashboard");
      return;
    }

    fetchEmotions();
  }, [navigate]);

  const fetchEmotions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('humores')
        .select('id, emocao, pontos')
        .order('pontos', { ascending: false });
      
      if (error) throw error;
      
      // Agrupar emoções por nome para evitar duplicatas
      const uniqueEmotions: Record<string, Emotion> = {};
      data?.forEach(emotion => {
        if (!uniqueEmotions[emotion.emocao] || 
            (uniqueEmotions[emotion.emocao] && emotion.pontos > uniqueEmotions[emotion.emocao].pontos)) {
          uniqueEmotions[emotion.emocao] = emotion;
        }
      });
      
      setEmotions(Object.values(uniqueEmotions));
    } catch (error) {
      console.error('Erro ao carregar emoções:', error);
      toast.error('Não foi possível carregar as emoções');
    } finally {
      setLoading(false);
    }
  };

  const handleEditEmotion = (emotion: Emotion) => {
    setEditingEmotion(emotion);
  };

  const handleSaveEdit = async () => {
    if (!editingEmotion) return;

    try {
      const { error } = await supabase
        .from('humores')
        .update({ emocao: editingEmotion.emocao, pontos: editingEmotion.pontos })
        .eq('id', editingEmotion.id);
      
      if (error) throw error;
      
      toast.success('Emoção atualizada com sucesso!');
      setEditingEmotion(null);
      fetchEmotions();
    } catch (error) {
      console.error('Erro ao atualizar emoção:', error);
      toast.error('Não foi possível atualizar a emoção');
    }
  };

  const handleDeleteEmotion = async (id: string) => {
    try {
      const { error } = await supabase
        .from('humores')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast.success('Emoção removida com sucesso!');
      fetchEmotions();
    } catch (error) {
      console.error('Erro ao remover emoção:', error);
      toast.error('Não foi possível remover a emoção');
    }
  };

  const handleAddEmotion = async () => {
    if (!newEmotion.emocao.trim()) {
      toast.error('O nome da emoção é obrigatório');
      return;
    }

    try {
      const { error } = await supabase
        .from('humores')
        .insert([
          { 
            emocao: newEmotion.emocao, 
            pontos: newEmotion.pontos 
          }
        ]);
      
      if (error) throw error;
      
      toast.success('Emoção adicionada com sucesso!');
      setNewEmotion({ emocao: '', pontos: 0 });
      setIsAdding(false);
      fetchEmotions();
    } catch (error) {
      console.error('Erro ao adicionar emoção:', error);
      toast.error('Não foi possível adicionar a emoção');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-600 to-teal-900 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">Editor de Humor</h1>
          <Button 
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => navigate("/admin/dashboard")}
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar ao Painel
          </Button>
        </div>

        <Card className="p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Emoções Disponíveis</h2>
            {!isAdding ? (
              <Button 
                onClick={() => setIsAdding(true)}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Nova Emoção
              </Button>
            ) : (
              <Button 
                variant="outline"
                onClick={() => setIsAdding(false)}
              >
                Cancelar
              </Button>
            )}
          </div>

          {isAdding && (
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <Label htmlFor="new-emotion-name">Nome da Emoção</Label>
                  <Input
                    id="new-emotion-name"
                    value={newEmotion.emocao}
                    onChange={(e) => setNewEmotion({ ...newEmotion, emocao: e.target.value })}
                    placeholder="Ex: Feliz"
                  />
                </div>
                <div>
                  <Label htmlFor="new-emotion-points">Pontos</Label>
                  <Input
                    id="new-emotion-points"
                    type="number"
                    value={newEmotion.pontos}
                    onChange={(e) => setNewEmotion({ ...newEmotion, pontos: parseInt(e.target.value) })}
                    placeholder="0"
                  />
                </div>
              </div>
              <Button onClick={handleAddEmotion} className="w-full">Adicionar Emoção</Button>
            </div>
          )}

          {loading ? (
            <div className="text-center py-8">Carregando emoções...</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Emoção</TableHead>
                    <TableHead>Pontos</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {emotions.map((emotion) => (
                    <TableRow key={emotion.id}>
                      <TableCell>
                        {editingEmotion?.id === emotion.id ? (
                          <Input
                            value={editingEmotion.emocao}
                            onChange={(e) => setEditingEmotion({ ...editingEmotion, emocao: e.target.value })}
                          />
                        ) : (
                          emotion.emocao
                        )}
                      </TableCell>
                      <TableCell>
                        {editingEmotion?.id === emotion.id ? (
                          <Input
                            type="number"
                            value={editingEmotion.pontos}
                            onChange={(e) => setEditingEmotion({ ...editingEmotion, pontos: parseInt(e.target.value) })}
                          />
                        ) : (
                          emotion.pontos
                        )}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        {editingEmotion?.id === emotion.id ? (
                          <Button 
                            size="sm" 
                            onClick={handleSaveEdit}
                            className="flex items-center gap-1"
                          >
                            <Save className="h-4 w-4" />
                            Salvar
                          </Button>
                        ) : (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => handleEditEmotion(emotion)}
                            className="flex items-center gap-1"
                          >
                            <Edit className="h-4 w-4" />
                            Editar
                          </Button>
                        )}
                        <Button 
                          size="sm" 
                          variant="destructive" 
                          onClick={() => handleDeleteEmotion(emotion.id)}
                          className="flex items-center gap-1"
                        >
                          <Trash className="h-4 w-4" />
                          Remover
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {emotions.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-4">
                        Nenhuma emoção cadastrada. Adicione a primeira!
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </Card>

        <div className="bg-blue-50 rounded-lg p-6 mt-6 border border-blue-200">
          <h3 className="text-lg font-semibold mb-2">Dica</h3>
          <p>
            Os pontos atribuídos às emoções afetam diretamente o Termômetro de Recuperação. 
            Valores mais altos representam emoções positivas que contribuem para uma melhor 
            pontuação no termômetro.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MoodEditor;
