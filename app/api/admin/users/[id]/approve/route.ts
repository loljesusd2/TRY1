
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

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'No autorizado' },
        { status: 401 }
      );
    }

    const { approved } = await request.json();

    if (typeof approved !== 'boolean') {
      return NextResponse.json(
        { message: 'El valor de aprobación debe ser booleano' },
        { status: 400 }
      );
    }

    // Get the user to verify it's a professional
    const user = await prisma.user.findUnique({
      where: { id: params.id }
    });

    if (!user) {
      return NextResponse.json(
        { message: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    if (user.role !== 'PROFESSIONAL') {
      return NextResponse.json(
        { message: 'Solo los profesionales requieren aprobación' },
        { status: 400 }
      );
    }

    // Update approval status
    const updatedUser = await prisma.user.update({
      where: { id: params.id },
      data: { isApproved: approved },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isApproved: true
      }
    });

    // If rejecting, you might want to send an email notification
    // If approving, you might want to send a welcome email

    return NextResponse.json({
      message: approved 
        ? 'Profesional aprobado exitosamente' 
        : 'Profesional rechazado',
      user: updatedUser
    });

  } catch (error) {
    console.error('Error updating user approval:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
