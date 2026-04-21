export type OAuthProvider = 'google' | 'linkedin';

const providerConfig: Record<OAuthProvider, { envKey: string; label: string; localEnvKey?: string }> = {
  google: {
    envKey: 'VITE_GOOGLE_AUTH_URL',
    label: 'Google',
    localEnvKey: 'VITE_GOOGLE_AUTH_URL_LOCAL',
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

const resolveAuthUrl = (provider: OAuthProvider) => {
  const config = providerConfig[provider];
  const primaryUrl = import.meta.env[config.envKey as keyof ImportMetaEnv] as string | undefined;

  if (provider === 'google') {
    const useLocalUrl = import.meta.env.VITE_GOOGLE_USE_LOCAL_AUTH === 'true';

    if (useLocalUrl && config.localEnvKey) {
      const localUrl = import.meta.env[config.localEnvKey as keyof ImportMetaEnv] as string | undefined;
      return localUrl || primaryUrl || null;
    }
  }

  return primaryUrl || null;
};

export const getOAuthAuthorizationUrl = (provider: OAuthProvider) => {
  const configuredUrl = resolveAuthUrl(provider);

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