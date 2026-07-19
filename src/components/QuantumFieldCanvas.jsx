import { useEffect, useRef } from 'react';
import useInView from '../hooks/useInView';

const GRID_SIZE = 30;

export default function QuantumFieldCanvas({ className = '', height = '400px' }) {
  const [viewRef, inView] = useInView(0.1);
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const timeRef = useRef(0);
  const ripplesRef = useRef([]);
  const inViewRef = useRef(true);
  const lastFrameRef = useRef(0);
  const lastRippleRef = useRef(0);

  useEffect(() => {
    inViewRef.current = inView;
  }, [inView]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (rect) {
        canvas.width = rect.width * window.devicePixelRatio;
        canvas.height = rect.height * window.devicePixelRatio;
        canvas.style.width = rect.width + 'px';
        canvas.style.height = rect.height + 'px';
      }
    };
    resize();
    window.addEventListener('resize', resize);

    const onMouse = (e) => {
      const now = performance.now();
      if (now - lastRippleRef.current < 100) return;
      lastRippleRef.current = now;

      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: (e.clientX - rect.left) * window.devicePixelRatio,
        y: (e.clientY - rect.top) * window.devicePixelRatio,
      };
      ripplesRef.current.push({ x: mouseRef.current.x, y: mouseRef.current.y, t: 0 });
    };
    canvas.addEventListener('mousemove', onMouse);

    const animate = (now) => {
      animId = requestAnimationFrame(animate);

      // FPS cap at 30
      const elapsed = now - lastFrameRef.current;
      if (elapsed < 33) return;
      lastFrameRef.current = now;

      if (!inViewRef.current) return;

      timeRef.current += 0.025;
      const t = timeRef.current;
      const w = canvas.width;
      const h = canvas.height;
      const dpr = window.devicePixelRatio || 1;

      ctx.fillStyle = '#0a0a1a';
      ctx.fillRect(0, 0, w, h);

      const cols = Math.ceil(w / GRID_SIZE);
      const rows = Math.ceil(h / GRID_SIZE);

      // Decay ripples
      ripplesRef.current = ripplesRef.current.filter((r) => r.t < 3);
      for (const r of ripplesRef.current) r.t += 0.03;

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const gx = col * GRID_SIZE + GRID_SIZE / 2;
          const gy = row * GRID_SIZE + GRID_SIZE / 2;

          let rippleAmp = 0;
          for (const r of ripplesRef.current) {
            const dx = gx - r.x;
            const dy = gy - r.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            rippleAmp += Math.sin(dist * 0.05 - r.t * 5) * Math.exp(-r.t) / (1 + dist * 0.01);
          }

          const fieldNoise = Math.sin(gx * 0.02 + t) * Math.sin(gy * 0.02 + t * 0.7);
          const amp = fieldNoise * 0.4 + rippleAmp * 0.4;

          const blend = Math.min(1, Math.abs(amp) * 3);
          const r = Math.round(0 * (1 - blend) + 168 * blend);
          const g = Math.round(240 * (1 - blend) + 85 * blend);
          const b = Math.round(255 * (1 - blend) + 247 * blend);

          const size = Math.max(0.5, Math.abs(amp) * 6);

          ctx.fillStyle = `rgba(${r},${g},${b},${0.3 + blend * 0.6})`;
          ctx.beginPath();
          ctx.arc(gx, gy, size * dpr, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };
    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', onMouse);
    };
  }, []);

  return (
    <div ref={viewRef} style={{ width: '100%', height }}>
      <canvas
        ref={canvasRef}
        className={className}
        style={{ width: '100%', height, display: 'block' }}
      />
    </div>
  );
}
