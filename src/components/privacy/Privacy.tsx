import React from 'react'
import {
  Container,
  Typography,
  Paper,
  Box
} from '@mui/material'

const Privacy: React.FC = () => {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4 }}>
      <Container maxWidth="md">
        <Paper elevation={1} sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom>
            隐私政策
          </Typography>
          <Typography variant="body1" paragraph>
            最后更新日期：2024年3月1日
          </Typography>
          
          <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
            1. 信息收集
          </Typography>
          <Typography variant="body1" paragraph>
            我们收集的信息包括：
            - 您与AI助手的对话内容
            - 设备信息
            - 使用数据
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
            2. 信息使用
          </Typography>
          <Typography variant="body1" paragraph>
            我们使用收集的信息：
            - 提供和改进服务
            - 个性化用户体验
            - 分析服务使用情况
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
            3. 信息共享
          </Typography>
          <Typography variant="body1" paragraph>
            我们不会出售您的个人信息。我们仅在以下情况下共享信息：
            - 经您同意
            - 法律要求
            - 保护我们的权利
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
            4. 数据安全
          </Typography>
          <Typography variant="body1" paragraph>
            我们采用行业标准的安全措施保护您的信息。
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
            5. 您的权利
          </Typography>
          <Typography variant="body1" paragraph>
            您有权：
            - 访问您的个人信息
            - 更正不准确的信息
            - 要求删除信息
            - 反对信息处理
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
            6. Cookie政策
          </Typography>
          <Typography variant="body1" paragraph>
            我们使用Cookie改善用户体验。您可以通过浏览器设置控制Cookie。
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
            7. 隐私政策更新
          </Typography>
          <Typography variant="body1" paragraph>
            我们可能更新本隐私政策。更新后的版本将在网站上发布。
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
            8. 联系我们
          </Typography>
          <Typography variant="body1" paragraph>
            如有任何问题，请联系：privacy@xianwenai.com
          </Typography>
        </Paper>
      </Container>
    </Box>
  )
}

export default Privacy 