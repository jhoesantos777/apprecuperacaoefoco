
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

type DailyVerse = {
  id: string;
  verse_text: string;
  verse_reference: string;
  reflection: string;
  scheduled_for: string;
};

const DevotionalEditor = () => {
  const navigate = useNavigate();
  const [verses, setVerses] = useState<DailyVerse[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingVerse, setEditingVerse] = useState<DailyVerse | null>(null);
  const [newVerse, setNewVerse] = useState({
    verse_text: '',
    verse_reference: '',
    reflection: '',
    scheduled_for: new Date().toISOString().split('T')[0]
  });
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const userRole = localStorage.getItem("userRole");
    if (userRole !== "admin") {
      toast.error("Acesso não autorizado");
      navigate("/dashboard");
      return;
    }

    fetchVerses();
  }, [navigate]);

  const fetchVerses = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('daily_verses')
        .select('*')
        .order('scheduled_for', { ascending: false });
      
      if (error) throw error;
      setVerses(data || []);
    } catch (error) {
      console.error('Erro ao carregar versículos:', error);
      toast.error('Não foi possível carregar os versículos');
    } finally {
      setLoading(false);
    }
  };

  const handleAddVerse = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Usuário não autenticado');
        return;
      }

      const { error } = await supabase
        .from('daily_verses')
        .insert([{
          ...newVerse,
          created_by: user.id
        }]);

      if (error) throw error;

      toast.success('Versículo adicionado com sucesso!');
      setNewVerse({
        verse_text: '',
        verse_reference: '',
        reflection: '',
        scheduled_for: new Date().toISOString().split('T')[0]
      });
      setIsAdding(false);
      fetchVerses();
    } catch (error) {
      console.error('Erro ao adicionar versículo:', error);
      toast.error('Não foi possível adicionar o versículo');
    }
  };

  const handleSaveEdit = async () => {
    if (!editingVerse) return;

    try {
      const { error } = await supabase
        .from('daily_verses')
        .update({
          verse_text: editingVerse.verse_text,
          verse_reference: editingVerse.verse_reference,
          reflection: editingVerse.reflection,
          scheduled_for: editingVerse.scheduled_for
        })
        .eq('id', editingVerse.id);

      if (error) throw error;

      toast.success('Versículo atualizado com sucesso!');
      setEditingVerse(null);
      fetchVerses();
    } catch (error) {
      console.error('Erro ao atualizar versículo:', error);
      toast.error('Não foi possível atualizar o versículo');
    }
  };

  const handleDeleteVerse = async (id: string) => {
    try {
      const { error } = await supabase
        .from('daily_verses')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Versículo removido com sucesso!');
      fetchVerses();
    } catch (error) {
      console.error('Erro ao remover versículo:', error);
      toast.error('Não foi possível remover o versículo');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-600 to-teal-900 p-6">
      <div className="max-w-4xl mx

-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">Editor de Devocional</h1>
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
            <h2 className="text-xl font-semibold">Versículos Diários</h2>
            {!isAdding ? (
              <Button 
                onClick={() => setIsAdding(true)}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Novo Versículo
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
                  <label className="block mb-2">Versículo</label>
                  <Textarea
                    value={newVerse.verse_text}
                    onChange={(e) => setNewVerse({ ...newVerse, verse_text: e.target.value })}
                    placeholder="Digite o texto do versículo..."
                  />
                </div>
                <div>
                  <label className="block mb-2">Referência</label>
                  <Input
                    value={newVerse.verse_reference}
                    onChange={(e) => setNewVerse({ ...newVerse, verse_reference: e.target.value })}
                    placeholder="Ex: João 3:16"
                  />
                </div>
                <div>
                  <label className="block mb-2">Reflexão</label>
                  <Textarea
                    value={newVerse.reflection}
                    onChange={(e) => setNewVerse({ ...newVerse, reflection: e.target.value })}
                    placeholder="Digite a reflexão do dia..."
                    rows={4}
                  />
                </div>
                <div>
                  <label className="block mb-2">Data Programada</label>
                  <Input
                    type="date"
                    value={newVerse.scheduled_for}
                    onChange={(e) => setNewVerse({ ...newVerse, scheduled_for: e.target.value })}
                  />
                </div>
                <Button onClick={handleAddVerse} className="w-full">
                  Adicionar Versículo
                </Button>
              </div>
            </div>
          )}

          {loading ? (
            <div className="text-center py-8">Carregando versículos...</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Versículo</TableHead>
                    <TableHead>Referência</TableHead>
                    <TableHead>Reflexão</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {verses.map((verse) => (
                    <TableRow key={verse.id}>
                      <TableCell>
                        {editingVerse?.id === verse.id ? (
                          <Input
                            type="date"
                            value={editingVerse.scheduled_for}
                            onChange={(e) => setEditingVerse({ ...editingVerse, scheduled_for: e.target.value })}
                          />
                        ) : (
                          new Date(verse.scheduled_for).toLocaleDateString()
                        )}
                      </TableCell>
                      <TableCell>
                        {editingVerse?.id === verse.id ? (
                          <Textarea
                            value={editingVerse.verse_text}
                            onChange={(e) => setEditingVerse({ ...editingVerse, verse_text: e.target.value })}
                          />
                        ) : (
                          verse.verse_text
                        )}
                      </TableCell>
                      <TableCell>
                        {editingVerse?.id === verse.id ? (
                          <Input
                            value={editingVerse.verse_reference}
                            onChange={(e) => setEditingVerse({ ...editingVerse, verse_reference: e.target.value })}
                          />
                        ) : (
                          verse.verse_reference
                        )}
                      </TableCell>
                      <TableCell>
                        {editingVerse?.id === verse.id ? (
                          <Textarea
                            value={editingVerse.reflection}
                            onChange={(e) => setEditingVerse({ ...editingVerse, reflection: e.target.value })}
                          />
                        ) : (
                          verse.reflection
                        )}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        {editingVerse?.id === verse.id ? (
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
                            onClick={() => setEditingVerse(verse)}
                            className="flex items-center gap-1"
                          >
                            <Edit className="h-4 w-4" />
                            Editar
                          </Button>
                        )}
                        <Button 
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteVerse(verse.id)}
                          className="flex items-center gap-1"
                        >
                          <Trash className="h-4 w-4" />
                          Remover
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {verses.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4">
                        Nenhum versículo cadastrado. Adicione o primeiro!
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

export default DevotionalEditor;
