import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { BenefitsBar } from './components/BenefitsBar';
import { FeaturedAccommodations } from './components/FeaturedAccommodations';
import { ExperiencesSection } from './components/ExperiencesSection';
import { WhyChooseZeman } from './components/WhyChooseZeman';
import { SpecialOffers } from './components/SpecialOffers';
import { ContactAndLocation } from './components/ContactAndLocation';
import { Footer } from './components/Footer';
import { AccommodationDetailModal } from './components/AccommodationDetailModal';
import { BookingFlowModal } from './components/BookingFlowModal';
import { AuthModal } from './components/AuthModal';
import { ClientDashboard } from './components/ClientDashboard';
import { AdminPanel } from './components/AdminPanel';
import { LegalModals } from './components/LegalModals';

const MainContent: React.FC = () => {
  const { currentView } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <Header />

      <main className="flex-1">
        {currentView === 'home' && (
          <>
            <Hero />
            <BenefitsBar />
            <div id="quartos-suites-section">
              <FeaturedAccommodations />
            </div>
            <ExperiencesSection />
            <WhyChooseZeman />
            <SpecialOffers />
            <ContactAndLocation />
          </>
        )}

        {currentView === 'accommodations' && (
          <div className="pt-24">
            <div className="bg-slate-950 text-white py-14 px-4 text-center border-b border-emerald-950">
              <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-widest block mb-1">
                HOSPEDARIA ZEMAN TRADING & SERVICES
              </span>
              <h1 className="text-3xl sm:text-5xl font-black font-sans text-white">
                Quartos a Modelo de Hospedaria Angolana
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto mt-2">
                Acomodações climatizadas na Rotunda do Fubu sentido Talatona, com gerador 24h, água pressurizada, TV DStv/ZAP e restauração típica.
              </p>
            </div>
            <FeaturedAccommodations />
            <BenefitsBar />
            <ContactAndLocation />
          </div>
        )}

        {currentView === 'client_dashboard' && <ClientDashboard />}

        {currentView === 'admin' && <AdminPanel />}
      </main>

      <Footer />

      {/* Global Modals */}
      <AccommodationDetailModal />
      <BookingFlowModal />
      <AuthModal />
      <LegalModals />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
