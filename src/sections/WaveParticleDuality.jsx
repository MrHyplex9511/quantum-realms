import { motion } from 'framer-motion'
import LineWaves from '../components/reactbits/LineWaves'
import QuantumCard from '../components/QuantumCard'
import AnimatedText from '../components/AnimatedText'

const cardStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  gap: 24,
  marginTop: 48,
}

export default function WaveParticleDuality() {
  return (
    <section id="wave-particle" style={{ position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, opacity: 0.4 }}>
        <LineWaves brightness={0.15} />
      </div>
      <motion.div
        className="section-container"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6 }}
      >
        <AnimatedText className="section-title" delay={0.04} direction="up">
          Wave-Particle Duality
        </AnimatedText>
        <motion.p
          className="section-subtitle"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Light is both a wave AND a particle. This isn't a metaphor — it's the
          discovered nature of reality. The double-slit experiment revealed that
          quantum objects behave as waves when unobserved and particles when measured.
        </motion.p>

        <div style={cardStyle}>
          <QuantumCard title="🌊 Wave Nature" gradient="cyan" icon="〰️">
            Light exhibits interference and diffraction — hallmarks of wave behavior.
            Shine it through two slits and you get alternating bright and dark bands,
            exactly like water waves.
          </QuantumCard>

          <QuantumCard title="⚡ Particle Nature" gradient="purple" icon="💥">
            The photoelectric effect proved light comes in discrete packets (photons).
            Einstein showed each photon carries energy E = hf, kicking electrons off
            metal surfaces only above a threshold frequency.
          </QuantumCard>

          <QuantumCard title="🔬 Double-Slit" gradient="cyan-purple" icon="🧪">
            Fire electrons one-by-one through two slits. Over time, an interference
            pattern builds up — each electron interfered with itself. Add a detector
            to see which slit it goes through, and the pattern vanishes.
          </QuantumCard>
        </div>
      </motion.div>
    </section>
  )
}
