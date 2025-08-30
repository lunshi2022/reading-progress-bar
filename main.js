const { Plugin, MarkdownView } = require('obsidian');

module.exports = class ReadingProgressBar extends Plugin {
    constructor(app, manifest) {
        super(app, manifest);
        this.progressBar = null;
        this.progressContainer = null;
        this.progressText = null;
        this.scrollHandler = null;
        this.currentScrollContainer = null;
        this.isPreviewMode = false;
        this.retryCount = 0;
        this.maxRetries = 10;
    }

    async onload() {
        console.log('加载阅读进度条插件');
        
        // 创建进度条元素
        this.createProgressBar();
        
        // 等待DOM完全加载后再添加事件监听器
        this.app.workspace.onLayoutReady(() => {
            this.setupScrollListener();
        });
        
        // 监听活动标签页变化
        this.registerEvent(
            this.app.workspace.on('active-leaf-change', (leaf) => {
                console.log("活动标签页变化");
                // 重置重试计数
                this.retryCount = 0;
                
                // 延迟一下确保DOM已更新
                setTimeout(() => {
                    this.detectViewMode();
                    this.setupScrollListenerWithRetry();
                    this.updateProgressBar();
                }, 100);
            })
        );
        
        // 监听模式变化（编辑/阅读模式切换）
        this.registerEvent(
            this.app.workspace.on('mode-change', () => {
                console.log("模式变化");
                // 重置重试计数
                this.retryCount = 0;
                
                // 延迟一下确保DOM已更新
                setTimeout(() => {
                    this.detectViewMode();
                    this.setupScrollListenerWithRetry();
                    this.updateProgressBar();
                }, 100);
            })
        );
        
        // 监听布局变化
        this.registerEvent(
            this.app.workspace.on('layout-change', () => {
                console.log("布局变化");
                // 重置重试计数
                this.retryCount = 0;
                
                // 延迟一下确保DOM已更新
                setTimeout(() => {
                    this.detectViewMode();
                    this.setupScrollListenerWithRetry();
                    this.updateProgressBar();
                }, 100);
            })
        );
        
        // 初始检测视图模式
        this.detectViewMode();
        
        // 初始更新
        setTimeout(() => this.updateProgressBar(), 500);
    }

    onunload() {
        console.log('卸载阅读进度条插件');
        
        // 移除滚动事件监听器
        this.removeScrollListener();
        
        // 移除进度条元素
        if (this.progressContainer) {
            this.progressContainer.remove();
        }
    }

    createProgressBar() {
        // 创建进度条容器
        this.progressContainer = document.createElement('div');
        this.progressContainer.addClass('reading-progress-container');
        
        // 创建进度条
        this.progressBar = document.createElement('div');
        this.progressBar.addClass('reading-progress-bar');
        
        // 创建百分比文本
        this.progressText = document.createElement('div');
        this.progressText.addClass('reading-progress-text');
        this.progressText.textContent = '0%';
        this.progressBar.appendChild(this.progressText);
        
        // 添加到容器
        this.progressContainer.appendChild(this.progressBar);
        
        // 添加到文档主体
        document.body.appendChild(this.progressContainer);
    }

    detectViewMode() {
        // 获取当前活动视图
        const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
        if (activeView) {
            this.isPreviewMode = activeView.getMode() === 'preview';
            console.log("检测到视图模式:", this.isPreviewMode ? "阅读模式" : "编辑模式");
        } else {
            console.log("未找到活动Markdown视图");
        }
    }

    setupScrollListenerWithRetry() {
        // 移除旧的监听器
        this.removeScrollListener();
        
        // 获取当前活动的滚动容器
        const scrollContainer = this.getScrollContainer();
        
        if (!scrollContainer) {
            console.log("未找到滚动容器，尝试重试");
            
            // 如果未找到容器且重试次数未达上限，则重试
            if (this.retryCount < this.maxRetries) {
                this.retryCount++;
                setTimeout(() => {
                    this.setupScrollListenerWithRetry();
                }, 100);
            }
            return;
        }
        
        // 重置重试计数
        this.retryCount = 0;
        
        // 保存当前滚动容器引用
        this.currentScrollContainer = scrollContainer;
        
        // 创建新的滚动处理函数
        this.scrollHandler = () => this.updateProgressBar();
        
        // 添加滚动事件监听
        scrollContainer.addEventListener('scroll', this.scrollHandler);
        
        console.log("已添加滚动监听器到新容器");
    }
    
    setupScrollListener() {
        // 移除旧的监听器
        this.removeScrollListener();
        
        // 获取当前活动的滚动容器
        const scrollContainer = this.getScrollContainer();
        if (!scrollContainer) {
            console.log("未找到滚动容器");
            return;
        }
        
        // 保存当前滚动容器引用
        this.currentScrollContainer = scrollContainer;
        
        // 创建新的滚动处理函数
        this.scrollHandler = () => this.updateProgressBar();
        
        // 添加滚动事件监听
        scrollContainer.addEventListener('scroll', this.scrollHandler);
        
        console.log("已添加滚动监听器到新容器");
    }
    
    removeScrollListener() {
        if (this.scrollHandler && this.currentScrollContainer) {
            this.currentScrollContainer.removeEventListener('scroll', this.scrollHandler);
            this.scrollHandler = null;
            console.log("已移除旧滚动监听器");
        }
    }

    getScrollContainer() {
        // 获取当前活动视图
        const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
        if (!activeView) {
            console.log("未找到活动Markdown视图");
            return null;
        }
        
        // 根据当前模式选择不同的选择器
        if (this.isPreviewMode) {
            // 阅读模式下的选择器
            const previewSelectors = [
                '.markdown-preview-view', // 标准阅读模式容器
                '.markdown-reading-view', // 另一种阅读模式容器
                '.markdown-preview-section' // 阅读模式内容区域
            ];
            
            for (const selector of previewSelectors) {
                const container = activeView.containerEl.querySelector(selector);
                if (container) {
                    console.log("找到阅读模式滚动容器:", selector);
                    return container;
                }
            }
            
            // 如果没找到特定容器，尝试使用窗口作为滚动容器
            console.log("使用窗口作为阅读模式滚动容器");
            return window;
        } else {
            // 编辑模式下的选择器
            const editSelectors = [
                '.cm-scroller', // CodeMirror 滚动容器
                '.cm-editor' // CodeMirror 编辑器
            ];
            
            for (const selector of editSelectors) {
                const container = activeView.containerEl.querySelector(selector);
                if (container) {
                    console.log("找到编辑模式滚动容器:", selector);
                    return container;
                }
            }
        }
        
        // 如果没找到特定容器，返回整个内容区域
        console.log("使用内容区域作为滚动容器");
        return activeView.contentEl;
    }

    updateProgressBar() {
        if (!this.progressBar || !this.progressText) return;
        
        // 获取滚动容器
        const scrollContainer = this.getScrollContainer();
        if (!scrollContainer) {
            this.progressBar.style.width = '0%';
            this.updateProgressText(0);
            return;
        }
        
        // 计算滚动百分比
        let scrollTop, scrollHeight;
        
        if (scrollContainer === window) {
            // 如果是窗口滚动
            scrollTop = window.scrollY || document.documentElement.scrollTop;
            scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        } else {
            // 如果是元素滚动
            scrollTop = scrollContainer.scrollTop;
            scrollHeight = scrollContainer.scrollHeight - scrollContainer.clientHeight;
        }
        
        const scrollPercent = scrollHeight > 0 ? Math.min(100, (scrollTop / scrollHeight) * 100) : 0;
        
        // 更新进度条
        this.progressBar.style.width = scrollPercent + '%';
        
        // 更新文本
        this.updateProgressText(scrollPercent);
        
        console.log("进度条更新:", Math.round(scrollPercent) + '%');
    }

    updateProgressText(percent) {
        if (this.progressText) {
            if (percent < 10) {
                this.progressText.style.visibility = 'hidden';
            } else {
                this.progressText.style.visibility = 'visible';
                this.progressText.textContent = Math.round(percent) + '%';
            }
        }
    }
}