import { motion } from 'framer-motion'
import QuantumFieldCanvas from '../components/QuantumFieldCanvas'
import QuantumCard from '../components/QuantumCard'
import AnimatedText from '../components/AnimatedText'

const cardStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  gap: 24,
  marginTop: 48,
}

const metaphorStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 32,
  marginTop: 48,
  padding: '28px 32px',
  background: 'linear-gradient(135deg, rgba(15,15,42,0.8), rgba(0,240,255,0.05))',
  borderRadius: 16,
  border: '1px solid rgba(0,240,255,0.1)',
  flexWrap: 'wrap',
}

export default function QuantumFields() {
  return (
    <section id="fields" style={{ position: 'relative', overflow: 'hidden' }}>
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
          Quantum Fields
        </AnimatedText>
        <motion.p
          className="section-subtitle"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Beneath everything, there are quantum fields — one for each type of
          particle. The universe isn't filled with particles bouncing around; it's
          filled with fields, and particles are just localized ripples in those
          fields.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.5 }}
          style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <QuantumFieldCanvas height="400px" />
        </motion.div>

        <div style={cardStyle}>
          <QuantumCard
            title="🌌 What Is a Field?"
            gradient="cyan"
            icon="🌊"
          >
            A field is a quantity that has a value everywhere in spacetime.
            Temperature is a field — every point in a room has a temperature.
            Quantum fields are similar, but their values fluctuate and can
            exchange energy quanta, which we call particles.
          </QuantumCard>

          <QuantumCard
            title="✨ Particle Excitations"
            gradient="purple"
            icon="💫"
          >
            When a field is excited at a point, we detect it as a particle.
            An electron is a ripple in the electron field. A photon is a ripple
            in the electromagnetic field. Create enough energy at one spot, and
            a new particle pops into existence from the field.
          </QuantumCard>

          <QuantumCard
            title="📋 Standard Model"
            gradient="cyan-purple"
            icon="🏛️"
          >
            The Standard Model of particle physics is a quantum field theory. It
            describes 17 fundamental fields (12 matter fields + 4 force fields +
            1 Higgs field) whose interactions explain every known particle and
            force except gravity.
          </QuantumCard>
        </div>

        <motion.div
          style={metaphorStyle}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <div style={{ fontSize: 48, flexShrink: 0 }}>🧵</div>
          <div>
            <h4 style={{ color: '#e2e8f0', marginBottom: 8, fontSize: 16 }}>
              The Fabric of Reality
            </h4>
            <p style={{ color: '#94a3b8', fontSize: 14, lineHeight: 1.7 }}>
              Imagine spacetime as an infinite ocean. The water itself is the
              quantum field — always there, always rippling. A particle is like
              a localized wave on that ocean. It looks like a distinct thing,
              but it's really just a feature of the water. The field is the
              fundamental reality; particles are temporary excitations.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
