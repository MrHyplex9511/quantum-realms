import { motion } from 'framer-motion';

const gradients = {
  'cyan-purple': 'linear-gradient(135deg, rgba(0,240,255,0.15), rgba(168,85,247,0.15))',
  cyan: 'linear-gradient(135deg, rgba(0,240,255,0.15), rgba(0,240,255,0.05))',
  purple: 'linear-gradient(135deg, rgba(168,85,247,0.15), rgba(168,85,247,0.05))',
};

const borderGradients = {
  'cyan-purple': 'linear-gradient(135deg, #00f0ff, #a855f7)',
  cyan: 'linear-gradient(135deg, #00f0ff, #00f0ff)',
  purple: 'linear-gradient(135deg, #a855f7, #a855f7)',
};

export default function QuantumCard({ children, title, icon, gradient = 'cyan-purple', className = '' }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02, y: -4 }}
      style={{
        background: gradients[gradient] || gradients['cyan-purple'],
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderRadius: 16,
        padding: '1.5rem',
        border: '1px solid rgba(255,255,255,0.08)',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'default',
        transition: 'border-color 0.3s',
      }}
    >
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 16,
          padding: 1,
          background: borderGradients[gradient] || borderGradients['cyan-purple'],
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
          opacity: 0,
          transition: 'opacity 0.3s',
        }}
        whileHover={{ opacity: 0.6 }}
      />
      {icon && <div style={{ fontSize: 28, marginBottom: 12, lineHeight: 1 }}>{icon}</div>}
      {title && (
        <h3 style={{ margin: '0 0 8px', fontSize: 18, fontWeight: 600, color: '#e2e8f0' }}>
          {title}
        </h3>
      )}
      <div style={{ color: '#94a3b8', fontSize: 14, lineHeight: 1.6 }}>{children}</div>
    </motion.div>
  );
}
