import { describe, it, expect } from 'vitest';
import { generateSetup } from './randomizer';

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
