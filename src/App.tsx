import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './components/HomePage';
import { GameDetailsPage } from './components/GameDetailsPage';
import { CalendarPage } from './components/CalendarPage';
import { ReservationManagement } from './components/ReservationManagement';
import { LoginDialog } from './components/LoginDialog';

// ============================================================================
// IMPORTA O SERVIÇO DE API - Comunicação com o Backend
// ============================================================================
import api from '../src/services/api';

// ============================================================================
// INTERFACES - Definição dos tipos de dados usados no sistema
// ============================================================================

/**
 * Interface que define a estrutura de um jogo
 * AGORA vem do backend MySQL via API!
 */
export interface Game {
  id: string;              // Identificador único do jogo (agora é número do MySQL)
  name: string;            // Nome do jogo
  category: string;        // Categoria (ex: "Jogo de Cartas", "Jogo de Tabuleiro")
  summary: string;         // Resumo curto para exibir nos cards
  price: number;           // Preço do aluguel por dia em reais
  images: string[];        // Array de URLs das imagens do jogo
  description: string;     // Descrição completa do jogo
  howToPlay: string;       // Explicação de como jogar (how_to_play no backend)
  rules: string[];         // Array com as regras básicas
  players: string;         // Número de jogadores (ex: "2-4 jogadores")
  duration: string;        // Duração média da partida (ex: "30-60 minutos")
}

/**
 * Interface que define a estrutura de uma reserva
 * Agora salva no MySQL via API!
 */
export interface Reservation {
  id: string;              // Identificador único da reserva
  gameId: string;          // ID do jogo reservado (relaciona com Game.id)
  gameName: string;        // Nome do jogo (para facilitar exibição)
  date: Date;              // Data da reserva
  status: 'active' | 'cancelled';  // Status da reserva (ativa ou cancelada)
}

// ============================================================================
// COMPONENTE PRINCIPAL - Gerencia todo o estado e navegação da aplicação
// AGORA INTEGRADO COM BACKEND REAL!
// ============================================================================

function App() {
  // --------------------------------------------------------------------------
  // ESTADOS - Gerenciamento do estado da aplicação
  // --------------------------------------------------------------------------
  
  /**
   * Controla qual página está sendo exibida atualmente
   */
  const [currentPage, setCurrentPage] = useState<'home' | 'game' | 'calendar' | 'reservations'>('home');
  
  /**
   * Armazena o jogo que está sendo visualizado/alugado no momento
   */
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  
  /**
   * Array com todos os jogos - AGORA VEM DO BACKEND!
   */
  const [games, setGames] = useState<Game[]>([]);
  
  /**
   * Indica se os jogos estão sendo carregados
   */
  const [loadingGames, setLoadingGames] = useState(true);
  
  /**
   * Indica se o usuário está logado - AGORA VERIFICADO PELO BACKEND!
   */
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  /**
   * Dados do usuário logado
   */
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  /**
   * Controla a exibição do modal de login
   */
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  
  /**
   * Array com todas as reservas do usuário - AGORA VEM DO BACKEND!
   */
  const [reservations, setReservations] = useState<Reservation[]>([]);
  
  /**
   * Indica se as reservas estão sendo carregadas
   */
  const [loadingReservations, setLoadingReservations] = useState(false);
  
  /**
   * Armazena temporariamente um jogo quando o usuário tenta alugar sem estar logado
   */
  const [pendingGameForRent, setPendingGameForRent] = useState<Game | null>(null);

  // --------------------------------------------------------------------------
  // EFEITOS - Carregamento inicial de dados
  // --------------------------------------------------------------------------
  
  /**
   * Carrega os jogos do backend quando o componente é montado
   */
  useEffect(() => {
    loadGames();
    checkAuthentication();
  }, []);

  /**
   * Carrega as reservas quando o usuário faz login
   */
  useEffect(() => {
    if (isLoggedIn) {
      loadReservations();
    }
  }, [isLoggedIn]);

  // --------------------------------------------------------------------------
  // FUNÇÕES DE CARREGAMENTO DE DADOS
  // --------------------------------------------------------------------------
  
  /**
   * Carrega todos os jogos do backend MySQL
   */
  const loadGames = async () => {
    try {
      setLoadingGames(true);
      const gamesData = await api.getGames();
      
      // Converte os dados do backend para o formato do frontend
      const formattedGames = gamesData.map((game: any) => ({
        id: game.id.toString(),
        name: game.name,
        category: game.category,
        summary: game.summary || '',
        price: parseFloat(game.price),
        images: game.images || [],
        description: game.description || '',
        howToPlay: game.how_to_play || '',
        rules: game.rules || [],
        players: game.players || '',
        duration: game.duration || ''
      }));
      
      setGames(formattedGames);
      console.log('✅ Jogos carregados do backend:', formattedGames.length);
    } catch (error: any) {
      console.error('❌ Erro ao carregar jogos:', error);
      alert('Erro ao carregar jogos. Verifique se o backend está rodando.');
    } finally {
      setLoadingGames(false);
    }
  };

  /**
   * Verifica se há um usuário autenticado (token salvo)
   */
  const checkAuthentication = () => {
    const isAuth = api.isAuthenticated();
    if (isAuth) {
      const user = api.getCurrentUser();
      setIsLoggedIn(true);
      setCurrentUser(user);
      console.log('✅ Usuário já autenticado:', user);
    }
  };

  /**
   * Carrega as reservas do usuário logado
   */
  const loadReservations = async () => {
    try {
      setLoadingReservations(true);
      const reservationsData = await api.getReservations('active');
      
      // Converte os dados do backend para o formato do frontend
      const formattedReservations = reservationsData.map((r: any) => ({
        id: r.id.toString(),
        gameId: r.game_id.toString(),
        gameName: r.game_name,
        date: new Date(r.reservation_date),
        status: r.status
      }));
      
      setReservations(formattedReservations);
      console.log('✅ Reservas carregadas:', formattedReservations.length);
    } catch (error: any) {
      console.error('❌ Erro ao carregar reservas:', error);
    } finally {
      setLoadingReservations(false);
    }
  };

  // --------------------------------------------------------------------------
  // FUNÇÕES DE NAVEGAÇÃO - Controlam a navegação entre páginas
  // --------------------------------------------------------------------------
  
  /**
   * Função chamada quando o usuário clica em um card de jogo
   */
  const handleGameSelect = (game: Game) => {
    setSelectedGame(game);
    setCurrentPage('game');
  };

  /**
   * Função chamada quando o usuário clica em "Alugar Jogo"
   */
  const handleRentClick = (game: Game) => {
    if (!isLoggedIn) {
      // Usuário não está logado: salva o jogo e exibe o modal de login
      setPendingGameForRent(game);
      setShowLoginDialog(true);
    } else {
      // Usuário está logado: vai direto para o calendário
      setSelectedGame(game);
      setCurrentPage('calendar');
    }
  };

  // --------------------------------------------------------------------------
  // FUNÇÕES DE AUTENTICAÇÃO - AGORA INTEGRADAS COM BACKEND!
  // --------------------------------------------------------------------------
  
  /**
   * Função chamada quando o usuário faz login
   * AGORA FAZ LOGIN REAL NO BACKEND!
   */
  const handleLogin = async (email: string, password: string) => {
    try {
      console.log('🔐 Tentando fazer login...', email);
      
      // Chama a API de login do backend
      const response = await api.login({ email, password });
      
      console.log('✅ Login bem-sucedido!', response.user);
      
      // Atualiza o estado
      setIsLoggedIn(true);
      setCurrentUser(response.user);
      setShowLoginDialog(false);
      
      // Carrega as reservas do usuário
      await loadReservations();
      
      // Se havia um jogo pendente para alugar, continua o processo
      if (pendingGameForRent) {
        setSelectedGame(pendingGameForRent);
        setCurrentPage('calendar');
        setPendingGameForRent(null);
      }
      
      alert('Login realizado com sucesso!');
      
    } catch (error: any) {
      console.error('❌ Erro no login:', error);
      
      if (error.status === 401) {
        alert('E-mail ou senha incorretos!');
      } else if (error.message.includes('fetch')) {
        alert('Erro de conexão. Verifique se o backend está rodando em http://localhost:3001');
      } else {
        alert('Erro ao fazer login: ' + (error.message || 'Erro desconhecido'));
      }
    }
  };

  /**
   * Função chamada quando o usuário cria uma nova conta
   * AGORA SALVA NO BANCO DE DADOS MYSQL!
   */
  const handleRegister = async (username: string, email: string, password: string) => {
    try {
      console.log('📝 Tentando criar conta...', username, email);
      
      // Chama a API de registro do backend
      const response = await api.register({ 
        username, 
        email, 
        password,
        fullName: username  // Usa username como fullName por padrão
      });
      
      console.log('✅ Conta criada com sucesso!', response.user);
      
      // Atualiza o estado (faz login automático)
      setIsLoggedIn(true);
      setCurrentUser(response.user);
      setShowLoginDialog(false);
      
      // Carrega as reservas (vazio no início)
      await loadReservations();
      
      // Se havia um jogo pendente para alugar, continua o processo
      if (pendingGameForRent) {
        setSelectedGame(pendingGameForRent);
        setCurrentPage('calendar');
        setPendingGameForRent(null);
      }
      
      alert('Conta criada com sucesso! Você já está logado.');
      
    } catch (error: any) {
      console.error('❌ Erro no registro:', error);
      
      if (error.status === 409) {
        alert('Este e-mail ou nome de usuário já está em uso!');
      } else if (error.message.includes('fetch')) {
        alert('Erro de conexão. Verifique se o backend está rodando em http://localhost:3001');
      } else {
        alert('Erro ao criar conta: ' + (error.message || 'Erro desconhecido'));
      }
    }
  };

  /**
   * Função chamada quando o usuário faz logout
   */
  const handleLogout = () => {
    api.logout();
    setIsLoggedIn(false);
    setCurrentUser(null);
    setCurrentPage('home');
    setReservations([]);
    console.log('✅ Logout realizado');
  };

  // --------------------------------------------------------------------------
  // FUNÇÕES DE RESERVA - AGORA SALVAS NO MYSQL!
  // --------------------------------------------------------------------------
  
  /**
   * Função chamada quando o usuário seleciona uma data no calendário
   * AGORA SALVA NO BANCO DE DADOS!
   */
  const handleDateSelect = async (date: Date) => {
    if (!selectedGame) return;
    
    try {
      console.log('📅 Criando reserva...', selectedGame.name, date);
      
      // Formata a data para YYYY-MM-DD
      const formattedDate = date.toISOString().split('T')[0];
      
      // Chama a API para criar a reserva
      await api.createReservation({
        gameId: parseInt(selectedGame.id),
        reservationDate: formattedDate
      });
      
      console.log('✅ Reserva criada com sucesso!');
      
      // Recarrega as reservas
      await loadReservations();
      
      // Navega para a página de gerenciamento de reservas
      setCurrentPage('reservations');
      
      alert('Reserva criada com sucesso!');
      
    } catch (error: any) {
      console.error('❌ Erro ao criar reserva:', error);
      
      if (error.status === 409) {
        alert('Este jogo já está reservado para esta data!');
      } else if (error.status === 401 || error.status === 403) {
        alert('Sua sessão expirou. Por favor, faça login novamente.');
        handleLogout();
      } else {
        alert('Erro ao criar reserva: ' + (error.message || 'Erro desconhecido'));
      }
    }
  };

  /**
   * Função para atualizar a data de uma reserva existente
   * AGORA ATUALIZA NO BANCO DE DADOS!
   */
  const handleUpdateReservation = async (reservationId: string, newDate: Date) => {
    try {
      console.log('✏️ Atualizando reserva...', reservationId, newDate);
      
      // Formata a data para YYYY-MM-DD
      const formattedDate = newDate.toISOString().split('T')[0];
      
      // Chama a API para atualizar a reserva
      await api.updateReservation(parseInt(reservationId), {
        reservationDate: formattedDate
      });
      
      console.log('✅ Reserva atualizada com sucesso!');
      
      // Recarrega as reservas
      await loadReservations();
      
      alert('Reserva atualizada com sucesso!');
      
    } catch (error: any) {
      console.error('❌ Erro ao atualizar reserva:', error);
      
      if (error.status === 401 || error.status === 403) {
        alert('Sua sessão expirou. Por favor, faça login novamente.');
        handleLogout();
      } else {
        alert('Erro ao atualizar reserva: ' + (error.message || 'Erro desconhecido'));
      }
    }
  };

  /**
   * Função para cancelar uma reserva
   * AGORA CANCELA NO BANCO DE DADOS!
   */
  const handleCancelReservation = async (reservationId: string) => {
    try {
      console.log('🗑️ Cancelando reserva...', reservationId);
      
      // Chama a API para cancelar a reserva
      await api.cancelReservation(parseInt(reservationId));
      
      console.log('✅ Reserva cancelada com sucesso!');
      
      // Recarrega as reservas
      await loadReservations();
      
      alert('Reserva cancelada com sucesso!');
      
    } catch (error: any) {
      console.error('❌ Erro ao cancelar reserva:', error);
      
      if (error.status === 401 || error.status === 403) {
        alert('Sua sessão expirou. Por favor, faça login novamente.');
        handleLogout();
      } else {
        alert('Erro ao cancelar reserva: ' + (error.message || 'Erro desconhecido'));
      }
    }
  };

  // --------------------------------------------------------------------------
  // RENDERIZAÇÃO - Estrutura visual da aplicação
  // --------------------------------------------------------------------------
  
  // Tela de carregamento enquanto busca os jogos
  if (loadingGames) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Carregando jogos do banco de dados...</p>
          <p className="text-sm text-slate-400 mt-2">Verifique se o backend está rodando em http://localhost:3001</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Cabeçalho fixo no topo com navegação e login */}
      <Header 
        isLoggedIn={isLoggedIn}
        onLoginClick={() => setShowLoginDialog(true)}
        onLogout={handleLogout}
        onNavigateHome={() => setCurrentPage('home')}
        onNavigateReservations={() => setCurrentPage('reservations')}
        hasReservations={reservations.some(r => r.status === 'active')}
      />
      
      {/* Conteúdo principal - muda conforme a página atual */}
      <main className="flex-1">
        {/* Página Inicial - Catálogo de jogos DO BACKEND! */}
        {currentPage === 'home' && (
          <HomePage games={games} onGameSelect={handleGameSelect} />
        )}
        
        {/* Página de Detalhes do Jogo */}
        {currentPage === 'game' && selectedGame && (
          <GameDetailsPage 
            game={selectedGame} 
            onRentClick={() => handleRentClick(selectedGame)}
            onBack={() => setCurrentPage('home')}
          />
        )}
        
        {/* Página de Calendário - Seleção de data para aluguel */}
        {currentPage === 'calendar' && selectedGame && (
          <CalendarPage 
            key={`calendar-${selectedGame.id}-${Date.now()}`}  // Força remontagem para buscar datas atualizadas
            game={selectedGame}
            onDateSelect={handleDateSelect}
            onBack={() => setCurrentPage('game')}
            existingReservations={reservations}
          />
        )}
        
        {/* Página de Gerenciamento de Reservas */}
        {currentPage === 'reservations' && (
          <>
            {loadingReservations ? (
              <div className="text-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-indigo-600 mx-auto mb-4"></div>
                <p className="text-slate-600">Carregando reservas...</p>
              </div>
            ) : (
              <ReservationManagement 
                reservations={reservations}
                onUpdateReservation={handleUpdateReservation}
                onCancelReservation={handleCancelReservation}
                onBack={() => setCurrentPage('home')}
              />
            )}
          </>
        )}
      </main>
      
      {/* Rodapé com informações de contato */}
      <Footer />
      
      {/* Modal de Login/Registro - AGORA COM BACKEND REAL! */}
      <LoginDialog 
        open={showLoginDialog}
        onClose={() => {
          setShowLoginDialog(false);
          setPendingGameForRent(null);
        }}
        onLogin={handleLogin}
        onRegister={handleRegister}
      />
    </div>
  );
}

export default App;