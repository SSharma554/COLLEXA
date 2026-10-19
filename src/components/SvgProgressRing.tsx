import { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';

interface SvgProgressRingProps {
  percentage: number; // 0 to 100
  size?: number; // pixel diameter
  strokeWidth?: number;
  categoryColor?: string;
  showPercentageLabel?: boolean;
  label?: string;
  on100Reached?: () => void;
  id?: string;
}

export function SvgProgressRing({
  percentage,
  size = 110,
  strokeWidth = 9,
  categoryColor = '#8B5CF6',
  showPercentageLabel = true,
  label,
  on100Reached,
  id,
}: SvgProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(100, Math.max(0, percentage));
  const offset = circumference - (clamped / 100) * circumference;
  const prevPercentage = useRef(clamped);

  useEffect(() => {
    if (clamped === 100 && prevPercentage.current < 100) {
      // Localized canvas confetti burst
      try {
        confetti({
          particleCount: 65,
          spread: 70,
          origin: { y: 0.65 },
          colors: ['#4F46E5', '#D946EF', '#F59E0B', categoryColor],
        });
      } catch (err) {
        console.warn('Confetti burst trigger:', err);
      }
      if (on100Reached) on100Reached();
    }
    prevPercentage.current = clamped;
  }, [clamped, categoryColor, on100Reached]);

  return (
    <div id={id} className="relative inline-flex flex-col items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Track layer */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E2E8F0"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeLinecap="round"
        />
        {/* Animated Fill Layer */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={categoryColor}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </svg>

      {showPercentageLabel && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-lg font-bold text-[#800020] tracking-tight">
            {Math.round(clamped)}%
          </span>
          {label && (
            <span className="text-[10px] text-[#5C3D46] uppercase font-semibold tracking-wider">
              {label}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
