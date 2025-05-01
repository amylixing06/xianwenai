import { useState } from 'react'
import {
  Box,
  Container,
  Flex,
  Input,
  Button,
  VStack,
  Text,
  useToast,
} from '@chakra-ui/react'

interface Message {
  content: string
  isUser: boolean
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage = { content: input, isUser: true }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      // TODO: 实现与 AI API 的集成
      const aiResponse = { content: '这是一个示例回复', isUser: false }
      setMessages(prev => [...prev, aiResponse])
    } catch (error) {
      toast({
        title: '发送消息失败',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Container maxW="container.lg" h="100vh" p={4}>
      <Flex direction="column" h="full">
        <Box flex="1" overflowY="auto" mb={4}>
          <VStack spacing={4} align="stretch">
            {messages.map((message, index) => (
              <Box
                key={index}
                bg={message.isUser ? 'blue.100' : 'gray.100'}
                p={3}
                borderRadius="lg"
                alignSelf={message.isUser ? 'flex-end' : 'flex-start'}
                maxW="70%"
              >
                <Text>{message.content}</Text>
              </Box>
            ))}
          </VStack>
        </Box>
        <Flex>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="输入您的问题..."
            mr={2}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
          />
          <Button
            colorScheme="blue"
            onClick={handleSend}
            isLoading={isLoading}
          >
            发送
          </Button>
        </Flex>
      </Flex>
    </Container>
  )
} 