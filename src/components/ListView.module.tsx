import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePokemonContext } from '../contexts/PokemonContext';
import { pokemonAPI, mockPokemonData, mockPokemonTypes } from '../services/api';
import type { Pokemon, SortField } from '../types/pokemon';
import PokemonCard from './PokemonCard.module';
import SearchBar from './SearchBar.module';
import SortControls from './SortControls.module';
import TypeFilter from './TypeFilter.module';
import styles from './ListView.module.css';

const CONCURRENCY = 16;

type ListItem = { id: number; name: string };

const ListView: React.FC = () => {
  const navigate = useNavigate();
  const { state, dispatch } = usePokemonContext();


  const [list, setList] = useState<ListItem[]>([]);
 
  const [detailsById, setDetailsById] = useState<Record<number, Pokemon>>({});
  const [loadingList, setLoadingList] = useState(true);
  const [loadingPageDetails, setLoadingPageDetails] = useState(false);
  const [typesReady, setTypesReady] = useState(false);


  useEffect(() => {
    (async () => {
      try {
        setLoadingList(true);
        dispatch({ type: 'SET_LOADING', payload: true });

      
        const res = await pokemonAPI.getPokemonList(1000, 0);
        const items: ListItem[] = res.results.map((r: any) => {
          const id = Number(r.url.split('/').slice(-2, -1)[0]);
          return { id, name: r.name };
        });
        setList(items);

     
        try {
          const t = await pokemonAPI.getPokemonTypes();
          dispatch({ type: 'SET_TYPES', payload: t.results });
        } catch {
          dispatch({ type: 'SET_TYPES', payload: mockPokemonTypes });
        }
        setTypesReady(true);

        
        dispatch({
          type: 'SET_POKEMON',
          payload: mockPokemonData.length ? mockPokemonData : [],
        });
        dispatch({ type: 'SET_ERROR', payload: null });
      } catch (e) {
        dispatch({ type: 'SET_POKEMON', payload: mockPokemonData });
        setDetailsById(
          Object.fromEntries(
            (mockPokemonData as any[]).map((p) => [p.id, p as Pokemon]),
          ),
        );
        dispatch({ type: 'SET_TYPES', payload: mockPokemonTypes });
        setTypesReady(true);
        dispatch({ type: 'SET_ERROR', payload: 'Using mock data as fallback.' });
      } finally {
        setLoadingList(false);
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePokemonClick = (pokemon: Pokemon) => navigate(`/pokemon/${pokemon.id}`);
  const handleSearchChange = (query: string) =>
    dispatch({ type: 'SET_SEARCH_QUERY', payload: query });
  const handleSortFieldChange = (field: SortField) =>
    dispatch({ type: 'SET_SORT_FIELD', payload: field });
  const handleSortOrderChange = (order: 'asc' | 'desc') =>
    dispatch({ type: 'SET_SORT_ORDER', payload: order });
  const handleTypeToggle = (typeName: string) =>
    dispatch({ type: 'TOGGLE_TYPE', payload: typeName });

  const matchedIdsByName = useMemo(() => {
    const q = state.searchQuery.trim().toLowerCase();
    if (!q) return list.map((x) => x.id);
    return list.filter((x) => x.name.toLowerCase().includes(q)).map((x) => x.id);
  }, [list, state.searchQuery]);

  const filteredIds = useMemo(() => {
    if (state.selectedTypes.length === 0) return matchedIdsByName;
    return matchedIdsByName.filter((id) => {
      const d = detailsById[id];
      if (!d) return true;
      return state.selectedTypes.every(selectedType => 
        d.types?.some((t: any) => t.type?.name === selectedType) || false
      );
    });
  }, [matchedIdsByName, state.selectedTypes, detailsById]);

  const pagedIds = useMemo(
    () => filteredIds,
    [filteredIds],
  );

  useEffect(() => {
    const missing = pagedIds.filter((id) => !detailsById[id]);
    if (missing.length === 0) return;

    let cancelled = false;
    setLoadingPageDetails(true);

    const fetchDetail = async (id: number) => {
      try {
        return await pokemonAPI.getPokemonDetails(id);
      } catch {
        const m = (mockPokemonData as any[]).find((x) => x.id === id);
        return m || null;
      }
    };

    const runPool = async (ids: number[], size: number) => {
      const results: Array<{ id: number; data: Pokemon | null }> = [];
      let idx = 0;
      const workers = new Array(Math.min(size, ids.length)).fill(0).map(async () => {
        while (idx < ids.length && !cancelled) {
          const current = ids[idx++];
          const data = await fetchDetail(current);
          results.push({ id: current, data: data as any });
        }
      });
      await Promise.all(workers);
      return results;
    };

    (async () => {
      const res = await runPool(missing, CONCURRENCY);
      if (cancelled) return;
      setDetailsById((prev) => {
        const next = { ...prev };
        for (const { id, data } of res) {
          if (data) next[id] = data as Pokemon;
        }
        return next;
      });
      setLoadingPageDetails(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [pagedIds, detailsById]);


  const sortedIds = useMemo(() => {
    const ids = [...pagedIds];
    const dir = state.sortOrder === 'asc' ? 1 : -1;

    const cmp = (a: number, b: number) => {
      const da = detailsById[a];
      const db = detailsById[b];

      if (state.sortField === 'name') {
        const na =
          da?.name ??
          list.find((x) => x.id === a)?.name ??
          '';
        const nb =
          db?.name ??
          list.find((x) => x.id === b)?.name ??
          '';
        return na.localeCompare(nb) * dir;
      }

      if (!da && !db) return 0;
      if (!da) return 1;
      if (!db) return -1;

      const getVal = (p: Pokemon) => {
        switch (state.sortField) {
          case 'height': return p.height;
          case 'weight': return p.weight;
          case 'base_experience': return p.base_experience ?? 0;
          default: return 0;
        }
      };

      const va = getVal(da);
      const vb = getVal(db);
      if (va < vb) return -1 * dir;
      if (va > vb) return 1 * dir;
      return 0;
    };

    ids.sort(cmp);
    return ids;
  }, [pagedIds, detailsById, list, state.sortField, state.sortOrder]);

  const visible = useMemo(() => {
    return sortedIds.map((id) => detailsById[id]).filter((pokemon): pokemon is Pokemon => pokemon !== undefined);
  }, [sortedIds, detailsById]);

  if (loadingList) {
    return (
      <div className={styles.listView}>
        <div className={styles.loading}>Loading list…</div>
      </div>
    );
  }

  return (
    <div className={styles.listView}>
      <div className={styles.header}>
        <h1 className={styles.title}>Pokemon List</h1>

        <div className={styles.searchAndSort}>
          <SearchBar
            value={state.searchQuery}
            onChange={handleSearchChange}
            placeholder="Search pokemon..."
          />
          <SortControls
            sortField={state.sortField}
            sortOrder={state.sortOrder}
            onSortFieldChange={handleSortFieldChange}
            onSortOrderChange={handleSortOrderChange}
          />
        </div>

        {typesReady && (
          <TypeFilter
            types={state.types}
            selectedTypes={state.selectedTypes}
            onTypeToggle={handleTypeToggle}
          />
        )}
      </div>

      <div className={styles.pokemonList}>
        {!state.searchQuery.trim() ? (
          <div className={styles.noResults}>Enter a Pokemon name to search...</div>
        ) : visible.length === 0 && !loadingPageDetails ? (
          <div className={styles.noResults}>No pokemon found matching your search.</div>
        ) : (
          <>
            {visible.map((pokemon) => (
              <PokemonCard
                key={pokemon.id}
                pokemon={pokemon}
                onClick={() => handlePokemonClick(pokemon)}
              />
            ))}
            {loadingPageDetails && (
              <div className={styles.loading}>Loading more…</div>
            )}
          </>
        )}
      </div>

    </div>
  );
};

export default ListView;
