// Painel Administrativo - Gerenciar todos os agendamentos
import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { toast } from 'sonner@2.0.3';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { Edit, Trash2, Calendar, MapPin, Mail, Phone, User } from 'lucide-react';

interface Booking {
  id: string;
  name: string;
  email: string;
  phone: string;
  eventDate: string;
  location: string;
  eventType: string;
  details: string;
  userEmail: string;
  createdAt: string;
  updatedAt?: string;
  updatedBy?: string;
}

interface AdminDashboardProps {
  accessToken: string;
}

export function AdminDashboard({ accessToken }: AdminDashboardProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<Booking>>({});

  // Carrega todos os agendamentos
  const fetchBookings = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-8796274d/bookings`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      const data = await response.json();
      
      if (response.ok) {
        setBookings(data.bookings || []);
      } else {
        toast.error(data.error || 'Erro ao carregar agendamentos');
      }
    } catch (error) {
      console.error('Erro ao buscar agendamentos:', error);
      toast.error('Erro ao carregar agendamentos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Função para deletar agendamento
  const handleDelete = async (bookingId: string) => {
    if (!confirm('Tem certeza que deseja deletar este agendamento?')) return;

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-8796274d/bookings/${bookingId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success('Agendamento deletado com sucesso!');
        fetchBookings(); // Recarrega a lista
      } else {
        toast.error(data.error || 'Erro ao deletar agendamento');
      }
    } catch (error) {
      console.error('Erro ao deletar:', error);
      toast.error('Erro ao deletar agendamento');
    }
  };

  // Função para editar agendamento
  const handleEdit = async () => {
    if (!editingBooking) return;

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-8796274d/bookings/${editingBooking.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify(editFormData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success('Agendamento atualizado com sucesso!');
        setEditingBooking(null);
        setEditFormData({});
        fetchBookings(); // Recarrega a lista
      } else {
        toast.error(data.error || 'Erro ao atualizar agendamento');
      }
    } catch (error) {
      console.error('Erro ao editar:', error);
      toast.error('Erro ao atualizar agendamento');
    }
  };

  // Abre o diálogo de edição
  const openEditDialog = (booking: Booking) => {
    setEditingBooking(booking);
    setEditFormData({
      name: booking.name,
      email: booking.email,
      phone: booking.phone,
      eventDate: booking.eventDate,
      location: booking.location,
      eventType: booking.eventType,
      details: booking.details,
    });
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-white">
        <p>Carregando agendamentos...</p>
      </div>
    );
  }

  return (
    <section className="py-20 px-4 bg-zinc-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 text-white">
          <h2 className="mb-4">Painel Administrativo</h2>
          <p className="opacity-90">
            Gerencie todos os agendamentos de shows
          </p>
        </div>

        {bookings.length === 0 ? (
          <Card className="bg-zinc-800 border-zinc-700">
            <CardContent className="py-12 text-center text-white">
              <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="opacity-80">Nenhum agendamento encontrado</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.map((booking) => (
              <Card key={booking.id} className="bg-zinc-800 border-zinc-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <User className="w-5 h-5" />
                    {booking.name}
                  </CardTitle>
                  <CardDescription>
                    Agendado por: {booking.userEmail}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-white text-sm">
                    <Mail className="w-4 h-4 text-red-600" />
                    {booking.email}
                  </div>
                  
                  <div className="flex items-center gap-2 text-white text-sm">
                    <Phone className="w-4 h-4 text-red-600" />
                    {booking.phone}
                  </div>
                  
                  <div className="flex items-center gap-2 text-white text-sm">
                    <Calendar className="w-4 h-4 text-red-600" />
                    {new Date(booking.eventDate).toLocaleDateString('pt-BR')}
                  </div>
                  
                  <div className="flex items-center gap-2 text-white text-sm">
                    <MapPin className="w-4 h-4 text-red-600" />
                    {booking.location}
                  </div>

                  <div className="pt-3 border-t border-zinc-700">
                    <p className="text-zinc-400 text-sm mb-1">Tipo de Evento:</p>
                    <p className="text-white">{booking.eventType}</p>
                  </div>

                  {booking.details && (
                    <div className="pt-3 border-t border-zinc-700">
                      <p className="text-zinc-400 text-sm mb-1">Detalhes:</p>
                      <p className="text-white text-sm">{booking.details}</p>
                    </div>
                  )}

                  <div className="flex gap-2 pt-4">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1"
                          onClick={() => openEditDialog(booking)}
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Editar
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-zinc-900 border-zinc-800 text-white">
                        <DialogHeader>
                          <DialogTitle>Editar Agendamento</DialogTitle>
                          <DialogDescription>
                            Modifique os dados do agendamento
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 mt-4">
                          <div className="space-y-2">
                            <Label>Nome</Label>
                            <Input
                              value={editFormData.name || ''}
                              onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                              className="bg-zinc-800 border-zinc-700 text-white"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Email</Label>
                            <Input
                              type="email"
                              value={editFormData.email || ''}
                              onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                              className="bg-zinc-800 border-zinc-700 text-white"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Telefone</Label>
                            <Input
                              value={editFormData.phone || ''}
                              onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                              className="bg-zinc-800 border-zinc-700 text-white"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Data do Evento</Label>
                            <Input
                              type="date"
                              value={editFormData.eventDate || ''}
                              onChange={(e) => setEditFormData({ ...editFormData, eventDate: e.target.value })}
                              className="bg-zinc-800 border-zinc-700 text-white"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Local</Label>
                            <Input
                              value={editFormData.location || ''}
                              onChange={(e) => setEditFormData({ ...editFormData, location: e.target.value })}
                              className="bg-zinc-800 border-zinc-700 text-white"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Tipo de Evento</Label>
                            <Input
                              value={editFormData.eventType || ''}
                              onChange={(e) => setEditFormData({ ...editFormData, eventType: e.target.value })}
                              className="bg-zinc-800 border-zinc-700 text-white"
                            />
                          </div>

                          <Button
                            onClick={handleEdit}
                            className="w-full bg-red-600 hover:bg-red-700"
                          >
                            Salvar Alterações
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(booking.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Deletar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
