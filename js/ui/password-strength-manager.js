/**
 * 密码强度管理模块
 */

class PasswordStrengthManager {
  constructor() {
    this.encryptor = new MnemonicEncryptor();
    this.securityUtils = new SecurityUtils();
  }

  /**
   * 初始化密码强度指示器
   */
  init() {
    const passwordInputs = document.querySelectorAll('input[type="password"]');
    passwordInputs.forEach(input => {
      input.addEventListener('input', (e) => this.updatePasswordStrength(e.target));
    });
  }

  /**
   * 更新密码强度显示
   * @param {HTMLInputElement} input 密码输入框
   */
  updatePasswordStrength(input) {
    const strengthIndicator = input.parentNode.querySelector('.password-strength');
    if (!strengthIndicator) return;

    const password = input.value;
    const strength = this.encryptor.validatePasswordStrength(password);
    
    this.updateStrengthBar(strengthIndicator, strength.score);
    this.updateStrengthText(strengthIndicator, strength.feedback, strength.score);
    this.updateWeakWarning(strengthIndicator, password);
  }

  /**
   * 更新强度条
   * @param {HTMLElement} indicator 强度指示器容器
   * @param {number} score 强度分数
   */
  updateStrengthBar(indicator, score) {
    const strengthBar = indicator.querySelector('.strength-bar');
    if (strengthBar) {
      strengthBar.style.width = `${score * 100}%`;
      strengthBar.className = `strength-bar ${this.getStrengthClass(score)}`;
    }
  }

  /**
   * 更新强度文本
   * @param {HTMLElement} indicator 强度指示器容器
   * @param {string} feedback 反馈信息
   * @param {number} score 强度分数
   */
  updateStrengthText(indicator, feedback, score) {
    const strengthText = indicator.querySelector('.strength-text');
    if (strengthText) {
      strengthText.textContent = feedback;
      strengthText.className = `strength-text ${this.getStrengthClass(score)}`;
    }
  }

  /**
   * 更新弱密码警告
   * @param {HTMLElement} indicator 强度指示器容器
   * @param {string} password 密码
   */
  updateWeakWarning(indicator, password) {
    const weakWarning = indicator.querySelector('.weak-warning');
    if (weakWarning) {
      if (this.securityUtils.isWeakPassword(password)) {
        weakWarning.style.display = 'block';
        weakWarning.textContent = '⚠️ 检测到常见弱密码模式';
      } else {
        weakWarning.style.display = 'none';
      }
    }
  }

  /**
   * 获取强度样式类
   * @param {number} score 强度分数
   * @returns {string} CSS 类名
   */
  getStrengthClass(score) {
    if (score <= 0.25) return 'very-weak';
    if (score <= 0.5) return 'weak';
    if (score <= 0.75) return 'medium';
    return 'strong';
  }

  /**
   * 生成强密码
   * @param {string} inputId 密码输入框ID
   */
  generateStrongPassword(inputId) {
    const password = this.securityUtils.generateStrongPassword();
    const passwordInput = document.getElementById(inputId);
    
    if (passwordInput) {
      passwordInput.value = password;
      passwordInput.type = 'text';
      
      // 3秒后自动隐藏
      setTimeout(() => {
        passwordInput.type = 'password';
      }, 3000);
      
      this.updatePasswordStrength(passwordInput);
      return password;
    }
    
    return null;
  }
}

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PasswordStrengthManager;
} else {
  window.PasswordStrengthManager = PasswordStrengthManager;
}
