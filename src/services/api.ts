import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
})

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface ChatResponse {
  message: string
  error?: string
}

export const chatService = {
  async sendMessage(message: string): Promise<ChatResponse> {
    try {
      const response = await api.post('/api/chat', {
        message,
      })
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.error || '请求失败')
      }
      throw error
    }
  },
}

export const authService = {
  async login(email: string, password: string) {
    const response = await api.post('/api/auth/login', {
      email,
      password,
    })
    return response.data
  },

  async register(email: string, password: string) {
    const response = await api.post('/api/auth/register', {
      email,
      password,
    })
    return response.data
  },

  async logout() {
    const response = await api.post('/api/auth/logout')
    return response.data
  },
}

export default api 