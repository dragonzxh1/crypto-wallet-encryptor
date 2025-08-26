/**
 * 模块加载器
 * 统一管理所有模块的加载和初始化
 */

class ModuleLoader {
  constructor() {
    this.modules = new Map();
    this.loadedModules = new Set();
    this.initQueue = [];
  }

  /**
   * 注册模块
   * @param {string} name 模块名称
   * @param {Function} moduleClass 模块类
   * @param {Array} dependencies 依赖模块列表
   */
  registerModule(name, moduleClass, dependencies = []) {
    this.modules.set(name, {
      class: moduleClass,
      dependencies,
      instance: null
    });
  }

  /**
   * 加载模块
   * @param {string} name 模块名称
   * @returns {Promise<Object>} 模块实例
   */
  async loadModule(name) {
    if (this.loadedModules.has(name)) {
      return this.modules.get(name).instance;
    }

    const moduleInfo = this.modules.get(name);
    if (!moduleInfo) {
      throw new Error(`模块 ${name} 未注册`);
    }

    // 检查依赖
    for (const dep of moduleInfo.dependencies) {
      if (!this.loadedModules.has(dep)) {
        await this.loadModule(dep);
      }
    }

    // 创建实例
    try {
      moduleInfo.instance = new moduleInfo.class();
      this.loadedModules.add(name);
      
      // 如果模块有init方法，调用它
      if (typeof moduleInfo.instance.init === 'function') {
        await moduleInfo.instance.init();
      }
      
      return moduleInfo.instance;
    } catch (error) {
      throw new Error(`加载模块 ${name} 失败: ${error.message}`);
    }
  }

  /**
   * 批量加载模块
   * @param {Array} moduleNames 模块名称列表
   * @returns {Promise<Map>} 模块实例映射
   */
  async loadModules(moduleNames) {
    const instances = new Map();
    
    for (const name of moduleNames) {
      const instance = await this.loadModule(name);
      instances.set(name, instance);
    }
    
    return instances;
  }

  /**
   * 获取已加载的模块
   * @param {string} name 模块名称
   * @returns {Object|null} 模块实例
   */
  getModule(name) {
    const moduleInfo = this.modules.get(name);
    return moduleInfo ? moduleInfo.instance : null;
  }

  /**
   * 检查模块是否已加载
   * @param {string} name 模块名称
   * @returns {boolean} 是否已加载
   */
  isModuleLoaded(name) {
    return this.loadedModules.has(name);
  }

  /**
   * 获取所有已加载的模块
   * @returns {Array} 已加载模块名称列表
   */
  getLoadedModules() {
    return Array.from(this.loadedModules);
  }

  /**
   * 卸载模块
   * @param {string} name 模块名称
   */
  unloadModule(name) {
    const moduleInfo = this.modules.get(name);
    if (moduleInfo && moduleInfo.instance) {
      // 如果模块有destroy方法，调用它
      if (typeof moduleInfo.instance.destroy === 'function') {
        moduleInfo.instance.destroy();
      }
      
      moduleInfo.instance = null;
      this.loadedModules.delete(name);
    }
  }

  /**
   * 卸载所有模块
   */
  unloadAllModules() {
    for (const name of this.loadedModules) {
      this.unloadModule(name);
    }
  }

  /**
   * 重新加载模块
   * @param {string} name 模块名称
   * @returns {Promise<Object>} 新的模块实例
   */
  async reloadModule(name) {
    this.unloadModule(name);
    return await this.loadModule(name);
  }

  /**
   * 获取模块依赖关系
   * @returns {Object} 依赖关系图
   */
  getDependencyGraph() {
    const graph = {};
    
    for (const [name, moduleInfo] of this.modules) {
      graph[name] = {
        dependencies: moduleInfo.dependencies,
        loaded: this.loadedModules.has(name)
      };
    }
    
    return graph;
  }
}

// 创建全局模块加载器实例
const moduleLoader = new ModuleLoader();

// 注册所有模块
moduleLoader.registerModule('MnemonicEncryptor', MnemonicEncryptor);
moduleLoader.registerModule('SecurityUtils', SecurityUtils);
moduleLoader.registerModule('PasswordStrengthManager', PasswordStrengthManager, ['MnemonicEncryptor', 'SecurityUtils']);
moduleLoader.registerModule('FileHandler', FileHandler, ['SecurityUtils']);
moduleLoader.registerModule('MessageManager', MessageManager);
moduleLoader.registerModule('EncryptOperations', EncryptOperations, ['MnemonicEncryptor', 'MessageManager', 'FileHandler']);
moduleLoader.registerModule('DecryptOperations', DecryptOperations, ['MnemonicEncryptor', 'MessageManager']);
moduleLoader.registerModule('EncryptDecryptUI', EncryptDecryptUI, [
  'PasswordStrengthManager', 
  'EncryptOperations', 
  'DecryptOperations', 
  'MessageManager', 
  'FileHandler'
]);

// 导出模块加载器
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ModuleLoader, moduleLoader };
} else {
  window.ModuleLoader = ModuleLoader;
  window.moduleLoader = moduleLoader;
}
