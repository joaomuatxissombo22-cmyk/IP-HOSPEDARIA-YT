import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Accommodation, AccommodationCategory } from '../types';
import { Users, Bed, MapPin, Star, ArrowRight, Eye, ShieldCheck, Sparkles, Filter, Zap, Tv } from 'lucide-react';

export const FeaturedAccommodations: React.FC = () => {
  const { 
    accommodations, 
    formatKz, 
    setSelectedAccommodation, 
    setActiveModal, 
    setBookingDraft,
    searchCriteria 
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<AccommodationCategory>('Todos');

  const categories: AccommodationCategory[] = [
    'Todos',
    'Quartos Casal',
    'Quartos Solteiro',
    'Quartos Twin',
    'Suítes Master',
    'Quartos Económicos',
  ];

  // Filter based on category
  const filteredAccommodations = accommodations.filter((acc) => {
    if (!acc.active) return false;
    if (selectedCategory !== 'Todos' && acc.category !== selectedCategory) {
      return false;
    }
    return true;
  });

  const handleOpenDetail = (acc: Accommodation) => {
    setSelectedAccommodation(acc);
    setActiveModal('detail');
  };

  const handleDirectBook = (acc: Accommodation) => {
    setSelectedAccommodation(acc);
    setBookingDraft({
      accommodationId: acc.id,
      accommodationName: acc.name,
      accommodationImage: acc.images[0],
      pricePerNight: acc.pricePerNight,
      roomType: acc.category,
      checkIn: searchCriteria.checkIn,
      checkOut: searchCriteria.checkOut,
      guestsCount: Math.min(searchCriteria.guests, acc.maxGuests),
      roomsCount: searchCriteria.rooms,
    });
    setActiveModal('booking');
  };

  return (
    <section id="alojamentos-section" className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-black uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>HOSPEDARIA ANGOLANA ZEMAN</span>
            </div>
            <h2 className="font-serif-luxury text-3xl sm:text-5xl font-bold text-slate-900 tracking-tight">
              Quartos a Modelo de Hospedaria
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-xl">
              Acomodações acolhedoras e climatizadas na Rotunda do Fubu sentido Talatona. Conforto, privacidade, gerador 24h e segurança total.
            </p>
          </div>

          <div className="text-xs text-slate-500 font-medium bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-sm">
            A apresentar <strong className="text-emerald-700">{filteredAccommodations.length}</strong> quartos disponíveis
          </div>
        </div>

        {/* Category Pill Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/30'
                  : 'bg-white text-slate-700 border border-slate-200 hover:border-emerald-400 hover:text-emerald-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Accommodations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredAccommodations.map((acc) => (
            <div
              key={acc.id}
              className="group bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl hover:border-emerald-300 transition-all duration-300 flex flex-col justify-between"
            >
              {/* Image Container */}
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                <img
                  src={acc.images[0]}
                  alt={acc.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                {/* Top Badges */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-slate-950/85 backdrop-blur-md text-emerald-300 font-bold text-[11px] tracking-wide uppercase border border-emerald-900/60">
                    {acc.category}
                  </span>
                  {acc.featured && (
                    <span className="px-2.5 py-1 rounded-full bg-emerald-600 text-white font-black text-[10px] tracking-wider uppercase shadow">
                      Recomendado
                    </span>
                  )}
                </div>

                {/* Key Angolan Hospedaria Badge: Gerador 24h */}
                <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black uppercase shadow">
                  <Zap className="w-3 h-3 fill-current" />
                  <span>Gerador 24h</span>
                </div>

                {/* Rating Badge */}
                <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950/85 backdrop-blur-md text-white text-xs font-semibold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{acc.rating.toFixed(1)}</span>
                  <span className="text-slate-400 text-[10px]">({acc.reviewCount})</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  {/* Location */}
                  <div className="flex items-center gap-1 text-slate-500 text-xs mb-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="truncate">{acc.location}</span>
                  </div>

                  {/* Title */}
                  <h3 
                    onClick={() => handleOpenDetail(acc)}
                    className="font-serif-luxury text-xl font-bold text-slate-900 hover:text-emerald-700 cursor-pointer transition-colors line-clamp-1 mb-2"
                  >
                    {acc.name}
                  </h3>

                  {/* Short Description */}
                  <p className="text-slate-600 text-xs line-clamp-2 mb-4 leading-relaxed">
                    {acc.shortDescription}
                  </p>

                  {/* Room Attributes */}
                  <div className="flex items-center gap-4 py-3 border-y border-slate-100 text-slate-600 text-xs mb-4">
                    <div className="flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-emerald-600" />
                      <span>{acc.maxGuests} Hóspedes</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Bed className="w-4 h-4 text-emerald-600" />
                      <span>{acc.bedType}</span>
                    </div>
                  </div>

                  {/* Hospedaria Key Amenities */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                      ⚡ Energia 24h
                    </span>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      ❄ AC Split
                    </span>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      📺 DStv / ZAP
                    </span>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      🚿 Água Quente
                    </span>
                  </div>
                </div>

                {/* Pricing and Action Buttons */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Diária Oficial</div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-lg sm:text-xl font-black text-slate-950 font-sans">
                        {formatKz(acc.pricePerNight)}
                      </span>
                      <span className="text-[11px] text-slate-500 font-medium">/ noite</span>
                    </div>
                    {acc.oldPrice && (
                      <div className="text-[10px] text-slate-400 line-through">
                        {formatKz(acc.oldPrice)}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenDetail(acc)}
                      className="px-3 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center gap-1"
                      title="Ver comodidades completas"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Detalhes</span>
                    </button>
                    <button
                      onClick={() => handleDirectBook(acc)}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors flex items-center gap-1 shadow-md shadow-emerald-950/20"
                    >
                      <span>Reservar</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
