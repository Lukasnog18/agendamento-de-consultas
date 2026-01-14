import { Consulta } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Clock, MoreVertical, CheckCircle, XCircle, AlertCircle, Trash2, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ConsultaCardProps {
  consulta: Consulta;
  onChangeStatus: (id: string, status: Consulta['status']) => void;
  onDelete: (consulta: Consulta) => void;
}

export function ConsultaCard({ consulta, onChangeStatus, onDelete }: ConsultaCardProps) {
  const statusConfig = {
    agendada: {
      label: 'Agendada',
      icon: AlertCircle,
      className: 'status-agendada',
    },
    realizada: {
      label: 'Realizada',
      icon: CheckCircle,
      className: 'status-realizada',
    },
    cancelada: {
      label: 'Cancelada',
      icon: XCircle,
      className: 'status-cancelada',
    },
  };

  const config = statusConfig[consulta.status];
  const StatusIcon = config.icon;

  return (
    <div className={cn(
      'p-4 rounded-lg border bg-card transition-all hover:shadow-md',
      consulta.status === 'cancelada' && 'opacity-60'
    )}>
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="flex items-center gap-2 text-primary font-semibold">
            <Clock className="h-4 w-4" />
            {consulta.hora}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{consulta.cliente?.nome || 'Cliente não encontrado'}</span>
            </div>
            {consulta.observacao && (
              <p className="text-sm text-muted-foreground line-clamp-2">{consulta.observacao}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className={cn('gap-1', config.className)}>
            <StatusIcon className="h-3 w-3" />
            {config.label}
          </Badge>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {consulta.status !== 'agendada' && (
                <DropdownMenuItem onClick={() => onChangeStatus(consulta.id, 'agendada')}>
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Marcar como Agendada
                </DropdownMenuItem>
              )}
              {consulta.status !== 'realizada' && (
                <DropdownMenuItem onClick={() => onChangeStatus(consulta.id, 'realizada')}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Marcar como Realizada
                </DropdownMenuItem>
              )}
              {consulta.status !== 'cancelada' && (
                <DropdownMenuItem onClick={() => onChangeStatus(consulta.id, 'cancelada')}>
                  <XCircle className="h-4 w-4 mr-2" />
                  Marcar como Cancelada
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => onDelete(consulta)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
