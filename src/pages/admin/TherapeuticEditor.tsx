
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
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowLeft, Plus, Save, Trash, Edit } from "lucide-react";

type TherapeuticActivity = {
  id: string;
  title: string;
  description: string;
  audio_url?: string;
  active: boolean;
};

const TherapeuticEditor = () => {
  const navigate = useNavigate();
  const [activities, setActivities] = useState<TherapeuticActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingActivity, setEditingActivity] = useState<TherapeuticActivity | null>(null);
  const [newActivity, setNewActivity] = useState({ title: '', description: '' });
  const [isAdding, setIsAdding] = useState(false);
  const [audioFile, setAudioFile] = useState<File | null>(null);

  useEffect(() => {
    const userRole = localStorage.getItem("userRole");
    if (userRole !== "admin") {
      toast.error("Acesso não autorizado");
      navigate("/dashboard");
      return;
    }

    fetchActivities();
  }, [navigate]);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('therapeutic_activities')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setActivities(data || []);
    } catch (error) {
      console.error('Erro ao carregar atividades:', error);
      toast.error('Não foi possível carregar as atividades');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAudioFile(e.target.files[0]);
    }
  };

  const uploadAudio = async (file: File) => {
    const fileName = `${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage
      .from('audio_content')
      .upload(fileName, file);

    if (error) throw error;
    return `${fileName}`;
  };

  const handleAddActivity = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Usuário não autenticado');
        return;
      }

      let audioUrl = null;
      if (audioFile) {
        audioUrl = await uploadAudio(audioFile);
      }

      const { error } = await supabase
        .from('therapeutic_activities')
        .insert([
          {
            title: newActivity.title,
            description: newActivity.description,
            audio_url: audioUrl,
            created_by: user.id
          }
        ]);

      if (error) throw error;

      toast.success('Atividade adicionada com sucesso!');
      setNewActivity({ title: '', description: '' });
      setAudioFile(null);
      setIsAdding(false);
      fetchActivities();
    } catch (error) {
      console.error('Erro ao adicionar atividade:', error);
      toast.error('Não foi possível adicionar a atividade');
    }
  };

  const handleSaveEdit = async () => {
    if (!editingActivity) return;

    try {
      let audioUrl = editingActivity.audio_url;
      if (audioFile) {
        audioUrl = await uploadAudio(audioFile);
      }

      const { error } = await supabase
        .from('therapeutic_activities')
        .update({
          title: editingActivity.title,
          description: editingActivity.description,
          audio_url: audioUrl
        })
        .eq('id', editingActivity.id);

      if (error) throw error;

      toast.success('Atividade atualizada com sucesso!');
      setEditingActivity(null);
      setAudioFile(null);
      fetchActivities();
    } catch (error) {
      console.error('Erro ao atualizar atividade:', error);
      toast.error('Não foi possível atualizar a atividade');
    }
  };

  const handleDeleteActivity = async (id: string) => {
    try {
      const { error } = await supabase
        .from('therapeutic_activities')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Atividade removida com sucesso!');
      fetchActivities();
    } catch (error) {
      console.error('Erro ao remover atividade:', error);
      toast.error('Não foi possível remover a atividade');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-600 to-teal-900 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">Editor de Atividades Terapêuticas</h1>
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
            <h2 className="text-xl font-semibold">Atividades Disponíveis</h2>
            {!isAdding ? (
              <Button 
                onClick={() => setIsAdding(true)}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Nova Atividade
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
              <div className="space-y-4">
                <div>
                  <label className="block mb-2">Título da Atividade</label>
                  <Input
                    value={newActivity.title}
                    onChange={(e) => setNewActivity({ ...newActivity, title: e.target.value })}
                    placeholder="Ex: Meditação Guiada"
                  />
                </div>
                <div>
                  <label className="block mb-2">Descrição</label>
                  <Textarea
                    value={newActivity.description}
                    onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
                    placeholder="Descreva a atividade..."
                    rows={4}
                  />
                </div>
                <div>
                  <label className="block mb-2">Áudio (opcional)</label>
                  <Input
                    type="file"
                    accept="audio/*"
                    onChange={handleFileChange}
                  />
                </div>
                <Button onClick={handleAddActivity} className="w-full">
                  Adicionar Atividade
                </Button>
              </div>
            </div>
          )}

          {loading ? (
            <div className="text-center py-8">Carregando atividades...</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Título</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Áudio</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activities.map((activity) => (
                    <TableRow key={activity.id}>
                      <TableCell>
                        {editingActivity?.id === activity.id ? (
                          <Input
                            value={editingActivity.title}
                            onChange={(e) => setEditingActivity({ ...editingActivity, title: e.target.value })}
                          />
                        ) : (
                          activity.title
                        )}
                      </TableCell>
                      <TableCell>
                        {editingActivity?.id === activity.id ? (
                          <Textarea
                            value={editingActivity.description}
                            onChange={(e) => setEditingActivity({ ...editingActivity, description: e.target.value })}
                          />
                        ) : (
                          activity.description
                        )}
                      </TableCell>
                      <TableCell>
                        {editingActivity?.id === activity.id ? (
                          <Input
                            type="file"
                            accept="audio/*"
                            onChange={handleFileChange}
                          />
                        ) : (
                          activity.audio_url ? "Áudio disponível" : "Sem áudio"
                        )}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        {editingActivity?.id === activity.id ? (
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
                            onClick={() => setEditingActivity(activity)}
                            className="flex items-center gap-1"
                          >
                            <Edit className="h-4 w-4" />
                            Editar
                          </Button>
                        )}
                        <Button 
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteActivity(activity.id)}
                          className="flex items-center gap-1"
                        >
                          <Trash className="h-4 w-4" />
                          Remover
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {activities.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4">
                        Nenhuma atividade cadastrada. Adicione a primeira!
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default TherapeuticEditor;
