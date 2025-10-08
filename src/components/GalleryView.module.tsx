import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePokemonContext } from '../contexts/PokemonContext';
import { pokemonAPI, mockPokemonData, mockPokemonTypes } from '../services/api';
import type { Pokemon } from '../types/pokemon';
import GalleryItem from './GalleryItem.module';
import TypeFilter from './TypeFilter.module';
import styles from './GalleryView.module.css';

const CONCURRENCY = 16;

type ListItem = { name: string; url: string; id: number };

export default function GalleryView() {
  const navigate = useNavigate();
  const { state, dispatch } = usePokemonContext();

  const [gallerySelectedTypes, setGallerySelectedTypes] = useState<string[]>([]);

  const [list, setList] = useState<ListItem[]>([]);
  const [detailsById, setDetailsById] = useState<Record<number, Pokemon>>({});
  const [loadingList, setLoadingList] = useState(true);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [typesLoaded, setTypesLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setLoadingList(true);
        const res = await pokemonAPI.getPokemonList(1000, 0);
        const items: ListItem[] = res.results.map((r: any) => {
          const id = Number(r.url.split('/').slice(-2, -1)[0]);
          return { name: r.name, url: r.url, id };
        });
        setList(items);
        dispatch({ type: 'SET_TYPES', payload: (await pokemonAPI.getPokemonTypes()).results });
        setTypesLoaded(true);
      } catch {

        const items: ListItem[] = mockPokemonData.map((p: any) => ({
          id: p.id, name: p.name, url: ''
        }));
        setList(items);
        dispatch({ type: 'SET_TYPES', payload: mockPokemonTypes });
        setTypesLoaded(true);
      } finally {
        setLoadingList(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const filteredIds = useMemo(() => {
    const selected = gallerySelectedTypes;
    let ids = list;
    if (selected.length > 0) {
      ids = list.filter(li => {
        const d = detailsById[li.id];
        if (!d) return true;
        return selected.every(selectedType => 
          d.types.some((t: any) => t.type.name === selectedType)
        );
      });
    }
    return ids.map(it => it.id);
  }, [list, gallerySelectedTypes, detailsById]);


  useEffect(() => {
    const missing = filteredIds.filter(id => !detailsById[id]);
    if (missing.length === 0) return;

    setLoadingDetails(true);
    let cancelled = false;

    const fetchDetail = async (id: number) => {
      try {
        return await pokemonAPI.getPokemonDetails(id);
      } catch {
        const m = (mockPokemonData as any[]).find(x => x.id === id);
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
          results.push({ id: current, data });
        }
      });
      await Promise.all(workers);
      return results;
    };

    (async () => {
      const res = await runPool(missing, CONCURRENCY);
      if (cancelled) return;
      setDetailsById(prev => {
        const next = { ...prev };
        for (const { id, data } of res) {
          if (data) next[id] = data as Pokemon;
        }
        return next;
      });
      setLoadingDetails(false);
    })();

    return () => { cancelled = true; };
  }, [filteredIds, detailsById]);



  const handlePokemonClick = (p: Pokemon) => {
    navigate(`/pokemon/${p.id}`);
  };


  const visibleList: Pokemon[] = filteredIds
    .map(id => detailsById[id])
    .filter((pokemon): pokemon is Pokemon => pokemon !== undefined);

  const nothingYet = !loadingList && visibleList.length === 0 && list.length > 0 && Object.keys(detailsById).length > 0;

  return (
    <div className={styles.galleryView}>
      <div className={styles.header}>
        <h1 className={styles.title}>Pokemon Gallery</h1>

        {typesLoaded && (
          <TypeFilter
            types={state.types}
            selectedTypes={gallerySelectedTypes}
            onTypeToggle={(typeName) => {
              setGallerySelectedTypes(prev => 
                prev.includes(typeName) 
                  ? prev.filter(t => t !== typeName)
                  : [...prev, typeName]
              );
            }}
          />
        )}
      </div>


      {loadingList && (
        <div className={styles.loading}>Loading list…</div>
      )}

      {!loadingList && loadingDetails && (
        <div className={styles.loading}>Loading Pokemon details…</div>
      )}

      {!loadingList && !loadingDetails && nothingYet && (
        <div className={styles.noResults}>No pokemon found matching your criteria.</div>
      )}


      <div className={styles.gallery}>
        {visibleList.map(pokemon => (
          <GalleryItem
            key={pokemon.id}
            pokemon={pokemon}
            onClick={() => handlePokemonClick(pokemon)}
          />
        ))}
      </div>

    </div>
  );
}
