import { useEffect, useRef, useState } from 'react';

interface NodePoint {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  pulsePhase: number;
}

export function GenerativeHeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [useFallback, setUseFallback] = useState(false);
  const mousePos = useRef({ x: -1000, y: -1000, vx: 0, vy: 0, lastX: 0, lastY: 0 });

  useEffect(() => {
    // Accessibility check: prefers-reduced-motion or low hardware concurrency
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isLowConcurrency = (navigator.hardwareConcurrency || 4) < 4;

    if (prefersReducedMotion || isLowConcurrency) {
      setUseFallback(true);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 480);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', handleResize);

    // Accent palette nodes: Indigo, Fuchsia, Amber, Violet, Teal, Coral
    const palette = ['#4F46E5', '#D946EF', '#F59E0B', '#8B5CF6', '#14B8A6', '#FB7185', '#6366F1'];
    const nodes: NodePoint[] = Array.from({ length: 18 }).map((_, i) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.7,
      vy: (Math.random() - 0.5) * 0.7,
      radius: 4 + Math.random() * 3,
      color: palette[i % palette.length],
      pulsePhase: Math.random() * Math.PI * 2,
    }));

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const currentX = e.clientX - rect.left;
      const currentY = e.clientY - rect.top;

      mousePos.current.vx = currentX - mousePos.current.lastX;
      mousePos.current.vy = currentY - mousePos.current.lastY;
      mousePos.current.lastX = currentX;
      mousePos.current.lastY = currentY;
      mousePos.current.x = currentX;
      mousePos.current.y = currentY;
    };

    const onMouseLeave = () => {
      mousePos.current.x = -1000;
      mousePos.current.y = -1000;
    };

    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseleave', onMouseLeave);

    let time = 0;
    const render = () => {
      time += 0.015;
      ctx.clearRect(0, 0, width, height);

      // Draw soft ambient gradient background blobs
      const grad1 = ctx.createRadialGradient(
        width * 0.25 + Math.sin(time * 0.5) * 40,
        height * 0.35 + Math.cos(time * 0.4) * 30,
        10,
        width * 0.25,
        height * 0.35,
        width * 0.35
      );
      grad1.addColorStop(0, 'rgba(79, 70, 229, 0.06)');
      grad1.addColorStop(0.6, 'rgba(217, 70, 239, 0.03)');
      grad1.addColorStop(1, 'rgba(250, 248, 245, 0)');
      ctx.fillStyle = grad1;
      ctx.fillRect(0, 0, width, height);

      const grad2 = ctx.createRadialGradient(
        width * 0.75 + Math.cos(time * 0.6) * 50,
        height * 0.55 + Math.sin(time * 0.5) * 40,
        10,
        width * 0.75,
        height * 0.55,
        width * 0.4
      );
      grad2.addColorStop(0, 'rgba(245, 158, 11, 0.05)');
      grad2.addColorStop(0.7, 'rgba(139, 92, 246, 0.02)');
      grad2.addColorStop(1, 'rgba(250, 248, 245, 0)');
      ctx.fillStyle = grad2;
      ctx.fillRect(0, 0, width, height);

      // Update and draw vector nodes
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];

        // Motion physics with subtle noise
        node.x += node.vx + Math.sin(time + node.pulsePhase) * 0.2;
        node.y += node.vy + Math.cos(time * 0.8 + node.pulsePhase) * 0.2;

        // Bounce on boundaries
        if (node.x < 30) {
          node.x = 30;
          node.vx *= -1;
        } else if (node.x > width - 30) {
          node.x = width - 30;
          node.vx *= -1;
        }
        if (node.y < 30) {
          node.y = 30;
          node.vy *= -1;
        } else if (node.y > height - 30) {
          node.y = height - 30;
          node.vy *= -1;
        }

        // Mouse interaction: push away or follow gently
        const dx = node.x - mousePos.current.x;
        const dy = node.y - mousePos.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 140 && dist > 0) {
          const force = (140 - dist) / 140;
          node.x += (dx / dist) * force * 2.5;
          node.y += (dy / dist) * force * 2.5;
        }

        // Draw connections between close nodes
        for (let j = i + 1; j < nodes.length; j++) {
          const other = nodes[j];
          const ndx = node.x - other.x;
          const ndy = node.y - other.y;
          const ndist = Math.sqrt(ndx * ndx + ndy * ndy);

          if (ndist < 190) {
            const alpha = (1 - ndist / 190) * 0.22;
            const lineGrad = ctx.createLinearGradient(node.x, node.y, other.x, other.y);
            lineGrad.addColorStop(0, node.color);
            lineGrad.addColorStop(1, other.color);
            ctx.strokeStyle = lineGrad;
            ctx.globalAlpha = alpha;
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        }

        // Draw node
        ctx.beginPath();
        const pulsingRadius = node.radius + Math.sin(time * 2 + node.pulsePhase) * 1.2;
        ctx.arc(node.x, node.y, pulsingRadius, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.shadowColor = node.color;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);

  if (useFallback) {
    return (
      <div
        id="hero-generative-fallback"
        className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(circle_at_30%_30%,rgba(79,70,229,0.12),transparent_60%),radial-gradient(circle_at_70%_70%,rgba(245,158,11,0.08),transparent_60%)]"
      />
    );
  }

  return (
    <canvas
      id="hero-generative-canvas"
      ref={canvasRef}
      className="absolute inset-0 pointer-events-auto w-full h-full"
      style={{ zIndex: 0 }}
    />
  );
}
