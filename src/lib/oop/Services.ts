import { ServiceType } from '../types';

/**
 * ----------------------------------------------------
 * PILAR OOP 2 & 3: INHERITANCE & POLYMORPHISM
 * ----------------------------------------------------
 * BaseService adalah Abstract Class yang menjadi induk dari
 * LightService dan HeavyService (Inheritance).
 * 
 * Method calculateEstimatedDuration(motorAgeYears) di-override
 * oleh masing-masing subclass dengan logika berbeda (Polymorphism).
 */
export abstract class BaseService {
  protected name: string;
  protected serviceType: ServiceType;
  protected baseDurationMinutes: number;
  protected basePrice: number;

  constructor(
    name: string,
    serviceType: ServiceType,
    baseDurationMinutes: number,
    basePrice: number
  ) {
    this.name = name;
    this.serviceType = serviceType;
    this.baseDurationMinutes = baseDurationMinutes;
    this.basePrice = basePrice;
  }

  // Getters
  public getName(): string {
    return this.name;
  }

  public getServiceType(): ServiceType {
    return this.serviceType;
  }

  public getBaseDuration(): number {
    return this.baseDurationMinutes;
  }

  public getBasePrice(): number {
    return this.basePrice;
  }

  /**
   * Abstract Method (Polymorphism):
   * Setiap jenis servis menghitung durasi estimasi secara berbeda
   * berdasarkan faktor usia kendaraan (motorAgeYears).
   */
  public abstract calculateEstimatedDuration(motorAgeYears: number): number;

  /**
   * Method untuk menghitung total biaya estimasi.
   */
  public calculateTotalPrice(motorAgeYears: number): number {
    // Motor tua (> 5 tahun) mendapat biaya penanganan tambahan untuk kerumitan baut/perawatan
    if (motorAgeYears > 5) {
      const extraAgeFee = Math.floor((motorAgeYears - 5) / 2) * 15000;
      return this.basePrice + extraAgeFee;
    }
    return this.basePrice;
  }
}

/**
 * Service Ringan (Servis Berkala, Ganti Oli, Tune Up)
 * Inherit dari BaseService
 */
export class LightService extends BaseService {
  constructor(name = 'Servis Ringan & Ganti Oli') {
    super(name, 'LIGHT', 20, 75000);
  }

  /**
   * POLYMORPHISM OVERRIDE:
   * Servis ringan membutuhkan waktu standar 20 menit.
   * Jika motor berusia > 7 tahun, ada pemeriksaan ekstra 5 menit.
   */
  public calculateEstimatedDuration(motorAgeYears: number): number {
    if (motorAgeYears > 7) {
      return this.baseDurationMinutes + 5;
    }
    return this.baseDurationMinutes;
  }
}

/**
 * Service Berat (Overhaul, Turun Mesin, CVT Heavy Repair, Kelistrikan Utama)
 * Inherit dari BaseService
 */
export class HeavyService extends BaseService {
  constructor(name = 'Servis Berat & Overhaul Mesin') {
    super(name, 'HEAVY', 60, 250000);
  }

  /**
   * POLYMORPHISM OVERRIDE:
   * Servis berat membutuhkan waktu dasar 60 menit.
   * Untuk motor yang lebih tua, pengerjaan bertambah +10 menit per 2 tahun usia motor
   * karena komponen yang sudah aus/karatan memerlukan ekstra kehati-hatian.
   */
  public calculateEstimatedDuration(motorAgeYears: number): number {
    const ageFactor = Math.floor(motorAgeYears / 2);
    const extraDuration = ageFactor * 10;
    // Maksimum batas estimasi servis berat 150 menit
    return Math.min(this.baseDurationMinutes + extraDuration, 150);
  }
}

/**
 * Factory Function / Polymorphic Factory untuk mendapatkan instance service
 */
export function createServiceInstance(type: ServiceType, customName?: string): BaseService {
  if (type === 'HEAVY') {
    return new HeavyService(customName || 'Servis Berat & Overhaul');
  }
  return new LightService(customName || 'Servis Ringan & Ganti Oli');
}
