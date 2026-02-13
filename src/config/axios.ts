import axios from "axios";
import { auth } from "./firebase";

// constante para requisições com o axios
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 100000,
});

api.interceptors.request.use(async (config) => {
  const token = await auth.currentUser?.getIdToken();

  // agora o token do auth firebase vai ser enviado
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
