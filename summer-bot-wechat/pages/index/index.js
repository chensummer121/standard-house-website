// pages/index/index.js
// Summer Bot 主聊天页面

const app = getApp();
const api = require('../../utils/api');
const storage = require('../../utils/storage');

Page({
  data: {
    messages: [],
    inputValue: '',
    isLoading: false,
    quickActions: [
      { icon: '🌍', label: '选国家', mode: 'country', question: '我想在非洲开展业务，请帮我选择合适的国家' },
      { icon: '💰', label: '算成本', mode: 'cost', question: '请帮我计算在非洲建厂的成本' },
      { icon: '⚠️', label: '看风险', mode: 'risk', question: '请分析在非洲投资的风险' },
      { icon: '📋', label: '问审批', mode: 'approval', question: '在非洲开展业务需要哪些审批流程' }
    ],
    currentMode: 'general',
    keyboardHeight: 0,
    safeAreaBottom: 0,
    welcomeSent: false
  },

  onLoad(options) {
    console.log('Index page loaded', options);
    this.getSafeArea();
    this.loadHistory();
    
    wx.onKeyboardHeightChange(res => {
      this.setData({ keyboardHeight: res.height });
    });
  },

  onShow() {},

  getSafeArea() {
    const systemInfo = wx.getSystemInfoSync();
    const safeArea = systemInfo.safeArea;
    const bottom = safeArea ? (systemInfo.screenHeight - safeArea.bottom) : 0;
    this.setData({ safeAreaBottom: bottom });
  },

  loadHistory() {
    const sessionId = app.globalData.sessionId;
    const history = storage.getChatHistory(sessionId);
    
    if (history.length > 0) {
      this.setData({ messages: history });
    }
    
    if (!this.data.welcomeSent) {
      this.showWelcome();
    }
  },

  showWelcome() {
    const welcomeMessage = {
      id: `welcome_${Date.now()}`,
      role: 'assistant',
      content: `您好！我是 Summer Bot，STANDERRA Intelligence 的 AI 投资顾问。\n\n我可以帮助您：\n🌍 选择合适的投资国家\n💰 计算投资成本\n⚠️ 分析投资风险\n📋 了解审批流程\n\n请问有什么可以帮助您的？`,
      source: 'public',
      timestamp: Date.now()
    };
    
    this.setData({
      messages: [...this.data.messages, welcomeMessage],
      welcomeSent: true
    });
  },

  sendMessage(e) {
    const message = e.detail.value || this.data.inputValue;
    if (!message.trim() || this.data.isLoading) return;
    
    const userMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: message.trim(),
      timestamp: Date.now()
    };
    
    this.setData({
      messages: [...this.data.messages, userMessage],
      inputValue: '',
      isLoading: true
    });
    
    setTimeout(() => this.scrollToBottom(), 100);
    this.callAPI(message.trim(), this.data.currentMode);
  },

  onInputChange(e) {
    this.setData({ inputValue: e.detail.value });
  },

  onQuickAction(e) {
    const { mode, question } = e.currentTarget.dataset;
    this.setData({
      currentMode: mode,
      inputValue: question
    });
    
    const userMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: question,
      timestamp: Date.now()
    };
    
    this.setData({
      messages: [...this.data.messages, userMessage],
      inputValue: '',
      isLoading: true
    });
    
    setTimeout(() => this.scrollToBottom(), 100);
    this.callAPI(question, mode);
  },

  callAPI(message, mode) {
    const sessionId = app.globalData.sessionId;
    const recentHistory = this.getRecentHistory();
    
    const loadingMessage = {
      id: `ai_loading_${Date.now()}`,
      role: 'assistant',
      content: '',
      isLoading: true,
      timestamp: Date.now()
    };
    
    this.setData({
      messages: [...this.data.messages, loadingMessage]
    });
    
    setTimeout(() => this.scrollToBottom(), 100);
    
    api.chat(message, sessionId, mode, recentHistory)
      .then(res => {
        this.handleAPIResponse(res, loadingMessage.id);
      })
      .catch(err => {
        this.handleAPIError(err, loadingMessage.id);
      });
  },

  handleAPIResponse(res, loadingId) {
    const content = res.response || res.content || res.message || '抱歉，暂时无法回答您的问题。';
    const source = res.source || 'public';
    
    const messages = this.data.messages.map(msg => {
      if (msg.id === loadingId) {
        return {
          ...msg,
          id: `ai_${Date.now()}`,
          content: content,
          source: source,
          isLoading: false,
          timestamp: Date.now()
        };
      }
      return msg;
    });
    
    this.setData({ messages, isLoading: false });
    this.saveToHistory();
    setTimeout(() => this.scrollToBottom(), 100);
  },

  handleAPIError(err, loadingId) {
    console.error('API Error:', err);
    const errorContent = err.message || '网络连接失败，请检查网络后重试。';
    
    const messages = this.data.messages.map(msg => {
      if (msg.id === loadingId) {
        return {
          ...msg,
          id: `ai_error_${Date.now()}`,
          content: `⚠️ ${errorContent}\n\n您可以重试或换个问题。`,
          source: 'public',
          isLoading: false,
          isError: true,
          timestamp: Date.now()
        };
      }
      return msg;
    });
    
    this.setData({ messages, isLoading: false });
    setTimeout(() => this.scrollToBottom(), 100);
  },

  getRecentHistory() {
    return this.data.messages
      .filter(msg => !msg.isLoading && !msg.isError)
      .slice(-20)
      .map(msg => ({
        role: msg.role,
        content: msg.content
      }));
  },

  saveToHistory() {
    const sessionId = app.globalData.sessionId;
    const messages = this.data.messages.filter(msg => !msg.isLoading);
    storage.saveChatHistory(sessionId, messages);
  },

  scrollToBottom() {
    const query = wx.createSelectorQuery();
    query.select('#message-list').boundingClientRect();
    query.selectViewport().scrollOffset();
    query.exec(res => {
      if (res[0]) {
        wx.pageScrollTo({
          scrollTop: res[0].height + 1000,
          duration: 200
        });
      }
    });
  },

  onResend(e) {
    const { index } = e.currentTarget.dataset;
    const message = this.data.messages[index];
    
    if (message.role === 'user') {
      const newMessages = this.data.messages.slice(0, index);
      this.setData({ messages: newMessages });
      this.callAPI(message.content, this.data.currentMode);
    }
  },

  onCopy(e) {
    const { content } = e.currentTarget.dataset;
    wx.setClipboardData({
      data: content,
      success: () => {
        wx.showToast({ title: '已复制', icon: 'success' });
      }
    });
  },

  onClearChat() {
    wx.showModal({
      title: '确认清空',
      content: '确定要清空当前聊天记录吗？',
      success: res => {
        if (res.confirm) {
          const sessionId = app.globalData.sessionId;
          storage.deleteSession(sessionId);
          
          const newSessionId = app.generateSessionId();
          app.globalData.sessionId = newSessionId;
          storage.setSessionId(newSessionId);
          
          this.setData({
            messages: [],
            welcomeSent: false
          });
          
          this.showWelcome();
        }
      }
    });
  },

  onGoHistory() {
    wx.navigateTo({
      url: '/pages/history/history'
    });
  },

  onUnload() {
    this.saveToHistory();
  }
});
