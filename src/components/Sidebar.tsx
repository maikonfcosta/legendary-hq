import { Home, Shuffle, Activity, BarChart2, Layers, BookOpen, ScrollText, Bookmark, Map, Trophy } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface SidebarProps {
  activeTab: string;
  handleTabChange: (tab: string) => void;
  isMobileMenuOpen: boolean;
}

export function Sidebar({ activeTab, handleTabChange, isMobileMenuOpen }: SidebarProps) {
  const { t } = useTranslation();

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
        <button className={`nav-link ${activeTab === 'tracker' ? 'active' : ''}`} onClick={() => handleTabChange('tracker')}>
          <Activity size={20} /> {t('sidebar.tracker')}
        </button>
        <button className={`nav-link ${activeTab === 'randomizer' ? 'active' : ''}`} onClick={() => handleTabChange('randomizer')}>
          <Shuffle size={20} /> {t('sidebar.randomizer')}
        </button>
        <button className={`nav-link ${activeTab === 'campaigns' ? 'active' : ''}`} onClick={() => handleTabChange('campaigns')}>
          <Map size={20} /> {t('sidebar.campaigns')}
        </button>
        <button className={`nav-link ${activeTab === 'savedSetups' ? 'active' : ''}`} onClick={() => handleTabChange('savedSetups')}>
          <Bookmark size={20} /> {t('sidebar.savedSetups')}
        </button>
        <button className={`nav-link ${activeTab === 'challenges' ? 'active' : ''}`} onClick={() => handleTabChange('challenges')}>
          <Trophy size={20} /> Desafios
        </button>
        <button className={`nav-link ${activeTab === 'history' ? 'active' : ''}`} onClick={() => handleTabChange('history')}>
          <ScrollText size={20} /> {t('sidebar.history')}
        </button>
        <button className={`nav-link ${activeTab === 'stats' ? 'active' : ''}`} onClick={() => handleTabChange('stats')}>
          <BarChart2 size={20} /> {t('sidebar.stats')}
        </button>
        <button className={`nav-link ${activeTab === 'collection' ? 'active' : ''}`} onClick={() => handleTabChange('collection')}>
          <Layers size={20} /> Coleção
        </button>
        <button className={`nav-link ${activeTab === 'rules' ? 'active' : ''}`} onClick={() => handleTabChange('rules')}>
          <BookOpen size={20} /> Regras
        </button>
      </nav>
    </aside>
  );
}
