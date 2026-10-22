import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  LayoutDashboard, 
  Bed, 
  Calendar, 
  Users, 
  DollarSign, 
  FileText, 
  ShieldCheck, 
  Plus, 
  Edit3, 
  Trash2, 
  Check, 
  X, 
  Filter, 
  Download, 
  Search, 
  Clock, 
  ArrowLeft,
  Building,
  Key,
  MessageSquare,
  AlertTriangle,
  Sparkles,
  BarChart3,
  CalendarDays,
  Lock,
  Bell,
  Mail,
  CheckCheck,
  Send,
  MessageCircle,
  ExternalLink,
  Star,
  Globe,
  Copy,
  Terminal,
  Server,
  FolderArchive,
  CloudUpload,
  CheckCircle2,
  Cpu
} from 'lucide-react';
import { 
  Accommodation, 
  Booking, 
  BookingStatus, 
  PaymentStatus, 
  RoomUnit, 
  UserRole,
  AccommodationCategory,
  SupportMessage,
  AppNotification
} from '../types';

export const AdminPanel: React.FC = () => {
  const { 
    currentUser, 
    switchUserRole,
    setCurrentView,
    accommodations, 
    saveAccommodation, 
    deleteAccommodation,
    roomUnits, 
    saveRoomUnit, 
    toggleRoomBlockDate,
    bookings, 
    updateBookingStatus, 
    users, 
    reviews, 
    approveReview, 
    rejectReview,
    offers, 
    saveOffer, 
    siteSettings, 
    updateSiteSettings,
    formatKz,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
    clearAllNotifications,
    supportMessages,
    replySupportMessage
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'alojamentos' | 'quartos' | 'reservas' | 'clientes' | 'financeiro' | 'conteudos' | 'equipa' | 'notificacoes' | 'mensagens' | 'deploy'
  >('dashboard');

  // Filter States for Reservations
  const [reservationSearch, setReservationSearch] = useState('');
  const [reservationStatusFilter, setReservationStatusFilter] = useState<string>('todos');
  const [reservationAccFilter, setReservationAccFilter] = useState<string>('todos');

  // Selected Booking for Detailed View & Action
  const [selectedBookingDetails, setSelectedBookingDetails] = useState<Booking | null>(null);
  const [internalNoteText, setInternalNoteText] = useState('');

  // Notification and Support Center States
  const [adminNotifFilter, setAdminNotifFilter] = useState<'all' | 'unread' | 'booking' | 'review' | 'support'>('all');
  const [supportFilter, setSupportFilter] = useState<'all' | 'unread' | 'replied'>('all');
  const [selectedSupportMessage, setSelectedSupportMessage] = useState<SupportMessage | null>(null);
  const [replyInputText, setReplyInputText] = useState('');
  const [replySuccess, setReplySuccess] = useState(false);

  // Deploy and Code Center State
  const [deploySubTab, setDeploySubTab] = useState<'git' | 'htaccess' | 'actions' | 'hostinger' | 'checklist'>('git');
  const [githubUserRepo, setGithubUserRepo] = useState('https://github.com/SEU-USUARIO/zeman-trading-services.git');
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);
  const [deployChecks, setDeployChecks] = useState<Record<string, boolean>>({
    distBuild: true,
    htaccessPresent: true,
    spaRouting: true,
    httpsEnforced: true,
    domainDns: false,
    sslCert: false,
    testBooking: true,
  });

  const handleCopy = (text: string, snippetKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippet(snippetKey);
    setTimeout(() => setCopiedSnippet(null), 2500);
  };

  const handleDownload = (filename: string, content: string, contentType: string = 'text/plain') => {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Accommodation Edit Modal
  const [editingAcc, setEditingAcc] = useState<Accommodation | null>(null);
  const [isNewAcc, setIsNewAcc] = useState<boolean>(false);

  // Room Edit Modal
  const [editingRoom, setEditingRoom] = useState<RoomUnit | null>(null);

  // New Operator modal
  const [newStaffModal, setNewStaffModal] = useState(false);
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffEmail, setNewStaffEmail] = useState('');
  const [newStaffRole, setNewStaffRole] = useState<UserRole>('reservation_manager');

  // Check permissions based on current user role
  const userRole = currentUser?.role || 'admin';
  const hasFullAccess = userRole === 'admin';
  const canManageReservations = hasFullAccess || userRole === 'reservation_manager';
  const canManageProperties = hasFullAccess || userRole === 'property_manager';
  const canManageFinance = hasFullAccess || userRole === 'finance';

  // --- Real KPI Calculations ---
  const todayStr = new Date().toISOString().split('T')[0];
  const totalBookingsCount = bookings.length;
  const pendingBookingsCount = bookings.filter((b) => b.status === 'Pendente').length;
  const confirmedBookingsCount = bookings.filter((b) => b.status === 'Confirmada').length;
  const checkInsToday = bookings.filter((b) => b.checkIn === todayStr).length;
  const checkOutsToday = bookings.filter((b) => b.checkOut === todayStr).length;

  const totalRevenue = bookings
    .filter((b) => b.paymentStatus === 'Pago' || b.paymentStatus === 'Parcialmente Pago')
    .reduce((sum, b) => sum + b.totalAmount, 0);

  const pendingRevenue = bookings
    .filter((b) => b.paymentStatus === 'Pendente' || b.paymentStatus === 'Não Pago')
    .reduce((sum, b) => sum + b.totalAmount, 0);

  const availableRoomsCount = roomUnits.filter((r) => r.status === 'available').length;
  const totalRoomsCount = roomUnits.length;
  const occupancyRate = totalRoomsCount > 0 ? Math.round(((totalRoomsCount - availableRoomsCount) / totalRoomsCount) * 100) : 0;

  // Admin notifications and support calculation
  const adminNotifications = notifications.filter(
    (n) => n.recipientRole === 'admin' || n.recipientRole === 'all_staff'
  );
  const unreadAdminNotificationsCount = adminNotifications.filter((n) => !n.read).length;
  const unreadSupportCount = supportMessages.filter((s) => s.status === 'unread').length;

  const filteredAdminNotifications = adminNotifications.filter((n) => {
    if (adminNotifFilter === 'unread') return !n.read;
    if (adminNotifFilter === 'booking') return n.type === 'booking_status';
    if (adminNotifFilter === 'review') return n.type === 'review_submitted' || n.type === 'review_request';
    if (adminNotifFilter === 'support') return n.type === 'support_message' || n.type === 'system';
    return true;
  });

  const filteredSupportMessages = supportMessages.filter((s) => {
    if (supportFilter === 'unread') return s.status === 'unread';
    if (supportFilter === 'replied') return s.status === 'replied';
    return true;
  });

  // Filtered Bookings Table
  const filteredBookings = bookings.filter((b) => {
    if (reservationStatusFilter !== 'todos' && b.status !== reservationStatusFilter) return false;
    if (reservationAccFilter !== 'todos' && b.accommodationId !== reservationAccFilter) return false;
    if (reservationSearch) {
      const q = reservationSearch.toLowerCase();
      const match = b.id.toLowerCase().includes(q) ||
                    b.guestName.toLowerCase().includes(q) ||
                    b.guestEmail.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  // Export Bookings to CSV
  const handleExportCSV = () => {
    const headers = 'ID,Alojamento,Hóspede,Email,Telefone,CheckIn,CheckOut,Noites,Hóspedes,ValorTotal,Estado,Pagamento\n';
    const rows = filteredBookings
      .map(
        (b) =>
          `"${b.id}","${b.accommodationName}","${b.guestName}","${b.guestEmail}","${b.guestPhone}","${b.checkIn}","${b.checkOut}",${b.nights},${b.guestsCount},${b.totalAmount},"${b.status}","${b.paymentStatus}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `ZEMAN_Reservas_${todayStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="pt-24 pb-20 bg-slate-900 min-h-screen text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header & Role Switcher */}
        <div className="bg-slate-950 rounded-3xl p-6 border border-slate-800 shadow-2xl mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold text-amber-400 tracking-widest">
                  PAINEL DE CONTROLO OPERACIONAL
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300">
                  /admin
                </span>
              </div>
              <h1 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-white">
                ZEMAN Trading & Services — Backoffice
              </h1>
              <p className="text-xs text-slate-400">
                Operador: <strong className="text-slate-200">{currentUser?.fullName || 'Administrador'}</strong> ({userRole})
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Quick role test switcher */}
            <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
              <span className="text-slate-400">Perfil Ativo:</span>
              <select
                value={userRole}
                onChange={(e) => switchUserRole(e.target.value as UserRole)}
                className="bg-transparent font-bold text-amber-300 focus:outline-none cursor-pointer"
              >
                <option value="admin" className="bg-slate-900 text-white">Administrador Principal</option>
                <option value="reservation_manager" className="bg-slate-900 text-white">Gestor de Reservas</option>
                <option value="property_manager" className="bg-slate-900 text-white">Gestor de Alojamentos</option>
                <option value="finance" className="bg-slate-900 text-white">Financeiro</option>
              </select>
            </div>

            {/* Notification Bell Quick Action */}
            <button
              onClick={() => setActiveTab('notificacoes')}
              className="relative p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
              title="Notificações Operacionais & Alertas"
            >
              <Bell className="w-4 h-4 text-amber-400" />
              {unreadAdminNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-red-500 text-white font-bold text-[10px] flex items-center justify-center animate-pulse">
                  {unreadAdminNotificationsCount}
                </span>
              )}
            </button>

            {/* Support Messages Quick Action */}
            <button
              onClick={() => setActiveTab('mensagens')}
              className="relative p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
              title="Mensagens de Suporte e Contactos"
            >
              <Mail className="w-4 h-4 text-emerald-400" />
              {unreadSupportCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-emerald-500 text-slate-950 font-bold text-[10px] flex items-center justify-center">
                  {unreadSupportCount}
                </span>
              )}
            </button>

            {/* Deploy & Code Center Quick Action */}
            <button
              onClick={() => setActiveTab('deploy')}
              className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-md shadow-emerald-950/40"
              title="Publicação & Exportação de Código (GitHub e Hostinger)"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Publicação & Código</span>
            </button>

            <button
              onClick={() => setCurrentView('home')}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Ver Website Público</span>
            </button>
          </div>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none border-b border-slate-800">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-2 transition-all ${
              activeTab === 'dashboard' ? 'bg-amber-500 text-slate-950 shadow-lg' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard Geral</span>
          </button>

          {(hasFullAccess || canManageProperties) && (
            <button
              onClick={() => setActiveTab('alojamentos')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-2 transition-all ${
                activeTab === 'alojamentos' ? 'bg-amber-500 text-slate-950 shadow-lg' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Building className="w-4 h-4" />
              <span>Gestão de Alojamentos</span>
            </button>
          )}

          {(hasFullAccess || canManageProperties) && (
            <button
              onClick={() => setActiveTab('quartos')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-2 transition-all ${
                activeTab === 'quartos' ? 'bg-amber-500 text-slate-950 shadow-lg' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Bed className="w-4 h-4" />
              <span>Quartos & Calendário</span>
            </button>
          )}

          {(hasFullAccess || canManageReservations) && (
            <button
              onClick={() => setActiveTab('reservas')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-2 transition-all ${
                activeTab === 'reservas' ? 'bg-amber-500 text-slate-950 shadow-lg' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Gestão de Reservas</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-950 text-amber-300">
                {bookings.length}
              </span>
            </button>
          )}

          {(hasFullAccess || canManageReservations) && (
            <button
              onClick={() => setActiveTab('clientes')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-2 transition-all ${
                activeTab === 'clientes' ? 'bg-amber-500 text-slate-950 shadow-lg' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Clientes & Hóspedes</span>
            </button>
          )}

          {(hasFullAccess || canManageFinance) && (
            <button
              onClick={() => setActiveTab('financeiro')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-2 transition-all ${
                activeTab === 'financeiro' ? 'bg-amber-500 text-slate-950 shadow-lg' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <DollarSign className="w-4 h-4" />
              <span>Gestão Financeira</span>
            </button>
          )}

          {hasFullAccess && (
            <button
              onClick={() => setActiveTab('conteudos')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-2 transition-all ${
                activeTab === 'conteudos' ? 'bg-amber-500 text-slate-950 shadow-lg' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Moderação & Conteúdos</span>
              {reviews.filter((r) => r.status === 'pending').length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-red-500 text-white font-bold animate-pulse">
                  {reviews.filter((r) => r.status === 'pending').length}
                </span>
              )}
            </button>
          )}

          {hasFullAccess && (
            <button
              onClick={() => setActiveTab('equipa')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'equipa' ? 'bg-amber-500 text-slate-950 shadow-lg' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Key className="w-4 h-4" />
              <span>Utilizadores & Acessos</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('notificacoes')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'notificacoes' ? 'bg-amber-500 text-slate-950 shadow-lg' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>Notificações & Alertas</span>
            {unreadAdminNotificationsCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-red-500 text-white font-bold animate-pulse">
                {unreadAdminNotificationsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('mensagens')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'mensagens' ? 'bg-amber-500 text-slate-950 shadow-lg' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Suporte & Contactos</span>
            {unreadSupportCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-500 text-slate-950 font-bold">
                {unreadSupportCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('deploy')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'deploy' ? 'bg-amber-500 text-slate-950 shadow-lg' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Globe className="w-4 h-4 text-emerald-400" />
            <span>Publicação & Hostinger / GitHub</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Pronto
            </span>
          </button>
        </div>

        {/* ======================================================== */}
        {/* TAB 1: DASHBOARD METRICS                                 */}
        {/* ======================================================== */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            
            {/* KPI Cards Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Total de Reservas</span>
                <div className="text-3xl font-bold font-serif-luxury text-white mt-1">{totalBookingsCount}</div>
                <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
                  <span>{confirmedBookingsCount} confirmadas</span>
                  <span>•</span>
                  <span className="text-amber-400">{pendingBookingsCount} pendentes</span>
                </div>
              </div>

              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Receita Total Registada</span>
                <div className="text-2xl sm:text-3xl font-bold font-serif-luxury text-amber-400 mt-1">
                  {formatKz(totalRevenue)}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  {formatKz(pendingRevenue)} pendente de liquidação
                </div>
              </div>

              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Taxa de Ocupação</span>
                <div className="text-3xl font-bold font-serif-luxury text-white mt-1">{occupancyRate}%</div>
                <div className="text-[11px] text-slate-400 mt-1">
                  {availableRoomsCount} de {totalRoomsCount} quartos livres hoje
                </div>
              </div>

              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Movimento de Hoje</span>
                <div className="flex items-center gap-4 mt-2">
                  <div>
                    <span className="text-xl font-bold text-emerald-400">{checkInsToday}</span>
                    <span className="text-[10px] text-slate-400 block">Check-ins</span>
                  </div>
                  <div className="w-px h-8 bg-slate-800" />
                  <div>
                    <span className="text-xl font-bold text-blue-400">{checkOutsToday}</span>
                    <span className="text-[10px] text-slate-400 block">Check-outs</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Bookings & Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left: Recent Bookings Table (8 cols) */}
              <div className="lg:col-span-8 bg-slate-950 rounded-2xl p-6 border border-slate-800">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-serif-luxury text-xl font-bold text-white">
                    Últimas Solicitações de Reserva
                  </h3>
                  <button
                    onClick={() => setActiveTab('reservas')}
                    className="text-xs text-amber-400 hover:underline"
                  >
                    Ver todas as reservas →
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                        <th className="py-2.5">Referência</th>
                        <th>Hóspede</th>
                        <th>Alojamento</th>
                        <th>Datas</th>
                        <th>Valor</th>
                        <th>Estado</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-850">
                      {bookings.slice(0, 5).map((b) => (
                        <tr key={b.id} className="hover:bg-slate-900/50">
                          <td className="py-3 font-mono font-bold text-amber-400">{b.id}</td>
                          <td className="font-semibold text-white">{b.guestName}</td>
                          <td className="text-slate-300 max-w-[150px] truncate">{b.accommodationName}</td>
                          <td className="text-slate-400">{b.checkIn}</td>
                          <td className="font-bold text-slate-200">{formatKz(b.totalAmount)}</td>
                          <td>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              b.status === 'Confirmada' ? 'bg-emerald-950 text-emerald-400' :
                              b.status === 'Pendente' ? 'bg-amber-950 text-amber-400' : 'bg-slate-800 text-slate-400'
                            }`}>
                              {b.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Right: Operational Status & Pending Alerts (4 cols) */}
              <div className="lg:col-span-4 space-y-4">
                <div className="bg-slate-950 rounded-2xl p-6 border border-slate-800">
                  <h4 className="font-serif-luxury text-lg font-bold text-white mb-3">
                    Avisos & Tarefas Operacionais
                  </h4>
                  <div className="space-y-3 text-xs">
                    {pendingBookingsCount > 0 && (
                      <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-800/60 text-amber-300 flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                        <div>
                          <strong>{pendingBookingsCount} Reservas Pendentes</strong>
                          <p className="text-[11px] text-amber-200/80 mt-0.5">
                            Aguardam validação de comprovativo ou confirmação de disponibilidade.
                          </p>
                        </div>
                      </div>
                    )}

                    {reviews.filter((r) => r.status === 'pending').length > 0 && (
                      <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-800/60 text-blue-300 flex items-start gap-2">
                        <MessageSquare className="w-4 h-4 shrink-0 mt-0.5" />
                        <div>
                          <strong>Avaliações Aguardam Moderação</strong>
                          <p className="text-[11px] text-blue-200/80 mt-0.5">
                            {reviews.filter((r) => r.status === 'pending').length} testemunho(s) enviado(s) por hóspedes para aprovação.
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-300">
                      <strong>Plataforma ZEMAN Operacional</strong>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Todos os canais de reserva online, catálogo e motor de disponibilidade ativos.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: GESTÃO DE ALOJAMENTOS                             */}
        {/* ======================================================== */}
        {activeTab === 'alojamentos' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif-luxury text-2xl font-bold text-white">
                  Catálogo de Alojamentos ZEMAN
                </h3>
                <p className="text-xs text-slate-400">
                  Registo, edição de dados, fotos, regras e preços por noite em Kz.
                </p>
              </div>

              <button
                onClick={() => {
                  setIsNewAcc(true);
                  setEditingAcc({
                    id: `acc-${Date.now()}`,
                    slug: `novo-alojamento-${Date.now()}`,
                    name: '',
                    subtitle: '',
                    category: 'Quartos Casal',
                    location: 'Rotunda do Fubu sentido Talatona, Luanda',
                    city: 'Luanda',
                    pricePerNight: 35000,
                    featured: false,
                    maxGuests: 2,
                    bedrooms: 1,
                    beds: 1,
                    bedType: '1 Cama King',
                    bathrooms: 1,
                    sizeM2: 50,
                    rating: 5.0,
                    reviewCount: 0,
                    images: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80'],
                    description: '',
                    shortDescription: '',
                    amenities: ['Wi-Fi de Alta Velocidade', 'Ar Condicionado', 'Pequeno-Almoço Incluído'],
                    rules: ['Check-in a partir das 14:00', 'Check-out até às 11:00'],
                    checkInTime: '14:00',
                    checkOutTime: '11:00',
                    cancellationPolicy: 'Cancelamento gratuito até 48 horas antes.',
                    active: true,
                    totalRooms: 5,
                  });
                }}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg"
              >
                <Plus className="w-4 h-4" />
                <span>Adicionar Novo Alojamento</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {accommodations.map((acc) => (
                <div key={acc.id} className="bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 flex flex-col justify-between">
                  <div className="relative aspect-[16/10]">
                    <img src={acc.images[0]} alt={acc.name} className="w-full h-full object-cover" />
                    <div className="absolute top-3 left-3 flex gap-1">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-900/80 text-amber-400">
                        {acc.category}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        acc.active ? 'bg-emerald-900/80 text-emerald-300' : 'bg-red-900/80 text-red-300'
                      }`}>
                        {acc.active ? 'Ativo' : 'Desativado'}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-serif-luxury text-lg font-bold text-white">{acc.name}</h4>
                      <p className="text-xs text-slate-400">{acc.location}</p>
                      <p className="text-xs font-bold text-amber-400 mt-2">{formatKz(acc.pricePerNight)} / noite</p>
                    </div>

                    <div className="pt-4 border-t border-slate-850 flex items-center justify-between gap-2 mt-4">
                      <button
                        onClick={() => {
                          setIsNewAcc(false);
                          setEditingAcc({ ...acc });
                        }}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Editar</span>
                      </button>

                      <button
                        onClick={() => {
                          saveAccommodation({ ...acc, active: !acc.active });
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                          acc.active ? 'bg-red-950 text-red-400 hover:bg-red-900' : 'bg-emerald-950 text-emerald-400 hover:bg-emerald-900'
                        }`}
                      >
                        {acc.active ? 'Desativar' : 'Ativar'}
                      </button>

                      <button
                        onClick={() => {
                          if (confirm(`Deseja realmente eliminar o alojamento "${acc.name}"?`)) {
                            deleteAccommodation(acc.id);
                          }
                        }}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-red-400"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: GESTÃO DE QUARTOS & CALENDÁRIO                    */}
        {/* ======================================================== */}
        {activeTab === 'quartos' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif-luxury text-2xl font-bold text-white">
                  Quartos e Calendário de Ocupação
                </h3>
                <p className="text-xs text-slate-400">
                  Gerir unidades individuais, bloquear datas para manutenção e inspecionar disponibilidade.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {roomUnits.map((room) => {
                const acc = accommodations.find((a) => a.id === room.accommodationId);
                return (
                  <div key={room.id} className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-amber-400 bg-amber-950/60 px-2.5 py-1 rounded">
                        Nº {room.roomNumber}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        room.status === 'available' ? 'bg-emerald-950 text-emerald-400' :
                        room.status === 'maintenance' ? 'bg-amber-950 text-amber-400' : 'bg-blue-950 text-blue-400'
                      }`}>
                        {room.status === 'available' ? 'Disponível' : room.status === 'maintenance' ? 'Manutenção' : 'Ocupado'}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-bold text-white text-sm">{room.name}</h4>
                      <p className="text-xs text-slate-400">{acc?.name || 'Alojamento Geral'}</p>
                      <p className="text-xs text-slate-400 mt-1">{room.type} • Até {room.capacity} hóspedes</p>
                    </div>

                    <div className="pt-2 border-t border-slate-800 text-xs text-slate-400">
                      <span>Tarifa: <strong className="text-white">{formatKz(room.pricePerNight)}</strong> / noite</span>
                    </div>

                    {/* Block for maintenance toggle */}
                    <div className="pt-2 flex items-center justify-between">
                      <button
                        onClick={() => {
                          const newStatus = room.status === 'maintenance' ? 'available' : 'maintenance';
                          saveRoomUnit({ ...room, status: newStatus });
                        }}
                        className={`text-xs px-3 py-1.5 rounded-lg font-semibold ${
                          room.status === 'maintenance'
                            ? 'bg-emerald-950 text-emerald-400'
                            : 'bg-amber-950 text-amber-400'
                        }`}
                      >
                        {room.status === 'maintenance' ? 'Concluir Manutenção' : 'Bloquear p/ Manutenção'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: GESTÃO DE RESERVAS                                */}
        {/* ======================================================== */}
        {activeTab === 'reservas' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif-luxury text-2xl font-bold text-white">
                  Gestão Central de Reservas
                </h3>
                <p className="text-xs text-slate-400">
                  Consulte, valide pagamentos, confirme ou cancele solicitações com histórico auditável.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportCSV}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors border border-slate-700"
                >
                  <Download className="w-4 h-4" />
                  <span>Exportar CSV</span>
                </button>
              </div>
            </div>

            {/* Filters Bar */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Pesquisar por referência, hóspede ou email..."
                  value={reservationSearch}
                  onChange={(e) => setReservationSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <select
                  value={reservationStatusFilter}
                  onChange={(e) => setReservationStatusFilter(e.target.value)}
                  className="w-full p-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none"
                >
                  <option value="todos">Todos os Estados de Reserva</option>
                  <option value="Pendente">Apenas Pendentes</option>
                  <option value="Confirmada">Apenas Confirmadas</option>
                  <option value="Concluída">Apenas Concluídas</option>
                  <option value="Cancelada">Apenas Canceladas</option>
                </select>
              </div>

              <div>
                <select
                  value={reservationAccFilter}
                  onChange={(e) => setReservationAccFilter(e.target.value)}
                  className="w-full p-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none"
                >
                  <option value="todos">Todos os Alojamentos</option>
                  {accommodations.map((a) => (
                    <option key={a.id} value={a.id}>{a.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Bookings Table */}
            <div className="bg-slate-950 rounded-2xl overflow-hidden border border-slate-800">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-900 border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                      <th className="py-3 px-4">Ref. Reserva</th>
                      <th className="px-4">Hóspede</th>
                      <th className="px-4">Alojamento</th>
                      <th className="px-4">Check-in / Check-out</th>
                      <th className="px-4">Valor Total</th>
                      <th className="px-4">Estado</th>
                      <th className="px-4">Pagamento</th>
                      <th className="px-4 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-850">
                    {filteredBookings.map((b) => (
                      <tr key={b.id} className="hover:bg-slate-900/50 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-amber-400">{b.id}</td>
                        <td className="px-4">
                          <strong className="text-white block">{b.guestName}</strong>
                          <span className="text-slate-400 text-[10px]">{b.guestPhone}</span>
                        </td>
                        <td className="px-4 text-slate-300 max-w-[160px] truncate">{b.accommodationName}</td>
                        <td className="px-4 text-slate-400">
                          {b.checkIn} a {b.checkOut}
                          <span className="block text-[10px] text-slate-500">({b.nights} noites)</span>
                        </td>
                        <td className="px-4 font-serif-luxury font-bold text-slate-200">{formatKz(b.totalAmount)}</td>
                        <td className="px-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            b.status === 'Confirmada' ? 'bg-emerald-950 text-emerald-400' :
                            b.status === 'Pendente' ? 'bg-amber-950 text-amber-400' :
                            b.status === 'Concluída' ? 'bg-blue-950 text-blue-400' : 'bg-red-950 text-red-400'
                          }`}>
                            {b.status}
                          </span>
                        </td>
                        <td className="px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            b.paymentStatus === 'Pago' ? 'bg-emerald-950 text-emerald-400' : 'bg-slate-800 text-slate-300'
                          }`}>
                            {b.paymentStatus}
                          </span>
                        </td>
                        <td className="px-4 text-right">
                          <button
                            onClick={() => {
                              setSelectedBookingDetails(b);
                              setInternalNoteText(b.internalNotes || '');
                            }}
                            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-xs font-semibold text-slate-200 transition-colors"
                          >
                            Gerir
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 5: GESTÃO DE CLIENTES                                */}
        {/* ======================================================== */}
        {activeTab === 'clientes' && (
          <div className="space-y-6">
            <h3 className="font-serif-luxury text-2xl font-bold text-white">
              Diretório de Clientes Registados
            </h3>

            <div className="bg-slate-950 rounded-2xl overflow-hidden border border-slate-800">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-900 border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                    <th className="py-3 px-4">Nome</th>
                    <th className="px-4">Email</th>
                    <th className="px-4">Telefone</th>
                    <th className="px-4">País</th>
                    <th className="px-4">Perfil</th>
                    <th className="px-4">Data Registo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-900/50">
                      <td className="py-3 px-4 font-bold text-white">{u.fullName}</td>
                      <td className="px-4 text-slate-300">{u.email}</td>
                      <td className="px-4 text-slate-400">{u.phone}</td>
                      <td className="px-4 text-slate-400">{u.country}</td>
                      <td className="px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-amber-300">
                          {u.role}
                        </span>
                      </td>
                      <td className="px-4 text-slate-400">{u.createdAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 6: GESTÃO FINANCEIRA                                 */}
        {/* ======================================================== */}
        {activeTab === 'financeiro' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif-luxury text-2xl font-bold text-white">
                  Relatório & Fecho Financeiro
                </h3>
                <p className="text-xs text-slate-400">
                  Acompanhamento de liquidações, transferências e receitas por alojamento em Kwanzas.
                </p>
              </div>

              <button
                onClick={handleExportCSV}
                className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span>Exportar Relatório</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400">Total Liquidado</span>
                <div className="font-serif-luxury text-2xl font-bold text-emerald-400 mt-1">
                  {formatKz(totalRevenue)}
                </div>
              </div>

              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400">Pendente de Cobrança</span>
                <div className="font-serif-luxury text-2xl font-bold text-amber-400 mt-1">
                  {formatKz(pendingRevenue)}
                </div>
              </div>

              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400">Volume Total em Negociação</span>
                <div className="font-serif-luxury text-2xl font-bold text-white mt-1">
                  {formatKz(totalRevenue + pendingRevenue)}
                </div>
              </div>
            </div>

            {/* Revenue by Accommodation breakdown */}
            <div className="bg-slate-950 rounded-2xl p-6 border border-slate-800">
              <h4 className="font-serif-luxury text-lg font-bold text-white mb-4">
                Desempenho por Alojamento
              </h4>
              <div className="space-y-3">
                {accommodations.map((acc) => {
                  const accBookings = bookings.filter((b) => b.accommodationId === acc.id);
                  const accRev = accBookings
                    .filter((b) => b.paymentStatus === 'Pago')
                    .reduce((sum, b) => sum + b.totalAmount, 0);
                  return (
                    <div key={acc.id} className="p-3 bg-slate-900 rounded-xl flex items-center justify-between text-xs">
                      <div>
                        <strong className="text-white block">{acc.name}</strong>
                        <span className="text-slate-400">{accBookings.length} reservas registadas</span>
                      </div>
                      <div className="text-right">
                        <span className="font-serif-luxury font-bold text-sm text-amber-400">{formatKz(accRev)}</span>
                        <span className="text-[10px] text-slate-400 block">Total Liquidado</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 7: MODERAÇÃO DE CONTEÚDOS & AVALIAÇÕES               */}
        {/* ======================================================== */}
        {activeTab === 'conteudos' && (
          <div className="space-y-6">
            <div>
              <h3 className="font-serif-luxury text-2xl font-bold text-white">
                Moderação de Avaliações de Hóspedes
              </h3>
              <p className="text-xs text-slate-400">
                Aprovar ou rejeitar testemunhos submetidos por clientes antes de surgirem no website público.
              </p>
            </div>

            <div className="space-y-4">
              {reviews.map((rev) => (
                <div key={rev.id} className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <strong className="text-white text-sm">{rev.guestName}</strong>
                      <span className="text-xs text-slate-400 block">{rev.accommodationName} • {rev.date}</span>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      rev.status === 'approved' ? 'bg-emerald-950 text-emerald-400' :
                      rev.status === 'pending' ? 'bg-amber-950 text-amber-400' : 'bg-red-950 text-red-400'
                    }`}>
                      {rev.status === 'approved' ? 'Aprovado' : rev.status === 'pending' ? 'Pendente' : 'Rejeitado'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 italic bg-slate-900 p-3 rounded-xl border border-slate-800">
                    "{rev.comment}"
                  </p>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-amber-400 text-xs font-bold">★ {rev.rating} / 5</span>
                    <div className="flex items-center gap-2">
                      {rev.status !== 'approved' && (
                        <button
                          onClick={() => approveReview(rev.id)}
                          className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold"
                        >
                          Aprovar para o Website
                        </button>
                      )}
                      {rev.status !== 'rejected' && (
                        <button
                          onClick={() => rejectReview(rev.id)}
                          className="px-3 py-1.5 bg-red-950 hover:bg-red-900 text-red-400 rounded-lg text-xs font-bold"
                        >
                          Rejeitar
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 8: UTILIZADORES & ACESSOS                            */}
        {/* ======================================================== */}
        {activeTab === 'equipa' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif-luxury text-2xl font-bold text-white">
                  Gestão da Equipa & Permissões
                </h3>
                <p className="text-xs text-slate-400">
                  Níveis de acesso específicos: Administrador Principal, Gestor de Reservas, Gestor de Alojamentos e Financeiro.
                </p>
              </div>

              <button
                onClick={() => setNewStaffModal(true)}
                className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Adicionar Operador</span>
              </button>
            </div>

            <div className="bg-slate-950 rounded-2xl overflow-hidden border border-slate-800">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-900 border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                    <th className="py-3 px-4">Nome</th>
                    <th className="px-4">Email</th>
                    <th className="px-4">Nível de Permissão</th>
                    <th className="px-4">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850">
                  {users.filter((u) => u.role !== 'client').map((staff) => (
                    <tr key={staff.id} className="hover:bg-slate-900/50">
                      <td className="py-3 px-4 font-bold text-white">{staff.fullName}</td>
                      <td className="px-4 text-slate-300">{staff.email}</td>
                      <td className="px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-950 text-amber-300 border border-amber-800">
                          {staff.role}
                        </span>
                      </td>
                      <td className="px-4 text-emerald-400 font-semibold">{staff.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 9: NOTIFICAÇÕES & ALERTAS OPERACIONAIS               */}
        {/* ======================================================== */}
        {activeTab === 'notificacoes' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <h3 className="font-serif-luxury text-2xl font-bold text-white flex items-center gap-2.5">
                  <span>Notificações & Alertas Operacionais</span>
                  {unreadAdminNotificationsCount > 0 && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse">
                      {unreadAdminNotificationsCount} nova{unreadAdminNotificationsCount > 1 ? 's' : ''}
                    </span>
                  )}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Alertas em tempo real: novas reservas, cancelamentos, comprovativos de pagamento, pedidos de moderação e mensagens de apoio.
                </p>
              </div>

              <div className="flex items-center gap-2">
                {unreadAdminNotificationsCount > 0 && (
                  <button
                    onClick={() => markAllNotificationsAsRead('admin')}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Marcar Todas como Lidas</span>
                  </button>
                )}
                {adminNotifications.length > 0 && (
                  <button
                    onClick={() => clearAllNotifications('admin')}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-red-950 text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
                    title="Limpar histórico de notificações"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <button
                onClick={() => setAdminNotifFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  adminNotifFilter === 'all'
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Todas ({adminNotifications.length})
              </button>
              <button
                onClick={() => setAdminNotifFilter('unread')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  adminNotifFilter === 'unread'
                    ? 'bg-red-500 text-white shadow-md'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Não Lidas ({unreadAdminNotificationsCount})
              </button>
              <button
                onClick={() => setAdminNotifFilter('booking')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  adminNotifFilter === 'booking'
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Reservas ({adminNotifications.filter((n) => n.type === 'booking_status').length})
              </button>
              <button
                onClick={() => setAdminNotifFilter('review')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  adminNotifFilter === 'review'
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Moderação de Avaliações ({adminNotifications.filter((n) => n.type === 'review_submitted' || n.type === 'review_request').length})
              </button>
              <button
                onClick={() => setAdminNotifFilter('support')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  adminNotifFilter === 'support'
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Suporte & Contactos ({adminNotifications.filter((n) => n.type === 'support_message' || n.type === 'system').length})
              </button>
            </div>

            {/* Notification List */}
            <div className="space-y-3">
              {filteredAdminNotifications.length === 0 ? (
                <div className="text-center py-12 px-4 rounded-2xl bg-slate-950 border border-dashed border-slate-800">
                  <div className="w-12 h-12 rounded-full bg-slate-900 text-slate-400 flex items-center justify-center mx-auto mb-3">
                    <Bell className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-white text-sm">Sem Alertas Registados</h4>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                    Todas as novas reservas, alterações de hóspedes e mensagens recebidas aparecerão aqui em tempo real.
                  </p>
                </div>
              ) : (
                filteredAdminNotifications.map((notif) => {
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
                          ? 'bg-slate-950 border-amber-500/50 shadow-lg shadow-black/40'
                          : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        {/* Type Icon */}
                        <div className="shrink-0 mt-0.5">
                          {notif.type === 'booking_status' && (
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                              isUnread ? 'bg-amber-500 text-slate-950 font-bold shadow' : 'bg-slate-800 text-amber-400'
                            }`}>
                              <Calendar className="w-4 h-4" />
                            </div>
                          )}
                          {(notif.type === 'review_submitted' || notif.type === 'review_request') && (
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                              isUnread ? 'bg-amber-500 text-slate-950 font-bold shadow' : 'bg-slate-800 text-amber-400'
                            }`}>
                              <Star className="w-4 h-4" />
                            </div>
                          )}
                          {notif.type === 'support_message' && (
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                              isUnread ? 'bg-emerald-500 text-slate-950 font-bold shadow' : 'bg-slate-800 text-emerald-400'
                            }`}>
                              <Mail className="w-4 h-4" />
                            </div>
                          )}
                          {notif.type === 'system' && (
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                              isUnread ? 'bg-purple-500 text-white font-bold shadow' : 'bg-slate-800 text-purple-400'
                            }`}>
                              <Bell className="w-4 h-4" />
                            </div>
                          )}
                        </div>

                        {/* Text and Actions */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <h4 className="text-xs sm:text-sm font-bold text-white">
                                {notif.title}
                              </h4>
                              {isUnread && (
                                <span className="w-2 h-2 rounded-full bg-amber-400 ring-4 ring-amber-400/20 shrink-0"></span>
                              )}
                            </div>
                            <span className="text-[11px] text-slate-400 font-mono shrink-0">
                              {timeStr}
                            </span>
                          </div>

                          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                            {notif.message}
                          </p>

                          <div className="flex flex-wrap items-center gap-2 mt-3 pt-2.5 border-t border-slate-900">
                            {notif.relatedBookingId && (
                              <button
                                onClick={() => {
                                  const targetBooking = bookings.find((b) => b.id === notif.relatedBookingId);
                                  if (targetBooking) {
                                    setSelectedBookingDetails(targetBooking);
                                    setInternalNoteText(targetBooking.internalNotes || '');
                                  } else {
                                    setActiveTab('reservas');
                                  }
                                  markNotificationAsRead(notif.id);
                                }}
                                className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[11px] flex items-center gap-1.5 transition-colors cursor-pointer"
                              >
                                <Calendar className="w-3.5 h-3.5" />
                                <span>Ver Reserva #{notif.relatedBookingId}</span>
                              </button>
                            )}

                            {(notif.type === 'review_submitted' || notif.relatedReviewId) && (
                              <button
                                onClick={() => {
                                  setActiveTab('conteudos');
                                  markNotificationAsRead(notif.id);
                                }}
                                className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[11px] flex items-center gap-1.5 transition-colors cursor-pointer"
                              >
                                <Star className="w-3.5 h-3.5" />
                                <span>Ir para Moderação de Avaliações</span>
                              </button>
                            )}

                            {notif.type === 'support_message' && (
                              <button
                                onClick={() => {
                                  setActiveTab('mensagens');
                                  markNotificationAsRead(notif.id);
                                }}
                                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] flex items-center gap-1.5 transition-colors cursor-pointer"
                              >
                                <Mail className="w-3.5 h-3.5" />
                                <span>Ver Inquérito de Suporte</span>
                              </button>
                            )}

                            {isUnread && (
                              <button
                                onClick={() => markNotificationAsRead(notif.id)}
                                className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold transition-colors cursor-pointer"
                              >
                                Marcar como lida
                              </button>
                            )}

                            <button
                              onClick={() => deleteNotification(notif.id)}
                              className="ml-auto p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-slate-800 transition-colors cursor-pointer"
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

        {/* ======================================================== */}
        {/* TAB 10: MENSAGENS DE SUPORTE & CONTACTOS                 */}
        {/* ======================================================== */}
        {activeTab === 'mensagens' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <h3 className="font-serif-luxury text-2xl font-bold text-white flex items-center gap-2.5">
                  <span>Inquéritos de Contacto & Apoio ao Cliente</span>
                  {unreadSupportCount > 0 && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      {unreadSupportCount} por responder
                    </span>
                  )}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Mensagens submetidas por visitantes e hóspedes. Responda diretamente e alerte o cliente no seu painel.
                </p>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setSupportFilter('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    supportFilter === 'all'
                      ? 'bg-amber-500 text-slate-950 shadow-md'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  Todas ({supportMessages.length})
                </button>
                <button
                  onClick={() => setSupportFilter('unread')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    supportFilter === 'unread'
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  Pendentes ({unreadSupportCount})
                </button>
                <button
                  onClick={() => setSupportFilter('replied')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    supportFilter === 'replied'
                      ? 'bg-slate-700 text-white shadow-md'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  Respondidas ({supportMessages.filter((s) => s.status === 'replied').length})
                </button>
              </div>
            </div>

            {/* Support Messages Cards */}
            <div className="space-y-4">
              {filteredSupportMessages.length === 0 ? (
                <div className="text-center py-12 px-4 rounded-2xl bg-slate-950 border border-dashed border-slate-800">
                  <div className="w-12 h-12 rounded-full bg-slate-900 text-slate-400 flex items-center justify-center mx-auto mb-3">
                    <Mail className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-white text-sm">Nenhum inquérito encontrado</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    As mensagens enviadas no formulário de contacto do website ou solicitadas pelo hóspede serão listadas aqui.
                  </p>
                </div>
              ) : (
                filteredSupportMessages.map((msg) => {
                  const dateObj = new Date(msg.createdAt);
                  const timeStr = !isNaN(dateObj.getTime())
                    ? dateObj.toLocaleDateString('pt-AO', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })
                    : msg.createdAt;

                  return (
                    <div
                      key={msg.id}
                      className={`p-5 rounded-2xl border transition-all ${
                        msg.status === 'unread'
                          ? 'bg-slate-950 border-emerald-500/50 shadow-lg shadow-black/30'
                          : 'bg-slate-950/80 border-slate-800'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2.5">
                            <h4 className="text-sm font-bold text-white">{msg.subject}</h4>
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                msg.status === 'unread'
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                                  : msg.status === 'replied'
                                  ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                                  : 'bg-slate-800 text-slate-400'
                              }`}
                            >
                              {msg.status === 'unread'
                                ? 'Novo / Não Lido'
                                : msg.status === 'replied'
                                ? 'Respondido'
                                : 'Lido'}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400">
                            De: <strong className="text-slate-200">{msg.name}</strong> •{' '}
                            <span className="text-emerald-400">{msg.email}</span>
                            {msg.phone && <span> • Tel: {msg.phone}</span>}
                          </p>
                        </div>
                        <span className="text-[11px] text-slate-500 font-mono shrink-0">
                          {timeStr}
                        </span>
                      </div>

                      {/* Guest inquiry body */}
                      <div className="mt-3 p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
                        {msg.message}
                      </div>

                      {/* Previous reply if exists */}
                      {msg.replyText && (
                        <div className="mt-3 p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-xs text-emerald-200 space-y-1">
                          <div className="flex items-center justify-between text-[11px] text-emerald-400 font-bold">
                            <span className="flex items-center gap-1.5">
                              <CheckCheck className="w-3.5 h-3.5" />
                              <span>Resposta Enviada ao Hóspede</span>
                            </span>
                            {msg.repliedAt && (
                              <span className="font-mono text-emerald-400/80">
                                {new Date(msg.repliedAt).toLocaleDateString('pt-AO', {
                                  day: '2-digit',
                                  month: 'short',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            )}
                          </div>
                          <p className="leading-relaxed">{msg.replyText}</p>
                        </div>
                      )}

                      {/* Reply composer trigger */}
                      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                        <span className="text-[11px] text-slate-500">ID: {msg.id}</span>
                        <button
                          onClick={() => {
                            setSelectedSupportMessage(msg);
                            setReplyInputText(msg.replyText || '');
                            setReplySuccess(false);
                          }}
                          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>{msg.replyText ? 'Editar / Reenviar Resposta' : 'Responder ao Cliente'}</span>
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 11: PUBLICAÇÃO & DEPLOY (HOSTINGER & GITHUB)         */}
        {/* ======================================================== */}
        {activeTab === 'deploy' && (
          <div className="space-y-6">
            {/* Header & Overview */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Ambiente de Produção Pronto
                  </span>
                  <span className="text-slate-400 text-xs font-mono">
                    Hostinger LiteSpeed / Apache + GitHub
                  </span>
                </div>
                <h3 className="font-serif-luxury text-2xl font-bold text-white flex items-center gap-2">
                  <Globe className="w-6 h-6 text-emerald-400" />
                  <span>Publicação, Código & Infraestrutura</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1 max-w-3xl">
                  Central de exportação de código, comandos Git para o GitHub e procedimentos de publicação na hospedagem Hostinger.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const fullBundle = `# ZEMAN Trading & Services — Comandos Rápidos de Publicação
# 1. Compilar para produção:
npm run build

# 2. Inicializar Git:
git init
git add .
git commit -m "feat: Versão de Produção ZEMAN"
git branch -M main
git remote add origin ${githubUserRepo}
git push -u origin main
`;
                    handleCopy(fullBundle, 'quick_commands');
                  }}
                  className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-950/40 transition-all cursor-pointer"
                >
                  {copiedSnippet === 'quick_commands' ? (
                    <>
                      <Check className="w-4 h-4 text-slate-950" />
                      <span>Comandos Copiados!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copiar Comandos de Deploy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Quick KPI Overview Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Destino Hostinger</span>
                <div className="font-mono text-sm font-bold text-emerald-400 mt-1">public_html/</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Pasta raiz do servidor web</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Build Output</span>
                <div className="font-mono text-sm font-bold text-amber-400 mt-1">dist/</div>
                <div className="text-[11px] text-slate-500 mt-0.5">SPA Estático compilado</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Roteamento SPA</span>
                <div className="font-mono text-sm font-bold text-sky-400 mt-1">.htaccess Ativo</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Zero erro 404 em recarga</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Automação CI/CD</span>
                <div className="font-mono text-sm font-bold text-purple-400 mt-1">GitHub Actions</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Deploy automático por FTPS</div>
              </div>
            </div>

            {/* Sub-Tabs Selector */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-slate-800">
              <button
                onClick={() => setDeploySubTab('git')}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-2 transition-all cursor-pointer ${
                  deploySubTab === 'git'
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>1. Comandos Git & GitHub</span>
              </button>
              <button
                onClick={() => setDeploySubTab('htaccess')}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-2 transition-all cursor-pointer ${
                  deploySubTab === 'htaccess'
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <Server className="w-3.5 h-3.5" />
                <span>2. Ficheiro .htaccess (Hostinger)</span>
              </button>
              <button
                onClick={() => setDeploySubTab('actions')}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-2 transition-all cursor-pointer ${
                  deploySubTab === 'actions'
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <Cpu className="w-3.5 h-3.5" />
                <span>3. Automação GitHub Actions</span>
              </button>
              <button
                onClick={() => setDeploySubTab('hostinger')}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-2 transition-all cursor-pointer ${
                  deploySubTab === 'hostinger'
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <FolderArchive className="w-3.5 h-3.5" />
                <span>4. Passo a Passo Hostinger hPanel</span>
              </button>
              <button
                onClick={() => setDeploySubTab('checklist')}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-2 transition-all cursor-pointer ${
                  deploySubTab === 'checklist'
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>5. Checklist de Produção</span>
              </button>
            </div>

            {/* SUBTAB 1: GIT & GITHUB COMMANDS */}
            {deploySubTab === 'git' && (
              <div className="space-y-5 animate-in fade-in">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <label className="block text-xs font-bold text-slate-300 uppercase">
                    Personalize o URL do seu Repositório GitHub:
                  </label>
                  <div className="flex flex-col sm:flex-row items-stretch gap-2">
                    <input
                      type="text"
                      value={githubUserRepo}
                      onChange={(e) => setGithubUserRepo(e.target.value)}
                      placeholder="https://github.com/SEU-USUARIO/zeman-trading-services.git"
                      className="flex-1 p-3 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-emerald-400 focus:outline-none focus:border-amber-500"
                    />
                    <button
                      type="button"
                      onClick={() => setGithubUserRepo('https://github.com/SEU-USUARIO/zeman-trading-services.git')}
                      className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
                    >
                      Restaurar Padrão
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Ao alterar o endereço acima, todos os comandos abaixo atualizam-se instantaneamente para facilitar o copiar e colar no seu terminal.
                  </p>
                </div>

                {/* Code Block 1: Initial Commit */}
                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 text-[11px] flex items-center justify-center font-mono">1</span>
                      <span>Inicializar Repositório Local e Primeiro Commit</span>
                    </span>
                    <button
                      onClick={() => {
                        const snippet = `git init\ngit add .\ngit commit -m "feat: Versão inicial de produção ZEMAN Trading & Services"\ngit branch -M main`;
                        handleCopy(snippet, 'git_step1');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      {copiedSnippet === 'git_step1' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedSnippet === 'git_step1' ? 'Copiado!' : 'Copiar'}</span>
                    </button>
                  </div>
                  <pre className="p-4 rounded-xl bg-slate-900 border border-slate-850 text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed">
{`git init
git add .
git commit -m "feat: Versão inicial de produção ZEMAN Trading & Services"
git branch -M main`}
                  </pre>
                </div>

                {/* Code Block 2: Remote and Push */}
                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 text-[11px] flex items-center justify-center font-mono">2</span>
                      <span>Vincular ao Repositório do GitHub e Enviar Código</span>
                    </span>
                    <button
                      onClick={() => {
                        const snippet = `git remote add origin ${githubUserRepo}\ngit push -u origin main`;
                        handleCopy(snippet, 'git_step2');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      {copiedSnippet === 'git_step2' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedSnippet === 'git_step2' ? 'Copiado!' : 'Copiar'}</span>
                    </button>
                  </div>
                  <pre className="p-4 rounded-xl bg-slate-900 border border-slate-850 text-xs font-mono text-emerald-400 overflow-x-auto leading-relaxed">
{`git remote add origin ${githubUserRepo}
git push -u origin main`}
                  </pre>
                </div>

                {/* Code Block 3: Routine Updates */}
                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 text-[11px] flex items-center justify-center font-mono">3</span>
                      <span>Enviar Atualizações Futuras com 1 Único Comando</span>
                    </span>
                    <button
                      onClick={() => {
                        const snippet = `git add .\ngit commit -m "update: melhorias e atualizações"\ngit push origin main`;
                        handleCopy(snippet, 'git_step3');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      {copiedSnippet === 'git_step3' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedSnippet === 'git_step3' ? 'Copiado!' : 'Copiar'}</span>
                    </button>
                  </div>
                  <pre className="p-4 rounded-xl bg-slate-900 border border-slate-850 text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed">
{`git add .
git commit -m "update: melhorias e atualizações"
git push origin main`}
                  </pre>
                </div>
              </div>
            )}

            {/* SUBTAB 2: .HTACCESS FOR HOSTINGER */}
            {deploySubTab === 'htaccess' && (
              <div className="space-y-4 animate-in fade-in">
                <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 text-xs text-emerald-300 leading-relaxed">
                  <strong className="block font-bold text-emerald-200 mb-1">
                    Por que este ficheiro é essencial na Hostinger?
                  </strong>
                  Sendo o website uma aplicação React (SPA), quando o visitante clica em atualizar a página (F5) ou acede diretamente a uma rota interna, o servidor LiteSpeed/Apache da Hostinger precisa saber que deve redirecionar a requisição internamente para o <code className="bg-emerald-950/80 px-1 py-0.5 rounded text-white font-mono">index.html</code>. Este ficheiro já se encontra gerado na pasta <code className="bg-emerald-950/80 px-1 py-0.5 rounded text-white font-mono">/public/.htaccess</code> e é incluído automaticamente na compilação.
                </div>

                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-bold text-white font-mono">/public/.htaccess</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          const htContent = `<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteCond %{HTTPS} !=on
  RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule ^ index.html [L]
</IfModule>
<IfModule mod_headers.c>
  Header set X-Frame-Options "SAMEORIGIN"
  Header set X-Content-Type-Options "nosniff"
</IfModule>
Options -Indexes`;
                          handleCopy(htContent, 'copy_htaccess');
                        }}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold flex items-center gap-1.5 cursor-pointer"
                      >
                        {copiedSnippet === 'copy_htaccess' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedSnippet === 'copy_htaccess' ? 'Copiado!' : 'Copiar .htaccess'}</span>
                      </button>

                      <button
                        onClick={() => {
                          const htContent = `# ZEMAN Trading & Services — Hostinger .htaccess
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteCond %{HTTPS} !=on
  RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule ^ index.html [L]
</IfModule>
<IfModule mod_headers.c>
  Header set X-Frame-Options "SAMEORIGIN"
  Header set X-Content-Type-Options "nosniff"
</IfModule>
Options -Indexes\n`;
                          handleDownload('.htaccess', htContent);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold flex items-center gap-1.5 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Baixar Ficheiro</span>
                      </button>
                    </div>
                  </div>

                  <pre className="p-4 rounded-xl bg-slate-900 border border-slate-850 text-xs font-mono text-slate-300 overflow-x-auto leading-relaxed max-h-96">
{`# 1. FORÇAR CONEXÃO SEGURA HTTPS
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteCond %{HTTPS} !=on
  RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

  # 2. ROTEAMENTO SPA (Evita erro 404 em recargas)
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule ^ index.html [L]
</IfModule>

# 3. CABEÇALHOS DE SEGURANÇA
<IfModule mod_headers.c>
  Header set X-Frame-Options "SAMEORIGIN"
  Header set X-Content-Type-Options "nosniff"
  Header set Referrer-Policy "strict-origin-when-cross-origin"
</IfModule>

# 4. CACHE DE ALTA VELOCIDADE
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType text/html "access plus 0 seconds"
  ExpiresByType text/css "access plus 1 year"
  ExpiresByType application/javascript "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
</IfModule>

Options -Indexes`}
                  </pre>
                </div>
              </div>
            )}

            {/* SUBTAB 3: GITHUB ACTIONS CI/CD */}
            {deploySubTab === 'actions' && (
              <div className="space-y-4 animate-in fade-in">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Secrets Obrigatórios no Repositório do GitHub:
                  </h4>
                  <p className="text-xs text-slate-400">
                    Aceda a <strong>Settings</strong> &gt; <strong>Secrets and variables</strong> &gt; <strong>Actions</strong> no GitHub e cadastre:
                  </p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                          <th className="py-2 px-3">Nome do Secret</th>
                          <th className="px-3">Onde Encontrar no hPanel</th>
                          <th className="px-3">Exemplo de Valor</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-850 text-slate-300">
                        <tr>
                          <td className="py-2.5 px-3 font-mono font-bold text-emerald-400">HOSTINGER_FTP_SERVER</td>
                          <td className="px-3">hPanel &gt; Ficheiros &gt; Contas FTP</td>
                          <td className="px-3 font-mono text-slate-400">access-XXXX.webhosting.hostinger.com</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 px-3 font-mono font-bold text-emerald-400">HOSTINGER_FTP_USERNAME</td>
                          <td className="px-3">hPanel &gt; Ficheiros &gt; Contas FTP</td>
                          <td className="px-3 font-mono text-slate-400">u123456789</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 px-3 font-mono font-bold text-emerald-400">HOSTINGER_FTP_PASSWORD</td>
                          <td className="px-3">A senha que você definiu para o utilizador FTP</td>
                          <td className="px-3 font-mono text-slate-400">••••••••••••</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-bold text-white font-mono">
                      /.github/workflows/deploy-hostinger.yml
                    </span>
                    <button
                      onClick={() => {
                        const ymlContent = `name: Deploy para Hostinger (Automático)
on:
  push:
    branches:
      - main
  workflow_dispatch:
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci || npm install
      - run: npm run build
      - uses: SamKirkland/FTP-Deploy-Action@v4.3.5
        with:
          server: \${{ secrets.HOSTINGER_FTP_SERVER }}
          username: \${{ secrets.HOSTINGER_FTP_USERNAME }}
          password: \${{ secrets.HOSTINGER_FTP_PASSWORD }}
          protocol: ftps
          port: 21
          local-dir: ./dist/
          server-dir: ./public_html/`;
                        handleCopy(ymlContent, 'copy_actions');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold flex items-center gap-1.5 cursor-pointer"
                    >
                      {copiedSnippet === 'copy_actions' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedSnippet === 'copy_actions' ? 'Copiado!' : 'Copiar YAML'}</span>
                    </button>
                  </div>

                  <pre className="p-4 rounded-xl bg-slate-900 border border-slate-850 text-xs font-mono text-slate-300 overflow-x-auto leading-relaxed max-h-96">
{`name: Deploy para Hostinger (Automático)

on:
  push:
    branches:
      - main
  workflow_dispatch:

jobs:
  build-and-deploy:
    name: Compilar e Publicar na Hostinger
    runs-on: ubuntu-latest

    steps:
      - name: 1. Checkout do Código
        uses: actions/checkout@v4

      - name: 2. Configurar Node.js v20
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: 3. Instalar Dependências
        run: npm ci || npm install

      - name: 4. Compilar Website (Vite Build)
        run: npm run build

      - name: 5. Enviar para Hostinger via FTPS
        uses: SamKirkland/FTP-Deploy-Action@v4.3.5
        with:
          server: \${{ secrets.HOSTINGER_FTP_SERVER }}
          username: \${{ secrets.HOSTINGER_FTP_USERNAME }}
          password: \${{ secrets.HOSTINGER_FTP_PASSWORD }}
          protocol: ftps
          port: 21
          local-dir: ./dist/
          server-dir: ./public_html/
          dangerous-clean-slate: false`}
                  </pre>
                </div>
              </div>
            )}

            {/* SUBTAB 4: HOSTINGER HPANEL GUIDE */}
            {deploySubTab === 'hostinger' && (
              <div className="space-y-4 animate-in fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">1</div>
                    <h4 className="text-sm font-bold text-white">Compilar e Compactar</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      No terminal do seu computador, execute <code className="bg-slate-900 text-amber-300 px-1 py-0.5 rounded font-mono">npm run build</code>. 
                      Entre na pasta <code className="bg-slate-900 text-amber-300 px-1 py-0.5 rounded font-mono">dist/</code> gerada e compacte o seu conteúdo num arquivo <code className="text-white font-mono">zeman-build.zip</code>.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">2</div>
                    <h4 className="text-sm font-bold text-white">Upload para o public_html</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      No hPanel da Hostinger, abra o <strong>Gestor de Ficheiros</strong>. Aceda à pasta <code className="bg-slate-900 text-emerald-400 px-1 py-0.5 rounded font-mono">public_html/</code>, carregue o arquivo <code className="text-white font-mono">.zip</code> e extraia os ficheiros diretamente aí.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">3</div>
                    <h4 className="text-sm font-bold text-white">Configurar DNS do Domínio</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Na secção de DNS do seu domínio, aponte o registo <strong>Tipo A</strong> com nome <code className="text-white font-mono">@</code> para o endereço IP do seu plano Hostinger, e o registo <strong>CNAME</strong> <code className="text-white font-mono">www</code> para o seu domínio.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">4</div>
                    <h4 className="text-sm font-bold text-white">Ativar Certificado SSL Grátis</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      No hPanel, vá a <strong>Segurança &gt; SSL</strong> e ative o certificado <strong>Let's Encrypt Gratuito</strong> para o seu domínio. Ative também a opção <strong>Forçar HTTPS</strong>.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* SUBTAB 5: CHECKLIST */}
            {deploySubTab === 'checklist' && (
              <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 animate-in fade-in">
                <div>
                  <h4 className="font-serif-luxury text-lg font-bold text-white">
                    Checklist de Verificação Pós-Publicação
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Marque os itens à medida que concluir cada validação no seu ambiente de produção da Hostinger.
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  {[
                    { key: 'distBuild', title: 'Compilação de Produção Realizada', desc: 'Comando npm run build executa sem avisos ou erros de compilação.' },
                    { key: 'htaccessPresent', title: 'Ficheiro .htaccess presente no public_html', desc: 'Garante que o Apache/LiteSpeed redireciona todas as rotas para o index.html.' },
                    { key: 'spaRouting', title: 'Teste de Recarregamento de Rotas (F5)', desc: 'Navegar para o painel ou catálogo e atualizar a página sem gerar erro 404.' },
                    { key: 'httpsEnforced', title: 'Conexão HTTPS Ativa e Segura', desc: 'Cadeado verde no navegador com certificado SSL Let\'s Encrypt válido.' },
                    { key: 'domainDns', title: 'Apontamento de DNS A e CNAME Concluído', desc: 'Propagação de DNS do domínio personalizado para o servidor da Hostinger.' },
                    { key: 'testBooking', title: 'Teste de Fluxo de Reserva e Notificações', desc: 'Efetuar uma reserva de teste em Kwanzas (Kz) e validar a chegada no Painel Administrativo.' }
                  ].map((item) => {
                    const isChecked = deployChecks[item.key] || false;
                    return (
                      <div
                        key={item.key}
                        onClick={() => setDeployChecks({ ...deployChecks, [item.key]: !isChecked })}
                        className={`p-3.5 rounded-xl border flex items-start gap-3.5 cursor-pointer transition-all ${
                          isChecked
                            ? 'bg-emerald-950/30 border-emerald-500/50 text-white'
                            : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-md mt-0.5 flex items-center justify-center shrink-0 border ${
                          isChecked ? 'bg-emerald-600 border-emerald-500 text-white' : 'border-slate-600 bg-slate-950'
                        }`}>
                          {isChecked && <Check className="w-3.5 h-3.5" />}
                        </div>
                        <div>
                          <strong className="block text-xs font-bold">{item.title}</strong>
                          <span className="text-[11px] text-slate-400">{item.desc}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>
        )}

      </div>

      {/* ======================================================== */}
      {/* MODAL: EDIT / MANAGE RESERVATION                         */}
      {/* ======================================================== */}
      {selectedBookingDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
          <div className="bg-slate-900 rounded-3xl max-w-xl w-full p-6 border border-slate-700 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto text-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                  DETALHES DA RESERVA
                </span>
                <h4 className="font-mono text-xl font-bold text-white">
                  {selectedBookingDetails.id}
                </h4>
              </div>
              <button
                onClick={() => setSelectedBookingDetails(null)}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div>
                <span className="text-slate-400 block text-[10px]">Hóspede:</span>
                <strong className="text-white">{selectedBookingDetails.guestName}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Contacto:</span>
                <strong className="text-white">{selectedBookingDetails.guestPhone}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Alojamento:</span>
                <strong className="text-white">{selectedBookingDetails.accommodationName}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Datas:</span>
                <strong className="text-white">{selectedBookingDetails.checkIn} a {selectedBookingDetails.checkOut}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Valor Total:</span>
                <strong className="text-amber-400 font-serif-luxury text-sm">{formatKz(selectedBookingDetails.totalAmount)}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Método Pagamento:</span>
                <strong className="text-slate-200">{selectedBookingDetails.paymentMethod}</strong>
              </div>
            </div>

            {selectedBookingDetails.proofOfPayment && (
              <div className="p-3 bg-amber-950/40 border border-amber-800/60 rounded-xl text-xs text-amber-300">
                <strong>Comprovativo anexado:</strong> {selectedBookingDetails.proofOfPayment}
              </div>
            )}

            {/* Quick Status Modifiers */}
            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Alterar Estado da Reserva:
                </label>
                <div className="flex flex-wrap gap-2">
                  {(['Pendente', 'Confirmada', 'Concluída', 'Cancelada'] as BookingStatus[]).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => {
                        updateBookingStatus(selectedBookingDetails.id, st, selectedBookingDetails.paymentStatus, internalNoteText);
                        setSelectedBookingDetails({ ...selectedBookingDetails, status: st });
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        selectedBookingDetails.status === st
                          ? 'bg-amber-500 text-slate-950'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Alterar Estado do Pagamento:
                </label>
                <div className="flex flex-wrap gap-2">
                  {(['Não Pago', 'Pendente', 'Pago', 'Reembolsado'] as PaymentStatus[]).map((pst) => (
                    <button
                      key={pst}
                      type="button"
                      onClick={() => {
                        updateBookingStatus(selectedBookingDetails.id, selectedBookingDetails.status, pst, internalNoteText);
                        setSelectedBookingDetails({ ...selectedBookingDetails, paymentStatus: pst });
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        selectedBookingDetails.paymentStatus === pst
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {pst}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Notas Internas da Equipa:
                </label>
                <textarea
                  rows={2}
                  value={internalNoteText}
                  onChange={(e) => setInternalNoteText(e.target.value)}
                  placeholder="Ex: Hóspede VIP confirmado, transfer solicitado para as 14h..."
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => {
                  updateBookingStatus(
                    selectedBookingDetails.id,
                    selectedBookingDetails.status,
                    selectedBookingDetails.paymentStatus,
                    internalNoteText
                  );
                  setSelectedBookingDetails(null);
                }}
                className="px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
              >
                Guardar e Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: EDIT / CREATE ACCOMMODATION                       */}
      {/* ======================================================== */}
      {editingAcc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
          <div className="bg-slate-900 rounded-3xl max-w-2xl w-full p-6 border border-slate-700 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto text-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h4 className="font-serif-luxury text-xl font-bold text-white">
                {isNewAcc ? 'Cadastrar Novo Alojamento' : `Editar: ${editingAcc.name}`}
              </h4>
              <button
                onClick={() => setEditingAcc(null)}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 uppercase font-bold mb-1">Nome do Alojamento *</label>
                  <input
                    type="text"
                    value={editingAcc.name}
                    onChange={(e) => setEditingAcc({ ...editingAcc, name: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 uppercase font-bold mb-1">Categoria *</label>
                  <select
                    value={editingAcc.category}
                    onChange={(e) => setEditingAcc({ ...editingAcc, category: e.target.value as AccommodationCategory })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  >
                    <option value="Quartos Casal">Quartos Casal</option>
                    <option value="Quartos Solteiro">Quartos Solteiro</option>
                    <option value="Quartos Twin">Quartos Twin (2 Camas)</option>
                    <option value="Suítes Master">Suítes Master VIP</option>
                    <option value="Quartos Económicos">Quartos Económicos</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 uppercase font-bold mb-1">Localização *</label>
                  <input
                    type="text"
                    value={editingAcc.location}
                    onChange={(e) => setEditingAcc({ ...editingAcc, location: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 uppercase font-bold mb-1">Preço por Noite (Kz) *</label>
                  <input
                    type="number"
                    value={editingAcc.pricePerNight}
                    onChange={(e) => setEditingAcc({ ...editingAcc, pricePerNight: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 uppercase font-bold mb-1">URL da Fotografia Principal *</label>
                <input
                  type="text"
                  value={editingAcc.images[0] || ''}
                  onChange={(e) => setEditingAcc({ ...editingAcc, images: [e.target.value] })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 uppercase font-bold mb-1">Descrição Breve *</label>
                <textarea
                  rows={2}
                  value={editingAcc.shortDescription}
                  onChange={(e) => setEditingAcc({ ...editingAcc, shortDescription: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 uppercase font-bold mb-1">Máx. Hóspedes</label>
                  <input
                    type="number"
                    value={editingAcc.maxGuests}
                    onChange={(e) => setEditingAcc({ ...editingAcc, maxGuests: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 uppercase font-bold mb-1">Tipo de Cama</label>
                  <input
                    type="text"
                    value={editingAcc.bedType}
                    onChange={(e) => setEditingAcc({ ...editingAcc, bedType: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 uppercase font-bold mb-1">Área (m²)</label>
                  <input
                    type="number"
                    value={editingAcc.sizeM2}
                    onChange={(e) => setEditingAcc({ ...editingAcc, sizeM2: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingAcc(null)}
                className="px-4 py-2 rounded-xl border border-slate-700 text-xs text-slate-300"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  saveAccommodation(editingAcc);
                  setEditingAcc(null);
                }}
                className="px-5 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
              >
                Guardar Alojamento
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: REPLY TO SUPPORT MESSAGE                          */}
      {/* ======================================================== */}
      {selectedSupportMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
          <div className="bg-slate-900 rounded-3xl max-w-xl w-full p-6 border border-slate-700 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto text-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-serif-luxury text-lg font-bold text-white">
                    Responder ao Inquérito
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    ID: {selectedSupportMessage.id}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedSupportMessage(null)}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Sender and inquiry context */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1.5">
              <div className="flex justify-between items-center text-slate-400 text-[11px]">
                <span>De: <strong className="text-white">{selectedSupportMessage.name}</strong> ({selectedSupportMessage.email})</span>
                {selectedSupportMessage.phone && <span>Tel: {selectedSupportMessage.phone}</span>}
              </div>
              <div className="font-bold text-white pt-1">
                Assunto: {selectedSupportMessage.subject}
              </div>
              <div className="text-slate-300 italic bg-slate-900/80 p-2.5 rounded-lg border border-slate-850 whitespace-pre-wrap">
                "{selectedSupportMessage.message}"
              </div>
            </div>

            {replySuccess ? (
              <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-2.5 animate-in fade-in">
                <CheckCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <strong className="block font-bold">Resposta enviada com sucesso!</strong>
                  <span>O cliente foi notificado no seu portal de hóspede e por email.</span>
                </div>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!replyInputText.trim()) return;
                  replySupportMessage(selectedSupportMessage.id, replyInputText.trim());
                  setReplySuccess(true);
                  setTimeout(() => {
                    setSelectedSupportMessage(null);
                    setReplyInputText('');
                    setReplySuccess(false);
                  }, 1800);
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">
                    Resposta da Equipa ZEMAN Trading & Services *
                  </label>
                  <textarea
                    rows={5}
                    required
                    placeholder="Ex: Estimado hóspede, acusamos a receção do seu pedido. Informamos que a sua estadia tem check-in flexível e o gerador da hospedaria opera 24h sem interrupção..."
                    value={replyInputText}
                    onChange={(e) => setReplyInputText(e.target.value)}
                    className="w-full p-3 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 resize-none"
                  ></textarea>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setSelectedSupportMessage(null)}
                    className="px-4 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-xs font-bold text-slate-300 cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={!replyInputText.trim()}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-emerald-950/50 transition-all cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Enviar Resposta & Notificar</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
