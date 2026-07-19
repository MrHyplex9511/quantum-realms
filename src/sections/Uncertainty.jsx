import { motion } from 'framer-motion'
import UncertaintyCanvas from '../components/UncertaintyCanvas'
import QuantumCard from '../components/QuantumCard'
import AnimatedText from '../components/AnimatedText'

const cardStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  gap: 24,
  marginTop: 48,
}

const formulaStyle = {
  textAlign: 'center',
  padding: '32px 24px',
  marginTop: 48,
  background: 'rgba(15,15,42,0.6)',
  borderRadius: 16,
  border: '1px solid rgba(0,240,255,0.15)',
}

export default function Uncertainty() {
  return (
    <section id="uncertainty" style={{ position: 'relative', overflow: 'hidden' }}>
      <motion.div
        className="section-container"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6 }}
      >
        <AnimatedText
          className="section-title"
          delay={0.04}
          direction="up"
        >
          Uncertainty Principle
        </AnimatedText>
        <motion.p
          className="section-subtitle"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Heisenberg's Uncertainty Principle says you cannot simultaneously know
          a particle's exact position and momentum. The more precisely you pin down
          one, the less you know about the other. It's not a limit of your
          instruments — it's a law of nature.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.5 }}
          style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div style={{ height: 400, position: 'relative' }}>
            <UncertaintyCanvas height="400px" />
          </div>
          <div style={{ textAlign: 'center', padding: '10px 16px', background: 'rgba(15,15,42,0.4)', fontSize: 12, color: '#64748b' }}>
            Drag the slider to see the trade-off — narrow position (top) means broad momentum (bottom)
          </div>
        </motion.div>

        <div style={cardStyle}>
          <QuantumCard
            title="🔄 The Trade-off"
            gradient="cyan"
            icon="⚡"
          >
            Δx·Δp ≥ ℏ/2. Localizing a wave packet (small Δx) requires many
            wavelengths, which means a wide spread of momenta (large Δp). This
            isn't a measurement flaw — it's a mathematical consequence of wave
            behavior.
          </QuantumCard>

          <QuantumCard
            title="🌊 Everyday Analogy"
            gradient="purple"
            icon="💧"
          >
            A short pulse in a pond has a well-defined location but a messy mix
            of ripples (many momenta). A long, smooth wave has a single
            wavelength (precise momentum) but no definite location. Same trade-off.
          </QuantumCard>

          <QuantumCard
            title="🧠 Not About Measurement"
            gradient="cyan-purple"
            icon="🔬"
          >
            Contrary to popular myth, Heisenberg's principle isn't about your
            detector disturbing the particle. The uncertainty is baked into the
            wave function itself — the particle doesn't even have a simultaneous
            position and momentum.
          </QuantumCard>
        </div>

        <motion.div
          style={formulaStyle}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 28, color: '#00f0ff', letterSpacing: 2 }}>
            Δx · Δp ≥ ℏ / 2
          </span>
          <p style={{ color: '#94a3b8', fontSize: 13, marginTop: 12 }}>
            The product of position uncertainty and momentum uncertainty can never be less than half of ℏ
          </p>
        </motion.div>
      </motion.div>
    </section>
  )
}
