// ============================================================================
// ROTAS DE USUÁRIOS
// ============================================================================

const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

// ============================================================================
// GET /api/users/profile - Perfil do usuário logado
// ============================================================================

router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Busca dados do usuário
    const [users] = await db.query(
      `SELECT id, username, email, full_name, phone, created_at 
       FROM users 
       WHERE id = ?`,
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({
        error: 'Usuário não encontrado'
      });
    }

    const user = users[0];

    // Busca estatísticas do usuário
    const [stats] = await db.query(
      `SELECT 
        COUNT(*) as total_reservations,
        SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active_reservations,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_reservations,
        SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled_reservations,
        SUM(total_price) as total_spent
       FROM reservations 
       WHERE user_id = ?`,
      [userId]
    );

    user.stats = stats[0];

    console.log(`✅ Perfil carregado: ${user.username}`);

    res.json({
      success: true,
      user
    });

  } catch (error) {
    console.error('❌ Erro ao buscar perfil:', error);
    res.status(500).json({
      error: 'Erro ao buscar perfil',
      message: error.message
    });
  }
});

module.exports = router;
