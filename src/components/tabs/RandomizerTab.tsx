import type { SetupResult } from '../../utils/randomizer';
import { SetupCard } from '../SetupCard';

interface RandomizerTabProps {
  playerCount: number;
  setPlayerCount: (count: number) => void;
  result: SetupResult | null;
  setResult: (result: SetupResult | null) => void;
  handleDraw: () => void;
}

export function RandomizerTab({ playerCount, setPlayerCount, result, setResult, handleDraw }: RandomizerTabProps) {
  return (
    <div className="fade-in">
      {!result ? (
        <section className="glass-panel main-view" style={{ textAlign: 'center' }}>
          <h2>Configuração da Partida</h2>
          
          <div className="input-group">
            <label style={{ fontSize: '1.1rem', fontWeight: 600 }}>Número de Jogadores:</label>
            <select 
              value={playerCount} 
              onChange={(e) => setPlayerCount(Number(e.target.value))}
              className="glass-select"
            >
              {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n} {n === 1 ? 'Jogador' : 'Jogadores'}</option>)}
            </select>
          </div>
          
          <button className="btn btn-primary btn-large" onClick={handleDraw}>
            Sortear Partida
          </button>
        </section>
      ) : (
        <section className="result-view">
          <div className="result-header">
            <h2>Setup Gerado ({playerCount} {playerCount === 1 ? 'Jogador' : 'Jogadores'})</h2>
            <button className="btn" style={{ background: 'transparent', border: '1px solid var(--accent-color)' }} onClick={() => setResult(null)}>
              Voltar
            </button>
          </div>
          
          <div className="card-grid">
            <SetupCard type="mastermind" title="Mastermind" name={result.mastermind.name} subtitle={`Lidera: ${result.mastermind.alwaysLeads}`} highlight={true} expansion={result.mastermind.expansion} />
            <SetupCard type="scheme" title="Scheme" name={result.scheme.name} highlight={true} expansion={result.scheme.expansion} />
          </div>
          
          <div className="section-title">Villain Deck</div>
          <div className="card-grid">
            {result.villains.map(v => <SetupCard key={v.name} type="villain" title="Villains" name={v.name} expansion={v.expansion} />)}
            {result.henchmen.map(h => <SetupCard key={h.name} type="henchmen" title="Henchmen" name={h.name} expansion={h.expansion} />)}
            <SetupCard type="bystander" title="Bystanders" name={`${result.bystanders} Cartas de Bystanders`} />
          </div>

          <div className="section-title">Hero Deck</div>
          <div className="card-grid">
            {result.heroes.map(h => <SetupCard key={h.name} type="hero" title="Hero" name={h.name} subtitle={h.team.replace('_', ' ')} expansion={h.expansion} />)}
          </div>
        </section>
      )}
    </div>
  );
}
