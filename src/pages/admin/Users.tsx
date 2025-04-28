
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { User, UserX, UserPlus } from "lucide-react";
import { toast } from "sonner";

const Users = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAdminAndLoadUsers = async () => {
      const userRole = localStorage.getItem("userRole");
      if (userRole !== "admin") {
        toast.error("Acesso não autorizado");
        navigate("/dashboard");
        return;
      }

      try {
        const { data: profiles, error } = await supabase
          .from("profiles")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        setUsers(profiles || []);
      } catch (error) {
        console.error("Error loading users:", error);
        toast.error("Erro ao carregar usuários");
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminAndLoadUsers();
  }, [navigate]);

  const handleDeactivateUser = async (userId: string) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ active: false })
        .eq("id", userId);

      if (error) throw error;
      
      toast.success("Usuário desativado com sucesso");
      setUsers(users.map(user => 
        user.id === userId ? { ...user, active: false } : user
      ));
    } catch (error) {
      console.error("Error deactivating user:", error);
      toast.error("Erro ao desativar usuário");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-600 to-teal-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Gerenciar Usuários</h1>
            <Button 
              onClick={() => navigate("/dashboard")}
              variant="outline"
            >
              Voltar ao Dashboard
            </Button>
          </div>

          {isLoading ? (
            <div className="text-center py-10">
              <p>Carregando usuários...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">Status</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Cidade</TableHead>
                    <TableHead>Data de Registro</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        {user.active !== false ? (
                          <span className="inline-block w-2 h-2 bg-green-500 rounded-full" />
                        ) : (
                          <span className="inline-block w-2 h-2 bg-red-500 rounded-full" />
                        )}
                      </TableCell>
                      <TableCell>{user.nome || "N/A"}</TableCell>
                      <TableCell>{user.email || "N/A"}</TableCell>
                      <TableCell>{user.cidade || "N/A"}</TableCell>
                      <TableCell>
                        {user.created_at
                          ? new Date(user.created_at).toLocaleDateString("pt-BR")
                          : "N/A"}
                      </TableCell>
                      <TableCell className="text-right">
                        {user.active !== false ? (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeactivateUser(user.id)}
                          >
                            <UserX className="h-4 w-4 mr-1" />
                            Desativar
                          </Button>
                        ) : (
                          <Button
                            variant="secondary"
                            size="sm"
                            disabled
                          >
                            Desativado
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Users;
