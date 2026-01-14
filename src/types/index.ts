export interface Cliente {
  id: string;
  nome: string;
  telefone: string;
  email: string;
  createdAt: Date;
}

export interface Consulta {
  id: string;
  clienteId: string;
  cliente?: Cliente;
  data: Date;
  hora: string;
  observacao: string;
  status: 'agendada' | 'realizada' | 'cancelada';
  createdAt: Date;
}

export interface User {
  id: string;
  email: string;
  nome: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
