import axios from "axios";

const api = axios.create({
	baseURL:
		import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_URL || 'https://mini-jira-three.vercel.app/api',
	headers: {
		"Content-Type": "application/json",
	},
});

export default api;

