
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useLanguage } from '../language-provider';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  Home, 
  Calendar, 
  User, 
  DollarSign, 
  Briefcase,
  Settings,
  BarChart3
} from 'lucide-react';

export function BottomNav() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return <BottomNavContent />;
}

function BottomNavContent() {
  const { data: session, status } = useSession();
  const { t } = useLanguage();
  const pathname = usePathname();

  if (status === 'loading' || !session) return null;

  const getNavItems = () => {
    switch (session.user.role) {
      case 'CLIENT':
        return [
          { href: '/explore', icon: Home, label: 'Home' },
          { href: '/bookings', icon: Calendar, label: 'Calendar' },
          { href: '/services', icon: Briefcase, label: 'Services' },
          { href: '/profile/edit', icon: User, label: 'Profile' },
        ];
      case 'PROFESSIONAL':
        return [
          { href: '/dashboard', icon: Home, label: 'Home' },
          { href: '/bookings', icon: Calendar, label: 'Calendar' },
          { href: '/services', icon: Briefcase, label: 'Services' },
          { href: '/earnings', icon: DollarSign, label: 'Earnings' },
          { href: '/profile/edit', icon: User, label: 'Profile' },
        ];
      case 'ADMIN':
        return [
          { href: '/admin', icon: Home, label: 'Home' },
          { href: '/bookings', icon: Calendar, label: 'Calendar' },
          { href: '/services', icon: Briefcase, label: 'Services' },
          { href: '/admin/dashboard', icon: BarChart3, label: 'Analytics' },
          { href: '/profile/edit', icon: User, label: 'Profile' },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
      <div className={`grid ${navItems.length === 4 ? 'grid-cols-4' : 'grid-cols-5'} h-16`}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center space-y-1 transition-all duration-200 ${
                active 
                  ? 'text-primary bg-primary/5 border-t-2 border-primary' 
                  : 'text-gray-500 hover:text-primary'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
