/**
 * Summer Bot API 调用封装
 * 微信小程序版本
 */

// 生产环境API地址
const API_BASE = 'https://www.standard-house.com';

// 开发环境配置（取消注释即可使用）
// const API_BASE = 'http://localhost:4321';

// 请求超时时间（毫秒）
const REQUEST_TIMEOUT = 15000;

// 消息最大长度
const MAX_MESSAGE_LENGTH = 2000;

/**
 * 通用请求封装
 */
function request(endpoint, data = {}, method = 'POST') {
  return new Promise((resolve, reject) => {
    const token = wx.getStorageSync('token');
    const header = { 'Content-Type': 'application/json' };
    
    if (token) {
      header['Authorization'] = `Bearer ${token}`;
    }
    
    wx.request({
      url: API_BASE + endpoint,
      method: method,
      header: header,
      data: data,
      timeout: REQUEST_TIMEOUT,
      success(res) {
        if (res.statusCode === 200) {
          resolve(res.data);
        } else if (res.statusCode === 401) {
          wx.removeStorageSync('token');
          reject({ code: 401, message: '登录已过期，请重新登录' });
        } else if (res.statusCode === 429) {
          reject({ code: 429, message: '请求过于频繁，请稍后再试' });
        } else {
          reject({ code: res.statusCode, message: res.data?.error || '请求失败' });
        }
      },
      fail(err) {
        if (err.errMsg && err.errMsg.includes('timeout')) {
          reject({ code: 'TIMEOUT', message: '请求超时，请检查网络连接' });
        } else {
          reject({ code: 'NETWORK_ERROR', message: '网络连接失败，请检查网络' });
        }
      }
    });
  });
}

/**
 * 聊天消息发送
 */
function chat(message, sessionId, mode = 'general', history = []) {
  let truncatedMessage = message;
  if (message.length > MAX_MESSAGE_LENGTH) {
    truncatedMessage = message.substring(0, MAX_MESSAGE_LENGTH);
    console.warn('Message truncated to', MAX_MESSAGE_LENGTH, 'characters');
  }
  
  return request('/api/summer-bot', {
    message: truncatedMessage,
    sessionId,
    mode,
    history,
    source: 'wechat'
  });
}

/**
 * 流式聊天（模拟轮询）
 */
function chatStream(message, sessionId, mode = 'general', onChunk, onComplete, onError) {
  let truncatedMessage = message;
  if (message.length > MAX_MESSAGE_LENGTH) {
    truncatedMessage = message.substring(0, MAX_MESSAGE_LENGTH);
  }
  
  let pollCount = 0;
  const maxPolls = 60;
  const pollInterval = 500;
  const taskId = `stream_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
  
  function poll() {
    if (pollCount >= maxPolls) {
      onError({ code: 'TIMEOUT', message: '响应超时，请重试' });
      return;
    }
    
    pollCount++;
    
    request('/api/summer-bot/stream', {
      message: truncatedMessage,
      sessionId,
      mode,
      taskId,
      source: 'wechat'
    }).then(res => {
      if (res.chunk) {
        onChunk(res.chunk);
      }
      
      if (res.done) {
        onComplete(res.fullContent || '');
      } else {
        setTimeout(poll, pollInterval);
      }
    }).catch(err => {
      if (pollCount === 1 && (err.code === 404 || err.code === 'NETWORK_ERROR')) {
        console.log('Stream not available, falling back to regular request');
        chat(message, sessionId, mode, [])
          .then(res => {
            onChunk(res.response || res.content || '');
            onComplete(res.response || res.content || '');
          })
          .catch(onError);
      } else {
        onError(err);
      }
    });
  }
  
  poll();
}

/**
 * 健康检查
 */
function health() {
  return request('/api/summer-bot', { method: 'GET' }, 'GET');
}

/**
 * 用户登录
 */
function login(code) {
  return request('/api/auth/wechat', { code }, 'POST');
}

module.exports = {
  chat,
  chatStream,
  health,
  login,
  request,
  API_BASE,
  MAX_MESSAGE_LENGTH
};
