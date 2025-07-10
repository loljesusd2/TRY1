
export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { calculateEarnings } from '@/lib/utils';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { message: 'No autorizado' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = searchParams.get('limit');
    const professionalId = searchParams.get('professionalId');

    const where: any = {};

    // Role-based filtering
    if (session.user.role === 'CLIENT') {
      where.clientId = session.user.id;
    } else if (session.user.role === 'PROFESSIONAL') {
      where.professionalId = session.user.id;
    }
    // ADMIN can see all bookings

    if (status && status !== 'all') {
      if (status.includes(',')) {
        where.status = { in: status.split(',') };
      } else {
        where.status = status;
      }
    }

    if (professionalId && session.user.role === 'ADMIN') {
      where.professionalId = professionalId;
    }

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            image: true
          }
        },
        professional: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            rating: true,
            image: true
          }
        },
        service: {
          select: {
            id: true,
            name: true,
            nameEs: true,
            nameEn: true,
            price: true,
            duration: true,
            category: true
          }
        },
        payment: true,
        review: true
      },
      orderBy: [
        { date: 'asc' },
        { time: 'asc' }
      ],
      take: limit ? parseInt(limit) : undefined
    });

    return NextResponse.json({ bookings });

  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { message: 'Error al obtener reservas' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'CLIENT') {
      return NextResponse.json(
        { message: 'Solo los clientes pueden crear reservas' },
        { status: 401 }
      );
    }

    const {
      serviceId,
      professionalId,
      date,
      time,
      address,
      city,
      state,
      zipCode,
      notes
    } = await request.json();

    // Validation
    if (!serviceId || !professionalId || !date || !time || !address || !city || !state || !zipCode) {
      return NextResponse.json(
        { message: 'Todos los campos requeridos deben estar completos' },
        { status: 400 }
      );
    }

    // Verify service exists and belongs to professional
    const service = await prisma.service.findFirst({
      where: {
        id: serviceId,
        professionalId,
        isActive: true
      }
    });

    if (!service) {
      return NextResponse.json(
        { message: 'Servicio no encontrado o no disponible' },
        { status: 404 }
      );
    }

    // Verify professional is approved
    const professional = await prisma.user.findFirst({
      where: {
        id: professionalId,
        role: 'PROFESSIONAL',
        isApproved: true
      }
    });

    if (!professional) {
      return NextResponse.json(
        { message: 'Profesional no disponible' },
        { status: 404 }
      );
    }

    // Check for time conflicts
    const bookingDate = new Date(date);
    const existingBooking = await prisma.booking.findFirst({
      where: {
        professionalId,
        date: bookingDate,
        time,
        status: {
          in: ['PENDING', 'CONFIRMED', 'IN_PROGRESS']
        }
      }
    });

    if (existingBooking) {
      return NextResponse.json(
        { message: 'Este horario ya está ocupado' },
        { status: 409 }
      );
    }

    // Calculate pricing (20% platform fee)
    const earnings = calculateEarnings(service.price, 20);

    const booking = await prisma.booking.create({
      data: {
        clientId: session.user.id,
        professionalId,
        serviceId,
        date: bookingDate,
        time,
        address,
        city,
        state,
        zipCode,
        notes: notes || null,
        totalAmount: earnings.totalAmount,
        platformFee: earnings.platformFee,
        professionalEarnings: earnings.professionalEarnings,
        status: 'PENDING'
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        },
        professional: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            rating: true
          }
        },
        service: {
          select: {
            id: true,
            name: true,
            nameEs: true,
            nameEn: true,
            price: true,
            duration: true,
            category: true
          }
        }
      }
    });

    return NextResponse.json({
      message: 'Reserva creada exitosamente',
      booking
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
