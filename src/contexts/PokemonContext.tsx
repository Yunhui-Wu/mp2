import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Pokemon, PokemonTypeInfo, SortField } from '../types/pokemon';

interface PokemonState {
  pokemon: Pokemon[];
  types: PokemonTypeInfo[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  selectedTypes: string[];
  sortField: SortField;
  sortOrder: 'asc' | 'desc';
}

type PokemonAction =
  | { type: 'SET_POKEMON'; payload: Pokemon[] }
  | { type: 'SET_TYPES'; payload: PokemonTypeInfo[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'TOGGLE_TYPE'; payload: string }
  | { type: 'SET_SORT_FIELD'; payload: SortField }
  | { type: 'SET_SORT_ORDER'; payload: 'asc' | 'desc' };

const initialState: PokemonState = {
  pokemon: [],
  types: [],
  loading: false,
  error: null,
  searchQuery: '',
  selectedTypes: [],
  sortField: 'name',
  sortOrder: 'asc',
};

const pokemonReducer = (state: PokemonState, action: PokemonAction): PokemonState => {
  switch (action.type) {
    case 'SET_POKEMON':
      return { ...state, pokemon: action.payload };
    case 'SET_TYPES':
      return { ...state, types: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    case 'TOGGLE_TYPE':
      const typeName = action.payload;
      const isSelected = state.selectedTypes.includes(typeName);
      return {
        ...state,
        selectedTypes: isSelected
          ? state.selectedTypes.filter(t => t !== typeName)
          : [...state.selectedTypes, typeName]
      };
    case 'SET_SORT_FIELD':
      return { ...state, sortField: action.payload };
    case 'SET_SORT_ORDER':
      return { ...state, sortOrder: action.payload };
    default:
      return state;
  }
};

const PokemonContext = createContext<{
  state: PokemonState;
  dispatch: React.Dispatch<PokemonAction>;
} | null>(null);

export const PokemonProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(pokemonReducer, initialState);

  return (
    <PokemonContext.Provider value={{ state, dispatch }}>
      {children}
    </PokemonContext.Provider>
  );
};

export const usePokemonContext = () => {
  const context = useContext(PokemonContext);
  if (!context) {
    throw new Error('usePokemonContext must be used within a PokemonProvider');
  }
  return context;
};