
import React, { useEffect } from 'react'
import { Toaster } from "@/components/ui/toaster";
import { Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { setupMockApi } from "./utils/mockApi";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import SignUp from "./pages/SignUp";
import CadastroSimplificado from "./pages/CadastroSimplificado";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Premium from "./pages/Premium";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import Sobriety from "./pages/Sobriety";
import Tasks from "./pages/Tasks";
import Recovery from "./pages/Recovery";
import Reflection from "./pages/Reflection";
import Achievements from "./pages/Achievements";
import Courses from "./pages/Courses";
import Schedule from "./pages/Schedule";
import Devotional from "./pages/Devotional";
import Treatments from "./pages/Treatments";
import AtualizarHumor from "./pages/AtualizarHumor";
import Admin from "./pages/Admin";
import Triggers from "./pages/Triggers";
import Users from "./pages/Users";
import UserProfile from "./pages/UserProfile";
import Irmandade from "./pages/Irmandade";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Setup mock API
    setupMockApi();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/cadastro-simplificado" element={<CadastroSimplificado />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/premium" element={<Premium />} />
              <Route path="/about" element={<About />} />
              <Route path="/sobriety" element={<Sobriety />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/recovery" element={<Recovery />} />
              <Route path="/reflection" element={<Reflection />} />
              <Route path="/achievements" element={<Achievements />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/schedule" element={<Schedule />} />
              <Route path="/consultations" element={<Navigate to="/schedule" replace />} />
              <Route path="/devotional" element={<Devotional />} />
              <Route path="/triggers" element={<Triggers />} />
              <Route path="/usuarios" element={<Users />} />
              <Route path="/perfil/:id" element={<UserProfile />} />
              <Route path="/irmandade" element={<Irmandade />} />
              <Route path="/talk-to-me" element={<Navigate to="/triggers" replace />} />
              <Route path="/chat" element={<Navigate to="/triggers" replace />} />
              <Route path="/treatments" element={<Treatments />} />
              <Route path="/atualizar-humor" element={<AtualizarHumor />} />
              <Route path="/support" element={<Navigate to="/triggers" replace />} /> 
              <Route path="/admin" element={<Admin />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
