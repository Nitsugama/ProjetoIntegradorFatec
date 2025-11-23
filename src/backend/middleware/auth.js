// ============================================================================
// MIDDLEWARE DE AUTENTICAÇÃO
// ============================================================================

const jwt = require('jsonwebtoken');

/**
 * Middleware que verifica se o usuário está autenticado
 * Valida o token JWT enviado no header Authorization
 * 
 * Como usar:
 * - O frontend deve enviar: Authorization: Bearer TOKEN_AQUI
 * - Se válido, adiciona req.user com os dados do usuário
 * - Se inválido, retorna erro 401 (não autorizado)
 */
const authenticateToken = (req, res, next) => {
  // Pega o header de autorização
  const authHeader = req.headers['authorization'];
  
  // O token vem no formato: "Bearer TOKEN_AQUI"
  // Precisamos extrair apenas o TOKEN_AQUI
  const token = authHeader && authHeader.split(' ')[1];

  // Se não tem token, retorna erro
  if (!token) {
    return res.status(401).json({
      error: 'Acesso negado',
      message: 'Token de autenticação não fornecido'
    });
  }

  // Verifica se o token é válido
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      // Token inválido ou expirado
      return res.status(403).json({
        error: 'Token inválido',
        message: 'Token de autenticação inválido ou expirado'
      });
    }

    // Token válido! Adiciona os dados do usuário na requisição
    // Agora qualquer rota pode acessar req.user
    req.user = user;
    next();
  });
};

/**
 * Middleware opcional que tenta autenticar mas não bloqueia se falhar
 * Útil para rotas que funcionam com ou sem login
 */
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    // Sem token, mas não bloqueia a requisição
    req.user = null;
    return next();
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      // Token inválido, mas não bloqueia
      req.user = null;
    } else {
      // Token válido
      req.user = user;
    }
    next();
  });
};

module.exports = {
  authenticateToken,
  optionalAuth
};
