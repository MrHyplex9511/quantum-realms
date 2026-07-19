import AnimatedText from '../components/AnimatedText';
import { motion } from 'framer-motion';
import Strands from '../components/reactbits/Strands';
import useInView from '../hooks/useInView';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.3, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
};

const styles = {
  section: {
    position: 'relative',
    minHeight: '100vh',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  overlay: {
    position: 'relative',
    zIndex: 2,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: '2rem',
    maxWidth: '900px',
    width: '100%',
  },
  title: {
    fontSize: 'clamp(3rem, 8vw, 6rem)',
    fontWeight: 900,
    color: '#ffffff',
    lineHeight: 1.1,
    letterSpacing: '-0.02em',
    marginBottom: '1.5rem',
  },
  subtitle: {
    fontSize: 'clamp(1rem, 2.5vw, 1.35rem)',
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 1.7,
    maxWidth: '700px',
    marginBottom: '3rem',
  },
  buttonGroup: {
    display: 'flex',
    gap: '1.25rem',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  primaryBtn: {
    padding: '1rem 2.5rem',
    fontSize: '1.05rem',
    fontWeight: 600,
    color: '#000000',
    border: 'none',
    borderRadius: '50px',
    cursor: 'pointer',
    background: '#ffffff',
  },
  secondaryBtn: {
    padding: '1rem 2.5rem',
    fontSize: '1.05rem',
    fontWeight: 600,
    color: '#ffffff',
    border: '2px solid rgba(255, 255, 255, 0.4)',
    borderRadius: '50px',
    cursor: 'pointer',
    background: 'transparent',
    backdropFilter: 'blur(4px)',
  },
  scrollIndicator: {
    position: 'absolute',
    bottom: '2.5rem',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 2,
    width: '32px',
    height: '32px',
    color: 'rgba(255, 255, 255, 0.5)',
    cursor: 'pointer',
  },
};

function Hero() {
  const [heroRef, heroNear] = useInView(0.1, '1000px');

  const handleScroll = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" ref={heroRef} style={styles.section}>
      <div style={{ position: 'absolute', inset: 0, opacity: 0.3 }}>
        <Strands speed={0.5} opacity={0.3} />
      </div>
      <motion.div
        style={styles.overlay}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} style={{ marginBottom: '1.5rem' }}>
          <h1 style={styles.title}>
            <AnimatedText>Quantum Realms</AnimatedText>
          </h1>
        </motion.div>

        <motion.div variants={itemVariants} style={{ marginBottom: '3rem' }}>
          <p style={styles.subtitle}>
            <AnimatedText>
              Explore the strange world of quantum physics — where particles dance, cats are both alive and dead, and reality is just a wave of probabilities.
            </AnimatedText>
          </p>
        </motion.div>

        <motion.div variants={itemVariants} style={styles.buttonGroup}>
          <motion.button
            style={styles.primaryBtn}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleScroll('wave-particle')}
          >
            Explore the Unknown
          </motion.button>
          <motion.button
            style={styles.secondaryBtn}
            whileHover={{ scale: 1.05, borderColor: '#ffffff' }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleScroll('superposition')}
          >
            Watch Visualization
          </motion.button>
        </motion.div>
      </motion.div>

      <motion.div
        style={styles.scrollIndicator}
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        onClick={() => handleScroll('wave-particle')}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" width="32" height="32">
          <path d="M7 13l5 5 5-5" />
          <path d="M7 6l5 5 5-5" />
        </svg>
      </motion.div>
    </section>
  );
}

export default Hero;
