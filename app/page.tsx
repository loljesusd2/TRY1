

import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { ClientHomepage } from '@/components/pages/client-homepage';
import { ProfessionalHomepage } from '@/components/pages/professional-homepage';
import { AdminHomepage } from '@/components/pages/admin-homepage';
import { PublicHomepage } from '@/components/pages/public-homepage';

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <PublicHomepage />;
  }

  // Check if professional is approved
  if (session.user.role === 'PROFESSIONAL' && !session.user.isApproved) {
    redirect('/pending-approval');
  }

  switch (session.user.role) {
    case 'CLIENT':
      return <ClientHomepage />;
    case 'PROFESSIONAL':
      return <ProfessionalHomepage />;
    case 'ADMIN':
      return <AdminHomepage />;
    default:
      return <PublicHomepage />;
  }
}
