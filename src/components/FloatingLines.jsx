import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import './FloatingLines.css'

function Lines({ speed, opacity }) {
  const meshRef = useRef(null)

  const posArray = useMemo(() => {
    const pts = []
    const rows = 30
    const cols = 50
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const x = (j / cols) * 8 - 4
        const y = (i / rows) * 6 - 3
        pts.push(x, y, 0)
      }
    }
    return new Float32Array(pts)
  }, [])

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(posArray.slice(), 3))
    const idx = []
    const rows = 30
    const cols = 50
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols - 1; j++) {
        const base = i * cols + j
        idx.push(base, base + 1)
      }
    }
    geo.setIndex(idx)
    return geo
  }, [posArray])

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const pos = meshRef.current.geometry.attributes.position
    const array = pos.array
    const rows = 30
    const cols = 50
    const t = clock.getElapsedTime() * speed

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const idx = (i * cols + j) * 3
        const x = (j / cols) * 8 - 4
        array[idx] = x
        array[idx + 1] = (i / rows) * 6 - 3 + Math.sin(x * 0.5 + t + i * 0.3) * 0.3
        array[idx + 2] = Math.cos(x * 0.3 + t * 0.7 + i * 0.5) * 0.2
      }
    }
    pos.needsUpdate = true
  })

  return (
    <lineSegments ref={meshRef} geometry={geometry}>
      <lineBasicMaterial color="white" transparent opacity={opacity} />
    </lineSegments>
  )
}

export default function FloatingLines({ speed = 1.0, opacity = 0.3, className = '' }) {
  return (
    <div className={`floatinglines-container ${className}`}>
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }} gl={{ alpha: true }}>
        <Lines speed={speed} opacity={opacity} />
      </Canvas>
    </div>
  )
}
