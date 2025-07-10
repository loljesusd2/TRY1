
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function calculateEarnings(totalAmount: number, platformFeePercentage: number = 20) {
  const platformFee = (totalAmount * platformFeePercentage) / 100;
  const professionalEarnings = totalAmount - platformFee;
  
  return {
    totalAmount,
    platformFee,
    professionalEarnings
  };
}

export function formatPhoneNumber(phone: string) {
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  
  if (match) {
    return '(' + match[1] + ') ' + match[2] + '-' + match[3];
  }
  
  return phone;
}

export function getImageUrl(imagePath?: string | null) {
  if (!imagePath) {
    return '/images/placeholder-avatar.png';
  }
  
  if (imagePath.startsWith('http') || imagePath.startsWith('/')) {
    return imagePath;
  }
  
  return `/uploads/${imagePath}`;
}

export function generateTimeSlots(startTime: string, endTime: string, duration: number) {
  const slots = [];
  const start = new Date(`2000-01-01 ${startTime}`);
  const end = new Date(`2000-01-01 ${endTime}`);
  
  while (start < end) {
    slots.push(start.toTimeString().slice(0, 5));
    start.setMinutes(start.getMinutes() + duration);
  }
  
  return slots;
}

export function isValidEmail(email: string) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidPhone(phone: string) {
  const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  return phoneRegex.test(phone);
}

export function getBookingStatusColor(status: string) {
  switch (status) {
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800';
    case 'CONFIRMED':
      return 'bg-blue-100 text-blue-800';
    case 'IN_PROGRESS':
      return 'bg-purple-100 text-purple-800';
    case 'COMPLETED':
      return 'bg-green-100 text-green-800';
    case 'CANCELLED':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

export function getServiceCategoryIcon(category: string) {
  switch (category) {
    case 'HAIR':
      return '💇‍♀️';
    case 'NAILS':
      return '💅';
    case 'SKINCARE':
      return '🧴';
    case 'MAKEUP':
      return '💄';
    case 'EYEBROWS':
      return '🧿';
    default:
      return '✨';
  }
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function truncateText(text: string, maxLength: number) {
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength) + '...';
}

export function generateAvailableSlots(
  availability: Array<{ dayOfWeek: number; startTime: string; endTime: string; isAvailable: boolean }>,
  date: Date,
  serviceDuration: number,
  bookedSlots: string[] = []
) {
  const dayOfWeek = date.getDay();
  const dayAvailability = availability.find(a => a.dayOfWeek === dayOfWeek && a.isAvailable);
  
  if (!dayAvailability) {
    return [];
  }
  
  const allSlots = generateTimeSlots(
    dayAvailability.startTime,
    dayAvailability.endTime,
    serviceDuration
  );
  
  return allSlots.filter(slot => !bookedSlots.includes(slot));
}

export function validateBookingData(data: any) {
  const errors: string[] = [];
  
  if (!data.serviceId) {
    errors.push('Service is required');
  }
  
  if (!data.date) {
    errors.push('Date is required');
  }
  
  if (!data.time) {
    errors.push('Time is required');
  }
  
  if (!data.address) {
    errors.push('Address is required');
  }
  
  if (!data.city) {
    errors.push('City is required');
  }
  
  if (!data.state) {
    errors.push('State is required');
  }
  
  if (!data.zipCode) {
    errors.push('Zip code is required');
  }
  
  return errors;
}
