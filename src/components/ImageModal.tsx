import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  src: string;
  alt: string;
  style?: React.CSSProperties;
}

export default function ImageModal({ src, alt, style }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <img
        src={src} alt={alt}
        style={{ ...style, cursor: 'zoom-in' }}
        onClick={() => setOpen(true)}
        loading="lazy"
      />

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            style={{
              position: 'fixed', inset: 0, zIndex: 9998,
              background: 'rgba(0,0,0,0.92)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '1.5rem', cursor: 'zoom-out',
            }}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 280, damping: 24 }}
              onClick={e => e.stopPropagation()}
              style={{ position: 'relative', maxWidth: '92vw', maxHeight: '88vh' }}
            >
              <img src={src} alt={alt}
                style={{ maxWidth: '92vw', maxHeight: '85vh', objectFit: 'contain', borderRadius: '12px', border: '2px solid rgba(232,101,26,0.4)' }}
              />
              <button onClick={() => setOpen(false)}
                style={{
                  position: 'absolute', top: '-14px', right: '-14px',
                  width: '32px', height: '32px', borderRadius: '50%',
                  background: 'var(--fox)', border: 'none', color: '#fff',
                  cursor: 'pointer', fontWeight: 700, fontSize: '1rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>✕</button>
              <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', fontSize: '0.78rem', marginTop: '0.75rem' }}>{alt}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
