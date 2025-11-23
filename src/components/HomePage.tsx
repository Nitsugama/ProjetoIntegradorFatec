import { GameCard } from './GameCard';
import type { Game } from '../App';

// ============================================================================
// COMPONENTE HOME PAGE - Página inicial com catálogo de jogos
// ============================================================================

/**
 * Interface que define as propriedades do componente HomePage
 */
interface HomePageProps {
  games: Game[];                    // Array com todos os jogos disponíveis
  onGameSelect: (game: Game) => void; // Função chamada quando um jogo é clicado
}

/**
 * Componente HomePage - Página inicial da aplicação
 * 
 * Responsabilidades:
 * - Exibir o título e descrição do catálogo
 * - Renderizar todos os jogos em um grid responsivo
 * - Passar a função de clique para cada card
 * 
 * Layout:
 * - 1 coluna em mobile
 * - 2 colunas em tablets (md)
 * - 3 colunas em desktop (lg)
 */
export function HomePage({ games, onGameSelect }: HomePageProps) {
  return (
    <div className="container mx-auto px-4 py-12">
      
      {/* Seção de cabeçalho com título e descrição */}
      <div className="text-center mb-12">
        <h1 className="text-indigo-600 mb-4">
          Catálogo de Jogos
        </h1>
        <p className="text-slate-600 max-w-2xl mx-auto">
          Explore nossa coleção de jogos de tabuleiro e cartas. Alugue seus favoritos 
          e divirta-se com amigos e família!
        </p>
      </div>
      
      {/* Grid de jogos - responsivo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Mapeia cada jogo do array para um componente GameCard */}
        {games.map((game) => (
          <GameCard 
            key={game.id}  // Key única para cada elemento (importante para React)
            game={game}    // Passa os dados do jogo
            onClick={() => onGameSelect(game)} // Passa a função de clique
          />
        ))}
      </div>
    </div>
  );
}