import { ChatCompletionResponse } from '@/types'

export const chatCompletion = async (message: string): Promise<ChatCompletionResponse> => {
  const apiKey = import.meta.env.VITE_API_KEY
  const apiUrl = import.meta.env.VITE_API_URL

  if (!apiKey) {
    throw new Error('API 密钥未配置')
  }

  if (!apiUrl) {
    throw new Error('API URL 未配置')
  }

  try {
    const response = await fetch(`${apiUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'user',
            content: message
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      throw new Error(errorData?.error?.message || `HTTP 错误: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error('网络请求失败')
  }
} 