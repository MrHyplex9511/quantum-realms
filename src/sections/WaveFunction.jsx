import { motion } from 'framer-motion'
import QuantumCard from '../components/QuantumCard'
import AnimatedText from '../components/AnimatedText'
import GradientBlinds from '../components/reactbits/GradientBlinds'
import useInView from '../hooks/useInView'

const keyframesStyle = `
@keyframes cloudPulse {
  0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.6; }
  25% { transform: scale(1.1) rotate(90deg); opacity: 0.8; }
  50% { transform: scale(0.95) rotate(180deg); opacity: 0.5; }
  75% { transform: scale(1.05) rotate(270deg); opacity: 0.7; }
}

@keyframes particleOrbit {
  0% { transform: rotate(0deg) translateX(60px) rotate(0deg); }
  100% { transform: rotate(360deg) translateX(60px) rotate(-360deg); }
}

@keyframes particleOrbit2 {
  0% { transform: rotate(120deg) translateX(45px) rotate(-120deg); }
  100% { transform: rotate(480deg) translateX(45px) rotate(-480deg); }
}

@keyframes particleOrbit3 {
  0% { transform: rotate(240deg) translateX(50px) rotate(-240deg); }
  100% { transform: rotate(600deg) translateX(50px) rotate(-600deg); }
}

@keyframes glowPulse {
  0%, 100% { box-shadow: 0 0 30px rgba(255,255,255,0.1), 0 0 60px rgba(128,128,128,0.05); }
  50% { box-shadow: 0 0 50px rgba(255,255,255,0.2), 0 0 100px rgba(128,128,128,0.1); }
}
`

const cloudContainer = {
  position: 'relative',
  width: 180,
  height: 180,
  margin: '0 auto 32px',
}

const cloudCore = {
  position: 'absolute',
  inset: '20%',
  borderRadius: '50%',
  background: 'radial-gradient(circle, rgba(255,255,255,0.2), rgba(128,128,128,0.1), transparent)',
  animation: 'cloudPulse 6s ease-in-out infinite, glowPulse 3s ease-in-out infinite',
}

const dotCommon = {
  position: 'absolute',
  width: 8,
  height: 8,
  borderRadius: '50%',
  top: '50%',
  left: '50%',
  marginTop: -4,
  marginLeft: -4,
}

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
  background: 'rgba(255,255,255,0.03)',
  borderRadius: 16,
  border: '1px solid rgba(255,255,255,0.1)',
}

const factStyle = {
  marginTop: 48,
  padding: '20px 24px',
  background: 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(204,204,204,0.05))',
  borderRadius: 12,
  borderLeft: '3px solid #cccccc',
  fontSize: 15,
  color: '#cccccc',
  lineHeight: 1.6,
  textAlign: 'center',
}

export default function WaveFunction() {
  const particles = [
    { color: '#ffffff', size: 6, anim: 'particleOrbit', delay: '0s' },
    { color: '#cccccc', size: 5, anim: 'particleOrbit2', delay: '0.5s' },
    { color: '#999999', size: 4, anim: 'particleOrbit3', delay: '1s' },
    { color: '#aaaaaa', size: 5, anim: 'particleOrbit', delay: '0.3s' },
    { color: '#666666', size: 4, anim: 'particleOrbit2', delay: '0.8s' },
    { color: '#888888', size: 6, anim: 'particleOrbit3', delay: '1.5s' },
    { color: '#ffffff', size: 4, anim: 'particleOrbit', delay: '1.2s' },
    { color: '#cccccc', size: 5, anim: 'particleOrbit2', delay: '0.1s' },
  ]

  const [sectionRef, sectionNear] = useInView(0, '1000px');

  return (
    <section id="wave-function" ref={sectionRef} style={{ position: 'relative', overflow: 'hidden' }}>
      <style>{keyframesStyle}</style>
      {sectionNear && (
        <GradientBlinds
          gradientColors={['#ffffff', '#222222', '#555555', '#222222']}
          noise={0.05}
          blindCount={16}
          spotlightRadius={0.4}
          spotlightSoftness={1.2}
          spotlightOpacity={0.25}
          mixBlendMode="screen"
        />
      )}
      <motion.div
        className="section-container"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6 }}
      >
        <div style={{ textAlign: 'center' }}>
          <motion.div
            style={cloudContainer}
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 80, damping: 10 }}
          >
            <div style={cloudCore} />
            {particles.map((p, i) => (
              <div
                key={i}
                style={{
                  ...dotCommon,
                  width: p.size,
                  height: p.size,
                  marginTop: -p.size / 2,
                  marginLeft: -p.size / 2,
                  background: p.color,
                  borderRadius: '50%',
                  animation: `${p.anim} ${3 + (i % 2) * 2}s linear infinite`,
                  animationDelay: p.delay,
                  boxShadow: `0 0 10px ${p.color}`,
                }}
              />
            ))}
          </motion.div>
        </div>

        <AnimatedText className="section-title" delay={0.04} direction="up">
          Wave Function
        </AnimatedText>
        <motion.p
          className="section-subtitle"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          The wave function (psi) is the central object of quantum mechanics.
          It encodes every possible thing you could know about a quantum system.
          How it spreads, collapses, and evolves is described by some of the most
          elegant mathematics ever discovered.
        </motion.p>

        <div style={cardStyle}>
          <QuantumCard title="📊 Born Rule" gradient="cyan" icon="∫">
            The probability of finding a particle at a given location is the
            square of the wave function's magnitude: P = |psi|^2. Max Born
            realized psi itself isn't real — only |psi|^2 corresponds to something
            we can measure.
          </QuantumCard>

          <QuantumCard title="💥 Collapse" gradient="purple" icon="⚡">
            Before measurement, psi spreads across space like a ripple. Upon
            measurement, it instantly "collapses" to a single location. The
            collapse isn't described by the Schrödinger equation — it's an
            added rule, and physicists still debate what it means.
          </QuantumCard>

          <QuantumCard title="📈 Schrödinger Equation" gradient="cyan-purple" icon="📐">
            The Schrödinger equation tells you how psi evolves in time. It's a
            wave equation that describes the smooth, deterministic evolution of
            the wave function between measurements. Everything quantum flows
            from this equation.
          </QuantumCard>
        </div>

        <motion.div
          style={formulaStyle}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 24, color: '#ffffff', letterSpacing: 1 }}>
            iℏ ∂/∂t |ψ⟩ = Ĥ |ψ⟩
          </span>
          <p style={{ color: '#888888', fontSize: 13, marginTop: 12 }}>
            The time-dependent Schrödinger equation — the fundamental law of quantum evolution
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 12, fontSize: 12, color: '#666666' }}>
            <span>i = √−1</span>
            <span>ℏ = h / 2π</span>
            <span>Ĥ = energy operator</span>
          </div>
        </motion.div>

        <motion.div
          style={factStyle}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <span style={{ fontSize: 24, marginRight: 12 }}>💡</span>
          <strong>Fun fact:</strong> The wave function contains ALL possible
          information about a quantum system — positions, momenta, energies,
          spins, and more. In principle, the entire future of a quantum system
          is encoded in its initial psi.
        </motion.div>
      </motion.div>
    </section>
  )
}
