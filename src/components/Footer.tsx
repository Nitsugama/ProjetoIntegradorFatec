// Importação dos ícones necessários
import { Mail, Phone, Instagram, Facebook, Music } from 'lucide-react';

// Componente do Rodapé
export function Footer() {
  return (
    // Footer com fundo preto
    <footer className="bg-black text-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Grid de 3 colunas para desktop */}
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          
          {/* Coluna 1: Logo e descrição */}
          <div>
            {/* Logo da banda */}
            <div className="flex items-center gap-2 mb-4">
              <Music className="w-6 h-6 text-red-600" />
              <span className="tracking-wider">KOLLAPSO</span>
            </div>
            {/* Texto descritivo - EDITE AQUI */}
            <p className="opacity-80">
              Transformando eventos em experiências musicais memoráveis desde 2018.
            </p>
          </div>

          {/* Coluna 2: Informações de Contato */}
          <div>
            <h3 className="mb-4">Contato</h3>
            <div className="space-y-3">
              {/* Email - ALTERE O EMAIL AQUI */}
              <a 
                href="mailto:contato@kollapso.com.br" 
                className="flex items-center gap-2 opacity-80 hover:opacity-100 transition-opacity"
              >
                <Mail className="w-4 h-4 text-red-600" />
                contato@kollapso.com.br
              </a>
              {/* Telefone - ALTERE O NÚMERO AQUI */}
              <a 
                href="tel:+5511999999999" 
                className="flex items-center gap-2 opacity-80 hover:opacity-100 transition-opacity"
              >
                <Phone className="w-4 h-4 text-red-600" />
                (11) 99999-9999
              </a>
            </div>
          </div>

          {/* Coluna 3: Redes Sociais */}
          <div>
            <h3 className="mb-4">Redes Sociais</h3>
            <div className="flex gap-4">
              {/* Link do Instagram - ALTERE A URL AQUI */}
              <a 
                href="https://instagram.com/kollapsoband" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center hover:bg-red-600 transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              {/* Link do Facebook - ALTERE A URL AQUI */}
              <a 
                href="https://facebook.com/kollapsoband" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center hover:bg-red-600 transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Linha separadora e copyright */}
        <div className="border-t border-zinc-800 pt-8 text-center opacity-60">
          {/* Copyright - ano atualiza automaticamente */}
          <p>&copy; {new Date().getFullYear()} Kollapso. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
