import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Zap, Shield, Clock, ChevronRight, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import loginBg from '@/assets/login-bg.jpg';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
});

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isHovered, setIsHovered] = useState(false);
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = loginSchema.safeParse({ email, password });
    
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

    const { success, error } = await login(email, password);
    
    if (success) {
      toast({
        title: 'Acesso autorizado',
        description: 'Bem-vindo ao sistema.',
      });
      navigate('/agenda');
    } else {
      toast({
        variant: 'destructive',
        title: 'Acesso negado',
        description: error || 'Credenciais inválidas.',
      });
    }
  };

  return (
    <div className="min-h-screen flex overflow-hidden bg-[#0a0e1a]">
      {/* Left Panel - Hero Section */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${loginBg})` }}
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0e1a]/90 via-[#0a0e1a]/60 to-transparent" />
        
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center animate-pulse">
                  <Zap className="w-7 h-7 text-white" />
                </div>
                <div className="absolute -inset-1 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 blur-lg opacity-40" />
              </div>
              <span className="text-2xl font-bold tracking-tight">
                <span className="text-cyan-400">Agenda</span>
                <span className="text-white">Pro</span>
              </span>
            </div>
          </div>
          
          <div className="space-y-8">
            <div>
              <h1 className="text-5xl font-bold leading-tight mb-4">
                <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">
                  Sistema de Agendamento
                </span>
                <br />
                <span className="text-white">do Futuro</span>
              </h1>
              <p className="text-lg text-gray-400 max-w-md leading-relaxed">
                Gerencie suas consultas com tecnologia de ponta. 
                Interface intuitiva, segurança avançada e performance excepcional.
              </p>
            </div>
            
            {/* Features */}
            <div className="grid gap-4">
              <FeatureCard 
                icon={<Shield className="w-5 h-5" />}
                title="Segurança Máxima"
                description="Criptografia de ponta a ponta"
              />
              <FeatureCard 
                icon={<Clock className="w-5 h-5" />}
                title="Tempo Real"
                description="Sincronização instantânea"
              />
              <FeatureCard 
                icon={<Sparkles className="w-5 h-5" />}
                title="IA Integrada"
                description="Sugestões inteligentes"
              />
            </div>
          </div>
          
          {/* Stats */}
          <div className="flex gap-12">
            <StatItem value="10k+" label="Usuários" />
            <StatItem value="50k+" label="Consultas" />
            <StatItem value="99.9%" label="Uptime" />
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">
                <span className="text-cyan-400">Agenda</span>
                <span className="text-white">Pro</span>
              </span>
            </div>
          </div>

          {/* Form Header */}
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-white mb-2">
              Bem-vindo de volta
            </h2>
            <p className="text-gray-400">
              Entre com suas credenciais para continuar
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300 text-sm font-medium">
                  Email
                </Label>
                <div className="relative group">
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`
                      h-12 bg-[#131827] border-[#1e2a45] text-white placeholder:text-gray-500
                      focus:border-cyan-500 focus:ring-cyan-500/20 focus:ring-4 transition-all duration-300
                      ${errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}
                    `}
                  />
                  <div className="absolute inset-0 rounded-md bg-gradient-to-r from-cyan-500/10 to-blue-500/10 opacity-0 group-focus-within:opacity-100 transition-opacity -z-10 blur-xl" />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-400 flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-red-400" />
                    {errors.email}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-300 text-sm font-medium">
                  Senha
                </Label>
                <div className="relative group">
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`
                      h-12 bg-[#131827] border-[#1e2a45] text-white placeholder:text-gray-500
                      focus:border-cyan-500 focus:ring-cyan-500/20 focus:ring-4 transition-all duration-300
                      ${errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}
                    `}
                  />
                  <div className="absolute inset-0 rounded-md bg-gradient-to-r from-cyan-500/10 to-blue-500/10 opacity-0 group-focus-within:opacity-100 transition-opacity -z-10 blur-xl" />
                </div>
                {errors.password && (
                  <p className="text-sm text-red-400 flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-red-400" />
                    {errors.password}
                  </p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div 
              className="relative group"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <div className={`
                absolute -inset-0.5 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-lg 
                blur-md opacity-60 group-hover:opacity-100 transition-all duration-500
                ${isHovered ? 'animate-pulse' : ''}
              `} />
              <Button 
                type="submit" 
                className="relative w-full h-12 bg-gradient-to-r from-cyan-500 via-blue-500 to-blue-600 
                  hover:from-cyan-400 hover:via-blue-400 hover:to-blue-500
                  text-white font-semibold text-base border-0 transition-all duration-300
                  shadow-lg shadow-cyan-500/25"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <span className="flex items-center gap-2">
                    Acessar Sistema
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                )}
              </Button>
            </div>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#1e2a45]" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-[#0a0e1a] text-gray-500">ou</span>
            </div>
          </div>

          {/* Register Link */}
          <div className="text-center">
            <p className="text-gray-400">
              Novo por aqui?{' '}
              <Link 
                to="/register" 
                className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors inline-flex items-center gap-1 group"
              >
                Criar conta
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </p>
          </div>

          {/* Security Badge */}
          <div className="flex items-center justify-center gap-2 text-xs text-gray-500 pt-4">
            <Shield className="w-4 h-4 text-green-500" />
            <span>Conexão segura • Dados criptografados</span>
          </div>
        </div>
      </div>

      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-500" />
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-cyan-500/30 transition-all duration-300 group">
      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <div>
        <h3 className="font-semibold text-white text-sm">{title}</h3>
        <p className="text-gray-400 text-xs">{description}</p>
      </div>
    </div>
  );
}

function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
        {value}
      </div>
      <div className="text-sm text-gray-400">{label}</div>
    </div>
  );
}

export default Login;
