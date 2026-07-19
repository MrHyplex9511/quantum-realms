import { useEffect, useRef } from 'react';

const COLOR_1 = [0, 240, 255];
const COLOR_2 = [168, 85, 247];

export default function WaveCanvas({ className = '', height = '400px' }) {
  const canvasRef = useRef(null);
  const timeRef = useRef(0);

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
      timeRef.current += 0.02;
      const t = timeRef.current;
      const w = canvas.width;
      const h = canvas.height;

      ctx.fillStyle = '#0a0a1a';
      ctx.fillRect(0, 0, w, h);

      const cx1 = w * 0.35;
      const cy1 = h * 0.5;
      const cx2 = w * 0.65;
      const cy2 = h * 0.5;

      const imageData = ctx.createImageData(w, h);
      const data = imageData.data;

      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const dx1 = x - cx1;
          const dy1 = y - cy1;
          const dx2 = x - cx2;
          const dy2 = y - cy2;

          const d1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);
          const d2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);

          const wave1 = Math.sin(d1 * 0.03 - t * 3) / (1 + d1 * 0.02);
          const wave2 = Math.sin(d2 * 0.03 - t * 3) / (1 + d2 * 0.02);
          const amp = Math.max(0, wave1 + wave2);

          const idx = (y * w + x) * 4;
          const blend = Math.min(1, amp * 2.5);
          data[idx] = Math.round(COLOR_1[0] * (1 - blend) + COLOR_2[0] * blend);
          data[idx + 1] = Math.round(COLOR_1[1] * (1 - blend) + COLOR_2[1] * blend);
          data[idx + 2] = Math.round(COLOR_1[2] * (1 - blend) + COLOR_2[2] * blend);
          data[idx + 3] = Math.round(blend * 255);
        }
      }

      ctx.putImageData(imageData, 0, 0);
      animId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ width: '100%', height, display: 'block' }}
    />
  );
}
