
import React, { useState } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const TermometroDaRecuperacao = () => {
  const [dados, setDados] = useState({
    tarefasDiarias: 0,
    humorDoDia: 0,
    fezDevocional: 0,
    hojeNaoVouUsar: 0,
    fezReflexao: 0,
    gatilhosSelecionados: [] as string[]
  });

  const calcularPontuacao = () => {
    const { tarefasDiarias, humorDoDia, fezDevocional, hojeNaoVouUsar, fezReflexao, gatilhosSelecionados } = dados;

    const tarefasPontos = Math.min((tarefasDiarias / 27) * 30, 30);
    const humorPontos = Math.min((humorDoDia / 5) * 20, 20);
    const devocionalPontos = Math.min((fezDevocional / 2) * 20, 20);
    const hojeNaoUsarPontos = Math.min((hojeNaoVouUsar / 5) * 20, 20);
    const reflexaoPontos = Math.min((fezReflexao / 3) * 10, 10);
    const penalidadeGatilhos = (gatilhosSelecionados?.length || 0) * 2;

    const total = Math.max(0, Math.round(
      tarefasPontos + humorPontos + devocionalPontos + hojeNaoUsarPontos + reflexaoPontos - penalidadeGatilhos
    ));

    return total;
  };

  const resetarTermometro = () => {
    setDados({
      tarefasDiarias: 0,
      humorDoDia: 0,
      fezDevocional: 0,
      hojeNaoVouUsar: 0,
      fezReflexao: 0,
      gatilhosSelecionados: []
    });
  };

  const pontuacao = calcularPontuacao();

  const getCor = (valor: number) => {
    if (valor < 40) return '#dc3545'; // vermelho
    if (valor < 70) return '#ffc107'; // amarelo
    return '#28a745'; // verde
  };

  return (
    <Card className="max-w-md mx-auto p-6 space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold">🧘 A SOBRIEDADE É UMA CONQUISTA DIÁRIA</h2>
        <p className="text-gray-600">Seu Termômetro de Recuperação</p>
      </div>

      <div className="w-40 h-40 mx-auto">
        <CircularProgressbar
          value={pontuacao}
          text={`${pontuacao}/100`}
          styles={buildStyles({
            pathColor: getCor(pontuacao),
            textColor: getCor(pontuacao),
            trailColor: '#eee'
          })}
        />
      </div>

      <div className="text-center">
        {pontuacao < 40 && <p>⚠️ Risco de recaída. Procure apoio.</p>}
        {pontuacao >= 40 && pontuacao < 70 && <p>😐 Atenção redobrada. Continue se cuidando.</p>}
        {pontuacao >= 70 && <p>💪 Você está indo bem. Continue firme!</p>}
      </div>

      <div className="space-y-2">
        <p>✅ Tarefas Diárias: +{Math.round((dados.tarefasDiarias / 27) * 30)} pts</p>
        <p>😊 Humor do Dia: +{Math.round((dados.humorDoDia / 5) * 20)} pts</p>
        <p>🙏 Devocional: +{Math.round((dados.fezDevocional / 2) * 20)} pts</p>
        <p>🚨 Hoje Eu Não Vou Usar: +{Math.round((dados.hojeNaoVouUsar / 5) * 20)} pts</p>
        <p>📝 Reflexão do Dia: +{Math.round((dados.fezReflexao / 3) * 10)} pts</p>
        <p>🔻 Gatilhos: -{dados.gatilhosSelecionados.length * 2} pts</p>
      </div>

      <div className="flex justify-between">
        <Button
          onClick={resetarTermometro}
          variant="destructive"
          className="w-full"
        >
          🔄 Resetar Termômetro
        </Button>
      </div>
    </Card>
  );
};

export default TermometroDaRecuperacao;
