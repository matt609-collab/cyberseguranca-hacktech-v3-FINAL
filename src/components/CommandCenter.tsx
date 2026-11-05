import React, { useState, useEffect } from 'react';
import { Drone, LogEntry, PhysicalReport } from '../types';
import { CommandMap } from './CommandMap';
import { InspectionModal } from './InspectionModal';
import { AlertModal } from './AlertModal';
import { DenunciaFisicaModal } from './DenunciaFisicaModal';
import { soundFx } from '../utils/audio';
import {
  Plus,
  CloudSun,
  CloudRain,
  Radio,
  Battery,
  AlertTriangle,
  Flame,
  Shield,
  Layers,
  Users,
  CreditCard,
  LogOut,
  Maximize2,
  Volume2,
  VolumeX,
  ShieldAlert,
  Target,
  CheckCircle2,
} from 'lucide-react';

interface CommandCenterProps {
  onNavigate: (page: 'command' | 'plans' | 'credits' | 'login') => void;
  onLogout: () => void;
}

const PITANGA_LOCAIS = ['Centro', 'Vila Planalto', 'Vila Nova', 'Jardim Europa', 'Bairro Industrial'];

export const CommandCenter: React.FC<CommandCenterProps> = ({ onNavigate, onLogout }) => {
  // Drones state
  const [drones, setDrones] = useState<Drone[]>([
    { id: 'VAI-01', bateria: 95, status: 'ON-LINE', local: 'Centro', sinal: '5G', coords: '-24.7572, -51.7600', lat: -24.7572, lng: -51.7600, altitude: 124, velocidade: 36 },
    { id: 'VAI-02', bateria: 88, status: 'ON-LINE', local: 'Vila Nova', sinal: 'Satélite', coords: '-24.7610, -51.7520', lat: -24.7610, lng: -51.7520, altitude: 140, velocidade: 42 },
    { id: 'VAI-03', bateria: 92, status: 'ON-LINE', local: 'Vila Planalto', sinal: '5G', coords: '-24.7490, -51.7680', lat: -24.7490, lng: -51.7680, altitude: 110, velocidade: 30 },
    { id: 'VAI-04', bateria: 75, status: 'ON-LINE', local: 'Bairro Industrial', sinal: 'Rádio', coords: '-24.7700, -51.7400', lat: -24.7700, lng: -51.7400, altitude: 155, velocidade: 48 },
  ]);

  // Logs state
  const [logs, setLogs] = useState<LogEntry[]>([
    { id: '1', hora: '12:00', drone: 'VAI-01', evento: 'Patrulha Iniciada em Centro', status: 'OPERACIONAL', tipo: 'info' },
    { id: '2', hora: '11:45', drone: 'VAI-03', evento: 'Telemetria 5G Conectada', status: 'OK', tipo: 'info' },
    { id: '3', hora: '11:20', drone: 'VAI-02', evento: 'Carga Solar Ativa (Resun 100W)', status: 'CARREGANDO', tipo: 'success' },
  ]);

  // Weather state
  const [isCloudy, setIsCloudy] = useState<boolean>(false);
  const [rainAmount, setRainAmount] = useState<number>(0.0);

  // Modals state
  const [droneInInspection, setDroneInInspection] = useState<Drone | null>(null);
  const [droneInAlert, setDroneInAlert] = useState<Drone | null>(null);
  const [isDenunciaModalOpen, setIsDenunciaModalOpen] = useState<boolean>(false);
  const [activeReports, setActiveReports] = useState<PhysicalReport[]>([]);

  // Physical Report Dispatch Handler
  const handleReportCreated = (report: PhysicalReport) => {
    setActiveReports((prev) => [report, ...prev]);

    // Update assigned drone's route and status
    setDrones((prev) =>
      prev.map((d) => {
        if (d.id === report.assignedDroneId) {
          return {
            ...d,
            status: 'EM_ROTA_DENUNCIA',
            tipoAlerta: 'denuncia',
            waypointDestino: {
              lat: report.lat,
              lng: report.lng,
              local: report.endereco,
              tipo: report.tipo,
              reportId: report.id,
            },
          };
        }
        return d;
      })
    );

    // Register log
    registrarLog(
      report.assignedDroneId,
      `🚨 Denúncia Física [${report.tipo}] em ${report.endereco} (${report.municipio}) - Re-roteado`,
      'INTERCEPTANDO',
      'alert'
    );

    // Visual & audio accessibility alert
    const msgAlerta = `DENÚNCIA FÍSICA RECEBIDA: Drone ${report.assignedDroneId} redirecionado imediatamente para ${report.endereco} (${report.municipio})`;
    (window as unknown as { dispararAlertaVisual?: (s: string) => void }).dispararAlertaVisual?.(msgAlerta);
    (window as unknown as { avisarLeitorDeTela?: (s: string) => void }).avisarLeitorDeTela?.(
      `Denúncia física registrada com sucesso. Drone ${report.assignedDroneId} redirecionado imediatamente.`
    );
  };

  // Finalizar investigação de denúncia física
  const finalizarDenuncia = (reportId: string, droneId: string) => {
    soundFx.playClick();
    setActiveReports((prev) => prev.filter((r) => r.id !== reportId));
    setDrones((prev) =>
      prev.map((d) => {
        if (d.id === droneId) {
          return {
            ...d,
            status: 'ON-LINE',
            tipoAlerta: undefined,
            waypointDestino: undefined,
          };
        }
        return d;
      })
    );
    registrarLog(droneId, `Denúncia ${reportId} Concluída - Drone Retomou Patrulha Padrão`, 'OPERACIONAL', 'success');
    (window as unknown as { avisarLeitorDeTela?: (s: string) => void }).avisarLeitorDeTela?.(
      `Ocorrência de denúncia física concluída. Drone ${droneId} em patrulha normal.`
    );
  };

  // Audio muted state
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Sound toggle
  const toggleSound = () => {
    const next = !isMuted;
    setIsMuted(next);
    soundFx.setMuted(next);
  };

  const registrarLog = (droneId: string, acao: string, status: string, tipo: LogEntry['tipo'] = 'info') => {
    const timeStr = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const newEntry: LogEntry = {
      id: Date.now().toString(),
      hora: timeStr,
      drone: droneId,
      evento: acao,
      status: status,
      tipo: tipo,
    };
    setLogs((prev) => [newEntry, ...prev.slice(0, 49)]);
  };

  // Add new drone
  const adicionarDrone = () => {
    soundFx.playClick();
    const nextNum = drones.length + 1;
    const novoId = `VAI-${nextNum.toString().padStart(2, '0')}`;
    const latOffset = (Math.random() - 0.5) * 0.035;
    const lngOffset = (Math.random() - 0.5) * 0.035;
    const lat = Number((-24.7572 + latOffset).toFixed(4));
    const lng = Number((-51.7600 + lngOffset).toFixed(4));
    const local = PITANGA_LOCAIS[Math.floor(Math.random() * PITANGA_LOCAIS.length)];
    const sinais: ('5G' | 'Satélite' | 'Rádio')[] = ['5G', 'Satélite', 'Rádio'];
    const sinal = sinais[Math.floor(Math.random() * sinais.length)];

    const novoDrone: Drone = {
      id: novoId,
      bateria: 100,
      status: 'ON-LINE',
      local,
      sinal,
      coords: `${lat}, ${lng}`,
      lat,
      lng,
      altitude: Math.floor(Math.random() * 40 + 100),
      velocidade: Math.floor(Math.random() * 20 + 30),
    };

    setDrones((prev) => [...prev, novoDrone]);
    registrarLog(novoId, 'Drone Inicializado em ' + local, 'OK', 'info');
  };

  // Manual Land Drone
  const pousarDrone = (droneId: string) => {
    soundFx.playClick();
    setDrones((prev) =>
      prev.map((d) => (d.id === droneId ? { ...d, status: 'OFF-LINE' } : d))
    );
    registrarLog(droneId, 'Pouso Solicitado pelo Operador', 'SOLO', 'warn');
    if (droneInInspection?.id === droneId) {
      setDroneInInspection(null);
    }
  };

  // Emergency landing sequence when battery <= 18%
  const iniciarPousoEmergencia = (drone: Drone) => {
    soundFx.playAlertBeep();
    setDrones((prev) =>
      prev.map((d) => (d.id === drone.id ? { ...d, status: 'POUSANDO' } : d))
    );

    const alertMsg = `BATERIA CRÍTICA: DRONE ${drone.id} (${drone.bateria.toFixed(1)}%) - RETORNO AUTOMÁTICO EM CURSO`;
    (window as unknown as { dispararAlertaVisual?: (s: string) => void }).dispararAlertaVisual?.(alertMsg);

    registrarLog(drone.id, `Bateria Baixa (${drone.bateria.toFixed(1)}%)`, 'RETORNO AUTOMÁTICO', 'alert');

    // After 5s, complete landing
    setTimeout(() => {
      setDrones((prev) =>
        prev.map((d) => (d.id === drone.id ? { ...d, status: 'OFF-LINE' } : d))
      );
      registrarLog(drone.id, 'Pouso de Emergência Concluído na Base Central', 'SOLO', 'warn');
      (window as unknown as { avisarLeitorDeTela?: (s: string) => void }).avisarLeitorDeTela?.(`Drone ${drone.id} pousou em solo com segurança`);
    }, 5000);
  };

  // Dispatch Security / Fire agency
  const despachar = (orgao: 'Bombeiros' | 'Polícia') => {
    if (!droneInAlert) return;
    soundFx.playDispatchSuccess();
    const id = droneInAlert.id;
    const local = droneInAlert.local;

    registrarLog(id, `Despacho de Emergência: ${orgao} enviado para ${local}`, 'EM CURSO', 'alert');

    // Restore drone to online
    setDrones((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: 'ON-LINE', tipoAlerta: undefined } : d))
    );
    setDroneInAlert(null);
  };

  // Dismiss alert as false positive
  const descartarAlerta = () => {
    soundFx.playClick();
    if (!droneInAlert) return;
    const id = droneInAlert.id;
    registrarLog(id, 'Alerta Descartado como Falso Positivo', 'RESOLVIDO', 'info');
    setDrones((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: 'ON-LINE', tipoAlerta: undefined } : d))
    );
    setDroneInAlert(null);
  };

  // Simulation lifecycle loop (every 3 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      // Weather update
      const cloudy = Math.random() < 0.28;
      setIsCloudy(cloudy);
      setRainAmount(cloudy ? Number((Math.random() * 3.8).toFixed(1)) : 0.0);

      setDrones((currentDrones) => {
        return currentDrones.map((d) => {
          if (d.status !== 'OFF-LINE' && d.status !== 'POUSANDO') {
            // Solar charging effect from Resun 100W panel during sunny weather!
            const solarBonus = !cloudy ? 0.35 : 0.05;
            const drainRate = (Math.random() * 1.8 + 0.5) * (cloudy ? 1.3 : 1.0);
            let nextBat = d.bateria - drainRate + solarBonus;
            if (nextBat > 100) nextBat = 100;
            if (nextBat < 0) nextBat = 0;

            // Check if drone has a physical report waypoint to intercept
            if (d.waypointDestino) {
              const dLat = d.waypointDestino.lat - d.lat;
              const dLng = d.waypointDestino.lng - d.lng;
              const dist = Math.sqrt(dLat * dLat + dLng * dLng);

              if (dist > 0.001) {
                // Fly towards target waypoint at rapid interception speed
                const step = 0.0015;
                const nextLat = Number((d.lat + (dLat / dist) * Math.min(dist, step)).toFixed(4));
                const nextLng = Number((d.lng + (dLng / dist) * Math.min(dist, step)).toFixed(4));
                return {
                  ...d,
                  bateria: nextBat,
                  lat: nextLat,
                  lng: nextLng,
                  coords: `${nextLat}, ${nextLng}`,
                  velocidade: 52,
                };
              } else {
                // Arrived at incident location
                return {
                  ...d,
                  bateria: nextBat,
                  local: d.waypointDestino.local,
                  status: 'ALERTA',
                  tipoAlerta: 'denuncia',
                  velocidade: 14,
                };
              }
            }

            // Micro-position changes to simulate drone patrolling
            const latShift = (Math.random() - 0.5) * 0.0006;
            const lngShift = (Math.random() - 0.5) * 0.0006;
            const nextLat = Number((d.lat + latShift).toFixed(4));
            const nextLng = Number((d.lng + lngShift).toFixed(4));

            const updatedDrone = {
              ...d,
              bateria: nextBat,
              lat: nextLat,
              lng: nextLng,
              coords: `${nextLat}, ${nextLng}`,
            };

            // Trigger emergency return if battery <= 18%
            if (nextBat <= 18 && d.status === 'ON-LINE') {
              setTimeout(() => iniciarPousoEmergencia(updatedDrone), 10);
            }

            return updatedDrone;
          }
          return d;
        });
      });

      // Random alert trigger (approx 12% probability)
      if (Math.random() < 0.12) {
        setDrones((currentDrones) => {
          const availableDrones = currentDrones.filter((d) => d.status === 'ON-LINE');
          if (availableDrones.length > 0 && !droneInAlert) {
            const victim = availableDrones[Math.floor(Math.random() * availableDrones.length)];
            const alertKind = Math.random() < 0.5 ? 'fire' : 'theft';
            soundFx.playAlertBeep();

            const alertTitle = alertKind === 'fire' ? `INCÊNDIO NO SETOR ${victim.local.toUpperCase()}` : `INVASÃO / FURTO NO SETOR ${victim.local.toUpperCase()}`;
            (window as unknown as { dispararAlertaVisual?: (s: string) => void }).dispararAlertaVisual?.(`${alertTitle} (DRONE ${victim.id})`);

            registrarLog(
              victim.id,
              alertKind === 'fire' ? `🔥 Detecção Térmica de Fogo em ${victim.local}` : `🚨 Suspeita de Furto/Invasão em ${victim.local}`,
              'ALERTA CRÍTICO',
              'alert'
            );

            return currentDrones.map((d) =>
              d.id === victim.id ? { ...d, status: 'ALERTA', tipoAlerta: alertKind } : d
            );
          }
          return currentDrones;
        });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [droneInAlert]);

  // Teclado: fechar modais com Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setDroneInInspection(null);
        setDroneInAlert(null);
        setIsDenunciaModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const activeCellsCount = drones.filter((d) => d.status !== 'OFF-LINE').length;
  const alertDrones = drones.filter((d) => d.status === 'ALERTA');

  return (
    <div className="w-full h-screen grid grid-cols-[280px_1fr_340px] bg-[#12161c] text-[#ecf0f1] overflow-hidden select-none">
      
      {/* SIDEBAR LEFT */}
      <aside className="bg-[#1b2633] p-4 border-r border-[#2c3e50] flex flex-col gap-3.5 overflow-y-auto">
        {/* Brand Header */}
        <div className="bg-[#f1c40f] text-black py-2.5 px-3 rounded-md text-center font-black text-xl tracking-wider shadow-md">
          VAI PITANGA
        </div>

        {/* Action Button: FAZER DENÚNCIA FÍSICA */}
        <button
          onClick={() => setIsDenunciaModalOpen(true)}
          className="w-full py-2.5 px-3 rounded-lg bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:to-amber-500 active:scale-98 text-white font-black text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-950/60 border border-yellow-400/50 uppercase tracking-wider group"
          title="Fazer denúncia física com despacho do drone mais próximo"
        >
          <ShieldAlert className="w-4 h-4 text-yellow-300 animate-pulse group-hover:scale-110 transition-transform" />
          <span>🚨 DENÚNCIA FÍSICA</span>
        </button>

        {/* System Central Status */}
        <div className="bg-black/35 p-3 rounded-lg border-l-4 border-[#27ae60] text-xs leading-relaxed">
          <div className="flex items-center justify-between mb-1">
            <span className="font-bold flex items-center gap-1.5 text-white">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              SISTEMA CENTRAL
            </span>
            <span className="text-[10px] text-emerald-400 font-mono font-bold">OPERACIONAL</span>
          </div>
          <div className="text-gray-300 font-mono text-[11px] space-y-0.5">
            <div>Células Ativas: <span className="text-emerald-400 font-bold">{activeCellsCount.toString().padStart(2, '0')}</span> / {drones.length.toString().padStart(2, '0')}</div>
            <div>Frequência Central: <span className="text-gray-200">5.8 GHz Telemetria</span></div>
            <div>Servidor Pitanga: <span className="text-gray-200">Latência 12ms</span></div>
          </div>
        </div>

        {/* Weather Card */}
        <div className="bg-gradient-to-br from-[#1e3c72] to-[#2a5298] p-3.5 rounded-lg text-xs border-l-4 border-[#f1c40f] shadow-md">
          <div className="flex items-center justify-between font-bold text-white mb-1">
            <span>CLIMA PITANGA - PR</span>
            {isCloudy ? <CloudRain className="w-4 h-4 text-sky-300" /> : <CloudSun className="w-4 h-4 text-[#f1c40f]" />}
          </div>
          <div className="font-mono text-sm font-bold text-sky-200">
            {isCloudy ? 'NUBLADO COM PANCADAS' : 'ENSOLARADO E LÍMPIDO'}
          </div>
          <div className="mt-2 pt-2 border-t border-white/10 flex justify-between items-center text-[11px]">
            <span className="text-gray-200">🌧️ PREVISÃO:</span>
            <span className="font-bold text-[#f1c40f] font-mono">{rainAmount.toFixed(1)} mm</span>
          </div>
          <div className="flex justify-between items-center text-[10px] text-sky-100 font-mono mt-1">
            <span>☀️ Carga Solar Resun:</span>
            <span className={isCloudy ? 'text-amber-300' : 'text-emerald-300'}>
              {isCloudy ? '35 W/m² (Média)' : '92 W/m² (Ideal)'}
            </span>
          </div>
        </div>

        {/* Ocorrências Recentes */}
        <div className="bg-black/35 p-3 rounded-lg border border-[#2c3e50] flex-1 flex flex-col overflow-hidden">
          <div className="text-xs font-bold text-[#f1c40f] uppercase tracking-wider mb-2 border-b border-gray-700 pb-1 flex items-center justify-between">
            <span>Ocorrências Recentes</span>
            <span className="text-[10px] text-gray-400 font-mono">{alertDrones.length + activeReports.length} ativas</span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1 text-xs">
            {alertDrones.length === 0 && activeReports.length === 0 && (
              <div className="text-gray-400 italic text-[11px] py-4 text-center">
                Aguardando detecção de sensores...
              </div>
            )}

            {/* Active Citizen Physical Complaints */}
            {activeReports.map((report) => (
              <div
                key={report.id}
                className="bg-amber-950/70 border-2 border-yellow-400 p-2 rounded-lg text-xs space-y-1 shadow-md shadow-amber-950/40 animate-pulse"
              >
                <div className="flex items-center justify-between text-yellow-300 font-bold text-[11px]">
                  <span className="flex items-center gap-1">
                    <Target className="w-3.5 h-3.5 text-red-400" />
                    🎯 {report.tipo}
                  </span>
                  <span className="text-[9px] bg-yellow-400 text-black font-black px-1.5 py-0.5 rounded">
                    {report.assignedDroneId}
                  </span>
                </div>
                <div className="text-[10px] text-gray-200 truncate">
                  📍 {report.endereco} ({report.municipio})
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-yellow-500/30">
                  <span className="text-[9px] text-yellow-300 font-mono">
                    Dist: {report.distanciaKm} km · {report.timestamp}
                  </span>
                  <button
                    onClick={() => finalizarDenuncia(report.id, report.assignedDroneId)}
                    className="text-[9px] bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-1.5 py-0.5 rounded transition-colors"
                  >
                    CONCLUIR
                  </button>
                </div>
              </div>
            ))}

            {alertDrones.map((drone) => (
              <div
                key={drone.id}
                onClick={() => setDroneInAlert(drone)}
                className="bg-red-950/60 border border-red-500/70 p-2 rounded cursor-pointer hover:bg-red-900/60 transition-colors animate-pulse"
              >
                <div className="flex items-center justify-between text-red-400 font-bold text-[11px]">
                  <span>
                    {drone.tipoAlerta === 'fire' ? '🔥 INCÊNDIO' : drone.tipoAlerta === 'denuncia' ? '🎯 DENÚNCIA' : '🚨 SUSPEITA FURTO'}: {drone.id}
                  </span>
                  <span className="text-[9px] bg-red-600 text-white px-1 rounded">VER</span>
                </div>
                <div className="text-[10px] text-gray-300 mt-0.5">
                  {drone.local} · Clique para despachar socorro
                </div>
              </div>
            ))}

            {/* Resolved or historical log snippets */}
            {logs
              .filter((l) => l.tipo === 'alert' || l.status === 'RETORNO AUTOMÁTICO')
              .slice(0, 4)
              .map((l) => (
                <div key={l.id} className="border-b border-gray-800 pb-1.5 text-[10px] text-gray-400 font-mono">
                  <span className="text-gray-500">[{l.hora}]</span> {l.evento}
                </div>
              ))}
          </div>
        </div>

        {/* Sidebar Left Bottom Nav Links */}
        <div className="mt-auto flex flex-col gap-2 pt-2 border-t border-[#2c3e50]">
          <div className="flex items-center justify-between px-1">
            <span className="text-[10px] text-gray-400 font-mono">SOM TÁTICO</span>
            <button
              onClick={toggleSound}
              className={`p-1.5 rounded text-xs flex items-center gap-1.5 transition-colors ${
                isMuted ? 'text-gray-500 bg-black/30' : 'text-[#f1c40f] bg-[#f1c40f]/15'
              }`}
              title={isMuted ? 'Ativar Efeitos Sonoros' : 'Silenciar'}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              <span className="text-[10px] font-mono">{isMuted ? 'Mudo' : 'Ativo'}</span>
            </button>
          </div>

          <button
            onClick={() => onNavigate('credits')}
            className="w-full py-2 px-3 rounded-md bg-[#f1c40f] hover:bg-yellow-400 text-black font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            <Users className="w-4 h-4" />
            EQUIPE E ESPECIFICAÇÕES
          </button>
          <button
            onClick={() => onNavigate('plans')}
            className="w-full py-2 px-3 rounded-md bg-[#27ae60] hover:bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            <CreditCard className="w-4 h-4" />
            PLANOS E ASSINATURA
          </button>
          <button
            onClick={onLogout}
            className="w-full py-1.5 px-3 rounded-md bg-transparent hover:bg-red-500/20 text-gray-400 hover:text-red-300 font-mono text-[11px] flex items-center justify-center gap-1.5 transition-colors"
          >
            <LogOut className="w-3 h-3" />
            DESCONECTAR
          </button>
        </div>
      </aside>

      {/* CENTER - MAP & TELEMETRY LOGS */}
      <main id="map-container" tabIndex={-1} className="flex flex-col h-full overflow-hidden bg-[#0e141b] focus:outline-none">
        {/* Leaflet Map */}
        <div className="flex-1 relative w-full overflow-hidden">
          <CommandMap
            drones={drones}
            selectedDroneId={droneInInspection?.id}
            onSelectDrone={(droneId) => {
              const d = drones.find((item) => item.id === droneId);
              if (d) setDroneInInspection(d);
            }}
            onOpenAlert={(droneId) => {
              const d = drones.find((item) => item.id === droneId);
              if (d) setDroneInAlert(d);
            }}
            onOpenDenuncia={() => setIsDenunciaModalOpen(true)}
          />
        </div>

        {/* Bottom Realtime Logs Table */}
        <div className="h-44 bg-[#1b2633] border-t-2 border-[#f1c40f] p-3 flex flex-col text-xs font-mono overflow-hidden">
          <div className="flex items-center justify-between pb-2 border-b border-gray-700 mb-2">
            <span className="font-bold text-[#f1c40f] flex items-center gap-1.5 uppercase text-[11px]">
              <Layers className="w-3.5 h-3.5" />
              Logs de Telemetria e Eventos em Tempo Real
            </span>
            <span className="text-[10px] text-gray-400">Pitanga Central v6.0</span>
          </div>

          <div className="flex-1 overflow-y-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-gray-400 border-b border-gray-800 text-[11px]">
                  <th className="py-1 px-2 font-semibold">Hora</th>
                  <th className="py-1 px-2 font-semibold">Drone</th>
                  <th className="py-1 px-2 font-semibold">Evento</th>
                  <th className="py-1 px-2 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => {
                  let statusColor = 'text-emerald-400';
                  if (log.status === 'SOLO' || log.status === 'OFF-LINE') statusColor = 'text-gray-400';
                  if (log.status.includes('RETORNO') || log.tipo === 'alert') statusColor = 'text-red-400 font-bold';
                  if (log.status === 'EM CURSO') statusColor = 'text-amber-400 font-bold';

                  return (
                    <tr key={log.id} className="border-b border-gray-800/60 hover:bg-white/5 transition-colors text-[11px]">
                      <td className="py-1 px-2 text-gray-400">{log.hora}</td>
                      <td className="py-1 px-2 text-[#f1c40f] font-bold">{log.drone}</td>
                      <td className="py-1 px-2 text-gray-200">{log.evento}</td>
                      <td className={`py-1 px-2 ${statusColor}`}>{log.status}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* FLEET PANEL (RIGHT) */}
      <aside className="bg-[#1b2633] p-4 border-l border-[#2c3e50] flex flex-col gap-3 overflow-y-auto">
        <div className="text-xs font-bold text-[#f1c40f] uppercase tracking-wider border-b border-gray-700 pb-2">
          Monitoramento de Frota
        </div>

        {/* Add Drone Button */}
        <button
          onClick={adicionarDrone}
          className="w-full py-2.5 px-3 rounded-md bg-[#f1c40f] hover:bg-yellow-400 text-black font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-md"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          ADICIONAR NOVO DRONE
        </button>

        {/* Drones List */}
        <div className="flex-1 space-y-3 overflow-y-auto pr-0.5">
          {drones.map((d) => {
            const isOffline = d.status === 'OFF-LINE';
            const isLanding = d.status === 'POUSANDO';
            const isAlert = d.status === 'ALERTA';

            let statusCor = '#27ae60';
            if (isOffline) statusCor = '#7f8c8d';
            if (isLanding || isAlert) statusCor = '#e74c3c';

            return (
              <div
                key={d.id}
                onClick={() => {
                  if (isAlert) setDroneInAlert(d);
                }}
                className={`bg-[#111822] border rounded-lg p-3 transition-all relative ${
                  isAlert
                    ? 'border-red-500 bg-red-950/30 animate-pulse cursor-pointer shadow-lg shadow-red-950/50'
                    : isOffline
                    ? 'border-gray-800 opacity-60 grayscale'
                    : 'border-gray-700 hover:border-gray-500'
                }`}
                style={{ borderLeftWidth: '4px', borderLeftColor: statusCor }}
              >
                <div className="flex justify-between items-center text-xs">
                  <strong className="text-white font-mono font-bold">{d.id}</strong>
                  <span style={{ color: statusCor }} className="font-mono text-[10px] font-bold">
                    {d.status}
                  </span>
                </div>

                {/* Battery Bar */}
                <div className="w-full h-1.5 bg-[#2c3e50] rounded-full my-2 overflow-hidden">
                  <div
                    className="h-full transition-all duration-700 rounded-full"
                    style={{
                      width: `${d.bateria}%`,
                      backgroundColor: d.bateria < 20 ? '#e74c3c' : '#27ae60',
                    }}
                  />
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-1.5 text-[10px] text-gray-400 font-mono mt-1">
                  <span>📍 {d.local}</span>
                  <span>📡 {d.sinal}</span>
                  <span>
                    🔋 Reserva: <span className="text-white font-bold">{d.bateria.toFixed(1)}%</span>
                  </span>

                  {!isOffline && !isLanding && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        soundFx.playClick();
                        setDroneInInspection(d);
                      }}
                      className="py-0.5 px-1.5 rounded bg-[#f1c40f] hover:bg-yellow-400 text-black font-bold text-[9px] uppercase transition-colors"
                    >
                      🔍 INSPECIONAR
                    </button>
                  )}

                  {isLanding && (
                    <span className="text-red-400 font-bold animate-pulse">
                      RETORNANDO...
                    </span>
                  )}

                  {isOffline && (
                    <div className="flex gap-1 items-center">
                      <span className="text-gray-400">EM SOLO</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          // Relaunch drone
                          soundFx.playClick();
                          setDrones((prev) =>
                            prev.map((item) =>
                              item.id === d.id ? { ...item, status: 'ON-LINE', bateria: 100 } : item
                            )
                          );
                          registrarLog(d.id, 'Drone Recarregado e Lançado', 'ON-LINE', 'success');
                        }}
                        className="text-[9px] bg-emerald-600 hover:bg-emerald-500 text-white px-1 rounded"
                      >
                        REATIVAR
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </aside>

      {/* INSPECTION MODAL */}
      {droneInInspection && (
        <InspectionModal
          drone={droneInInspection}
          onClose={() => setDroneInInspection(null)}
          onLand={(droneId) => pousarDrone(droneId)}
        />
      )}

      {/* ALERT MODAL */}
      {droneInAlert && (
        <AlertModal
          drone={droneInAlert}
          onDispatch={(agency) => despachar(agency)}
          onDismiss={descartarAlerta}
        />
      )}

      {/* DENÚNCIA FÍSICA MODAL */}
      {isDenunciaModalOpen && (
        <DenunciaFisicaModal
          drones={drones}
          onClose={() => setIsDenunciaModalOpen(false)}
          onSubmitReport={handleReportCreated}
        />
      )}
    </div>
  );
};
