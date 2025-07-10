
export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const search = searchParams.get('search');
    const city = searchParams.get('city');
    const limit = searchParams.get('limit');
    const recommended = searchParams.get('recommended');

    const where: any = {
      isActive: true,
      professional: {
        isApproved: true,
        role: 'PROFESSIONAL'
      }
    };

    if (category && category !== 'all') {
      where.category = category;
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    if (search) {
      where.OR = [
        { nameEs: { contains: search, mode: 'insensitive' } },
        { nameEn: { contains: search, mode: 'insensitive' } },
        { professional: { name: { contains: search, mode: 'insensitive' } } }
      ];
    }

    if (city) {
      where.professional.city = { contains: city, mode: 'insensitive' };
    }

    const services = await prisma.service.findMany({
      where,
      include: {
        professional: {
          select: {
            id: true,
            name: true,
            rating: true,
            totalReviews: true,
            city: true,
            state: true,
            image: true
          }
        },
        serviceCategory: {
          select: {
            id: true,
            name: true,
            nameEs: true,
            nameEn: true,
            icon: true
          }
        },
        _count: {
          select: {
            reviews: true
          }
        }
      },
      orderBy: recommended === 'true' 
        ? [
            { professional: { rating: 'desc' } },
            { professional: { totalReviews: 'desc' } }
          ]
        : [
            { createdAt: 'desc' }
          ],
      take: limit ? parseInt(limit) : undefined
    });

    return NextResponse.json({
      services: services.map(service => ({
        ...service,
        professional: {
          ...service.professional,
          totalReviews: service._count.reviews
        }
      }))
    });

  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json(
      { message: 'Error al obtener servicios' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user.role !== 'PROFESSIONAL' && session.user.role !== 'ADMIN')) {
      return NextResponse.json(
        { message: 'No autorizado' },
        { status: 401 }
      );
    }

    if (session.user.role === 'PROFESSIONAL' && !session.user.isApproved) {
      return NextResponse.json(
        { message: 'Cuenta no aprobada' },
        { status: 403 }
      );
    }

    const {
      name,
      nameEs,
      nameEn,
      description,
      descriptionEs,
      descriptionEn,
      price,
      duration,
      category,
      categoryId,
      image
    } = await request.json();

    // Validation
    if (!name || !nameEs || !nameEn || !price || !duration || !category || !categoryId) {
      return NextResponse.json(
        { message: 'Todos los campos requeridos deben estar completos' },
        { status: 400 }
      );
    }

    if (price <= 0 || duration <= 0) {
      return NextResponse.json(
        { message: 'El precio y la duración deben ser mayores a 0' },
        { status: 400 }
      );
    }

    // Verify category exists
    const categoryExists = await prisma.category.findUnique({
      where: { id: categoryId }
    });

    if (!categoryExists) {
      return NextResponse.json(
        { message: 'Categoría no válida' },
        { status: 400 }
      );
    }

    const service = await prisma.service.create({
      data: {
        name,
        nameEs,
        nameEn,
        description,
        descriptionEs,
        descriptionEn,
        price: parseFloat(price),
        duration: parseInt(duration),
        category,
        categoryId,
        image,
        professionalId: session.user.id,
        isActive: true
      },
      include: {
        professional: {
          select: {
            id: true,
            name: true,
            rating: true,
            totalReviews: true,
            city: true,
            state: true
          }
        },
        serviceCategory: true
      }
    });

    return NextResponse.json({
      message: 'Servicio creado exitosamente',
      service
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating service:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
