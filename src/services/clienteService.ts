import { Cliente } from '@/types';
import { supabase } from '@/integrations/supabase/client';

class ClienteService {
  async listar(): Promise<Cliente[]> {
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .order('nome');
    
    if (error) {
      console.error('Erro ao listar clientes:', error);
      return [];
    }
    
    return data || [];
  }

  async buscarPorId(id: string): Promise<Cliente | null> {
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    
    if (error) {
      console.error('Erro ao buscar cliente:', error);
      return null;
    }
    
    return data;
  }

  async criar(data: { nome: string; telefone: string; email: string }): Promise<Cliente | null> {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      console.error('Usuário não autenticado');
      return null;
    }
    
    const { data: cliente, error } = await supabase
      .from('clientes')
      .insert({
        user_id: user.user.id,
        nome: data.nome,
        telefone: data.telefone || null,
        email: data.email || null,
      })
      .select()
      .single();
    
    if (error) {
      console.error('Erro ao criar cliente:', error);
      return null;
    }
    
    return cliente;
  }

  async atualizar(id: string, data: Partial<{ nome: string; telefone: string; email: string }>): Promise<Cliente | null> {
    const { data: cliente, error } = await supabase
      .from('clientes')
      .update({
        nome: data.nome,
        telefone: data.telefone || null,
        email: data.email || null,
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Erro ao atualizar cliente:', error);
      return null;
    }
    
    return cliente;
  }

  async excluir(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('clientes')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Erro ao excluir cliente:', error);
      return false;
    }
    
    return true;
  }
}

export const clienteService = new ClienteService();
