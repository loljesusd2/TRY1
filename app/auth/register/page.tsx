

import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { RegisterForm } from '@/components/auth/register-form';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';

export default async function RegisterPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect('/');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/10 p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center space-x-2">
            <Sparkles className="h-10 w-10 text-primary" />
            <span className="font-heading text-3xl font-bold text-primary">
              BeautyGO
            </span>
          </Link>
          <p className="mt-2 text-muted-foreground">
            Únete a la comunidad de belleza más grande de Orlando
          </p>
        </div>

        {/* Register Form */}
        <RegisterForm />
      </div>
    </div>
  );
}
