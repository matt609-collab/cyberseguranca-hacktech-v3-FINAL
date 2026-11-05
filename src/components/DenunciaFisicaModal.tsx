import React, { useState, useMemo, useEffect } from 'react';
import {
  X,
  ShieldAlert,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Send,
  Navigation,
  Compass,
  Building2,
  TreePine,
  Sparkles,
  Info,
  Bike,
  Flame,
  Eye,
  ShieldCheck,
} from 'lucide-react';
import { Drone, PhysicalReport } from '../types';
import { soundFx } from '../utils/audio';

interface DenunciaFisicaModalProps {
  drones: Drone[];
  onClose: () => void;
  onSubmitReport: (report: PhysicalReport) => void;
}

// Regiões rurais cadastradas no sistema
const REGIOES_RURAIS_COBERTAS = [
  'Propriedade Rural (Pitanga - Setor Rural)',
  'Propriedade Rural (Foz do Iguaçu - Setor Rural)',
  'Propriedade Rural Parceira (Região Central)',
];

// Coordenadas padrão por região
const COORDENADAS_BASE: Record<string, { lat: number; lng: number }> = {
  'Propriedade Rural (Pitanga - Setor Rural)': { lat: -24.789, lng: -51.735 },
  'Propriedade Rural (Foz do Iguaçu - Setor Rural)': { lat: -25.531, lng: -54.562 },
  'Propriedade Rural Parceira (Região Central)': { lat: -24.7572, lng: -51.76 },
  'Propriedade Urbana / Outra Região (Sem Cobertura Ativa)': { lat: -25.395, lng: -51.462 },
};

// Cálculo de distância Haversine em km
export function calcDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Raio da Terra em km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(2));
}

export const DenunciaFisicaModal: React.FC<DenunciaFisicaModalProps> = ({
  drones,
  onClose,
  onSubmitReport,
}) => {
  // Localização / Região selecionada (por padrão Área Rural de Pitanga)
  const [localizacao, setLocalizacao] = useState<string>('Propriedade Rural (Pitanga - Setor Rural)');
  const [endereco, setEndereco] = useState<string>('Estrada Rural Linha Cantu, km 4 - Sede da Fazenda');
  const [tipoOcorrencia, setTipoOcorrencia] = useState<string>('Furto de Maquinário / Trator');
  const [urgencia, setUrgencia] = useState<'alta' | 'media' | 'baixa'>('alta');
  const [descricao, setDescricao] = useState<string>('');
  const [isGpsLoading, setIsGpsLoading] = useState<boolean>(false);
  const [coordsCustom, setCoordsCustom] = useState<{ lat: number; lng: number } | null>(null);

  // Determina se a propriedade rural é elegível
  const isElegivel = useMemo(() => {
    return REGIOES_RURAIS_COBERTAS.includes(localizacao);
  }, [localizacao]);

  // Coordenadas calculadas para o incidente
  const currentCoords = useMemo(() => {
    if (coordsCustom) return coordsCustom;
    const base = COORDENADAS_BASE[localizacao] || COORDENADAS_BASE['Pitanga'];
    // Adiciona uma pequena variação pseudo-aleatória realista baseada no tipo para não coincidir exatamente no mesmo ponto
    const offsetLat = (Math.sin(localizacao.length) * 0.004);
    const offsetLng = (Math.cos(localizacao.length) * 0.004);
    return {
      lat: Number((base.lat + offsetLat).toFixed(4)),
      lng: Number((base.lng + offsetLng).toFixed(4)),
    };
  }, [localizacao, coordsCustom]);

  // Encontra o drone mais próximo disponível
  const { closestDrone, distanceKm } = useMemo<{
    closestDrone: Drone | null;
    distanceKm: number;
  }>(() => {
    const available = drones.filter((d) => d.status !== 'OFF-LINE');
    if (available.length === 0) return { closestDrone: null, distanceKm: 0 };

    let bestDrone: Drone | null = null;
    let minDistance = Infinity;

    available.forEach((d) => {
      const dist = calcDistanceKm(d.lat, d.lng, currentCoords.lat, currentCoords.lng);
      if (dist < minDistance) {
        minDistance = dist;
        bestDrone = d;
      }
    });

    return {
      closestDrone: bestDrone,
      distanceKm: minDistance,
    };
  }, [drones, currentCoords]);

  // Simular detecção de GPS do usuário
  const handleDetectGPS = () => {
    setIsGpsLoading(true);
    soundFx.playClick();

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setIsGpsLoading(false);
          const lat = Number(position.coords.latitude.toFixed(4));
          const lng = Number(position.coords.longitude.toFixed(4));
          setCoordsCustom({ lat, lng });
          setLocalizacao('Pitanga'); // Mantém município base com coordenadas reais
          setEndereco(`Coordenadas GPS (${lat}, ${lng}) - Detectado`);
        },
        () => {
          // Fallback para simulação em Pitanga
          setTimeout(() => {
            setIsGpsLoading(false);
            setLocalizacao('Pitanga');
            setCoordsCustom({ lat: -24.7584, lng: -51.7612 });
            setEndereco('Centro Cívico de Pitanga (Sensor GPS Tático)');
          }, 600);
        },
        { timeout: 4000 }
      );
    } else {
      setTimeout(() => {
        setIsGpsLoading(false);
        setLocalizacao('Pitanga');
        setCoordsCustom({ lat: -24.7584, lng: -51.7612 });
      }, 500);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isElegivel) return;

    soundFx.playDispatchSuccess();

    let setor: 'rural' | 'urbano' | 'municipal' = 'municipal';
    if (localizacao === 'Área Rural (Pitanga)') setor = 'rural';
    else if (localizacao === 'Área Urbana Privada') setor = 'urbano';

    const newReport: PhysicalReport = {
      id: `DEN-${Date.now().toString().slice(-4)}`,
      tipo: tipoOcorrencia,
      descricao: descricao.trim() || 'Ocorrência física comunicada pelo cidadão. Drone redirecionado.',
      municipio: localizacao,
      setor,
      endereco: endereco || `Região central de ${localizacao}`,
      lat: currentCoords.lat,
      lng: currentCoords.lng,
      urgencia,
      assignedDroneId: closestDrone ? closestDrone.id : 'VAI-01',
      distanciaKm: distanceKm,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      status: 'DESPACHADO',
    };

    onSubmitReport(newReport);
    onClose();
  };

  // Keyboard escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[10000] bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 select-none animate-fadeIn">
      <div className="w-full max-w-xl bg-[#151d28] border-2 border-[#f1c40f] rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header Modal */}
        <div className="bg-gradient-to-r from-[#1c2836] to-[#0e1622] p-4 border-b border-[#2c3e50] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-red-600/20 border border-red-500/60 flex items-center justify-center text-red-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-wide uppercase flex items-center gap-2">
                <span>Registrar Denúncia Física Cidadã</span>
                <span className="text-[10px] bg-red-600 text-white font-mono font-bold px-1.5 py-0.5 rounded">
                  PRIORIDADE 1
                </span>
              </h2>
              <p className="text-[11px] text-gray-400 font-mono">
                Redirecionamento autônomo imediato do drone mais próximo
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar janela"
            className="text-gray-400 hover:text-white p-1 rounded-md hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body with Scroll */}
        <div className="p-4 overflow-y-auto space-y-4 text-xs font-sans">

          {/* BANNER DE COBERTURA RURAL */}
          {isElegivel ? (
            <div className="bg-gradient-to-r from-emerald-950/80 via-emerald-900/60 to-emerald-950/80 border-2 border-emerald-500/70 p-3.5 rounded-lg shadow-md animate-pulse">
              <div className="flex items-start gap-2.5">
                <Sparkles className="w-5 h-5 text-yellow-300 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-white text-xs tracking-wide">
                    🌾 Uhuul! Sua propriedade rural está cadastrada e conta com patrulha de drones ativa!
                  </div>
                  <p className="text-emerald-200/90 text-[11px] mt-1 leading-relaxed">
                    Sua fazenda ou lavoura em <strong>{localizacao}</strong> possui cobertura e bases solares integradas ao <strong>VAI PITANGA</strong>. Você está autenticado e o drone com menor tempo de voo será re-roteado em tempo real.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-red-950/80 border-2 border-red-500/80 p-3.5 rounded-lg text-red-200">
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-white text-xs">
                    ⚠️ Propriedade Sem Cobertura Rural Cadastrada
                  </div>
                  <p className="text-red-300 text-[11px] mt-1 leading-relaxed">
                    O despacho aéreo opera exclusivamente para propriedades rurais integradas ao sistema. Planos municipais foram descontinuados por questões regulatórias da ANAC e legislação de segurança pública.
                  </p>
                  <div className="mt-2.5 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setLocalizacao('Propriedade Rural (Pitanga - Setor Rural)')}
                      className="px-2.5 py-1 bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-[11px] rounded transition-colors"
                    >
                      Simular Fazenda em Pitanga
                    </button>
                    <button
                      type="button"
                      onClick={() => setLocalizacao('Propriedade Rural (Foz do Iguaçu - Setor Rural)')}
                      className="px-2.5 py-1 bg-white/20 hover:bg-white/30 text-white font-bold text-[11px] rounded transition-colors"
                    >
                      Simular Fazenda em Foz do Iguaçu
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Seletor de Propriedade Rural */}
            <div>
              <label className="block text-gray-300 font-bold mb-1 font-mono uppercase text-[11px] flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <TreePine className="w-3.5 h-3.5 text-[#f1c40f]" />
                  Propriedade Rural Cadastrada:
                </span>
                <button
                  type="button"
                  onClick={handleDetectGPS}
                  disabled={isGpsLoading}
                  className="text-[#f1c40f] hover:underline flex items-center gap-1 text-[10px] lowercase font-normal"
                >
                  <Navigation className={`w-3 h-3 ${isGpsLoading ? 'animate-spin' : ''}`} />
                  {isGpsLoading ? 'detectando gps...' : 'detectar via gps'}
                </button>
              </label>
              <select
                value={localizacao}
                onChange={(e) => {
                  setLocalizacao(e.target.value);
                  setCoordsCustom(null);
                }}
                className="w-full py-2 px-3 bg-[#0d141e] border border-[#2c3e50] rounded-lg text-white font-medium focus:outline-none focus:border-[#f1c40f]"
              >
                <optgroup label="🌾 Propriedades Rurais com Cobertura Ativa">
                  <option value="Propriedade Rural (Pitanga - Setor Rural)">
                    Fazenda / Linha Cantu (Pitanga - PR) - Cobertura Ativa
                  </option>
                  <option value="Propriedade Rural (Foz do Iguaçu - Setor Rural)">
                    Propriedade Rural Agro (Foz do Iguaçu - PR) - Cobertura Ativa
                  </option>
                  <option value="Propriedade Rural Parceira (Região Central)">
                    Propriedade Piloto EPT (Região Central - PR) - Cobertura Ativa
                  </option>
                </optgroup>
                <optgroup label="⚠️ Regiões Não Cobertas / Fora da Malha">
                  <option value="Propriedade Urbana / Outra Região (Sem Cobertura Ativa)">
                    Propriedade Urbana / Sem Cadastro Rural Ativo
                  </option>
                </optgroup>
              </select>
            </div>

            {/* Endereço / Ponto de Referência */}
            <div>
              <label className="block text-gray-300 font-bold mb-1 font-mono uppercase text-[11px] flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#f1c40f]" />
                Ponto de Referência ou Talhão / Estrada Rural:
              </label>
              <input
                type="text"
                value={endereco}
                onChange={(e) => setEndereco(e.target.value)}
                placeholder="Ex: Estrada Rural Linha Cantu, km 4 - Próximo ao silo"
                required
                className="w-full py-2 px-3 bg-[#0d141e] border border-[#2c3e50] rounded-lg text-white font-mono text-xs focus:outline-none focus:border-[#f1c40f]"
              />
            </div>

            {/* Tipo de Ocorrência & Urgência */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-300 font-bold mb-1 font-mono uppercase text-[11px]">
                  Tipo de Ocorrência Rural:
                </label>
                <select
                  value={tipoOcorrencia}
                  onChange={(e) => setTipoOcorrencia(e.target.value)}
                  className="w-full py-2 px-2.5 bg-[#0d141e] border border-[#2c3e50] rounded-lg text-white font-medium text-xs focus:outline-none focus:border-[#f1c40f]"
                >
                  <option value="Furto de Maquinário / Trator">🚜 Furto de Maquinário / Trator / Insumos</option>
                  <option value="Abigeato / Furto de Gado">🐂 Abigeato / Furto de Gado</option>
                  <option value="Foco de Queimada / Incêndio Florestal">🔥 Foco de Queimada / Incêndio em Palhada</option>
                  <option value="Invasão de Propriedade / Arrombamento">🚨 Invasão de Propriedade / Galpão</option>
                  <option value="Furto de Bicicleta / Veículo">🚲 Furto de Veículo / Motocicleta na Fazenda</option>
                  <option value="Atitude Suspeita em Estrada Rural">👁️ Atitude Suspeita em Estrada Rural</option>
                  <option value="Vandalismo ou Dano a Cercas">🧱 Vandalismo / Corte de Cercas</option>
                  <option value="Outro Incidente Rural">⚠️ Outro Incidente Rural</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1 font-mono uppercase text-[11px]">
                  Gravidade / Urgência:
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setUrgencia('alta')}
                    className={`py-1.5 rounded text-[11px] font-bold border transition-colors ${
                      urgencia === 'alta'
                        ? 'bg-red-600 border-red-400 text-white shadow-md'
                        : 'bg-[#0d141e] border-gray-700 text-gray-400 hover:text-white'
                    }`}
                  >
                    🚨 IMEDIATA
                  </button>
                  <button
                    type="button"
                    onClick={() => setUrgencia('media')}
                    className={`py-1.5 rounded text-[11px] font-bold border transition-colors ${
                      urgencia === 'media'
                        ? 'bg-amber-600 border-amber-400 text-white shadow-md'
                        : 'bg-[#0d141e] border-gray-700 text-gray-400 hover:text-white'
                    }`}
                  >
                    🟡 ALTA
                  </button>
                  <button
                    type="button"
                    onClick={() => setUrgencia('baixa')}
                    className={`py-1.5 rounded text-[11px] font-bold border transition-colors ${
                      urgencia === 'baixa'
                        ? 'bg-sky-600 border-sky-400 text-white shadow-md'
                        : 'bg-[#0d141e] border-gray-700 text-gray-400 hover:text-white'
                    }`}
                  >
                    🔵 MÉDIA
                  </button>
                </div>
              </div>
            </div>

            {/* Descrição Detalhada */}
            <div>
              <label className="block text-gray-300 font-bold mb-1 font-mono uppercase text-[11px]">
                Detalhes da Ocorrência (Características, Rumo de Fuga, Vestimentas):
              </label>
              <textarea
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                rows={2}
                placeholder="Ex: Homem de moletom preto cortou o cadeado da bicicleta aro 29 azul e seguiu em direção ao Bairro Industrial..."
                className="w-full py-2 px-3 bg-[#0d141e] border border-[#2c3e50] rounded-lg text-white font-mono text-xs focus:outline-none focus:border-[#f1c40f] resize-none"
              />
            </div>

            {/* Telemetria do Drone Mais Próximo para Interceptação */}
            {isElegivel && closestDrone && (
              <div className="bg-[#0e1622] p-3 rounded-lg border border-[#f1c40f]/60 flex items-center justify-between font-mono">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#f1c40f] text-black font-black flex items-center justify-center text-xs shadow-md">
                    {closestDrone.id}
                  </div>
                  <div>
                    <div className="text-white font-bold text-xs flex items-center gap-2">
                      <span>Drone Mais Próximo Identificado</span>
                      <span className="text-emerald-400 text-[10px]">● {closestDrone.status}</span>
                    </div>
                    <div className="text-gray-400 text-[11px]">
                      Distância estimada: <strong className="text-yellow-400">{distanceKm} km</strong> · Tempo de voo: <strong>~{Math.max(1, Math.round(distanceKm * 1.5))} min</strong>
                    </div>
                  </div>
                </div>
                <div className="text-right text-[10px] text-gray-400">
                  <div>Bateria: <span className="text-emerald-400 font-bold">{closestDrone.bateria.toFixed(0)}%</span></div>
                  <div>Sinal: <span className="text-white">{closestDrone.sinal}</span></div>
                </div>
              </div>
            )}

            {/* Botão de Envio */}
            <div className="pt-2 flex items-center justify-end gap-3 border-t border-gray-800">
              <button
                type="button"
                onClick={onClose}
                className="py-2.5 px-4 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold text-xs transition-colors"
              >
                CANCELAR
              </button>
              
              <button
                type="submit"
                disabled={!isElegivel}
                className={`py-2.5 px-5 rounded-lg font-black text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-lg ${
                  isElegivel
                    ? 'bg-[#f1c40f] hover:bg-yellow-400 active:scale-98 text-black cursor-pointer shadow-yellow-950/50'
                    : 'bg-gray-700 text-gray-400 cursor-not-allowed opacity-60'
                }`}
              >
                <Send className="w-4 h-4 stroke-[2.5]" />
                REDIRECIONAR DRONE IMEDIATAMENTE
              </button>
            </div>
          </form>
        </div>

        {/* Footer info note */}
        <div className="bg-[#0e1622] px-4 py-2 border-t border-gray-800 text-[10px] text-gray-500 font-mono flex items-center justify-between">
          <span>Pitanga & Foz do Iguaçu Integrados · Autenticação Cidadã Ativa</span>
          <span>Rede de Câmeras com IA em 60 FPS</span>
        </div>
      </div>
    </div>
  );
};
