import { useEffect, useRef } from 'react'
import { Renderer, Program, Mesh, Triangle } from 'ogl'
import useInView from '../hooks/useInView'
import './Plasma.css'

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255
  return [r, g, b]
}

export default function Plasma({ color = '#ffffff', speed = 1.0, scale = 1.0, opacity = 0.3, mouseInteractive = true, className = '' }) {
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
      uniform float uScale;
      uniform float uOpacity;
      uniform vec3 uCustomColor;
      uniform float uUseCustomColor;
      uniform vec2 uMouse;
      uniform vec2 uResolution;

      void main() {
        vec2 uv = (gl_FragCoord.xy - 0.5 * uResolution) / min(uResolution.x, uResolution.y);
        float t = uTime * uSpeed * 0.2;

        float c1 = sin(uv.x * 2.5 * uScale + t);
        float c2 = cos(uv.y * 2.5 * uScale + t * 1.3);
        float c3 = sin((uv.x + uv.y) * 3.0 * uScale + t * 0.7);
        float c4 = cos(length(uv) * 4.0 * uScale - t * 1.1);

        float v = (c1 + c2 + c3 + c4) * 0.25;
        v = v * 0.5 + 0.5;

        vec3 col = mix(vec3(v), uCustomColor, uUseCustomColor);
        gl_FragColor = vec4(col, v * uOpacity);
      }
    `

    const rgb = hexToRgb(color)

    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        uTime: { value: 0 },
        uSpeed: { value: speed },
        uScale: { value: scale },
        uOpacity: { value: opacity },
        uCustomColor: { value: [rgb[0], rgb[1], rgb[2]] },
        uUseCustomColor: { value: 1.0 },
        uMouse: { value: [0.5, 0.5] },
        uResolution: { value: [gl.canvas.width, gl.canvas.height] },
      },
    })

    const mesh = new Mesh(gl, { geometry: new Triangle(gl), program })

    let animId

    const handleMouse = (e) => {
      mouseRef.current = { x: e.clientX / window.innerWidth, y: 1 - e.clientY / window.innerHeight }
    }
    if (mouseInteractive) window.addEventListener('mousemove', handleMouse)

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
      if (mouseInteractive) program.uniforms.uMouse.value = [mouseRef.current.x, mouseRef.current.y]
      renderer.render({ scene: mesh })
    }
    animId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
      if (mouseInteractive) window.removeEventListener('mousemove', handleMouse)
      if (gl.canvas.parentNode) gl.canvas.parentNode.removeChild(gl.canvas)
    }
  }, [color, speed, scale, opacity, mouseInteractive, inView])

  return (
    <div ref={(el) => { containerRef.current = el; inViewRef(el) }} className={`plasma-container ${className}`} />
  )
}
