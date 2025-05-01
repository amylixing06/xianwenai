import { 
  Box, 
  Container, 
  Flex, 
  Input, 
  VStack, 
  useToast,
  Avatar,
  Text,
  IconButton,
  useColorModeValue,
  Spinner,
  Alert,
  AlertIcon,
  Tooltip,
  useClipboard,
  useSound
} from '@chakra-ui/react'
import React, { useState, useRef, useEffect, Suspense } from 'react'
import { useInView } from 'react-intersection-observer'
import { FiSend, FiCopy, FiCheck } from 'react-icons/fi'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { chatCompletion } from '@/services/api/chat'
import { Message } from '@/types'
import messageSound from '@/assets/sounds/message.mp3'

// 动态导入 ReactMarkdown
const ReactMarkdown = React.lazy(() => import('react-markdown'))

// 懒加载图片组件
const LazyImage: React.FC<{ src: string; alt: string; size?: string }> = ({ src, alt, size = 'sm' }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <Avatar
      ref={ref}
      name={alt}
      src={inView ? src : ''}
      size={size}
      loading="lazy"
    />
  )
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const toast = useToast()
  const userBgColor = useColorModeValue('blue.500', 'blue.400')
  const aiBgColor = useColorModeValue('white', 'gray.600')
  const [playMessageSound] = useSound(messageSound)

  // 处理消息复制
  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
    toast({
      title: '已复制到剪贴板',
      status: 'success',
      duration: 2000,
      isClosable: true
    })
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
      toast({
        title: '发送失败',
        description: errorMessage,
        status: 'error',
        duration: 3000,
        isClosable: true
      })
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
              borderRadius: '0.375rem',
              fontSize: '0.875rem'
            }}
          >
            {code}
          </SyntaxHighlighter>
          <IconButton
            aria-label="复制代码"
            icon={<FiCopy />}
            size="sm"
            position="absolute"
            top={2}
            right={2}
            onClick={() => handleCopyMessage(code)}
          />
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
    <Container maxW="container.xl" h="100vh" p={4}>
      <Flex direction="column" h="full">
        <Box flex="1" overflowY="auto" mb={4}>
          <VStack spacing={4} align="stretch">
            {error && (
              <Alert status="error">
                <AlertIcon />
                {error}
              </Alert>
            )}
            {messages.map(message => (
              <Flex
                key={message.id}
                direction={message.isUser ? 'row-reverse' : 'row'}
                align="flex-start"
                gap={2}
              >
                <LazyImage
                  src={message.isUser ? '/images/user-avatar.svg' : '/images/ai-avatar.svg'}
                  alt={message.isUser ? '用户' : 'AI'}
                />
                <Box
                  maxW="70%"
                  p={3}
                  borderRadius="lg"
                  bg={message.isUser ? userBgColor : aiBgColor}
                  color={message.isUser ? 'white' : 'inherit'}
                  position="relative"
                >
                  <Suspense fallback={<Spinner size="sm" />}>
                    {renderMessageContent(message.content)}
                  </Suspense>
                  <Flex justify="space-between" align="center" mt={2}>
                    <Text fontSize="xs" color={message.isUser ? 'whiteAlpha.700' : 'gray.500'}>
                      {format(message.timestamp, 'HH:mm', { locale: zhCN })}
                    </Text>
                    <Tooltip label="复制消息">
                      <IconButton
                        aria-label="复制消息"
                        icon={<FiCopy />}
                        size="xs"
                        variant="ghost"
                        onClick={() => handleCopyMessage(message.content)}
                      />
                    </Tooltip>
                  </Flex>
                </Box>
              </Flex>
            ))}
            {isLoading && (
              <Flex justify="center">
                <Spinner />
              </Flex>
            )}
            <div ref={messagesEndRef} />
          </VStack>
        </Box>
        <Flex gap={2}>
          <Input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
            placeholder="输入消息..."
            disabled={isLoading}
          />
          <IconButton
            aria-label="发送消息"
            icon={<FiSend />}
            onClick={handleSendMessage}
            isLoading={isLoading}
            colorScheme="blue"
            isDisabled={!input.trim() || isLoading}
          />
        </Flex>
      </Flex>
    </Container>
  )
}

export default Chat 