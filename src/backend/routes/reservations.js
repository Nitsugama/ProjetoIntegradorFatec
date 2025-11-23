// ============================================================================
// ROTAS DE RESERVAS
// ============================================================================

const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

// Todas as rotas de reservas exigem autenticação
router.use(authenticateToken);

// ============================================================================
// GET /api/reservations - Lista reservas do usuário logado
// ============================================================================

router.get('/', async (req, res) => {
  try {
    const userId = req.user.id;
    const { status } = req.query;  // Filtro opcional por status

    let query = `
      SELECT 
        r.id,
        r.game_id,
        r.reservation_date,
        r.return_date,
        r.status,
        r.total_price,
        r.notes,
        r.created_at,
        g.name as game_name,
        g.category as game_category,
        g.price as game_price
      FROM reservations r
      JOIN games g ON r.game_id = g.id
      WHERE r.user_id = ?
    `;

    const params = [userId];

    // Filtro por status (opcional)
    if (status) {
      query += ' AND r.status = ?';
      params.push(status);
    }

    query += ' ORDER BY r.reservation_date DESC';

    const [reservations] = await db.query(query, params);

    console.log(`✅ ${reservations.length} reservas encontradas para usuário ${userId}`);

    res.json({
      success: true,
      count: reservations.length,
      reservations
    });

  } catch (error) {
    console.error('❌ Erro ao buscar reservas:', error);
    res.status(500).json({
      error: 'Erro ao buscar reservas',
      message: error.message
    });
  }
});

// ============================================================================
// POST /api/reservations - Criar nova reserva
// ============================================================================

router.post('/',
  [
    body('gameId')
      .isInt({ min: 1 })
      .withMessage('ID do jogo inválido'),
    body('reservationDate')
      .isDate()
      .withMessage('Data de reserva inválida (formato: YYYY-MM-DD)'),
    body('returnDate')
      .optional()
      .isDate()
      .withMessage('Data de devolução inválida')
  ],
  async (req, res) => {
    try {
      // Valida dados
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Dados inválidos',
          details: errors.array()
        });
      }

      const userId = req.user.id;
      const { gameId, reservationDate, returnDate, notes } = req.body;

      // Verifica se o jogo existe e está disponível
      const [games] = await db.query(
        'SELECT id, name, price, stock FROM games WHERE id = ? AND available = TRUE',
        [gameId]
      );

      if (games.length === 0) {
        return res.status(404).json({
          error: 'Jogo não encontrado',
          message: 'O jogo solicitado não existe ou não está disponível'
        });
      }

      const game = games[0];

      // Verifica se a data não está no passado
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const resDate = new Date(reservationDate);
      
      if (resDate < today) {
        return res.status(400).json({
          error: 'Data inválida',
          message: 'Não é possível fazer reserva para datas passadas'
        });
      }

      // Verifica disponibilidade para aquela data
      const [existing] = await db.query(
        `SELECT COUNT(*) as count 
         FROM reservations 
         WHERE game_id = ? AND reservation_date = ? AND status = 'active'`,
        [gameId, reservationDate]
      );

      if (existing[0].count >= game.stock) {
        return res.status(409).json({
          error: 'Jogo indisponível',
          message: 'Este jogo já está totalmente reservado para esta data'
        });
      }

      // Calcula o preço total (por enquanto, apenas o preço do jogo)
      const totalPrice = game.price;

      // Cria a reserva
      const [result] = await db.query(
        `INSERT INTO reservations 
         (user_id, game_id, reservation_date, return_date, status, total_price, notes) 
         VALUES (?, ?, ?, ?, 'active', ?, ?)`,
        [userId, gameId, reservationDate, returnDate || null, totalPrice, notes || null]
      );

      console.log(`✅ Reserva criada: ${game.name} para ${reservationDate} (ID: ${result.insertId})`);

      res.status(201).json({
        success: true,
        message: 'Reserva criada com sucesso!',
        reservation: {
          id: result.insertId,
          gameId,
          gameName: game.name,
          reservationDate,
          returnDate: returnDate || null,
          totalPrice,
          status: 'active'
        }
      });

    } catch (error) {
      console.error('❌ Erro ao criar reserva:', error);
      res.status(500).json({
        error: 'Erro ao criar reserva',
        message: error.message
      });
    }
  }
);

// ============================================================================
// PUT /api/reservations/:id - Atualizar reserva
// ============================================================================

router.put('/:id',
  [
    body('reservationDate')
      .optional()
      .isDate()
      .withMessage('Data de reserva inválida'),
    body('returnDate')
      .optional()
      .isDate()
      .withMessage('Data de devolução inválida'),
    body('status')
      .optional()
      .isIn(['active', 'completed', 'cancelled'])
      .withMessage('Status inválido')
  ],
  async (req, res) => {
    try {
      // Valida dados
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Dados inválidos',
          details: errors.array()
        });
      }

      const reservationId = req.params.id;
      const userId = req.user.id;
      const { reservationDate, returnDate, status, notes } = req.body;

      // Verifica se a reserva existe e pertence ao usuário
      const [reservations] = await db.query(
        'SELECT * FROM reservations WHERE id = ? AND user_id = ?',
        [reservationId, userId]
      );

      if (reservations.length === 0) {
        return res.status(404).json({
          error: 'Reserva não encontrada',
          message: 'A reserva não existe ou você não tem permissão para alterá-la'
        });
      }

      const reservation = reservations[0];

      // Não permite alterar reservas canceladas ou completadas
      if (reservation.status !== 'active' && status !== 'cancelled') {
        return res.status(400).json({
          error: 'Operação inválida',
          message: 'Não é possível alterar uma reserva que não está ativa'
        });
      }

      // Monta a query de update dinamicamente
      const updates = [];
      const values = [];

      if (reservationDate) {
        updates.push('reservation_date = ?');
        values.push(reservationDate);
      }
      if (returnDate !== undefined) {
        updates.push('return_date = ?');
        values.push(returnDate);
      }
      if (status) {
        updates.push('status = ?');
        values.push(status);
      }
      if (notes !== undefined) {
        updates.push('notes = ?');
        values.push(notes);
      }

      if (updates.length === 0) {
        return res.status(400).json({
          error: 'Nenhum campo para atualizar'
        });
      }

      values.push(reservationId, userId);

      await db.query(
        `UPDATE reservations SET ${updates.join(', ')} WHERE id = ? AND user_id = ?`,
        values
      );

      console.log(`✅ Reserva ${reservationId} atualizada`);

      res.json({
        success: true,
        message: 'Reserva atualizada com sucesso!'
      });

    } catch (error) {
      console.error('❌ Erro ao atualizar reserva:', error);
      res.status(500).json({
        error: 'Erro ao atualizar reserva',
        message: error.message
      });
    }
  }
);

// ============================================================================
// DELETE /api/reservations/:id - Cancelar reserva
// ============================================================================

router.delete('/:id', async (req, res) => {
  try {
    const reservationId = req.params.id;
    const userId = req.user.id;

    // Verifica se a reserva existe e pertence ao usuário
    const [reservations] = await db.query(
      'SELECT * FROM reservations WHERE id = ? AND user_id = ?',
      [reservationId, userId]
    );

    if (reservations.length === 0) {
      return res.status(404).json({
        error: 'Reserva não encontrada',
        message: 'A reserva não existe ou você não tem permissão para cancelá-la'
      });
    }

    const reservation = reservations[0];

    // Verifica se já está cancelada
    if (reservation.status === 'cancelled') {
      return res.status(400).json({
        error: 'Reserva já cancelada',
        message: 'Esta reserva já foi cancelada anteriormente'
      });
    }

    // Cancela a reserva (não deleta, apenas muda o status)
    await db.query(
      'UPDATE reservations SET status = "cancelled" WHERE id = ?',
      [reservationId]
    );

    console.log(`✅ Reserva ${reservationId} cancelada`);

    res.json({
      success: true,
      message: 'Reserva cancelada com sucesso!'
    });

  } catch (error) {
    console.error('❌ Erro ao cancelar reserva:', error);
    res.status(500).json({
      error: 'Erro ao cancelar reserva',
      message: error.message
    });
  }
});

module.exports = router;
