import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  User as UserIcon, 
  Calendar, 
  Clock, 
  CreditCard, 
  Star, 
  Bell, 
  Lock, 
  LogOut, 
  CheckCircle2, 
  AlertCircle, 
  PlusCircle, 
  X, 
  MapPin, 
  FileText,
  Printer,
  ChevronRight,
  ShieldCheck,
  Building,
  CheckCheck,
  Trash2,
  MessageSquare,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Booking } from '../types';

export const ClientDashboard: React.FC = () => {
  const { 
    currentUser, 
    bookings, 
    reviews, 
    cancelBooking, 
    submitReview, 
    updateUserProfile, 
    logout, 
    setCurrentView, 
    setActiveModal,
    formatKz,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
    clearAllNotifications
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    'reservas' | 'perfil' | 'avaliar' | 'notificacoes' | 'seguranca'
  >('reservas');

  const [notificationCategory, setNotificationCategory] = useState<
    'todas' | 'unread' | 'booking' | 'review' | 'support'
  >('todas');

  // Cancel modal state
  const [cancelModalBooking, setCancelModalBooking] = useState<Booking | null>(null);
  const [cancelReason, setCancelReason] = useState('');

  // Check-in instructions modal
  const [viewInstructionsBooking, setViewInstructionsBooking] = useState<Booking | null>(null);

  // Review submission state
  const [reviewBookingId, setReviewBookingId] = useState<string>('');
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewComment, setReviewComment] = useState<string>('');
  const [reviewSubmitted, setReviewSubmitted] = useState<boolean>(false);

  // Profile edit state
  const [profileName, setProfileName] = useState(currentUser?.fullName || '');
  const [profilePhone, setProfilePhone] = useState(currentUser?.phone || '');
  const [profileCountry, setProfileCountry] = useState(currentUser?.country || '');
  const [profileSuccess, setProfileSuccess] = useState(false);

  // Password edit state
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmNewPass, setConfirmNewPass] = useState('');
  const [passError, setPassError] = useState('');
  const [passSuccess, setPassSuccess] = useState(false);

  if (!currentUser) {
    return (
      <div className="pt-32 pb-24 max-w-lg mx-auto text-center px-4">
        <AlertCircle className="w-12 h-12 text-amber-600 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-slate-900">Sessão Não Iniciada</h2>
        <p className="text-sm text-slate-500 mt-1 mb-6">
          Por favor inicie sessão ou crie uma conta para aceder ao seu portal de cliente.
        </p>
        <button
          onClick={() => setActiveModal('auth')}
          className="px-6 py-3 bg-slate-950 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg"
        >
          Iniciar Sessão / Criar Conta
        </button>
      </div>
    );
  }

  // Filter bookings strictly for this client
  const myBookings = bookings.filter(
    (b) => b.userId === currentUser.id || b.guestEmail.toLowerCase() === currentUser.email.toLowerCase()
  );

  const activeOrUpcomingBookings = myBookings.filter(
    (b) => b.status === 'Confirmada' || b.status === 'Pendente'
  );

  const completedBookings = myBookings.filter((b) => b.status === 'Concluída');

  // Filter notifications strictly for this client
  const clientNotifications = notifications.filter((n) => {
    if (n.recipientRole && n.recipientRole !== 'client') return false;
    if (n.recipientUserId && n.recipientUserId !== currentUser.id) return false;
    if (n.recipientEmail && n.recipientEmail.toLowerCase() !== currentUser.email.toLowerCase()) return false;
    return true;
  });

  const unreadClientNotificationsCount = clientNotifications.filter((n) => !n.read).length;

  const filteredClientNotifications = clientNotifications.filter((n) => {
    if (notificationCategory === 'unread') return !n.read;
    if (notificationCategory === 'booking') return n.type === 'booking_status';
    if (notificationCategory === 'review') return n.type === 'review_request' || n.type === 'review_submitted';
    if (notificationCategory === 'support') return n.type === 'support_message' || n.type === 'system';
    return true;
  });

  const handleCancelSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cancelModalBooking) return;
    cancelBooking(cancelModalBooking.id, cancelReason || 'Cancelamento solicitado pelo hóspede no portal');
    setCancelModalBooking(null);
    setCancelReason('');
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const b = myBookings.find((item) => item.id === reviewBookingId);
    if (!b) return;

    submitReview({
      bookingId: b.id,
      accommodationId: b.accommodationId,
      accommodationName: b.accommodationName,
      guestName: currentUser.fullName,
      guestEmail: currentUser.email,
      rating: reviewRating,
      comment: reviewComment,
      userCountry: currentUser.country,
    });

    setReviewSubmitted(true);
    setReviewComment('');
    setTimeout(() => {
      setReviewSubmitted(false);
      setReviewBookingId('');
    }, 4000);
  };

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      fullName: profileName,
      phone: profilePhone,
      country: profileCountry,
    });
    setProfileSuccess(true);
    setTimeout(() => setProfileSuccess(false), 3000);
  };

  const handlePasswordSave = (e: React.FormEvent) => {
    e.preventDefault();
    setPassError('');
    if (newPass.length < 6) {
      setPassError('A nova palavra-passe deve conter pelo menos 6 carateres.');
      return;
    }
    if (newPass !== confirmNewPass) {
      setPassError('As palavras-passe não coincidem.');
      return;
    }
    updateUserProfile({ password: newPass });
    setPassSuccess(true);
    setCurrentPass('');
    setNewPass('');
    setConfirmNewPass('');
    setTimeout(() => setPassSuccess(false), 3000);
  };

  return (
    <div className="pt-28 pb-20 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Welcome Header */}
        <div className="bg-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border border-slate-800">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-green-400 text-white font-bold flex items-center justify-center text-2xl font-sans shadow-lg">
              {currentUser.fullName.charAt(0)}
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-widest block">
                PORTAL DO CLIENTE ZEMAN
              </span>
              <h1 className="font-serif-luxury text-2xl sm:text-4xl font-bold">
                Olá, {currentUser.fullName}
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                {currentUser.email} • {currentUser.country}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveModal('booking')}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-emerald-950/30"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Nova Reserva</span>
            </button>
            <button
              onClick={() => logout()}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-2 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sair</span>
            </button>
          </div>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Navigation Menu (3 cols) */}
          <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-sm p-3 space-y-1">
            <button
              onClick={() => setActiveTab('reservas')}
              className={`w-full p-3 rounded-xl text-left text-xs font-bold flex items-center justify-between transition-all ${
                activeTab === 'reservas' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Calendar className="w-4 h-4 text-amber-500" />
                <span>Minhas Reservas</span>
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-500/20 text-amber-300 font-mono">
                {myBookings.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('perfil')}
              className={`w-full p-3 rounded-xl text-left text-xs font-bold flex items-center gap-2.5 transition-all ${
                activeTab === 'perfil' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <UserIcon className="w-4 h-4 text-amber-500" />
              <span>Meu Perfil</span>
            </button>

            <button
              onClick={() => setActiveTab('avaliar')}
              className={`w-full p-3 rounded-xl text-left text-xs font-bold flex items-center gap-2.5 transition-all ${
                activeTab === 'avaliar' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Star className="w-4 h-4 text-amber-500" />
              <span>Avaliar Estadias</span>
            </button>

            <button
              onClick={() => setActiveTab('notificacoes')}
              className={`w-full p-3 rounded-xl text-left text-xs font-bold flex items-center justify-between transition-all ${
                activeTab === 'notificacoes' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Bell className={`w-4 h-4 ${unreadClientNotificationsCount > 0 ? 'text-emerald-500 animate-bounce' : 'text-amber-500'}`} />
                <span>Notificações</span>
              </span>
              {unreadClientNotificationsCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500 text-white font-bold animate-pulse">
                  {unreadClientNotificationsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('seguranca')}
              className={`w-full p-3 rounded-xl text-left text-xs font-bold flex items-center gap-2.5 transition-all ${
                activeTab === 'seguranca' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Lock className="w-4 h-4 text-amber-500" />
              <span>Segurança da Conta</span>
            </button>
          </div>

          {/* Right Main Panel Content (9 cols) */}
          <div className="lg:col-span-9 space-y-6">
            
            {/* TAB: MINHAS RESERVAS */}
            {activeTab === 'reservas' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif-luxury text-2xl font-bold text-slate-900">
                    Histórico & Reservas Ativas
                  </h3>
                  <span className="text-xs text-slate-500">
                    Total de {myBookings.length} reservas associadas à sua conta
                  </span>
                </div>

                {myBookings.length === 0 ? (
                  <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
                    <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <h4 className="text-base font-bold text-slate-800">Ainda não possui reservas efetuadas</h4>
                    <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto mb-6">
                      Explore os nossos alojamentos de luxo e garanta uma estadia inesquecível com a ZEMAN.
                    </p>
                    <button
                      onClick={() => setActiveModal('booking')}
                      className="px-6 py-3 bg-slate-950 hover:bg-amber-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg transition-colors"
                    >
                      Criar a Primeira Reserva
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {myBookings.map((b) => (
                      <div
                        key={b.id}
                        className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-mono font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                                {b.id}
                              </span>
                              <span className="text-xs text-slate-400">
                                Registada em {new Date(b.createdAt).toLocaleDateString('pt-PT')}
                              </span>
                            </div>
                            <h4 className="font-serif-luxury text-xl font-bold text-slate-900 mt-1">
                              {b.accommodationName}
                            </h4>
                            <p className="text-xs text-slate-500">{b.roomType}</p>
                          </div>

                          {/* Status Pills */}
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-bold ${
                                b.status === 'Confirmada'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : b.status === 'Pendente'
                                  ? 'bg-amber-100 text-amber-800'
                                  : b.status === 'Concluída'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              Estado: {b.status}
                            </span>
                            <span
                              className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                                b.paymentStatus === 'Pago'
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                  : 'bg-slate-50 text-slate-700 border-slate-200'
                              }`}
                            >
                              Pagamento: {b.paymentStatus}
                            </span>
                          </div>
                        </div>

                        {/* Booking Details Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 text-xs">
                          <div>
                            <span className="text-slate-400 uppercase font-bold text-[10px] block">Período</span>
                            <strong className="text-slate-900">{b.checkIn} a {b.checkOut}</strong>
                            <span className="text-slate-500 block text-[11px]">({b.nights} noites)</span>
                          </div>
                          <div>
                            <span className="text-slate-400 uppercase font-bold text-[10px] block">Hóspedes</span>
                            <strong className="text-slate-900">{b.guestsCount} Hóspedes</strong>
                            <span className="text-slate-500 block text-[11px]">Nº Quarto: {b.roomNumber || 'Atribuído no check-in'}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 uppercase font-bold text-[10px] block">Valor Total</span>
                            <strong className="text-slate-950 font-serif-luxury text-base">{formatKz(b.totalAmount)}</strong>
                            <span className="text-slate-500 block text-[10px]">{b.paymentMethod}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 uppercase font-bold text-[10px] block">Titular</span>
                            <strong className="text-slate-900 truncate block">{b.guestName}</strong>
                            <span className="text-slate-500 block text-[10px]">{b.guestPhone}</span>
                          </div>
                        </div>

                        {/* Actions Bar */}
                        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                          <button
                            onClick={() => setViewInstructionsBooking(b)}
                            className="text-amber-700 hover:text-amber-800 font-bold flex items-center gap-1.5"
                          >
                            <FileText className="w-4 h-4" />
                            <span>Instruções de Check-in & Voucher</span>
                          </button>

                          <div className="flex items-center gap-2">
                            {b.status === 'Concluída' && (
                              <button
                                onClick={() => {
                                  setReviewBookingId(b.id);
                                  setActiveTab('avaliar');
                                }}
                                className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold flex items-center gap-1"
                              >
                                <Star className="w-3.5 h-3.5 fill-current" />
                                <span>Avaliar Estadia</span>
                              </button>
                            )}

                            {(b.status === 'Confirmada' || b.status === 'Pendente') && (
                              <button
                                onClick={() => setCancelModalBooking(b)}
                                className="px-3 py-1.5 rounded-lg text-red-600 hover:bg-red-50 border border-red-200 font-semibold"
                              >
                                Solicitar Cancelamento
                              </button>
                            )}
                          </div>
                        </div>

                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB: MEU PERFIL */}
            {activeTab === 'perfil' && (
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
                <div>
                  <h3 className="font-serif-luxury text-2xl font-bold text-slate-900">
                    Dados Pessoais & Contactos
                  </h3>
                  <p className="text-xs text-slate-500">
                    Mantenha as suas informações atualizadas para emissão correta de faturas e comunicações de reserva.
                  </p>
                </div>

                {profileSuccess && (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Dados de perfil atualizados com sucesso!</span>
                  </div>
                )}

                <form onSubmit={handleProfileSave} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Nome Completo
                      </label>
                      <input
                        type="text"
                        required
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                        className="w-full p-3 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Endereço de Email
                      </label>
                      <input
                        type="email"
                        disabled
                        value={currentUser.email}
                        className="w-full p-3 rounded-xl border border-slate-200 bg-slate-100 text-xs text-slate-500 cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Número de Telefone / WhatsApp
                      </label>
                      <input
                        type="tel"
                        required
                        value={profilePhone}
                        onChange={(e) => setProfilePhone(e.target.value)}
                        className="w-full p-3 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        País de Residência
                      </label>
                      <input
                        type="text"
                        required
                        value={profileCountry}
                        onChange={(e) => setProfileCountry(e.target.value)}
                        className="w-full p-3 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="px-6 py-3 rounded-xl bg-slate-950 hover:bg-amber-600 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-colors"
                    >
                      Guardar Alterações
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* TAB: AVALIAR ESTADIAS */}
            {activeTab === 'avaliar' && (
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
                <div>
                  <h3 className="font-serif-luxury text-2xl font-bold text-slate-900">
                    Submeter Avaliação de Hóspede
                  </h3>
                  <p className="text-xs text-slate-500">
                    A sua opinião é fundamental para aprimorar os padrões de excelência da ZEMAN. As avaliações de estadias concluídas são validadas pela administração antes da publicação pública.
                  </p>
                </div>

                {reviewSubmitted && (
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <div>
                      <strong className="block font-bold">Avaliação Enviada com Sucesso!</strong>
                      <span>A sua avaliação encontra-se pendente de aprovação pela equipa ZEMAN e será publicada em breve.</span>
                    </div>
                  </div>
                )}

                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Selecione a Estadia a Avaliar *
                    </label>
                    <select
                      required
                      value={reviewBookingId}
                      onChange={(e) => setReviewBookingId(e.target.value)}
                      className="w-full p-3 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                    >
                      <option value="">-- Selecione uma das suas reservas --</option>
                      {myBookings.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.id} — {b.accommodationName} ({b.checkIn} a {b.checkOut}) [{b.status}]
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                      Classificação (1 a 5 Estrelas)
                    </label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((st) => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => setReviewRating(st)}
                          className="p-1 hover:scale-110 transition-transform"
                        >
                          <Star
                            className={`w-7 h-7 ${
                              st <= reviewRating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                            }`}
                          />
                        </button>
                      ))}
                      <span className="text-xs font-bold text-slate-700 ml-2">
                        {reviewRating} de 5 Estrelas
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Comentário & Experiência *
                    </label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Partilhe detalhes sobre o quarto, conforto das camas, serviço de receção, refeições e limpeza..."
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      className="w-full p-3 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-amber-500 resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={!reviewBookingId || !reviewComment}
                    className="px-6 py-3 rounded-xl bg-slate-950 hover:bg-amber-600 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-colors cursor-pointer"
                  >
                    Submeter Avaliação para Moderação
                  </button>
                </form>
              </div>
            )}

            {/* TAB: NOTIFICAÇÕES */}
            {activeTab === 'notificacoes' && (
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="font-serif-luxury text-2xl font-bold text-slate-900 flex items-center gap-2.5">
                      <span>Notificações & Alertas em Tempo Real</span>
                      {unreadClientNotificationsCount > 0 && (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                          {unreadClientNotificationsCount} nova{unreadClientNotificationsCount > 1 ? 's' : ''}
                        </span>
                      )}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Acompanhe alterações no estado das suas reservas, pedidos de avaliação pós-estadia e respostas de suporte da ZEMAN.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {unreadClientNotificationsCount > 0 && (
                      <button
                        onClick={() => markAllNotificationsAsRead('client', currentUser.id)}
                        className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                        title="Marcar todas as notificações como lidas"
                      >
                        <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Marcar como Lidas</span>
                      </button>
                    )}
                    {clientNotifications.length > 0 && (
                      <button
                        onClick={() => clearAllNotifications('client', currentUser.id)}
                        className="p-2 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-500 hover:text-red-600 transition-colors cursor-pointer"
                        title="Limpar todas as notificações"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Category Filter Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  <button
                    onClick={() => setNotificationCategory('todas')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                      notificationCategory === 'todas'
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Todas ({clientNotifications.length})
                  </button>
                  <button
                    onClick={() => setNotificationCategory('unread')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                      notificationCategory === 'unread'
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Não Lidas ({unreadClientNotificationsCount})
                  </button>
                  <button
                    onClick={() => setNotificationCategory('booking')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                      notificationCategory === 'booking'
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Reservas ({clientNotifications.filter((n) => n.type === 'booking_status').length})
                  </button>
                  <button
                    onClick={() => setNotificationCategory('review')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                      notificationCategory === 'review'
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Avaliações ({clientNotifications.filter((n) => n.type === 'review_request' || n.type === 'review_submitted').length})
                  </button>
                  <button
                    onClick={() => setNotificationCategory('support')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                      notificationCategory === 'support'
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Suporte & Mensagens ({clientNotifications.filter((n) => n.type === 'support_message' || n.type === 'system').length})
                  </button>
                </div>

                {/* Notifications List */}
                <div className="space-y-3">
                  {filteredClientNotifications.length === 0 ? (
                    <div className="text-center py-12 px-4 rounded-2xl bg-slate-50 border border-dashed border-slate-200">
                      <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                        <Bell className="w-6 h-6" />
                      </div>
                      <h4 className="font-bold text-slate-800 text-sm">Sem Notificações nesta categoria</h4>
                      <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                        Qualquer alteração de reservas, confirmações de pagamento ou respostas a pedidos de apoio serão alertadas aqui instantaneamente.
                      </p>
                    </div>
                  ) : (
                    filteredClientNotifications.map((notif) => {
                      const isUnread = !notif.read;
                      const dateObj = new Date(notif.createdAt);
                      const timeStr = !isNaN(dateObj.getTime())
                        ? dateObj.toLocaleDateString('pt-AO', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })
                        : notif.createdAt;

                      return (
                        <div
                          key={notif.id}
                          className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                            isUnread
                              ? 'bg-emerald-50/40 border-emerald-300 shadow-sm'
                              : 'bg-white border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-start gap-3.5">
                            {/* Type Icon Badge */}
                            <div className="shrink-0 mt-0.5">
                              {notif.type === 'booking_status' && (
                                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                                  isUnread ? 'bg-emerald-600 text-white shadow' : 'bg-emerald-100 text-emerald-800'
                                }`}>
                                  <Calendar className="w-4 h-4" />
                                </div>
                              )}
                              {(notif.type === 'review_request' || notif.type === 'review_submitted') && (
                                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                                  isUnread ? 'bg-amber-500 text-white shadow' : 'bg-amber-100 text-amber-800'
                                }`}>
                                  <Star className="w-4 h-4" />
                                </div>
                              )}
                              {notif.type === 'support_message' && (
                                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                                  isUnread ? 'bg-sky-600 text-white shadow' : 'bg-sky-100 text-sky-800'
                                }`}>
                                  <MessageSquare className="w-4 h-4" />
                                </div>
                              )}
                              {notif.type === 'system' && (
                                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                                  isUnread ? 'bg-slate-900 text-white shadow' : 'bg-slate-100 text-slate-700'
                                }`}>
                                  <Bell className="w-4 h-4" />
                                </div>
                              )}
                            </div>

                            {/* Content & Metadata */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                                    {notif.title}
                                  </h4>
                                  {isUnread && (
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 ring-4 ring-emerald-100 shrink-0"></span>
                                  )}
                                </div>
                                <span className="text-[11px] text-slate-400 font-mono shrink-0">
                                  {timeStr}
                                </span>
                              </div>

                              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                                {notif.message}
                              </p>

                              {/* Action Footer */}
                              <div className="flex flex-wrap items-center gap-2 mt-3 pt-2.5 border-t border-slate-100/80">
                                {notif.type === 'review_request' && (
                                  <button
                                    onClick={() => {
                                      if (notif.relatedBookingId) {
                                        setReviewBookingId(notif.relatedBookingId);
                                      }
                                      setActiveTab('avaliar');
                                      markNotificationAsRead(notif.id);
                                    }}
                                    className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-[11px] flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
                                  >
                                    <Star className="w-3.5 h-3.5" />
                                    <span>Avaliar Estadia Agora</span>
                                  </button>
                                )}

                                {notif.relatedBookingId && notif.type !== 'review_request' && (
                                  <button
                                    onClick={() => {
                                      setActiveTab('reservas');
                                      markNotificationAsRead(notif.id);
                                    }}
                                    className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-[11px] flex items-center gap-1.5 transition-colors cursor-pointer"
                                  >
                                    <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                                    <span>Ver Reserva #{notif.relatedBookingId}</span>
                                  </button>
                                )}

                                {isUnread && (
                                  <button
                                    onClick={() => markNotificationAsRead(notif.id)}
                                    className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold transition-colors cursor-pointer"
                                  >
                                    Marcar como lida
                                  </button>
                                )}

                                <button
                                  onClick={() => deleteNotification(notif.id)}
                                  className="ml-auto p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                                  title="Remover notificação"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}

            {/* TAB: SEGURANÇA DA CONTA */}
            {activeTab === 'seguranca' && (
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
                <div>
                  <h3 className="font-serif-luxury text-2xl font-bold text-slate-900">
                    Alteração de Palavra-passe
                  </h3>
                  <p className="text-xs text-slate-500">
                    Para reforçar a proteção da sua conta, escolha uma palavra-passe complexa e não a partilhe com terceiros.
                  </p>
                </div>

                {passError && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
                    {passError}
                  </div>
                )}
                {passSuccess && (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">
                    Palavra-passe alterada com sucesso!
                  </div>
                )}

                <form onSubmit={handlePasswordSave} className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Nova Palavra-passe
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="Mínimo 6 carateres"
                      value={newPass}
                      onChange={(e) => setNewPass(e.target.value)}
                      className="w-full p-3 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Confirmar Nova Palavra-passe
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="Repita a palavra-passe"
                      value={confirmNewPass}
                      onChange={(e) => setConfirmNewPass(e.target.value)}
                      className="w-full p-3 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl bg-slate-950 hover:bg-amber-600 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-colors"
                  >
                    Atualizar Palavra-passe
                  </button>
                </form>
              </div>
            )}

          </div>

        </div>

      </div>

      {/* CANCEL BOOKING MODAL */}
      {cancelModalBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h4 className="font-serif-luxury text-xl font-bold text-slate-900">
                Cancelar Reserva {cancelModalBooking.id}
              </h4>
              <button
                onClick={() => setCancelModalBooking(null)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Tem a certeza de que deseja solicitar o cancelamento da reserva em <strong>{cancelModalBooking.accommodationName}</strong>?
              O processo observará a política de cancelamento acordada.
            </p>

            <form onSubmit={handleCancelSubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Motivo do Cancelamento (Opcional):
                </label>
                <textarea
                  rows={2}
                  placeholder="Ex: Imprevisto profissional, alteração de voos..."
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none resize-none"
                ></textarea>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCancelModalBooking(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700"
                >
                  Manter Reserva
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 shadow"
                >
                  Confirmar Cancelamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CHECK-IN INSTRUCTIONS & VOUCHER MODAL */}
      {viewInstructionsBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-700 tracking-wider">
                  VOUCHER DE HOSPEDAGEM OFICIAL
                </span>
                <h4 className="font-serif-luxury text-2xl font-bold text-slate-900">
                  {viewInstructionsBooking.id}
                </h4>
              </div>
              <button
                onClick={() => setViewInstructionsBooking(null)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-semibold">Alojamento:</span>
                  <strong className="text-slate-900">{viewInstructionsBooking.accommodationName}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-semibold">Hóspede:</span>
                  <strong className="text-slate-900">{viewInstructionsBooking.guestName}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-semibold">Datas de Estadia:</span>
                  <strong className="text-slate-900">
                    {viewInstructionsBooking.checkIn} a {viewInstructionsBooking.checkOut}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-semibold">Estado do Pagamento:</span>
                  <strong className="text-amber-700">{viewInstructionsBooking.paymentStatus}</strong>
                </div>
              </div>

              <div className="border border-amber-200 bg-amber-50/60 p-4 rounded-xl space-y-2">
                <h5 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                  <Building className="w-4 h-4 text-amber-700" />
                  <span>Instruções de Chegada & Check-in:</span>
                </h5>
                <ul className="space-y-1 text-slate-600 text-[11px] list-disc list-inside">
                  <li>Check-in a partir das 14:00 na receção do alojamento.</li>
                  <li>Apresentar documento de identificação original (BI ou Passaporte).</li>
                  <li>Mencionar o código de reserva <strong>{viewInstructionsBooking.id}</strong>.</li>
                  <li>Se escolheu pagamento no check-in, o pagamento pode ser efetuado por Multicaixa (TPA) ou numerário.</li>
                  <li>Para transfer aeroporto ou check-in tardio, contactar +244 923 000 888.</li>
                </ul>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimir / Salvar PDF</span>
              </button>
              <button
                onClick={() => setViewInstructionsBooking(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-950 text-white text-xs font-bold"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
