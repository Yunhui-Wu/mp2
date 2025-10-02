export interface Pokemon {
    id: number;
    name: string;
    height: number;
    weight: number;
    base_experience: number;
    sprites: PokemonSprites;
    types: PokemonType[];
    abilities: PokemonAbility[];
    stats: PokemonStat[];
    moves: PokemonMove[];
  }
  
  export interface PokemonDetails extends Pokemon {
    species: PokemonSpecies;
    evolution_chain: PokemonEvolutionChain;
    location_area_encounters: string;
    held_items: PokemonHeldItem[];
    game_indices: PokemonGameIndex[];
    forms: PokemonForm[];
    is_default: boolean;
    order: number;
    past_types: PokemonType[];
  }
  
  export interface PokemonSprites {
    front_default: string | null;
    front_shiny: string | null;
    back_default: string | null;
    back_shiny: string | null;
    other: {
      'official-artwork': {
        front_default: string | null;
        front_shiny: string | null;
      };
    };
  }
  
  export interface PokemonType {
    slot: number;
    type: {
      name: string;
      url: string;
    };
  }
  
  export interface PokemonAbility {
    ability: {
      name: string;
      url: string;
    };
    is_hidden: boolean;
    slot: number;
  }
  
  export interface PokemonStat {
    base_stat: number;
    effort: number;
    stat: {
      name: string;
      url: string;
    };
  }
  
  export interface PokemonMove {
    move: {
      name: string;
      url: string;
    };
    version_group_details: {
      level_learned_at: number;
      move_learn_method: {
        name: string;
        url: string;
      };
      version_group: {
        name: string;
        url: string;
      };
    }[];
  }
  
  export interface PokemonSpecies {
    name: string;
    url: string;
  }
  
  export interface PokemonEvolutionChain {
    url: string;
  }
  
  export interface PokemonHeldItem {
    item: {
      name: string;
      url: string;
    };
    version_details: {
      rarity: number;
      version: {
        name: string;
        url: string;
      };
    }[];
  }
  
  export interface PokemonGameIndex {
    game_index: number;
    version: {
      name: string;
      url: string;
    };
  }
  
  export interface PokemonForm {
    name: string;
    url: string;
  }
  
  export interface PokemonResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: PokemonListItem[];
  }
  
  export interface PokemonListItem {
    name: string;
    url: string;
  }
  
  export interface PokemonTypeInfo {
    name: string;
    url: string;
  }
  
  export interface PokemonTypeResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: PokemonTypeInfo[];
  }
  
  export type SortField = 'name' | 'height' | 'weight' | 'base_experience';
  export type SortOrder = 'asc' | 'desc';
  