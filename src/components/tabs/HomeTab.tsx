import { Dices, Swords, Archive, BookOpen } from 'lucide-react';

interface HomeTabProps {
  onNavigate: (tab: string) => void;
}

export function HomeTab({ onNavigate }: HomeTabProps) {
  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', textAlign: 'center' }}>
      <div style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', margin: '0 0 1rem 0', background: 'linear-gradient(135deg, #e62429, #2b82d9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', textTransform: 'uppercase', letterSpacing: '2px' }}>
          Marvel Legendary
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
          Seu quartel general definitivo para o deck-building game da Marvel.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', width: '100%', maxWidth: '900px' }}>
        <button className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px', border: '1px solid var(--surface-border)', borderTop: '4px solid var(--primary-color)', cursor: 'pointer', transition: 'all 0.2s', background: 'rgba(255,255,255,0.02)' }} onClick={() => onNavigate('randomizer')}>
          <Dices size={48} color="var(--primary-color)" />
          <h3 style={{ margin: 0, fontSize: '1.5rem', color: 'white' }}>Sortear Partida</h3>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Gere setups aleatórios com suas expansões</span>
        </button>

        <button className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px', border: '1px solid var(--surface-border)', borderTop: '4px solid #10b981', cursor: 'pointer', transition: 'all 0.2s', background: 'rgba(255,255,255,0.02)' }} onClick={() => onNavigate('tracker')}>
          <Swords size={48} color="#10b981" />
          <h3 style={{ margin: 0, fontSize: '1.5rem', color: 'white' }}>Game Tracker</h3>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Controle os pontos e vilões em tempo real</span>
        </button>

        <button className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px', border: '1px solid var(--surface-border)', borderTop: '4px solid #fbc02d', cursor: 'pointer', transition: 'all 0.2s', background: 'rgba(255,255,255,0.02)' }} onClick={() => onNavigate('collection')}>
          <Archive size={48} color="#fbc02d" />
          <h3 style={{ margin: 0, fontSize: '1.5rem', color: 'white' }}>Minha Coleção</h3>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Gerencie quais caixas você possui</span>
        </button>

        <button className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px', border: '1px solid var(--surface-border)', borderTop: '4px solid #94a3b8', cursor: 'pointer', transition: 'all 0.2s', background: 'rgba(255,255,255,0.02)' }} onClick={() => onNavigate('rules')}>
          <BookOpen size={48} color="#94a3b8" />
          <h3 style={{ margin: 0, fontSize: '1.5rem', color: 'white' }}>Regras & PDFs</h3>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Consulte regras e manuais originais</span>
        </button>
      </div>
    </div>
  );
}
