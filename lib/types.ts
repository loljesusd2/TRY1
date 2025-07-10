
export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: 'CLIENT' | 'PROFESSIONAL' | 'ADMIN';
  image?: string;
  bio?: string;
  isApproved: boolean;
  specialties: string[];
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  rating: number;
  totalReviews: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Service {
  id: string;
  name: string;
  nameEs: string;
  nameEn: string;
  description?: string;
  descriptionEs?: string;
  descriptionEn?: string;
  price: number;
  duration: number;
  image?: string;
  category: ServiceCategory;
  isActive: boolean;
  professionalId: string;
  professional: User;
  categoryId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Booking {
  id: string;
  date: Date;
  time: string;
  status: BookingStatus;
  totalAmount: number;
  platformFee: number;
  professionalEarnings: number;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  notes?: string;
  clientId: string;
  client: User;
  professionalId: string;
  professional: User;
  serviceId: string;
  service: Service;
  payment?: Payment;
  review?: Review;
  createdAt: Date;
  updatedAt: Date;
}

export interface Review {
  id: string;
  rating: number;
  comment?: string;
  clientId: string;
  client: User;
  professionalId: string;
  professional: User;
  serviceId: string;
  service: Service;
  bookingId: string;
  booking: Booking;
  createdAt: Date;
  updatedAt: Date;
}

export interface Payment {
  id: string;
  amount: number;
  platformFee: number;
  professionalEarnings: number;
  method: 'CASH';
  status: string;
  bookingId: string;
  booking: Booking;
  clientId: string;
  client: User;
  createdAt: Date;
  updatedAt: Date;
}

export type ServiceCategory = 'HAIR' | 'NAILS' | 'SKINCARE' | 'MAKEUP' | 'EYEBROWS';
export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
export type UserRole = 'CLIENT' | 'PROFESSIONAL' | 'ADMIN';

export interface Language {
  code: 'es' | 'en';
  name: string;
  flag: string;
}

export interface ServiceFilter {
  category?: ServiceCategory;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  city?: string;
}

export interface BookingFilter {
  status?: BookingStatus;
  date?: Date;
  professional?: string;
}

export interface EarningsData {
  totalEarnings: number;
  platformFee: number;
  netEarnings: number;
  bookingsCount: number;
  averageRating: number;
  monthlyEarnings: Array<{
    month: string;
    earnings: number;
  }>;
}

export interface DashboardStats {
  totalUsers: number;
  totalProfessionals: number;
  totalBookings: number;
  totalRevenue: number;
  pendingApprovals: number;
  monthlyStats: Array<{
    month: string;
    bookings: number;
    revenue: number;
    newUsers: number;
  }>;
}
