import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, ArrowRight, Utensils, Shield, Zap, Car, CheckCircle2 } from 'lucide-react';

export const ExperiencesSection: React.FC = () => {
  const { experiences, formatKz, setActiveModal } = useApp();
  const [selectedExpModal, setSelectedExpModal] = useState<any | null>(null);

  const activeExperiences = experiences.filter((e) => e.active);

  return (
    <section id="experiencias-section" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Destination Showcase Banner matching ZEMAN green branding */}
        <div className="mb-20 rounded-3xl overflow-hidden relative shadow-2xl bg-slate-950 text-white border border-emerald-950">
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[440px]">
            
            {/* Left Column: Text & CTA */}
            <div className="lg:col-span-6 p-8 sm:p-12 flex flex-col justify-between z-10 bg-gradient-to-r from-slate-950 via-slate-950/95 to-slate-950/80">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-600/30 border border-emerald-500/50 text-emerald-300 text-xs font-bold tracking-widest uppercase mb-4">
                  <Utensils className="w-3.5 h-3.5" />
                  <span>HOTELARIA & RESTAURAÇÃO ZEMAN</span>
                </div>
                <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight mb-4 font-sans text-white">
                  Hospitalidade Autêntica no Coração de Luanda
                </h3>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
                  Conjugamos o conforto de uma hospedaria climatizada com o melhor da culinária tradicional angolana. Pratos feitos na hora, serviço de bar e tranquilidade absoluta junto à Rotunda do Fubu.
                </p>
                <div className="flex flex-col gap-2 text-xs text-emerald-300 font-semibold mb-6">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Energia assegurada 24 horas por dia com gerador de emergência</span>
                  </span>
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Restauração completa com Mufete, Calulu de peixe e refeições caseiras</span>
                  </span>
                </div>
              </div>

              <div>
                <button
                  onClick={() => setActiveModal('booking')}
                  className="px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-lg shadow-emerald-950/50 inline-flex items-center gap-2 cursor-pointer"
                >
                  <span>Efetuar Reserva Online</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right Column: Photo */}
            <div className="lg:col-span-6 relative min-h-[280px] lg:min-h-full overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80"
                alt="Restauração ZEMAN"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-slate-950/20" />
              
              <div className="absolute bottom-6 right-6 bg-slate-950/90 backdrop-blur-md px-4 py-3 rounded-2xl border border-emerald-900/60 text-right">
                <span className="text-[10px] text-emerald-400 uppercase font-bold block">Gastronomia ZEMAN</span>
                <span className="text-xs font-bold text-white">Sabores de Angola & Bar Completo</span>
              </div>
            </div>

          </div>
        </div>

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>PORTFÓLIOS & SERVIÇOS DA HOSPEDARIA</span>
          </div>
          <h2 className="font-serif-luxury text-3xl sm:text-5xl font-bold text-slate-900 tracking-tight">
            Comodidades & Serviços Inclusos
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-3">
            Garantimos que a sua estadia na Hospedaria ZEMAN seja repousante, segura e totalmente amparada por infraestrutura moderna.
          </p>
        </div>

        {/* 6 Experience Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {activeExperiences.map((exp) => (
            <div
              key={exp.id}
              className="group bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl hover:border-emerald-300 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                <img
                  src={exp.image}
                  alt={exp.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-3 py-1 rounded-full bg-slate-950/85 backdrop-blur-md text-emerald-300 font-bold text-[10px] uppercase tracking-wider border border-emerald-900/60">
                    {exp.category}
                  </span>
                </div>
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
                  <span className="px-2.5 py-1 rounded-md bg-slate-950/80 backdrop-blur-md">
                    {exp.duration}
                  </span>
                  {exp.price > 0 && (
                    <span className="px-2.5 py-1 rounded-md bg-emerald-600 text-white font-bold">
                      {formatKz(exp.price)}
                    </span>
                  )}
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif-luxury text-xl font-bold text-slate-900 group-hover:text-emerald-700 transition-colors mb-2">
                    {exp.title}
                  </h3>
                  <p className="text-slate-600 text-xs leading-relaxed mb-4">
                    {exp.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-medium truncate max-w-[160px]">
                    {exp.location}
                  </span>
                  <button
                    onClick={() => setSelectedExpModal(exp)}
                    className="text-xs font-bold text-emerald-700 group-hover:text-emerald-800 flex items-center gap-1 transition-colors"
                  >
                    <span>Saber Mais</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Experience Details Modal */}
      {selectedExpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-100">
            <div className="relative aspect-[16/9]">
              <img
                src={selectedExpModal.image}
                alt={selectedExpModal.title}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedExpModal(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-900/80 text-white flex items-center justify-center hover:bg-slate-950"
              >
                ✕
              </button>
              <div className="absolute bottom-3 left-4">
                <span className="px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-bold uppercase">
                  {selectedExpModal.category}
                </span>
              </div>
            </div>

            <div className="p-6">
              <h3 className="font-serif-luxury text-2xl font-bold text-slate-900 mb-2">
                {selectedExpModal.title}
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                {selectedExpModal.description}
              </p>

              <div className="bg-slate-50 rounded-xl p-4 space-y-2 text-xs text-slate-700 mb-6 border border-slate-200">
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-500">Localização:</span>
                  <span className="font-bold text-slate-900">{selectedExpModal.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-500">Horário:</span>
                  <span className="font-bold text-slate-900">{selectedExpModal.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-500">Tarifa / Condição:</span>
                  <span className="font-bold text-emerald-700">
                    {selectedExpModal.price > 0 ? formatKz(selectedExpModal.price) : 'Incluído na Estadia'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedExpModal(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  Fechar
                </button>
                <button
                  onClick={() => {
                    setSelectedExpModal(null);
                    setActiveModal('booking');
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500 transition-colors shadow-lg"
                >
                  Reservar Quarto
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
