
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clean existing data
  await prisma.review.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.availability.deleteMany();
  await prisma.service.deleteMany();
  await prisma.category.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  const hashedPassword = await bcrypt.hash('password123', 12);
  const hashedAdminPassword = await bcrypt.hash('admin123', 12);

  const clientUser = await prisma.user.create({
    data: {
      name: 'María González',
      email: 'maria@client.com',
      password: hashedPassword,
      phone: '(407) 555-0123',
      role: 'CLIENT',
      isApproved: true,
      address: '123 Main St',
      city: 'Orlando',
      state: 'FL',
      zipCode: '32801',
    },
  });

  const professionalUser = await prisma.user.create({
    data: {
      name: 'Sofía Martínez',
      email: 'sofia@professional.com',
      password: hashedPassword,
      phone: '(407) 555-0456',
      role: 'PROFESSIONAL',
      isApproved: true,
      bio: 'Especialista en cabello y maquillaje con 8 años de experiencia. Certificada en colorimetría y técnicas de peinado moderno.',
      specialties: ['Coloración', 'Cortes modernos', 'Maquillaje profesional', 'Peinados para eventos'],
      address: '456 Beauty Ave',
      city: 'Orlando',
      state: 'FL',
      zipCode: '32802',
      rating: 4.8,
      totalReviews: 47,
    },
  });

  const professionalUser2 = await prisma.user.create({
    data: {
      name: 'Isabella Rivera',
      email: 'isabella@professional.com',
      password: hashedPassword,
      phone: '(407) 555-0789',
      role: 'PROFESSIONAL',
      isApproved: true,
      bio: 'Experta en cuidado de uñas y arte nail. Especializada en técnicas de gel, acrílico y nail art creativo.',
      specialties: ['Manicure', 'Pedicure', 'Nail Art', 'Extensiones de uñas'],
      address: '789 Nail St',
      city: 'Orlando',
      state: 'FL',
      zipCode: '32803',
      rating: 4.9,
      totalReviews: 62,
    },
  });

  const adminUser = await prisma.user.create({
    data: {
      name: 'Admin BeautyGO',
      email: 'admin@beautygo.com',
      password: hashedAdminPassword,
      phone: '(407) 555-0001',
      role: 'ADMIN',
      isApproved: true,
      city: 'Orlando',
      state: 'FL',
      zipCode: '32801',
    },
  });

  // Create categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Cabello',
        nameEs: 'Cabello',
        nameEn: 'Hair',
        description: 'Servicios profesionales de cabello',
        icon: '💇‍♀️',
        category: 'HAIR',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Uñas',
        nameEs: 'Uñas',
        nameEn: 'Nails',
        description: 'Cuidado y diseño de uñas',
        icon: '💅',
        category: 'NAILS',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Cuidado de la Piel',
        nameEs: 'Cuidado de la Piel',
        nameEn: 'Skincare',
        description: 'Tratamientos faciales y cuidado de la piel',
        icon: '🧴',
        category: 'SKINCARE',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Maquillaje',
        nameEs: 'Maquillaje',
        nameEn: 'Makeup',
        description: 'Maquillaje profesional para eventos',
        icon: '💄',
        category: 'MAKEUP',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Cejas',
        nameEs: 'Cejas',
        nameEn: 'Eyebrows',
        description: 'Diseño y cuidado de cejas',
        icon: '🧿',
        category: 'EYEBROWS',
      },
    }),
  ]);

  // Create services
  const services = await Promise.all([
    // Hair services by Sofia
    prisma.service.create({
      data: {
        name: 'Corte y Peinado',
        nameEs: 'Corte y Peinado',
        nameEn: 'Hair Cut & Style',
        description: 'Corte personalizado y peinado profesional',
        descriptionEs: 'Corte personalizado según tu tipo de rostro y peinado profesional para cualquier ocasión',
        descriptionEn: 'Personalized cut according to your face type and professional styling for any occasion',
        price: 45,
        duration: 60,
        image: 'https://thumbs.dreamstime.com/z/woman-beauty-salon-professional-hairdresser-makeup-artist-people-illustration-beautiful-girl-haircut-styling-cosmetic-sa-256624423.jpg?w=992',
        category: 'HAIR',
        professionalId: professionalUser.id,
        categoryId: categories[0].id,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Coloración Completa',
        nameEs: 'Coloración Completa',
        nameEn: 'Hair Coloring',
        description: 'Cambio de color completo con productos profesionales',
        descriptionEs: 'Coloración completa del cabello con tintes profesionales de alta calidad',
        descriptionEn: 'Complete hair coloring with high-quality professional dyes',
        price: 85,
        duration: 120,
        image: 'https://i.ytimg.com/vi/6UCUIBDN3g8/maxresdefault.jpg',
        category: 'HAIR',
        professionalId: professionalUser.id,
        categoryId: categories[0].id,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Tratamiento Capilar Profundo',
        nameEs: 'Tratamiento Capilar Profundo',
        nameEn: 'Deep Conditioning',
        description: 'Hidratación intensiva para cabello dañado',
        descriptionEs: 'Tratamiento de hidratación profunda para restaurar la salud del cabello',
        descriptionEn: 'Deep hydration treatment to restore hair health',
        price: 55,
        duration: 90,
        image: 'https://i.ytimg.com/vi/tKCvNxv6SAo/maxresdefault.jpg',
        category: 'HAIR',
        professionalId: professionalUser.id,
        categoryId: categories[0].id,
      },
    }),
    // Nail services by Isabella
    prisma.service.create({
      data: {
        name: 'Manicure Clásica',
        nameEs: 'Manicure Clásica',
        nameEn: 'Manicure',
        description: 'Manicure tradicional con esmaltado',
        descriptionEs: 'Cuidado completo de manos con limado, cutícula y esmaltado profesional',
        descriptionEn: 'Complete hand care with filing, cuticle care and professional polish',
        price: 25,
        duration: 45,
        image: 'https://static.wixstatic.com/media/3a2ad75fe5cb416ba0a5029ee5035521.jpg/v1/fill/w_1920,h_1021,al_c,q_90,usm_0.66_1.00_0.01,enc_auto/3a2ad75fe5cb416ba0a5029ee5035521.jpg',
        category: 'NAILS',
        professionalId: professionalUser2.id,
        categoryId: categories[1].id,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Pedicure Spa',
        nameEs: 'Pedicure Spa',
        nameEn: 'Pedicure',
        description: 'Pedicure relajante con exfoliación',
        descriptionEs: 'Tratamiento completo de pies con exfoliación, hidratación y esmaltado',
        descriptionEn: 'Complete foot treatment with exfoliation, hydration and polish',
        price: 35,
        duration: 60,
        image: 'https://goodspaguide--live.s3.amazonaws.com/pedicures_2023-12-11-163018_uxqw.jpg',
        category: 'NAILS',
        professionalId: professionalUser2.id,
        categoryId: categories[1].id,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Nail Art Personalizado',
        nameEs: 'Nail Art Personalizado',
        nameEn: 'Nail Art',
        description: 'Diseños únicos en tus uñas',
        descriptionEs: 'Diseños artísticos personalizados con técnicas avanzadas de nail art',
        descriptionEn: 'Personalized artistic designs with advanced nail art techniques',
        price: 45,
        duration: 75,
        image: 'https://i.ytimg.com/vi/aZ9JfGupqxM/maxresdefault.jpg',
        category: 'NAILS',
        professionalId: professionalUser2.id,
        categoryId: categories[1].id,
      },
    }),
    // Makeup services by Sofia
    prisma.service.create({
      data: {
        name: 'Maquillaje para Eventos',
        nameEs: 'Maquillaje para Eventos',
        nameEn: 'Makeup Application',
        description: 'Maquillaje profesional para ocasiones especiales',
        descriptionEs: 'Maquillaje profesional duradero para bodas, fiestas y eventos especiales',
        descriptionEn: 'Long-lasting professional makeup for weddings, parties and special events',
        price: 65,
        duration: 45,
        image: 'https://i.ytimg.com/vi/5w_q2PF6O20/maxresdefault.jpg',
        category: 'MAKEUP',
        professionalId: professionalUser.id,
        categoryId: categories[3].id,
      },
    }),
    // Skincare services by Sofia
    prisma.service.create({
      data: {
        name: 'Tratamiento Facial Hidratante',
        nameEs: 'Tratamiento Facial Hidratante',
        nameEn: 'Facial Treatment',
        description: 'Limpieza profunda e hidratación facial',
        descriptionEs: 'Tratamiento facial completo con limpieza profunda, exfoliación e hidratación',
        descriptionEn: 'Complete facial treatment with deep cleansing, exfoliation and hydration',
        price: 75,
        duration: 90,
        image: 'https://www.spamontreal.ca/wp-content/uploads/2020/11/loreal-paris-article-the-standard-facial-steps-you-can-expect-at-the-spa-t.jpg',
        category: 'SKINCARE',
        professionalId: professionalUser.id,
        categoryId: categories[2].id,
      },
    }),
    // Eyebrow services by Isabella
    prisma.service.create({
      data: {
        name: 'Diseño de Cejas',
        nameEs: 'Diseño de Cejas',
        nameEn: 'Eyebrow Threading',
        description: 'Perfilado profesional de cejas',
        descriptionEs: 'Diseño y perfilado profesional de cejas según la forma de tu rostro',
        descriptionEn: 'Professional eyebrow design and shaping according to your face shape',
        price: 20,
        duration: 30,
        image: 'https://i.ytimg.com/vi/66iTDHaSY5Q/maxresdefault.jpg',
        category: 'EYEBROWS',
        professionalId: professionalUser2.id,
        categoryId: categories[4].id,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Microblading',
        nameEs: 'Microblading',
        nameEn: 'Microblading',
        description: 'Técnica de micropigmentación para cejas',
        descriptionEs: 'Micropigmentación semi-permanente para cejas naturales y definidas',
        descriptionEn: 'Semi-permanent micropigmentation for natural and defined eyebrows',
        price: 250,
        duration: 180,
        image: 'https://i.pinimg.com/originals/3a/69/9a/3a699acc041501a2f569f532fc57c12b.jpg',
        category: 'EYEBROWS',
        professionalId: professionalUser2.id,
        categoryId: categories[4].id,
      },
    }),
  ]);

  // Create availability for professionals
  const days = [1, 2, 3, 4, 5]; // Monday to Friday
  const availability = [];

  for (const professional of [professionalUser, professionalUser2]) {
    for (const day of days) {
      availability.push(
        prisma.availability.create({
          data: {
            professionalId: professional.id,
            dayOfWeek: day,
            startTime: '09:00',
            endTime: '17:00',
            isAvailable: true,
          },
        })
      );
    }
  }

  await Promise.all(availability);

  // Create sample bookings
  const bookings = await Promise.all([
    prisma.booking.create({
      data: {
        date: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
        time: '10:00',
        status: 'CONFIRMED',
        totalAmount: 45,
        platformFee: 9,
        professionalEarnings: 36,
        address: '123 Main St',
        city: 'Orlando',
        state: 'FL',
        zipCode: '32801',
        notes: 'Prefiero corte moderno, no muy corto',
        clientId: clientUser.id,
        professionalId: professionalUser.id,
        serviceId: services[0].id,
      },
    }),
    prisma.booking.create({
      data: {
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last week
        time: '14:00',
        status: 'COMPLETED',
        totalAmount: 25,
        platformFee: 5,
        professionalEarnings: 20,
        address: '123 Main St',
        city: 'Orlando',
        state: 'FL',
        zipCode: '32801',
        clientId: clientUser.id,
        professionalId: professionalUser2.id,
        serviceId: services[3].id,
      },
    }),
    prisma.booking.create({
      data: {
        date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // In 3 days
        time: '11:30',
        status: 'PENDING',
        totalAmount: 65,
        platformFee: 13,
        professionalEarnings: 52,
        address: '123 Main St',
        city: 'Orlando',
        state: 'FL',
        zipCode: '32801',
        notes: 'Para evento de cumpleaños',
        clientId: clientUser.id,
        professionalId: professionalUser.id,
        serviceId: services[6].id,
      },
    }),
  ]);

  // Create payments for completed bookings
  await prisma.payment.create({
    data: {
      amount: 25,
      platformFee: 5,
      professionalEarnings: 20,
      method: 'CASH',
      status: 'COMPLETED',
      bookingId: bookings[1].id,
      clientId: clientUser.id,
    },
  });

  // Create reviews for completed bookings
  await prisma.review.create({
    data: {
      rating: 5,
      comment: '¡Excelente servicio! Isabella es muy profesional y el resultado fue perfecto. Definitivamente volveré a reservar.',
      clientId: clientUser.id,
      professionalId: professionalUser2.id,
      serviceId: services[3].id,
      bookingId: bookings[1].id,
    },
  });

  console.log('✅ Database seeded successfully!');
  console.log('\n📋 Demo accounts created:');
  console.log('👤 Client: maria@client.com / password123');
  console.log('💼 Professional: sofia@professional.com / password123');
  console.log('💼 Professional: isabella@professional.com / password123');
  console.log('🔧 Admin: admin@beautygo.com / admin123');
  console.log('\n🎯 Created:');
  console.log(`- ${await prisma.user.count()} users`);
  console.log(`- ${await prisma.category.count()} categories`);
  console.log(`- ${await prisma.service.count()} services`);
  console.log(`- ${await prisma.booking.count()} bookings`);
  console.log(`- ${await prisma.review.count()} reviews`);
  console.log(`- ${await prisma.availability.count()} availability slots`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
