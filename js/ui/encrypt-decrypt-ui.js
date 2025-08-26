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

      const encrypted = await this.encryptOps.executeEncrypt(mnemonic, password);
      this.encryptOps.handleEncryptResult(encrypted);

    } catch (error) {
      this.messageManager.showError(`${i18n.t('msg_encrypting')} ${error.message}`);
    }
  }

  /**
   * 处理解密操作
   */
  async handleDecrypt() {
    try {
      const encryptedData = document.getElementById('encryptedInput')?.value?.trim();
      const password = document.getElementById('decryptPassword')?.value;

      const decrypted = await this.decryptOps.executeDecrypt(encryptedData, password);
      this.decryptOps.handleDecryptResult(decrypted);

    } catch (error) {
      this.messageManager.showError(`${i18n.t('msg_decrypting')} ${error.message}`);
    }
  }

  /**
   * 切换密码可见性
   * @param {Event} event 点击事件
   */
  togglePasswordVisibility(event) {
    event.preventDefault();
    event.stopPropagation();

    const button = event.currentTarget;

    const container = button.closest('.password-container') || button.parentNode;
    const input = container ? container.querySelector('input[type="password"], input[type="text"]') : null;
    const icon = button.querySelector('i');

    if (!input) {
      return;
    }

    const isHidden = input.type === 'password';

    try {
      input.type = isHidden ? 'text' : 'password';
    } catch (e) {
      input.setAttribute('type', isHidden ? 'text' : 'password');
    }

    if (icon) {
      icon.className = isHidden ? 'fas fa-eye-slash' : 'fas fa-eye';
    }

    const titleKey = isHidden ? 'hide_password' : 'show_password';
    button.title = i18n.t(titleKey);
    button.setAttribute('aria-pressed', String(isHidden));
  }

  /**
   * 显示安全提示
   */
  showSecurityTips() {
    const tipsContainer = document.getElementById('securityTips');
    if (!tipsContainer) return;

    tipsContainer.innerHTML = '';
    const tips = [
      i18n.t('tip_save_cipher'),
      i18n.t('tip_password_strength'),
      i18n.t('tip_network'),
      i18n.t('tip_device'),
      i18n.t('tip_password_warning')
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
