/**
 * 安全工具函数模块
 */

class SecurityUtils {
  /**
   * 安全的字符串比较（防止时序攻击）
   * @param {string} a 字符串 a
   * @param {string} b 字符串 b
   * @returns {boolean} 是否相等
   */
  static secureCompare(a, b) {
    if (a.length !== b.length) {
      return false;
    }
    
    let result = 0;
    for (let i = 0; i < a.length; i++) {
      result |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }
    
    return result === 0;
  }

  /**
   * 生成强密码建议
   * @returns {string} 强密码示例
   */
  static generateStrongPassword() {
    const chars = {
      upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      lower: 'abcdefghijklmnopqrstuvwxyz',
      numbers: '0123456789',
      symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
    };

    let password = '';
    
    // 确保每种字符类型至少有一个
    password += chars.upper[Math.floor(Math.random() * chars.upper.length)];
    password += chars.lower[Math.floor(Math.random() * chars.lower.length)];
    password += chars.numbers[Math.floor(Math.random() * chars.numbers.length)];
    password += chars.symbols[Math.floor(Math.random() * chars.symbols.length)];
    
    // 填充剩余长度到16位
    const allChars = Object.values(chars).join('');
    for (let i = 4; i < 16; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }
    
    // 打乱字符顺序
    return password.split('').sort(() => Math.random() - 0.5).join('');
  }

  /**
   * 检查是否为弱密码
   * @param {string} password 密码
   * @returns {boolean} 是否为弱密码
   */
  static isWeakPassword(password) {
    const weakPasswords = [
      'password', '123456', '12345678', 'qwerty', 'abc123',
      'password123', 'admin', 'letmein', 'welcome', 'monkey'
    ];
    
    return weakPasswords.some(weak => 
      password.toLowerCase().includes(weak.toLowerCase())
    );
  }

  /**
   * 安全的文本复制到剪贴板
   * @param {string} text 要复制的文本
   * @returns {Promise<boolean>} 是否复制成功
   */
  static async copyToClipboard(text) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      } else {
        // 降级方案
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        return successful;
      }
    } catch (error) {
      console.error('复制失败:', error);
      return false;
    }
  }

  /**
   * 安全的文本下载
   * @param {string} content 文件内容
   * @param {string} filename 文件名
   */
  static downloadTextFile(content, filename) {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SecurityUtils;
} else {
  window.SecurityUtils = SecurityUtils;
}
