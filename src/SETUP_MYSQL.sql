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


-- INSERIR OS JOGOS 

-- WAR
INSERT INTO games (
    name,
    category,
    summary,
    description,
    how_to_play,
    price,
    players,
    duration,
    stock,
    available
) VALUES (
    'WAR',
    'Estrategia / Tabuleiro / Conquista',
    'Um jogo clássico de dominação global, onde o objetivo é cumprir sua missão secreta ou conquistar territórios.',
    'WAR é um jogo de estratégia onde os jogadores controlam exércitos e disputam territórios ao redor do mundo. Cada jogador recebe cartas de missão secreta e posiciona seus exércitos pelo mapa. Os turnos envolvem atacar territórios inimigos, reforçar tropas e conquistar regiões inteiras. O jogo combina estratégia, diplomacia, negociação e um pouco de sorte nos dados. A partida termina quando um jogador cumpre sua missão secreta ou domina completamente um oponente, dependendo da regra utilizada.',
    'No início, cada jogador recebe uma missão secreta e distribui suas tropas pelo mapa. Na sua vez, você pode reforçar seus territórios, atacar regiões inimigas usando dados e mover tropas entre territórios conectados. Conquistar territórios rende cartas de bônus que podem ser trocadas por mais exércitos. O objetivo é completar sua missão secreta ou conquistar o mundo, dependendo da variante de regras.',
    35.00,
    '3-6 jogadores',
    '90-120 minutos',
    5,
    TRUE
);

INSERT INTO game_rules (game_id, rule_text, rule_order)
VALUES
(1, 'Cada jogador recebe uma carta de missão secreta no início da partida.', 0),
(1, 'Os jogadores distribuem seus exércitos pelos territórios conforme as regras iniciais.', 1),
(1, 'Na sua vez, você pode reforçar, atacar e movimentar tropas.', 2),
(1, 'Os ataques são feitos com dados, permitindo tentar conquistar territórios inimigos.', 3),
(1, 'Conquistar pelo menos um território no turno garante uma carta de bônus.', 4),
(1, 'Cartas de bônus podem ser trocadas por mais tropas quando formam combinações válidas.', 5),
(1, 'O jogo termina quando um jogador cumpre sua missão secreta ou conquista o mapa, conforme a variante jogada.', 6);


INSERT INTO game_images (game_id, image_url, display_order)
VALUES
(1, 'https://m.media-amazon.com/images/I/612r2hkPtpL.jpg', 0),
(1, 'https://a-static.mlcdn.com.br/1500x1500/jogo-war-de-tabuleiro-o-jogo-da-estrategia-war-edicao-especial-grow/magazineluiza/220544300/ccd22b054f25a2039bc2631b1a73bd17.jpg', 1);


-- IMAGEM ACAO
INSERT INTO games (
    name,
    category,
    summary,
    description,
    how_to_play,
    price,
    players,
    duration,
    stock,
    available
) VALUES (
    'Imagem & Ação',
    'Party Game / Desenho / Equipe',
    'O jogo de desenho e adivinhação onde você não precisa ser um artista para ganhar.',
    'Em Imagem & Ação, os jogadores se dividem em equipes e devem adivinhar palavras ou expressões através de desenhos. É proibido falar, escrever letras ou fazer gestos; apenas o lápis e o papel podem ser usados. Com milhares de palavras divididas em categorias, a criatividade e a rapidez são essenciais.',
    'Uma equipe escolhe um desenhista para a rodada. Ele tira uma carta, vê a palavra correspondente e tem um tempo limitado para desenhá-la. Se a equipe acertar, move o peão no tabuleiro. As categorias variam de objetos simples a expressões complexas.',
    90.00,
    '4 ou mais jogadores',
    '45-60 minutos',
    10,
    TRUE
);

INSERT INTO game_rules (game_id, rule_text, rule_order)
VALUES
(2, 'Os jogadores são divididos em equipes.', 0),
(2, 'O desenhista da vez não pode falar, gesticular ou escrever números/letras.', 1),
(2, 'O desenho deve representar a palavra sorteada na carta.', 2),
(2, 'A equipe tem um tempo limite (ampulheta) para acertar a palavra.', 3),
(2, 'Se acertar, a equipe avança no tabuleiro; se errar, permanece no lugar.', 4),
(2, 'Algumas casas permitem que todas as equipes tentem adivinhar ao mesmo tempo ("Todos Jogam").', 5),
(2, 'Vence a equipe que chegar primeiro ao final do tabuleiro.', 6);

INSERT INTO game_images (game_id, image_url, display_order)
VALUES
(2, 'https://lojagrow.vtexassets.com/arquivos/ids/170120/01708_GROW_Imagem_-_Acao_1.png?v=637788009680830000', 0),
(2, 'https://cdn.awsli.com.br/600x450/974/974808/produto/205557597/5991aecd96c68a378cda4b94e8942059-vmwfsm.jpg', 1);


-- DETETIVE
INSERT INTO games (
    name,
    category,
    summary,
    description,
    how_to_play,
    price,
    players,
    duration,
    stock,
    available
) VALUES (
    'Detetive',
    'Mistério / Dedução / Tabuleiro',
    'Desvende o mistério do assassinato. Descubra o culpado, a arma e o local do crime.',
    'Em Detetive, um crime abalou a mansão e todos são suspeitos. Os jogadores assumem o papel de detetives que devem percorrer a casa em busca de pistas. Através de lógica e dedução, é preciso eliminar as impossibilidades para descobrir as três cartas escondidas no envelope confidencial: o assassino, a arma e o aposento.',
    'Os jogadores lançam dados para mover seus peões entre os cômodos da mansão. Ao entrar em um cômodo, o jogador pode fazer um palpite sobre quem cometeu o crime ali e com qual arma. Outros jogadores devem refutar o palpite mostrando cartas, se as tiverem. O primeiro a fazer a acusação correta vence.',
    120.00,
    '3-8 jogadores',
    '60 minutos',
    5,
    TRUE
);


INSERT INTO game_rules (game_id, rule_text, rule_order)
VALUES
(3, 'Três cartas (um suspeito, uma arma, um local) são escondidas no envelope confidencial.', 0),
(3, 'Os jogadores movem-se pelos cômodos jogando os dados.', 1),
(3, 'Ao entrar em um cômodo, o jogador faz um palpite envolvendo aquele local.', 2),
(3, 'O jogador à esquerda deve tentar desmentir o palpite mostrando uma carta correspondente em segredo.', 3),
(3, 'Anote as pistas em seu bloco de notas para eliminar suspeitos.', 4),
(3, 'A acusação final só pode ser feita uma vez por jogador; se errar, é eliminado.', 5),
(3, 'Vence quem acertar as três cartas do envelope.', 6);

INSERT INTO game_images (game_id, image_url, display_order)
VALUES
(3, 'https://a-static.mlcdn.com.br/800x800/jogo-detetive-estrela/magazineluiza/181245800/4e2b729939b08b81746e126827d4a537.jpg', 0),
(3, 'https://estrela.vtexassets.com/arquivos/ids/163124-800-auto?v=636655330208970000&width=800&height=auto&aspect=true', 1);


-- JOGO DA VIDA
INSERT INTO games (
    name,
    category,
    summary,
    description,
    how_to_play,
    price,
    players,
    duration,
    stock,
    available
) VALUES (
    'Jogo da Vida',
    'Simulação / Família',
    'Uma simulação divertida da vida real, desde a carreira até a aposentadoria.',
    'O Jogo da Vida leva os jogadores a uma jornada cheia de surpresas, onde cada decisão conta. Escolha entre fazer faculdade ou trabalhar, case-se, tenha filhos e lide com imprevistos financeiros. O objetivo é chegar à aposentadoria com a maior fortuna acumulada.',
    'Gire a roleta para mover seu carro pelo tabuleiro. As casas indicam eventos de vida, como receber salário, pagar taxas, ter filhos ou investir. Existem caminhos alternativos que representam escolhas de carreira e riscos. O jogo termina quando todos os jogadores se aposentam.',
    140.00,
    '2-6 jogadores',
    '60-90 minutos',
    8,
    TRUE
);


INSERT INTO game_rules (game_id, rule_text, rule_order)
VALUES
(4, 'Gire a roleta para definir o número de casas a percorrer.', 0),
(4, 'No início, escolha entre o caminho dos negócios ou da faculdade.', 1),
(4, 'Receba seu salário sempre que passar ou cair na casa de pagamento.', 2),
(4, 'Adicione pinos (pessoas) ao seu carro ao casar ou ter filhos.', 3),
(4, 'Pague taxas e dívidas conforme as instruções das casas.', 4),
(4, 'Ao chegar ao final, conte todo o dinheiro e valores de bens adquiridos.', 5),
(4, 'O jogador com o maior patrimônio total vence.', 6);

INSERT INTO game_images (game_id, image_url, display_order)
VALUES
(4, 'https://m.media-amazon.com/images/I/61bvPavVdqL._AC_UF894,1000_QL80_.jpg', 0),
(4, 'https://cdn.awsli.com.br/2500x2500/2624/2624370/produto/25104764515201ea51f.jpg', 1);

-- COUP
INSERT INTO games (
    name,
    category,
    summary,
    description,
    how_to_play,
    price,
    players,
    duration,
    stock,
    available
) VALUES (
    'Coup',
    'Blefe / Estratégia Rápida',
    'Um jogo de blefe intenso onde o objetivo é eliminar todas as influências dos oponentes.',
    'Coup é um jogo de blefe ambientado no universo de The Resistance. Cada jogador possui cartas de influência com habilidades únicas, e deve manipular, enganar e se impor politicamente para sobreviver. A cada rodada você executa ações, contesta jogadas e tenta derrubar os outros jogadores sem revelar sua verdadeira mão.',
    'Cada jogador recebe duas influências (cartas). Você pode realizar ações gerais ou ações específicas de personagens. Oponentes podem contestar suas ações, e mentir faz parte do jogo. Quando perde um confronto, você perde uma influência. O último jogador com influência vence.',
    70.00,
    '2-6 jogadores',
    '10-20 minutos',
    6,
    TRUE
);

INSERT INTO game_rules (game_id, rule_text, rule_order)
VALUES
(5, 'Cada jogador começa com duas influências secretas.', 0),
(5, 'Você pode realizar ações básicas como Renda (1 moeda) e Ajuda Externa (2 moedas).', 1),
(5, 'Ações específicas podem ser realizadas apenas se você “tiver” o personagem correspondente (ou se blefar).', 2),
(5, 'Qualquer jogador pode contestar sua ação. Se você for pego blefando, perde uma influência.', 3),
(5, 'Ao acumular 7 moedas, você é obrigado a executar um Golpe (Coup) contra outro jogador.', 4),
(5, 'Vence o último jogador com pelo menos uma influência ativa.', 5);

INSERT INTO game_images (game_id, image_url, display_order)
VALUES
(5, 'https://grokgames.com.br/wp-content/uploads/2014/07/caixa-Coup.png', 0),
(5, 'https://updateordie.com/wp-content/uploads/2020/12/coup02.jpg.webp', 1);

-- LOVE LETTER
INSERT INTO games (
    name,
    category,
    summary,
    description,
    how_to_play,
    price,
    players,
    duration,
    stock,
    available
) VALUES (
    'Love Letter',
    'Dedução / Cartas / Jogo Rápido',
    'Um jogo leve de dedução onde você tenta entregar sua carta de amor à princesa antes dos outros.',
    'Love Letter é um jogo rápido em que cada jogador tem apenas uma carta na mão. Em seu turno, compra outra carta e escolhe qual das duas descartar, ativando seu efeito. O objetivo é ser o último jogador restante ou terminar a rodada com a carta de maior valor.',
    'No início da rodada, cada jogador recebe uma carta. No seu turno, compre uma carta e descarte uma delas, aplicando o efeito. Alguns efeitos permitem eliminar outros jogadores. A rodada acaba quando resta apenas um jogador ou quando o baralho termina. Quem tiver a carta mais alta vence a rodada.',
    55.00,
    '2-4 jogadores',
    '15-20 minutos',
    10,
    TRUE
);


INSERT INTO game_rules (game_id, rule_text, rule_order)
VALUES
(6, 'Cada jogador começa com uma única carta na mão.', 0),
(6, 'No seu turno, compre uma carta e descarte uma, ativando seu efeito.', 1),
(6, 'Algumas cartas permitem adivinhar ou olhar cartas de outros jogadores.', 2),
(6, 'Certas cartas eliminam jogadores da rodada.', 3),
(6, 'Se o baralho acabar, vence quem possuir a carta de maior valor na mão.', 4),
(6, 'O jogo é jogado em várias rodadas até que alguém alcance o número necessário de vitórias.', 5);

INSERT INTO game_images (game_id, image_url, display_order)
VALUES
(6, 'https://67287.cdn.simplo7.net/static/67287/sku/jogos-de-tabuleiro-e-cardgames-jogo-love-letter-2a-edicao-p-1754430773427.jpg', 0),
(6, 'https://www.mundogalapagos.com.br/ccstore/v1/images/?source=/file/v4359253277095460402/products/LVL101_02.jpg', 1);
