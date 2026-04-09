import api from "./api";

export type LoginPayload = {
	email: string;
	password: string;
};

export type LoginResponse = {
	message: string;
	token: string;
	data: {
		_id: string;
		firstName?: string;
		lastName?: string;
		email: string;
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

export const login = async (payload: LoginPayload): Promise<LoginResponse> => {
	const response = await api.post<LoginResponse>("/users/login", payload);
	return response.data;
};

export const registerUser = async (
	payload: RegisterPayload,
): Promise<RegisterResponse> => {
	const response = await api.post<RegisterResponse>("/users/register", payload);
	return response.data;
};

