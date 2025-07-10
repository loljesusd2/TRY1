
export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'PROFESSIONAL') {
      return NextResponse.json(
        { message: 'No autorizado' },
        { status: 401 }
      );
    }

    const professionalId = session.user.id;

    // Get current month start and end
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // Monthly earnings
    const monthlyPayments = await prisma.payment.findMany({
      where: {
        booking: {
          professionalId: professionalId,
          status: 'COMPLETED'
        },
        createdAt: {
          gte: startOfMonth,
          lte: endOfMonth
        }
      }
    });

    const monthlyEarnings = monthlyPayments.reduce((sum, payment) => sum + payment.professionalEarnings, 0);

    // Pending bookings count
    const pendingBookings = await prisma.booking.count({
      where: {
        professionalId: professionalId,
        status: 'PENDING'
      }
    });

    // Average rating
    const professional = await prisma.user.findUnique({
      where: { id: professionalId },
      select: { rating: true, totalReviews: true }
    });

    // Total bookings this month
    const totalBookings = await prisma.booking.count({
      where: {
        professionalId: professionalId,
        createdAt: {
          gte: startOfMonth,
          lte: endOfMonth
        }
      }
    });

    // Completed bookings this month
    const completedBookings = await prisma.booking.count({
      where: {
        professionalId: professionalId,
        status: 'COMPLETED',
        createdAt: {
          gte: startOfMonth,
          lte: endOfMonth
        }
      }
    });

    // Upcoming bookings (next 5)
    const upcomingBookings = await prisma.booking.findMany({
      where: {
        professionalId: professionalId,
        status: {
          in: ['PENDING', 'CONFIRMED']
        },
        date: {
          gte: new Date()
        }
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            phone: true
          }
        },
        service: {
          select: {
            id: true,
            name: true,
            nameEs: true,
            nameEn: true
          }
        }
      },
      orderBy: [
        { date: 'asc' },
        { time: 'asc' }
      ],
      take: 5
    });

    return NextResponse.json({
      monthlyEarnings,
      pendingBookings,
      averageRating: professional?.rating || 0,
      totalBookings,
      completedBookings,
      upcomingBookings
    });

  } catch (error) {
    console.error('Error fetching professional dashboard:', error);
    return NextResponse.json(
      { message: 'Error al obtener datos del dashboard' },
      { status: 500 }
    );
  }
}
