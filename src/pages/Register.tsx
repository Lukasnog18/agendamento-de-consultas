import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Zap, Shield, ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import loginBg from '@/assets/login-bg.jpg';

const registerSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'As senhas não conferem',
  path: ['confirmPassword'],
});

function Register() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isHovered, setIsHovered] = useState(false);
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = registerSchema.safeParse({ nome, email, password, confirmPassword });
    
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

    const { success, error } = await register(nome, email, password);
    
    if (success) {
      toast({
        title: 'Conta criada!',
        description: 'Bem-vindo ao AgendaPro.',
      });
      navigate('/agenda');
    } else {
      toast({
        variant: 'destructive',
        title: 'Erro ao cadastrar',
        description: error || 'Ocorreu um erro ao criar sua conta.',
      });
    }
  };

  return (
    <div className="min-h-screen flex overflow-hidden bg-[#0a0e1a]">
      {/* Left Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-6">
          {/* Back to Login */}
          <Link 
            to="/login" 
            className="inline-flex items-center gap-1 text-gray-400 hover:text-cyan-400 transition-colors text-sm group"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Voltar ao login
          </Link>

          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-4">
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
              Criar sua conta
            </h2>
            <p className="text-gray-400">
              Junte-se a milhares de profissionais
            </p>
          </div>

          {/* Register Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome" className="text-gray-300 text-sm font-medium">
                  Nome completo
                </Label>
                <Input
                  id="nome"
                  type="text"
                  placeholder="Seu nome"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className={`
                    h-12 bg-[#131827] border-[#1e2a45] text-white placeholder:text-gray-500
                    focus:border-cyan-500 focus:ring-cyan-500/20 focus:ring-4 transition-all duration-300
                    ${errors.nome ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}
                  `}
                />
                {errors.nome && (
                  <p className="text-sm text-red-400 flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-red-400" />
                    {errors.nome}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300 text-sm font-medium">
                  Email
                </Label>
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
                {errors.email && (
                  <p className="text-sm text-red-400 flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-red-400" />
                    {errors.email}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-300 text-sm font-medium">
                    Senha
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`
                      h-12 bg-[#131827] border-[#1e2a45] text-white placeholder:text-gray-500
                      focus:border-cyan-500 focus:ring-cyan-500/20 focus:ring-4 transition-all duration-300
                      ${errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}
                    `}
                  />
                  {errors.password && (
                    <p className="text-sm text-red-400 flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-red-400" />
                      {errors.password}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-gray-300 text-sm font-medium">
                    Confirmar
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`
                      h-12 bg-[#131827] border-[#1e2a45] text-white placeholder:text-gray-500
                      focus:border-cyan-500 focus:ring-cyan-500/20 focus:ring-4 transition-all duration-300
                      ${errors.confirmPassword ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}
                    `}
                  />
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-400 flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-red-400" />
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div 
              className="relative group"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <div className={`
                absolute -inset-0.5 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 rounded-lg 
                blur-md opacity-60 group-hover:opacity-100 transition-all duration-500
                ${isHovered ? 'animate-pulse' : ''}
              `} />
              <Button 
                type="submit" 
                className="relative w-full h-12 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 
                  hover:from-purple-400 hover:via-blue-400 hover:to-cyan-400
                  text-white font-semibold text-base border-0 transition-all duration-300
                  shadow-lg shadow-purple-500/25"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Criar minha conta
                  </span>
                )}
              </Button>
            </div>
          </form>

          {/* Terms */}
          <p className="text-center text-xs text-gray-500">
            Ao criar sua conta, você concorda com nossos{' '}
            <a href="#" className="text-cyan-400 hover:underline">Termos de Uso</a>
            {' '}e{' '}
            <a href="#" className="text-cyan-400 hover:underline">Política de Privacidade</a>
          </p>

          {/* Security Badge */}
          <div className="flex items-center justify-center gap-2 text-xs text-gray-500 pt-2">
            <Shield className="w-4 h-4 text-green-500" />
            <span>Seus dados estão seguros conosco</span>
          </div>
        </div>
      </div>

      {/* Right Panel - Hero Section */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${loginBg})` }}
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-l from-[#0a0e1a]/90 via-[#0a0e1a]/60 to-transparent" />
        
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center items-end p-12 text-white w-full">
          <div className="max-w-md text-right">
            <div className="flex items-center justify-end gap-3 mb-8">
              <span className="text-2xl font-bold tracking-tight">
                <span className="text-cyan-400">Agenda</span>
                <span className="text-white">Pro</span>
              </span>
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center animate-pulse">
                  <Zap className="w-7 h-7 text-white" />
                </div>
                <div className="absolute -inset-1 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 blur-lg opacity-40" />
              </div>
            </div>
            
            <h1 className="text-4xl font-bold leading-tight mb-4">
              <span className="text-white">Comece sua</span>
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Jornada Aqui
              </span>
            </h1>
            <p className="text-lg text-gray-400 leading-relaxed">
              Transforme a maneira como você gerencia seus agendamentos. 
              Tecnologia de ponta ao seu alcance.
            </p>

            {/* Testimonial */}
            <div className="mt-8 p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
              <p className="text-gray-300 italic mb-4">
                "O AgendaPro revolucionou minha clínica. Nunca mais tive problemas com agendamentos duplicados."
              </p>
              <div className="flex items-center justify-end gap-3">
                <div className="text-right">
                  <p className="font-semibold text-white text-sm">Dra. Maria Silva</p>
                  <p className="text-xs text-gray-400">Clínica Saúde Total</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-cyan-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>
    </div>
  );
}

export default Register;
