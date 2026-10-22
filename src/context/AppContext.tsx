import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Accommodation,
  RoomUnit,
  Booking,
  Review,
  Experience,
  Offer,
  User,
  SiteSettings,
  SearchCriteria,
  AccommodationCategory,
  BookingStatus,
  PaymentStatus,
  UserRole,
  AppNotification,
  SupportMessage,
} from '../types';
import {
  INITIAL_ACCOMMODATIONS,
  INITIAL_ROOM_UNITS,
  INITIAL_BOOKINGS,
  INITIAL_REVIEWS,
  INITIAL_EXPERIENCES,
  INITIAL_OFFERS,
  INITIAL_USERS,
  INITIAL_SITE_SETTINGS,
  INITIAL_NOTIFICATIONS,
  INITIAL_SUPPORT_MESSAGES,
} from '../data/mockData';

export type AppView = 
  | 'home' 
  | 'accommodations' 
  | 'experiences' 
  | 'about' 
  | 'contact' 
  | 'client_dashboard' 
  | 'admin';

export type ActiveModal = 
  | 'none' 
  | 'detail' 
  | 'booking' 
  | 'auth' 
  | 'privacy' 
  | 'terms' 
  | 'cancellation'
  | 'checkInInstructions';

interface AppContextType {
  accommodations: Accommodation[];
  roomUnits: RoomUnit[];
  bookings: Booking[];
  reviews: Review[];
  experiences: Experience[];
  offers: Offer[];
  users: User[];
  siteSettings: SiteSettings;
  currentUser: User | null;
  currentView: AppView;
  selectedAccommodation: Accommodation | null;
  activeModal: ActiveModal;
  searchCriteria: SearchCriteria;
  bookingDraft: Partial<Booking> | null;
  activeLanguage: 'PT' | 'EN';
  notifications: AppNotification[];
  supportMessages: SupportMessage[];
  formatKz: (val: number) => string;
  setCurrentView: (view: AppView) => void;
  setSelectedAccommodation: (acc: Accommodation | null) => void;
  setActiveModal: (modal: ActiveModal) => void;
  setSearchCriteria: (criteria: SearchCriteria) => void;
  setBookingDraft: (draft: Partial<Booking> | null) => void;
  setActiveLanguage: (lang: 'PT' | 'EN') => void;
  login: (email: string, pass: string) => { success: boolean; message: string; user?: User };
  register: (data: Omit<User, 'id' | 'role' | 'createdAt' | 'status'>) => { success: boolean; message: string; user?: User };
  logout: () => void;
  switchUserRole: (role: UserRole) => void;
  createBooking: (bookingData: Omit<Booking, 'id' | 'createdAt' | 'timeline'>) => Booking;
  updateBookingStatus: (id: string, status: BookingStatus, paymentStatus?: PaymentStatus, note?: string) => void;
  cancelBooking: (id: string, reason: string) => void;
  submitReview: (data: Omit<Review, 'id' | 'date' | 'status'>) => void;
  approveReview: (id: string) => void;
  rejectReview: (id: string) => void;
  saveAccommodation: (acc: Accommodation) => void;
  deleteAccommodation: (id: string) => void;
  saveRoomUnit: (room: RoomUnit) => void;
  toggleRoomBlockDate: (roomId: string, date: string) => void;
  saveExperience: (exp: Experience) => void;
  saveOffer: (offer: Offer) => void;
  updateSiteSettings: (settings: SiteSettings) => void;
  updateUserProfile: (data: Partial<User>) => void;
  addNotification: (notif: Omit<AppNotification, 'id' | 'createdAt' | 'read'>) => AppNotification;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: (recipientRole?: 'admin' | 'client', userId?: string) => void;
  deleteNotification: (id: string) => void;
  clearAllNotifications: (recipientRole?: 'admin' | 'client', userId?: string) => void;
  sendSupportMessage: (data: Omit<SupportMessage, 'id' | 'createdAt' | 'status'>) => SupportMessage;
  replySupportMessage: (messageId: string, replyText: string) => void;
  resetAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  ACCOMMODATIONS: 'zeman_accommodations_v3',
  ROOM_UNITS: 'zeman_rooms_v3',
  BOOKINGS: 'zeman_bookings_v3',
  REVIEWS: 'zeman_reviews_v3',
  EXPERIENCES: 'zeman_experiences_v3',
  OFFERS: 'zeman_offers_v3',
  USERS: 'zeman_users_v3',
  SETTINGS: 'zeman_settings_v3',
  CURRENT_USER: 'zeman_current_user_v3',
  NOTIFICATIONS: 'zeman_notifications_v3',
  SUPPORT_MESSAGES: 'zeman_support_messages_v3',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accommodations, setAccommodations] = useState<Accommodation[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ACCOMMODATIONS);
    return saved ? JSON.parse(saved) : INITIAL_ACCOMMODATIONS;
  });

  const [roomUnits, setRoomUnits] = useState<RoomUnit[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ROOM_UNITS);
    return saved ? JSON.parse(saved) : INITIAL_ROOM_UNITS;
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
    return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.REVIEWS);
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  const [experiences, setExperiences] = useState<Experience[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.EXPERIENCES);
    return saved ? JSON.parse(saved) : INITIAL_EXPERIENCES;
  });

  const [offers, setOffers] = useState<Offer[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.OFFERS);
    return saved ? JSON.parse(saved) : INITIAL_OFFERS;
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USERS);
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return saved ? JSON.parse(saved) : INITIAL_SITE_SETTINGS;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return saved ? JSON.parse(saved) : null;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [supportMessages, setSupportMessages] = useState<SupportMessage[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SUPPORT_MESSAGES);
    return saved ? JSON.parse(saved) : INITIAL_SUPPORT_MESSAGES;
  });

  const [currentView, setCurrentView] = useState<AppView>('home');
  const [selectedAccommodation, setSelectedAccommodation] = useState<Accommodation | null>(null);
  const [activeModal, setActiveModal] = useState<ActiveModal>('none');
  const [bookingDraft, setBookingDraft] = useState<Partial<Booking> | null>(null);
  const [activeLanguage, setActiveLanguage] = useState<'PT' | 'EN'>('PT');

  // Search criteria default to tomorrow + 3 days
  const today = new Date();
  const defaultCheckIn = new Date(today);
  defaultCheckIn.setDate(today.getDate() + 1);
  const defaultCheckOut = new Date(today);
  defaultCheckOut.setDate(today.getDate() + 4);

  const [searchCriteria, setSearchCriteria] = useState<SearchCriteria>({
    destination: 'Hospedaria ZEMAN (Rotunda do Fubu / Talatona)',
    checkIn: defaultCheckIn.toISOString().split('T')[0],
    checkOut: defaultCheckOut.toISOString().split('T')[0],
    guests: 2,
    rooms: 1,
    category: 'Todos',
  });

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACCOMMODATIONS, JSON.stringify(accommodations));
  }, [accommodations]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ROOM_UNITS, JSON.stringify(roomUnits));
  }, [roomUnits]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EXPERIENCES, JSON.stringify(experiences));
  }, [experiences]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.OFFERS, JSON.stringify(offers));
  }, [offers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(siteSettings));
  }, [siteSettings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SUPPORT_MESSAGES, JSON.stringify(supportMessages));
  }, [supportMessages]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  }, [currentUser]);

  // Currency Formatter
  const formatKz = (val: number): string => {
    return `${new Intl.NumberFormat('pt-AO', { maximumFractionDigits: 0 }).format(val)} Kz`;
  };

  // --- Notification Actions ---
  const addNotification = (notif: Omit<AppNotification, 'id' | 'createdAt' | 'read'>): AppNotification => {
    const newNotif: AppNotification = {
      ...notif,
      id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toISOString(),
      read: false,
    };
    setNotifications(prev => [newNotif, ...prev]);
    return newNotif;
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsAsRead = (recipientRole?: 'admin' | 'client', userId?: string) => {
    setNotifications(prev =>
      prev.map(n => {
        if (recipientRole === 'admin' && (n.recipientRole === 'admin' || n.recipientRole === 'all_staff')) {
          return { ...n, read: true };
        }
        if (recipientRole === 'client' && (n.recipientRole === 'client' || (userId && n.recipientUserId === userId))) {
          return { ...n, read: true };
        }
        if (!recipientRole) {
          return { ...n, read: true };
        }
        return n;
      })
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAllNotifications = (recipientRole?: 'admin' | 'client', userId?: string) => {
    setNotifications(prev =>
      prev.filter(n => {
        if (recipientRole === 'admin' && (n.recipientRole === 'admin' || n.recipientRole === 'all_staff')) {
          return false;
        }
        if (recipientRole === 'client' && (n.recipientRole === 'client' || (userId && n.recipientUserId === userId))) {
          return false;
        }
        return true;
      })
    );
  };

  // --- Support Messages Actions ---
  const sendSupportMessage = (data: Omit<SupportMessage, 'id' | 'createdAt' | 'status'>): SupportMessage => {
    const newMsg: SupportMessage = {
      ...data,
      id: `msg-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'unread',
    };
    setSupportMessages(prev => [newMsg, ...prev]);

    // Alert Admin about new incoming support message
    addNotification({
      recipientRole: 'admin',
      type: 'support_message',
      title: `Nova Mensagem de Contacto / Apoio`,
      message: `${data.name} (${data.email}) enviou mensagem sobre "${data.subject}": "${data.message.substring(0, 80)}..."`,
      linkAction: {
        view: 'admin',
        tab: 'mensagens',
        targetId: newMsg.id,
      },
    });

    // Alert Client confirmation
    addNotification({
      recipientRole: 'client',
      recipientUserId: currentUser?.id,
      recipientEmail: data.email,
      type: 'support_message',
      title: `Mensagem Recebida pela Hospedaria ZEMAN`,
      message: `Recebemos o seu contacto sobre "${data.subject}". A nossa equipa de apoio responderá o mais breve possível.`,
      linkAction: {
        view: 'client_dashboard',
        tab: 'notificacoes',
      },
    });

    return newMsg;
  };

  const replySupportMessage = (messageId: string, replyText: string) => {
    const nowStr = new Date().toISOString();
    let repliedMsg: SupportMessage | null = null;

    setSupportMessages(prev =>
      prev.map(m => {
        if (m.id === messageId) {
          repliedMsg = { ...m, status: 'replied', replyText, repliedAt: nowStr };
          return repliedMsg;
        }
        return m;
      })
    );

    // Notify client about the support reply
    if (repliedMsg) {
      addNotification({
        recipientRole: 'client',
        recipientEmail: (repliedMsg as SupportMessage).email,
        type: 'support_message',
        title: `Resposta do Apoio ZEMAN — ${(repliedMsg as SupportMessage).subject}`,
        message: `A gerência da hospedaria respondeu à sua mensagem: "${replyText}"`,
        linkAction: {
          view: 'client_dashboard',
          tab: 'notificacoes',
          targetId: messageId,
        },
      });
    }
  };

  // Auth Functions
  const login = (email: string, pass: string) => {
    const trimmedEmail = email.trim().toLowerCase();
    const found = users.find(u => u.email.toLowerCase() === trimmedEmail);
    if (!found) {
      return { success: false, message: 'Conta não encontrada com este email.' };
    }
    if (found.status === 'suspended') {
      return { success: false, message: 'Esta conta encontra-se temporariamente suspensa pela administração.' };
    }
    if (found.password && found.password !== pass) {
      return { success: false, message: 'Palavra-passe incorreta.' };
    }
    setCurrentUser(found);
    return { success: true, message: 'Sessão iniciada com sucesso!', user: found };
  };

  const register = (data: Omit<User, 'id' | 'role' | 'createdAt' | 'status'>) => {
    const trimmedEmail = data.email.trim().toLowerCase();
    if (users.some(u => u.email.toLowerCase() === trimmedEmail)) {
      return { success: false, message: 'Já existe uma conta associada a este endereço de email.' };
    }
    const newUser: User = {
      ...data,
      id: `user-${Date.now()}`,
      role: 'client',
      createdAt: new Date().toISOString().split('T')[0],
      status: 'active',
    };
    setUsers(prev => [newUser, ...prev]);
    setCurrentUser(newUser);

    // Welcome notification
    addNotification({
      recipientRole: 'client',
      recipientUserId: newUser.id,
      recipientEmail: newUser.email,
      type: 'system',
      title: 'Bem-vindo à ZEMAN Trading & Services!',
      message: 'A sua conta de cliente foi criada com sucesso. Pode agora consultar quartos, gerir reservas e acumular vantagens.',
      linkAction: { view: 'client_dashboard', tab: 'reservas' },
    });

    return { success: true, message: 'Conta registada com sucesso! Bem-vindo à ZEMAN.', user: newUser };
  };

  const logout = () => {
    setCurrentUser(null);
    if (currentView === 'client_dashboard' || currentView === 'admin') {
      setCurrentView('home');
    }
  };

  const switchUserRole = (role: UserRole) => {
    if (role === 'client') {
      const client = users.find(u => u.role === 'client') || users[0];
      setCurrentUser(client);
    } else {
      const adminUser = users.find(u => u.role === role) || {
        id: `user-${role}-test`,
        fullName: `Operador ZEMAN (${role})`,
        email: `${role}@zeman.com`,
        phone: '+244 912 345 678',
        country: 'Angola',
        role: role,
        createdAt: new Date().toISOString().split('T')[0],
        status: 'active',
      };
      setCurrentUser(adminUser);
    }
  };

  // Booking functions with integrated notifications
  const createBooking = (bookingData: Omit<Booking, 'id' | 'createdAt' | 'timeline'>): Booking => {
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const newId = `ZTS-${new Date().getFullYear()}-${randomCode}`;
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);

    const newBooking: Booking = {
      ...bookingData,
      id: newId,
      createdAt: new Date().toISOString(),
      timeline: [
        {
          date: nowStr,
          action: 'Solicitação de reserva registada no sistema',
          actor: currentUser ? currentUser.fullName : 'Hóspede Online',
        },
      ],
    };

    setBookings(prev => [newBooking, ...prev]);

    // 1. Alert Admin about new booking
    addNotification({
      recipientRole: 'admin',
      type: 'booking_status',
      title: `Nova Reserva Registada — ${newId}`,
      message: `O hóspede ${bookingData.guestName} registou reserva para ${bookingData.accommodationName} (${bookingData.checkIn} a ${bookingData.checkOut}) no valor de ${formatKz(bookingData.totalAmount)}.`,
      linkAction: {
        view: 'admin',
        tab: 'reservas',
        targetId: newId,
      },
      relatedBookingId: newId,
    });

    // 2. Alert Client about reservation pending confirmation
    addNotification({
      recipientRole: 'client',
      recipientUserId: bookingData.userId || currentUser?.id,
      recipientEmail: bookingData.guestEmail,
      type: 'booking_status',
      title: `Reserva ${newId} Registada com Sucesso`,
      message: `A sua solicitação para ${bookingData.accommodationName} foi enviada. Estamos a aguardar validação do método de pagamento (${bookingData.paymentMethod}).`,
      linkAction: {
        view: 'client_dashboard',
        tab: 'reservas',
        targetId: newId,
      },
      relatedBookingId: newId,
    });

    return newBooking;
  };

  const updateBookingStatus = (id: string, status: BookingStatus, paymentStatus?: PaymentStatus, note?: string) => {
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
    let updatedBooking: Booking | null = null;

    setBookings(prev =>
      prev.map(b => {
        if (b.id !== id) return b;
        const newTimeline = [...b.timeline];
        newTimeline.push({
          date: nowStr,
          action: `Estado da reserva alterado para: ${status}${paymentStatus ? ` | Pagamento: ${paymentStatus}` : ''}`,
          actor: currentUser ? currentUser.fullName : 'Administrador',
          note: note,
        });
        updatedBooking = {
          ...b,
          status,
          paymentStatus: paymentStatus || b.paymentStatus,
          internalNotes: note !== undefined ? note : b.internalNotes,
          timeline: newTimeline,
        };
        return updatedBooking;
      })
    );

    if (updatedBooking) {
      const b = updatedBooking as Booking;

      // 1. Alert Client about status change
      addNotification({
        recipientRole: 'client',
        recipientUserId: b.userId,
        recipientEmail: b.guestEmail,
        type: 'booking_status',
        title: `Atualização da Reserva ${b.id}: ${status}`,
        message: `O estado da sua reserva em ${b.accommodationName} foi atualizado para "${status}" com pagamento "${b.paymentStatus}". ${note ? `Nota: ${note}` : ''}`,
        linkAction: {
          view: 'client_dashboard',
          tab: 'reservas',
          targetId: b.id,
        },
        relatedBookingId: b.id,
      });

      // 2. If status was changed to Concluída -> send REVIEW REQUEST!
      if (status === 'Concluída') {
        addNotification({
          recipientRole: 'client',
          recipientUserId: b.userId,
          recipientEmail: b.guestEmail,
          type: 'review_request',
          title: `Como foi a sua estadia na Hospedaria ZEMAN?`,
          message: `A sua estadia na reserva ${b.id} foi concluída. Partilhe a sua avaliação sobre o conforto do quarto, gerador 24h e atendimento!`,
          linkAction: {
            view: 'client_dashboard',
            tab: 'avaliar',
            targetId: b.id,
          },
          relatedBookingId: b.id,
        });
      }
    }
  };

  const cancelBooking = (id: string, reason: string) => {
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
    let targetBooking: Booking | null = null;

    setBookings(prev =>
      prev.map(b => {
        if (b.id !== id) return b;
        targetBooking = b;
        return {
          ...b,
          status: 'Cancelada',
          cancellationReason: reason,
          timeline: [
            ...b.timeline,
            {
              date: nowStr,
              action: `Reserva cancelada: ${reason}`,
              actor: currentUser ? currentUser.fullName : 'Cliente',
            },
          ],
        };
      })
    );

    if (targetBooking) {
      const b = targetBooking as Booking;

      // Alert Admin
      addNotification({
        recipientRole: 'admin',
        type: 'booking_status',
        title: `Cancelamento de Reserva — ${b.id}`,
        message: `O hóspede ${b.guestName} cancelou a reserva em ${b.accommodationName}. Motivo: ${reason}`,
        linkAction: {
          view: 'admin',
          tab: 'reservas',
          targetId: b.id,
        },
        relatedBookingId: b.id,
      });

      // Alert Client
      addNotification({
        recipientRole: 'client',
        recipientUserId: b.userId,
        recipientEmail: b.guestEmail,
        type: 'booking_status',
        title: `Reserva ${b.id} Cancelada`,
        message: `O cancelamento da sua reserva em ${b.accommodationName} foi processado conforme a política aplicável.`,
        linkAction: {
          view: 'client_dashboard',
          tab: 'reservas',
          targetId: b.id,
        },
        relatedBookingId: b.id,
      });
    }
  };

  // Reviews with integrated notifications
  const submitReview = (data: Omit<Review, 'id' | 'date' | 'status'>) => {
    const newRevId = `rev-${Date.now()}`;
    const newRev: Review = {
      ...data,
      id: newRevId,
      date: new Date().toLocaleDateString('pt-PT', { day: '2-digit', month: 'long', year: 'numeric' }),
      status: 'pending',
    };
    setReviews(prev => [newRev, ...prev]);

    // Alert Admin about new review submitted for moderation
    addNotification({
      recipientRole: 'admin',
      type: 'review_submitted',
      title: `Nova Avaliação Aguarda Moderação`,
      message: `${data.guestName} atribuiu ${data.rating} estrelas a "${data.accommodationName}": "${data.comment.substring(0, 80)}..."`,
      linkAction: {
        view: 'admin',
        tab: 'conteudos',
        targetId: newRevId,
      },
      relatedReviewId: newRevId,
    });
  };

  const approveReview = (id: string) => {
    const rev = reviews.find(r => r.id === id);
    setReviews(prev => prev.map(r => (r.id === id ? { ...r, status: 'approved' } : r)));

    // Alert Client that review was approved
    if (rev) {
      addNotification({
        recipientRole: 'client',
        recipientEmail: rev.guestEmail,
        type: 'system',
        title: `A sua avaliação foi Aprovada e Publicada!`,
        message: `A sua avaliação sobre "${rev.accommodationName}" foi aprovada pela gerência e está visível no site. Agradecemos a sua preferência!`,
        linkAction: {
          view: 'client_dashboard',
          tab: 'avaliar',
        },
        relatedReviewId: id,
      });
    }
  };

  const rejectReview = (id: string) => {
    setReviews(prev => prev.map(r => (r.id === id ? { ...r, status: 'rejected' } : r)));
  };

  // Accommodations Admin
  const saveAccommodation = (acc: Accommodation) => {
    setAccommodations(prev => {
      const exists = prev.some(a => a.id === acc.id);
      if (exists) {
        return prev.map(a => (a.id === acc.id ? acc : a));
      }
      return [acc, ...prev];
    });
  };

  const deleteAccommodation = (id: string) => {
    setAccommodations(prev => prev.filter(a => a.id !== id));
  };

  const saveRoomUnit = (room: RoomUnit) => {
    setRoomUnits(prev => {
      const exists = prev.some(r => r.id === room.id);
      if (exists) {
        return prev.map(r => (r.id === room.id ? room : r));
      }
      return [room, ...prev];
    });
  };

  const toggleRoomBlockDate = (roomId: string, date: string) => {
    setRoomUnits(prev =>
      prev.map(room => {
        if (room.id !== roomId) return room;
        const isBlocked = room.blockedDates.includes(date);
        return {
          ...room,
          blockedDates: isBlocked
            ? room.blockedDates.filter(d => d !== date)
            : [...room.blockedDates, date],
        };
      })
    );
  };

  const saveExperience = (exp: Experience) => {
    setExperiences(prev => {
      const exists = prev.some(e => e.id === exp.id);
      return exists ? prev.map(e => (e.id === exp.id ? exp : e)) : [exp, ...prev];
    });
  };

  const saveOffer = (offer: Offer) => {
    setOffers(prev => {
      const exists = prev.some(o => o.id === offer.id);
      return exists ? prev.map(o => (o.id === offer.id ? offer : o)) : [offer, ...prev];
    });
  };

  const updateSiteSettings = (settings: SiteSettings) => {
    setSiteSettings(settings);
  };

  const updateUserProfile = (data: Partial<User>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...data };
    setCurrentUser(updated);
    setUsers(prev => prev.map(u => (u.id === currentUser.id ? updated : u)));
  };

  const resetAllData = () => {
    localStorage.clear();
    setAccommodations(INITIAL_ACCOMMODATIONS);
    setRoomUnits(INITIAL_ROOM_UNITS);
    setBookings(INITIAL_BOOKINGS);
    setReviews(INITIAL_REVIEWS);
    setExperiences(INITIAL_EXPERIENCES);
    setOffers(INITIAL_OFFERS);
    setUsers(INITIAL_USERS);
    setSiteSettings(INITIAL_SITE_SETTINGS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setSupportMessages(INITIAL_SUPPORT_MESSAGES);
    setCurrentUser(null);
  };

  return (
    <AppContext.Provider
      value={{
        accommodations,
        roomUnits,
        bookings,
        reviews,
        experiences,
        offers,
        users,
        siteSettings,
        currentUser,
        currentView,
        selectedAccommodation,
        activeModal,
        searchCriteria,
        bookingDraft,
        activeLanguage,
        notifications,
        supportMessages,
        formatKz,
        setCurrentView,
        setSelectedAccommodation,
        setActiveModal,
        setSearchCriteria,
        setBookingDraft,
        setActiveLanguage,
        login,
        register,
        logout,
        switchUserRole,
        createBooking,
        updateBookingStatus,
        cancelBooking,
        submitReview,
        approveReview,
        rejectReview,
        saveAccommodation,
        deleteAccommodation,
        saveRoomUnit,
        toggleRoomBlockDate,
        saveExperience,
        saveOffer,
        updateSiteSettings,
        updateUserProfile,
        addNotification,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        deleteNotification,
        clearAllNotifications,
        sendSupportMessage,
        replySupportMessage,
        resetAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
