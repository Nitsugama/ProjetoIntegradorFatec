import { useState } from 'react';
import { ArrowLeft, Clock, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import type { Game } from '../App';

// ============================================================================
// COMPONENTE GAME DETAILS PAGE - Página de detalhes do jogo
// ============================================================================

/**
 * Interface que define as propriedades do componente
 */
interface GameDetailsPageProps {
  game: Game;             // Dados completos do jogo a ser exibido
  onRentClick: () => void;  // Função chamada ao clicar em "Alugar Jogo"
  onBack: () => void;       // Função para voltar ao catálogo
}

/**
 * Componente GameDetailsPage - Exibe informações detalhadas de um jogo
 * 
 * Funcionalidades:
 * - Carrossel de imagens do jogo (se houver múltiplas imagens)
 * - Informações completas: descrição, regras, como jogar
 * - Dados técnicos: jogadores, duração, preço
 * - Botão para alugar o jogo
 * 
 * Layout:
 * - Grid de 2 colunas em telas grandes
 * - Empilhado em telas pequenas
 */
export function GameDetailsPage({ game, onRentClick, onBack }: GameDetailsPageProps) {
  // --------------------------------------------------------------------------
  // ESTADO DO CARROSSEL
  // --------------------------------------------------------------------------
  
  /**
   * Índice da imagem atualmente exibida no carrossel
   * Começa em 0 (primeira imagem)
   */
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // --------------------------------------------------------------------------
  // FUNÇÕES DO CARROSSEL
  // --------------------------------------------------------------------------
  
  /**
   * Avança para a próxima imagem do carrossel
   * Usa módulo (%) para voltar ao início quando chegar ao fim
   */
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % game.images.length);
  };

  /**
   * Volta para a imagem anterior do carrossel
   * Adiciona game.images.length antes do módulo para evitar números negativos
   */
  const previousImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + game.images.length) % game.images.length);
  };

  // --------------------------------------------------------------------------
  // RENDERIZAÇÃO
  // --------------------------------------------------------------------------

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Botão de voltar ao catálogo */}
      <Button 
        variant="ghost" 
        onClick={onBack}
        className="mb-6 flex items-center gap-2"
      >
        <ArrowLeft className="size-4" />
        Voltar ao catálogo
      </Button>

      {/* Grid principal: 2 colunas em telas grandes */}
      <div className="grid lg:grid-cols-2 gap-8">
        
        {/* COLUNA 1: CARROSSEL DE IMAGENS */}
        <div>
          <div className="relative aspect-[4/3] bg-slate-200 rounded-lg overflow-hidden">
            {/* Imagem atual do carrossel */}
            <ImageWithFallback 
              src={game.images[currentImageIndex]}
              alt={`${game.name} - Imagem ${currentImageIndex + 1}`}
              className="w-full h-full object-cover"
            />
            
            {/* Controles do carrossel - só aparecem se houver mais de uma imagem */}
            {game.images.length > 1 && (
              <>
                {/* Botão: imagem anterior */}
                <button
                  onClick={previousImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                  aria-label="Imagem anterior"
                >
                  <ChevronLeft className="size-6" />
                </button>
                
                {/* Botão: próxima imagem */}
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                  aria-label="Próxima imagem"
                >
                  <ChevronRight className="size-6" />
                </button>

                {/* Indicadores de posição (bolinhas) */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {game.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        // Bolinha da imagem atual é maior e totalmente branca
                        index === currentImageIndex 
                          ? 'bg-white w-6' 
                          : 'bg-white/50 hover:bg-white/75'
                      }`}
                      aria-label={`Ir para imagem ${index + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* COLUNA 2: INFORMAÇÕES DO JOGO */}
        <div>
          {/* Cabeçalho com nome, categoria e dados básicos */}
          <div className="mb-6">
            <Badge className="mb-2">{game.category}</Badge>
            <h1 className="text-slate-900 mb-4">{game.name}</h1>
            
            {/* Ícones com informações rápidas */}
            <div className="flex items-center gap-6 text-slate-600 mb-4">
              {/* Número de jogadores */}
              <div className="flex items-center gap-2">
                <Users className="size-5" />
                <span>{game.players}</span>
              </div>
              {/* Duração média */}
              <div className="flex items-center gap-2">
                <Clock className="size-5" />
                <span>{game.duration}</span>
              </div>
            </div>
            
            {/* Preço do aluguel */}
            <div className="text-indigo-600">
              R$ {game.price.toFixed(2)} / dia
            </div>
          </div>

          {/* Card com descrição e como jogar */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <h2 className="mb-3">Descrição</h2>
              <p className="text-slate-600 mb-4">{game.description}</p>
              
              <h3 className="mb-2">Como Jogar</h3>
              <p className="text-slate-600">{game.howToPlay}</p>
            </CardContent>
          </Card>

          {/* Card com regras básicas */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <h3 className="mb-3">Regras Básicas</h3>
              <ul className="space-y-2">
                {/* Mapeia cada regra para um item da lista */}
                {game.rules.map((rule, index) => (
                  <li key={index} className="flex gap-2 text-slate-600">
                    {/* Bullet point colorido */}
                    <span className="text-indigo-600 shrink-0">•</span>
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Botão de alugar - largura total */}
          <Button 
            onClick={onRentClick}
            className="w-full"
            size="lg"
          >
            Alugar Jogo
          </Button>
        </div>
      </div>
    </div>
  );
}
