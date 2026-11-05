import React, { useState } from 'react';
import { ArrowLeft, Check, CreditCard, ShieldCheck, Download, Sparkles, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PlansPageProps {
  onBack: () => void;
}

interface Plan {
  id: string;
  name: string;
  price: string;
  monthlyValue: string;
  category: 'rural' | 'municipio' | 'privada';
  area: string;
  drones: number;
  connection: string;
  features: string[];
  recommended?: boolean;
}

export const PlansPage: React.FC<PlansPageProps> = ({ onBack }) => {
  const [activeCategory, setActiveCategory] = useState<'rural' | 'municipio' | 'privada'>('rural');
  const [currentPlanName, setCurrentPlanName] = useState<string>('Rural Plus');
  const [currentPrice, setCurrentPrice] = useState<string>('R$ 3.900,00');
  const [notification, setNotification] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
  const [primaryPayment, setPrimaryPayment] = useState<string>('Cartão de Crédito (Mastercard) **** 4821');

  const plans: Plan[] = [
    // Rural
    {
      id: 'rural-1',
      name: 'Rural Básico',
      price: 'R$ 2.900',
      monthlyValue: 'R$ 2.900,00',
      category: 'rural',
      area: 'até 1.000.000 m²',
      drones: 2,
      connection: 'Conexão Telemetria 5G',
      features: [
        '📐 Área: até 1.000.000 m²',
        '🚁 2 Drones à disposição',
        '📡 Conexão Telemetria 5G',
        '🚨 Alertas térmicos automáticos',
      ],
    },
    {
      id: 'rural-2',
      name: 'Rural Plus',
      price: 'R$ 3.900',
      monthlyValue: 'R$ 3.900,00',
      category: 'rural',
      area: 'até 2.000.000 m²',
      drones: 3,
      connection: 'Conexão Híbrida (5G / Satélite)',
      features: [
        '📐 Área: até 2.000.000 m²',
        '🚁 3 Drones à disposição',
        '📡 Conexão Híbrida (5G / Satélite)',
        '🚨 Alertas térmicos e IA preditiva',
      ],
      recommended: true,
    },
    {
      id: 'rural-3',
      name: 'Rural Premium',
      price: 'R$ 5.500',
      monthlyValue: 'R$ 5.500,00',
      category: 'rural',
      area: 'até 5.000.000 m²',
      drones: 4,
      connection: 'Link de Rádio + Satélite dedicado',
      features: [
        '📐 Área: até 5.000.000 m²',
        '🚁 4 Drones à disposição',
        '📡 Link de Rádio + Satélite dedicado',
        '🚨 Suporte e despacho priorizado 24/7',
      ],
    },

    // Municipio
    {
      id: 'mun-1',
      name: 'Município Essencial',
      price: 'R$ 39.900',
      monthlyValue: 'R$ 39.900,00',
      category: 'municipio',
      area: 'Cobertura Municipal Urbana',
      drones: 16,
      connection: 'Rede Mesh Municipal Privada',
      features: [
        '🏙️ Cobertura Municipal Urbana',
        '🚁 16 Drones à disposição',
        '🏛️ Acesso multi-usuário para central',
        '🚨 Integração com Bombeiros/Polícia',
      ],
    },
    {
      id: 'mun-2',
      name: 'Município Completo',
      price: 'R$ 54.900',
      monthlyValue: 'R$ 54.900,00',
      category: 'municipio',
      area: 'Cobertura Urbana + Periurbana',
      drones: 24,
      connection: 'Backhaul Fibra + Satélite LEO',
      features: [
        '🏙️ Cobertura Urbana + Periurbana',
        '🚁 24 Drones à disposição',
        '🏛️ Central com relatórios de IA diários',
        '🚨 Integração prioritária com órgãos estaduais',
      ],
      recommended: true,
    },
    {
      id: 'mun-3',
      name: 'Município Avançado',
      price: 'R$ 69.900',
      monthlyValue: 'R$ 69.900,00',
      category: 'municipio',
      area: 'Cobertura Total Territorial',
      drones: 32,
      connection: 'Rede Tática Militar Criptografada',
      features: [
        '🏙️ Cobertura Total Territorial',
        '🚁 32 Drones à disposição',
        '🏛️ Relatórios de inteligência urbana em tempo real',
        '🚨 Suporte VIP + Manutenção contínua de frota',
      ],
    },

    // Privada
    {
      id: 'priv-1',
      name: 'Privado Básico',
      price: 'R$ 390',
      monthlyValue: 'R$ 390,00',
      category: 'privada',
      area: 'até 50.000 m²',
      drones: 2,
      connection: 'Wi-Fi 6 + 5G Fallback',
      features: [
        '📐 Área: até 50.000 m²',
        '🚁 2 Drones à disposição',
        '📹 Transmissão Full HD ao vivo',
        '🚨 Notificações no celular/Web',
      ],
    },
    {
      id: 'priv-2',
      name: 'Privado Plus',
      price: 'R$ 690',
      monthlyValue: 'R$ 690,00',
      category: 'privada',
      area: 'até 100.000 m²',
      drones: 3,
      connection: 'Link 5G Dedicado',
      features: [
        '📐 Área: até 100.000 m²',
        '🚁 3 Drones à disposição',
        '📹 Transmissão Térmica + HD',
        '🚨 Gravação contínua em nuvem',
      ],
    },
    {
      id: 'priv-3',
      name: 'Privado Premium',
      price: 'R$ 990',
      monthlyValue: 'R$ 990,00',
      category: 'privada',
      area: 'até 200.000 m²',
      drones: 4,
      connection: 'Satélite + Rádio Patrulha',
      features: [
        '📐 Área: até 200.000 m²',
        '🚁 4 Drones à disposição',
        '📹 Visão Noturna Infravermelha + IA',
        '🚨 Patrulhamento autônomo agendado',
      ],
    },
  ];

  const handleSelectPlan = (plan: Plan) => {
    setCurrentPlanName(plan.name);
    setCurrentPrice(plan.monthlyValue);
    setNotification(`Plano alterado para "${plan.name}" com sucesso! Telemetria e frotas sincronizadas.`);
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch {
      // ignore
    }
    setTimeout(() => setNotification(null), 4000);
  };

  const filteredPlans = plans.filter((p) => p.category === activeCategory);

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
        {/* Toast Notification */}
        {notification && (
          <div className="mb-6 bg-emerald-900/80 border border-emerald-500 text-emerald-200 px-4 py-3 rounded-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
            <Check className="w-5 h-5 text-emerald-400" />
            <span className="text-sm font-semibold">{notification}</span>
          </div>
        )}

        {/* Current Subscription Status Card */}
        <div className="text-sm font-bold text-[#f1c40f] uppercase tracking-wider mb-4 pb-2 border-b border-[#34495e]">
          Sua Assinatura Atual
        </div>

        <div className="bg-gradient-to-r from-[#1e3c72] to-[#2c3e50] border-l-6 border-[#27ae60] rounded-xl p-6 mb-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 shadow-xl">
          <div>
            <div className="text-[11px] text-gray-300 uppercase tracking-wider mb-1">Plano Ativo</div>
            <div className="text-xl font-black text-[#f1c40f]">{currentPlanName}</div>
          </div>
          <div>
            <div className="text-[11px] text-gray-300 uppercase tracking-wider mb-1">Status</div>
            <div className="inline-flex items-center gap-1.5 bg-[#27ae60] text-white px-2.5 py-1 rounded-full text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
              ATIVO
            </div>
          </div>
          <div>
            <div className="text-[11px] text-gray-300 uppercase tracking-wider mb-1">Renovação Em</div>
            <div className="text-lg font-bold text-white font-mono">15/12/2026</div>
          </div>
          <div>
            <div className="text-[11px] text-gray-300 uppercase tracking-wider mb-1">Valor Mensal</div>
            <div className="text-xl font-bold text-white font-mono">{currentPrice}</div>
          </div>
        </div>

        {/* Plans Category Tabs */}
        <div className="text-sm font-bold text-[#f1c40f] uppercase tracking-wider mb-4 pb-2 border-b border-[#34495e]">
          Planos Disponíveis
        </div>

        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={() => setActiveCategory('rural')}
            className={`px-6 py-3 rounded-lg font-bold text-sm transition-all border ${
              activeCategory === 'rural'
                ? 'bg-[#27ae60] border-[#27ae60] text-white shadow-lg shadow-emerald-950/50'
                : 'bg-[#2c3e50] border-[#34495e] text-gray-300 hover:text-white'
            }`}
          >
            🌾 Área Rural
          </button>
          <button
            onClick={() => setActiveCategory('municipio')}
            className={`px-6 py-3 rounded-lg font-bold text-sm transition-all border ${
              activeCategory === 'municipio'
                ? 'bg-[#27ae60] border-[#27ae60] text-white shadow-lg shadow-emerald-950/50'
                : 'bg-[#2c3e50] border-[#34495e] text-gray-300 hover:text-white'
            }`}
          >
            🏙️ Município Inteiro
          </button>
          <button
            onClick={() => setActiveCategory('privada')}
            className={`px-6 py-3 rounded-lg font-bold text-sm transition-all border ${
              activeCategory === 'privada'
                ? 'bg-[#27ae60] border-[#27ae60] text-white shadow-lg shadow-emerald-950/50'
                : 'bg-[#2c3e50] border-[#34495e] text-gray-300 hover:text-white'
            }`}
          >
            🏢 Área Privada
          </button>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {filteredPlans.map((plan) => {
            const isCurrent = currentPlanName === plan.name;

            return (
              <div
                key={plan.id}
                className={`bg-[#222d38] rounded-xl p-6 flex flex-col justify-between border transition-all duration-300 relative ${
                  isCurrent
                    ? 'border-2 border-[#f1c40f] shadow-2xl shadow-yellow-950/30'
                    : 'border-[#34495e] hover:border-[#f1c40f] hover:-translate-y-1 hover:shadow-xl'
                }`}
              >
                {/* Featured Badge */}
                {isCurrent && (
                  <div className="absolute -top-3 right-5 bg-[#f1c40f] text-black font-black text-[10px] px-2.5 py-1 rounded uppercase tracking-wider shadow">
                    Plano Atual
                  </div>
                )}
                {!isCurrent && plan.recommended && (
                  <div className="absolute -top-3 right-5 bg-emerald-500 text-white font-black text-[10px] px-2.5 py-1 rounded uppercase tracking-wider shadow">
                    Recomendado
                  </div>
                )}

                <div>
                  <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                  <div className="text-2xl font-black text-[#f1c40f] mb-4">
                    {plan.price}{' '}
                    <span className="text-xs font-normal text-gray-400">/mês</span>
                  </div>

                  <ul className="space-y-2.5 text-xs text-gray-300 mb-6">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="pb-2 border-b border-white/5 flex items-center gap-2">
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => handleSelectPlan(plan)}
                  disabled={isCurrent}
                  className={`w-full py-3 px-4 rounded-lg font-bold text-xs uppercase tracking-wider transition-all ${
                    isCurrent
                      ? 'bg-gray-700 text-gray-400 cursor-default'
                      : 'bg-[#27ae60] hover:bg-emerald-600 text-white shadow-md active:scale-98'
                  }`}
                >
                  {isCurrent ? 'Plano em Uso' : 'Migrar para este Plano'}
                </button>
              </div>
            );
          })}
        </div>

        {/* Financial / Billing Section */}
        <div className="text-sm font-bold text-[#f1c40f] uppercase tracking-wider mb-4 pb-2 border-b border-[#34495e]">
          Informações Financeiras
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Payment Method Card */}
          <div className="bg-[#222d38] border border-[#34495e] rounded-xl p-5">
            <strong className="text-sm font-mono text-[#f1c40f] block mb-3">
              💳 FORMA DE PAGAMENTO CADASTRADA
            </strong>

            <div className="space-y-2.5">
              <div className="flex items-center justify-between bg-black/30 p-3 rounded-lg text-xs">
                <span className="text-gray-200">{primaryPayment}</span>
                <span className="text-[#27ae60] font-bold text-[11px] font-mono">PADRÃO</span>
              </div>
              <div className="flex items-center justify-between bg-black/30 p-3 rounded-lg text-xs">
                <span className="text-gray-200">PIX Automático Cadastrado (Banco do Brasil)</span>
                <span className="text-gray-400 text-[11px] font-mono">SECUNDÁRIO</span>
              </div>
            </div>

            <button
              onClick={() => setShowPaymentModal(true)}
              className="w-full mt-4 py-2.5 px-4 rounded-lg bg-[#34495e] hover:bg-[#415b75] text-white font-bold text-xs uppercase transition-colors"
            >
              Alterar Dados de Pagamento
            </button>
          </div>

          {/* Invoices History Table */}
          <div className="bg-[#222d38] border border-[#34495e] rounded-xl p-5">
            <strong className="text-sm font-mono text-[#f1c40f] block mb-3">
              📄 HISTÓRICO DE FATURAS
            </strong>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="text-gray-400 border-b border-[#34495e]">
                    <th className="pb-2 font-semibold">Data</th>
                    <th className="pb-2 font-semibold">Descrição</th>
                    <th className="pb-2 font-semibold">Valor</th>
                    <th className="pb-2 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr>
                    <td className="py-2.5 text-gray-300 font-mono">15/11/2026</td>
                    <td className="py-2.5 text-white">{currentPlanName}</td>
                    <td className="py-2.5 font-mono text-gray-200">{currentPrice}</td>
                    <td className="py-2.5 text-[#27ae60] font-bold font-mono">PAGO</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 text-gray-300 font-mono">15/10/2026</td>
                    <td className="py-2.5 text-white">Plano Rural Plus</td>
                    <td className="py-2.5 font-mono text-gray-200">R$ 3.900,00</td>
                    <td className="py-2.5 text-[#27ae60] font-bold font-mono">PAGO</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 text-gray-300 font-mono">15/09/2026</td>
                    <td className="py-2.5 text-white">Plano Rural Plus</td>
                    <td className="py-2.5 font-mono text-gray-200">R$ 3.900,00</td>
                    <td className="py-2.5 text-[#27ae60] font-bold font-mono">PAGO</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>

      {/* Payment Update Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#1e2a38] border-2 border-[#f1c40f] rounded-xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="font-bold text-base text-[#f1c40f] mb-4">
              Atualizar Forma de Pagamento
            </h3>
            <p className="text-xs text-gray-300 mb-4">
              Selecione o método de pagamento padrão para faturamento mensal da frota em Pitanga:
            </p>
            <div className="space-y-3 mb-6">
              <label className="flex items-center gap-3 p-3 bg-black/30 rounded-lg border border-gray-700 cursor-pointer hover:border-[#f1c40f]">
                <input
                  type="radio"
                  name="payment"
                  checked={primaryPayment.includes('Mastercard')}
                  onChange={() => setPrimaryPayment('Cartão de Crédito (Mastercard) **** 4821')}
                />
                <span className="text-xs text-white">Cartão Mastercard **** 4821</span>
              </label>
              <label className="flex items-center gap-3 p-3 bg-black/30 rounded-lg border border-gray-700 cursor-pointer hover:border-[#f1c40f]">
                <input
                  type="radio"
                  name="payment"
                  checked={primaryPayment.includes('Visa')}
                  onChange={() => setPrimaryPayment('Cartão Corporativo (Visa) **** 9102')}
                />
                <span className="text-xs text-white">Cartão Corporativo (Visa) **** 9102</span>
              </label>
              <label className="flex items-center gap-3 p-3 bg-black/30 rounded-lg border border-gray-700 cursor-pointer hover:border-[#f1c40f]">
                <input
                  type="radio"
                  name="payment"
                  checked={primaryPayment.includes('PIX')}
                  onChange={() => setPrimaryPayment('PIX Automático Integrado (Banco Central)')}
                />
                <span className="text-xs text-white">PIX Automático Direto</span>
              </label>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="flex-1 py-2 rounded-lg bg-[#27ae60] hover:bg-emerald-600 text-white font-bold text-xs uppercase"
              >
                Salvar Alterações
              </button>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="py-2 px-4 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-200 text-xs"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
