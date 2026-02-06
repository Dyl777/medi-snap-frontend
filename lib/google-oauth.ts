const GOOGLE_AUTH_BASE = 'https://accounts.google.com/o/oauth2/v2/auth';

function encodeState(payload: Record<string, string>) {
  if (typeof window === 'undefined') return '';
  const json = JSON.stringify(payload);
  const bytes = new TextEncoder().encode(json);
  let binary = '';
  bytes.forEach((b) => {
    binary += String.fromCharCode(b);
  });
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

export function getGoogleAuthUrl(frontendRedirect: string) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const redirectUri = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI;

  if (!clientId || !redirectUri) {
    throw new Error('Missing Google OAuth configuration.');
  }

  const state = encodeState({
    redirect: frontendRedirect,
    nonce: Date.now().toString(36),
  });

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'offline',
    prompt: 'consent',
    state,
  });

  return `${GOOGLE_AUTH_BASE}?${params.toString()}`;
}
