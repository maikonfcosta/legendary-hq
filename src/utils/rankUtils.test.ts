import { describe, it, expect } from 'vitest';
import { calculateMatchXp, getTotalXp, getRankFromXp } from './rankUtils';
import type { GameMatch } from '../types/history';

describe('rankUtils', () => {
  describe('calculateMatchXp', () => {
    it('deve retornar 10 XP para vitoria em modo solo (1 jogador)', () => {
      // Arrange
      const victory = true;
      const playerCount = 1;

      // Act
      const xp = calculateMatchXp(victory, playerCount);

      // Assert
      expect(xp).toBe(10);
    });

    it('deve retornar 2 XP para derrota independente do numero de jogadores', () => {
      // Arrange & Act & Assert
      expect(calculateMatchXp(false, 1)).toBe(2);
      expect(calculateMatchXp(false, 4)).toBe(2);
    });

    it('deve adicionar bonus por jogador adicional em caso de vitoria', () => {
      // Arrange: 4 jogadores -> 10 + (4 - 1) * 3 = 19
      const victory = true;
      const playerCount = 4;

      // Act
      const xp = calculateMatchXp(victory, playerCount);

      // Assert
      expect(xp).toBe(19);
    });
  });

  describe('getTotalXp', () => {
    it('deve retornar 0 para historico vazio', () => {
      // Arrange
      const history: GameMatch[] = [];

      // Act
      const total = getTotalXp(history);

      // Assert
      expect(total).toBe(0);
    });

    it('deve somar o XP de todas as partidas registradas', () => {
      // Arrange
      const history: GameMatch[] = [
        { id: '1', date: '2026-01-01', mastermind: 'Red Skull', scheme: 'Scheme 1', victory: true, playerCount: 2, xp: 13 },
        { id: '2', date: '2026-01-02', mastermind: 'Magneto', scheme: 'Scheme 2', victory: false, playerCount: 2, xp: 2 },
        { id: '3', date: '2026-01-03', mastermind: 'Dr. Doom', scheme: 'Scheme 3', victory: true, playerCount: 1, xp: 10 }
      ];

      // Act
      const total = getTotalXp(history);

      // Assert
      expect(total).toBe(25);
    });
  });

  describe('getRankFromXp', () => {
    it('deve iniciar com Novato para 0 XP', () => {
      // Act
      const { currentRank, nextRank, progress } = getRankFromXp(0);

      // Assert
      expect(currentRank.name).toBe('Novato');
      expect(nextRank?.name).toBe('Agente da S.H.I.E.L.D.');
      expect(progress).toBe(0);
    });

    it('deve calcular patente intermediaria e progresso percentual correto', () => {
      // Arrange: Novato vai de 0 a 50. Com 25 XP deve estar em 50%
      // Act
      const { currentRank, nextRank, progress } = getRankFromXp(25);

      // Assert
      expect(currentRank.name).toBe('Novato');
      expect(nextRank?.name).toBe('Agente da S.H.I.E.L.D.');
      expect(progress).toBe(50);
    });

    it('deve alcancar patente maxima (Entidade Cosmica) e progresso 100%', () => {
      // Act
      const { currentRank, nextRank, progress } = getRankFromXp(3000);

      // Assert
      expect(currentRank.name).toBe('Entidade Cósmica');
      expect(nextRank).toBeNull();
      expect(progress).toBe(100);
    });
  });
});
