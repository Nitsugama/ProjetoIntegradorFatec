// ============================================================================
// ROTAS DE AUTENTICAÇÃO (Registro e Login)
// ============================================================================

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const db = require('../config/database');

// ============================================================================
// POST /api/auth/register - Cadastro de novo usuário
// ============================================================================

router.post('/register',
  // Validações
  [
    body('username')
      .trim()
      .isLength({ min: 3, max: 50 })
      .withMessage('Nome de usuário deve ter entre 3 e 50 caracteres')
      .matches(/^[a-zA-Z0-9_]+$/)
      .withMessage('Nome de usuário pode conter apenas letras, números e _'),
    body('email')
      .trim()
      .isEmail()
      .withMessage('E-mail inválido')
      .normalizeEmail(),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Senha deve ter no mínimo 6 caracteres'),
    body('fullName')
      .optional()
      .trim()
      .isLength({ max: 100 })
  ],
  async (req, res) => {
    try {
      // Verifica erros de validação
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Dados inválidos',
          details: errors.array()
        });
      }

      const { username, email, password, fullName, phone } = req.body;

      // Verifica se usuário já existe (username)
      const [existingUser] = await db.query(
        'SELECT id FROM users WHERE username = ? OR email = ?',
        [username, email]
      );

      if (existingUser.length > 0) {
        return res.status(409).json({
          error: 'Usuário já existe',
          message: 'Nome de usuário ou e-mail já cadastrado'
        });
      }

      // Criptografa a senha (10 rounds de salt)
      const passwordHash = await bcrypt.hash(password, 10);

      // Insere o novo usuário no banco
      const [result] = await db.query(
        `INSERT INTO users (username, email, password_hash, full_name, phone) 
         VALUES (?, ?, ?, ?, ?)`,
        [username, email, passwordHash, fullName || null, phone || null]
      );

      // Gera token JWT para login automático
      const token = jwt.sign(
        { 
          id: result.insertId,
          username: username,
          email: email
        },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }  // Token válido por 7 dias
      );

      console.log(`✅ Novo usuário cadastrado: ${username} (ID: ${result.insertId})`);

      res.status(201).json({
        message: 'Usuário cadastrado com sucesso!',
        token,
        user: {
          id: result.insertId,
          username,
          email,
          fullName: fullName || null
        }
      });

    } catch (error) {
      console.error('❌ Erro no registro:', error);
      res.status(500).json({
        error: 'Erro ao cadastrar usuário',
        message: error.message
      });
    }
  }
);

// ============================================================================
// POST /api/auth/login - Login de usuário
// ============================================================================

router.post('/login',
  // Validações
  [
    body('email')
      .trim()
      .notEmpty()
      .withMessage('E-mail é obrigatório'),
    body('password')
      .notEmpty()
      .withMessage('Senha é obrigatória')
  ],
  async (req, res) => {
    try {
      // Verifica erros de validação
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Dados inválidos',
          details: errors.array()
        });
      }

      const { email, password } = req.body;

      // Busca usuário no banco (pode ser email ou username)
      const [users] = await db.query(
        'SELECT * FROM users WHERE email = ? OR username = ? LIMIT 1',
        [email, email]
      );

      // Usuário não encontrado
      if (users.length === 0) {
        return res.status(401).json({
          error: 'Credenciais inválidas',
          message: 'E-mail/usuário ou senha incorretos'
        });
      }

      const user = users[0];

      // Verifica a senha
      const validPassword = await bcrypt.compare(password, user.password_hash);

      if (!validPassword) {
        return res.status(401).json({
          error: 'Credenciais inválidas',
          message: 'E-mail/usuário ou senha incorretos'
        });
      }

      // Gera token JWT
      const token = jwt.sign(
        {
          id: user.id,
          username: user.username,
          email: user.email
        },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      console.log(`✅ Login bem-sucedido: ${user.username} (ID: ${user.id})`);

      res.json({
        message: 'Login realizado com sucesso!',
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          fullName: user.full_name
        }
      });

    } catch (error) {
      console.error('❌ Erro no login:', error);
      res.status(500).json({
        error: 'Erro ao fazer login',
        message: error.message
      });
    }
  }
);

// ============================================================================
// POST /api/auth/verify - Verifica se o token é válido
// ============================================================================

router.post('/verify', async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        valid: false,
        message: 'Token não fornecido'
      });
    }

    // Verifica o token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Busca usuário atualizado no banco
    const [users] = await db.query(
      'SELECT id, username, email, full_name FROM users WHERE id = ?',
      [decoded.id]
    );

    if (users.length === 0) {
      return res.status(404).json({
        valid: false,
        message: 'Usuário não encontrado'
      });
    }

    res.json({
      valid: true,
      user: {
        id: users[0].id,
        username: users[0].username,
        email: users[0].email,
        fullName: users[0].full_name
      }
    });

  } catch (error) {
    res.status(401).json({
      valid: false,
      message: 'Token inválido ou expirado'
    });
  }
});

module.exports = router;
