import { Box, Container, Heading, Text, Button, Stack } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'

export default function Home() {
  return (
    <Container maxW="container.xl" py={20}>
      <Box textAlign="center" py={10}>
        <Heading
          fontWeight={600}
          fontSize={{ base: '3xl', sm: '4xl', md: '6xl' }}
          lineHeight={'110%'}
        >
          先问 AI{' '}
          <Text as={'span'} color={'blue.400'}>
            智能助手
          </Text>
        </Heading>
        <Text color={'gray.500'} maxW={'3xl'} mx="auto" mt={6} fontSize="xl">
          基于先进的 AI 技术，为您提供智能问答服务。支持网页内容分析、文本理解、知识问答等多种功能。
        </Text>
        <Stack
          direction={'column'}
          spacing={3}
          align={'center'}
          alignSelf={'center'}
          position={'relative'}
          mt={10}
        >
          <Button
            as={RouterLink}
            to="/chat"
            colorScheme={'blue'}
            bg={'blue.400'}
            rounded={'full'}
            px={6}
            _hover={{
              bg: 'blue.500',
            }}
          >
            开始对话
          </Button>
          <Button
            as={RouterLink}
            to="/register"
            variant={'link'}
            colorScheme={'blue'}
            size={'sm'}
          >
            注册账号
          </Button>
        </Stack>
      </Box>
    </Container>
  )
} 