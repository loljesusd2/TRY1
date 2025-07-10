
export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'No autorizado' },
        { status: 401 }
      );
    }

    // Get current month start and end
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // Total users
    const totalUsers = await prisma.user.count({
      where: {
        role: {
          in: ['CLIENT', 'PROFESSIONAL']
        }
      }
    });

    // Total professionals (approved)
    const totalProfessionals = await prisma.user.count({
      where: {
        role: 'PROFESSIONAL',
        isApproved: true
      }
    });

    // Pending approvals
    const pendingApprovals = await prisma.user.count({
      where: {
        role: 'PROFESSIONAL',
        isApproved: false
      }
    });

    // Total bookings
    const totalBookings = await prisma.booking.count();

    // Bookings this month
    const monthlyBookings = await prisma.booking.count({
      where: {
        createdAt: {
          gte: startOfMonth,
          lte: endOfMonth
        }
      }
    });

    // Total revenue and platform fee
    const completedPayments = await prisma.payment.findMany({
      where: {
        status: 'COMPLETED'
      }
    });

    const totalRevenue = completedPayments.reduce((sum, payment) => sum + payment.amount, 0);
    const platformFee = completedPayments.reduce((sum, payment) => sum + payment.platformFee, 0);

    // Recent activities (simplified)
    const recentActivities = [
      {
        id: '1',
        type: 'booking',
        description: 'Nueva reserva creada',
        timestamp: new Date().toISOString()
      },
      {
        id: '2',
        type: 'user',
        description: 'Nuevo profesional registrado',
        timestamp: new Date(Date.now() - 60000).toISOString()
      },
      {
        id: '3',
        type: 'payment',
        description: 'Pago completado',
        timestamp: new Date(Date.now() - 120000).toISOString()
      }
    ];

    return NextResponse.json({
      totalUsers,
      totalProfessionals,
      totalBookings,
      totalRevenue,
      pendingApprovals,
      monthlyBookings,
      platformFee,
      recentActivities
    });

  } catch (error) {
    console.error('Error fetching admin dashboard:', error);
    return NextResponse.json(
      { message: 'Error al obtener datos del dashboard' },
      { status: 500 }
    );
  }
}
