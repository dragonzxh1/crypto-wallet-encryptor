/**
 * 主入口文件
 * 统一管理应用的启动和初始化
 */

class CryptoWalletApp {
  constructor() {
    this.ui = null;
    this.modules = null;
    this.isInitialized = false;
  }

  /**
   * 初始化应用
   */
  async init() {
    try {
      console.log('正在初始化加密货币钱包加解密应用...');
      
      // 检查浏览器兼容性
      this.checkBrowserCompatibility();
      
      // 等待DOM加载完成
      if (document.readyState === 'loading') {
        await new Promise(resolve => {
          document.addEventListener('DOMContentLoaded', resolve);
        });
      }
      
      // 加载主界面模块
      this.ui = await moduleLoader.loadModule('EncryptDecryptUI');
      
      // 获取所有模块实例
      this.modules = this.ui.getModules();
      
      this.isInitialized = true;
      console.log('应用初始化完成');
      
      // 显示欢迎消息
      this.showWelcomeMessage();
      
    } catch (error) {
      console.error('应用初始化失败:', error);
      this.showError('应用初始化失败，请刷新页面重试');
    }
  }

  /**
   * 检查浏览器兼容性
   */
  checkBrowserCompatibility() {
    // 检查 Web Crypto API
    if (!window.crypto || !window.crypto.subtle) {
      throw new Error('您的浏览器不支持 Web Crypto API，请使用现代浏览器');
    }

    // 移除错误的算法属性访问检查（不同浏览器实现不暴露算法属性）
    // 仅保留基础能力检查，具体算法在调用时由浏览器抛错

    // 检查其他必要功能
    if (!window.TextEncoder || !window.TextDecoder) {
      throw new Error('您的浏览器不支持 TextEncoder/TextDecoder');
    }

    if (!window.btoa || !window.atob) {
      throw new Error('您的浏览器不支持 Base64 编码/解码');
    }
  }

  /**
   * 显示欢迎消息
   */
  showWelcomeMessage() {
    if (this.modules && this.modules.messageManager) {
      this.modules.messageManager.showSuccess(
        '欢迎使用加密货币钱包助记词加解密工具！',
        5000
      );
    }
  }

  /**
   * 显示错误消息
   * @param {string} message 错误消息
   */
  showError(message) {
    // 创建错误显示元素
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: #e74c3c;
      color: white;
      padding: 20px;
      border-radius: 10px;
      text-align: center;
      z-index: 10000;
      font-family: Arial, sans-serif;
      box-shadow: 0 5px 15px rgba(0,0,0,0.3);
    `;
    
    errorDiv.innerHTML = `
      <h3>❌ 初始化失败</h3>
      <p>${message}</p>
      <button onclick="location.reload()" style="
        background: white;
        color: #e74c3c;
        border: none;
        padding: 10px 20px;
        border-radius: 5px;
        cursor: pointer;
        margin-top: 15px;
      ">刷新页面</button>
    `;
    
    document.body.appendChild(errorDiv);
  }

  /**
   * 获取应用状态
   * @returns {Object} 应用状态信息
   */
  getStatus() {
    return {
      isInitialized: this.isInitialized,
      loadedModules: moduleLoader.getLoadedModules(),
      dependencyGraph: moduleLoader.getDependencyGraph(),
      ui: this.ui ? '已加载' : '未加载'
    };
  }

  /**
   * 重新初始化应用
   */
  async reinit() {
    try {
      // 清理现有实例
      if (this.ui) {
        this.ui.destroy();
      }
      
      // 卸载所有模块
      moduleLoader.unloadAllModules();
      
      // 重新初始化
      await this.init();
      
      return true;
    } catch (error) {
      console.error('重新初始化失败:', error);
      return false;
    }
  }

  /**
   * 销毁应用
   */
  destroy() {
    if (this.ui) {
      this.ui.destroy();
    }
    
    moduleLoader.unloadAllModules();
    this.isInitialized = false;
    this.ui = null;
    this.modules = null;
    
    console.log('应用已销毁');
  }
}

// 创建全局应用实例
const cryptoWalletApp = new CryptoWalletApp();

// 页面加载完成后自动初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    cryptoWalletApp.init();
  });
} else {
  // DOM已经加载完成，直接初始化
  cryptoWalletApp.init();
}

// 导出应用实例
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CryptoWalletApp, cryptoWalletApp };
} else {
  window.CryptoWalletApp = CryptoWalletApp;
  window.cryptoWalletApp = cryptoWalletApp;
}

// 开发模式下的调试信息
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
  console.log('开发模式：应用实例已挂载到 window.cryptoWalletApp');
  console.log('可用命令：');
  console.log('- cryptoWalletApp.getStatus() - 获取应用状态');
  console.log('- cryptoWalletApp.reinit() - 重新初始化应用');
  console.log('- cryptoWalletApp.destroy() - 销毁应用');
}
