import { CreateTicketDTO, TicketData, TicketStatus } from '../types';
import { QueueTicket } from './QueueTicket';
import { createServiceInstance } from './Services';

/**
 * ----------------------------------------------------
 * PILAR OOP 4: ABSTRACTION
 * ----------------------------------------------------
 * Interface IQueueRepository mendefinisikan kontrak (abstraction)
 * untuk akses dan manipulasi data antrian.
 * 
 * Lapisan UI tidak perlu tahu apakah data disimpan di Supabase,
 * PostgreSQL Prisma, atau In-Memory store.
 */
export interface IQueueRepository {
  getAllTickets(): Promise<QueueTicket[]>;
  getTicketById(id: string): Promise<QueueTicket | null>;
  getTicketByNumber(ticketNumber: string): Promise<QueueTicket | null>;
  createTicket(dto: CreateTicketDTO): Promise<QueueTicket>;
  updateTicketStatus(id: string, status: TicketStatus, pitNumber?: number | null): Promise<QueueTicket>;
  deleteTicket(id: string): Promise<boolean>;
}

// Memory Store Initial State untuk Fallback / Demo Mode
const INITIAL_DEMO_TICKETS: TicketData[] = [
  {
    id: 'demo-1',
    ticketNumber: 'A-001',
    customerName: 'Budi Santoso',
    plateNumber: 'B 1234 XYZ',
    motorModel: 'Honda Vario 150',
    motorAgeYears: 3,
    serviceType: 'LIGHT',
    serviceName: 'Servis Ringan & Ganti Oli',
    estimatedDuration: 20,
    notes: 'Ganti oli MPX2 + Cek rem depan',
    status: 'IN_PROGRESS',
    pitNumber: 1,
    createdAt: new Date(Date.now() - 45 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 30 * 60000).toISOString(),
  },
  {
    id: 'demo-2',
    ticketNumber: 'B-001',
    customerName: 'Siti Aminah',
    plateNumber: 'B 5678 NOP',
    motorModel: 'Yamaha NMAX 155',
    motorAgeYears: 5,
    serviceType: 'HEAVY',
    serviceName: 'Servis Berat & Overhaul Mesin',
    estimatedDuration: 80,
    notes: 'Suara kasar di bagian CVT dan cek kompresi',
    status: 'IN_PROGRESS',
    pitNumber: 2,
    createdAt: new Date(Date.now() - 40 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 25 * 60000).toISOString(),
  },
  {
    id: 'demo-3',
    ticketNumber: 'A-002',
    customerName: 'Rudi Hermawan',
    plateNumber: 'B 9988 GHI',
    motorModel: 'Honda Beat Street',
    motorAgeYears: 2,
    serviceType: 'LIGHT',
    serviceName: 'Servis Ringan & Ganti Oli',
    estimatedDuration: 20,
    notes: 'Servis berkala 10.000 KM',
    status: 'WAITING',
    pitNumber: null,
    createdAt: new Date(Date.now() - 20 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 20 * 60000).toISOString(),
  },
  {
    id: 'demo-4',
    ticketNumber: 'A-003',
    customerName: 'Dewi Lestari',
    plateNumber: 'B 4321 JKL',
    motorModel: 'Yamaha Aerox 155',
    motorAgeYears: 4,
    serviceType: 'LIGHT',
    serviceName: 'Servis Ringan & Ganti Oli',
    estimatedDuration: 20,
    notes: 'Ganti kampas rem belakang',
    status: 'WAITING',
    pitNumber: null,
    createdAt: new Date(Date.now() - 10 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 60000).toISOString(),
  },
  {
    id: 'demo-5',
    ticketNumber: 'A-000',
    customerName: 'Agus Pratama',
    plateNumber: 'B 7777 ABC',
    motorModel: 'Honda PCX 160',
    motorAgeYears: 1,
    serviceType: 'LIGHT',
    serviceName: 'Servis Ringan & Ganti Oli',
    estimatedDuration: 20,
    notes: 'Ganti oli mesin & radiator',
    status: 'COMPLETED',
    pitNumber: 1,
    createdAt: new Date(Date.now() - 90 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 50 * 60000).toISOString(),
  }
];

/**
 * In-Memory Repository Implementation (Concrete Class 1)
 */
export class InMemoryQueueRepository implements IQueueRepository {
  private static instance: InMemoryQueueRepository;
  private tickets: TicketData[] = [];
  private ticketCounter = { LIGHT: 4, HEAVY: 2 };

  private constructor() {
    this.tickets = [...INITIAL_DEMO_TICKETS];
  }

  public static getInstance(): InMemoryQueueRepository {
    if (!InMemoryQueueRepository.instance) {
      InMemoryQueueRepository.instance = new InMemoryQueueRepository();
    }
    return InMemoryQueueRepository.instance;
  }

  public async getAllTickets(): Promise<QueueTicket[]> {
    return this.tickets.map(t => new QueueTicket(t));
  }

  public async getTicketById(id: string): Promise<QueueTicket | null> {
    const found = this.tickets.find(t => t.id === id);
    return found ? new QueueTicket(found) : null;
  }

  public async getTicketByNumber(ticketNumber: string): Promise<QueueTicket | null> {
    const query = ticketNumber.trim().toUpperCase();
    const found = this.tickets.find(
      t => t.ticketNumber.toUpperCase() === query || t.plateNumber.toUpperCase() === query
    );
    return found ? new QueueTicket(found) : null;
  }

  public async createTicket(dto: CreateTicketDTO): Promise<QueueTicket> {
    // Generate Kode Tiket unik: A-XXX untuk Light, B-XXX untuk Heavy
    const prefix = dto.serviceType === 'LIGHT' ? 'A' : 'B';
    const counterVal = this.ticketCounter[dto.serviceType]++;
    const ticketNumber = `${prefix}-${String(counterVal).padStart(3, '0')}`;

    // Gunakan Polymorphism via Factory untuk menghitung estimasi waktu berdasarkan usia motor
    const serviceInstance = createServiceInstance(dto.serviceType);
    const estimatedDuration = serviceInstance.calculateEstimatedDuration(dto.motorAgeYears);

    const newTicketData: TicketData = {
      id: `ticket-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      ticketNumber,
      customerName: dto.customerName,
      plateNumber: dto.plateNumber.toUpperCase(),
      motorModel: dto.motorModel,
      motorAgeYears: Number(dto.motorAgeYears),
      serviceType: dto.serviceType,
      serviceName: serviceInstance.getName(),
      estimatedDuration,
      notes: dto.notes || '',
      status: 'WAITING',
      pitNumber: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.tickets.unshift(newTicketData);
    const queueTicket = new QueueTicket(newTicketData);

    // Triggers custom event untuk listener browser jika ada
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('queue-updated', { detail: newTicketData }));
    }

    return queueTicket;
  }

  public async updateTicketStatus(
    id: string,
    status: TicketStatus,
    pitNumber?: number | null
  ): Promise<QueueTicket> {
    const ticketIndex = this.tickets.findIndex(t => t.id === id);
    if (ticketIndex === -1) {
      throw new Error(`Tiket dengan ID ${id} tidak ditemukan.`);
    }

    // Instansiasi class QueueTicket untuk mengeksekusi metode Encapsulated mutator
    const queueTicket = new QueueTicket(this.tickets[ticketIndex]);

    if (status === 'IN_PROGRESS' && pitNumber) {
      const res = queueTicket.assignToPit(pitNumber);
      if (!res.success) throw new Error(res.message);
    } else if (status === 'COMPLETED') {
      const res = queueTicket.completeService();
      if (!res.success) throw new Error(res.message);
    } else if (status === 'CANCELLED') {
      const res = queueTicket.cancelTicket();
      if (!res.success) throw new Error(res.message);
    }

    // Update state internal
    const updatedData = queueTicket.toJSON();
    this.tickets[ticketIndex] = updatedData;

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('queue-updated', { detail: updatedData }));
    }

    return queueTicket;
  }

  public async deleteTicket(id: string): Promise<boolean> {
    const initialLen = this.tickets.length;
    this.tickets = this.tickets.filter(t => t.id !== id);
    return this.tickets.length < initialLen;
  }
}

/**
 * Factory Repository Pattern (Abstraction Layer)
 * Memilih repository yang aktif (Prisma/Supabase atau In-Memory)
 */
export class QueueRepositoryFactory {
  public static getRepository(): IQueueRepository {
    return InMemoryQueueRepository.getInstance();
  }
}
