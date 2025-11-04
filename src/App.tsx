// Importações dos componentes principais do site
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { BookingForm } from './components/BookingForm';
import { Footer } from './components/Footer';
import { Auth } from './components/Auth';
import { AdminDashboard } from './components/AdminDashboard';
import { UserBookings } from './components/UserBookings';
import { Toaster } from './components/ui/sonner';
import { Button } from './components/ui/button';
import { LogOut, User as UserIcon } from 'lucide-react';
import { projectId, publicAnonKey } from './utils/supabase/info';

// Cliente Supabase
const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey
);

// Componente principal da aplicação
export default function App() {
  // Estado de autenticação
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Verifica se já existe uma sessão ativa ao carregar
  useEffect(() => {
    checkSession();
  }, []);

  // Função para verificar sessão existente
  const checkSession = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        setAccessToken(session.access_token);
        setUser(session.user);
        setIsAdmin(session.user?.user_metadata?.role === 'admin');
      }
    } catch (error) {
      console.error('Erro ao verificar sessão:', error);
    } finally {
      setLoading(false);
    }
  };

  // Callback quando o login é bem-sucedido
  const handleAuthSuccess = (token: string, userData: any) => {
    setAccessToken(token);
    setUser(userData);
    setIsAdmin(userData?.user_metadata?.role === 'admin');
  };

  // Função de logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setAccessToken(null);
    setUser(null);
    setIsAdmin(false);
  };

  // Mostra loading enquanto verifica a sessão
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <p>Carregando...</p>
      </div>
    );
  }

  // Se não estiver logado, mostra a tela de autenticação
  if (!accessToken || !user) {
    return (
      <>
        <Auth onAuthSuccess={handleAuthSuccess} />
        <Toaster />
      </>
    );
  }

  // Se estiver logado, mostra o conteúdo do site
  return (
    <div className="min-h-screen bg-black">
      {/* Header com botão de logout */}
      <div className="fixed top-0 right-0 z-50 p-4 flex items-center gap-3">
        <div className="bg-zinc-900 px-4 py-2 rounded-lg flex items-center gap-2 text-white">
          <UserIcon className="w-4 h-4" />
          <span className="text-sm">{user.user_metadata?.name || user.email}</span>
          {isAdmin && (
            <span className="ml-2 bg-red-600 px-2 py-0.5 rounded text-xs">
              ADMIN
            </span>
          )}
        </div>
        <Button
          onClick={handleLogout}
          variant="outline"
          size="sm"
          className="bg-zinc-900 hover:bg-zinc-800 text-white border-zinc-700"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sair
        </Button>
      </div>

      {/* Seção Hero - Banner principal com imagem de fundo */}
      <Hero />
      
      {/* Seção Sobre a Banda - Informações e diferenciais */}
      <About />

      {/* Se for ADMIN, mostra o painel administrativo */}
      {isAdmin ? (
        <AdminDashboard accessToken={accessToken} />
      ) : (
        /* Se for usuário normal, mostra seus agendamentos */
        <UserBookings accessToken={accessToken} />
      )}
      
      {/* Formulário de Agendamento de Shows */}
      <BookingForm accessToken={accessToken} />
      
      {/* Rodapé com informações de contato */}
      <Footer />
      
      {/* Componente para exibir notificações toast */}
      <Toaster />
    </div>
  );
}
