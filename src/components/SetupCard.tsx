import { getCardImage } from '../utils/imageLookup';
import imageDB from '../data/imageDB.json';
import cardsDB from '../data/cards.json';

const imageDBTyped = imageDB as Record<string, string>;

interface SetupCardProps {
  type: 'mastermind' | 'scheme' | 'villain' | 'henchmen' | 'hero' | 'bystander';
  title: string;
  name: string;
  subtitle?: string;
  highlight?: boolean;
  expansion?: string;
}

export function SetupCard({ type, title, name, subtitle, highlight = false, expansion }: SetupCardProps) {
  let imgSrc;
  if (type === 'bystander') {
    imgSrc = imageDBTyped["Core Bystander.jpg"];
  } else {
    imgSrc = getCardImage(name, type, expansion);
  }
  
  const expansionObj = cardsDB.expansions.find((e: any) => e.id === expansion);
  const expansionName = expansionObj ? expansionObj.name : null;

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
      
      {expansionName && type !== 'bystander' && (
        <div style={{ marginTop: 'auto', paddingTop: '8px', textAlign: 'center' }}>
          <span style={{ 
            fontSize: '0.65rem', 
            background: 'rgba(255, 255, 255, 0.1)', 
            padding: '4px 8px', 
            borderRadius: '12px', 
            color: 'var(--text-secondary)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            {expansionName}
          </span>
        </div>
      )}
    </div>
  );
}
