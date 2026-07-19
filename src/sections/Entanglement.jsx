import { motion } from 'framer-motion'
import MagnetLines from '../components/reactbits/MagnetLines'
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
  background: 'linear-gradient(135deg, rgba(128,128,128,0.12), rgba(255,255,255,0.05))',
  borderRadius: 12,
  borderLeft: '3px solid #ffffff',
  fontSize: 15,
  color: '#cccccc',
  lineHeight: 1.6,
  textAlign: 'center',
}

export default function Entanglement() {
  return (
    <section id="entanglement" style={{ position: 'relative', overflow: 'hidden', minHeight: '100vh' }}>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        opacity: 0.4
      }}>
        <MagnetLines rows={12} columns={12} lineColor="#ffffff" lineWidth="2px" lineHeight="50px" />
      </div>
      <motion.div
        className="section-container"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6 }}
      >
        <AnimatedText className="section-title" delay={0.04} direction="up">
          Quantum Entanglement
        </AnimatedText>
        <motion.p
          className="section-subtitle"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          When two particles become entangled, their quantum states are linked —
          measuring one instantly determines the other, no matter how far apart.
          Einstein called it "spooky action at a distance," but experiments prove
          it's real.
        </motion.p>

        <div style={cardStyle}>
          <QuantumCard title="🧠 EPR Paradox" gradient="cyan" icon="⚖️">
            Einstein, Podolsky, and Rosen argued entanglement meant quantum theory
            was incomplete — some "hidden variables" must explain the correlation.
            They believed nothing could travel faster than light.
          </QuantumCard>

          <QuantumCard title="📐 Bell's Theorem" gradient="purple" icon="🔢">
            John Bell proved mathematically that any hidden-variable theory must
            obey certain inequalities. Quantum mechanics violates them.
            Experiments by Alain Aspect confirmed — nature really is non-local.
          </QuantumCard>

          <QuantumCard title="💻 Quantum Computing" gradient="cyan-purple" icon="🖥️">
            Entanglement is the resource that gives quantum computers their power.
            It enables quantum teleportation, super-dense coding, and error
            correction. Without it, quantum computing would just be exotic math.
          </QuantumCard>
        </div>

        <motion.div
          style={factStyle}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <span style={{ fontSize: 24, marginRight: 12 }}>💡</span>
          <strong>Fun fact:</strong> Einstein called entanglement
          {' '}<em style={{ color: '#ffffff' }}>"spukhafte Fernwirkung"</em>{' '}
          — "spooky action at a distance." He was convinced it couldn't be real,
          but it powers the quantum internet being built today.
        </motion.div>
      </motion.div>
    </section>
  )
}
