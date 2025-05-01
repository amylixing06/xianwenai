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
  useColorModeValue,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Badge,
  Tooltip,
  Divider,
  Spinner,
  useClipboard,
  Collapse,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  useBreakpointValue
} from '@chakra-ui/react'
import React, { useState, useRef, useEffect, Suspense } from 'react'
import { useInView } from 'react-intersection-observer'
import { 
  FiSend, 
  FiMoreVertical, 
  FiCopy, 
  FiTrash2,
  FiClock,
  FiCheck,
  FiCheckCircle,
  FiMenu,
  FiMessageSquare,
  FiBook,
  FiHelpCircle,
  FiStar,
  FiShare2,
  FiDownload,
  FiEdit2
} from 'react-icons/fi'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { chatCompletion } from '../services/api'

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

interface Message {
  content: string
  isUser: boolean
  timestamp: Date
  status: 'sending' | 'sent' | 'read'
  id: string
  isFavorite?: boolean
  isEdited?: boolean
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [showHistory, setShowHistory] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { hasCopied, onCopy } = useClipboard(selectedMessage?.content || '')
  const bgColor = useColorModeValue('gray.50', 'gray.700')
  const userBgColor = useColorModeValue('blue.500', 'blue.400')
  const aiBgColor = useColorModeValue('white', 'gray.600')
  const isMobile = useBreakpointValue({ base: true, md: false })

  // 自动滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // 处理消息发送
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage = input.trim()
    setInput('')
    const newMessage: Message = {
      content: userMessage,
      isUser: true,
      timestamp: new Date(),
      status: 'sending',
      id: Date.now().toString()
    }
    setMessages(prev => [...prev, newMessage])
    setIsLoading(true)
    setIsTyping(true)

    try {
      const response = await chatCompletion(userMessage)
      const assistantMessage = response.choices[0].message.content
      
      // 更新用户消息状态
      setMessages(prev => prev.map(msg => 
        msg === newMessage ? { ...msg, status: 'sent' } : msg
      ))
      
      // 添加 AI 回复
      setMessages(prev => [...prev, {
        content: assistantMessage,
        isUser: false,
        timestamp: new Date(),
        status: 'sent',
        id: (Date.now() + 1).toString()
      }])
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: '错误',
        description: error instanceof Error ? error.message : '发送消息时出错，请稍后重试',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setIsLoading(false)
      setIsTyping(false)
    }
  }

  // 复制消息
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

  // 删除消息
  const deleteMessage = (id: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== id))
  }

  // 收藏消息
  const toggleFavorite = (id: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === id ? { ...msg, isFavorite: !msg.isFavorite } : msg
    ))
  }

  // 编辑消息
  const editMessage = (id: string, newContent: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === id ? { ...msg, content: newContent, isEdited: true } : msg
    ))
  }

  // 获取状态图标
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
    <Container maxW="container.xl" py={4}>
      <Flex direction="column" h="calc(100vh - 100px)">
        {/* 顶部工具栏 */}
        <Flex justify="space-between" align="center" mb={4}>
          <IconButton
            aria-label="菜单"
            icon={<FiMenu />}
            onClick={onOpen}
            variant="ghost"
          />
          <Text fontSize="xl" fontWeight="bold">先问 AI</Text>
          <IconButton
            aria-label="帮助"
            icon={<FiHelpCircle />}
            onClick={() => setShowHelp(!showHelp)}
            variant="ghost"
          />
        </Flex>

        {/* 帮助提示 */}
        <Collapse in={showHelp}>
          <Alert status="info" mb={4} borderRadius="md">
            <AlertIcon />
            <Box>
              <AlertTitle>使用提示</AlertTitle>
              <AlertDescription>
                您可以：
                <br />• 发送消息与 AI 对话
                <br />• 长按消息进行复制、删除等操作
                <br />• 点击消息菜单查看更多选项
              </AlertDescription>
            </Box>
          </Alert>
        </Collapse>

        {/* 聊天区域 */}
        <Box flex={1} overflowY="auto" p={4} bg={bgColor} borderRadius="md">
          {messages.map((message) => (
            <Flex
              key={message.id}
              justify={message.isUser ? 'flex-end' : 'flex-start'}
              mb={4}
              align="flex-start"
            >
              {!message.isUser && (
                <LazyImage
                  src="/ai-avatar.png"
                  alt="AI Assistant"
                  size="sm"
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
                _groupHover={{ boxShadow: 'md' }}
              >
                <Suspense fallback={<Spinner size="sm" />}>
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                </Suspense>
                <Flex justify="space-between" align="center" mt={2}>
                  <Text fontSize="xs" color={message.isUser ? 'whiteAlpha.700' : 'gray.500'}>
                    {format(message.timestamp, 'HH:mm', { locale: zhCN })}
                    {message.isEdited && ' (已编辑)'}
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
                    {message.isUser && (
                      <MenuItem icon={<FiEdit2 />} onClick={() => {
                        const newContent = prompt('编辑消息', message.content)
                        if (newContent) editMessage(message.id, newContent)
                      }}>
                        编辑
                      </MenuItem>
                    )}
                    <MenuItem icon={<FiStar />} onClick={() => toggleFavorite(message.id)}>
                      {message.isFavorite ? '取消收藏' : '收藏'}
                    </MenuItem>
                    <MenuItem icon={<FiShare2 />} onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: '先问 AI 消息',
                          text: message.content
                        })
                      }
                    }}>
                      分享
                    </MenuItem>
                    <MenuItem icon={<FiDownload />} onClick={() => {
                      const blob = new Blob([message.content], { type: 'text/plain' })
                      const url = URL.createObjectURL(blob)
                      const a = document.createElement('a')
                      a.href = url
                      a.download = `message-${message.id}.txt`
                      a.click()
                      URL.revokeObjectURL(url)
                    }}>
                      下载
                    </MenuItem>
                    <MenuItem icon={<FiTrash2 />} onClick={() => deleteMessage(message.id)}>
                      删除
                    </MenuItem>
                  </MenuList>
                </Menu>
              </Box>
              {message.isUser && (
                <LazyImage
                  src="/user-avatar.png"
                  alt="User"
                  size="sm"
                />
              )}
            </Flex>
          ))}
          {isTyping && (
            <Flex align="center" mb={4}>
              <LazyImage
                src="/ai-avatar.png"
                alt="AI Assistant"
                size="sm"
              />
              <Box
                p={3}
                borderRadius="lg"
                bg={aiBgColor}
                boxShadow="sm"
              >
                <Spinner size="sm" />
              </Box>
            </Flex>
          )}
          <div ref={messagesEndRef} />
        </Box>

        {/* 输入区域 */}
        <form onSubmit={handleSubmit} style={{ marginTop: '16px' }}>
          <Flex>
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="输入消息..."
              mr={2}
              size="lg"
              autoFocus
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
      </Flex>

      {/* 侧边抽屉 */}
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>菜单</DrawerHeader>
          <DrawerBody>
            <VStack spacing={4} align="stretch">
              <Button
                leftIcon={<FiMessageSquare />}
                variant="ghost"
                justifyContent="flex-start"
                onClick={() => {
                  setShowHistory(!showHistory)
                  onClose()
                }}
              >
                聊天历史
              </Button>
              <Button
                leftIcon={<FiBook />}
                variant="ghost"
                justifyContent="flex-start"
              >
                知识库
              </Button>
              <Button
                leftIcon={<FiStar />}
                variant="ghost"
                justifyContent="flex-start"
              >
                收藏夹
              </Button>
              <Divider />
              <Button
                leftIcon={<FiHelpCircle />}
                variant="ghost"
                justifyContent="flex-start"
                onClick={() => {
                  setShowHelp(!showHelp)
                  onClose()
                }}
              >
                帮助
              </Button>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Container>
  )
}

export default Chat 