'use client';

import { useState } from 'react';
import { 
  ShieldCheck, 
  Layers, 
  GitBranch, 
  Cpu, 
  Play, 
  Code2, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles,
  BookOpen,
  ArrowRight,
  Zap,
  Wrench
} from 'lucide-react';
import { BaseService, LightService, HeavyService, createServiceInstance } from '@/lib/oop/Services';
import { QueueTicket } from '@/lib/oop/QueueTicket';
import { TicketData } from '@/lib/types';

export default function AboutOOPPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'interactive'>('overview');

  // Interactive Tester state
  const [testMotorAge, setTestMotorAge] = useState<number>(6);
  const [testServiceType, setTestServiceType] = useState<'LIGHT' | 'HEAVY'>('HEAVY');
  const [simulatedLog, setSimulatedLog] = useState<string[]>([]);

  // Instance created for live polymorphism demonstration
  const lightServiceDemo = new LightService();
  const heavyServiceDemo = new HeavyService();
  const activeServiceDemo = createServiceInstance(testServiceType);

  const lightDuration = lightServiceDemo.calculateEstimatedDuration(testMotorAge);
  const heavyDuration = heavyServiceDemo.calculateEstimatedDuration(testMotorAge);

  // Live Encapsulation State Test
  const [demoTicketState, setDemoTicketState] = useState<TicketData>({
    id: 'test-oop-1',
    ticketNumber: 'A-007',
    customerName: 'Ahmad Supardi',
    plateNumber: 'B 7777 OOP',
    motorModel: 'Honda CB150R',
    motorAgeYears: testMotorAge,
    serviceType: testServiceType,
    serviceName: activeServiceDemo.getName(),
    estimatedDuration: activeServiceDemo.calculateEstimatedDuration(testMotorAge),
    notes: 'Suara mesin kasar',
    status: 'WAITING',
    pitNumber: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  const runEncapsulatedAssign = (pit: number) => {
    const ticketObj = new QueueTicket(demoTicketState);
    const result = ticketObj.assignToPit(pit);
    
    setDemoTicketState(ticketObj.toJSON());
    setSimulatedLog((prev) => [
      `[${new Date().toLocaleTimeString()}] ticketObj.assignToPit(${pit}) => ${
        result.success ? 'SUCCESS' : 'FAILED'
      }: "${result.message}"`,
      ...prev,
    ]);
  };

  const runEncapsulatedComplete = () => {
    const ticketObj = new QueueTicket(demoTicketState);
    const result = ticketObj.completeService();
    
    setDemoTicketState(ticketObj.toJSON());
    setSimulatedLog((prev) => [
      `[${new Date().toLocaleTimeString()}] ticketObj.completeService() => ${
        result.success ? 'SUCCESS' : 'FAILED'
      }: "${result.message}"`,
      ...prev,
    ]);
  };

  const runEncapsulatedCancel = () => {
    const ticketObj = new QueueTicket(demoTicketState);
    const result = ticketObj.cancelTicket('Pembatalan pengguna');
    
    setDemoTicketState(ticketObj.toJSON());
    setSimulatedLog((prev) => [
      `[${new Date().toLocaleTimeString()}] ticketObj.cancelTicket() => ${
        result.success ? 'SUCCESS' : 'FAILED'
      }: "${result.message}"`,
      ...prev,
    ]);
  };

  const resetDemoTicket = () => {
    setDemoTicketState({
      id: 'test-oop-1',
      ticketNumber: 'A-007',
      customerName: 'Ahmad Supardi',
      plateNumber: 'B 7777 OOP',
      motorModel: 'Honda CB150R',
      motorAgeYears: testMotorAge,
      serviceType: testServiceType,
      serviceName: activeServiceDemo.getName(),
      estimatedDuration: activeServiceDemo.calculateEstimatedDuration(testMotorAge),
      notes: 'Suara mesin kasar',
      status: 'WAITING',
      pitNumber: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    setSimulatedLog([]);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-bold mb-4">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Showcase & Dokumentasi Arsitektur OOP (Tugas UAS)</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-3">
          Implementasi <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 bg-clip-text text-transparent">4 Pilar OOP</span>
        </h1>
        <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
          Penjelasan teknis dan pengujian interaktif penerapan Encapsulation, Inheritance, Polymorphism, dan Abstraction pada Sistem Antrian Bengkel.
        </p>
      </div>

      {/* Tabs Switcher */}
      <div className="flex justify-center mb-8">
        <div className="bg-slate-900 p-1.5 rounded-2xl border border-slate-800 flex space-x-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition ${
              activeTab === 'overview'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Penjelasan 4 Pilar OOP
          </button>
          <button
            onClick={() => setActiveTab('interactive')}
            className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center space-x-2 ${
              activeTab === 'interactive'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Interactive Code Sandbox</span>
          </button>
        </div>
      </div>

      {/* TAB 1: OVERVIEW 4 PILAR OOP */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Pilar 1: Encapsulation */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-3 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-2xl">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">1. Encapsulation (Kapsulasi)</h3>
                  <span className="text-xs text-amber-400 font-mono">Class QueueTicket</span>
                </div>
              </div>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-4">
                Class <code className="text-amber-300 bg-slate-950 px-1.5 py-0.5 rounded font-mono">QueueTicket</code> memproteksi (kapsulasi) atribut internal seperti <code className="text-amber-300 bg-slate-950 px-1.5 py-0.5 rounded font-mono">status</code> dan <code className="text-amber-300 bg-slate-950 px-1.5 py-0.5 rounded font-mono">pitNumber</code> dengan akses mutator tertutup.
              </p>
              <ul className="text-xs text-slate-400 space-y-2 mb-4 list-disc pl-4">
                <li>Atribut private tidak bisa di-assign secara langsung dari luar class.</li>
                <li>Method <code className="text-slate-200 bg-slate-950 px-1 rounded font-mono">assignToPit(pitNumber)</code> melakukan validasi bahwa tiket tidak boleh dalam status CANCELLED / COMPLETED.</li>
                <li>Method <code className="text-slate-200 bg-slate-950 px-1 rounded font-mono">completeService()</code> memvalidasi alur perubahan state antrian.</li>
              </ul>
            </div>
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 font-mono text-[11px] text-amber-300/90 overflow-x-auto">
              <pre>{`class QueueTicket {
  private status: TicketStatus;
  private pitNumber: number | null;

  public assignToPit(pit: number) {
    if (this.status === 'COMPLETED') return { success: false };
    this.pitNumber = pit;
    this.status = 'IN_PROGRESS';
    return { success: true };
  }
}`}</pre>
            </div>
          </div>

          {/* Pilar 2: Inheritance */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-3 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-2xl">
                  <GitBranch className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">2. Inheritance (Pewarisan)</h3>
                  <span className="text-xs text-amber-400 font-mono">BaseService → LightService / HeavyService</span>
                </div>
              </div>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-4">
                Abstract class <code className="text-amber-300 bg-slate-950 px-1.5 py-0.5 rounded font-mono">BaseService</code> diwarisi oleh subclass <code className="text-amber-300 bg-slate-950 px-1.5 py-0.5 rounded font-mono">LightService</code> dan <code className="text-amber-300 bg-slate-950 px-1.5 py-0.5 rounded font-mono">HeavyService</code>.
              </p>
              <ul className="text-xs text-slate-400 space-y-2 mb-4 list-disc pl-4">
                <li>Subclass meng-inherit atribut umum: <code className="text-slate-200 bg-slate-950 px-1 rounded font-mono">name</code>, <code className="text-slate-200 bg-slate-950 px-1 rounded font-mono">baseDurationMinutes</code>, <code className="text-slate-200 bg-slate-950 px-1 rounded font-mono">basePrice</code>.</li>
                <li>Menghindari duplikasi kode serta mempermudah pengembangan jenis layanan baru di masa mendatang.</li>
              </ul>
            </div>
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 font-mono text-[11px] text-amber-300/90 overflow-x-auto">
              <pre>{`export abstract class BaseService {
  protected name: string;
  protected baseDurationMinutes: number;
}

export class LightService extends BaseService {
  constructor() { super('Servis Ringan', 'LIGHT', 20, 75000); }
}`}</pre>
            </div>
          </div>

          {/* Pilar 3: Polymorphism */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-3 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-2xl">
                  <Cpu className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">3. Polymorphism (Polimorfisme)</h3>
                  <span className="text-xs text-amber-400 font-mono">Override calculateEstimatedDuration()</span>
                </div>
              </div>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-4">
                Method <code className="text-amber-300 bg-slate-950 px-1.5 py-0.5 rounded font-mono">calculateEstimatedDuration(motorAgeYears)</code> di-override pada subclass dengan logika pengerjaan berbeda.
              </p>
              <ul className="text-xs text-slate-400 space-y-2 mb-4 list-disc pl-4">
                <li><code className="text-slate-200 bg-slate-950 px-1 rounded font-mono">LightService</code>: Durasi tetap 20 menit (atau +5 menit jika motor &gt; 7 tahun).</li>
                <li><code className="text-slate-200 bg-slate-950 px-1 rounded font-mono">HeavyService</code>: Menambah +10 menit per 2 tahun usia motor karena risiko baud karat / keausan komponen.</li>
              </ul>
            </div>
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 font-mono text-[11px] text-amber-300/90 overflow-x-auto">
              <pre>{`// HeavyService Polymorphic Override
public calculateEstimatedDuration(motorAgeYears: number) {
  const ageFactor = Math.floor(motorAgeYears / 2);
  return Math.min(this.baseDurationMinutes + (ageFactor * 10), 150);
}`}</pre>
            </div>
          </div>

          {/* Pilar 4: Abstraction */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-3 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-2xl">
                  <Layers className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">4. Abstraction (Abstraksi)</h3>
                  <span className="text-xs text-amber-400 font-mono">Interface IQueueRepository</span>
                </div>
              </div>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-4">
                Interface <code className="text-amber-300 bg-slate-950 px-1.5 py-0.5 rounded font-mono">IQueueRepository</code> membungkus (abstrak) operasi query Supabase / Prisma ORM dari UI layer.
              </p>
              <ul className="text-xs text-slate-400 space-y-2 mb-4 list-disc pl-4">
                <li>Komponen UI hanya bergantung pada abstraksi repository.</li>
                <li>Sistem dapat bertukar antara Prisma PostgreSQL, Supabase Realtime SDK, atau InMemory store tanpa mengubah komponen tampilan.</li>
              </ul>
            </div>
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 font-mono text-[11px] text-amber-300/90 overflow-x-auto">
              <pre>{`export interface IQueueRepository {
  getAllTickets(): Promise<QueueTicket[]>;
  createTicket(dto: CreateTicketDTO): Promise<QueueTicket>;
  updateTicketStatus(id: string, status: TicketStatus): Promise<QueueTicket>;
}`}</pre>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: INTERACTIVE CODE SANDBOX / TESTER */}
      {activeTab === 'interactive' && (
        <div className="space-y-8">
          <div className="bg-slate-900 border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center space-x-3 mb-6 border-b border-slate-800 pb-4">
              <Sparkles className="w-6 h-6 text-amber-400" />
              <div>
                <h3 className="text-xl font-bold text-white">Live OOP Code Sandbox</h3>
                <p className="text-xs text-slate-400">Uji langsung eksekusi logika 4 Pilar OOP dalam browser!</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Controls Column */}
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-bold text-amber-400 mb-3 flex items-center space-x-2">
                    <Cpu className="w-4 h-4" />
                    <span>Uji Polimorfisme (Estimasi Durasi vs Usia Motor)</span>
                  </h4>

                  <div className="space-y-4 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Usia Motor: <span className="text-amber-400 font-mono font-bold">{testMotorAge} Tahun</span>
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="15"
                        value={testMotorAge}
                        onChange={(e) => setTestMotorAge(parseInt(e.target.value))}
                        className="w-full accent-amber-500 cursor-pointer"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                        <span className="text-slate-400 block font-semibold mb-1">LightService.calculateEstimatedDuration()</span>
                        <span className="text-xl font-black text-amber-400 font-mono">{lightDuration} Menit</span>
                        <span className="text-[10px] text-slate-500 block mt-1">Base: 20 min</span>
                      </div>

                      <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                        <span className="text-slate-400 block font-semibold mb-1">HeavyService.calculateEstimatedDuration()</span>
                        <span className="text-xl font-black text-amber-400 font-mono">{heavyDuration} Menit</span>
                        <span className="text-[10px] text-slate-500 block mt-1">Base: 60 min + {Math.floor(testMotorAge/2)*10} min age bonus</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Encapsulation Mutator Actions */}
                <div>
                  <h4 className="text-sm font-bold text-amber-400 mb-3 flex items-center space-x-2">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Uji Encapsulated State Validation (QueueTicket)</span>
                  </h4>

                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3 text-xs">
                    <div className="flex justify-between items-center bg-slate-900 p-3 rounded-xl border border-slate-800">
                      <div>
                        <span className="text-slate-400 block">Status Tiket Saat Ini:</span>
                        <span className="font-extrabold text-amber-400 font-mono text-sm">{demoTicketState.status}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Pit Mekanik:</span>
                        <span className="font-extrabold text-white font-mono text-sm">Pit {demoTicketState.pitNumber || '-'}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => runEncapsulatedAssign(1)}
                        className="p-2.5 bg-amber-500 text-slate-950 font-bold rounded-xl hover:opacity-90 transition text-center"
                      >
                        assignToPit(1)
                      </button>

                      <button
                        onClick={runEncapsulatedComplete}
                        className="p-2.5 bg-emerald-500 text-slate-950 font-bold rounded-xl hover:opacity-90 transition text-center"
                      >
                        completeService()
                      </button>

                      <button
                        onClick={runEncapsulatedCancel}
                        className="p-2.5 bg-rose-500 text-white font-bold rounded-xl hover:opacity-90 transition text-center text-[11px]"
                      >
                        cancelTicket()
                      </button>
                    </div>

                    <button
                      onClick={resetDemoTicket}
                      className="w-full text-center text-slate-400 hover:text-white underline text-[11px] pt-1"
                    >
                      Reset Instance Tiket Demo
                    </button>
                  </div>
                </div>
              </div>

              {/* Execution Console Output */}
              <div className="flex flex-col">
                <h4 className="text-sm font-bold text-slate-300 mb-3 flex items-center space-x-2">
                  <Code2 className="w-4 h-4 text-amber-400" />
                  <span>Execution Log Console</span>
                </h4>

                <div className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl p-4 font-mono text-[11px] text-emerald-400/90 overflow-y-auto max-h-[360px] space-y-2">
                  <div className="text-slate-500 border-b border-slate-900 pb-2">
                    // Ready for live OOP method executions...
                  </div>

                  {simulatedLog.length === 0 ? (
                    <div className="text-slate-600 italic">Klik tombol di sebelah kiri untuk melihat hasil pengujian state encapsulation.</div>
                  ) : (
                    simulatedLog.map((log, index) => (
                      <div key={index} className="leading-relaxed border-b border-slate-900/60 pb-1">
                        {log}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
