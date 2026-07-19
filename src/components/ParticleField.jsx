import { useEffect, useRef } from 'react';

const COUNT = 60;
const CONNECT_DIST = 180;
const ATTRACT_RADIUS = 200;
const REPEL_RADIUS = 80;
const MAX_FORCE = 0.3;
const FPS_LIMIT = 33;
const PARTICLE_SIZE = 4;

export default function ParticleField({ className = '' }) {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const particlesRef = useRef([]);
  const lastTimeRef = useRef(0);
  const frameCountRef = useRef(0);

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

    const onMouse = (e) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };
    const onLeave = () => { mouseRef.current.x = -9999; mouseRef.current.y = -9999; };
    window.addEventListener('mousemove', onMouse);
    window.addEventListener('mouseleave', onLeave);

    const p = [];
    for (let i = 0; i < COUNT; i++) {
      p.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
      });
    }
    particlesRef.current = p;

    let opacity = 0;

    const animate = (timestamp) => {
      const elapsed = timestamp - lastTimeRef.current;
      if (elapsed < FPS_LIMIT) {
        animId = requestAnimationFrame(animate);
        return;
      }
      lastTimeRef.current = timestamp;
      frameCountRef.current++;

      opacity = Math.min(1, opacity + 0.02);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const updateMouse = frameCountRef.current % 2 === 0;

      for (let i = 0; i < COUNT; i++) {
        const pt = p[i];

        if (updateMouse) {
          const dx = mx - pt.x;
          const dy = my - pt.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < ATTRACT_RADIUS && dist > 0) {
            const force = Math.min(MAX_FORCE, (ATTRACT_RADIUS - dist) / ATTRACT_RADIUS * 0.5);
            if (dist < REPEL_RADIUS) {
              pt.vx -= (dx / dist) * force * 2;
              pt.vy -= (dy / dist) * force * 2;
            } else {
              pt.vx += (dx / dist) * force;
              pt.vy += (dy / dist) * force;
            }
          }
        }

        pt.vx *= 0.99;
        pt.vy *= 0.99;
        pt.x += pt.vx;
        pt.y += pt.vy;

        if (pt.x < 0) pt.x = canvas.width;
        if (pt.x > canvas.width) pt.x = 0;
        if (pt.y < 0) pt.y = canvas.height;
        if (pt.y > canvas.height) pt.y = 0;
      }

      for (let i = 0; i < COUNT; i++) {
        const pt = p[i];
        const half = PARTICLE_SIZE / 2;

        ctx.fillStyle = 'rgba(0, 240, 255, 0.9)';
        ctx.fillRect(pt.x - half, pt.y - half, PARTICLE_SIZE, PARTICLE_SIZE);

        for (let j = i + 1; j < COUNT; j++) {
          const pt2 = p[j];
          const dx = pt.x - pt2.x;
          const dy = pt.y - pt2.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < CONNECT_DIST * CONNECT_DIST) {
            const alpha = (1 - Math.sqrt(distSq) / CONNECT_DIST) * 0.5 * opacity;
            if (alpha < 0.1) continue;
            ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(pt.x, pt.y);
            ctx.lineTo(pt2.x, pt2.y);
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(animate);
    };
    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
}
