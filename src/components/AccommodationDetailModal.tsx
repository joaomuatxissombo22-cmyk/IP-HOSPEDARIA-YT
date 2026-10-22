import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  MapPin, 
  Star, 
  Users, 
  Bed, 
  Maximize2, 
  Check, 
  Clock, 
  AlertCircle, 
  Calendar, 
  ShieldCheck, 
  Share2, 
  Heart,
  ArrowRight
} from 'lucide-react';

export const AccommodationDetailModal: React.FC = () => {
  const { 
    selectedAccommodation, 
    setActiveModal, 
    formatKz, 
    searchCriteria, 
    setBookingDraft, 
    reviews 
  } = useApp();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [calcCheckIn, setCalcCheckIn] = useState(searchCriteria.checkIn);
  const [calcCheckOut, setCalcCheckOut] = useState(searchCriteria.checkOut);
  const [calcGuests, setCalcGuests] = useState(searchCriteria.guests);
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [promoMessage, setPromoMessage] = useState('');

  if (!selectedAccommodation) return null;

  const acc = selectedAccommodation;

  // Associated reviews
  const accReviews = reviews.filter(
    (r) => r.accommodationId === acc.id && r.status === 'approved'
  );

  // Calculate nights
  const checkInDate = new Date(calcCheckIn);
  const checkOutDate = new Date(calcCheckOut);
  const diffTime = checkOutDate.getTime() - checkInDate.getTime();
  const nights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  const basePrice = acc.pricePerNight * nights;
  const taxes = Math.round(basePrice * 0.07); // 7% taxa de turismo / serviço
  const totalAmount = Math.max(0, basePrice + taxes - discountAmount);

  const applyPromoCode = () => {
    if (promoCodeInput.trim().toUpperCase() === 'ZEMAN20') {
      const disc = Math.round(basePrice * 0.20);
      setDiscountAmount(disc);
      setPromoMessage('Cupão ZEMAN20 aplicado com sucesso (20% desconto!)');
    } else {
      setDiscountAmount(0);
      setPromoMessage('Código promocional inválido ou expirado.');
    }
  };

  const handleStartBooking = () => {
    setBookingDraft({
      accommodationId: acc.id,
      accommodationName: acc.name,
      accommodationImage: acc.images[0],
      pricePerNight: acc.pricePerNight,
      roomType: acc.category,
      checkIn: calcCheckIn,
      checkOut: calcCheckOut,
      nights: nights,
      guestsCount: calcGuests,
      subtotal: basePrice,
      taxes: taxes,
      discount: discountAmount,
      totalAmount: totalAmount,
    });
    setActiveModal('booking');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative bg-white rounded-3xl max-w-5xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 text-slate-800">
        
        {/* Sticky Close Button */}
        <button
          onClick={() => setActiveModal('none')}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-slate-900/80 hover:bg-slate-950 text-white flex items-center justify-center transition-transform hover:scale-105 shadow-lg"
          title="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Gallery Section */}
        <div className="p-6 sm:p-8 pb-4">
          
          {/* Main Large Image */}
          <div className="relative aspect-[16/9] sm:aspect-[21/9] rounded-2xl overflow-hidden bg-slate-100 shadow-inner">
            <img
              src={acc.images[activeImageIndex] || acc.images[0]}
              alt={acc.name}
              className="w-full h-full object-cover transition-all duration-300"
            />
            
            {/* Top Badges */}
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-amber-300 font-bold text-xs uppercase tracking-wider">
                {acc.category}
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-700/80 backdrop-blur-md text-white font-semibold text-xs flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                <span>Disponível para Reserva</span>
              </span>
            </div>
          </div>

          {/* Thumbnail Bar */}
          {acc.images.length > 1 && (
            <div className="flex gap-2.5 mt-3 overflow-x-auto pb-1">
              {acc.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-20 h-14 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                    activeImageIndex === idx ? 'border-amber-500 scale-105 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Modal Main Content: Split Grid */}
        <div className="p-6 sm:p-8 pt-0 grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Details, Amenities, Rules, Reviews (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Header Title & Rating */}
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                <MapPin className="w-4 h-4 text-amber-600" />
                <span>{acc.location}</span>
              </div>
              <h1 className="font-serif-luxury text-2xl sm:text-4xl font-bold text-slate-900 leading-tight">
                {acc.name}
              </h1>
              <p className="text-amber-800 text-xs font-semibold mt-1">
                {acc.subtitle}
              </p>
              
              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center gap-1 text-xs font-bold text-slate-800">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>{acc.rating.toFixed(1)}</span>
                  <span className="text-slate-400 font-normal">({acc.reviewCount} avaliações de hóspedes)</span>
                </div>
                <span className="text-slate-300">•</span>
                <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Alojamento Certificado ZEMAN</span>
                </span>
              </div>
            </div>

            {/* Quick Specs Bar */}
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center text-xs">
              <div className="p-2">
                <div className="text-slate-400 text-[10px] uppercase font-bold">Capacidade</div>
                <div className="font-bold text-slate-900 mt-0.5">{acc.maxGuests} Hóspedes</div>
              </div>
              <div className="p-2">
                <div className="text-slate-400 text-[10px] uppercase font-bold">Camas</div>
                <div className="font-bold text-slate-900 mt-0.5">{acc.bedType}</div>
              </div>
              <div className="p-2">
                <div className="text-slate-400 text-[10px] uppercase font-bold">Área</div>
                <div className="font-bold text-slate-900 mt-0.5">{acc.sizeM2} m²</div>
              </div>
              <div className="p-2 hidden sm:block">
                <div className="text-slate-400 text-[10px] uppercase font-bold">Quartos</div>
                <div className="font-bold text-slate-900 mt-0.5">{acc.bedrooms} Quarto(s)</div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="font-serif-luxury text-xl font-bold text-slate-900 mb-2">
                Sobre este Alojamento
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {acc.description}
              </p>
            </div>

            {/* Amenities Grid */}
            <div>
              <h3 className="font-serif-luxury text-xl font-bold text-slate-900 mb-3">
                Comodidades e Serviços Incluídos
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {acc.amenities.map((amenity, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* House Rules & Check-in Times */}
            <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200/80">
              <h3 className="font-serif-luxury text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>Horários e Regras da Hospedaria</span>
              </h3>
              
              <div className="grid grid-cols-2 gap-3 text-xs mb-4">
                <div className="bg-white p-3 rounded-xl border border-amber-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Check-in</span>
                  <span className="text-sm font-bold text-slate-900">A partir das {acc.checkInTime}</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-amber-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Check-out</span>
                  <span className="text-sm font-bold text-slate-900">Até às {acc.checkOutTime}</span>
                </div>
              </div>

              <ul className="space-y-1.5 text-xs text-slate-600">
                {acc.rules.map((rule, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="text-amber-600 font-bold">•</span>
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-4 pt-3 border-t border-amber-200/60 text-[11px] text-slate-600">
                <strong>Política de Cancelamento:</strong> {acc.cancellationPolicy}
              </div>
            </div>

            {/* Reviews Section */}
            <div>
              <h3 className="font-serif-luxury text-xl font-bold text-slate-900 mb-3">
                Avaliações de Hóspedes ({accReviews.length})
              </h3>
              {accReviews.length > 0 ? (
                <div className="space-y-3">
                  {accReviews.map((rev) => (
                    <div key={rev.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-amber-200 text-amber-900 font-bold flex items-center justify-center text-xs">
                            {rev.guestName.charAt(0)}
                          </div>
                          <div>
                            <h5 className="text-xs font-bold text-slate-900">{rev.guestName}</h5>
                            <span className="text-[10px] text-slate-400">{rev.date}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-amber-400">
                          {Array.from({ length: rev.rating }).map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-current" />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed italic">
                        "{rev.comment}"
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic bg-slate-50 p-4 rounded-xl">
                  Ainda não existem avaliações aprovadas para este alojamento. Seja o primeiro a reservar e partilhar a sua experiência!
                </p>
              )}
            </div>

          </div>

          {/* Right Column: Interactive Price Calculator & Booking Box (5 cols) */}
          <div className="lg:col-span-5">
            <div className="sticky top-6 bg-white p-6 rounded-3xl border-2 border-slate-900/10 shadow-xl space-y-5">
              
              {/* Price per night */}
              <div className="pb-4 border-b border-slate-100 flex items-baseline justify-between">
                <div>
                  <span className="text-[11px] text-slate-500 uppercase font-bold tracking-wider">Tarifa Oficial</span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-2xl sm:text-3xl font-bold text-slate-950 font-serif-luxury">
                      {formatKz(acc.pricePerNight)}
                    </span>
                    <span className="text-xs text-slate-500">/ noite</span>
                  </div>
                </div>
                {acc.oldPrice && (
                  <div className="text-right">
                    <span className="text-xs text-slate-400 line-through block">
                      {formatKz(acc.oldPrice)}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                      Poupa {formatKz(acc.oldPrice - acc.pricePerNight)}
                    </span>
                  </div>
                )}
              </div>

              {/* Date & Guest Selectors */}
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Check-in</label>
                    <input
                      type="date"
                      value={calcCheckIn}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setCalcCheckIn(e.target.value)}
                      className="w-full bg-transparent text-xs font-bold text-slate-900 focus:outline-none cursor-pointer"
                    />
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Check-out</label>
                    <input
                      type="date"
                      value={calcCheckOut}
                      min={calcCheckIn}
                      onChange={(e) => setCalcCheckOut(e.target.value)}
                      className="w-full bg-transparent text-xs font-bold text-slate-900 focus:outline-none cursor-pointer"
                    />
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase">Hóspedes</label>
                  <select
                    value={calcGuests}
                    onChange={(e) => setCalcGuests(Number(e.target.value))}
                    className="w-full bg-transparent text-xs font-bold text-slate-900 focus:outline-none cursor-pointer"
                  >
                    {Array.from({ length: acc.maxGuests }).map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1} {i === 0 ? 'Hóspede' : 'Hóspedes'} (Máx. {acc.maxGuests})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Promo Code Input */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                  Tem um Código Promocional?
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Ex: ZEMAN20"
                    value={promoCodeInput}
                    onChange={(e) => setPromoCodeInput(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono uppercase text-slate-900 focus:outline-none"
                  />
                  <button
                    onClick={applyPromoCode}
                    className="px-3 py-2 rounded-xl bg-slate-800 text-white text-xs font-bold hover:bg-slate-950 transition-colors"
                  >
                    Aplicar
                  </button>
                </div>
                {promoMessage && (
                  <p className={`text-[11px] mt-1 ${discountAmount > 0 ? 'text-emerald-600 font-semibold' : 'text-red-500'}`}>
                    {promoMessage}
                  </p>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>{formatKz(acc.pricePerNight)} × {nights} {nights === 1 ? 'noite' : 'noites'}</span>
                  <span className="font-semibold text-slate-900">{formatKz(basePrice)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Taxa de Turismo & Serviço (7%)</span>
                  <span className="font-semibold text-slate-900">{formatKz(taxes)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Desconto Promocional</span>
                    <span>- {formatKz(discountAmount)}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline">
                  <span className="font-bold text-slate-900 text-sm">Valor Total Previsto</span>
                  <span className="font-serif-luxury text-xl font-bold text-slate-950">
                    {formatKz(totalAmount)}
                  </span>
                </div>
              </div>

              {/* Booking CTA Button */}
              <button
                onClick={handleStartBooking}
                className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm shadow-xl shadow-emerald-950/30 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
              >
                <span>Avançar para Reserva</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center text-[10px] text-slate-400 flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Garantia de confirmação direta pela ZEMAN Trading & Services</span>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
