
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Users, Calendar, Award, Clock } from "lucide-react";
import { toast } from "sonner";

export const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    premiumUsers: 0,
    dailyLogins: 0,
    loading: true
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Get total users count from profiles table
        const { count: totalUsers, error } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });
          
        if (error) throw error;

        // For demo purposes, let's set other values relative to total users
        // In a production app, you would query these values from the database
        const activeUsers = Math.floor(totalUsers * 0.7); // 70% active
        const premiumUsers = Math.floor(totalUsers * 0.2); // 20% premium
        const dailyLogins = Math.floor(totalUsers * 0.4); // 40% daily logins

        setStats({
          totalUsers: totalUsers || 0,
          activeUsers,
          premiumUsers,
          dailyLogins,
          loading: false
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        toast.error("Falha ao carregar estatísticas");
        setStats(prev => ({ ...prev, loading: false }));
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-black">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white/40 backdrop-blur-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-black">Total Usuários</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {stats.loading ? (
              <div className="text-2xl font-bold text-black">Carregando...</div>
            ) : (
              <>
                <div className="text-2xl font-bold text-black">{stats.totalUsers}</div>
                <p className="text-xs text-muted-foreground">
                  Usuários cadastrados no sistema
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="bg-white/40 backdrop-blur-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-black">Usuários Ativos</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {stats.loading ? (
              <div className="text-2xl font-bold text-black">Carregando...</div>
            ) : (
              <>
                <div className="text-2xl font-bold text-black">{stats.activeUsers}</div>
                <p className="text-xs text-muted-foreground">
                  {Math.round((stats.activeUsers / stats.totalUsers) * 100) || 0}% do total
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="bg-white/40 backdrop-blur-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-black">Contas Premium</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {stats.loading ? (
              <div className="text-2xl font-bold text-black">Carregando...</div>
            ) : (
              <>
                <div className="text-2xl font-bold text-black">{stats.premiumUsers}</div>
                <p className="text-xs text-muted-foreground">
                  {Math.round((stats.premiumUsers / stats.totalUsers) * 100) || 0}% do total
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="bg-white/40 backdrop-blur-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-black">Logins Diários</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {stats.loading ? (
              <div className="text-2xl font-bold text-black">Carregando...</div>
            ) : (
              <>
                <div className="text-2xl font-bold text-black">{stats.dailyLogins}</div>
                <p className="text-xs text-muted-foreground">
                  {Math.round((stats.dailyLogins / stats.totalUsers) * 100) || 0}% do total
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white/40 backdrop-blur-lg">
          <CardHeader>
            <CardTitle className="text-black">Estatísticas de Uso</CardTitle>
            <CardDescription>
              Visão geral dos últimos 30 dias.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] flex items-center justify-center text-muted-foreground">
              Gráfico de estatísticas (implementação futura)
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white/40 backdrop-blur-lg">
          <CardHeader>
            <CardTitle className="text-black">Atividade Recente</CardTitle>
            <CardDescription>
              Últimas ações no sistema.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              <li className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-green-500 mr-2" />
                <div className="flex-1">
                  <p className="text-sm text-black">Novo usuário registrado</p>
                  <p className="text-xs text-muted-foreground">Há 2 horas</p>
                </div>
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-blue-500 mr-2" />
                <div className="flex-1">
                  <p className="text-sm text-black">Conta premium ativada</p>
                  <p className="text-xs text-muted-foreground">Há 5 horas</p>
                </div>
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2" />
                <div className="flex-1">
                  <p className="text-sm text-black">Novo conteúdo publicado</p>
                  <p className="text-xs text-muted-foreground">Ontem</p>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
