

import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { ProfessionalHomepage } from '@/components/pages/professional-homepage';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/login');
  }

  // Only professionals and admins can access dashboard
  if (session.user.role === 'CLIENT') {
    redirect('/');
  }

  // Redirect to appropriate dashboard based on role
  if (session.user.role === 'ADMIN') {
    redirect('/admin');
  }

  // Show professional dashboard
  return <ProfessionalHomepage />;
}
