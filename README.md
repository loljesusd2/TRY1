
# BeautyGO - Servicios de Belleza a Domicilio

BeautyGO es una plataforma completa de servicios de belleza a domicilio diseñada específicamente para el mercado de Orlando, FL. La aplicación conecta clientes con profesionales de belleza certificados, ofreciendo una experiencia conveniente y de alta calidad.

## 🌟 Características Principales

### Sistema de Usuarios Multi-Rol
- **Clientes**: Buscar, reservar y calificar servicios de belleza
- **Profesionales**: Gestionar servicios, horarios y ganancias
- **Administradores**: Supervisar la plataforma y aprobar profesionales

### Servicios de Belleza Completos
- Servicios de cabello (cortes, coloración, tratamientos)
- Cuidado de uñas (manicure, pedicure, nail art)
- Cuidado de la piel (faciales, tratamientos)
- Maquillaje profesional
- Diseño y microblading de cejas

### Sistema de Reservas Avanzado
- Reservas en tiempo real con verificación de disponibilidad
- Estados de cita: Pendiente → Confirmada → En Progreso → Completada
- Gestión de cancelaciones y reprogramaciones
- Notificaciones de cambio de estado

### Sistema de Pagos
- **Pagos únicamente en efectivo** (sin integraciones de tarjetas)
- Comisión automática del 20% para la plataforma
- Cálculo dinámico de ganancias para profesionales
- Historial detallado de transacciones

### Sistema Bilingüe
- Soporte completo en **Español** (idioma principal) e **Inglés**
- Interfaz de usuario adaptable según preferencia del usuario
- Contenido localizado para el mercado hispano de Orlando

## 🛠 Stack Tecnológico

- **Frontend**: Next.js 14, React 18, TypeScript
- **Backend**: Next.js API Routes
- **Base de Datos**: PostgreSQL con Prisma ORM
- **Autenticación**: NextAuth.js con JWT
- **Estilos**: Tailwind CSS con sistema de diseño personalizado
- **UI Components**: Radix UI primitives
- **Animaciones**: Framer Motion
- **Notificaciones**: React Hot Toast

## 🎨 Diseño y UX

### Paleta de Colores
- **Colores Principales**: Tonos tierra (marrones, naranjas, beige)
- **Acento**: Naranja cálido (#E88A54)
- **Fondos**: Beige suave (#FDF8F2)
- **Texto**: Marrón oscuro (#4E4239)

### Diseño Mobile-First
- Navegación inferior fija optimizada para móviles
- Interfaces responsive que se adaptan a cualquier dispositivo
- Experiencia de usuario fluida en todas las pantallas

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js 18 o superior
- PostgreSQL
- Yarn package manager

### Configuración Local

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd beautygo
```

2. **Instalar dependencias**
```bash
cd app
yarn install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env
# Editar .env con tus configuraciones específicas
```

4. **Configurar la base de datos**
```bash
# Ejecutar migraciones de Prisma
npx prisma generate
npx prisma db push

# Poblar la base de datos con datos de ejemplo
npx prisma db seed
```

5. **Ejecutar en modo desarrollo**
```bash
yarn dev
```

La aplicación estará disponible en `http://localhost:3000`

## 🔑 Cuentas Demo

El sistema incluye cuentas de demostración pre-configuradas:

- **Cliente**: maria@client.com / password123
- **Profesional**: sofia@professional.com / password123
- **Admin**: admin@beautygo.com / admin123

## 📱 Funcionalidades por Rol

### Cliente
- Explorar servicios disponibles con filtros avanzados
- Reservar citas con profesionales verificados
- Gestionar citas (ver, cancelar)
- Dejar reseñas y calificaciones
- Editar perfil personal

### Profesional
- Dashboard con estadísticas de ganancias y citas
- Gestionar estado de citas (confirmar, iniciar, completar)
- Ver ganancias detalladas con desglose mensual
- Configurar horarios de disponibilidad
- Gestionar servicios ofrecidos
- Editar perfil profesional

### Administrador
- Panel de control con estadísticas de plataforma
- Aprobar/rechazar profesionales pendientes
- Gestionar usuarios y servicios
- Ver reportes de ingresos y actividad
- Configuración general de la plataforma

## 🌐 Deployment en Netlify

### Configuración Automática
La aplicación incluye configuración optimizada para Netlify:

1. **Build Settings**
   - Build command: `yarn build`
   - Publish directory: `.next`

2. **Variables de Entorno Requeridas**
   - `DATABASE_URL`: URL de conexión a PostgreSQL
   - `NEXTAUTH_URL`: URL de tu aplicación
   - `NEXTAUTH_SECRET`: Clave secreta para NextAuth

### Proceso de Deploy

1. Conectar repositorio a Netlify
2. Configurar variables de entorno
3. Deploy automático en cada push

## 🔐 Seguridad

- Autenticación JWT con NextAuth.js
- Middleware de autorización basado en roles
- Validación de datos en frontend y backend
- Protección de rutas sensibles
- Sanitización de entrada de usuarios

## 🎯 Características Específicas de Orlando

- Localización específica para Orlando, FL
- Soporte prioritario en español para la comunidad hispana
- Precios optimizados para el mercado local
- Servicios adaptados a las preferencias culturales

## 📊 Sistema de Comisiones

- **Comisión fija**: 20% por transacción
- **Cálculo automático**: El sistema calcula automáticamente las ganancias del profesional
- **Transparencia total**: Profesionales ven desglose completo de ganancias
- **Reportes detallados**: Historial completo de transacciones

## 🔄 Estados de Citas

1. **PENDING**: Cita solicitada, esperando confirmación del profesional
2. **CONFIRMED**: Profesional confirmó la cita
3. **IN_PROGRESS**: Servicio en progreso
4. **COMPLETED**: Servicio completado, pago procesado
5. **CANCELLED**: Cita cancelada por cualquier parte

## 📈 Analytics y Reportes

- Dashboard administrativo con métricas clave
- Reportes de ganancias para profesionales
- Estadísticas de uso de la plataforma
- Análisis de tendencias de servicios

## 🛡 Manejo de Errores

- Logging centralizado de errores
- Notificaciones de usuario amigables
- Manejo graceful de errores de red
- Fallbacks para funcionalidades críticas

## 🎨 Personalización

- Sistema de temas (claro/oscuro)
- Configuración de idioma persistente
- Preferencias de usuario guardadas localmente
- Experiencia personalizada por rol

## 📞 Soporte

Para soporte técnico o preguntas sobre la plataforma:
- Email: soporte@beautygo.com
- Documentación: [Link a documentación]

## 📄 Licencia

Este proyecto está bajo la licencia [especificar licencia].

---

**BeautyGO** - Tu belleza, a tu manera. En casa. 💄✨
