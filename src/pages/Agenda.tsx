import { useState, useEffect } from 'react';
import { Consulta } from '@/types';
import { consultaService } from '@/services/consultaService';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { NovaConsultaDialog } from '@/components/agenda/NovaConsultaDialog';
import { ConsultaCard } from '@/components/agenda/ConsultaCard';
import { Plus, CalendarDays, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function Agenda() {
  const [dataSelecionada, setDataSelecionada] = useState<Date>(new Date());
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isNovaConsultaOpen, setIsNovaConsultaOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingConsulta, setDeletingConsulta] = useState<Consulta | null>(null);
  
  const { toast } = useToast();

  const carregarConsultas = async () => {
    setIsLoading(true);
    const lista = await consultaService.listarPorData(dataSelecionada);
    // Ordenar por horário
    lista.sort((a, b) => a.hora.localeCompare(b.hora));
    setConsultas(lista);
    setIsLoading(false);
  };

  useEffect(() => {
    carregarConsultas();
  }, [dataSelecionada]);

  const handleChangeStatus = async (id: string, status: Consulta['status']) => {
    const resultado = await consultaService.atualizarStatus(id, status);
    if (resultado) {
      toast({
        title: 'Status atualizado',
        description: `Consulta marcada como ${status}.`,
      });
      carregarConsultas();
    }
  };

  const openDeleteDialog = (consulta: Consulta) => {
    setDeletingConsulta(consulta);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingConsulta) return;

    try {
      await consultaService.excluir(deletingConsulta.id);
      toast({
        title: 'Consulta excluída',
        description: 'A consulta foi removida com sucesso.',
      });
      setIsDeleteDialogOpen(false);
      setDeletingConsulta(null);
      carregarConsultas();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Ocorreu um erro ao excluir a consulta.',
      });
    }
  };

  const consultasAtivas = consultas.filter(c => c.status !== 'cancelada');
  const consultasCanceladas = consultas.filter(c => c.status === 'cancelada');

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Agenda</h1>
          <p className="text-muted-foreground">Gerencie suas consultas agendadas</p>
        </div>
        <Button onClick={() => setIsNovaConsultaOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Nova Consulta
        </Button>
      </div>

      <div className="grid lg:grid-cols-[320px_1fr] gap-6">
        {/* Calendário */}
        <div className="bg-card rounded-xl border p-4 shadow-sm">
          <Calendar
            mode="single"
            selected={dataSelecionada}
            onSelect={(date) => date && setDataSelecionada(date)}
            locale={ptBR}
            className="pointer-events-auto"
          />
        </div>

        {/* Lista de consultas */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-lg font-semibold text-foreground">
            <CalendarDays className="h-5 w-5 text-primary" />
            {format(dataSelecionada, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : consultas.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center bg-card rounded-xl border border-dashed">
              <div className="p-4 rounded-full bg-accent mb-4">
                <CalendarDays className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-1">Nenhuma consulta</h3>
              <p className="text-muted-foreground mb-6">Não há consultas agendadas para este dia.</p>
              <Button onClick={() => setIsNovaConsultaOpen(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Agendar Consulta
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {consultasAtivas.length > 0 && (
                <div className="space-y-3">
                  {consultasAtivas.map((consulta) => (
                    <ConsultaCard
                      key={consulta.id}
                      consulta={consulta}
                      onChangeStatus={handleChangeStatus}
                      onDelete={openDeleteDialog}
                    />
                  ))}
                </div>
              )}

              {consultasCanceladas.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-muted-foreground">Canceladas</h4>
                  {consultasCanceladas.map((consulta) => (
                    <ConsultaCard
                      key={consulta.id}
                      consulta={consulta}
                      onChangeStatus={handleChangeStatus}
                      onDelete={openDeleteDialog}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <NovaConsultaDialog
        open={isNovaConsultaOpen}
        onOpenChange={setIsNovaConsultaOpen}
        dataSelecionada={dataSelecionada}
        onSuccess={carregarConsultas}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir consulta?</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a consulta de <strong>{deletingConsulta?.cliente?.nome}</strong> às <strong>{deletingConsulta?.hora}</strong>? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
