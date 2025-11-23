import { Card, CardContent, CardFooter, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import type { Game } from '../App';

// ============================================================================
// COMPONENTE GAME CARD - Card individual de cada jogo no catálogo
// ============================================================================

/**
 * Interface que define as propriedades do componente GameCard
 */
interface GameCardProps {
  game: Game;           // Objeto com todos os dados do jogo
  onClick: () => void;  // Função chamada quando o card é clicado
}

/**
 * Componente GameCard - Exibe um jogo no catálogo
 * 
 * Estrutura do card:
 * - Imagem do jogo (primeira imagem do array)
 * - Nome do jogo e categoria (badge)
 * - Resumo do jogo
 * - Preço por dia e número de jogadores
 * 
 * Interatividade:
 * - Hover: aumenta a sombra e levanta o card levemente
 * - Click: chama a função onClick passada pelo componente pai
 */
export function GameCard({ game, onClick }: GameCardProps) {
  return (
    // Card principal - clicável com animação de hover
    <Card 
      className="overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
      onClick={onClick}
    >
      {/* Imagem do jogo */}
      <div className="aspect-[4/3] overflow-hidden bg-slate-200">
        {/* 
          ImageWithFallback é um componente customizado que exibe um fallback 
          caso a imagem não carregue 
        */}
        <ImageWithFallback 
          src={game.images[0]}  // Usa a primeira imagem do array
          alt={game.name}       // Texto alternativo para acessibilidade
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Cabeçalho do card com nome e categoria */}
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <h3 className="flex-1">{game.name}</h3>
          {/* Badge com a categoria do jogo */}
          <Badge variant="secondary">{game.category}</Badge>
        </div>
      </CardHeader>
      
      {/* Conteúdo do card com resumo */}
      <CardContent>
        <p className="text-slate-600">{game.summary}</p>
      </CardContent>
      
      {/* Rodapé do card com preço e número de jogadores */}
      <CardFooter>
        <div className="flex items-center justify-between w-full">
          {/* Preço formatado com 2 casas decimais */}
          <span className="text-indigo-600">R$ {game.price.toFixed(2)}/dia</span>
          {/* Número de jogadores */}
          <span className="text-slate-500">{game.players}</span>
        </div>
      </CardFooter>
    </Card>
  );
}