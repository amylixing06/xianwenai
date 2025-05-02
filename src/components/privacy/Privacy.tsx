import React from 'react'
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  UnorderedList,
  ListItem,
  Link,
  useColorModeValue
} from '@chakra-ui/react'

const Privacy: React.FC = () => {
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  return (
    <Container maxW="container.md" py={8}>
      <VStack spacing={6} align="stretch">
        <Box bg={bgColor} p={6} borderRadius="lg" borderWidth="1px" borderColor={borderColor}>
          <Heading as="h1" size="xl" mb={6}>隐私政策</Heading>
          <Text color="gray.500" mb={4}>最后更新日期：2024年03月19日</Text>

          <VStack spacing={8} align="stretch">
            <Box>
              <Heading as="h2" size="lg" mb={4}>引言</Heading>
              <Text>
                欢迎使用先问AI（以下简称"我们"、"本应用"）。我们非常重视您的隐私和个人信息保护。
                本隐私政策旨在向您说明我们如何收集、使用和保护您的信息。
              </Text>
            </Box>

            <Box>
              <Heading as="h2" size="lg" mb={4}>数据收集和使用</Heading>
              <Text mb={4}>我们收集和使用的信息包括：</Text>
              <UnorderedList spacing={3} pl={4}>
                <ListItem>
                  <Text fontWeight="bold">用户输入信息</Text>
                  <Text>您在使用本应用过程中输入的对话内容。这些信息用于提供AI对话服务。</Text>
                </ListItem>
                <ListItem>
                  <Text fontWeight="bold">设备信息</Text>
                  <Text>设备类型、操作系统版本、浏览器类型等基本设备信息，用于优化应用性能和用户体验。</Text>
                </ListItem>
                <ListItem>
                  <Text fontWeight="bold">使用数据</Text>
                  <Text>应用使用频率、功能使用情况等统计信息，用于改进服务质量。</Text>
                </ListItem>
              </UnorderedList>
            </Box>

            <Box>
              <Heading as="h2" size="lg" mb={4}>数据存储和保护</Heading>
              <Text mb={4}>我们采取以下措施保护您的信息：</Text>
              <UnorderedList spacing={3} pl={4}>
                <ListItem>所有数据传输均采用SSL/TLS加密</ListItem>
                <ListItem>定期进行安全评估和系统更新</ListItem>
                <ListItem>严格的数据访问控制机制</ListItem>
                <ListItem>使用可靠的云服务提供商进行数据存储</ListItem>
              </UnorderedList>
            </Box>

            <Box>
              <Heading as="h2" size="lg" mb={4}>第三方服务</Heading>
              <Text mb={4}>我们使用以下第三方服务：</Text>
              <UnorderedList spacing={3} pl={4}>
                <ListItem>
                  <Text fontWeight="bold">DeepSeek API</Text>
                  <Text>用于提供AI对话服务。您与AI的对话内容会被发送到DeepSeek的服务器进行处理。</Text>
                </ListItem>
                <ListItem>
                  <Text fontWeight="bold">Vercel</Text>
                  <Text>用于应用程序托管和性能分析。</Text>
                </ListItem>
              </UnorderedList>
            </Box>

            <Box>
              <Heading as="h2" size="lg" mb={4}>数据共享</Heading>
              <Text mb={4}>
                我们不会向任何第三方出售、出租或共享您的个人信息。但在以下情况下，我们可能会共享您的信息：
              </Text>
              <UnorderedList spacing={3} pl={4}>
                <ListItem>经您明确同意</ListItem>
                <ListItem>应法律法规要求</ListItem>
                <ListItem>保护我们的合法权益</ListItem>
              </UnorderedList>
            </Box>

            <Box>
              <Heading as="h2" size="lg" mb={4}>Cookie 使用</Heading>
              <Text mb={4}>我们使用 Cookie 和本地存储来：</Text>
              <UnorderedList spacing={3} pl={4}>
                <ListItem>保存您的深色/浅色模式偏好</ListItem>
                <ListItem>提供离线访问功能</ListItem>
                <ListItem>优化应用性能</ListItem>
              </UnorderedList>
            </Box>

            <Box>
              <Heading as="h2" size="lg" mb={4}>隐私政策更新</Heading>
              <Text>
                我们会定期更新本隐私政策以反映我们的做法变更。更新后的政策将在本页面发布，
                并在发生重大变更时通过应用内通知告知用户。继续使用我们的服务即表示您同意最新的隐私政策。
              </Text>
            </Box>

            <Box>
              <Heading as="h2" size="lg" mb={4}>联系我们</Heading>
              <Text mb={4}>如果您对本隐私政策有任何疑问或建议，请通过以下方式联系我们：</Text>
              <UnorderedList spacing={3} pl={4}>
                <ListItem>
                  电子邮件：
                  <Link href="mailto:privacy@xianwenai.com" color="blue.500">
                    privacy@xianwenai.com
                  </Link>
                </ListItem>
                <ListItem>在应用内使用反馈功能</ListItem>
              </UnorderedList>
            </Box>

            <Box>
              <Heading as="h2" size="lg" mb={4}>法律声明</Heading>
              <Text>
                本隐私政策受中华人民共和国法律管辖。使用本应用即表示您同意本隐私政策的所有条款。
              </Text>
            </Box>
          </VStack>
        </Box>
      </VStack>
    </Container>
  )
}

export default Privacy 