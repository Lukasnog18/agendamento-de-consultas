export interface Cliente {
  id: string;
  user_id: string;
  nome: string;
  telefone: string | null;
  email: string | null;
  created_at: string;
}

export interface Consulta {
  id: string;
  user_id: string;
  cliente_id: string;
  cliente?: Cliente;
  data: string;
  hora: string;
  observacao: string | null;
  status: 'agendada' | 'realizada' | 'cancelada';
  created_at: string;
}

export interface User {
  id: string;
  email: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
