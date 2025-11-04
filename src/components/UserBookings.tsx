// Componente para visualizar os próprios agendamentos do usuário
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { toast } from 'sonner@2.0.3';
import { projectId } from '../utils/supabase/info';
import { Calendar, MapPin, Mail, Phone, User, X } from 'lucide-react';

interface Booking {
  id: string;
  name: string;
  email: string;
  phone: string;
  eventDate: string;
  location: string;
  eventType: string;
  details: string;
  createdAt: string;
}

interface UserBookingsProps {
  accessToken: string;
}

export function UserBookings({ accessToken }: UserBookingsProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  // Carrega os agendamentos do usuário
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

  // Função para cancelar agendamento
  const handleCancelBooking = async (bookingId: string, eventDate: string) => {
    // Verifica se a data do evento já passou
    const eventDateObj = new Date(eventDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (eventDateObj < today) {
      toast.error('Não é possível cancelar eventos que já ocorreram');
      return;
    }

    if (!confirm('Tem certeza que deseja cancelar este agendamento?')) return;

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
        toast.success('Agendamento cancelado com sucesso!');
        fetchBookings(); // Recarrega a lista
      } else {
        toast.error(data.error || 'Erro ao cancelar agendamento');
      }
    } catch (error) {
      console.error('Erro ao cancelar:', error);
      toast.error('Erro ao cancelar agendamento');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12 text-white">
        <p>Carregando seus agendamentos...</p>
      </div>
    );
  }

  return (
    <section className="py-12 px-4 bg-zinc-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 text-white">
          <h2 className="mb-2">Meus Agendamentos</h2>
          <p className="opacity-90 text-sm">
            Veja todos os seus shows agendados
          </p>
        </div>

        {bookings.length === 0 ? (
          <Card className="bg-zinc-800 border-zinc-700">
            <CardContent className="py-12 text-center text-white">
              <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="opacity-80">Você ainda não tem agendamentos</p>
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
                    Agendado em {new Date(booking.createdAt).toLocaleDateString('pt-BR')}
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

                  {/* Botão de cancelar agendamento */}
                  <div className="pt-4">
                    <Button
                      onClick={() => handleCancelBooking(booking.id, booking.eventDate)}
                      variant="destructive"
                      size="sm"
                      className="w-full"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancelar Agendamento
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
