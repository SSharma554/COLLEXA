import { useState } from 'react';
import { FREE_CERTIFICATES } from '../lib/data';
import { CertificateFlipCard } from '../components/CertificateFlipCard';
import { EarnedCertificate, UserProfile, CategoryType } from '../types';
import {
  Award,
  Search,
  CheckCircle2,
  Filter,
  ShieldCheck,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

interface CertificatesPageProps {
  currentUser: UserProfile | null;
  earnedCerts: EarnedCertificate[];
  onToggleClaimed: (providerName: string, certTitle: string, claimUrl: string) => boolean;
  onOpenAuth: () => void;
}

export function CertificatesPage({
  currentUser,
  earnedCerts,
  onToggleClaimed,
  onOpenAuth,
}: CertificatesPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [filterOnlyClaimed, setFilterOnlyClaimed] = useState(false);

  const categories: (CategoryType | 'All')[] = [
    'All',
    'Engineering',
    'Data & AI',
    'Design & Product',
    'Career / Placement',
  ];

  const filteredCerts = FREE_CERTIFICATES.filter((cert) => {
    const isClaimed = earnedCerts.some(
      (c) => c.provider_name === cert.provider_name && c.cert_title === cert.cert_title
    );
    if (filterOnlyClaimed && !isClaimed) return false;

    const matchesCategory = selectedCategory === 'All' || cert.category === selectedCategory;
    const matchesSearch =
      cert.cert_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.provider_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.skillsGained.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  const handleClaimToggle = (provider: string, title: string, url: string) => {
    if (!currentUser) {
      onOpenAuth();
      return;
    }
    onToggleClaimed(provider, title, url);
  };

  return (
    <div id="free-certificates-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#D45060]">
            Verified Free Directory
          </span>
          <h1
            className="text-3xl sm:text-4xl font-bold font-serif text-black mt-1 mb-2"
            style={{ color: '#000000' }}
          >
            Zero-Cost Industry Certifications
          </h1>
          <p className="text-sm text-[#5C3D46] max-w-2xl">
            100% free, verifiable credentials offered directly by AWS, Google Cloud, Meta,
            Harvard, and FreeCodeCamp. Tap or flip cards to review exam prerequisites and access claim portals.
          </p>
        </div>

        {/* Claimed Counter Banner */}
        <div className="p-4 bg-white rounded-2xl border border-[#F3E6D5] shadow-xs flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-[#5C3D46] block">Your Verified Credentials</span>
            <span className="text-lg font-black text-[#800020]">
              {earnedCerts.length} of {FREE_CERTIFICATES.length} Claimed
            </span>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#F3E6D5] mb-8">
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#800020] text-[#FFF9F2] border-[#800020] shadow-xs'
                  : 'bg-white text-[#5C3D46] border-[#F3E6D5] hover:border-[#800020] hover:text-[#800020]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-xs font-semibold text-[#800020] cursor-pointer select-none">
            <input
              type="checkbox"
              checked={filterOnlyClaimed}
              onChange={(e) => setFilterOnlyClaimed(e.target.checked)}
              className="rounded border-[#F3E6D5] text-[#800020] focus:ring-[#800020]"
            />
            <span>Show Claimed Only ({earnedCerts.length})</span>
          </label>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#5C3D46]/50 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search provider, skill..."
              className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-[#F3E6D5] bg-white text-[#800020] placeholder:text-[#5C3D46]/50 focus:outline-none focus:border-[#800020] w-48 sm:w-60"
            />
          </div>
        </div>
      </div>

      {/* 2D Flip Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCerts.map((cert) => {
          const isClaimed = earnedCerts.some(
            (c) => c.provider_name === cert.provider_name && c.cert_title === cert.cert_title
          );

          return (
            <CertificateFlipCard
              key={cert.id}
              id={`cert-flip-${cert.id}`}
              certificate={cert}
              isClaimed={isClaimed}
              onToggleClaimed={() =>
                handleClaimToggle(cert.provider_name, cert.cert_title, cert.claimUrl)
              }
            />
          );
        })}
      </div>

      {filteredCerts.length === 0 && (
        <div className="text-center py-16 bg-white rounded-3xl border border-[#F3E6D5] p-8">
          <Award className="w-10 h-10 text-[#800020]/30 mx-auto mb-2" />
          <p className="text-sm font-bold text-[#800020]">No Certificates Found</p>
          <p className="text-xs text-[#5C3D46] mt-1">
            Try adjusting your search filters or clearing the "Show Claimed Only" toggle.
          </p>
        </div>
      )}
    </div>
  );
}
