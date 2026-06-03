import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { TECH_ICON } from '../lib/tech-icons';
import TypewriterText from './TypewriterText';
import ParticlesBg from './ParticlesBg';

const HERO_TECHS = [
  'Python','JavaScript','TypeScript','Angular','React','Astro',
  'Flask','Node.js','Laravel','MongoDB','MySQL','PostgreSQL',
  'Flutter','Dart','Docker','Tailwind CSS','Jupyter Notebook','Blade',
];

const STATS = [
  { val: 3, suffix: '+', label: 'Años exp.' },
  { val: 13, suffix: '+', label: 'Proyectos' },
  { val: 20, suffix: '+', label: 'Tecnologías' },
];

function AnimatedCounter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      obs.disconnect();
      let start = 0;
      const step = Math.ceil(target / 40);
      const timer = setInterval(() => {
        start = Math.min(start + step, target);
        setCount(start);
        if (start >= target) clearInterval(timer);
      }, 40);
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target]);

  return (
    <div ref={ref} style={{ fontWeight: 800, color: 'var(--fox)', fontSize: '2rem', lineHeight: 1 }}>
      {count}{suffix}
    </div>
  );
}

function TechPill({ tech }: { tech: string }) {
  const icon = TECH_ICON[tech];
  return (
    <motion.span
      whileHover={{ scale: 1.08, y: -2 }}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: '8px', padding: '0.3rem 0.65rem',
        fontSize: '0.75rem', fontWeight: 600, color: 'var(--text)',
        cursor: 'default', whiteSpace: 'nowrap', transition: 'border-color 0.2s, box-shadow 0.2s',
      }}
      onHoverStart={e => {
        const el = (e as any).currentTarget as HTMLElement;
        el.style.borderColor = 'var(--fox)';
        el.style.boxShadow = '0 0 8px var(--fox-glow)';
      }}
      onHoverEnd={e => {
        const el = (e as any).currentTarget as HTMLElement;
        el.style.borderColor = 'var(--border)';
        el.style.boxShadow = 'none';
      }}
    >
      {icon
        ? <img src={icon} alt={tech} width={15} height={15} style={{ objectFit: 'contain', flexShrink: 0 }} />
        : <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--fox)', flexShrink: 0 }}></span>
      }
      {tech}
    </motion.span>
  );
}

export default function HeroSection() {
  const [lang, setLang] = useState('es');
  useEffect(() => {
    setLang(document.documentElement.getAttribute('data-lang') ?? 'es');
    const obs = new MutationObserver(() => {
      setLang(document.documentElement.getAttribute('data-lang') ?? 'es');
    });
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-lang'] });
    return () => obs.disconnect();
  }, []);

  return (
    <section style={{ padding: '3.5rem 0 2rem', borderBottom: '1px solid var(--border)', position: 'relative', overflow: 'hidden' }}>
      <ParticlesBg />

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem', position: 'relative', zIndex: 1 }}>
        <div className="hero-grid" style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '3rem', alignItems: 'center' }}>

          {/* LEFT */}
          <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <motion.p
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              style={{ letterSpacing: '3px', fontSize: '0.7rem', color: 'var(--fox)', fontWeight: 700, marginBottom: '0.75rem' }}
            >
              ◈ FULL STACK DEVELOPER · DATA SCIENCE · MOBILE ◈
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              style={{ fontSize: 'clamp(1.8rem, 4.5vw, 3rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: '0.5rem' }}
            >
              {lang === 'en' ? 'Hi, I\'m' : 'Hola, soy'}<br />
              <span style={{ color: 'var(--fox)' }}>David Garcia</span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.28 }}
              style={{ fontSize: '1.1rem', marginBottom: '0.5rem', minHeight: '1.6rem' }}
            >
              <TypewriterText lang={lang} />
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
              style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1.25rem' }}
            >
              <span style={{ color: 'var(--fox)', fontWeight: 700 }}>@Sagiii</span> · Huancayo, Perú 🇵🇪 ·
              BSc. Data Science · CFU · Téc. Diseño de Software · TECSUP · CAPM · PMI
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}
              style={{ color: 'var(--text-muted)', lineHeight: 1.9, maxWidth: '540px', marginBottom: '1.5rem', fontSize: '0.91rem' }}
            >
              {lang === 'en'
                ? 'Technical professional with 3+ years building web systems, e-commerce platforms, mobile apps and data solutions. I help Peruvian businesses digitize, automate and grow with technology that actually works.'
                : 'Profesional técnico con más de 3 años construyendo sistemas web, plataformas e-commerce, apps móviles y soluciones de datos. Ayudo a empresas peruanas a digitalizarse, automatizar y crecer con tecnología que realmente funciona.'}
            </motion.p>

            {/* Tech pills */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.42 }}
              style={{ display: 'flex', flexWrap: 'wrap', gap: '0.38rem', marginBottom: '1.75rem' }}
            >
              {HERO_TECHS.map((t, i) => (
                <motion.div key={t} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.46 + i * 0.035 }}>
                  <TechPill tech={t} />
                </motion.div>
              ))}
            </motion.div>

            {/* CTAs */}
            <motion.div
              style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem' }}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.82 }}
            >
              <a href="/projects" className="btn-fox" style={{ padding: '0.6rem 1.4rem' }}>
                <i className="bi bi-grid-fill"></i> {lang === 'en' ? 'Projects' : 'Ver Proyectos'}
              </a>
              <a href="/about" className="btn-outline-fox" style={{ padding: '0.6rem 1.2rem' }}>
                <i className="bi bi-person-fill"></i> {lang === 'en' ? 'About me' : 'Sobre mí'}
              </a>
              <a href="/contact" className="btn-outline-fox" style={{ padding: '0.6rem 1.2rem' }}>
                <i className="bi bi-envelope-fill"></i> {lang === 'en' ? 'Contact' : 'Contacto'}
              </a>
              <a
                href="https://www.linkedin.com/in/david-adolfo-garcia-giron-3205322b6/"
                target="_blank" rel="noopener"
                style={{ padding: '0.6rem 1rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', border: '1px solid #0A66C2', color: '#0A66C2', borderRadius: '8px', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem', transition: 'background 0.2s' }}
                onMouseOver={e => (e.currentTarget.style.background = 'rgba(10,102,194,0.12)')}
                onMouseOut={e => (e.currentTarget.style.background = 'transparent')}
              >
                <i className="bi bi-linkedin"></i> LinkedIn
              </a>
              <a href="/cv-david-garcia.pdf" download
                className="btn-outline-fox" style={{ padding: '0.6rem 1rem' }}
                title={lang === 'en' ? 'Download CV' : 'Descargar CV'}>
                <i className="bi bi-file-earmark-arrow-down"></i> CV
              </a>
            </motion.div>
          </motion.div>

          {/* RIGHT: Avatar */}
          <motion.div
            className="hero-avatar"
            style={{ textAlign: 'center', minWidth: '280px' }}
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.15 }}
          >
            <div style={{ position: 'relative', display: 'inline-block', marginBottom: '1.5rem' }}>
              <motion.div
                className="avatar-glow"
                style={{ width: '300px', height: '300px', borderRadius: '50%', border: '3px solid var(--fox)', overflow: 'hidden', margin: 'auto' }}
                whileHover={{ scale: 1.03 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <img src="/img/FOX2.jpg" alt="David Adolfo Garcia Giron"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.7, type: 'spring' }}
                style={{ position: 'absolute', bottom: '18px', right: '10px', background: 'var(--fox)', borderRadius: '20px', padding: '5px 14px', fontSize: '0.75rem', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
              >
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#4ade80', animation: 'pulse-dot 1.5s ease-in-out infinite' }}></span>
                {lang === 'en' ? 'Available' : 'Disponible'}
              </motion.div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.65rem' }}>
              {STATS.map((s, i) => (
                <motion.div key={s.label} className="card" style={{ padding: '0.9rem 0.5rem', textAlign: 'center' }}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 + i * 0.1 }}>
                  <AnimatedCounter target={s.val} suffix={s.suffix} />
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.62rem', marginTop: '0.3rem', lineHeight: 1.3 }}>{s.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>

      <style>{`
        @keyframes pulse-dot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.6;transform:scale(1.3)} }
        @media (max-width: 860px) {
          .hero-grid { grid-template-columns: 1fr !important; }
          .hero-avatar { min-width: auto !important; }
          .hero-avatar > div > div { width: 200px !important; height: 200px !important; }
        }
      `}</style>
    </section>
  );
}
