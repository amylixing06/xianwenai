import { Box, Button, Container, Flex, Input, VStack, useToast } from '@chakra-ui/react'
import React, { useState, useRef, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'

interface Message {
  content: string
  isUser: boolean
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const toast = useToast()

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
    setMessages(prev => [...prev, { content: userMessage, isUser: true }])
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
      setMessages(prev => [...prev, { content: assistantMessage, isUser: false }])
    } catch (error) {
      console.error('Error:', error)
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

  return (
    <Container maxW="container.md" py={4}>
      <VStack spacing={4} align="stretch" h="calc(100vh - 100px)">
        <Box flex={1} overflowY="auto" p={4} bg="gray.50" borderRadius="md">
          {messages.map((message, index) => (
            <Flex
              key={index}
              justify={message.isUser ? 'flex-end' : 'flex-start'}
              mb={4}
            >
              <Box
                maxW="70%"
                p={3}
                borderRadius="lg"
                bg={message.isUser ? 'blue.500' : 'white'}
                color={message.isUser ? 'white' : 'black'}
                boxShadow="sm"
              >
                <ReactMarkdown>{message.content}</ReactMarkdown>
              </Box>
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
            />
            <Button type="submit" colorScheme="blue" isLoading={isLoading}>
              发送
            </Button>
          </Flex>
        </form>
      </VStack>
    </Container>
  )
}

export default Chat 