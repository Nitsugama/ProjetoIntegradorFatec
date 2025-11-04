// Importações necessárias
import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'jsr:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';

// Cria a aplicação Hono
const app = new Hono();

// Middlewares
app.use('*', cors()); // Permite requisições de qualquer origem
app.use('*', logger(console.log)); // Log de todas as requisições

// Cria cliente Supabase para operações do servidor
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

// EMAIL DO ADMINISTRADOR - ALTERE AQUI PARA DEFINIR QUEM É ADMIN
const ADMIN_EMAIL = 'admin@kollapso.com.br';

// ========== ROTAS DE AUTENTICAÇÃO ==========

// Rota para criar novo usuário (signup)
app.post('/make-server-8796274d/signup', async (c) => {
  try {
    const { email, password, name, isAdmin } = await c.req.json();

    // Cria o usuário no Supabase Auth
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { 
        name,
        role: email === ADMIN_EMAIL ? 'admin' : 'user' // Define role baseado no email
      },
      email_confirm: true, // Confirma email automaticamente
    });

    if (error) {
      console.log(`Erro ao criar usuário: ${error.message}`);
      return c.json({ error: error.message }, 400);
    }

    return c.json({ 
      message: 'Usuário criado com sucesso!',
      user: data.user 
    });
  } catch (error) {
    console.log(`Erro no signup: ${error}`);
    return c.json({ error: 'Erro ao criar usuário' }, 500);
  }
});

// ========== ROTAS DE AGENDAMENTOS (BOOKINGS) ==========

// Criar novo agendamento
app.post('/make-server-8796274d/bookings', async (c) => {
  try {
    // Verifica autenticação
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user?.id) {
      return c.json({ error: 'Não autorizado' }, 401);
    }

    const bookingData = await c.req.json();
    
    // Verifica se a data já está ocupada
    const allBookings = await kv.getByPrefix('bookings:');
    const requestedDate = new Date(bookingData.eventDate).toISOString().split('T')[0];
    
    const dateOccupied = allBookings.some(booking => {
      const bookingDate = new Date(booking.eventDate).toISOString().split('T')[0];
      return bookingDate === requestedDate;
    });
    
    if (dateOccupied) {
      return c.json({ error: 'Esta data já está ocupada. Por favor, escolha outra data.' }, 400);
    }
    
    // Gera ID único para o agendamento
    const bookingId = `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Salva no banco de dados
    const booking = {
      id: bookingId,
      ...bookingData,
      userId: user.id,
      userEmail: user.email,
      createdAt: new Date().toISOString(),
    };
    
    await kv.set(`bookings:${bookingId}`, booking);
    
    return c.json({ 
      message: 'Agendamento criado com sucesso!',
      booking 
    });
  } catch (error) {
    console.log(`Erro ao criar agendamento: ${error}`);
    return c.json({ error: 'Erro ao criar agendamento' }, 500);
  }
});

// Listar todos os agendamentos
app.get('/make-server-8796274d/bookings', async (c) => {
  try {
    // Verifica autenticação
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user?.id) {
      return c.json({ error: 'Não autorizado' }, 401);
    }

    // Busca todos os agendamentos
    const allBookings = await kv.getByPrefix('bookings:');
    
    // Se não é admin, mostra apenas seus próprios agendamentos
    const userRole = user.user_metadata?.role;
    const bookings = userRole === 'admin' 
      ? allBookings 
      : allBookings.filter(b => b.userId === user.id);
    
    return c.json({ bookings });
  } catch (error) {
    console.log(`Erro ao listar agendamentos: ${error}`);
    return c.json({ error: 'Erro ao listar agendamentos' }, 500);
  }
});

// Buscar datas ocupadas (para exibir no calendário)
app.get('/make-server-8796274d/bookings/occupied-dates', async (c) => {
  try {
    // Verifica autenticação
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user?.id) {
      return c.json({ error: 'Não autorizado' }, 401);
    }

    // Busca todos os agendamentos
    const allBookings = await kv.getByPrefix('bookings:');
    
    // Extrai apenas as datas (sem horas) dos agendamentos
    const occupiedDates = allBookings.map(booking => {
      const date = new Date(booking.eventDate);
      return date.toISOString().split('T')[0]; // Formato: YYYY-MM-DD
    });
    
    // Remove duplicatas
    const uniqueDates = [...new Set(occupiedDates)];
    
    return c.json({ occupiedDates: uniqueDates });
  } catch (error) {
    console.log(`Erro ao buscar datas ocupadas: ${error}`);
    return c.json({ error: 'Erro ao buscar datas ocupadas' }, 500);
  }
});

// Atualizar agendamento (apenas admin)
app.put('/make-server-8796274d/bookings/:id', async (c) => {
  try {
    // Verifica autenticação e se é admin
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user?.id) {
      return c.json({ error: 'Não autorizado' }, 401);
    }

    const userRole = user.user_metadata?.role;
    if (userRole !== 'admin') {
      return c.json({ error: 'Apenas administradores podem editar agendamentos' }, 403);
    }

    const bookingId = c.req.param('id');
    const updates = await c.req.json();
    
    // Busca agendamento existente
    const existingBooking = await kv.get(`bookings:${bookingId}`);
    if (!existingBooking) {
      return c.json({ error: 'Agendamento não encontrado' }, 404);
    }
    
    // Atualiza o agendamento
    const updatedBooking = {
      ...existingBooking,
      ...updates,
      updatedAt: new Date().toISOString(),
      updatedBy: user.email,
    };
    
    await kv.set(`bookings:${bookingId}`, updatedBooking);
    
    return c.json({ 
      message: 'Agendamento atualizado com sucesso!',
      booking: updatedBooking 
    });
  } catch (error) {
    console.log(`Erro ao atualizar agendamento: ${error}`);
    return c.json({ error: 'Erro ao atualizar agendamento' }, 500);
  }
});

// Deletar agendamento (admin pode deletar qualquer um, usuário pode deletar apenas os seus)
app.delete('/make-server-8796274d/bookings/:id', async (c) => {
  try {
    // Verifica autenticação
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user?.id) {
      return c.json({ error: 'Não autorizado' }, 401);
    }

    const bookingId = c.req.param('id');
    
    // Verifica se existe
    const existingBooking = await kv.get(`bookings:${bookingId}`);
    if (!existingBooking) {
      return c.json({ error: 'Agendamento não encontrado' }, 404);
    }

    const userRole = user.user_metadata?.role;
    
    // Verifica permissões: admin pode deletar qualquer um, usuário só pode deletar os seus
    if (userRole !== 'admin' && existingBooking.userId !== user.id) {
      return c.json({ error: 'Você só pode cancelar seus próprios agendamentos' }, 403);
    }
    
    // Deleta o agendamento
    await kv.del(`bookings:${bookingId}`);
    
    return c.json({ message: 'Agendamento cancelado com sucesso!' });
  } catch (error) {
    console.log(`Erro ao deletar agendamento: ${error}`);
    return c.json({ error: 'Erro ao deletar agendamento' }, 500);
  }
});

// Rota de teste
app.get('/make-server-8796274d/health', (c) => {
  return c.json({ status: 'OK', message: 'Servidor funcionando!' });
});

// Inicia o servidor
Deno.serve(app.fetch);
