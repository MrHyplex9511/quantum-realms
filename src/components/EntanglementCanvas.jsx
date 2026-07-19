import { useEffect, useRef } from 'react';

const STAR_COUNT = 100;

export default function EntanglementCanvas({ className = '' }) {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const starsRef = useRef([]);
  const energyRef = useRef([]);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const onMouse = (e) => { mouseRef.current.x = e.clientX; mouseRef.current.y = e.clientY; };
    window.addEventListener('mousemove', onMouse);

    const s = [];
    for (let i = 0; i < STAR_COUNT; i++) {
      s.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, r: Math.random() * 1.5 + 0.5, a: Math.random() });
    }
    starsRef.current = s;

    const e = [];
    for (let i = 0; i < 30; i++) {
      e.push({ t: Math.random() });
    }
    energyRef.current = e;

    const animate = () => {
      timeRef.current += 0.016;
      const t = timeRef.current;
      const w = canvas.width;
      const h = canvas.height;

      ctx.fillStyle = '#06060f';
      ctx.fillRect(0, 0, w, h);

      // Stars
      for (const star of starsRef.current) {
        const alpha = 0.3 + 0.7 * Math.abs(Math.sin(t + star.a * 10));
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fill();
      }

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const o1x = Math.min(Math.max(mx, 80), w - 80);
      const o1y = Math.min(Math.max(my, 80), h - 80);
      const o2x = w - o1x;
      const o2y = h - o1y;

      // Energy beam
      const grad = ctx.createLinearGradient(o1x, o1y, o2x, o2y);
      grad.addColorStop(0, 'rgba(0, 240, 255, 0.4)');
      grad.addColorStop(0.5, 'rgba(168, 85, 247, 0.6)');
      grad.addColorStop(1, 'rgba(0, 240, 255, 0.4)');
      ctx.strokeStyle = grad;
      ctx.lineWidth = 2 + Math.sin(t * 2) * 1;
      ctx.beginPath();
      ctx.moveTo(o1x, o1y);
      ctx.lineTo(o2x, o2y);
      ctx.stroke();

      // Energy particles along beam
      for (const p of energyRef.current) {
        p.t += 0.008;
        if (p.t > 1) p.t = 0;
        const ex = o1x + (o2x - o1x) * p.t;
        const ey = o1y + (o2y - o1y) * p.t;
        const pulse = Math.sin(p.t * Math.PI);
        const grd = ctx.createRadialGradient(ex, ey, 0, ex, ey, 4 * pulse);
        grd.addColorStop(0, `rgba(0, 240, 255, ${pulse})`);
        grd.addColorStop(1, 'rgba(168, 85, 247, 0)');
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(ex, ey, 4 * pulse, 0, Math.PI * 2);
        ctx.fill();
      }

      // Orb 1 (cyan)
      const g1 = ctx.createRadialGradient(o1x, o1y, 0, o1x, o1y, 20);
      g1.addColorStop(0, 'rgba(0, 240, 255, 1)');
      g1.addColorStop(0.5, 'rgba(0, 240, 255, 0.4)');
      g1.addColorStop(1, 'rgba(0, 240, 255, 0)');
      ctx.fillStyle = g1;
      ctx.beginPath();
      ctx.arc(o1x, o1y, 20, 0, Math.PI * 2);
      ctx.fill();

      // Orb 2 (purple)
      const g2 = ctx.createRadialGradient(o2x, o2y, 0, o2x, o2y, 20);
      g2.addColorStop(0, 'rgba(168, 85, 247, 1)');
      g2.addColorStop(0.5, 'rgba(168, 85, 247, 0.4)');
      g2.addColorStop(1, 'rgba(168, 85, 247, 0)');
      ctx.fillStyle = g2;
      ctx.beginPath();
      ctx.arc(o2x, o2y, 20, 0, Math.PI * 2);
      ctx.fill();

      animId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouse);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ width: '100%', height: '100%', display: 'block' }}
    />
  );
}
