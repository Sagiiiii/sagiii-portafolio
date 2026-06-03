import { motion } from 'framer-motion';
import type { Project } from '../data/projects';

interface Props {
  project: Project;
  index: number;
}

export default function ProjectCard({ project: p, index }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      style={{ height: '100%' }}
    >
      <div className="card" style={{ height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {p.image_url ? (
          <img
            src={p.image_url}
            alt={p.title}
            style={{ width: '100%', height: '200px', objectFit: 'cover' }}
            loading="lazy"
          />
        ) : (
          <div style={{ height: '200px', background: 'var(--bg-card2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>
            🦊
          </div>
        )}

        <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
          <span className="tech-badge" style={{ marginBottom: '0.5rem', alignSelf: 'flex-start' }}>
            {p.category[0]}
          </span>
          <h5 style={{ fontWeight: 700, marginBottom: '0.5rem', fontSize: '1rem', lineHeight: 1.4 }}>{p.title}</h5>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', flex: 1, lineHeight: 1.7, marginBottom: '0.75rem' }}>
            {p.short_desc}
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', marginBottom: '0.75rem' }}>
            {p.technologies.slice(0, 5).map(t => (
              <span key={t} className="tech-badge">{t}</span>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <a href={`/projects/${p.id}`} className="btn-fox" style={{ flex: 1, justifyContent: 'center', padding: '0.35rem 0.75rem', fontSize: '0.82rem' }}>
              <i className="bi bi-eye"></i> Ver más
            </a>
            {p.github_urls.map(repo => (
              <a key={repo.url} href={repo.url} target="_blank" rel="noopener" className="btn-outline-fox" style={{ padding: '0.35rem 0.6rem', fontSize: '0.82rem' }} title={repo.label}>
                <i className="bi bi-github"></i>
              </a>
            ))}
            {p.live_url && (
              <a href={p.live_url} target="_blank" rel="noopener" className="btn-outline-fox" style={{ padding: '0.35rem 0.6rem', fontSize: '0.82rem' }} title="Ver en vivo">
                <i className="bi bi-box-arrow-up-right"></i>
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
