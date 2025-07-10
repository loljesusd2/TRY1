
export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        name: 'asc'
      },
      include: {
        _count: {
          select: {
            services: true
          }
        }
      }
    });

    return NextResponse.json({ categories });

  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { message: 'Error al obtener categorías' },
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
      nameEs,
      nameEn,
      description,
      icon,
      category
    } = await request.json();

    // Validation
    if (!name || !nameEs || !nameEn || !category) {
      return NextResponse.json(
        { message: 'Todos los campos requeridos deben estar completos' },
        { status: 400 }
      );
    }

    // Check if category already exists
    const existingCategory = await prisma.category.findFirst({
      where: {
        OR: [
          { name },
          { category }
        ]
      }
    });

    if (existingCategory) {
      return NextResponse.json(
        { message: 'Ya existe una categoría con este nombre' },
        { status: 400 }
      );
    }

    const newCategory = await prisma.category.create({
      data: {
        name,
        nameEs,
        nameEn,
        description: description || null,
        icon: icon || null,
        category
      }
    });

    return NextResponse.json({
      message: 'Categoría creada exitosamente',
      category: newCategory
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
