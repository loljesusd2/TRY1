
'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useLanguage } from '../language-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { 
  Users, 
  DollarSign, 
  Calendar,
  UserCheck,
  TrendingUp,
  AlertCircle,
  ArrowRight,
  BarChart3
} from 'lucide-react';
import { formatCurrency } from '@/lib/i18n';

interface AdminStats {
  totalUsers: number;
  totalProfessionals: number;
  totalBookings: number;
  totalRevenue: number;
  pendingApprovals: number;
  monthlyBookings: number;
  platformFee: number;
  recentActivities: Array<{
    id: string;
    type: string;
    description: string;
    timestamp: string;
  }>;
}

export function AdminHomepage() {
  const { data: session } = useSession();
  const { t, language } = useLanguage();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/admin/dashboard');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Error fetching admin stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="grid gap-6 md:grid-cols-4">
            <div className="h-32 bg-muted rounded"></div>
            <div className="h-32 bg-muted rounded"></div>
            <div className="h-32 bg-muted rounded"></div>
            <div className="h-32 bg-muted rounded"></div>
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
          Panel de Administración
        </h1>
        <p className="text-lg text-muted-foreground">
          Resumen general de la plataforma BeautyGO
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">
                  {t('admin.totalUsers')}
                </p>
                <p className="text-3xl font-bold text-blue-800">
                  {stats?.totalUsers || 0}
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  +5% este mes
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">
                  {t('admin.totalProfessionals')}
                </p>
                <p className="text-3xl font-bold text-green-800">
                  {stats?.totalProfessionals || 0}
                </p>
                <p className="text-xs text-green-600 mt-1">
                  Profesionales activos
                </p>
              </div>
              <UserCheck className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700">
                  Total de Reservas
                </p>
                <p className="text-3xl font-bold text-purple-800">
                  {stats?.totalBookings || 0}
                </p>
                <p className="text-xs text-purple-600 mt-1">
                  {stats?.monthlyBookings || 0} este mes
                </p>
              </div>
              <Calendar className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-700">
                  {t('admin.totalRevenue')}
                </p>
                <p className="text-3xl font-bold text-yellow-800">
                  {formatCurrency(stats?.totalRevenue || 0, language)}
                </p>
                <p className="text-xs text-yellow-600 mt-1">
                  Comisión: {formatCurrency(stats?.platformFee || 0, language)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Approvals Alert */}
      {stats?.pendingApprovals && stats.pendingApprovals > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-6 w-6 text-orange-600" />
                <div>
                  <h3 className="font-semibold text-orange-800">
                    {t('admin.pendingApprovals')}
                  </h3>
                  <p className="text-sm text-orange-700">
                    {stats.pendingApprovals} profesionales esperan aprobación
                  </p>
                </div>
              </div>
              <Button asChild>
                <Link href="/admin/users?filter=pending">
                  Revisar Ahora
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Button size="lg" asChild className="h-16 text-lg">
          <Link href="/admin/users">
            <Users className="mr-2 h-6 w-6" />
            Gestionar Usuarios
          </Link>
        </Button>
        <Button size="lg" variant="outline" asChild className="h-16 text-lg">
          <Link href="/admin/services">
            <BarChart3 className="mr-2 h-6 w-6" />
            Gestionar Servicios
          </Link>
        </Button>
        <Button size="lg" variant="outline" asChild className="h-16 text-lg">
          <Link href="/admin/reports">
            <TrendingUp className="mr-2 h-6 w-6" />
            Ver Reportes
          </Link>
        </Button>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
          </CardHeader>
          <CardContent>
            {stats?.recentActivities?.length ? (
              <div className="space-y-4">
                {stats.recentActivities.slice(0, 5).map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">{activity.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(activity.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No hay actividad reciente</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('admin.platformStats')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Usuarios Activos</span>
              <span className="font-semibold">{stats?.totalUsers || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Profesionales Aprobados</span>
              <span className="font-semibold">
                {(stats?.totalProfessionals || 0) - (stats?.pendingApprovals || 0)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Reservas Este Mes</span>
              <span className="font-semibold">{stats?.monthlyBookings || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Comisión Total (20%)</span>
              <span className="font-semibold text-primary">
                {formatCurrency(stats?.platformFee || 0, language)}
              </span>
            </div>
            <Button variant="outline" className="w-full mt-4" asChild>
              <Link href="/admin/reports">
                Ver Reporte Completo
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
