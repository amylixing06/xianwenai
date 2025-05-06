import React, { useState, useRef, useEffect, Suspense } from 'react'
import { useInView } from 'react-intersection-observer'
import { FiSend, FiCopy } from 'react-icons/fi'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import { chatCompletion } from '@/services/api/chat'
import { Message } from '@/types'
import useSound from 'use-sound'
import messageSound from '/sounds/message.mp3'
import { 
  Box,
  Container,
  Stack,
  TextField,
  IconButton,
  Typography,
  Avatar,
  Paper,
  Alert,
  AlertTitle,
  Tooltip,
  Link as MuiLink
} from '@mui/material'

// 动态导入 ReactMarkdown
const ReactMarkdown = React.lazy(() => import('react-markdown'))

// 懒加载图片组件
const LazyImage: React.FC<{ 
  src: string; 
  alt: string; 
  size?: number;
}> = ({ src, alt, size = 40 }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <Avatar
      ref={ref}
      alt={alt}
      src={inView ? src : ''}
      sx={{ 
        width: size, 
        height: size,
        bgcolor: 'primary.main'
      }}
    />
  )
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      content: '遇事困难？先问AI\n\n我是您的AI助手，让我来帮您解决问题。',
      isUser: false,
      timestamp: new Date(),
      status: 'sent'
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [playMessageSound] = useSound(messageSound)

  // 处理消息复制
  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
    // TODO: 添加复制成功提示
  }

  // 处理发送消息
  const handleSendMessage = async () => {
    if (!input.trim()) return
    if (isLoading) return

    const newMessage: Message = {
      id: Date.now().toString(),
      content: input,
      isUser: true,
      timestamp: new Date(),
      status: 'sent'
    }

    setMessages(prev => [...prev, newMessage])
    setInput('')
    setIsLoading(true)
    setError(null)
    playMessageSound()

    try {
      const response = await chatCompletion(input)
      if (!response.choices?.[0]?.message?.content) {
        throw new Error('无效的响应格式')
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.choices[0].message.content,
        isUser: false,
        timestamp: new Date(),
        status: 'sent'
      }
      setMessages(prev => [...prev, aiMessage])
      playMessageSound()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '发送消息失败'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // 渲染消息内容
  const renderMessageContent = (content: string) => {
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g
    const parts = []
    let lastIndex = 0
    let match

    while ((match = codeBlockRegex.exec(content)) !== null) {
      // 添加代码块之前的文本
      if (match.index > lastIndex) {
        parts.push(
          <ReactMarkdown key={`text-${match.index}`}>
            {content.slice(lastIndex, match.index)}
          </ReactMarkdown>
        )
      }

      // 添加代码块
      const language = match[1] || 'text'
      const code = match[2].trim()
      parts.push(
        <Box key={`code-${match.index}`} position="relative" my={2}>
          <SyntaxHighlighter
            language={language}
            style={tomorrow}
            customStyle={{
              margin: 0,
              borderRadius: 4,
              fontSize: '0.875rem',
              background: '#f6f8fa'
            }}
          >
            {code}
          </SyntaxHighlighter>
          <IconButton
            aria-label="复制代码"
            size="small"
            onClick={() => handleCopyMessage(code)}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              color: 'text.secondary'
            }}
          >
            <FiCopy />
          </IconButton>
        </Box>
      )

      lastIndex = match.index + match[0].length
    }

    // 添加剩余的文本
    if (lastIndex < content.length) {
      parts.push(
        <ReactMarkdown key={`text-${lastIndex}`}>
          {content.slice(lastIndex)}
        </ReactMarkdown>
      )
    }

    return parts
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Container maxWidth="xl" sx={{ height: '100vh', py: 2 }}>
        <Stack spacing={2} sx={{ height: '100%' }}>
          {/* 头部 */}
          <Paper 
            elevation={1} 
            sx={{ 
              p: 2,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <Typography variant="h6" color="primary">
              先问AI
            </Typography>
          </Paper>

          {/* 消息列表 */}
          <Paper 
            elevation={1}
            sx={{ 
              flex: 1,
              overflow: 'auto',
              p: 2
            }}
          >
            <Stack spacing={2}>
              {error && (
                <Alert severity="error">
                  <AlertTitle>错误</AlertTitle>
                  {error}
                </Alert>
              )}
              {messages.map(message => (
                <Stack
                  key={message.id}
                  direction={message.isUser ? 'row-reverse' : 'row'}
                  spacing={2}
                  alignItems="flex-start"
                >
                  <LazyImage
                    src={message.isUser ? '/images/user-avatar.svg' : '/images/ai-avatar.svg'}
                    alt={message.isUser ? '用户' : 'AI'}
                  />
                  <Paper
                    elevation={1}
                    sx={{
                      maxWidth: '70%',
                      p: 2,
                      bgcolor: message.isUser ? 'primary.main' : 'background.paper',
                      color: message.isUser ? 'primary.contrastText' : 'text.primary'
                    }}
                  >
                    <Suspense fallback={<Typography>加载中...</Typography>}>
                      {renderMessageContent(message.content)}
                    </Suspense>
                    {!message.isUser && (
                      <Box sx={{ mt: 1, textAlign: 'right' }}>
                        <Tooltip title="复制消息">
                          <IconButton
                            size="small"
                            onClick={() => handleCopyMessage(message.content)}
                            sx={{ color: 'text.secondary' }}
                          >
                            <FiCopy />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    )}
                  </Paper>
                </Stack>
              ))}
              {isLoading && (
                <Stack direction="row" spacing={2} alignItems="flex-start">
                  <LazyImage
                    src="/images/ai-avatar.svg"
                    alt="AI"
                  />
                  <Paper
                    elevation={1}
                    sx={{
                      p: 2,
                      bgcolor: 'background.paper'
                    }}
                  >
                    <Typography color="text.secondary">
                      正在输入中...
                    </Typography>
                  </Paper>
                </Stack>
              )}
              <div ref={messagesEndRef} />
            </Stack>
          </Paper>

          {/* 输入框 */}
          <Paper 
            elevation={1}
            sx={{ p: 2 }}
          >
            <Stack direction="row" spacing={2}>
              <TextField
                fullWidth
                placeholder="输入消息..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                inputRef={inputRef}
                disabled={isLoading}
              />
              <IconButton
                color="primary"
                onClick={handleSendMessage}
                disabled={!input.trim() || isLoading}
              >
                <FiSend />
              </IconButton>
            </Stack>
          </Paper>

          {/* 页脚 */}
          <Box 
            component="footer"
            sx={{
              py: 2,
              textAlign: 'center',
              borderTop: 1,
              borderColor: 'divider'
            }}
          >
            <Stack direction="row" spacing={2} justifyContent="center">
              <MuiLink 
                href="https://xianwenai.com/privacy-policy" 
                target="_blank" 
                rel="noopener noreferrer"
                color="text.secondary"
              >
                隐私政策
              </MuiLink>
              <MuiLink 
                href="https://xianwenai.com/terms-of-service" 
                target="_blank" 
                rel="noopener noreferrer"
                color="text.secondary"
              >
                服务条款
              </MuiLink>
            </Stack>
          </Box>
        </Stack>
      </Container>
    </Box>
  )
}

export default Chat