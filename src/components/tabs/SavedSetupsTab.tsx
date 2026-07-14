import { useState } from 'react';
import { Trash2, Play, List } from 'lucide-react';
import type { SavedSetup } from '../../hooks/useSavedSetups';
import { SetupDecklistModal } from '../SetupDecklistModal';
import type { SetupResult } from '../../utils/randomizer';

interface SavedSetupsTabProps {
  setups: SavedSetup[];
  removeSetup: (id: string) => void;
  onPlaySetup: (setup: SetupResult) => void;
  onRegisterMatch: (setup: SetupResult, victory: boolean, score?: number, pCount?: number) => void;
}

export function SavedSetupsTab({ setups, removeSetup, onPlaySetup, onRegisterMatch }: SavedSetupsTabProps) {
  const [setupToDelete, setSetupToDelete] = useState<string | null>(null);
  const [setupToView, setSetupToView] = useState<SavedSetup | null>(null);
  if (setups.length === 0) {
    return (
      <div className="fade-in" style={{ textAlign: 'center', marginTop: '60px' }}>
        <h2 className="page-title">Setups Salvos</h2>
        <p className="page-subtitle" style={{ marginTop: '20px' }}>Você ainda não salvou nenhum setup favorito.</p>
        <p style={{ color: 'var(--text-secondary)' }}>Vá até a aba Randomizer, gere uma missão e clique em "Salvar Setup".</p>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <h2 className="page-title">Setups Salvos</h2>
          <p className="page-subtitle">Suas missões favoritas para jogar novamente.</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {setups.map(s => (
          <div key={s.id} className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ margin: '0 0 4px 0', fontSize: '1.2rem', color: 'white' }}>{s.name}</h3>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  {new Date(s.createdAt).toLocaleDateString('pt-BR')}
                </span>
              </div>
              <button 
                onClick={() => setSetupToDelete(s.id)}
                style={{ background: 'rgba(239, 68, 68, 0.1)', border: 'none', color: '#ef4444', padding: '8px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                title="Remover"
              >
                <Trash2 size={18} />
              </button>
            </div>
            
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '8px', fontSize: '0.9rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                <div>
                  <strong style={{ color: 'var(--primary-color)' }}>Mastermind:</strong> {s.setup.mastermind.name}
                </div>
                <div>
                  <strong style={{ color: '#fbc02d' }}>Scheme:</strong> {s.setup.scheme.name}
                </div>
                <div>
                  <strong style={{ color: '#10b981' }}>Vilões:</strong> {s.setup.villains.map(v => v.name).join(', ')}
                </div>
                <div>
                  <strong style={{ color: '#3b82f6' }}>Heróis:</strong> {s.setup.heroes.map(h => h.name).join(', ')}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button onClick={() => setSetupToView(s)} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: 'transparent', border: '1px solid var(--primary-color)', color: 'white' }}>
                <List size={18} /> Ver Decklist
              </button>
              <button onClick={() => onPlaySetup(s.setup)} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <Play size={18} /> Tracker
              </button>
            </div>
          </div>
        ))}
      </div>

      {setupToView && (
        <SetupDecklistModal 
          setupData={setupToView} 
          onClose={() => setSetupToView(null)} 
          onPlayTracker={(s) => {
            setSetupToView(null);
            onPlaySetup(s);
          }}
          onRegisterMatch={(s, v, sc, pCount) => {
            setSetupToView(null);
            onRegisterMatch(s, v, sc, pCount);
          }}
        />
      )}

      {setupToDelete && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', animation: 'fadeIn 0.2s ease-out' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '400px', padding: '30px', position: 'relative' }}>
            <h3 style={{ color: 'white', margin: '0 0 16px 0', fontSize: '1.2rem' }}>Remover Setup</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '0.95rem', lineHeight: '1.5' }}>
              Tem certeza que deseja excluir este setup salvo? Você não poderá recuperá-lo.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button onClick={() => setSetupToDelete(null)} className="btn btn-secondary">Cancelar</button>
              <button onClick={() => {
                removeSetup(setupToDelete);
                setSetupToDelete(null);
              }} className="btn btn-primary" style={{ background: '#ef4444', borderColor: '#ef4444' }}>Excluir</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
