/**
 * 主用户界面模块 - 重构版本
 * 使用模块化组件，职责分离，代码更清晰
 */

class EncryptDecryptUI {
  constructor() {
    // 初始化各个功能模块
    this.passwordManager = new PasswordStrengthManager();
    this.encryptOps = new EncryptOperations();
    this.decryptOps = new DecryptOperations();
    this.messageManager = new MessageManager();
    this.fileHandler = new FileHandler();
    
    this.init();
  }

  /**
   * 初始化界面
   */
  init() {
    this.bindEvents();
    this.passwordManager.init();
    this.showSecurityTips();
  }

  /**
   * 绑定事件
   */
  bindEvents() {
    // 加密相关事件
    this.bindEncryptEvents();
    
    // 解密相关事件
    this.bindDecryptEvents();
    
    // 通用事件
    this.bindCommonEvents();
  }

  /**
   * 绑定加密相关事件
   */
  bindEncryptEvents() {
    // 加密按钮
    const encryptBtn = document.getElementById('encryptBtn');
    if (encryptBtn) {
      encryptBtn.addEventListener('click', () => this.handleEncrypt());
    }

    // 生成强密码按钮
    const generatePasswordBtn = document.getElementById('generatePasswordBtn');
    if (generatePasswordBtn) {
      generatePasswordBtn.addEventListener('click', () => this.encryptOps.generateStrongPassword());
    }

    // 复制加密结果按钮
    const copyEncryptedBtn = document.getElementById('copyEncryptedBtn');
    if (copyEncryptedBtn) {
      copyEncryptedBtn.addEventListener('click', () => this.encryptOps.copyEncryptedResult());
    }

    // 下载加密结果按钮
    const downloadEncryptedBtn = document.getElementById('downloadEncryptedBtn');
    if (downloadEncryptedBtn) {
      downloadEncryptedBtn.addEventListener('click', () => this.encryptOps.downloadEncryptedResult());
    }

    // 文件上传
    const fileInput = document.getElementById('mnemonicFile');
    if (fileInput) {
      fileInput.addEventListener('change', (e) => this.encryptOps.handleFileUpload(e));
    }
  }

  /**
   * 绑定解密相关事件
   */
  bindDecryptEvents() {
    // 解密按钮
    const decryptBtn = document.getElementById('decryptBtn');
    if (decryptBtn) {
      decryptBtn.addEventListener('click', () => this.handleDecrypt());
    }

    // 清除解密结果按钮（如果有的话）
    const clearDecryptBtn = document.getElementById('clearDecryptBtn');
    if (clearDecryptBtn) {
      clearDecryptBtn.addEventListener('click', () => this.decryptOps.clearDecryptResult());
    }

    // 解密文件上传
    const encryptedFileInput = document.getElementById('encryptedFile');
    if (encryptedFileInput) {
      encryptedFileInput.addEventListener('change', async (e) => {
        try {
          const content = await this.fileHandler.handleMnemonicFileUpload(e, 'encryptedInput');
          this.messageManager.showSuccess('加密文件读取成功');
        } catch (err) {
          this.messageManager.showError(err.message);
        }
      });
    }
  }

  /**
   * 绑定通用事件
   */
  bindCommonEvents() {
    // 密码可见性切换
    const togglePasswordBtns = document.querySelectorAll('.toggle-password');
    togglePasswordBtns.forEach(btn => {
      btn.addEventListener('click', (e) => this.togglePasswordVisibility(e));
    });

    // 设置文件拖拽上传
    this.fileHandler.setupDragAndDrop('encryptSection', 'mnemonicInput');
  }

  /**
   * 处理加密操作
   */
  async handleEncrypt() {
    try {
      const mnemonic = document.getElementById('mnemonicInput')?.value?.trim();
      const password = document.getElementById('encryptPassword')?.value;

      // 执行加密
      const encrypted = await this.encryptOps.executeEncrypt(mnemonic, password);
      
      // 处理加密结果
      this.encryptOps.handleEncryptResult(encrypted);

    } catch (error) {
      this.messageManager.showError(`加密失败: ${error.message}`);
    }
  }

  /**
   * 处理解密操作
   */
  async handleDecrypt() {
    try {
      const encryptedData = document.getElementById('encryptedInput')?.value?.trim();
      const password = document.getElementById('decryptPassword')?.value;

      // 执行解密
      const decrypted = await this.decryptOps.executeDecrypt(encryptedData, password);
      
      // 处理解密结果
      this.decryptOps.handleDecryptResult(decrypted);

    } catch (error) {
      this.messageManager.showError(`解密失败: ${error.message}`);
    }
  }

  /**
   * 切换密码可见性
   * @param {Event} event 点击事件
   */
  togglePasswordVisibility(event) {
    event.preventDefault();
    event.stopPropagation();

    // 按钮本身
    const button = event.currentTarget;

    // 更稳健地获取容器与输入框
    const container = button.closest('.password-container') || button.parentNode;
    const input = container ? container.querySelector('input[type="password"], input[type="text"]') : null;
    const icon = button.querySelector('i');

    if (!input) {
      // 若未找到输入框，直接返回
      return;
    }

    const isHidden = input.type === 'password';

    try {
      input.type = isHidden ? 'text' : 'password';
    } catch (e) {
      // 某些环境下直接赋值可能失败，使用 setAttribute 兜底
      input.setAttribute('type', isHidden ? 'text' : 'password');
    }

    if (icon) {
      icon.className = isHidden ? 'fas fa-eye-slash' : 'fas fa-eye';
    }

    button.title = isHidden ? '隐藏密码' : '显示密码';
    button.setAttribute('aria-pressed', String(isHidden));
  }

  /**
   * 显示安全提示
   */
  showSecurityTips() {
    const tipsContainer = document.getElementById('securityTips');
    if (!tipsContainer) return;

    const tips = [
      '✅ 保存加密文本：复制到备忘录/密码管理器，勿发邮件/云盘',
      '✅ 密码强度：混合大小写、数字、符号（如 F8@zq#2L9!uV$）',
      '⛔ 网络环境：仅在可信设备/网络中使用，避免公共WiFi',
      '⛔ 设备安全：确保无恶意插件或屏幕监控软件',
      '⚠️ 重要提醒：加密密码是唯一恢复凭证，丢失后无法解密！'
    ];

    tips.forEach(tip => {
      const tipElement = document.createElement('div');
      tipElement.className = 'security-tip';
      tipElement.textContent = tip;
      tipsContainer.appendChild(tipElement);
    });
  }

  /**
   * 获取模块实例（用于外部访问）
   */
  getModules() {
    return {
      passwordManager: this.passwordManager,
      encryptOps: this.encryptOps,
      decryptOps: this.decryptOps,
      messageManager: this.messageManager,
      fileHandler: this.fileHandler
    };
  }

  /**
   * 销毁实例，清理资源
   */
  destroy() {
    // 清理定时器
    if (this.decryptOps.autoHideTimer) {
      clearTimeout(this.decryptOps.autoHideTimer);
    }
    
    // 清除所有消息
    this.messageManager.clearAllMessages();
    
    // 清除解密结果
    this.decryptOps.clearDecryptResult();
  }
}

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
  module.exports = EncryptDecryptUI;
} else {
  window.EncryptDecryptUI = EncryptDecryptUI;
}
