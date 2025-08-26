/**
 * 轻量 i18n 模块
 * - 通过 data-i18n="key" 标记 DOM 文案
 * - i18n.t(key, params?) 获取翻译
 * - i18n.setLocale('zh-CN'|'en') 切换语言并持久化
 * - i18n.applyTranslations(root?) 应用到 DOM
 */

(function(global){
  const STORAGE_KEY = 'app_locale';
  const DEFAULT_LOCALE = (navigator.language || 'zh-CN').toLowerCase().startsWith('en') ? 'en' : 'zh-CN';

  const dictionaries = {
    'zh-CN': {
      app_title: '助记词加解密工具',
      app_subtitle: '基于 Web Crypto API 的安全加密方案，零数据存储，保护您的数字资产',
      encrypt_section: '加密助记词',
      decrypt_section: '解密助记词',
      mnemonic_label: '助记词',
      password_label_encrypt: '加密密码',
      password_label_decrypt: '解密密码',
      generate_password: '生成强密码',
      encrypt_button: '加密助记词',
      decrypt_button: '解密助记词',
      encrypted_text_label: '加密文本',
      copy_to_clipboard: '复制到剪贴板',
      download_file: '下载文件',
      important_tips: '重要提醒',
      upload_mnemonic_txt: '点击上传 .txt 文件',
      upload_encrypted_file: '点击上传加密文本文件（.txt/.json）',

      // Placeholders
      ph_mnemonic: '请输入助记词（12/15/18/21/24 个单词）',
      ph_encrypt_password: '设置强密码（建议≥12位，包含大小写、数字、符号）',
      ph_decrypt_password: '输入加密时使用的密码',
      ph_encrypted_text: '粘贴之前保存的加密文本',

      // Messages
      msg_encrypt_success: '加密成功！请保存加密文本',
      msg_decrypt_success: '解密成功！',
      msg_no_content_copy: '没有可复制的内容',
      msg_copy_ok: '已复制到剪贴板',
      msg_copy_fail: '复制失败，请手动复制',
      msg_download_ok: '文件下载成功',
      msg_need_mnemonic: '请输入助记词',
      msg_need_encrypt_password: '请输入加密密码',
      msg_need_encrypted: '请输入加密文本',
      msg_need_decrypt_password: '请输入解密密码',
      msg_encrypting: '正在加密...',
      msg_decrypting: '正在解密...',
      msg_mnemonic_length_invalid: '助记词应为 12-24 个单词',

      // Password strength keys
      password_too_short: '密码长度至少需要 {min} 个字符',
      password_very_weak: '密码强度极弱',
      password_weak: '密码强度弱',
      password_medium: '密码强度中等',
      password_strong: '密码强度强',
      password_very_strong: '密码强度极强',

      // Security tips
      tip_save_cipher: '✅ 保存加密文本：复制到备忘录/密码管理器，勿发邮件/云盘',
      tip_password_strength: '✅ 密码强度：混合大小写、数字、符号（如 F8@zq#2L9!uV$）',
      tip_network: '⛔ 网络环境：仅在可信设备/网络中使用，避免公共WiFi',
      tip_device: '⛔ 设备安全：确保无恶意插件或屏幕监控软件',
      tip_password_warning: '⚠️ 重要提醒：加密密码是唯一恢复凭证，丢失后无法解密！',

      // Password toggle
      show_password: '显示密码',
      hide_password: '隐藏密码',

      // Lang
      lang_label: '语言',
      lang_zh: '中文',
      lang_en: '英文'
    },
    'en': {
      app_title: 'Mnemonic Encrypt/Decrypt Tool',
      app_subtitle: 'Secure Web Crypto API-based encryption, zero data storage, protect your assets',
      encrypt_section: 'Encrypt Mnemonic',
      decrypt_section: 'Decrypt Mnemonic',
      mnemonic_label: 'Mnemonic',
      password_label_encrypt: 'Encryption Password',
      password_label_decrypt: 'Decryption Password',
      generate_password: 'Generate Strong Password',
      encrypt_button: 'Encrypt',
      decrypt_button: 'Decrypt',
      encrypted_text_label: 'Encrypted Text',
      copy_to_clipboard: 'Copy to Clipboard',
      download_file: 'Download',
      important_tips: 'Important Tips',
      upload_mnemonic_txt: 'Upload .txt file',
      upload_encrypted_file: 'Upload encrypted file (.txt/.json)',

      // Placeholders
      ph_mnemonic: 'Enter mnemonic (12/15/18/21/24 words)',
      ph_encrypt_password: 'Set a strong password (≥12, with cases, numbers, symbols)',
      ph_decrypt_password: 'Enter the password used for encryption',
      ph_encrypted_text: 'Paste previously saved encrypted text',

      // Messages
      msg_encrypt_success: 'Encrypted successfully! Please save the ciphertext',
      msg_decrypt_success: 'Decrypted successfully!',
      msg_no_content_copy: 'Nothing to copy',
      msg_copy_ok: 'Copied to clipboard',
      msg_copy_fail: 'Copy failed, please copy manually',
      msg_download_ok: 'File downloaded',
      msg_need_mnemonic: 'Please enter mnemonic',
      msg_need_encrypt_password: 'Please enter encryption password',
      msg_need_encrypted: 'Please paste encrypted text',
      msg_need_decrypt_password: 'Please enter decryption password',
      msg_encrypting: 'Encrypting...',
      msg_decrypting: 'Decrypting...',
      msg_mnemonic_length_invalid: 'Mnemonic should be 12–24 words',

      // Password strength keys
      password_too_short: 'Password must be at least {min} characters',
      password_very_weak: 'Very weak password',
      password_weak: 'Weak password',
      password_medium: 'Medium strength password',
      password_strong: 'Strong password',
      password_very_strong: 'Very strong password',

      // Security tips
      tip_save_cipher: '✅ Save ciphertext to notes/password manager; avoid email/cloud',
      tip_password_strength: '✅ Use mixed case, numbers, symbols (e.g., F8@zq#2L9!uV$)',
      tip_network: '⛔ Use only trusted device/network; avoid public Wi‑Fi',
      tip_device: '⛔ Ensure no malicious extensions or screen recorders',
      tip_password_warning: '⚠️ Important: Password is the only recovery credential!',

      show_password: 'Show password',
      hide_password: 'Hide password',

      lang_label: 'Language',
      lang_zh: 'Chinese',
      lang_en: 'English'
    }
  };

  let currentLocale = localStorage.getItem(STORAGE_KEY) || DEFAULT_LOCALE;

  function t(key){
    const dict = dictionaries[currentLocale] || dictionaries[DEFAULT_LOCALE];
    return dict[key] || key;
  }

  function setLocale(locale){
    if(!dictionaries[locale]) return;
    currentLocale = locale;
    localStorage.setItem(STORAGE_KEY, currentLocale);
    applyTranslations();
  }

  function applyTranslations(root){
    const scope = root || document;
    const nodes = scope.querySelectorAll('[data-i18n]');
    nodes.forEach(node => {
      const key = node.getAttribute('data-i18n');
      const text = t(key);
      if (node.tagName === 'INPUT' && node.type === 'placeholder') {
        node.placeholder = text;
      } else {
        node.textContent = text;
      }
    });
    // 占位符翻译
    const placeholders = scope.querySelectorAll('[data-i18n-placeholder]');
    placeholders.forEach(node => {
      const key = node.getAttribute('data-i18n-placeholder');
      node.setAttribute('placeholder', t(key));
    });
    // title 翻译
    const titles = scope.querySelectorAll('[data-i18n-title]');
    titles.forEach(node => {
      const key = node.getAttribute('data-i18n-title');
      node.setAttribute('title', t(key));
    });
  }

  global.i18n = { t, setLocale, applyTranslations, get locale(){ return currentLocale; } };
})(window);
