import { MotionConfig, motion } from 'framer-motion';

const charVariants = {
  hidden: (dir) => ({
    y: dir === 'up' ? 40 : -40,
    opacity: 0,
  }),
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 150, damping: 12 },
  },
};

export default function AnimatedText({ children, className = '', delay = 0.1, direction = 'up' }) {
  const text = String(children);
  const chars = text.split('');

  return (
    <MotionConfig reducedMotion="user">
      <span className={className} style={{ display: 'inline', whiteSpace: 'pre-wrap' }}>
        {chars.map((char, i) => (
          <motion.span
            key={i}
            custom={direction}
            variants={charVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: i * delay }}
            style={{ display: 'inline-block' }}
          >
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        ))}
      </span>
    </MotionConfig>
  );
}
