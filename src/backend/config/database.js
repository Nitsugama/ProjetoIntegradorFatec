// ============================================================================
// CONFIGURAÇÃO DO BANCO DE DADOS MYSQL
// ============================================================================

const mysql = require('mysql2');
require('dotenv').config();

/**
 * Cria um pool de conexões com o MySQL
 * Pool = conjunto de conexões reutilizáveis (melhor performance)
 */
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '2602',
  database: process.env.DB_NAME || 'gamerent_db',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,  // Máximo de 10 conexões simultâneas
  queueLimit: 0,        // Sem limite de fila
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

/**
 * Testa a conexão com o banco de dados
 */
pool.getConnection((err, connection) => {
  if (err) {
    console.error('❌ Erro ao conectar com MySQL:', err.message);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.error('   → Conexão com o banco foi perdida');
    }
    if (err.code === 'ER_CON_COUNT_ERROR') {
      console.error('   → Muitas conexões simultâneas');
    }
    if (err.code === 'ECONNREFUSED') {
      console.error('   → Conexão recusada. Verifique se o MySQL está rodando!');
    }
    if (err.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('   → Acesso negado. Verifique usuário e senha!');
    }
    process.exit(1);
  }
  
  if (connection) {
    console.log('✅ Conectado ao MySQL com sucesso!');
    console.log(`   → Banco: ${process.env.DB_NAME}`);
    console.log(`   → Host: ${process.env.DB_HOST}:${process.env.DB_PORT}`);
    connection.release();
  }
});

// Exporta o pool com suporte a Promises
module.exports = pool.promise();
