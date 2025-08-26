/**
 * 加密操作模块
 */

class EncryptOperations {
  constructor() {
    this.encryptor = new MnemonicEncryptor();
    this.messageManager = new MessageManager();
    this.fileHandler = new FileHandler();
  }

  /**
   * 执行加密操作
   * @param {string} mnemonic 助记词
   * @param {string} password 密码
   * @returns {Promise<string>} 加密结果
   */
  async executeEncrypt(mnemonic, password) {
    try {
      // 验证输入
      this.validateEncryptInput(mnemonic, password);
      
      // 验证密码强度
      const strength = this.encryptor.validatePasswordStrength(password);
      if (!strength.isStrong) {
        const confirm = await this.messageManager.showConfirm(
          `密码强度不足：${strength.feedback}\n\n是否仍要继续加密？`,
          '密码强度警告'
        );
        if (!confirm) {
          throw new Error('用户取消加密操作');
        }
      }

      // 显示加载状态
      this.messageManager.showLoading('正在加密...');

      // 执行加密
      const encrypted = await this.encryptor.encryptMnemonic(mnemonic, password);
      
      // 隐藏加载状态
      this.messageManager.hideLoading();
      
      return encrypted;
    } catch (error) {
      this.messageManager.hideLoading();
      throw error;
    }
  }

  /**
   * 验证加密输入
   * @param {string} mnemonic 助记词
   * @param {string} password 密码
   */
  validateEncryptInput(mnemonic, password) {
    if (!mnemonic || !mnemonic.trim()) {
      throw new Error(i18n.t('msg_need_mnemonic'));
    }

    if (!password || !password.trim()) {
      throw new Error(i18n.t('msg_need_encrypt_password'));
    }

    // 验证助记词格式（基本验证）
    const words = mnemonic.trim().split(/\s+/);
    if (words.length < 12 || words.length > 24) {
      throw new Error(i18n.t('msg_mnemonic_length_invalid'));
    }
  }

  /**
   * 处理加密结果
   * @param {string} encrypted 加密结果
   */
  handleEncryptResult(encrypted) {
    // 显示结果
    const resultElement = document.getElementById('encryptedResult');
    if (resultElement) {
      resultElement.value = encrypted;
    }

    const resultSection = document.getElementById('encryptResultSection');
    if (resultSection) {
      resultSection.style.display = 'block';
    }

    // 显示成功消息
    this.messageManager.showSuccess(i18n.t('msg_encrypt_success'));

    // 自动滚动到结果区域
    if (resultSection) {
      resultSection.scrollIntoView({ behavior: 'smooth' });
    }
  }

  /**
   * 复制加密结果
   * @returns {Promise<boolean>} 是否复制成功
   */
  async copyEncryptedResult() {
    const encryptedText = document.getElementById('encryptedResult')?.value;
    if (!encryptedText) {
      this.messageManager.showError(i18n.t('msg_no_content_copy'));
      return false;
    }

    try {
      const success = await SecurityUtils.copyToClipboard(encryptedText);
      if (success) {
        this.messageManager.showSuccess(i18n.t('msg_copy_ok'));
        return true;
      } else {
        this.messageManager.showError(i18n.t('msg_copy_fail'));
        return false;
      }
    } catch (error) {
      this.messageManager.showError(`${i18n.t('msg_copy_fail')}: ${error.message}`);
      return false;
    }
  }

  /**
   * 下载加密结果
   */
  downloadEncryptedResult() {
    const encryptedText = document.getElementById('encryptedResult')?.value;
    if (!encryptedText) {
      this.messageManager.showError(i18n.t('msg_no_content_copy'));
      return;
    }

    try {
      this.fileHandler.downloadEncryptedResult(encryptedText);
      this.messageManager.showSuccess(i18n.t('msg_download_ok'));
    } catch (error) {
      this.messageManager.showError(`${i18n.t('msg_copy_fail')}: ${error.message}`);
    }
  }

  /**
   * 处理文件上传
   * @param {Event} event 文件上传事件
   */
  async handleFileUpload(event) {
    try {
      const content = await this.fileHandler.handleMnemonicFileUpload(event, 'mnemonicInput');
      this.messageManager.showSuccess('文件读取成功');
    } catch (error) {
      this.messageManager.showError(error.message);
    }
  }

  /**
   * 生成强密码
   */
  generateStrongPassword() {
    try {
      const password = SecurityUtils.generateStrongPassword();
      const passwordInput = document.getElementById('encryptPassword');
      
      if (passwordInput) {
        passwordInput.value = password;
        passwordInput.type = 'text';
        
        // 3秒后自动隐藏
        setTimeout(() => {
          passwordInput.type = 'password';
        }, 3000);
        
        this.messageManager.showInfo('已生成强密码，3秒后自动隐藏');
        
        // 触发密码强度更新
        const event = new Event('input');
        passwordInput.dispatchEvent(event);
      }
    } catch (error) {
      this.messageManager.showError(`生成密码失败: ${error.message}`);
    }
  }
}

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
  module.exports = EncryptOperations;
} else {
  window.EncryptOperations = EncryptOperations;
}
