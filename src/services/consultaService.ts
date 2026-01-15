import { Consulta } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { startOfDay, isBefore, format } from 'date-fns';

class ConsultaService {
  async listar(): Promise<Consulta[]> {
    const { data, error } = await supabase
      .from('consultas')
      .select(`
        *,
        cliente:clientes(*)
      `)
      .order('data')
      .order('hora');
    
    if (error) {
      console.error('Erro ao listar consultas:', error);
      return [];
    }
    
    return (data || []).map(consulta => ({
      ...consulta,
      cliente: consulta.cliente || undefined,
    }));
  }

  async listarPorData(data: Date): Promise<Consulta[]> {
    const dataFormatada = format(data, 'yyyy-MM-dd');
    
    const { data: consultas, error } = await supabase
      .from('consultas')
      .select(`
        *,
        cliente:clientes(*)
      `)
      .eq('data', dataFormatada)
      .order('hora');
    
    if (error) {
      console.error('Erro ao listar consultas por data:', error);
      return [];
    }
    
    return (consultas || []).map(consulta => ({
      ...consulta,
      cliente: consulta.cliente || undefined,
    }));
  }

  async buscarPorId(id: string): Promise<Consulta | null> {
    const { data, error } = await supabase
      .from('consultas')
      .select(`
        *,
        cliente:clientes(*)
      `)
      .eq('id', id)
      .maybeSingle();
    
    if (error) {
      console.error('Erro ao buscar consulta:', error);
      return null;
    }
    
    if (!data) return null;
    
    return {
      ...data,
      cliente: data.cliente || undefined,
    };
  }

  async verificarDisponibilidade(data: Date, hora: string, excluirId?: string): Promise<boolean> {
    const dataFormatada = format(data, 'yyyy-MM-dd');
    
    let query = supabase
      .from('consultas')
      .select('id')
      .eq('data', dataFormatada)
      .eq('hora', hora)
      .neq('status', 'cancelada');
    
    if (excluirId) {
      query = query.neq('id', excluirId);
    }
    
    const { data: conflitos, error } = await query;
    
    if (error) {
      console.error('Erro ao verificar disponibilidade:', error);
      return false;
    }
    
    return !conflitos || conflitos.length === 0;
  }

  async criar(data: {
    cliente_id: string;
    data: Date;
    hora: string;
    observacao?: string;
    status: 'agendada' | 'realizada' | 'cancelada';
  }): Promise<Consulta | { error: string }> {
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
    
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      return { error: 'Usuário não autenticado.' };
    }
    
    const { data: consulta, error } = await supabase
      .from('consultas')
      .insert({
        user_id: user.user.id,
        cliente_id: data.cliente_id,
        data: format(data.data, 'yyyy-MM-dd'),
        hora: data.hora,
        observacao: data.observacao || null,
        status: data.status,
      })
      .select(`
        *,
        cliente:clientes(*)
      `)
      .single();
    
    if (error) {
      console.error('Erro ao criar consulta:', error);
      return { error: 'Erro ao agendar consulta.' };
    }
    
    return {
      ...consulta,
      cliente: consulta.cliente || undefined,
    };
  }

  async atualizarStatus(id: string, status: Consulta['status']): Promise<Consulta | null> {
    const { data: consulta, error } = await supabase
      .from('consultas')
      .update({ status })
      .eq('id', id)
      .select(`
        *,
        cliente:clientes(*)
      `)
      .single();
    
    if (error) {
      console.error('Erro ao atualizar status:', error);
      return null;
    }
    
    return {
      ...consulta,
      cliente: consulta.cliente || undefined,
    };
  }

  async excluir(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('consultas')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Erro ao excluir consulta:', error);
      return false;
    }
    
    return true;
  }
}

export const consultaService = new ConsultaService();
