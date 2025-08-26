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
    this.updateStrengthText(strengthIndicator, password, strength.score);
    this.updateWeakWarning(strengthIndicator, password);
  }

  /**
   * 更新强度条
   */
  updateStrengthBar(indicator, score) {
    const strengthBar = indicator.querySelector('.strength-bar');
    if (strengthBar) {
      strengthBar.style.width = `${score * 100}%`;
      strengthBar.className = `strength-bar ${this.getStrengthClass(score)}`;
    }
  }

  /**
   * 更新强度文本（i18n）
   */
  updateStrengthText(indicator, password, score) {
    const strengthText = indicator.querySelector('.strength-text');
    if (!strengthText) return;

    const min = 12;
    let text;
    if (!password || password.length < min) {
      text = i18n.t('password_too_short').replace('{min}', String(min));
    } else {
      if (score <= 0.25) text = i18n.t('password_very_weak');
      else if (score <= 0.5) text = i18n.t('password_weak');
      else if (score <= 0.75) text = i18n.t('password_medium');
      else text = i18n.t('password_strong');
    }

    strengthText.textContent = text;
    strengthText.className = `strength-text ${this.getStrengthClass(score)}`;
  }

  /**
   * 更新弱密码警告
   */
  updateWeakWarning(indicator, password) {
    const weakWarning = indicator.querySelector('.weak-warning');
    if (weakWarning) {
      if (this.securityUtils.isWeakPassword(password)) {
        weakWarning.style.display = 'block';
        weakWarning.textContent = i18n.t('password_weak');
      } else {
        weakWarning.style.display = 'none';
      }
    }
  }

  /**
   * 获取强度样式类
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
