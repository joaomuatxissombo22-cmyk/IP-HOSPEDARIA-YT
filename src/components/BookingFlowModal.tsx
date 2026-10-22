import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Check, 
  Calendar, 
  Users, 
  Bed, 
  CreditCard, 
  Building, 
  FileText, 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeft,
  Sparkles,
  Download,
  AlertCircle
} from 'lucide-react';
import { PaymentMethod } from '../types';

export const BookingFlowModal: React.FC = () => {
  const { 
    activeModal, 
    setActiveModal, 
    bookingDraft, 
    accommodations, 
    roomUnits, 
    createBooking, 
    formatKz, 
    currentUser, 
    siteSettings,
    setCurrentView 
  } = useApp();

  const [step, setStep] = useState<number>(1);
  const [createdBooking, setCreatedBooking] = useState<any | null>(null);

  // Form State
  const defaultAcc = accommodations.find((a) => a.id === bookingDraft?.accommodationId) || accommodations[0];
  const [selectedAccId, setSelectedAccId] = useState<string>(defaultAcc.id);
  const [checkIn, setCheckIn] = useState<string>(
    bookingDraft?.checkIn || new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [checkOut, setCheckOut] = useState<string>(
    bookingDraft?.checkOut || new Date(Date.now() + 86400000 * 4).toISOString().split('T')[0]
  );
  const [guestsCount, setGuestsCount] = useState<number>(bookingDraft?.guestsCount || 2);
  const [roomsCount, setRoomsCount] = useState<number>(bookingDraft?.roomsCount || 1);
  const [selectedRoomUnitId, setSelectedRoomUnitId] = useState<string>('');

  // Guest details
  const [guestName, setGuestName] = useState<string>(currentUser?.fullName || '');
  const [guestEmail, setGuestEmail] = useState<string>(currentUser?.email || '');
  const [guestPhone, setGuestPhone] = useState<string>(currentUser?.phone || '');
  const [guestCountry, setGuestCountry] = useState<string>(currentUser?.country || 'Angola');
  const [guestDocument, setGuestDocument] = useState<string>('');
  const [guestNotes, setGuestNotes] = useState<string>('');

  // Payment
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Transferência Bancária / Multicaixa Express');
  const [proofFileRef, setProofFileRef] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Sync draft if provided
  useEffect(() => {
    if (bookingDraft?.accommodationId) {
      setSelectedAccId(bookingDraft.accommodationId);
    }
    if (bookingDraft?.checkIn) setCheckIn(bookingDraft.checkIn);
    if (bookingDraft?.checkOut) setCheckOut(bookingDraft.checkOut);
    if (bookingDraft?.guestsCount) setGuestsCount(bookingDraft.guestsCount);
    if (currentUser) {
      if (!guestName) setGuestName(currentUser.fullName);
      if (!guestEmail) setGuestEmail(currentUser.email);
      if (!guestPhone) setGuestPhone(currentUser.phone);
    }
  }, [bookingDraft, currentUser]);

  if (activeModal !== 'booking') return null;

  const currentAcc = accommodations.find((a) => a.id === selectedAccId) || accommodations[0];

  // Calculate nights
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  const diffTime = checkOutDate.getTime() - checkInDate.getTime();
  const nights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  const basePrice = (currentAcc.pricePerNight * nights) * roomsCount;
  const taxes = Math.round(basePrice * 0.07);
  const discount = bookingDraft?.discount || 0;
  const totalAmount = Math.max(0, basePrice + taxes - discount);

  // Available room units for selected accommodation
  const matchingUnits = roomUnits.filter((u) => u.accommodationId === currentAcc.id);
  const availableUnits = matchingUnits.filter((u) => {
    if (u.status === 'maintenance') return false;
    // Check if dates conflict
    const conflicts = u.blockedDates.some((date) => date >= checkIn && date <= checkOut);
    return !conflicts;
  });

  const handleNextToRooms = (e: React.FormEvent) => {
    e.preventDefault();
    if (availableUnits.length > 0) {
      setSelectedRoomUnitId(availableUnits[0].id);
    }
    setStep(2);
  };

  const handleFinalizeBooking = () => {
    setIsSubmitting(true);

    const roomUnit = matchingUnits.find((u) => u.id === selectedRoomUnitId) || availableUnits[0];

    const newBooking = createBooking({
      userId: currentUser?.id,
      accommodationId: currentAcc.id,
      accommodationName: currentAcc.name,
      accommodationImage: currentAcc.images[0],
      roomType: roomUnit ? `${currentAcc.category} - ${roomUnit.name}` : currentAcc.category,
      roomNumber: roomUnit?.roomNumber || 'A atribuir no check-in',
      checkIn: checkIn,
      checkOut: checkOut,
      nights: nights,
      guestsCount: guestsCount,
      roomsCount: roomsCount,
      pricePerNight: currentAcc.pricePerNight,
      subtotal: basePrice,
      taxes: taxes,
      discount: discount,
      totalAmount: totalAmount,
      guestName: guestName,
      guestEmail: guestEmail,
      guestPhone: guestPhone,
      guestCountry: guestCountry,
      guestNotes: `${guestNotes} ${guestDocument ? `| Doc: ${guestDocument}` : ''}`.trim(),
      status: 'Pendente',
      paymentStatus: paymentMethod === 'No Alojamento' ? 'Não Pago' : 'Pendente',
      paymentMethod: paymentMethod,
      proofOfPayment: proofFileRef || undefined,
    });

    setTimeout(() => {
      setIsSubmitting(false);
      setCreatedBooking(newBooking);
      setStep(5); // Success step
    }, 600);
  };

  const handleClose = () => {
    setActiveModal('none');
    setStep(1);
    setCreatedBooking(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 text-slate-800">
        
        {/* Header Bar */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-sm z-20">
          <div>
            <span className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider">
              ZEMAN TRADING & SERVICES • RESERVAS ONLINE
            </span>
            <h2 className="font-serif-luxury text-2xl font-bold text-slate-900">
              {step === 5 ? 'Reserva Registada com Sucesso!' : 'Reserva de Quarto na Hospedaria'}
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Bar (1 to 4) */}
        {step < 5 && (
          <div className="px-6 pt-4 pb-2 bg-slate-50 border-b border-slate-200/80">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2">
              <span className={step >= 1 ? 'text-emerald-700 font-bold' : ''}>1. Datas & Hóspedes</span>
              <span className={step >= 2 ? 'text-emerald-700 font-bold' : ''}>2. Escolha do Quarto</span>
              <span className={step >= 3 ? 'text-emerald-700 font-bold' : ''}>3. Dados do Hóspede</span>
              <span className={step >= 4 ? 'text-emerald-700 font-bold' : ''}>4. Resumo & Pagamento</span>
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-emerald-600 h-full transition-all duration-300"
                style={{ width: `${(step / 4) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* STEP 1: Dates & Guests */}
        {step === 1 && (
          <form onSubmit={handleNextToRooms} className="p-6 sm:p-8 space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Alojamento Selecionado
              </label>
              <select
                value={selectedAccId}
                onChange={(e) => setSelectedAccId(e.target.value)}
                className="w-full p-3.5 rounded-xl border border-slate-300 bg-white font-semibold text-slate-900 text-sm focus:outline-none focus:border-amber-500"
              >
                {accommodations.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name} — {a.location} ({formatKz(a.pricePerNight)}/noite)
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Data de Check-in *
                </label>
                <input
                  type="date"
                  required
                  value={checkIn}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full p-3.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-900 focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Data de Check-out *
                </label>
                <input
                  type="date"
                  required
                  value={checkOut}
                  min={checkIn}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full p-3.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-900 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Quantidade de Hóspedes
                </label>
                <select
                  value={guestsCount}
                  onChange={(e) => setGuestsCount(Number(e.target.value))}
                  className="w-full p-3.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-900 focus:outline-none focus:border-amber-500"
                >
                  {Array.from({ length: currentAcc.maxGuests }).map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1} {i === 0 ? 'Hóspede' : 'Hóspedes'}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Quantidade de Quartos / Unidades
                </label>
                <select
                  value={roomsCount}
                  onChange={(e) => setRoomsCount(Number(e.target.value))}
                  className="w-full p-3.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-900 focus:outline-none focus:border-amber-500"
                >
                  <option value={1}>1 Quarto / Unidade</option>
                  <option value={2}>2 Quartos</option>
                  <option value={3}>3 Quartos</option>
                </select>
              </div>
            </div>

            {/* Estimated Subtotal Box */}
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between">
              <div>
                <span className="text-xs text-amber-900 font-semibold">Duração da Estadia:</span>
                <p className="text-sm font-bold text-slate-900">
                  {nights} {nights === 1 ? 'Noite' : 'Noites'} ({checkIn} até {checkOut})
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs text-amber-900 font-semibold">Subtotal Previsto:</span>
                <p className="text-base font-bold text-slate-950 font-serif-luxury">
                  {formatKz(basePrice)}
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                className="px-6 py-3.5 rounded-xl bg-slate-950 hover:bg-amber-600 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-lg"
              >
                <span>Verificar Quartos Disponíveis</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: Choose Room Unit (Real Availability Check) */}
        {step === 2 && (
          <div className="p-6 sm:p-8 space-y-6">
            <div>
              <h3 className="font-serif-luxury text-xl font-bold text-slate-900 mb-1">
                Quartos Disponíveis para o Período
              </h3>
              <p className="text-xs text-slate-500">
                Apresentamos apenas as unidades operacionais e sem conflito de datas para {checkIn} até {checkOut}.
              </p>
            </div>

            {availableUnits.length === 0 ? (
              <div className="p-6 rounded-2xl bg-amber-50 border border-amber-200 text-center">
                <AlertCircle className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-slate-900">Nenhum quarto livre para as datas solicitadas</h4>
                <p className="text-xs text-slate-600 mt-1 max-w-md mx-auto">
                  Todas as unidades deste alojamento já se encontram reservadas ou em manutenção no período escolhido. Por favor selecione outras datas ou outro alojamento.
                </p>
                <button
                  onClick={() => setStep(1)}
                  className="mt-4 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold"
                >
                  Alterar Datas ou Alojamento
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {availableUnits.map((unit) => (
                  <div
                    key={unit.id}
                    onClick={() => setSelectedRoomUnitId(unit.id)}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                      selectedRoomUnitId === unit.id
                        ? 'border-amber-500 bg-amber-50/40 shadow-md'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        selectedRoomUnitId === unit.id ? 'border-amber-600 bg-amber-600 text-white' : 'border-slate-300'
                      }`}>
                        {selectedRoomUnitId === unit.id && <Check className="w-3.5 h-3.5" />}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">
                          {unit.name} <span className="text-xs font-normal text-slate-500">(Nº {unit.roomNumber})</span>
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {unit.type} • Capacidade para até {unit.capacity} pessoas
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-slate-950 font-serif-luxury block">
                        {formatKz(unit.pricePerNight)}
                      </span>
                      <span className="text-[10px] text-emerald-600 font-bold uppercase">Disponível</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Voltar</span>
              </button>
              {availableUnits.length > 0 && (
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-6 py-3 rounded-xl bg-slate-950 hover:bg-amber-600 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-lg"
                >
                  <span>Continuar para Dados do Hóspede</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* STEP 3: Guest Information */}
        {step === 3 && (
          <form onSubmit={(e) => { e.preventDefault(); setStep(4); }} className="p-6 sm:p-8 space-y-5">
            <div>
              <h3 className="font-serif-luxury text-xl font-bold text-slate-900 mb-1">
                Dados Pessoais do Hóspede
              </h3>
              <p className="text-xs text-slate-500">
                Preencha os dados de quem irá usufruir da estadia para emissão de voucher e registo oficial.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Nome do hóspede principal"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Endereço de Email *
                </label>
                <input
                  type="email"
                  required
                  placeholder="email@exemplo.ao"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Telefone / WhatsApp *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+244 9XX XXX XXX"
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  País de Residência *
                </label>
                <input
                  type="text"
                  required
                  value={guestCountry}
                  onChange={(e) => setGuestCountry(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Nº BI / Passaporte
                </label>
                <input
                  type="text"
                  placeholder="Ex: 004812399LA048"
                  value={guestDocument}
                  onChange={(e) => setGuestDocument(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Observações Especiais ou Preferências
              </label>
              <textarea
                rows={3}
                placeholder="Ex: Hora prevista de chegada, transfer aeroporto, cama extra de berço, restrições alimentares..."
                value={guestNotes}
                onChange={(e) => setGuestNotes(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:border-amber-500 resize-none"
              ></textarea>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Voltar</span>
              </button>
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-slate-950 hover:bg-amber-600 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-lg"
              >
                <span>Avançar para Resumo & Pagamento</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 4: Summary & Payment Method */}
        {step === 4 && (
          <div className="p-6 sm:p-8 space-y-6">
            <div>
              <h3 className="font-serif-luxury text-xl font-bold text-slate-900 mb-1">
                Resumo da Reserva & Pagamento
              </h3>
              <p className="text-xs text-slate-500">
                Revise os detalhes da sua estadia antes de confirmar a solicitação.
              </p>
            </div>

            {/* Summary Box */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200">
                <div>
                  <h4 className="font-serif-luxury text-lg font-bold text-slate-900">
                    {currentAcc.name}
                  </h4>
                  <p className="text-xs text-slate-500">{currentAcc.location}</p>
                </div>
                <div className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-200 text-slate-700 self-start sm:self-auto">
                  {nights} {nights === 1 ? 'Noite' : 'Noites'} ({checkIn} a {checkOut})
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Hóspede</span>
                  <span className="font-semibold text-slate-900">{guestName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Ocupação</span>
                  <span className="font-semibold text-slate-900">{guestsCount} Hóspedes • {roomsCount} Quarto</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Tarifa Diária</span>
                  <span className="font-semibold text-slate-900">{formatKz(currentAcc.pricePerNight)}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Contacto</span>
                  <span className="font-semibold text-slate-900">{guestPhone}</span>
                </div>
              </div>

              {/* Price Calculation Breakdown */}
              <div className="pt-3 border-t border-slate-200 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Hospedagem ({nights} noites)</span>
                  <span className="font-semibold text-slate-900">{formatKz(basePrice)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Taxas e Serviços (7%)</span>
                  <span className="font-semibold text-slate-900">{formatKz(taxes)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Desconto Promocional Aplicado</span>
                    <span>- {formatKz(discount)}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-slate-300 flex justify-between items-baseline font-bold text-sm">
                  <span className="text-slate-900">Total a Pagar</span>
                  <span className="text-xl text-slate-950 font-serif-luxury">
                    {formatKz(totalAmount)}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                Método de Pagamento
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div
                  onClick={() => setPaymentMethod('Transferência Bancária / Multicaixa Express')}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'Transferência Bancária / Multicaixa Express'
                      ? 'border-amber-500 bg-amber-50/50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-xs text-slate-900 mb-1">
                    <Building className="w-4 h-4 text-amber-600" />
                    <span>Transferência Bancária / Multicaixa Express</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Envio de comprovativo para confirmação imediata pela administração.
                  </p>
                </div>

                <div
                  onClick={() => setPaymentMethod('No Alojamento')}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'No Alojamento'
                      ? 'border-amber-500 bg-amber-50/50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-xs text-slate-900 mb-1">
                    <CreditCard className="w-4 h-4 text-amber-600" />
                    <span>Pagamento no Check-in</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Liquidação presencial na receção através de Multicaixa (TPA) ou numerário.
                  </p>
                </div>
              </div>
            </div>

            {/* Bank details if Transfer selected */}
            {paymentMethod === 'Transferência Bancária / Multicaixa Express' && (
              <div className="p-4 rounded-2xl bg-slate-900 text-white text-xs space-y-2 border border-slate-700">
                <div className="flex items-center gap-2 text-amber-300 font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Coordenadas Bancárias Oficiais ZEMAN Trading & Services</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-300 pt-1">
                  <div>
                    <span className="text-slate-400 block">Banco:</span>
                    <strong className="text-white">{siteSettings.bankName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Titular da Conta:</span>
                    <strong className="text-white">{siteSettings.bankHolder}</strong>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-slate-400 block">IBAN:</span>
                    <strong className="text-amber-200 font-mono tracking-wider">{siteSettings.bankIban}</strong>
                  </div>
                </div>

                <div className="pt-2">
                  <label className="block text-[11px] text-slate-300 font-semibold mb-1">
                    Referência / Nome do Comprovativo (Opcional):
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Comprovativo_Transferencia_MCX.pdf ou Referência de Operação"
                    value={proofFileRef}
                    onChange={(e) => setProofFileRef(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none"
                  />
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Voltar</span>
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleFinalizeBooking}
                className="px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-xl shadow-emerald-950/30 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>A processar reserva...</span>
                ) : (
                  <>
                    <span>Confirmar Solicitação de Reserva</span>
                    <Check className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: Success & Booking Voucher */}
        {step === 5 && createdBooking && (
          <div className="p-6 sm:p-10 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <Check className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-600">
                Reserva Registada com Sucesso
              </span>
              <h2 className="font-serif-luxury text-3xl font-bold text-slate-900 mt-1">
                Obrigado, {createdBooking.guestName}!
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm mt-2 max-w-lg mx-auto">
                A sua solicitação de reserva foi transmitida à gerência da ZEMAN Trading & Services. Enviámos a confirmação e as instruções para o seu email.
              </p>
            </div>

            {/* Booking Reference Card */}
            <div className="max-w-md mx-auto bg-slate-50 rounded-2xl p-5 border border-slate-200 text-left space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Referência Única</span>
                  <span className="font-mono font-bold text-base text-slate-900 tracking-wider">
                    {createdBooking.id}
                  </span>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                  {createdBooking.status}
                </span>
              </div>

              <div className="text-xs space-y-1.5 text-slate-600">
                <div className="flex justify-between">
                  <span>Alojamento:</span>
                  <strong className="text-slate-900">{createdBooking.accommodationName}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Datas:</span>
                  <strong className="text-slate-900">{createdBooking.checkIn} a {createdBooking.checkOut} ({createdBooking.nights} noites)</strong>
                </div>
                <div className="flex justify-between">
                  <span>Valor Total:</span>
                  <strong className="text-slate-950 font-serif-luxury text-sm">{formatKz(createdBooking.totalAmount)}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Método de Pagamento:</span>
                  <strong className="text-slate-900">{createdBooking.paymentMethod}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Estado do Pagamento:</span>
                  <strong className="text-amber-700">{createdBooking.paymentStatus}</strong>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  handleClose();
                  setCurrentView('client_dashboard');
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider shadow-lg"
              >
                Ver na Área do Cliente
              </button>
              <button
                onClick={handleClose}
                className="w-full sm:w-auto px-6 py-3 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs uppercase tracking-wider"
              >
                Concluir & Fechar
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
