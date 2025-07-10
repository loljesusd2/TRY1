
export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'PROFESSIONAL') {
      return NextResponse.json(
        { message: 'No autorizado' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'all';

    const professionalId = session.user.id;

    // Calculate date range based on period
    let dateFilter: any = {};
    const now = new Date();

    switch (period) {
      case 'thisMonth':
        dateFilter = {
          gte: new Date(now.getFullYear(), now.getMonth(), 1),
          lte: new Date(now.getFullYear(), now.getMonth() + 1, 0)
        };
        break;
      case 'lastMonth':
        dateFilter = {
          gte: new Date(now.getFullYear(), now.getMonth() - 1, 1),
          lte: new Date(now.getFullYear(), now.getMonth(), 0)
        };
        break;
      case 'last3Months':
        dateFilter = {
          gte: new Date(now.getFullYear(), now.getMonth() - 3, 1),
          lte: now
        };
        break;
      case 'thisYear':
        dateFilter = {
          gte: new Date(now.getFullYear(), 0, 1),
          lte: new Date(now.getFullYear(), 11, 31)
        };
        break;
      default:
        // 'all' - no date filter
        break;
    }

    const whereClause: any = {
      booking: {
        professionalId: professionalId,
        status: 'COMPLETED'
      },
      status: 'COMPLETED'
    };

    if (Object.keys(dateFilter).length > 0) {
      whereClause.createdAt = dateFilter;
    }

    // Get all completed payments
    const payments = await prisma.payment.findMany({
      where: whereClause,
      include: {
        booking: {
          include: {
            service: {
              select: {
                id: true,
                name: true,
                nameEs: true,
                nameEn: true
              }
            },
            client: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Calculate totals
    const totalEarnings = payments.reduce((sum, payment) => sum + payment.amount, 0);
    const platformFee = payments.reduce((sum, payment) => sum + payment.platformFee, 0);
    const netEarnings = payments.reduce((sum, payment) => sum + payment.professionalEarnings, 0);
    const bookingsCount = payments.length;
    const averageEarning = bookingsCount > 0 ? netEarnings / bookingsCount : 0;

    // Monthly breakdown
    const monthlyMap = new Map<string, { earnings: number; bookings: number }>();
    
    payments.forEach(payment => {
      const date = new Date(payment.createdAt);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthName = date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long' });
      
      if (!monthlyMap.has(monthKey)) {
        monthlyMap.set(monthKey, { earnings: 0, bookings: 0 });
      }
      
      const monthData = monthlyMap.get(monthKey)!;
      monthData.earnings += payment.professionalEarnings;
      monthData.bookings += 1;
    });

    const monthlyBreakdown = Array.from(monthlyMap.entries()).map(([key, data]) => ({
      month: new Date(key + '-01').toLocaleDateString('es-ES', { year: 'numeric', month: 'long' }),
      earnings: data.earnings,
      bookings: data.bookings
    })).sort((a, b) => b.month.localeCompare(a.month));

    // Transaction history
    const transactions = payments.map(payment => ({
      id: payment.id,
      date: payment.createdAt,
      amount: payment.amount,
      platformFee: payment.platformFee,
      professionalEarnings: payment.professionalEarnings,
      service: payment.booking.service,
      client: payment.booking.client
    }));

    return NextResponse.json({
      totalEarnings,
      platformFee,
      netEarnings,
      bookingsCount,
      averageEarning,
      monthlyBreakdown,
      transactions
    });

  } catch (error) {
    console.error('Error fetching earnings:', error);
    return NextResponse.json(
      { message: 'Error al obtener ganancias' },
      { status: 500 }
    );
  }
}
