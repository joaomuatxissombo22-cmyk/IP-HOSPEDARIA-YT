import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Mail, Phone, MapPin, Instagram, Facebook, Linkedin, ArrowUp, Globe } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setCurrentView, setActiveModal, siteSettings } = useApp();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-emerald-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand Info (2 columns) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex flex-col">
              <div className="border-2 border-white px-3 py-1 rounded-sm inline-block w-fit bg-slate-900/60 shadow">
                <span className="text-2xl font-black tracking-[0.2em] text-white font-sans">
                  ZEMAN
                </span>
              </div>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="h-[2px] w-4 bg-emerald-500 rounded-full" />
                <span className="text-xs font-bold text-emerald-400 tracking-wider">
                  Trading & Services
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Empresa angolana de referência na prestação de serviços de hospedaria, restauração, alojamento seguro e gestão de serviços corporativos em Luanda.
            </p>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-emerald-950 space-y-1">
              <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider block">
                {siteSettings.slogan}
              </span>
              <p className="font-handwriting text-2xl text-amber-200">
                "{siteSettings.tagline}"
              </p>
            </div>

            <div className="pt-2 flex items-center gap-3 text-slate-400">
              <a href="#" className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-colors" title="Instagram">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-colors" title="Facebook">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-colors" title="LinkedIn">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 font-mono text-emerald-400">
              Navegação
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => { setCurrentView('home'); scrollToTop(); }} className="hover:text-emerald-400 transition-colors">
                  Início
                </button>
              </li>
              <li>
                <button onClick={() => { setCurrentView('accommodations'); scrollToTop(); }} className="hover:text-emerald-400 transition-colors">
                  Hospedaria & Quartos
                </button>
              </li>
              <li>
                <button onClick={() => { setCurrentView('home'); setTimeout(() => document.getElementById('alojamentos-section')?.scrollIntoView({ behavior: 'smooth' }), 100); }} className="hover:text-emerald-400 transition-colors">
                  Tarifas e Disponibilidade
                </button>
              </li>
              <li>
                <button onClick={() => { setCurrentView('home'); setTimeout(() => document.getElementById('experiencias-section')?.scrollIntoView({ behavior: 'smooth' }), 100); }} className="hover:text-emerald-400 transition-colors">
                  Restauração & Bar
                </button>
              </li>
              <li>
                <button onClick={() => { setCurrentView('home'); setTimeout(() => document.getElementById('sobre-nos-section')?.scrollIntoView({ behavior: 'smooth' }), 100); }} className="hover:text-emerald-400 transition-colors">
                  Histórico da Empresa
                </button>
              </li>
              <li>
                <button onClick={() => { setCurrentView('home'); setTimeout(() => document.getElementById('contactos-section')?.scrollIntoView({ behavior: 'smooth' }), 100); }} className="hover:text-emerald-400 transition-colors">
                  Contactos & Localização
                </button>
              </li>
            </ul>
          </div>

          {/* Hospedaria Angolana Room Types */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 font-mono text-emerald-400">
              Quartos da Hospedaria
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => setCurrentView('accommodations')} className="hover:text-emerald-400 transition-colors">
                  Quartos Casal Clássicos
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('accommodations')} className="hover:text-emerald-400 transition-colors">
                  Quartos Casal Executivos
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('accommodations')} className="hover:text-emerald-400 transition-colors">
                  Quartos Solteiro Standard
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('accommodations')} className="hover:text-emerald-400 transition-colors">
                  Quartos Twin (2 Camas)
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('accommodations')} className="hover:text-emerald-400 transition-colors">
                  Suítes Master VIP
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('accommodations')} className="hover:text-emerald-400 transition-colors">
                  Quartos Económicos Diária
                </button>
              </li>
            </ul>
          </div>

          {/* Direct Support & Staff */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 font-mono text-emerald-400">
              Acesso Rápido
            </h4>
            <div className="space-y-3 text-xs text-slate-400">
              <p>Rotunda do Fubu sentido Talatona, oposto ao Eskebra.</p>
              <div className="space-y-2">
                <button
                  onClick={() => setActiveModal('auth')}
                  className="w-full py-2 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 text-left font-medium flex items-center justify-between border border-slate-800"
                >
                  <span>Área de Cadastro / Login</span>
                  <span className="text-emerald-400 text-[10px]">→</span>
                </button>
                <button
                  onClick={() => setCurrentView('admin')}
                  className="w-full py-2 px-3 rounded-lg bg-emerald-950/60 hover:bg-emerald-950 text-emerald-300 text-left font-semibold flex items-center justify-between border border-emerald-800/40"
                >
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Painel Administrativo</span>
                  </span>
                  <span className="text-[10px]">/admin</span>
                </button>
              </div>

              <div className="pt-2 text-[11px] text-slate-400">
                <div className="flex items-center gap-1 text-emerald-400 font-bold">
                  <Phone className="w-3 h-3" />
                  <span>{siteSettings.contactPhone1}</span>
                </div>
                <div>{siteSettings.contactPhone2}</div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} ZEMAN Trading & Services Lda. Todos os direitos reservados. • <span className="text-emerald-400 font-semibold">www.zeman.com</span>
          </div>

          <div className="flex items-center gap-6">
            <button onClick={() => setActiveModal('privacy')} className="hover:text-slate-300 transition-colors">
              Política de Privacidade
            </button>
            <button onClick={() => setActiveModal('terms')} className="hover:text-slate-300 transition-colors">
              Termos e Condições
            </button>
            <button onClick={() => setActiveModal('cancellation')} className="hover:text-slate-300 transition-colors">
              Cancelamentos
            </button>
            <button
              onClick={scrollToTop}
              className="p-2 rounded-full bg-slate-900 hover:bg-emerald-600 hover:text-white text-slate-400 transition-colors"
              title="Voltar ao Topo"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
