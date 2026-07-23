import { useState } from 'react';
import { Home, Shuffle, Activity, BarChart2, Layers, BookOpen, ScrollText, Bookmark, Map, Trophy } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface SidebarProps {
  activeTab: string;
  handleTabChange: (tab: string) => void;
  isMobileMenuOpen: boolean;
}

export function Sidebar({ activeTab, handleTabChange, isMobileMenuOpen }: SidebarProps) {
  const { t } = useTranslation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside className={`sidebar ${isMobileMenuOpen ? 'open' : ''} ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-logo">
        <img 
          src="/logo.jpg" 
          alt="Legendary HQ Logo" 
          className="logo-img desktop-only-click" 
          onClick={() => setIsCollapsed(!isCollapsed)}
          style={{ cursor: 'pointer' }}
          title={isCollapsed ? "Expandir Menu" : "Recolher Menu"}
        />
        <h2>Legendary HQ</h2>
      </div>
      
      <nav className="sidebar-nav">
        <button className={`nav-link ${activeTab === 'home' ? 'active' : ''}`} onClick={() => handleTabChange('home')} title="Início">
          <Home size={20} /> <span>Início</span>
        </button>
        <button className={`nav-link ${activeTab === 'tracker' ? 'active' : ''}`} onClick={() => handleTabChange('tracker')} title={t('sidebar.tracker')}>
          <Activity size={20} /> <span>{t('sidebar.tracker')}</span>
        </button>
        <button className={`nav-link ${activeTab === 'randomizer' ? 'active' : ''}`} onClick={() => handleTabChange('randomizer')} title={t('sidebar.randomizer')}>
          <Shuffle size={20} /> <span>{t('sidebar.randomizer')}</span>
        </button>
        <button className={`nav-link ${activeTab === 'campaigns' ? 'active' : ''}`} onClick={() => handleTabChange('campaigns')} title={t('sidebar.campaigns')}>
          <Map size={20} /> <span>{t('sidebar.campaigns')}</span>
        </button>
        <button className={`nav-link ${activeTab === 'savedSetups' ? 'active' : ''}`} onClick={() => handleTabChange('savedSetups')} title={t('sidebar.savedSetups')}>
          <Bookmark size={20} /> <span>{t('sidebar.savedSetups')}</span>
        </button>
        <button className={`nav-link ${activeTab === 'challenges' ? 'active' : ''}`} onClick={() => handleTabChange('challenges')} title="Desafios">
          <Trophy size={20} /> <span>Desafios</span>
        </button>
        <button className={`nav-link ${activeTab === 'history' ? 'active' : ''}`} onClick={() => handleTabChange('history')} title={t('sidebar.history')}>
          <ScrollText size={20} /> <span>{t('sidebar.history')}</span>
        </button>
        <button className={`nav-link ${activeTab === 'stats' ? 'active' : ''}`} onClick={() => handleTabChange('stats')} title={t('sidebar.stats')}>
          <BarChart2 size={20} /> <span>{t('sidebar.stats')}</span>
        </button>
        <button className={`nav-link ${activeTab === 'collection' ? 'active' : ''}`} onClick={() => handleTabChange('collection')} title="Coleção">
          <Layers size={20} /> <span>Coleção</span>
        </button>
        <button className={`nav-link ${activeTab === 'rules' ? 'active' : ''}`} onClick={() => handleTabChange('rules')} title="Regras">
          <BookOpen size={20} /> <span>Regras</span>
        </button>
      </nav>
    </aside>
  );
}
