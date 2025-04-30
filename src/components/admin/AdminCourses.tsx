import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  FileText,
  Video,
  Plus,
  Edit,
  Trash2,
  Eye,
  Filter,
  Search,
  Lock,
  Clock
} from "lucide-react";

interface Course {
  id: string;
  title: string;
  description: string;
  lessons_count: number;
  duration: string;
  thumbnail_url?: string;
  created_at: string;
  category?: string;
}

interface Lesson {
  id: string;
  title: string;
  content: string;
  duration: string;
  order_number: number;
  course_id: string;
  video_url?: string;
  pdf_url?: string;
}

// Component for handling PDF uploads
const PdfUploader = ({ 
  value, 
  onChange, 
  label = "PDF do Curso (opcional)",
  accept = ".pdf" 
}: {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  accept?: string;
}) => {
  const [uploading, setUploading] = useState(false);
  
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;
      
      setUploading(true);
      
      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `course_materials/${fileName}`;
      
      // Upload file
      const { error: uploadError, data } = await supabase.storage
        .from('course_materials')
        .upload(filePath, file);
        
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('course_materials')
        .getPublicUrl(filePath);
        
      onChange(publicUrl);
      toast.success("PDF carregado com sucesso");
    } catch (error) {
      console.error('Error uploading PDF:', error);
      toast.error("Erro ao carregar PDF");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <div className="mt-1 flex items-center gap-2">
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="URL do PDF ou carregue um arquivo"
          className="flex-1"
        />
        <div className="relative">
          <input
            type="file"
            accept={accept}
            onChange={handleFileUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <Button variant="outline" type="button" disabled={uploading}>
            {uploading ? "Carregando..." : "Upload"}
          </Button>
        </div>
      </div>
      {value && (
        <div className="mt-2">
          <a 
            href={value} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:underline flex items-center gap-1"
          >
            <FileText className="h-4 w-4" />
            Ver PDF
          </a>
        </div>
      )}
    </div>
  );
};

export const AdminCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isEditingCourse, setIsEditingCourse] = useState(false);
  const [isEditingLesson, setIsEditingLesson] = useState(false);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  
  const [courseForm, setCourseForm] = useState({
    title: "",
    description: "",
    duration: "",
    category: "",
    thumbnail_url: "",
    pdf_url: ""
  });
  
  const [lessonForm, setLessonForm] = useState({
    title: "",
    content: "",
    duration: "",
    order_number: 0,
    video_url: "",
    pdf_url: ""
  });

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      setCourses(data || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast.error("Falha ao carregar cursos");
    } finally {
      setLoading(false);
    }
  };

  const fetchLessons = async (courseId: string) => {
    try {
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('course_id', courseId)
        .order('order_number', { ascending: true });
        
      if (error) throw error;
      
      setLessons(data || []);
    } catch (error) {
      console.error('Error fetching lessons:', error);
      toast.error("Falha ao carregar aulas");
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleViewCourse = (course: Course) => {
    setSelectedCourse(course);
    fetchLessons(course.id);
  };

  const handleCloseCourseView = () => {
    setSelectedCourse(null);
    setLessons([]);
  };

  const handleEditCourse = (course: Course) => {
    setCourseForm({
      title: course.title,
      description: course.description,
      duration: course.duration,
      category: course.category || "",
      thumbnail_url: course.thumbnail_url || "",
      pdf_url: "" // We'll add this field to the course table
    });
    setIsEditingCourse(true);
  };

  const handleNewCourse = () => {
    setCourseForm({
      title: "",
      description: "",
      duration: "",
      category: "",
      thumbnail_url: "",
      pdf_url: ""
    });
    setIsEditingCourse(true);
  };

  const handleEditLesson = (lesson: Lesson) => {
    setLessonForm({
      title: lesson.title,
      content: lesson.content,
      duration: lesson.duration,
      order_number: lesson.order_number,
      video_url: lesson.video_url || "",
      pdf_url: lesson.pdf_url || ""
    });
    setCurrentLesson(lesson);
    setIsEditingLesson(true);
  };

  const handleNewLesson = () => {
    if (!selectedCourse) return;
    
    setLessonForm({
      title: "",
      content: "",
      duration: "",
      order_number: lessons.length + 1,
      video_url: "",
      pdf_url: ""
    });
    setCurrentLesson(null);
    setIsEditingLesson(true);
  };

  const handleSaveCourse = async () => {
    try {
      if (!courseForm.title || !courseForm.description) {
        toast.error("Título e descrição são obrigatórios");
        return;
      }
      
      // Prepare the course data object
      const courseData: any = {
        title: courseForm.title,
        description: courseForm.description,
        duration: courseForm.duration,
        thumbnail_url: courseForm.thumbnail_url || null
      };
      
      // If we have PDF URL, add it to the course data
      if (courseForm.pdf_url) {
        courseData.pdf_url = courseForm.pdf_url;
      }
      
      // If we have a category, add it to the course data
      if (courseForm.category) {
        courseData.category = courseForm.category;
      }
      
      let result;
      
      if (selectedCourse) {
        // Update existing course
        result = await supabase
          .from('courses')
          .update(courseData)
          .eq('id', selectedCourse.id);
          
        if (result.error) throw result.error;
        
        // Update local state
        setCourses(courses.map(c => 
          c.id === selectedCourse.id 
            ? { ...c, ...courseData } 
            : c
        ));
        
        setSelectedCourse({
          ...selectedCourse,
          ...courseData
        });
        
        toast.success("Curso atualizado com sucesso");
      } else {
        // Create new course
        // Add lessons_count to the course data for new courses
        courseData.lessons_count = 0;
        
        result = await supabase
          .from('courses')
          .insert(courseData);
          
        if (result.error) throw result.error;
        
        toast.success("Novo curso criado com sucesso");
        fetchCourses(); // Refresh the list
      }
      
      setIsEditingCourse(false);
    } catch (error: any) {
      console.error('Error saving course:', error);
      toast.error(`Falha ao salvar curso: ${error.message || 'Erro desconhecido'}`);
    }
  };

  const handleSaveLesson = async () => {
    try {
      if (!selectedCourse || !lessonForm.title) {
        toast.error("Curso e título da aula são obrigatórios");
        return;
      }
      
      let result;
      
      if (currentLesson) {
        // Update existing lesson
        result = await supabase
          .from('lessons')
          .update({
            title: lessonForm.title,
            content: lessonForm.content,
            duration: lessonForm.duration,
            order_number: lessonForm.order_number,
            video_url: lessonForm.video_url || null,
            pdf_url: lessonForm.pdf_url || null
          })
          .eq('id', currentLesson.id);
          
        if (result.error) throw result.error;
        
        // Update local state
        setLessons(lessons.map(l => 
          l.id === currentLesson.id 
            ? { 
                ...l, 
                title: lessonForm.title,
                content: lessonForm.content,
                duration: lessonForm.duration,
                order_number: lessonForm.order_number,
                video_url: lessonForm.video_url || null,
                pdf_url: lessonForm.pdf_url || null
              } 
            : l
        ));
        
        toast.success("Aula atualizada com sucesso");
      } else {
        // Create new lesson
        result = await supabase
          .from('lessons')
          .insert({
            title: lessonForm.title,
            content: lessonForm.content,
            duration: lessonForm.duration,
            order_number: lessonForm.order_number,
            course_id: selectedCourse.id,
            video_url: lessonForm.video_url || null,
            pdf_url: lessonForm.pdf_url || null
          });
          
        if (result.error) throw result.error;
        
        // Update course lessons count
        await supabase
          .from('courses')
          .update({ lessons_count: lessons.length + 1 })
          .eq('id', selectedCourse.id);
          
        // Update local state
        setSelectedCourse({
          ...selectedCourse,
          lessons_count: selectedCourse.lessons_count + 1
        });
        
        toast.success("Nova aula adicionada com sucesso");
        fetchLessons(selectedCourse.id); // Refresh the list
      }
      
      setIsEditingLesson(false);
    } catch (error) {
      console.error('Error saving lesson:', error);
      toast.error("Falha ao salvar aula");
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (!confirm("Tem certeza que deseja excluir este curso? Esta ação não pode ser desfeita.")) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', courseId);
        
      if (error) throw error;
      
      // Update local state
      setCourses(courses.filter(c => c.id !== courseId));
      
      if (selectedCourse?.id === courseId) {
        setSelectedCourse(null);
        setLessons([]);
      }
      
      toast.success("Curso excluído com sucesso");
    } catch (error) {
      console.error('Error deleting course:', error);
      toast.error("Falha ao excluir curso");
    }
  };

  const handleDeleteLesson = async (lessonId: string) => {
    if (!confirm("Tem certeza que deseja excluir esta aula? Esta ação não pode ser desfeita.")) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('lessons')
        .delete()
        .eq('id', lessonId);
        
      if (error) throw error;
      
      // Update local state
      setLessons(lessons.filter(l => l.id !== lessonId));
      
      if (selectedCourse) {
        // Update course lessons count
        await supabase
          .from('courses')
          .update({ lessons_count: selectedCourse.lessons_count - 1 })
          .eq('id', selectedCourse.id);
          
        setSelectedCourse({
          ...selectedCourse,
          lessons_count: selectedCourse.lessons_count - 1
        });
      }
      
      toast.success("Aula excluída com sucesso");
    } catch (error) {
      console.error('Error deleting lesson:', error);
      toast.error("Falha ao excluir aula");
    }
  };

  const filteredCourses = courses.filter(course => 
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (course.description && course.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-black">Gerenciar Cursos e Conteúdo</h1>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchCourses}>
            <Filter className="h-4 w-4 mr-2" />
            Filtrar
          </Button>
          
          <Button size="sm" onClick={handleNewCourse}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Curso
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por título ou descrição"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <p className="text-black">Carregando cursos...</p>
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="flex justify-center py-10">
          <p className="text-black">Nenhum curso encontrado</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCourses.map((course) => (
            <Card key={course.id} className="bg-white/40 backdrop-blur-lg">
              <CardHeader>
                <CardTitle className="text-black flex justify-between items-start">
                  {course.title}
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {course.category || "Sem categoria"}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-black mb-3">{course.description}</p>
                <div className="text-sm text-black/70 space-y-1">
                  <p>Aulas: {course.lessons_count}</p>
                  <p>Duração: {course.duration}</p>
                  <p>Criado em: {new Date(course.created_at).toLocaleDateString('pt-BR')}</p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => handleViewCourse(course)}>
                  <Eye className="h-4 w-4 mr-1" />
                  Ver
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleEditCourse(course)}>
                  <Edit className="h-4 w-4 mr-1" />
                  Editar
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-red-500 hover:text-red-700"
                  onClick={() => handleDeleteCourse(course.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Course Lessons Dialog */}
      <Dialog open={!!selectedCourse} onOpenChange={() => handleCloseCourseView()}>
        <DialogContent className="max-w-3xl bg-white text-black">
          <DialogHeader>
            <DialogTitle>{selectedCourse?.title}: Conteúdo e Materiais</DialogTitle>
            <DialogDescription>
              Gerencie as aulas e materiais deste curso
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-4 mb-2 flex justify-between items-center">
            <h3 className="font-medium">Aulas ({lessons.length})</h3>
            <Button size="sm" onClick={handleNewLesson}>
              <Plus className="h-4 w-4 mr-1" />
              Nova Aula
            </Button>
          </div>
          
          {lessons.length === 0 ? (
            <div className="py-8 text-center bg-gray-50 rounded-md">
              <p className="text-gray-500">Nenhuma aula encontrada para este curso</p>
              <Button className="mt-4" onClick={handleNewLesson} variant="outline">
                Adicionar primeira aula
              </Button>
            </div>
          ) : (
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {lessons.map((lesson) => (
                <div key={lesson.id} className="p-3 border rounded-md bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{lesson.order_number}. {lesson.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{lesson.content.substring(0, 120)}...</p>
                      
                      <div className="flex gap-4 mt-2 text-sm">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {lesson.duration}
                        </span>
                        {lesson.video_url && (
                          <span className="flex items-center gap-1 text-blue-600">
                            <Video className="h-3 w-3" />
                            Vídeo
                          </span>
                        )}
                        {lesson.pdf_url && (
                          <span className="flex items-center gap-1 text-green-600">
                            <FileText className="h-3 w-3" />
                            PDF
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-1">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleEditLesson(lesson)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDeleteLesson(lesson.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseCourseView}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Course Edit Dialog */}
      <Dialog open={isEditingCourse} onOpenChange={setIsEditingCourse}>
        <DialogContent className="max-w-2xl bg-white text-black">
          <DialogHeader>
            <DialogTitle>{selectedCourse ? "Editar Curso" : "Novo Curso"}</DialogTitle>
            <DialogDescription>
              {selectedCourse 
                ? "Atualize as informações do curso" 
                : "Preencha as informações para criar um novo curso"}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div>
              <label className="text-sm font-medium">Título do Curso</label>
              <Input 
                value={courseForm.title} 
                onChange={(e) => setCourseForm({...courseForm, title: e.target.value})}
                placeholder="Digite o título do curso"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Descrição</label>
              <Textarea 
                value={courseForm.description} 
                onChange={(e) => setCourseForm({...courseForm, description: e.target.value})}
                placeholder="Digite a descrição do curso"
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Duração Total</label>
                <Input 
                  value={courseForm.duration} 
                  onChange={(e) => setCourseForm({...courseForm, duration: e.target.value})}
                  placeholder="Ex: 5 horas"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Categoria</label>
                <Input 
                  value={courseForm.category} 
                  onChange={(e) => setCourseForm({...courseForm, category: e.target.value})}
                  placeholder="Ex: Educação, Saúde, etc."
                />
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium">URL da Imagem de Capa (opcional)</label>
              <Input 
                value={courseForm.thumbnail_url} 
                onChange={(e) => setCourseForm({...courseForm, thumbnail_url: e.target.value})}
                placeholder="URL da imagem de capa"
              />
            </div>

            {/* PDF Uploader component */}
            <PdfUploader 
              value={courseForm.pdf_url} 
              onChange={(url) => setCourseForm({...courseForm, pdf_url: url})}
              label="Material do Curso em PDF (opcional)"
            />
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditingCourse(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveCourse}>
              {selectedCourse ? "Atualizar Curso" : "Criar Curso"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Lesson Edit Dialog */}
      <Dialog open={isEditingLesson} onOpenChange={setIsEditingLesson}>
        <DialogContent className="max-w-2xl bg-white text-black">
          <DialogHeader>
            <DialogTitle>{currentLesson ? "Editar Aula" : "Nova Aula"}</DialogTitle>
            <DialogDescription>
              {currentLesson 
                ? "Atualize as informações da aula" 
                : "Preencha as informações para criar uma nova aula"}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-4 gap-4">
              <div className="col-span-3">
                <label className="text-sm font-medium">Título da Aula</label>
                <Input 
                  value={lessonForm.title} 
                  onChange={(e) => setLessonForm({...lessonForm, title: e.target.value})}
                  placeholder="Digite o título da aula"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Ordem</label>
                <Input 
                  type="number"
                  value={lessonForm.order_number} 
                  onChange={(e) => setLessonForm({...lessonForm, order_number: parseInt(e.target.value) || 0})}
                  min={1}
                />
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium">Conteúdo</label>
              <Textarea 
                value={lessonForm.content} 
                onChange={(e) => setLessonForm({...lessonForm, content: e.target.value})}
                placeholder="Digite o conteúdo da aula"
                rows={5}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Duração</label>
              <Input 
                value={lessonForm.duration} 
                onChange={(e) => setLessonForm({...lessonForm, duration: e.target.value})}
                placeholder="Ex: 45 minutos"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">URL do Vídeo (opcional)</label>
              <Input 
                value={lessonForm.video_url} 
                onChange={(e) => setLessonForm({...lessonForm, video_url: e.target.value})}
                placeholder="URL do vídeo"
              />
            </div>
            
            {/* PDF Uploader for lesson materials */}
            <PdfUploader 
              value={lessonForm.pdf_url} 
              onChange={(url) => setLessonForm({...lessonForm, pdf_url: url})}
              label="Material da Aula em PDF (opcional)"
            />
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditingLesson(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveLesson}>
              {currentLesson ? "Atualizar Aula" : "Criar Aula"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
