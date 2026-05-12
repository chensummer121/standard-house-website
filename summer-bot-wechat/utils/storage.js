/**
 * Summer Bot 本地存储管理
 * 微信小程序版本
 */

const STORAGE_KEYS = {
  SESSION_ID: 'summer_bot_session_id',
  TOKEN: 'summer_bot_token',
  USER_INFO: 'summer_bot_user_info',
  CHAT_HISTORY: 'summer_bot_chat_history',
  SETTINGS: 'summer_bot_settings'
};

const MAX_HISTORY_MESSAGES = 100;
const MAX_SESSIONS = 20;

function getSessionId() {
  return wx.getStorageSync(STORAGE_KEYS.SESSION_ID) || '';
}

function setSessionId(sessionId) {
  wx.setStorageSync(STORAGE_KEYS.SESSION_ID, sessionId);
}

function getToken() {
  return wx.getStorageSync(STORAGE_KEYS.TOKEN) || '';
}

function setToken(token) {
  wx.setStorageSync(STORAGE_KEYS.TOKEN, token);
}

function getUserInfo() {
  const info = wx.getStorageSync(STORAGE_KEYS.USER_INFO);
  return info ? JSON.parse(info) : null;
}

function setUserInfo(userInfo) {
  wx.setStorageSync(STORAGE_KEYS.USER_INFO, JSON.stringify(userInfo));
}

function clearUserInfo() {
  wx.removeStorageSync(STORAGE_KEYS.TOKEN);
  wx.removeStorageSync(STORAGE_KEYS.USER_INFO);
}

function getChatHistory(sessionId = null) {
  const history = wx.getStorageSync(STORAGE_KEYS.CHAT_HISTORY) || [];
  
  if (sessionId) {
    const session = history.find(h => h.sessionId === sessionId);
    return session ? session.messages : [];
  }
  
  return history;
}

function saveChatHistory(sessionId, messages) {
  let history = wx.getStorageSync(STORAGE_KEYS.CHAT_HISTORY) || [];
  const truncatedMessages = messages.slice(-MAX_HISTORY_MESSAGES);
  
  const sessionIndex = history.findIndex(h => h.sessionId === sessionId);
  
  if (sessionIndex !== -1) {
    history[sessionIndex].messages = truncatedMessages;
    history[sessionIndex].updatedAt = Date.now();
  } else {
    history.push({
      sessionId,
      messages: truncatedMessages,
      createdAt: Date.now(),
      updatedAt: Date.now()
    });
  }
  
  if (history.length > MAX_SESSIONS) {
    history.sort((a, b) => b.updatedAt - a.updatedAt);
    history = history.slice(0, MAX_SESSIONS);
  }
  
  wx.setStorageSync(STORAGE_KEYS.CHAT_HISTORY, history);
}

function addMessage(sessionId, message) {
  const history = getChatHistory();
  const session = history.find(h => h.sessionId === sessionId);
  
  if (session) {
    session.messages.push(message);
    if (session.messages.length > MAX_HISTORY_MESSAGES) {
      session.messages = session.messages.slice(-MAX_HISTORY_MESSAGES);
    }
    session.updatedAt = Date.now();
  } else {
    history.push({
      sessionId,
      messages: [message],
      createdAt: Date.now(),
      updatedAt: Date.now()
    });
  }
  
  if (history.length > MAX_SESSIONS) {
    history.sort((a, b) => b.updatedAt - a.updatedAt);
    history.splice(MAX_SESSIONS);
  }
  
  wx.setStorageSync(STORAGE_KEYS.CHAT_HISTORY, history);
}

function getSessionList() {
  const history = wx.getStorageSync(STORAGE_KEYS.CHAT_HISTORY) || [];
  
  return history.map(session => ({
    sessionId: session.sessionId,
    title: session.messages[0]?.content?.substring(0, 30) || '新对话',
    messageCount: session.messages.length,
    lastMessage: session.messages[session.messages.length - 1]?.content?.substring(0, 50) || '',
    updatedAt: session.updatedAt,
    createdAt: session.createdAt
  })).sort((a, b) => b.updatedAt - a.updatedAt);
}

function deleteSession(sessionId) {
  let history = wx.getStorageSync(STORAGE_KEYS.CHAT_HISTORY) || [];
  history = history.filter(h => h.sessionId !== sessionId);
  wx.setStorageSync(STORAGE_KEYS.CHAT_HISTORY, history);
}

function clearAllHistory() {
  wx.removeStorageSync(STORAGE_KEYS.CHAT_HISTORY);
}

function getSettings() {
  const settings = wx.getStorageSync(STORAGE_KEYS.SETTINGS);
  return settings ? JSON.parse(settings) : {
    soundEnabled: true,
    vibrationEnabled: true,
    autoScroll: true
  };
}

function setSettings(settings) {
  wx.setStorageSync(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
}

module.exports = {
  STORAGE_KEYS,
  getSessionId,
  setSessionId,
  getToken,
  setToken,
  getUserInfo,
  setUserInfo,
  clearUserInfo,
  getChatHistory,
  saveChatHistory,
  addMessage,
  getSessionList,
  deleteSession,
  clearAllHistory,
  getSettings,
  setSettings,
  MAX_HISTORY_MESSAGES
};
