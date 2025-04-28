
export interface DrugCategory {
  title: string;
  icon: string;
  drugs: string[];
}

export type UserType = "dependent" | "family" | "professional";

export type RelationType = "spouse" | "father" | "mother" | "sibling" | "uncle" | "cousin" | "friend" | "other";

export interface SignUpFormData {
  nome: string;
  dataNascimento: string;
  genero: string;
  cidade: string;
  estado: string;
  tipoUsuario: UserType;
  grauParentesco?: RelationType;
  contatoEmergencia?: string;
  tempoUso?: string;
  drogas: string[];
  aceitaTermos: boolean;
  email: string;
  password: string;
}
