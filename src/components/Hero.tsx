// Importações necessárias
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Button } from './ui/button';

// Componente Hero - Seção principal/banner do site
export function Hero() {
  // Função para fazer scroll suave até a seção de agendamento
  const scrollToBooking = () => {
    const bookingSection = document.getElementById('booking');
    bookingSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    // Section com altura total da tela, centralizado e com overflow escondido
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Container da imagem de fundo */}
      <div className="absolute inset-0 z-0">
        {/* Imagem de fundo do hero - ALTERE A URL AQUI PARA TROCAR A IMAGEM */}
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1616688920494-6758cf681803?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb2NrJTIwYmFuZCUyMGNvbmNlcnR8ZW58MXx8fHwxNzYyMjMxMjk1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Kollapso Band Performance"
          className="w-full h-full object-cover"
        />
        {/* Overlay escuro sobre a imagem (60% de opacidade) */}
        <div className="absolute inset-0 bg-black/60"></div>
      </div>
      
      {/* Conteúdo principal do Hero */}
      <div className="relative z-10 text-center text-white px-4">
        {/* Título principal - Nome da banda */}
        <h1 className="mb-4 tracking-wider">KOLLAPSO</h1>
        
        {/* Subtítulo/descrição */}
        <p className="mb-8 max-w-2xl mx-auto opacity-90">
          Uma experiência sonora única para o seu evento
        </p>
        
        {/* Botão de call-to-action - ALTERE bg-red-600 PARA MUDAR A COR */}
        <Button 
          onClick={scrollToBooking}
          size="lg"
          className="bg-red-600 hover:bg-red-700"
        >
          Agendar Show
        </Button>
      </div>
    </section>
  );
}
