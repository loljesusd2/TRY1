

import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, CheckCircle, Mail } from 'lucide-react';
import Link from 'next/link';

export default async function PendingApprovalPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/login');
  }

  if (session.user.role !== 'PROFESSIONAL') {
    redirect('/');
  }

  if (session.user.isApproved) {
    redirect('/');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/10 p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center space-y-4">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto">
            <Clock className="h-8 w-8 text-yellow-600" />
          </div>
          <CardTitle className="text-2xl font-heading">
            Cuenta en Revisión
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-center">
          <p className="text-muted-foreground">
            ¡Gracias por unirte a BeautyGO como profesional! Tu cuenta está siendo revisada por nuestro equipo de administración.
          </p>
          
          <div className="space-y-4 text-left">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium">Registro completado</h4>
                <p className="text-sm text-muted-foreground">
                  Tu información ha sido recibida exitosamente
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium">En proceso de verificación</h4>
                <p className="text-sm text-muted-foreground">
                  Nuestro equipo está revisando tu perfil profesional
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium">Notificación por email</h4>
                <p className="text-sm text-muted-foreground">
                  Te contactaremos una vez completada la revisión
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className="font-medium mb-2">¿Qué sigue?</h4>
            <p className="text-sm text-muted-foreground">
              El proceso de aprobación típicamente toma 24-48 horas. Una vez aprobado, podrás:
            </p>
            <ul className="text-sm text-muted-foreground mt-2 space-y-1">
              <li>• Crear y gestionar tus servicios</li>
              <li>• Recibir reservas de clientes</li>
              <li>• Configurar tu horario de disponibilidad</li>
              <li>• Comenzar a generar ingresos</li>
            </ul>
          </div>
          
          <div className="flex flex-col gap-2">
            <Button variant="outline" asChild>
              <Link href="/auth/logout">
                Cerrar Sesión
              </Link>
            </Button>
            <p className="text-xs text-muted-foreground">
              ¿Preguntas? Contáctanos en soporte@beautygo.com
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
