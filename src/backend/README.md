# 🎮 GameRent Backend - API REST

Backend do sistema GameRent desenvolvido em Node.js + Express + MySQL.

## 📋 Pré-requisitos

Antes de iniciar, certifique-se de ter instalado:

- ✅ **Node.js** (versão 16 ou superior) - [Download](https://nodejs.org/)
- ✅ **MySQL** (versão 5.7 ou superior) - [Download](https://dev.mysql.com/downloads/)
- ✅ **npm** (vem junto com Node.js)

## 🚀 Instalação e Configuração

### 1. Instalar Dependências

No diretório `/backend`, execute:

```bash
npm install
```

Isso instalará:
- `express` - Framework web
- `mysql2` - Driver MySQL
- `bcrypt` - Criptografia de senhas
- `jsonwebtoken` - Autenticação JWT
- `cors` - Permitir requisições do frontend
- `dotenv` - Variáveis de ambiente
- `express-validator` - Validação de dados

### 2. Configurar Banco de Dados

Execute o arquivo `/SETUP_MYSQL.sql` no MySQL:

```bash
# Opção 1: Via terminal MySQL
mysql -u root -p2602 < ../SETUP_MYSQL.sql

# Opção 2: Via MySQL Workbench
# - Abra o MySQL Workbench
# - Conecte com root/2602
# - Abra o arquivo SETUP_MYSQL.sql
# - Execute todo o script
```

### 3. Verificar Variáveis de Ambiente

O arquivo `.env` já está configurado com:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=2602
DB_NAME=gamerent_db
DB_PORT=3306
PORT=3001
JWT_SECRET=gamerent_super_secret_key_2024_change_in_production
```

**⚠️ Em produção, troque JWT_SECRET por uma chave forte e aleatória!**

### 4. Iniciar o Servidor

```bash
# Modo normal
npm start

# Modo desenvolvimento (reinicia automaticamente)
npm run dev
```

Você verá:

```
╔════════════════════════════════════════╗
║   🎮 GameRent API - SERVIDOR ONLINE   ║
╚════════════════════════════════════════╝

   → Rodando em: http://localhost:3001
   → Ambiente: development
   → Frontend esperado em: http://localhost:5173
```

## 📡 Rotas da API

### Autenticação (`/api/auth`)

#### POST `/api/auth/register` - Cadastro
```json
{
  "username": "joao123",
  "email": "joao@email.com",
  "password": "senha123",
  "fullName": "João Silva",
  "phone": "(11) 98765-4321"
}
```

**Resposta:**
```json
{
  "message": "Usuário cadastrado com sucesso!",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "joao123",
    "email": "joao@email.com"
  }
}
```

#### POST `/api/auth/login` - Login
```json
{
  "email": "joao@email.com",
  "password": "senha123"
}
```

**Resposta:**
```json
{
  "message": "Login realizado com sucesso!",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "joao123",
    "email": "joao@email.com"
  }
}
```

### Jogos (`/api/games`)

#### GET `/api/games` - Listar todos os jogos
**Resposta:**
```json
{
  "success": true,
  "count": 6,
  "games": [
    {
      "id": 1,
      "name": "Magic: The Gathering",
      "category": "Jogo de Cartas",
      "price": 25.00,
      "images": ["url1", "url2"],
      "rules": ["regra1", "regra2"]
    }
  ]
}
```

#### GET `/api/games/:id` - Detalhes de um jogo
**Resposta:**
```json
{
  "success": true,
  "game": {
    "id": 1,
    "name": "Magic: The Gathering",
    "description": "...",
    "images": ["url1", "url2"],
    "rules": ["regra1", "regra2"],
    "reservedDates": ["2025-11-25", "2025-11-28"]
  }
}
```

### Reservas (`/api/reservations`)

**⚠️ Todas as rotas requerem autenticação! Envie o token no header:**
```
Authorization: Bearer SEU_TOKEN_AQUI
```

#### GET `/api/reservations` - Minhas reservas
**Resposta:**
```json
{
  "success": true,
  "count": 2,
  "reservations": [
    {
      "id": 1,
      "game_id": 1,
      "game_name": "Magic: The Gathering",
      "reservation_date": "2025-11-25",
      "status": "active",
      "total_price": 25.00
    }
  ]
}
```

#### POST `/api/reservations` - Criar reserva
```json
{
  "gameId": 1,
  "reservationDate": "2025-11-25",
  "notes": "Primeira vez jogando"
}
```

#### PUT `/api/reservations/:id` - Atualizar reserva
```json
{
  "reservationDate": "2025-11-26"
}
```

#### DELETE `/api/reservations/:id` - Cancelar reserva
**Resposta:**
```json
{
  "success": true,
  "message": "Reserva cancelada com sucesso!"
}
```

### Usuário (`/api/users`)

#### GET `/api/users/profile` - Meu perfil
**Requer autenticação**

**Resposta:**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "username": "joao123",
    "email": "joao@email.com",
    "stats": {
      "total_reservations": 5,
      "active_reservations": 2,
      "completed_reservations": 2,
      "cancelled_reservations": 1,
      "total_spent": 120.00
    }
  }
}
```

## 🔐 Autenticação

O sistema usa **JWT (JSON Web Tokens)** para autenticação.

### Como funciona:

1. **Usuário faz login/registro** → Recebe um token
2. **Frontend armazena o token** (localStorage/sessionStorage)
3. **Toda requisição protegida envia o token** no header:
   ```
   Authorization: Bearer SEU_TOKEN_AQUI
   ```
4. **Backend valida o token** e permite/bloqueia o acesso

### Exemplo de uso (JavaScript):

```javascript
// Salva o token após login
localStorage.setItem('token', responseData.token);

// Envia em requisições
const response = await fetch('http://localhost:3001/api/reservations', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json'
  }
});
```

## 📁 Estrutura de Arquivos

```
backend/
├── config/
│   └── database.js          # Configuração MySQL
├── middleware/
│   └── auth.js              # Middleware de autenticação JWT
├── routes/
│   ├── auth.js              # Rotas de login/registro
│   ├── games.js             # Rotas de jogos
│   ├── reservations.js      # Rotas de reservas
│   └── users.js             # Rotas de usuários
├── .env                     # Variáveis de ambiente
├── package.json             # Dependências
├── server.js                # Servidor principal
└── README.md                # Este arquivo
```

## 🧪 Testar a API

### Opção 1: Postman/Insomnia

1. Baixe [Postman](https://www.postman.com/) ou [Insomnia](https://insomnia.rest/)
2. Importe as rotas
3. Teste cada endpoint

### Opção 2: cURL (Terminal)

```bash
# Listar jogos
curl http://localhost:3001/api/games

# Fazer login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"joao@email.com","password":"senha123"}'

# Criar reserva (com token)
curl -X POST http://localhost:3001/api/reservations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{"gameId":1,"reservationDate":"2025-11-25"}'
```

### Opção 3: Frontend React

O frontend já está configurado para se comunicar com o backend!

## 🐛 Troubleshooting

### Erro: "ECONNREFUSED"
- MySQL não está rodando
- Verifique: `mysql -u root -p2602`

### Erro: "ER_ACCESS_DENIED_ERROR"
- Senha do MySQL incorreta
- Verifique o arquivo `.env`

### Erro: "ER_BAD_DB_ERROR"
- Banco `gamerent_db` não existe
- Execute o arquivo `SETUP_MYSQL.sql`

### Porta 3001 já em uso
- Mude a porta no arquivo `.env`
- Ou mate o processo: `lsof -ti:3001 | xargs kill`

## 📊 Banco de Dados

### Tabelas:

- `users` - Usuários do sistema
- `games` - Jogos disponíveis
- `game_images` - Imagens dos jogos
- `game_rules` - Regras dos jogos
- `reservations` - Reservas feitas

### Diagrama:

```
users (1) ----< (N) reservations (N) >---- (1) games
                                                  |
                                                  +---- game_images
                                                  +---- game_rules
```

## 🔒 Segurança

✅ Senhas criptografadas com bcrypt
✅ JWT para autenticação
✅ Validação de dados com express-validator
✅ SQL injection protection (prepared statements)
✅ CORS configurado

❌ **NÃO faça em produção:**
- Expor JWT_SECRET
- Usar senha fraca no MySQL
- Desabilitar HTTPS
- Não fazer backup do banco

## 📝 Logs

O servidor loga:
- ✅ Conexão com MySQL
- ✅ Cada requisição recebida
- ✅ Operações bem-sucedidas
- ❌ Erros

Exemplo:
```
✅ Conectado ao MySQL com sucesso!
[2025-11-14T10:30:00.000Z] POST /api/auth/login
✅ Login bem-sucedido: joao123 (ID: 2)
```

## 🚀 Deploy (Produção)

Para colocar em produção:

1. **Hospedagem Backend:** Heroku, Railway, DigitalOcean
2. **Hospedagem MySQL:** PlanetScale, Railway, AWS RDS
3. **Altere `.env`:**
   - Troque JWT_SECRET
   - Configure variáveis de produção
4. **Adicione HTTPS**
5. **Configure CORS** para a URL do frontend em produção

---

**Criado para o projeto GameRent** 🎮
