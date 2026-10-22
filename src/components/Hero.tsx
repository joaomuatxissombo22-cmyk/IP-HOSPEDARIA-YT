import React from 'react';
import { useApp } from '../context/AppContext';
import { MapPin, Calendar, Users, Home, Search, ArrowRight, Sparkles, ShieldCheck, Zap } from 'lucide-react';

export const Hero: React.FC = () => {
  const { 
    searchCriteria, 
    setSearchCriteria, 
    setCurrentView, 
    setActiveModal, 
    siteSettings 
  } = useApp();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentView('accommodations');
    setTimeout(() => {
      const el = document.getElementById('alojamentos-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const destinations = [
    'Hospedaria ZEMAN (Rotunda do Fubu / Talatona)',
    'Talatona — Zona Sul',
    'Todas as Unidades ZEMAN',
  ];

  return (
    <div className="relative min-h-[92vh] flex flex-col justify-between pt-32 pb-12 overflow-hidden bg-slate-950">
      
      {/* Background with warm Angolan hospitality image and dark gradient with emerald accents */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=2000&q=85"
          alt="Hospedaria ZEMAN Trading & Services"
          className="w-full h-full object-cover object-center transform scale-105"
        />
        {/* Gradients incorporating ZEMAN's dark slate and deep emerald green glow */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-emerald-950/40 to-transparent" />
      </div>

      {/* Main Hero Content matching poster headline & layout */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full my-auto">
        <div className="max-w-3xl">
          
          {/* NOSSO SITE pill badge matching poster */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-600 text-white text-xs font-black uppercase tracking-[0.2em] mb-6 shadow-lg shadow-emerald-950/60">
            <Sparkles className="w-3.5 h-3.5" />
            <span>NOSSO SITE OFICIAL</span>
          </div>

          {/* Big Bold Headline directly from the flyer */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white leading-[1.06] tracking-tight mb-5 font-sans">
            TUDO O QUE PRECISA, <br className="hidden sm:inline" />
            <span className="text-emerald-400">EM UM SÓ LUGAR!</span>
          </h1>

          {/* Subtitle from the flyer */}
          <p className="text-lg sm:text-2xl text-slate-100 font-medium mb-3">
            Mais praticidade, segurança e comodidade para si.
          </p>

          <p className="text-sm sm:text-base text-slate-300 font-light leading-relaxed mb-6 max-w-2xl">
            <strong>Hospedaria e Restauração ZEMAN</strong> na Rotunda do Fubu (sentido Talatona). Quartos climatizados com ar condicionado, energia ininterrupta com <strong>gerador 24h</strong>, água corrente pressurizada, TV DStv/ZAP e parqueamento fechado com segurança.
          </p>

          {/* Feature Badges from Hospedaria Angolana */}
          <div className="flex flex-wrap items-center gap-3 mb-8 text-xs text-emerald-200">
            <span className="flex items-center gap-1.5 bg-emerald-950/80 border border-emerald-700/60 px-3 py-1.5 rounded-lg">
              <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>Gerador Próprio 24h (Sem Falhas de Luz)</span>
            </span>
            <span className="flex items-center gap-1.5 bg-emerald-950/80 border border-emerald-700/60 px-3 py-1.5 rounded-lg">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Parqueamento Fechado com Guarita</span>
            </span>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => setActiveModal('booking')}
              className="px-7 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider shadow-xl shadow-emerald-900/50 transition-all duration-200 transform hover:-translate-y-0.5 flex items-center gap-2 cursor-pointer"
            >
              <span>Reservar Quarto Agora</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                const el = document.getElementById('alojamentos-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-6 py-3.5 rounded-full bg-white text-slate-950 font-bold text-xs uppercase tracking-wider hover:bg-slate-100 shadow-xl transition-all duration-200 flex items-center gap-2 cursor-pointer"
            >
              <span>Ver Quartos & Tarifas</span>
              <span>↓</span>
            </button>
          </div>

        </div>
      </div>

      {/* Floating Horizontal Search Bar */}
      <div id="search-bar-widget" className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-10">
        
        {/* Decorative slogan from flyer */}
        <div className="flex justify-between items-end px-2 mb-2">
          <div className="text-[11px] uppercase tracking-wider text-emerald-300 font-bold hidden sm:block">
            RESERVAS ONLINE • HOTELARIA E RESTAURAÇÃO
          </div>
          <div className="font-handwriting text-2xl sm:text-3xl text-emerald-300 drop-shadow flex items-center gap-1.5 rotate-[-1deg]">
            <span>{siteSettings.tagline}</span>
            <span className="text-emerald-400">♡</span>
          </div>
        </div>

        {/* Search Bar Container */}
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/60 p-3 sm:p-4 text-slate-800">
          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 items-center">
            
            {/* Field 1: Destination */}
            <div className="p-2.5 rounded-xl hover:bg-slate-50 transition-colors border-b sm:border-b-0 sm:border-r border-slate-200">
              <label className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-800 uppercase tracking-wider mb-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span>Localização / Unidade</span>
              </label>
              <select
                value={searchCriteria.destination}
                onChange={(e) => setSearchCriteria({ ...searchCriteria, destination: e.target.value })}
                className="w-full bg-transparent text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none cursor-pointer truncate"
              >
                {destinations.map((d) => (
                  <option key={d} value={d} className="text-slate-900">
                    {d}
                  </option>
                ))}
              </select>
            </div>

            {/* Field 2: Check-in */}
            <div className="p-2.5 rounded-xl hover:bg-slate-50 transition-colors border-b sm:border-b-0 sm:border-r border-slate-200">
              <label className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-800 uppercase tracking-wider mb-1">
                <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                <span>Data de Entrada</span>
              </label>
              <input
                type="date"
                value={searchCriteria.checkIn}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setSearchCriteria({ ...searchCriteria, checkIn: e.target.value })}
                className="w-full bg-transparent text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none cursor-pointer"
              />
            </div>

            {/* Field 3: Check-out */}
            <div className="p-2.5 rounded-xl hover:bg-slate-50 transition-colors border-b sm:border-b-0 sm:border-r border-slate-200">
              <label className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-800 uppercase tracking-wider mb-1">
                <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                <span>Data de Saída</span>
              </label>
              <input
                type="date"
                value={searchCriteria.checkOut}
                min={searchCriteria.checkIn || new Date().toISOString().split('T')[0]}
                onChange={(e) => setSearchCriteria({ ...searchCriteria, checkOut: e.target.value })}
                className="w-full bg-transparent text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none cursor-pointer"
              />
            </div>

            {/* Field 4: Guests */}
            <div className="p-2.5 rounded-xl hover:bg-slate-50 transition-colors border-b sm:border-b-0 sm:border-r border-slate-200">
              <label className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-800 uppercase tracking-wider mb-1">
                <Users className="w-3.5 h-3.5 text-emerald-600" />
                <span>Nº Hóspedes</span>
              </label>
              <select
                value={searchCriteria.guests}
                onChange={(e) => setSearchCriteria({ ...searchCriteria, guests: Number(e.target.value) })}
                className="w-full bg-transparent text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none cursor-pointer"
              >
                <option value={1}>1 Hóspede</option>
                <option value={2}>2 Pessoas (Casal)</option>
                <option value={3}>3 Pessoas</option>
                <option value={4}>4+ Pessoas</option>
              </select>
            </div>

            {/* Field 5: Rooms */}
            <div className="p-2.5 rounded-xl hover:bg-slate-50 transition-colors border-b sm:border-b-0 lg:border-r border-slate-200">
              <label className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-800 uppercase tracking-wider mb-1">
                <Home className="w-3.5 h-3.5 text-emerald-600" />
                <span>Nº Quartos</span>
              </label>
              <select
                value={searchCriteria.rooms}
                onChange={(e) => setSearchCriteria({ ...searchCriteria, rooms: Number(e.target.value) })}
                className="w-full bg-transparent text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none cursor-pointer"
              >
                <option value={1}>1 Quarto</option>
                <option value={2}>2 Quartos</option>
                <option value={3}>3+ Quartos</option>
              </select>
            </div>

            {/* Submit Button */}
            <div className="p-1">
              <button
                type="submit"
                className="w-full h-12 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl text-xs sm:text-sm shadow-lg shadow-emerald-900/30 flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] cursor-pointer"
              >
                <span>Pesquisar Disponibilidade</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </form>
        </div>

      </div>

    </div>
  );
};
