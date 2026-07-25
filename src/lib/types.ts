export type ServiceType = 'LIGHT' | 'HEAVY';

export type TicketStatus = 'WAITING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface TicketData {
  id: string;
  ticketNumber: string;
  customerName: string;
  plateNumber: string;
  motorModel: string;
  motorAgeYears: number;
  serviceType: ServiceType;
  serviceName: string;
  estimatedDuration: number; // minutes
  notes?: string | null;
  status: TicketStatus;
  pitNumber?: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTicketDTO {
  customerName: string;
  plateNumber: string;
  motorModel: string;
  motorAgeYears: number;
  serviceType: ServiceType;
  notes?: string;
}
