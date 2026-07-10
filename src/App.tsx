import { useState } from 'react'
import { Swords, TrendingUp, TrendingDown, Award, BarChart2, ShieldAlert, Star, Skull, AlertTriangle, Users, RotateCcw, Home, Dices, Archive, Menu, X, BookOpen } from 'lucide-react'
import { generateSetup } from './utils/randomizer'
import type { SetupResult } from './utils/randomizer'
import { getCardImage } from './utils/imageLookup'
import { Rules } from './components/Rules'
import cardsData from './data/cards.json'
import imageDB from './data/imageDB.json'

function App() {
  const [playerCount, setPlayerCount] = useState(2)
  const [activeTab, setActiveTab] = useState('home')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [result, setResult] = useState<SetupResult | null>(null)
  const [ownedExpansions, setOwnedExpansions] = useState<string[]>(['core', 'core_2nd'])

  // Tracker State
  const [recruit, setRecruit] = useState(0)
  const [attack, setAttack] = useState(0)
  const [masterStrikes, setMasterStrikes] = useState(0)
  const [schemeTwists, setSchemeTwists] = useState(0)
  const [bystanders, setBystanders] = useState(0)

  const resetTracker = () => {
    if (confirm('Deseja zerar os contadores e começar uma nova partida?')) {
      setRecruit(0)
      setAttack(0)
      setMasterStrikes(0)
      setSchemeTwists(0)
      setBystanders(0)
    }
  }

  const toggleExpansion = (id: string) => {
    setOwnedExpansions(prev => 
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
    )
  }

  const handleDraw = () => {
    try {
      const setup = generateSetup(playerCount, ownedExpansions)
      setResult(setup)
    } catch (e: any) {
      alert(e.message);
    }
  }

  const renderCard = (type: 'mastermind' | 'scheme' | 'villain' | 'henchmen' | 'hero' | 'bystander', title: string, name: string, subtitle?: string, highlight: boolean = false, expansion?: string) => {
    let imgSrc;
    if (type === 'bystander') {
      imgSrc = (imageDB as any)["Core Bystander.jpg"];
    } else {
      imgSrc = getCardImage(name, type, expansion);
    }
    
    return (
      <div className={`card ${highlight ? 'card-highlight' : ''}`}>
        {imgSrc && (
          <div className="card-image-container">
            <img src={imgSrc} alt={name} className="card-image-render" />
          </div>
        )}
        <div className="card-label">{title}</div>
        <div className="card-name">{name}</div>
        {subtitle && <div className="card-sub">{subtitle}</div>}
      </div>
    );
  }

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    setIsMobileMenuOpen(false) // Close menu on mobile when a link is clicked
  }

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
      <aside className={`sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <img src="/logo.jpg" alt="Legendary HQ Logo" className="logo-img" />
          <h2>Legendary HQ</h2>
        </div>
        
        <nav className="sidebar-nav">
          <button 
            className={`nav-link ${activeTab === 'home' ? 'active' : ''}`}
            onClick={() => handleTabChange('home')}
          >
            <Home size={20} />
            Início
          </button>
          <button 
            className={`nav-link ${activeTab === 'randomizer' ? 'active' : ''}`}
            onClick={() => handleTabChange('randomizer')}
          >
            <Dices size={20} />
            Setup Randomizer
          </button>
          <button 
            className={`nav-link ${activeTab === 'tracker' ? 'active' : ''}`}
            onClick={() => handleTabChange('tracker')}
          >
            <Swords size={20} />
            Game Tracker
          </button>
          <button 
            className={`nav-link ${activeTab === 'stats' ? 'active' : ''}`}
            onClick={() => handleTabChange('stats')}
          >
            <BarChart2 size={20} />
            Estatísticas
          </button>
          <button 
            className={`nav-link ${activeTab === 'collection' ? 'active' : ''}`}
            onClick={() => handleTabChange('collection')}
          >
            <Archive size={20} />
            Minha Coleção
          </button>
          <button 
            className={`nav-link ${activeTab === 'rules' ? 'active' : ''}`}
            onClick={() => handleTabChange('rules')}
          >
            <BookOpen size={20} />
            Regras
          </button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        {activeTab === 'home' && (
          <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', textAlign: 'center' }}>
            <div style={{ marginBottom: '3rem' }}>
              <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', margin: '0 0 1rem 0', background: 'linear-gradient(135deg, #e62429, #2b82d9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', textTransform: 'uppercase', letterSpacing: '2px' }}>
                Marvel Legendary
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
                Seu quartel general definitivo para o deck-building game da Marvel.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', width: '100%', maxWidth: '900px' }}>
              <button className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px', border: '1px solid var(--surface-border)', borderTop: '4px solid var(--primary-color)', cursor: 'pointer', transition: 'all 0.2s', background: 'rgba(255,255,255,0.02)' }} onClick={() => handleTabChange('randomizer')}>
                <Dices size={48} color="var(--primary-color)" />
                <h3 style={{ margin: 0, fontSize: '1.5rem', color: 'white' }}>Sortear Partida</h3>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Gere setups aleatórios com suas expansões</span>
              </button>

              <button className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px', border: '1px solid var(--surface-border)', borderTop: '4px solid #10b981', cursor: 'pointer', transition: 'all 0.2s', background: 'rgba(255,255,255,0.02)' }} onClick={() => handleTabChange('tracker')}>
                <Swords size={48} color="#10b981" />
                <h3 style={{ margin: 0, fontSize: '1.5rem', color: 'white' }}>Game Tracker</h3>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Controle os pontos e vilões em tempo real</span>
              </button>

              <button className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px', border: '1px solid var(--surface-border)', borderTop: '4px solid #fbc02d', cursor: 'pointer', transition: 'all 0.2s', background: 'rgba(255,255,255,0.02)' }} onClick={() => handleTabChange('collection')}>
                <Archive size={48} color="#fbc02d" />
                <h3 style={{ margin: 0, fontSize: '1.5rem', color: 'white' }}>Minha Coleção</h3>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Gerencie quais caixas você possui</span>
              </button>

              <button className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px', border: '1px solid var(--surface-border)', borderTop: '4px solid #94a3b8', cursor: 'pointer', transition: 'all 0.2s', background: 'rgba(255,255,255,0.02)' }} onClick={() => handleTabChange('rules')}>
                <BookOpen size={48} color="#94a3b8" />
                <h3 style={{ margin: 0, fontSize: '1.5rem', color: 'white' }}>Regras & PDFs</h3>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Consulte regras e manuais originais</span>
              </button>
            </div>
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="fade-in">
            <div className="result-header">
              <div>
                <h2>Estatísticas</h2>
                <p style={{ color: 'var(--text-secondary)' }}>Analise seu desempenho e histórico de combate.</p>
              </div>
            </div>

            {/* Empty State when no games exist */}
            <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem 2rem', marginBottom: '2rem' }}>
              <BarChart2 size={64} style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', opacity: 0.5 }} />
              <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'white' }}>Sem Estatísticas Ainda</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 2rem auto', lineHeight: 1.6 }}>
                Jogue algumas partidas e registre-as no Tracker para ver seu desempenho épico aqui!
              </p>
              <button className="btn btn-primary btn-large" onClick={() => handleTabChange('randomizer')}>
                Gerar Primeira Partida
              </button>
            </div>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginBottom: '32px' }}>
              <div className="glass-panel" style={{ padding: '24px', textAlign: 'center', borderTop: '4px solid #2b82d9' }}>
                <Swords size={32} color="#2b82d9" style={{ margin: '0 auto 12px' }} />
                <p style={{ color: 'var(--text-secondary)', textTransform: 'uppercase', fontSize: '0.85rem', fontWeight: 'bold' }}>Partidas Jogadas</p>
                <h3 style={{ fontSize: '2.5rem', margin: '8px 0 0' }}>0</h3>
              </div>
              
              <div className="glass-panel" style={{ padding: '24px', textAlign: 'center', borderTop: '4px solid #10b981' }}>
                <TrendingUp size={32} color="#10b981" style={{ margin: '0 auto 12px' }} />
                <p style={{ color: 'var(--text-secondary)', textTransform: 'uppercase', fontSize: '0.85rem', fontWeight: 'bold' }}>Vitórias</p>
                <h3 style={{ fontSize: '2.5rem', margin: '8px 0 0', color: '#10b981' }}>0</h3>
              </div>

              <div className="glass-panel" style={{ padding: '24px', textAlign: 'center', borderTop: '4px solid #ef4444' }}>
                <TrendingDown size={32} color="#ef4444" style={{ margin: '0 auto 12px' }} />
                <p style={{ color: 'var(--text-secondary)', textTransform: 'uppercase', fontSize: '0.85rem', fontWeight: 'bold' }}>Derrotas</p>
                <h3 style={{ fontSize: '2.5rem', margin: '8px 0 0', color: '#ef4444' }}>0</h3>
              </div>

              <div className="glass-panel" style={{ padding: '24px', textAlign: 'center', borderTop: '4px solid var(--accent-color)' }}>
                <Award size={32} color="var(--accent-color)" style={{ margin: '0 auto 12px' }} />
                <p style={{ color: 'var(--text-secondary)', textTransform: 'uppercase', fontSize: '0.85rem', fontWeight: 'bold' }}>Win Rate</p>
                <h3 style={{ fontSize: '2.5rem', margin: '8px 0 0' }}>0%</h3>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
              <div className="glass-panel" style={{ padding: '24px' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
                  <ShieldAlert size={20} color="var(--accent-color)" /> Vilão Mais Letal
                </h3>
                <p style={{ color: 'var(--text-secondary)' }}>Nenhum dado registrado.</p>
              </div>
              
              <div className="glass-panel" style={{ padding: '24px' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
                  <Award size={20} color="#eab308" /> Herói Mais Jogado
                </h3>
                <p style={{ color: 'var(--text-secondary)' }}>Nenhum dado registrado.</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'randomizer' && (
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
                  {renderCard('mastermind', 'Mastermind', result.mastermind.name, `Lidera: ${result.mastermind.alwaysLeads}`, true, result.mastermind.expansion)}
                  {renderCard('scheme', 'Scheme', result.scheme.name, '', true, result.scheme.expansion)}
                </div>
                
                <div className="section-title">Villain Deck</div>
                <div className="card-grid">
                  {result.villains.map(v => renderCard('villain', 'Villains', v.name, v.expansion, false, v.expansion))}
                  {result.henchmen.map(h => renderCard('henchmen', 'Henchmen', h.name, h.expansion, false, h.expansion))}
                  {renderCard('bystander', 'Bystanders', `${result.bystanders} Cartas de Bystanders`)}
                </div>

                <div className="section-title">Hero Deck</div>
                <div className="card-grid">
                  {result.heroes.map(h => renderCard('hero', 'Hero', h.name, `${h.team.replace('_', ' ')}`, false, h.expansion))}
                </div>
              </section>
            )}
          </div>
        )}
        
        {activeTab === 'tracker' && (
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

            {/* Turn Resources */}
            <div className="section-title" style={{ marginTop: '2rem' }}>Recursos do Turno (Zere ao final do turno)</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '40px' }}>
              
              {/* Recruit */}
              <div className="glass-panel" style={{ padding: '32px', textAlign: 'center', borderTop: '4px solid #eab308' }}>
                <Star size={40} color="#eab308" style={{ margin: '0 auto 16px' }} />
                <h3 style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '16px' }}>Recruit Points</h3>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px' }}>
                  <button className="btn" style={{ fontSize: '2rem', width: '60px', height: '60px', borderRadius: '50%', padding: 0 }} onClick={() => setRecruit(Math.max(0, recruit - 1))}>-</button>
                  <span style={{ fontSize: '4rem', fontWeight: 900, minWidth: '80px', textShadow: '0 0 20px rgba(234, 179, 8, 0.4)' }}>{recruit}</span>
                  <button className="btn" style={{ fontSize: '2rem', width: '60px', height: '60px', borderRadius: '50%', padding: 0, background: '#eab308' }} onClick={() => setRecruit(recruit + 1)}>+</button>
                </div>
              </div>

              {/* Attack */}
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

            {/* Game Progression */}
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
        )}
        
        {activeTab === 'collection' && (
          <section className="fade-in">
            <div className="result-header">
              <h2>Minha Coleção</h2>
            </div>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
              Clique nas expansões que você possui para habilitá-las no Randomizer.
            </p>
            
            <div className="collection-grid">
              {cardsData.expansions.map(exp => {
                const imgKey = (exp as any).image;
                const imgSrc = imgKey ? (imageDB as any)[imgKey] : '/logo.jpg';
                const isOwned = ownedExpansions.includes(exp.id);
                return (
                  <div 
                    key={exp.id} 
                    className={`collection-card ${isOwned ? 'owned' : 'unowned'}`}
                    onClick={() => toggleExpansion(exp.id)}
                  >
                    <div className="collection-img-wrapper">
                      <img src={imgSrc} alt={exp.name} className="collection-img" />
                    </div>
                    <div className="collection-name">
                      {exp.name}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {activeTab === 'rules' && (
          <Rules ownedExpansions={ownedExpansions} />
        )}
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
  )
}

export default App
