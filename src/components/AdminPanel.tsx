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
  Lock
} from 'lucide-react';
import { 
  Accommodation, 
  Booking, 
  BookingStatus, 
  PaymentStatus, 
  RoomUnit, 
  UserRole,
  AccommodationCategory 
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
    formatKz 
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'alojamentos' | 'quartos' | 'reservas' | 'clientes' | 'financeiro' | 'conteudos' | 'equipa'
  >('dashboard');

  // Filter States for Reservations
  const [reservationSearch, setReservationSearch] = useState('');
  const [reservationStatusFilter, setReservationStatusFilter] = useState<string>('todos');
  const [reservationAccFilter, setReservationAccFilter] = useState<string>('todos');

  // Selected Booking for Detailed View & Action
  const [selectedBookingDetails, setSelectedBookingDetails] = useState<Booking | null>(null);
  const [internalNoteText, setInternalNoteText] = useState('');

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

            <button
              onClick={() => setCurrentView('home')}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
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
              className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-2 transition-all ${
                activeTab === 'equipa' ? 'bg-amber-500 text-slate-950 shadow-lg' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Key className="w-4 h-4" />
              <span>Utilizadores & Acessos</span>
            </button>
          )}
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

    </div>
  );
};
