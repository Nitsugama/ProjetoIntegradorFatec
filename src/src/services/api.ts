// ============================================================================
// SERVIÇO DE API - Comunicação com o Backend
// ============================================================================

/**
 * URL base da API
 * Em desenvolvimento: http://localhost:3001
 * Em produção: substitua pela URL do seu backend
 */
const API_URL = 'http://localhost:3001/api';

/**
 * Interface para respostas de erro padronizadas
 */
interface ApiError {
  error: string;
  message?: string;
  details?: any;
}

/**
 * Classe para erros customizados da API
 */
export class APIError extends Error {
  status: number;
  data: ApiError;

  constructor(status: number, data: ApiError) {
    super(data.message || data.error);
    this.status = status;
    this.data = data;
  }
}

/**
 * Função auxiliar para fazer requisições HTTP
 * Adiciona automaticamente o token de autenticação se existir
 * 
 * @param endpoint - Caminho da API (ex: '/games', '/auth/login')
 * @param options - Opções do fetch (method, body, etc)
 * @returns Promise com os dados da resposta
 */
async function fetchAPI<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  // Pega o token salvo no localStorage
  const token = localStorage.getItem('authToken');

  // Configura os headers padrão
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Adiciona o token se existir
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Faz a requisição
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Tenta parsear a resposta como JSON
  let data: any;
  try {
    data = await response.json();
  } catch (e) {
    // Se não for JSON, usa texto
    data = await response.text();
  }

  // Se a resposta não foi bem-sucedida, lança erro
  if (!response.ok) {
    throw new APIError(response.status, data);
  }

  return data;
}

// ============================================================================
// AUTENTICAÇÃO
// ============================================================================

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  fullName?: string;
  phone?: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: {
    id: number;
    username: string;
    email: string;
    fullName?: string;
  };
}

/**
 * Faz login no sistema
 */
export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  const response = await fetchAPI<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });

  // Salva o token no localStorage
  localStorage.setItem('authToken', response.token);
  localStorage.setItem('user', JSON.stringify(response.user));

  return response;
}

/**
 * Registra novo usuário
 */
export async function register(data: RegisterData): Promise<AuthResponse> {
  const response = await fetchAPI<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });

  // Salva o token no localStorage
  localStorage.setItem('authToken', response.token);
  localStorage.setItem('user', JSON.stringify(response.user));

  return response;
}

/**
 * Faz logout (limpa dados locais)
 */
export function logout(): void {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
}

/**
 * Verifica se o usuário está autenticado
 */
export function isAuthenticated(): boolean {
  return !!localStorage.getItem('authToken');
}

/**
 * Pega os dados do usuário logado (salvos localmente)
 */
export function getCurrentUser() {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
}

// ============================================================================
// JOGOS
// ============================================================================

export interface Game {
  id: number;
  name: string;
  category: string;
  summary: string;
  description: string;
  how_to_play: string;
  price: number;
  players: string;
  duration: string;
  stock: number;
  available: boolean;
  images: string[];
  rules: string[];
  reservedDates?: string[];  // Datas já reservadas
}

export interface GamesResponse {
  success: boolean;
  count: number;
  games: Game[];
}

export interface GameResponse {
  success: boolean;
  game: Game;
}

/**
 * Busca todos os jogos disponíveis
 */
export async function getGames(): Promise<Game[]> {
  const response = await fetchAPI<GamesResponse>('/games');
  return response.games;
}

/**
 * Busca detalhes de um jogo específico
 */
export async function getGame(id: number): Promise<Game> {
  const response = await fetchAPI<GameResponse>(`/games/${id}`);
  return response.game;
}

// ============================================================================
// RESERVAS
// ============================================================================

export interface Reservation {
  id: number;
  game_id: number;
  game_name: string;
  game_category: string;
  game_price: number;
  reservation_date: string;
  return_date?: string;
  status: 'active' | 'completed' | 'cancelled';
  total_price: number;
  notes?: string;
  created_at: string;
}

export interface ReservationsResponse {
  success: boolean;
  count: number;
  reservations: Reservation[];
}

export interface CreateReservationData {
  gameId: number;
  reservationDate: string;  // Formato: YYYY-MM-DD
  returnDate?: string;
  notes?: string;
}

export interface UpdateReservationData {
  reservationDate?: string;
  returnDate?: string;
  status?: 'active' | 'completed' | 'cancelled';
  notes?: string;
}

/**
 * Busca todas as reservas do usuário logado
 */
export async function getReservations(status?: string): Promise<Reservation[]> {
  const queryParams = status ? `?status=${status}` : '';
  const response = await fetchAPI<ReservationsResponse>(`/reservations${queryParams}`);
  return response.reservations;
}

/**
 * Cria uma nova reserva
 */
export async function createReservation(data: CreateReservationData): Promise<any> {
  return fetchAPI('/reservations', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Atualiza uma reserva existente
 */
export async function updateReservation(
  id: number,
  data: UpdateReservationData
): Promise<any> {
  return fetchAPI(`/reservations/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/**
 * Cancela uma reserva
 */
export async function cancelReservation(id: number): Promise<any> {
  return fetchAPI(`/reservations/${id}`, {
    method: 'DELETE',
  });
}

// ============================================================================
// USUÁRIO
// ============================================================================

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  full_name?: string;
  phone?: string;
  created_at: string;
  stats: {
    total_reservations: number;
    active_reservations: number;
    completed_reservations: number;
    cancelled_reservations: number;
    total_spent: number;
  };
}

export interface ProfileResponse {
  success: boolean;
  user: UserProfile;
}

/**
 * Busca perfil do usuário logado
 */
export async function getProfile(): Promise<UserProfile> {
  const response = await fetchAPI<ProfileResponse>('/users/profile');
  return response.user;
}

// ============================================================================
// EXPORTAÇÕES
// ============================================================================

const api = {
  // Auth
  login,
  register,
  logout,
  isAuthenticated,
  getCurrentUser,
  
  // Games
  getGames,
  getGame,
  
  // Reservations
  getReservations,
  createReservation,
  updateReservation,
  cancelReservation,
  
  // User
  getProfile,
};

export default api;
