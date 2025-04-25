
import React from 'react';
import { Shield, Heart, Calendar, Users, Flag, HeartHandshake, Warning, Check } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const treatmentTopics = [
  {
    title: "Fases da Recuperação",
    icon: Calendar,
    content: [
      {
        phase: "1. Desintoxicação",
        description: "Período inicial de abstinência e cuidados médicos intensivos."
      },
      {
        phase: "2. Reabilitação",
        description: "Terapias individuais e em grupo, desenvolvimento de habilidades de enfrentamento."
      },
      {
        phase: "3. Manutenção",
        description: "Acompanhamento contínuo, prevenção de recaídas e reinserção social."
      }
    ]
  },
  {
    title: "Tipos de Apoio",
    icon: HeartHandshake,
    content: [
      {
        type: "Internação",
        description: "Tratamento intensivo em ambiente controlado e seguro."
      },
      {
        type: "Ambulatorial",
        description: "Acompanhamento regular mantendo rotina diária."
      },
      {
        type: "Grupos de Apoio",
        description: "Encontros com pessoas em recuperação para compartilhar experiências."
      }
    ]
  },
  {
    title: "Prevenção de Recaídas",
    icon: Shield,
    content: [
      {
        tip: "Identificação de Gatilhos",
        description: "Reconhecer e evitar situações de risco."
      },
      {
        tip: "Rede de Apoio",
        description: "Manter contato próximo com familiares e profissionais."
      },
      {
        tip: "Plano de Emergência",
        description: "Ter estratégias definidas para momentos de crise."
      }
    ]
  }
];

const clinicContact = {
  phone: "+55 11 99999-9999",
  whatsapp: "https://wa.me/5511999999999",
};

const Treatments = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-600 to-teal-900 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center text-white mb-8">
          <h1 className="text-3xl font-bold mb-4">Tratamentos Disponíveis</h1>
          <p className="text-lg opacity-90">
            Conheça nossas opções de tratamento e receba orientação especializada
          </p>
        </div>

        <Card className="p-6">
          <Accordion type="single" collapsible className="space-y-4">
            {treatmentTopics.map((topic, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="flex items-center gap-3 text-lg">
                  <topic.icon className="h-6 w-6" />
                  {topic.title}
                </AccordionTrigger>
                <AccordionContent className="pt-4">
                  <div className="space-y-4">
                    {topic.content.map((item, idx) => (
                      <div key={idx} className="flex gap-3 items-start">
                        <Check className="h-5 w-5 mt-1 text-green-600" />
                        <div>
                          <h3 className="font-semibold">
                            {item.phase || item.type || item.tip}
                          </h3>
                          <p className="text-gray-600">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Card>

        <Card className="p-6 bg-green-50">
          <div className="text-center space-y-4">
            <HeartHandshake className="h-12 w-12 mx-auto text-green-600" />
            <h2 className="text-2xl font-semibold">Precisa de Ajuda?</h2>
            <p className="text-gray-600">
              Entre em contato conosco para conhecer nossas clínicas parceiras e
              receber orientação personalizada.
            </p>
            <Button
              className="bg-green-600 hover:bg-green-700"
              size="lg"
              onClick={() => window.open(clinicContact.whatsapp, '_blank')}
            >
              <Heart className="h-5 w-5 mr-2" />
              Fale Conosco no WhatsApp
            </Button>
            <p className="text-sm text-gray-500">
              ou ligue para {clinicContact.phone}
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Treatments;
