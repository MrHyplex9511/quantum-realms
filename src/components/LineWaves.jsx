import { useEffect, useRef } from 'react'
import { Renderer, Program, Mesh, Triangle } from 'ogl'
import useInView from '../hooks/useInView'
import './LineWaves.css'

function hexToVec3(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255
  return [r, g, b]
}

export default function LineWaves({ speed = 0.3, brightness = 0.15, color1 = '#ffffff', color2 = '#888888', color3 = '#ffffff', className = '' }) {
  const containerRef = useRef(null)
  const [inViewRef, inView] = useInView()
  const mouseRef = useRef({ x: 0.5, y: 0.5 })

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
      uniform float uBrightness;
      uniform vec3 uColor1;
      uniform vec3 uColor2;
      uniform vec3 uColor3;
      uniform vec2 uMouse;
      uniform vec2 uResolution;

      void main() {
        vec2 uv = gl_FragCoord.xy / uResolution;
        float t = uTime * uSpeed;

        float wave1 = sin(uv.x * 10.0 + t * 2.0) * cos(uv.y * 5.0 + t * 1.5);
        float wave2 = sin((uv.x + uv.y) * 8.0 + t * 1.8) * 0.5;
        float wave3 = cos(uv.y * 12.0 - t * 2.5) * sin(uv.x * 6.0 + t);

        float mixVal = sin(uv.x * 3.14159) * 0.5 + 0.5;
        vec3 c1 = mix(uColor1, uColor2, mixVal);
        vec3 c2 = mix(c1, uColor3, wave3 * 0.5 + 0.5);

        float line = abs(wave1 + wave2) * uBrightness;
        line = clamp(line, 0.0, 1.0);

        gl_FragColor = vec4(c2 * line, line);
      }
    `

    const c1 = hexToVec3(color1)
    const c2 = hexToVec3(color2)
    const c3 = hexToVec3(color3)

    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        uTime: { value: 0 },
        uSpeed: { value: speed },
        uBrightness: { value: brightness },
        uColor1: { value: c1 },
        uColor2: { value: c2 },
        uColor3: { value: c3 },
        uMouse: { value: [0.5, 0.5] },
        uResolution: { value: [gl.canvas.width, gl.canvas.height] },
      },
    })

    const mesh = new Mesh(gl, { geometry: new Triangle(gl), program })

    let animId

    const handleMouse = (e) => {
      mouseRef.current = { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight }
    }
    window.addEventListener('mousemove', handleMouse)

    const resize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight)
      program.uniforms.uResolution.value = [gl.canvas.width, gl.canvas.height]
    }
    window.addEventListener('resize', resize)
    resize()

    const animate = (time) => {
      animId = requestAnimationFrame(animate)
      if (!inView) return
      program.uniforms.uTime.value = time * 0.001
      program.uniforms.uMouse.value = [mouseRef.current.x, mouseRef.current.y]
      renderer.render({ scene: mesh })
    }
    animId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', handleMouse)
      if (gl.canvas.parentNode) gl.canvas.parentNode.removeChild(gl.canvas)
    }
  }, [speed, brightness, color1, color2, color3, inView])

  return (
    <div ref={(el) => { containerRef.current = el; inViewRef(el) }} className={`linewaves-container ${className}`} />
  )
}
