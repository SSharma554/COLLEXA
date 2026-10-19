import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Environment variables for Supabase (client-side)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export function getSupabaseProjectRef(): string {
  if (!supabaseUrl) return 'zsmjiqrxnmyqeacikmoc';
  try {
    return supabaseUrl.replace('https://', '').split('.')[0];
  } catch {
    return 'zsmjiqrxnmyqeacikmoc';
  }
}

let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (!client && isSupabaseConfigured) {
    try {
      client = createClient(supabaseUrl!, supabaseAnonKey!, {
        auth: {
          flowType: 'pkce',
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: true,
        },
      });
    } catch (err) {
      console.warn('Supabase client initialization warning:', err);
    }
  }
  return client;
}

export async function checkGoogleOAuthEnabled(): Promise<{
  googleEnabled: boolean;
  emailEnabled: boolean;
  projectRef: string;
}> {
  const projectRef = getSupabaseProjectRef();

  // Check via our backend or directly against Supabase settings
  try {
    const res = await fetch('/api/auth/provider-status');
    if (res.ok) {
      const data = await res.json();
      return {
        googleEnabled: Boolean(data.googleEnabled),
        emailEnabled: data.emailEnabled !== false,
        projectRef: data.projectRef || projectRef,
      };
    }
  } catch {
    // Fallback to client check if endpoint unavailable
  }

  if (supabaseUrl && supabaseAnonKey) {
    try {
      const settingsRes = await fetch(`${supabaseUrl}/auth/v1/settings`, {
        headers: { apikey: supabaseAnonKey },
      });
      if (settingsRes.ok) {
        const data = await settingsRes.json();
        return {
          googleEnabled: Boolean(data?.external?.google),
          emailEnabled: Boolean(data?.external?.email),
          projectRef,
        };
      }
    } catch {
      // Ignored
    }
  }

  return {
    googleEnabled: false,
    emailEnabled: true,
    projectRef,
  };
}

export async function initiateGoogleOAuth(redirectToPath: string = '/dashboard'): Promise<{
  success: boolean;
  url?: string | null;
  providerNotEnabled?: boolean;
  simulated?: boolean;
  projectRef?: string;
  message?: string;
}> {
  const supabase = getSupabase();
  const origin = window.location.origin;
  const redirectUrl = `${origin}/api/auth/callback?next=${encodeURIComponent(redirectToPath)}`;
  const projectRef = getSupabaseProjectRef();

  if (!supabase || !supabaseUrl || !supabaseAnonKey) {
    return {
      success: true,
      simulated: true,
      projectRef,
      url: null,
    };
  }

  // Pre-flight check: Verify if Google provider is actually enabled in Supabase!
  // This prevents the browser from navigating to Supabase's raw HTTP 400 error page:
  // {"code":400,"error_code":"validation_failed","msg":"Unsupported provider: provider is not enabled"}
  const status = await checkGoogleOAuthEnabled();
  if (!status.googleEnabled) {
    console.warn(
      `[Supabase Auth] Google OAuth provider is not enabled in Supabase project "${projectRef}". Bypassing redirect to prevent HTTP 400 error.`
    );
    return {
      success: false,
      providerNotEnabled: true,
      projectRef,
      message: 'Unsupported provider: provider is not enabled in Supabase dashboard.',
    };
  }

  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    if (error) {
      const errMsg = error.message || JSON.stringify(error);
      if (
        errMsg.toLowerCase().includes('provider is not enabled') ||
        errMsg.toLowerCase().includes('unsupported provider') ||
        (error as any).code === 400 ||
        (error as any).error_code === 'validation_failed'
      ) {
        return {
          success: false,
          providerNotEnabled: true,
          projectRef,
          message: 'Unsupported provider: provider is not enabled in Supabase dashboard.',
        };
      }
      throw error;
    }

    return {
      success: true,
      simulated: false,
      url: data.url,
      projectRef,
    };
  } catch (err: any) {
    const errMsg = err?.message || (typeof err === 'string' ? err : JSON.stringify(err));
    if (
      errMsg.toLowerCase().includes('provider is not enabled') ||
      errMsg.toLowerCase().includes('unsupported provider') ||
      err?.code === 400 ||
      err?.error_code === 'validation_failed'
    ) {
      return {
        success: false,
        providerNotEnabled: true,
        projectRef,
        message: 'Unsupported provider: provider is not enabled in Supabase dashboard.',
      };
    }
    throw err;
  }
}
