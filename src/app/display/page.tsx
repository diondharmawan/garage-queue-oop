'use client';

import { useState, useEffect } from 'react';
import { 
  Tv, 
  Wrench, 
  Clock, 
  CheckCircle2, 
  Volume2, 
  Sparkles, 
  Radio,
  ChevronRight,
  Flame
} from 'lucide-react';
import { TicketData } from '@/lib/types';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export default function DisplayTVPage() {
  const [tickets, setTickets] = useState<TicketData[]>([]);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [realtimeConnected, setRealtimeConnected] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const fetchTickets = async () => {
    try {
      const res = await fetch('/api/tickets');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setTickets(data.data);
        setLastUpdated(new Date().toLocaleTimeString('id-ID'));
      }
    } catch (err) {
      console.error('Display TV fetch error:', err);
    }
  };

  useEffect(() => {
    fetchTickets();

    // Live clock timer
    const clockInterval = setInterval(() => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }) + ' WIB'
      );
    }, 1000);

    // Setup Supabase Realtime Subscription if configured
    let channel: any = null;
    if (isSupabaseConfigured()) {
      channel = supabase
        .channel('public:Ticket')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'Ticket' },
          (payload) => {
            console.log('Realtime change received on Display TV:', payload);
            fetchTickets();
          }
        )
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            setRealtimeConnected(true);
          }
        });
    }

    // Polling fallback to guarantee instant screen updates every 2.5 seconds
    const pollInterval = setInterval(() => {
      fetchTickets();
    }, 2500);

    // Custom local event listener
    const handleLocalUpdate = () => fetchTickets();
    window.addEventListener('queue-updated', handleLocalUpdate);

    return () => {
      clearInterval(clockInterval);
      clearInterval(pollInterval);
      window.removeEventListener('queue-updated', handleLocalUpdate);
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, []);

  // Filter in progress pit tickets vs waiting list
  const inProgressTickets = tickets.filter((t) => t.status === 'IN_PROGRESS');
  const waitingTickets = tickets.filter((t) => t.status === 'WAITING');
  const recentlyCompleted = tickets
    .filter((t) => t.status === 'COMPLETED')
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between select-none overflow-hidden font-sans">
      {/* Top Header Bar for TV Display */}
      <header className="bg-slate-900 border-b border-amber-500/40 px-6 py-4 flex items-center justify-between shadow-2xl">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-gradient-to-tr from-amber-500 to-orange-600 rounded-2xl text-slate-950 shadow-lg shadow-orange-500/30">
            <Tv className="w-8 h-8 font-black" />
          </div>
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white uppercase">
                MOTOSPEED <span className="text-amber-400">TV DISPLAY</span>
              </h1>
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold animate-pulse">
                <Radio className="w-3.5 h-3.5" />
                <span>{realtimeConnected ? 'Supabase WebSocket LIVE' : 'Realtime Sync Active'}</span>
              </span>
            </div>
            <p className="text-xs text-slate-400">Informasi Antrian Ruang Tunggu Pelanggan &bull; Auto Sync</p>
          </div>
        </div>

        {/* Live Clock & Timestamp */}
        <div className="text-right">
          <div className="text-3xl sm:text-4xl font-black font-mono tracking-wider text-amber-400 drop-shadow-md">
            {currentTime || '12:00:00 WIB'}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            Terakhir Diperbarui: <span className="text-slate-200 font-mono">{lastUpdated || 'Baru Saja'}</span>
          </div>
        </div>
      </header>

      {/* Main TV Split-Screen Layout */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 overflow-hidden">
        {/* LEFT COLUMN: PIT MEKANIK SEDANG DIPROSES (8 cols) */}
        <section className="lg:col-span-7 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl sm:text-2xl font-black text-amber-400 uppercase tracking-wide flex items-center space-x-2">
              <Flame className="w-6 h-6 text-amber-500" />
              <span>SEDANG DIPROSES DI PIT MEKANIK</span>
            </h2>
            <span className="text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-1 rounded-full">
              {inProgressTickets.length} Unit Motor
            </span>
          </div>

          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {inProgressTickets.length === 0 ? (
              <div className="col-span-2 bg-slate-900/60 border border-dashed border-slate-800 rounded-3xl flex flex-col items-center justify-center p-8 text-center">
                <Wrench className="w-16 h-16 text-slate-700 mb-3" />
                <h3 className="text-lg font-bold text-slate-400">Pit Mekanik Sedang Kosong</h3>
                <p className="text-xs text-slate-600">Menunggu unit berikutnya dipanggil oleh kasir/mekanik.</p>
              </div>
            ) : (
              inProgressTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="bg-slate-900 border-2 border-amber-500/80 rounded-3xl p-6 shadow-2xl flex flex-col justify-between relative overflow-hidden animate-pulse-glow"
                >
                  {/* Pit Number Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="px-4 py-1.5 rounded-2xl bg-amber-500 text-slate-950 font-black text-lg tracking-wider shadow-md">
                      PIT {ticket.pitNumber || 1}
                    </div>
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
                      SEDANG SERVIS
                    </span>
                  </div>

                  {/* Big Ticket Number */}
                  <div className="my-2">
                    <div className="text-5xl sm:text-6xl font-black tracking-wider text-amber-400 font-mono drop-shadow-lg">
                      {ticket.ticketNumber}
                    </div>
                    <div className="text-lg font-extrabold text-white font-mono mt-1">
                      {ticket.plateNumber}
                    </div>
                  </div>

                  {/* Vehicle & Customer Info */}
                  <div className="border-t border-slate-800 pt-3 mt-3 space-y-1">
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="text-slate-400">Pemilik:</span>
                      <span className="font-bold text-slate-100">{ticket.customerName}</span>
                    </div>
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="text-slate-400">Motor:</span>
                      <span className="font-semibold text-slate-300">{ticket.motorModel}</span>
                    </div>
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="text-slate-400">Perbaikan:</span>
                      <span className="font-semibold text-amber-300">{ticket.serviceName}</span>
                    </div>
                    <div className="flex justify-between text-xs sm:text-sm pt-1">
                      <span className="text-slate-400">Est. Waktu:</span>
                      <span className="font-extrabold text-amber-400 flex items-center">
                        <Clock className="w-3.5 h-3.5 mr-1" />
                        {ticket.estimatedDuration} Menit
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* RIGHT COLUMN: DAFTAR ANTRIAN BERIKUTNYA / WAITING LIST (5 cols) */}
        <section className="lg:col-span-5 flex flex-col space-y-6">
          {/* Waiting List */}
          <div className="flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-black text-slate-200 uppercase tracking-wide flex items-center space-x-2">
                <Clock className="w-5 h-5 text-amber-400" />
                <span>ANTRIAN BERIKUTNYA</span>
              </h2>
              <span className="text-xs font-bold bg-slate-800 text-slate-300 px-3 py-1 rounded-full border border-slate-700">
                {waitingTickets.length} Antrian
              </span>
            </div>

            <div className="flex-1 bg-slate-900 border border-slate-800 rounded-3xl p-4 space-y-3 overflow-y-auto max-h-[420px]">
              {waitingTickets.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-xs">
                  Tidak ada antrian dalam daftar tunggu.
                </div>
              ) : (
                waitingTickets.map((ticket, index) => (
                  <div
                    key={ticket.id}
                    className="bg-slate-950 border border-slate-800/80 rounded-2xl p-4 flex items-center justify-between hover:border-amber-500/40 transition"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 font-bold flex items-center justify-center text-xs">
                        #{index + 1}
                      </div>
                      <div>
                        <div className="text-2xl font-black text-amber-400 font-mono tracking-wider">
                          {ticket.ticketNumber}
                        </div>
                        <div className="text-xs font-bold text-slate-300 font-mono">
                          {ticket.plateNumber} &bull; {ticket.customerName}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        {ticket.serviceName}
                      </span>
                      <span className="text-[11px] text-slate-500 block mt-1">
                        Est. {ticket.estimatedDuration} min
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recently Completed Ticker */}
          <div>
            <h3 className="text-xs font-extrabold text-emerald-400 uppercase tracking-widest mb-2 flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>BARUSAN SELESAI (SIAP AMBIL)</span>
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {recentlyCompleted.length === 0 ? (
                <div className="col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-3 text-center text-xs text-slate-600">
                  Belum ada servis selesai.
                </div>
              ) : (
                recentlyCompleted.map((t) => (
                  <div key={t.id} className="bg-slate-900 border border-emerald-500/30 rounded-xl p-3 text-center">
                    <div className="text-lg font-black text-emerald-400 font-mono">{t.ticketNumber}</div>
                    <div className="text-[11px] font-bold text-slate-300 font-mono truncate">{t.plateNumber}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Ticker Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 px-6 py-3 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Mohon perhatikan nomor tiket antrian & panggilan suara di layar ini.</span>
        </div>
        <div className="font-mono text-slate-500">Bengkel MotoSpeed &bull; UAS OOP Bengkel</div>
      </footer>
    </div>
  );
}
