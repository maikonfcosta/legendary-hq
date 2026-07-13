import cardsData from '../../data/cards.json';
import imageDB from '../../data/imageDB.json';

const imageDBTyped = imageDB as Record<string, string>;

interface CollectionTabProps {
  ownedExpansions: string[];
  toggleExpansion: (id: string) => void;
}

export function CollectionTab({ ownedExpansions, toggleExpansion }: CollectionTabProps) {
  return (
    <section className="fade-in">
      <div className="result-header">
        <h2>Minha Coleção</h2>
      </div>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
        Clique nas expansões que você possui para habilitá-las no Randomizer.
      </p>
      
      <div className="collection-grid">
        {cardsData.expansions.map(exp => {
          const imgKey = 'image' in exp ? (exp as { image: string }).image : undefined;
          const imgSrc = imgKey && imgKey in imageDBTyped ? imageDBTyped[imgKey] : '/logo.jpg';
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
  );
}
