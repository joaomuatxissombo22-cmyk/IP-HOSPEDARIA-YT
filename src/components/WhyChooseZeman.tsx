import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Star, 
  ShieldCheck, 
  Clock, 
  Award, 
  CreditCard, 
  Zap, 
  ChevronLeft, 
  ChevronRight, 
  Quote,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const WhyChooseZeman: React.FC = () => {
  const { reviews, siteSettings } = useApp();
  const approvedReviews = reviews.filter((r) => r.status === 'approved');
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);

  const nextReview = () => {
    setCurrentReviewIndex((prev) => (prev + 1) % approvedReviews.length);
  };

  const prevReview = () => {
    setCurrentReviewIndex((prev) => (prev - 1 + approvedReviews.length) % approvedReviews.length);
  };

  const activeReview = approvedReviews[currentReviewIndex] || approvedReviews[0];

  const advantages = [
    {
      icon: Zap,
      title: 'Energia 24h com Gerador Próprio',
      desc: 'Infraestrutura com grupo gerador silencioso para garantir que a climatização e as luzes nunca falhem.',
    },
    {
      icon: ShieldCheck,
      title: 'Segurança & Parqueamento Fechado',
      desc: 'Pátio interno com guarita, segurança privada 24 horas e controle rigoroso de acessos.',
    },
    {
      icon: Award,
      title: 'Higiene & Conforto Rígidos',
      desc: 'Roupas de cama desinfetadas, colchões ortopédicos e limpeza minuciosa diária em todos os quartos.',
    },
    {
      icon: Clock,
      title: 'Atendimento e Suporte 24/7',
      desc: 'Recepção sempre aberta com atendimento acolhedor pronto a resolver qualquer necessidade.',
    },
  ];

  return (
    <section id="sobre-nos-section" className="py-24 bg-slate-100/80 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Top Header */}
        <div className="max-w-2xl mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-black uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>HISTÓRICO DA EMPRESA & VALORES</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight font-sans">
            {siteSettings.slogan}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            A <strong>ZEMAN Trading & Services</strong> nasceu com o compromisso de oferecer hospitalidade séria, segura e de elevada qualidade no mercado angolano, colocando sempre o hóspede em primeiro lugar.
          </p>
        </div>

        {/* 3-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Column 1: Advantages Grid (4 Cards) */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {advantages.map((adv, idx) => {
              const Icon = adv.icon;
              return (
                <div
                  key={idx}
                  className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-emerald-300 transition-all flex flex-col justify-between"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3 border border-emerald-100">
                    <Icon className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900 mb-1">{adv.title}</h4>
                    <p className="text-[11px] text-slate-600 leading-relaxed">{adv.desc}</p>
                  </div>
                </div>
              );
            })}

            <div className="sm:col-span-2 pt-2">
              <div className="p-4 rounded-2xl bg-emerald-900 text-white flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-emerald-300 uppercase font-bold block">Compromisso ZEMAN</span>
                  <span className="font-handwriting text-2xl text-emerald-200">
                    "{siteSettings.tagline}"
                  </span>
                </div>
                <button
                  onClick={() => {
                    const el = document.getElementById('contactos-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-xs font-bold text-white hover:text-emerald-300 underline"
                >
                  Localização →
                </button>
              </div>
            </div>
          </div>

          {/* Column 2: Center Feature Photography with Cursive Note */}
          <div className="lg:col-span-4 relative rounded-3xl overflow-hidden shadow-xl min-h-[340px] group border border-slate-200">
            <img
              src="https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80"
              alt="Hospedaria ZEMAN"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent" />
            
            {/* Cursive overlay text from flyer */}
            <div className="absolute bottom-6 left-6 right-6 text-center">
              <p className="font-handwriting text-3xl sm:text-4xl text-emerald-300 drop-shadow-md">
                Juntos vamos mais longe! ♡
              </p>
              <p className="text-[10px] tracking-widest uppercase text-white/90 font-bold mt-1">
                Zeman Trading & Services
              </p>
            </div>
          </div>

          {/* Column 3: Live Guest Testimonial Carousel Card */}
          <div className="lg:col-span-3 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6">
                <Quote className="w-5 h-5 fill-current" />
              </div>

              {activeReview ? (
                <>
                  <p className="text-slate-700 text-xs sm:text-sm italic leading-relaxed mb-6 font-serif-luxury font-normal text-[15px]">
                    "{activeReview.comment}"
                  </p>

                  <div className="flex items-center gap-1 text-amber-400 mb-6">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < activeReview.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                        }`}
                      />
                    ))}
                  </div>

                  <div className="flex items-center gap-3">
                    <img
                      src={activeReview.guestAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80'}
                      alt={activeReview.guestName}
                      className="w-10 h-10 rounded-full object-cover border border-emerald-400"
                    />
                    <div>
                      <h5 className="text-xs font-bold text-slate-900">{activeReview.guestName}</h5>
                      <p className="text-[10px] text-slate-400">{activeReview.userCountry || 'Angola'}</p>
                      <p className="text-[10px] text-emerald-700 font-semibold">{activeReview.accommodationName}</p>
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-xs text-slate-400">Sem avaliações registadas.</p>
              )}
            </div>

            {/* Pagination Controls */}
            {approvedReviews.length > 1 && (
              <div className="pt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span>
                  {currentReviewIndex + 1} / {approvedReviews.length}
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={prevReview}
                    className="p-1.5 rounded-full hover:bg-slate-100 text-slate-700 transition-colors"
                    title="Anterior"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={nextReview}
                    className="p-1.5 rounded-full hover:bg-slate-100 text-slate-700 transition-colors"
                    title="Seguinte"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};
