import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SECTIONS = [
  { id: 'hero', label: 'Home' },
  { id: 'wave-particle', label: 'Wave-Particle' },
  { id: 'superposition', label: 'Superposition' },
  { id: 'entanglement', label: 'Entanglement' },
  { id: 'uncertainty', label: 'Uncertainty' },
  { id: 'tunneling', label: 'Tunneling' },
  { id: 'fields', label: 'Fields' },
  { id: 'wave-function', label: 'Wave Function' },
];

const linkStyle = {
  color: '#94a3b8',
  textDecoration: 'none',
  fontSize: 13,
  fontWeight: 500,
  padding: '6px 12px',
  borderRadius: 8,
  transition: 'all 0.2s',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
};

const activeLinkStyle = {
  ...linkStyle,
  color: '#00f0ff',
  background: 'rgba(0,240,255,0.1)',
};

export default function Navbar({ className = '' }) {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('hero');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);

      const sections = SECTIONS.map((s) => {
        const el = document.getElementById(s.id);
        if (!el) return { id: s.id, top: 0 };
        return { id: s.id, top: el.offsetTop - 120 };
      });
      const scrollY = window.scrollY + 10;
      let current = 'hero';
      for (const s of sections) {
        if (scrollY >= s.top) current = s.id;
      }
      setActive(current);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  return (
    <>
      <motion.nav
        className={className}
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 120, damping: 20 }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: '0 24px',
          height: 56,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: scrolled ? 'rgba(10,10,26,0.85)' : 'transparent',
          backdropFilter: scrolled ? 'blur(16px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(16px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
          transition: 'all 0.3s',
        }}
      >
        {/* Desktop links */}
        <div style={{ display: 'flex', gap: 2, overflowX: 'auto', scrollbarWidth: 'none' }}>
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => scrollTo(s.id)}
              style={active === s.id ? activeLinkStyle : linkStyle}
              onMouseEnter={(e) => {
                if (active !== s.id) e.target.style.color = '#e2e8f0';
              }}
              onMouseLeave={(e) => {
                if (active !== s.id) e.target.style.color = '#94a3b8';
              }}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Hamburger (mobile) */}
        <button
          onClick={() => setMenuOpen(true)}
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            color: '#e2e8f0',
            fontSize: 24,
            cursor: 'pointer',
            padding: 8,
            position: 'absolute',
            right: 16,
          }}
          className="mobile-hamburger"
        >
          ☰
        </button>
      </motion.nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0,0,0,0.5)',
                zIndex: 200,
              }}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 200, damping: 25 }}
              style={{
                position: 'fixed',
                top: 0,
                right: 0,
                bottom: 0,
                width: 280,
                background: '#0f0f23',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                zIndex: 201,
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
                borderLeft: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <button
                onClick={() => setMenuOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  fontSize: 24,
                  cursor: 'pointer',
                  alignSelf: 'flex-end',
                  padding: 8,
                }}
              >
                ✕
              </button>
              {SECTIONS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => scrollTo(s.id)}
                  style={{
                    ...linkStyle,
                    fontSize: 15,
                    padding: '12px 16px',
                    textAlign: 'left',
                    background: active === s.id ? 'rgba(0,240,255,0.08)' : 'transparent',
                    color: active === s.id ? '#00f0ff' : '#cbd5e1',
                    border: 'none',
                    borderRadius: 8,
                  }}
                >
                  {s.label}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile hamburger visibility */}
      <style>{`
        @media (max-width: 768px) {
          nav > div { display: none !important; }
          .mobile-hamburger { display: block !important; }
        }
      `}</style>
    </>
  );
}
