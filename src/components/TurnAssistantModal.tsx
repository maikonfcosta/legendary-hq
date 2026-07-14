import { X, AlertTriangle, Play, FastForward } from 'lucide-react';

interface TurnAssistantModalProps {
  onClose: () => void;
}

export function TurnAssistantModal({ onClose }: TurnAssistantModalProps) {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '500px', maxHeight: '80vh', overflowY: 'auto', position: 'relative', padding: '0' }}>
        
        <div style={{ padding: '20px', borderBottom: '1px solid var(--surface-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: 'rgba(13, 17, 23, 0.95)', zIndex: 1 }}>
          <h2 style={{ margin: 0, fontSize: '1.4rem' }}>Resumo do Turno</h2>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>

        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{ display: 'flex', gap: '15px' }}>
            <div style={{ background: 'rgba(230, 36, 41, 0.2)', padding: '10px', borderRadius: '8px', height: 'fit-content' }}>
              <AlertTriangle size={24} color="#e62429" />
            </div>
            <div>
              <h3 style={{ margin: '0 0 8px 0', color: '#e62429' }}>1. Fase do Vilão</h3>
              <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                Revele a carta do topo do <strong>Villain Deck</strong>.
                <br/><br/>
                • Se for <strong>Vilão</strong>: Adicione ao HQ. Empurre os outros. Se alguém fugir (Escape), resolva o efeito de Escape (KO em herói do HQ de custo 6 ou menos).
                <br/>
                • Se for <strong>Bystander</strong>: Capture no vilão mais próximo do Mastermind.
                <br/>
                • Se for <strong>Scheme Twist</strong> ou <strong>Master Strike</strong>: Resolva o texto correspondente.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '15px' }}>
            <div style={{ background: 'rgba(16, 185, 129, 0.2)', padding: '10px', borderRadius: '8px', height: 'fit-content' }}>
              <Play size={24} color="#10b981" />
            </div>
            <div>
              <h3 style={{ margin: '0 0 8px 0', color: '#10b981' }}>2. Fase do Jogador</h3>
              <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                Jogue as cartas da sua mão em qualquer ordem.
                <br/><br/>
                • Use pontos de <strong>Recrute (⭐)</strong> para comprar heróis do HQ ou SHIELD Officers.
                <br/>
                • Use pontos de <strong>Ataque (⚔️)</strong> para derrotar Vilões na cidade ou o Mastermind.
                <br/>
                • Ative habilidades de classes (<span style={{color:'#e62429'}}>Covert</span>, <span style={{color:'#fbc02d'}}>Instinct</span>, etc.) se tiver jogado uma carta da mesma classe antes no turno.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '15px' }}>
            <div style={{ background: 'rgba(148, 163, 184, 0.2)', padding: '10px', borderRadius: '8px', height: 'fit-content' }}>
              <FastForward size={24} color="#94a3b8" />
            </div>
            <div>
              <h3 style={{ margin: '0 0 8px 0', color: '#94a3b8' }}>3. Fim de Turno</h3>
              <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                Conclua suas ações e prepare o próximo turno.
                <br/><br/>
                • Coloque todas as cartas que jogou e as cartas restantes na sua mão em sua pilha de descarte (<strong>Discard Pile</strong>).
                <br/>
                • Compre <strong>6 novas cartas</strong> do seu baralho (Deck). Se acabar, embaralhe o descarte para formar um novo baralho.
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
