
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { DrugCategory } from "@/types/signup";

interface DrugSelectionProps {
  selectedDrugs: string[];
  onDrugToggle: (drug: string) => void;
}

export const DrugSelection = ({ selectedDrugs, onDrugToggle }: DrugSelectionProps) => {
  const drugCategories: DrugCategory[] = [
    {
      title: "Lícitas",
      icon: "🍺",
      drugs: ["Álcool", "Tabaco (cigarro tradicional)", "Narguilé"],
    },
    {
      title: "Medicamentos e Benzodiazepínicos",
      icon: "💊",
      drugs: [
        "Diazepam",
        "Clonazepam",
        "Alprazolam",
        "Zolpidem",
        "Codeína / Tramadol",
        "Anfetaminas para emagrecer / estudar",
      ],
    },
    {
      title: "Naturais e semi-sintéticas",
      icon: "🌿",
      drugs: [
        "Maconha",
        "Haxixe",
        "Chá de cogumelo (psilocibina)",
        "Ayahuasca",
        "Lança perfume / Cheirinho da loló",
      ],
    },
    {
      title: "Injetáveis / Pesadas",
      icon: "💉",
      drugs: ["Cocaína (aspirada ou injetada)", "Crack", "Merla", "Heroína", "Oxi"],
    },
    {
      title: "Sintéticas / Drogas de festa",
      icon: "🧪",
      drugs: ["LSD", "MDMA / Ecstasy", "Ketamina", "Popper", "GHB (droga do estupro)"],
    },
    {
      title: "Outras",
      icon: "🌀",
      drugs: [
        "Cola de sapateiro",
        "Tinner",
        "Removedor de esmalte",
        "Inalantes em geral",
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {drugCategories.map((category) => (
        <Card key={category.title} className="p-4">
          <h3 className="text-lg font-semibold mb-3">
            {category.icon} {category.title}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {category.drugs.map((drug) => (
              <div key={drug} className="flex items-center space-x-2">
                <Checkbox
                  id={drug}
                  checked={selectedDrugs.includes(drug)}
                  onCheckedChange={() => onDrugToggle(drug)}
                />
                <label
                  htmlFor={drug}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {drug}
                </label>
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
};
