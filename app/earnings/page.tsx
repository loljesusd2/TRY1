'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/navigation/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LoadingSpinner } from '@/components/loading-spinner';
import { 
  DollarSign, 
  TrendingUp, 
  Calendar,
  Download,
  Eye,
  Clock,
  BarChart3
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/i18n';

interface EarningsData {
  totalEarnings: number;
  platformFee: number;
  netEarnings: number;
  bookingsCount: number;
  averageEarning: number;
  monthlyBreakdown: Array<{
    month: string;
    earnings: number;
    bookings: number;
  }>;
  transactions: Array<{
    id: string;
    date: string;
    amount: number;
    platformFee: number;
    professionalEarnings: number;
    service: {
      name: string;
      nameEs: string;
      nameEn: string;
    };
    client: {
      name: string;
    };
  }>;
}

export default function EarningsPage() {
  const { data: session } = useSession();
  const { t, language } = useLanguage();
  const [earningsData, setEarningsData] = useState<EarningsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('all');

  useEffect(() => {
    if (session?.user.role !== 'PROFESSIONAL') {
      return;
    }

    const fetchEarnings = async () => {
      try {
        const response = await fetch(`/api/professional/earnings?period=${selectedPeriod}`);
        if (response.ok) {
          const data = await response.json();
          setEarningsData(data);
        }
      } catch (error) {
        console.error('Error fetching earnings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEarnings();
  }, [session, selectedPeriod]);

  if (session?.user.role !== 'PROFESSIONAL') {
    return (
      <div className="min-h-screen bg-background pb-20">
        <PageHeader title="Access Denied" />
        <div className="container mx-auto p-4">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
            <p className="text-muted-foreground">Only professionals can view this page.</p>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <PageHeader title="Earnings" />
        <div className="container mx-auto p-4">
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner />
          </div>
        </div>
      </div>
    );
  }

  const exportReport = () => {
    // Simple CSV export
    if (!earningsData) return;

    const csvContent = [
      ['Fecha', 'Servicio', 'Cliente', 'Monto Total', 'Comisión Plataforma', 'Ganancias'],
      ...earningsData.transactions.map(transaction => [
        formatDate(new Date(transaction.date), language),
        language === 'es' ? transaction.service.nameEs : transaction.service.nameEn,
        transaction.client.name,
        formatCurrency(transaction.amount, language),
        formatCurrency(transaction.platformFee, language),
        formatCurrency(transaction.professionalEarnings, language)
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `ganancias-beautygo-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <PageHeader 
        title="Earnings"
        actionButton={{
          label: 'Export',
          onClick: exportReport,
          icon: <Download className="h-5 w-5" />
        }}
      />
      
      <div className="container mx-auto p-4 space-y-6">
        {/* Period Filter */}
        <div className="flex items-center justify-center">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-48 bg-white">
              <SelectValue placeholder="Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All time</SelectItem>
              <SelectItem value="thisMonth">This month</SelectItem>
              <SelectItem value="lastMonth">Last month</SelectItem>
              <SelectItem value="last3Months">Last 3 months</SelectItem>
              <SelectItem value="thisYear">This year</SelectItem>
            </SelectContent>
          </Select>
        </div>

      {/* Stats Cards */}
      {earningsData && (
        <>
          {/* Stats Cards - MVP Style */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="bg-white shadow-soft card-hover">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Total Earnings
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {formatCurrency(earningsData.totalEarnings, language)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Avg: {formatCurrency(earningsData.averageEarning, language)} per service
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
                      Platform Fee
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {formatCurrency(earningsData.platformFee, language)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      20% commission
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-soft card-hover">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Net Earnings
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {formatCurrency(earningsData.netEarnings, language)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {earningsData.bookingsCount} services completed
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <BarChart3 className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Monthly Breakdown - MVP Style */}
          {earningsData.monthlyBreakdown.length > 0 && (
            <Card className="bg-white shadow-soft">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Monthly Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {earningsData.monthlyBreakdown.map((month, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div>
                        <h4 className="font-medium text-foreground">{month.month}</h4>
                        <p className="text-sm text-muted-foreground">
                          {month.bookings} service{month.bookings !== 1 ? 's' : ''}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary">
                          {formatCurrency(month.earnings, language)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Avg: {formatCurrency(month.bookings > 0 ? month.earnings / month.bookings : 0, language)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Transaction History - MVP Style */}
          <Card className="bg-white shadow-soft">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Clock className="h-5 w-5 text-primary" />
                Transaction History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {earningsData.transactions.length > 0 ? (
                <div className="space-y-3">
                  {earningsData.transactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="space-y-1">
                        <h4 className="font-medium text-foreground">
                          {language === 'es' ? transaction.service.nameEs : transaction.service.nameEn}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Client: {transaction.client.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(new Date(transaction.date), language)}
                        </p>
                      </div>
                      <div className="text-right space-y-1">
                        <p className="font-bold text-primary">
                          {formatCurrency(transaction.professionalEarnings, language)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Total: {formatCurrency(transaction.amount, language)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Fee: {formatCurrency(transaction.platformFee, language)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Eye className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="font-medium text-foreground mb-2">No transactions</h3>
                  <p className="text-sm">
                    No transactions found for this period
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
      </div>
    </div>
  );
}
