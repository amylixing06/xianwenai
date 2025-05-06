import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper
} from '@mui/material';

const Terms: React.FC = () => {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          服务条款
        </Typography>
        
        <Typography variant="body1" paragraph>
          最后更新日期：2024年3月
        </Typography>

        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          1. 服务说明
        </Typography>
        <Typography variant="body1" paragraph>
          先问AI（以下简称"本服务"）是一个基于人工智能的对话服务。我们致力于为用户提供便捷、智能的对话体验。
        </Typography>

        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          2. 使用规则
        </Typography>
        <Typography variant="body1" paragraph>
          用户在使用本服务时应当：
          - 遵守相关法律法规
          - 尊重他人权益
          - 不得利用本服务从事违法活动
          - 不得干扰服务的正常运行
        </Typography>

        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          3. 服务变更
        </Typography>
        <Typography variant="body1" paragraph>
          我们保留随时修改或中断服务的权利，恕不另行通知。我们不对因服务变更而导致的任何损失负责。
        </Typography>

        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          4. 免责声明
        </Typography>
        <Typography variant="body1" paragraph>
          本服务提供的AI回复仅供参考，不构成任何形式的建议或承诺。用户应当自行判断信息的准确性和适用性。
        </Typography>

        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          5. 知识产权
        </Typography>
        <Typography variant="body1" paragraph>
          本服务的所有内容，包括但不限于文字、图片、代码等，均受知识产权法律保护。未经授权，不得复制、修改或使用。
        </Typography>

        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          6. 联系我们
        </Typography>
        <Typography variant="body1" paragraph>
          如果您对本服务条款有任何疑问，请通过以下方式联系我们：
          - 电子邮件：terms@xianwenai.com
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 4 }}>
          本服务条款可能会不时更新。我们会在条款更新时通知您。
        </Typography>
      </Paper>
    </Container>
  );
};

export default Terms; 