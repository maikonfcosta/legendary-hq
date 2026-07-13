import { getCardImage } from '../utils/imageLookup';
import imageDB from '../data/imageDB.json';

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
