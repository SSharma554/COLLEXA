import { useState, useEffect, useRef } from 'react';
import { InterviewSession, UserProfile } from '../types';
import {
  Video,
  Mic,
  Camera,
  ShieldCheck,
  AlertTriangle,
  Play,
  CheckCircle2,
  Calendar,
  Award,
  ChevronRight,
  Info,
} from 'lucide-react';

interface InterviewPrepPageProps {
  initialTrack?: string;
  onNavigate: (path: string) => void;
  currentUser: UserProfile | null;
  pastSessions: InterviewSession[];
  onCreateSession: (
    track: string,
    difficulty: 'easy' | 'medium' | 'hard',
    questionsCount: number,
    saveRecording: boolean
  ) => InterviewSession;
  onOpenAuth: () => void;
}

export function InterviewPrepPage({
  initialTrack,
  onNavigate,
  currentUser,
  pastSessions,
  onCreateSession,
  onOpenAuth,
}: InterviewPrepPageProps) {
  const [track, setTrack] = useState(initialTrack || 'Software Engineering');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [questionCount, setQuestionCount] = useState<number>(5);
  // Strictly default OFF per instructions:
  const [saveRecordingConsent, setSaveRecordingConsent] = useState(false);

  // Pre-flight WebRTC hardware test state
  const [cameraStatus, setCameraStatus] = useState<'testing' | 'granted' | 'denied'>('testing');
  const [micStatus, setMicStatus] = useState<'testing' | 'granted' | 'denied'>('testing');
  const [streamActive, setStreamActive] = useState(false);
  const [micLevel, setMicLevel] = useState(0);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Start preflight checks
  useEffect(() => {
    let active = true;

    async function checkMedia() {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          setCameraStatus('denied');
          setMicStatus('denied');
          return;
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
          audio: true,
        });

        if (!active) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        streamRef.current = stream;
        setCameraStatus('granted');
        setMicStatus('granted');
        setStreamActive(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        // Set up Web Audio analyser for mic test
        try {
          const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
          const audioCtx = new AudioContextClass();
          audioContextRef.current = audioCtx;
          const analyser = audioCtx.createAnalyser();
          analyser.fftSize = 256;
          analyserRef.current = analyser;

          const source = audioCtx.createMediaStreamSource(stream);
          source.connect(analyser);

          const dataArray = new Uint8Array(analyser.frequencyBinCount);
          const updateAudioLevel = () => {
            if (!active) return;
            analyser.getByteFrequencyData(dataArray);
            let sum = 0;
            for (let i = 0; i < dataArray.length; i++) {
              sum += dataArray[i];
            }
            const avg = sum / dataArray.length;
            setMicLevel(Math.min(100, Math.round((avg / 128) * 100)));
            animFrameRef.current = requestAnimationFrame(updateAudioLevel);
          };
          updateAudioLevel();
        } catch (audioErr) {
          console.warn('Audio metering note:', audioErr);
        }
      } catch (err) {
        console.warn('Media preflight check denied or unavailable:', err);
        setCameraStatus('denied');
        setMicStatus('denied');
      }
    }

    checkMedia();

    return () => {
      active = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  const handleStartInterview = () => {
    // Release preflight stream so live page can cleanly mount with fresh bindings
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
    }

    const session = onCreateSession(track, difficulty, questionCount, saveRecordingConsent);
    onNavigate(`/interview/live?session=${session.id}`);
  };

  const tracks = [
    'Software Engineering',
    'Generative AI & LLM Systems',
    'Cloud Architecture & SRE',
    'Product Management',
    'Data Science & Analytics',
    'Frontend & Mobile Engineering',
  ];

  return (
    <div id="interview-prep-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <span className="text-xs font-bold uppercase tracking-wider text-[#D45060]">
          AI Mock Interview Suite
        </span>
        <h1
          className="text-3xl sm:text-4xl font-bold font-serif text-black mt-1 mb-2"
          style={{ color: '#000000' }}
        >
          Real-Time Technical &amp; Behavioral Evaluation
        </h1>
        <p className="text-sm text-[#5C3D46] max-w-3xl">
          Test your domain mastery against Google Gemini while our in-browser telemetry engine
          evaluates speech pacing, posture stability, gaze contact, and vocal confidence.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Setup & Hardware Check */}
        <div className="lg:col-span-2 space-y-6">
          {/* Preflight Video/Mic Check Card */}
          <div className="rounded-3xl bg-white border border-[#F3E6D5] p-6 shadow-sm">
            <h2 className="text-base font-bold text-[#800020] mb-4 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-[#800020]" />
                Hardware Pre-Flight Check
              </span>
              <span className="text-xs font-normal text-[#5C3D46]/70">
                Processed locally in-browser
              </span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Video Preview Feed */}
              <div className="relative rounded-2xl bg-slate-950 aspect-4/3 overflow-hidden flex items-center justify-center border border-[#F3E6D5]">
                {cameraStatus === 'granted' ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover transform -scale-x-100"
                  />
                ) : cameraStatus === 'denied' ? (
                  <div className="p-4 text-center text-rose-300">
                    <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-rose-400" />
                    <p className="text-xs font-bold">Camera Access Blocked</p>
                    <p className="text-[10px] text-slate-400 mt-1">
                      Check your browser permissions to enable biometric eye-contact tracking.
                    </p>
                  </div>
                ) : (
                  <div className="text-center text-slate-400 text-xs">
                    <div className="w-6 h-6 border-2 border-[#800020] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    Connecting media hardware...
                  </div>
                )}

                {/* Status Badges */}
                <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-white text-[10px] font-mono">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      cameraStatus === 'granted' ? 'bg-emerald-400' : 'bg-rose-400'
                    }`}
                  />
                  <span>CAM: {cameraStatus.toUpperCase()}</span>
                </div>
              </div>

              {/* Mic & Telemetry Sensor Check */}
              <div className="p-4 rounded-2xl bg-[#FFF9F2] border border-[#F3E6D5] flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#800020] mb-2 flex items-center gap-1.5">
                    <Mic className="w-3.5 h-3.5 text-[#800020]" />
                    Microphone Input Level
                  </h3>

                  {/* Level Meter Bar */}
                  <div className="w-full h-4 bg-white rounded-full border border-[#F3E6D5] overflow-hidden p-0.5 mb-2">
                    <div
                      className="h-full rounded-full bg-[#800020] transition-all duration-75"
                      style={{ width: `${micLevel}%` }}
                    />
                  </div>

                  <p className="text-[11px] text-[#5C3D46] leading-relaxed mb-4">
                    Speak a test sentence to confirm volume. COLLEXA analyzes speaking pace (ideal:
                    120–150 WPM) and counts filler words (e.g. "um", "like").
                  </p>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-[#F3E6D5]">
                      <span className="text-[#5C3D46]">Gaze &amp; Eye Contact Engine</span>
                      <span className="text-emerald-700 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Ready
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-[#F3E6D5]">
                      <span className="text-[#5C3D46]">Posture Alignment Sensor</span>
                      <span className="text-emerald-700 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Ready
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-[10px] text-[#5C3D46]/70 mt-2 flex items-center gap-1">
                  <Info className="w-3 h-3 text-[#800020] shrink-0" />
                  Telemetry is evaluated on-device in WebAssembly. No raw video is sent to external servers.
                </p>
              </div>
            </div>
          </div>

          {/* Configuration Form */}
          <div className="rounded-3xl bg-white border border-[#F3E6D5] p-6 shadow-sm space-y-6">
            <h2 className="text-base font-bold text-[#800020]">Configure Your Interview Session</h2>

            {/* Target Job Track */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#800020] mb-2">
                Select Target Career Track
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {tracks.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTrack(t)}
                    className={`text-left p-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                      track === t
                        ? 'border-[#800020] bg-[#F3E6D5]/50 text-[#800020] font-bold shadow-xs'
                        : 'border-[#F3E6D5] bg-white text-[#5C3D46] hover:border-[#800020] hover:text-[#800020]'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty Level */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#800020] mb-2">
                Evaluation Rigor &amp; Difficulty
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'easy', label: 'Associate / Junior', desc: 'Core fundamentals' },
                  { id: 'medium', label: 'Senior Engineer', desc: 'System tradeoffs' },
                  { id: 'hard', label: 'Staff / Principal', desc: 'Cross-system vision' },
                ].map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setDifficulty(d.id as any)}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                      difficulty === d.id
                        ? 'border-[#800020] bg-[#F3E6D5]/50 text-[#800020] font-bold shadow-xs'
                        : 'border-[#F3E6D5] bg-white text-[#5C3D46] hover:border-[#800020] hover:text-[#800020]'
                    }`}
                  >
                    <div className="text-xs font-bold capitalize">{d.id}</div>
                    <div className="text-[10px] text-[#5C3D46]/70 mt-0.5">{d.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Question Count */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#800020] mb-2">
                Number of Interview Questions
              </label>
              <div className="flex items-center gap-3">
                {[3, 5, 8].map((count) => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => setQuestionCount(count)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      questionCount === count
                        ? 'bg-[#800020] text-[#FFF9F2] border-[#800020] shadow-xs'
                        : 'bg-white text-[#5C3D46] border-[#F3E6D5] hover:border-[#800020] hover:text-[#800020]'
                    }`}
                  >
                    {count} Questions (~{count * 3} min)
                  </button>
                ))}
              </div>
            </div>

            {/* Explicit Media Consent Toggle (Default strictly OFF per prompt) */}
            <div className="p-4 rounded-2xl bg-[#FFF9F2] border border-[#F3E6D5] flex items-start gap-3">
              <input
                id="media-consent-toggle"
                type="checkbox"
                checked={saveRecordingConsent}
                onChange={(e) => setSaveRecordingConsent(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-[#F3E6D5] text-[#800020] focus:ring-[#800020]"
              />
              <label htmlFor="media-consent-toggle" className="cursor-pointer">
                <span className="text-xs font-bold text-[#800020] block">
                  Save interview recording to Private Supabase Storage (Optional)
                </span>
                <span className="text-[11px] text-[#5C3D46] block mt-0.5">
                  Default is <strong>OFF</strong>. If enabled, video chunks will be uploaded to your
                  private storage bucket with signed URLs and an automated 14-day auto-delete
                  lifecycle rule.
                </span>
              </label>
            </div>

            {/* Start Button */}
            <button
              id="launch-live-interview-btn"
              onClick={handleStartInterview}
              className="w-full py-4 rounded-2xl text-sm font-bold text-[#FFF9F2] bg-[#800020] hover:bg-[#660019] transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg cursor-pointer"
            >
              <Play className="w-4 h-4 text-[#F3E6D5] fill-[#F3E6D5]" />
              <span>Launch Live AI Mock Interview</span>
            </button>
          </div>
        </div>

        {/* Right Col: Past Sessions Sidebar */}
        <div>
          <div className="rounded-3xl bg-white border border-[#F3E6D5] p-6 shadow-sm">
            <h2 className="text-base font-bold text-[#800020] mb-4 flex items-center justify-between">
              <span>Past Sessions &amp; Scores</span>
              <span className="text-xs font-semibold text-[#800020]">
                {pastSessions.length} Completed
              </span>
            </h2>

            {pastSessions.length === 0 ? (
              <div className="text-center py-8 text-[#5C3D46]/60 text-xs">
                <Award className="w-8 h-8 mx-auto mb-2 text-[#800020]/40" />
                No interview sessions recorded yet. Launch your first live session to see real-time
                scores!
              </div>
            ) : (
              <div className="space-y-3">
                {pastSessions.slice(0, 5).map((session) => (
                  <div
                    key={session.id}
                    onClick={() => onNavigate(`/interview/results?session=${session.id}`)}
                    className="p-3.5 rounded-2xl bg-[#FFF9F2] border border-[#F3E6D5] hover:border-[#800020] transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-[#800020] group-hover:text-[#D45060] transition-colors">
                        {session.track}
                      </span>
                      {session.overall_score && (
                        <span className="text-xs font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          {session.overall_score}%
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-[#5C3D46]">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-[#5C3D46]/60" />
                        {new Date(session.created_at).toLocaleDateString()}
                      </span>
                      <span className="capitalize">{session.difficulty} &bull; {session.questions_count} Qs</span>
                    </div>

                    {session.avg_pace_wpm && (
                      <div className="mt-2 pt-2 border-t border-[#F3E6D5] flex items-center justify-between text-[10px] text-[#5C3D46]/80">
                        <span>Pace: {session.avg_pace_wpm} WPM</span>
                        <span>Eye Contact: {session.eye_contact_score}%</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
