
export type DrugCategory = {
  title: string;
  icon: string;
  drugs: string[];
};

export type UserType = "dependent" | "family" | "professional";

export interface SignUpFormData {
  nome: string;
  dataNascimento: string;
  genero: string;
  cidade: string;
  estado: string;
  tipoUsuario: UserType;
  contatoEmergencia?: string;
  tempoUso: string;
  drogas: string[];
  aceitaTermos: boolean;
}
