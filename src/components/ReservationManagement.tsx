import { useState } from 'react';
import { ArrowLeft, Calendar as CalendarIcon, Edit2, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Calendar } from './ui/calendar';
import { Badge } from './ui/badge';
import type { Reservation } from '../App';

// ============================================================================
// COMPONENTE RESERVATION MANAGEMENT - Gerenciamento de reservas
// ============================================================================

/**
 * Interface que define as propriedades do componente
 */
interface ReservationManagementProps {
  reservations: Reservation[];  // Array com todas as reservas do usuário
  onUpdateReservation: (reservationId: string, newDate: Date) => void;  // Callback para atualizar data
  onCancelReservation: (reservationId: string) => void;  // Callback para cancelar reserva
  onBack: () => void;  // Função para voltar à página inicial
}

/**
 * Componente ReservationManagement - Permite gerenciar as reservas do usuário
 * 
 * Funcionalidades:
 * - Lista todas as reservas ativas
 * - Lista todas as reservas canceladas
 * - Permite editar a data de uma reserva
 * - Permite cancelar uma reserva
 * - Confirmação antes de cancelar
 * 
 * Separação de reservas:
 * - Ativas: aparecem primeiro com destaque verde
 * - Canceladas: aparecem depois com opacidade reduzida
 */
export function ReservationManagement({ 
  reservations, 
  onUpdateReservation, 
  onCancelReservation,
  onBack 
}: ReservationManagementProps) {
  // --------------------------------------------------------------------------
  // ESTADOS PARA OS MODAIS
  // --------------------------------------------------------------------------
  
  /**
   * Reserva sendo editada no momento
   * null = nenhuma reserva em edição
   */
  const [editingReservation, setEditingReservation] = useState<Reservation | null>(null);
  
  /**
   * Nova data selecionada no calendário durante a edição
   */
  const [newDate, setNewDate] = useState<Date | undefined>(undefined);
  
  /**
   * Reserva aguardando confirmação de cancelamento
   * null = nenhum cancelamento pendente
   */
  const [showCancelDialog, setShowCancelDialog] = useState<Reservation | null>(null);

  // --------------------------------------------------------------------------
  // HANDLERS DE AÇÕES
  // --------------------------------------------------------------------------
  
  /**
   * Salva a edição de data de uma reserva
   * Chama o callback do componente pai e fecha o modal
   */
  const handleSaveEdit = () => {
    if (editingReservation && newDate) {
      onUpdateReservation(editingReservation.id, newDate);
      // Limpa os estados e fecha o modal
      setEditingReservation(null);
      setNewDate(undefined);
    }
  };

  /**
   * Confirma o cancelamento de uma reserva
   * Chama o callback do componente pai e fecha o modal
   */
  const handleCancelConfirm = () => {
    if (showCancelDialog) {
      onCancelReservation(showCancelDialog.id);
      setShowCancelDialog(null);  // Fecha o modal
    }
  };

  // --------------------------------------------------------------------------
  // FILTRAGEM DE RESERVAS
  // --------------------------------------------------------------------------
  
  /**
   * Filtra apenas as reservas com status 'active'
   */
  const activeReservations = reservations.filter(r => r.status === 'active');
  
  /**
   * Filtra apenas as reservas com status 'cancelled'
   */
  const cancelledReservations = reservations.filter(r => r.status === 'cancelled');

  // --------------------------------------------------------------------------
  // FUNÇÕES AUXILIARES
  // --------------------------------------------------------------------------
  
  /**
   * Verifica se uma data está no passado
   * Usado para desabilitar datas antigas no calendário de edição
   * 
   * @param date - Data a ser verificada
   * @returns true se a data é anterior a hoje
   */
  const isDateInPast = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  // --------------------------------------------------------------------------
  // RENDERIZAÇÃO
  // --------------------------------------------------------------------------

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Botão de voltar */}
      <Button 
        variant="ghost" 
        onClick={onBack}
        className="mb-6 flex items-center gap-2"
      >
        <ArrowLeft className="size-4" />
        Voltar ao início
      </Button>

      <h1 className="mb-8">Minhas Reservas</h1>

      {/* Mensagem quando não há reservas */}
      {activeReservations.length === 0 && cancelledReservations.length === 0 && (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-slate-600">Você ainda não possui reservas.</p>
          </CardContent>
        </Card>
      )}

      {/* SEÇÃO: RESERVAS ATIVAS */}
      {activeReservations.length > 0 && (
        <div className="mb-8">
          <h2 className="mb-4 flex items-center gap-2 text-green-600">
            <CheckCircle className="size-5" />
            Reservas Ativas
          </h2>
          
          <div className="space-y-4">
            {/* Mapeia cada reserva ativa para um card */}
            {activeReservations.map((reservation) => (
              <Card key={reservation.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      {/* Nome do jogo */}
                      <CardTitle>{reservation.gameName}</CardTitle>
                      
                      {/* Data da reserva */}
                      <div className="flex items-center gap-2 mt-2 text-slate-600">
                        <CalendarIcon className="size-4" />
                        <span>
                          {/* Formata a data em português */}
                          {reservation.date.toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>
                    {/* Badge de status */}
                    <Badge className="bg-green-600">Ativa</Badge>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="flex gap-2">
                    {/* Botão: Editar Data */}
                    <Button
                      variant="outline"
                      onClick={() => {
                        setEditingReservation(reservation);
                        setNewDate(reservation.date);  // Pré-seleciona a data atual
                      }}
                      className="flex items-center gap-2"
                    >
                      <Edit2 className="size-4" />
                      Editar Data
                    </Button>
                    
                    {/* Botão: Cancelar Reserva */}
                    <Button
                      variant="destructive"
                      onClick={() => setShowCancelDialog(reservation)}
                      className="flex items-center gap-2"
                    >
                      <Trash2 className="size-4" />
                      Cancelar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* SEÇÃO: RESERVAS CANCELADAS */}
      {cancelledReservations.length > 0 && (
        <div>
          <h2 className="mb-4 flex items-center gap-2 text-slate-600">
            <XCircle className="size-5" />
            Reservas Canceladas
          </h2>
          
          <div className="space-y-4">
            {/* Mapeia cada reserva cancelada para um card */}
            {cancelledReservations.map((reservation) => (
              // Card com opacidade reduzida para indicar cancelamento
              <Card key={reservation.id} className="opacity-60">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{reservation.gameName}</CardTitle>
                      <div className="flex items-center gap-2 mt-2 text-slate-600">
                        <CalendarIcon className="size-4" />
                        <span>
                          {reservation.date.toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>
                    {/* Badge de status cancelado */}
                    <Badge variant="secondary">Cancelada</Badge>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================
          MODAL: EDITAR DATA DA RESERVA
          ======================================================================== */}
      <Dialog 
        open={editingReservation !== null} 
        onOpenChange={(open) => {
          if (!open) {
            // Limpa os estados ao fechar o modal
            setEditingReservation(null);
            setNewDate(undefined);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Reserva</DialogTitle>
            <DialogDescription>
              Selecione uma nova data para sua reserva de {editingReservation?.gameName}
            </DialogDescription>
          </DialogHeader>
          
          {/* Calendário para selecionar nova data */}
          <div className="flex justify-center py-4">
            <Calendar
              mode="single"
              selected={newDate}
              onSelect={setNewDate}
              disabled={isDateInPast}  // Desabilita datas passadas
              className="rounded-md border"
              fromDate={new Date()}  // Permite apenas datas a partir de hoje
            />
          </div>

          {/* Botões de ação */}
          <DialogFooter>
            {/* Botão: Cancelar edição */}
            <Button 
              variant="outline" 
              onClick={() => {
                setEditingReservation(null);
                setNewDate(undefined);
              }}
            >
              Cancelar
            </Button>
            
            {/* Botão: Salvar nova data (desabilitado se nenhuma data selecionada) */}
            <Button 
              onClick={handleSaveEdit}
              disabled={!newDate}
            >
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ========================================================================
          MODAL: CONFIRMAR CANCELAMENTO
          ======================================================================== */}
      <Dialog 
        open={showCancelDialog !== null} 
        onOpenChange={(open) => {
          if (!open) setShowCancelDialog(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancelar Reserva</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja cancelar a reserva de {showCancelDialog?.gameName}?
              Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>

          {/* Botões de confirmação */}
          <DialogFooter>
            {/* Botão: Voltar (não cancela) */}
            <Button 
              variant="outline" 
              onClick={() => setShowCancelDialog(null)}
            >
              Voltar
            </Button>
            
            {/* Botão: Confirmar cancelamento */}
            <Button 
              variant="destructive"
              onClick={handleCancelConfirm}
            >
              Confirmar Cancelamento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
