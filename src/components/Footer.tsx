import { Mail, Phone, Gamepad2 } from 'lucide-react';

// ============================================================================
// COMPONENTE FOOTER - Rodapé da aplicação
// ============================================================================

/**
 * Componente Footer - Rodapé com informações de contato
 * 
 * Exibe:
 * - Nome e descrição da empresa
 * - Informações de contato (e-mail e telefone)
 * - Horário de atendimento
 * - Copyright
 * 
 * O id="contato" permite que o link no header faça scroll até aqui
 */
export function Footer() {
  return (
    // Container principal com fundo escuro e texto branco
    // id="contato" é usado pelo link âncora no Header
    <footer id="contato" className="bg-slate-900 text-white mt-auto">
      <div className="container mx-auto px-4 py-12">
        {/* Grid responsivo com 3 colunas em telas médias/grandes */}
        <div className="grid md:grid-cols-3 gap-8">
          
          {/* Coluna 1: Sobre a empresa */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Gamepad2 className="size-6 text-indigo-400" />
              <span>GameRent</span>
            </div>
            <p className="text-slate-400">
              Alugue os melhores jogos de tabuleiro e cartas para suas reuniões e eventos.
            </p>
          </div>
          
          {/* Coluna 2: Informações de contato */}
          <div>
            <h3 className="mb-4 text-indigo-400">Contato</h3>
            <div className="space-y-2">
              {/* E-mail */}
              <div className="flex items-center gap-2 text-slate-400">
                <Mail className="size-4" />
                <span>contato@gamerent.com.br</span>
              </div>
              {/* Telefone */}
              <div className="flex items-center gap-2 text-slate-400">
                <Phone className="size-4" />
                <span>(11) 98765-4321</span>
              </div>
            </div>
          </div>
          
          {/* Coluna 3: Horário de atendimento */}
          <div>
            <h3 className="mb-4 text-indigo-400">Horário de Atendimento</h3>
            <p className="text-slate-400">
              Segunda a Sexta: 9h às 18h<br />
              Sábado: 10h às 16h<br />
              Domingo: Fechado
            </p>
          </div>
        </div>
        
        {/* Linha de copyright */}
        <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-400">
          <p>&copy; 2025 GameRent. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}