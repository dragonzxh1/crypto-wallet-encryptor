/**
 * 解密操作模块
 */

class DecryptOperations {
  constructor() {
    this.encryptor = new MnemonicEncryptor();
    this.messageManager = new MessageManager();
    this.autoHideTimer = null;
  }

  /**
   * 执行解密操作
   * @param {string} encryptedData 加密数据
   * @param {string} password 密码
   * @returns {Promise<string>} 解密结果
   */
  async executeDecrypt(encryptedData, password) {
    try {
      // 验证输入
      this.validateDecryptInput(encryptedData, password);
      
      // 显示加载状态
      this.messageManager.showLoading('正在解密...');

      // 执行解密
      const decrypted = await this.encryptor.decryptMnemonic(encryptedData, password);
      
      // 隐藏加载状态
      this.messageManager.hideLoading();
      
      return decrypted;
    } catch (error) {
      this.messageManager.hideLoading();
      throw error;
    }
  }

  /**
   * 验证解密输入
   * @param {string} encryptedData 加密数据
   * @param {string} password 密码
   */
  validateDecryptInput(encryptedData, password) {
    if (!encryptedData || !encryptedData.trim()) {
      throw new Error('请输入加密文本');
    }

    if (!password || !password.trim()) {
      throw new Error('请输入解密密码');
    }

    // 验证加密数据格式
    try {
      const parsed = JSON.parse(encryptedData);
      if (!parsed.version || !parsed.algorithm || !parsed.ciphertext) {
        throw new Error('加密数据格式无效');
      }
    } catch (error) {
      throw new Error('加密数据格式错误，请检查输入');
    }
  }

  /**
   * 处理解密结果
   * @param {string} decrypted 解密结果
   */
  handleDecryptResult(decrypted) {
    // 显示结果
    const resultElement = document.getElementById('decryptedMnemonic');
    if (resultElement) {
      resultElement.textContent = decrypted;
      resultElement.style.filter = 'none';
      resultElement.style.display = 'block';
    }

    const resultSection = document.getElementById('decryptResultSection');
    if (resultSection) {
      resultSection.style.display = 'block';
    }

    // 显示成功消息
    this.messageManager.showSuccess('解密成功！');

    // 设置自动隐藏
    this.setupAutoHide(resultElement);
  }

  /**
   * 设置自动隐藏助记词
   * @param {HTMLElement} element 助记词显示元素
   */
  setupAutoHide(element) {
    if (!element) return;

    // 清除之前的定时器
    if (this.autoHideTimer) {
      clearTimeout(this.autoHideTimer);
    }

    // 10秒后自动模糊
    this.autoHideTimer = setTimeout(() => {
      element.style.filter = 'blur(5px)';
      element.title = '点击显示助记词';
      
      // 设置点击显示/隐藏功能
      this.setupClickToggle(element);
    }, 10000);
  }

  /**
   * 设置点击切换显示/隐藏
   * @param {HTMLElement} element 助记词显示元素
   */
  setupClickToggle(element) {
    // 移除之前的事件监听器
    element.removeEventListener('click', this.toggleVisibility);
    
    // 添加新的事件监听器
    element.addEventListener('click', this.toggleVisibility);
  }

  /**
   * 切换助记词可见性
   * @param {Event} event 点击事件
   */
  toggleVisibility(event) {
    const element = event.currentTarget;
    
    if (element.style.filter === 'blur(5px)') {
      element.style.filter = 'none';
      element.title = '点击隐藏助记词';
    } else {
      element.style.filter = 'blur(5px)';
      element.title = '点击显示助记词';
    }
  }

  /**
   * 手动隐藏助记词
   */
  hideMnemonic() {
    const resultElement = document.getElementById('decryptedMnemonic');
    if (resultElement) {
      resultElement.style.filter = 'blur(5px)';
      resultElement.title = '点击显示助记词';
    }
  }

  /**
   * 手动显示助记词
   */
  showMnemonic() {
    const resultElement = document.getElementById('decryptedMnemonic');
    if (resultElement) {
      resultElement.style.filter = 'none';
      resultElement.title = '点击隐藏助记词';
    }
  }

  /**
   * 清除解密结果
   */
  clearDecryptResult() {
    const resultElement = document.getElementById('decryptedMnemonic');
    if (resultElement) {
      resultElement.textContent = '';
      resultElement.style.filter = 'none';
    }

    const resultSection = document.getElementById('decryptResultSection');
    if (resultSection) {
      resultSection.style.display = 'none';
    }

    // 清除定时器
    if (this.autoHideTimer) {
      clearTimeout(this.autoHideTimer);
      this.autoHideTimer = null;
    }
  }

  /**
   * 验证加密数据完整性
   * @param {string} encryptedData 加密数据
   * @returns {boolean} 数据是否完整
   */
  validateDataIntegrity(encryptedData) {
    try {
      const parsed = JSON.parse(encryptedData);
      
      // 检查必需字段
      const requiredFields = ['version', 'algorithm', 'salt', 'iv', 'ciphertext'];
      for (const field of requiredFields) {
        if (!(field in parsed)) {
          return false;
        }
      }

      // 检查版本兼容性
      if (parsed.version !== '1.0') {
        return false;
      }

      // 检查算法兼容性
      if (parsed.algorithm !== 'AES-GCM-PBKDF2') {
        return false;
      }

      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * 获取加密数据信息
   * @param {string} encryptedData 加密数据
   * @returns {object|null} 数据信息
   */
  getDataInfo(encryptedData) {
    try {
      const parsed = JSON.parse(encryptedData);
      return {
        version: parsed.version,
        algorithm: parsed.algorithm,
        iterations: parsed.iterations,
        dataSize: parsed.ciphertext ? parsed.ciphertext.length : 0
      };
    } catch (error) {
      return null;
    }
  }
}

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DecryptOperations;
} else {
  window.DecryptOperations = DecryptOperations;
}
