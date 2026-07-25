'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Wrench, Tv, ShieldCheck, Ticket, Sparkles } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();

  // TV Display view manages its own full-screen layout without standard navbar
  if (pathname === '/display') {
    return null;
  }

  const navItems = [
    { href: '/', label: 'Kios Antrian', icon: Ticket },
    { href: '/admin', label: 'Dashboard Admin', icon: Wrench },
    { href: '/display', label: 'Display TV', icon: Tv, isTargetBlank: true },
    { href: '/about-oop', label: 'Showcase OOP', icon: ShieldCheck, highlight: true },
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-900/90 border-b border-slate-800 text-white shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform duration-300">
              <Wrench className="w-6 h-6 text-slate-950 font-bold" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-amber-400 via-orange-300 to-yellow-200 bg-clip-text text-transparent">
                MotoSpeed
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs font-medium px-2 py-0.5 rounded-full bg-slate-800 text-amber-400 border border-amber-500/30">
                UAS OOP Bengkel
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="flex items-center space-x-1 sm:space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  target={item.isTargetBlank ? '_blank' : undefined}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-amber-500/15 text-amber-400 border border-amber-500/40 shadow-sm'
                      : item.highlight
                      ? 'bg-gradient-to-r from-indigo-950 to-slate-900 text-indigo-300 border border-indigo-500/40 hover:border-indigo-400 hover:text-white'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : item.highlight ? 'text-indigo-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.highlight && (
                    <span className="ml-1 px-1.5 py-0.2 text-[10px] uppercase font-bold tracking-wider rounded bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                      4 Pilar
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
