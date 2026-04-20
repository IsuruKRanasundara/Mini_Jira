const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const asyncHandler = require('../utils/asyncHandler');
const userService = require('../services/userService');

const buildAuthToken = (userId) => {
  const secret = process.env.JWT_SECRET || 'dev-secret';
  return jwt.sign({ userId }, secret, { expiresIn: '7d' });
};

const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
const GOOGLE_USER_INFO_URL = 'https://www.googleapis.com/oauth2/v3/userinfo';

const getBackendCallbackUrl = (req) => {
  if (process.env.GOOGLE_CALLBACK_URL) {
    return process.env.GOOGLE_CALLBACK_URL;
  }

  const forwardedProto = req.get('x-forwarded-proto');
  const protocol = forwardedProto || req.protocol;
  return `${protocol}://${req.get('host')}/api/users/oauth/google/callback`;
};

const getFrontendCallbackUrl = () => {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  return `${frontendUrl.replace(/\/$/, '')}/auth/callback`;
};

const isSafeRedirectUri = (redirectUri) => {
  const defaultFrontendCallback = getFrontendCallbackUrl();

  try {
    const parsed = new URL(redirectUri);
    const frontendOrigin = new URL(defaultFrontendCallback).origin;
    const isFrontendOrigin = parsed.origin === frontendOrigin;
    const isDevLocalhost =
      process.env.NODE_ENV !== 'production' &&
      (parsed.origin === 'http://localhost:5173' || parsed.origin === 'http://127.0.0.1:5173');

    return isFrontendOrigin || isDevLocalhost;
  } catch {
    return false;
  }
};

const buildOAuthState = (redirectUri) => {
  return Buffer.from(JSON.stringify({ redirectUri }), 'utf8').toString('base64url');
};

const parseOAuthState = (state) => {
  if (!state) {
    return {};
  }

  try {
    const decoded = Buffer.from(state, 'base64url').toString('utf8');
    return JSON.parse(decoded);
  } catch {
    return {};
  }
};

const buildFrontendRedirectUrl = (redirectUri, token, user) => {
  const destination = new URL(redirectUri);
  destination.searchParams.set('token', token);
  destination.searchParams.set(
    'user',
    JSON.stringify({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    })
  );

  return destination.toString();
};

const startGoogleOAuth = asyncHandler(async (req, res) => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const callbackUrl = getBackendCallbackUrl(req);

  if (!clientId) {
    return res.status(500).json({ message: 'GOOGLE_CLIENT_ID is not configured' });
  }

  const requestedRedirectUri = req.query.redirect_uri;
  const redirectUri =
    typeof requestedRedirectUri === 'string' && isSafeRedirectUri(requestedRedirectUri)
      ? requestedRedirectUri
      : getFrontendCallbackUrl();

  const authUrl = new URL(GOOGLE_AUTH_URL);
  authUrl.searchParams.set('client_id', clientId);
  authUrl.searchParams.set('redirect_uri', callbackUrl);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('scope', 'openid email profile');
  authUrl.searchParams.set('state', buildOAuthState(redirectUri));
  authUrl.searchParams.set('access_type', 'offline');
  authUrl.searchParams.set('prompt', 'consent');

  return res.redirect(authUrl.toString());
});

const handleGoogleOAuthCallback = asyncHandler(async (req, res) => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return res.status(500).json({ message: 'Google OAuth credentials are not configured' });
  }

  const { code, state } = req.query;
  const defaultRedirectUri = getFrontendCallbackUrl();
  const parsedState = parseOAuthState(typeof state === 'string' ? state : '');
  const redirectUri =
    typeof parsedState.redirectUri === 'string' && isSafeRedirectUri(parsedState.redirectUri)
      ? parsedState.redirectUri
      : defaultRedirectUri;

  if (typeof code !== 'string' || !code) {
    const failedUrl = new URL(redirectUri);
    failedUrl.searchParams.set('error', 'missing_code');
    return res.redirect(failedUrl.toString());
  }

  const tokenResponse = await fetch(GOOGLE_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: getBackendCallbackUrl(req),
      grant_type: 'authorization_code',
    }),
  });

  if (!tokenResponse.ok) {
    const failedUrl = new URL(redirectUri);
    failedUrl.searchParams.set('error', 'token_exchange_failed');
    return res.redirect(failedUrl.toString());
  }

  const tokenJson = await tokenResponse.json();
  const accessToken = tokenJson.access_token;

  if (!accessToken) {
    const failedUrl = new URL(redirectUri);
    failedUrl.searchParams.set('error', 'missing_access_token');
    return res.redirect(failedUrl.toString());
  }

  const profileResponse = await fetch(GOOGLE_USER_INFO_URL, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!profileResponse.ok) {
    const failedUrl = new URL(redirectUri);
    failedUrl.searchParams.set('error', 'profile_fetch_failed');
    return res.redirect(failedUrl.toString());
  }

  const profile = await profileResponse.json();
  const email = profile.email;

  if (!email) {
    const failedUrl = new URL(redirectUri);
    failedUrl.searchParams.set('error', 'email_not_provided');
    return res.redirect(failedUrl.toString());
  }

  const fallbackPassword = crypto.randomBytes(24).toString('hex');
  const user = await userService.findOrCreateOAuthUser({
    email,
    firstName: profile.given_name || profile.name?.split(' ')[0] || 'Google',
    lastName: profile.family_name || profile.name?.split(' ').slice(1).join(' ') || 'User',
    profilePicture: profile.picture,
    password: fallbackPassword,
  });

  const token = buildAuthToken(user._id);
  return res.redirect(buildFrontendRedirectUrl(redirectUri, token, user));
});

const registerUser = asyncHandler(async (req, res) => {
  const existingUser = await userService.findUserByEmail(req.body.email);

  if (existingUser) {
    return res.status(409).json({ message: 'Email already in use' });
  }

  const user = await userService.createUser(req.body);

  return res.status(201).json({
    message: 'User created successfully',
    data: user,
  });
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await userService.findUserByEmail(email);

  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const passwordMatch = await user.comparePassword(password);
  if (!passwordMatch) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const token = buildAuthToken(user._id);

  return res.status(200).json({
    message: 'Login successful',
    token,
    data: user,
  });
});

const getUsers = asyncHandler(async (req, res) => {
  const users = await userService.getAllUsers();
  return res.status(200).json({ data: users });
});

const getUser = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.params.id);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  return res.status(200).json({ data: user });
});

const updateUser = asyncHandler(async (req, res) => {
  const user = await userService.updateUserById(req.params.id, req.body);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  return res.status(200).json({
    message: 'User updated successfully',
    data: user,
  });
});

const deleteUser = asyncHandler(async (req, res) => {
  const user = await userService.deleteUserById(req.params.id);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  return res.status(200).json({ message: 'User deleted successfully' });
});

module.exports = {
  registerUser,
  loginUser,
  startGoogleOAuth,
  handleGoogleOAuthCallback,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
};
