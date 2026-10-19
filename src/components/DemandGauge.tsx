import { motion } from 'motion/react';

interface DemandGaugeProps {
  score: number; // 0 to 100
  trendText?: string;
  size?: number; // width in pixels, default 160
  id?: string;
}

export function DemandGauge({
  score,
  trendText = 'High Demand',
  size = 150,
  id,
}: DemandGaugeProps) {
  const clampedScore = Math.min(100, Math.max(0, score));

  // Arc math: 180 degree semi-circle from left (180 deg) to right (0 deg)
  const strokeWidth = 10;
  const radius = (size - strokeWidth * 2) / 2;
  const centerX = size / 2;
  const centerY = size / 2 + 10;

  // Rotation angle for needle: -90 deg (score 0) to +90 deg (score 100)
  const needleAngle = -90 + (clampedScore / 100) * 180;

  // Arc path for semicircle
  const arcPath = `M ${centerX - radius} ${centerY} A ${radius} ${radius} 0 0 1 ${centerX + radius} ${centerY}`;

  return (
    <div id={id} className="inline-flex flex-col items-center justify-center select-none">
      <div className="relative" style={{ width: size, height: size * 0.65 }}>
        <svg width={size} height={size * 0.7} viewBox={`0 0 ${size} ${size * 0.7}`}>
          <defs>
            <linearGradient id="demandGaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#4F46E5" />
              <stop offset="50%" stopColor="#D946EF" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>
            <filter id="gaugeGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background track arc */}
          <path
            d={arcPath}
            fill="none"
            stroke="#E2E8F0"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Gradient filled active arc track */}
          <path
            d={arcPath}
            fill="none"
            stroke="url(#demandGaugeGrad)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={Math.PI * radius}
            strokeDashoffset={(1 - clampedScore / 100) * (Math.PI * radius)}
            filter="url(#gaugeGlow)"
            className="transition-all duration-700 ease-out"
          />

          {/* Pivot center circle */}
          <circle cx={centerX} cy={centerY} r={5} fill="#800020" />
          <circle cx={centerX} cy={centerY} r={2} fill="#FFF9F2" />

          {/* Animated Needle */}
          <motion.g
            initial={{ rotate: -90 }}
            animate={{ rotate: needleAngle }}
            transition={{ type: 'spring', stiffness: 80, damping: 15 }}
            style={{ originX: `${centerX}px`, originY: `${centerY}px` }}
          >
            <line
              x1={centerX}
              y1={centerY}
              x2={centerX}
              y2={centerY - radius + 8}
              stroke="#800020"
              strokeWidth={3}
              strokeLinecap="round"
            />
            <circle cx={centerX} cy={centerY - radius + 8} r={2.5} fill="#D45060" />
          </motion.g>
        </svg>
      </div>

      <div className="flex items-center gap-1.5 mt-[-6px]">
        <span className="text-base font-extrabold text-[#800020] tracking-tight">{clampedScore}/100</span>
        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#F3E6D5] text-[#800020]">
          {trendText}
        </span>
      </div>
    </div>
  );
}
