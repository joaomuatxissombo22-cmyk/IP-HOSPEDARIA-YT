import React from 'react';
import { useApp } from '../context/AppContext';
import { X, ShieldCheck, FileText, AlertCircle } from 'lucide-react';

export const LegalModals: React.FC = () => {
  const { activeModal, setActiveModal } = useApp();

  if (activeModal !== 'privacy' && activeModal !== 'terms' && activeModal !== 'cancellation') {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="relative bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl border border-slate-200 text-slate-800 p-6 sm:p-8">
        
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 sticky top-0 bg-white">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">ZEMAN TRADING & SERVICES</span>
              <h3 className="font-serif-luxury text-xl font-bold text-slate-900">
                {activeModal === 'privacy' && 'Política de Privacidade'}
                {activeModal === 'terms' && 'Termos e Condições de Serviço'}
                {activeModal === 'cancellation' && 'Política de Cancelamento & Reembolsos'}
              </h3>
            </div>
          </div>
          <button
            onClick={() => setActiveModal('none')}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="py-6 space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
          {activeModal === 'privacy' && (
            <>
              <p>
                A <strong>ZEMAN Trading & Services Lda</strong> está empenhada em proteger a privacidade dos seus clientes, hóspedes e utilizadores desta plataforma digital. O tratamento de dados pessoais processa-se em total conformidade com a legislação aplicável na República de Angola.
              </p>
              <h4 className="font-bold text-slate-900 text-sm">1. Dados Recolhidos</h4>
              <p>
                Recolhemos informações estritamente necessárias para a gestão da reserva: nome completo, endereço de correio eletrónico, número de telefone, país de residência e documento de identificação (BI ou Passaporte para efeitos de check-in).
              </p>
              <h4 className="font-bold text-slate-900 text-sm">2. Finalidade do Tratamento</h4>
              <p>
                Os dados destinam-se exclusivamente à confirmação de reservas, emissão de vouchers, faturação, prestação de apoio ao cliente e cumprimento de obrigações fiscais e regulamentares da atividade hoteleira.
              </p>
              <h4 className="font-bold text-slate-900 text-sm">3. Segurança dos Dados</h4>
              <p>
                Implementamos medidas técnicas e organizativas rigorosas para impedir acessos não autorizados, perdas ou alterações dos seus dados. Cada cliente apenas tem acesso às suas próprias reservas no portal seguro.
              </p>
            </>
          )}

          {activeModal === 'terms' && (
            <>
              <p>
                Bem-vindo à plataforma de alojamentos e hospedagem da <strong>ZEMAN Trading & Services Lda</strong>. Ao utilizar o nosso website e submeter solicitações de reserva, concorda com as disposições aqui estipuladas.
              </p>
              <h4 className="font-bold text-slate-900 text-sm">1. Reservas & Confirmação</h4>
              <p>
                As reservas efetuadas online geram uma referência única no formato ZTS-AAAA-XXXX e ficam inicialmente registadas com o estado "Pendente". A confirmação definitiva está dependente da validação do método de pagamento selecionado e da disponibilidade dos quartos.
              </p>
              <h4 className="font-bold text-slate-900 text-sm">2. Preços e Moeda</h4>
              <p>
                Todos os preços são expressos em Kwanzas (Kz / AOA) e incluem a taxa legal de turismo e serviço em vigor, salvo indicação em contrário na página do alojamento.
              </p>
              <h4 className="font-bold text-slate-900 text-sm">3. Ocupação & Conduta</h4>
              <p>
                O número de hóspedes alojados não pode exceder a capacidade máxima indicada para cada quarto ou villa. Os hóspedes comprometem-se a respeitar as normas de convivência, descanso e conservação do mobiliário e espaços comuns.
              </p>
            </>
          )}

          {activeModal === 'cancellation' && (
            <>
              <p>
                A política de cancelamento da <strong>ZEMAN Trading & Services Lda</strong> foi concebida para assegurar flexibilidade ao hóspede e salvaguardar a gestão operacional dos alojamentos.
              </p>
              <h4 className="font-bold text-slate-900 text-sm">1. Prazos para Cancelamento Gratuito</h4>
              <ul className="list-disc list-inside space-y-1">
                <li><strong>Quartos e Suítes:</strong> Cancelamento gratuito até 48 horas antes da data de check-in (14:00).</li>
                <li><strong>Apartamentos e Villas Privadas:</strong> Cancelamento gratuito até 7 dias antes do check-in.</li>
              </ul>
              <h4 className="font-bold text-slate-900 text-sm">2. Cancelamentos Fora de Prazo & Não Comparecimento (No-Show)</h4>
              <p>
                Cancelamentos efetuados após o prazo limite ou casos de não comparência determinam a cobrança do montante correspondente à primeira noite de estadia ou 50% do valor total nas reservas de villas.
              </p>
              <h4 className="font-bold text-slate-900 text-sm">3. Procedimento de Reembolso</h4>
              <p>
                Os montantes elegíveis para reembolso serão creditados através do mesmo método de pagamento utilizado na reserva ou transferência bancária para o IBAN indicado pelo cliente num prazo máximo de 5 dias úteis.
              </p>
            </>
          )}
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={() => setActiveModal('none')}
            className="px-6 py-2.5 bg-slate-950 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-slate-800 transition-colors"
          >
            Compreendi & Fechar
          </button>
        </div>

      </div>
    </div>
  );
};
