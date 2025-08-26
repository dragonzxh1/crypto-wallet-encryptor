/**
 * 文件处理模块
 */

class FileHandler {
  constructor() {
    this.securityUtils = new SecurityUtils();
  }

  /**
   * 处理助记词文件上传
   * @param {Event} event 文件上传事件
   * @param {string} targetInputId 目标输入框ID
   * @returns {Promise<string>} 文件内容
   */
  async handleMnemonicFileUpload(event, targetInputId) {
    const file = event.target.files[0];
    if (!file) {
      throw new Error('未选择文件');
    }

    // 验证文件类型
    if (!this.isValidTextFile(file)) {
      throw new Error('请上传 .txt 文本文件');
    }

    try {
      const content = await this.readFileContent(file);
      
      // 更新输入框
      const targetInput = document.getElementById(targetInputId);
      if (targetInput) {
        targetInput.value = content;
      }
      
      return content;
    } catch (error) {
      throw new Error(`文件读取失败: ${error.message}`);
    }
  }

  /**
   * 验证是否为有效的文本文件
   * @param {File} file 文件对象
   * @returns {boolean} 是否为有效文本文件
   */
  isValidTextFile(file) {
    return file.type === 'text/plain' || file.name.endsWith('.txt');
  }

  /**
   * 读取文件内容
   * @param {File} file 文件对象
   * @returns {Promise<string>} 文件内容
   */
  readFileContent(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = () => reject(new Error('文件读取失败'));
      
      reader.readAsText(file, 'UTF-8');
    });
  }

  /**
   * 下载加密结果
   * @param {string} content 文件内容
   * @param {string} prefix 文件名前缀
   */
  downloadEncryptedResult(content, prefix = 'encrypted-mnemonic') {
    if (!content) {
      throw new Error('没有可下载的内容');
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${prefix}-${timestamp}.txt`;
    
    this.securityUtils.downloadTextFile(content, filename);
  }

  /**
   * 设置文件拖拽上传
   * @param {string} dropZoneId 拖拽区域ID
   * @param {string} targetInputId 目标输入框ID
   */
  setupDragAndDrop(dropZoneId, targetInputId) {
    const dropZone = document.getElementById(dropZoneId);
    if (!dropZone) return;

    dropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropZone.classList.add('drag-over');
    });

    dropZone.addEventListener('dragleave', () => {
      dropZone.classList.remove('drag-over');
    });

    dropZone.addEventListener('drop', async (e) => {
      e.preventDefault();
      dropZone.classList.remove('drag-over');
      
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        try {
          const file = files[0];
          if (this.isValidTextFile(file)) {
            const content = await this.readFileContent(file);
            const targetInput = document.getElementById(targetInputId);
            if (targetInput) {
              targetInput.value = content;
            }
          } else {
            throw new Error('请拖拽 .txt 文本文件');
          }
        } catch (error) {
          console.error('拖拽上传失败:', error);
        }
      }
    });
  }
}

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
  module.exports = FileHandler;
} else {
  window.FileHandler = FileHandler;
}
