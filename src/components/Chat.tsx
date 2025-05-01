import { 
  Box, 
  Button, 
  Container, 
  Flex, 
  Input, 
  VStack, 
  useToast,
  Avatar,
  Text,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Tooltip,
  useColorModeValue,
  Badge
} from '@chakra-ui/react'
import React, { useState, useRef, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import { 
  FiSend, 
  FiMoreVertical, 
  FiCopy, 
  FiTrash2,
  FiClock,
  FiCheck,
  FiCheckCircle
} from 'react-icons/fi'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'

interface Message {
  content: string
  isUser: boolean
  timestamp: Date
  status: 'sending' | 'sent' | 'read'
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const toast = useToast()
  const bgColor = useColorModeValue('gray.50', 'gray.700')
  const userBgColor = useColorModeValue('blue.500', 'blue.400')
  const aiBgColor = useColorModeValue('white', 'gray.600')

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage = input.trim()
    setInput('')
    const newMessage: Message = {
      content: userMessage,
      isUser: true,
      timestamp: new Date(),
      status: 'sending'
    }
    setMessages(prev => [...prev, newMessage])
    setIsLoading(true)

    try {
      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer sk-e32f9e02b3354fa29af6c160266613da'
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            {
              role: 'user',
              content: userMessage
            }
          ],
          temperature: 0.7,
          max_tokens: 2000
        }),
      })

      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      const data = await response.json()
      const assistantMessage = data.choices[0].message.content
      
      // 更新用户消息状态
      setMessages(prev => prev.map(msg => 
        msg === newMessage ? { ...msg, status: 'sent' } : msg
      ))
      
      // 添加 AI 回复
      setMessages(prev => [...prev, {
        content: assistantMessage,
        isUser: false,
        timestamp: new Date(),
        status: 'sent'
      }])
    } catch (error) {
      console.error('Error:', error)
      // 更新用户消息状态为错误
      setMessages(prev => prev.map(msg => 
        msg === newMessage ? { ...msg, status: 'sent' } : msg
      ))
      toast({
        title: '错误',
        description: '发送消息时出错，请稍后重试',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({
        title: '已复制',
        status: 'success',
        duration: 2000,
        isClosable: true,
      })
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const deleteMessage = (index: number) => {
    setMessages(prev => prev.filter((_, i) => i !== index))
  }

  const getStatusIcon = (status: Message['status']) => {
    switch (status) {
      case 'sending':
        return <FiClock color="gray" />
      case 'sent':
        return <FiCheck color="gray" />
      case 'read':
        return <FiCheckCircle color="blue" />
      default:
        return null
    }
  }

  return (
    <Container maxW="container.md" py={4}>
      <VStack spacing={4} align="stretch" h="calc(100vh - 100px)">
        <Box flex={1} overflowY="auto" p={4} bg={bgColor} borderRadius="md">
          {messages.map((message, index) => (
            <Flex
              key={index}
              justify={message.isUser ? 'flex-end' : 'flex-start'}
              mb={4}
              align="flex-start"
            >
              {!message.isUser && (
                <Avatar
                  name="AI Assistant"
                  src="/ai-avatar.png"
                  size="sm"
                  mr={2}
                />
              )}
              <Box
                maxW="70%"
                p={3}
                borderRadius="lg"
                bg={message.isUser ? userBgColor : aiBgColor}
                color={message.isUser ? 'white' : 'inherit'}
                boxShadow="sm"
                position="relative"
              >
                <ReactMarkdown>{message.content}</ReactMarkdown>
                <Flex justify="space-between" align="center" mt={2}>
                  <Text fontSize="xs" color={message.isUser ? 'whiteAlpha.700' : 'gray.500'}>
                    {format(message.timestamp, 'HH:mm', { locale: zhCN })}
                  </Text>
                  {message.isUser && (
                    <Box ml={2}>
                      {getStatusIcon(message.status)}
                    </Box>
                  )}
                </Flex>
                <Menu>
                  <MenuButton
                    as={IconButton}
                    icon={<FiMoreVertical />}
                    variant="ghost"
                    size="sm"
                    position="absolute"
                    top={2}
                    right={2}
                    opacity={0}
                    _groupHover={{ opacity: 1 }}
                  />
                  <MenuList>
                    <MenuItem icon={<FiCopy />} onClick={() => copyToClipboard(message.content)}>
                      复制
                    </MenuItem>
                    <MenuItem icon={<FiTrash2 />} onClick={() => deleteMessage(index)}>
                      删除
                    </MenuItem>
                  </MenuList>
                </Menu>
              </Box>
              {message.isUser && (
                <Avatar
                  name="User"
                  src="/user-avatar.png"
                  size="sm"
                  ml={2}
                />
              )}
            </Flex>
          ))}
          <div ref={messagesEndRef} />
        </Box>
        <form onSubmit={handleSubmit}>
          <Flex>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="输入消息..."
              mr={2}
              size="lg"
            />
            <Button 
              type="submit" 
              colorScheme="blue" 
              isLoading={isLoading}
              size="lg"
              rightIcon={<FiSend />}
            >
              发送
            </Button>
          </Flex>
        </form>
      </VStack>
    </Container>
  )
}

export default Chat 