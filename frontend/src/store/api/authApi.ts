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
    baseUrl:
     
      import.meta.env.Backend_URL||'https://mini-jira-three.vercel.app/api',
  }),
  {
    maxRetries: 3,
  },
);

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

export const { useLoginMutation, useRegisterMutation } = authApi;
