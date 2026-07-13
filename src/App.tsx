import { useState, useEffect } from 'react';
import { Menu, X, Globe, Settings, Volume2, VolumeX, Palette } from 'lucide-react';
import type { SetupResult } from './utils/randomizer';
import { generateSetup } from './utils/randomizer';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useSyncedCollection } from './hooks/useSyncedCollection';
import { useAuth } from './contexts/AuthContext';
import { useGameHistory } from './hooks/useGameHistory';
import packageJson from '../package.json';

// Components
import { Sidebar } from './components/Sidebar';
import { Rules } from './components/Rules';
import { HomeTab } from './components/tabs/HomeTab';
import { StatsTab } from './components/tabs/StatsTab';
import { CollectionTab } from './components/tabs/CollectionTab';
import { RandomizerTab } from './components/tabs/RandomizerTab';
import { TrackerTab } from './components/tabs/TrackerTab';
import { ReleaseNotesTab } from './components/tabs/ReleaseNotesTab';

function App() {
  const [playerCount, setPlayerCount] = useState(2);
  const [activeTab, setActiveTab] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [result, setResult] = useState<SetupResult | null>(null);
  
  const [ownedExpansions, setOwnedExpansions] = useSyncedCollection('lhq_ownedExpansions', ['core', 'core_2nd']);
  const { history, addMatch } = useGameHistory();
  const { currentUser, login, logoutUser } = useAuth();

  const [showSettings, setShowSettings] = useState(false);
  const [sfxEnabled, setSfxEnabled] = useState(true);
  const [theme, setTheme] = useState('covert');
  
  useEffect(() => {
    const savedTheme = localStorage.getItem('lhq_theme');
    if (savedTheme) {
      setTheme(savedTheme);
      document.body.setAttribute('data-theme', savedTheme);
    } else {
      document.body.setAttribute('data-theme', 'covert');
    }
    const savedSfx = localStorage.getItem('lhq_sfx');
    if (savedSfx !== null) {
      setSfxEnabled(savedSfx === 'true');
    }

    const clickHandler = (e: MouseEvent) => {
      if (localStorage.getItem('lhq_sfx') === 'false') return;
      
      const target = (e.target as HTMLElement).closest('button, a, .home-card');
      if (target) {
        try {
          const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          
          if (target.classList.contains('btn-primary') || target.tagName === 'A' || target.classList.contains('home-card')) {
            osc.frequency.setValueAtTime(600, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.05);
            gain.gain.setValueAtTime(0.05, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
            osc.start();
            osc.stop(ctx.currentTime + 0.05);
          } else {
            osc.frequency.setValueAtTime(300, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.08);
            gain.gain.setValueAtTime(0.08, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
            osc.start();
            osc.stop(ctx.currentTime + 0.08);
          }
        } catch { /* ignore audio context errors if blocked */ }
      }
    };
    
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  }, []);

  const changeTheme = (newTheme: string) => {
    setTheme(newTheme);
    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('lhq_theme', newTheme);
  };

  const toggleSfx = () => {
    const newVal = !sfxEnabled;
    setSfxEnabled(newVal);
    localStorage.setItem('lhq_sfx', String(newVal));
  };

  // Tracker State
  const [recruit, setRecruit] = useLocalStorage('lhq_recruit', 0);
  const [attack, setAttack] = useLocalStorage('lhq_attack', 0);
  const [masterStrikes, setMasterStrikes] = useLocalStorage('lhq_masterStrikes', 0);
  const [schemeTwists, setSchemeTwists] = useLocalStorage('lhq_schemeTwists', 0);
  const [bystanders, setBystanders] = useLocalStorage('lhq_bystanders', 0);

  const resetTracker = () => {
    if (confirm('Deseja zerar os contadores e começar uma nova partida?')) {
      setRecruit(0);
      setAttack(0);
      setMasterStrikes(0);
      setSchemeTwists(0);
      setBystanders(0);
    }
  };

  const handleFinishMatch = async (victory: boolean) => {
    if (!result) return;
    
    await addMatch({
      mastermind: result.mastermind.name,
      scheme: result.scheme.name,
      victory,
      playerCount,
      score: 0
    });
    
    alert(`Partida salva no histórico com sucesso!`);
    
    // Zera contadores
    setRecruit(0); setAttack(0); setMasterStrikes(0); setSchemeTwists(0); setBystanders(0);
    
    // Opcional: redimensiona pra stats e limpa randomizer
    setActiveTab('stats');
    setResult(null); 
  };

  const toggleExpansion = (id: string) => {
    setOwnedExpansions(prev => 
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
    );
  };

  const handleDraw = () => {
    try {
      const setup = generateSetup(playerCount, ownedExpansions);
      setResult(setup);
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : String(e));
    }
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="layout-container">
      {/* Mobile Elements */}
      <button 
        className="mobile-menu-btn" 
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      <div 
        className={`mobile-overlay ${isMobileMenuOpen ? 'open' : ''}`} 
        onClick={() => setIsMobileMenuOpen(false)}
      ></div>

      {/* Sidebar Navigation */}
      <Sidebar activeTab={activeTab} handleTabChange={handleTabChange} isMobileMenuOpen={isMobileMenuOpen} />

      <div className="main-content-wrapper">
        <header className="topbar" style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', padding: '24px 32px 0 32px', gap: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
            <Globe size={18} />
            <select 
              style={{ background: 'transparent', color: 'var(--text-secondary)', border: 'none', cursor: 'pointer', outline: 'none', fontSize: '0.9rem' }}
            >
              <option value="pt">PT</option>
              <option value="en">EN</option>
              <option value="es">ES</option>
            </select>
          </div>

          <button 
            onClick={() => setShowSettings(true)}
            style={{ background: 'transparent', color: 'var(--text-secondary)', border: 'none', padding: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            title="Configurações"
          >
            <Settings size={22} />
          </button>

          {currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '0.8rem', color: '#86efac' }} title="Nuvem Sincronizada">OK</span>
              <img src={currentUser.photoURL || ''} alt="User" style={{ width: 32, height: 32, borderRadius: '50%' }} title={currentUser.displayName || ''} />
              <button onClick={logoutUser} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>Sair</button>
            </div>
          ) : (
            <button onClick={login} className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
              Login
            </button>
          )}
        </header>

        {/* Modal de Configurações */}
        {showSettings && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="glass-panel" style={{ width: '90%', maxWidth: '400px', padding: '30px', position: 'relative' }}>
              <button onClick={() => setShowSettings(false)} style={{ position: 'absolute', top: '15px', right: '15px', background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}>
                <X size={24} />
              </button>
              
              <h2 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}><Settings /> Configurações</h2>
              
              <div style={{ marginBottom: '30px' }}>
                <h4 style={{ color: 'var(--text-secondary)', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}><Volume2 size={18} /> Áudio</h4>
                <button 
                  onClick={toggleSfx} 
                  className={`btn ${sfxEnabled ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '8px' }}
                >
                  {sfxEnabled ? <><Volume2 size={20} /> Efeitos Ativados</> : <><VolumeX size={20} /> Mutado</>}
                </button>
              </div>

              <div>
                <h4 style={{ color: 'var(--text-secondary)', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}><Palette size={18} /> Tema de Classe</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <button onClick={() => changeTheme('covert')} className="btn" style={{ borderColor: theme === 'covert' ? '#e62429' : '', color: theme === 'covert' ? '#e62429' : 'white' }}>Covert</button>
                  <button onClick={() => changeTheme('instinct')} className="btn" style={{ borderColor: theme === 'instinct' ? '#fbc02d' : '', color: theme === 'instinct' ? '#fbc02d' : 'white' }}>Instinct</button>
                  <button onClick={() => changeTheme('ranged')} className="btn" style={{ borderColor: theme === 'ranged' ? '#2b82d9' : '', color: theme === 'ranged' ? '#2b82d9' : 'white' }}>Ranged</button>
                  <button onClick={() => changeTheme('strength')} className="btn" style={{ borderColor: theme === 'strength' ? '#10b981' : '', color: theme === 'strength' ? '#10b981' : 'white' }}>Strength</button>
                  <button onClick={() => changeTheme('tech')} className="btn" style={{ gridColumn: '1 / -1', borderColor: theme === 'tech' ? '#94a3b8' : '', color: theme === 'tech' ? '#94a3b8' : 'white' }}>Tech</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="main-content">
          {activeTab === 'home' && <HomeTab onNavigate={handleTabChange} />}
          {activeTab === 'stats' && (
            <StatsTab 
              onNavigate={handleTabChange} 
              history={history} 
              addMatch={addMatch} 
              ownedExpansions={ownedExpansions} 
            />
          )}
          {activeTab === 'randomizer' && (
            <RandomizerTab 
              playerCount={playerCount} setPlayerCount={setPlayerCount}
              result={result} setResult={setResult}
              handleDraw={handleDraw}
            />
          )}
          {activeTab === 'tracker' && (
            <TrackerTab 
              recruit={recruit} setRecruit={setRecruit}
              attack={attack} setAttack={setAttack}
              masterStrikes={masterStrikes} setMasterStrikes={setMasterStrikes}
              schemeTwists={schemeTwists} setSchemeTwists={setSchemeTwists}
              bystanders={bystanders} setBystanders={setBystanders}
              resetTracker={resetTracker}
              currentSetup={result}
              onFinishMatch={handleFinishMatch}
            />
          )}
          {activeTab === 'collection' && (
            <CollectionTab ownedExpansions={ownedExpansions} toggleExpansion={toggleExpansion} />
          )}
          {activeTab === 'rules' && <Rules ownedExpansions={ownedExpansions} />}
          {activeTab === 'releases' && <ReleaseNotesTab />}
        </main>

        {/* Footer / Créditos */}
        <footer style={{ borderTop: '1px solid var(--surface-border)', padding: '24px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <p style={{ marginBottom: '8px' }}>
              <strong>Legendary HQ</strong> &copy; {new Date().getFullYear()}. Desenvolvido por Fãs, para Fãs.
              <span onClick={() => handleTabChange('releases')} style={{ color: 'var(--primary-color)', textDecoration: 'none', marginLeft: '12px', fontWeight: 'bold', cursor: 'pointer' }} title="Ver Histórico de Versões">
                v{packageJson.version}
              </span>
            </p>
            <p style={{ opacity: 0.7, lineHeight: 1.5 }}>
              Marvel Legendary e todos os personagens, textos de cartas e imagens são de propriedade intelectual da Marvel e Upper Deck Entertainment.<br />
              Este aplicativo não possui fins lucrativos e não é afiliado de forma alguma à Marvel ou Upper Deck.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
