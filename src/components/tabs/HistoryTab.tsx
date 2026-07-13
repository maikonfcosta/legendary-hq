import { useState } from 'react';
import { Plus, X, BarChart2 } from 'lucide-react';
import type { GameMatch } from '../../types/history';
import cardsData from '../../data/cards.json';

interface HistoryTabProps {
  history: GameMatch[];
  addMatch: (match: Omit<GameMatch, 'id' | 'date'>) => Promise<void>;
  ownedExpansions: string[];
}

export function HistoryTab({ history, addMatch, ownedExpansions }: HistoryTabProps) {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    mastermind: '',
    scheme: '',
    victory: true,
    playerCount: 2,
    score: 0
  });

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
          <h2>Histórico de Partidas</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Registre e consulte seus embates contra os Masterminds.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
          Adicionar
        </button>
      </div>

      {history.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
          <BarChart2 size={64} style={{ color: 'var(--text-secondary)', margin: '0 auto 1.5rem', opacity: 0.5 }} />
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'white' }}>Sem Histórico</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 2rem auto', lineHeight: 1.6 }}>
            Registre sua primeira partida no botão acima!
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {history.map(match => (
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
      )}

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
              <div className="input-group" style={{ margin: '0' }}>
                <label style={{alignSelf: 'flex-start'}}>Resultado:</label>
                <select className="glass-select" value={formData.victory ? 'win' : 'loss'} onChange={(e) => setFormData({...formData, victory: e.target.value === 'win'})}>
                  <option value="win">Vitória</option>
                  <option value="loss">Derrota</option>
                </select>
              </div>

              <div className="input-group" style={{ margin: '0' }}>
                <label style={{alignSelf: 'flex-start'}}>Mastermind:</label>
                <select className="glass-select" value={formData.mastermind} onChange={(e) => setFormData({...formData, mastermind: e.target.value})} required>
                  <option value="">-- Selecione --</option>
                  {availableMasterminds.map(m => <option key={m.id} value={m.name}>{m.name}</option>)}
                </select>
              </div>

              <div className="input-group" style={{ margin: '0' }}>
                <label style={{alignSelf: 'flex-start'}}>Scheme:</label>
                <select className="glass-select" value={formData.scheme} onChange={(e) => setFormData({...formData, scheme: e.target.value})} required>
                  <option value="">-- Selecione --</option>
                  {availableSchemes.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                </select>
              </div>

              <div className="input-group" style={{ display: 'flex', flexDirection: 'row', gap: '1rem', margin: '0' }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <label>Jogadores:</label>
                  <input type="number" min="1" max="5" className="glass-select" value={formData.playerCount} onChange={(e) => setFormData({...formData, playerCount: Number(e.target.value)})} />
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
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
