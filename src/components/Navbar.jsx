import { useState, useEffect, useRef } from 'react';
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

export default function Navbar({ className = '' }) {
  const [active, setActive] = useState('hero');
  const [menuOpen, setMenuOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const hideTimeoutRef = useRef(null);

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

    const onMouseMove = (e) => {
      if (e.clientY < 120) {
        // Near top — show navbar immediately
        setVisible(true);
        if (hideTimeoutRef.current) {
          clearTimeout(hideTimeoutRef.current);
          hideTimeoutRef.current = null;
        }
      } else if (e.clientY > 200) {
        // Moved away — hide after short delay
        if (!hideTimeoutRef.current) {
          hideTimeoutRef.current = setTimeout(() => {
            setVisible(false);
            hideTimeoutRef.current = null;
          }, 300);
        }
      }
    };

    const onMouseLeave = () => {
      // Mouse left the page — hide
      setVisible(false);
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = null;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, []);

  const [scrolled, setScrolled] = useState(false);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  const btnBase = {
    background: '#000000',
    border: '1px solid rgba(255,255,255,0.8)',
    color: '#ffffff',
    padding: '6px 16px',
    borderRadius: 20,
    fontSize: 13,
    fontWeight: 500,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    transition: 'all 0.25s',
  };

  const btnActive = {
    ...btnBase,
    background: '#ffffff',
    color: '#000000',
    border: '1px solid #ffffff',
  };

  return (
    <>
      <motion.nav
        className={className}
        initial={{ opacity: 0, y: -60 }}
        animate={{
          opacity: visible ? 1 : 0,
          y: visible ? 0 : -60,
          pointerEvents: visible ? 'auto' : 'none',
        }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
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
          background: scrolled && visible ? 'rgba(0,0,0,0.85)' : 'transparent',
          backdropFilter: scrolled && visible ? 'blur(16px)' : 'none',
          WebkitBackdropFilter: scrolled && visible ? 'blur(16px)' : 'none',
          borderBottom: '1px solid transparent',
          transition: 'background 0.3s, backdrop-filter 0.3s',
        }}
      >
        {/* Desktop links */}
        <div
          style={{ display: 'flex', gap: 8, overflowX: 'auto', scrollbarWidth: 'none' }}
          onMouseEnter={() => {
            // Keep visible while hovering buttons
            if (hideTimeoutRef.current) {
              clearTimeout(hideTimeoutRef.current);
              hideTimeoutRef.current = null;
            }
            setVisible(true);
          }}
        >
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => scrollTo(s.id)}
              style={active === s.id ? btnActive : btnBase}
              onMouseEnter={(e) => {
                if (active !== s.id) {
                  e.target.style.background = 'rgba(255,255,255,0.1)';
                }
              }}
              onMouseLeave={(e) => {
                if (active !== s.id) {
                  e.target.style.background = '#000000';
                }
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
            background: '#000000',
            border: '1px solid rgba(255,255,255,0.8)',
            color: '#ffffff',
            fontSize: 20,
            cursor: 'pointer',
            padding: '4px 12px',
            borderRadius: 8,
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
                background: '#000000',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                zIndex: 201,
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                borderLeft: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              <button
                onClick={() => setMenuOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#ffffff',
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
                    ...btnBase,
                    fontSize: 15,
                    padding: '12px 16px',
                    textAlign: 'left',
                    border: active === s.id ? '1px solid #ffffff' : '1px solid rgba(255,255,255,0.4)',
                    background: active === s.id ? '#ffffff' : '#000000',
                    color: active === s.id ? '#000000' : '#ffffff',
                    borderRadius: 12,
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
