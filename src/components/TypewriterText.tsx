import { useEffect, useState } from 'react';

const PHRASES: Record<string, string[]> = {
  es: [
    'DESARROLLADOR FULL STACK',
    'CIENCIA DE DATOS',
    'INGENIERO DE SISTEMAS',
    'FREELANCER INDEPENDIENTE',
    'APASIONADO POR LA TECNOLOGÍA 🦊',
  ],
  en: [
    'Full Stack Developer',
    'Data Scientist',
    'Systems Integrator',
    'Independent Freelancer',
    'Technology enthusiast 🦊',
  ],
};

export default function TypewriterText({ lang = 'es' }: { lang?: string }) {
  const phrases = PHRASES[lang] ?? PHRASES.es;
  const [displayed, setDisplayed] = useState('');
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const phrase = phrases[phraseIdx];
    let delay = deleting ? 40 : 80;

    if (!deleting && charIdx === phrase.length) {
      delay = 2200;
    } else if (deleting && charIdx === 0) {
      setDeleting(false);
      setPhraseIdx((i) => (i + 1) % phrases.length);
      return;
    }

    const t = setTimeout(() => {
      if (!deleting && charIdx < phrase.length) {
        setDisplayed(phrase.slice(0, charIdx + 1));
        setCharIdx((c) => c + 1);
      } else if (charIdx === phrase.length && !deleting) {
        setDeleting(true);
      } else if (deleting) {
        setDisplayed(phrase.slice(0, charIdx - 1));
        setCharIdx((c) => c - 1);
      }
    }, delay);

    return () => clearTimeout(t);
  }, [charIdx, deleting, phraseIdx, phrases]);

  return (
    <span style={{ color: 'var(--fox)', fontWeight: 700 }}>
      {displayed}
      <span
        style={{
          display: 'inline-block',
          width: '2px',
          height: '1.1em',
          background: 'var(--fox)',
          marginLeft: '2px',
          verticalAlign: 'text-bottom',
          animation: 'cursor-blink 0.8s step-end infinite',
        }}
      ></span>
      <style>{`@keyframes cursor-blink { 0%,100%{opacity:1} 50%{opacity:0} }`}</style>
    </span>
  );
}
