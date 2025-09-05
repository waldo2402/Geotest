
export type Page = 'dashboard' | 'gestion';

export type ObraStatus = 'activa' | 'pendiente' | 'completada';

export interface Obra {
  id: string;
  nombre: string;
  status: ObraStatus;
  presupuesto: number;
  avance: number;
  fechaLimite: string;
  fechaCompletada?: string;
  responsable: string;
  contratista: string;
  proximoHito: string;
  observaciones: string;
  cliente: string;
  timeline: TimelineEvent[];
}

export type CobranzaStatus = 'Próximo Vencimiento' | 'Listo para Cobro' | 'Pendiente Aprobación';

export interface Cobranza {
    id: string;
    cliente: string;
    monto: number;
    concepto: string;
    vencimiento: string;
    estado: CobranzaStatus;
}

export type TimelineEventStatus = 'completed' | 'current' | 'pending';

export interface TimelineEvent {
    id: string;
    fecha: string;
    titulo: string;
    descripcion: string;
    status: TimelineEventStatus;
}
