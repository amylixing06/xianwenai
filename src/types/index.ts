export interface Message {
  content: string
  isUser: boolean
  timestamp: Date
  status: 'sending' | 'sent' | 'read'
  id: string
  isFavorite?: boolean
  isEdited?: boolean
}

export interface ChatCompletionResponse {
  choices: Array<{
    message: {
      content: string
    }
  }>
} 