
import { Beer, PartyPopper, Users, Brain, Wallet, Moon, Cigarette } from "lucide-react";

export type TriggerType = {
  id: string;
  label: string;
  icon: typeof Beer;
  tip: string;
};

export const triggers: TriggerType[] = [
  {
    id: "festas",
    label: "Festas",
    icon: PartyPopper,
    tip: "Planeje com antecedência uma desculpa para sair cedo ou recuse convites perigosos."
  },
  {
    id: "bares",
    label: "Bares",
    icon: Beer,
    tip: "Substitua o ambiente: vá a um cinema, parque ou cafeteria."
  },
  {
    id: "amigos",
    label: "Amigos que usam",
    icon: Users,
    tip: "Lembre-se: você está se protegendo. Mantenha distância até estar mais forte."
  },
  {
    id: "estresse",
    label: "Estresse",
    icon: Brain,
    tip: "Pratique respiração profunda ou escreva o que está sentindo para aliviar."
  },
  {
    id: "financeiros",
    label: "Problemas financeiros",
    icon: Wallet,
    tip: "Busque apoio profissional ou um mentor para aconselhamento financeiro."
  },
  {
    id: "insonia",
    label: "Insônia",
    icon: Moon,
    tip: "Evite telas antes de dormir e tente uma meditação guiada."
  },
  {
    id: "cheiro",
    label: "Cheiro de drogas",
    icon: Cigarette,
    tip: "Saia imediatamente do local e entre em contato com alguém da sua rede de apoio."
  }
];
