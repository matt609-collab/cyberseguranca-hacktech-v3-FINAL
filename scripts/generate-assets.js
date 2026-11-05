import fs from 'node:fs';
import path from 'node:path';

const publicDir = path.resolve('public');
const gifsDir = path.join(publicDir, 'gifs');
const pessoinhasDir = path.join(publicDir, 'pessoinhas');

fs.mkdirSync(gifsDir, { recursive: true });
fs.mkdirSync(pessoinhasDir, { recursive: true });

function writeSvg(filePath, svg) {
  fs.writeFileSync(filePath, svg.trim(), 'utf-8');
}

const blueprintSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500" style="background:#0b1118; font-family:'Segoe UI',sans-serif;">
  <defs>
    <radialGradient id="bgGlow" cx="50%" cy="50%" r="60%">
      <stop offset="0%" stop-color="#142634"/>
      <stop offset="100%" stop-color="#0b1118"/>
    </radialGradient>
    <pattern id="gridPat" width="25" height="25" patternUnits="userSpaceOnUse">
      <path d="M 25 0 L 0 0 0 25" fill="none" stroke="rgba(241,196,15,0.06)" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="800" height="500" fill="url(#bgGlow)"/>
  <rect width="800" height="500" fill="url(#gridPat)"/>
  
  <circle cx="400" cy="250" r="180" fill="none" stroke="#27ae60" stroke-width="1" stroke-dasharray="4 4" opacity="0.4"/>
  <circle cx="400" cy="250" r="120" fill="none" stroke="#f1c40f" stroke-width="1" opacity="0.3"/>
  
  <line x1="180" y1="250" x2="620" y2="250" stroke="#334155" stroke-width="1" stroke-dasharray="2 4"/>
  <line x1="400" y1="50" x2="400" y2="450" stroke="#334155" stroke-width="1" stroke-dasharray="2 4"/>

  <!-- Arms -->
  <line x1="400" y1="250" x2="250" y2="130" stroke="#f1c40f" stroke-width="7" stroke-linecap="round"/>
  <line x1="400" y1="250" x2="550" y2="130" stroke="#f1c40f" stroke-width="7" stroke-linecap="round"/>
  <line x1="400" y1="250" x2="250" y2="370" stroke="#f1c40f" stroke-width="7" stroke-linecap="round"/>
  <line x1="400" y1="250" x2="550" y2="370" stroke="#f1c40f" stroke-width="7" stroke-linecap="round"/>

  <!-- Propellers -->
  <g>
    <circle cx="250" cy="130" r="32" fill="none" stroke="#27ae60" stroke-width="2" stroke-dasharray="5 3"/>
    <circle cx="250" cy="130" r="12" fill="#1e293b" stroke="#27ae60" stroke-width="2"/>
    <circle cx="550" cy="130" r="32" fill="none" stroke="#27ae60" stroke-width="2" stroke-dasharray="5 3"/>
    <circle cx="550" cy="130" r="12" fill="#1e293b" stroke="#27ae60" stroke-width="2"/>
    <circle cx="250" cy="370" r="32" fill="none" stroke="#27ae60" stroke-width="2" stroke-dasharray="5 3"/>
    <circle cx="250" cy="370" r="12" fill="#1e293b" stroke="#27ae60" stroke-width="2"/>
    <circle cx="550" cy="370" r="32" fill="none" stroke="#27ae60" stroke-width="2" stroke-dasharray="5 3"/>
    <circle cx="550" cy="370" r="12" fill="#1e293b" stroke="#27ae60" stroke-width="2"/>
  </g>

  <!-- Central Fuselage (DJI Mini 3 core) -->
  <rect x="350" y="200" width="100" height="100" rx="10" fill="#1e293b" stroke="#f1c40f" stroke-width="2"/>

  <!-- Resun 100W Solar Panel -->
  <rect x="360" y="215" width="80" height="70" rx="4" fill="#0284c7" stroke="#38bdf8" stroke-width="2"/>
  <line x1="386" y1="215" x2="386" y2="285" stroke="rgba(255,255,255,0.5)" stroke-width="1"/>
  <line x1="413" y1="215" x2="413" y2="285" stroke="rgba(255,255,255,0.5)" stroke-width="1"/>
  <line x1="360" y1="250" x2="440" y2="250" stroke="rgba(255,255,255,0.5)" stroke-width="1"/>

  <!-- Thermal Gimbal Camera -->
  <circle cx="400" cy="180" r="15" fill="#0f172a" stroke="#e74c3c" stroke-width="2"/>
  <circle cx="400" cy="180" r="6" fill="#e74c3c"/>

  <!-- Callouts -->
  <text x="400" y="150" fill="#e74c3c" font-size="11" font-weight="bold" text-anchor="middle">CÂMERA TÉRMICA &amp; FPV INFRAVERMELHO</text>
  <text x="400" y="325" fill="#38bdf8" font-size="11" font-weight="bold" text-anchor="middle">PAINEL SOLAR RESUN 100W INTEGRADO</text>
  <text x="400" y="420" fill="#27ae60" font-size="12" font-weight="bold" text-anchor="middle">LiFePO4 12V 20Ah + Epower MPPT 20A</text>

  <text x="30" y="40" fill="#f1c40f" font-size="16" font-weight="bold">VAI-PITANGA SOLAR V6 // ESQUEMA EPT</text>
  <text x="770" y="40" fill="#27ae60" font-size="12" text-anchor="end">AUTÔNOMO 24/7</text>
</svg>`;

const cameraFlightSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 350" width="600" height="350" style="background:#070d14; font-family:'Segoe UI',monospace;">
  <defs>
    <radialGradient id="vignette" cx="50%" cy="50%" r="50%">
      <stop offset="60%" stop-color="#000000" stop-opacity="0"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0.8"/>
    </radialGradient>
  </defs>
  <rect width="600" height="350" fill="#09131d"/>
  <!-- Street & Landscape map vector simulation -->
  <path d="M 0 180 Q 200 120 400 220 T 600 150" fill="none" stroke="#1d2e3d" stroke-width="40"/>
  <path d="M 0 180 Q 200 120 400 220 T 600 150" fill="none" stroke="#f1c40f" stroke-width="2" stroke-dasharray="8 8" opacity="0.4"/>
  <!-- Buildings -->
  <rect x="80" y="80" width="60" height="50" fill="#132230" stroke="#1e3a50" stroke-width="1"/>
  <rect x="180" y="70" width="80" height="60" fill="#132230" stroke="#1e3a50" stroke-width="1"/>
  <rect x="420" y="90" width="70" height="70" fill="#132230" stroke="#1e3a50" stroke-width="1"/>
  <rect x="280" y="240" width="90" height="60" fill="#132230" stroke="#1e3a50" stroke-width="1"/>

  <!-- Drone target reticle -->
  <circle cx="300" cy="175" r="45" fill="none" stroke="#27ae60" stroke-width="1.5" stroke-dasharray="6 3"/>
  <line x1="300" y1="150" x2="300" y2="200" stroke="#27ae60" stroke-width="1.5"/>
  <line x1="275" y1="175" x2="325" y2="175" stroke="#27ae60" stroke-width="1.5"/>

  <rect width="600" height="350" fill="url(#vignette)"/>

  <!-- HUD -->
  <text x="25" y="35" fill="#27ae60" font-size="11" font-weight="bold">FEED AO VIVO // PITANGA-PR</text>
  <text x="25" y="55" fill="#94a3b8" font-size="10">ALT: 120m | BATERIA: 92% | VENTO: 9 km/h</text>
  <text x="575" y="35" fill="#e74c3c" font-size="10" font-weight="bold" text-anchor="end">● REC LIVE</text>
</svg>`;

const fireHazardSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 350" width="600" height="350" style="background:#1b0505; font-family:'Segoe UI',monospace;">
  <rect width="600" height="350" fill="#200606"/>
  <!-- Fire hotspot -->
  <circle cx="300" cy="175" r="90" fill="#ff4500" opacity="0.3"/>
  <circle cx="300" cy="175" r="60" fill="#ff8c00" opacity="0.5"/>
  <circle cx="300" cy="175" r="30" fill="#ffff00" opacity="0.8"/>
  <circle cx="300" cy="175" r="10" fill="#ffffff"/>

  <!-- AI Target Box -->
  <rect x="210" y="95" width="180" height="160" fill="none" stroke="#e74c3c" stroke-width="2"/>
  <rect x="210" y="70" width="180" height="22" fill="#e74c3c"/>
  <text x="300" y="85" fill="#ffffff" font-size="10" font-weight="bold" text-anchor="middle">INCÊNDIO DETECTADO (620°C)</text>

  <text x="25" y="35" fill="#e74c3c" font-size="12" font-weight="bold">⚠️ ALERTA TÉRMICO FLIR - PITANGA</text>
  <text x="25" y="55" fill="#f1c40f" font-size="10">COORD: -24.7572, -51.7600 | CONFIANÇA: 98%</text>
  <text x="575" y="35" fill="#e74c3c" font-size="10" font-weight="bold" text-anchor="end">SINAL EMERGÊNCIA</text>
</svg>`;

const theftSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 350" width="600" height="350" style="background:#03130c; font-family:'Segoe UI',monospace;">
  <rect width="600" height="350" fill="#041a10"/>
  <!-- Night vision perimeter -->
  <line x1="50" y1="240" x2="550" y2="240" stroke="#00ff66" stroke-width="1.5" stroke-dasharray="8 4" opacity="0.5"/>
  <!-- Intrusion box -->
  <rect x="230" y="110" width="140" height="140" fill="rgba(231,76,60,0.15)" stroke="#e74c3c" stroke-width="2"/>
  <rect x="230" y="88" width="140" height="20" fill="#e74c3c"/>
  <text x="300" y="102" fill="#ffffff" font-size="9" font-weight="bold" text-anchor="middle">SUSPEITA DE INVASÃO / FURTO</text>

  <circle cx="300" cy="180" r="16" fill="#ffbb00"/>
  <rect x="290" y="196" width="20" height="34" rx="3" fill="#ff7700"/>

  <text x="25" y="35" fill="#e74c3c" font-size="12" font-weight="bold">🚨 INVASÃO DETECTADA - VISÃO NOTURNA IR</text>
  <text x="25" y="55" fill="#00ff66" font-size="10">PERÍMETRO INDUSTRIAL // DRONE VAI TRAVADO</text>
  <text x="575" y="35" fill="#e74c3c" font-size="10" font-weight="bold" text-anchor="end">RASTREAMENTO ATIVO</text>
</svg>`;

function teamSvg(name, role, initials, color) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 250 250" width="250" height="250" style="background:#15202b; font-family:'Segoe UI',sans-serif;">
  <rect width="250" height="250" fill="#111c26"/>
  <circle cx="125" cy="125" r="95" fill="${color}" opacity="0.15"/>
  <circle cx="125" cy="125" r="85" fill="none" stroke="${color}" stroke-width="2" stroke-dasharray="6 4"/>
  
  <circle cx="125" cy="95" r="34" fill="${color}" opacity="0.9"/>
  <!-- Headset -->
  <path d="M 91 95 A 34 34 0 0 1 159 95" fill="none" stroke="#ffffff" stroke-width="3"/>
  <rect x="88" y="90" width="6" height="12" rx="2" fill="#ffffff"/>
  <rect x="156" y="90" width="6" height="12" rx="2" fill="#ffffff"/>

  <!-- Body -->
  <path d="M 75 195 C 75 150, 175 150, 175 195 Z" fill="${color}" opacity="0.85"/>
  
  <!-- Initials -->
  <circle cx="125" cy="205" r="20" fill="#0f172a" stroke="${color}" stroke-width="2"/>
  <text x="125" y="212" fill="#ffffff" font-size="12" font-weight="900" text-anchor="middle">${initials}</text>
  <text x="125" y="238" fill="#ecf0f1" font-size="11" font-weight="bold" text-anchor="middle">${name}</text>
</svg>`;
}

writeSvg(path.join(gifsDir, 'dronedesign.jpg'), blueprintSvg);
writeSvg(path.join(gifsDir, 'done_flying.gif'), cameraFlightSvg);
writeSvg(path.join(gifsDir, 'drone_aura.gif'), cameraFlightSvg);
writeSvg(path.join(gifsDir, 'drone_extreme.gif'), cameraFlightSvg);
writeSvg(path.join(gifsDir, 'evil_drone.gif'), cameraFlightSvg);

writeSvg(path.join(gifsDir, 'drone_fire.jpg'), fireHazardSvg);
writeSvg(path.join(gifsDir, 'drone_fire2.jpg'), fireHazardSvg);
writeSvg(path.join(gifsDir, 'gtadrone.jpg'), theftSvg);
writeSvg(path.join(gifsDir, 'gtadrone2.gif'), theftSvg);

const team = [
  { file: 'jose.jpg', name: 'José', role: 'Engenharia de Sistemas', initials: 'JS', color: '#3b82f6' },
  { file: 'emanuelly.jpg', name: 'Emanuelly', role: 'Engenharia de Software', initials: 'EM', color: '#10b981' },
  { file: 'lorena.jpg', name: 'Lorena', role: 'Gestão de Frota', initials: 'LR', color: '#ec4899' },
  { file: 'matheuscheff.jpg', name: 'Matheus C.', role: 'Desenvolvimento Frontend', initials: 'MC', color: '#f59e0b' },
  { file: 'thassila.jpg', name: 'Thassila', role: 'Análise de Dados / IA', initials: 'TH', color: '#8b5cf6' },
  { file: 'matheusem.jpg', name: 'Matheus E.', role: 'Operações de Campo', initials: 'ME', color: '#ef4444' }
];

for (const m of team) {
  writeSvg(path.join(pessoinhasDir, m.file), teamSvg(m.name, m.role, m.initials, m.color));
}

console.log('Static fallback assets written successfully!');
