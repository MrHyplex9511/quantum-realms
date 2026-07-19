import { useEffect, useRef } from 'react';
import useInView from '../hooks/useInView';

const COLOR_1 = [0, 240, 255];
const COLOR_2 = [168, 85, 247];

export default function WaveCanvas({ className = '', height = '400px' }) {
  const [viewRef, inView] = useInView(0.1);
  const lastTimeRef = useRef(0);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = viewRef.current;
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

    const scale = 4;

    const animate = (timestamp) => {
      animId = requestAnimationFrame(animate);

      // FPS cap: 30fps max
      if (timestamp - lastTimeRef.current < 33) return;
      lastTimeRef.current = timestamp;

      // Skip computation when off-screen
      if (!inView) return;

      timeRef.current += 0.02;
      const t = timeRef.current;
      const w = canvas.width;
      const h = canvas.height;

      // Downsample: compute at 1/4 resolution
      const sw = Math.max(1, Math.floor(w / scale));
      const sh = Math.max(1, Math.floor(h / scale));

      const offscreen = document.createElement('canvas');
      offscreen.width = sw;
      offscreen.height = sh;
      const offCtx = offscreen.getContext('2d');

      const cx1 = sw * 0.35;
      const cy1 = sh * 0.5;
      const cx2 = sw * 0.65;
      const cy2 = sh * 0.5;

      const imageData = offCtx.createImageData(sw, sh);
      const data = imageData.data;

      for (let y = 0; y < sh; y++) {
        for (let x = 0; x < sw; x++) {
          const dx1 = x - cx1;
          const dy1 = y - cy1;
          const dx2 = x - cx2;
          const dy2 = y - cy2;

          const d1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);
          const d2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);

          const wave1 = Math.sin(d1 * 0.03 - t * 3) / (1 + d1 * 0.02);
          const wave2 = Math.sin(d2 * 0.03 - t * 3) / (1 + d2 * 0.02);
          const amp = Math.max(0, wave1 + wave2);

          const idx = (y * sw + x) * 4;
          const blend = Math.min(1, amp * 2.5);
          data[idx] = Math.round(COLOR_1[0] * (1 - blend) + COLOR_2[0] * blend);
          data[idx + 1] = Math.round(COLOR_1[1] * (1 - blend) + COLOR_2[1] * blend);
          data[idx + 2] = Math.round(COLOR_1[2] * (1 - blend) + COLOR_2[2] * blend);
          data[idx + 3] = Math.round(blend * 255);
        }
      }

      offCtx.putImageData(imageData, 0, 0);

      // Scale up with smoothing
      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(offscreen, 0, 0, w, h);
    };

    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [inView]);

  return (
    <canvas
      ref={viewRef}
      className={className}
      style={{ width: '100%', height, display: 'block' }}
    />
  );
}
