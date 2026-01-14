import { Cliente } from '@/types';

// Serviço preparado para integração com Supabase
// Por enquanto, mantém dados apenas em memória (session)

class ClienteService {
  private clientes: Cliente[] = [];

  // TODO: Substituir por Supabase query
  async listar(): Promise<Cliente[]> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return [...this.clientes];
  }

  async buscarPorId(id: string): Promise<Cliente | null> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return this.clientes.find(c => c.id === id) || null;
  }

  async criar(data: Omit<Cliente, 'id' | 'createdAt'>): Promise<Cliente> {
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const novoCliente: Cliente = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    
    this.clientes.push(novoCliente);
    return novoCliente;
  }

  async atualizar(id: string, data: Partial<Omit<Cliente, 'id' | 'createdAt'>>): Promise<Cliente | null> {
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const index = this.clientes.findIndex(c => c.id === id);
    if (index === -1) return null;
    
    this.clientes[index] = { ...this.clientes[index], ...data };
    return this.clientes[index];
  }

  async excluir(id: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const index = this.clientes.findIndex(c => c.id === id);
    if (index === -1) return false;
    
    this.clientes.splice(index, 1);
    return true;
  }
}

export const clienteService = new ClienteService();
