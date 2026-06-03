import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Project } from '../data/projects';
import ProjectCard from './ProjectCard';

interface Props {
  projects: Project[];
  initialCat?: string;
}

const FILTERS = [
  { val: '', label: 'Todos' },
  { val: 'web', label: 'Web' },
  { val: 'frontend', label: 'Frontend' },
  { val: 'backend', label: 'Backend' },
  { val: 'mobile', label: 'Mobile' },
  { val: 'data', label: 'Data Science' },
];

export default function ProjectsGrid({ projects, initialCat = '' }: Props) {
  const [activeCat, setActiveCat] = useState(initialCat);

  const filtered = activeCat
    ? projects.filter(p => p.category.includes(activeCat))
    : projects;

  return (
    <div>
      {/* Filters */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '2rem' }}>
        {FILTERS.map(f => (
          <button
            key={f.val}
            onClick={() => setActiveCat(f.val)}
            className={activeCat === f.val ? 'btn-fox' : 'btn-outline-fox'}
            style={{ padding: '0.3rem 0.9rem', fontSize: '0.82rem' }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        <AnimatePresence mode="popLayout">
          {filtered.map((p, i) => (
            <motion.div
              key={p.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, delay: i * 0.06 }}
            >
              <ProjectCard project={p} index={i} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: '3rem' }}>🦊</div>
          <p style={{ marginTop: '1rem' }}>No hay proyectos en esta categoría.</p>
        </div>
      )}
    </div>
  );
}
