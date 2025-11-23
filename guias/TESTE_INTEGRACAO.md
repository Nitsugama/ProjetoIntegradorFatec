# ✅ Guia de Teste - Integração Frontend ↔ Backend

## 🎯 O Que Foi Feito

Conectei o frontend React ao backend Node.js. Agora:

- ✅ **Jogos vêm do MySQL** (não mais do array estático)
- ✅ **Login e registro são reais** (salvos no banco)
- ✅ **Reservas são persistentes** (não somem ao recarregar)

---

## 🚀 Como Testar (Passo a Passo)

### ⚠️ Pré-requisitos

Você deve ter:
- [ ] Backend rodando em `http://localhost:3001`
- [ ] Banco MySQL configurado e rodando
- [ ] Frontend rodando em `http://localhost:5173`

---

### TESTE 1: Verificar se Backend está Conectado

#### 1.1 Abra o navegador
Acesse: `http://localhost:5173`

#### 1.2 O que você DEVE ver:
- ✅ **Tela de loading** com mensagem "Carregando jogos do banco de dados..."
- ✅ Depois de 1-2 segundos, a **página inicial com 6 jogos**

#### 1.3 O que você NÃO deve ver:
- ❌ Loading infinito
- ❌ Página em branco
- ❌ Erro no console

#### 1.4 Verificar no Console do Navegador (F12)
Abra o Console (F12 → aba "Console") e procure:
```
✅ Jogos carregados do backend: 6
```

**Se você vê isso:** ✅ **Frontend está conectado ao backend!**

**Se você vê erro:** ❌ Veja a seção "Troubleshooting" abaixo

---

### TESTE 2: Criar uma Conta Nova

#### 2.1 Clique em "Login" no header

#### 2.2 Clique na aba "Criar Conta"

#### 2.3 Preencha os dados:
```
Usuário: teste123
E-mail: teste@email.com
Senha: senha123
Confirmar Senha: senha123
```

#### 2.4 Clique em "Criar Conta"

#### 2.5 O que você DEVE ver:
- ✅ Alert: "Conta criada com sucesso! Você já está logado."
- ✅ Modal fecha automaticamente
- ✅ No header, botão "Login" vira "Sair"

#### 2.6 Verificar no Console do Navegador:
```
📝 Tentando criar conta... teste123 teste@email.com
✅ Conta criada com sucesso! {id: X, username: "teste123", ...}
✅ Reservas carregadas: 0
```

#### 2.7 Verificar no Banco de Dados:
Abra o MySQL e execute:
```sql
USE gamerent_db;
SELECT * FROM users WHERE username = 'teste123';
```

**Resultado esperado:** ✅ 1 linha com seus dados

---

### TESTE 3: Fazer Login com Conta Criada

#### 3.1 Faça logout (botão "Sair")

#### 3.2 Clique em "Login"

#### 3.3 Aba "Login", preencha:
```
E-mail: teste@email.com
Senha: senha123
```

#### 3.4 Clique em "Entrar"

#### 3.5 O que você DEVE ver:
- ✅ Alert: "Login realizado com sucesso!"
- ✅ Volta para a página inicial logado

#### 3.6 Verificar no Console:
```
🔐 Tentando fazer login... teste@email.com
✅ Login bem-sucedido! {id: X, username: "teste123", ...}
✅ Reservas carregadas: 0
```

---

### TESTE 4: Criar uma Reserva

#### 4.1 Na página inicial, clique em qualquer jogo (ex: Magic: The Gathering)

#### 4.2 Clique no botão "Alugar Jogo"

#### 4.3 Você será redirecionado para o calendário

#### 4.4 Selecione uma data FUTURA (hoje ou depois)

#### 4.5 Clique em "Confirmar Reserva"

#### 4.6 O que você DEVE ver:
- ✅ Alert: "Reserva criada com sucesso!"
- ✅ Redirecionado para "Minhas Reservas"
- ✅ Sua reserva aparece na lista

#### 4.7 Verificar no Console:
```
📅 Criando reserva... Magic: The Gathering [data]
✅ Reserva criada com sucesso!
✅ Reservas carregadas: 1
```

#### 4.8 Verificar no Banco de Dados:
```sql
SELECT * FROM reservations WHERE user_id = (SELECT id FROM users WHERE username = 'teste123');
```

**Resultado esperado:** ✅ 1 linha com sua reserva

---

### TESTE 5: Recarregar a Página (Persistência)

#### 5.1 Aperte F5 (recarregar página)

#### 5.2 O que você DEVE ver:
- ✅ **Você continua logado** (não precisa fazer login de novo!)
- ✅ Jogos carregam normalmente
- ✅ Clique em "Minhas Reservas"
- ✅ **Sua reserva ainda está lá!**

**Antes (protótipo):** ❌ Reservas sumiam ao recarregar  
**Agora (com banco):** ✅ Reservas persistem!

---

### TESTE 6: Editar Reserva

#### 6.1 Em "Minhas Reservas", clique em "Editar Data" na sua reserva

#### 6.2 Selecione uma nova data

#### 6.3 Clique em "Salvar"

#### 6.4 O que você DEVE ver:
- ✅ Alert: "Reserva atualizada com sucesso!"
- ✅ A data da reserva mudou na lista

#### 6.5 Verificar no Console:
```
✏️ Atualizando reserva... [id] [nova data]
✅ Reserva atualizada com sucesso!
```

---

### TESTE 7: Cancelar Reserva

#### 7.1 Clique em "Cancelar" na sua reserva

#### 7.2 Confirme no modal

#### 7.3 O que você DEVE ver:
- ✅ Alert: "Reserva cancelada com sucesso!"
- ✅ A reserva desaparece da lista

#### 7.4 Verificar no Banco:
```sql
SELECT * FROM reservations WHERE user_id = (SELECT id FROM users WHERE username = 'teste123');
```

**Resultado:** ✅ 1 linha com `status = 'cancelled'` (não é deletada, só cancelada)

---

## 🐛 Troubleshooting (Problemas Comuns)

### ❌ Loading Infinito na Página Inicial

**Sintomas:**
- Tela fica em "Carregando jogos do banco de dados..." para sempre
- No console: erro de conexão

**Causa:** Backend não está rodando

**Solução:**
```bash
cd backend
npm start
```

Verifique se aparece:
```
✅ Conectado ao MySQL com sucesso!
   → Rodando em: http://localhost:3001
```

---

### ❌ Erro ao Criar Conta/Login

**Sintomas:**
- Alert: "Erro de conexão. Verifique se o backend está rodando..."

**Causa:** Frontend não consegue acessar `http://localhost:3001`

**Verificações:**

1. **Backend está rodando?**
   ```bash
   # Deve mostrar: ✅ Conectado ao MySQL
   ```

2. **Testar backend diretamente:**
   Abra: `http://localhost:3001`
   
   **Deve mostrar JSON:**
   ```json
   {
     "message": "🎮 GameRent API - Sistema de Aluguel de Jogos",
     "status": "online"
   }
   ```

3. **Verificar CORS:**
   No arquivo `backend/server.js`, linha ~30:
   ```javascript
   app.use(cors({
     origin: 'http://localhost:5173',  // ✅ Deve ser esta URL
     credentials: true
   }));
   ```

---

### ❌ "E-mail ou senha incorretos"

**Causa:** Credenciais erradas

**Solução:**
- Certifique-se de usar o e-mail e senha corretos
- Ou crie uma nova conta

---

### ❌ "Este e-mail já está em uso"

**Causa:** Você já criou uma conta com esse e-mail

**Soluções:**

**Opção 1:** Fazer login com a conta existente

**Opção 2:** Deletar do banco:
```sql
DELETE FROM users WHERE email = 'teste@email.com';
```

**Opção 3:** Usar outro e-mail:
```
teste2@email.com
teste3@email.com
```

---

### ❌ "Sua sessão expirou"

**Causa:** Token JWT expirou (após 7 dias)

**Solução:** Faça login novamente

---

### ❌ Jogos não aparecem (lista vazia)

**Causa:** Tabela `games` está vazia no banco

**Solução:**
Execute novamente o `SETUP_MYSQL.sql`:
```bash
mysql -u root -p2602 < SETUP_MYSQL.sql
```

**Verificar:**
```sql
SELECT COUNT(*) FROM games;
-- Deve retornar: 6
```

---

### ❌ Console mostra erro 404

**Erro exemplo:**
```
POST http://localhost:3001/api/auth/login 404 (Not Found)
```

**Causa:** Rota não existe no backend

**Verificações:**

1. **Backend está rodando?** Sim → Próximo passo
2. **Verificar rotas no backend:**
   ```bash
   # No terminal do backend, deve aparecer ao iniciar:
   • POST /api/auth/register - Cadastro
   • POST /api/auth/login - Login
   • GET  /api/games - Listar jogos
   ```

---

### ❌ Console mostra erro CORS

**Erro exemplo:**
```
Access to fetch at 'http://localhost:3001/api/games' from origin 'http://localhost:5173' 
has been blocked by CORS policy
```

**Causa:** CORS não configurado no backend

**Solução:**
Verifique `backend/server.js`:
```javascript
const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:5173',  // ✅ Certifique-se disso
  credentials: true
}));
```

Reinicie o backend após alterar.

---

## 📊 Checklist Final

Use isto para garantir que tudo está funcionando:

### Backend
- [ ] Servidor rodando na porta 3001
- [ ] MySQL conectado
- [ ] `http://localhost:3001` retorna JSON
- [ ] Logs aparecem quando frontend faz requisições

### Frontend
- [ ] Servidor rodando na porta 5173
- [ ] Jogos carregam do backend (6 jogos)
- [ ] Console sem erros vermelhos
- [ ] Loading aparece e depois mostra jogos

### Funcionalidades
- [ ] Criar conta funciona
- [ ] Login funciona
- [ ] Usuário salva no MySQL
- [ ] Fazer logout funciona
- [ ] Criar reserva funciona
- [ ] Reserva salva no MySQL
- [ ] Editar reserva funciona
- [ ] Cancelar reserva funciona
- [ ] Recarregar página mantém login
- [ ] Reservas persistem após F5

---

## 🎉 Tudo Funcionando?

Se todos os testes passaram, **parabéns!** 🎊

Você agora tem um sistema **Full Stack completo e funcional**:

✅ Frontend React conectado  
✅ Backend Node.js respondendo  
✅ MySQL armazenando dados  
✅ Autenticação JWT funcionando  
✅ CRUD de reservas operacional  

---

## 📝 Próximos Passos

Agora que está funcionando, você pode:

1. ✅ Adicionar mais jogos no banco
2. ✅ Customizar o design
3. ✅ Adicionar novas funcionalidades
4. ✅ Fazer deploy em produção

---

## 🆘 Ainda com Problemas?

1. **Verifique os logs:**
   - Terminal do backend
   - Console do navegador (F12)

2. **Teste cada camada:**
   - MySQL: `mysql -u root -p2602`
   - Backend: `curl http://localhost:3001`
   - Frontend: Abrir `http://localhost:5173`

3. **Reinicie tudo:**
   ```bash
   # Ctrl+C em ambos terminais
   
   # Reiniciar backend
   cd backend
   npm start
   
   # Reiniciar frontend (outro terminal)
   npm run dev
   ```

---

**Boa sorte com os testes! 🎮🚀**

*Se tudo funcionar, seu sistema está 100% integrado!*
