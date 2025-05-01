import React from 'react';
import { Box, Text } from '@chakra-ui/react';

const Chat: React.FC = () => {
  return (
    <Box p={4}>
      <Text fontSize="xl" fontWeight="bold" mb={4}>
        先问AI聊天界面
      </Text>
      {/* 这里添加聊天界面的其他组件 */}
    </Box>
  );
};

export default Chat; 