import { describe, it, expect } from 'vitest';
import { generateSetup, generateCampaignSetup, generateChallengeSetup } from './randomizer';

describe('randomizer', () => {
  describe('generateSetup', () => {
    it('should generate a setup for 2 players based on core set', () => {
      // core and core_2nd are enough to generate a setup
      const setup = generateSetup(2, ['core', 'core_2nd']);
      
      expect(setup.mastermind).toBeDefined();
      expect(setup.scheme).toBeDefined();
      expect(setup.villains.length).toBe(2);
      expect(setup.henchmen.length).toBe(1);
      expect(setup.heroes.length).toBe(5);
      expect(setup.bystanders).toBe(2);
    });

    it('should throw an error when not enough expansions are provided', () => {
      // an empty expansion list will cause failures
      expect(() => generateSetup(5, ['missing_expansion'])).toThrow(/Faltam Grupos|não tem expansões/);
    });
  });

  describe('generateCampaignSetup & generateChallengeSetup', () => {
    it('deve gerar setup com mastermind e scheme obrigatorios da missao', () => {
      // Arrange
      const missionSetup = {
        mastermind: 'Red Skull',
        scheme: 'The Legacy Virus',
        villains: ['Hydra'],
        henchmen: [],
        heroes: ['Captain America']
      };

      // Act
      const setup = generateCampaignSetup(2, ['core', 'core_2nd'], missionSetup);

      // Assert
      expect(setup.mastermind.name).toBe('Red Skull');
      expect(setup.scheme.name).toBe('The Legacy Virus');
      expect(setup.villains.some(v => v.name === 'Hydra')).toBe(true);
      expect(setup.heroes.some(h => h.name === 'Captain America')).toBe(true);
      expect(setup.heroes.length).toBe(5);
    });

    it('deve gerar setup de desafio global compativel', () => {
      // Arrange
      const challengeSeed = {
        mastermind: 'Dr. Doom',
        scheme: 'Midtown Bank Robbery',
        villains: ['Doombot Legion'],
        henchmen: [],
        heroes: ['Iron Man']
      };

      // Act
      const setup = generateChallengeSetup(1, ['core', 'core_2nd'], challengeSeed);

      // Assert
      expect(setup.mastermind.name).toBe('Dr. Doom');
      expect(setup.scheme.name).toBe('Midtown Bank Robbery');
      expect(setup.heroes.length).toBe(3); // 1 jogador = 3 heróis
    });
  });
});
