import { useState } from 'react';
import { motion } from 'motion/react';
import { CertificateDirectoryItem } from '../types';
import { CATEGORY_THEMES } from '../lib/data';
import { CheckCircle2, ExternalLink, RotateCw, Award, Clock, ShieldCheck } from 'lucide-react';

interface CertificateFlipCardProps {
  certificate: CertificateDirectoryItem;
  isClaimed: boolean;
  onToggleClaimed: () => void;
  id?: string;
}

export function CertificateFlipCard({
  certificate,
  isClaimed,
  onToggleClaimed,
  id,
}: CertificateFlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const theme = CATEGORY_THEMES[certificate.category];

  return (
    <div id={id} className="relative w-full h-[380px] perspective-1000 select-none">
      <motion.div
        className="w-full h-full relative transform-style-3d cursor-pointer"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
      >
        {/* FRONT FACE */}
        <div
          className="absolute inset-0 w-full h-full rounded-2xl bg-white shadow-sm border border-black p-6 flex flex-col justify-between backface-hidden transition-shadow duration-300 hover:shadow-xl"
          style={{ borderColor: '#000000' }}
        >
          <div>
            {/* Top Bar: Provider & Category Pill */}
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#800020]">
                {certificate.provider_name}
              </span>
              <span
                className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
                style={{ backgroundColor: theme.badgeBg, color: theme.color }}
              >
                {certificate.category}
              </span>
            </div>

            {/* Certificate Title */}
            <h3
              className="text-lg font-bold text-black leading-snug mb-2 font-serif-heading line-clamp-2"
              style={{ color: '#000000' }}
            >
              {certificate.cert_title}
            </h3>

            {/* Meta Tags */}
            <div className="flex flex-wrap items-center gap-2 mb-4 text-xs text-[#5C3D46]">
              <span className="inline-flex items-center gap-1 bg-[#FFF9F2] border border-[#F3E6D5] px-2 py-0.5 rounded-md">
                <Clock className="w-3.5 h-3.5 text-[#800020]" />
                {certificate.durationHours} Hours
              </span>
              <span className="inline-flex items-center gap-1 bg-[#FFF9F2] border border-[#F3E6D5] px-2 py-0.5 rounded-md">
                <Award className="w-3.5 h-3.5 text-[#D45060]" />
                {certificate.level}
              </span>
              <span className="inline-flex items-center gap-1 bg-[#FFF9F2] border border-[#F3E6D5] px-2 py-0.5 rounded-md">
                <ShieldCheck className="w-3.5 h-3.5 text-[#800020]" />
                100% Free
              </span>
            </div>

            {/* Skills Pills */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {certificate.skillsGained.slice(0, 4).map((skill, i) => (
                <span
                  key={i}
                  className="text-[11px] font-medium bg-[#F3E6D5]/60 text-[#800020] border border-[#F3E6D5] px-2.5 py-0.5 rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Bottom Action Area */}
          <div className="pt-3 border-t border-[#F3E6D5] flex items-center justify-between">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsFlipped(true);
              }}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#800020] hover:text-[#D45060] transition-colors py-1 px-2 rounded-lg hover:bg-[#FFF9F2] cursor-pointer"
            >
              <RotateCw className="w-3.5 h-3.5" />
              Flip for Claim Details
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleClaimed();
              }}
              className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                isClaimed
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : 'bg-white text-[#5C3D46] border-[#F3E6D5] hover:border-[#800020] hover:text-[#800020]'
              }`}
            >
              <CheckCircle2 className={`w-3.5 h-3.5 ${isClaimed ? 'text-emerald-700' : 'text-[#5C3D46]/40'}`} />
              {isClaimed ? 'Claimed' : 'Mark Claimed'}
            </button>
          </div>
        </div>

        {/* BACK FACE */}
        <div
          className="absolute inset-0 w-full h-full rounded-2xl bg-[#FFF9F2] border border-black p-6 flex flex-col justify-between backface-hidden rotate-y-180 shadow-md"
          style={{ borderColor: '#000000' }}
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#800020]">
                Verification &amp; Access
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFlipped(false);
                }}
                className="text-xs font-semibold text-[#800020] hover:text-[#D45060] inline-flex items-center gap-1 cursor-pointer"
              >
                <RotateCw className="w-3.5 h-3.5" />
                Back
              </button>
            </div>

            <h4
              className="text-sm font-bold text-black mb-2 font-serif-heading"
              style={{ color: '#000000' }}
            >
              How to Claim Your Credential
            </h4>

            <div className="space-y-2 text-xs text-[#5C3D46] mb-4">
              <div className="p-2.5 rounded-lg bg-white border border-[#F3E6D5]">
                <strong className="block text-[#800020] mb-0.5">Format:</strong>
                {certificate.learningFormat}
              </div>
              <div className="p-2.5 rounded-lg bg-white border border-[#F3E6D5]">
                <strong className="block text-[#800020] mb-0.5">Verification:</strong>
                {certificate.verificationMethod}
              </div>
              <div className="p-2.5 rounded-lg bg-white border border-[#F3E6D5]">
                <strong className="block text-[#800020] mb-0.5">Prerequisites:</strong>
                {certificate.prerequisites}
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#F3E6D5] flex items-center justify-between gap-2">
            <a
              href={certificate.claimUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs font-bold py-2 px-3 rounded-xl bg-[#800020] text-[#FFF9F2] hover:bg-[#660019] transition-colors cursor-pointer"
            >
              Claim on {certificate.provider_name.split(' ')[0]}
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleClaimed();
              }}
              className={`inline-flex items-center gap-1 text-xs font-semibold px-3 py-2 rounded-xl border transition-all cursor-pointer ${
                isClaimed
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-400'
                  : 'bg-white text-[#800020] border-[#F3E6D5] hover:border-[#800020]'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              {isClaimed ? 'Claimed' : 'Done'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
