export interface Expansion {
  id: string;
  name: string;
  image?: string;
}

export interface Mastermind {
  id: string;
  name: string;
  expansion: string;
  alwaysLeads: string;
  image?: string;
}

export interface Scheme {
  id: string;
  name: string;
  expansion: string;
  image?: string;
}

export interface VillainGroup {
  id: string;
  name: string;
  expansion: string;
}

export interface HenchmenGroup {
  id: string;
  name: string;
  expansion: string;
}

export interface Hero {
  id: string;
  name: string;
  team: string;
  classes: string[];
  expansion: string;
  image?: string;
}

export interface CardDatabase {
  expansions: Expansion[];
  masterminds: Mastermind[];
  schemes: Scheme[];
  villains: VillainGroup[];
  henchmen: HenchmenGroup[];
  heroes: Hero[];
}
