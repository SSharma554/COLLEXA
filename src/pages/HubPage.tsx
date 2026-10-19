import { useState, useEffect } from 'react';
import { ROADMAPS, CAREERS, CATEGORY_THEMES } from '../lib/data';
import { CategoryType } from '../types';
import { DemandGauge } from '../components/DemandGauge';
import {
  Compass,
  Briefcase,
  Search,
  Filter,
  ArrowRight,
  TrendingUp,
  Building2,
  Clock,
  CheckCircle2,
} from 'lucide-react';

interface HubPageProps {
  initialTab?: 'roadmaps' | 'careers';
  onNavigate: (path: string) => void;
  roadmapProgress?: Record<string, any>;
}

export function HubPage({
  initialTab = 'roadmaps',
  onNavigate,
  roadmapProgress = {},
}: HubPageProps) {
  const [activeTab, setActiveTab] = useState<'roadmaps' | 'careers'>(initialTab);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Sync tab with URL parameter simulation
  const handleTabChange = (tab: 'roadmaps' | 'careers') => {
    setActiveTab(tab);
    window.history.replaceState(null, '', `?tab=${tab}`);
  };

  const categories: (CategoryType | 'All')[] = [
    'All',
    'Engineering',
    'Data & AI',
    'Design & Product',
    'Career / Placement',
  ];

  // Filter roadmaps
  const filteredRoadmaps = ROADMAPS.filter((r) => {
    const matchesCat = selectedCategory === 'All' || r.category === selectedCategory;
    const matchesSearch =
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // Filter careers
  const filteredCareers = CAREERS.filter((c) => {
    const matchesCat = selectedCategory === 'All' || c.category === selectedCategory;
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.topSkills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div id="hub-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page Header */}
      <div className="mb-8">
        <span className="text-xs font-bold uppercase tracking-wider text-[#800020]">
          Roadmaps &amp; Career Tracks
        </span>
        <h1
          className="text-3xl sm:text-4xl font-bold font-serif text-black mt-1 mb-2"
          style={{ color: '#000000' }}
        >
          Roadmaps &amp; Career Tracks
        </h1>
        <p className="text-sm text-[#5C3D46] max-w-3xl">
          Explore structured milestone blueprints in <strong>All Roadmaps</strong>, or cross-reference real-time tech market salary bands, required competencies, and SVG demand meters in <strong>Career Tracks</strong>.
        </p>
      </div>

      {/* Tabs & Filter Control Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#F3E6D5] mb-8">
        {/* Tab Switcher */}
        <div className="inline-flex p-1 bg-[#F3E6D5]/40 rounded-2xl border border-[#F3E6D5]">
          <button
            id="hub-tab-roadmaps"
            onClick={() => handleTabChange('roadmaps')}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all inline-flex items-center gap-2 cursor-pointer ${
              activeTab === 'roadmaps'
                ? 'bg-white text-[#800020] shadow-xs font-bold'
                : 'text-[#5C3D46] hover:text-[#800020]'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-[#800020]" />
            All Roadmaps ({ROADMAPS.length})
          </button>
          <button
            id="hub-tab-careers"
            onClick={() => handleTabChange('careers')}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all inline-flex items-center gap-2 cursor-pointer ${
              activeTab === 'careers'
                ? 'bg-white text-[#800020] shadow-xs font-bold'
                : 'text-[#5C3D46] hover:text-[#800020]'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5 text-[#D45060]" />
            Career Tracks ({CAREERS.length})
          </button>
        </div>

        {/* Search & Category Filter */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#800020]/40 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by skill, title..."
              className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-[#F3E6D5] bg-white text-[#800020] placeholder:text-[#5C3D46]/50 focus:outline-none focus:border-[#800020] w-48 sm:w-60"
            />
          </div>

          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-[11px] font-semibold px-3 py-1.5 rounded-xl border transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#800020] text-[#FFF9F2] border-[#800020]'
                    : 'bg-white text-[#5C3D46] border-[#F3E6D5] hover:border-[#800020] hover:text-[#800020]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ROADMAPS TAB */}
      {activeTab === 'roadmaps' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRoadmaps.map((roadmap) => {
            const theme = CATEGORY_THEMES[roadmap.category];
            const userProgress = roadmapProgress[roadmap.slug];
            const completedCount = userProgress?.completed_stages?.length || 0;
            const pct = Math.round((completedCount / roadmap.stagesCount) * 100);

            return (
              <div
                key={roadmap.id}
                id={`roadmap-card-${roadmap.slug}`}
                onClick={() => onNavigate(`/roadmap/${roadmap.slug}`)}
                className="rounded-2xl bg-white border border-black p-6 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between group"
                style={{ borderColor: '#000000' }}
              >
                <div>
                  {/* Category Pill & Timeline */}
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
                      style={{ backgroundColor: theme.badgeBg, color: theme.color }}
                    >
                      {roadmap.category}
                    </span>
                    <span className="text-xs text-[#5C3D46] font-medium inline-flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#800020]/50" />
                      {roadmap.estimatedWeeks} Weeks
                    </span>
                  </div>

                  {/* Title */}
                  <h3
                    className="text-lg font-bold mb-2 font-serif-heading text-black group-hover:text-[#D45060] transition-colors"
                    style={{ color: '#000000' }}
                  >
                    {roadmap.title}
                  </h3>

                  <p className="text-xs text-[#5C3D46] leading-relaxed mb-4 line-clamp-2">
                    {roadmap.description}
                  </p>

                  {/* Tags / Pills inside the tab card */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {roadmap.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-[#F3E6D5]/60 text-[#800020] border border-[#F3E6D5]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Progress & Action Bottom Bar */}
                <div className="pt-4 border-t border-[#F3E6D5]">
                  {completedCount > 0 ? (
                    <div className="mb-2">
                      <div className="flex items-center justify-between text-[11px] font-semibold text-[#800020] mb-1">
                        <span className="inline-flex items-center gap-1 text-[#800020]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#D45060]" />
                          {completedCount} / {roadmap.stagesCount} Stages
                        </span>
                        <span className="font-bold">{pct}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-[#F3E6D5]/60 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${pct}%`, backgroundColor: theme.color }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between text-xs font-semibold text-[#800020]">
                      <span className="text-[#5C3D46]/70 font-normal">
                        {roadmap.stagesCount} Structured Stages
                      </span>
                      <span className="text-[#800020] inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform font-bold">
                        Explore Stages &rarr;
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CAREERS TAB WITH DEMAND GAUGES */}
      {activeTab === 'careers' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCareers.map((career) => {
            const theme = CATEGORY_THEMES[career.category];

            return (
              <div
                key={career.id}
                id={`career-card-${career.id}`}
                className="rounded-2xl bg-white border border-black p-6 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
                style={{ borderColor: '#000000' }}
              >
                <div>
                  {/* Top Bar */}
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <span
                        className="text-xs font-semibold px-2.5 py-0.5 rounded-full inline-block mb-1.5"
                        style={{ backgroundColor: theme.badgeBg, color: theme.color }}
                      >
                        {career.category}
                      </span>
                      <h3
                        className="text-xl font-bold text-black font-serif-heading"
                        style={{ color: '#000000' }}
                      >
                        {career.title}
                      </h3>
                    </div>

                    {/* SVG Demand Gauge Arc */}
                    <div className="shrink-0">
                      <DemandGauge score={career.demandScore} trendText={career.demandTrend} size={135} />
                    </div>
                  </div>

                  {/* Explicit Salary Range & Market Estimates */}
                  <div className="p-3 bg-[#FFF9F2] rounded-xl border border-[#F3E6D5] flex flex-wrap items-center justify-between gap-2 mb-4">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#5C3D46]/70 tracking-wider block">
                        Estimated Compensation
                      </span>
                      <span className="text-base font-extrabold text-[#800020]">
                        {career.salaryMinINR} &ndash; {career.salaryMaxINR}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] uppercase font-bold text-[#5C3D46]/70 tracking-wider block">
                        Market Openings
                      </span>
                      <span className="text-xs font-semibold text-[#D45060]">
                        {career.openRolesEstimate}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-[#5C3D46] leading-relaxed mb-4">
                    {career.description}
                  </p>

                  {/* Top Required Skills */}
                  <div className="mb-4">
                    <span className="text-[11px] font-bold text-[#800020] block mb-1.5">
                      Core Evaluation Competencies:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {career.topSkills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-[#F3E6D5]/60 text-[#800020] border border-[#F3E6D5]"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Companies hiring */}
                  <div className="flex items-center gap-1.5 text-xs text-[#5C3D46]">
                    <Building2 className="w-3.5 h-3.5 text-[#800020]/50" />
                    <span>Top Hirers: {career.keyHiringCompanies.join(', ')}</span>
                  </div>
                </div>

                {/* Bottom CTA */}
                <div className="pt-4 border-t border-[#F3E6D5] mt-4 flex items-center justify-between">
                  <button
                    onClick={() => onNavigate(`/interview-prep?track=${encodeURIComponent(career.title)}`)}
                    className="text-xs font-bold text-[#800020] hover:text-[#D45060] inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    Mock Interview for This Role &rarr;
                  </button>
                  <button
                    onClick={() => onNavigate(`/roadmap/${career.matchingRoadmapSlug}`)}
                    className="text-xs font-semibold px-3.5 py-1.5 rounded-xl bg-[#800020] text-[#FFF9F2] hover:bg-[#660019] transition-colors cursor-pointer"
                  >
                    Open Roadmap
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
