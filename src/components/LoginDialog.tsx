import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

// ============================================================================
// COMPONENTE LOGIN DIALOG - Modal de login e registro
// ============================================================================

/**
 * Interface que define as propriedades do componente
 */
interface LoginDialogProps {
  open: boolean;                  // Controla se o modal está visível
  onClose: () => void;            // Função para fechar o modal
  onLogin: (email: string, password: string) => void;  // Callback de login (agora usa email!)
  onRegister: (username: string, email: string, password: string) => void;  // Callback de registro
}

/**
 * Componente LoginDialog - Modal com formulários de login e registro
 * 
 * Funcionalidades:
 * - Dois formulários em abas (Login e Criar Conta)
 * - Validação básica de formulário
 * - Verificação de senhas correspondentes no registro
 * 
 * IMPORTANTE: Este é um sistema de autenticação simulado
 * Em produção, seria necessário:
 * - Criptografia de senhas
 * - Validação no backend
 * - Tokens de autenticação (JWT, etc)
 * - Verificação de e-mail
 */
export function LoginDialog({ open, onClose, onLogin, onRegister }: LoginDialogProps) {
  // --------------------------------------------------------------------------
  // ESTADOS DO FORMULÁRIO DE LOGIN
  // --------------------------------------------------------------------------
  const [loginEmail, setLoginEmail] = useState('');  // Mudou de loginUsername para loginEmail
  const [loginPassword, setLoginPassword] = useState('');
  
  // --------------------------------------------------------------------------
  // ESTADOS DO FORMULÁRIO DE REGISTRO
  // --------------------------------------------------------------------------
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');

  // --------------------------------------------------------------------------
  // HANDLERS DOS FORMULÁRIOS
  // --------------------------------------------------------------------------
  
  /**
   * Processa o envio do formulário de login
   * @param e - Evento do formulário (usado para prevenir reload da página)
   */
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();  // Previne o comportamento padrão do formulário (reload)
    
    // Verifica se os campos estão preenchidos
    if (loginEmail && loginPassword) {  // Agora verifica loginEmail
      // Chama a função de login passada pelo componente pai
      onLogin(loginEmail, loginPassword);  // Passa email ao invés de username
      
      // Limpa os campos do formulário
      setLoginEmail('');  // Limpa loginEmail
      setLoginPassword('');
    }
  };

  /**
   * Processa o envio do formulário de registro
   * @param e - Evento do formulário
   */
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();  // Previne reload da página
    
    // Valida se todos os campos estão preenchidos e as senhas conferem
    if (registerUsername && registerEmail && registerPassword && registerPassword === registerConfirmPassword) {
      // Chama a função de registro passada pelo componente pai
      onRegister(registerUsername, registerEmail, registerPassword);
      
      // Limpa todos os campos do formulário
      setRegisterUsername('');
      setRegisterEmail('');
      setRegisterPassword('');
      setRegisterConfirmPassword('');
    }
  };

  // --------------------------------------------------------------------------
  // RENDERIZAÇÃO
  // --------------------------------------------------------------------------

  return (
    // Dialog do ShadCN - componente de modal
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        {/* Cabeçalho do modal */}
        <DialogHeader>
          <DialogTitle>Bem-vindo ao GameRent</DialogTitle>
          <DialogDescription>
            Faça login ou crie uma conta para continuar
          </DialogDescription>
        </DialogHeader>

        {/* Tabs para alternar entre Login e Registro */}
        <Tabs defaultValue="login" className="w-full">
          {/* Lista de abas */}
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Criar Conta</TabsTrigger>
          </TabsList>

          {/* CONTEÚDO DA ABA DE LOGIN */}
          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4">
              
              {/* Campo: E-mail */}
              <div className="space-y-2">
                <Label htmlFor="login-email">E-mail</Label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="Digite seu e-mail"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required  // HTML5 validation
                />
              </div>

              {/* Campo: Senha */}
              <div className="space-y-2">
                <Label htmlFor="login-password">Senha</Label>
                <Input
                  id="login-password"
                  type="password"  // Oculta os caracteres digitados
                  placeholder="Digite sua senha"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                />
              </div>

              {/* Botão de envio */}
              <Button type="submit" className="w-full">
                Entrar
              </Button>
            </form>
          </TabsContent>

          {/* CONTEÚDO DA ABA DE REGISTRO */}
          <TabsContent value="register">
            <form onSubmit={handleRegister} className="space-y-4">
              
              {/* Campo: Usuário */}
              <div className="space-y-2">
                <Label htmlFor="register-username">Usuário</Label>
                <Input
                  id="register-username"
                  type="text"
                  placeholder="Escolha um usuário"
                  value={registerUsername}
                  onChange={(e) => setRegisterUsername(e.target.value)}
                  required
                />
              </div>

              {/* Campo: E-mail */}
              <div className="space-y-2">
                <Label htmlFor="register-email">E-mail</Label>
                <Input
                  id="register-email"
                  type="email"  // Validação HTML5 de e-mail
                  placeholder="Digite seu e-mail"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  required
                />
              </div>

              {/* Campo: Senha */}
              <div className="space-y-2">
                <Label htmlFor="register-password">Senha</Label>
                <Input
                  id="register-password"
                  type="password"
                  placeholder="Escolha uma senha"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  required
                />
              </div>

              {/* Campo: Confirmar Senha */}
              <div className="space-y-2">
                <Label htmlFor="register-confirm-password">Confirmar Senha</Label>
                <Input
                  id="register-confirm-password"
                  type="password"
                  placeholder="Confirme sua senha"
                  value={registerConfirmPassword}
                  onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                  required
                />
              </div>

              {/* Mensagem de erro: senhas não conferem */}
              {registerPassword !== registerConfirmPassword && registerConfirmPassword && (
                <p className="text-destructive">As senhas não coincidem</p>
              )}

              {/* Botão de envio - desabilitado se as senhas não conferem */}
              <Button 
                type="submit" 
                className="w-full"
                disabled={registerPassword !== registerConfirmPassword}
              >
                Criar Conta
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}