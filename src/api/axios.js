import axios from 'axios'

// Uses VITE_API_URL from .env, or Vite proxy (/api -> localhost:5000)
const baseURL = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message = err.response?.data?.message || err.message || 'Request failed'
    err.message = message

    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login'
      }
    }

    if (err.code === 'ERR_NETWORK') {
      err.message = 'Cannot reach backend. Start backend: cd backend && npm run dev'
    }

    return Promise.reject(err)
  }
)

export default api
