
'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useLanguage } from '../language-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { 
  Calendar, 
  Clock, 
  Star,
  ArrowRight,
  MapPin,
  Sparkles
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/i18n';

interface Booking {
  id: string;
  date: string;
  time: string;
  service: {
    name: string;
    nameEs: string;
    price: number;
  };
  professional: {
    name: string;
    rating: number;
  };
  status: string;
}

interface Service {
  id: string;
  name: string;
  nameEs: string;
  price: number;
  duration: number;
  professional: {
    name: string;
    rating: number;
  };
  category: string;
}

export function ClientHomepage() {
  const { data: session } = useSession();
  const { t, language } = useLanguage();
  const [nextBooking, setNextBooking] = useState<Booking | null>(null);
  const [recommendations, setRecommendations] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch next booking
        const bookingsResponse = await fetch('/api/bookings?limit=1&status=CONFIRMED,PENDING');
        if (bookingsResponse.ok) {
          const bookingsData = await bookingsResponse.json();
          setNextBooking(bookingsData.bookings?.[0] || null);
        }

        // Fetch recommended services
        const servicesResponse = await fetch('/api/services?limit=3&recommended=true');
        if (servicesResponse.ok) {
          const servicesData = await servicesResponse.json();
          setRecommendations(servicesData.services || []);
        }
      } catch (error) {
        console.error('Error fetching homepage data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="h-48 bg-muted rounded"></div>
            <div className="h-48 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 space-y-8">
      {/* Welcome Section */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-4xl font-heading font-bold">
          {t('home.welcomeBack', { name: session?.user.name?.split(' ')[0] || 'Cliente' })}
        </h1>
        <p className="text-lg text-muted-foreground">
          ¿Qué servicio de belleza te gustaría reservar hoy?
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Button size="lg" asChild className="h-16 text-lg">
          <Link href="/explore">
            <Sparkles className="mr-2 h-6 w-6" />
            Explorar Servicios
          </Link>
        </Button>
        <Button size="lg" variant="outline" asChild className="h-16 text-lg">
          <Link href="/bookings">
            <Calendar className="mr-2 h-6 w-6" />
            {t('home.viewBookings')}
          </Link>
        </Button>
      </div>

      {/* Next Appointment */}
      {nextBooking && (
        <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              {t('home.nextAppointment')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">
                  {language === 'es' ? nextBooking.service.nameEs : nextBooking.service.name}
                </h3>
                <p className="text-muted-foreground">
                  con {nextBooking.professional.name}
                </p>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {formatDate(new Date(nextBooking.date), language)}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {nextBooking.time}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm">{nextBooking.professional.rating}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary">
                  {formatCurrency(nextBooking.service.price, language)}
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  nextBooking.status === 'CONFIRMED' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {nextBooking.status === 'CONFIRMED' ? 'Confirmada' : 'Pendiente'}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" asChild>
                <Link href={`/bookings/${nextBooking.id}`}>
                  Ver Detalles
                </Link>
              </Button>
              <Button size="sm" variant="outline" asChild>
                <Link href="/bookings">
                  Gestionar Citas
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recommendations */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-heading font-bold">
            {t('home.recommendationsForYou')}
          </h2>
          <Button variant="ghost" asChild>
            <Link href="/explore">
              Ver Todo
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {recommendations.map((service) => (
            <Card key={service.id} className="card-hover">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">
                        {language === 'es' ? service.nameEs : service.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        con {service.professional.name}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-primary">
                        {formatCurrency(service.price, language)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {service.duration} min
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm">{service.professional.rating}</span>
                    <span className="text-xs text-muted-foreground ml-1">
                      ({Math.floor(Math.random() * 50) + 10} reseñas)
                    </span>
                  </div>
                  
                  <Button className="w-full" asChild>
                    <Link href={`/services/${service.id}/book`}>
                      {t('services.book')}
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Actividad Reciente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No hay actividad reciente</p>
            <Button variant="outline" className="mt-4" asChild>
              <Link href="/explore">
                Explorar Servicios
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
