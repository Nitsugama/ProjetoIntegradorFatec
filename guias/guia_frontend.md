# 🎨 Guia de Customização do Frontend

Este guia mostra **exatamente onde** você deve mexer para customizar o visual e conteúdo do seu site GameRent.

---

## 📋 Índice Rápido

1. [Nome do Site](#1-nome-do-site)
2. [Logo/Ícone](#2-logoícone)
3. [Cores do Sistema](#3-cores-do-sistema)
4. [Informações de Contato](#4-informações-de-contato)
5. [Título da Página (Aba do Navegador)](#5-título-da-página-aba-do-navegador)
6. [Favicon (Ícone da Aba)](#6-favicon-ícone-da-aba)
7. [Textos do Site](#7-textos-do-site)

---

## 1. Nome do Site

### 📁 Arquivo: `/components/Header.tsx`

**Localização:** Linha **62-65**

```tsx
{/* Logo/Nome do Site */}
<button onClick={onNavigateHome} className="flex items-center gap-2">
  <Gamepad2 className="size-8 text-indigo-600" />
  <span>GameRent</span>  {/* ← MUDE AQUI O NOME! */}
</button>
```

**Como mudar:**
```tsx
<span>MeuSiteDeJogos</span>
// ou
<span>Aluguel de Jogos SP</span>
// ou
<span>Game Store</span>
```

---

## 2. Logo/Ícone

### Opção A: Mudar o Ícone (Lucide Icons)

**📁 Arquivo:** `/components/Header.tsx`  
**Linha:** ~62

```tsx
import { Gamepad2, User, LogOut } from 'lucide-react';  // ← Importa ícones

// ...

<Gamepad2 className="size-8 text-indigo-600" />  {/* ← Ícone atual */}
```

**Ícones disponíveis (Lucide):**
```tsx
// Importe no topo do arquivo:
import { 
  Gamepad2,    // Controle de videogame (atual)
  Dice6,       // Dado
  Crown,       // Coroa
  Trophy,      // Troféu
  Rocket,      // Foguete
  Star,        // Estrela
  Zap,         // Raio
  Heart,       // Coração
  Shield       // Escudo
} from 'lucide-react';

// Use no código:
<Dice6 className="size-8 text-indigo-600" />
```

**Ver todos os ícones:** https://lucide.dev/icons/

### Opção B: Usar Logo Personalizado (Imagem)

**📁 Arquivo:** `/components/Header.tsx`  
**Linha:** ~62

```tsx
{/* ANTES (com ícone): */}
<Gamepad2 className="size-8 text-indigo-600" />

{/* DEPOIS (com imagem): */}
<img 
  src="/logo.png" 
  alt="Logo GameRent" 
  className="h-8 w-auto"
/>
```

**Onde colocar a imagem:**
1. Coloque seu arquivo `logo.png` na pasta `/public/` do projeto
2. A imagem será acessível em `/logo.png`

---

## 3. Cores do Sistema

### 📁 Arquivo: `/styles/globals.css`

**Localização:** Início do arquivo

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* ===== COR PRINCIPAL (Indigo/Roxo) ===== */
    /* Use este gerador: https://ui.shadcn.com/themes */
    
    --primary: 239 84% 67%;        /* ← Indigo 500 */
    --primary-foreground: 0 0% 100%;
    
    /* ===== COR DE DESTAQUE ===== */
    --accent: 217 91% 60%;
    --accent-foreground: 0 0% 100%;
  }
}
```

### 🎨 Como Mudar as Cores Principais

#### Opção 1: Usar o Gerador de Temas do ShadCN

1. Acesse: https://ui.shadcn.com/themes
2. Escolha suas cores
3. Clique em "Copy code"
4. Cole no arquivo `/styles/globals.css`

#### Opção 2: Mudar Manualmente (Tabela de Cores)

**Cores Prontas para Usar:**

```css
/* AZUL */
--primary: 221 83% 53%;  /* Azul vibrante */

/* VERDE */
--primary: 142 71% 45%;  /* Verde natureza */

/* VERMELHO */
--primary: 0 72% 51%;    /* Vermelho forte */

/* LARANJA */
--primary: 25 95% 53%;   /* Laranja energia */

/* ROXO */
--primary: 262 83% 58%;  /* Roxo moderno */

/* ROSA */
--primary: 330 81% 60%;  /* Rosa vibrante */

/* AMARELO */
--primary: 48 96% 53%;   /* Amarelo sol */
```

**Como aplicar:**

Substitua a linha `--primary:` no arquivo `/styles/globals.css`:

```css
:root {
  --primary: 142 71% 45%;  /* ← MUDE ESTA LINHA */
  /* ... resto permanece igual */
}
```

### 🔍 Onde as Cores são Usadas

As cores do `globals.css` afetam automaticamente:

- ✅ Botões primários
- ✅ Links
- ✅ Destaques
- ✅ Ícones principais
- ✅ Bordas ativas
- ✅ Backgrounds de destaque

**Exemplo visual:**
- Botão "Alugar Jogo" → usa `--primary`
- Header ativo → usa `--primary`
- Preços destacados → usa `--primary`

---

## 4. Informações de Contato

### 📁 Arquivo: `/components/Footer.tsx`

**Localização:** Linha **19-50**

```tsx
{/* CONTATO */}
<div>
  <h3 className="mb-4">Contato</h3>
  <div className="space-y-2 text-slate-400">
    <p className="flex items-center gap-2">
      <Mail className="size-4" />
      contato@gamerent.com  {/* ← MUDE O E-MAIL */}
    </p>
    <p className="flex items-center gap-2">
      <Phone className="size-4" />
      (11) 1234-5678  {/* ← MUDE O TELEFONE */}
    </p>
    <p className="flex items-center gap-2">
      <MapPin className="size-4" />
      São Paulo, SP  {/* ← MUDE A LOCALIZAÇÃO */}
    </p>
  </div>
</div>
```

**Exemplo customizado:**

```tsx
<p className="flex items-center gap-2">
  <Mail className="size-4" />
  seuemail@gmail.com
</p>
<p className="flex items-center gap-2">
  <Phone className="size-4" />
  (11) 98765-4321
</p>
<p className="flex items-center gap-2">
  <MapPin className="size-4" />
  Rio de Janeiro, RJ
</p>
```

### Adicionar WhatsApp no Rodapé

**📁 Arquivo:** `/components/Footer.tsx`  
**Linha:** ~19

```tsx
// 1. Adicione no import do topo:
import { Mail, Phone, MapPin, MessageCircle } from 'lucide-react';

// 2. Adicione esta linha no contato:
<p className="flex items-center gap-2">
  <MessageCircle className="size-4" />
  <a 
    href="https://wa.me/5511987654321" 
    target="_blank" 
    className="hover:text-white transition-colors"
  >
    WhatsApp: (11) 98765-4321
  </a>
</p>
```

**Troque:** `5511987654321` pelo seu número (código do país + DDD + número sem espaços)

---

## 5. Título da Página (Aba do Navegador)

### 📁 Arquivo: `/index.html`

**Localização:** Linha ~7

```html
<head>
  <meta charset="UTF-8" />
  <link rel="icon" type="image/svg+xml" href="/vite.svg" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>GameRent - Aluguel de Jogos</title>  <!-- ← MUDE AQUI -->
</head>
```

**Exemplos:**

```html
<title>Meu Site de Jogos | Aluguel</title>
<title>GameStore - Alugue Jogos de Tabuleiro</title>
<title>Ludoteca Online | Jogos para Alugar</title>
```

---

## 6. Favicon (Ícone da Aba)

O favicon é o pequeno ícone que aparece na aba do navegador.

### Opção A: Usar um Emoji como Favicon

**📁 Arquivo:** `/index.html`  
**Linha:** ~5

```html
<!-- ANTES: -->
<link rel="icon" type="image/svg+xml" href="/vite.svg" />

<!-- DEPOIS (com emoji): -->
<link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🎮</text></svg>">
```

**Emojis sugeridos:**
- 🎮 Controle (atual sugestão)
- 🎲 Dado
- 🃏 Cartas
- 🏆 Troféu
- 👾 Alien/Game
- 🎯 Alvo

**Trocar o emoji:**

Substitua `🎮` por outro emoji:

```html
<link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🎲</text></svg>">
```

### Opção B: Usar uma Imagem como Favicon

1. **Crie um arquivo `favicon.png`** (32x32 pixels ou 64x64 pixels)
2. **Coloque na pasta `/public/`**
3. **Edite o `/index.html`:**

```html
<link rel="icon" type="image/png" href="/favicon.png" />
```

**Ferramentas para criar favicons:**
- https://favicon.io/ (gratuito)
- https://realfavicongenerator.net/ (completo)

---

## 7. Textos do Site

### Descrição da Página Inicial

**📁 Arquivo:** `/components/HomePage.tsx`  
**Linha:** ~32-35

```tsx
{/* Título e descrição da página */}
<div className="text-center mb-12">
  <h1 className="mb-4">Catálogo de Jogos</h1>  {/* ← MUDE O TÍTULO */}
  <p className="text-slate-600 max-w-2xl mx-auto">
    Explore nossa coleção de jogos de cartas e tabuleiro. 
    Alugue seus favoritos e divirta-se!  {/* ← MUDE A DESCRIÇÃO */}
  </p>
</div>
```

**Exemplo customizado:**

```tsx
<h1 className="mb-4">Bem-vindo à GameStore!</h1>
<p className="text-slate-600 max-w-2xl mx-auto">
  Descubra centenas de jogos incríveis disponíveis para aluguel. 
  De estratégia a party games, temos opções para toda a família!
</p>
```

### Mensagem de "Sem Reservas"

**📁 Arquivo:** `/components/ReservationManagement.tsx`  
**Linha:** ~58-65

```tsx
{activeReservations.length === 0 ? (
  <div className="text-center py-12">
    <p className="text-slate-600 mb-4">
      Você ainda não tem reservas ativas.  {/* ← MUDE ESTA MENSAGEM */}
    </p>
    <Button onClick={onBack}>
      Explorar Jogos  {/* ← MUDE O TEXTO DO BOTÃO */}
    </Button>
  </div>
```

### Textos dos Botões

Busque por `<Button>` nos arquivos e mude os textos:

**Exemplos:**

```tsx
{/* GameDetailsPage.tsx - Botão de alugar */}
<Button onClick={onRentClick}>
  Alugar Jogo  {/* ← "Reservar", "Alugar Agora", etc */}
</Button>

{/* CalendarPage.tsx - Confirmar */}
<Button onClick={handleConfirm}>
  Confirmar Reserva  {/* ← "Finalizar", "Reservar Data", etc */}
</Button>

{/* LoginDialog.tsx - Login */}
<Button type="submit">
  Entrar  {/* ← "Login", "Acessar", etc */}
</Button>
```

---

## 📊 Resumo de Arquivos por Mudança

| Mudança Desejada | Arquivo | Linha Aproximada |
|------------------|---------|------------------|
| **Nome do site (header)** | `/components/Header.tsx` | 65 |
| **Logo/Ícone** | `/components/Header.tsx` | 62-63 |
| **Cores principais** | `/styles/globals.css` | 5-15 |
| **E-mail de contato** | `/components/Footer.tsx` | 24 |
| **Telefone** | `/components/Footer.tsx` | 28 |
| **Localização** | `/components/Footer.tsx` | 32 |
| **Título da aba** | `/index.html` | 7 |
| **Favicon** | `/index.html` | 5 |
| **Texto da home** | `/components/HomePage.tsx` | 33-36 |

---

## 🎨 Dicas de Design

### Combinar Cores

Use estas combinações prontas:

**1. Azul Profissional:**
```css
--primary: 221 83% 53%;  /* Azul */
```
Combina com: Branco, Cinza claro

**2. Verde Natureza:**
```css
--primary: 142 71% 45%;  /* Verde */
```
Combina com: Bege, Marrom claro

**3. Roxo Moderno:**
```css
--primary: 262 83% 58%;  /* Roxo */
```
Combina com: Rosa claro, Preto

**4. Laranja Energia:**
```css
--primary: 25 95% 53%;  /* Laranja */
```
Combina com: Azul escuro, Branco

### Fontes

As fontes são definidas em `/styles/globals.css`:

```css
body {
  font-family: system-ui, -apple-system, sans-serif;
}
```

**Para mudar a fonte:**

1. Importe do Google Fonts no `/index.html`:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
```

2. Use no `/styles/globals.css`:
```css
body {
  font-family: 'Poppins', sans-serif;
}
```

**Fontes sugeridas:**
- **Poppins** - Moderna e limpa
- **Roboto** - Profissional
- **Montserrat** - Elegante
- **Open Sans** - Legível

---

## ✅ Checklist de Customização

Use isto para garantir que customizou tudo:

- [ ] Nome do site no header
- [ ] Logo/ícone do header
- [ ] Cores principais (CSS)
- [ ] E-mail de contato
- [ ] Telefone de contato
- [ ] Localização/endereço
- [ ] Título da página (aba)
- [ ] Favicon (ícone da aba)
- [ ] Texto da página inicial
- [ ] Textos dos botões
- [ ] Fontes (opcional)

---

## 🆘 Problemas Comuns

### As cores não mudaram

**Causa:** Cache do navegador  
**Solução:** Aperte `Ctrl + Shift + R` (recarregar forçado)

### O favicon não aparece

**Causa:** Cache muito forte  
**Solução:** 
1. Feche o navegador completamente
2. Abra novamente
3. Limpe o cache: `Ctrl + Shift + Delete`

### As mudanças não aparecem

**Solução:**
1. Certifique-se de salvar o arquivo (`Ctrl + S`)
2. Verifique se o servidor está rodando (`npm run dev`)
3. Recarregue a página (`F5`)

---

## 🎯 Próximos Passos

Depois de customizar o básico, você pode:

1. ✅ Adicionar redes sociais no rodapé
2. ✅ Criar uma página "Sobre Nós"
3. ✅ Adicionar mais categorias de jogos
4. ✅ Customizar as mensagens de erro
5. ✅ Adicionar um banner/slideshow na home

---

**Boa customização! 🎨🚀**

*Qualquer dúvida, consulte este guia ou a documentação do projeto.*
