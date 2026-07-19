import { useEffect, useRef } from 'react';

const COUNT = 150;
const CONNECT_DIST = 150;
const ATTRACT_RADIUS = 200;
const REPEL_RADIUS = 80;
const MAX_FORCE = 0.3;

export default function ParticleField({ className = '' }) {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const particlesRef = useRef([]);

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

    const animate = () => {
      opacity = Math.min(1, opacity + 0.02);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      for (let i = 0; i < COUNT; i++) {
        const pt = p[i];
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
        const gradient = ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, 4);
        gradient.addColorStop(0, 'rgba(0, 240, 255, 0.9)');
        gradient.addColorStop(0.5, 'rgba(168, 85, 247, 0.5)');
        gradient.addColorStop(1, 'rgba(168, 85, 247, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 4, 0, Math.PI * 2);
        ctx.fill();

        for (let j = i + 1; j < COUNT; j++) {
          const pt2 = p[j];
          const dx = pt.x - pt2.x;
          const dy = pt.y - pt2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECT_DIST) {
            const alpha = (1 - dist / CONNECT_DIST) * 0.5 * opacity;
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
    animate();

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
