import { motion } from 'framer-motion'
import TunnelCanvas from '../components/TunnelCanvas'
import QuantumCard from '../components/QuantumCard'
import AnimatedText from '../components/AnimatedText'

const cardStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  gap: 24,
  marginTop: 48,
}

const factStyle = {
  marginTop: 48,
  padding: '20px 24px',
  background: 'linear-gradient(135deg, rgba(0,240,255,0.1), rgba(34,197,94,0.08))',
  borderRadius: 12,
  borderLeft: '3px solid #34d399',
  fontSize: 15,
  color: '#86efac',
  lineHeight: 1.6,
  textAlign: 'center',
}

export default function Tunneling() {
  return (
    <section id="tunneling" style={{ position: 'relative', overflow: 'hidden' }}>
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
          Quantum Tunneling
        </AnimatedText>
        <motion.p
          className="section-subtitle"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          In the quantum world, particles can pass through barriers they shouldn't
          be able to cross classically. The wave function doesn't stop at a wall
          — it leaks through, and sometimes a particle appears on the other side.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.5 }}
          style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <TunnelCanvas height="400px" />
        </motion.div>

        <div style={cardStyle}>
          <QuantumCard
            title="🌀 How It Works"
            gradient="cyan"
            icon="📉"
          >
            The wave function decays exponentially inside a barrier but doesn't
            reach zero. If the barrier is thin enough, some probability leaks
            through. The particle doesn't "dig through" — it appears on the far
            side without ever being inside the barrier.
          </QuantumCard>

          <QuantumCard
            title="🔬 Real Applications"
            gradient="purple"
            icon="⚛️"
          >
            Scanning Tunneling Microscopes (STM) image individual atoms by
            measuring the tunneling current between a sharp tip and a surface.
            Nuclear fusion in stars relies on protons tunneling through their
            mutual electrostatic repulsion.
          </QuantumCard>

          <QuantumCard
            title="💾 Flash Drives"
            gradient="cyan-purple"
            icon="💿"
          >
            USB flash memory and SSD storage use floating-gate transistors where
            electrons tunnel through a thin oxide layer to store data. The layer
            is intentionally thin enough to allow tunneling but thick enough to
            retain charge for years.
          </QuantumCard>
        </div>

        <motion.div
          style={factStyle}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <span style={{ fontSize: 24, marginRight: 12 }}>💡</span>
          <strong>Fun fact:</strong> Every modern computer chip has transistors
          that rely on quantum tunneling. If tunneling didn't exist, neither
          would your smartphone.
        </motion.div>
      </motion.div>
    </section>
  )
}
