import { useState, useEffect, useRef } from 'react';

function gaussian(x, mu, sigma) {
  return Math.exp(-0.5 * ((x - mu) / sigma) ** 2) / (sigma * Math.sqrt(2 * Math.PI));
}

function momentumDist(k, sigma) {
  return Math.exp(-0.5 * (k * sigma) ** 2) * sigma / Math.sqrt(2 * Math.PI);
}

export default function UncertaintyCanvas({ className = '', height = '400px' }) {
  const canvasRef = useRef(null);
  const [width, setWidth] = useState(0.3);
  const animRef = useRef(0);

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

    const animate = () => {
      animRef.current += 0.01;
      const w = canvas.width;
      const h = canvas.height;
      const dpr = window.devicePixelRatio || 1;

      ctx.fillStyle = '#0a0a1a';
      ctx.fillRect(0, 0, w, h);

      const sigma = 0.05 + width * 0.25;
      const posH = h * 0.42;
      const momH = h * 0.42;
      const posY0 = h * 0.08;
      const momY0 = h * 0.55;

      // Position space wave packet
      const cx = w * 0.5;
      const maxPos = gaussian(0, 0, sigma);
      for (let x = 0; x < w; x++) {
        const nx = (x - cx) / (w * 0.3);
        const val = gaussian(nx, 0, sigma);
        const norm = val / maxPos;
        const phase = Math.sin(nx * 20 + animRef.current * 3) * norm * 0.3 + norm * 0.7;
        const barH = norm * posH;

        const blend = Math.min(1, norm);
        const r = Math.round(0 * (1 - blend) + 168 * blend);
        const g = Math.round(240 * (1 - blend) + 85 * blend);
        const b = Math.round(255 * (1 - blend) + 247 * blend);

        ctx.fillStyle = `rgba(${r},${g},${b},${0.4 + norm * 0.5})`;
        ctx.fillRect(x, posY0 + posH - barH * phase, 1, barH * phase + 1);
      }

      // Momentum distribution
      const maxMom = momentumDist(0, sigma);
      for (let x = 0; x < w; x++) {
        const k = (x - cx) / (w * 0.3) * 10;
        const val = momentumDist(k, sigma);
        const norm = val / maxMom;
        const barH = norm * momH;

        const blend = Math.min(1, norm);
        const r = Math.round(168 * (1 - blend) + 0 * blend);
        const g = Math.round(85 * (1 - blend) + 240 * blend);
        const b = Math.round(247 * (1 - blend) + 255 * blend);

        ctx.fillStyle = `rgba(${r},${g},${b},${0.4 + norm * 0.5})`;
        ctx.fillRect(x, momY0 + momH - barH, 1, barH + 1);
      }

      // Label
      ctx.fillStyle = 'rgba(255,255,255,0.4)';
      ctx.font = `${12 * dpr}px monospace`;
      ctx.fillText('position space', 8 * dpr, posY0 + 14 * dpr);
      ctx.fillText('momentum space', 8 * dpr, momY0 + 14 * dpr);

      animId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [width]);

  const handleClick = (e) => {
    const rect = e.target.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    setWidth(Math.max(0.05, Math.min(1, x)));
  };

  return (
    <div className={className} style={{ width: '100%', height, position: 'relative' }}>
      <canvas
        ref={canvasRef}
        onClick={handleClick}
        style={{ width: '100%', height: '100%', display: 'block', cursor: 'pointer' }}
      />
      <div style={{ position: 'absolute', bottom: 8, left: '10%', right: '10%', display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11 }}>Δx narrow</span>
        <input
          type="range"
          min="0.05"
          max="1"
          step="0.01"
          value={width}
          onChange={(e) => setWidth(parseFloat(e.target.value))}
          style={{ flex: 1, accentColor: '#a855f7' }}
        />
        <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11 }}>Δx broad</span>
      </div>
    </div>
  );
}
