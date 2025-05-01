import React, { useState } from 'react'
import { ChakraProvider, Box, Text, Container, Input, Button, Flex, VStack } from '@chakra-ui/react'

const App: React.FC = () => {
  const [messages, setMessages] = useState<Array<{ content: string; isUser: boolean }>>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

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
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ChakraProvider>
      <Box minH="100vh" bg="gray.50" display="flex" flexDirection="column">
        <Box py={4} bg="blue.500" color="white" textAlign="center">
          <Text fontSize="2xl" fontWeight="bold">先问AI</Text>
          <Text fontSize="md">一个简单的 AI 聊天应用</Text>
        </Box>

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
            />
            <Button
              colorScheme="blue"
              onClick={handleSend}
              isLoading={isLoading}
              px={8}
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
