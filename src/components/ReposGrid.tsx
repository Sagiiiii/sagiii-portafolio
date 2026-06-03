import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { GitHubRepo } from '../lib/github';
import { TECH_ICON } from '../lib/tech-icons';
import RepoCard from './RepoCard';

const CAT_FILTERS = [
  { val: '', label: 'Todos' },
  { val: 'web', label: 'Web' },
  { val: 'frontend', label: 'Frontend' },
  { val: 'backend', label: 'Backend' },
  { val: 'mobile', label: 'Mobile' },
  { val: 'data', label: 'Data Science' },
];

const NOTABLE_TECHS = [
  'Python','JavaScript','TypeScript','Angular','React','Astro',
  'Flutter','Laravel','MongoDB','MySQL','Jupyter Notebook','Dart',
];

interface Props {
  repos: GitHubRepo[];
}

export default function ReposGrid({ repos }: Props) {
  const [activeCat, setActiveCat] = useState('');
  const [activeTech, setActiveTech] = useState('');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    return repos.filter(r => {
      const matchCat = !activeCat || r.categories.includes(activeCat);
      const matchTech = !activeTech || (r.technologies ?? []).includes(activeTech) || r.language === activeTech;
      const q = search.toLowerCase();
      const matchSearch = !q || r.name.toLowerCase().includes(q)
        || (r.description ?? '').toLowerCase().includes(q)
        || (r.display_name ?? '').toLowerCase().includes(q);
      return matchCat && matchTech && matchSearch;
    });
  }, [repos, activeCat, activeTech, search]);

  return (
    <div>
      {/* Search */}
      <div style={{ position: 'relative', marginBottom: '1.25rem' }}>
        <i className="bi bi-search" style={{
          position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)',
          color: 'var(--text-muted)', pointerEvents: 'none'
        }}></i>
        <input
          type="text"
          placeholder="Buscar proyecto o tecnología..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: '100%', background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: '10px', padding: '0.65rem 1rem 0.65rem 2.5rem',
            color: 'var(--text)', fontSize: '0.9rem', outline: 'none',
          }}
          onFocus={e => (e.target.style.borderColor = 'var(--fox)')}
          onBlur={e => (e.target.style.borderColor = 'var(--border)')}
        />
      </div>

      {/* Category filter */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.75rem' }}>
        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', alignSelf: 'center', marginRight: '0.25rem' }}>Categoría:</span>
        {CAT_FILTERS.map(f => (
          <motion.button
            key={f.val}
            onClick={() => setActiveCat(f.val)}
            className={activeCat === f.val ? 'btn-fox' : 'btn-outline-fox'}
            style={{ padding: '0.28rem 0.8rem', fontSize: '0.78rem' }}
            whileTap={{ scale: 0.95 }}
          >
            {f.label}
          </motion.button>
        ))}
      </div>

      {/* Tech filter */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.75rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--border)' }}>
        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', alignSelf: 'center', marginRight: '0.25rem' }}>Tecnología:</span>
        <motion.button
          onClick={() => setActiveTech('')}
          className={activeTech === '' ? 'btn-fox' : 'btn-outline-fox'}
          style={{ padding: '0.28rem 0.8rem', fontSize: '0.78rem' }}
          whileTap={{ scale: 0.95 }}
        >
          Todas
        </motion.button>
        {NOTABLE_TECHS.map(t => {
          const icon = TECH_ICON[t];
          return (
            <motion.button
              key={t}
              onClick={() => setActiveTech(activeTech === t ? '' : t)}
              className={activeTech === t ? 'btn-fox' : 'btn-outline-fox'}
              style={{ padding: '0.28rem 0.75rem', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
              whileTap={{ scale: 0.95 }}
            >
              {icon && <img src={icon} alt={t} width={14} height={14} style={{ objectFit: 'contain' }} />}
              {t}
            </motion.button>
          );
        })}
      </div>

      {/* Count */}
      <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '1.25rem' }}>
        Mostrando <span style={{ color: 'var(--fox)', fontWeight: 700 }}>{filtered.length}</span> de {repos.length} proyectos
      </p>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '1.5rem' }}>
        <AnimatePresence mode="popLayout">
          {filtered.map((repo, i) => (
            <motion.div
              key={repo.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.25 }}
            >
              <RepoCard repo={repo} index={i} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}
        >
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
          <p>No hay proyectos con ese filtro.</p>
          <button className="btn-outline-fox" style={{ marginTop: '1rem', padding: '0.4rem 1rem', fontSize: '0.85rem' }}
            onClick={() => { setActiveCat(''); setActiveTech(''); setSearch(''); }}>
            Limpiar filtros
          </button>
        </motion.div>
      )}
    </div>
  );
}
