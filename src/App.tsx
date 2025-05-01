import React, { useState, useEffect } from 'react'
import { 
  ChakraProvider, 
  Box, 
  Text, 
  Container, 
  Input, 
  Button, 
  Flex, 
  VStack,
  CSSReset,
  extendTheme,
  IconButton,
  useColorMode,
  Tooltip,
  useToast,
  useColorModeValue,
  Progress
} from '@chakra-ui/react'
import { FiSun, FiMoon, FiTrash2, FiDownload, FiCopy } from 'react-icons/fi'

// 消息类型定义
interface Message {
  id: string
  content: string
  isUser: boolean
  timestamp: Date
  status: 'sent' | 'error'
}

// 自定义主题
const theme = extendTheme({
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
  styles: {
    global: (props: { colorMode: 'light' | 'dark' }) => ({
      body: {
        bg: props.colorMode === 'light' ? 'gray.50' : 'gray.800',
        color: props.colorMode === 'light' ? 'gray.800' : 'whiteAlpha.900',
        backgroundImage: 'url(/background-pattern.svg)',
        backgroundRepeat: 'repeat',
        backgroundSize: '100px 100px',
      }
    })
  },
  components: {
    Container: {
      baseStyle: {
        maxW: 'container.md',
        px: { base: 4, md: 8 },
        py: { base: 4, md: 6 },
      }
    },
    Button: {
      baseStyle: {
        fontWeight: 'normal',
        _focus: {
          boxShadow: 'none',
        }
      }
    }
  }
})

// 本地存储键名
const STORAGE_KEY = 'chatMessages'

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)
  const { colorMode, toggleColorMode } = useColorMode()
  const toast = useToast()

  // 背景和文字颜色
  const headerBg = useColorModeValue('blue.500', 'blue.600')
  const messageBg = useColorModeValue('white', 'gray.700')
  const userMessageBg = useColorModeValue('blue.500', 'blue.400')
  const inputBg = useColorModeValue('white', 'gray.700')
  const buttonHoverBg = useColorModeValue('whiteAlpha.200', 'whiteAlpha.300')

  // 从本地存储加载消息
  useEffect(() => {
    try {
      const savedMessages = localStorage.getItem(STORAGE_KEY)
      if (savedMessages) {
        const parsedMessages = JSON.parse(savedMessages).map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }))
        setMessages(parsedMessages)
      }
    } catch (error) {
      console.error('加载消息历史失败:', error)
    }
  }, [])

  // 保存消息到本地存储
  useEffect(() => {
    if (messages.length > 0) {
      try {
        setIsSyncing(true)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
      } catch (error) {
        console.error('保存消息历史失败:', error)
        toast({
          title: '保存失败',
          description: '消息历史保存失败，请检查浏览器存储空间',
          status: 'error',
          duration: 3000,
        })
      } finally {
        setIsSyncing(false)
      }
    }
  }, [messages])

  // 清空聊天记录
  const clearMessages = () => {
    setMessages([])
    localStorage.removeItem(STORAGE_KEY)
    toast({
      title: '聊天记录已清空',
      description: '本地存储的消息历史也已清除',
      status: 'info',
      duration: 2000,
    })
  }

  // 导出聊天记录
  const exportMessages = () => {
    const content = messages
      .map(msg => `${msg.isUser ? '我' : 'AI'} (${new Date(msg.timestamp).toLocaleString()}): ${msg.content}`)
      .join('\n\n')
    
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `聊天记录_${new Date().toLocaleDateString()}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    toast({
      title: '聊天记录已导出',
      description: `共导出 ${messages.length} 条消息`,
      status: 'success',
      duration: 2000,
    })
  }

  // 复制最后一条消息
  const copyLastMessage = () => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1].content
      navigator.clipboard.writeText(lastMessage)
      toast({
        title: '已复制到剪贴板',
        status: 'success',
        duration: 2000,
      })
    }
  }

  const handleSend = async () => {
    if (!input.trim() || isLoading) return
    
    const newMessage: Message = {
      id: Date.now().toString(),
      content: input,
      isUser: true,
      timestamp: new Date(),
      status: 'sent'
    }

    setMessages(prev => [...prev, newMessage])
    const userInput = input
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_API_KEY}`
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [{ role: 'user', content: userInput }]
        })
      })

      const data = await response.json()
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.choices[0].message.content,
        isUser: false,
        timestamp: new Date(),
        status: 'sent'
      }
      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      console.error('API 请求失败:', error)
      const errorMessage = error instanceof Error ? error.message : '发送消息失败'
      
      // 添加错误消息
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        content: '抱歉，消息发送失败，请重试',
        isUser: false,
        timestamp: new Date(),
        status: 'error'
      }
      setMessages(prev => [...prev, errorMsg])
      
      toast({
        title: '发送失败',
        description: errorMessage,
        status: 'error',
        duration: 3000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ChakraProvider theme={theme}>
      <CSSReset />
      <Box 
        minH="100vh" 
        display="flex" 
        flexDirection="column"
        position="relative"
        overflow="hidden"
      >
        {/* 背景装饰 */}
        <Box
          position="absolute"
          top="-10%"
          left="-10%"
          width="120%"
          height="120%"
          bgGradient={colorMode === 'light' 
            ? 'radial(circle at 0% 0%, blue.50 0%, transparent 50%)' 
            : 'radial(circle at 0% 0%, blue.900 0%, transparent 50%)'}
          pointerEvents="none"
          zIndex={0}
        />
        <Box
          position="absolute"
          bottom="-10%"
          right="-10%"
          width="120%"
          height="120%"
          bgGradient={colorMode === 'light'
            ? 'radial(circle at 100% 100%, purple.50 0%, transparent 50%)'
            : 'radial(circle at 100% 100%, purple.900 0%, transparent 50%)'}
          pointerEvents="none"
          zIndex={0}
        />

        {/* 主要内容 */}
        <Flex 
          py={4} 
          px={6} 
          bg={headerBg}
          color="white" 
          alignItems="center" 
          justifyContent="space-between"
          position="relative"
          boxShadow="lg"
          backdropFilter="blur(10px)"
          backgroundColor={colorMode === 'light' 
            ? 'rgba(49, 130, 206, 0.9)' 
            : 'rgba(49, 130, 206, 0.8)'}
        >
          <Flex alignItems="center" gap={2}>
            <Text fontSize="2xl" fontWeight="bold">先问AI</Text>
            <Text fontSize="md" opacity={0.9}>| 遇事困难？先问AI</Text>
          </Flex>
          
          <Flex gap={2}>
            <Tooltip label={`已缓存 ${messages.length} 条消息`}>
              <IconButton
                aria-label="复制最后一条消息"
                icon={<FiCopy />}
                variant="ghost"
                color="white"
                onClick={copyLastMessage}
                isDisabled={messages.length === 0}
                _hover={{ bg: buttonHoverBg }}
              />
            </Tooltip>
            
            <Tooltip label="导出聊天记录">
              <IconButton
                aria-label="导出聊天记录"
                icon={<FiDownload />}
                variant="ghost"
                color="white"
                onClick={exportMessages}
                isDisabled={messages.length === 0}
                _hover={{ bg: buttonHoverBg }}
              />
            </Tooltip>

            <Tooltip label="清空聊天记录">
              <IconButton
                aria-label="清空聊天记录"
                icon={<FiTrash2 />}
                variant="ghost"
                color="white"
                onClick={clearMessages}
                isDisabled={messages.length === 0}
                _hover={{ bg: buttonHoverBg }}
              />
            </Tooltip>

            <Tooltip label={colorMode === 'light' ? '深色模式' : '浅色模式'}>
              <IconButton
                aria-label="切换主题"
                icon={colorMode === 'light' ? <FiMoon /> : <FiSun />}
                variant="ghost"
                color="white"
                onClick={toggleColorMode}
                _hover={{ bg: buttonHoverBg }}
              />
            </Tooltip>
          </Flex>
          
          {isSyncing && (
            <Progress
              size="xs"
              isIndeterminate
              position="absolute"
              bottom={0}
              left={0}
              right={0}
              bg="transparent"
            />
          )}
        </Flex>

        <Container 
          flex="1" 
          display="flex" 
          flexDirection="column" 
          position="relative"
          backdropFilter="blur(10px)"
          backgroundColor={colorMode === 'light' ? 'whiteAlpha.800' : 'blackAlpha.500'}
          borderRadius="xl"
          my={4}
          boxShadow="lg"
        >
          <VStack flex="1" spacing={4} align="stretch" overflowY="auto">
            {messages.map((msg) => (
              <Flex 
                key={msg.id} 
                justify={msg.isUser ? 'flex-end' : 'flex-start'}
              >
                <Box
                  maxW="70%"
                  bg={msg.isUser ? userMessageBg : messageBg}
                  color={msg.isUser ? 'white' : (colorMode === 'light' ? 'gray.800' : 'white')}
                  p={4}
                  borderRadius="2xl"
                  shadow="md"
                  backdropFilter="blur(10px)"
                  backgroundColor={msg.isUser 
                    ? (colorMode === 'light' ? 'blue.500' : 'blue.400') 
                    : (colorMode === 'light' ? 'white' : 'gray.700')}
                >
                  <Text>{msg.content}</Text>
                  {msg.status === 'error' && (
                    <Text 
                      fontSize="xs" 
                      color="red.500"
                      mt={2}
                    >
                      发送失败
                    </Text>
                  )}
                </Box>
              </Flex>
            ))}
          </VStack>

          <Flex mt={4} gap={3}>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="输入消息..."
              disabled={isLoading}
              bg={inputBg}
              size="lg"
              borderRadius="xl"
              _hover={{ bg: inputBg }}
              _focus={{ bg: inputBg, borderColor: 'blue.400', boxShadow: '0 0 0 1px var(--chakra-colors-blue-400)' }}
            />
            <Button
              colorScheme="blue"
              onClick={handleSend}
              isLoading={isLoading}
              px={8}
              size="lg"
              borderRadius="xl"
              _hover={{ transform: 'translateY(-1px)' }}
              transition="all 0.2s"
            >
              发送
            </Button>
          </Flex>
        </Container>
      </Box>
    </ChakraProvider>
  )
}

export default App
