
import React, { useState } from 'react';
import { BackButton } from "@/components/BackButton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TriggerForm from '@/components/TriggerForm';
import TermometroDaRecuperacao from '@/components/recovery/TermometroDaRecuperacao';
import RecoveryActivities from '@/components/recovery/RecoveryActivities';
import { motion } from 'framer-motion';

const Recovery = () => {
  const [activeTab, setActiveTab] = useState("termometer");

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-6">
      <BackButton className="text-white mb-4" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">Recuperação</h1>
          <p className="text-white/80 mt-2">Acompanhe seu progresso e registre suas atividades</p>
        </div>

        <Tabs 
          defaultValue="termometer" 
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="termometer">Termômetro</TabsTrigger>
            <TabsTrigger value="activities">Atividades</TabsTrigger>
            <TabsTrigger value="triggers">Gatilhos</TabsTrigger>
          </TabsList>
          
          <TabsContent value="termometer" className="mt-0">
            <TermometroDaRecuperacao />
          </TabsContent>
          
          <TabsContent value="activities" className="mt-0">
            <RecoveryActivities />
          </TabsContent>
          
          <TabsContent value="triggers" className="mt-0">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-4">Mapeie seus Gatilhos</h2>
              <p className="text-white/80 mb-6">
                Identifique situações, emoções ou ambientes que despertam seu desejo pelo uso de substâncias. 
                Reconhecê-los é o primeiro passo para desenvolver estratégias para lidar com eles.
              </p>
              <TriggerForm />
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default Recovery;
