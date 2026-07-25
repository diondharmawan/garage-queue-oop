'use client';

import { useState, useEffect } from 'react';
import { 
  Wrench, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Play, 
  Search, 
  Filter, 
  RotateCcw, 
  Trash2, 
  UserCheck, 
  Layers, 
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { TicketData, TicketStatus } from '@/lib/types';

export default function AdminDashboardPage() {
  const [tickets, setTickets] = useState<TicketData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Pit Assignment Modal state
  const [selectedTicket, setSelectedTicket] = useState<TicketData | null>(null);
  const [pitInput, setPitInput] = useState<number>(1);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/tickets');
      const data = await res.json();
      if (data.success) {
        setTickets(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch tickets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();

    // Listen to custom local event for immediate reactivity
    const handleUpdate = () => fetchTickets();
    window.addEventListener('queue-updated', handleUpdate);
    return () => window.removeEventListener('queue-updated', handleUpdate);
  }, []);

  const handleUpdateStatus = async (id: string, status: TicketStatus, pitNumber?: number | null) => {
    setActionError(null);
    setActionSuccess(null);

    try {
      const res = await fetch(`/api/tickets/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, pitNumber }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Gagal memperbarui status antrian');
      }

      setActionSuccess(data.message || `Status tiket berhasil diubah menjadi ${status}`);
      setSelectedTicket(null);
      fetchTickets();
    } catch (err: any) {
      setActionError(err.message || 'Gagal memperbarui tiket');
    }
  };

  const handleDeleteTicket = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus tiket antrian ini?')) return;
    try {
      const res = await fetch(`/api/tickets/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchTickets();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Stats calculation
  const totalWaiting = tickets.filter(t => t.status === 'WAITING').length;
  const totalInProgress = tickets.filter(t => t.status === 'IN_PROGRESS').length;
  const totalCompleted = tickets.filter(t => t.status === 'COMPLETED').length;
  const totalCancelled = tickets.filter(t => t.status === 'CANCELLED').length;

  // Filtered tickets
  const filteredTickets = tickets.filter(ticket => {
    const matchesStatus = filterStatus === 'ALL' || ticket.status === filterStatus;
    const q = searchQuery.toLowerCase();
    const matchesQuery =
      !q ||
      ticket.ticketNumber.toLowerCase().includes(q) ||
      ticket.customerName.toLowerCase().includes(q) ||
      ticket.plateNumber.toLowerCase().includes(q) ||
      ticket.motorModel.toLowerCase().includes(q);
    return matchesStatus && matchesQuery;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 pb-6 border-b border-slate-800 gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold mb-2">
            <UserCheck className="w-3.5 h-3.5" />
            <span>Dashboard Manajemen Kasir & Mekanik</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Kelola Antrian & Pit Mekanik</h1>
          <p className="text-slate-400 text-xs sm:text-sm">Alokasikan pit pengerjaan dan perbarui status servis secara efisien dengan validasi Encapsulation.</p>
        </div>

        <button
          onClick={fetchTickets}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 text-xs font-bold transition"
        >
          <RotateCcw className="w-4 h-4 text-amber-400" />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Action Notification Banners */}
      {actionError && (
        <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs sm:text-sm rounded-2xl flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{actionError}</span>
          </div>
          <button onClick={() => setActionError(null)} className="text-xs font-bold underline">Tutup</button>
        </div>
      )}

      {actionSuccess && (
        <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs sm:text-sm rounded-2xl flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <span>{actionSuccess}</span>
          </div>
          <button onClick={() => setActionSuccess(null)} className="text-xs font-bold underline">Tutup</button>
        </div>
      )}

      {/* Realtime Statistics Widgets */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold text-slate-400">Menunggu (Waiting)</span>
            <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white font-mono">{totalWaiting}</div>
          <div className="text-[11px] text-slate-500 mt-1">Belum masuk pit pengerjaan</div>
        </div>

        <div className="bg-slate-900 border border-amber-500/30 p-5 rounded-2xl shadow-lg relative overflow-hidden">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold text-amber-400">Sedang Diproses (Pit)</span>
            <div className="p-2 bg-amber-500 text-slate-950 rounded-xl font-bold">
              <Wrench className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-amber-400 font-mono">{totalInProgress}</div>
          <div className="text-[11px] text-slate-400 mt-1">Dalam proses mekanik</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold text-slate-400">Selesai (Completed)</span>
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-emerald-400 font-mono">{totalCompleted}</div>
          <div className="text-[11px] text-slate-500 mt-1">Siap diambil pelanggan</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold text-slate-400">Dibatalkan</span>
            <div className="p-2 bg-slate-800 text-slate-500 rounded-xl">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-400 font-mono">{totalCancelled}</div>
          <div className="text-[11px] text-slate-500 mt-1">Tiket dibatalkan</div>
        </div>
      </div>

      {/* Filter Bar & Controls */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl mb-6 flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
          <input
            type="text"
            placeholder="Cari Tiket, Nama, Plat Nomor, atau Motor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500 transition"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500 transition"
          >
            <option value="ALL">Semua Status</option>
            <option value="WAITING">WAITING (Menunggu)</option>
            <option value="IN_PROGRESS">IN_PROGRESS (Di Pit)</option>
            <option value="COMPLETED">COMPLETED (Selesai)</option>
            <option value="CANCELLED">CANCELLED (Dibatalkan)</option>
          </select>
        </div>
      </div>

      {/* Queue Tickets Table / Cards */}
      {loading ? (
        <div className="text-center py-16 bg-slate-900 border border-slate-800 rounded-3xl">
          <div className="animate-spin w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full mx-auto mb-3"></div>
          <p className="text-slate-400 text-xs font-semibold">Memuat data antrian...</p>
        </div>
      ) : filteredTickets.length === 0 ? (
        <div className="text-center py-16 bg-slate-900 border border-slate-800 rounded-3xl">
          <Layers className="w-12 h-12 text-slate-600 mx-auto mb-2" />
          <h3 className="text-lg font-bold text-white mb-1">Tidak Ada Tiket Antrian</h3>
          <p className="text-slate-500 text-xs">Tidak ditemukan tiket yang sesuai dengan pencarian atau filter Anda.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTickets.map((ticket) => (
            <div
              key={ticket.id}
              className={`bg-slate-900 border rounded-2xl p-5 shadow-lg flex flex-col justify-between transition-all ${
                ticket.status === 'IN_PROGRESS'
                  ? 'border-amber-500/50 shadow-amber-500/10'
                  : ticket.status === 'COMPLETED'
                  ? 'border-emerald-500/30'
                  : ticket.status === 'CANCELLED'
                  ? 'border-slate-800 opacity-60'
                  : 'border-slate-800'
              }`}
            >
              <div>
                {/* Header Ticket Card */}
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className="text-2xl font-black text-amber-400 font-mono tracking-wider block">
                      {ticket.ticketNumber}
                    </span>
                    <span className="text-xs font-bold text-slate-200 font-mono">
                      {ticket.plateNumber}
                    </span>
                  </div>

                  {/* Status Badge */}
                  <div className="text-right">
                    {ticket.status === 'WAITING' && (
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                        WAITING
                      </span>
                    )}
                    {ticket.status === 'IN_PROGRESS' && (
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500 text-slate-950 border border-amber-400">
                        PIT {ticket.pitNumber || 1}
                      </span>
                    )}
                    {ticket.status === 'COMPLETED' && (
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        SELESAI
                      </span>
                    )}
                    {ticket.status === 'CANCELLED' && (
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-800 text-slate-500 border border-slate-700">
                        DIBATALKAN
                      </span>
                    )}
                  </div>
                </div>

                {/* Customer Details */}
                <div className="space-y-1.5 text-xs border-t border-b border-slate-800/80 py-3 mb-4">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Pelanggan:</span>
                    <span className="font-semibold text-white">{ticket.customerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Motor & Usia:</span>
                    <span className="font-semibold text-slate-300">{ticket.motorModel} ({ticket.motorAgeYears} Thn)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Jenis Perbaikan:</span>
                    <span className="font-semibold text-amber-400">{ticket.serviceName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Estimasi Durasi:</span>
                    <span className="font-semibold text-slate-300">{ticket.estimatedDuration} Menit</span>
                  </div>
                  {ticket.notes && (
                    <div className="pt-1">
                      <span className="text-slate-500 block text-[11px]">Catatan:</span>
                      <span className="text-slate-300 italic text-[11px] line-clamp-2">"{ticket.notes}"</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                {ticket.status === 'WAITING' && (
                  <button
                    onClick={() => {
                      setSelectedTicket(ticket);
                      setPitInput(1);
                    }}
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center space-x-1.5 hover:opacity-90 transition"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Masuk Pit Mekanik</span>
                  </button>
                )}

                {ticket.status === 'IN_PROGRESS' && (
                  <button
                    onClick={() => handleUpdateStatus(ticket.id, 'COMPLETED')}
                    className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center space-x-1.5 transition"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Tandai Selesai (Completed)</span>
                  </button>
                )}

                <div className="flex space-x-2">
                  {ticket.status !== 'CANCELLED' && ticket.status !== 'COMPLETED' && (
                    <button
                      onClick={() => handleUpdateStatus(ticket.id, 'CANCELLED')}
                      className="flex-1 bg-slate-950 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border border-slate-800 hover:border-rose-500/40 font-semibold py-1.5 px-2 rounded-xl text-[11px] transition text-center"
                    >
                      Batalkan
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteTicket(ticket.id)}
                    className="p-1.5 bg-slate-950 text-slate-500 hover:text-rose-400 border border-slate-800 hover:border-rose-500/40 rounded-xl transition"
                    title="Hapus Tiket"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Assign Pit Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-2">Alokasikan Pit Mekanik</h3>
            <p className="text-xs text-slate-400 mb-4">
              Pilih nomor Pit untuk tiket <strong className="text-amber-400 font-mono">{selectedTicket.ticketNumber}</strong> ({selectedTicket.customerName}).
            </p>

            <div className="space-y-4 mb-6">
              <label className="block text-xs font-semibold text-slate-300">Pilih Pit Mekanik (1 - 5):</label>
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3, 4, 5].map((pitNum) => (
                  <button
                    key={pitNum}
                    type="button"
                    onClick={() => setPitInput(pitNum)}
                    className={`py-3 rounded-xl text-sm font-extrabold border transition ${
                      pitInput === pitNum
                        ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    Pit {pitNum}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setSelectedTicket(null)}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition"
              >
                Batal
              </button>
              <button
                onClick={() => handleUpdateStatus(selectedTicket.id, 'IN_PROGRESS', pitInput)}
                className="flex-1 bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 font-bold py-2.5 px-4 rounded-xl text-xs hover:opacity-95 transition"
              >
                Konfirmasi & Mulai
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
