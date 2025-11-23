-- ============================================================================
-- SCRIPT PARA INSERIR JOGOS NO BANCO DE DADOS GAMERENT
-- ============================================================================
-- 
-- Como usar este script:
-- 1. Abra o MySQL Workbench ou terminal MySQL
-- 2. Execute: mysql -u root -p2602
-- 3. Execute: USE gamerent_db;
-- 4. Copie e cole os comandos INSERT abaixo
-- 5. Os jogos serão adicionados ao catálogo
--
-- ============================================================================

USE gamerent_db;

-- ============================================================================
-- TEMPLATE DE INSERÇÃO - COPIE E MODIFIQUE CONFORME NECESSÁRIO
-- ============================================================================

-- EXEMPLO 1: Jogo de Cartas Colecionável
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
    available, 
    images, 
    rules
) VALUES (
    'Yu-Gi-Oh! Deck Inicial',                    -- Nome do jogo
    'Jogo de Cartas Estratégico',                -- Categoria
    'O clássico jogo de cartas de duelos com monstros, magias e armadilhas.', -- Resumo curto
    'Yu-Gi-Oh! é um jogo de cartas estratégico onde você invoca monstros, usa magias e armadilhas para derrotar seu oponente. Monte seu deck com as cartas mais poderosas e domine o campo de batalha!', -- Descrição completa
    'Cada jogador inicia com 8000 pontos de vida. Invoque monstros para atacar, use magias para virar o jogo e armadilhas para surpreender seu oponente. Reduza os pontos de vida do adversário a zero para vencer.', -- Como jogar
    28.00,                                        -- Preço por dia (decimal)
    '2 jogadores',                                -- Número de jogadores
    '20-40 minutos',                              -- Duração
    3,                                            -- Quantidade em estoque
    TRUE,                                         -- Disponível (TRUE/FALSE)
    JSON_ARRAY(
        'https://images.unsplash.com/photo-1632501641765-e568d28b0015?w=1080',
        'https://images.unsplash.com/photo-1728167049092-de4e98571c1b?w=1080'
    ),                                            -- Array de URLs de imagens
    JSON_ARRAY(
        'Cada jogador começa com 8000 pontos de vida',
        'Compre uma carta no início de cada turno',
        'Invoque 1 monstro Normal por turno sem tributos',
        'Invoque monstros de nível 5+ tributando monstros',
        'Ative magias e armadilhas estrategicamente',
        'Ataque com seus monstros na Fase de Batalha',
        'Primeiro a reduzir a vida do oponente a zero vence'
    )                                             -- Array de regras
);

-- ============================================================================

-- EXEMPLO 2: Jogo de Tabuleiro de Estratégia
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
    available, 
    images, 
    rules
) VALUES (
    'War - Jogo de Estratégia',
    'Jogo de Tabuleiro Estratégico',
    'Conquiste territórios e domine o mundo neste clássico jogo de estratégia.',
    'War é um jogo de tabuleiro estratégico onde você comanda exércitos, conquista territórios e forma alianças para dominar o mundo. Use estratégia, diplomacia e sorte dos dados para vencer.',
    'Distribua seus exércitos pelos territórios, ataque territórios adjacentes lançando dados, defenda seus territórios e complete objetivos secretos para vencer o jogo.',
    32.00,
    '3-6 jogadores',
    '90-180 minutos',
    2,
    TRUE,
    JSON_ARRAY(
        'https://images.unsplash.com/photo-1640461470346-c8b56497850a?w=1080'
    ),
    JSON_ARRAY(
        'Cada jogador recebe um objetivo secreto',
        'Distribua seus exércitos iniciais pelo mapa',
        'No seu turno, receba novos exércitos baseado em territórios',
        'Ataque territórios adjacentes usando dados',
        'Atacante usa até 3 dados, defensor até 2 dados',
        'Compare os dados maiores para determinar perdas',
        'Conquiste territórios para receber cartas',
        'Troque conjuntos de cartas por exércitos extras',
        'Complete seu objetivo secreto para vencer'
    )
);

-- ============================================================================

-- EXEMPLO 3: Party Game (Jogo Casual)
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
    available, 
    images, 
    rules
) VALUES (
    'Dixit',
    'Jogo de Cartas Party',
    'Um jogo de imaginação e dedução com cartas ilustradas lindamente.',
    'Dixit é um jogo criativo onde um jogador (o narrador) escolhe uma carta e dá uma pista. Os outros jogadores escolhem cartas de suas mãos que combinam com a pista. Todos votam em qual carta pertence ao narrador.',
    'O narrador escolhe uma carta e dá uma dica (palavra, frase, som). Outros jogadores escolhem uma carta de suas mãos que combine. Embaralhe e revele todas as cartas. Jogadores votam em qual é a do narrador. Pontue baseado nos votos.',
    26.00,
    '3-6 jogadores',
    '30 minutos',
    4,
    TRUE,
    JSON_ARRAY(
        'https://images.unsplash.com/photo-1632501641765-e568d28b0015?w=1080'
    ),
    JSON_ARRAY(
        'Cada jogador recebe 6 cartas ilustradas',
        'O narrador escolhe uma carta e dá uma pista',
        'Outros jogadores escolhem uma carta que combine com a pista',
        'Embaralhe e revele todas as cartas escolhidas',
        'Jogadores (exceto narrador) votam em qual é a carta do narrador',
        'Narrador pontua se alguns (mas não todos) acertarem',
        'Jogadores que acertaram também pontuam',
        'Jogadores pontuam se outros votarem em suas cartas',
        'Primeiro a alcançar o fim do tabuleiro vence'
    )
);

-- ============================================================================

-- EXEMPLO 4: Jogo Cooperativo
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
    available, 
    images, 
    rules
) VALUES (
    'Pandemic',
    'Jogo de Tabuleiro Cooperativo',
    'Trabalhe em equipe para salvar a humanidade de doenças mortais.',
    'Pandemic é um jogo cooperativo onde os jogadores trabalham juntos como especialistas lutando para curar quatro doenças mortais antes que elas se espalhem pelo mundo. Coordenem estratégias, compartilhem recursos e salvem a humanidade!',
    'Cada jogador tem uma função especial. No seu turno, execute 4 ações: mover, tratar doenças, compartilhar conhecimento, construir estações ou descobrir curas. Depois, compre 2 cartas e propague doenças. Curem as 4 doenças para vencer!',
    38.00,
    '2-4 jogadores',
    '45-60 minutos',
    2,
    TRUE,
    JSON_ARRAY(
        'https://images.unsplash.com/photo-1651355828101-1e96ef64b1ed?w=1080'
    ),
    JSON_ARRAY(
        'Escolha uma função com habilidade especial',
        'Execute 4 ações no seu turno',
        'Ações: mover, tratar, compartilhar, construir, curar',
        'Compre 2 cartas após suas ações',
        'Propague doenças em 2-4 cidades',
        'Colete 5 cartas da mesma cor para descobrir cura',
        'Curem as 4 doenças para vencer',
        'Percam se ficarem sem cubos, surtos ou cartas',
        'Trabalhem em equipe para maximizar eficiência'
    )
);

-- ============================================================================

-- EXEMPLO 5: Jogo de Blefe
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
    available, 
    images, 
    rules
) VALUES (
    'Coup',
    'Jogo de Cartas de Blefe',
    'Manipule, blufe e elimine seus oponentes neste jogo de intriga política.',
    'Coup é um jogo rápido de blefe onde você controla 2 personagens secretos. Use suas influências para ganhar moedas, bloquear ações e eliminar outros jogadores. Mas cuidado - se alguém desafiar seu blefe, você perde uma influência!',
    'Cada jogador tem 2 cartas de personagem (ocultas). No seu turno, declare uma ação. Outros podem desafiar ou bloquear. Se desafiado incorretamente, eles perdem uma carta. Se você mentiu, perde uma carta. Último com cartas vence!',
    20.00,
    '2-6 jogadores',
    '15 minutos',
    5,
    TRUE,
    JSON_ARRAY(
        'https://images.unsplash.com/photo-1632501641765-e568d28b0015?w=1080'
    ),
    JSON_ARRAY(
        'Cada jogador começa com 2 cartas (ocultas) e 2 moedas',
        'No seu turno, declare uma ação',
        'Ações gerais: Renda (+1), Ajuda Externa (+2), Golpe (7 moedas, elimina)',
        'Ações de personagens: Duque (taxas +3), Assassino (mata por 3), etc',
        'Outros jogadores podem desafiar ou bloquear',
        'Se desafiado, revele a carta - se mentiu, perde influência',
        'Se desafiaram incorretamente, eles perdem influência',
        'Perca todas as influências = fora do jogo',
        'Último jogador com influência vence'
    )
);

-- ============================================================================

-- EXEMPLO 6: Jogo Infantil/Familiar
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
    available, 
    images, 
    rules
) VALUES (
    'Dobble (Spot It!)',
    'Jogo de Cartas Familiar',
    'Um jogo de velocidade e observação para toda a família.',
    'Dobble é um jogo simples e divertido onde cada carta tem 8 símbolos. Entre duas cartas quaisquer, há sempre exatamente 1 símbolo em comum. Seja o mais rápido para encontrar o símbolo correspondente!',
    'Revele duas cartas. Seja o primeiro a identificar o símbolo que aparece em ambas e grite o nome dele! Existem 5 mini-jogos diferentes incluídos com regras variadas.',
    18.00,
    '2-8 jogadores',
    '15 minutos',
    6,
    TRUE,
    JSON_ARRAY(
        'https://images.unsplash.com/photo-1601162937667-08f083516d57?w=1080'
    ),
    JSON_ARRAY(
        'Cada carta tem exatamente 8 símbolos',
        'Entre duas cartas, sempre há exatamente 1 símbolo comum',
        'Mini-jogo 1 - Torre Infernal: empilhe cartas sendo rápido',
        'Mini-jogo 2 - Poço: descarte suas cartas primeiro',
        'Mini-jogo 3 - Batata Quente: passe a carta rapidamente',
        'Mini-jogo 4 - Pegue Todos: colete mais cartas',
        'Mini-jogo 5 - Triplo: encontre símbolos entre 3 cartas',
        'Grite o nome do símbolo para ganhar a rodada',
        'Vencedor varia conforme o mini-jogo escolhido'
    )
);

-- ============================================================================
-- VERIFICAÇÃO
-- ============================================================================

-- Ver todos os jogos cadastrados
SELECT 
    id,
    name,
    category,
    price,
    players,
    stock,
    available
FROM games
ORDER BY id DESC;

-- Contar total de jogos
SELECT COUNT(*) as total_jogos FROM games;

-- Ver último jogo inserido
SELECT * FROM games ORDER BY id DESC LIMIT 1;

-- ============================================================================
-- TEMPLATES EM BRANCO PARA VOCÊ CUSTOMIZAR
-- ============================================================================

/*
-- TEMPLATE 1: Jogo Básico
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
    available, 
    images, 
    rules
) VALUES (
    'NOME_DO_JOGO',
    'CATEGORIA',
    'Resumo curto do jogo em uma frase.',
    'Descrição completa explicando o conceito do jogo.',
    'Explicação de como se joga passo a passo.',
    25.00,
    '2-4 jogadores',
    '30-60 minutos',
    3,
    TRUE,
    JSON_ARRAY(
        'https://images.unsplash.com/photo-XXXXX?w=1080'
    ),
    JSON_ARRAY(
        'Regra 1',
        'Regra 2',
        'Regra 3',
        'Regra 4',
        'Regra 5'
    )
);
*/

-- ============================================================================
-- DICAS DE CATEGORIAS
-- ============================================================================

/*
Categorias sugeridas:
- 'Jogo de Cartas Estratégico'
- 'Jogo de Cartas Familiar'
- 'Jogo de Cartas Party'
- 'Jogo de Cartas de Blefe'
- 'Jogo de Tabuleiro Estratégico'
- 'Jogo de Tabuleiro Familiar'
- 'Jogo de Tabuleiro Cooperativo'
- 'Jogo de Tabuleiro de Guerra'
- 'Jogo de Tabuleiro Econômico'
- 'Party Game'
*/

-- ============================================================================
-- DICAS DE IMAGENS (Unsplash)
-- ============================================================================

/*
URLs de imagens do Unsplash para jogos:

Cartas genéricas:
https://images.unsplash.com/photo-1632501641765-e568d28b0015?w=1080
https://images.unsplash.com/photo-1728167049092-de4e98571c1b?w=1080
https://images.unsplash.com/photo-1601162937667-08f083516d57?w=1080

Tabuleiros:
https://images.unsplash.com/photo-1640461470346-c8b56497850a?w=1080
https://images.unsplash.com/photo-1651355828101-1e96ef64b1ed?w=1080
https://images.unsplash.com/photo-1654741755763-b4cee51feb9a?w=1080

Dica: Procure por "board game cards" ou "tabletop games" no Unsplash
*/

-- ============================================================================
-- FIM DO SCRIPT
-- ============================================================================
