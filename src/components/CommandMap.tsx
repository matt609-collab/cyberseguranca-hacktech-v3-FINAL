import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Drone } from '../types';
import { Layers, Locate, Radio, Shield, AlertTriangle, ShieldAlert } from 'lucide-react';

interface CommandMapProps {
  drones: Drone[];
  selectedDroneId?: string | null;
  onSelectDrone: (droneId: string) => void;
  onOpenAlert: (droneId: string) => void;
  onOpenDenuncia?: () => void;
}

export const CommandMap: React.FC<CommandMapProps> = ({
  drones,
  selectedDroneId,
  onSelectDrone,
  onOpenAlert,
  onOpenDenuncia,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersGroupRef = useRef<L.LayerGroup | null>(null);
  const patrolPathGroupRef = useRef<L.LayerGroup | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const [mapStyle, setMapStyle] = useState<'dark' | 'osm' | 'satellite'>('dark');

  // URL do CartoDB e outros provedores
  const tileUrls = {
    dark: 'https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png?key=cb1_52rt_1_47f78a1c16614e663063cd01',
    osm: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [-24.7572, -51.7600],
      zoom: 14,
      zoomControl: false,
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    const tileLayer = L.tileLayer(tileUrls.dark, {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap &copy; CARTO / Esri',
    }).addTo(map);

    tileLayerRef.current = tileLayer;

    // Layer groups for markers and paths
    patrolPathGroupRef.current = L.layerGroup().addTo(map);
    markersGroupRef.current = L.layerGroup().addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Tile Layer when style changes
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;
    tileLayerRef.current.setUrl(tileUrls[mapStyle]);
  }, [mapStyle]);

  // Update Markers & Patrol Paths
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersGroupRef.current;
    const pathsGroup = patrolPathGroupRef.current;
    if (!map || !markersGroup || !pathsGroup) return;

    markersGroup.clearLayers();
    pathsGroup.clearLayers();

    // Base Station marker in Pitanga Central
    const baseCoords: [number, number] = [-24.7572, -51.7600];
    const baseIcon = L.divIcon({
      className: 'custom-base-icon',
      html: `
        <div style="background:#f1c40f; color:#000; width:30px; height:30px; border-radius:50%; display:flex; align-items:center; justify-content:center; box-shadow:0 0 15px #f1c40f; font-weight:900; font-size:12px; border:2px solid #fff;">
          HQ
        </div>
      `,
      iconSize: [30, 30],
      iconAnchor: [15, 15],
    });
    const baseMarker = L.marker(baseCoords, { icon: baseIcon }).addTo(markersGroup);
    baseMarker.bindTooltip('<b>CENTRAL DE COMANDO PITANGA</b><br><small>Base de Operações EPT</small>', {
      direction: 'top',
      className: 'tactical-tooltip',
    });

    // Sector patrol coverage boundary (simulated geo-fence)
    const geofenceCircle = L.circle(baseCoords, {
      radius: 3500,
      color: '#f1c40f',
      weight: 1,
      dashArray: '4, 8',
      fillColor: '#f1c40f',
      fillOpacity: 0.03,
    }).addTo(pathsGroup);

    drones.forEach((drone) => {
      const isSelected = selectedDroneId === drone.id;
      const isAlert = drone.status === 'ALERTA';
      const isLanding = drone.status === 'POUSANDO';
      const isOffline = drone.status === 'OFF-LINE';
      const isEnRouteReport = drone.status === 'EM_ROTA_DENUNCIA' || !!drone.waypointDestino;

      let markerColor = '#27ae60';
      if (isOffline) markerColor = '#7f8c8d';
      else if (isAlert || isLanding) markerColor = '#e74c3c';
      else if (isEnRouteReport) markerColor = '#f39c12';

      // Custom HTML Drone Marker with rotation and pulse
      const iconHtml = `
        <div class="relative flex items-center justify-center cursor-pointer group" style="width: 44px; height: 44px;">
          ${isAlert ? `<div class="absolute inset-0 rounded-full bg-red-500/40 animate-ping"></div>` : ''}
          ${isEnRouteReport ? `<div class="absolute inset-0 rounded-full bg-amber-500/40 animate-ping"></div>` : ''}
          ${drone.status === 'ON-LINE' ? `<div class="absolute inset-0 rounded-full bg-emerald-500/20 animate-pulse"></div>` : ''}
          <div style="background:${markerColor}; color:${isAlert || isOffline ? '#fff' : '#0b1118'}; border: 2px solid ${isSelected ? '#f1c40f' : '#ffffff'};"
               class="w-8 h-8 rounded-full flex flex-col items-center justify-center shadow-lg transition-transform duration-300 ${isSelected ? 'scale-125 ring-4 ring-yellow-400/50' : 'hover:scale-110'}">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2v20M2 12h20"/>
              <circle cx="12" cy="12" r="3"/>
              <circle cx="4" cy="4" r="2"/>
              <circle cx="20" cy="4" r="2"/>
              <circle cx="4" cy="20" r="2"/>
              <circle cx="20" cy="20" r="2"/>
            </svg>
          </div>
          <div class="absolute -bottom-4 whitespace-nowrap bg-black/80 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold text-white border border-gray-700 pointer-events-none">
            ${drone.id} [${drone.bateria.toFixed(0)}%]
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-drone-icon',
        html: iconHtml,
        iconSize: [44, 44],
        iconAnchor: [22, 22],
      });

      const marker = L.marker([drone.lat, drone.lng], { icon: customIcon }).addTo(markersGroup);

      // Patrol flight trail between HQ and Drone position
      if (!isOffline) {
        L.polyline([baseCoords, [drone.lat, drone.lng]], {
          color: isAlert ? '#e74c3c' : isEnRouteReport ? '#f39c12' : '#27ae60',
          weight: 1.5,
          dashArray: '3, 6',
          opacity: 0.6,
        }).addTo(pathsGroup);

        // Surveillance coverage radius
        L.circle([drone.lat, drone.lng], {
          radius: 380,
          color: isAlert ? '#e74c3c' : isEnRouteReport ? '#f39c12' : '#27ae60',
          weight: 1,
          fillColor: isAlert ? '#e74c3c' : isEnRouteReport ? '#f39c12' : '#27ae60',
          fillOpacity: 0.08,
        }).addTo(pathsGroup);
      }

      // If drone has an active waypoint from a citizen physical report:
      if (drone.waypointDestino) {
        const wp = drone.waypointDestino;
        
        // Target destination marker
        const targetHtml = `
          <div class="relative flex items-center justify-center cursor-pointer" style="width: 48px; height: 48px;">
            <div class="absolute inset-0 rounded-full bg-red-600/40 animate-ping"></div>
            <div class="w-8 h-8 rounded-full bg-red-600 border-2 border-yellow-400 flex items-center justify-center shadow-lg text-white">
              <svg class="w-5 h-5 animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="22" y1="12" x2="18" y2="12"/>
                <line x1="6" y1="12" x2="2" y2="12"/>
                <line x1="12" y1="6" x2="12" y2="2"/>
                <line x1="12" y1="22" x2="12" y2="18"/>
              </svg>
            </div>
            <div class="absolute -bottom-5 whitespace-nowrap bg-red-900/95 px-2 py-0.5 rounded text-[9px] font-mono font-bold text-yellow-300 border border-yellow-400 shadow-lg">
              🎯 ALVO DENÚNCIA: ${drone.id}
            </div>
          </div>
        `;

        const targetIcon = L.divIcon({
          className: 'target-waypoint-icon',
          html: targetHtml,
          iconSize: [48, 48],
          iconAnchor: [24, 24],
        });

        const targetMarker = L.marker([wp.lat, wp.lng], { icon: targetIcon }).addTo(markersGroup);
        targetMarker.bindTooltip(`
          <div style="font-family:'Segoe UI',monospace; padding:3px;">
            <b style="color:#e74c3c">🚨 ALVO DE DENÚNCIA FÍSICA</b><br>
            <span><b>Incidente:</b> ${wp.tipo}</span><br>
            <span><b>Local:</b> ${wp.local}</span><br>
            <span style="color:#f1c40f">Drone ${drone.id} em voo de interceptação imediata</span>
          </div>
        `, { className: 'tactical-tooltip', direction: 'top' });

        // Vector Interception Line
        L.polyline([[drone.lat, drone.lng], [wp.lat, wp.lng]], {
          color: '#e74c3c',
          weight: 3,
          dashArray: '6, 8',
          opacity: 0.9,
        }).addTo(pathsGroup);
      }

      // Tooltip
      const tooltipContent = `
        <div style="font-family:'Segoe UI',monospace; padding:2px;">
          <b style="color:${markerColor}">${drone.id} // ${drone.status}</b><br>
          <span>📍 ${drone.local}</span><br>
          <span>🔋 Bateria: ${drone.bateria.toFixed(1)}%</span><br>
          <span>📡 Sinal: ${drone.sinal}</span><br>
          ${drone.waypointDestino ? `<b style="color:#f1c40f">🎯 Em rota para denúncia: ${drone.waypointDestino.tipo}</b><br>` : ''}
          <small style="color:#aaa;">Clique para inspecionar</small>
        </div>
      `;
      marker.bindTooltip(tooltipContent, { className: 'tactical-tooltip', direction: 'top' });

      // Click behavior
      marker.on('click', () => {
        if (drone.status === 'ALERTA') {
          onOpenAlert(drone.id);
        } else {
          onSelectDrone(drone.id);
        }
      });
    });
  }, [drones, selectedDroneId]);

  const handleCenterPitanga = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([-24.7572, -51.7600], 14, { duration: 1.2 });
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col bg-[#0b1016]">
      {/* Map Control Bar Overlays */}
      <div className="absolute top-3 left-3 z-[1000] flex items-center gap-2 bg-[#16212d]/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[#34495e] text-xs">
        <span className="flex items-center gap-1.5 text-emerald-400 font-mono font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          GRID PITANGA - PR
        </span>
        <span className="text-gray-500">|</span>
        <span className="font-mono text-gray-300 text-[11px]">-24.7572° S, -51.7600° W</span>
      </div>

      {/* Layer Switcher & Recenter */}
      <div className="absolute top-3 right-3 z-[1000] flex items-center gap-1 bg-[#16212d]/90 backdrop-blur-md p-1 rounded-lg border border-[#34495e]">
        <button
          onClick={() => setMapStyle('dark')}
          className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
            mapStyle === 'dark' ? 'bg-[#f1c40f] text-black font-bold' : 'text-gray-300 hover:text-white'
          }`}
          title="Modo Tático Escuro (CARTO / Mapbox)"
        >
          Tático
        </button>
        <button
          onClick={() => setMapStyle('satellite')}
          className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
            mapStyle === 'satellite' ? 'bg-[#f1c40f] text-black font-bold' : 'text-gray-300 hover:text-white'
          }`}
          title="Satélite de Alta Resolução (Esri World Imagery)"
        >
          Satélite
        </button>
        <button
          onClick={() => setMapStyle('osm')}
          className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
            mapStyle === 'osm' ? 'bg-[#f1c40f] text-black font-bold' : 'text-gray-300 hover:text-white'
          }`}
          title="Mapa de Ruas OSM"
        >
          Ruas
        </button>
        <div className="w-[1px] h-4 bg-gray-600 mx-1" />
        <button
          onClick={handleCenterPitanga}
          className="p-1 text-gray-300 hover:text-[#f1c40f] transition-colors rounded hover:bg-white/5"
          title="Centralizar Pitanga"
        >
          <Locate className="w-4 h-4" />
        </button>
        {onOpenDenuncia && (
          <>
            <div className="w-[1px] h-4 bg-gray-600 mx-1" />
            <button
              onClick={onOpenDenuncia}
              className="px-2 py-1 text-xs font-bold rounded bg-red-600 hover:bg-red-500 text-white flex items-center gap-1.5 transition-colors shadow-sm animate-pulse"
              title="Registrar Denúncia Física Cidadã"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Denúncia</span>
            </button>
          </>
        )}
      </div>

      {/* Map Leaflet Container */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />
    </div>
  );
};
