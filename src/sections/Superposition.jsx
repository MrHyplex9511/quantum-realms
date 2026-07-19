import { useState } from 'react'
import { motion } from 'framer-motion'
import QuantumCard from '../components/QuantumCard'
import AnimatedText from '../components/AnimatedText'
import GradualBlur from '../components/reactbits/GradualBlur'

const sphereStyle = {
  width: 120,
  height: 120,
  borderRadius: '50%',
  background: 'linear-gradient(135deg, #ffffff, #888888)',
  animation: 'spin3d 4s linear infinite',
  margin: '0 auto 32px',
  boxShadow: '0 0 60px rgba(255,255,255,0.15), 0 0 120px rgba(128,128,128,0.1)',
}

const boxStyle = {
  width: 100,
  height: 100,
  border: '2px solid rgba(255,255,255,0.4)',
  borderRadius: 12,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 48,
  cursor: 'pointer',
  background: 'rgba(255,255,255,0.08)',
  transition: 'all 0.3s',
  userSelect: 'none',
  margin: '24px auto 0',
}

const keyframesStyle = `
@keyframes spin3d {
  0% { transform: perspective(400px) rotateY(0deg) rotateX(10deg); }
  50% { transform: perspective(400px) rotateY(180deg) rotateX(-10deg); }
  100% { transform: perspective(400px) rotateY(360deg) rotateX(10deg); }
}`

const cardStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  gap: 24,
  marginTop: 48,
}

export default function Superposition() {
  const [boxState, setBoxState] = useState('❓')
  const [clickCount, setClickCount] = useState(0)

  const handleOpenBox = () => {
    setClickCount((c) => c + 1)
    const outcomes = ['😸', '💀', '😸', '💀', '🐈', '❓']
    setBoxState(outcomes[Math.floor(Math.random() * outcomes.length)])
  }

  return (
    <section id="superposition" style={{ position: 'relative', overflow: 'hidden' }}>
      <style>{keyframesStyle}</style>
      <GradualBlur position="bottom" height="10rem" strength={3} opacity={0.5} />
      <motion.div
        className="section-container"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6 }}
      >
        <div style={{ textAlign: 'center' }}>
          <motion.div
            style={sphereStyle}
            initial={{ scale: 0, rotateY: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 100, damping: 12 }}
          />
        </div>

        <AnimatedText className="section-title" delay={0.04} direction="up">
          Superposition
        </AnimatedText>
        <motion.p
          className="section-subtitle"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          A quantum system exists in all possible states simultaneously — until
          you measure it. Schrödinger's cat was meant to show how absurd this
          sounds, but superposition is real and experimentally verified.
        </motion.p>

        <div style={cardStyle}>
          <QuantumCard title="🐱 Cat Analogy" gradient="cyan" icon="📦">
            A cat in a sealed box with a radioactive trigger is both alive AND
            dead until you open it. The cat itself isn't quantum — but the thought
            experiment captures how superposition defies everyday intuition.
          </QuantumCard>

          <QuantumCard title="⚛️ Quantum States" gradient="purple" icon="|0⟩ + |1⟩">
            A qubit is written as |ψ⟩ = α|0⟩ + β|1⟩. Until measured, it's a blend
            of both basis states. The coefficients α and β encode the probability
            of finding each outcome — and they can be complex numbers.
          </QuantumCard>

          <QuantumCard title="📏 Measurement Problem" gradient="cyan-purple" icon="🔍">
            Why does superposition collapse when we look? Nobody knows. The
            Copenhagen interpretation says measurement forces nature to pick one
            outcome. Many-worlds says both outcomes branch into parallel realities.
          </QuantumCard>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.5 }}
          style={{ textAlign: 'center', marginTop: 40 }}
        >
          <p style={{ color: '#888888', fontSize: 14, marginBottom: 8 }}>
            Open the box — what's inside? (Clicked {clickCount} times)
          </p>
          <div
            style={boxStyle}
            onClick={handleOpenBox}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#ffffff'; e.currentTarget.style.background = 'rgba(255,255,255,0.15)' }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)'; e.currentTarget.style.background = 'rgba(255,255,255,0.08)' }}
          >
            <motion.span
              key={boxState}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 10 }}
            >
              {boxState}
            </motion.span>
          </div>
          <p style={{ color: '#666666', fontSize: 12, marginTop: 8, fontStyle: 'italic' }}>
            Each click "measures" the state — superposition collapses randomly
          </p>
        </motion.div>
      </motion.div>
    </section>
  )
}
