import { useState } from 'react';
import { RotateCcw, Star, Swords, Skull, AlertTriangle, Users, CheckSquare, HelpCircle, Network, QrCode } from 'lucide-react';
import type { SetupResult } from '../../utils/randomizer';
import { TurnAssistantModal } from '../TurnAssistantModal';
import { useMultiplayer } from '../../contexts/MultiplayerContext';
import { QRCodeCanvas } from 'qrcode.react';

interface TrackerTabProps {
  recruit: number; setRecruit: (val: number) => void;
  attack: number; setAttack: (val: number) => void;
  masterStrikes: number; setMasterStrikes: (val: number) => void;
  schemeTwists: number; setSchemeTwists: (val: number) => void;
  bystanders: number; setBystanders: (val: number) => void;
  resetTracker: () => void;
  currentSetup: SetupResult | null;
  onFinishMatch: (victory: boolean) => void;
}

export function TrackerTab({ recruit, setRecruit, attack, setAttack, masterStrikes, setMasterStrikes, schemeTwists, setSchemeTwists, bystanders, setBystanders, resetTracker, currentSetup, onFinishMatch }: TrackerTabProps) {
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [showAssistant, setShowAssistant] = useState(false);
  const [showMultiplayerModal, setShowMultiplayerModal] = useState(false);
  const [joinId, setJoinId] = useState('');
  const [isHosting, setIsHosting] = useState(false);
  
  const { isConnected, isHost, peerId, hostGame, joinGame, disconnect, connections } = useMultiplayer();

  const handleFinish = (victory: boolean) => {
    onFinishMatch(victory);
    setShowFinishModal(false);
  };

  const handleHost = async () => {
    setIsHosting(true);
    try {
      await hostGame();
    } catch (e) {
      alert('Erro ao hospedar: ' + e);
    } finally {
      setIsHosting(false);
    }
  };

  const handleJoin = async () => {
    if (!joinId) return;
    try {
      await joinGame(joinId);
      setShowMultiplayerModal(false);
    } catch (e) {
      alert('Erro ao conectar: Verifique o ID.');
    }
  };

  return (
    <section className="fade-in">
      <div className="result-header">
        <div>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            Game Tracker
          </h2>
          <p style={{ color: 'var(--text-secondary)' }}>Acompanhe os pontos do turno e o andamento da partida.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button className="btn" style={{ background: 'var(--surface-bg)', border: '1px solid var(--primary-color)', color: 'white' }} onClick={() => setShowAssistant(true)}>
            <HelpCircle size={18} style={{ marginRight: '8px', verticalAlign: 'middle', color: 'var(--primary-color)' }} />
            Assistente
          </button>
          <button className="btn" style={{ background: isConnected ? '#10b981' : 'transparent', border: '1px solid var(--primary-color)' }} onClick={() => setShowMultiplayerModal(true)}>
            <Network size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
            {isConnected ? `Online (${connections.length})` : 'Multiplayer'}
          </button>
          {currentSetup && (
            <button className="btn btn-primary" onClick={() => setShowFinishModal(true)}>
              <CheckSquare size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
              Concluir Partida
            </button>
          )}
          <button className="btn" style={{ background: 'transparent', border: '1px solid var(--text-muted)' }} onClick={resetTracker}>
            <RotateCcw size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
            Limpar
          </button>
        </div>
      </div>

      <div className="section-title" style={{ marginTop: '2rem' }}>Recursos do Turno (Zere ao final do turno)</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '40px' }}>
        
        <div className="glass-panel" style={{ padding: '32px', textAlign: 'center', borderTop: '4px solid #eab308' }}>
          <Star size={40} color="#eab308" style={{ margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '16px' }}>Recruit Points</h3>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px' }}>
            <button className="tracker-btn yellow" onClick={() => setRecruit(Math.max(0, recruit - 1))}>-</button>
            <span key={`recruit-${recruit}`} className="animate-pop" style={{ fontSize: '4rem', fontWeight: 900, minWidth: '80px', textShadow: '0 0 20px rgba(234, 179, 8, 0.4)', display: 'inline-block' }}>{recruit}</span>
            <button className="tracker-btn yellow filled" onClick={() => setRecruit(recruit + 1)}>+</button>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '32px', textAlign: 'center', borderTop: '4px solid #ef4444' }}>
          <Swords size={40} color="#ef4444" style={{ margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '16px' }}>Attack Points</h3>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px' }}>
            <button className="tracker-btn red" onClick={() => setAttack(Math.max(0, attack - 1))}>-</button>
            <span key={`attack-${attack}`} className="animate-pop" style={{ fontSize: '4rem', fontWeight: 900, minWidth: '80px', textShadow: '0 0 20px rgba(239, 68, 68, 0.4)', display: 'inline-block' }}>{attack}</span>
            <button className="tracker-btn red filled" onClick={() => setAttack(attack + 1)}>+</button>
          </div>
        </div>
      </div>

      <div className="section-title">Controle do Vilão (Persiste a partida toda)</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
        
        <div className={`glass-panel ${masterStrikes >= 5 ? 'danger-pulse' : ''}`} style={{ padding: '24px', textAlign: 'center', borderTop: '4px solid #a855f7' }}>
          <Skull size={32} color="#a855f7" style={{ margin: '0 auto 12px' }} />
          <p style={{ color: 'var(--text-secondary)', textTransform: 'uppercase', fontSize: '0.85rem', fontWeight: 'bold' }}>Master Strikes</p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginTop: '16px' }}>
            <button className="btn" style={{ padding: '8px 16px' }} onClick={() => setMasterStrikes(Math.max(0, masterStrikes - 1))}>-</button>
            <span key={`ms-${masterStrikes}`} className="animate-pop" style={{ fontSize: '2rem', fontWeight: 700, minWidth: '40px', display: 'inline-block' }}>{masterStrikes}</span>
            <button className="btn" style={{ padding: '8px 16px', border: '1px solid #a855f7', background: 'transparent' }} onClick={() => setMasterStrikes(masterStrikes + 1)}>+</button>
          </div>
        </div>

        <div className={`glass-panel ${schemeTwists >= 5 ? 'danger-pulse' : ''}`} style={{ padding: '24px', textAlign: 'center', borderTop: '4px solid #f97316' }}>
          <AlertTriangle size={32} color="#f97316" style={{ margin: '0 auto 12px' }} />
          <p style={{ color: 'var(--text-secondary)', textTransform: 'uppercase', fontSize: '0.85rem', fontWeight: 'bold' }}>Scheme Twists</p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginTop: '16px' }}>
            <button className="btn" style={{ padding: '8px 16px' }} onClick={() => setSchemeTwists(Math.max(0, schemeTwists - 1))}>-</button>
            <span key={`st-${schemeTwists}`} className="animate-pop" style={{ fontSize: '2rem', fontWeight: 700, minWidth: '40px', display: 'inline-block' }}>{schemeTwists}</span>
            <button className="btn" style={{ padding: '8px 16px', border: '1px solid #f97316', background: 'transparent' }} onClick={() => setSchemeTwists(schemeTwists + 1)}>+</button>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px', textAlign: 'center', borderTop: '4px solid #3b82f6' }}>
          <Users size={32} color="#3b82f6" style={{ margin: '0 auto 12px' }} />
          <p style={{ color: 'var(--text-secondary)', textTransform: 'uppercase', fontSize: '0.85rem', fontWeight: 'bold' }}>Bystanders K.O.</p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginTop: '16px' }}>
            <button className="btn" style={{ padding: '8px 16px' }} onClick={() => setBystanders(Math.max(0, bystanders - 1))}>-</button>
            <span key={`bs-${bystanders}`} className="animate-pop" style={{ fontSize: '2rem', fontWeight: 700, minWidth: '40px', display: 'inline-block' }}>{bystanders}</span>
            <button className="btn" style={{ padding: '8px 16px', border: '1px solid #3b82f6', background: 'transparent' }} onClick={() => setBystanders(bystanders + 1)}>+</button>
          </div>
        </div>
      </div>

      {showFinishModal && currentSetup && (
        <>
          <div className="mobile-overlay open" onClick={() => setShowFinishModal(false)} style={{ zIndex: 999 }}></div>
          <div className="glass-panel fade-in" style={{
            position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            width: '90%', maxWidth: '500px', zIndex: 1000, padding: '2rem', textAlign: 'center'
          }}>
            <h2 style={{ margin: '0 0 1rem 0' }}>Fim de Jogo!</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
              Você conseguiu derrotar <strong>{currentSetup.mastermind.name}</strong> antes que o Scheme <em>"{currentSetup.scheme.name}"</em> se concretizasse?
            </p>
            
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button className="btn" style={{ background: '#10b981', flex: 1 }} onClick={() => handleFinish(true)}>
                Sim, Vitória!
              </button>
              <button className="btn" style={{ background: '#ef4444', flex: 1 }} onClick={() => handleFinish(false)}>
                Não, Fui Derrotado
              </button>
            </div>
            
            <button className="btn" style={{ marginTop: '1.5rem', background: 'transparent', border: '1px solid var(--surface-border)' }} onClick={() => setShowFinishModal(false)}>
              Cancelar
            </button>
          </div>
        </>
      )}

      {showMultiplayerModal && (
        <>
          <div className="mobile-overlay open" onClick={() => setShowMultiplayerModal(false)} style={{ zIndex: 999 }}></div>
          <div className="glass-panel fade-in" style={{
            position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            width: '90%', maxWidth: '400px', zIndex: 1000, padding: '2rem', textAlign: 'center'
          }}>
            <h2 style={{ margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}><Network /> Sincronizar Mesa P2P</h2>
            
            {isConnected ? (
              <div>
                <p style={{ color: '#10b981', fontWeight: 'bold' }}>Conectado! ({connections.length} jogador{connections.length > 1 ? 'es' : ''})</p>
                {isHost && peerId && (
                  <div style={{ background: 'white', padding: '16px', borderRadius: '8px', display: 'inline-block', margin: '16px 0' }}>
                    <QRCodeCanvas value={peerId} size={150} />
                  </div>
                )}
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', wordBreak: 'break-all' }}>ID: {peerId || 'Cliente'}</p>
                <button className="btn btn-secondary" style={{ width: '100%', marginTop: '16px' }} onClick={disconnect}>Desconectar</button>
              </div>
            ) : (
              <div>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '0.95rem' }}>
                  Hospede uma mesa para compartilhar o Tracker ou entre na mesa de um amigo usando o ID.
                </p>
                
                {peerId ? (
                  <div style={{ marginBottom: '20px' }}>
                    <p style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>Aguardando jogadores...</p>
                    <div style={{ background: 'white', padding: '16px', borderRadius: '8px', display: 'inline-block', margin: '16px 0' }}>
                      <QRCodeCanvas value={peerId} size={150} />
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', wordBreak: 'break-all' }}>Seu ID: {peerId}</p>
                    <button className="btn btn-secondary" style={{ width: '100%', marginTop: '10px' }} onClick={disconnect}>Cancelar Hospedagem</button>
                  </div>
                ) : (
                  <>
                    <button 
                      className="btn btn-primary" 
                      style={{ width: '100%', marginBottom: '16px', display: 'flex', justifyContent: 'center', gap: '8px', opacity: isHosting ? 0.7 : 1 }} 
                      onClick={handleHost}
                      disabled={isHosting}
                    >
                      <QrCode size={18} /> {isHosting ? 'Criando Sala...' : 'Hospedar Mesa'}
                    </button>
                    
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', margin: '16px 0' }}>
                      <div style={{ height: '1px', flex: 1, background: 'var(--surface-border)' }}></div>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase' }}>ou</span>
                      <div style={{ height: '1px', flex: 1, background: 'var(--surface-border)' }}></div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input 
                        type="text" 
                        placeholder="Cole o ID do Host"
                        value={joinId}
                        onChange={(e) => setJoinId(e.target.value)}
                        style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid var(--surface-border)', background: 'rgba(0,0,0,0.5)', color: 'white' }}
                      />
                      <button className="btn" style={{ background: '#3b82f6' }} onClick={handleJoin}>Entrar</button>
                    </div>
                  </>
                )}
              </div>
            )}
            
            <button className="btn" style={{ marginTop: '1.5rem', background: 'transparent', border: 'none', color: 'var(--text-secondary)' }} onClick={() => setShowMultiplayerModal(false)}>
              Fechar
            </button>
          </div>
        </>
      )}

      {showAssistant && <TurnAssistantModal onClose={() => setShowAssistant(false)} />}
    </section>
  );
}
