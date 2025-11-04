// Importações necessárias
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Music, Users, Zap } from 'lucide-react'; // Ícones do lucide-react

// Componente Sobre a Banda
export function About() {
  return (
    // Section com padding vertical e fundo cinza escuro
    <section className="py-20 px-4 bg-zinc-900 text-white">
      <div className="max-w-7xl mx-auto">
        {/* Grid de 2 colunas em telas médias+ com textos e imagem */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          {/* Coluna de texto */}
          <div>
            {/* Título da seção */}
            <h2 className="mb-6">Sobre a Banda</h2>
            
            {/* Primeiro parágrafo - EDITE AQUI PARA MUDAR O TEXTO */}
            <p className="mb-4 opacity-90">
              Kollapso é uma banda que traz energia, paixão e autenticidade para cada apresentação. 
              Com um repertório diversificado e uma performance envolvente, transformamos qualquer 
              evento em uma experiência inesquecível.
            </p>
            
            {/* Segundo parágrafo - EDITE AQUI PARA MUDAR O TEXTO */}
            <p className="opacity-90">
              Seja para eventos corporativos, festas particulares, casamentos ou qualquer ocasião especial, 
              nossa banda está pronta para criar a trilha sonora perfeita para o seu momento.
            </p>
          </div>
          
          {/* Coluna da imagem */}
          <div className="relative h-96 rounded-lg overflow-hidden">
            {/* Imagem da banda - ALTERE A URL AQUI PARA TROCAR A IMAGEM */}
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1610620146780-26908fab50ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYW5kJTIwaW5zdHJ1bWVudHMlMjBndWl0YXJ8ZW58MXx8fHwxNzYyMjcxMjI3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Kollapso Instruments"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Grid de 3 cards com diferenciais */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Card 1 - Repertório */}
          <div className="text-center p-6">
            {/* Ícone circular com fundo vermelho - TROQUE Music POR OUTRO ÍCONE */}
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-600 mb-4">
              <Music className="w-8 h-8" />
            </div>
            {/* Título do card */}
            <h3 className="mb-2">Repertório Versátil</h3>
            {/* Descrição do card */}
            <p className="opacity-80">
              Rock, Pop, Blues e muito mais. Adaptamos nosso setlist ao seu evento.
            </p>
          </div>

          {/* Card 2 - Energia */}
          <div className="text-center p-6">
            {/* Ícone circular - TROQUE Zap POR OUTRO ÍCONE */}
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-600 mb-4">
              <Zap className="w-8 h-8" />
            </div>
            <h3 className="mb-2">Alta Energia</h3>
            <p className="opacity-80">
              Performance profissional que mantém o público engajado do início ao fim.
            </p>
          </div>

          {/* Card 3 - Experiência */}
          <div className="text-center p-6">
            {/* Ícone circular - TROQUE Users POR OUTRO ÍCONE */}
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-600 mb-4">
              <Users className="w-8 h-8" />
            </div>
            <h3 className="mb-2">Experiência</h3>
            <p className="opacity-80">
              Anos de apresentações em diversos tipos de eventos e locais.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
