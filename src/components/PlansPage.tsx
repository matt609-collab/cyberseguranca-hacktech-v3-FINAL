import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  Check,
  CreditCard,
  ShieldCheck,
  Sparkles,
  RefreshCw,
  Cpu,
  Wifi,
  WifiOff,
  Users,
  Wrench,
  BatteryCharging,
  Info,
  AlertTriangle,
  Building2,
  TreePine,
  Calculator,
  Send,
  HelpCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface PlansPageProps {
  onBack: () => void;
}

export const PlansPage: React.FC<PlansPageProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'rural' | 'privada'>('rural');
  const [notification, setNotification] = useState<string | null>(null);

  // Estados do Simulador de Estimativa Rural
  const [qtdDrones, setQtdDrones] = useState<number>(4);
  const [hasWifi, setHasWifi] = useState<boolean>(true);
  const [qtdBases, setQtdBases] = useState<number>(2);
  const [areaHectares, setAreaHectares] = useState<number>(150);
  const [solicitacaoEnviada, setSolicitacaoEnviada] = useState<boolean>(false);

  // Cálculo da estimativa com a proporção solicitada:
  // 1 profissional para cada 4 drones (arredondado para cima)
  const estimativa = useMemo(() => {
    const profissionais = Math.max(1, Math.ceil(qtdDrones / 4));
    
    // Custo base estimado por operador técnico (hora de voo e telemetria)
    const custoProfissionais = profissionais * 1800;
    
    // Taxa extra de link satélite/rádio caso o comprador não ofereça Wi-Fi
    const taxaWifi = !hasWifi ? 480 : 0;
    
    // Taxa de manutenção periódica (revisão de hélices, motores brushless e sensores)
    const taxaManutencao = qtdDrones * 160;
    
    // Custo de locação/manutenção amortizada das bases de carregamento solar Resun 100W
    const custoBases = qtdBases * 350;
    
    const totalEstimado = custoProfissionais + taxaWifi + taxaManutencao + custoBases;

    return {
      profissionais,
      custoProfissionais,
      taxaWifi,
      taxaManutencao,
      custoBases,
      totalEstimado,
    };
  }, [qtdDrones, hasWifi, qtdBases]);

  const handleSolicitarEstudo = (e: React.FormEvent) => {
    e.preventDefault();
    setSolicitacaoEnviada(true);
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch {
      // ignore
    }
    setNotification('Solicitação de dimensionamento rural enviada à equipe técnica EPT de Pitanga!');
    setTimeout(() => setNotification(null), 5000);
  };

  return (
    <div className="w-full h-screen bg-[#141a23] text-[#ecf0f1] flex flex-col font-sans select-none overflow-y-auto">
      {/* Top Header */}
      <header className="bg-[#1b2633] border-b-2 border-[#f1c40f] px-8 py-4 flex items-center justify-between sticky top-0 z-50 shadow-lg shrink-0">
        <div className="flex items-center gap-3">
          <div className="bg-[#f1c40f] text-black font-black text-xl px-4 py-1.5 rounded tracking-wider shadow">
            VAI PITANGA
          </div>
          <span className="hidden md:inline-block text-xs font-mono text-gray-400 border-l border-gray-600 pl-3">
            Estrutura Comercial & Dimensionamento Técnico Rural
          </span>
        </div>
        <button
          onClick={onBack}
          className="border border-[#f1c40f] text-[#f1c40f] hover:bg-[#f1c40f] hover:text-black px-4 py-2 rounded text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md"
        >
          <ArrowLeft className="w-4 h-4" />
          CENTRO DE COMANDO
        </button>
      </header>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-6 pt-8 pb-28 w-full flex-1 space-y-8">
        
        {/* Toast Notification */}
        {notification && (
          <div className="bg-emerald-900/90 border border-emerald-500 text-emerald-100 px-4 py-3 rounded-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-2 shadow-lg">
            <Check className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="text-sm font-semibold">{notification}</span>
          </div>
        )}

        {/* Status da Operação Piloto */}
        <div className="bg-gradient-to-r from-[#1c2c3d] to-[#121922] border-l-6 border-[#27ae60] rounded-xl p-6 shadow-xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <div className="text-[11px] text-gray-400 uppercase tracking-wider mb-1 font-mono">Setor Focado</div>
            <div className="text-xl font-black text-[#f1c40f] flex items-center gap-2">
              <span>🌾 Patrulha Rural</span>
            </div>
            <div className="text-[10px] text-gray-400 mt-0.5 font-mono">Fazendas e Lavouras</div>
          </div>
          <div>
            <div className="text-[11px] text-gray-400 uppercase tracking-wider mb-1 font-mono">Modelo de Precificação</div>
            <div className="text-sm font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-2.5 py-1 rounded inline-block">
              Estimativa por Dimensionamento
            </div>
            <div className="text-[10px] text-gray-400 mt-1 font-mono">Sem valores fixos arbitrários</div>
          </div>
          <div>
            <div className="text-[11px] text-gray-400 uppercase tracking-wider mb-1 font-mono">Regra Operacional</div>
            <div className="text-base font-bold text-white font-mono">1 Técnico : 4 Drones</div>
            <div className="text-[10px] text-gray-400 mt-0.5 font-mono">Segurança de voo garantida</div>
          </div>
          <div>
            <div className="text-[11px] text-gray-400 uppercase tracking-wider mb-1 font-mono">Disponibilidade Comercial</div>
            <div className="text-sm font-bold text-amber-300 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
              Fase Piloto / Em Breve
            </div>
            <div className="text-[10px] text-gray-400 mt-0.5 font-mono">Futura expansão do projeto</div>
          </div>
        </div>

        {/* Abas de Navegação de Planos */}
        <div className="flex items-center justify-between border-b border-[#34495e] pb-3">
          <div className="flex gap-3">
            <button
              onClick={() => setActiveTab('rural')}
              className={`px-5 py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider transition-all border flex items-center gap-2 ${
                activeTab === 'rural'
                  ? 'bg-[#27ae60] border-[#27ae60] text-white shadow-lg shadow-emerald-950/60'
                  : 'bg-[#1b2633] border-[#34495e] text-gray-400 hover:text-white'
              }`}
            >
              <span>🌾 Plano Rural (Foco Atual)</span>
              <span className="text-[9px] bg-yellow-400 text-black px-1.5 py-0.2 rounded font-black">
                ATIVO
              </span>
            </button>

            <button
              onClick={() => setActiveTab('privada')}
              className={`px-5 py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider transition-all border flex items-center gap-2 ${
                activeTab === 'privada'
                  ? 'bg-[#27ae60] border-[#27ae60] text-white shadow-lg shadow-emerald-950/60'
                  : 'bg-[#1b2633] border-[#34495e] text-gray-400 hover:text-white'
              }`}
            >
              <span>🏢 Área Privada / Comercial</span>
              <span className="text-[9px] bg-gray-700 text-gray-300 px-1.5 py-0.2 rounded font-mono">
                FUTURAMENTE
              </span>
            </button>
          </div>

          <div className="text-[11px] font-mono text-gray-400 hidden sm:block">
            Pitanga - PR · Telemetria 5.8 GHz
          </div>
        </div>

        {/* CONTEÚDO DA ABA RURAL (FOCO PRINCIPAL COM ESTIMATIVA) */}
        {activeTab === 'rural' && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* Explicação da Estrutura de Estimativa */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-[#1b2633] border border-[#2c3e50] rounded-xl p-4 flex flex-col justify-between">
                <div>
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center mb-3">
                    <Users className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-white text-xs uppercase mb-1">1 Técnico para 4 Drones</h4>
                  <p className="text-[11px] text-gray-400 leading-relaxed">
                    Cada operador com rádio-controle e monitoramento cuida de no máximo 4 drones simultâneos para manter resposta imediata e segurança.
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-gray-700/60 text-[10px] font-mono text-blue-300">
                  Proporção fixa 1:4
                </div>
              </div>

              <div className="bg-[#1b2633] border border-[#2c3e50] rounded-xl p-4 flex flex-col justify-between">
                <div>
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center mb-3">
                    <Wifi className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-white text-xs uppercase mb-1">Taxa de Conectividade</h4>
                  <p className="text-[11px] text-gray-400 leading-relaxed">
                    Se a propriedade não oferecer rede Wi-Fi na sede, instalamos um link de alta disponibilidade (satélite ou rádio 5.8 GHz) com taxa extra.
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-gray-700/60 text-[10px] font-mono text-amber-300">
                  Isento se fazenda tiver Wi-Fi
                </div>
              </div>

              <div className="bg-[#1b2633] border border-[#2c3e50] rounded-xl p-4 flex flex-col justify-between">
                <div>
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
                    <BatteryCharging className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-white text-xs uppercase mb-1">Bases de Carregamento</h4>
                  <p className="text-[11px] text-gray-400 leading-relaxed">
                    Instalação física de docas de pouso solar na propriedade equipadas com placas Resun 100W e controlador MPPT autônomo.
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-gray-700/60 text-[10px] font-mono text-emerald-300">
                  Dimensionadas por piquete
                </div>
              </div>

              <div className="bg-[#1b2633] border border-[#2c3e50] rounded-xl p-4 flex flex-col justify-between">
                <div>
                  <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center mb-3">
                    <Wrench className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-white text-xs uppercase mb-1">Taxa de Manutenção</h4>
                  <p className="text-[11px] text-gray-400 leading-relaxed">
                    Substituição preventiva de motores brushless, calibração das câmeras térmicas FLIR, teste de bateria LiFePO4 e suporte técnico local.
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-gray-700/60 text-[10px] font-mono text-purple-300">
                  Manutenção periódica inclusa
                </div>
              </div>
            </div>

            {/* SIMULADOR DE ESTIMATIVA RURAL INTERATIVO */}
            <div className="bg-[#1b2633] border-2 border-[#f1c40f] rounded-2xl p-6 shadow-2xl relative overflow-hidden">
              <div className="flex items-center justify-between pb-4 border-b border-gray-700 mb-6">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-[#f1c40f] text-black rounded-lg">
                    <Calculator className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">
                      Simulador de Estimativa para Propriedades Rurais
                    </h3>
                    <p className="text-gray-400 text-xs font-mono">
                      Calcule os parâmetros técnicos de segurança para sua fazenda ou lavoura
                    </p>
                  </div>
                </div>

                <div className="bg-yellow-400/20 border border-yellow-400/50 text-yellow-300 text-xs font-mono px-3 py-1 rounded-full font-bold">
                  Estimativa de Projeto
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Controles de Configuração da Propriedade */}
                <div className="space-y-6">
                  {/* Quantidade de Drones */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs font-bold text-gray-200 uppercase font-mono flex items-center gap-1.5">
                        <Cpu className="w-4 h-4 text-[#f1c40f]" />
                        Quantidade de Drones na Frota:
                      </label>
                      <span className="text-sm font-black text-[#f1c40f] font-mono">
                        {qtdDrones} {qtdDrones === 1 ? 'drone' : 'drones'}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={12}
                      step={1}
                      value={qtdDrones}
                      onChange={(e) => setQtdDrones(Number(e.target.value))}
                      className="w-full accent-[#f1c40f] cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-gray-500 font-mono mt-1">
                      <span>1 drone</span>
                      <span>4 drones</span>
                      <span>8 drones</span>
                      <span>12 drones</span>
                    </div>
                  </div>

                  {/* Proporção Automática de Profissionais */}
                  <div className="bg-[#141d27] p-3.5 rounded-lg border border-gray-700 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Users className="w-4 h-4 text-blue-400" />
                        Profissionais Alocados (Proporção 1:4):
                      </div>
                      <div className="text-[11px] text-gray-400 mt-0.5">
                        1 operador técnico certificado a cada 4 drones ativos
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-base font-black text-blue-400 font-mono">
                        {estimativa.profissionais} {estimativa.profissionais === 1 ? 'profissional' : 'profissionais'}
                      </span>
                    </div>
                  </div>

                  {/* Pergunta sobre Wi-Fi na Propriedade */}
                  <div>
                    <label className="block text-xs font-bold text-gray-200 uppercase font-mono mb-2">
                      Infraestrutura de Internet na Sede:
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setHasWifi(true)}
                        className={`p-3 rounded-lg border text-left transition-all ${
                          hasWifi
                            ? 'bg-emerald-950/60 border-emerald-500 text-white shadow-md'
                            : 'bg-[#141d27] border-gray-700 text-gray-400 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2 font-bold text-xs">
                          <Wifi className="w-4 h-4 text-emerald-400" />
                          <span>Possui Wi-Fi na sede</span>
                        </div>
                        <div className="text-[10px] text-emerald-300 mt-1">
                          Sem taxa extra de conectividade
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setHasWifi(false)}
                        className={`p-3 rounded-lg border text-left transition-all ${
                          !hasWifi
                            ? 'bg-amber-950/60 border-amber-500 text-white shadow-md'
                            : 'bg-[#141d27] border-gray-700 text-gray-400 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2 font-bold text-xs">
                          <WifiOff className="w-4 h-4 text-amber-400" />
                          <span>Não possui Wi-Fi</span>
                        </div>
                        <div className="text-[10px] text-amber-300 mt-1">
                          + Taxa Link Satélite / Rádio EPT
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Quantidade de Bases de Carregamento Solar */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs font-bold text-gray-200 uppercase font-mono flex items-center gap-1.5">
                        <BatteryCharging className="w-4 h-4 text-emerald-400" />
                        Bases Solares de Carregamento a Instalar:
                      </label>
                      <span className="text-sm font-black text-emerald-400 font-mono">
                        {qtdBases} {qtdBases === 1 ? 'base' : 'bases'}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={6}
                      step={1}
                      value={qtdBases}
                      onChange={(e) => setQtdBases(Number(e.target.value))}
                      className="w-full accent-emerald-500 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-gray-500 font-mono mt-1">
                      <span>1 base</span>
                      <span>3 bases</span>
                      <span>6 bases</span>
                    </div>
                  </div>
                </div>

                {/* Resumo da Estimativa & Formulário de Contato */}
                <div className="bg-[#111822] border border-gray-700 rounded-xl p-5 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-white text-xs uppercase font-mono mb-4 pb-2 border-b border-gray-700 flex items-center justify-between">
                      <span>Composição da Estimativa Mensal</span>
                      <span className="text-[10px] text-gray-400">Sujeito a vistoria</span>
                    </h4>

                    <div className="space-y-3 text-xs font-mono">
                      <div className="flex justify-between items-center pb-2 border-b border-gray-800">
                        <span className="text-gray-400">
                          Equipe Operacional ({estimativa.profissionais} prof. / {qtdDrones} drones):
                        </span>
                        <span className="text-white font-bold">
                          R$ {estimativa.custoProfissionais.toLocaleString('pt-BR')},00
                        </span>
                      </div>

                      <div className="flex justify-between items-center pb-2 border-b border-gray-800">
                        <span className="text-gray-400">
                          Taxa de Conectividade {hasWifi ? '(Wi-Fi Próprio)' : '(Link Satélite/Rádio)'}:
                        </span>
                        <span className={hasWifi ? 'text-emerald-400' : 'text-amber-400 font-bold'}>
                          {hasWifi ? 'ISENTO (R$ 0,00)' : `+ R$ ${estimativa.taxaWifi.toLocaleString('pt-BR')},00`}
                        </span>
                      </div>

                      <div className="flex justify-between items-center pb-2 border-b border-gray-800">
                        <span className="text-gray-400">
                          Manutenção Preventiva de Frota ({qtdDrones} drones):
                        </span>
                        <span className="text-white">
                          R$ {estimativa.taxaManutencao.toLocaleString('pt-BR')},00
                        </span>
                      </div>

                      <div className="flex justify-between items-center pb-2 border-b border-gray-800">
                        <span className="text-gray-400">
                          Suporte de {qtdBases} {qtdBases === 1 ? 'Base Solar' : 'Bases Solares'} Instaladas:
                        </span>
                        <span className="text-white">
                          R$ {estimativa.custoBases.toLocaleString('pt-BR')},00
                        </span>
                      </div>

                      {/* Total */}
                      <div className="pt-2 flex justify-between items-center text-sm">
                        <span className="font-bold text-[#f1c40f]">TOTAL ESTIMADO:</span>
                        <span className="text-2xl font-black text-[#f1c40f]">
                          R$ {estimativa.totalEstimado.toLocaleString('pt-BR')},00
                          <span className="text-xs font-normal text-gray-400 font-sans"> /mês</span>
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 p-3 bg-black/40 rounded-lg text-[11px] text-gray-300 leading-relaxed border border-gray-800">
                      ℹ️ <strong>Nota Técnica:</strong> Os valores acima são estimativos para dimensionamento do projeto rural. 
                      A implantação em larga escala com contratação direta estará disponível <strong>futuramente</strong> à medida que o projeto VAI PITANGA crescer e homologar mais células de recarga.
                    </div>
                  </div>

                  <form onSubmit={handleSolicitarEstudo} className="mt-6 pt-4 border-t border-gray-800 space-y-3">
                    <button
                      type="submit"
                      disabled={solicitacaoEnviada}
                      className={`w-full py-3 px-4 rounded-lg font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg ${
                        solicitacaoEnviada
                          ? 'bg-emerald-700 text-white cursor-default'
                          : 'bg-[#f1c40f] hover:bg-yellow-400 text-black active:scale-98 shadow-yellow-950/40 cursor-pointer'
                      }`}
                    >
                      {solicitacaoEnviada ? (
                        <>
                          <Check className="w-4 h-4 stroke-[3]" />
                          SOLICITAÇÃO DE ESTUDO REGISTRADA
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 stroke-[2.5]" />
                          SOLICITAR ESTUDO DE VIABILIDADE RURAL
                        </>
                      )}
                    </button>
                    <div className="text-center text-[10px] text-gray-500 font-mono">
                      Atendimento exclusivo para propriedades de Pitanga e região central do Paraná
                    </div>
                  </form>
                </div>
              </div>
            </div>

            {/* Comparativo de Cenários Rurais */}
            <div className="text-sm font-bold text-[#f1c40f] uppercase tracking-wider pb-1 border-b border-[#34495e]">
              Cenários de Dimensionamento Típicos em Pitanga
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#1b2633] border border-gray-700 rounded-xl p-5 flex flex-col justify-between">
                <div>
                  <div className="text-[10px] font-mono text-gray-400 uppercase">Cenário 1</div>
                  <h4 className="text-base font-bold text-white mb-2">Pequena Propriedade / Sítio</h4>
                  <div className="text-xs text-gray-300 space-y-1.5 mb-4 font-mono">
                    <div>• 2 Drones de Patrulha Contínua</div>
                    <div>• 1 Operador Técnico Dedicado (1:4)</div>
                    <div>• 1 Base Solar de Recarga no Galpão</div>
                    <div>• Usa Wi-Fi da Sede (Sem taxa extra)</div>
                  </div>
                </div>
                <div className="pt-3 border-t border-gray-700 flex justify-between items-center text-xs">
                  <span className="text-gray-400">Estimativa:</span>
                  <span className="font-bold text-[#f1c40f] font-mono">~R$ 2.470/mês</span>
                </div>
              </div>

              <div className="bg-[#1b2633] border-2 border-emerald-500/70 rounded-xl p-5 flex flex-col justify-between shadow-lg relative">
                <div className="absolute -top-3 right-4 bg-emerald-500 text-white font-bold text-[9px] uppercase px-2 py-0.5 rounded">
                  Configuração Mais Buscada
                </div>
                <div>
                  <div className="text-[10px] font-mono text-emerald-400 uppercase">Cenário 2</div>
                  <h4 className="text-base font-bold text-white mb-2">Fazenda de Médio Porte</h4>
                  <div className="text-xs text-gray-300 space-y-1.5 mb-4 font-mono">
                    <div>• 4 Drones com Sensores Térmicos FLIR</div>
                    <div>• 1 Operador Especializado (1:4)</div>
                    <div>• 2 Bases Solares nos Extremos</div>
                    <div>• Suporte com Manutenção Periódica</div>
                  </div>
                </div>
                <div className="pt-3 border-t border-gray-700 flex justify-between items-center text-xs">
                  <span className="text-gray-400">Estimativa:</span>
                  <span className="font-bold text-emerald-400 font-mono">~R$ 3.140/mês</span>
                </div>
              </div>

              <div className="bg-[#1b2633] border border-gray-700 rounded-xl p-5 flex flex-col justify-between">
                <div>
                  <div className="text-[10px] font-mono text-gray-400 uppercase">Cenário 3</div>
                  <h4 className="text-base font-bold text-white mb-2">Grande Lavoura / Agroindústria</h4>
                  <div className="text-xs text-gray-300 space-y-1.5 mb-4 font-mono">
                    <div>• 8 Drones em Malha Automatizada</div>
                    <div>• 2 Operadores em Turnos (Proporção 1:4)</div>
                    <div>• 4 Bases com Recarga MPPT Rápida</div>
                    <div>• Link Satélite Autônomo Incluso</div>
                  </div>
                </div>
                <div className="pt-3 border-t border-gray-700 flex justify-between items-center text-xs">
                  <span className="text-gray-400">Estimativa:</span>
                  <span className="font-bold text-[#f1c40f] font-mono">~R$ 6.840/mês</span>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* CONTEÚDO DA ABA PRIVADA / URBANA (FUTURAMENTE) */}
        {activeTab === 'privada' && (
          <div className="bg-[#1b2633] border border-gray-700 rounded-2xl p-8 text-center space-y-4 animate-fadeIn">
            <div className="w-14 h-14 bg-gray-800 text-gray-400 rounded-full flex items-center justify-center mx-auto">
              <Building2 className="w-7 h-7" />
            </div>
            <div className="max-w-md mx-auto">
              <div className="inline-block bg-yellow-400/20 text-yellow-300 border border-yellow-400/50 text-xs font-mono font-bold px-3 py-1 rounded-full mb-2">
                FUTURAMENTE
              </div>
              <h3 className="text-lg font-bold text-white">
                Planos para Área Urbana e Condomínios Privados
              </h3>
              <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                Este módulo encontra-se momentaneamente omisso e sem valores tabelados.
                A disponibilização de serviços para empresas urbanas e condomínios fechados 
                <strong> será implementada futuramente</strong>, quando o projeto consolidar sua infraestrutura na área rural.
              </p>
            </div>
            <div className="pt-4">
              <button
                onClick={() => setActiveTab('rural')}
                className="py-2.5 px-5 rounded-lg bg-[#27ae60] hover:bg-emerald-600 text-white font-bold text-xs uppercase transition-colors"
              >
                Voltar ao Foco Atual (Área Rural)
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
