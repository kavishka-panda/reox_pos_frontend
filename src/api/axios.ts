import axios from 'axios';
import type { AxiosInstance, InternalAxiosRequestConfig, AxiosError } from 'axios';
// import useAuthStore from '../stores/authStore'; // ❌ මෙය දැනට comment කර ඇත

// ⚠️ 1. ඔබගේ Manual Token එක මෙතනට ඇතුල් කරන්න ⚠️
// මෙය testing සඳහා පමණි. 
const TESTING_TOKEN = 'CbqfmNs86k7Hk5Me8qsVOj18MWnIw8qNw69UhcPqcdfd1c11'; 

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// --- Request interceptor to add auth token ---
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 2. Token එක කෙලින්ම TESTING_TOKEN variable එකෙන් ලබා ගනී
    const token = TESTING_TOKEN; 
    
    // (පසුව useAuthStore.getState().token; නැවත සක්‍රීය කරන්න)

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// --- Response interceptor for handling auth errors ---
// ❌ Note: useAuthStore comment කර ඇති නිසා, 401 error handling එක දැනට අක්‍රිය වනු ඇත.
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // ⚠️ මෙහිදී useAuthStore නැති නිසා logout() කැඳවීමට නොහැක. 
      // තාවකාලිකව console log කර නැවත admin login පිටුවට යොමු කරයි.
      console.error('Unauthorized access (401). Please check the hardcoded token.');
      // window.location.href = '/adminlogin'; // මෙයද දැනට අක්‍රිය කර තැබිය හැක.
    }
    return Promise.reject(error);
  }
);

export default api;
