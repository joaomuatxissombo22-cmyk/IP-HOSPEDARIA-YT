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
  resetAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  ACCOMMODATIONS: 'zeman_accommodations_v2',
  ROOM_UNITS: 'zeman_rooms_v2',
  BOOKINGS: 'zeman_bookings_v2',
  REVIEWS: 'zeman_reviews_v2',
  EXPERIENCES: 'zeman_experiences_v2',
  OFFERS: 'zeman_offers_v2',
  USERS: 'zeman_users_v2',
  SETTINGS: 'zeman_settings_v2',
  CURRENT_USER: 'zeman_current_user_v2',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load from local storage or fallback to initial
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
    destination: 'Todas as Localizações',
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
    // In our client-side system, simple check
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
        email: `${role}@zemantrading.ao`,
        phone: '+244 923 000 000',
        country: 'Angola',
        role: role,
        createdAt: new Date().toISOString().split('T')[0],
        status: 'active',
      };
      setCurrentUser(adminUser);
    }
  };

  // Booking functions
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
    return newBooking;
  };

  const updateBookingStatus = (id: string, status: BookingStatus, paymentStatus?: PaymentStatus, note?: string) => {
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
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
        return {
          ...b,
          status,
          paymentStatus: paymentStatus || b.paymentStatus,
          internalNotes: note !== undefined ? note : b.internalNotes,
          timeline: newTimeline,
        };
      })
    );
  };

  const cancelBooking = (id: string, reason: string) => {
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
    setBookings(prev =>
      prev.map(b => {
        if (b.id !== id) return b;
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
  };

  // Reviews
  const submitReview = (data: Omit<Review, 'id' | 'date' | 'status'>) => {
    const newRev: Review = {
      ...data,
      id: `rev-${Date.now()}`,
      date: new Date().toLocaleDateString('pt-PT', { day: '2-digit', month: 'long', year: 'numeric' }),
      status: 'pending', // Requires admin approval per prompt!
    };
    setReviews(prev => [newRev, ...prev]);
  };

  const approveReview = (id: string) => {
    setReviews(prev => prev.map(r => (r.id === id ? { ...r, status: 'approved' } : r)));
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
