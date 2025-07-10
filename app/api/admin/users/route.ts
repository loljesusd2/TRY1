
export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'No autorizado' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const filter = searchParams.get('filter');
    const role = searchParams.get('role');
    const limit = searchParams.get('limit');
    const page = searchParams.get('page') || '1';

    const where: any = {};

    if (filter === 'pending') {
      where.role = 'PROFESSIONAL';
      where.isApproved = false;
    } else if (filter === 'approved') {
      where.role = 'PROFESSIONAL';
      where.isApproved = true;
    }

    if (role && role !== 'all') {
      where.role = role;
    }

    const pageSize = limit ? parseInt(limit) : 20;
    const skip = (parseInt(page) - 1) * pageSize;

    const [users, totalCount] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          isApproved: true,
          bio: true,
          specialties: true,
          city: true,
          state: true,
          rating: true,
          totalReviews: true,
          image: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              servicesOffered: true,
              bookingsAsClient: true,
              bookingsAsProfessional: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: pageSize
      }),
      prisma.user.count({ where })
    ]);

    return NextResponse.json({
      users,
      pagination: {
        total: totalCount,
        page: parseInt(page),
        pageSize,
        totalPages: Math.ceil(totalCount / pageSize)
      }
    });

  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { message: 'Error al obtener usuarios' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'No autorizado' },
        { status: 401 }
      );
    }

    const {
      name,
      email,
      phone,
      role,
      isApproved,
      bio,
      specialties,
      city,
      state
    } = await request.json();

    // Validation
    if (!name || !email || !role) {
      return NextResponse.json(
        { message: 'Nombre, email y rol son requeridos' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'Ya existe un usuario con este email' },
        { status: 400 }
      );
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: 'temp-password', // This should be handled properly in a real app
        phone: phone || null,
        role,
        isApproved: role === 'CLIENT' ? true : (isApproved || false),
        bio: bio || null,
        specialties: specialties || [],
        city: city || null,
        state: state || null
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        isApproved: true,
        bio: true,
        specialties: true,
        city: true,
        state: true,
        createdAt: true
      }
    });

    return NextResponse.json({
      message: 'Usuario creado exitosamente',
      user
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
