import axios from "axios";

const api = axios.create({
	baseURL:
		
		import.meta.env.Backend_URL||'https://mini-jira-three.vercel.app/api',
	headers: {
		"Content-Type": "application/json",
	},
});

export default api;

