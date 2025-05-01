const CACHE_NAME = 'xianwen-cache-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/ai-avatar.png',
  '/user-avatar.png',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
  '/icons/icon-72x72.png',
  '/icons/icon-96x96.png',
  '/icons/icon-128x128.png',
  '/icons/icon-144x144.png',
  '/icons/icon-152x152.png',
  '/icons/icon-192x192.png',
  '/icons/icon-384x384.png',
  '/icons/icon-512x512.png'
];

// 预缓存静态资源
const precache = async () => {
  const cache = await caches.open(CACHE_NAME);
  return cache.addAll(STATIC_ASSETS);
};

// 清理旧缓存
const clearOldCaches = async () => {
  const cacheNames = await caches.keys();
  const oldCacheNames = cacheNames.filter(name => name !== CACHE_NAME);
  return Promise.all(oldCacheNames.map(name => caches.delete(name)));
};

// 安装 Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    Promise.all([
      precache(),
      self.skipWaiting() // 强制新 SW 接管
    ])
  );
});

// 激活 Service Worker
self.addEventListener('activate', event => {
  event.waitUntil(
    Promise.all([
      clearOldCaches(),
      self.clients.claim() // 强制接管所有客户端
    ])
  );
});

// 处理请求
self.addEventListener('fetch', event => {
  const request = event.request;
  
  // 忽略非 GET 请求
  if (request.method !== 'GET') return;
  
  // API 请求使用 Network First 策略
  if (request.url.includes('api.deepseek.com')) {
    event.respondWith(
      fetch(request)
        .then(response => {
          const responseClone = response.clone();
          caches.open(CACHE_NAME)
            .then(cache => cache.put(request, responseClone));
          return response;
        })
        .catch(async () => {
          const cachedResponse = await caches.match(request);
          if (cachedResponse) {
            return cachedResponse;
          }
          // 如果没有缓存，返回离线响应
          return new Response(
            JSON.stringify({
              error: '您当前处于离线状态，请检查网络连接'
            }),
            {
              headers: { 'Content-Type': 'application/json' }
            }
          );
        })
    );
    return;
  }

  // 静态资源使用 Cache First 策略
  event.respondWith(
    caches.match(request)
      .then(async cachedResponse => {
        if (cachedResponse) {
          // 后台更新缓存
          fetch(request)
            .then(response => {
              caches.open(CACHE_NAME)
                .then(cache => cache.put(request, response));
            })
            .catch(() => {});
          return cachedResponse;
        }

        try {
          const response = await fetch(request);
          const responseClone = response.clone();
          const cache = await caches.open(CACHE_NAME);
          cache.put(request, responseClone);
          return response;
        } catch (error) {
          // 如果是HTML请求，返回离线页面
          if (request.headers.get('accept').includes('text/html')) {
            return caches.match('/offline.html');
          }
          throw error;
        }
      })
  );
});

// 后台同步
self.addEventListener('sync', event => {
  if (event.tag === 'sync-messages') {
    event.waitUntil(syncMessages());
  }
});

// 推送通知
self.addEventListener('push', event => {
  const options = {
    body: event.data.text(),
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };

  event.waitUntil(
    self.registration.showNotification('闲问 AI', options)
  );
}); 