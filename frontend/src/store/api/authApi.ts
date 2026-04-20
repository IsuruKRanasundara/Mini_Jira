import { createApi, fetchBaseQuery, retry } from "@reduxjs/toolkit/query/react";

type LoginCredentials = {
  email: string;
  password: string;
};

type LoginResponse = {
  message: string;
  token: string;
  data: {
    _id: string;
    email: string;
    firstName?: string;
    lastName?: string;
  };
};

type GoogleLoginPayload = {
  credential?: string;
  accessToken?: string;
};

type GoogleLoginResponse = LoginResponse;


export type RegisterPayload = {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
};

export type RegisterResponse = {
	message: string;
	data: {
		_id: string;
		firstName: string;
		lastName: string;
		email: string;
	};
};
const staggeredBaseQuery = retry(
  fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_URL || 'https://mini-jira-three.vercel.app/api',
  }),
  {
    maxRetries: 3,
  },
);

const googleAuthEndpoint = import.meta.env.VITE_GOOGLE_AUTH_ENDPOINT || '/auth/google';

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: staggeredBaseQuery,
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginCredentials>({
      query: (credentials) => ({
        url: "/users/login",
        method: "POST",
        body: credentials,
      }),
      extraOptions: { maxRetries: 5 },
    }),
    loginWithGoogle: builder.mutation<GoogleLoginResponse, GoogleLoginPayload>({
      query: (payload) => ({
        url: googleAuthEndpoint,
        method: "POST",
        body: payload,
      }),
      extraOptions: { maxRetries: 2 },
    }),
    register: builder.mutation<RegisterResponse, RegisterPayload>({
      query: (payload) => ({
        url: "/users/register",
        method: "POST",
        body: payload,
      }),
      extraOptions: { maxRetries: 5 },
    }),  
  }),
});

export const { useLoginMutation, useLoginWithGoogleMutation, useRegisterMutation } = authApi;
