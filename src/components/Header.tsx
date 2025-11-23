import { Gamepad2, Mail, User, LogOut, Calendar } from 'lucide-react';
import { Button } from './ui/button';

// ============================================================================
// COMPONENTE HEADER - Cabeçalho da aplicação
// ============================================================================

/**
 * Interface que define as propriedades recebidas pelo componente Header
 */
interface HeaderProps {
  isLoggedIn: boolean;              // Indica se o usuário está logado
  onLoginClick: () => void;         // Função chamada ao clicar no botão de login
  onLogout: () => void;             // Função chamada ao fazer logout
  onNavigateHome: () => void;       // Função para voltar à página inicial
  onNavigateReservations: () => void; // Função para ir à página de reservas
  hasReservations: boolean;         // Indica se o usuário tem reservas ativas
}

/**
 * Componente Header - Barra superior da aplicação
 * 
 * Exibe:
 * - Logo e nome da aplicação (clicável para voltar ao início)
 * - Link de contato
 * - Botão de "Minhas Reservas" (apenas se logado e com reservas)
 * - Botão de Login/Logout
 */
export function Header({ 
  isLoggedIn, 
  onLoginClick, 
  onLogout, 
  onNavigateHome,
  onNavigateReservations,
  hasReservations 
}: HeaderProps) {
  return (
    // Container do header com fundo branco, borda inferior e fixo no topo
    <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo e nome da aplicação - ao clicar, volta para a página inicial */}
          <button 
            onClick={onNavigateHome}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <Gamepad2 className="size-8 text-indigo-600" />
            <h1 className="text-indigo-600">Games Mania</h1>
          </button>
          
          {/* Menu de navegação à direita */}
          <nav className="flex items-center gap-4">
            {/* Link de Contato - usa âncora para scroll até o rodapé */}
            <a 
              href="#contato" 
              className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 transition-colors"
            >
              <Mail className="size-5" />
              <span>Contato</span>
            </a>
            
            {/* Botão "Minhas Reservas" - só aparece se o usuário está logado e tem reservas ativas */}
            {isLoggedIn && hasReservations && (
              <Button 
                variant="outline" 
                onClick={onNavigateReservations}
                className="flex items-center gap-2"
              >
                <Calendar className="size-4" />
                Minhas Reservas
              </Button>
            )}
            
            {/* Botão de Login ou Logout - muda conforme o estado de autenticação */}
            {isLoggedIn ? (
              // Usuário está logado: mostra botão de Sair
              <Button 
                onClick={onLogout}
                variant="outline"
                className="flex items-center gap-2"
              >
                <LogOut className="size-4" />
                Sair
              </Button>
            ) : (
              // Usuário não está logado: mostra botão de Login
              <Button 
                onClick={onLoginClick}
                className="flex items-center gap-2"
              >
                <User className="size-4" />
                Login
              </Button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}