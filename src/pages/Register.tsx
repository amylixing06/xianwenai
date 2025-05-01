import { useState } from 'react'
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Heading,
  useToast,
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../services/api'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const toast = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (password !== confirmPassword) {
      toast({
        title: '密码不匹配',
        status: 'error',
        duration: 3000,
      })
      return
    }

    setIsLoading(true)

    try {
      await authService.register(email, password)
      toast({
        title: '注册成功',
        status: 'success',
        duration: 2000,
      })
      navigate('/login')
    } catch (error) {
      toast({
        title: '注册失败',
        description: error instanceof Error ? error.message : '未知错误',
        status: 'error',
        duration: 3000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Container maxW="container.sm" py={10}>
      <Box p={8} borderWidth={1} borderRadius={8} boxShadow="lg">
        <Stack spacing={4}>
          <Heading textAlign="center">注册</Heading>
          <form onSubmit={handleSubmit}>
            <Stack spacing={4}>
              <FormControl isRequired>
                <FormLabel>邮箱</FormLabel>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>密码</FormLabel>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>确认密码</FormLabel>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </FormControl>
              <Button
                type="submit"
                colorScheme="blue"
                width="full"
                isLoading={isLoading}
              >
                注册
              </Button>
            </Stack>
          </form>
        </Stack>
      </Box>
    </Container>
  )
} 