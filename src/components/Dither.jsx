import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import './Dither.css'

function DitherScene({ waveSpeed, waveFrequency, waveAmplitude, waveColor }) {
  const meshRef = useRef(null)

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.material.uniforms.uTime.value = clock.getElapsedTime()
    }
  })

  const uniforms = {
    uTime: { value: 0 },
    uSpeed: { value: waveSpeed },
    uFrequency: { value: waveFrequency },
    uAmplitude: { value: waveAmplitude },
    uColor: { value: new THREE.Color(waveColor[0], waveColor[1], waveColor[2]) },
  }

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[12, 8]} />
      <shaderMaterial
        vertexShader={`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          precision highp float;
          varying vec2 vUv;
          uniform float uTime;
          uniform float uSpeed;
          uniform float uFrequency;
          uniform float uAmplitude;
          uniform vec3 uColor;

          void main() {
            float t = uTime * uSpeed;
            float wave = sin(vUv.x * uFrequency + t) * cos(vUv.y * uFrequency * 0.8 + t * 1.3);
            wave = wave * uAmplitude + 0.5;

            float dither = floor(vUv.x * 4.0 + vUv.y * 4.0 + t * 0.5) / 4.0;
            float v = wave * 0.7 + dither * 0.3;

            gl_FragColor = vec4(uColor * v, v);
          }
        `}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </mesh>
  )
}

export default function Dither({ waveSpeed = 0.05, waveFrequency = 3, waveAmplitude = 0.3, waveColor = [0.5, 0.5, 0.5], colorNum = 4, pixelSize = 2, className = '' }) {
  return (
    <div className={`dither-container ${className}`}>
      <Canvas dpr={1} camera={{ position: [0, 0, 6] }} gl={{ alpha: true }}>
        <DitherScene waveSpeed={waveSpeed} waveFrequency={waveFrequency} waveAmplitude={waveAmplitude} waveColor={waveColor} />
      </Canvas>
    </div>
  )
}
