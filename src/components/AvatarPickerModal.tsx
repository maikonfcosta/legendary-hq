import React, { useState, useMemo } from 'react';
import { X, Search } from 'lucide-react';
import cardsDB from '../data/cards.json';
import { getCardImage } from '../utils/imageLookup';
import { useAvatar } from '../hooks/useAvatar';

interface AvatarPickerModalProps {
  onClose: () => void;
}

export function AvatarPickerModal({ onClose }: AvatarPickerModalProps) {
  const [avatarId, setAvatarId] = useAvatar();
  const [searchTerm, setSearchTerm] = useState('');

  const allHeroes = useMemo(() => {
    // Unique heroes by name
    const heroesList = cardsDB.heroes || [];
    const unique = new Map();
    for (const h of heroesList) {
      if (!unique.has(h.name)) {
        unique.set(h.name, h);
      }
    }
    return Array.from(unique.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  const filteredHeroes = useMemo(() => {
    return allHeroes.filter(h => h.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [allHeroes, searchTerm]);

  const handleSelect = (hero: any) => {
    setAvatarId(hero.name); // we store the name as ID to lookup image later
    onClose();
  };

  const handleRemove = () => {
    setAvatarId(null);
    onClose();
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '600px', maxHeight: '80vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
        
        <div style={{ padding: '20px', borderBottom: '1px solid var(--surface-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, fontSize: '1.4rem' }}>Escolha seu Avatar</h2>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>

        <div style={{ padding: '20px', display: 'flex', gap: '10px' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input 
              type="text" 
              placeholder="Buscar herói..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '10px 10px 10px 38px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--surface-border)', color: 'white', fontSize: '1rem' }}
            />
          </div>
          {avatarId && (
             <button onClick={handleRemove} className="btn btn-secondary" style={{ padding: '0 16px' }}>Remover</button>
          )}
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 20px 20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '15px' }}>
          {filteredHeroes.map(hero => {
            const imgUrl = getCardImage(hero.name, 'hero', hero.expansion);
            return (
              <div 
                key={hero.name}
                onClick={() => handleSelect(hero)}
                style={{ 
                  cursor: 'pointer', 
                  borderRadius: '8px', 
                  overflow: 'hidden',
                  border: avatarId === hero.name ? '3px solid var(--primary-color)' : '2px solid transparent',
                  opacity: imgUrl ? 1 : 0.5,
                  transition: 'all 0.2s',
                  display: 'flex',
                  flexDirection: 'column',
                  background: 'rgba(255,255,255,0.05)'
                }}
              >
                <div style={{ height: '140px', background: imgUrl ? `url(${imgUrl}) center/cover` : '#333' }}>
                  {!imgUrl && <span style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', color: '#888', textAlign: 'center', padding: '4px' }}>Sem Imagem</span>}
                </div>
                <div style={{ padding: '8px', textAlign: 'center', fontSize: '0.8rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {hero.name}
                </div>
              </div>
            );
          })}
          {filteredHeroes.length === 0 && (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
              Nenhum herói encontrado.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
