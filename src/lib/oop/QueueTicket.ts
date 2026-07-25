import { TicketData, TicketStatus, ServiceType } from '../types';
import { BaseService, createServiceInstance } from './Services';

/**
 * ----------------------------------------------------
 * PILAR OOP 1: ENCAPSULATION
 * ----------------------------------------------------
 * Class QueueTicket memproteksi (kapsulasi) atribut internal
 * seperti status, pitNumber, dan data tiket.
 * 
 * Atribut private tidak dapat diakses atau diubah langsung dari luar.
 * Perubahan status hanya dapat dilakukan melalui method yang memvalidasi
 * aturan bisnis (State Transition Validation).
 */
export class QueueTicket {
  private id: string;
  private ticketNumber: string;
  private customerName: string;
  private plateNumber: string;
  private motorModel: string;
  private motorAgeYears: number;
  private service: BaseService;
  private notes: string;
  private status: TicketStatus;
  private pitNumber: number | null;
  private estimatedDuration: number;
  private createdAt: string;
  private updatedAt: string;

  constructor(data: TicketData) {
    this.id = data.id;
    this.ticketNumber = data.ticketNumber;
    this.customerName = data.customerName;
    this.plateNumber = data.plateNumber;
    this.motorModel = data.motorModel;
    this.motorAgeYears = data.motorAgeYears;
    this.service = createServiceInstance(data.serviceType, data.serviceName);
    this.notes = data.notes || '';
    this.status = data.status;
    this.pitNumber = data.pitNumber ?? null;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;

    // Hitung estimasi durasi menggunakan Polymorphism dari instance service
    this.estimatedDuration = data.estimatedDuration || this.service.calculateEstimatedDuration(this.motorAgeYears);
  }

  // --- GETTERS (ENCAPSULATION READ ACCESS) ---

  public getId(): string {
    return this.id;
  }

  public getTicketNumber(): string {
    return this.ticketNumber;
  }

  public getCustomerName(): string {
    return this.customerName;
  }

  public getPlateNumber(): string {
    return this.plateNumber;
  }

  public getMotorModel(): string {
    return this.motorModel;
  }

  public getMotorAgeYears(): number {
    return this.motorAgeYears;
  }

  public getService(): BaseService {
    return this.service;
  }

  public getServiceName(): string {
    return this.service.getName();
  }

  public getServiceType(): ServiceType {
    return this.service.getServiceType();
  }

  public getNotes(): string {
    return this.notes;
  }

  /**
   * Protected getter untuk Status (Encapsulation)
   */
  public getStatus(): TicketStatus {
    return this.status;
  }

  /**
   * Protected getter untuk Pit Number (Encapsulation)
   */
  public getPitNumber(): number | null {
    return this.pitNumber;
  }

  public getEstimatedDuration(): number {
    return this.estimatedDuration;
  }

  public getCreatedAt(): string {
    return this.createdAt;
  }

  public getUpdatedAt(): string {
    return this.updatedAt;
  }

  // --- MUTATORS WITH BUSINESS RULE VALIDATION (ENCAPSULATION CONTROL) ---

  /**
   * Mengalokasikan antrian ke Pit Mekanik tertentu dan mengubah status menjadi IN_PROGRESS.
   * State Machine Validation:
   * - Pit number harus bernilai positif (> 0).
   * - Tiket yang sudah COMPLETED atau CANCELLED tidak boleh dialokasikan ulang tanpa reset.
   */
  public assignToPit(pitNumber: number): { success: boolean; message: string } {
    if (pitNumber <= 0) {
      return { success: false, message: 'Nomor Pit harus bernilai lebih besar dari 0!' };
    }

    if (this.status === 'COMPLETED') {
      return { success: false, message: 'Tiket antrian sudah selesai, tidak bisa dialokasikan lagi!' };
    }

    if (this.status === 'CANCELLED') {
      return { success: false, message: 'Tiket antrian telah dibatalkan!' };
    }

    this.pitNumber = pitNumber;
    this.status = 'IN_PROGRESS';
    this.updatedAt = new Date().toISOString();

    return {
      success: true,
      message: `Tiket ${this.ticketNumber} berhasil dimasukkan ke Pit ${pitNumber}. Status: IN_PROGRESS.`
    };
  }

  /**
   * Menyelesaikan proses pengerjaan servis di Pit.
   * State Machine Validation:
   * - Harus dalam status IN_PROGRESS atau WAITING.
   */
  public completeService(): { success: boolean; message: string } {
    if (this.status === 'CANCELLED') {
      return { success: false, message: 'Tiket yang telah dibatalkan tidak bisa diselesaikan!' };
    }

    if (this.status === 'COMPLETED') {
      return { success: false, message: 'Tiket ini sudah dalam status COMPLETED!' };
    }

    this.status = 'COMPLETED';
    this.updatedAt = new Date().toISOString();

    return {
      success: true,
      message: `Servis untuk tiket ${this.ticketNumber} di Pit ${this.pitNumber || '-'} telah SELESAI.`
    };
  }

  /**
   * Membatalkan tiket antrian.
   */
  public cancelTicket(reason?: string): { success: boolean; message: string } {
    if (this.status === 'COMPLETED') {
      return { success: false, message: 'Tiket yang sudah selesai tidak dapat dibatalkan!' };
    }

    this.status = 'CANCELLED';
    this.pitNumber = null;
    this.updatedAt = new Date().toISOString();

    return {
      success: true,
      message: `Tiket ${this.ticketNumber} telah dibatalkan. ${reason ? `Alasan: ${reason}` : ''}`
    };
  }

  /**
   * Konversi domain model kembali ke plain JSON object (DTO).
   */
  public toJSON(): TicketData {
    return {
      id: this.id,
      ticketNumber: this.ticketNumber,
      customerName: this.customerName,
      plateNumber: this.plateNumber,
      motorModel: this.motorModel,
      motorAgeYears: this.motorAgeYears,
      serviceType: this.getServiceType(),
      serviceName: this.getServiceName(),
      estimatedDuration: this.estimatedDuration,
      notes: this.notes,
      status: this.status,
      pitNumber: this.pitNumber,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
