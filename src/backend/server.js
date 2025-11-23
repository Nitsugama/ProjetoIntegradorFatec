// ============================================================================
// SERVER.JS - SERVIDOR PRINCIPAL DO BACKEND GAMERENT
// ============================================================================

const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Importa as rotas
const authRoutes = require('./routes/auth');
const gamesRoutes = require('./routes/games');
const reservationsRoutes = require('./routes/reservations');
const usersRoutes = require('./routes/users');

// Cria a aplicação Express
const app = express();
const PORT = process.env.PORT || 3001;

// ============================================================================
// MIDDLEWARES
// ============================================================================

// CORS - permite que o frontend (porta 5173) acesse o backend (porta 3001)
app.use(cors({
  origin: 'http://localhost:5173',  // URL do frontend
  credentials: true
}));

// Parser de JSON - permite receber JSON no body das requisições
app.use(express.json());

// Parser de URL encoded - permite receber dados de formulários
app.use(express.urlencoded({ extended: true }));

// Logging simples de requisições
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ============================================================================
// ROTAS
// ============================================================================

// Rota de teste
app.get('/', (req, res) => {
  res.json({
    message: '🎮 GameRent API - Sistema de Aluguel de Jogos',
    version: '1.0.0',
    status: 'online',
    endpoints: {
      auth: '/api/auth (POST /register, POST /login)',
      games: '/api/games (GET /)',
      reservations: '/api/reservations (GET /, POST /, PUT /:id, DELETE /:id)',
      users: '/api/users (GET /profile)'
    }
  });
});

// Health check - verifica se a API está funcionando
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/games', gamesRoutes);
app.use('/api/reservations', reservationsRoutes);
app.use('/api/users', usersRoutes);

// ============================================================================
// TRATAMENTO DE ERROS
// ============================================================================

// Rota não encontrada (404)
app.use((req, res) => {
  res.status(404).json({
    error: 'Rota não encontrada',
    path: req.path,
    method: req.method
  });
});

// Erro geral
app.use((err, req, res, next) => {
  console.error('❌ Erro:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Erro interno do servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// ============================================================================
// INICIALIZAÇÃO DO SERVIDOR
// ============================================================================

app.listen(PORT, () => {
  console.log('\n╔════════════════════════════════════════╗');
  console.log('║   🎮 GameRent API - SERVIDOR ONLINE   ║');
  console.log('╚════════════════════════════════════════╝\n');
  console.log(`   → Rodando em: http://localhost:${PORT}`);
  console.log(`   → Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`   → Frontend esperado em: http://localhost:5173`);
  console.log('\n   Rotas disponíveis:');
  console.log('   • POST /api/auth/register - Cadastro');
  console.log('   • POST /api/auth/login - Login');
  console.log('   • GET  /api/games - Listar jogos');
  console.log('   • GET  /api/games/:id - Detalhes do jogo');
  console.log('   • GET  /api/reservations - Minhas reservas');
  console.log('   • POST /api/reservations - Criar reserva');
  console.log('   • PUT  /api/reservations/:id - Atualizar reserva');
  console.log('   • DELETE /api/reservations/:id - Cancelar reserva\n');
});

// Tratamento de shutdown gracioso
process.on('SIGTERM', () => {
  console.log('\n⚠️  SIGTERM recebido. Encerrando servidor...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\n\n⚠️  SIGINT recebido (Ctrl+C). Encerrando servidor...');
  process.exit(0);
});
