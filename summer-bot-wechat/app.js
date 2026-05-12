// Summer Bot 微信小程序入口
const api = require('./utils/api');
const storage = require('./utils/storage');

App({
  globalData: {
    userInfo: null,
    sessionId: '',
    isLogin: false
  },

  onLaunch(options) {
    console.log('Summer Bot 小程序启动', options);
    this.initSession();
    this.checkLoginStatus();
  },

  // 初始化会话ID
  initSession() {
    let sessionId = storage.getSessionId();
    if (!sessionId) {
      sessionId = this.generateSessionId();
      storage.setSessionId(sessionId);
    }
    this.globalData.sessionId = sessionId;
    console.log('Session ID:', sessionId);
  },

  // 生成唯一sessionId
  generateSessionId() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 10);
    return `sb_${timestamp}_${random}`;
  },

  // 检查登录态
  checkLoginStatus() {
    const token = storage.getToken();
    if (token) {
      this.globalData.isLogin = true;
      this.globalData.userInfo = storage.getUserInfo();
    } else {
      this.silentLogin();
    }
  },

  // 静默登录（调用后端验证）
  silentLogin() {
    return new Promise((resolve) => {
      api.health().then(res => {
        console.log('API Health:', res);
        resolve(res);
      }).catch(err => {
        console.error('Health check failed:', err);
        resolve({ status: 'ok', anonymous: true });
      });
    });
  },

  // 设置用户信息
  setUserInfo(userInfo) {
    this.globalData.userInfo = userInfo;
    this.globalData.isLogin = true;
    storage.setUserInfo(userInfo);
  },

  // 退出登录
  logout() {
    this.globalData.userInfo = null;
    this.globalData.isLogin = false;
    storage.clearUserInfo();
  },

  // 显示加载提示
  showLoading(title = '加载中...') {
    wx.showLoading({ title, mask: true });
  },

  // 隐藏加载提示
  hideLoading() {
    wx.hideLoading();
  },

  // 显示错误提示
  showError(msg) {
    wx.showToast({ title: msg || '请求失败', icon: 'none', duration: 2000 });
  }
});
