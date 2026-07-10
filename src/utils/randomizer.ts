import type { CardDatabase, Hero, Mastermind, Scheme, VillainGroup, HenchmenGroup } from '../types';
import cardsData from '../data/cards.json';

const db = cardsData as CardDatabase;

export interface SetupResult {
  mastermind: Mastermind;
  scheme: Scheme;
  villains: VillainGroup[];
  henchmen: HenchmenGroup[];
  heroes: Hero[];
  bystanders: number;
}

const getRandomItem = <T,>(array: T[]): T => array[Math.floor(Math.random() * array.length)];
const getRandomItems = <T,>(array: T[], count: number, exclude: T[] = []): T[] => {
  const filtered = array.filter(item => !exclude.includes(item));
  const shuffled = [...filtered].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export const generateSetup = (playerCount: number, ownedExpansions: string[]): SetupResult => {
  // Configs by player count
  const configs = {
    1: { villains: 1, henchmen: 1, heroes: 3, bystanders: 1 },
    2: { villains: 2, henchmen: 1, heroes: 5, bystanders: 2 },
    3: { villains: 3, henchmen: 1, heroes: 5, bystanders: 8 },
    4: { villains: 3, henchmen: 2, heroes: 5, bystanders: 8 },
    5: { villains: 4, henchmen: 2, heroes: 6, bystanders: 12 }
  };
  const config = configs[playerCount as keyof typeof configs];

  // Filter DB based on owned expansions
  const filterByExpansion = <T extends { expansion: string }>(items: T[]) => 
    items.filter(item => ownedExpansions.includes(item.expansion) || (item.expansion === 'core' && ownedExpansions.includes('core_2nd')));

  const availableMasterminds = filterByExpansion(db.masterminds);
  const availableSchemes = filterByExpansion(db.schemes);
  const availableVillains = filterByExpansion(db.villains);
  const availableHenchmen = filterByExpansion(db.henchmen);
  const availableHeroes = filterByExpansion(db.heroes);

  if (availableMasterminds.length === 0 || availableSchemes.length === 0 || availableHeroes.length < config.heroes) {
    throw new Error(`Você não tem expansões suficientes selecionadas para sortear. Precisamos de pelo menos ${config.heroes} heróis diferentes e você tem ${availableHeroes.length}.`);
  }

  // 1. Draw Mastermind
  const mastermind = getRandomItem(availableMasterminds);
  
  // 2. Draw Scheme
  const scheme = getRandomItem(availableSchemes);

  // 3. Handle 'Always Leads'
  let requiredVillains: VillainGroup[] = [];
  let requiredHenchmen: HenchmenGroup[] = [];
  
  if (mastermind.alwaysLeads) {
    const isVillain = availableVillains.find(v => v.id === mastermind.alwaysLeads);
    const isHenchmen = availableHenchmen.find(h => h.id === mastermind.alwaysLeads);
    
    if (isVillain) requiredVillains.push(isVillain);
    if (isHenchmen) requiredHenchmen.push(isHenchmen);
  }

  // 4. Draw remaining Villains
  const villainsCountToDraw = Math.max(0, config.villains - requiredVillains.length);
  const villains = [
    ...requiredVillains,
    ...getRandomItems(availableVillains, villainsCountToDraw, requiredVillains)
  ];

  // 5. Draw remaining Henchmen
  const henchmenCountToDraw = Math.max(0, config.henchmen - requiredHenchmen.length);
  const henchmen = [
    ...requiredHenchmen,
    ...getRandomItems(availableHenchmen, henchmenCountToDraw, requiredHenchmen)
  ];

  // 6. Draw Heroes
  const heroes = getRandomItems(availableHeroes, config.heroes);

  return {
    mastermind,
    scheme,
    villains,
    henchmen,
    heroes,
    bystanders: config.bystanders
  };
};
