// 监听插件图标点击事件
chrome.action.onClicked.addListener((tab) => {
  // 打开网站
  chrome.tabs.create({ url: 'https://xianwenai.com' });
}); 