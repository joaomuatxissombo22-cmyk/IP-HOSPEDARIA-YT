import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Tag, Clock, ArrowRight, Sparkles, Check, Copy, Globe } from 'lucide-react';

export const SpecialOffers: React.FC = () => {
  const { offers, setActiveModal, setBookingDraft } = useApp();
  const [copied, setCopied] = useState(false);

  // Live Countdown state
  const [timeLeft, setTimeLeft] = useState({
    days: 4,
    hours: 18,
    minutes: 42,
    seconds: 15,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const activeOffer = offers.find((o) => o.active) || offers[0];

  const handleCopyCode = () => {
    if (!activeOffer) return;
    navigator.clipboard.writeText(activeOffer.promoCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleBookOffer = () => {
    setBookingDraft({
      discount: 7000,
    });
    setActiveModal('booking');
  };

  if (!activeOffer) return null;

  return (
    <section className="relative py-20 bg-slate-950 text-white overflow-hidden border-y border-emerald-950">
      {/* Background with green gradient */}
      <div className="absolute inset-0 z-0 opacity-25">
        <img
          src={activeOffer.image}
          alt="Oferta Especial Hospedaria ZEMAN"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-emerald-950/80 to-slate-950" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner from flyer: VISITE O NOSSO SITE e descubra tudo o que a ZEMAN tem para si! */}
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 border border-emerald-600/40 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8">
          
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-600 text-white text-[10px] font-black uppercase tracking-wider mb-3">
              <Globe className="w-3.5 h-3.5" />
              <span>VISITE O NOSSO SITE</span>
            </div>
            <h3 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Descubra tudo o que a ZEMAN tem para si!
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm mt-2 leading-relaxed">
              Reserve online com desconto exclusivo de 20%, garantindo o seu quarto climatizado com gerador 24h na Rotunda do Fubu.
            </p>

            <div className="flex flex-wrap items-center gap-3 mt-6">
              <button
                onClick={handleBookOffer}
                className="px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider transition-colors shadow-lg shadow-emerald-950 flex items-center gap-2 cursor-pointer"
              >
                <span>Aproveitar Tarifa Especial</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 bg-slate-950 border border-emerald-500/50 px-3.5 py-2 rounded-full text-xs">
                <Tag className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-slate-400">Cupão:</span>
                <code className="font-mono font-bold text-emerald-300">{activeOffer.promoCode}</code>
                <button onClick={handleCopyCode} className="text-slate-400 hover:text-white ml-1">
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Countdown timer */}
          <div className="flex items-center gap-3 sm:gap-4 bg-slate-950/90 p-5 sm:p-6 rounded-2xl border border-emerald-800/60 shadow-xl">
            <div className="text-center min-w-[55px]">
              <div className="text-2xl sm:text-4xl font-black text-white font-sans">{String(timeLeft.days).padStart(2, '0')}</div>
              <div className="text-[10px] text-slate-400 uppercase tracking-widest mt-0.5 font-bold">Dias</div>
            </div>
            <span className="text-xl text-emerald-500 font-bold">:</span>
            <div className="text-center min-w-[55px]">
              <div className="text-2xl sm:text-4xl font-black text-white font-sans">{String(timeLeft.hours).padStart(2, '0')}</div>
              <div className="text-[10px] text-slate-400 uppercase tracking-widest mt-0.5 font-bold">Horas</div>
            </div>
            <span className="text-xl text-emerald-500 font-bold">:</span>
            <div className="text-center min-w-[55px]">
              <div className="text-2xl sm:text-4xl font-black text-white font-sans">{String(timeLeft.minutes).padStart(2, '0')}</div>
              <div className="text-[10px] text-slate-400 uppercase tracking-widest mt-0.5 font-bold">Minutos</div>
            </div>
            <span className="text-xl text-emerald-500 font-bold">:</span>
            <div className="text-center min-w-[55px]">
              <div className="text-2xl sm:text-4xl font-black text-emerald-400 font-sans">{String(timeLeft.seconds).padStart(2, '0')}</div>
              <div className="text-[10px] text-slate-400 uppercase tracking-widest mt-0.5 font-bold">Segundos</div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
