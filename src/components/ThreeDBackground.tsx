'use client';

import { useEffect, useRef } from 'react';

export function ThreeDBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // 3D Particles & Node Grid
    const numPoints = 45;
    const points: Array<{
      x: number;
      y: number;
      z: number;
      origX: number;
      origY: number;
      vx: number;
      vy: number;
      vz: number;
      size: number;
    }> = [];

    const fov = 350;

    for (let i = 0; i < numPoints; i++) {
      const x = (Math.random() - 0.5) * width * 1.4;
      const y = (Math.random() - 0.5) * height * 1.4;
      const z = Math.random() * 600 + 100;
      points.push({
        x,
        y,
        z,
        origX: x,
        origY: y,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        vz: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 1.2,
      });
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let angle = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      const centerX = width / 2;
      const centerY = height / 2;

      // Soft ambient radial glows in background
      const ambientGrad = ctx.createRadialGradient(
        centerX,
        centerY * 0.8,
        10,
        centerX,
        centerY * 0.8,
        Math.max(width, height) * 0.7
      );
      if (isDark) {
        ambientGrad.addColorStop(0, 'rgba(224, 32, 32, 0.08)');
        ambientGrad.addColorStop(0.5, 'rgba(18, 18, 24, 0.4)');
        ambientGrad.addColorStop(1, 'rgba(9, 9, 11, 0)');
      } else {
        ambientGrad.addColorStop(0, 'rgba(224, 32, 32, 0.04)');
        ambientGrad.addColorStop(0.6, 'rgba(245, 245, 247, 0.3)');
        ambientGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      }
      ctx.fillStyle = ambientGrad;
      ctx.fillRect(0, 0, width, height);

      if (!prefersReducedMotion) {
        angle += 0.0012;
      }

      // Projected points
      const projected: Array<{ px: number; py: number; scale: number; alpha: number; z: number }> = [];

      for (let i = 0; i < points.length; i++) {
        const p = points[i];

        if (!prefersReducedMotion) {
          p.x += p.vx;
          p.y += p.vy;
          p.z += p.vz;

          if (p.z < 50) p.z = 700;
          if (p.z > 700) p.z = 50;
          if (Math.abs(p.x) > width * 0.8) p.vx *= -1;
          if (Math.abs(p.y) > height * 0.8) p.vy *= -1;
        }

        // Apply slight 3D rotation around Y axis
        const cos = Math.cos(angle * 0.5);
        const sin = Math.sin(angle * 0.5);
        const rotX = p.x * cos - (p.z - 400) * sin;
        const rotZ = p.x * sin + (p.z - 400) * cos + 400;

        const scale = fov / (fov + rotZ);
        const px = rotX * scale + centerX;
        const py = p.y * scale + centerY;
        const alpha = Math.min(Math.max((700 - rotZ) / 650, 0.08), 0.85);

        projected.push({ px, py, scale, alpha, z: rotZ });
      }

      // Draw spatial connecting lines between nearby points
      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const p1 = projected[i];
          const p2 = projected[j];
          const dx = p1.px - p2.px;
          const dy = p1.py - p2.py;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 140) {
            const lineAlpha = (1 - dist / 140) * Math.min(p1.alpha, p2.alpha) * (isDark ? 0.35 : 0.18);
            ctx.beginPath();
            ctx.moveTo(p1.px, p1.py);
            ctx.lineTo(p2.px, p2.py);
            ctx.strokeStyle = isDark
              ? `rgba(224, 32, 32, ${lineAlpha})`
              : `rgba(224, 32, 32, ${lineAlpha * 0.85})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // Draw 3D nodes
      for (let i = 0; i < projected.length; i++) {
        const p = projected[i];
        const radius = Math.max(points[i].size * p.scale * 1.5, 1.2);

        ctx.beginPath();
        ctx.arc(p.px, p.py, radius, 0, Math.PI * 2);

        if (isDark) {
          ctx.fillStyle = i % 3 === 0
            ? `rgba(239, 68, 68, ${p.alpha * 0.9})`
            : `rgba(255, 255, 255, ${p.alpha * 0.6})`;
          ctx.shadowColor = 'rgba(239, 68, 68, 0.6)';
          ctx.shadowBlur = radius * 4;
        } else {
          ctx.fillStyle = i % 3 === 0
            ? `rgba(224, 32, 32, ${p.alpha * 0.7})`
            : `rgba(100, 116, 139, ${p.alpha * 0.5})`;
          ctx.shadowColor = 'rgba(224, 32, 32, 0.3)';
          ctx.shadowBlur = radius * 2;
        }

        ctx.fill();
        ctx.shadowBlur = 0; // reset
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none -z-10 overflow-hidden"
      style={{ perspective: '1200px' }}
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
      {/* Subtle perspective grid floor */}
      <div
        className="absolute inset-x-0 bottom-0 h-[45vh] opacity-20 dark:opacity-30 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at bottom, rgba(224, 32, 32, 0.15) 0%, transparent 70%)',
          transform: 'rotateX(65deg)',
          transformOrigin: 'bottom center',
        }}
      />
    </div>
  );
}
