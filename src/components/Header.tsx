import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Search, 
  Globe, 
  User as UserIcon, 
  Menu, 
  X, 
  ShieldCheck, 
  Phone,
  ChevronDown,
  Sparkles,
  Bell
} from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    currentView, 
    setCurrentView, 
    currentUser, 
    logout, 
    setActiveModal, 
    activeLanguage, 
    setActiveLanguage,
    setBookingDraft,
    siteSettings,
    notifications
  } = useApp();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const unreadNotifCount = currentUser
    ? notifications.filter((n) => {
        if (currentUser.role === 'client') {
          if (n.recipientRole && n.recipientRole !== 'client') return false;
          if (n.recipientUserId && n.recipientUserId !== currentUser.id) return false;
          if (n.recipientEmail && n.recipientEmail.toLowerCase() !== currentUser.email.toLowerCase()) return false;
          return !n.read;
        } else {
          return (n.recipientRole === 'admin' || n.recipientRole === 'all_staff') && !n.read;
        }
      }).length
    : 0;

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (viewName: any, sectionId?: string) => {
    setCurrentView(viewName);
    setMobileMenuOpen(false);
    if (sectionId) {
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleOpenBooking = () => {
    setBookingDraft(null);
    setActiveModal('booking');
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-slate-950/95 backdrop-blur-md shadow-xl py-2.5 text-white border-b border-emerald-900/40' 
          : 'bg-gradient-to-b from-slate-950/90 via-slate-950/60 to-transparent py-4 text-white'
      }`}
    >
      {/* Top micro contact bar */}
      <div className="hidden lg:block border-b border-slate-800/60 pb-2 mb-2 text-[11px] text-slate-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <Phone className="w-3.5 h-3.5" />
              <span>{siteSettings.contactPhone1} • {siteSettings.contactPhone2}</span>
            </span>
            <span className="text-slate-400">
              Rotunda do Fubu sentido Talatona (oposto ao Eskebra)
            </span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span className="text-emerald-400 font-semibold tracking-wide">
              {siteSettings.slogan}
            </span>
            <span className="font-handwriting text-amber-300 text-sm">
              "{siteSettings.tagline}"
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Official Brand Logo matching the ZEMAN poster */}
          <button 
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 text-left group focus:outline-none"
          >
            <div className="flex flex-col">
              {/* Outer boxed ZEMAN like flyer */}
              <div className="border-2 border-white px-2.5 py-0.5 rounded-sm bg-slate-950/40 shadow-sm flex items-center justify-center">
                <span className="text-xl sm:text-2xl font-black tracking-[0.18em] text-white font-sans">
                  ZEMAN
                </span>
              </div>
              <div className="flex items-center gap-1 mt-0.5 pl-0.5">
                <span className="h-[2px] w-3 bg-emerald-500 rounded-full" />
                <span className="text-[10px] sm:text-[11px] font-bold text-emerald-400 tracking-wider">
                  Trading & Services
                </span>
              </div>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium">
            <button
              onClick={() => handleNavClick('home')}
              className={`transition-colors hover:text-emerald-400 ${
                currentView === 'home' ? 'text-emerald-400 font-bold' : 'text-slate-200'
              }`}
            >
              Início
            </button>
            <button
              onClick={() => handleNavClick('accommodations', 'alojamentos-section')}
              className={`transition-colors hover:text-emerald-400 ${
                currentView === 'accommodations' ? 'text-emerald-400 font-bold' : 'text-slate-200'
              }`}
            >
              Hospedaria & Quartos
            </button>
            <button
              onClick={() => handleNavClick('home', 'quartos-suites-section')}
              className="text-slate-200 transition-colors hover:text-emerald-400"
            >
              Tipos de Quartos
            </button>
            <button
              onClick={() => handleNavClick('home', 'experiencias-section')}
              className="text-slate-200 transition-colors hover:text-emerald-400"
            >
              Restauração & Serviços
            </button>
            <button
              onClick={() => handleNavClick('home', 'sobre-nos-section')}
              className="text-slate-200 transition-colors hover:text-emerald-400"
            >
              Histórico & Sobre Nós
            </button>
            <button
              onClick={() => handleNavClick('home', 'contactos-section')}
              className="text-slate-200 transition-colors hover:text-emerald-400"
            >
              Contactos & Localização
            </button>
          </nav>

          {/* Right Action Icons & Buttons */}
          <div className="hidden sm:flex items-center gap-3.5">
            
            {/* Quick Search Anchor */}
            <button
              onClick={() => {
                if (currentView !== 'home') setCurrentView('home');
                setTimeout(() => {
                  const searchEl = document.getElementById('search-bar-widget');
                  if (searchEl) searchEl.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="p-2 rounded-full hover:bg-white/10 text-slate-200 hover:text-white transition-colors"
              title="Pesquisar quartos"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-white/10 hover:bg-white/20 text-slate-100 transition-colors"
              >
                <Globe className="w-3.5 h-3.5 text-emerald-400" />
                <span>{activeLanguage}</span>
                <ChevronDown className="w-3 h-3 text-slate-300" />
              </button>
              {langDropdownOpen && (
                <div className="absolute right-0 mt-2 w-28 bg-slate-900 border border-slate-700 rounded-lg shadow-xl py-1 text-xs z-50 text-slate-200">
                  <button
                    onClick={() => { setActiveLanguage('PT'); setLangDropdownOpen(false); }}
                    className={`w-full px-3 py-1.5 text-left hover:bg-slate-800 flex items-center justify-between ${
                      activeLanguage === 'PT' ? 'text-emerald-400 font-bold' : ''
                    }`}
                  >
                    <span>Português</span>
                    {activeLanguage === 'PT' && <span className="text-[10px]">✓</span>}
                  </button>
                  <button
                    onClick={() => { setActiveLanguage('EN'); setLangDropdownOpen(false); }}
                    className={`w-full px-3 py-1.5 text-left hover:bg-slate-800 flex items-center justify-between ${
                      activeLanguage === 'EN' ? 'text-emerald-400 font-bold' : ''
                    }`}
                  >
                    <span>English</span>
                    {activeLanguage === 'EN' && <span className="text-[10px]">✓</span>}
                  </button>
                </div>
              )}
            </div>

            {/* User Account / Login */}
            {currentUser ? (
              <div className="flex items-center gap-2">
                {/* Notification Bell Header Shortcut */}
                <button
                  onClick={() => {
                    if (currentUser.role === 'client') {
                      setCurrentView('client_dashboard');
                    } else {
                      setCurrentView('admin');
                    }
                  }}
                  className="relative p-2 rounded-full hover:bg-white/10 text-slate-200 hover:text-white transition-colors cursor-pointer"
                  title={currentUser.role === 'client' ? 'Minhas Notificações' : 'Notificações do Painel'}
                >
                  <Bell className={`w-4 h-4 ${unreadNotifCount > 0 ? 'text-amber-400 animate-bounce' : 'text-slate-300'}`} />
                  {unreadNotifCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 rounded-full bg-emerald-500 text-white font-bold text-[9px] flex items-center justify-center animate-pulse shadow-sm">
                      {unreadNotifCount}
                    </span>
                  )}
                </button>

                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-slate-800/90 border border-slate-700 hover:border-emerald-500/50 transition-all text-xs cursor-pointer"
                  >
                    <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-emerald-600 to-green-400 text-slate-950 font-bold flex items-center justify-center text-[11px]">
                      {currentUser.fullName.charAt(0)}
                    </div>
                    <span className="font-medium max-w-[100px] truncate text-slate-200">
                      {currentUser.fullName.split(' ')[0]}
                    </span>
                    <ChevronDown className="w-3 h-3 text-slate-400" />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-2 text-xs text-slate-200 z-50">
                      <div className="px-4 py-2 border-b border-slate-800">
                        <p className="font-semibold text-white truncate">{currentUser.fullName}</p>
                        <p className="text-[11px] text-slate-400 truncate">{currentUser.email}</p>
                        <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-500/20 text-emerald-300">
                          {currentUser.role === 'client' ? 'Hóspede ZEMAN' : `Staff (${currentUser.role})`}
                        </span>
                      </div>

                      {currentUser.role === 'client' ? (
                        <>
                          <button
                            onClick={() => {
                              setCurrentView('client_dashboard');
                              setUserDropdownOpen(false);
                            }}
                            className="w-full px-4 py-2 text-left hover:bg-slate-800 flex items-center gap-2 text-slate-200 cursor-pointer"
                          >
                            <UserIcon className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Área do Cliente</span>
                          </button>
                          <button
                            onClick={() => {
                              setCurrentView('client_dashboard');
                              setUserDropdownOpen(false);
                            }}
                            className="w-full px-4 py-2 text-left hover:bg-slate-800 flex items-center justify-between text-slate-200 cursor-pointer"
                          >
                            <span className="flex items-center gap-2">
                              <Bell className="w-3.5 h-3.5 text-amber-400" />
                              <span>Notificações</span>
                            </span>
                            {unreadNotifCount > 0 && (
                              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-500 text-white font-bold">
                                {unreadNotifCount}
                              </span>
                            )}
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => {
                              setCurrentView('admin');
                              setUserDropdownOpen(false);
                            }}
                            className="w-full px-4 py-2 text-left hover:bg-slate-800 flex items-center gap-2 text-emerald-400 font-semibold cursor-pointer"
                          >
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>Painel Administrativo</span>
                          </button>
                          <button
                            onClick={() => {
                              setCurrentView('admin');
                              setUserDropdownOpen(false);
                            }}
                            className="w-full px-4 py-2 text-left hover:bg-slate-800 flex items-center justify-between text-slate-200 cursor-pointer"
                          >
                            <span className="flex items-center gap-2">
                              <Bell className="w-3.5 h-3.5 text-amber-400" />
                              <span>Notificações Staff</span>
                            </span>
                            {unreadNotifCount > 0 && (
                              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-red-500 text-white font-bold">
                                {unreadNotifCount}
                              </span>
                            )}
                          </button>
                        </>
                      )}

                    <button
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-red-500/10 text-red-400 flex items-center gap-2 border-t border-slate-800 mt-1"
                    >
                      <span>Terminar Sessão</span>
                    </button>
                  </div>
                )}
                </div>
              </div>
            ) : (
              <button
                onClick={() => setActiveModal('auth')}
                className="text-xs font-medium text-slate-200 hover:text-white px-3 py-1.5 rounded-full border border-slate-700 hover:border-emerald-500 transition-colors flex items-center gap-1.5"
              >
                <UserIcon className="w-3.5 h-3.5 text-emerald-400" />
                <span>Área de Cadastro</span>
              </button>
            )}

            {/* Admin Quick Switch button for staff demo */}
            <button
              onClick={() => setCurrentView(currentView === 'admin' ? 'home' : 'admin')}
              className={`text-[11px] px-2.5 py-1 rounded-md border transition-colors flex items-center gap-1 ${
                currentView === 'admin'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400'
                  : 'bg-slate-850 text-slate-300 border-slate-700 hover:bg-slate-800'
              }`}
              title="Aceder ao Painel Administrativo"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden md:inline">{currentView === 'admin' ? 'Ver Website' : 'Admin'}</span>
            </button>

            {/* "Reservar Agora" Button matching poster green */}
            <button
              onClick={handleOpenBooking}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-full text-xs shadow-md shadow-emerald-900/50 transition-all transform hover:-translate-y-0.5 flex items-center gap-1.5 cursor-pointer"
            >
              <span>Reservar Agora</span>
              <span>→</span>
            </button>

          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={handleOpenBooking}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1.5 rounded-full text-xs"
            >
              Reservar
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-800 text-white hover:bg-slate-700"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-950/98 border-b border-emerald-950 backdrop-blur-xl px-6 py-6 text-slate-200 space-y-4">
          <div className="flex flex-col space-y-3 font-medium text-base">
            <button
              onClick={() => handleNavClick('home')}
              className="text-left py-2 hover:text-emerald-400 border-b border-slate-800/60"
            >
              Início
            </button>
            <button
              onClick={() => handleNavClick('accommodations', 'alojamentos-section')}
              className="text-left py-2 hover:text-emerald-400 border-b border-slate-800/60"
            >
              Hospedaria & Quartos
            </button>
            <button
              onClick={() => handleNavClick('home', 'quartos-suites-section')}
              className="text-left py-2 hover:text-emerald-400 border-b border-slate-800/60"
            >
              Tipos de Quartos
            </button>
            <button
              onClick={() => handleNavClick('home', 'experiencias-section')}
              className="text-left py-2 hover:text-emerald-400 border-b border-slate-800/60"
            >
              Restauração & Serviços
            </button>
            <button
              onClick={() => handleNavClick('home', 'sobre-nos-section')}
              className="text-left py-2 hover:text-emerald-400 border-b border-slate-800/60"
            >
              Histórico & Sobre Nós
            </button>
            <button
              onClick={() => handleNavClick('home', 'contactos-section')}
              className="text-left py-2 hover:text-emerald-400 border-b border-slate-800/60"
            >
              Contactos & Localização
            </button>
          </div>

          <div className="pt-3 border-t border-slate-800 text-xs space-y-2">
            <div className="text-emerald-400 font-bold">
              Telefones: {siteSettings.contactPhone1} / {siteSettings.contactPhone2}
            </div>
            <div className="text-slate-400">
              Rotunda do Fubu sentido Talatona, oposto ao supermercado Eskebra
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 space-y-3">
            {currentUser ? (
              <div className="space-y-2">
                <div className="text-xs text-emerald-400 font-semibold">
                  Sessão iniciada como: {currentUser.fullName}
                </div>
                {currentUser.role === 'client' ? (
                  <>
                    <button
                      onClick={() => {
                        setCurrentView('client_dashboard');
                        setMobileMenuOpen(false);
                      }}
                      className="w-full py-2 px-4 rounded-lg bg-slate-800 text-left font-medium text-sm flex items-center gap-2 cursor-pointer"
                    >
                      <UserIcon className="w-4 h-4 text-emerald-400" />
                      <span>Área do Cliente</span>
                    </button>
                    <button
                      onClick={() => {
                        setCurrentView('client_dashboard');
                        setMobileMenuOpen(false);
                      }}
                      className="w-full py-2 px-4 rounded-lg bg-slate-800 text-left font-medium text-sm flex items-center justify-between cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <Bell className="w-4 h-4 text-amber-400" />
                        <span>Notificações</span>
                      </span>
                      {unreadNotifCount > 0 && (
                        <span className="px-2 py-0.5 rounded-full text-xs bg-emerald-500 text-white font-bold">
                          {unreadNotifCount}
                        </span>
                      )}
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setCurrentView('admin');
                        setMobileMenuOpen(false);
                      }}
                      className="w-full py-2 px-4 rounded-lg bg-emerald-950/60 text-emerald-300 font-semibold text-sm flex items-center gap-2 cursor-pointer"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>Painel Administrativo</span>
                    </button>
                    <button
                      onClick={() => {
                        setCurrentView('admin');
                        setMobileMenuOpen(false);
                      }}
                      className="w-full py-2 px-4 rounded-lg bg-slate-800 text-left font-medium text-sm flex items-center justify-between cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <Bell className="w-4 h-4 text-amber-400" />
                        <span>Notificações Staff</span>
                      </span>
                      {unreadNotifCount > 0 && (
                        <span className="px-2 py-0.5 rounded-full text-xs bg-red-500 text-white font-bold">
                          {unreadNotifCount}
                        </span>
                      )}
                    </button>
                  </>
                )}
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2 px-4 rounded-lg bg-red-950/40 text-red-400 text-left text-sm"
                >
                  Terminar Sessão
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setActiveModal('auth');
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 rounded-lg border border-emerald-600 bg-emerald-950/60 text-center text-sm font-semibold text-white"
              >
                Área de Cadastro / Entrar
              </button>
            )}

            <button
              onClick={() => {
                setCurrentView(currentView === 'admin' ? 'home' : 'admin');
                setMobileMenuOpen(false);
              }}
              className="w-full py-2 text-center text-xs text-slate-400 flex items-center justify-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>{currentView === 'admin' ? 'Voltar ao Website' : 'Acesso Equipa / Painel Administrativo'}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
