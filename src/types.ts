export type DroneStatus = 'ON-LINE' | 'OFF-LINE' | 'POUSANDO' | 'ALERTA' | 'EM_ROTA_DENUNCIA';

export type SignalType = '5G' | 'Satélite' | 'Rádio';

export type AlertType = 'fire' | 'theft' | 'denuncia';

export interface PhysicalReport {
  id: string;
  tipo: string;
  descricao: string;
  municipio: string;
  setor: 'rural' | 'urbano' | 'municipal';
  endereco: string;
  lat: number;
  lng: number;
  urgencia: 'alta' | 'media' | 'baixa';
  assignedDroneId: string;
  distanciaKm: number;
  timestamp: string;
  status: 'DESPACHADO' | 'EM_ROTA' | 'INVESTIGANDO' | 'CONCLUIDO';
}

export interface Drone {
  id: string;
  bateria: number;
  status: DroneStatus;
  local: string;
  sinal: SignalType;
  coords: string;
  lat: number;
  lng: number;
  altitude?: number;
  velocidade?: number;
  tipoAlerta?: AlertType;
  temperatura?: number;
  waypointDestino?: {
    lat: number;
    lng: number;
    local: string;
    tipo: string;
    reportId: string;
  };
}

export interface LogEntry {
  id: string;
  hora: string;
  drone: string;
  evento: string;
  status: string;
  tipo?: 'info' | 'alert' | 'success' | 'warn';
}

export interface PlanItem {
  id: string;
  name: string;
  price: string;
  category: 'rural' | 'municipio' | 'privada';
  area: string;
  dronesCount: number;
  features: string[];
  isFeatured?: boolean;
}

export interface TeamMember {
  name: string;
  role: string;
  image: string;
  initials: string;
  bio: string;
  responsibilities: string[];
}
