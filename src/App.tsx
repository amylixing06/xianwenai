import React, { Suspense, lazy, useEffect } from 'react';
import { ChakraProvider, Spinner, Center } from '@chakra-ui/react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';

// 预加载函数
const preloadComponent = (importFn: () => Promise<any>) => {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'script';
  link.href = importFn.toString().match(/['"](.*?)['"]/)?.[1] || '';
  document.head.appendChild(link);
};

// 动态导入组件
const Chat = lazy(() => {
  // 预加载其他可能需要的组件
  preloadComponent(() => import('./components/Chat'));
  return import('./components/Chat');
});

// 加载状态组件
const LoadingSpinner = () => (
  <Center h="100vh">
    <Spinner
      thickness="4px"
      speed="0.65s"
      emptyColor="gray.200"
      color="blue.500"
      size="xl"
    />
  </Center>
);

const App: React.FC = () => {
  // 预加载关键资源
  useEffect(() => {
    // 预加载字体
    const fontLink = document.createElement('link');
    fontLink.rel = 'preload';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
    fontLink.as = 'style';
    document.head.appendChild(fontLink);

    // 预加载关键图片
    const preloadImage = (src: string) => {
      const img = new Image();
      img.src = src;
    };
    preloadImage('/ai-avatar.png');
    preloadImage('/user-avatar.png');
  }, []);

  return (
    <ChakraProvider>
      <Router>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<Chat />} />
            <Route path="*" element={<Chat />} />
          </Routes>
        </Suspense>
      </Router>
    </ChakraProvider>
  );
};

export default App;
