import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MapPin, Phone, Mail, Clock, Send, MessageCircle, CheckCircle2, Navigation } from 'lucide-react';

export const ContactAndLocation: React.FC = () => {
  const { siteSettings, sendSupportMessage } = useApp();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Reserva na Hospedaria',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendSupportMessage({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      subject: formData.subject,
      message: formData.message,
    });
    setFormSubmitted(true);
    setTimeout(() => {
      setFormData({ name: '', email: '', phone: '', subject: 'Reserva na Hospedaria', message: '' });
      setFormSubmitted(false);
    }, 4000);
  };

  return (
    <section id="contactos-section" className="py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Official Contact & Location from Flyer */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-black uppercase tracking-wider mb-3">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span>INFORMAÇÕES ADICIONAIS & LOCALIZAÇÃO</span>
              </div>
              
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-2 font-sans">
                Visite a Hospedaria ZEMAN
              </h2>
              
              <p className="text-emerald-700 font-bold text-xs uppercase tracking-wide mb-6">
                {siteSettings.slogan}
              </p>

              <div className="space-y-5">
                
                {/* Official Address from Flyer */}
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow">
                    <Navigation className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                      Localização Oficial
                    </h4>
                    <p className="text-xs font-semibold text-slate-800 mt-1 leading-relaxed">
                      {siteSettings.address}
                    </p>
                    <span className="text-[11px] text-emerald-700 font-medium block mt-1">
                      Ponto de referência: Lado oposto ao supermercado Eskebra
                    </span>
                  </div>
                </div>

                {/* Phones from Flyer */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center shrink-0 border border-slate-200">
                    <Phone className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Contactos Telefónicos Oficiais
                    </h4>
                    <div className="flex flex-col gap-0.5 mt-1">
                      <a href={`tel:${siteSettings.contactPhone1.replace(/\s+/g, '')}`} className="text-xs text-slate-900 font-bold hover:text-emerald-600">
                        {siteSettings.contactPhone1}
                      </a>
                      <a href={`tel:${siteSettings.contactPhone2.replace(/\s+/g, '')}`} className="text-xs text-slate-900 font-bold hover:text-emerald-600">
                        {siteSettings.contactPhone2}
                      </a>
                    </div>
                  </div>
                </div>

                {/* WhatsApp */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-200">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">WhatsApp & Reservas Rápidas</h4>
                    <a
                      href={`https://wa.me/244912345678?text=Ol%C3%A1%20ZEMAN,%20gostaria%20de%20reservar%20um%20quarto%20na%20hospedaria`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-emerald-700 font-bold hover:underline block mt-0.5"
                    >
                      {siteSettings.contactPhone1} • Conversar Agora no WhatsApp
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 border border-slate-200">
                    <Mail className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Correio Eletrónico</h4>
                    <a href={`mailto:${siteSettings.contactEmail}`} className="text-xs text-slate-900 font-semibold hover:text-emerald-600 block mt-0.5">
                      {siteSettings.contactEmail}
                    </a>
                  </div>
                </div>

                {/* Working Hours */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 border border-slate-200">
                    <Clock className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Horário da Hospedaria</h4>
                    <p className="text-xs text-slate-600 mt-0.5">{siteSettings.workingHours}</p>
                  </div>
                </div>

              </div>
            </div>

            {/* Visual Location Graphic */}
            <div className="mt-8 rounded-2xl overflow-hidden border border-emerald-800/40 bg-slate-950 relative h-40">
              <img
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80"
                alt="Mapa Talatona Fubu"
                className="w-full h-full object-cover opacity-50"
              />
              <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center">
                <div className="bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 border border-emerald-200">
                  <div className="w-3 h-3 rounded-full bg-emerald-600 animate-ping" />
                  <div>
                    <span className="text-xs font-black text-slate-900 block">ZEMAN Hospedaria & Serviços</span>
                    <span className="text-[10px] text-slate-600">Rotunda do Fubu sentido Talatona</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Form */}
          <div className="lg:col-span-7 bg-slate-50 p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="text-2xl font-black text-slate-900 mb-1 font-sans">
              Envie-nos uma Mensagem
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mb-6">
              A nossa equipa de apoio ao cliente responde prontamente a dúvidas sobre quartos, pernoitas, restauração e faturas.
            </p>

            {formSubmitted ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center text-emerald-800 animate-in fade-in">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
                <h4 className="font-bold text-sm">Mensagem Registada!</h4>
                <p className="text-xs mt-1 text-emerald-700">
                  A equipa da Hospedaria ZEMAN entrará em contacto consigo nas próximas horas.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Nome Completo *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: João Silva"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Endereço de Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="seuemail@exemplo.ao"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Contacto Telefónico
                    </label>
                    <input
                      type="tel"
                      placeholder="+244 9XX XXX XXX"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Assunto
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-emerald-500"
                    >
                      <option value="Reserva na Hospedaria">Reserva na Hospedaria</option>
                      <option value="Restauração e Refeições">Restauração e Refeições</option>
                      <option value="Estadias de Longa Duração">Estadias de Longa Duração</option>
                      <option value="Apoio ao Cliente">Apoio ao Cliente</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Mensagem ou Pedido *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Descreva as datas pretendidas ou a sua questão para a recepção da hospedaria..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-emerald-500 resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/20 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Enviar Mensagem para a Hospedaria</span>
                </button>
              </form>
            )}

          </div>

        </div>

      </div>
    </section>
  );
};
