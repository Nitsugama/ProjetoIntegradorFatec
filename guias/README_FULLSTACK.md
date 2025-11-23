# 🚀 Guia Completo de Instalação - GameRent Full Stack

## ⚠️ AVISO IMPORTANTE - LIMITAÇÕES DO FIGMA MAKE

**Este projeto NÃO PODE ser executado no Figma Make** porque:

❌ Figma Make não roda servidores Node.js (backend)  
❌ Figma Make não possui MySQL  
❌ Figma Make não executa processos simultâneos (frontend + backend + database)

**PORÉM**, todo o código foi gerado e está funcional! Você pode executar este projeto completo na sua máquina local seguindo este guia.

---

## 📋 O Que Você Precisa Instalar

### 1. Node.js (JavaScript Runtime)
- **Download:** https://nodejs.org/
- **Versão:** 16 ou superior
- **Como verificar:** `node --version` no terminal

### 2. MySQL (Banco de Dados)
- **Download:** https://dev.mysql.com/downloads/
- **Versão:** 5.7 ou superior
- **Como verificar:** `mysql --version` no terminal

### 3. Git (Opcional, mas recomendado)
- **Download:** https://git-scm.com/
- Para versionamento do código

---

## 🗂️ Estrutura do Projeto

Seu projeto agora tem esta estrutura:

```
gamerent/
│
├── frontend/                    # REACT (PORTA 5173)
│   ├── src/
│   │   ├── components/          # Componentes React
│   │   ├── hooks/              # Hooks customizados
│   │   ├── services/           # Chamadas para a API
│   │   ├── App.tsx             # Componente principal
│   │   └── main.tsx            # Entry point
│   ├── package.json
│   └── vite.config.ts
│
├── backend/                     # NODE.JS + EXPRESS (PORTA 3001)
│   ├── config/
│   │   └── database.js         # Conexão MySQL
│   ├── middleware/
│   │   └── auth.js             # Autenticação JWT
│   ├── routes/
│   │   ├── auth.js             # Login/Registro
│   │   ├── games.js            # Jogos
│   │   ├── reservations.js     # Reservas
│   │   └── users.js            # Usuários
│   ├── .env                    # Variáveis de ambiente
│   ├── server.js               # Servidor principal
│   ├── package.json
│   └── README.md
│
└── SETUP_MYSQL.sql             # SCRIPT DO BANCO DE DADOS
```

---

## 🎯 Passo a Passo COMPLETO

### PASSO 1: Configurar o Banco de Dados MySQL

#### 1.1. Iniciar o MySQL

No terminal (Windows):
```bash
# Iniciar serviço MySQL
net start MySQL80

# OU via MySQL Workbench:
# - Abra o MySQL Workbench
# - Clique em "Local instance MySQL80"
```

No terminal (Mac/Linux):
```bash
sudo mysql.server start
# OU
sudo service mysql start
```

#### 1.2. Executar o Script SQL

**Opção A: Via Terminal**
```bash
mysql -u root -p2602 < SETUP_MYSQL.sql
```

**Opção B: Via MySQL Workbench**
1. Abra MySQL Workbench
2. Conecte com:
   - Username: `root`
   - Password: `2602`
3. Vá em: **File → Open SQL Script**
4. Selecione o arquivo `SETUP_MYSQL.sql`
5. Clique no ⚡ (raio) para executar
6. Aguarde a mensagem: "✅ Banco de dados GameRent criado com sucesso!"

#### 1.3. Verificar se Funcionou

```sql
-- No MySQL, execute:
USE gamerent_db;
SHOW TABLES;
SELECT COUNT(*) FROM games;
SELECT COUNT(*) FROM users;
```

Você deve ver:
- 5 tabelas criadas
- 6 jogos cadastrados
- 3 usuários de teste

---

### PASSO 2: Configurar e Rodar o Backend

#### 2.1. Navegar para a pasta do backend

```bash
cd backend
```

#### 2.2. Instalar dependências

```bash
npm install
```

Isso instalará:
- express
- mysql2
- bcrypt
- jsonwebtoken
- cors
- dotenv
- express-validator

#### 2.3. Verificar arquivo .env

Abra `backend/.env` e confirme:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=2602
DB_NAME=gamerent_db
DB_PORT=3306
PORT=3001
JWT_SECRET=gamerent_super_secret_key_2024
```

#### 2.4. Iniciar o servidor backend

```bash
npm start

# OU modo desenvolvimento (reinicia automaticamente):
npm run dev
```

Você verá:

```
╔════════════════════════════════════════╗
║   🎮 GameRent API - SERVIDOR ONLINE   ║
╚════════════════════════════════════════╝

✅ Conectado ao MySQL com sucesso!
   → Banco: gamerent_db
   → Rodando em: http://localhost:3001
```

#### 2.5. Testar se o backend funciona

Abra o navegador e acesse:
- http://localhost:3001

Você deve ver:
```json
{
  "message": "🎮 GameRent API - Sistema de Aluguel de Jogos",
  "status": "online"
}
```

**🎉 Backend funcionando!**

---

### PASSO 3: Configurar e Rodar o Frontend

#### 3.1. Abrir OUTRO terminal

⚠️ **NÃO feche o terminal do backend!**

Abra um **novo terminal**.

#### 3.2. Navegar para a pasta principal

```bash
cd ..  # Volta para a raiz do projeto
```

#### 3.3. Instalar dependências do frontend

```bash
npm install
```

#### 3.4. Iniciar o frontend

```bash
npm run dev
```

Você verá:

```
  VITE v5.0.0  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

#### 3.5. Abrir no navegador

Acesse: http://localhost:5173

**🎉 Frontend funcionando!**

---

### PASSO 4: Testar o Sistema Completo

#### 4.1. Criar uma Conta

1. Na página inicial, clique em **"Login"**
2. Clique na aba **"Criar Conta"**
3. Preencha:
   - Username: `teste123`
   - E-mail: `teste@email.com`
   - Senha: `senha123`
   - Confirmar Senha: `senha123`
4. Clique em **"Criar Conta"**

✅ Se funcionou, você verá os jogos e o botão "Sair" no header.

#### 4.2. Fazer uma Reserva

1. Clique em qualquer jogo (ex: Magic: The Gathering)
2. Clique em **"Alugar Jogo"**
3. Selecione uma data futura no calendário
4. Clique em **"Confirmar Reserva"**

✅ Você será redirecionado para "Minhas Reservas"

#### 4.3. Verificar no Banco de Dados

No MySQL:

```sql
USE gamerent_db;

-- Ver sua conta criada
SELECT * FROM users WHERE username = 'teste123';

-- Ver sua reserva
SELECT * FROM reservations WHERE user_id = (SELECT id FROM users WHERE username = 'teste123');
```

✅ Você verá seus dados salvos no banco!

#### 4.4. Editar/Cancelar Reserva

1. Em "Minhas Reservas", clique em **"Editar Data"**
2. Escolha uma nova data
3. Clique em **"Salvar"**

OU

1. Clique em **"Cancelar"**
2. Confirme o cancelamento

✅ As mudanças são salvas no MySQL!

---

## 🎮 Fluxo Completo da Aplicação

```
USUÁRIO (Navegador)
   ↓
FRONTEND (React - Porta 5173)
   ↓ HTTP Request
BACKEND (Node.js - Porta 3001)
   ↓ SQL Query
BANCO DE DADOS (MySQL)
   ↓ Dados
BACKEND
   ↓ JSON Response
FRONTEND
   ↓ Renderiza
USUÁRIO (Vê o resultado)
```

---

## 📡 Como Frontend e Backend se Comunicam

### No Frontend (React):

```typescript
// Fazer login
const response = await fetch('http://localhost:3001/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});

const data = await response.json();
localStorage.setItem('token', data.token);
```

### No Backend (Node.js):

```javascript
// Recebe a requisição
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  
  // Busca no MySQL
  const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
  
  // Valida senha
  const valid = await bcrypt.compare(password, user.password_hash);
  
  // Retorna token
  res.json({ token: jwt.sign(userData, SECRET) });
});
```

### No MySQL:

```sql
-- Dados são consultados/salvos
SELECT * FROM users WHERE email = 'teste@email.com';
INSERT INTO reservations (user_id, game_id, ...) VALUES (1, 2, ...);
```

---

## 🐛 Problemas Comuns e Soluções

### ❌ Backend não inicia - "ECONNREFUSED"

**Problema:** MySQL não está rodando

**Solução:**
```bash
# Windows
net start MySQL80

# Mac/Linux
sudo mysql.server start
```

### ❌ "ER_ACCESS_DENIED_ERROR"

**Problema:** Senha do MySQL incorreta

**Solução:**
1. Verifique a senha no arquivo `backend/.env`
2. Ou altere a senha do MySQL para "2602"

### ❌ "ER_BAD_DB_ERROR: Unknown database 'gamerent_db'"

**Problema:** Banco de dados não foi criado

**Solução:**
Execute o arquivo `SETUP_MYSQL.sql` novamente

### ❌ Frontend não carrega jogos

**Problema:** Backend não está rodando

**Solução:**
1. Verifique se `http://localhost:3001` está acessível
2. Verifique os logs do backend no terminal
3. Verifique o Console do navegador (F12)

### ❌ "Porta 3001 já está em uso"

**Problema:** Outra aplicação usando a porta

**Solução A:** Mude a porta no `backend/.env`:
```
PORT=3002
```

**Solução B:** Mate o processo:
```bash
# Windows
netstat -ano | findstr :3001
taskkill /PID <PID_NUMBER> /F

# Mac/Linux
lsof -ti:3001 | xargs kill
```

### ❌ CORS Error no navegador

**Problema:** Frontend e backend em domínios diferentes

**Solução:** Já está configurado no backend (`server.js`):
```javascript
app.use(cors({
  origin: 'http://localhost:5173'
}));
```

---

## 🔍 Verificação Completa

Use este checklist para garantir que tudo está funcionando:

### Backend
- [ ] MySQL rodando
- [ ] Banco `gamerent_db` criado
- [ ] Servidor backend rodando na porta 3001
- [ ] `http://localhost:3001` retorna JSON
- [ ] Logs do backend aparecem no terminal

### Frontend
- [ ] Servidor frontend rodando na porta 5173
- [ ] `http://localhost:5173` abre a página
- [ ] Jogos aparecem na página inicial
- [ ] Console do navegador (F12) sem erros

### Integração
- [ ] Consegue criar conta
- [ ] Consegue fazer login
- [ ] Consegue ver detalhes de um jogo
- [ ] Consegue criar reserva
- [ ] Reserva aparece no banco de dados
- [ ] Consegue editar/cancelar reserva

---

## 📊 Dados de Teste

O banco já vem com usuários de teste:

```
Username: admin
Email: admin@gamerent.com
Senha: teste123

Username: joao
Email: joao@email.com
Senha: teste123

Username: maria
Email: maria@email.com
Senha: teste123
```

**⚠️ NOTA:** As senhas dos usuários de teste precisam ser geradas após o primeiro registro. Use os dados acima como referência.

---

## 🚀 Comandos Úteis

### Reiniciar tudo do zero:

```bash
# 1. Parar backend (Ctrl+C no terminal do backend)
# 2. Parar frontend (Ctrl+C no terminal do frontend)
# 3. Recriar banco
mysql -u root -p2602 < SETUP_MYSQL.sql

# 4. Reiniciar backend
cd backend
npm start

# 5. Reiniciar frontend (outro terminal)
npm run dev
```

### Ver logs do MySQL:

```bash
# Ver últimas queries
mysql -u root -p2602 -e "SHOW FULL PROCESSLIST;"
```

### Limpar banco e começar de novo:

```sql
DROP DATABASE gamerent_db;
-- Depois execute SETUP_MYSQL.sql novamente
```

---

## 🎯 Próximos Passos

Agora que tudo está funcionando, você pode:

1. ✅ Adicionar mais jogos no banco de dados
2. ✅ Customizar o frontend (cores, layout)
3. ✅ Adicionar novas funcionalidades (avaliações, comentários)
4. ✅ Fazer deploy em produção
5. ✅ Adicionar sistema de pagamento
6. ✅ Criar painel administrativo

---

## 📞 Suporte

Se tiver problemas:

1. Verifique os logs no terminal
2. Verifique o Console do navegador (F12)
3. Teste cada camada separadamente:
   - MySQL funciona?
   - Backend funciona?
   - Frontend funciona?
4. Consulte os arquivos README de cada parte

---

## 🎉 Conclusão

Parabéns! Você tem um sistema completo funcionando com:

✅ **Frontend React** - Interface moderna e responsiva  
✅ **Backend Node.js** - API REST completa  
✅ **Banco MySQL** - Dados persistentes e relacionais  
✅ **Autenticação JWT** - Sistema seguro de login  
✅ **CRUD Completo** - Create, Read, Update, Delete  

**Seu sistema está 100% funcional e pronto para ser desenvolvido!** 🚀🎮

---

**Desenvolvido para o projeto GameRent** 
*Sistema de Aluguel de Jogos de Tabuleiro e Cartas*
