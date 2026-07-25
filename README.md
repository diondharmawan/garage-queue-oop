# 🏍️ Garage Queue System (Sistem Antrian Bengkel Motor MotoSpeed)
> **Tugas UAS Pemrograman Berorientasi Objek (OOP)**  
> Sistem Antrian Bengkel Motor Berbasis Web dengan Real-Time Synchronization & Implementation Showcase 4 Pilar OOP.

---

## 📌 Ringkasan Proyek & Tech Stack

Aplikasi ini dirancang untuk mengelola pendaftaran, alokasi pit mekanik, dan pemantauan status antrian servis sepeda motor secara real-time di ruang tunggu pelanggan.

- **Framework**: Next.js 16 (App Router, TypeScript)
- **Styling**: Tailwind CSS & Lucide React Icons
- **Database & Realtime**: Supabase (PostgreSQL + Realtime WebSockets) & Prisma ORM
- **OOP Architecture**: Pure TypeScript Domain Model Layer in `src/lib/oop/`

---

## 🏛️ Implementasi 4 Pilar OOP (Object-Oriented Programming)

Struktur kode utama OOP terletak di folder `src/lib/oop/`:

### 1. **Encapsulation (Kapsulasi)** - `src/lib/oop/QueueTicket.ts`
* Atribut internal tiket antrian (seperti `status`, `pitNumber`, `estimatedDuration`) diproteksi (private/protected).
* Perubahan state tidak dapat dilakukan secara langsung dari luar class, melainkan wajib melalui mutator terpilih yang memvalidasi *State Machine Transition*:
  * `assignToPit(pitNumber: number)`: Memvalidasi bahwa pit bernilai valid (>0) dan status tiket belum `COMPLETED` / `CANCELLED`.
  * `completeService()`: Memvalidasi bahwa proses pengerjaan hanya bisa diselesaikan jika dalam status aktif.
  * `cancelTicket()`: Mencegah pembatalan pada tiket yang sudah selesai dikerjakan.

### 2. **Inheritance (Pewarisan)** - `src/lib/oop/Services.ts`
* Abstract class `BaseService` menjadi class induk yang menyimpan atribut umum (`name`, `serviceType`, `baseDurationMinutes`, `basePrice`).
* Subclass `LightService` (Servis Ringan & Ganti Oli) dan `HeavyService` (Overhaul & Servis Besar) meng-inherit seluruh properti dasar dari `BaseService`.

### 3. **Polymorphism (Polimorfisme)** - `src/lib/oop/Services.ts`
* Method `calculateEstimatedDuration(motorAgeYears: number)` di-override pada masing-masing subclass:
  * `LightService`: Mengembalikan durasi dasar 20 menit (dengan tambahan +5 menit untuk motor berusia > 7 tahun).
  * `HeavyService`: Meng-override perhitungan estimasi waktu dengan menambahkan faktor usia motor (`baseDuration + Math.floor(motorAgeYears / 2) * 10` menit) untuk memperhitungkan risiko baut aus atau komponen karatan.

### 4. **Abstraction (Abstraksi)** - `src/lib/oop/QueueRepository.ts`
* Pattern `IQueueRepository` menyembunyikan detail kompleks query database (Prisma / Supabase SDK) dari lapisan antarmuka UI.
* Menggunakan *Factory Pattern* (`QueueRepositoryFactory`) sehingga komponen UI dapat memanggil data secara independen tanpa tergantung pada spesifikasi infrastruktur database.

---

## 🌐 Halaman Utama Aplikasi

1. **`/` (Kios Pendaftaran & Cek Status)**
   * Form pendaftaran mandiri pelanggan.
   * Preview langsung perhitungan estimasi waktu pengerjaan via OOP Polymorphism.
   * Pencarian status antrian berdasarkan nomor tiket atau plat nomor kendaraan.
   * Cetak tiket digital virtual.

2. **`/admin` (Dashboard Manajemen Kasir & Mekanik)**
   * Widget statistik real-time (Total Menunggu, Di Pit, Selesai, Dibatalkan).
   * Alokasi nomor Pit Mekanik (Pit 1, Pit 2, Pit 3, dst).
   * Pembaruan status pengerjaan dengan proteksi validasi Encapsulation.

3. **`/display` (Tampilan TV Ruang Tunggu Full Screen)**
   * Desain kontras tinggi & font besar untuk layar monitor ruang tunggu.
   * Split-screen: Pit Pengerjaan Aktif vs Daftar Antrian Menunggu.
   * Sinkronisasi otomatis secara real-time via Supabase WebSocket / Auto-Sync.

4. **`/about-oop` (Showcase & Sandbox 4 Pilar OOP)**
   * Penjelasan visual implementasi 4 pilar OOP.
   * **Interactive Code Sandbox**: Fitur uji coba live eksekusi method OOP & manipulasi state langsung di browser.

---

## 🚀 Panduan Instalasi & Jalankan Lokal

1. **Clone repository**:
   ```bash
   git clone https://github.com/diondharmawan/garage-queue-oop.git
   cd garage-queue-oop
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Setup Environment Variables (Opsional)**:
   Salin `.env.example` menjadi `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

4. **Migrasi Prisma Database (Jika terhubung ke PostgreSQL)**:
   ```bash
   npx prisma db push
   ```

5. **Jalankan Development Server**:
   ```bash
   npm run dev
   ```
   Buka browser di `http://localhost:3000`.

---

## ☁️ Panduan Deployment ke Vercel

1. Push repository ke GitHub.
2. Buka dashboard [Vercel](https://vercel.com) dan pilih **Add New Project** -> Impor repository `garage-queue-oop`.
3. Tambahkan Environment Variables di Vercel:
   * `NEXT_PUBLIC_SUPABASE_URL`
   * `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   * `DATABASE_URL`
   * `DIRECT_URL`
4. Klik **Deploy**.

---
*Dibuat untuk Tugas UAS Pemrograman Berorientasi Objek (OOP)*
