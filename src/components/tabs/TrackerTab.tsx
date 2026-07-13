import { RotateCcw, Star, Swords, Skull, AlertTriangle, Users } from 'lucide-react';

interface TrackerTabProps {
  recruit: number; setRecruit: (val: number) => void;
  attack: number; setAttack: (val: number) => void;
  masterStrikes: number; setMasterStrikes: (val: number) => void;
  schemeTwists: number; setSchemeTwists: (val: number) => void;
  bystanders: number; setBystanders: (val: number) => void;
  resetTracker: () => void;
}

export function TrackerTab({ recruit, setRecruit, attack, setAttack, masterStrikes, setMasterStrikes, schemeTwists, setSchemeTwists, bystanders, setBystanders, resetTracker }: TrackerTabProps) {
  return (
    <section className="fade-in">
      <div className="result-header">
        <div>
          <h2>Game Tracker</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Acompanhe os pontos do turno e o andamento da partida.</p>
        </div>
        <button className="btn" style={{ background: 'transparent', border: '1px solid var(--text-muted)' }} onClick={resetTracker}>
          <RotateCcw size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
          Resetar Partida
        </button>
      </div>

      <div className="section-title" style={{ marginTop: '2rem' }}>Recursos do Turno (Zere ao final do turno)</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '40px' }}>
        
        <div className="glass-panel" style={{ padding: '32px', textAlign: 'center', borderTop: '4px solid #eab308' }}>
          <Star size={40} color="#eab308" style={{ margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '16px' }}>Recruit Points</h3>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px' }}>
            <button className="btn" style={{ fontSize: '2rem', width: '60px', height: '60px', borderRadius: '50%', padding: 0 }} onClick={() => setRecruit(Math.max(0, recruit - 1))}>-</button>
            <span style={{ fontSize: '4rem', fontWeight: 900, minWidth: '80px', textShadow: '0 0 20px rgba(234, 179, 8, 0.4)' }}>{recruit}</span>
            <button className="btn" style={{ fontSize: '2rem', width: '60px', height: '60px', borderRadius: '50%', padding: 0, background: '#eab308' }} onClick={() => setRecruit(recruit + 1)}>+</button>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '32px', textAlign: 'center', borderTop: '4px solid #ef4444' }}>
          <Swords size={40} color="#ef4444" style={{ margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '16px' }}>Attack Points</h3>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px' }}>
            <button className="btn" style={{ fontSize: '2rem', width: '60px', height: '60px', borderRadius: '50%', padding: 0 }} onClick={() => setAttack(Math.max(0, attack - 1))}>-</button>
            <span style={{ fontSize: '4rem', fontWeight: 900, minWidth: '80px', textShadow: '0 0 20px rgba(239, 68, 68, 0.4)' }}>{attack}</span>
            <button className="btn btn-primary" style={{ fontSize: '2rem', width: '60px', height: '60px', borderRadius: '50%', padding: 0 }} onClick={() => setAttack(attack + 1)}>+</button>
          </div>
        </div>
      </div>

      <div className="section-title">Controle do Vilão (Persiste a partida toda)</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
        
        <div className="glass-panel" style={{ padding: '24px', textAlign: 'center', borderTop: '4px solid #a855f7' }}>
          <Skull size={32} color="#a855f7" style={{ margin: '0 auto 12px' }} />
          <p style={{ color: 'var(--text-secondary)', textTransform: 'uppercase', fontSize: '0.85rem', fontWeight: 'bold' }}>Master Strikes</p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginTop: '16px' }}>
            <button className="btn" style={{ padding: '8px 16px' }} onClick={() => setMasterStrikes(Math.max(0, masterStrikes - 1))}>-</button>
            <span style={{ fontSize: '2rem', fontWeight: 700, minWidth: '40px' }}>{masterStrikes}</span>
            <button className="btn" style={{ padding: '8px 16px', border: '1px solid #a855f7', background: 'transparent' }} onClick={() => setMasterStrikes(masterStrikes + 1)}>+</button>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px', textAlign: 'center', borderTop: '4px solid #f97316' }}>
          <AlertTriangle size={32} color="#f97316" style={{ margin: '0 auto 12px' }} />
          <p style={{ color: 'var(--text-secondary)', textTransform: 'uppercase', fontSize: '0.85rem', fontWeight: 'bold' }}>Scheme Twists</p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginTop: '16px' }}>
            <button className="btn" style={{ padding: '8px 16px' }} onClick={() => setSchemeTwists(Math.max(0, schemeTwists - 1))}>-</button>
            <span style={{ fontSize: '2rem', fontWeight: 700, minWidth: '40px' }}>{schemeTwists}</span>
            <button className="btn" style={{ padding: '8px 16px', border: '1px solid #f97316', background: 'transparent' }} onClick={() => setSchemeTwists(schemeTwists + 1)}>+</button>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px', textAlign: 'center', borderTop: '4px solid #3b82f6' }}>
          <Users size={32} color="#3b82f6" style={{ margin: '0 auto 12px' }} />
          <p style={{ color: 'var(--text-secondary)', textTransform: 'uppercase', fontSize: '0.85rem', fontWeight: 'bold' }}>Bystanders K.O.</p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginTop: '16px' }}>
            <button className="btn" style={{ padding: '8px 16px' }} onClick={() => setBystanders(Math.max(0, bystanders - 1))}>-</button>
            <span style={{ fontSize: '2rem', fontWeight: 700, minWidth: '40px' }}>{bystanders}</span>
            <button className="btn" style={{ padding: '8px 16px', border: '1px solid #3b82f6', background: 'transparent' }} onClick={() => setBystanders(bystanders + 1)}>+</button>
          </div>
        </div>

      </div>
    </section>
  );
}
