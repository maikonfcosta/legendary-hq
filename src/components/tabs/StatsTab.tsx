import { BarChart2, Swords, TrendingUp, TrendingDown, Award, ShieldAlert } from 'lucide-react';

interface StatsTabProps {
  onNavigate: (tab: string) => void;
}

export function StatsTab({ onNavigate }: StatsTabProps) {
  return (
    <div className="fade-in">
      <div className="result-header">
        <div>
          <h2>Estatísticas</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Analise seu desempenho e histórico de combate.</p>
        </div>
      </div>

      <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem 2rem', marginBottom: '2rem' }}>
        <BarChart2 size={64} style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', opacity: 0.5 }} />
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'white' }}>Sem Estatísticas Ainda</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 2rem auto', lineHeight: 1.6 }}>
          Jogue algumas partidas e registre-as no Tracker para ver seu desempenho épico aqui!
        </p>
        <button className="btn btn-primary btn-large" onClick={() => onNavigate('randomizer')}>
          Gerar Primeira Partida
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        <div className="glass-panel" style={{ padding: '24px', textAlign: 'center', borderTop: '4px solid #2b82d9' }}>
          <Swords size={32} color="#2b82d9" style={{ margin: '0 auto 12px' }} />
          <p style={{ color: 'var(--text-secondary)', textTransform: 'uppercase', fontSize: '0.85rem', fontWeight: 'bold' }}>Partidas Jogadas</p>
          <h3 style={{ fontSize: '2.5rem', margin: '8px 0 0' }}>0</h3>
        </div>
        
        <div className="glass-panel" style={{ padding: '24px', textAlign: 'center', borderTop: '4px solid #10b981' }}>
          <TrendingUp size={32} color="#10b981" style={{ margin: '0 auto 12px' }} />
          <p style={{ color: 'var(--text-secondary)', textTransform: 'uppercase', fontSize: '0.85rem', fontWeight: 'bold' }}>Vitórias</p>
          <h3 style={{ fontSize: '2.5rem', margin: '8px 0 0', color: '#10b981' }}>0</h3>
        </div>

        <div className="glass-panel" style={{ padding: '24px', textAlign: 'center', borderTop: '4px solid #ef4444' }}>
          <TrendingDown size={32} color="#ef4444" style={{ margin: '0 auto 12px' }} />
          <p style={{ color: 'var(--text-secondary)', textTransform: 'uppercase', fontSize: '0.85rem', fontWeight: 'bold' }}>Derrotas</p>
          <h3 style={{ fontSize: '2.5rem', margin: '8px 0 0', color: '#ef4444' }}>0</h3>
        </div>

        <div className="glass-panel" style={{ padding: '24px', textAlign: 'center', borderTop: '4px solid var(--accent-color)' }}>
          <Award size={32} color="var(--accent-color)" style={{ margin: '0 auto 12px' }} />
          <p style={{ color: 'var(--text-secondary)', textTransform: 'uppercase', fontSize: '0.85rem', fontWeight: 'bold' }}>Win Rate</p>
          <h3 style={{ fontSize: '2.5rem', margin: '8px 0 0' }}>0%</h3>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
            <ShieldAlert size={20} color="var(--accent-color)" /> Vilão Mais Letal
          </h3>
          <p style={{ color: 'var(--text-secondary)' }}>Nenhum dado registrado.</p>
        </div>
        
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
            <Award size={20} color="#eab308" /> Herói Mais Jogado
          </h3>
          <p style={{ color: 'var(--text-secondary)' }}>Nenhum dado registrado.</p>
        </div>
      </div>
    </div>
  );
}
