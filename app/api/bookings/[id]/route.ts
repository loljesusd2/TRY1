
export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { message: 'No autorizado' },
        { status: 401 }
      );
    }

    const booking = await prisma.booking.findUnique({
      where: { id: params.id },
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
            description: true,
            descriptionEs: true,
            descriptionEn: true,
            price: true,
            duration: true,
            category: true
          }
        },
        payment: true,
        review: true
      }
    });

    if (!booking) {
      return NextResponse.json(
        { message: 'Reserva no encontrada' },
        { status: 404 }
      );
    }

    // Check permissions
    const canAccess = 
      session.user.role === 'ADMIN' ||
      booking.clientId === session.user.id ||
      booking.professionalId === session.user.id;

    if (!canAccess) {
      return NextResponse.json(
        { message: 'No tienes permiso para ver esta reserva' },
        { status: 403 }
      );
    }

    return NextResponse.json({ booking });

  } catch (error) {
    console.error('Error fetching booking:', error);
    return NextResponse.json(
      { message: 'Error al obtener la reserva' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { message: 'No autorizado' },
        { status: 401 }
      );
    }

    const { status, notes } = await request.json();

    const booking = await prisma.booking.findUnique({
      where: { id: params.id },
      include: {
        service: true
      }
    });

    if (!booking) {
      return NextResponse.json(
        { message: 'Reserva no encontrada' },
        { status: 404 }
      );
    }

    // Check permissions for status changes
    const canUpdateStatus = 
      session.user.role === 'ADMIN' ||
      (session.user.role === 'PROFESSIONAL' && booking.professionalId === session.user.id) ||
      (session.user.role === 'CLIENT' && booking.clientId === session.user.id && status === 'CANCELLED');

    if (status && !canUpdateStatus) {
      return NextResponse.json(
        { message: 'No tienes permiso para cambiar el estado de esta reserva' },
        { status: 403 }
      );
    }

    // Validate status transitions
    if (status) {
      const validTransitions: Record<string, string[]> = {
        'PENDING': ['CONFIRMED', 'CANCELLED'],
        'CONFIRMED': ['IN_PROGRESS', 'CANCELLED'],
        'IN_PROGRESS': ['COMPLETED', 'CANCELLED'],
        'COMPLETED': [], // Cannot change from completed
        'CANCELLED': [] // Cannot change from cancelled
      };

      if (!validTransitions[booking.status]?.includes(status)) {
        return NextResponse.json(
          { message: 'Transición de estado no válida' },
          { status: 400 }
        );
      }
    }

    const updateData: any = {};
    if (status) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;

    const updatedBooking = await prisma.booking.update({
      where: { id: params.id },
      data: updateData,
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

    // If marking as completed, create payment record
    if (status === 'COMPLETED') {
      const existingPayment = await prisma.payment.findUnique({
        where: { bookingId: booking.id }
      });
      
      if (!existingPayment) {
        await prisma.payment.create({
          data: {
            bookingId: booking.id,
            clientId: booking.clientId,
            amount: booking.totalAmount,
            platformFee: booking.platformFee,
            professionalEarnings: booking.professionalEarnings,
            method: 'CASH',
            status: 'COMPLETED'
          }
        });
      }
    }

    return NextResponse.json({
      message: 'Reserva actualizada exitosamente',
      booking: updatedBooking
    });

  } catch (error) {
    console.error('Error updating booking:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { message: 'No autorizado' },
        { status: 401 }
      );
    }

    const booking = await prisma.booking.findUnique({
      where: { id: params.id }
    });

    if (!booking) {
      return NextResponse.json(
        { message: 'Reserva no encontrada' },
        { status: 404 }
      );
    }

    // Only admin or the client can delete bookings
    const canDelete = 
      session.user.role === 'ADMIN' ||
      (session.user.role === 'CLIENT' && booking.clientId === session.user.id);

    if (!canDelete) {
      return NextResponse.json(
        { message: 'No tienes permiso para eliminar esta reserva' },
        { status: 403 }
      );
    }

    // Can only delete pending or cancelled bookings
    if (!['PENDING', 'CANCELLED'].includes(booking.status)) {
      return NextResponse.json(
        { message: 'Solo se pueden eliminar reservas pendientes o canceladas' },
        { status: 400 }
      );
    }

    await prisma.booking.delete({
      where: { id: params.id }
    });

    return NextResponse.json({
      message: 'Reserva eliminada exitosamente'
    });

  } catch (error) {
    console.error('Error deleting booking:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
