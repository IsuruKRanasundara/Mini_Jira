export type OAuthProvider = 'google' | 'linkedin';

const providerConfig: Record<OAuthProvider, { envKey: string; label: string }> = {
  google: {
    envKey: 'VITE_GOOGLE_AUTH_URL',
    label: 'Google',
  },
  linkedin: {
    envKey: 'VITE_LINKEDIN_AUTH_URL',
    label: 'LinkedIn',
  },
};

const buildRedirectUri = () => `${window.location.origin}/auth/callback`;

const appendQueryParam = (url: URL, key: string, value: string) => {
  if (!url.searchParams.has(key)) {
    url.searchParams.set(key, value);
  }
};

export const getOAuthAuthorizationUrl = (provider: OAuthProvider) => {
  const configuredUrl = import.meta.env[providerConfig[provider].envKey as keyof ImportMetaEnv] as string | undefined;

  if (!configuredUrl) {
    return null;
  }

  const url = new URL(configuredUrl, window.location.origin);
  appendQueryParam(url, 'redirect_uri', buildRedirectUri());
  appendQueryParam(url, 'provider', provider);
  return url.toString();
};

export const startOAuthLogin = (provider: OAuthProvider) => {
  const authorizationUrl = getOAuthAuthorizationUrl(provider);

  if (!authorizationUrl) {
    throw new Error(`${providerConfig[provider].label} auth is not configured. Set ${providerConfig[provider].envKey} in your frontend environment.`);
  }

  window.location.assign(authorizationUrl);
};

export const buildOAuthRedirectUri = buildRedirectUri;