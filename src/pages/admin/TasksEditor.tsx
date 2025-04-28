
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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ArrowLeft, Plus, Save, Trash, Edit } from "lucide-react";

type Task = {
  id: string;
  name: string;
  description: string;
  points: number;
};

const TasksEditor = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [newTask, setNewTask] = useState({ name: '', description: '', points: 1 });
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    // Verificar se o usuário é administrador
    const userRole = localStorage.getItem("userRole");
    if (userRole !== "admin") {
      toast.error("Acesso não autorizado");
      navigate("/dashboard");
      return;
    }

    fetchTasks();
  }, [navigate]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('daily_tasks')
        .select('*')
        .order('name');
      
      if (error) throw error;
      
      setTasks(data || []);
    } catch (error) {
      console.error('Erro ao carregar tarefas:', error);
      toast.error('Não foi possível carregar as tarefas');
    } finally {
      setLoading(false);
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
  };

  const handleSaveEdit = async () => {
    if (!editingTask) return;

    try {
      const { error } = await supabase
        .from('daily_tasks')
        .update({ 
          name: editingTask.name, 
          description: editingTask.description, 
          points: editingTask.points 
        })
        .eq('id', editingTask.id);
      
      if (error) throw error;
      
      toast.success('Tarefa atualizada com sucesso!');
      setEditingTask(null);
      fetchTasks();
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
      toast.error('Não foi possível atualizar a tarefa');
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      const { error } = await supabase
        .from('daily_tasks')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast.success('Tarefa removida com sucesso!');
      fetchTasks();
    } catch (error) {
      console.error('Erro ao remover tarefa:', error);
      toast.error('Não foi possível remover a tarefa');
    }
  };

  const handleAddTask = async () => {
    if (!newTask.name.trim() || !newTask.description.trim()) {
      toast.error('Nome e descrição são obrigatórios');
      return;
    }

    try {
      const { error } = await supabase
        .from('daily_tasks')
        .insert([
          { 
            name: newTask.name, 
            description: newTask.description, 
            points: newTask.points 
          }
        ]);
      
      if (error) throw error;
      
      toast.success('Tarefa adicionada com sucesso!');
      setNewTask({ name: '', description: '', points: 1 });
      setIsAdding(false);
      fetchTasks();
    } catch (error) {
      console.error('Erro ao adicionar tarefa:', error);
      toast.error('Não foi possível adicionar a tarefa');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-600 to-teal-900 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">Editor de Tarefas Diárias</h1>
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
            <h2 className="text-xl font-semibold">Tarefas Disponíveis</h2>
            {!isAdding ? (
              <Button 
                onClick={() => setIsAdding(true)}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Nova Tarefa
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
              <div className="space-y-4 mb-4">
                <div>
                  <Label htmlFor="new-task-name">Nome da Tarefa</Label>
                  <Input
                    id="new-task-name"
                    value={newTask.name}
                    onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
                    placeholder="Ex: Meditação Matinal"
                  />
                </div>
                <div>
                  <Label htmlFor="new-task-description">Descrição</Label>
                  <Textarea
                    id="new-task-description"
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    placeholder="Descreva a tarefa aqui..."
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="new-task-points">Pontos</Label>
                  <Input
                    id="new-task-points"
                    type="number"
                    value={newTask.points}
                    onChange={(e) => setNewTask({ ...newTask, points: parseInt(e.target.value) })}
                    min={1}
                  />
                </div>
              </div>
              <Button onClick={handleAddTask} className="w-full">Adicionar Tarefa</Button>
            </div>
          )}

          {loading ? (
            <div className="text-center py-8">Carregando tarefas...</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Pontos</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell>
                        {editingTask?.id === task.id ? (
                          <Input
                            value={editingTask.name}
                            onChange={(e) => setEditingTask({ ...editingTask, name: e.target.value })}
                          />
                        ) : (
                          task.name
                        )}
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {editingTask?.id === task.id ? (
                          <Textarea
                            value={editingTask.description}
                            onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                            rows={2}
                          />
                        ) : (
                          task.description
                        )}
                      </TableCell>
                      <TableCell>
                        {editingTask?.id === task.id ? (
                          <Input
                            type="number"
                            value={editingTask.points}
                            onChange={(e) => setEditingTask({ ...editingTask, points: parseInt(e.target.value) })}
                            min={1}
                            className="w-20"
                          />
                        ) : (
                          task.points
                        )}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        {editingTask?.id === task.id ? (
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
                            onClick={() => handleEditTask(task)}
                            className="flex items-center gap-1"
                          >
                            <Edit className="h-4 w-4" />
                            Editar
                          </Button>
                        )}
                        <Button 
                          size="sm" 
                          variant="destructive" 
                          onClick={() => handleDeleteTask(task.id)}
                          className="flex items-center gap-1"
                        >
                          <Trash className="h-4 w-4" />
                          Remover
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {tasks.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4">
                        Nenhuma tarefa cadastrada. Adicione a primeira!
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
            As tarefas criadas aqui aparecerão para todos os usuários na seção de Tarefas Diárias. 
            Os pontos atribuídos a cada tarefa contribuem para o Termômetro de Recuperação quando 
            os usuários as completam.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TasksEditor;
