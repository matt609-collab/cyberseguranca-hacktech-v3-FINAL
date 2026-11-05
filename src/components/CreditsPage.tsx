import React, { useState } from 'react';
import { ArrowLeft, Cpu, Zap, Sun, ShieldCheck, Eye, Terminal, Award } from 'lucide-react';

interface CreditsPageProps {
  onBack: () => void;
}

interface TeamMember {
  name: string;
  role: string;
  image: string;
  tag: string;
  details: string;
}

export const CreditsPage: React.FC<CreditsPageProps> = ({ onBack }) => {
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);

  const team: TeamMember[] = [
    {
      name: 'José',
      role: 'Engenharia de Sistemas',
      image: '/pessoinhas/jose.jpg',
      tag: 'EPT / Hardware',
      details: 'Integração de barramento de dados, telemetria de sensores DS18B20 e balanceamento LiFePO4.',
    },
    {
      name: 'Emanuelly',
      role: 'Field OPS || Operações de campo',
      image: '/pessoinhas/emanuelly.jpg',
      tag: 'EPT / Backend',
      details: 'Testes de funcionamento e prototipagem do drone.',
    },
    {
      name: 'Lorena',
      role: 'Gestão de Frota',
      image: '/pessoinhas/lorena.jpg',
      tag: 'EPT / Operações',
      details: 'Supervisão de células ativas, ciclo de vida de baterias e protocolos de despacho integrado.',
    },
    {
      name: 'Matheus C.',
      role: 'Desenvolvimento Frontend',
      image: '/pessoinhas/matheuscheff.jpg',
      tag: 'EPT / Interface',
      details: 'Design tático do Centro de Comando v6.0, cartografia Leaflet e telemetria militar em HUD.',
    },
    {
      name: 'Thassila',
      role: 'Análise de Dados / IA',
      image: '/pessoinhas/thassila.jpg',
      tag: 'EPT / Visão Computacional',
      details: 'Modelos neurais embarcados de detecção precoce de incêndios florestais e invasões perimetrais.',
    },
    {
      name: 'Matheus E.',
      role: 'Engenharia de software || Field OPS',
      image: '/pessoinhas/matheusem.jpg',
      tag: 'EPT / Piloto Homologado',
      details: 'Backend e frontend do sistema de controle, testes de integração e validação em campo.',
    },
  ];

  const specs = [
    { label: 'Chassi Base', value: 'DJI Mini 3', note: 'Aerodinâmica ultraleve e motores brushless' },
    { label: 'Fonte Solar', value: 'Painel Resun 100W', note: 'Captação fotovoltaica contínua em voo' },
    { label: 'Bateria Auxiliar', value: 'LiFePO4 12V 20Ah', note: 'Segurança química e alta vida útil (>3000 ciclos)' },
    { label: 'Controlador de Carga', value: 'Epower MPPT 20A', note: 'Algoritmo de rastreamento de ponto máximo de potência' },
    { label: 'Alimentação USB', value: 'Conversor USB-C PD 30W', note: 'Alimentação balanceada dos sensores secundários' },
    { label: 'Sensor Térmico Interno', value: 'DS18B20', note: 'Proteção contra superaquecimento em campo' },
    { label: 'Visão Noturna / FPV', value: 'Infravermelho 256x192', note: 'Varredura perimetral noturna sem iluminação externa' },
    { label: 'Sensor Principal', value: 'Câmera Térmica Dedicada', note: 'Identificação automatizada de focos de calor (>600°C)' },
  ];

  const parts = [
    {
      name: 'Painel Solar',
      model: 'Resun 100W',
      function: 'Captação fotovoltaica para recarga contínua em campo',
      icon: Sun,
    },
    {
      name: 'Bateria',
      model: 'LiFePO4 12V 20Ah',
      function: 'Armazenamento de energia de alta eficiência e segurança química',
      icon: Zap,
    },
    {
      name: 'Controlador de Carga',
      model: 'Epower MPPT 20A',
      function: 'Gestão inteligente de energia fotovoltaica e proteção contra sobrecarga',
      icon: Cpu,
    },
    {
      name: 'Conversor de Potência',
      model: 'Conversor USB-C PD 30W',
      function: 'Alimentação regulada de 30W para módulos auxiliares e sensores embarcados',
      icon: Zap,
    },
    {
      name: 'Sensor de Temperatura',
      model: 'DS18B20',
      function: 'Monitoramento térmico contínuo do chassi e baterias',
      icon: Eye,
    },
    {
      name: 'Chassis / Propulsão',
      model: 'Drone DJI Mini 3',
      function: 'Estrutura aerodinâmica leve, motores brushless e sistema de voo principal',
      icon: ShieldCheck,
    },
    {
      name: 'Câmera Infravermelho',
      model: 'FPV 256x192',
      function: 'Transmissão de imagens infravermelhas em tempo real para o operador',
      icon: Eye,
    },
    {
      name: 'Câmera Térmica',
      model: 'Sensor Térmico de Alta Precisão',
      function: 'Detecção automatizada de pontos quentes, focos de incêndio e intrusões',
      icon: Eye,
    },
  ];

  return (
    <div className="w-full h-screen bg-[#1a1a1a] text-[#ecf0f1] flex flex-col font-sans select-none overflow-y-auto">
      {/* Header */}
      <header className="bg-[#2c3e50] border-b-2 border-[#f1c40f] px-8 py-4 flex items-center justify-between sticky top-0 z-50 shadow-lg shrink-0">
        <div className="bg-[#f1c40f] text-black font-black text-xl px-4 py-1.5 rounded tracking-wider shadow">
          VAI PITANGA
        </div>
        <button
          onClick={onBack}
          className="border border-[#f1c40f] text-[#f1c40f] hover:bg-[#f1c40f] hover:text-black px-4 py-2 rounded text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          CENTRO DE COMANDO
        </button>
      </header>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-6 pt-8 pb-28 w-full flex-1">
        {/* TEAM SECTION */}
        <div className="text-sm font-bold text-[#f1c40f] uppercase tracking-wider mb-4 pb-2 border-b border-[#34495e] flex items-center justify-between">
          <span>👥 Equipe de Desenvolvimento EPT</span>
          <span className="text-xs font-mono text-gray-400">Educação Profissional e Tecnológica · Paraná</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
          {team.map((member, i) => (
            <div
              key={i}
              className="bg-[#222d38] border border-[#34495e] border-l-4 border-l-[#f1c40f] rounded-lg p-3.5 text-center flex flex-col items-center hover:border-[#f1c40f] transition-all duration-200 group hover:-translate-y-1"
            >
              <h3 className="font-bold text-sm text-white mb-0.5">{member.name}</h3>
              <p className="text-[10px] text-gray-400 uppercase tracking-tight mb-2.5 h-6 flex items-center">
                {member.role}
              </p>

              <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-gray-700 bg-black/40 mb-2 shadow-inner group-hover:border-[#f1c40f] transition-colors">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800">
                {member.tag}
              </span>
            </div>
          ))}
        </div>

        {/* BLUEPRINT SCHEMATIC SECTION */}
        <div className="text-sm font-bold text-[#f1c40f] uppercase tracking-wider mb-4 pb-2 border-b border-[#34495e] flex items-center justify-between">
          <span>🛸 Modelo Operacional: VAI-PITANGA SOLAR V6</span>
          <span className="text-xs font-mono text-emerald-400">STATUS: HOMOLOGADO ANAC / EPT</span>
        </div>

        <div className="bg-[#222d38] border border-[#34495e] rounded-xl p-6 mb-12 grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-6 items-center shadow-xl">
          {/* Blueprint Display Graphic */}
          <div className="bg-black border border-[#34495e] rounded-lg overflow-hidden flex flex-col items-center justify-center relative shadow-inner">
            <img
              src="/gifs/dronedesign.jpg"
              alt="Design do Drone VAI-PITANGA com especificações"
              className="w-full h-auto object-cover max-h-[380px]"
            />
            <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded border border-white/10 text-[10px] font-mono text-[#f1c40f]">
              ESQUEMA TÉCNICO V6.0
            </div>
          </div>

          {/* Quick Specs List */}
          <div>
            <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
              <Award className="w-4 h-4 text-[#f1c40f]" />
              Ficha Técnica Simplificada
            </h3>
            <ul className="divide-y divide-white/5 text-xs">
              {specs.map((item, idx) => (
                <li key={idx} className="py-2 flex justify-between items-center gap-2">
                  <span className="text-gray-300">{item.label}</span>
                  <span className="text-[#f1c40f] font-mono font-bold text-right">{item.value}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* INTEGRATED HARDWARE COMPONENTS TABLE */}
        <div className="text-sm font-bold text-[#f1c40f] uppercase tracking-wider mb-4 pb-2 border-b border-[#34495e]">
          🧩 Componentes e Hardware Integrado
        </div>

        <div className="bg-[#222d38] border border-[#34495e] rounded-xl overflow-hidden shadow-xl mb-8">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-black/40 text-[#f1c40f] uppercase text-[11px] font-mono border-b border-[#34495e]">
                  <th className="py-3 px-4 font-bold">Componente</th>
                  <th className="py-3 px-4 font-bold">Especificação Modelo</th>
                  <th className="py-3 px-4 font-bold">Função no Sistema</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-sans">
                {parts.map((p, i) => (
                  <tr
                    key={i}
                    onClick={() => setSelectedComponent(p.name)}
                    className="hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    <td className="py-3 px-4 text-white font-bold flex items-center gap-2">
                      <p.icon className="w-3.5 h-3.5 text-[#f1c40f]" />
                      {p.name}
                    </td>
                    <td className="py-3 px-4 text-[#f1c40f] font-mono">{p.model}</td>
                    <td className="py-3 px-4 text-gray-300">{p.function}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};
