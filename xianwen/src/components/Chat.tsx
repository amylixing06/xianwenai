import React from 'react';
import { Box, Button, Text, useToast } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const Chat: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
    toast({
      title: '已退出登录',
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <Box p={4}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Text>欢迎, {user.email}</Text>
        <Button onClick={handleLogout} colorScheme="red" size="sm">
          退出登录
        </Button>
      </Box>
      {/* 这里添加聊天界面的其他组件 */}
    </Box>
  );
};

export default Chat; 