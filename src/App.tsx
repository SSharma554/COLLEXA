import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Toaster, toast } from 'sonner';
import { Navbar } from './components/Navbar';
import { AuthModal } from './components/AuthModal';
import { PrivacyPolicyModal } from './components/PrivacyPolicyModal';
import { useCollexaStore } from './lib/store';

// Pages
import { HomePage } from './pages/HomePage';
import { HubPage } from './pages/HubPage';
import { RoadmapDetailPage } from './pages/RoadmapDetailPage';
import { InterviewPrepPage } from './pages/InterviewPrepPage';
import { LiveInterviewPage } from './pages/LiveInterviewPage';
import { InterviewResultsPage } from './pages/InterviewResultsPage';
import { CounselingPage } from './pages/CounselingPage';
import { CertificatesPage } from './pages/CertificatesPage';
import { DashboardPage } from './pages/DashboardPage';

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname + window.location.search || '/';
  });
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [targetRoutePending, setTargetRoutePending] = useState<string | undefined>(undefined);
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);
  const [privacyModalTab, setPrivacyModalTab] = useState<'privacy' | 'unsubscribe'>('privacy');

  const {
    currentUser,
    loginUser,
    logoutUser,
    updateProfile,
    roadmapProgress,
    toggleStageCompletion,
    saveProofOfWork,
    interviewSessions,
    createInterviewSession,
    completeInterviewSession,
    counselingThreads,
    counselingMessages,
    earnedCerts,
    toggleCertificateClaimed,
    deleteAccountWithCascade,
  } = useCollexaStore();

  // Listen for OAuth postMessage callbacks
  useEffect(() => {
    const handleOAuthMessage = async (event: MessageEvent) => {
      if (event.data && event.data.type === 'COLLEXA_OAUTH_SUCCESS') {
        toast.success('Google Authentication confirmed!');
        await loginUser('alex.rivera@collexa.dev', 'Alex Rivera');
        if (event.data.next) {
          navigate(event.data.next);
        }
      }
    };
    window.addEventListener('message', handleOAuthMessage);
    return () => window.removeEventListener('message', handleOAuthMessage);
  }, []);

  // Handle browser back/forward buttons
  useEffect(() => {
    const onPopState = () => {
      setCurrentPath(window.location.pathname + window.location.search || '/');
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigate = (path: string) => {
    if (path === currentPath) return;
    window.history.pushState(null, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Parse path
  const [pathOnly, queryString] = currentPath.split('?');
  const urlParams = new URLSearchParams(queryString || '');

  // Auto handle ?next= param or route gating
  useEffect(() => {
    const nextParam = urlParams.get('next');
    if (nextParam && !currentUser) {
      setTargetRoutePending(nextParam);
      setIsAuthOpen(true);
    }
  }, [currentPath, currentUser]);

  // Route matching
  const renderCurrentView = () => {
    if (pathOnly === '/' || pathOnly === '') {
      return (
        <HomePage
          onNavigate={navigate}
          currentUser={currentUser}
          onOpenAuth={() => setIsAuthOpen(true)}
        />
      );
    }

    if (pathOnly === '/hub' || pathOnly === '/roadmaps' || pathOnly === '/roadmap') {
      const initialTab = (urlParams.get('tab') as 'roadmaps' | 'careers') || 'roadmaps';
      return (
        <HubPage
          initialTab={initialTab}
          onNavigate={navigate}
          roadmapProgress={roadmapProgress}
        />
      );
    }

    if (pathOnly.startsWith('/roadmap/')) {
      const slug = pathOnly.replace('/roadmap/', '');
      return (
        <RoadmapDetailPage
          slug={slug}
          onNavigate={navigate}
          currentUser={currentUser}
          roadmapProgress={roadmapProgress}
          onToggleStage={toggleStageCompletion}
          onSaveProof={saveProofOfWork}
          onOpenAuth={() => {
            setTargetRoutePending('Roadmap Milestone Progress');
            setIsAuthOpen(true);
          }}
        />
      );
    }

    if (pathOnly === '/interview-prep') {
      const track = urlParams.get('track') || undefined;
      return (
        <InterviewPrepPage
          initialTrack={track}
          onNavigate={navigate}
          currentUser={currentUser}
          pastSessions={interviewSessions}
          onCreateSession={createInterviewSession}
          onOpenAuth={() => {
            setTargetRoutePending('Interview Telemetry Saving');
            setIsAuthOpen(true);
          }}
        />
      );
    }

    if (pathOnly === '/interview/live') {
      const sessionId = urlParams.get('session') || (interviewSessions[0]?.id ?? 'session_demo');
      return (
        <LiveInterviewPage
          sessionId={sessionId}
          sessions={interviewSessions}
          onFinishSession={completeInterviewSession}
          onNavigate={navigate}
        />
      );
    }

    if (pathOnly === '/interview/results') {
      const sessionId = urlParams.get('session') || (interviewSessions[0]?.id ?? '');
      return (
        <InterviewResultsPage
          sessionId={sessionId}
          sessions={interviewSessions}
          onNavigate={navigate}
        />
      );
    }

    if (pathOnly === '/counseling') {
      return (
        <CounselingPage
          currentUser={currentUser}
          threads={counselingThreads}
          messages={counselingMessages}
          onSendMessage={async (threadId, content) => {}}
          onCreateThread={(title) => 'thread_' + Math.random().toString(36).substring(2, 8)}
          onOpenAuth={() => {
            setTargetRoutePending('Career Advisory History');
            setIsAuthOpen(true);
          }}
          onNavigate={navigate}
        />
      );
    }

    if (pathOnly === '/free-certificates') {
      return (
        <CertificatesPage
          currentUser={currentUser}
          earnedCerts={earnedCerts}
          onToggleClaimed={toggleCertificateClaimed}
          onOpenAuth={() => {
            setTargetRoutePending('Certificate Verification Log');
            setIsAuthOpen(true);
          }}
        />
      );
    }

    if (pathOnly === '/dashboard') {
      return (
        <DashboardPage
          currentUser={currentUser}
          roadmapProgress={roadmapProgress}
          interviewSessions={interviewSessions}
          earnedCerts={earnedCerts}
          onUpdateProfile={updateProfile}
          onDeleteAccount={deleteAccountWithCascade}
          onNavigate={navigate}
          onOpenAuth={() => {
            setTargetRoutePending('Personal Learning Dashboard');
            setIsAuthOpen(true);
          }}
        />
      );
    }

    // Default fallback to Home
    return (
      <HomePage
        onNavigate={navigate}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
      />
    );
  };

  return (
    <div className="min-h-screen bg-[#FFF9F2] text-[#5C3D46] flex flex-col font-sans selection:bg-[#F3E6D5] selection:text-[#800020]">
      {/* Toast Notification Container */}
      <Toaster position="bottom-right" richColors theme="light" />

      {/* Fixed Navigation Bar */}
      <Navbar
        currentPath={pathOnly}
        onNavigate={navigate}
        currentUser={currentUser}
        onOpenAuth={() => {
          setTargetRoutePending(undefined);
          setIsAuthOpen(true);
        }}
        onLogout={logoutUser}
      />

      {/* Main Routed Page Content with Framer Motion Transition */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={pathOnly}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
          >
            {renderCurrentView()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Global Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLogin={loginUser}
        targetRouteName={targetRoutePending}
      />

      {/* Dedicated Privacy & Unsubscribe Modal */}
      <PrivacyPolicyModal
        isOpen={privacyModalOpen}
        defaultTab={privacyModalTab}
        onClose={() => setPrivacyModalOpen(false)}
      />

      {/* Editorial Footer */}
      <footer className="border-t border-[#F3E6D5] bg-white mt-16 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#800020] text-[#FFF9F2] font-serif font-black text-sm flex items-center justify-center shadow-xs">
              C
            </div>
            <div>
              <span
                className="font-serif text-base font-bold text-black"
                style={{ color: '#000000' }}
              >
                COLLEXA
              </span>
              <p className="text-xs text-[#5C3D46]">
                Career Roadmaps &bull; AI Mock Interviews &bull; Advisory &bull; Free Credentials
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-[#5C3D46]">
            <button onClick={() => navigate('/roadmaps?tab=roadmaps')} className="hover:text-[#800020] cursor-pointer">
              Roadmaps &amp; Career Tracks
            </button>
            <button onClick={() => navigate('/hub?tab=careers')} className="hover:text-[#800020] cursor-pointer">
              Market Demand
            </button>
            <button onClick={() => navigate('/interview-prep')} className="hover:text-[#800020] cursor-pointer">
              AI Mock Interview
            </button>
            <button onClick={() => navigate('/counseling')} className="hover:text-[#800020] cursor-pointer">
              Career Counselor
            </button>
            <button onClick={() => navigate('/free-certificates')} className="hover:text-[#800020] cursor-pointer">
              Free Certs
            </button>
            <button onClick={() => navigate('/dashboard')} className="hover:text-[#800020] cursor-pointer">
              Dashboard
            </button>
            <button
              onClick={() => {
                setPrivacyModalTab('privacy');
                setPrivacyModalOpen(true);
              }}
              className="hover:text-[#800020] text-[#800020] font-semibold cursor-pointer"
            >
              Privacy &amp; Media Policy
            </button>
            <button
              onClick={() => {
                setPrivacyModalTab('unsubscribe');
                setPrivacyModalOpen(true);
              }}
              className="hover:text-[#800020] cursor-pointer"
            >
              Unsubscribe
            </button>
          </div>

          <div className="text-xs text-[#5C3D46]/70 text-center md:text-right">
            <span>&copy; {new Date().getFullYear()} COLLEXA Platform. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
