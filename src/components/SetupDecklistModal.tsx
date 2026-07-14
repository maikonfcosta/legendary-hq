import { useState } from 'react';
import { X, Activity, CheckSquare } from 'lucide-react';
import type { SavedSetup } from '../hooks/useSavedSetups';
import type { SetupResult } from '../utils/randomizer';

interface SetupDecklistModalProps {
  setupData: SavedSetup;
  onClose: () => void;
  onPlayTracker: (setup: SetupResult) => void;
  onRegisterMatch: (setup: SetupResult, victory: boolean, score?: number, pCount?: number) => void;
}

export function SetupDecklistModal({ setupData, onClose, onPlayTracker, onRegisterMatch }: SetupDecklistModalProps) {
  const { setup } = setupData;
  const [showRegister, setShowRegister] = useState(false);
  const [victory, setVictory] = useState(true);
  const [score, setScore] = useState<number | ''>('');

  // Deduct player count based on config rules
  let playerCount = 2;
  if (setup.villains.length === 1) playerCount = 1;
  else if (setup.villains.length === 2) playerCount = 2;
  else if (setup.villains.length === 3 && setup.henchmen.length === 1) playerCount = 3;
  else if (setup.villains.length === 3 && setup.henchmen.length === 2) playerCount = 4;
  else if (setup.villains.length === 4) playerCount = 5;

  const henchmenCount = playerCount === 1 ? 3 : 10;

  if (showRegister) {
    return (
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', animation: 'fadeIn 0.2s ease-out' }}>
        <div className="glass-panel" style={{ width: '100%', maxWidth: '400px', padding: '30px', position: 'relative' }}>
          <button onClick={() => setShowRegister(false)} style={{ position: 'absolute', top: '15px', right: '15px', background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}>
            <X size={24} />
          </button>
          
          <h3 style={{ color: 'white', margin: '0 0 16px 0', fontSize: '1.2rem' }}>Registrar Partida</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '0.9rem' }}>
            Registrando partida de <strong>{setupData.name}</strong> ({playerCount} Jogadores).
          </p>
          
          <div className="input-group" style={{ marginBottom: '16px' }}>
            <label style={{ color: 'var(--text-secondary)', marginBottom: '8px', display: 'block' }}>Resultado</label>
            <select className="glass-select" style={{ width: '100%', background: 'rgba(0,0,0,0.4)', color: victory ? '#10b981' : '#ef4444' }} value={victory ? 'win' : 'loss'} onChange={(e) => setVictory(e.target.value === 'win')}>
              <option value="win">Vitória</option>
              <option value="loss">Derrota</option>
            </select>
          </div>

          <div className="input-group" style={{ marginBottom: '24px' }}>
            <label style={{ color: 'var(--text-secondary)', marginBottom: '8px', display: 'block' }}>Score (Opcional)</label>
            <input type="number" className="glass-select" style={{ width: '100%', background: 'rgba(0,0,0,0.4)' }} value={score} onChange={(e) => setScore(e.target.value === '' ? '' : Number(e.target.value))} placeholder="Ex: 45" />
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button onClick={() => setShowRegister(false)} className="btn btn-secondary">Voltar</button>
            <button onClick={() => onRegisterMatch(setup, victory, score === '' ? 0 : score, playerCount)} className="btn btn-primary" style={{ background: '#10b981', borderColor: '#10b981' }}>Salvar no Histórico</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', animation: 'fadeIn 0.2s ease-out' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', padding: '30px', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '15px', right: '15px', background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}>
          <X size={24} />
        </button>
        
        <h2 style={{ color: 'white', margin: '0 0 4px 0', fontSize: '1.5rem', paddingRight: '30px' }}>{setupData.name}</h2>
        <p style={{ color: 'var(--primary-color)', marginBottom: '24px', fontSize: '0.95rem', fontWeight: 600 }}>
          Decklist para {playerCount} {playerCount === 1 ? 'Jogador' : 'Jogadores'}
        </p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
          
          {/* O VILÃO */}
          <div style={{ background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '8px', borderLeft: '4px solid #ef4444' }}>
            <h4 style={{ color: '#ef4444', margin: '0 0 12px 0', textTransform: 'uppercase', fontSize: '0.85rem' }}>Forças do Mal</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px', color: 'white', fontSize: '0.95rem' }}>
              <li><span style={{ color: 'var(--text-secondary)', display: 'inline-block', width: '30px' }}>1x</span> <strong>Mastermind:</strong> {setup.mastermind.name} <span style={{fontSize: '0.8rem', color:'var(--text-muted)'}}>(+4 Tactics)</span></li>
              <li><span style={{ color: 'var(--text-secondary)', display: 'inline-block', width: '30px' }}>1x</span> <strong>Scheme:</strong> {setup.scheme.name}</li>
            </ul>
          </div>

          {/* VILLAIN DECK */}
          <div style={{ background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '8px', borderLeft: '4px solid #f97316' }}>
            <h4 style={{ color: '#f97316', margin: '0 0 12px 0', textTransform: 'uppercase', fontSize: '0.85rem' }}>Villain Deck</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px', color: 'white', fontSize: '0.95rem' }}>
              <li><span style={{ color: 'var(--text-secondary)', display: 'inline-block', width: '30px' }}>5x</span> Master Strikes</li>
              <li><span style={{ color: 'var(--text-secondary)', display: 'inline-block', width: '30px' }}>?x</span> Scheme Twists <span style={{fontSize: '0.8rem', color:'var(--text-muted)'}}>(Verifique o Scheme)</span></li>
              <li><span style={{ color: 'var(--text-secondary)', display: 'inline-block', width: '30px' }}>{setup.bystanders}x</span> Bystanders</li>
              {setup.villains.map((v: any) => (
                <li key={v.name}><span style={{ color: 'var(--text-secondary)', display: 'inline-block', width: '30px' }}>8x</span> Villain: {v.name}</li>
              ))}
              {setup.henchmen.map((h: any) => (
                <li key={h.name}><span style={{ color: 'var(--text-secondary)', display: 'inline-block', width: '30px' }}>{henchmenCount}x</span> Henchmen: {h.name}</li>
              ))}
            </ul>
          </div>

          {/* HERO DECK */}
          <div style={{ background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '8px', borderLeft: '4px solid #3b82f6' }}>
            <h4 style={{ color: '#3b82f6', margin: '0 0 12px 0', textTransform: 'uppercase', fontSize: '0.85rem' }}>Hero Deck</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px', color: 'white', fontSize: '0.95rem' }}>
              {setup.heroes.map((h: any) => (
                <li key={h.name}><span style={{ color: 'var(--text-secondary)', display: 'inline-block', width: '30px' }}>14x</span> Hero: {h.name}</li>
              ))}
            </ul>
          </div>

        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <button onClick={() => setShowRegister(true)} className="btn" style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10b981', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <CheckSquare size={18} /> Registrar Direto
          </button>
          <button onClick={() => onPlayTracker(setup)} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <Activity size={18} /> Jogar (Tracker)
          </button>
        </div>
      </div>
    </div>
  );
}
