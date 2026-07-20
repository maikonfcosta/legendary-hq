import { useState, useEffect } from 'react';
import { Menu, X, Globe, Settings, Volume2, VolumeX, Palette } from 'lucide-react';
import type { SetupResult } from './utils/randomizer';
import { generateSetup } from './utils/randomizer';
import { useSyncedCollection } from './hooks/useSyncedCollection';
import { useAuth } from './contexts/AuthContext';
import { useGameHistory } from './hooks/useGameHistory';
import { useTranslation } from 'react-i18next';
import packageJson from '../package.json';

// Components
import { Sidebar } from './components/Sidebar';
import { Rules } from './components/Rules';
import { HomeTab } from './components/tabs/HomeTab';
import { StatsTab } from './components/tabs/StatsTab';
import { HistoryTab } from './components/tabs/HistoryTab';
import { CollectionTab } from './components/tabs/CollectionTab';
import { RandomizerTab } from './components/tabs/RandomizerTab';
import { TrackerTab } from './components/tabs/TrackerTab';
import { ReleaseNotesTab } from './components/tabs/ReleaseNotesTab';
import { ReloadPrompt } from './components/ReloadPrompt';
import { useAvatar } from './hooks/useAvatar';
import { AvatarPickerModal } from './components/AvatarPickerModal';
import { getCardImage } from './utils/imageLookup';
import { useSavedSetups } from './hooks/useSavedSetups';
import { SavedSetupsTab } from './components/tabs/SavedSetupsTab';
import { CampaignsTab } from './components/tabs/CampaignsTab';
import { useCampaignProgress } from './hooks/useCampaignProgress';
import { useMultiplayer } from './contexts/MultiplayerContext';
import { ChallengesTab } from './components/tabs/ChallengesTab';
import { submitChallengeLog } from './services/challenges';
import type { ChallengeData } from './services/challenges';

function App() {
  const { t, i18n } = useTranslation();
  
  const [playerCount, setPlayerCount] = useState(1);
  const [activeTab, setActiveTab] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [result, setResult] = useState<SetupResult | null>(null);
  const [popupMsg, setPopupMsg] = useState<string | null>(null);
  const [confirmPopup, setConfirmPopup] = useState<{ message: string, onConfirm: () => void } | null>(null);
  
  const [activeCampaignMission, setActiveCampaignMission] = useState<{campaignId: string, missionId: string} | null>(null);
  const [activeChallenge, setActiveChallenge] = useState<ChallengeData | null>(null);

  const [ownedExpansions, setOwnedExpansions] = useSyncedCollection('lhq_ownedExpansions', ['core', 'core_2nd']);
  const { history, addMatch } = useGameHistory();
  const { savedSetups, addSetup, removeSetup } = useSavedSetups();
  const { currentUser, login, logoutUser } = useAuth();
  const { completeMission } = useCampaignProgress();

  const [showSettings, setShowSettings] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [sfxEnabled, setSfxEnabled] = useState(true);
  const [theme, setTheme] = useState('covert');
  const [avatarId] = useAvatar();
  
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

  useEffect(() => {
    if (activeTab !== 'randomizer' && activeTab !== 'tracker' && activeTab !== 'campaigns' && activeTab !== 'challenges') {
      setResult(null);
      setActiveCampaignMission(null);
      setActiveChallenge(null);
    }
  }, [activeTab]);

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

  const playSetupSfx = () => {
    if (!sfxEnabled) return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      // Um arpejo ascendente para simular um sorteio heroico
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(300, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.3);
      
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.3);
    } catch { /* erro ignorado se audio block */ }
  };

  // Tracker State from Multiplayer Context
  const { gameState, updateGameState, resetGameState } = useMultiplayer();

  const recruit = gameState.recruit;
  const setRecruit = (val: number) => updateGameState({ recruit: val });
  
  const attack = gameState.attack;
  const setAttack = (val: number) => updateGameState({ attack: val });
  
  const masterStrikes = gameState.masterStrikes;
  const setMasterStrikes = (val: number) => updateGameState({ masterStrikes: val });
  
  const schemeTwists = gameState.schemeTwists;
  const setSchemeTwists = (val: number) => updateGameState({ schemeTwists: val });
  
  const bystanders = gameState.bystanders;
  const setBystanders = (val: number) => updateGameState({ bystanders: val });

  const resetTracker = () => {
    setConfirmPopup({
      message: 'Deseja zerar os contadores e começar uma nova partida?',
      onConfirm: () => {
        resetGameState();
        setConfirmPopup(null);
      }
    });
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

    if (victory && activeCampaignMission) {
      await completeMission(activeCampaignMission.campaignId, activeCampaignMission.missionId);
      setActiveCampaignMission(null);
      setPopupMsg(`Missão concluída! Partida salva no histórico.`);
      setActiveTab('campaigns');
    } else {
      setActiveTab('history');
      setPopupMsg(`Partida salva no histórico com sucesso!`);
    }

    if (activeChallenge) {
      let xp = victory ? 30 : 10; 
      await submitChallengeLog(activeChallenge.id, currentUser, {
        mastermind: result.mastermind.name,
        scheme: result.scheme.name,
        victory,
        playerCount,
        xpGained: xp,
        score: 0
      });
      setActiveChallenge(null);
      setPopupMsg(`Desafio Global registrado! Você ganhou ${xp} XP.`);
    }
    
    // Zera contadores
    resetGameState();
    
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
      setActiveCampaignMission(null);
      
      // Dinamic Theme
      const classCount: Record<string, number> = {};
      setup.heroes.forEach(h => {
        h.classes.forEach(c => {
          const cls = c.toLowerCase();
          classCount[cls] = (classCount[cls] || 0) + 1;
        });
      });
      
      const topClass = Object.entries(classCount).sort((a,b) => b[1] - a[1])[0]?.[0];
      if (topClass && ['covert', 'instinct', 'ranged', 'strength', 'tech'].includes(topClass)) {
        changeTheme(topClass);
      }

      playSetupSfx();
    } catch (e: unknown) {
      setPopupMsg(e instanceof Error ? e.message : String(e));
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
        <header className="topbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 32px 0 32px' }}>
          <div className="mobile-logo-container" style={{ display: 'none', alignItems: 'center', gap: '10px' }}>
            <img src="/logo.jpg" alt="Legendary HQ Logo" style={{ width: '36px', height: '36px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(230, 36, 41, 0.4)' }} />
            <h2 style={{ fontSize: '1.2rem', margin: 0, fontWeight: 'bold', letterSpacing: '-0.5px' }}>LEGENDARY HQ</h2>
          </div>
          
          <div className="topbar-right-actions" style={{ display: 'flex', alignItems: 'center', gap: '24px', marginLeft: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
            <Globe size={18} />
            <select 
              value={i18n.language}
              onChange={(e) => {
                i18n.changeLanguage(e.target.value);
                localStorage.setItem('appLanguage', e.target.value);
              }}
              style={{ background: 'transparent', color: 'var(--text-secondary)', border: 'none', cursor: 'pointer', outline: 'none', fontSize: '0.9rem' }}
            >
              <option value="pt-BR">PT</option>
              <option value="en-US">EN</option>
            </select>
          </div>

          <button 
            onClick={() => setShowSettings(true)}
            style={{ background: 'transparent', color: 'var(--text-secondary)', border: 'none', padding: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            title={t('settings.title')}
          >
            <Settings size={22} />
          </button>

          {currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span className="hide-on-mobile" style={{ fontSize: '0.8rem', color: '#86efac' }} title="Nuvem Sincronizada">OK</span>
              <div 
                onClick={() => setShowAvatarPicker(true)} 
                style={{ cursor: 'pointer', borderRadius: '50%', overflow: 'hidden', width: 32, height: 32, border: '2px solid var(--primary-color)' }}
                title={currentUser.displayName || 'Mudar Avatar'}
              >
                <img 
                  src={(avatarId && getCardImage(avatarId, 'hero')) || currentUser.photoURL || ''} 
                  alt="User" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
              </div>
              <button onClick={logoutUser} className="btn btn-secondary hide-on-mobile" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>Sair</button>
            </div>
          ) : (
            <button onClick={login} className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
              Login
            </button>
            )}
          </div>
        </header>
        {/* Popups e Modais */}
        {popupMsg && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'fadeIn 0.2s ease-out' }}>
            <div className="glass-panel" style={{ width: '90%', maxWidth: '350px', padding: '30px', position: 'relative', textAlign: 'center' }}>
              <button onClick={() => setPopupMsg(null)} style={{ position: 'absolute', top: '15px', right: '15px', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
              <h3 style={{ color: 'white', margin: '0 0 16px 0', fontSize: '1.2rem' }}>Aviso</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: '1.5' }}>{popupMsg}</p>
              <button onClick={() => setPopupMsg(null)} className="btn btn-primary" style={{ width: '100%' }}>OK</button>
            </div>
          </div>
        )}

        {confirmPopup && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', animation: 'fadeIn 0.2s ease-out' }}>
            <div className="glass-panel" style={{ width: '100%', maxWidth: '400px', padding: '30px', position: 'relative' }}>
              <h3 style={{ color: 'white', margin: '0 0 16px 0', fontSize: '1.2rem' }}>Atenção</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '0.95rem', lineHeight: '1.5' }}>
                {confirmPopup.message}
              </p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button onClick={() => setConfirmPopup(null)} className="btn btn-secondary">Cancelar</button>
                <button onClick={confirmPopup.onConfirm} className="btn btn-primary" style={{ background: '#ef4444', borderColor: '#ef4444' }}>Confirmar</button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Configurações */}
        {showSettings && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="glass-panel" style={{ width: '90%', maxWidth: '400px', padding: '30px', position: 'relative' }}>
              <button onClick={() => setShowSettings(false)} style={{ position: 'absolute', top: '15px', right: '15px', background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}>
                <X size={24} />
              </button>
              
              <h2 style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}><Settings /> {t('settings.title')}</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '0.9rem' }}>{t('settings.subtitle')}</p>
              
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ color: 'var(--text-secondary)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}><Globe size={18} /> {t('settings.language')}</h4>
                <select 
                  value={i18n.language}
                  onChange={(e) => {
                    i18n.changeLanguage(e.target.value);
                    localStorage.setItem('appLanguage', e.target.value);
                  }}
                  className="glass-select" style={{ width: '100%', background: 'rgba(0,0,0,0.4)' }}
                >
                  <option value="pt-BR">Português (Brasil)</option>
                  <option value="en-US">English (US)</option>
                </select>
              </div>

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

        {showAvatarPicker && <AvatarPickerModal onClose={() => setShowAvatarPicker(false)} />}

        {/* Main Content Area */}
        <main className="main-content">
          {activeTab === 'home' && <HomeTab onNavigate={handleTabChange} />}
          {activeTab === 'stats' && (
            <StatsTab history={history} />
          )}
          {activeTab === 'history' && (
            <HistoryTab history={history} addMatch={addMatch} ownedExpansions={ownedExpansions} />
          )}
          {activeTab === 'campaigns' && (
            <CampaignsTab 
              ownedExpansions={ownedExpansions}
              onPlaySetup={(s, cId, mId) => {
                setResult(s);
                setActiveCampaignMission({ campaignId: cId, missionId: mId });
                handleTabChange('tracker');
              }}
              onRegisterMatch={async (s, v, sc, pCount, cId, mId) => {
                await addMatch({
                  mastermind: s.mastermind.name,
                  scheme: s.scheme.name,
                  victory: v,
                  playerCount: pCount || 2,
                  score: sc || 0
                });
                if (v) {
                  await completeMission(cId, mId);
                  setPopupMsg('Partida registrada com sucesso! Missão da campanha concluída.');
                } else {
                  setPopupMsg('Partida registrada no histórico.');
                }
              }}
            />
          )}
          {activeTab === 'savedSetups' && (
            <SavedSetupsTab 
              setups={savedSetups}
              removeSetup={removeSetup}
              onPlaySetup={(s: SetupResult) => {
                setResult(s);
                handleTabChange('tracker');
              }}
              onRegisterMatch={async (s: SetupResult, victory: boolean, score?: number, pCount?: number) => {
                await addMatch({
                  mastermind: s.mastermind.name,
                  scheme: s.scheme.name,
                  victory,
                  playerCount: pCount || 2,
                  score: score || 0
                });
                setPopupMsg('Partida registrada no histórico com sucesso!');
                handleTabChange('history');
              }}
            />
          )}
          {activeTab === 'challenges' && (
            <ChallengesTab 
              ownedExpansions={ownedExpansions}
              onPlayChallenge={async (challenge) => {
                try {
                  const { generateChallengeSetup } = await import('./utils/randomizer');
                  const setup = generateChallengeSetup(playerCount, ownedExpansions, challenge.seedData);
                  setResult(setup);
                  setActiveChallenge(challenge);
                  handleTabChange('randomizer');
                  playSetupSfx();
                } catch (err: any) {
                  setPopupMsg(err.message || 'Erro ao gerar desafio');
                }
              }}
            />
          )}
          {activeTab === 'randomizer' && (
            <RandomizerTab 
              playerCount={playerCount} setPlayerCount={setPlayerCount}
              result={result} setResult={setResult}
              activeChallenge={activeChallenge}
              handleDraw={handleDraw}
              handleFinishMatch={handleFinishMatch}
              handleSaveSetup={(name) => {
                if (result) {
                  addSetup(name, result);
                  setPopupMsg('Setup salvo com sucesso na sua conta!');
                }
              }}
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
            <CollectionTab ownedExpansions={ownedExpansions} toggleExpansion={toggleExpansion} setOwnedExpansions={setOwnedExpansions} />
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
      <ReloadPrompt />
    </div>
  );
}

export default App;
