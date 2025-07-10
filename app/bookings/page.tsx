'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';
import { 
  Calendar, 
  Clock, 
  MapPin,
  User,
  DollarSign,
  Star,
  CheckCircle,
  XCircle,
  AlertCircle,
  Play,
  MessageCircle
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/i18n';
import toast from 'react-hot-toast';

interface Booking {
  id: string;
  date: string;
  time: string;
  status: string;
  totalAmount: number;
  address: string;
  city: string;
  state: string;
  notes?: string;
  client: {
    id: string;
    name: string;
    phone?: string;
    image?: string;
  };
  professional: {
    id: string;
    name: string;
    phone?: string;
    rating: number;
    image?: string;
  };
  service: {
    id: string;
    name: string;
    nameEs: string;
    nameEn: string;
    duration: number;
    category: string;
  };
  review?: {
    id: string;
    rating: number;
    comment?: string;
  };
}

const statusOptions = [
  { value: 'all', label: 'Todas', labelEn: 'All' },
  { value: 'PENDING', label: 'Pendientes', labelEn: 'Pending' },
  { value: 'CONFIRMED', label: 'Confirmadas', labelEn: 'Confirmed' },
  { value: 'IN_PROGRESS', label: 'En Progreso', labelEn: 'In Progress' },
  { value: 'COMPLETED', label: 'Completadas', labelEn: 'Completed' },
  { value: 'CANCELLED', label: 'Canceladas', labelEn: 'Cancelled' },
];

export default function BookingsPage() {
  const { data: session } = useSession();
  const { t, language } = useLanguage();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [updatingBooking, setUpdatingBooking] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch('/api/bookings');
        if (response.ok) {
          const data = await response.json();
          setBookings(data.bookings || []);
          setFilteredBookings(data.bookings || []);
        }
      } catch (error) {
        console.error('Error fetching bookings:', error);
        toast.error('Error al cargar las reservas');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, []);

  useEffect(() => {
    let filtered = [...bookings];

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(booking => booking.status === selectedStatus);
    }

    setFilteredBookings(filtered);
  }, [bookings, selectedStatus]);

  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    if (updatingBooking) return;

    setUpdatingBooking(bookingId);
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        const data = await response.json();
        setBookings(bookings.map(booking => 
          booking.id === bookingId ? data.booking : booking
        ));
        toast.success('Estado actualizado exitosamente');
      } else {
        const error = await response.json();
        toast.error(error.message || 'Error al actualizar el estado');
      }
    } catch (error) {
      console.error('Error updating booking:', error);
      toast.error('Error al actualizar la reserva');
    } finally {
      setUpdatingBooking(null);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case 'CONFIRMED':
        return <CheckCircle className="h-4 w-4 text-blue-600" />;
      case 'IN_PROGRESS':
        return <Play className="h-4 w-4 text-purple-600" />;
      case 'COMPLETED':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'CANCELLED':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'Pendiente';
      case 'CONFIRMED':
        return 'Confirmada';
      case 'IN_PROGRESS':
        return 'En Progreso';
      case 'COMPLETED':
        return 'Completada';
      case 'CANCELLED':
        return 'Cancelada';
      default:
        return status;
    }
  };

  const canUpdateStatus = (booking: Booking, newStatus: string) => {
    if (session?.user.role === 'ADMIN') return true;
    if (session?.user.role === 'PROFESSIONAL' && booking.professional.id === session.user.id) {
      return ['CONFIRMED', 'IN_PROGRESS', 'COMPLETED'].includes(newStatus);
    }
    if (session?.user.role === 'CLIENT' && booking.client.id === session.user.id) {
      return newStatus === 'CANCELLED' && ['PENDING', 'CONFIRMED'].includes(booking.status);
    }
    return false;
  };

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="h-10 bg-muted rounded w-1/4"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-heading font-bold">
            {t('bookings.title')}
          </h1>
          <p className="text-muted-foreground mt-2">
            Gestiona tus citas y servicios
          </p>
        </div>
        {session?.user.role === 'CLIENT' && (
          <Button asChild>
            <Link href="/explore">
              Nueva Reserva
            </Link>
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrar por estado" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {language === 'es' ? option.label : option.labelEn}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-sm text-muted-foreground">
          {filteredBookings.length} reserva{filteredBookings.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Bookings List */}
      {filteredBookings.length > 0 ? (
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <Card key={booking.id} className="card-hover">
              <CardContent className="p-6">
                <div className="grid gap-6 md:grid-cols-3">
                  {/* Service Info */}
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold text-lg">
                        {language === 'es' ? booking.service.nameEs : booking.service.nameEn}
                      </h3>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(booking.status)}
                        <span className="text-sm font-medium">
                          {getStatusLabel(booking.status)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(new Date(booking.date), language)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {booking.time}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {booking.service.duration} min
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{booking.address}, {booking.city}, {booking.state}</span>
                    </div>

                    {booking.notes && (
                      <div className="flex items-start gap-1 text-sm">
                        <MessageCircle className="h-4 w-4 mt-0.5 text-muted-foreground" />
                        <span className="text-muted-foreground">{booking.notes}</span>
                      </div>
                    )}
                  </div>

                  {/* Professional/Client Info */}
                  <div className="space-y-3">
                    {session?.user.role === 'CLIENT' ? (
                      <div>
                        <h4 className="font-medium mb-2">Profesional</h4>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                            <User className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-medium">{booking.professional.name}</p>
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <span className="text-xs text-muted-foreground">
                                {booking.professional.rating}
                              </span>
                            </div>
                            {booking.professional.phone && (
                              <p className="text-xs text-muted-foreground">
                                {booking.professional.phone}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <h4 className="font-medium mb-2">Cliente</h4>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                            <User className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-medium">{booking.client.name}</p>
                            {booking.client.phone && (
                              <p className="text-xs text-muted-foreground">
                                {booking.client.phone}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4 text-primary" />
                      <span className="font-semibold text-primary">
                        {formatCurrency(booking.totalAmount, language)}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-3">
                    <h4 className="font-medium">Acciones</h4>
                    
                    {/* Status Update Buttons */}
                    {session?.user.role === 'PROFESSIONAL' && booking.professional.id === session.user.id && (
                      <div className="space-y-2">
                        {booking.status === 'PENDING' && (
                          <Button
                            size="sm"
                            onClick={() => updateBookingStatus(booking.id, 'CONFIRMED')}
                            disabled={updatingBooking === booking.id}
                            className="w-full"
                          >
                            Confirmar Cita
                          </Button>
                        )}
                        {booking.status === 'CONFIRMED' && (
                          <Button
                            size="sm"
                            onClick={() => updateBookingStatus(booking.id, 'IN_PROGRESS')}
                            disabled={updatingBooking === booking.id}
                            className="w-full"
                          >
                            Iniciar Servicio
                          </Button>
                        )}
                        {booking.status === 'IN_PROGRESS' && (
                          <Button
                            size="sm"
                            onClick={() => updateBookingStatus(booking.id, 'COMPLETED')}
                            disabled={updatingBooking === booking.id}
                            className="w-full"
                          >
                            Marcar Completado
                          </Button>
                        )}
                      </div>
                    )}

                    {/* Cancel Button */}
                    {(['PENDING', 'CONFIRMED'].includes(booking.status)) && (
                      <>
                        {session?.user.role === 'CLIENT' && booking.client.id === session.user.id && (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => updateBookingStatus(booking.id, 'CANCELLED')}
                            disabled={updatingBooking === booking.id}
                            className="w-full"
                          >
                            Cancelar Cita
                          </Button>
                        )}
                        {session?.user.role === 'PROFESSIONAL' && booking.professional.id === session.user.id && (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => updateBookingStatus(booking.id, 'CANCELLED')}
                            disabled={updatingBooking === booking.id}
                            className="w-full"
                          >
                            Cancelar Cita
                          </Button>
                        )}
                      </>
                    )}

                    {/* Review Button */}
                    {booking.status === 'COMPLETED' && session?.user.role === 'CLIENT' && !booking.review && (
                      <Button
                        size="sm"
                        variant="outline"
                        asChild
                        className="w-full"
                      >
                        <Link href={`/bookings/${booking.id}/review`}>
                          Dejar Reseña
                        </Link>
                      </Button>
                    )}

                    {/* View Details */}
                    <Button
                      size="sm"
                      variant="ghost"
                      asChild
                      className="w-full"
                    >
                      <Link href={`/bookings/${booking.id}`}>
                        Ver Detalles
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No hay reservas</h3>
          <p className="text-muted-foreground mb-4">
            {selectedStatus === 'all' 
              ? 'Aún no tienes ninguna reserva' 
              : `No tienes reservas con estado "${getStatusLabel(selectedStatus)}"`
            }
          </p>
          {session?.user.role === 'CLIENT' && (
            <Button asChild>
              <Link href="/explore">
                Explorar Servicios
              </Link>
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
