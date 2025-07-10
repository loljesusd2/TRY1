
import { Badge } from './ui/badge';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'PENDING':
        return {
          label: 'Pendiente',
          className: 'bg-yellow-100 text-yellow-800 border-yellow-200'
        };
      case 'CONFIRMED':
        return {
          label: 'Confirmada',
          className: 'bg-blue-100 text-blue-800 border-blue-200'
        };
      case 'IN_PROGRESS':
        return {
          label: 'En Progreso',
          className: 'bg-purple-100 text-purple-800 border-purple-200'
        };
      case 'COMPLETED':
        return {
          label: 'Completada',
          className: 'bg-green-100 text-green-800 border-green-200'
        };
      case 'CANCELLED':
        return {
          label: 'Cancelada',
          className: 'bg-red-100 text-red-800 border-red-200'
        };
      default:
        return {
          label: status,
          className: 'bg-gray-100 text-gray-800 border-gray-200'
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Badge
      variant="outline"
      className={cn(config.className, className)}
    >
      {config.label}
    </Badge>
  );
}
