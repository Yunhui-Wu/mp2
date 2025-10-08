import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { pokemonAPI, mockPokemonData } from '../services/api';
import type { PokemonDetails } from '../types/pokemon';
import NavigationButtons from './NavigationButtons.module';
import styles from './DetailView.module.css';

const MAX_ID = 1025;

const DetailView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [pokemon, setPokemon] = useState<PokemonDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const numericId = useMemo(() => {
    const n = Number(id);
    return Number.isFinite(n) ? n : NaN;
  }, [id]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (!Number.isFinite(numericId)) {
      setPokemon(null);
      setError('Invalid Pokémon id.');
      setLoading(false);
      return;
    }

    const load = async (pokemonId: number) => {
      try {
        setLoading(true);
        setError(null);
        const details = await pokemonAPI.getPokemonDetails(pokemonId);
        setPokemon(details);
      } catch (e) {
        console.error('Error loading pokemon details:', e);
        const mock = mockPokemonData.find((p: any) => p.id === pokemonId);
        if (mock) {
          setPokemon(mock as PokemonDetails);
          setError('Failed to load from API. Showing mock data.');
        } else {
          setPokemon(null);
          setError('Pokémon not found.');
        }
      } finally {
        setLoading(false);
      }
    };

    load(numericId);
  }, [numericId]);

  const imgUrl =
    pokemon?.sprites?.other?.['official-artwork']?.front_default ||
    pokemon?.sprites?.other?.['official-artwork']?.front_shiny ||
    pokemon?.sprites?.front_default ||
    '/placeholder-poster.png';

  const prettyId = pokemon ? `#${String(pokemon.id).padStart(3, '0')}` : '';

  const statRows = useMemo(
    () =>
      (pokemon?.stats ?? []).map((s) => {
        const label = s.stat.name.replace('-', ' ');
        const value = s.base_stat;
        const pct = Math.min(100, (value / 180) * 100);
        return { label, value, pct };
      }),
    [pokemon]
  );

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.card}>
          <div className={styles.art}>
            <div className={styles.name} aria-busy="true">Loading…</div>
          </div>
          <div className={styles.info} />
        </div>
      </div>
    );
  }

  if (error && !pokemon) {
    return (
      <div className={styles.page}>
        <div className={styles.card}>
          <div className={`${styles.info} ${styles.errorInfo}`}>
            <p className={styles.sectionTitle}>{error}</p>
            <button onClick={() => navigate('/')} className={styles.chip}>
              Back to List View
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!pokemon) return null;

  return (
    <div className={styles.page}>
      <section className={styles.card}>

        <div className={styles.art}>
          <button onClick={() => navigate('/')} className={styles.backButton}>
          {'< Back to List View'}
          </button>
          <img className={styles.pokemonImage} src={imgUrl} alt={pokemon.name} />
        </div>

       
        <div className={styles.info}>
         
          <div className={styles.header}>
            
            <NavigationButtons
              onPrevious={() => navigate(`/pokemon/${pokemon.id - 1}`)}
              onNext={() => navigate(`/pokemon/${pokemon.id + 1}`)}
              canGoPrevious={pokemon.id > 1}
              canGoNext={pokemon.id < MAX_ID}
            />
          </div>

          
          <div className={styles.header}>
            <h1 className={styles.name}>
              {pokemon.name?.charAt(0).toUpperCase() + pokemon.name?.slice(1) || 'Unknown'}
            </h1>
            <span className={styles.id}>{prettyId}</span>
          </div>

          
          <div className={styles.types}>
            {pokemon.types.map((t) => (
              <span
                key={t.type.name}
                className={`${styles.type} ${styles[t.type.name] || ''}`}
              >
                {t.type.name}
              </span>
            ))}
          </div>


          <div className={styles.quick}>
            <div className={styles.metric}>
              <div className={styles.label}>Height</div>
              <div className={styles.value}>{pokemon.height / 10} m</div>
            </div>
            <div className={styles.metric}>
              <div className={styles.label}>Weight</div>
              <div className={styles.value}>{pokemon.weight / 10} kg</div>
            </div>
            <div className={styles.metric}>
              <div className={styles.label}>Base Exp</div>
              <div className={styles.value}>{pokemon.base_experience}</div>
            </div>
          </div>

          <h3 className={styles.sectionTitle}>Abilities</h3>
          <div className={styles.abilities}>
            {pokemon.abilities.map((a) => (
              <span key={a.ability.name} className={styles.chip}>
                {a.ability.name}
                {a.is_hidden ? ' (Hidden)' : ''}
              </span>
            ))}
          </div>

          <h3 className={styles.sectionTitle}>Base Stats</h3>
          <div className={styles.stats}>
            {statRows.map((s) => (
              <div key={s.label} className={styles.statRow}>
                <span className={styles.statLabel}>{s.label}</span>
                <div className={styles.statBar}>
                  <div 
                    className={styles.statFill}
                    style={{'--stat-width': `${s.pct}%`} as React.CSSProperties}
                  />
                </div>
                <span className={styles.statVal}>{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default DetailView;
