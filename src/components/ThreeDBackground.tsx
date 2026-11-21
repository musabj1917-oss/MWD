'use client';

import { useEffect, useRef } from 'react';

export function ThreeDBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let scrollY = window.scrollY || 0;
    let targetScrollY = scrollY;
    let mouseX = width / 2;
    let mouseY = height / 2;
    let targetMouseX = mouseX;
    let targetMouseY = mouseY;

    const onResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const onScroll = () => {
      targetScrollY = window.scrollY || 0;
    };

    const onMouseMove = (e: MouseEvent) => {
      targetMouseX = e.clientX;
      targetMouseY = e.clientY;
    };

    window.addEventListener('resize', onResize, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 3D Wireframe Cube Definition
    const cubeVertices = [
      [-1, -1, -1],
      [1, -1, -1],
      [1, 1, -1],
      [-1, 1, -1],
      [-1, -1, 1],
      [1, -1, 1],
      [1, 1, 1],
      [-1, 1, 1],
    ];

    const cubeEdges = [
      [0, 1], [1, 2], [2, 3], [3, 0], // back face
      [4, 5], [5, 6], [6, 7], [7, 4], // front face
      [0, 4], [1, 5], [2, 6], [3, 7], // connecting edges
    ];

    // Floating 3D objects in the world
    const shapes = [
      { x: -width * 0.35, y: -height * 0.2, z: 400, size: 70, rx: 0.2, ry: 0.3, rz: 0.1, rotSpeedX: 0.007, rotSpeedY: 0.009 },
      { x: width * 0.38, y: -height * 0.1, z: 320, size: 85, rx: 0.5, ry: 0.1, rz: 0.4, rotSpeedX: 0.006, rotSpeedY: 0.008 },
      { x: -width * 0.38, y: height * 0.35, z: 500, size: 90, rx: 0.1, ry: 0.4, rz: 0.2, rotSpeedX: 0.008, rotSpeedY: 0.006 },
      { x: width * 0.32, y: height * 0.45, z: 380, size: 75, rx: 0.4, ry: 0.2, rz: 0.5, rotSpeedX: 0.009, rotSpeedY: 0.007 },
      { x: 0, y: height * 0.7, z: 600, size: 100, rx: 0.3, ry: 0.5, rz: 0.2, rotSpeedX: 0.005, rotSpeedY: 0.006 },
      { x: -width * 0.2, y: height * 1.1, z: 450, size: 80, rx: 0.2, ry: 0.1, rz: 0.3, rotSpeedX: 0.007, rotSpeedY: 0.008 },
      { x: width * 0.25, y: height * 1.25, z: 420, size: 85, rx: 0.3, ry: 0.4, rz: 0.1, rotSpeedX: 0.008, rotSpeedY: 0.005 },
    ];

    // Constellation points in 3D
    const numPoints = 50;
    const points: Array<{ x: number; y: number; z: number; vx: number; vy: number; vz: number; size: number }> = [];
    for (let i = 0; i < numPoints; i++) {
      points.push({
        x: (Math.random() - 0.5) * width * 1.8,
        y: (Math.random() - 0.5) * height * 2.2,
        z: Math.random() * 800 + 150,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        vz: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2.2 + 1.2,
      });
    }

    const fov = 400;
    let gridOffset = 0;

    const render = () => {
      // Smooth interpolation for scroll and mouse
      scrollY += (targetScrollY - scrollY) * 0.08;
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      const cx = width / 2;
      const cy = height / 2;

      // Parallax camera tilt from mouse & scroll
      const camTiltX = ((mouseY - cy) / height) * 0.15 + (scrollY * 0.0003);
      const camTiltY = ((mouseX - cx) / width) * 0.15;

      // Base Canvas Fill
      if (isDark) {
        ctx.fillStyle = '#09090B';
        ctx.fillRect(0, 0, width, height);

        // Ambient radial crimson nebulas
        const g1 = ctx.createRadialGradient(cx + (mouseX - cx) * 0.2, cy * 0.7, 30, cx, cy * 0.7, Math.max(width, height) * 0.75);
        g1.addColorStop(0, 'rgba(224, 32, 32, 0.12)');
        g1.addColorStop(0.45, 'rgba(18, 18, 24, 0.45)');
        g1.addColorStop(1, 'rgba(9, 9, 11, 0.8)');
        ctx.fillStyle = g1;
        ctx.fillRect(0, 0, width, height);

        const g2 = ctx.createRadialGradient(cx * 1.3, height * 0.85, 20, cx * 1.3, height * 0.85, width * 0.6);
        g2.addColorStop(0, 'rgba(224, 32, 32, 0.08)');
        g2.addColorStop(1, 'transparent');
        ctx.fillStyle = g2;
        ctx.fillRect(0, 0, width, height);
      } else {
        ctx.fillStyle = '#FAFAFC';
        ctx.fillRect(0, 0, width, height);

        const g1 = ctx.createRadialGradient(cx, cy * 0.6, 20, cx, cy * 0.6, Math.max(width, height) * 0.7);
        g1.addColorStop(0, 'rgba(224, 32, 32, 0.05)');
        g1.addColorStop(0.5, 'rgba(240, 240, 245, 0.4)');
        g1.addColorStop(1, 'rgba(250, 250, 252, 0.8)');
        ctx.fillStyle = g1;
        ctx.fillRect(0, 0, width, height);
      }

      // -------------------------------------------------------------
      // 1. 3D PERSPECTIVE WIREFRAME GRID (FLOOR & CEILING DEPTH)
      // -------------------------------------------------------------
      if (!prefersReducedMotion) {
        gridOffset = (gridOffset + 0.8 + (targetScrollY - scrollY) * 0.1) % 50;
      }

      const horizonY = cy + Math.sin(camTiltX) * 100;
      const gridLines = 14;
      const maxZ = 900;
      const minZ = 120;

      // Longitudinal lines vanishing to horizon
      ctx.lineWidth = 0.8;
      for (let i = -gridLines; i <= gridLines; i++) {
        const worldX = i * 90;

        // Near point (bottom of screen)
        const scaleNear = fov / (fov + minZ);
        const pxNear = cx + (worldX + camTiltY * 200) * scaleNear;
        const pyNear = horizonY + (height * 0.5) * scaleNear;

        // Far point (near horizon)
        const scaleFar = fov / (fov + maxZ);
        const pxFar = cx + (worldX * 0.1 + camTiltY * 50) * scaleFar;
        const pyFar = horizonY + 2;

        ctx.beginPath();
        ctx.moveTo(pxFar, pyFar);
        ctx.lineTo(pxNear, pyNear);
        ctx.strokeStyle = isDark
          ? i === 0
            ? 'rgba(239, 68, 68, 0.35)'
            : 'rgba(224, 32, 32, 0.12)'
          : i === 0
            ? 'rgba(224, 32, 32, 0.25)'
            : 'rgba(224, 32, 32, 0.07)';
        ctx.stroke();
      }

      // Transverse horizontal grid lines moving forward
      const numTransverse = 12;
      for (let j = 0; j < numTransverse; j++) {
        const rawZ = ((j * 65 + gridOffset) % (maxZ - minZ)) + minZ;
        const scale = fov / (fov + rawZ);
        const py = horizonY + (height * 0.5) * scale;
        const halfWidth = (width * 0.9) * scale;
        const alpha = Math.min(Math.max((maxZ - rawZ) / maxZ, 0.05), 0.35);

        ctx.beginPath();
        ctx.moveTo(cx - halfWidth, py);
        ctx.lineTo(cx + halfWidth, py);
        ctx.strokeStyle = isDark
          ? `rgba(224, 32, 32, ${alpha * 0.35})`
          : `rgba(224, 32, 32, ${alpha * 0.18})`;
        ctx.stroke();
      }

      // -------------------------------------------------------------
      // 2. 3D FLOATING ROTATING WIREFRAME POLYHEDRA
      // -------------------------------------------------------------
      shapes.forEach((shape, sIdx) => {
        if (!prefersReducedMotion) {
          shape.rx += shape.rotSpeedX;
          shape.ry += shape.rotSpeedY;
        }

        // Adjust shape Y based on page scroll for deep parallax
        const effectiveY = shape.y - (scrollY * 0.45);
        const effectiveZ = shape.z;

        // Skip shapes that scrolled far off screen
        if (effectiveY < -height || effectiveY > height * 1.5) return;

        // 3D rotation matrix calculation for cube vertices
        const projectedVerts: Array<{ x: number; y: number; scale: number }> = [];

        const cosX = Math.cos(shape.rx), sinX = Math.sin(shape.rx);
        const cosY = Math.cos(shape.ry), sinY = Math.sin(shape.ry);
        const cosZ = Math.cos(shape.rz), sinZ = Math.sin(shape.rz);

        for (let v = 0; v < cubeVertices.length; v++) {
          let [vx, vy, vz] = cubeVertices[v];
          vx *= shape.size * 0.5;
          vy *= shape.size * 0.5;
          vz *= shape.size * 0.5;

          // Rotate Y
          let x1 = vx * cosY + vz * sinY;
          let y1 = vy;
          let z1 = -vx * sinY + vz * cosY;

          // Rotate X
          let x2 = x1;
          let y2 = y1 * cosX - z1 * sinX;
          let z2 = y1 * sinX + z1 * cosX;

          // Rotate Z
          let x3 = x2 * cosZ - y2 * sinZ;
          let y3 = x2 * sinZ + y2 * cosZ;
          let z3 = z2;

          // World translation
          const worldX = x3 + shape.x + (mouseX - cx) * 0.04;
          const worldY = y3 + effectiveY;
          const worldZ = z3 + effectiveZ;

          const scale = fov / (fov + worldZ);
          const px = worldX * scale + cx;
          const py = worldY * scale + cy;

          projectedVerts.push({ x: px, y: py, scale });
        }

        // Draw edges
        ctx.beginPath();
        cubeEdges.forEach(([i1, i2]) => {
          const p1 = projectedVerts[i1];
          const p2 = projectedVerts[i2];
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
        });

        const shapeAlpha = isDark ? 0.4 : 0.22;
        ctx.strokeStyle = sIdx % 2 === 0
          ? `rgba(224, 32, 32, ${shapeAlpha})`
          : isDark ? `rgba(255, 255, 255, ${shapeAlpha * 0.6})` : `rgba(100, 116, 139, ${shapeAlpha * 0.7})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Glowing vertices
        projectedVerts.forEach((pv) => {
          ctx.beginPath();
          ctx.arc(pv.x, pv.y, Math.max(2 * pv.scale, 1.2), 0, Math.PI * 2);
          ctx.fillStyle = isDark ? 'rgba(239, 68, 68, 0.85)' : 'rgba(224, 32, 32, 0.65)';
          ctx.fill();
        });
      });

      // -------------------------------------------------------------
      // 3. 3D CONSTELLATION NODES & LASER LINKS
      // -------------------------------------------------------------
      const projectedPoints: Array<{ px: number; py: number; scale: number; alpha: number }> = [];

      for (let i = 0; i < points.length; i++) {
        const p = points[i];

        if (!prefersReducedMotion) {
          p.x += p.vx;
          p.y += p.vy;
          p.z += p.vz;
          if (p.z < 100) p.z = 900;
          if (p.z > 900) p.z = 100;
          if (Math.abs(p.x) > width * 0.9) p.vx *= -1;
          if (Math.abs(p.y) > height * 1.1) p.vy *= -1;
        }

        const effectiveY = p.y - (scrollY * 0.3);
        const scale = fov / (fov + p.z);
        const px = (p.x + (mouseX - cx) * 0.05) * scale + cx;
        const py = effectiveY * scale + cy;
        const alpha = Math.min(Math.max((900 - p.z) / 800, 0.1), 0.85);

        projectedPoints.push({ px, py, scale, alpha });
      }

      // Draw connecting lines between nearby points
      for (let i = 0; i < projectedPoints.length; i++) {
        for (let j = i + 1; j < projectedPoints.length; j++) {
          const p1 = projectedPoints[i];
          const p2 = projectedPoints[j];
          const dx = p1.px - p2.px;
          const dy = p1.py - p2.py;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            const lineAlpha = (1 - dist / 130) * Math.min(p1.alpha, p2.alpha) * (isDark ? 0.35 : 0.16);
            ctx.beginPath();
            ctx.moveTo(p1.px, p1.py);
            ctx.lineTo(p2.px, p2.py);
            ctx.strokeStyle = `rgba(224, 32, 32, ${lineAlpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // Draw particle nodes
      for (let i = 0; i < projectedPoints.length; i++) {
        const p = projectedPoints[i];
        const r = Math.max(points[i].size * p.scale * 1.6, 1.2);
        ctx.beginPath();
        ctx.arc(p.px, p.py, r, 0, Math.PI * 2);
        if (isDark) {
          ctx.fillStyle = i % 3 === 0
            ? `rgba(239, 68, 68, ${p.alpha * 0.9})`
            : `rgba(255, 255, 255, ${p.alpha * 0.6})`;
        } else {
          ctx.fillStyle = i % 3 === 0
            ? `rgba(224, 32, 32, ${p.alpha * 0.7})`
            : `rgba(100, 116, 139, ${p.alpha * 0.45})`;
        }
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 0 }}
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}
