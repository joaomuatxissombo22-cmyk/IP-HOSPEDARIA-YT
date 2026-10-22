export type AccommodationCategory = 
  | 'Todos' 
  | 'Quartos Casal' 
  | 'Quartos Solteiro' 
  | 'Quartos Twin' 
  | 'Suítes Master' 
  | 'Quartos Económicos';

export interface Amenity {
  id: string;
  name: string;
  icon: string;
}

export interface Accommodation {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  category: AccommodationCategory;
  location: string;
  city: string;
  pricePerNight: number; // in AOA (Kz)
  oldPrice?: number;
  featured: boolean;
  maxGuests: number;
  bedrooms: number;
  beds: number;
  bedType: string;
  bathrooms: number;
  sizeM2: number;
  rating: number;
  reviewCount: number;
  images: string[];
  description: string;
  shortDescription: string;
  amenities: string[];
  rules: string[];
  checkInTime: string;
  checkOutTime: string;
  cancellationPolicy: string;
  active: boolean;
  totalRooms: number;
}

export interface RoomUnit {
  id: string;
  accommodationId: string;
  roomNumber: string;
  name: string;
  type: string;
  capacity: number;
  pricePerNight: number;
  status: 'available' | 'maintenance' | 'occupied';
  blockedDates: string[]; // YYYY-MM-DD
}

export type BookingStatus = 'Pendente' | 'Confirmada' | 'Cancelada' | 'Concluída';
export type PaymentStatus = 'Não Pago' | 'Pendente' | 'Pago' | 'Parcialmente Pago' | 'Reembolsado';
export type PaymentMethod = 'No Alojamento' | 'Transferência Bancária / Multicaixa Express' | 'Cartão no Check-in';

export interface BookingTimelineEvent {
  date: string;
  action: string;
  note?: string;
  actor: string;
}

export interface Booking {
  id: string; // e.g. "ZTS-2026-4198"
  userId?: string;
  accommodationId: string;
  accommodationName: string;
  accommodationImage: string;
  roomType: string;
  roomNumber?: string;
  checkIn: string; // YYYY-MM-DD
  checkOut: string; // YYYY-MM-DD
  nights: number;
  guestsCount: number;
  roomsCount: number;
  pricePerNight: number;
  subtotal: number;
  taxes: number;
  discount: number;
  totalAmount: number;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  guestCountry: string;
  guestNotes?: string;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  proofOfPayment?: string;
  internalNotes?: string;
  cancellationReason?: string;
  createdAt: string;
  timeline: BookingTimelineEvent[];
}

export interface Review {
  id: string;
  bookingId?: string;
  accommodationId: string;
  accommodationName: string;
  guestName: string;
  guestEmail: string;
  guestAvatar?: string;
  rating: number;
  comment: string;
  date: string;
  status: 'approved' | 'pending' | 'rejected';
  stayDate?: string;
  userCountry?: string;
}

export interface Experience {
  id: string;
  title: string;
  category: string;
  description: string;
  duration: string;
  price: number;
  image: string;
  location: string;
  active: boolean;
}

export interface Offer {
  id: string;
  title: string;
  subtitle: string;
  discountPercent: number;
  promoCode: string;
  validUntil: string;
  image: string;
  active: boolean;
}

export type UserRole = 
  | 'client' 
  | 'admin' 
  | 'reservation_manager' 
  | 'property_manager' 
  | 'finance';

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  country: string;
  password?: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
  status: 'active' | 'suspended';
}

export interface SiteSettings {
  heroTitle: string;
  heroSubtitle: string;
  contactPhone1: string;
  contactPhone2: string;
  contactWhatsapp: string;
  contactEmail: string;
  address: string;
  workingHours: string;
  slogan: string;
  tagline: string;
  bankName: string;
  bankAccount: string;
  bankIban: string;
  bankHolder: string;
}

export interface SearchCriteria {
  destination: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  rooms: number;
  category?: AccommodationCategory;
}

export type NotificationType = 
  | 'booking_status'
  | 'review_request'
  | 'review_submitted'
  | 'support_message'
  | 'system';

export interface AppNotification {
  id: string;
  recipientRole?: 'admin' | 'all_staff' | 'client';
  recipientUserId?: string;
  recipientEmail?: string;
  type: NotificationType;
  title: string;
  message: string;
  linkAction?: {
    view?: 'client_dashboard' | 'admin';
    tab?: string;
    targetId?: string;
  };
  relatedBookingId?: string;
  relatedReviewId?: string;
  read: boolean;
  createdAt: string; // ISO String
}

export interface SupportMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  createdAt: string;
  status: 'unread' | 'read' | 'replied';
  replyText?: string;
  repliedAt?: string;
}
