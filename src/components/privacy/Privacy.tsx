import React from 'react'
import {
  Container,
  Typography,
  Paper
} from '@mui/material'

const Privacy: React.FC = () => {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          隐私政策
        </Typography>
        
        <Typography variant="body1" paragraph>
          最后更新日期：2024年3月
        </Typography>

        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          1. 信息收集
        </Typography>
        <Typography variant="body1" paragraph>
          我们收集的信息包括但不限于：
          - 您提供的个人信息（如姓名、电子邮件地址）
          - 使用数据（如访问时间、使用时长）
          - 设备信息（如设备类型、操作系统版本）
        </Typography>

        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          2. 信息使用
        </Typography>
        <Typography variant="body1" paragraph>
          我们使用收集的信息来：
          - 提供、维护和改进我们的服务
          - 开发新的服务和功能
          - 保护用户和公众的安全
        </Typography>

        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          3. 信息共享
        </Typography>
        <Typography variant="body1" paragraph>
          我们不会出售、交易或转让您的个人信息给第三方。我们仅在以下情况下共享信息：
          - 获得您的明确同意
          - 遵守法律法规要求
          - 保护我们的合法权益
        </Typography>

        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          4. 数据安全
        </Typography>
        <Typography variant="body1" paragraph>
          我们采取合理的安全措施来保护您的个人信息，防止未经授权的访问、使用或披露。
        </Typography>

        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          5. 您的权利
        </Typography>
        <Typography variant="body1" paragraph>
          您有权：
          - 访问您的个人信息
          - 更正不准确的信息
          - 要求删除您的信息
          - 撤回同意
        </Typography>

        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          6. 联系我们
        </Typography>
        <Typography variant="body1" paragraph>
          如果您对本隐私政策有任何疑问，请通过以下方式联系我们：
          - 电子邮件：privacy@xianwenai.com
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 4 }}>
          本隐私政策可能会不时更新。我们会在政策更新时通知您。
        </Typography>
      </Paper>
    </Container>
  )
}

export default Privacy 