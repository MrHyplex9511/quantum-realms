import './GradualBlur.css'

export default function GradualBlur({ position = 'bottom', strength = 2, height = '8rem', divCount = 5, opacity = 1, className = '' }) {
  return (
    <div
      className={`gradual-blur ${position === 'top' ? 'from-top' : ''} ${className}`}
      style={{ height, opacity }}
    >
      {Array.from({ length: divCount }, (_, i) => {
        const t = (i + 1) / divCount
        return (
          <div
            key={i}
            className="blur-layer"
            style={{
              backdropFilter: `blur(${t * strength}px)`,
              WebkitBackdropFilter: `blur(${t * strength}px)`,
            }}
          />
        )
      })}
    </div>
  )
}
