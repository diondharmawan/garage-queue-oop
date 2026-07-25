'use client';

import { useState, useEffect } from 'react';
import { 
  Wrench, 
  Search, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  Bike, 
  User, 
  FileText, 
  Printer, 
  ArrowRight,
  ShieldCheck,
  Zap,
  Sparkles
} from 'lucide-react';
import { CreateTicketDTO, ServiceType, TicketData } from '@/lib/types';
import { createServiceInstance } from '@/lib/oop/Services';

export default function QueueKioskPage() {
  const [activeTab, setActiveTab] = useState<'register' | 'track'>('register');
  
  // Form State
  const [formData, setFormData] = useState<CreateTicketDTO>({
    customerName: '',
    plateNumber: '',
    motorModel: '',
    motorAgeYears: 2,
    serviceType: 'LIGHT',
    notes: '',
  });

  const [loading, setLoading] = useState(false);
  const [ticketResult, setTicketResult] = useState<TicketData | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Track State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState<TicketData | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchNotFound, setSearchNotFound] = useState(false);

  // Computed OOP calculation live for form preview
  const liveServiceInstance = createServiceInstance(formData.serviceType);
  const liveEstimatedDuration = liveServiceInstance.calculateEstimatedDuration(Number(formData.motorAgeYears) || 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setTicketResult(null);

    try {
      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Gagal mendaftarkan antrian');
      }

      setTicketResult(data.data);
      // Reset form
      setFormData({
        customerName: '',
        plateNumber: '',
        motorModel: '',
        motorAgeYears: 2,
        serviceType: 'LIGHT',
        notes: '',
      });
    } catch (err: any) {
      setErrorMessage(err.message || 'Terjadi kesalahan saat pendaftaran.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearchLoading(true);
    setSearchNotFound(false);
    setSearchResult(null);

    try {
      const res = await fetch('/api/tickets');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        const query = searchQuery.trim().toUpperCase();
        const found = data.data.find(
          (t: TicketData) =>
            t.ticketNumber.toUpperCase() === query ||
            t.plateNumber.toUpperCase() === query
        );
        if (found) {
          setSearchResult(found);
        } else {
          setSearchNotFound(true);
        }
      }
    } catch (err) {
      setSearchNotFound(true);
    } finally {
      setSearchLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 flex flex-col justify-between">
      {/* Header Hero Banner */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Kios Mandiri Pendaftaran & Cek Status Antrian</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-3">
          Bengkel Motor <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">MotoSpeed</span>
        </h1>
        <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
          Ambil nomor tiket antrian secara mandiri atau lakukan pelacakan status perbaikan sepeda motor Anda secara real-time.
        </p>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex justify-center mb-8">
        <div className="bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 flex space-x-2 shadow-inner">
          <button
            onClick={() => setActiveTab('register')}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl text-sm font-bold transition-all duration-200 ${
              activeTab === 'register'
                ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 shadow-lg shadow-orange-500/25'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Ambil Antrian Baru</span>
          </button>

          <button
            onClick={() => setActiveTab('track')}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl text-sm font-bold transition-all duration-200 ${
              activeTab === 'track'
                ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 shadow-lg shadow-orange-500/25'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>Cek Status Antrian</span>
          </button>
        </div>
      </div>

      {/* TAB CONTENT 1: REGISTRATION FORM */}
      {activeTab === 'register' && (
        <div className="max-w-2xl mx-auto w-full">
          {/* Created Ticket Dialog */}
          {ticketResult ? (
            <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden animate-pulse-glow">
              <div className="absolute top-0 right-0 p-6 opacity-10">
                <Wrench className="w-40 h-40 text-emerald-400" />
              </div>

              <div className="text-center mb-6">
                <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-3 border border-emerald-500/30">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-extrabold text-white">Tiket Antrian Berhasil Dibuat!</h3>
                <p className="text-slate-400 text-xs sm:text-sm">Silakan simpan nomor tiket antrian Anda.</p>
              </div>

              {/* Digital Ticket Body */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 mb-6 shadow-inner text-center">
                <div className="text-xs uppercase tracking-widest font-semibold text-slate-400 mb-1">Nomor Antrian Anda</div>
                <div className="text-5xl font-black tracking-wider text-amber-400 my-2 font-mono">
                  {ticketResult.ticketNumber}
                </div>
                <div className="inline-block px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-4">
                  {ticketResult.serviceName}
                </div>

                <div className="grid grid-cols-2 gap-4 text-left border-t border-slate-800 pt-4 text-xs sm:text-sm">
                  <div>
                    <span className="text-slate-500 block">Nama Pelanggan:</span>
                    <span className="font-semibold text-white">{ticketResult.customerName}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Plat Nomor:</span>
                    <span className="font-semibold text-amber-300 font-mono">{ticketResult.plateNumber}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Motor & Usia:</span>
                    <span className="font-semibold text-white">{ticketResult.motorModel} ({ticketResult.motorAgeYears} Thn)</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Est. Durasi Pengerjaan:</span>
                    <span className="font-bold text-amber-400 flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 mr-1" />
                      {ticketResult.estimatedDuration} Menit
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => window.print()}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center space-x-2 border border-slate-700 transition"
                >
                  <Printer className="w-4 h-4" />
                  <span>Cetak Tiket Digital</span>
                </button>
                <button
                  onClick={() => setTicketResult(null)}
                  className="flex-1 bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 font-bold py-3 px-4 rounded-xl flex items-center justify-center space-x-2 hover:opacity-90 transition"
                >
                  <span>Daftar Antrian Lagi</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-sm space-y-6">
              {errorMessage && (
                <div className="p-4 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs sm:text-sm rounded-xl flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white flex items-center space-x-2 border-b border-slate-800 pb-3">
                  <User className="w-5 h-5 text-amber-400" />
                  <span>1. Informasi Pelanggan & Motor</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Nama Lengkap Pelanggan *</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Budi Santoso"
                      value={formData.customerName}
                      onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Plat Nomor Kendaraan *</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: B 1234 XYZ"
                      value={formData.plateNumber}
                      onChange={(e) => setFormData({ ...formData, plateNumber: e.target.value.toUpperCase() })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-amber-300 font-mono uppercase focus:outline-none focus:border-amber-500 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Merk & Tipe Motor *</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Honda Vario 150"
                      value={formData.motorModel}
                      onChange={(e) => setFormData({ ...formData, motorModel: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Usia Motor (Tahun) *</label>
                    <input
                      type="number"
                      min="0"
                      max="30"
                      required
                      value={formData.motorAgeYears}
                      onChange={(e) => setFormData({ ...formData, motorAgeYears: Math.max(0, parseInt(e.target.value) || 0) })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 transition"
                    />
                  </div>
                </div>
              </div>

              {/* Service Selection & OOP Polymorphism Live Demo Card */}
              <div className="space-y-4 pt-2">
                <h3 className="text-lg font-bold text-white flex items-center space-x-2 border-b border-slate-800 pb-3">
                  <Wrench className="w-5 h-5 text-amber-400" />
                  <span>2. Pilih Jenis Perbaikan</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label
                    onClick={() => setFormData({ ...formData, serviceType: 'LIGHT' })}
                    className={`cursor-pointer p-4 rounded-2xl border transition-all ${
                      formData.serviceType === 'LIGHT'
                        ? 'bg-amber-500/10 border-amber-500 text-white shadow-md'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      <div className={`p-2 rounded-xl ${formData.serviceType === 'LIGHT' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300'}`}>
                        <Zap className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-bold text-white text-sm">Servis Ringan</div>
                        <div className="text-xs text-slate-400">Tune Up & Ganti Oli</div>
                      </div>
                    </div>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                      Pemeriksaan standar, penggantian oli mesin & penyesuaian komponen dasar.
                    </p>
                  </label>

                  <label
                    onClick={() => setFormData({ ...formData, serviceType: 'HEAVY' })}
                    className={`cursor-pointer p-4 rounded-2xl border transition-all ${
                      formData.serviceType === 'HEAVY'
                        ? 'bg-amber-500/10 border-amber-500 text-white shadow-md'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      <div className={`p-2 rounded-xl ${formData.serviceType === 'HEAVY' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300'}`}>
                        <Wrench className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-bold text-white text-sm">Servis Berat</div>
                        <div className="text-xs text-slate-400">Overhaul / CVT Repair</div>
                      </div>
                    </div>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                      Perbaikan mendalam mesin/CVT. Estimasi durasi disesuaikan dengan usia motor.
                    </p>
                  </label>
                </div>

                {/* Live OOP Calculation Box */}
                <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 flex items-center justify-between text-xs sm:text-sm">
                  <div className="flex items-center space-x-2">
                    <ShieldCheck className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                    <div>
                      <span className="text-indigo-300 font-semibold block">Calculated via OOP Polymorphism</span>
                      <span className="text-slate-400 text-xs">
                        Class {formData.serviceType === 'HEAVY' ? 'HeavyService' : 'LightService'}.calculateEstimatedDuration({formData.motorAgeYears} thn)
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400 text-xs block">Estimasi Pengerjaan:</span>
                    <span className="text-lg font-black text-amber-400 font-mono">
                      {liveEstimatedDuration} Menit
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Catatan Keluhan / Permintaan Khusus (Opsional)</label>
                  <textarea
                    rows={3}
                    placeholder="Contoh: Suara mesin kasar saat rpm tinggi, ganti oli sekalian..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 transition resize-none"
                  ></textarea>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-slate-950 font-extrabold py-4 px-6 rounded-2xl shadow-xl shadow-orange-500/20 hover:opacity-95 transition disabled:opacity-50 text-base"
              >
                {loading ? 'Memproses Pendaftaran Tiket...' : 'Cetak & Dapatkan Tiket Antrian'}
              </button>
            </form>
          )}
        </div>
      )}

      {/* TAB CONTENT 2: TRACK QUEUE STATUS */}
      {activeTab === 'track' && (
        <div className="max-w-xl mx-auto w-full">
          <form onSubmit={handleSearch} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl mb-6">
            <label className="block text-xs font-semibold text-slate-300 mb-2">Cari berdasarkan Nomor Tiket atau Plat Nomor</label>
            <div className="flex space-x-2">
              <input
                type="text"
                required
                placeholder="Misal: A-001 atau B 1234 XYZ"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white uppercase font-mono focus:outline-none focus:border-amber-500 transition"
              />
              <button
                type="submit"
                disabled={searchLoading}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 py-3 rounded-xl transition flex items-center space-x-2"
              >
                <Search className="w-4 h-4" />
                <span>Cari</span>
              </button>
            </div>
          </form>

          {searchNotFound && (
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl text-center">
              <AlertCircle className="w-12 h-12 text-slate-500 mx-auto mb-2" />
              <h4 className="text-lg font-bold text-white mb-1">Tiket Tidak Ditemukan</h4>
              <p className="text-slate-400 text-xs">Pastikan nomor tiket (A-001) atau plat nomor kendaraan Anda sudah benar.</p>
            </div>
          )}

          {searchResult && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
                <div>
                  <span className="text-xs text-slate-400 block">Nomor Antrian</span>
                  <span className="text-3xl font-black text-amber-400 font-mono">{searchResult.ticketNumber}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 block">Plat Nomor</span>
                  <span className="text-sm font-bold text-slate-200 font-mono">{searchResult.plateNumber}</span>
                </div>
              </div>

              {/* Status Stepper */}
              <div className="mb-6">
                <div className="text-xs font-semibold text-slate-400 mb-3">Status Pengerjaan Saat Ini:</div>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div
                    className={`p-3 rounded-xl border ${
                      searchResult.status === 'WAITING'
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                        : searchResult.status === 'IN_PROGRESS' || searchResult.status === 'COMPLETED'
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                        : 'bg-slate-950 border-slate-800 text-slate-600'
                    }`}
                  >
                    1. Menunggu
                  </div>
                  <div
                    className={`p-3 rounded-xl border ${
                      searchResult.status === 'IN_PROGRESS'
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold animate-pulse'
                        : searchResult.status === 'COMPLETED'
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                        : 'bg-slate-950 border-slate-800 text-slate-600'
                    }`}
                  >
                    2. Di Pit {searchResult.pitNumber || '-'}
                  </div>
                  <div
                    className={`p-3 rounded-xl border ${
                      searchResult.status === 'COMPLETED'
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-600'
                    }`}
                  >
                    3. Selesai
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs sm:text-sm bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <div className="flex justify-between">
                  <span className="text-slate-400">Nama Pelanggan:</span>
                  <span className="font-semibold text-white">{searchResult.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Motor & Usia:</span>
                  <span className="font-semibold text-white">{searchResult.motorModel} ({searchResult.motorAgeYears} Thn)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Jenis Perbaikan:</span>
                  <span className="font-semibold text-amber-400">{searchResult.serviceName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Estimasi Durasi:</span>
                  <span className="font-bold text-amber-400">{searchResult.estimatedDuration} Menit</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Footer Info */}
      <div className="mt-12 text-center text-xs text-slate-500 border-t border-slate-900 pt-6">
        Sistem Antrian Bengkel MotoSpeed &bull; Tugas UAS Pemrograman Berorientasi Objek (OOP) &bull; Built with Next.js 16 & Supabase Realtime
      </div>
    </div>
  );
}
