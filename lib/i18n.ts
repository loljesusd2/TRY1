
export const languages = [
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'en', name: 'English', flag: '🇺🇸' }
] as const;

export type Language = typeof languages[number]['code'];

export const translations = {
  es: {
    // Navigation
    nav: {
      explore: 'Explorar',
      bookings: 'Mis Citas',
      profile: 'Perfil',
      dashboard: 'Dashboard',
      earnings: 'Ganancias',
      admin: 'Admin',
      users: 'Usuarios',
      services: 'Servicios',
      logout: 'Cerrar Sesión'
    },
    
    // Homepage
    home: {
      heroTitle: 'Tu belleza, a tu manera. En casa.',
      heroSubtitle: 'Encuentra y reserva con los mejores profesionales de belleza en Orlando',
      exploreServices: 'Explorar Servicios',
      howItWorks: 'Cómo Funciona',
      popularServices: 'Servicios Populares',
      welcomeBack: '¡Hola, {{name}}!',
      recommendationsForYou: 'Recomendaciones para ti',
      nextAppointment: 'Próxima Cita',
      bookAgain: 'Reservar de Nuevo',
      viewBookings: 'Ver mis Citas'
    },
    
    // Services
    services: {
      categories: {
        HAIR: 'Cabello',
        NAILS: 'Uñas',
        SKINCARE: 'Cuidado de la Piel',
        MAKEUP: 'Maquillaje',
        EYEBROWS: 'Cejas'
      },
      book: 'Reservar',
      duration: 'Duración',
      price: 'Precio',
      professional: 'Profesional',
      rating: 'Calificación',
      reviews: 'reseñas'
    },
    
    // Bookings
    bookings: {
      title: 'Mis Citas',
      upcoming: 'Próximas',
      pending: 'Pendientes',
      completed: 'Completadas',
      cancelled: 'Canceladas',
      confirm: 'Confirmar',
      cancel: 'Cancelar',
      complete: 'Completar',
      inProgress: 'En Progreso',
      leaveReview: 'Dejar Reseña',
      status: 'Estado',
      date: 'Fecha',
      time: 'Hora',
      address: 'Dirección',
      total: 'Total',
      notes: 'Notas'
    },
    
    // Dashboard
    dashboard: {
      monthlyEarnings: 'Ganancias del Mes',
      pendingBookings: 'Citas Pendientes',
      averageRating: 'Calificación Promedio',
      upcomingBookings: 'Próximas Citas',
      manageCalendar: 'Gestionar Calendario',
      viewEarnings: 'Ver Ganancias',
      totalBookings: 'Total de Citas',
      completedServices: 'Servicios Completados'
    },
    
    // Earnings
    earnings: {
      title: 'Mis Ganancias',
      totalEarnings: 'Ingresos Totales',
      platformFee: 'Comisión BeautyGO (20%)',
      netEarnings: 'Ganancias Netas',
      exportReport: 'Exportar Reporte',
      monthlyBreakdown: 'Desglose Mensual',
      transactionHistory: 'Historial de Transacciones'
    },
    
    // Auth
    auth: {
      login: 'Iniciar Sesión',
      register: 'Registrarse',
      email: 'Correo Electrónico',
      password: 'Contraseña',
      name: 'Nombre Completo',
      phone: 'Teléfono',
      confirmPassword: 'Confirmar Contraseña',
      role: 'Tipo de Usuario',
      client: 'Cliente',
      professional: 'Profesional',
      forgotPassword: '¿Olvidaste tu contraseña?',
      noAccount: '¿No tienes cuenta?',
      hasAccount: '¿Ya tienes cuenta?',
      signUp: 'Crear Cuenta',
      signIn: 'Entrar'
    },
    
    // Profile
    profile: {
      editProfile: 'Editar Perfil',
      personalInfo: 'Información Personal',
      bio: 'Biografía',
      specialties: 'Especialidades',
      address: 'Dirección',
      city: 'Ciudad',
      state: 'Estado',
      zipCode: 'Código Postal',
      changePhoto: 'Cambiar Foto de Perfil',
      saveChanges: 'Guardar Cambios',
      uploadPhoto: 'Subir Foto'
    },
    
    // Admin
    admin: {
      title: 'Panel de Administración',
      userManagement: 'Gestión de Usuarios',
      serviceManagement: 'Gestión de Servicios',
      reports: 'Reportes',
      pendingApprovals: 'Aprobaciones Pendientes',
      approve: 'Aprobar',
      reject: 'Rechazar',
      totalUsers: 'Total de Usuarios',
      totalProfessionals: 'Total de Profesionales',
      totalRevenue: 'Ingresos Totales',
      platformStats: 'Estadísticas de la Plataforma'
    },
    
    // Common
    common: {
      loading: 'Cargando...',
      error: 'Error',
      success: 'Éxito',
      cancel: 'Cancelar',
      confirm: 'Confirmar',
      save: 'Guardar',
      edit: 'Editar',
      delete: 'Eliminar',
      view: 'Ver',
      back: 'Volver',
      next: 'Siguiente',
      previous: 'Anterior',
      search: 'Buscar...',
      filter: 'Filtrar',
      sort: 'Ordenar',
      all: 'Todos',
      none: 'Ninguno',
      select: 'Seleccionar',
      upload: 'Subir',
      download: 'Descargar'
    }
  },
  
  en: {
    // Navigation
    nav: {
      explore: 'Explore',
      bookings: 'My Bookings',
      profile: 'Profile',
      dashboard: 'Dashboard',
      earnings: 'Earnings',
      admin: 'Admin',
      users: 'Users',
      services: 'Services',
      logout: 'Logout'
    },
    
    // Homepage
    home: {
      heroTitle: 'Your beauty, your way. At home.',
      heroSubtitle: 'Find and book with the best beauty professionals in Orlando',
      exploreServices: 'Explore Services',
      howItWorks: 'How It Works',
      popularServices: 'Popular Services',
      welcomeBack: 'Hello, {{name}}!',
      recommendationsForYou: 'Recommendations for you',
      nextAppointment: 'Next Appointment',
      bookAgain: 'Book Again',
      viewBookings: 'View My Bookings'
    },
    
    // Services
    services: {
      categories: {
        HAIR: 'Hair',
        NAILS: 'Nails',
        SKINCARE: 'Skincare',
        MAKEUP: 'Makeup',
        EYEBROWS: 'Eyebrows'
      },
      book: 'Book',
      duration: 'Duration',
      price: 'Price',
      professional: 'Professional',
      rating: 'Rating',
      reviews: 'reviews'
    },
    
    // Bookings
    bookings: {
      title: 'My Bookings',
      upcoming: 'Upcoming',
      pending: 'Pending',
      completed: 'Completed',
      cancelled: 'Cancelled',
      confirm: 'Confirm',
      cancel: 'Cancel',
      complete: 'Complete',
      inProgress: 'In Progress',
      leaveReview: 'Leave Review',
      status: 'Status',
      date: 'Date',
      time: 'Time',
      address: 'Address',
      total: 'Total',
      notes: 'Notes'
    },
    
    // Dashboard
    dashboard: {
      monthlyEarnings: 'Monthly Earnings',
      pendingBookings: 'Pending Bookings',
      averageRating: 'Average Rating',
      upcomingBookings: 'Upcoming Bookings',
      manageCalendar: 'Manage Calendar',
      viewEarnings: 'View Earnings',
      totalBookings: 'Total Bookings',
      completedServices: 'Completed Services'
    },
    
    // Earnings
    earnings: {
      title: 'My Earnings',
      totalEarnings: 'Total Earnings',
      platformFee: 'BeautyGO Commission (20%)',
      netEarnings: 'Net Earnings',
      exportReport: 'Export Report',
      monthlyBreakdown: 'Monthly Breakdown',
      transactionHistory: 'Transaction History'
    },
    
    // Auth
    auth: {
      login: 'Login',
      register: 'Register',
      email: 'Email',
      password: 'Password',
      name: 'Full Name',
      phone: 'Phone',
      confirmPassword: 'Confirm Password',
      role: 'User Type',
      client: 'Client',
      professional: 'Professional',
      forgotPassword: 'Forgot your password?',
      noAccount: "Don't have an account?",
      hasAccount: 'Already have an account?',
      signUp: 'Sign Up',
      signIn: 'Sign In'
    },
    
    // Profile
    profile: {
      editProfile: 'Edit Profile',
      personalInfo: 'Personal Information',
      bio: 'Bio',
      specialties: 'Specialties',
      address: 'Address',
      city: 'City',
      state: 'State',
      zipCode: 'Zip Code',
      changePhoto: 'Change Profile Photo',
      saveChanges: 'Save Changes',
      uploadPhoto: 'Upload Photo'
    },
    
    // Admin
    admin: {
      title: 'Admin Panel',
      userManagement: 'User Management',
      serviceManagement: 'Service Management',
      reports: 'Reports',
      pendingApprovals: 'Pending Approvals',
      approve: 'Approve',
      reject: 'Reject',
      totalUsers: 'Total Users',
      totalProfessionals: 'Total Professionals',
      totalRevenue: 'Total Revenue',
      platformStats: 'Platform Statistics'
    },
    
    // Common
    common: {
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      cancel: 'Cancel',
      confirm: 'Confirm',
      save: 'Save',
      edit: 'Edit',
      delete: 'Delete',
      view: 'View',
      back: 'Back',
      next: 'Next',
      previous: 'Previous',
      search: 'Search...',
      filter: 'Filter',
      sort: 'Sort',
      all: 'All',
      none: 'None',
      select: 'Select',
      upload: 'Upload',
      download: 'Download'
    }
  }
};

export const getTranslation = (key: string, lang: Language = 'es', params?: Record<string, string>) => {
  const keys = key.split('.');
  let value: any = translations[lang];
  
  for (const k of keys) {
    value = value?.[k];
  }
  
  if (typeof value !== 'string') {
    return key;
  }
  
  if (params) {
    return Object.entries(params).reduce((str, [key, val]) => {
      return str.replace(new RegExp(`{{${key}}}`, 'g'), val);
    }, value);
  }
  
  return value;
};

export const formatCurrency = (amount: number, lang: Language = 'es') => {
  return new Intl.NumberFormat(lang === 'es' ? 'es-US' : 'en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

export const formatDate = (date: Date, lang: Language = 'es') => {
  return new Intl.DateTimeFormat(lang === 'es' ? 'es-US' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
};

export const formatTime = (time: string) => {
  return time;
};
