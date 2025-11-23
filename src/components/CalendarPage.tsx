import { useState, useEffect } from 'react';
import { ArrowLeft, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from './ui/button';
import { Calendar } from './ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import type { Game, Reservation } from '../App';
import api from '../services/api';

// ============================================================================
// COMPONENTE CALENDAR PAGE - Página de seleção de data para aluguel
// ============================================================================

/**
 * Interface que define as propriedades do componente
 */
interface CalendarPageProps {
  game: Game;                           // Jogo sendo alugado
  onDateSelect: (date: Date) => void;   // Callback quando uma data é confirmada
  onBack: () => void;                   // Função para voltar à página anterior
  existingReservations: Reservation[];  // Todas as reservas do usuário logado
}

/**
 * Componente CalendarPage - Permite ao usuário selecionar uma data para alugar um jogo
 * 
 * Funcionalidades:
 * - Exibe calendário interativo
 * - Bloqueia datas passadas
 * - Bloqueia datas já reservadas (BUSCA DO BACKEND!)
 * - Mostra resumo da reserva
 * - Confirma a reserva na data selecionada
 */
export function CalendarPage({ game, onDateSelect, onBack, existingReservations }: CalendarPageProps) {
  // --------------------------------------------------------------------------
  // ESTADOS
  // --------------------------------------------------------------------------
  
  /**
   * Data selecionada pelo usuário no calendário
   */
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  /**
   * Datas reservadas do jogo (vem do backend)
   */
  const [reservedDates, setReservedDates] = useState<Date[]>([]);

  /**
   * Loading das datas reservadas
   */
  const [loadingDates, setLoadingDates] = useState(true);

  // --------------------------------------------------------------------------
  // EFEITOS - Carregamento de datas reservadas
  // --------------------------------------------------------------------------
  
  /**
   * Carrega as datas já reservadas deste jogo do backend
   * IMPORTANTE: Agora busca TODAS as reservas do jogo, não só do usuário!
   */
  useEffect(() => {
    loadReservedDates();
  }, [game.id]);

  const loadReservedDates = async () => {
    try {
      setLoadingDates(true);
      console.log(`🔍 Buscando datas reservadas do jogo ${game.id}...`);
      
      // Busca as datas do backend
      const dates = await api.getGameReservedDates(parseInt(game.id));
      
      // Converte strings para objetos Date
      const dateObjects = dates.map(dateStr => new Date(dateStr + 'T00:00:00'));
      
      setReservedDates(dateObjects);
      console.log(`✅ ${dateObjects.length} datas indisponíveis carregadas`);
      
    } catch (error) {
      console.error('❌ Erro ao carregar datas reservadas:', error);
      // Em caso de erro, usa array vazio (não bloqueia nenhuma data)
      setReservedDates([]);
    } finally {
      setLoadingDates(false);
    }
  };

  // --------------------------------------------------------------------------
  // DATAS INDISPONÍVEIS
  // --------------------------------------------------------------------------
  
  /**
   * Array com datas simuladas como indisponíveis
   * Em produção, isso viria de uma API que consulta o banco de dados
   * 
   * IMPORTANTE: Estas são apenas datas de exemplo para demonstração
   */
  const unavailableDates = [
    new Date(2025, 10, 16), // 16 de novembro de 2025
    new Date(2025, 10, 17), // 17 de novembro de 2025
    new Date(2025, 10, 23), // 23 de novembro de 2025
    new Date(2025, 10, 24), // 24 de novembro de 2025
  ];

  /**
   * Combina as datas indisponíveis simuladas com as reservas reais
   */
  const allUnavailableDates = [...unavailableDates, ...reservedDates];

  // --------------------------------------------------------------------------
  // FUNÇÕES AUXILIARES
  // --------------------------------------------------------------------------
  
  /**
   * Verifica se uma data está na lista de datas indisponíveis
   * Compara dia, mês e ano
   * 
   * @param date - Data a ser verificada
   * @returns true se a data está indisponível, false caso contrário
   */
  const isDateUnavailable = (date: Date) => {
    return allUnavailableDates.some(unavailableDate => 
      unavailableDate.getDate() === date.getDate() &&
      unavailableDate.getMonth() === date.getMonth() &&
      unavailableDate.getFullYear() === date.getFullYear()
    );
  };

  /**
   * Verifica se uma data está no passado
   * Usado para desabilitar datas antigas no calendário
   * 
   * @param date - Data a ser verificada
   * @returns true se a data é anterior a hoje, false caso contrário
   */
  const isDateInPast = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);  // Zera as horas para comparar apenas a data
    return date < today;
  };

  /**
   * Confirma a reserva com a data selecionada
   * Chama o callback do componente pai
   */
  const handleConfirm = () => {
    if (selectedDate) {
      onDateSelect(selectedDate);
    }
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
        Voltar
      </Button>

      {/* Grid de 2 colunas em telas médias/grandes */}
      <div className="grid md:grid-cols-2 gap-8">
        
        {/* COLUNA 1: RESUMO DA RESERVA */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Informações da Reserva</CardTitle>
              <CardDescription>Jogo selecionado</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {/* Nome do jogo */}
                <div>
                  <span className="text-slate-600">Jogo:</span>
                  <p>{game.name}</p>
                </div>
                
                {/* Preço do aluguel */}
                <div>
                  <span className="text-slate-600">Valor:</span>
                  <p className="text-indigo-600">R$ {game.price.toFixed(2)} / dia</p>
                </div>
                
                {/* Data selecionada - só aparece após selecionar uma data */}
                {selectedDate && (
                  <div>
                    <span className="text-slate-600">Data selecionada:</span>
                    <p>
                      {/* Formata a data para português brasileiro */}
                      {selectedDate.toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Botão de confirmar - só aparece quando uma data está selecionada */}
          {selectedDate && (
            <Button 
              onClick={handleConfirm}
              className="w-full mt-4"
              size="lg"
            >
              Confirmar Reserva
            </Button>
          )}
        </div>

        {/* COLUNA 2: CALENDÁRIO */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="size-5" />
                Selecione a Data
              </CardTitle>
              <CardDescription>
                Escolha uma data disponível para alugar o jogo
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* 
                Componente Calendar do ShadCN
                - mode="single": permite selecionar apenas uma data
                - disabled: função que determina quais datas desabilitar
                - fromDate: data mínima selecionável (hoje)
              */}
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={(date) => isDateInPast(date) || isDateUnavailable(date)}
                className="rounded-md border"
                fromDate={new Date()}
              />
              
              {/* Legenda do calendário */}
              <div className="mt-4 space-y-2">
                {/* Data selecionada */}
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-indigo-600 rounded"></div>
                  <span className="text-slate-600">Data selecionada</span>
                </div>
                {/* Data indisponível */}
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-slate-200 rounded"></div>
                  <span className="text-slate-600">Data indisponível</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}