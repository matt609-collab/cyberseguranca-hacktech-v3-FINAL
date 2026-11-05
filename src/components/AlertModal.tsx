import React from 'react';
import { Drone, AlertType } from '../types';
import { Flame, ShieldAlert, Siren, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';

interface AlertModalProps {
  drone: Drone;
  onDispatch: (agency: 'Bombeiros' | 'Polícia') => void;
  onDismiss: () => void;
}

export const AlertModal: React.FC<AlertModalProps> = ({
  drone,
  onDispatch,
  onDismiss,
}) => {
  const isFire = drone.tipoAlerta === 'fire';

  // Asset selection
  const fireImages = ['/gifs/drone_fire.jpg', '/gifs/drone_fire2.jpg'];
  const theftImages = ['/gifs/gtadrone.jpg', '/gifs/gtadrone2.gif'];

  const imageSrc = isFire
    ? fireImages[Math.floor(Math.random() * fireImages.length)]
    : theftImages[Math.floor(Math.random() * theftImages.length)];

  return (
    <div className="fixed inset-0 z-[3500] flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in zoom-in-95 duration-200">
      <div className="relative w-full max-w-lg bg-[#140a0a] border-2 border-red-500 rounded-xl shadow-[0_0_50px_rgba(231,76,60,0.5)] overflow-hidden flex flex-col text-[#ecf0f1]">
        
        {/* Urgent Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-red-950/80 border-b border-red-800">
          <div className="flex items-center gap-2 text-red-400">
            <span className="p-1 rounded bg-red-500/20 animate-pulse">
              {isFire ? <Flame className="w-5 h-5 text-orange-400" /> : <ShieldAlert className="w-5 h-5 text-red-500" />}
            </span>
            <h3 className="font-mono font-bold text-sm tracking-wider text-white">
              ALERTA DE SEGURANÇA: <span className="text-[#f1c40f]">{drone.id}</span>
            </h3>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-red-600/30 border border-red-500 text-red-400 text-[10px] font-mono font-bold">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
            AO VIVO
          </div>
        </div>

        {/* Live Feed with AI Bounding Box */}
        <div className="relative w-full h-64 bg-black overflow-hidden flex items-center justify-center border-b border-red-900/50">
          <img
            src={imageSrc}
            alt="Feed do Alerta"
            className="w-full h-full object-cover opacity-85"
          />

          {/* AI Detection Overlay Banner */}
          <div className="absolute top-4 inset-x-4 bg-black/85 backdrop-blur-md border border-[#f1c40f] p-3 rounded-lg text-center shadow-lg">
            <div className="flex items-center justify-center gap-2 text-xs font-mono font-bold text-[#f1c40f]">
              <AlertTriangle className="w-4 h-4 text-[#f1c40f] animate-bounce" />
              {isFire
                ? `SUSPEITA DE INCÊNDIO EM ${drone.local.toUpperCase()}`
                : `DETECÇÃO DE INVASÃO / FURTO EM ${drone.local.toUpperCase()}`}
            </div>
            <div className="text-[10px] text-gray-400 mt-0.5 font-mono">
              IA PITANGA V6 · Confiabilidade 98.4% · Câmera Térmica / Sensores Ativos
            </div>
          </div>

          {/* Dynamic AI Target Box */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="w-48 h-36 border-2 border-red-500 rounded flex flex-col justify-between p-1 bg-red-500/10 animate-pulse">
              <div className="flex justify-between text-[9px] font-mono font-bold text-red-300 bg-red-950/80 px-1 rounded">
                <span>{isFire ? 'FOCO TÉRMICO CRÍTICO' : 'OBJETO EM MOVIMENTO'}</span>
                <span>FLIR 256x192</span>
              </div>
              <div className="text-right text-[9px] font-mono text-yellow-300 font-bold bg-black/60 px-1">
                GPS: {drone.coords}
              </div>
            </div>
          </div>
        </div>

        {/* Content & Action Buttons */}
        <div className="p-5 space-y-4">
          <div className="flex items-center justify-between text-xs bg-[#1f1010] p-3 rounded-lg border border-red-950 font-mono">
            <div>
              <span className="text-gray-400">Drone Responsável: </span>
              <span className="text-white font-bold">{drone.id}</span>
            </div>
            <div>
              <span className="text-gray-400">Setor: </span>
              <span className="text-orange-400 font-bold">{drone.local}</span>
            </div>
            <div>
              <span className="text-gray-400">Bateria: </span>
              <span className="text-emerald-400 font-bold">{drone.bateria.toFixed(1)}%</span>
            </div>
          </div>

          {/* Urgent Dispatch Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => onDispatch('Bombeiros')}
              className="py-3 px-4 rounded-lg bg-orange-600 hover:bg-orange-700 active:scale-98 text-white font-bold text-xs flex items-center justify-center gap-2 transition-transform shadow-lg shadow-orange-950/60"
            >
              <Flame className="w-4 h-4 text-amber-200" />
              🚒 ACIONAR BOMBEIROS
            </button>
            <button
              onClick={() => onDispatch('Polícia')}
              className="py-3 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-bold text-xs flex items-center justify-center gap-2 transition-transform shadow-lg shadow-blue-950/60"
            >
              <Siren className="w-4 h-4 text-sky-200" />
              🚓 ACIONAR POLÍCIA
            </button>
          </div>

          {/* Dismiss button */}
          <button
            onClick={onDismiss}
            className="w-full py-2 px-4 rounded-lg bg-transparent hover:bg-white/5 border border-gray-700 text-gray-400 hover:text-gray-200 text-xs font-mono transition-colors"
          >
            DESCARTAR FALSO POSITIVO
          </button>
        </div>

      </div>
    </div>
  );
};
