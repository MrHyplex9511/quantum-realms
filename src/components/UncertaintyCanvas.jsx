import { useState, useEffect, useRef } from 'react';
import useInView from '../hooks/useInView';

function gaussian(x, mu, sigma) {
  return Math.exp(-0.5 * ((x - mu) / sigma) ** 2) / (sigma * Math.sqrt(2 * Math.PI));
}

function momentumDist(k, sigma) {
  return Math.exp(-0.5 * (k * sigma) ** 2) * sigma / Math.sqrt(2 * Math.PI);
}

export default function UncertaintyCanvas({ className = '', height = '400px' }) {
  const [viewRef, inView] = useInView(0.1);
  const canvasRef = useRef(null);
  const [width, setWidth] = useState(0.3);
  const widthRef = useRef(0.3);
  const lastFrameRef = useRef(0);
  const animRef = useRef(0);

  const handleWidthChange = (v) => {
    setWidth(v);
    widthRef.current = v;
  };

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

    // Offscreen canvas at 1/3 resolution
    const offCanvas = document.createElement('canvas');
    const offCtx = offCanvas.getContext('2d');

    const animate = (now) => {
      animId = requestAnimationFrame(animate);

      const elapsed = now - lastFrameRef.current;
      if (elapsed < 33) return;
      lastFrameRef.current = now;

      if (!inView) return;

      animRef.current += 0.01;
      const w = canvas.width;
      const h = canvas.height;
      const dpr = window.devicePixelRatio || 1;

      // Render at 1/3 resolution
      const dw = Math.ceil(w / 3);
      const dh = Math.ceil(h / 3);
      offCanvas.width = dw;
      offCanvas.height = dh;

      offCtx.fillStyle = '#000000';
      offCtx.fillRect(0, 0, dw, dh);

      // Read width from ref — no effect re-run
      const sigma = 0.05 + widthRef.current * 0.25;
      const posH = dh * 0.42;
      const momH = dh * 0.42;
      const posY0 = dh * 0.08;
      const momY0 = dh * 0.55;

      // Position space wave packet
      const cx = dw * 0.5;
      const maxPos = gaussian(0, 0, sigma);
      for (let x = 0; x < dw; x++) {
        const nx = (x - cx) / (dw * 0.3);
        const val = gaussian(nx, 0, sigma);
        const norm = val / maxPos;
        const phase = Math.sin(nx * 20 + animRef.current * 3) * norm * 0.3 + norm * 0.7;
        const barH = norm * posH;

        const gray = Math.round(60 + norm * 195);
        offCtx.fillStyle = `rgba(${gray},${gray},${gray},${0.4 + norm * 0.5})`;
        offCtx.fillRect(x, posY0 + posH - barH * phase, 1, barH * phase + 1);
      }

      // Momentum distribution
      const maxMom = momentumDist(0, sigma);
      for (let x = 0; x < dw; x++) {
        const k = (x - cx) / (dw * 0.3) * 10;
        const val = momentumDist(k, sigma);
        const norm = val / maxMom;
        const barH = norm * momH;

        const gray = Math.round(60 + norm * 195);
        offCtx.fillStyle = `rgba(${gray},${gray},${gray},${0.4 + norm * 0.5})`;
        offCtx.fillRect(x, momY0 + momH - barH, 1, barH + 1);
      }

      // Scale up to main canvas
      ctx.clearRect(0, 0, w, h);
      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(offCanvas, 0, 0, w, h);

      // Labels
      ctx.fillStyle = 'rgba(255,255,255,0.4)';
      ctx.font = `${12 * dpr}px monospace`;
      ctx.fillText('position space', 8 * dpr, posY0 * 3 + 14 * dpr);
      ctx.fillText('momentum space', 8 * dpr, momY0 * 3 + 14 * dpr);
    };
    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [inView]); // ← ONLY inView, NOT width

  const handleClick = (e) => {
    const rect = e.target.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    handleWidthChange(Math.max(0.05, Math.min(1, x)));
  };

  return (
    <div ref={viewRef} className={className} style={{ width: '100%', height, position: 'relative' }}>
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
          onChange={(e) => handleWidthChange(parseFloat(e.target.value))}
          style={{ flex: 1, accentColor: '#ffffff' }}
        />
        <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11 }}>Δx broad</span>
      </div>
    </div>
  );
}
