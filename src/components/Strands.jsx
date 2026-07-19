import { useEffect, useRef } from 'react'
import { Renderer, Program, Mesh, Triangle } from 'ogl'
import useInView from '../hooks/useInView'
import './Strands.css'

export default function Strands({ speed = 0.5, amplitude = 1.0, waviness = 1.0, thickness = 1.0, glow = 1.0, intensity = 0.5, opacity = 0.3, className = '' }) {
  const containerRef = useRef(null)
  const [inViewRef, inView] = useInView()

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const renderer = new Renderer({ alpha: true, dpr })
    const gl = renderer.gl
    gl.clearColor(0, 0, 0, 0)
    container.appendChild(gl.canvas)

    const vertex = `
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `

    const fragment = `
      precision highp float;
      uniform float uTime;
      uniform float uSpeed;
      uniform float uAmplitude;
      uniform float uWaviness;
      uniform float uThickness;
      uniform float uGlow;
      uniform float uIntensity;
      uniform float uOpacity;
      uniform vec2 uResolution;

      void main() {
        vec2 uv = (gl_FragCoord.xy - 0.5 * uResolution) / min(uResolution.x, uResolution.y);
        float t = uTime * uSpeed;
        float col = 0.0;

        for (int i = 0; i < 6; i++) {
          float fi = float(i);
          vec2 pos = vec2(
            sin(t * 0.5 + fi * 1.7) * 2.0,
            cos(t * 0.3 + fi * 2.3) * 1.5
          );
          float wave = sin(uv.x * uWaviness * 3.0 + t * 2.0 + fi) * uAmplitude * 0.3;
          float d = length(uv - pos - vec2(0.0, wave));
          float strand = uThickness * 0.15 / (d + 0.01);
          strand = pow(strand, uGlow * 0.5 + 0.5);
          col += strand * uIntensity;
        }

        col = clamp(col, 0.0, 1.0);
        gl_FragColor = vec4(vec3(col), col * uOpacity);
      }
    `

    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        uTime: { value: 0 },
        uSpeed: { value: speed },
        uAmplitude: { value: amplitude },
        uWaviness: { value: waviness },
        uThickness: { value: thickness },
        uGlow: { value: glow },
        uIntensity: { value: intensity },
        uOpacity: { value: opacity },
        uResolution: { value: [gl.canvas.width, gl.canvas.height] },
      },
    })

    const mesh = new Mesh(gl, { geometry: new Triangle(gl), program })

    let animId
    let lastTime = 0
    const fps = 30
    const interval = 1000 / fps

    const resize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight)
      program.uniforms.uResolution.value = [gl.canvas.width, gl.canvas.height]
    }
    window.addEventListener('resize', resize)
    resize()

    const animate = (time) => {
      animId = requestAnimationFrame(animate)
      if (!inView) return
      const delta = time - lastTime
      if (delta < interval) return
      lastTime = time - (delta % interval)
      program.uniforms.uTime.value = time * 0.001
      renderer.render({ scene: mesh })
    }
    animId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
      if (gl.canvas.parentNode) gl.canvas.parentNode.removeChild(gl.canvas)
    }
  }, [speed, amplitude, waviness, thickness, glow, intensity, opacity, inView])

  return (
    <div ref={(el) => { containerRef.current = el; inViewRef(el) }} className={`strands-container ${className}`} />
  )
}
