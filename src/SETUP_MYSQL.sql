-- ============================================================================
-- GAMERENT - BANCO DE DADOS MYSQL
-- ============================================================================
-- Este arquivo cria todo o banco de dados do sistema GameRent
-- 
-- INSTRUÇÕES:
-- 1. Abra seu cliente MySQL (MySQL Workbench, phpMyAdmin, ou terminal)
-- 2. Conecte com as credenciais:
--    Usuário: root
--    Senha: 2602
-- 3. Copie TODO este arquivo
-- 4. Cole e execute no MySQL
-- 5. O banco 'gamerent_db' será criado com todos os dados
-- ============================================================================

-- Remove o banco se já existir (cuidado: apaga todos os dados!)
DROP DATABASE IF EXISTS gamerent_db;

-- Cria o banco de dados
CREATE DATABASE gamerent_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Seleciona o banco para uso
USE gamerent_db;

-- ============================================================================
-- TABELA: users (Usuários do sistema)
-- ============================================================================

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(100),
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABELA: games (Jogos disponíveis para aluguel)
-- ============================================================================

CREATE TABLE games (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  category VARCHAR(50) NOT NULL,
  summary TEXT,
  description TEXT,
  how_to_play TEXT,
  price DECIMAL(10,2) NOT NULL,
  players VARCHAR(50),
  duration VARCHAR(50),
  stock INT DEFAULT 1,
  available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_category (category),
  INDEX idx_available (available)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABELA: game_images (Imagens dos jogos)
-- ============================================================================

CREATE TABLE game_images (
  id INT AUTO_INCREMENT PRIMARY KEY,
  game_id INT NOT NULL,
  image_url VARCHAR(500) NOT NULL,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE,
  INDEX idx_game_id (game_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABELA: game_rules (Regras dos jogos)
-- ============================================================================

CREATE TABLE game_rules (
  id INT AUTO_INCREMENT PRIMARY KEY,
  game_id INT NOT NULL,
  rule_text TEXT NOT NULL,
  rule_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE,
  INDEX idx_game_id (game_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABELA: reservations (Reservas de jogos)
-- ============================================================================

CREATE TABLE reservations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  game_id INT NOT NULL,
  reservation_date DATE NOT NULL,
  return_date DATE,
  status ENUM('active', 'completed', 'cancelled') DEFAULT 'active',
  total_price DECIMAL(10,2),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_game_id (game_id),
  INDEX idx_status (status),
  INDEX idx_reservation_date (reservation_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- INSERÇÃO DE DADOS: Jogos
-- ============================================================================

INSERT INTO games (name, category, summary, description, how_to_play, price, players, duration, stock, available) VALUES
(
  'Magic: The Gathering',
  'Jogo de Cartas',
  'O icônico jogo de cartas colecionáveis onde você é um poderoso mago.',
  'Magic: The Gathering é um jogo de cartas colecionáveis estratégico onde os jogadores assumem o papel de poderosos magos chamados Planeswalkers. Com milhares de cartas disponíveis, cada partida é única e repleta de estratégia.',
  'Cada jogador começa com 20 pontos de vida e usa um deck de cartas. Invoque criaturas, lance feitiços e use artefatos para reduzir a vida do oponente a zero. Use mana (energia mágica) para pagar o custo das cartas.',
  25.00,
  '2 jogadores',
  '30-60 minutos',
  3,
  TRUE
),
(
  'UNO',
  'Jogo de Cartas',
  'O clássico jogo de cartas que todos conhecem e amam.',
  'UNO é um jogo de cartas americano que é jogado com um baralho especialmente impresso. O objetivo é ser o primeiro a descartar todas as cartas da mão, combinando cores ou números.',
  'O objetivo é ser o primeiro jogador a descartar todas as suas cartas. Combine cores ou números com a carta do topo da pilha de descarte. Use cartas especiais para inverter o jogo, pular jogadores ou fazer adversários comprarem cartas.',
  15.00,
  '2-10 jogadores',
  '15-30 minutos',
  5,
  TRUE
),
(
  'Xadrez',
  'Jogo de Tabuleiro',
  'O jogo de estratégia milenar que desafia sua mente.',
  'Xadrez é um jogo de tabuleiro estratégico para dois jogadores, jogado em um tabuleiro quadriculado de 64 casas. Cada jogador controla 16 peças com movimentos únicos.',
  'Cada jogador começa com 16 peças. O objetivo é dar xeque-mate no rei adversário, colocando-o em uma posição onde não pode escapar da captura. Cada tipo de peça se move de forma diferente no tabuleiro.',
  20.00,
  '2 jogadores',
  '30-90 minutos',
  4,
  TRUE
),
(
  'Banco Imobiliário',
  'Jogo de Tabuleiro',
  'Compre, venda e negocie propriedades neste clássico jogo de negócios.',
  'Banco Imobiliário é um jogo de tabuleiro que simula compra e venda de propriedades. Os jogadores competem para construir um império imobiliário e levar os adversários à falência.',
  'Role os dados e mova seu peão pelo tabuleiro. Compre propriedades disponíveis, construa casas e hotéis, e cobre aluguel dos outros jogadores. Negocie propriedades estrategicamente para formar monopólios.',
  35.00,
  '2-8 jogadores',
  '60-180 minutos',
  2,
  TRUE
),
(
  'Catan',
  'Jogo de Tabuleiro',
  'Colonize a ilha de Catan e construa seu império.',
  'Em Catan, os jogadores tentam ser o senhor dominante da ilha de Catan construindo assentamentos, cidades e estradas. Colete recursos, negocie com outros jogadores e expanda seu território.',
  'Colete recursos (madeira, tijolo, trigo, ovelha, minério) rolando dados. Construa estradas, assentamentos e cidades. Negocie recursos com outros jogadores. Primeiro a alcançar 10 pontos de vitória vence.',
  40.00,
  '3-4 jogadores',
  '60-120 minutos',
  2,
  TRUE
),
(
  'Exploding Kittens',
  'Jogo de Cartas',
  'Um jogo de cartas estratégico altamente explosivo para toda a família.',
  'Exploding Kittens é um jogo de cartas para pessoas que gostam de gatinhos, explosões e lasers. É como UNO, mas com gatinhos explosivos e cabras mágicas.',
  'Compre cartas até pegar um Exploding Kitten (gatinho explosivo). Use cartas especiais para evitar explodir: Defuse para desarmar, Skip para não comprar, See the Future para ver as próximas cartas. Último jogador vivo vence.',
  30.00,
  '2-5 jogadores',
  '15 minutos',
  3,
  TRUE
);

-- ============================================================================
-- INSERÇÃO DE DADOS: Imagens dos Jogos
-- ============================================================================

INSERT INTO game_images (game_id, image_url, display_order) VALUES
-- Magic: The Gathering
(1, 'https://images.unsplash.com/photo-1612404730960-5c71577fca11?w=800', 1),
(1, 'https://images.unsplash.com/photo-1607124964194-8d9e8c4f7a93?w=800', 2),

-- UNO
(2, 'https://images.unsplash.com/photo-1611371805429-8b5c1b2c34ba?w=800', 1),

-- Xadrez
(3, 'https://images.unsplash.com/photo-1586165368502-1bad197a6461?w=800', 1),
(3, 'https://images.unsplash.com/photo-1611195974226-fafc95a1d6c0?w=800', 2),

-- Banco Imobiliário
(4, 'https://images.unsplash.com/photo-1592642704632-8ee7c7f23d7c?w=800', 1),

-- Catan
(5, 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=800', 1),
(5, 'https://images.unsplash.com/photo-1609026804615-34d12f46f370?w=800', 2),

-- Exploding Kittens
(6, 'https://images.unsplash.com/photo-1606167668584-78701c57f13d?w=800', 1);

-- ============================================================================
-- INSERÇÃO DE DADOS: Regras dos Jogos
-- ============================================================================

INSERT INTO game_rules (game_id, rule_text, rule_order) VALUES
-- Magic: The Gathering
(1, 'Cada jogador começa com 20 pontos de vida', 1),
(1, 'Compre 7 cartas iniciais', 2),
(1, 'Jogue uma terra por turno para gerar mana', 3),
(1, 'Invoque criaturas pagando seu custo de mana', 4),
(1, 'Ataque com suas criaturas no seu turno', 5),
(1, 'Use feitiços e habilidades estrategicamente', 6),

-- UNO
(2, 'Combine por cor ou número com a carta do topo', 1),
(2, 'Use cartas especiais para mudar o jogo', 2),
(2, 'Grite UNO quando tiver apenas uma carta', 3),
(2, 'O primeiro a ficar sem cartas vence', 4),

-- Xadrez
(3, 'Peão move 1 casa para frente (2 no primeiro movimento)', 1),
(3, 'Torre move em linha reta (horizontal/vertical)', 2),
(3, 'Bispo move na diagonal', 3),
(3, 'Cavalo move em L (2+1 casas)', 4),
(3, 'Rainha move em qualquer direção', 5),
(3, 'Rei move 1 casa em qualquer direção', 6),
(3, 'Dê xeque-mate no rei adversário para vencer', 7),

-- Banco Imobiliário
(4, 'Role os dados e mova seu peão', 1),
(4, 'Compre propriedades disponíveis quando parar nelas', 2),
(4, 'Construa casas e hotéis nas suas propriedades', 3),
(4, 'Cobre aluguel de outros jogadores', 4),
(4, 'Negocie propriedades com outros jogadores', 5),
(4, 'Não fique sem dinheiro ou você quebra!', 6),

-- Catan
(5, 'Colete recursos rolando dados no início do turno', 1),
(5, 'Construa estradas (1 madeira + 1 tijolo)', 2),
(5, 'Construa assentamentos (1 madeira + 1 tijolo + 1 trigo + 1 ovelha)', 3),
(5, 'Negocie recursos com outros jogadores', 4),
(5, 'Expanda seu território estrategicamente', 5),
(5, 'Primeiro a 10 pontos de vitória vence', 6),

-- Exploding Kittens
(6, 'Compre 1 carta por turno', 1),
(6, 'Use cartas de ação estrategicamente', 2),
(6, 'Evite pegar Exploding Kittens (gatinhos explosivos)', 3),
(6, 'Use cartas Defuse para desarmar gatinhos explosivos', 4),
(6, 'Último jogador não explodido vence', 5);

-- ============================================================================
-- INSERÇÃO DE DADOS: Usuário de Teste
-- ============================================================================

-- Senha: teste123 (hash bcrypt)
INSERT INTO users (username, email, password_hash, full_name, phone) VALUES
('admin', 'admin@gamerent.com', '$2b$10$YourHashWillBeGeneratedByBackend', 'Administrador', '(11) 98765-4321'),
('joao', 'joao@email.com', '$2b$10$YourHashWillBeGeneratedByBackend', 'João Silva', '(11) 91234-5678'),
('maria', 'maria@email.com', '$2b$10$YourHashWillBeGeneratedByBackend', 'Maria Santos', '(11) 99876-5432');

-- ============================================================================
-- INSERÇÃO DE DADOS: Reservas de Exemplo
-- ============================================================================

INSERT INTO reservations (user_id, game_id, reservation_date, status, total_price) VALUES
(2, 1, '2025-11-25', 'active', 25.00),
(2, 3, '2025-11-28', 'active', 20.00),
(3, 2, '2025-11-26', 'active', 15.00),
(3, 5, '2025-12-01', 'active', 40.00);

-- ============================================================================
-- VERIFICAÇÃO: Mostrar dados inseridos
-- ============================================================================

SELECT 'Jogos cadastrados:' AS Info;
SELECT id, name, category, price, stock FROM games;

SELECT 'Imagens cadastradas:' AS Info;
SELECT gi.id, g.name, gi.image_url FROM game_images gi JOIN games g ON gi.game_id = g.id;

SELECT 'Regras cadastradas:' AS Info;
SELECT gr.id, g.name, gr.rule_text FROM game_rules gr JOIN games g ON gr.game_id = g.id LIMIT 10;

SELECT 'Usuários cadastrados:' AS Info;
SELECT id, username, email, full_name FROM users;

SELECT 'Reservas cadastradas:' AS Info;
SELECT r.id, u.username, g.name, r.reservation_date, r.status 
FROM reservations r 
JOIN users u ON r.user_id = u.id 
JOIN games g ON r.game_id = g.id;

-- ============================================================================
-- FIM DO SCRIPT
-- ============================================================================

SELECT '✅ Banco de dados GameRent criado com sucesso!' AS Status;
SELECT 'Total de jogos:' AS Info, COUNT(*) AS Quantidade FROM games;
SELECT 'Total de usuários:' AS Info, COUNT(*) AS Quantidade FROM users;
SELECT 'Total de reservas:' AS Info, COUNT(*) AS Quantidade FROM reservations;
