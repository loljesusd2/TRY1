'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/navigation/page-header';
import { ToggleSwitch } from '@/components/ui/toggle-switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  category: string;
  isActive: boolean;
  createdAt: string;
}

export default function ServicesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/auth/login');
      return;
    }

    if (session.user.role !== 'PROFESSIONAL') {
      router.push('/dashboard');
      return;
    }

    fetchServices();
  }, [session, status, router]);

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/services');
      if (response.ok) {
        const data = await response.json();
        setServices(data);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
      toast.error('Error al cargar los servicios');
    } finally {
      setLoading(false);
    }
  };

  const toggleServiceStatus = async (serviceId: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/services/${serviceId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive }),
      });

      if (response.ok) {
        setServices(services.map(service => 
          service.id === serviceId ? { ...service, isActive } : service
        ));
        toast.success(isActive ? 'Servicio activado' : 'Servicio desactivado');
      } else {
        toast.error('Error al actualizar el servicio');
      }
    } catch (error) {
      console.error('Error updating service:', error);
      toast.error('Error al actualizar el servicio');
    }
  };

  const deleteService = async (serviceId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este servicio?')) {
      return;
    }

    try {
      const response = await fetch(`/api/services/${serviceId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setServices(services.filter(service => service.id !== serviceId));
        toast.success('Servicio eliminado exitosamente');
      } else {
        toast.error('Error al eliminar el servicio');
      }
    } catch (error) {
      console.error('Error deleting service:', error);
      toast.error('Error al eliminar el servicio');
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="Mis Servicios"
        description="Gestiona tus servicios de belleza"
        action={
          <Button onClick={() => router.push('/services/create')}>
            <Plus className="h-4 w-4 mr-2" />
            Crear Servicio
          </Button>
        }
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <Card key={service.id} className="relative">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{service.name}</CardTitle>
                  <Badge variant={service.isActive ? 'default' : 'secondary'}>
                    {service.isActive ? 'Activo' : 'Inactivo'}
                  </Badge>
                </div>
                <ToggleSwitch
                  checked={service.isActive}
                  onChange={(checked) => toggleServiceStatus(service.id, checked)}
                  icon={service.isActive ? Eye : EyeOff}
                />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4 line-clamp-2">{service.description}</p>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Precio:</span>
                  <span className="font-semibold">${service.price}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Duración:</span>
                  <span className="font-semibold">{service.duration} min</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Categoría:</span>
                  <span className="font-semibold">{service.category}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push(`/services/edit/${service.id}`)}
                  className="flex-1"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Editar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => deleteService(service.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {services.length === 0 && !loading && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No tienes servicios creados
          </h3>
          <p className="text-gray-500 mb-4">
            Comienza creando tu primer servicio de belleza
          </p>
          <Button onClick={() => router.push('/services/create')}>
            <Plus className="h-4 w-4 mr-2" />
            Crear Primer Servicio
          </Button>
        </div>
      )}
    </div>
  );
}
