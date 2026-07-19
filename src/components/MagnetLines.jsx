import { useRef, useEffect, useCallback } from 'react'
import './MagnetLines.css'

export default function MagnetLines({ rows = 9, columns = 9, lineColor = '#ffffff', lineWidth = '2px', lineHeight = '40px', className = '' }) {
  const containerRef = useRef(null)

  const handleMouseMove = useCallback((e) => {
    const container = containerRef.current
    if (!container) return

    const rect = container.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const dx = e.clientX - cx
    const dy = e.clientY - cy
    const angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90

    const lines = container.querySelectorAll('.magnet-line')
    const total = lines.length
    for (let i = 0; i < total; i++) {
      const col = i % columns
      const row = Math.floor(i / columns)
      const rx = (col / Math.max(columns - 1, 1)) * 2 - 1
      const ry = (row / Math.max(rows - 1, 1)) * 2 - 1
      const dist = Math.sqrt(rx * rx + ry * ry)
      const strength = 1 - dist * 0.3
      const finalAngle = angle * Math.max(0, strength)
      lines[i].style.transform = `translate(-50%, -50%) rotate(${finalAngle}deg)`
    }
  }, [columns, rows])

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [handleMouseMove])

  const cells = Array.from({ length: rows * columns }, (_, i) => (
    <div key={i} className="magnet-cell">
      <div
        className="magnet-line"
        style={{
          width: lineWidth,
          height: lineHeight,
          backgroundColor: lineColor,
        }}
      />
    </div>
  ))

  return (
    <div
      ref={containerRef}
      className={`magnet-lines ${className}`}
      style={{
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
      }}
    >
      {cells}
    </div>
  )
}
