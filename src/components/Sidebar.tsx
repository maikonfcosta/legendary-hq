import { Home, Dices, Swords, BarChart2, Archive, BookOpen, LogIn, LogOut } from 'lucide-react';
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '0 10px' }}>
                {currentUser.photoURL && <img src={currentUser.photoURL} alt="Avatar" style={{ width: 32, height: 32, borderRadius: '50%' }} />}
                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {currentUser.displayName}
                </span>
              </div>
              <button className="nav-link" onClick={logoutUser} style={{ color: '#ef4444' }}>
                <LogOut size={20} /> Sair
              </button>
            </div>
          ) : (
            <button className="nav-link" onClick={login} style={{ color: 'var(--primary-color)' }}>
              <LogIn size={20} /> Entrar com Google
            </button>
          )}
        </div>
      </nav>
    </aside>
  );
}
