import { Home, Dices, Swords, BarChart2, Archive, BookOpen } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface SidebarProps {
  activeTab: string;
  handleTabChange: (tab: string) => void;
  isMobileMenuOpen: boolean;
}

export function Sidebar({ activeTab, handleTabChange, isMobileMenuOpen }: SidebarProps) {
  const { currentUser, login, logoutUser } = useAuth();

  return (
    <aside className={`sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
      <div className="sidebar-logo">
        <img src="/logo.jpg" alt="Legendary HQ Logo" className="logo-img" />
        <h2>Legendary HQ</h2>
      </div>
      
      <nav className="sidebar-nav">
        <button className={`nav-link ${activeTab === 'home' ? 'active' : ''}`} onClick={() => handleTabChange('home')}>
          <Home size={20} /> Início
        </button>
        <button className={`nav-link ${activeTab === 'randomizer' ? 'active' : ''}`} onClick={() => handleTabChange('randomizer')}>
          <Dices size={20} /> Setup Randomizer
        </button>
        <button className={`nav-link ${activeTab === 'tracker' ? 'active' : ''}`} onClick={() => handleTabChange('tracker')}>
          <Swords size={20} /> Game Tracker
        </button>
        <button className={`nav-link ${activeTab === 'stats' ? 'active' : ''}`} onClick={() => handleTabChange('stats')}>
          <BarChart2 size={20} /> Estatísticas
        </button>
        <button className={`nav-link ${activeTab === 'collection' ? 'active' : ''}`} onClick={() => handleTabChange('collection')}>
          <Archive size={20} /> Minha Coleção
        </button>
        <button className={`nav-link ${activeTab === 'rules' ? 'active' : ''}`} onClick={() => handleTabChange('rules')}>
          <BookOpen size={20} /> Regras
        </button>

        <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          {currentUser ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '0 10px' }}>
                {currentUser.photoURL && <img src={currentUser.photoURL} alt="Avatar" style={{ width: 36, height: 36, borderRadius: '50%' }} />}
                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {currentUser.displayName}
                </span>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#10b981', padding: '0 10px' }}>
                ✓ Nuvem Sincronizada
              </div>
              <button className="nav-link" onClick={logoutUser} style={{ color: '#ef4444', marginTop: '4px' }}>
                Sair da Conta
              </button>
            </div>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>Faça login para salvar na nuvem</p>
              <button onClick={login} className="btn btn-primary" style={{ width: '100%', padding: '10px' }}>
                Login com Google
              </button>
            </div>
          )}
        </div>
      </nav>
    </aside>
  );
}
