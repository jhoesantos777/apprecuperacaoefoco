
import React, { useState } from 'react';
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
import { Search, RefreshCcw, Settings } from "lucide-react";
import { toast } from "sonner";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";

interface PremiumUser {
  id: string;
  name: string;
  email: string;
  planType: "mensal" | "anual";
  startDate: string;
  endDate: string;
  status: "ativo" | "expirado" | "pendente";
}

// Mock data for premium users
const mockPremiumUsers: PremiumUser[] = [
  {
    id: "1",
    name: "Carlos Silva",
    email: "carlos@exemplo.com",
    planType: "mensal",
    startDate: "2023-10-15",
    endDate: "2023-11-15",
    status: "ativo"
  },
  {
    id: "2",
    name: "Ana Pereira",
    email: "ana@exemplo.com",
    planType: "anual",
    startDate: "2023-08-01",
    endDate: "2024-08-01",
    status: "ativo"
  },
  {
    id: "3",
    name: "Roberto Almeida",
    email: "roberto@exemplo.com",
    planType: "mensal",
    startDate: "2023-09-10",
    endDate: "2023-10-10",
    status: "expirado"
  },
  {
    id: "4",
    name: "Julia Santos",
    email: "julia@exemplo.com",
    planType: "mensal",
    startDate: "2023-10-20",
    endDate: "2023-11-20",
    status: "pendente"
  }
];

export const AdminPremium = () => {
  const [premiumUsers, setPremiumUsers] = useState<PremiumUser[]>(mockPremiumUsers);
  const [searchTerm, setSearchTerm] = useState("");
  
  const getPlanRevenue = () => {
    const monthlyPlans = premiumUsers.filter(u => u.planType === "mensal" && u.status === "ativo").length;
    const yearlyPlans = premiumUsers.filter(u => u.planType === "anual" && u.status === "ativo").length;
    
    // Assuming monthly plan costs R$29.90 and yearly plan costs R$299.00
    return {
      monthly: monthlyPlans * 29.90,
      yearly: yearlyPlans * 299.00,
      total: (monthlyPlans * 29.90) + (yearlyPlans * 299.00)
    };
  };

  const revenue = getPlanRevenue();
  
  const handleRefresh = () => {
    toast.info("Atualizando dados...");
    // In a real application, this would fetch fresh data
  };
  
  const handleConfigurePlans = () => {
    toast("Configuração de planos premium será implementada");
  };

  const extendSubscription = (userId: string) => {
    toast.success("Assinatura estendida com sucesso");
  };

  const cancelSubscription = (userId: string) => {
    toast.success("Assinatura cancelada com sucesso");
  };

  const filteredUsers = premiumUsers.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gerenciar Contas Premium</h1>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCcw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
          
          <Button size="sm" onClick={handleConfigurePlans}>
            <Settings className="h-4 w-4 mr-2" />
            Configurar Planos
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Receita Mensal</CardTitle>
            <CardDescription>Assinaturas mensais</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {revenue.monthly.toFixed(2)}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Receita Anual</CardTitle>
            <CardDescription>Assinaturas anuais</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {revenue.yearly.toFixed(2)}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <CardDescription>Todas as assinaturas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {revenue.total.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Plano</TableHead>
              <TableHead>Data de Início</TableHead>
              <TableHead>Data Final</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10">
                  Nenhum usuário premium encontrado
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {user.planType === "mensal" ? "Mensal" : "Anual"}
                  </TableCell>
                  <TableCell>
                    {new Date(user.startDate).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell>
                    {new Date(user.endDate).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs ${
                      user.status === "ativo" 
                        ? "bg-green-100 text-green-800" 
                        : user.status === "expirado" 
                          ? "bg-red-100 text-red-800" 
                          : "bg-yellow-100 text-yellow-800"
                    }`}>
                      {user.status === "ativo" 
                        ? "Ativo" 
                        : user.status === "expirado" 
                          ? "Expirado" 
                          : "Pendente"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="mr-1"
                      onClick={() => extendSubscription(user.id)}
                    >
                      Estender
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-red-500 border-red-200 hover:bg-red-50"
                      onClick={() => cancelSubscription(user.id)}
                    >
                      Cancelar
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
