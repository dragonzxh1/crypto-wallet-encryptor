/**
 * 消息管理模块
 */

class MessageManager {
  constructor() {
    this.messageContainer = null;
    this.loadingIndicator = null;
    this.init();
  }

  /**
   * 初始化消息管理器
   */
  init() {
    this.messageContainer = document.getElementById('messageContainer');
    this.loadingIndicator = document.getElementById('loadingIndicator');
  }

  /**
   * 显示消息提示
   * @param {string} message 消息内容
   * @param {string} type 消息类型 (success, error, info, warning)
   * @param {number} duration 显示时长（毫秒）
   */
  showMessage(message, type = 'info', duration = 3000) {
    if (!this.messageContainer) return;

    const messageElement = document.createElement('div');
    messageElement.className = `message message-${type}`;
    messageElement.textContent = message;
    
    // 添加关闭按钮
    const closeBtn = document.createElement('span');
    closeBtn.className = 'message-close';
    closeBtn.innerHTML = '&times;';
    closeBtn.addEventListener('click', () => {
      this.removeMessage(messageElement);
    });
    messageElement.appendChild(closeBtn);
    
    this.messageContainer.appendChild(messageElement);
    
    // 自动移除
    setTimeout(() => {
      this.removeMessage(messageElement);
    }, duration);

    return messageElement;
  }

  /**
   * 移除消息
   * @param {HTMLElement} messageElement 消息元素
   */
  removeMessage(messageElement) {
    if (messageElement && messageElement.parentNode) {
      messageElement.parentNode.removeChild(messageElement);
    }
  }

  /**
   * 显示成功消息
   * @param {string} message 消息内容
   * @param {number} duration 显示时长
   */
  showSuccess(message, duration = 3000) {
    return this.showMessage(message, 'success', duration);
  }

  /**
   * 显示错误消息
   * @param {string} message 消息内容
   * @param {number} duration 显示时长
   */
  showError(message, duration = 5000) {
    return this.showMessage(message, 'error', duration);
  }

  /**
   * 显示信息消息
   * @param {string} message 消息内容
   * @param {number} duration 显示时长
   */
  showInfo(message, duration = 3000) {
    return this.showMessage(message, 'info', duration);
  }

  /**
   * 显示警告消息
   * @param {string} message 消息内容
   * @param {number} duration 显示时长
   */
  showWarning(message, duration = 4000) {
    return this.showMessage(message, 'warning', duration);
  }

  /**
   * 显示加载状态
   * @param {string} message 加载消息
   */
  showLoading(message = '正在处理...') {
    if (!this.loadingIndicator) return;

    this.loadingIndicator.textContent = message;
    this.loadingIndicator.style.display = 'block';
  }

  /**
   * 隐藏加载状态
   */
  hideLoading() {
    if (!this.loadingIndicator) return;

    this.loadingIndicator.style.display = 'none';
  }

  /**
   * 显示确认对话框
   * @param {string} message 确认消息
   * @param {string} title 对话框标题
   * @returns {Promise<boolean>} 用户选择结果
   */
  async showConfirm(message, title = '确认') {
    return new Promise((resolve) => {
      const result = window.confirm(`${title}\n\n${message}`);
      resolve(result);
    });
  }

  /**
   * 显示输入对话框
   * @param {string} message 提示消息
   * @param {string} defaultValue 默认值
   * @returns {Promise<string|null>} 用户输入或null
   */
  async showPrompt(message, defaultValue = '') {
    return new Promise((resolve) => {
      const result = window.prompt(message, defaultValue);
      resolve(result);
    });
  }

  /**
   * 清除所有消息
   */
  clearAllMessages() {
    if (!this.messageContainer) return;

    while (this.messageContainer.firstChild) {
      this.messageContainer.removeChild(this.messageContainer.firstChild);
    }
  }

  /**
   * 获取消息数量
   * @returns {number} 当前消息数量
   */
  getMessageCount() {
    if (!this.messageContainer) return 0;
    return this.messageContainer.children.length;
  }
}

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MessageManager;
} else {
  window.MessageManager = MessageManager;
}
