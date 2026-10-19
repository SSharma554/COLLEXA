import React from 'react';
import { motion } from 'motion/react';

interface AudioWaveformRingProps {
  amplitude: number; // 0.0 to 1.0
  isMuted?: boolean;
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export function AudioWaveformRing({
  amplitude,
  isMuted = false,
  children,
  className = '',
  id,
}: AudioWaveformRingProps) {
  // Scale amplitude smoothly between 0 and 1.2
  const amp = isMuted ? 0 : Math.min(1.2, amplitude);

  return (
    <div id={id} className={`relative flex items-center justify-center ${className}`}>
      {/* Outer pulsating concentric ring 1 */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        animate={{
          scale: 1 + amp * 0.12,
          opacity: amp > 0.05 ? 0.35 + amp * 0.45 : 0,
        }}
        transition={{ duration: 0.1, ease: 'linear' }}
        style={{
          boxShadow: `0 0 ${12 + amp * 28}px ${4 + amp * 12}px rgba(217, 70, 239, 0.45)`,
          border: `2px solid rgba(79, 70, 229, ${0.3 + amp * 0.7})`,
        }}
      />

      {/* Outer pulsating concentric ring 2 */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        animate={{
          scale: 1 + amp * 0.06,
          opacity: amp > 0.05 ? 0.6 : 0,
        }}
        transition={{ duration: 0.08, ease: 'linear' }}
        style={{
          boxShadow: `0 0 ${8 + amp * 16}px ${2 + amp * 8}px rgba(245, 158, 11, 0.35)`,
        }}
      />

      {/* Video / Camera container */}
      <div className="relative z-10 w-full h-full rounded-2xl overflow-hidden shadow-md border border-[#E5E2D9] bg-slate-900">
        {children}
      </div>

      {/* Live Mic Level Bar Indicator */}
      <div className="absolute bottom-3 left-3 z-20 flex items-center gap-1 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 text-white text-[11px] font-mono">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span>MIC: {Math.round(amp * 100)}%</span>
      </div>
    </div>
  );
}
