/**
 * 助记词加解密核心模块
 * 基于 Web Crypto API 实现 AES-GCM 加密和 PBKDF2 密钥派生
 */

class MnemonicEncryptor {
  constructor() {
    this.iterations = 100000; // PBKDF2 迭代次数
    this.saltLength = 16;     // 盐值长度
    this.ivLength = 12;       // 初始化向量长度
    this.keyLength = 256;     // AES 密钥长度
  }

  /**
   * 生成随机字节数组
   * @param {number} length 字节长度
   * @returns {Uint8Array} 随机字节数组
   */
  generateRandomBytes(length) {
    return crypto.getRandomValues(new Uint8Array(length));
  }

  /**
   * 将字节数组转换为 Base64 字符串
   * @param {Uint8Array} bytes 字节数组
   * @returns {string} Base64 字符串
   */
  bytesToBase64(bytes) {
    const binary = String.fromCharCode.apply(null, bytes);
    return btoa(binary);
  }

  /**
   * 将 Base64 字符串转换为字节数组
   * @param {string} base64 Base64 字符串
   * @returns {Uint8Array} 字节数组
   */
  base64ToBytes(base64) {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  }

  /**
   * 加密助记词
   * @param {string} mnemonic 助记词
   * @param {string} password 密码
   * @returns {Promise<string>} 加密后的 JSON 字符串
   */
  async encryptMnemonic(mnemonic, password) {
    try {
      // 1. 生成随机盐和初始化向量
      const salt = this.generateRandomBytes(this.saltLength);
      const iv = this.generateRandomBytes(this.ivLength);

      // 2. 使用 PBKDF2 派生密钥
      const baseKey = await crypto.subtle.importKey(
        "raw",
        new TextEncoder().encode(password),
        "PBKDF2",
        false,
        ["deriveKey"]
      );

      const aesKey = await crypto.subtle.deriveKey(
        {
          name: "PBKDF2",
          salt,
          iterations: this.iterations,
          hash: "SHA-256"
        },
        baseKey,
        { name: "AES-GCM", length: this.keyLength },
        false,
        ["encrypt"]
      );

      // 3. 加密助记词
      const encrypted = await crypto.subtle.encrypt(
        { name: "AES-GCM", iv },
        aesKey,
        new TextEncoder().encode(mnemonic)
      );

      // 4. 构建加密结果对象
      const result = {
        salt: Array.from(salt),
        iv: Array.from(iv),
        ciphertext: Array.from(new Uint8Array(encrypted)),
        version: "1.0",
        algorithm: "AES-GCM-PBKDF2",
        iterations: this.iterations
      };

      // 5. 清理敏感数据
      this.clearSensitiveData(salt, iv, aesKey);

      return JSON.stringify(result);
    } catch (error) {
      throw new Error(`加密失败: ${error.message}`);
    }
  }

  /**
   * 解密助记词
   * @param {string} encryptedData 加密数据 JSON 字符串
   * @param {string} password 密码
   * @returns {Promise<string>} 解密后的助记词
   */
  async decryptMnemonic(encryptedData, password) {
    try {
      const { salt, iv, ciphertext, version, algorithm } = JSON.parse(encryptedData);

      // 验证版本和算法
      if (version !== "1.0" || algorithm !== "AES-GCM-PBKDF2") {
        throw new Error("不支持的加密格式或版本");
      }

      // 1. 重新派生密钥
      const baseKey = await crypto.subtle.importKey(
        "raw",
        new TextEncoder().encode(password),
        "PBKDF2",
        false,
        ["deriveKey"]
      );

      const aesKey = await crypto.subtle.deriveKey(
        {
          name: "PBKDF2",
          salt: new Uint8Array(salt),
          iterations: this.iterations,
          hash: "SHA-256"
        },
        baseKey,
        { name: "AES-GCM", length: this.keyLength },
        false,
        ["decrypt"]
      );

      // 2. 解密数据
      const decrypted = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv: new Uint8Array(iv) },
        aesKey,
        new Uint8Array(ciphertext)
      );

      // 3. 返回助记词明文
      const mnemonic = new TextDecoder().decode(decrypted);

      // 4. 清理敏感数据
      this.clearSensitiveData(aesKey);

      return mnemonic;
    } catch (error) {
      throw new Error("解密失败：密码错误或数据被篡改");
    }
  }

  /**
   * 清理敏感数据
   * @param {...CryptoKey|Uint8Array} sensitiveData 敏感数据数组
   */
  clearSensitiveData(...sensitiveData) {
    sensitiveData.forEach(data => {
      if (data instanceof Uint8Array) {
        data.fill(0);
      }
    });
  }

  /**
   * 验证密码强度
   * @param {string} password 密码
   * @returns {object} 强度评估结果
   */
  validatePasswordStrength(password) {
    const minLength = 12;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
    
    const score = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChars]
      .filter(Boolean).length;
    
    const isStrong = password.length >= minLength && score >= 3;
    
    return {
      isStrong,
      score: score / 4,
      feedback: this.getPasswordFeedback(password, score, minLength)
    };
  }

  /**
   * 获取密码强度反馈
   * @param {string} password 密码
   * @param {number} score 强度分数
   * @param {number} minLength 最小长度
   * @returns {string} 反馈信息
   */
  getPasswordFeedback(password, score, minLength) {
    if (password.length < minLength) {
      return `密码长度至少需要 ${minLength} 个字符`;
    }
    
    if (score === 0) return "密码强度极弱";
    if (score === 1) return "密码强度弱";
    if (score === 2) return "密码强度中等";
    if (score === 3) return "密码强度强";
    if (score === 4) return "密码强度极强";
    
    return "密码强度未知";
  }
}

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MnemonicEncryptor;
} else {
  window.MnemonicEncryptor = MnemonicEncryptor;
}
