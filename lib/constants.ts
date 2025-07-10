
export const APP_CONFIG = {
  name: 'BeautyGO',
  description: 'Servicios de belleza a domicilio en Orlando, FL',
  url: process.env.NEXTAUTH_URL || 'http://localhost:3000',
  locale: 'es-US',
  defaultLanguage: 'es' as const,
  supportedLanguages: ['es', 'en'] as const,
  platformFeePercentage: 20,
  maxFileSize: 5 * 1024 * 1024, // 5MB
  allowedImageTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  currency: 'USD',
  timezone: 'America/New_York', // Orlando timezone
} as const;

export const ROUTES = {
  home: '/',
  explore: '/explore',
  bookings: '/bookings',
  dashboard: '/dashboard',
  earnings: '/earnings',
  admin: '/admin',
  profile: '/profile/edit',
  login: '/auth/login',
  register: '/auth/register',
  pendingApproval: '/pending-approval',
} as const;

export const SERVICE_CATEGORIES = {
  HAIR: 'HAIR',
  NAILS: 'NAILS',
  SKINCARE: 'SKINCARE',
  MAKEUP: 'MAKEUP',
  EYEBROWS: 'EYEBROWS',
} as const;

export const BOOKING_STATUSES = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
} as const;

export const USER_ROLES = {
  CLIENT: 'CLIENT',
  PROFESSIONAL: 'PROFESSIONAL',
  ADMIN: 'ADMIN',
} as const;

export const PAYMENT_METHODS = {
  CASH: 'CASH',
} as const;

export const CONTACT_INFO = {
  email: 'soporte@beautygo.com',
  phone: '(407) 555-0100',
  address: 'Orlando, FL',
  businessHours: 'Lunes a Domingo: 8:00 AM - 8:00 PM',
} as const;

export const SOCIAL_LINKS = {
  facebook: '#',
  instagram: '#',
  twitter: '#',
} as const;

// Professional approval requirements
export const PROFESSIONAL_REQUIREMENTS = {
  minBioLength: 50,
  minSpecialties: 1,
  requiredFields: ['name', 'email', 'phone', 'bio', 'specialties', 'city', 'state'],
} as const;

// Service configuration
export const SERVICE_CONFIG = {
  minPrice: 15,
  maxPrice: 500,
  minDuration: 15, // minutes
  maxDuration: 480, // 8 hours
  maxNameLength: 100,
  maxDescriptionLength: 500,
} as const;

// Booking configuration
export const BOOKING_CONFIG = {
  advanceBookingDays: 30, // How far in advance can bookings be made
  cancellationHours: 24, // Hours before appointment when cancellation is allowed
  rescheduleHours: 12, // Hours before appointment when rescheduling is allowed
  workingHours: {
    start: '08:00',
    end: '20:00',
  },
  workingDays: [1, 2, 3, 4, 5, 6, 0], // Monday to Sunday
} as const;

// Error messages
export const ERROR_MESSAGES = {
  UNAUTHORIZED: 'No autorizado',
  FORBIDDEN: 'Acceso denegado',
  NOT_FOUND: 'No encontrado',
  VALIDATION_ERROR: 'Error de validación',
  SERVER_ERROR: 'Error interno del servidor',
  NETWORK_ERROR: 'Error de conexión',
  FILE_TOO_LARGE: 'El archivo es demasiado grande',
  INVALID_FILE_TYPE: 'Tipo de archivo no válido',
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  PROFILE_UPDATED: 'Perfil actualizado exitosamente',
  BOOKING_CREATED: 'Reserva creada exitosamente',
  BOOKING_UPDATED: 'Reserva actualizada exitosamente',
  SERVICE_CREATED: 'Servicio creado exitosamente',
  IMAGE_UPLOADED: 'Imagen subida exitosamente',
  USER_APPROVED: 'Usuario aprobado exitosamente',
} as const;
