import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { GenerativeHeroCanvas } from '../components/GenerativeHeroCanvas';
import { TiltCard } from '../components/TiltCard';
import { ROADMAPS, CATEGORY_THEMES } from '../lib/data';
import { UserProfile } from '../types';
import {
  Compass,
  Video,
  Sparkles,
  Award,
  ArrowRight,
  CheckCircle2,
  Users,
  Target,
  BarChart3,
  Search,
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (path: string) => void;
  currentUser: UserProfile | null;
  onOpenAuth: () => void;
}

export function HomePage({ onNavigate, currentUser, onOpenAuth }: HomePageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  // Simulated Live Metrics Counter with count-up animation
  const [metrics, setMetrics] = useState({
    activeLearners: 42100,
    mockInterviews: 118400,
    milestonesPassed: 89,
    certsClaimed: 29800,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setMetrics((prev) => ({
        ...prev,
        activeLearners: prev.activeLearners + Math.floor(Math.random() * 3),
        mockInterviews: prev.mockInterviews + Math.floor(Math.random() * 5),
        certsClaimed: prev.certsClaimed + (Math.random() > 0.6 ? 1 : 0),
      }));
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const featureCards = [
    {
      title: 'Structured Skill Roadmaps',
      category: 'Engineering',
      categoryColor: '#F59E0B',
      icon: Compass,
      description: 'Step through 6-stage industry-verified roadmaps with interactive proof-of-work check-ins.',
      route: '/hub?tab=roadmaps',
    },
    {
      title: 'Real-Time AI Mock Interviews',
      category: 'Career / Placement',
      categoryColor: '#8B5CF6',
      icon: Video,
      description: 'WebRTC camera & mic analysis measuring posture, gaze tracking, pacing, and filler words.',
      route: '/interview-prep',
    },
    {
      title: 'AI Career Counseling',
      category: 'Data & AI',
      categoryColor: '#14B8A6',
      icon: Sparkles,
      description: 'Personalized career strategy, salary negotiation blueprints, and portfolio guidance powered by Gemini.',
      route: '/counseling',
    },
    {
      title: 'Free Certificate Directory',
      category: 'Design & Product',
      categoryColor: '#FB7185',
      icon: Award,
      description: 'Interactive 2D card flips with verified free certifications from AWS, Google, Meta, and Harvard.',
      route: '/free-certificates',
    },
  ];

  return (
    <div className="w-full relative">
      {/* 1. HERO SECTION WITH GENERATIVE 2D CANVAS */}
      <section className="relative min-h-[580px] sm:min-h-[640px] flex items-center justify-center overflow-hidden border-b border-[#E2E8F0] px-4 py-16 sm:py-24">
        {/* 2D Canvas Layer */}
        <GenerativeHeroCanvas />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          {/* Quick Action Pill */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F3E6D5]/60 border border-[#F3E6D5] text-[#800020] text-xs font-semibold mb-6 shadow-2xs"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            <span>COLLEXA Career Acceleration Engine &bull; Updated for 2026</span>
          </motion.div>

          {/* Animated Headline in Gradient Serif Text */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight font-serif text-[#800020] leading-[1.1] mb-6"
          >
            Map Your Career with{' '}
            <span className="signature-gradient-text animate-signature-sweep">
              Real-Time AI Precision
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg text-[#5C3D46] max-w-2xl mx-auto leading-relaxed mb-8"
          >
            COLLEXA combines structured milestone roadmaps, live audio-visual AI mock
            interviews with biometric telemetry, personalized executive counseling, and
            curated free industry credentials.
          </motion.p>

          {/* Quick Search & Filter Input */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="max-w-xl mx-auto mb-8"
          >
            <div className="relative flex items-center bg-white rounded-2xl border border-[#F3E6D5] shadow-sm p-1.5 focus-within:border-[#800020] transition-colors">
              <Search className="w-4 h-4 text-[#800020]/50 ml-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') onNavigate('/hub');
                }}
                placeholder="Search roadmaps, careers (e.g. AI Engineer, Full-Stack)..."
                className="w-full px-3 py-2 text-xs sm:text-sm text-[#800020] placeholder:text-[#5C3D46]/40 focus:outline-none bg-transparent"
              />
              <button
                onClick={() => onNavigate('/hub')}
                className="px-4 py-2 rounded-xl text-xs font-bold text-[#FFF9F2] bg-[#800020] hover:bg-[#660019] transition-colors cursor-pointer"
              >
                Explore
              </button>
            </div>

            {/* Quick Action Category Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-3">
              {['Full-Stack', 'Generative AI', 'Cloud SRE', 'Product UI/UX', 'Tech PM'].map((pill) => (
                <button
                  key={pill}
                  onClick={() => onNavigate('/hub')}
                  className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-white border border-[#F3E6D5] text-[#5C3D46] hover:text-[#800020] hover:border-[#800020] transition-all cursor-pointer"
                >
                  {pill}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Hero CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <button
              id="hero-cta-hub"
              onClick={() => onNavigate('/hub')}
              className="relative p-[2px] rounded-2xl group transition-transform active:scale-95 cursor-pointer"
            >
              <div className="absolute inset-0 rounded-2xl signature-gradient-bg animate-signature-sweep opacity-90 group-hover:opacity-100 transition-opacity" />
              <div className="relative px-6 py-3.5 rounded-2xl bg-[#800020] text-[#FFF9F2] font-semibold text-sm inline-flex items-center gap-2 group-hover:bg-[#660019] transition-colors">
                <span>Start Career Roadmap</span>
                <ArrowRight className="w-4 h-4 text-[#F3E6D5] group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            <button
              id="hero-cta-interview"
              onClick={() => onNavigate('/interview-prep')}
              className="px-6 py-3.5 rounded-2xl bg-[#FFF9F2] border border-[#F3E6D5] text-[#800020] font-semibold text-sm hover:bg-[#F3E6D5]/50 hover:shadow-md transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <Video className="w-4 h-4 text-[#800020]" />
              <span>Launch AI Mock Interview</span>
            </button>
          </motion.div>
        </div>
      </section>

      {/* 2. CONDITIONAL GOOGLE / DEMO AUTH BANNER */}
      {!currentUser && (
        <section className="bg-[#FFF9F2] border-b border-[#F3E6D5] px-4 py-4">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#F3E6D5] shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#F3E6D5] text-[#800020] flex items-center justify-center font-bold text-sm">
                🎓
              </div>
              <div>
                <p className="text-xs font-bold text-[#800020]">
                  Unlock personalized progress tracking &amp; real-time telemetry saving
                </p>
                <p className="text-[11px] text-[#5C3D46]">
                  Sign in with Google to automatically link your roadmap milestones and interview scorecards.
                </p>
              </div>
            </div>
            <button
              onClick={onOpenAuth}
              className="px-4 py-2 rounded-xl text-xs font-bold text-[#FFF9F2] bg-[#800020] hover:bg-[#660019] transition-all cursor-pointer shadow-xs whitespace-nowrap"
            >
              Sign In to COLLEXA
            </button>
          </div>
        </section>
      )}

      {/* 3. LIVE ISR METRICS COUNTER */}
      <section className="py-12 px-4 max-w-7xl mx-auto border-b border-[#F3E6D5]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-[#F3E6D5] shadow-xs text-center">
            <Users className="w-5 h-5 text-[#800020] mx-auto mb-2" />
            <div className="text-2xl sm:text-3xl font-extrabold text-[#800020] tracking-tight">
              {metrics.activeLearners.toLocaleString()}
            </div>
            <p className="text-xs text-[#5C3D46] font-medium mt-1">Active Career Learners</p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-[#F3E6D5] shadow-xs text-center">
            <Video className="w-5 h-5 text-[#14B8A6] mx-auto mb-2" />
            <div className="text-2xl sm:text-3xl font-extrabold text-[#800020] tracking-tight">
              {metrics.mockInterviews.toLocaleString()}
            </div>
            <p className="text-xs text-[#5C3D46] font-medium mt-1">AI Mock Interviews Taken</p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-[#F3E6D5] shadow-xs text-center">
            <Target className="w-5 h-5 text-[#D45060] mx-auto mb-2" />
            <div className="text-2xl sm:text-3xl font-extrabold text-[#800020] tracking-tight">
              {metrics.milestonesPassed}%
            </div>
            <p className="text-xs text-[#5C3D46] font-medium mt-1">Milestone Completion Rate</p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-[#F3E6D5] shadow-xs text-center">
            <Award className="w-5 h-5 text-[#800020] mx-auto mb-2" />
            <div className="text-2xl sm:text-3xl font-extrabold text-[#800020] tracking-tight">
              {metrics.certsClaimed.toLocaleString()}
            </div>
            <p className="text-xs text-[#5C3D46] font-medium mt-1">Free Certs Claimed</p>
          </div>
        </div>
      </section>

      {/* 4. FOUR CORE FEATURES WITH 2D TILT CARDS */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-[#D45060]">
            Architected for High-Growth Tech Careers
          </span>
          <h2
            className="text-3xl sm:text-4xl font-bold font-serif text-black mt-2 mb-3"
            style={{ color: '#000000' }}
          >
            An End-to-End Career Acceleration Suite
          </h2>
          <p className="text-xs sm:text-sm text-[#5C3D46]">
            Hover over cards to feel subtle 2D spring physics and explore core platform modules.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featureCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <TiltCard
                key={i}
                id={`feature-card-${i}`}
                categoryColor={card.categoryColor}
                onClick={() => onNavigate(card.route)}
                className="p-6 flex flex-col justify-between group h-full"
              >
                <div>
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                    style={{ backgroundColor: `${card.categoryColor}15`, color: card.categoryColor }}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span
                    className="text-[11px] font-bold uppercase tracking-wider mb-1 block"
                    style={{ color: card.categoryColor }}
                  >
                    {card.category}
                  </span>
                  <h3
                    className="text-lg font-bold text-black mb-2 font-serif-heading"
                    style={{ color: '#000000' }}
                  >
                    {card.title}
                  </h3>
                  <p className="text-xs text-[#5C3D46] leading-relaxed mb-4">
                    {card.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#F3E6D5] flex items-center justify-between text-xs font-semibold text-[#800020] group-hover:text-[#D45060] transition-colors">
                  <span>Explore Module</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </TiltCard>
            );
          })}
        </div>
      </section>

      {/* 5. ROADMAP PREVIEWS WITH CATEGORY STRIPES */}
      <section className="py-16 px-4 bg-[#FFF9F2]/60 border-t border-[#F3E6D5]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#14B8A6]">
                Curated Roadmaps
              </span>
              <h2
                className="text-2xl sm:text-3xl font-bold font-serif text-black mt-1"
                style={{ color: '#000000' }}
              >
                Engineered for Modern Engineering Standards
              </h2>
            </div>
            <button
              onClick={() => onNavigate('/hub?tab=roadmaps')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#800020] hover:text-[#D45060] py-2 px-3 rounded-xl hover:bg-white transition-all border border-transparent hover:border-[#F3E6D5] cursor-pointer"
            >
              <span>View All 6 Roadmaps</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ROADMAPS.slice(0, 3).map((roadmap) => {
              const theme = CATEGORY_THEMES[roadmap.category];
              return (
                <div
                  key={roadmap.id}
                  onClick={() => onNavigate(`/roadmap/${roadmap.slug}`)}
                  className="rounded-2xl bg-white border border-black p-6 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
                  style={{ borderColor: '#000000' }}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span
                        className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
                        style={{ backgroundColor: theme.badgeBg, color: theme.color }}
                      >
                        {roadmap.category}
                      </span>
                      <span className="text-xs text-[#5C3D46] font-medium">
                        {roadmap.estimatedWeeks} Weeks
                      </span>
                    </div>

                    <h3
                      className="text-lg font-bold text-black mb-2 font-serif-heading"
                      style={{ color: '#000000' }}
                    >
                      {roadmap.title}
                    </h3>
                    <p className="text-xs text-[#5C3D46] leading-relaxed mb-4 line-clamp-2">
                      {roadmap.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {roadmap.tags.slice(0, 3).map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-[#F3E6D5]/60 text-[#800020] border border-[#F3E6D5]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#F3E6D5] flex items-center justify-between text-xs font-semibold text-[#800020]">
                    <span className="text-[#5C3D46]/70 font-normal">
                      {roadmap.stagesCount} Structured Stages
                    </span>
                    <span className="text-[#800020] inline-flex items-center gap-1 font-bold">
                      Start Stage 1 &rarr;
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
