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
  useColorMode,
  Button,
  Heading,
  Link
} from '@chakra-ui/react'
import React, { useState, useRef, useEffect, Suspense } from 'react'
import { useInView } from 'react-intersection-observer'
import { FiSend, FiCopy, FiSun, FiMoon } from 'react-icons/fi'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import { chatCompletion } from '@/services/api/chat'
import { Message } from '@/types'
import useSound from 'use-sound'
import messageSound from '/sounds/message.mp3'
import { Link as RouterLink } from 'react-router-dom'
import { Link as MuiLink } from '@mui/material'

// 动态导入 ReactMarkdown
const ReactMarkdown = React.lazy(() => import('react-markdown'))

// 懒加载图片组件
const LazyImage: React.FC<{ 
  src: string; 
  alt: string; 
  size?: string | Record<string, string> 
}> = ({ src, alt, size = 'sm' }) => {
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
      bg="blue.500"
      color="white"
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
  const toast = useToast()
  const { colorMode, toggleColorMode } = useColorMode()
  const userBgColor = useColorModeValue('blue.500', 'blue.400')
  const aiBgColor = useColorModeValue('white', 'gray.700')
  const borderColor = useColorModeValue('gray.200', 'gray.600')
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
              fontSize: '0.875rem',
              background: colorMode === 'light' ? '#f6f8fa' : '#1a202c'
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
            variant="ghost"
            colorScheme="blue"
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
    <Container maxW="container.xl" h="100vh" p={{ base: 2, md: 4 }}>
      <Flex direction="column" h="full">
        <Box 
          py={{ base: 2, md: 4 }}
          px={{ base: 3, md: 6 }}
          bg={useColorModeValue('white', 'gray.800')}
          borderRadius="lg"
          boxShadow="sm"
          mb={{ base: 2, md: 4 }}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Heading size={{ base: "md", md: "lg" }} color={useColorModeValue('blue.500', 'blue.300')}>
            先问AI
          </Heading>
          <Flex gap={2} align="center">
            <Button
              onClick={toggleColorMode}
              variant="ghost"
              colorScheme="blue"
              leftIcon={colorMode === 'light' ? <FiMoon /> : <FiSun />}
              size={{ base: "sm", md: "md" }}
            >
              <Text>{colorMode === 'light' ? '深色模式' : '浅色模式'}</Text>
            </Button>
          </Flex>
        </Box>

        <Box 
          flex="1" 
          overflowY="auto" 
          mb={{ base: 2, md: 4 }}
          bg={useColorModeValue('gray.50', 'gray.900')}
          borderRadius="lg"
          p={{ base: 2, md: 4 }}
        >
          <VStack spacing={{ base: 2, md: 4 }} align="stretch">
            {error && (
              <Alert status="error" borderRadius="md">
                <AlertIcon />
                {error}
              </Alert>
            )}
            {messages.map(message => (
              <Flex
                key={message.id}
                direction={message.isUser ? 'row-reverse' : 'row'}
                align="flex-start"
                gap={{ base: 2, md: 3 }}
              >
                <LazyImage
                  src={message.isUser ? '/images/user-avatar.svg' : '/images/ai-avatar.svg'}
                  alt={message.isUser ? '用户' : 'AI'}
                  size={{ base: "xs", md: "sm" }}
                />
                <Box
                  maxW={{ base: "75%", md: "70%" }}
                  p={{ base: 2, md: 4 }}
                  borderRadius="lg"
                  bg={message.isUser ? userBgColor : aiBgColor}
                  color={message.isUser ? 'white' : 'inherit'}
                  position="relative"
                  boxShadow="sm"
                  borderWidth="1px"
                  borderColor={borderColor}
                  fontSize={{ base: "sm", md: "md" }}
                >
                  <Suspense fallback={<Spinner size="sm" />}>
                    {renderMessageContent(message.content)}
                  </Suspense>
                  {!message.isUser && (
                    <Flex justify="flex-end" align="center" mt={2}>
                      <Tooltip label="复制消息">
                        <IconButton
                          aria-label="复制消息"
                          icon={<FiCopy />}
                          size="xs"
                          variant="ghost"
                          onClick={() => handleCopyMessage(message.content)}
                          color="gray.500"
                        />
                      </Tooltip>
                    </Flex>
                  )}
                </Box>
              </Flex>
            ))}
            {isLoading && (
              <Flex
                direction="row"
                align="flex-start"
                gap={{ base: 2, md: 3 }}
              >
                <LazyImage
                  src="/images/ai-avatar.svg"
                  alt="AI"
                  size={{ base: "xs", md: "sm" }}
                />
                <Box
                  maxW={{ base: "75%", md: "70%" }}
                  p={{ base: 2, md: 4 }}
                  borderRadius="lg"
                  bg={aiBgColor}
                  position="relative"
                  boxShadow="sm"
                  borderWidth="1px"
                  borderColor={borderColor}
                  fontSize={{ base: "sm", md: "md" }}
                >
                  <Text color="gray.500">正在输入中...</Text>
                </Box>
              </Flex>
            )}
            <div ref={messagesEndRef} />
          </VStack>
        </Box>

        <Box
          p={{ base: 2, md: 4 }}
          bg={useColorModeValue('white', 'gray.800')}
          borderRadius="lg"
          boxShadow="sm"
        >
          <Flex gap={2}>
            <Input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
              placeholder="输入消息..."
              size={{ base: "md", md: "lg" }}
              variant="filled"
            />
            <IconButton
              aria-label="发送消息"
              icon={<FiSend />}
              onClick={handleSendMessage}
              isLoading={isLoading}
              colorScheme="blue"
              isDisabled={!input.trim() || isLoading}
              size={{ base: "md", md: "lg" }}
            />
          </Flex>
        </Box>

        <Box 
          as="footer"
          py={4}
          textAlign="center"
          borderTop="1px"
          borderColor={useColorModeValue('gray.200', 'gray.700')}
        >
          <Flex justify="center" gap={4} wrap="wrap">
            <MuiLink 
              href="https://xianwenai.com/privacy-policy" 
              target="_blank" 
              rel="noopener noreferrer"
              color={useColorModeValue('gray.600', 'gray.400')} 
              underline="hover"
            >
              隐私政策
            </MuiLink>
            <MuiLink 
              href="https://xianwenai.com/terms-of-service" 
              target="_blank" 
              rel="noopener noreferrer"
              color={useColorModeValue('gray.600', 'gray.400')} 
              underline="hover"
            >
              服务条款
            </MuiLink>
          </Flex>
        </Box>
      </Flex>
    </Container>
  )
}

export default Chat