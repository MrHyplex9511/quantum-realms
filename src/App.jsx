import { useEffect } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import Navbar from './components/Navbar'
import ParticleField from './components/ParticleField'
import Hero from './sections/Hero'
import WaveParticleDuality from './sections/WaveParticleDuality'
import Superposition from './sections/Superposition'
import Entanglement from './sections/Entanglement'
import Uncertainty from './sections/Uncertainty'
import Tunneling from './sections/Tunneling'
import QuantumFields from './sections/QuantumFields'
import WaveFunction from './sections/WaveFunction'

function App() {
  const { scrollYProgress } = useScroll()
  const scaleY = useSpring(scrollYProgress, { stiffness: 100, damping: 30 })

  const spacer = <div className="section-spacer" />

  return (
    <>
      <ParticleField />
      <Navbar />

      {/* Progress bar */}
      <motion.div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: 'linear-gradient(90deg, #ffffff, #888888)',
          transformOrigin: '0%',
          scaleX: scaleY,
          zIndex: 1000,
        }}
      />

      <main>
        <Hero />
        {spacer}
        <WaveParticleDuality />
        {spacer}
        <Superposition />
        {spacer}
        <Entanglement />
        {spacer}
        <Uncertainty />
        {spacer}
        <Tunneling />
        {spacer}
        <QuantumFields />
        {spacer}
        <WaveFunction />
        {spacer}
      </main>

      {/* Footer */}
      <footer
        style={{
          textAlign: 'center',
          padding: '40px 24px',
          color: 'var(--text-secondary)',
          fontSize: '0.85rem',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <p>
          Built with curiosity for the quantum-curious.
          <br />
          <span style={{ opacity: 0.6 }}>
            "The universe is not only stranger than we imagine, it is stranger than we can imagine." — J.B.S. Haldane
          </span>
        </p>
        <p style={{ marginTop: 12, opacity: 0.4, fontSize: '0.75rem' }}>
          Quantum Realms &copy; {new Date().getFullYear()}
        </p>
      </footer>
    </>
  )
}

export default App
