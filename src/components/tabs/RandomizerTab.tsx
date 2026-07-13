import { Shuffle } from 'lucide-react';
import type { SetupResult } from '../../utils/randomizer';
import { SetupCard } from '../SetupCard';

interface RandomizerTabProps {
  playerCount: number;
  setPlayerCount: (count: number) => void;
  result: SetupResult | null;
  setResult: (result: SetupResult | null) => void;
  handleDraw: () => void;
  handleFinishMatch: (victory: boolean) => void;
}

export function RandomizerTab({ playerCount, setPlayerCount, result, handleDraw, handleFinishMatch }: RandomizerTabProps) {
  return (
    <div className="fade-in">
      <div className="page-header" style={{ alignItems: 'center', textAlign: 'center', display: 'flex', flexDirection: 'column', marginBottom: '32px' }}>
        <div>
          <h2 className="page-title">Gerador de Setup</h2>
          <p className="page-subtitle">Descubra sua próxima batalha contra as forças do mal.</p>
        </div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginTop: '24px' }}>
          <select 
            value={playerCount} 
            onChange={(e) => setPlayerCount(Number(e.target.value))}
            style={{ background: 'rgba(0,0,0,0.5)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', padding: '10px 16px', borderRadius: '8px', outline: 'none', fontSize: '1rem' }}
          >
            {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n} {n === 1 ? 'Jogador' : 'Jogadores'}</option>)}
          </select>
          <button onClick={handleDraw} className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <Shuffle size={20} /> Gerar Missão Aleatória
          </button>
        </div>
      </div>

      {result && (
        <section className="result-view fade-in">
          <div className="section-title text-secondary">O Vilão</div>
          <div className="card-grid">
            <SetupCard type="mastermind" title="Mastermind" name={result.mastermind.name} subtitle={`Lidera: ${result.mastermind.alwaysLeads}`} highlight={true} expansion={result.mastermind.expansion} />
            <SetupCard type="scheme" title="Scheme" name={result.scheme.name} highlight={true} expansion={result.scheme.expansion} />
          </div>
          
          <div className="section-title" style={{ marginTop: '24px', fontSize: '1rem', color: 'var(--text-secondary)' }}>Deck de Vilões & Henchmen</div>
          <div className="card-grid">
            {result.villains.map(v => <SetupCard key={v.name} type="villain" title="Villains" name={v.name} expansion={v.expansion} />)}
            {result.henchmen.map(h => <SetupCard key={h.name} type="henchmen" title="Henchmen" name={h.name} expansion={h.expansion} />)}
            <SetupCard type="bystander" title="Bystanders" name={`${result.bystanders} Cartas de Bystanders`} />
          </div>

          <div className="section-title text-primary" style={{ marginTop: '32px' }}>Os Heróis</div>
          <div className="card-grid">
            {result.heroes.map(h => <SetupCard key={h.name} type="hero" title="Hero" name={h.name} subtitle={h.team.replace('_', ' ')} expansion={h.expansion} />)}
          </div>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '48px', marginBottom: '24px' }}>
            <button onClick={() => handleFinishMatch(true)} className="btn btn-primary" style={{ background: 'rgba(16, 185, 129, 0.2)', border: '1px solid #10b981', color: '#10b981', minWidth: '160px', justifyContent: 'center' }}>
              Registrar Vitória
            </button>
            <button onClick={() => handleFinishMatch(false)} className="btn btn-primary" style={{ background: 'rgba(239, 68, 68, 0.2)', border: '1px solid #ef4444', color: '#ef4444', minWidth: '160px', justifyContent: 'center' }}>
              Registrar Derrota
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
