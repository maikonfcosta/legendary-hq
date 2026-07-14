import { useState } from 'react';
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
  handleSaveSetup?: (name: string) => void;
}

export function RandomizerTab({ playerCount, setPlayerCount, result, handleDraw, handleFinishMatch, handleSaveSetup }: RandomizerTabProps) {
  const [showSavePrompt, setShowSavePrompt] = useState(false);
  const [setupName, setSetupName] = useState('');

  const confirmSave = () => {
    if (setupName.trim() && handleSaveSetup) {
      handleSaveSetup(setupName.trim());
    }
    setShowSavePrompt(false);
    setSetupName('');
  };
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

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '48px', marginBottom: '24px', flexWrap: 'wrap' }}>
            <button onClick={() => setShowSavePrompt(true)} className="btn" style={{ background: 'rgba(59, 130, 246, 0.2)', border: '1px solid #3b82f6', color: '#3b82f6', minWidth: '160px', justifyContent: 'center', display: 'flex', alignItems: 'center', gap: '8px' }}>
              Salvar Setup (Favoritar)
            </button>
            <button onClick={() => handleFinishMatch(true)} className="btn btn-primary" style={{ background: 'rgba(16, 185, 129, 0.2)', border: '1px solid #10b981', color: '#10b981', minWidth: '160px', justifyContent: 'center' }}>
              Registrar Vitória
            </button>
            <button onClick={() => handleFinishMatch(false)} className="btn btn-primary" style={{ background: 'rgba(239, 68, 68, 0.2)', border: '1px solid #ef4444', color: '#ef4444', minWidth: '160px', justifyContent: 'center' }}>
              Registrar Derrota
            </button>
          </div>
        </section>
      )}

      {showSavePrompt && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', animation: 'fadeIn 0.2s ease-out' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '400px', padding: '30px', position: 'relative' }}>
            <h3 style={{ color: 'white', margin: '0 0 16px 0', fontSize: '1.2rem' }}>Salvar Setup</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '16px', fontSize: '0.9rem' }}>Dê um nome para este setup para encontrá-lo depois:</p>
            <input 
              type="text" 
              value={setupName}
              onChange={(e) => setSetupName(e.target.value)}
              placeholder="Ex: Guerras Secretas"
              autoFocus
              style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--surface-border)', color: 'white', marginBottom: '24px', outline: 'none' }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') confirmSave();
                if (e.key === 'Escape') setShowSavePrompt(false);
              }}
            />
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowSavePrompt(false)} className="btn btn-secondary">Cancelar</button>
              <button onClick={confirmSave} className="btn btn-primary">Salvar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
