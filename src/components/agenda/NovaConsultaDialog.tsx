import { useState, useEffect } from 'react';
import { Cliente } from '@/types';
import { clienteService } from '@/services/clienteService';
import { consultaService } from '@/services/consultaService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { z } from 'zod';

const consultaSchema = z.object({
  clienteId: z.string().min(1, 'Selecione um cliente'),
  data: z.string().min(1, 'Selecione uma data'),
  hora: z.string().min(1, 'Selecione um horário'),
  observacao: z.string().max(500, 'Observação muito longa').optional(),
});

const HORARIOS = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
];

interface NovaConsultaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dataSelecionada: Date;
  onSuccess: () => void;
}

export function NovaConsultaDialog({ open, onOpenChange, dataSelecionada, onSuccess }: NovaConsultaDialogProps) {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [isLoadingClientes, setIsLoadingClientes] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [clienteId, setClienteId] = useState('');
  const [data, setData] = useState('');
  const [hora, setHora] = useState('');
  const [observacao, setObservacao] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      setData(format(dataSelecionada, 'yyyy-MM-dd'));
      carregarClientes();
    }
  }, [open, dataSelecionada]);

  const carregarClientes = async () => {
    setIsLoadingClientes(true);
    const lista = await clienteService.listar();
    setClientes(lista);
    setIsLoadingClientes(false);
  };

  const resetForm = () => {
    setClienteId('');
    setHora('');
    setObservacao('');
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = consultaSchema.safeParse({ clienteId, data, hora, observacao: observacao.trim() });
    
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSaving(true);

    try {
      const resultado = await consultaService.criar({
        clienteId,
        data: new Date(data),
        hora,
        observacao: observacao.trim(),
        status: 'agendada',
      });

      if ('error' in resultado) {
        toast({
          variant: 'destructive',
          title: 'Erro ao agendar',
          description: resultado.error,
        });
        setIsSaving(false);
        return;
      }

      toast({
        title: 'Consulta agendada!',
        description: 'A consulta foi marcada com sucesso.',
      });

      onOpenChange(false);
      resetForm();
      onSuccess();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Ocorreu um erro ao agendar a consulta.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { onOpenChange(isOpen); if (!isOpen) resetForm(); }}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Nova Consulta</DialogTitle>
            <DialogDescription>
              Agende uma nova consulta para o dia {format(dataSelecionada, 'dd/MM/yyyy')}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="cliente">Cliente</Label>
              {isLoadingClientes ? (
                <div className="flex items-center justify-center py-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              ) : clientes.length === 0 ? (
                <p className="text-sm text-muted-foreground">Nenhum cliente cadastrado. Cadastre um cliente primeiro.</p>
              ) : (
                <Select value={clienteId} onValueChange={setClienteId}>
                  <SelectTrigger className={errors.clienteId ? 'border-destructive' : ''}>
                    <SelectValue placeholder="Selecione um cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {clientes.map((cliente) => (
                      <SelectItem key={cliente.id} value={cliente.id}>
                        {cliente.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              {errors.clienteId && <p className="text-sm text-destructive">{errors.clienteId}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="data">Data</Label>
                <Input
                  id="data"
                  type="date"
                  value={data}
                  onChange={(e) => setData(e.target.value)}
                  className={errors.data ? 'border-destructive' : ''}
                />
                {errors.data && <p className="text-sm text-destructive">{errors.data}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="hora">Horário</Label>
                <Select value={hora} onValueChange={setHora}>
                  <SelectTrigger className={errors.hora ? 'border-destructive' : ''}>
                    <SelectValue placeholder="Horário" />
                  </SelectTrigger>
                  <SelectContent>
                    {HORARIOS.map((h) => (
                      <SelectItem key={h} value={h}>
                        {h}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.hora && <p className="text-sm text-destructive">{errors.hora}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="observacao">Observação (opcional)</Label>
              <Textarea
                id="observacao"
                value={observacao}
                onChange={(e) => setObservacao(e.target.value)}
                placeholder="Observações sobre a consulta..."
                rows={3}
                className={errors.observacao ? 'border-destructive' : ''}
              />
              {errors.observacao && <p className="text-sm text-destructive">{errors.observacao}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSaving || clientes.length === 0}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Agendar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
