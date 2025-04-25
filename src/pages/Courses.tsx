
import React from 'react';
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Book, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const Courses = () => {
  const navigate = useNavigate();

  const { data: courses } = useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      const { data } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: true });
      
      return data;
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-500 to-purple-600 p-6">
      <button
        onClick={() => navigate('/dashboard')}
        className="text-white/70 hover:text-white flex items-center gap-2 mb-6"
      >
        <ArrowLeft size={24} />
        Voltar
      </button>

      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Book className="h-12 w-12 text-yellow-300" />
          <div>
            <h1 className="text-3xl font-bold text-white">Cursos Online</h1>
            <p className="text-white/70">Apoio à sua jornada de recuperação</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {courses?.map((course) => (
            <Card 
              key={course.id} 
              className="bg-white/10 border-none text-white transform transition-transform hover:scale-105"
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <Book className="h-10 w-10 text-yellow-300" />
                  <h3 className="text-xl font-semibold">{course.title}</h3>
                </div>
                <p className="text-white/70 mb-4">{course.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-yellow-300">{course.duration}</span>
                  <Button 
                    variant="outline" 
                    className="text-white border-white/30 hover:bg-white/10"
                    onClick={() => navigate(`/courses/${course.id}`)}
                  >
                    Iniciar Curso
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {!courses?.length && (
          <Card className="bg-white/10 border-none text-white">
            <CardContent className="p-6 text-center">
              <p className="text-white/70">
                Novos cursos em breve! Continue sua jornada de recuperação.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Courses;
