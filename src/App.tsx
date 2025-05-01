import React, { useState } from 'react'
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
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Tooltip,
  useToast
} from '@chakra-ui/react'
import { FiSun, FiMoon, FiSettings, FiTrash2, FiDownload, FiCopy } from 'react-icons/fi'

// 自定义主题
const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: 'gray.50',
        color: 'gray.800'
      }
    }
  }
})

const App: React.FC = () => {
  const [messages, setMessages] = useState<Array<{ content: string; isUser: boolean }>>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { colorMode, toggleColorMode } = useColorMode()
  const toast = useToast()

  // 清空聊天记录
  const clearMessages = () => {
    setMessages([])
    toast({
      title: '聊天记录已清空',
      status: 'info',
      duration: 2000,
    })
  }

  // 导出聊天记录
  const exportMessages = () => {
    const content = messages
      .map(msg => `${msg.isUser ? '我' : 'AI'}: ${msg.content}`)
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
    
    // 添加用户消息
    setMessages(prev => [...prev, { content: input, isUser: true }])
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
      setMessages(prev => [...prev, { content: data.choices[0].message.content, isUser: false }])
    } catch (error) {
      console.error('API 请求失败:', error)
      toast({
        title: '发送失败',
        description: '请检查网络连接或API配置',
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
      <Box minH="100vh" bg="gray.50" display="flex" flexDirection="column">
        <Flex 
          py={4} 
          px={6} 
          bg="blue.500" 
          color="white" 
          alignItems="center" 
          justifyContent="space-between"
        >
          <Flex alignItems="center" gap={2}>
            <Text fontSize="2xl" fontWeight="bold">先问AI</Text>
            <Text fontSize="md" opacity={0.9}>| 遇事困难？先问AI</Text>
          </Flex>
          
          <Flex gap={2}>
            <Tooltip label="复制最后一条消息">
              <IconButton
                aria-label="复制最后一条消息"
                icon={<FiCopy />}
                variant="ghost"
                color="white"
                onClick={copyLastMessage}
                isDisabled={messages.length === 0}
                _hover={{ bg: 'whiteAlpha.200' }}
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
                _hover={{ bg: 'whiteAlpha.200' }}
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
                _hover={{ bg: 'whiteAlpha.200' }}
              />
            </Tooltip>

            <Tooltip label={colorMode === 'light' ? '深色模式' : '浅色模式'}>
              <IconButton
                aria-label="切换主题"
                icon={colorMode === 'light' ? <FiMoon /> : <FiSun />}
                variant="ghost"
                color="white"
                onClick={toggleColorMode}
                _hover={{ bg: 'whiteAlpha.200' }}
              />
            </Tooltip>

            <Menu>
              <MenuButton
                as={IconButton}
                aria-label="设置"
                icon={<FiSettings />}
                variant="ghost"
                color="white"
                _hover={{ bg: 'whiteAlpha.200' }}
              />
              <MenuList>
                <MenuItem>API 设置</MenuItem>
                <MenuItem>界面设置</MenuItem>
                <MenuItem>关于</MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </Flex>

        <Container maxW="container.md" flex="1" py={4} display="flex" flexDirection="column">
          <VStack flex="1" spacing={4} align="stretch" overflowY="auto">
            {messages.map((msg, index) => (
              <Flex 
                key={index} 
                justify={msg.isUser ? 'flex-end' : 'flex-start'}
              >
                <Box
                  maxW="70%"
                  bg={msg.isUser ? 'blue.500' : 'white'}
                  color={msg.isUser ? 'white' : 'black'}
                  p={3}
                  borderRadius="lg"
                  shadow="sm"
                >
                  {msg.content}
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
              bg="white"
              size="lg"
            />
            <Button
              colorScheme="blue"
              onClick={handleSend}
              isLoading={isLoading}
              px={8}
              size="lg"
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
