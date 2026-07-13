import { Shuffle, Activity, Layers, BookOpen, BarChart2 } from 'lucide-react';

interface HomeTabProps {
  onNavigate: (tab: string) => void;
}

export function HomeTab({ onNavigate }: HomeTabProps) {
  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', textAlign: 'center' }}>
      <div className="home-hero-content" style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <img 
          src="/logo.jpg" 
          alt="Legendary HQ Logo" 
          style={{ width: '140px', height: '140px', borderRadius: '28px', boxShadow: '0 10px 40px rgba(230, 36, 41, 0.4)', marginBottom: '20px', objectFit: 'cover' }} 
        />
        <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', margin: '0 0 1rem 0', background: 'linear-gradient(135deg, #e62429, #2b82d9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 900 }}>
          Legendary HQ
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
          Seu quartel general definitivo para o deck-building game da Marvel.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', width: '100%', maxWidth: '1000px' }}>
        <button className="glass-panel home-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '15px', border: '1px solid var(--surface-border)', borderTop: '4px solid var(--primary-color)', cursor: 'pointer', transition: 'all 0.2s', background: 'rgba(255,255,255,0.02)', textAlign: 'left' }} onClick={() => onNavigate('collection')}>
          <Layers size={40} color="var(--primary-color)" />
          <div>
            <h3 style={{ margin: '0 0 5px 0', fontSize: '1.3rem', color: 'white' }}>Minha Coleção</h3>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Marque as caixas e expansões que você possui</span>
          </div>
        </button>

        <button className="glass-panel home-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '15px', border: '1px solid var(--surface-border)', borderTop: '4px solid #fbc02d', cursor: 'pointer', transition: 'all 0.2s', background: 'rgba(255,255,255,0.02)', textAlign: 'left' }} onClick={() => onNavigate('tracker')}>
          <Activity size={40} color="#fbc02d" />
          <div>
            <h3 style={{ margin: '0 0 5px 0', fontSize: '1.3rem', color: 'white' }}>Tracker</h3>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Controle pontos de recrutamento, ataque e master strikes</span>
          </div>
        </button>

        <button className="glass-panel home-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '15px', border: '1px solid var(--surface-border)', borderTop: '4px solid var(--secondary-color)', cursor: 'pointer', transition: 'all 0.2s', background: 'rgba(255,255,255,0.02)', textAlign: 'left' }} onClick={() => onNavigate('randomizer')}>
          <Shuffle size={40} color="var(--secondary-color)" />
          <div>
            <h3 style={{ margin: '0 0 5px 0', fontSize: '1.3rem', color: 'white' }}>Sorteio</h3>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Gere setups aleatórios perfeitamente balanceados</span>
          </div>
        </button>

        <button className="glass-panel home-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '15px', border: '1px solid var(--surface-border)', borderTop: '4px solid var(--primary-color)', cursor: 'pointer', transition: 'all 0.2s', background: 'rgba(255,255,255,0.02)', textAlign: 'left' }} onClick={() => onNavigate('stats')}>
          <BarChart2 size={40} color="var(--primary-color)" />
          <div>
            <h3 style={{ margin: '0 0 5px 0', fontSize: '1.3rem', color: 'white' }}>Estatísticas</h3>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Acompanhe seu desempenho e histórico de vitórias</span>
          </div>
        </button>

        <button className="glass-panel home-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '15px', border: '1px solid var(--surface-border)', borderTop: '4px solid #10b981', cursor: 'pointer', transition: 'all 0.2s', background: 'rgba(255,255,255,0.02)', textAlign: 'left', gridColumn: '1 / -1' }} onClick={() => onNavigate('rules')}>
          <BookOpen size={40} color="#10b981" />
          <div>
            <h3 style={{ margin: '0 0 5px 0', fontSize: '1.3rem', color: 'white' }}>Regras</h3>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Consulte regras e palavras-chave de todas as expansões</span>
          </div>
        </button>
      </div>
    </div>
  );
}
