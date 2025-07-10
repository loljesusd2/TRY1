
'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PageHeaderProps {
  title: string;
  showBackButton?: boolean;
  actionButton?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
  onBack?: () => void;
  rightAction?: React.ReactNode;
}

export function PageHeader({ 
  title, 
  showBackButton = true, 
  actionButton, 
  onBack,
  rightAction 
}: PageHeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <div className="sticky top-0 z-40 bg-primary text-primary-foreground shadow-md">
      <div className="flex items-center justify-between h-14 px-4">
        {/* Left side - Back button or space */}
        <div className="flex items-center min-w-[40px]">
          {showBackButton && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="text-primary-foreground hover:bg-white/20 p-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
        </div>

        {/* Center - Title */}
        <div className="flex-1 text-center">
          <h1 className="text-lg font-semibold truncate">{title}</h1>
        </div>

        {/* Right side - Action button or custom action */}
        <div className="flex items-center min-w-[40px] justify-end">
          {actionButton ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={actionButton.onClick}
              className="text-primary-foreground hover:bg-white/20 flex items-center gap-2"
            >
              {actionButton.icon || <Plus className="h-5 w-5" />}
              <span className="hidden sm:inline">{actionButton.label}</span>
            </Button>
          ) : rightAction ? (
            rightAction
          ) : null}
        </div>
      </div>
    </div>
  );
}
