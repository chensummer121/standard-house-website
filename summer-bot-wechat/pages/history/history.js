// pages/history/history.js
// Summer Bot 历史记录页面

const storage = require('../../utils/storage');

Page({
  data: {
    sessions: [],
    groupedSessions: [],
    isLoading: true,
    isEmpty: true
  },

  onLoad(options) {
    this.loadSessions();
  },

  onShow() {
    this.loadSessions();
  },

  onPullDownRefresh() {
    this.loadSessions();
    wx.stopPullDownRefresh();
  },

  loadSessions() {
    this.setData({ isLoading: true });
    
    try {
      const sessions = storage.getSessionList();
      
      if (sessions.length === 0) {
        this.setData({
          sessions: [],
          groupedSessions: [],
          isEmpty: true,
          isLoading: false
        });
        return;
      }
      
      const grouped = this.groupByDate(sessions);
      
      this.setData({
        sessions,
        groupedSessions: grouped,
        isEmpty: false,
        isLoading: false
      });
    } catch (err) {
      console.error('Load sessions error:', err);
      this.setData({
        sessions: [],
        groupedSessions: [],
        isEmpty: true,
        isLoading: false
      });
    }
  },

  groupByDate(sessions) {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const yesterday = today - 86400000;
    const lastWeek = today - 7 * 86400000;
    
    const groups = {
      today: { title: '今天', sessions: [] },
      yesterday: { title: '昨天', sessions: [] },
      week: { title: '本周', sessions: [] },
      older: { title: '更早', sessions: [] }
    };
    
    sessions.forEach(session => {
      const sessionDate = session.updatedAt;
      
      if (sessionDate >= today) {
        groups.today.sessions.push(session);
      } else if (sessionDate >= yesterday) {
        groups.yesterday.sessions.push(session);
      } else if (sessionDate >= lastWeek) {
        groups.week.sessions.push(session);
      } else {
        groups.older.sessions.push(session);
      }
    });
    
    return Object.values(groups).filter(g => g.sessions.length > 0);
  },

  onSessionTap(e) {
    const { sessionid } = e.currentTarget.dataset;
    
    const app = getApp();
    app.globalData.sessionId = sessionid;
    storage.setSessionId(sessionid);
    
    wx.navigateBack();
  },

  onSessionDelete(e) {
    const { sessionid } = e.currentTarget.dataset;
    
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这条聊天记录吗？',
      success: res => {
        if (res.confirm) {
          storage.deleteSession(sessionid);
          this.loadSessions();
          wx.showToast({
            title: '已删除',
            icon: 'success',
            duration: 1500
          });
        }
      }
    });
  },

  onClearAll() {
    wx.showModal({
      title: '确认清空',
      content: '确定要清空所有聊天记录吗？此操作不可恢复。',
      success: res => {
        if (res.confirm) {
          storage.clearAllHistory();
          this.loadSessions();
          wx.showToast({
            title: '已清空',
            icon: 'success',
            duration: 1500
          });
        }
      }
    });
  },

  formatTime(timestamp) {
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  },

  formatDate(timestamp) {
    const date = new Date(timestamp);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${month}月${day}日`;
  }
});
