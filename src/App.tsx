
import React, { useEffect } from 'react'
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Index from '@/pages/Index';
import Dashboard from '@/pages/Dashboard';
import Sobriety from '@/pages/Sobriety';
import Profile from '@/pages/Profile';
import Reflection from '@/pages/Reflection';
import NotFound from '@/pages/NotFound';
import Triggers from '@/pages/Triggers';
import About from '@/pages/About';
import Recovery from '@/pages/Recovery';
import Devotional from '@/pages/Devotional';
import Auth from '@/pages/Auth';
import SignUp from '@/pages/SignUp';
import CadastroSimplificado from '@/pages/CadastroSimplificado';
import Settings from '@/pages/Settings';
import Admin from '@/pages/Admin';
import Treatments from '@/pages/Treatments';
import Achievements from '@/pages/Achievements';
import Schedule from '@/pages/Schedule';
import AtualizarHumor from '@/pages/AtualizarHumor';
import Tasks from '@/pages/Tasks';
import Chat from '@/pages/Chat';
import Premium from '@/pages/Premium';
import Courses from '@/pages/Courses';
import Irmandade from '@/pages/Irmandade';
import UserProfile from '@/pages/UserProfile';
import Users from '@/pages/Users';
import Vitrine from '@/pages/Vitrine';

import { ThemeProvider } from '@/contexts/ThemeContext';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <SonnerToaster />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/sobriedade" element={<Sobriety />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/reflexoes" element={<Reflection />} />
              <Route path="/gatilhos" element={<Triggers />} />
              <Route path="/sobre" element={<About />} />
              <Route path="/recuperacao" element={<Recovery />} />
              <Route path="/devocional" element={<Devotional />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/cadastro" element={<SignUp />} />
              <Route path="/cadastro-simplificado" element={<CadastroSimplificado />} />
              <Route path="/configuracoes" element={<Settings />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/tratamentos" element={<Treatments />} />
              <Route path="/conquistas" element={<Achievements />} />
              <Route path="/agendar" element={<Schedule />} />
              <Route path="/humor" element={<AtualizarHumor />} />
              <Route path="/atualizar-humor" element={<AtualizarHumor />} /> {/* Added this line to support both routes */}
              <Route path="/tarefas" element={<Tasks />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/premium" element={<Premium />} />
              <Route path="/cursos" element={<Courses />} />
              <Route path="/irmandade" element={<Irmandade />} />
              <Route path="/perfil/:id" element={<UserProfile />} />
              <Route path="/usuarios" element={<Users />} />
              <Route path="/vitrine" element={<Vitrine />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
