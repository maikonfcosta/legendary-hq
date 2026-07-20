import { useEffect, useState } from 'react';
import { Trophy, Play, Loader2, Star, Skull, BookOpen, Users } from 'lucide-react';
import { getActiveChallenge, getChallengeLeaderboard } from '../../services/challenges';
import type { ChallengeData } from '../../services/challenges';
import cardsData from '../../data/cards.json';
import type { CardDatabase } from '../../types';

const dbCards = cardsData as CardDatabase;

interface Props {
  onPlayChallenge: (seedData: any) => void;
  ownedExpansions: string[];
}

export function ChallengesTab({ onPlayChallenge, ownedExpansions }: Props) {
  const [challenge, setChallenge] = useState<ChallengeData | null>(null);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const active = await getActiveChallenge();
      if (active) {
        setChallenge(active);
        const lb = await getChallengeLeaderboard(active.id);
        setLeaderboard(lb);
      }
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
        <Loader2 className="text-primary" size={48} style={{ animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="animate-fade-in" style={{ textAlign: 'center', padding: '40px' }}>
        <Trophy size={64} style={{ color: 'var(--text-muted)', margin: '0 auto 16px' }} />
        <h2 style={{ color: 'var(--text-primary)' }}>Nenhum Desafio Ativo</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Fique atento. Os mestres do crime estão planejando o próximo ataque.</p>
      </div>
    );
  }

  const { seedData } = challenge;

  // Validar Coleção do Usuário
  const missingExpansions = new Set<string>();

  const checkCard = (name: string, type: keyof CardDatabase) => {
    const arr = dbCards[type] as any[];
    const card = arr.find(c => c.name === name);
    if (card) {
      // Core ou Core_2nd são tratados como tendo o core base se 1 deles existir
      const isCoreRequired = card.expansion === 'core' || card.expansion === 'core_2nd';
      const hasCore = ownedExpansions.includes('core') || ownedExpansions.includes('core_2nd');
      
      if (isCoreRequired) {
        if (!hasCore) missingExpansions.add('Core Set');
      } else if (!ownedExpansions.includes(card.expansion)) {
        // Mapear ID para Nome bonito se precisar, ou usar o ID
        const niceName = card.expansion.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());
        missingExpansions.add(niceName);
      }
    }
  };

  checkCard(seedData.mastermind, 'masterminds');
  checkCard(seedData.scheme, 'schemes');
  seedData.villains.forEach(v => checkCard(v, 'villains'));
  seedData.henchmen.forEach(h => checkCard(h, 'henchmen'));
  seedData.heroes.forEach(h => checkCard(h, 'heroes'));

  const missingArray = Array.from(missingExpansions);
  const canPlay = missingArray.length === 0;

  return (
    <div className="animate-fade-in">
      <div className="page-header" style={{ marginBottom: '24px', textAlign: 'center' }}>
        <div>
          <h2 className="page-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', fontSize: '2rem' }}>
            <Trophy size={32} color="#fbc02d" /> Desafio da Semana
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Messa suas habilidades contra a comunidade global!</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) minmax(300px, 350px)', gap: '24px', alignItems: 'start' }}>
        
        {/* Banner do Desafio */}
        <div className="glass-panel" style={{ padding: '0', overflow: 'hidden', position: 'relative' }}>
          <div style={{ padding: '32px', position: 'relative', zIndex: 1, background: 'linear-gradient(135deg, rgba(230,36,41,0.1), rgba(0,0,0,0.8))' }}>
            <h3 style={{ fontSize: '2rem', color: 'white', marginBottom: '8px' }}>{challenge.title}</h3>
            <p style={{ color: '#e0e0e0', fontSize: '1.1rem', marginBottom: '24px', lineHeight: '1.5' }}>{challenge.description}</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '24px' }}>
              <div style={{ background: 'rgba(230,36,41,0.1)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(230,36,41,0.3)' }}>
                <strong style={{ display: 'block', color: '#ff8a8a', fontSize: '0.8rem', textTransform: 'uppercase' }}>Mastermind & Scheme</strong>
                <span style={{ fontSize: '1rem', color: 'white', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}><Skull size={16} /> {seedData.mastermind}</span>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}><BookOpen size={16} /> {seedData.scheme}</span>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <strong style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Heróis Obrigatórios</strong>
                {seedData.heroes.map((hero: string, i: number) => (
                  <span key={i} style={{ fontSize: '0.9rem', color: 'white', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}><Users size={14} /> {hero}</span>
                ))}
              </div>
            </div>

            <button 
              onClick={() => canPlay && onPlayChallenge(challenge)}
              className={`btn ${canPlay ? 'btn-primary' : 'btn-secondary'}`} 
              disabled={!canPlay}
              style={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '8px', padding: '16px', fontSize: '1.2rem', boxShadow: canPlay ? '0 8px 25px rgba(230,36,41,0.5)' : 'none', opacity: canPlay ? 1 : 0.6 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Play size={24} /> {canPlay ? 'Aceitar Desafio' : 'Coleção Incompleta'}
              </div>
              {!canPlay && (
                <span style={{ fontSize: '0.85rem', color: '#ff8a8a', fontWeight: 'normal' }}>
                  Falta: {missingArray.join(', ')}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ color: 'white', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Star size={20} color="#fbc02d" /> Ranking Global
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {leaderboard.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '24px 0' }}>Seja o primeiro a vencer este desafio!</p>
            ) : (
              leaderboard.sort((a,b) => b.xpGained - a.xpGained).map((entry: any, idx: number) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '12px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: idx === 0 ? '#fbc02d' : idx === 1 ? '#e0e0e0' : idx === 2 ? '#cd7f32' : 'rgba(255,255,255,0.1)', color: idx < 3 ? 'black' : 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', fontSize: '0.9rem' }}>
                    {idx + 1}
                  </div>
                  {entry.photoURL ? (
                    <img src={entry.photoURL} alt="avatar" style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
                  ) : (
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary-color)', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold' }}>
                      {entry.userName.charAt(0)}
                    </div>
                  )}
                  <div style={{ flex: 1 }}>
                    <strong style={{ display: 'block', color: 'white', fontSize: '0.95rem' }}>{entry.userName}</strong>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{entry.victory ? 'Vitória' : 'Derrota'} ({entry.score} pts)</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <strong style={{ display: 'block', color: '#4ade80', fontSize: '1.1rem' }}>{entry.xpGained} XP</strong>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
