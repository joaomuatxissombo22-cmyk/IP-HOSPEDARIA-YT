import React from 'react';
import { Calendar, Building2, UserPlus, Info, Briefcase, Headphones, Globe } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const BenefitsBar: React.FC = () => {
  const { setActiveModal, setCurrentView } = useApp();

  const features = [
    {
      icon: Calendar,
      title: 'RESERVAS ONLINE',
      desc: 'Faça a sua reserva de forma rápida, fácil e segura.',
      action: () => setActiveModal('booking'),
    },
    {
      icon: Building2,
      title: 'HISTÓRICO DA EMPRESA',
      desc: 'Saiba mais sobre a nossa trajetória, valores e conquistas.',
      action: () => {
        const el = document.getElementById('sobre-nos-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      },
    },
    {
      icon: UserPlus,
      title: 'ÁREA DE CADASTRO',
      desc: 'Crie a sua conta e tenha acesso a todas as vantagens.',
      action: () => setActiveModal('auth'),
    },
    {
      icon: Info,
      title: 'INFORMAÇÕES ADICIONAIS',
      desc: 'Horários, contactos, localização e muito mais.',
      action: () => {
        const el = document.getElementById('contactos-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      },
    },
    {
      icon: Briefcase,
      title: 'PORTFÓLIOS',
      desc: 'Conheça nossos serviços, projetos e parcerias.',
      action: () => {
        const el = document.getElementById('experiencias-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      },
    },
    {
      icon: Headphones,
      title: 'SUPORTE AO CLIENTE',
      desc: 'Estamos sempre disponíveis para o atender.',
      action: () => {
        const el = document.getElementById('contactos-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      },
    },
  ];

  return (
    <div className="bg-slate-900 border-y border-emerald-950 py-10 shadow-lg relative z-10 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header matching poster badge */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-6 h-6 rounded-full bg-emerald-600 flex items-center justify-center text-white">
            <Globe className="w-3.5 h-3.5" />
          </div>
          <h3 className="text-xs sm:text-sm font-black uppercase tracking-[0.2em] text-emerald-400">
            PRINCIPAIS FUNCIONALIDADES
          </h3>
        </div>

        {/* 6 Grid items directly from flyer */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((f, idx) => {
            const Icon = f.icon;
            return (
              <div 
                key={idx} 
                onClick={f.action}
                className="flex items-start gap-4 p-4 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-emerald-500/60 transition-all cursor-pointer group"
              >
                {/* Green circular icon container matching poster */}
                <div className="w-12 h-12 rounded-full bg-emerald-600 group-hover:bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-lg shadow-emerald-950/80 transition-all transform group-hover:scale-105">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-black text-white group-hover:text-emerald-400 uppercase tracking-wide transition-colors">
                    {f.title}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 leading-snug">
                    {f.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
