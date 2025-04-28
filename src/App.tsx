
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
import TalkToMe from "./pages/TalkToMe";
import Treatments from "./pages/Treatments";
import AtualizarHumor from "./pages/AtualizarHumor";
import Users from "./pages/admin/Users";
import Therapeutic from "./pages/Therapeutic";
import MeditationPage from "./pages/meditation/MeditationPage";
import MeditationSession from "./pages/meditation/MeditationSession";
import TherapeuticActivities1 from "./pages/TherapeuticActivities1";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import MoodEditor from "./pages/admin/MoodEditor";
import TasksEditor from "./pages/admin/TasksEditor";
import TherapeuticEditor from "./pages/admin/TherapeuticEditor";
import DevotionalEditor from "./pages/admin/DevotionalEditor";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
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
              <Route path="/talk-to-me" element={<TalkToMe />} />
              <Route path="/chat" element={<Navigate to="/talk-to-me" replace />} />
              <Route path="/treatments" element={<Treatments />} />
              <Route path="/atualizar-humor" element={<AtualizarHumor />} />
              <Route path="/support" element={<TalkToMe />} />
              <Route path="/admin/users" element={<Users />} />
              <Route path="/therapeutic" element={<Therapeutic />} />
              <Route path="/meditation" element={<MeditationPage />} />
              <Route path="/meditation/:id" element={<MeditationSession />} />
              
              <Route path="/therapeutic-activities-1" element={<TherapeuticActivities1 />} />
              
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/mood-editor" element={<MoodEditor />} />
              <Route path="/admin/tasks-editor" element={<TasksEditor />} />
              <Route path="/admin/therapeutic-editor" element={<TherapeuticEditor />} />
              <Route path="/admin/devotional-editor" element={<DevotionalEditor />} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
