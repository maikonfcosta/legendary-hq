import { useState } from 'react';
import { BarChart2, Swords, TrendingUp, TrendingDown, Award, ShieldAlert, Plus, X } from 'lucide-react';
import type { GameMatch } from '../../types/history';
import cardsData from '../../data/cards.json';

interface StatsTabProps {
  onNavigate: (tab: string) => void;
  history: GameMatch[];
  addMatch: (match: Omit<GameMatch, 'id' | 'date'>) => Promise<void>;
  ownedExpansions: string[];
}

export function StatsTab({ onNavigate: _onNavigate, history, addMatch, ownedExpansions }: StatsTabProps) {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    mastermind: '',
    scheme: '',
    victory: true,
    playerCount: 2,
    score: 0
  });

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

  // Listas filtradas para o Form baseado no ownedExpansions
  const availableMasterminds = cardsData.masterminds.filter(m => ownedExpansions.includes(m.expansion) || (m.expansion === 'core' && ownedExpansions.includes('core_2nd')));
  const availableSchemes = cardsData.schemes.filter(s => ownedExpansions.includes(s.expansion) || (s.expansion === 'core' && ownedExpansions.includes('core_2nd')));

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.mastermind || !formData.scheme) {
      alert("Selecione Mastermind e Scheme");
      return;
    }
    
    addMatch({
      mastermind: formData.mastermind,
      scheme: formData.scheme,
      victory: formData.victory,
      playerCount: formData.playerCount,
      score: formData.score
    });
    
    setShowModal(false);
    setFormData({ mastermind: '', scheme: '', victory: true, playerCount: 2, score: 0 });
  };

  return (
    <div className="fade-in">
      <div className="result-header">
        <div>
          <h2>Estatísticas & Histórico</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Analise seu desempenho e registre combates épicos.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
          Adicionar Partida
        </button>
      </div>

      {totalGames === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem 2rem', marginBottom: '2rem' }}>
          <BarChart2 size={64} style={{ color: 'var(--text-secondary)', margin: '0 auto 1.5rem', opacity: 0.5 }} />
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'white' }}>Sem Histórico</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 2rem auto', lineHeight: 1.6 }}>
            Jogue ou cadastre algumas partidas para ver seu desempenho aqui!
          </p>
          <button className="btn btn-primary btn-large" onClick={() => setShowModal(true)}>
            Cadastrar Primeira Partida
          </button>
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
          
          <div className="section-title">Histórico Recente (Últimas 10)</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {history.slice(0, 10).map(match => (
              <div key={match.id} className="glass-panel" style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderLeft: `4px solid ${match.victory ? '#10b981' : '#ef4444'}` }}>
                <div>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '1.1rem' }}>vs {match.mastermind}</h4>
                  <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{match.scheme}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontWeight: 600, color: match.victory ? '#10b981' : '#ef4444' }}>{match.victory ? 'VITÓRIA' : 'DERROTA'}</span>
                  <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                    {new Date(match.date).toLocaleDateString()} - {match.playerCount}J
                  </p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Modal Manual Entry */}
      {showModal && (
        <>
          <div className="mobile-overlay open" onClick={() => setShowModal(false)} style={{ zIndex: 999 }}></div>
          <div className="glass-panel fade-in" style={{
            position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            width: '90%', maxWidth: '500px', zIndex: 1000, padding: '2rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ margin: 0 }}>Registrar Partida</h2>
              <button className="btn" style={{ padding: '4px', background: 'transparent' }} onClick={() => setShowModal(false)}><X size={24} /></button>
            </div>
            
            <form onSubmit={handleManualSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="input-group">
                <label>Resultado:</label>
                <select className="glass-select" value={formData.victory ? 'win' : 'loss'} onChange={(e) => setFormData({...formData, victory: e.target.value === 'win'})}>
                  <option value="win">Vitória</option>
                  <option value="loss">Derrota</option>
                </select>
              </div>

              <div className="input-group">
                <label>Mastermind:</label>
                <select className="glass-select" value={formData.mastermind} onChange={(e) => setFormData({...formData, mastermind: e.target.value})} required>
                  <option value="">-- Selecione --</option>
                  {availableMasterminds.map(m => <option key={m.id} value={m.name}>{m.name}</option>)}
                </select>
              </div>

              <div className="input-group">
                <label>Scheme:</label>
                <select className="glass-select" value={formData.scheme} onChange={(e) => setFormData({...formData, scheme: e.target.value})} required>
                  <option value="">-- Selecione --</option>
                  {availableSchemes.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                </select>
              </div>

              <div className="input-group" style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label>Jogadores:</label>
                  <input type="number" min="1" max="5" className="glass-select" value={formData.playerCount} onChange={(e) => setFormData({...formData, playerCount: Number(e.target.value)})} />
                </div>
                <div style={{ flex: 1 }}>
                  <label>Score (opcional):</label>
                  <input type="number" className="glass-select" value={formData.score} onChange={(e) => setFormData({...formData, score: Number(e.target.value)})} />
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>Salvar no Histórico</button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
