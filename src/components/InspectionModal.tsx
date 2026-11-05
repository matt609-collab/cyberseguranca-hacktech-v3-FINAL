import React, { useState } from 'react';
import { Drone } from '../types';
import { X, Battery, Radio, MapPin, Compass, Eye, ShieldAlert, Cpu, Video, Maximize2 } from 'lucide-react';

interface InspectionModalProps {
  drone: Drone;
  onClose: () => void;
  onLand: (droneId: string) => void;
}

export const InspectionModal: React.FC<InspectionModalProps> = ({
  drone,
  onClose,
  onLand,
}) => {
  const [cameraMode, setCameraMode] = useState<'rgb' | 'flir' | 'ir'>('ir');
  const [isZoomed, setIsZoomed] = useState(false);

  // Fallback random gif lists from user code
  const randomGifs = [
    '/gifs/done_flying.gif',
    '/gifs/drone_aura.gif',
    '/gifs/drone_extreme.gif',
    '/gifs/evil_drone.gif',
  ];

  // Pick stable index from drone ID
  const numIndex = parseInt(drone.id.replace(/\D/g, '') || '1', 10) % randomGifs.length;
  const feedSrc = randomGifs[numIndex];

  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-[#111822] border-2 border-[#f1c40f] rounded-xl shadow-2xl overflow-hidden flex flex-col text-[#ecf0f1]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-[#172330] border-b border-[#2d3f52]">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-[#f1c40f]/20 text-[#f1c40f]">
              <Eye className="w-5 h-5" />
            </span>
            <h3 className="font-mono font-bold text-base tracking-wider text-[#f1c40f]">
              INSPEÇÃO TÁTICA: {drone.id}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Camera Feed with Tactical HUD */}
        <div className="relative w-full h-64 bg-black overflow-hidden flex items-center justify-center border-b border-[#2d3f52]">
          {/* Base Feed / Simulated Media */}
          <img
            src={feedSrc}
            alt={`Feed ao vivo ${drone.id}`}
            className={`w-full h-full object-cover transition-all duration-300 ${
              cameraMode === 'flir'
                ? 'contrast-150 saturate-200 hue-rotate-60 filter'
                : cameraMode === 'ir'
                ? 'brightness-110 contrast-125'
                : 'saturate-125'
            } ${isZoomed ? 'scale-125' : 'scale-100'}`}
          />

          {/* Live Badge Overlay */}
          <div className="absolute top-3 left-3 flex items-center gap-2 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded text-xs border border-white/10">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            <span className="font-mono font-bold text-red-400 text-[11px] tracking-wider">AO VIVO</span>
            <span className="text-gray-400 text-[10px]">1080p 60fps</span>
          </div>

          {/* Mode Switcher on top right */}
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/70 backdrop-blur-md p-1 rounded-lg border border-white/15">
            <button
              onClick={() => setCameraMode('ir')}
              className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-colors ${
                cameraMode === 'ir' ? 'bg-emerald-500 text-black' : 'text-gray-300 hover:text-white'
              }`}
            >
              IR NOITE
            </button>
            <button
              onClick={() => setCameraMode('flir')}
              className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-colors ${
                cameraMode === 'flir' ? 'bg-[#f1c40f] text-black' : 'text-gray-300 hover:text-white'
              }`}
            >
              FLIR TÉRMICO
            </button>
            <button
              onClick={() => setCameraMode('rgb')}
              className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-colors ${
                cameraMode === 'rgb' ? 'bg-sky-500 text-black' : 'text-gray-300 hover:text-white'
              }`}
            >
              RGB ÓPTICO
            </button>
            <button
              onClick={() => setIsZoomed(!isZoomed)}
              className="p-1 rounded text-gray-300 hover:text-white hover:bg-white/10"
              title="Alternar Zoom Óptico 2x"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Reticle / Crosshair HUD */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="relative w-28 h-28 border border-white/30 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
              <div className="absolute w-full h-[1px] bg-white/20"></div>
              <div className="absolute h-full w-[1px] bg-white/20"></div>
              {/* Corner brackets */}
              <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-[#f1c40f]"></div>
              <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-[#f1c40f]"></div>
              <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-[#f1c40f]"></div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-[#f1c40f]"></div>
            </div>
          </div>

          {/* Bottom Feed Telemetry HUD */}
          <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[11px] font-mono bg-black/70 px-3 py-1 rounded border border-white/10 text-gray-300">
            <span>SETOR: {drone.local.toUpperCase()}</span>
            <span>ALT: {drone.altitude || 124}m</span>
            <span>VEL: {drone.velocidade || 38} km/h</span>
            <span>GIMBAL: -32°</span>
          </div>
        </div>

        {/* Detailed Telemetry Grid */}
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-[#182330] p-3 rounded-lg border border-[#2d3f52] flex items-center gap-3">
              <div className="p-2 rounded bg-amber-400/10 text-[#f1c40f]">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] text-gray-400 uppercase font-mono">Localização</div>
                <div className="font-semibold text-white">{drone.local} (Pitanga)</div>
              </div>
            </div>

            <div className="bg-[#182330] p-3 rounded-lg border border-[#2d3f52] flex items-center gap-3">
              <div className="p-2 rounded bg-sky-400/10 text-sky-400">
                <Compass className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] text-gray-400 uppercase font-mono">Coordenadas GPS</div>
                <div className="font-mono text-[11px] text-gray-300">{drone.coords}</div>
              </div>
            </div>

            <div className="bg-[#182330] p-3 rounded-lg border border-[#2d3f52] flex items-center gap-3">
              <div className="p-2 rounded bg-emerald-400/10 text-emerald-400">
                <Battery className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] text-gray-400 uppercase font-mono">Bateria LiFePO4</div>
                <div className="font-semibold text-emerald-400">{drone.bateria.toFixed(1)}%</div>
              </div>
            </div>

            <div className="bg-[#182330] p-3 rounded-lg border border-[#2d3f52] flex items-center gap-3">
              <div className="p-2 rounded bg-purple-400/10 text-purple-400">
                <Radio className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] text-gray-400 uppercase font-mono">Link Telemetria</div>
                <div className="font-semibold text-white">{drone.sinal} (99.8% Sinal)</div>
              </div>
            </div>
          </div>

          {/* Subsystems Status */}
          <div className="bg-[#0f1722] p-3 rounded-lg border border-[#26374a] text-[11px] space-y-1.5 font-mono">
            <div className="flex justify-between text-gray-400">
              <span>Módulo Fotovoltaico Resun 100W:</span>
              <span className="text-emerald-400 font-bold">GERANDO 88W</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Controlador Epower MPPT:</span>
              <span className="text-emerald-400">14.4V / 6.1A (ABSORÇÃO)</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Sensor DS18B20 Chassis:</span>
              <span className="text-amber-400">28.7°C (NORMAL)</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => onLand(drone.id)}
              className="flex-1 py-2.5 px-4 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-lg shadow-red-950/50"
            >
              <ShieldAlert className="w-4 h-4" />
              POUSAR DRONE DE IMEDIATO
            </button>
            <button
              onClick={onClose}
              className="py-2.5 px-6 rounded-lg bg-[#273748] hover:bg-[#34495e] text-gray-200 font-semibold text-xs transition-colors"
            >
              FECHAR
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
