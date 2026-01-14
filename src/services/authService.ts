import { User } from '@/types';

// Serviço preparado para integração com Supabase
// Por enquanto, simula autenticação localmente

class AuthService {
  // TODO: Substituir por Supabase Auth
  async login(email: string, password: string): Promise<User | null> {
    // Simulação de delay de rede
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Validação básica (qualquer email/senha válidos funcionam)
    if (email && password.length >= 6) {
      return {
        id: crypto.randomUUID(),
        email,
        nome: email.split('@')[0],
      };
    }
    return null;
  }

  async register(nome: string, email: string, password: string): Promise<User | null> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (nome && email && password.length >= 6) {
      return {
        id: crypto.randomUUID(),
        email,
        nome,
      };
    }
    return null;
  }

  logout(): void {
    // TODO: Supabase signOut
  }

  async getCurrentUser(): Promise<User | null> {
    // TODO: Supabase getSession
    return null;
  }
}

export const authService = new AuthService();
