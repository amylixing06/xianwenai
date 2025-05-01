import { create } from 'apisauce';

// 创建 API 实例
const api = create({
  baseURL: 'https://api.deepseek.com/v1',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer sk-e32f9e02b3354fa29af6c160266613da'
  },
  timeout: 15000
});

// 内存缓存
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5分钟缓存

// 重试配置
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

// 延迟函数
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// 带重试的请求函数
const fetchWithRetry = async (
  url: string,
  options: any,
  retries: number = 0
): Promise<any> => {
  try {
    const response = await api.post(url, options);
    
    if (response.ok) {
      return response.data;
    }
    
    throw new Error(response.problem);
  } catch (error) {
    if (retries < MAX_RETRIES) {
      await delay(RETRY_DELAY * Math.pow(2, retries));
      return fetchWithRetry(url, options, retries + 1);
    }
    throw error;
  }
};

// 带缓存的聊天请求
export const chatCompletion = async (message: string) => {
  const cacheKey = JSON.stringify({ message });
  
  // 检查缓存
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  try {
    const data = await fetchWithRetry('/chat/completions', {
      model: 'deepseek-chat',
      messages: [
        {
          role: 'user',
          content: message
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });

    // 更新缓存
    cache.set(cacheKey, {
      data,
      timestamp: Date.now()
    });

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw new Error('请求失败，请稍后重试');
  }
};

// 监听网络状态
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    console.log('网络已连接');
  });

  window.addEventListener('offline', () => {
    console.log('网络已断开');
  });
}

export default api; 