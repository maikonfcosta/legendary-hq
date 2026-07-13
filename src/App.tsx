import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import type { SetupResult } from './utils/randomizer';
import { generateSetup } from './utils/randomizer';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useSyncedCollection } from './hooks/useSyncedCollection';
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
