
import React, { useState } from 'react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { 
  Card, 
  CardContent,
  CardFooter,
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

export const AdminContent = () => {
  const [activeTab, setActiveTab] = useState("devotionals");
  
  // Mocks para diferentes tipos de conteúdo
  const mockDevotionals = [
    { id: "1", title: "Renovação diária", date: "2023-10-27", published: true },
    { id: "2", title: "Força na jornada", date: "2023-10-28", published: true },
    { id: "3", title: "Superando desafios", date: "2023-10-29", published: false }
  ];
  
  const mockActivities = [
    { id: "1", title: "Meditação guiada", description: "Áudio de 10 minutos", published: true },
    { id: "2", title: "Exercício de respiração", description: "Técnica 4-7-8", published: true },
    { id: "3", title: "Diário de gratidão", description: "Exercício diário", published: false }
  ];
  
  const mockCourses = [
    { id: "1", title: "Fundamentos da recuperação", lessons: 12, published: true },
    { id: "2", title: "Prevenção de recaídas", lessons: 8, published: true },
    { id: "3", title: "Construindo novos hábitos", lessons: 10, published: false }
  ];

  const handleCreateContent = (type: string) => {
    toast.success(`Criar novo ${type === "devotionals" ? "devocional" : 
                             type === "activities" ? "atividade" : "curso"}`);
  };

  const handleEditContent = (type: string, id: string) => {
    toast(`Editar ${type === "devotionals" ? "devocional" : 
                    type === "activities" ? "atividade" : "curso"} #${id}`);
  };

  const handleDeleteContent = (type: string, id: string) => {
    toast.warning(`Excluir ${type === "devotionals" ? "devocional" : 
                            type === "activities" ? "atividade" : "curso"} #${id}`);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Gerenciar Conteúdo</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="devotionals">Devocionais</TabsTrigger>
          <TabsTrigger value="activities">Atividades</TabsTrigger>
          <TabsTrigger value="courses">Cursos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="devotionals" className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Gerenciar Devocionais</h2>
            <Button onClick={() => handleCreateContent("devotionals")}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Devocional
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockDevotionals.map(item => (
              <Card key={item.id} className={item.published ? "" : "opacity-60"}>
                <CardHeader>
                  <CardTitle className="flex justify-between">
                    {item.title}
                    {!item.published && (
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                        Rascunho
                      </span>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Data: {new Date(item.date).toLocaleDateString('pt-BR')}
                  </p>
                </CardContent>
                <CardFooter className="flex justify-end space-x-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleEditContent("devotionals", item.id)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleDeleteContent("devotionals", item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
            
            <Card className="border-dashed flex flex-col items-center justify-center p-6 cursor-pointer hover:bg-gray-50"
                  onClick={() => handleCreateContent("devotionals")}>
              <Plus className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">Adicionar novo devocional</p>
            </Card>
          </div>
          
          <div className="mt-8 border rounded-md p-4">
            <h3 className="text-lg font-medium mb-4">Criar/Editar Devocional</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Título</label>
                <Input placeholder="Título do devocional" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Data</label>
                <Input type="date" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Versículo</label>
                <Input placeholder="Versículo bíblico" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Reflexão</label>
                <Textarea placeholder="Texto da reflexão" rows={5} />
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <Button variant="outline">Cancelar</Button>
                <Button variant="outline">Salvar como rascunho</Button>
                <Button>Publicar</Button>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="activities" className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Gerenciar Atividades</h2>
            <Button onClick={() => handleCreateContent("activities")}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Atividade
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockActivities.map(item => (
              <Card key={item.id} className={item.published ? "" : "opacity-60"}>
                <CardHeader>
                  <CardTitle className="flex justify-between">
                    {item.title}
                    {!item.published && (
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                        Rascunho
                      </span>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </CardContent>
                <CardFooter className="flex justify-end space-x-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleEditContent("activities", item.id)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleDeleteContent("activities", item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
            
            <Card className="border-dashed flex flex-col items-center justify-center p-6 cursor-pointer hover:bg-gray-50"
                  onClick={() => handleCreateContent("activities")}>
              <Plus className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">Adicionar nova atividade</p>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="courses" className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Gerenciar Cursos</h2>
            <Button onClick={() => handleCreateContent("courses")}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Curso
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockCourses.map(item => (
              <Card key={item.id} className={item.published ? "" : "opacity-60"}>
                <CardHeader>
                  <CardTitle className="flex justify-between">
                    {item.title}
                    {!item.published && (
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                        Rascunho
                      </span>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{item.lessons} aulas</p>
                </CardContent>
                <CardFooter className="flex justify-end space-x-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleEditContent("courses", item.id)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleDeleteContent("courses", item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
            
            <Card className="border-dashed flex flex-col items-center justify-center p-6 cursor-pointer hover:bg-gray-50"
                  onClick={() => handleCreateContent("courses")}>
              <Plus className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">Adicionar novo curso</p>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
