import { useEffect, useRef } from 'react';
import useInView from '../hooks/useInView';

const PARTICLE_COUNT = 12;

export default function TunnelCanvas({ className = '', height = '400px' }) {
  const [viewRef, inView] = useInView(0.1);
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const timeRef = useRef(0);
  const inViewRef = useRef(true);
  const lastFrameRef = useRef(0);

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

    const resetParticle = (p, w) => {
      p.x = -20;
      p.y = 80 + Math.random() * (w * 0.6);
      p.speed = 1 + Math.random() * 2;
      p.tunneled = false;
      p.reflected = false;
      p.willTunnel = Math.random() < 0.3;
      p.phase = Math.random() * Math.PI * 2;
    };

    const p = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const pt = {};
      resetParticle(pt, 400);
      p.push(pt);
    }
    particlesRef.current = p;

    const animate = (now) => {
      animId = requestAnimationFrame(animate);

      // FPS cap at 30
      const elapsed = now - lastFrameRef.current;
      if (elapsed < 33) return;
      lastFrameRef.current = now;

      if (!inViewRef.current) return;

      timeRef.current += 0.02;
      const t = timeRef.current;
      const w = canvas.width;
      const h = canvas.height;
      const dpr = window.devicePixelRatio || 1;

      ctx.fillStyle = '#0a0a1a';
      ctx.fillRect(0, 0, w, h);

      // Potential barrier
      const barrierX = w * 0.4;
      const barrierW = w * 0.2;
      const barrierH = h * 0.5;
      const barrierY = h * 0.25;

      ctx.fillStyle = 'rgba(168, 85, 247, 0.15)';
      ctx.fillRect(barrierX, barrierY, barrierW, barrierH);
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.4)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.strokeRect(barrierX, barrierY, barrierW, barrierH);
      ctx.setLineDash([]);

      // Energy levels
      for (let i = 0; i < 3; i++) {
        const ey = barrierY + barrierH * 0.3 + i * barrierH * 0.2;
        ctx.strokeStyle = `rgba(0, 240, 255, ${0.2 - i * 0.05})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(0, ey);
        ctx.lineTo(w, ey);
        ctx.stroke();
        ctx.fillStyle = 'rgba(0, 240, 255, 0.3)';
        ctx.font = `${10 * dpr}px monospace`;
        ctx.fillText(`E${i + 1}`, 4 * dpr, ey - 4 * dpr);
      }

      // Wave function
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.2)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0; x < w; x++) {
        const amp = 20 * Math.sin(x * 0.03 + t * 2) * (x < barrierX ? 1 : x > barrierX + barrierW ? 0.3 : 0.1);
        const y = h * 0.5 + amp;
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Particles — simplified glow with fillRect
      for (const pt of p) {
        pt.x += pt.speed;
        pt.phase += 0.05;

        // Hit barrier
        if (!pt.tunneled && !pt.reflected && pt.x >= barrierX && pt.x <= barrierX + pt.speed) {
          if (pt.willTunnel) {
            pt.tunneled = true;
            pt.speed *= 0.6;
          } else {
            pt.reflected = true;
            pt.speed *= -0.8;
          }
        }

        // Reset
        if (pt.reflected && pt.x < -30) resetParticle(pt, w);
        if (pt.tunneled && pt.x > w + 30) resetParticle(pt, w);

        const glow = pt.tunneled ? '0, 240, 255' : pt.reflected ? '168, 85, 247' : '0, 240, 255';
        const size = pt.tunneled ? 3 + Math.sin(pt.phase) : 2;

        // fillRect glow (cheaper than radialGradient)
        const alpha = pt.tunneled ? 0.9 : 0.7;
        ctx.fillStyle = `rgba(${glow}, ${alpha})`;
        ctx.fillRect(pt.x - size, pt.y - size, size * 2, size * 2);
        ctx.fillStyle = `rgba(${glow}, ${alpha * 0.3})`;
        ctx.fillRect(pt.x - size * 2, pt.y - size * 2, size * 4, size * 4);
      }

      // Labels
      ctx.fillStyle = 'rgba(255,255,255,0.4)';
      ctx.font = `${11 * dpr}px monospace`;
      ctx.fillText('incident particles', 8 * dpr, 16 * dpr);
      ctx.fillText('reflected', barrierX - 70 * dpr, barrierY + barrierH + 20 * dpr);
      ctx.fillText('tunneled', barrierX + barrierW + 8 * dpr, barrierY + barrierH + 20 * dpr);
    };
    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div ref={viewRef} style={{ width: '100%', height }}>
      <canvas
        ref={canvasRef}
        className={className}
        style={{ width: '100%', height: '100%', display: 'block' }}
      />
    </div>
  );
}
