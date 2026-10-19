import React, { useRef } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'motion/react';

interface TiltCardProps {
  children: React.ReactNode;
  categoryColor?: string;
  className?: string;
  onClick?: () => void;
  id?: string;
}

export function TiltCard({
  children,
  categoryColor = '#8B5CF6',
  className = '',
  onClick,
  id,
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth spring physics for 2D tilt
  const springConfig = { damping: 20, stiffness: 300 };
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [6, -6]), springConfig);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-6, 6]), springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      id={id}
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        borderLeftColor: categoryColor,
        borderLeftWidth: '3px',
      }}
      whileHover={{
        scale: 1.02,
        boxShadow: `0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px ${categoryColor}25`,
      }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={`rounded-2xl bg-white shadow-sm border border-[#E2E8F0] transition-all duration-300 relative cursor-pointer overflow-hidden ${className}`}
    >
      {/* Soft radial glow reflecting category accent */}
      <div
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-10 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at 50% 0%, ${categoryColor} 0%, transparent 70%)`,
        }}
      />
      {children}
    </motion.div>
  );
}
