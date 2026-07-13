import { BarChart2, Swords, TrendingUp, TrendingDown, Award, ShieldAlert } from 'lucide-react';
import type { GameMatch } from '../../types/history';

interface StatsTabProps {
  history: GameMatch[];
}

export function StatsTab({ history }: StatsTabProps) {

  const totalGames = history.length;
  const wins = history.filter(m => m.victory).length;
  const losses = totalGames - wins;
  const winRate = totalGames > 0 ? Math.round((wins / totalGames) * 100) : 0;

  // Analisa mastermind mais jogado
  const mastermindCounts = history.reduce((acc, match) => {
    acc[match.mastermind] = (acc[match.mastermind] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const mostPlayedMastermind = Object.entries(mastermindCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Nenhum';

  // Analisa mastermind mais letal (mais derrotas)
  const mastermindLosses = history.filter(m => !m.victory).reduce((acc, match) => {
    acc[match.mastermind] = (acc[match.mastermind] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const deadliestMastermind = Object.entries(mastermindLosses).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Nenhum';

  return (
    <div className="fade-in">
      <div className="page-header" style={{ marginBottom: '24px' }}>
        <h2 className="page-title">Estatísticas</h2>
        <p className="page-subtitle">Analise seu desempenho nas partidas.</p>
      </div>

      {totalGames === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem 2rem', marginBottom: '2rem' }}>
          <BarChart2 size={64} style={{ color: 'var(--text-secondary)', margin: '0 auto 1.5rem', opacity: 0.5 }} />
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'white' }}>Sem Histórico</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 2rem auto', lineHeight: 1.6 }}>
            Jogue algumas partidas e registre-as no histórico ou no Gerador para ver seu desempenho aqui!
          </p>
        </div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginBottom: '32px' }}>
            <div className="glass-panel" style={{ padding: '24px', textAlign: 'center', borderTop: '4px solid #2b82d9' }}>
              <Swords size={32} color="#2b82d9" style={{ margin: '0 auto 12px' }} />
              <p style={{ color: 'var(--text-secondary)', textTransform: 'uppercase', fontSize: '0.85rem', fontWeight: 'bold' }}>Partidas Jogadas</p>
              <h3 style={{ fontSize: '2.5rem', margin: '8px 0 0' }}>{totalGames}</h3>
            </div>
            
            <div className="glass-panel" style={{ padding: '24px', textAlign: 'center', borderTop: '4px solid #10b981' }}>
              <TrendingUp size={32} color="#10b981" style={{ margin: '0 auto 12px' }} />
              <p style={{ color: 'var(--text-secondary)', textTransform: 'uppercase', fontSize: '0.85rem', fontWeight: 'bold' }}>Vitórias</p>
              <h3 style={{ fontSize: '2.5rem', margin: '8px 0 0', color: '#10b981' }}>{wins}</h3>
            </div>

            <div className="glass-panel" style={{ padding: '24px', textAlign: 'center', borderTop: '4px solid #ef4444' }}>
              <TrendingDown size={32} color="#ef4444" style={{ margin: '0 auto 12px' }} />
              <p style={{ color: 'var(--text-secondary)', textTransform: 'uppercase', fontSize: '0.85rem', fontWeight: 'bold' }}>Derrotas</p>
              <h3 style={{ fontSize: '2.5rem', margin: '8px 0 0', color: '#ef4444' }}>{losses}</h3>
            </div>

            <div className="glass-panel" style={{ padding: '24px', textAlign: 'center', borderTop: '4px solid var(--accent-color)' }}>
              <Award size={32} color="var(--accent-color)" style={{ margin: '0 auto 12px' }} />
              <p style={{ color: 'var(--text-secondary)', textTransform: 'uppercase', fontSize: '0.85rem', fontWeight: 'bold' }}>Win Rate</p>
              <h3 style={{ fontSize: '2.5rem', margin: '8px 0 0' }}>{winRate}%</h3>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '32px' }}>
            <div className="glass-panel" style={{ padding: '24px' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
                <ShieldAlert size={20} color="var(--accent-color)" /> Vilão Mais Letal
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', fontWeight: 600 }}>{deadliestMastermind}</p>
            </div>
            
            <div className="glass-panel" style={{ padding: '24px' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
                <Award size={20} color="#eab308" /> Vilão Mais Enfrentado
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', fontWeight: 600 }}>{mostPlayedMastermind}</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
