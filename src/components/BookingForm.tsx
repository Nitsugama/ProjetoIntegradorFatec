// Importações necessárias
import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Calendar as CalendarComponent } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Calendar, MapPin, Mail, Phone, User } from 'lucide-react'; // Ícones
import { toast } from 'sonner@2.0.3'; // Sistema de notificações
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { format } from 'date-fns@4.1.0';
import { ptBR } from 'date-fns@4.1.0/locale';
import { cn } from './ui/utils';

// Interface para as props do componente
interface BookingFormProps {
  accessToken?: string; // Token de autenticação (opcional para usuários não logados)
}

// Componente do Formulário de Agendamento
export function BookingForm({ accessToken }: BookingFormProps) {
  // Estado do formulário com todos os campos
  // ADICIONE NOVOS CAMPOS AQUI SE NECESSÁRIO
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    eventDate: '',
    location: '',
    eventType: '',
    details: ''
  });

  const [loading, setLoading] = useState(false);
  const [occupiedDates, setOccupiedDates] = useState<Date[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [calendarOpen, setCalendarOpen] = useState(false);

  // Busca as datas ocupadas ao carregar o componente
  useEffect(() => {
    if (accessToken) {
      fetchOccupiedDates();
    }
  }, [accessToken]);

  // Função para buscar datas ocupadas do backend
  const fetchOccupiedDates = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-8796274d/bookings/occupied-dates`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Converte as strings de data para objetos Date
        const dates = data.occupiedDates.map((dateStr: string) => new Date(dateStr + 'T00:00:00'));
        setOccupiedDates(dates);
      }
    } catch (error) {
      console.error('Erro ao buscar datas ocupadas:', error);
    }
  };

  // Função que verifica se uma data está ocupada
  const isDateOccupied = (date: Date) => {
    return occupiedDates.some(occupiedDate => {
      return (
        occupiedDate.getFullYear() === date.getFullYear() &&
        occupiedDate.getMonth() === date.getMonth() &&
        occupiedDate.getDate() === date.getDate()
      );
    });
  };

  // Função chamada quando uma data é selecionada no calendário
  const handleDateSelect = (date: Date | undefined) => {
    if (date && !isDateOccupied(date)) {
      setSelectedDate(date);
      // Formata a data para o formato YYYY-MM-DD para o input
      const formattedDate = format(date, 'yyyy-MM-dd');
      setFormData({ ...formData, eventDate: formattedDate });
      setCalendarOpen(false);
    } else if (date && isDateOccupied(date)) {
      toast.error('Esta data já está ocupada. Escolha outra data.');
    }
  };

  // Função que é executada quando o formulário é enviado
  // ENVIA OS DADOS PARA O BACKEND (SUPABASE)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Previne o reload da página
    
    // Verifica se o usuário está logado
    if (!accessToken) {
      toast.error('Você precisa estar logado para agendar um show');
      return;
    }

    setLoading(true);

    try {
      // Envia os dados para o backend
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-8796274d/bookings`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`, // Envia o token de autenticação
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Exibe mensagem de sucesso
        toast.success('Agendamento realizado com sucesso! Entraremos em contato em breve.');
        
        // Limpa o formulário após o envio
        setFormData({
          name: '',
          email: '',
          phone: '',
          eventDate: '',
          location: '',
          eventType: '',
          details: ''
        });
        setSelectedDate(undefined);
        
        // Recarrega as datas ocupadas
        fetchOccupiedDates();
      } else {
        toast.error(data.error || 'Erro ao criar agendamento');
      }
    } catch (error) {
      console.error('Erro ao enviar agendamento:', error);
      toast.error('Erro ao criar agendamento. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Função que atualiza o estado quando os campos mudam
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    // Section do formulário com id "booking" para o scroll funcionar
    <section id="booking" className="py-20 px-4 bg-zinc-950">
      <div className="max-w-4xl mx-auto">
        {/* Cabeçalho da seção */}
        <div className="text-center mb-12 text-white">
          {/* Título da seção - EDITE AQUI */}
          <h2 className="mb-4">Agende seu Show</h2>
          {/* Descrição da seção - EDITE AQUI */}
          <p className="opacity-90">
            Preencha o formulário abaixo e entraremos em contato para discutir os detalhes do seu evento
          </p>
        </div>

        {/* Card do formulário */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            {/* Título do card */}
            <CardTitle className="text-white">Solicitar Orçamento</CardTitle>
            {/* Subtítulo do card */}
            <CardDescription>
              Queremos fazer parte do seu evento especial
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Formulário principal */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Grid com 2 colunas para os campos */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Campo: Nome */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Nome
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="bg-zinc-800 border-zinc-700 text-white"
                    placeholder="Seu nome completo"
                  />
                </div>

                {/* Campo: Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="bg-zinc-800 border-zinc-700 text-white"
                    placeholder="seu@email.com"
                  />
                </div>

                {/* Campo: Telefone */}
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-white flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Telefone
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="bg-zinc-800 border-zinc-700 text-white"
                    placeholder="(00) 00000-0000"
                  />
                </div>

                {/* Campo: Data do Evento com Calendário Visual */}
                <div className="space-y-2">
                  <Label htmlFor="eventDate" className="text-white flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Data do Evento
                  </Label>
                  <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700 hover:text-white",
                          !selectedDate && "text-zinc-400"
                        )}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {selectedDate ? (
                          format(selectedDate, "PPP", { locale: ptBR })
                        ) : (
                          <span>Selecione uma data disponível</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-zinc-900 border-zinc-700" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={selectedDate}
                        onSelect={handleDateSelect}
                        disabled={(date) => {
                          // Desabilita datas passadas
                          const today = new Date();
                          today.setHours(0, 0, 0, 0);
                          if (date < today) return true;
                          
                          // Desabilita datas ocupadas
                          return isDateOccupied(date);
                        }}
                        initialFocus
                        className="text-white"
                        classNames={{
                          day_selected: "bg-red-600 text-white hover:bg-red-700",
                          day_today: "bg-zinc-800 text-white",
                          day_disabled: "text-zinc-600 line-through opacity-50",
                        }}
                      />
                      <div className="p-3 border-t border-zinc-700">
                        <p className="text-xs text-zinc-400">
                          🔴 Datas riscadas = Já ocupadas
                        </p>
                      </div>
                    </PopoverContent>
                  </Popover>
                  {/* Input oculto para validação do formulário */}
                  <input
                    type="hidden"
                    name="eventDate"
                    value={formData.eventDate}
                    required
                  />
                </div>

                {/* Campo: Local do Evento */}
                <div className="space-y-2">
                  <Label htmlFor="location" className="text-white flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Local
                  </Label>
                  <Input
                    id="location"
                    name="location"
                    type="text"
                    required
                    value={formData.location}
                    onChange={handleChange}
                    className="bg-zinc-800 border-zinc-700 text-white"
                    placeholder="Cidade/Estado"
                  />
                </div>

                {/* Campo: Tipo de Evento */}
                <div className="space-y-2">
                  <Label htmlFor="eventType" className="text-white">
                    Tipo de Evento
                  </Label>
                  <Input
                    id="eventType"
                    name="eventType"
                    type="text"
                    required
                    value={formData.eventType}
                    onChange={handleChange}
                    className="bg-zinc-800 border-zinc-700 text-white"
                    placeholder="Festa, casamento, corporativo..."
                  />
                </div>
              </div>

              {/* Campo: Detalhes (textarea - campo grande) */}
              <div className="space-y-2">
                <Label htmlFor="details" className="text-white">
                  Detalhes do Evento
                </Label>
                <Textarea
                  id="details"
                  name="details"
                  value={formData.details}
                  onChange={handleChange}
                  className="bg-zinc-800 border-zinc-700 text-white min-h-32"
                  placeholder="Conte-nos mais sobre o seu evento, número de convidados, horário desejado, etc."
                />
              </div>

              {/* Botão de envio - ALTERE bg-red-600 PARA MUDAR A COR */}
              <Button 
                type="submit" 
                className="w-full bg-red-600 hover:bg-red-700"
                disabled={loading}
              >
                {loading ? 'Enviando...' : 'Enviar Solicitação'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
