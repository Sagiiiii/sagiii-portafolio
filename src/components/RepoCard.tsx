import { motion } from 'framer-motion';
import type { GitHubRepo } from '../lib/github';
import { TECH_ICON, LANG_COLOR } from '../lib/tech-icons';
import ImageModal from './ImageModal';

interface Props {
  repo: GitHubRepo;
  index: number;
}

function TechIcon({ tech }: { tech: string }) {
  const icon = TECH_ICON[tech];
  if (!icon) return null;
  return (
    <img src={icon} alt={tech} title={tech} width={22} height={22}
      style={{ objectFit: 'contain', filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.4))' }} />
  );
}

export default function RepoCard({ repo: r, index }: Props) {
  const color = LANG_COLOR[r.language ?? ''] ?? '#E8651A';
  const pushed = new Date(r.pushed_at).toLocaleDateString('es-PE', { month: 'short', year: 'numeric' });
  const displayName = r.display_name ?? r.name.replace(/-/g, ' ').replace(/_/g, ' ');
  const techs = r.technologies ?? [];
  const comingSoon = (r as any).coming_soon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, delay: (index % 6) * 0.06 }}
      style={{ height: '100%' }}
    >
      <motion.div
        className="card"
        style={{ height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
        whileHover={{ y: -6 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        {/* Cover */}
        {r.image_url ? (
          <div style={{ position: 'relative', overflow: 'hidden', height: '185px' }}>
            <ImageModal src={r.image_url} alt={displayName}
              style={{ width: '100%', height: '185px', objectFit: 'cover', display: 'block', transition: 'transform 0.4s ease' }}
            />
            {/* Gradient overlay */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to top, rgba(20,20,20,0.8) 0%, transparent 60%)',
            }}></div>
            {/* Language badge on image */}
            {r.language && (
              <span style={{
                position: 'absolute', top: '10px', left: '10px',
                display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                background: 'rgba(20,20,20,0.85)', borderRadius: '6px',
                padding: '3px 8px', fontSize: '0.7rem', fontWeight: 700, color: color,
                backdropFilter: 'blur(4px)',
              }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: color }}></span>
                {r.language}
              </span>
            )}
            <div style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {r.is_private && (
                <span style={{ background: 'rgba(232,101,26,0.9)', borderRadius: '6px', padding: '3px 8px', fontSize: '0.65rem', fontWeight: 700, color: '#fff' }}>
                  <i className="bi bi-lock-fill"></i> Privado
                </span>
              )}
              {comingSoon && (
                <span style={{ background: 'rgba(99,102,241,0.9)', borderRadius: '6px', padding: '3px 8px', fontSize: '0.65rem', fontWeight: 700, color: '#fff' }}>
                  <i className="bi bi-hammer"></i> En desarrollo
                </span>
              )}
            </div>
          </div>
        ) : (
          /* Gradient placeholder with tech icons */
          <div style={{
            height: '185px', position: 'relative', overflow: 'hidden',
            background: `linear-gradient(135deg, var(--bg-card2) 0%, ${color}30 60%, ${color}15 100%)`,
            borderBottom: `2px solid ${color}40`,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
          }}>
            {/* Tech icons grid */}
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center', padding: '0 1rem' }}>
              {techs.slice(0, 5).map(t => (
                <motion.div key={t} whileHover={{ scale: 1.2, rotate: 5 }} style={{ padding: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '10px' }}>
                  {TECH_ICON[t]
                    ? <img src={TECH_ICON[t]} alt={t} width={28} height={28} style={{ objectFit: 'contain' }} />
                    : <span style={{ fontSize: '1.5rem' }}>⚙️</span>
                  }
                </motion.div>
              ))}
            </div>
            {/* Language label */}
            {r.language && (
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color, letterSpacing: '1px' }}>
                {r.language}
              </span>
            )}
            {r.is_private && (
              <span style={{
                position: 'absolute', top: '10px', right: '10px',
                background: 'rgba(232,101,26,0.9)', borderRadius: '6px',
                padding: '3px 8px', fontSize: '0.65rem', fontWeight: 700, color: '#fff',
              }}>
                <i className="bi bi-lock-fill"></i> Privado
              </span>
            )}
          </div>
        )}

        {/* Body */}
        <div style={{ padding: '1.1rem', display: 'flex', flexDirection: 'column', flex: 1, gap: '0.55rem' }}>
          {/* Date + stats */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
              <i className="bi bi-clock-history" style={{ marginRight: '3px' }}></i>{pushed}
            </span>
            <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              <span><i className="bi bi-star" style={{ color: 'var(--fox)' }}></i> {r.stargazers_count}</span>
              <span><i className="bi bi-diagram-2" style={{ color: 'var(--fox)' }}></i> {r.forks_count}</span>
            </div>
          </div>

          {/* Title */}
          <h5 style={{ fontWeight: 700, fontSize: '0.95rem', margin: 0, lineHeight: 1.4 }}>{displayName}</h5>

          {/* Description */}
          <p style={{ color: 'var(--text-muted)', fontSize: '0.81rem', lineHeight: 1.7, margin: 0, flex: 1 }}>
            {r.description ?? 'Sin descripción disponible.'}
          </p>

          {/* Tech icon strip */}
          {techs.length > 0 && (
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', alignItems: 'center' }}>
              {techs.slice(0, 6).map(t => (
                TECH_ICON[t]
                  ? <img key={t} src={TECH_ICON[t]} alt={t} title={t} width={18} height={18} style={{ objectFit: 'contain', opacity: 0.85 }} />
                  : <span key={t} className="tech-badge" style={{ fontSize: '0.65rem' }}>{t}</span>
              ))}
              {techs.length > 6 && (
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>+{techs.length - 6}</span>
              )}
            </div>
          )}

          {/* Topics */}
          {r.topics.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
              {r.topics.slice(0, 3).map(t => (
                <span key={t} className="tech-badge" style={{ fontSize: '0.65rem' }}>{t}</span>
              ))}
            </div>
          )}

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
            <a href={`/projects/${r.name}`} className="btn-fox"
              style={{ flex: 1, justifyContent: 'center', padding: '0.38rem 0.75rem', fontSize: '0.8rem' }}>
              <i className="bi bi-file-text"></i> Detalle
            </a>
            {!r.is_private && (
              <a href={r.html_url} target="_blank" rel="noopener" className="btn-outline-fox"
                style={{ padding: '0.38rem 0.65rem', fontSize: '0.8rem' }} title="Ver en GitHub">
                <i className="bi bi-github"></i>
              </a>
            )}
            {r.homepage && (
              <a href={r.homepage} target="_blank" rel="noopener" className="btn-fox"
                style={{ padding: '0.38rem 0.65rem', fontSize: '0.8rem', background: 'var(--fox-dark)', border: 'none' }} title="Live demo">
                <i className="bi bi-play-fill"></i>
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
