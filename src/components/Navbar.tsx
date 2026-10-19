import { useState } from 'react';
import { UserProfile } from '../types';
import {
  Compass,
  Video,
  Sparkles,
  Award,
  LayoutDashboard,
  Menu,
  X,
  LogOut,
  User,
  ShieldCheck,
} from 'lucide-react';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  currentUser: UserProfile | null;
  onOpenAuth: () => void;
  onLogout: () => void;
}

export function Navbar({
  currentPath,
  onNavigate,
  currentUser,
  onOpenAuth,
  onLogout,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navItems = [
    { label: 'Roadmaps & Career Tracks', path: '/roadmaps', icon: Compass },
    { label: 'AI Mock Interview', path: '/interview-prep', icon: Video },
    { label: 'AI Counseling', path: '/counseling', icon: Sparkles },
    { label: 'Free Certificates', path: '/free-certificates', icon: Award },
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  ];

  const handleNav = (path: string) => {
    onNavigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FFF9F2]/90 backdrop-blur-md border-b border-[#F3E6D5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Wordmark */}
        <div
          id="nav-logo"
          onClick={() => handleNav('/')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-xl bg-[#800020] flex items-center justify-center text-[#FFF9F2] font-serif font-black text-lg shadow-sm group-hover:scale-105 transition-transform">
            C
          </div>
          <span
            className="font-serif text-xl font-bold tracking-tight text-black"
            style={{ color: '#000000' }}
          >
            COLLEXA
          </span>
          <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#F3E6D5] text-[#800020]">
            Platform
          </span>
        </div>

        {/* Desktop Nav Items */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive =
              item.path === '/roadmaps'
                ? currentPath === '/roadmaps' || currentPath === '/hub' || currentPath.startsWith('/roadmap/')
                : currentPath === item.path || (item.path !== '/' && currentPath.startsWith(item.path));
            const Icon = item.icon;

            return (
              <button
                key={item.path}
                id={`nav-link-${item.path.replace('/', '') || 'home'}`}
                onClick={() => handleNav(item.path)}
                className={`relative px-2.5 xl:px-3.5 py-2 rounded-xl text-xs xl:text-sm font-medium whitespace-nowrap transition-all inline-flex items-center gap-1.5 xl:gap-2 cursor-pointer ${
                  isActive
                    ? 'text-[#800020] font-semibold bg-white shadow-xs border border-[#F3E6D5]'
                    : 'text-[#5C3D46] hover:text-[#800020] hover:bg-[#F3E6D5]/40'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#800020]' : 'text-[#800020]/50'}`} />
                {item.label}
                {isActive && (
                  <span className="absolute bottom-[-1px] left-3 right-3 h-[2px] rounded-full signature-gradient-bg animate-signature-sweep" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Auth & Profile Actions */}
        <div className="flex items-center gap-3">
          {currentUser ? (
            <div className="relative">
              <button
                id="user-profile-menu-button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2.5 p-1.5 rounded-full hover:bg-white transition-colors border border-transparent hover:border-[#F3E6D5] cursor-pointer"
              >
                <img
                  src={currentUser.avatar_url}
                  alt={currentUser.full_name}
                  className="w-8 h-8 rounded-full border border-[#F3E6D5] object-cover bg-white"
                />
                <span className="hidden sm:inline-block text-xs font-semibold text-[#800020] max-w-[120px] truncate">
                  {currentUser.full_name}
                </span>
              </button>

              {userDropdownOpen && (
                <div
                  id="user-profile-dropdown"
                  className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-[#F3E6D5] p-2 z-50 animate-in fade-in slide-in-from-top-2"
                >
                  <div className="px-3 py-2 border-b border-[#F3E6D5] mb-1">
                    <p
                      className="text-xs font-bold text-black truncate"
                      style={{ color: '#000000' }}
                    >
                      {currentUser.full_name}
                    </p>
                    <p className="text-[11px] text-[#5C3D46] truncate">{currentUser.email}</p>
                    <span className="inline-block mt-1 text-[10px] font-semibold text-[#800020] bg-[#F3E6D5] px-2 py-0.5 rounded-md">
                      {currentUser.role_target}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      handleNav('/dashboard');
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-medium text-[#800020] hover:bg-[#FFF9F2] rounded-lg flex items-center gap-2 cursor-pointer"
                  >
                    <User className="w-3.5 h-3.5 text-[#D45060]" />
                    Profile & Settings
                  </button>

                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      onLogout();
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-medium text-[#D45060] hover:bg-rose-50 rounded-lg flex items-center gap-2 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5 text-[#D45060]" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              id="auth-open-button"
              onClick={onOpenAuth}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#800020] text-[#FFF9F2] hover:bg-[#660019] transition-all shadow-xs cursor-pointer active:scale-[0.99]"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#F3E6D5]" />
              Sign In
            </button>
          )}

          {/* Mobile hamburger */}
          <button
            id="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-[#5C3D46] hover:bg-white border border-transparent hover:border-[#F3E6D5]"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#F3E6D5] bg-[#FFF9F2] px-4 py-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path;
            return (
              <button
                key={item.path}
                onClick={() => handleNav(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium ${
                  isActive ? 'bg-white text-[#800020] font-bold border border-[#F3E6D5]' : 'text-[#5C3D46]'
                }`}
              >
                <Icon className="w-4 h-4 text-[#800020]" />
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}
