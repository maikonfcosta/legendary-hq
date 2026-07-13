import { Shuffle, Activity, Layers, BookOpen, BarChart2 } from 'lucide-react';

interface HomeTabProps {
  onNavigate: (tab: string) => void;
}

export function HomeTab({ onNavigate }: HomeTabProps) {
  return (
    <div className="home-hero fade-in">
      <div className="home-hero-content">
        <img 
          src="/logo.jpg" 
          alt="Legendary HQ Logo" 
          style={{ width: '140px', height: '140px', borderRadius: '28px', boxShadow: '0 10px 40px rgba(230, 36, 41, 0.4)', marginBottom: '40px', objectFit: 'cover' }} 
        />
        <h1 className="home-title-hero">
          Legendary HQ
        </h1>
        <p className="home-desc">
          Seu quartel general definitivo para o deck-building game da Marvel.
        </p>
      </div>

      <div className="home-grid">
        <button className="glass-panel home-card" onClick={() => onNavigate('collection')} style={{ borderTop: '4px solid var(--primary-color)' }}>
          <Layers size={40} color="var(--primary-color)" className="card-icon" />
          <h3 className="home-card-title">Minha Coleção</h3>
          <p className="home-card-text">Marque as caixas e expansões que você possui na sua coleção física.</p>
        </button>

        <button className="glass-panel home-card" onClick={() => onNavigate('tracker')} style={{ borderTop: '4px solid #fbc02d' }}>
          <Activity size={40} color="#fbc02d" className="card-icon" />
          <h3 className="home-card-title">Tracker</h3>
          <p className="home-card-text">Controle pontos de recrutamento, ataque e master strikes.</p>
        </button>

        <button className="glass-panel home-card" onClick={() => onNavigate('randomizer')} style={{ borderTop: '4px solid var(--secondary-color)' }}>
          <Shuffle size={40} color="var(--secondary-color)" className="card-icon" />
          <h3 className="home-card-title">Sorteio</h3>
          <p className="home-card-text">Gere setups aleatórios perfeitamente balanceados com o motor matemático.</p>
        </button>

        <button className="glass-panel home-card" onClick={() => onNavigate('stats')} style={{ borderTop: '4px solid var(--primary-color)' }}>
          <BarChart2 size={40} color="var(--primary-color)" className="card-icon" />
          <h3 className="home-card-title">Estatísticas</h3>
          <p className="home-card-text">Acompanhe seu desempenho de histórico de vitórias.</p>
        </button>

        <button className="glass-panel home-card" onClick={() => onNavigate('rules')} style={{ borderTop: '4px solid #10b981' }}>
          <BookOpen size={40} color="#10b981" className="card-icon" />
          <h3 className="home-card-title">Regras</h3>
          <p className="home-card-text">Consulte regras e palavras-chave de todas as expansões da editora.</p>
        </button>
      </div>
    </div>
  );
}
