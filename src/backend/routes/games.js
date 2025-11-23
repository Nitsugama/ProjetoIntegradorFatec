// ============================================================================
// ROTAS DE JOGOS
// ============================================================================

const express = require('express');
const router = express.Router();
const db = require('../config/database');

// ============================================================================
// GET /api/games - Lista todos os jogos disponíveis
// ============================================================================

router.get('/', async (req, res) => {
  try {
    // Busca todos os jogos
    const [games] = await db.query(`
      SELECT 
        g.id,
        g.name,
        g.category,
        g.summary,
        g.description,
        g.how_to_play,
        g.price,
        g.players,
        g.duration,
        g.stock,
        g.available
      FROM games g
      WHERE g.available = TRUE
      ORDER BY g.name
    `);

    // Para cada jogo, busca as imagens
    for (let game of games) {
      const [images] = await db.query(
        'SELECT image_url FROM game_images WHERE game_id = ? ORDER BY display_order',
        [game.id]
      );
      game.images = images.map(img => img.image_url);

      // Busca as regras
      const [rules] = await db.query(
        'SELECT rule_text FROM game_rules WHERE game_id = ? ORDER BY rule_order',
        [game.id]
      );
      game.rules = rules.map(rule => rule.rule_text);
    }

    console.log(`✅ Listados ${games.length} jogos`);

    res.json({
      success: true,
      count: games.length,
      games
    });

  } catch (error) {
    console.error('❌ Erro ao buscar jogos:', error);
    res.status(500).json({
      error: 'Erro ao buscar jogos',
      message: error.message
    });
  }
});

// ============================================================================
// GET /api/games/:id/reserved-dates - Busca apenas as datas reservadas
// ============================================================================
// IMPORTANTE: Esta rota DEVE vir ANTES de /:id para não ser capturada como ID

router.get('/:id/reserved-dates', async (req, res) => {
  try {
    const gameId = req.params.id;

    // Busca todas as datas com reservas ativas para este jogo
    const [reservations] = await db.query(
      `SELECT DISTINCT DATE_FORMAT(reservation_date, '%Y-%m-%d') as reservation_date
       FROM reservations 
       WHERE game_id = ? AND status = 'active'
       ORDER BY reservation_date`,
      [gameId]
    );

    const reservedDates = reservations.map(r => r.reservation_date);

    console.log(`✅ Datas reservadas do jogo ${gameId}: ${reservedDates.length} datas`);

    res.json({
      success: true,
      gameId: parseInt(gameId),
      count: reservedDates.length,
      reservedDates
    });

  } catch (error) {
    console.error('❌ Erro ao buscar datas reservadas:', error);
    res.status(500).json({
      error: 'Erro ao buscar datas reservadas',
      message: error.message
    });
  }
});

// ============================================================================
// GET /api/games/:id/availability - Verifica disponibilidade de um jogo
// ============================================================================
// IMPORTANTE: Esta rota DEVE vir ANTES de /:id para não ser capturada como ID

router.get('/:id/availability', async (req, res) => {
  try {
    const gameId = req.params.id;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({
        error: 'Data não fornecida',
        message: 'Parâmetro "date" é obrigatório (formato: YYYY-MM-DD)'
      });
    }

    // Verifica se o jogo existe
    const [games] = await db.query(
      'SELECT stock FROM games WHERE id = ? AND available = TRUE',
      [gameId]
    );

    if (games.length === 0) {
      return res.status(404).json({
        error: 'Jogo não encontrado'
      });
    }

    const totalStock = games[0].stock;

    // Conta quantas reservas ativas existem para aquela data
    const [reservations] = await db.query(
      `SELECT COUNT(*) as count 
       FROM reservations 
       WHERE game_id = ? AND reservation_date = ? AND status = 'active'`,
      [gameId, date]
    );

    const reservedCount = reservations[0].count;
    const available = reservedCount < totalStock;

    res.json({
      available,
      totalStock,
      reservedCount,
      availableStock: totalStock - reservedCount
    });

  } catch (error) {
    console.error('❌ Erro ao verificar disponibilidade:', error);
    res.status(500).json({
      error: 'Erro ao verificar disponibilidade',
      message: error.message
    });
  }
});

// ============================================================================
// GET /api/games/:id - Detalhes de um jogo específico
// ============================================================================
// IMPORTANTE: Esta rota DEVE vir DEPOIS das rotas específicas (reserved-dates, availability)

router.get('/:id', async (req, res) => {
  try {
    const gameId = req.params.id;

    // Busca o jogo
    const [games] = await db.query(
      'SELECT * FROM games WHERE id = ? AND available = TRUE',
      [gameId]
    );

    if (games.length === 0) {
      return res.status(404).json({
        error: 'Jogo não encontrado',
        message: 'O jogo solicitado não existe ou não está disponível'
      });
    }

    const game = games[0];

    // Busca imagens
    const [images] = await db.query(
      'SELECT image_url FROM game_images WHERE game_id = ? ORDER BY display_order',
      [gameId]
    );
    game.images = images.map(img => img.image_url);

    // Busca regras
    const [rules] = await db.query(
      'SELECT rule_text FROM game_rules WHERE game_id = ? ORDER BY rule_order',
      [gameId]
    );
    game.rules = rules.map(rule => rule.rule_text);

    // Busca datas reservadas (para mostrar indisponibilidade no calendário)
    const [reservations] = await db.query(
      `SELECT reservation_date 
       FROM reservations 
       WHERE game_id = ? AND status = 'active'
       ORDER BY reservation_date`,
      [gameId]
    );
    game.reservedDates = reservations.map(r => r.reservation_date);

    console.log(`✅ Detalhes do jogo: ${game.name} (ID: ${gameId})`);

    res.json({
      success: true,
      game
    });

  } catch (error) {
    console.error('❌ Erro ao buscar jogo:', error);
    res.status(500).json({
      error: 'Erro ao buscar jogo',
      message: error.message
    });
  }
});

module.exports = router;