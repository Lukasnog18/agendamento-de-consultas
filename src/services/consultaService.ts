import { Consulta } from '@/types';
import { clienteService } from './clienteService';
import { startOfDay, isBefore, parseISO, format } from 'date-fns';

// Serviço preparado para integração com Supabase
// Por enquanto, mantém dados apenas em memória (session)

class ConsultaService {
  private consultas: Consulta[] = [];

  // TODO: Substituir por Supabase query
  async listar(): Promise<Consulta[]> {
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Popula dados do cliente
    const consultasComCliente = await Promise.all(
      this.consultas.map(async (consulta) => {
        const cliente = await clienteService.buscarPorId(consulta.clienteId);
        return { ...consulta, cliente: cliente || undefined };
      })
    );
    
    return consultasComCliente;
  }

  async listarPorData(data: Date): Promise<Consulta[]> {
    const todas = await this.listar();
    const dataFormatada = format(data, 'yyyy-MM-dd');
    
    return todas.filter(c => format(new Date(c.data), 'yyyy-MM-dd') === dataFormatada);
  }

  async buscarPorId(id: string): Promise<Consulta | null> {
    await new Promise(resolve => setTimeout(resolve, 100));
    const consulta = this.consultas.find(c => c.id === id);
    
    if (consulta) {
      const cliente = await clienteService.buscarPorId(consulta.clienteId);
      return { ...consulta, cliente: cliente || undefined };
    }
    
    return null;
  }

  async verificarDisponibilidade(data: Date, hora: string, excluirId?: string): Promise<boolean> {
    const dataFormatada = format(data, 'yyyy-MM-dd');
    
    const conflito = this.consultas.find(c => {
      if (excluirId && c.id === excluirId) return false;
      if (c.status === 'cancelada') return false;
      
      const consultaData = format(new Date(c.data), 'yyyy-MM-dd');
      return consultaData === dataFormatada && c.hora === hora;
    });
    
    return !conflito;
  }

  async criar(data: Omit<Consulta, 'id' | 'createdAt' | 'cliente'>): Promise<Consulta | { error: string }> {
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Validação: não permitir datas passadas
    const hoje = startOfDay(new Date());
    const dataConsulta = startOfDay(new Date(data.data));
    
    if (isBefore(dataConsulta, hoje)) {
      return { error: 'Não é possível agendar consultas em datas passadas.' };
    }
    
    // Validação: verificar conflito de horário
    const disponivel = await this.verificarDisponibilidade(new Date(data.data), data.hora);
    if (!disponivel) {
      return { error: 'Já existe uma consulta agendada para este horário.' };
    }
    
    const novaConsulta: Consulta = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    
    this.consultas.push(novaConsulta);
    
    const cliente = await clienteService.buscarPorId(novaConsulta.clienteId);
    return { ...novaConsulta, cliente: cliente || undefined };
  }

  async atualizarStatus(id: string, status: Consulta['status']): Promise<Consulta | null> {
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const index = this.consultas.findIndex(c => c.id === id);
    if (index === -1) return null;
    
    this.consultas[index] = { ...this.consultas[index], status };
    
    const cliente = await clienteService.buscarPorId(this.consultas[index].clienteId);
    return { ...this.consultas[index], cliente: cliente || undefined };
  }

  async excluir(id: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const index = this.consultas.findIndex(c => c.id === id);
    if (index === -1) return false;
    
    this.consultas.splice(index, 1);
    return true;
  }
}

export const consultaService = new ConsultaService();
