# 🔐 加密货币钱包助记词加解密工具

一个基于 Web Crypto API 的纯前端、零数据存储的加密货币钱包助记词加解密解决方案。

## ✨ 特性

- **🔒 强加密**: 使用 AES-GCM 加密和 PBKDF2 密钥派生
- **🛡️ 零数据存储**: 所有操作在浏览器内存中完成，无持久化存储
- **📱 纯前端**: 基于 Web Crypto API，无需后端服务
- **🎨 模块化设计**: 清晰的代码结构，易于维护和扩展
- **📱 响应式界面**: 支持桌面和移动设备
- **🔐 密码强度检测**: 实时密码强度评估和反馈

## 🏗️ 项目结构

```
crypto-wallet-encryptor/
├── index.html              # 主页面
├── test.html               # 测试页面
├── test-modules.js         # 测试脚本
├── css/
│   └── styles.css          # 样式文件
└── js/
    ├── main.js             # 主应用入口
    ├── crypto/
    │   └── mnemonic-encryptor.js  # 核心加密模块
    ├── utils/
    │   └── security-utils.js      # 安全工具模块
    └── ui/
        ├── module-loader.js       # 模块加载器
        ├── password-strength-manager.js  # 密码强度管理
        ├── file-handler.js        # 文件处理
        ├── message-manager.js     # 消息管理
        ├── encrypt-operations.js  # 加密操作
        ├── decrypt-operations.js  # 解密操作
        └── encrypt-decrypt-ui.js  # 主界面模块
```

## 🚀 快速开始

### 1. 本地运行

```bash
# 启动本地服务器
python -m http.server 8000

# 或者使用 Node.js
npx http-server -p 8000

# 或者使用 PHP
php -S localhost:8000
```

### 2. 访问应用

- **主应用**: http://localhost:8000/
- **测试页面**: http://localhost:8000/test.html

## 🧪 测试指南

### 自动测试

1. 打开测试页面: http://localhost:8000/test.html
2. 点击"运行所有测试"按钮
3. 查看控制台输出和页面测试结果

### 手动测试

1. 打开主应用页面
2. 在加密部分输入测试助记词
3. 设置强密码并观察密码强度指示器
4. 执行加密操作
5. 复制加密结果到解密部分
6. 使用相同密码执行解密操作
7. 验证解密结果

### 测试助记词示例

```
abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about
```

## 🔧 模块说明

### 核心模块

- **`MnemonicEncryptor`**: 负责 AES-GCM 加密和 PBKDF2 密钥派生
- **`SecurityUtils`**: 提供安全相关的工具函数

### UI 模块

- **`PasswordStrengthManager`**: 管理密码强度检测和显示
- **`FileHandler`**: 处理文件上传和下载
- **`MessageManager`**: 统一的消息提示和加载状态管理
- **`EncryptOperations`**: 加密相关的业务逻辑
- **`DecryptOperations`**: 解密相关的业务逻辑
- **`EncryptDecryptUI`**: 主界面协调器

### 系统模块

- **`ModuleLoader`**: 模块依赖管理和生命周期管理
- **`CryptoWalletApp`**: 主应用实例和初始化

## 🔐 安全特性

- **强密码要求**: 建议12位以上，包含大小写字母、数字、符号
- **随机盐值**: 每次加密使用不同的随机盐值
- **随机IV**: 每次加密使用不同的随机初始化向量
- **PBKDF2**: 使用100,000次迭代的密钥派生函数
- **AES-GCM**: 提供认证加密，确保数据完整性

## 📱 浏览器兼容性

- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+

需要支持以下 Web API:
- Web Crypto API
- TextEncoder/TextDecoder
- Base64 编码/解码

## 🚨 重要提醒

1. **密码安全**: 加密密码是唯一恢复凭证，丢失后无法解密
2. **设备安全**: 确保在可信设备上使用，避免恶意软件
3. **网络环境**: 建议在可信网络环境中使用
4. **备份策略**: 建议将加密文本保存到多个安全位置

## 🔍 故障排除

### 常见问题

1. **模块加载失败**
   - 检查文件路径和加载顺序
   - 确保所有 JavaScript 文件都存在

2. **加密失败**
   - 检查浏览器是否支持 Web Crypto API
   - 验证助记词格式是否正确

3. **界面显示异常**
   - 检查 CSS 文件是否正确加载
   - 清除浏览器缓存

### 调试模式

在开发环境中，应用会在控制台输出调试信息：

```javascript
// 获取应用状态
cryptoWalletApp.getStatus()

// 重新初始化应用
cryptoWalletApp.reinit()

// 销毁应用
cryptoWalletApp.destroy()
```

## 📄 许可证

本项目采用 MIT 许可证。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📞 支持

如有问题或建议，请通过以下方式联系：

- 提交 GitHub Issue
- 发送邮件至项目维护者

---

**⚠️ 免责声明**: 此工具仅供学习和研究使用。用户应自行承担使用风险，确保在安全环境中使用。
