import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import type { SetupResult } from './utils/randomizer';
import { generateSetup } from './utils/randomizer';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useSyncedCollection } from './hooks/useSyncedCollection';

// Components
import { Sidebar } from './components/Sidebar';
import { Rules } from './components/Rules';
import { HomeTab } from './components/tabs/HomeTab';
import { StatsTab } from './components/tabs/StatsTab';
import { CollectionTab } from './components/tabs/CollectionTab';
import { RandomizerTab } from './components/tabs/RandomizerTab';
import { TrackerTab } from './components/tabs/TrackerTab';

function App() {
  const [playerCount, setPlayerCount] = useState(2);
  const [activeTab, setActiveTab] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [result, setResult] = useState<SetupResult | null>(null);
  const [ownedExpansions, setOwnedExpansions] = useSyncedCollection('lhq_ownedExpansions', ['core', 'core_2nd']);

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

      {/* Main Content Area */}
      <main className="main-content">
        {activeTab === 'home' && <HomeTab onNavigate={handleTabChange} />}
        {activeTab === 'stats' && <StatsTab onNavigate={handleTabChange} />}
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
          />
        )}
        {activeTab === 'collection' && (
          <CollectionTab ownedExpansions={ownedExpansions} toggleExpansion={toggleExpansion} />
        )}
        {activeTab === 'rules' && <Rules ownedExpansions={ownedExpansions} />}
      </main>

      {/* Footer / Créditos */}
      <footer style={{
        marginTop: 'auto',
        padding: '2rem',
        textAlign: 'center',
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        background: 'rgba(0, 0, 0, 0.3)',
        color: 'var(--text-secondary)',
        fontSize: '0.85rem'
      }}>
        <p style={{ margin: '0 0 10px 0' }}>
          <strong>Legendary HQ</strong> — Criado por <strong>Maikon Costa</strong> com ❤️ para a comunidade.
        </p>
        <p style={{ margin: 0, opacity: 0.6, fontSize: '0.75rem', maxWidth: '800px', marginInline: 'auto' }}>
          Marvel Legendary e seus personagens são marcas registradas da Marvel e Upper Deck. 
          Este é um aplicativo não-oficial, criado de fã para fã.
        </p>
      </footer>
    </div>
  );
}

export default App;
