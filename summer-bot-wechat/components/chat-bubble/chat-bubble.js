// components/chat-bubble/chat-bubble.js
// Summer Bot 聊天气泡组件

Component({
  properties: {
    message: {
      type: Object,
      value: {}
    },
    index: {
      type: Number,
      value: 0
    }
  },

  data: {
    parsedContent: ''
  },

  lifetimes: {
    attached() {
      this.parseContent();
    }
  },

  observers: {
    'message.content': function() {
      this.parseContent();
    }
  },

  methods: {
    parseContent() {
      const { content, isLoading } = this.properties.message;
      
      if (isLoading) {
        this.setData({ parsedContent: '' });
        return;
      }
      
      let parsed = content || '';
      parsed = parsed.replace(/\n/g, '<br/>');
      parsed = parsed.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
      parsed = parsed.replace(/^[-•]\s(.+)$/gm, '<view class="list-item">• $1</view>');
      parsed = parsed.replace(/^(\d+)\.\s(.+)$/gm, '<view class="list-item">$1. $2</view>');
      
      this.setData({ parsedContent: parsed });
    },

    getSourceTag(source) {
      const tags = {
        'public': { text: '公开', class: 'tag-public' },
        'internal': { text: '内部', class: 'tag-internal' },
        'confidential': { text: '机密', class: 'tag-confidential' }
      };
      return tags[source] || tags['public'];
    },

    getBubbleClass() {
      const { role, isError } = this.properties.message;
      let cls = role === 'user' ? 'bubble-user' : 'bubble-ai';
      if (isError) cls += ' bubble-error';
      return cls;
    },

    onResend() {
      this.triggerEvent('resend', {
        index: this.properties.index
      });
    },

    onCopy() {
      const { content } = this.properties.message;
      wx.setClipboardData({
        data: content,
        success: () => {
          wx.showToast({ title: '已复制', icon: 'success' });
        }
      });
    }
  }
});
