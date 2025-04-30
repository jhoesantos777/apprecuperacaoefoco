
import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  MoreHorizontal,
  Search,
  UserPlus,
  RefreshCcw,
  Mail,
  Shield,
  ShieldX,
  Clock
} from "lucide-react";
import { toast } from "sonner";
import { UserType } from "@/types/signup";

interface User {
  id: string;
  nome: string | null;
  email: string | null;
  tipoUsuario: UserType;
  created_at: string;
  last_login: string | null;
  is_active: boolean;
}

export const AdminUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [confirmAction, setConfirmAction] = useState<"block" | "unblock">("block");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*');
        
      if (error) {
        throw error;
      }
      
      // Transform the data to include tipoUsuario property
      const formattedUsers = data.map(user => {
        // Get user role from localStorage for this demo
        // In a real app, this would come from a user_roles table or similar
        let userRole: UserType = "dependent";
        
        if (user.email === "admin@admin") {
          userRole = "admin";
        } else {
          // Try to get from localStorage, but this is just a fallback
          // since localStorage is browser-specific and won't work across users
          const savedRole = localStorage.getItem("userRole");
          userRole = (savedRole as UserType) || "dependent";
        }
        
        return {
          ...user,
          tipoUsuario: userRole,
          last_login: user.last_login || "Nunca",
          is_active: user.is_active !== false // Default to true if not set
        };
      });
      
      setUsers(formattedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error("Falha ao carregar dados dos usuários");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEditUser = (userId: string) => {
    toast("Edição de usuário será implementada");
  };

  const handleDeleteUser = (userId: string) => {
    toast.warning("Deleção de usuário será implementada");
  };

  const handleResetPassword = (userEmail: string) => {
    toast.info(`Link de redefinição será enviado para ${userEmail}`);
  };

  const openBlockConfirmDialog = (user: User) => {
    setSelectedUser(user);
    setConfirmAction(user.is_active ? "block" : "unblock");
    setConfirmDialogOpen(true);
  };

  const handleToggleUserStatus = async () => {
    if (!selectedUser) return;
    
    try {
      const newStatus = !selectedUser.is_active;
      const { error } = await supabase
        .from('profiles')
        .update({ is_active: newStatus })
        .eq('id', selectedUser.id);

      if (error) throw error;
      
      // Update local state
      setUsers(users.map(user => 
        user.id === selectedUser.id ? {...user, is_active: newStatus} : user
      ));
      
      toast.success(
        newStatus 
          ? `Usuário ${selectedUser.nome || selectedUser.email} desbloqueado com sucesso.` 
          : `Usuário ${selectedUser.nome || selectedUser.email} bloqueado com sucesso.`
      );
      
    } catch (error) {
      console.error('Error toggling user status:', error);
      toast.error("Falha ao alterar status do usuário");
    } finally {
      setConfirmDialogOpen(false);
      setSelectedUser(null);
    }
  };

  const filteredUsers = users.filter(user => 
    user.nome?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-black">Gerenciar Usuários</h1>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchUsers}>
            <RefreshCcw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
          
          <Button size="sm">
            <UserPlus className="h-4 w-4 mr-2" />
            Novo Usuário
          </Button>
        </div>
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

      <div className="border rounded-md bg-white/40 backdrop-blur-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-black">Nome</TableHead>
              <TableHead className="text-black">Email</TableHead>
              <TableHead className="text-black">Tipo</TableHead>
              <TableHead className="text-black">Data de Cadastro</TableHead>
              <TableHead className="text-black">Último Acesso</TableHead>
              <TableHead className="text-black">Status</TableHead>
              <TableHead className="w-[80px] text-black">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-black">
                  Carregando usuários...
                </TableCell>
              </TableRow>
            ) : filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-black">
                  Nenhum usuário encontrado
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium text-black">{user.nome || "—"}</TableCell>
                  <TableCell className="text-black">{user.email || "—"}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs ${
                      user.tipoUsuario === "admin" 
                        ? "bg-red-100 text-red-800" 
                        : user.tipoUsuario === "family" 
                          ? "bg-blue-100 text-blue-800" 
                          : "bg-green-100 text-green-800"
                    }`}>
                      {user.tipoUsuario || "dependent"}
                    </span>
                  </TableCell>
                  <TableCell className="text-black">
                    {new Date(user.created_at).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell className="text-black">
                    {user.last_login ? new Date(user.last_login).toLocaleDateString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit'
                    }) : "Nunca"}
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs ${
                      user.is_active 
                        ? "bg-green-100 text-green-800" 
                        : "bg-red-100 text-red-800"
                    }`}>
                      {user.is_active ? "Ativo" : "Inativo"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Abrir menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditUser(user.id)}>
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteUser(user.id)}>
                          Excluir
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleResetPassword(user.email || '')}>
                          <Mail className="h-4 w-4 mr-2" />
                          Enviar reset de senha
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openBlockConfirmDialog(user)}>
                          {user.is_active ? (
                            <>
                              <ShieldX className="h-4 w-4 mr-2" />
                              Bloquear usuário
                            </>
                          ) : (
                            <>
                              <Shield className="h-4 w-4 mr-2" />
                              Desbloquear usuário
                            </>
                          )}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <AlertDialogContent className="bg-white text-black">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmAction === "block" ? "Bloquear usuário?" : "Desbloquear usuário?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmAction === "block" 
                ? "Esta ação impedirá que o usuário acesse o aplicativo. Você pode reverter isso mais tarde."
                : "Esta ação permitirá que o usuário acesse o aplicativo novamente."
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleToggleUserStatus}
              className={confirmAction === "block" ? "bg-red-600 hover:bg-red-700" : ""}
            >
              {confirmAction === "block" ? "Bloquear" : "Desbloquear"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
