
'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useLanguage } from '../language-provider';
import { PageHeader } from '../navigation/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { 
  Calendar, 
  DollarSign, 
  Star,
  Users,
  Clock,
  TrendingUp,
  ArrowRight,
  User,
  Plus,
  BarChart3
} from 'lucide-react';
import { formatCurrency } from '@/lib/i18n';

interface DashboardStats {
  monthlyEarnings: number;
  pendingBookings: number;
  averageRating: number;
  totalBookings: number;
  completedBookings: number;
  upcomingBookings: Array<{
    id: string;
    date: string;
    time: string;
    service: { name: string; nameEs: string };
    client: { name: string };
    status: string;
  }>;
}

export function ProfessionalHomepage() {
  const { data: session } = useSession();
  const { t, language } = useLanguage();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/professional/dashboard');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
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
          <div className="grid gap-6 md:grid-cols-3">
            <div className="h-32 bg-muted rounded"></div>
            <div className="h-32 bg-muted rounded"></div>
            <div className="h-32 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <PageHeader 
        title={`Welcome, ${session?.user.name?.split(' ')[0] || 'Professional'}`}
        showBackButton={false}
        actionButton={{
          label: 'Add Service',
          onClick: () => window.location.href = '/services/create',
          icon: <Plus className="h-5 w-5" />
        }}
      />
      
      <div className="container mx-auto p-4 space-y-6">

        {/* Stats Cards - MVP Style */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="bg-white shadow-soft card-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Monthly Earnings
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {formatCurrency(stats?.monthlyEarnings || 0, language)}
                  </p>
                  <p className="text-xs text-success mt-1">
                    +12% vs last month
                  </p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-soft card-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Pending Bookings
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {stats?.pendingBookings || 0}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Need confirmation
                  </p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-soft card-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Average Rating
                  </p>
                  <div className="flex items-center gap-2">
                    <p className="text-2xl font-bold text-foreground">
                      {stats?.averageRating?.toFixed(1) || '0.0'}
                    </p>
                    <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Based on {stats?.totalBookings || 0} services
                  </p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Star className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions - MVP Style */}
        <div className="grid gap-3 grid-cols-2">
          <Button asChild className="h-14 btn-hover bg-primary text-primary-foreground hover:bg-primary/90">
            <Link href="/earnings" className="flex flex-col items-center gap-1">
              <DollarSign className="h-5 w-5" />
              <span className="text-sm font-medium">Earnings</span>
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-14 border-primary text-primary hover:bg-primary hover:text-primary-foreground">
            <Link href="/bookings" className="flex flex-col items-center gap-1">
              <Calendar className="h-5 w-5" />
              <span className="text-sm font-medium">Bookings</span>
            </Link>
          </Button>
        </div>

        {/* Upcoming Bookings - MVP Style */}
        <Card className="bg-white shadow-soft">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Clock className="h-5 w-5 text-primary" />
                Upcoming Bookings
              </CardTitle>
              <Button variant="ghost" size="sm" asChild className="text-primary hover:bg-primary/10">
                <Link href="/bookings" className="flex items-center gap-1">
                  <span className="text-sm">View All</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {stats?.upcomingBookings?.length ? (
              <div className="space-y-3">
                {stats.upcomingBookings.slice(0, 3).map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="space-y-1">
                      <h4 className="font-medium text-foreground">
                        {language === 'es' ? booking.service.nameEs : booking.service.name}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Client: {booking.client.name}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{new Date(booking.date).toLocaleDateString()}</span>
                        <span>{booking.time}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        booking.status === 'CONFIRMED' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-orange-100 text-orange-700'
                      }`}>
                        {booking.status === 'CONFIRMED' ? 'Confirmed' : 'Pending'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="font-medium text-foreground mb-2">No upcoming bookings</h3>
                <p className="text-sm">
                  New reservations will appear here
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Performance Overview - MVP Style */}
        <Card className="bg-white shadow-soft">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <BarChart3 className="h-5 w-5 text-primary" />
              Monthly Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">{stats?.completedBookings || 0}</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">{stats?.totalBookings || 0}</p>
                <p className="text-sm text-muted-foreground">Total Bookings</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">
                  {stats?.totalBookings ? Math.round((stats.completedBookings / stats.totalBookings) * 100) : 0}%
                </p>
                <p className="text-sm text-muted-foreground">Success Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Links - MVP Style */}
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" asChild className="h-12 border-gray-200 hover:border-primary hover:text-primary">
            <Link href="/profile/edit" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="text-sm">Edit Profile</span>
            </Link>
          </Button>
          <Button variant="outline" asChild className="h-12 border-gray-200 hover:border-primary hover:text-primary">
            <Link href="/services" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="text-sm">My Services</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
