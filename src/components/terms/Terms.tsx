import React from 'react';
import { Container, Typography, Paper, Box } from '@mui/material';

const Terms: React.FC = () => {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4 }}>
      <Container maxWidth="md">
        <Paper elevation={1} sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom>
            服务条款
          </Typography>
          <Typography variant="body1" paragraph>
            最后更新日期：2024年3月1日
          </Typography>
          
          <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
            1. 服务说明
          </Typography>
          <Typography variant="body1" paragraph>
            先问AI提供基于人工智能的对话服务。使用我们的服务即表示您同意本条款。
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
            2. 用户责任
          </Typography>
          <Typography variant="body1" paragraph>
            您同意：
            - 提供准确的信息
            - 遵守所有适用法律
            - 不滥用服务
            - 保护账户安全
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
            3. 知识产权
          </Typography>
          <Typography variant="body1" paragraph>
            所有内容的知识产权归先问AI所有。您可以在遵守本条款的前提下使用服务。
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
            4. 免责声明
          </Typography>
          <Typography variant="body1" paragraph>
            服务按"现状"提供，不提供任何明示或暗示的保证。我们不对服务的准确性、可靠性负责。
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
            5. 服务变更
          </Typography>
          <Typography variant="body1" paragraph>
            我们保留随时修改或终止服务的权利，恕不另行通知。
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
            6. 责任限制
          </Typography>
          <Typography variant="body1" paragraph>
            在法律允许的最大范围内，我们不对任何直接、间接、附带、特殊或惩罚性损害负责。
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
            7. 争议解决
          </Typography>
          <Typography variant="body1" paragraph>
            任何争议应通过友好协商解决。如无法达成一致，应提交至有管辖权的法院。
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
            8. 条款更新
          </Typography>
          <Typography variant="body1" paragraph>
            我们可能更新本条款。继续使用服务即表示您接受更新后的条款。
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
            9. 联系我们
          </Typography>
          <Typography variant="body1" paragraph>
            如有任何问题，请联系：terms@xianwenai.com
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default Terms; 