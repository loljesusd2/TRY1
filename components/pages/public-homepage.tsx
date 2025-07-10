
'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '../language-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Search, 
  Calendar, 
  CheckCircle, 
  Star,
  Scissors,
  Palette,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export function PublicHomepage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              BeautyGO
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Cargando...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <PublicHomepageContent />;
}

function PublicHomepageContent() {
  const { t } = useLanguage();

  const steps = [
    {
      icon: Search,
      title: 'Explora Servicios',
      description: 'Navega por nuestra amplia gama de servicios de belleza y encuentra el perfecto para ti.'
    },
    {
      icon: Calendar,
      title: 'Reserva Fácilmente',
      description: 'Selecciona tu profesional favorito, elige fecha y hora, y confirma tu cita.'
    },
    {
      icon: CheckCircle,
      title: 'Relájate en Casa',
      description: 'Disfruta de tu servicio de belleza en la comodidad de tu hogar.'
    }
  ];

  const popularServices = [
    {
      name: 'Corte y Peinado',
      category: 'HAIR',
      price: 45,
      duration: 60,
      icon: Scissors,
    },
    {
      name: 'Manicure y Pedicure',
      category: 'NAILS',
      price: 35,
      duration: 90,
      icon: Sparkles,
    },
    {
      name: 'Maquillaje Profesional',
      category: 'MAKEUP',
      price: 65,
      duration: 45,
      icon: Palette,
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-secondary/20 py-20 md:py-32">
        <div className="absolute inset-0 bg-[url('/images/hero-pattern.png')] opacity-5"></div>
        <div className="container relative">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
              <Sparkles className="h-4 w-4" />
              <span>Servicios de Belleza Profesional</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-heading font-bold text-balance">
              {t('home.heroTitle')}
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
              {t('home.heroSubtitle')}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="btn-hover">
                <Link href="/explore">
                  {t('home.exploreServices')}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/auth/register">
                  Únete como Profesional
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-secondary/30">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              {t('home.howItWorks')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Reservar tu servicio de belleza favorito nunca fue tan fácil
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <Card key={index} className="card-hover bg-background border-0 shadow-soft">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-heading font-semibold mb-4">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Popular Services */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              {t('home.popularServices')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Descubre nuestros servicios más solicitados
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {popularServices.map((service, index) => {
              const Icon = service.icon;
              return (
                <Card key={index} className="card-hover bg-background border-0 shadow-soft">
                  <CardContent className="p-8">
                    <div className="flex items-start justify-between mb-6">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">${service.price}</div>
                        <div className="text-sm text-muted-foreground">{service.duration} min</div>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-heading font-semibold mb-2">
                      {service.name}
                    </h3>
                    
                    <div className="flex items-center space-x-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                      <span className="text-sm text-muted-foreground ml-2">(4.9)</span>
                    </div>
                    
                    <Button className="w-full" asChild>
                      <Link href="/explore">
                        Ver Disponibilidad
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          
          <div className="text-center mt-12">
            <Button size="lg" variant="outline" asChild>
              <Link href="/explore">
                Ver Todos los Servicios
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section for Professionals */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary/80">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
              ¿Eres un Profesional de la Belleza?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Únete a BeautyGO y comienza a ganar dinero ofreciendo tus servicios a domicilio
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/auth/register">
                  Únete Ahora
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary" asChild>
                <Link href="/explore">
                  Conoce Más
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
