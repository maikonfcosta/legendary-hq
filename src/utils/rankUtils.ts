import type { GameMatch } from '../types/history';

export const RANKS = [
  { name: 'Novato', minXp: 0, color: '#94a3b8' },
  { name: 'Agente da S.H.I.E.L.D.', minXp: 50, color: '#3b82f6' },
  { name: 'Herói Urbano', minXp: 150, color: '#10b981' },
  { name: 'Vingador', minXp: 400, color: '#f59e0b' },
  { name: 'Lenda Viva', minXp: 1000, color: '#ef4444' },
  { name: 'Entidade Cósmica', minXp: 2500, color: '#8b5cf6' }
];

export function calculateMatchXp(victory: boolean, playerCount: number): number {
  // Base XP: Vencer = 10, Perder = 2
  let xp = victory ? 10 : 2;
  
  // Bônus por dificuldade/jogadores:
  // Legendary é notório por ser mais difícil com mais jogadores (devido ao deck do vilão esgotar mais rápido e turnos mais esparsos).
  if (playerCount > 1 && victory) {
    xp += (playerCount - 1) * 3;
  }
  
  return xp;
}

export function getTotalXp(history: GameMatch[]): number {
  return history.reduce((acc, match) => acc + (match.xp || 0), 0);
}

export function getRankFromXp(xp: number) {
  let currentRank = RANKS[0]!;
  let nextRank = RANKS[1] || null;

  for (let i = 0; i < RANKS.length; i++) {
    if (xp >= RANKS[i]!.minXp) {
      currentRank = RANKS[i]!;
      nextRank = RANKS[i + 1] || null;
    } else {
      break;
    }
  }

  const progress = nextRank 
    ? Math.min(100, Math.max(0, ((xp - currentRank.minXp) / (nextRank.minXp - currentRank.minXp)) * 100))
    : 100;

  return { currentRank, nextRank, progress };
}
