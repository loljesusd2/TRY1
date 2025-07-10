'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Search, 
  Filter, 
  Star,
  Clock,
  MapPin,
  User
} from 'lucide-react';
import { formatCurrency } from '@/lib/i18n';
import { getServiceCategoryIcon } from '@/lib/utils';

interface Service {
  id: string;
  name: string;
  nameEs: string;
  nameEn: string;
  description?: string;
  price: number;
  duration: number;
  image?: string;
  category: string;
  professional: {
    id: string;
    name: string;
    rating: number;
    totalReviews: number;
    city: string;
    state: string;
  };
}

const categories = [
  { value: 'all', label: 'Todas las Categorías', labelEn: 'All Categories' },
  { value: 'HAIR', label: 'Cabello', labelEn: 'Hair' },
  { value: 'NAILS', label: 'Uñas', labelEn: 'Nails' },
  { value: 'SKINCARE', label: 'Cuidado de la Piel', labelEn: 'Skincare' },
  { value: 'MAKEUP', label: 'Maquillaje', labelEn: 'Makeup' },
  { value: 'EYEBROWS', label: 'Cejas', labelEn: 'Eyebrows' },
];

const priceRanges = [
  { value: 'all', label: 'Todos los Precios', labelEn: 'All Prices' },
  { value: '0-25', label: '$0 - $25', labelEn: '$0 - $25' },
  { value: '25-50', label: '$25 - $50', labelEn: '$25 - $50' },
  { value: '50-100', label: '$50 - $100', labelEn: '$50 - $100' },
  { value: '100+', label: '$100+', labelEn: '$100+' },
];

export default function ExplorePage() {
  const { t, language } = useLanguage();
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPriceRange, setSelectedPriceRange] = useState('all');

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('/api/services');
        if (response.ok) {
          const data = await response.json();
          setServices(data.services || []);
          setFilteredServices(data.services || []);
        }
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, []);

  useEffect(() => {
    let filtered = [...services];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(service => 
        (language === 'es' ? service.nameEs : service.nameEn)
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        service.professional.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(service => service.category === selectedCategory);
    }

    // Price range filter
    if (selectedPriceRange !== 'all') {
      const [min, max] = selectedPriceRange.includes('+') 
        ? [parseInt(selectedPriceRange.replace('+', '')), Infinity]
        : selectedPriceRange.split('-').map(Number);
      
      filtered = filtered.filter(service => 
        service.price >= min && (max === Infinity || service.price <= max)
      );
    }

    setFilteredServices(filtered);
  }, [services, searchTerm, selectedCategory, selectedPriceRange, language]);

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="h-10 bg-muted rounded"></div>
            <div className="h-10 bg-muted rounded"></div>
            <div className="h-10 bg-muted rounded"></div>
          </div>
          <div className="service-grid">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-4xl font-heading font-bold">
          {t('nav.explore')}
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Descubre servicios de belleza profesionales en Orlando, FL
        </p>
      </div>

      {/* Filters */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('common.search')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger>
            <SelectValue placeholder="Categoría" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.value} value={category.value}>
                {language === 'es' ? category.label : category.labelEn}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedPriceRange} onValueChange={setSelectedPriceRange}>
          <SelectTrigger>
            <SelectValue placeholder="Rango de Precio" />
          </SelectTrigger>
          <SelectContent>
            {priceRanges.map((range) => (
              <SelectItem key={range.value} value={range.value}>
                {language === 'es' ? range.label : range.labelEn}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {filteredServices.length} servicio{filteredServices.length !== 1 ? 's' : ''} encontrado{filteredServices.length !== 1 ? 's' : ''}
        </p>
        <Button variant="outline" size="sm">
          <Filter className="mr-2 h-4 w-4" />
          Filtros Avanzados
        </Button>
      </div>

      {/* Services Grid */}
      {filteredServices.length > 0 ? (
        <div className="service-grid">
          {filteredServices.map((service) => (
            <Card key={service.id} className="card-hover bg-background border-0 shadow-soft overflow-hidden">
              <div className="relative aspect-video bg-muted">
                {service.image ? (
                  <Image
                    src={service.image}
                    alt={language === 'es' ? service.nameEs : service.nameEn}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl">
                    {getServiceCategoryIcon(service.category)}
                  </div>
                )}
                <div className="absolute top-2 left-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium category-${service.category.toLowerCase()}`}>
                    {t(`services.categories.${service.category}`)}
                  </span>
                </div>
                <div className="absolute top-2 right-2 bg-white rounded-full px-2 py-1">
                  <span className="text-sm font-bold text-primary">
                    {formatCurrency(service.price, language)}
                  </span>
                </div>
              </div>
              
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-1">
                      {language === 'es' ? service.nameEs : service.nameEn}
                    </h3>
                    {service.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {service.description}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{service.duration} min</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{service.professional.city}, {service.professional.state}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{service.professional.name}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{service.professional.rating}</span>
                      <span className="text-xs text-muted-foreground">
                        ({service.professional.totalReviews})
                      </span>
                    </div>
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
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No se encontraron servicios</h3>
          <p className="text-muted-foreground mb-4">
            Intenta ajustar tus filtros de búsqueda
          </p>
          <Button 
            variant="outline" 
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
              setSelectedPriceRange('all');
            }}
          >
            Limpiar Filtros
          </Button>
        </div>
      )}
    </div>
  );
}
