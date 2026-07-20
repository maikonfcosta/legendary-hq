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

const getRandomItem = <T,>(array: T[]): T => array[Math.floor(Math.random() * array.length)]!;
const getRandomItems = <T,>(array: T[], count: number, exclude: T[] = []): T[] => {
  const filtered = array.filter(item => !exclude.includes(item));
  const shuffled = [...filtered];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = shuffled[i]!;
    shuffled[i] = shuffled[j]!;
    shuffled[j] = temp;
  }
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
  const availableSchemes = filterByExpansion(db.schemes).filter(s => !s.name.toLowerCase().includes('scheme twist'));
  const availableVillains = filterByExpansion(db.villains);
  const availableHenchmen = filterByExpansion(db.henchmen);
  const availableHeroes = filterByExpansion(db.heroes);

  if (availableMasterminds.length === 0 || availableSchemes.length === 0 || availableHeroes.length < config.heroes) {
    throw new Error(`Você não tem expansões suficientes selecionadas para sortear. Precisamos de pelo menos ${config.heroes} heróis diferentes e você tem ${availableHeroes.length}.`);
  }

  if (availableVillains.length < config.villains) {
    throw new Error(`Faltam Grupos de Vilões. Necessário: ${config.villains}. Disponível: ${availableVillains.length}. Adicione mais expansões.`);
  }
  if (availableHenchmen.length < config.henchmen) {
    throw new Error(`Faltam Grupos de Capangas. Necessário: ${config.henchmen}. Disponível: ${availableHenchmen.length}. Adicione mais expansões.`);
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

  const formatCard = <T extends { expansion: string }>(card: T): T => {
    if (card.expansion === 'core' && ownedExpansions.includes('core_2nd') && !ownedExpansions.includes('core')) {
      return { ...card, expansion: 'core_2nd' };
    }
    return card;
  };

  return {
    mastermind: formatCard(mastermind),
    scheme: formatCard(scheme),
    villains: villains.map(formatCard),
    henchmen: henchmen.map(formatCard),
    heroes: heroes.map(formatCard),
    bystanders: config.bystanders
  };
};

export const generateCampaignSetup = (playerCount: number, ownedExpansions: string[], missionSetup: any): SetupResult => {
  const configs = {
    1: { villains: 1, henchmen: 1, heroes: 3, bystanders: 1 },
    2: { villains: 2, henchmen: 1, heroes: 5, bystanders: 2 },
    3: { villains: 3, henchmen: 1, heroes: 5, bystanders: 8 },
    4: { villains: 3, henchmen: 2, heroes: 5, bystanders: 8 },
    5: { villains: 4, henchmen: 2, heroes: 6, bystanders: 12 }
  };
  const config = configs[playerCount as keyof typeof configs];

  const filterByExpansion = <T extends { expansion: string }>(items: T[]) => 
    items.filter(item => ownedExpansions.includes(item.expansion) || (item.expansion === 'core' && ownedExpansions.includes('core_2nd')));

  const availableMasterminds = filterByExpansion(db.masterminds);
  const availableSchemes = filterByExpansion(db.schemes);
  const availableVillains = filterByExpansion(db.villains);
  const availableHenchmen = filterByExpansion(db.henchmen);
  const availableHeroes = filterByExpansion(db.heroes);

  const mastermind = db.masterminds.find(m => m.name === missionSetup.mastermind) || getRandomItem(availableMasterminds);
  const scheme = db.schemes.find(s => s.name === missionSetup.scheme) || getRandomItem(availableSchemes);

  let requiredVillains: VillainGroup[] = missionSetup.villains 
    ? missionSetup.villains.map((name: string) => db.villains.find(v => v.name === name)).filter(Boolean) as VillainGroup[]
    : [];
    
  let requiredHenchmen: HenchmenGroup[] = missionSetup.henchmen
    ? missionSetup.henchmen.map((name: string) => db.henchmen.find(h => h.name === name)).filter(Boolean) as HenchmenGroup[]
    : [];

  if (mastermind.alwaysLeads) {
    const isVillain = db.villains.find(v => v.id === mastermind.alwaysLeads);
    const isHenchmen = db.henchmen.find(h => h.id === mastermind.alwaysLeads);
    
    if (isVillain && !requiredVillains.some(v => v.id === isVillain.id)) requiredVillains.push(isVillain);
    if (isHenchmen && !requiredHenchmen.some(h => h.id === isHenchmen.id)) requiredHenchmen.push(isHenchmen);
  }

  const villainsCountToDraw = Math.max(0, config.villains - requiredVillains.length);
  const villains = [
    ...requiredVillains,
    ...getRandomItems(availableVillains, villainsCountToDraw, requiredVillains)
  ];

  const henchmenCountToDraw = Math.max(0, config.henchmen - requiredHenchmen.length);
  const henchmen = [
    ...requiredHenchmen,
    ...getRandomItems(availableHenchmen, henchmenCountToDraw, requiredHenchmen)
  ];

  // Implementação dos heróis obrigatórios para campanha
  let requiredHeroes: Hero[] = missionSetup.heroes
    ? missionSetup.heroes.map((name: string) => db.heroes.find(h => h.name === name)).filter(Boolean) as Hero[]
    : [];
    
  const heroesCountToDraw = Math.max(0, config.heroes - requiredHeroes.length);
  const heroes = [
    ...requiredHeroes,
    ...getRandomItems(availableHeroes, heroesCountToDraw, requiredHeroes)
  ];

  return {
    mastermind,
    scheme,
    villains,
    henchmen,
    heroes,
    bystanders: config.bystanders
  };
};

export const generateChallengeSetup = (playerCount: number, ownedExpansions: string[], seedData: any): SetupResult => {
  return generateCampaignSetup(playerCount, ownedExpansions, seedData);
};

