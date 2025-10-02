import axios from 'axios';
import { Pokemon, PokemonResponse, PokemonDetails, PokemonTypeResponse } from '../types/pokemon';

const API_BASE_URL = 'https://pokeapi.co/api/v2';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const pokemonAPI = {
  // Get pokemon list
  getPokemonList: async (limit: number = 20, offset: number = 0): Promise<PokemonResponse> => {
    const response = await api.get('/pokemon', {
      params: { limit, offset }
    });
    return response.data;
  },

  // Search pokemon by name
  searchPokemon: async (name: string): Promise<PokemonDetails> => {
    const response = await api.get(`/pokemon/${name.toLowerCase()}`);
    return response.data;
  },

  // Get pokemon details by ID
  getPokemonDetails: async (id: number): Promise<PokemonDetails> => {
    const response = await api.get(`/pokemon/${id}`);
    return response.data;
  },

  // Get pokemon types
  getPokemonTypes: async (): Promise<PokemonTypeResponse> => {
    const response = await api.get('/type');
    return response.data;
  },

  // Get pokemon by type
  getPokemonByType: async (type: string): Promise<PokemonResponse> => {
    const response = await api.get(`/type/${type}`);
    return response.data;
  },
};

// Mock Pokemon data for fallback (simplified)
export const mockPokemonData: Pokemon[] = [
  {
    id: 1,
    name: "bulbasaur",
    height: 7,
    weight: 69,
    base_experience: 64,
    sprites: {
      front_default: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png",
      front_shiny: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/1.png",
      back_default: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/1.png",
      back_shiny: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/shiny/1.png",
      other: {
        'official-artwork': {
          front_default: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png",
          front_shiny: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/1.png"
        }
      }
    },
    types: [
      { slot: 1, type: { name: "grass", url: "https://pokeapi.co/api/v2/type/12/" } },
      { slot: 2, type: { name: "poison", url: "https://pokeapi.co/api/v2/type/4/" } }
    ],
    abilities: [
      { ability: { name: "overgrow", url: "https://pokeapi.co/api/v2/ability/65/" }, is_hidden: false, slot: 1 },
      { ability: { name: "chlorophyll", url: "https://pokeapi.co/api/v2/ability/34/" }, is_hidden: true, slot: 3 }
    ],
    stats: [
      { base_stat: 45, effort: 0, stat: { name: "hp", url: "https://pokeapi.co/api/v2/stat/1/" } },
      { base_stat: 49, effort: 0, stat: { name: "attack", url: "https://pokeapi.co/api/v2/stat/2/" } },
      { base_stat: 49, effort: 0, stat: { name: "defense", url: "https://pokeapi.co/api/v2/stat/3/" } },
      { base_stat: 65, effort: 1, stat: { name: "special-attack", url: "https://pokeapi.co/api/v2/stat/4/" } },
      { base_stat: 65, effort: 0, stat: { name: "special-defense", url: "https://pokeapi.co/api/v2/stat/5/" } },
      { base_stat: 45, effort: 0, stat: { name: "speed", url: "https://pokeapi.co/api/v2/stat/6/" } }
    ],
    moves: []
  }
];

export const mockPokemonTypes = [
  { name: "normal", url: "https://pokeapi.co/api/v2/type/1/" },
  { name: "fighting", url: "https://pokeapi.co/api/v2/type/2/" },
  { name: "flying", url: "https://pokeapi.co/api/v2/type/3/" },
  { name: "poison", url: "https://pokeapi.co/api/v2/type/4/" },
  { name: "ground", url: "https://pokeapi.co/api/v2/type/5/" },
  { name: "rock", url: "https://pokeapi.co/api/v2/type/6/" },
  { name: "bug", url: "https://pokeapi.co/api/v2/type/7/" },
  { name: "ghost", url: "https://pokeapi.co/api/v2/type/8/" },
  { name: "steel", url: "https://pokeapi.co/api/v2/type/9/" },
  { name: "fire", url: "https://pokeapi.co/api/v2/type/10/" },
  { name: "water", url: "https://pokeapi.co/api/v2/type/11/" },
  { name: "grass", url: "https://pokeapi.co/api/v2/type/12/" },
  { name: "electric", url: "https://pokeapi.co/api/v2/type/13/" },
  { name: "psychic", url: "https://pokeapi.co/api/v2/type/14/" },
  { name: "ice", url: "https://pokeapi.co/api/v2/type/15/" },
  { name: "dragon", url: "https://pokeapi.co/api/v2/type/16/" },
  { name: "dark", url: "https://pokeapi.co/api/v2/type/17/" },
  { name: "fairy", url: "https://pokeapi.co/api/v2/type/18/" }
];