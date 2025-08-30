# Obsidian Reading Progress Bar Plugin

![Obsidian](https://img.shields.io/badge/Obsidian-%23483699.svg?style=for-the-badge&logo=obsidian&logoColor=white)
![Version](https://img.shields.io/badge/version-2.1.0-blue.svg?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-green.svg?style=for-the-badge)

一个优雅的阅读进度条插件，为您的Obsidian笔记提供直观的进度指示。

## 功能特点

- 🎯 **精准定位** - 在右下角显示美观的进度条
- 🎨 **自定义外观** - 支持渐变色彩和灰色底色
- 📱 **响应式设计** - 适应不同屏幕尺寸
- 🌙 **主题适配** - 完美支持明暗两种主题模式
- 🔄 **实时更新** - 随着滚动实时更新进度百分比
- ⚡ **性能优化** - 平滑过渡效果，低资源占用

## 安装方法
### 手动安装
1. 下载插件文件(`main.js`, `styles.css`, `manifest.json`)
2. 在您的Obsidian库中创建插件文件夹：`.obsidian/plugins/reading-progress-bar/`
3. 将下载的文件放入该文件夹
4. 重启Obsidian并启用插件

## 使用方法

安装并启用插件后，进度条会自动显示在右下角。它会随着您的阅读进度自动更新，无需额外配置。

### 自定义设置

您可以通过修改`styles.css`文件来自定义进度条的外观：

- **位置调整**：修改`.reading-progress-container`的`bottom`和`left`属性
- **尺寸调整**：修改`width`和`height`属性
- **颜色调整**：修改`background`属性更改渐变色
- **文字样式**：修改`.reading-progress-text`类调整文字外观

## 更新日志

### v2.1.0 (最新)
- 添加重试机制，解决切换文档时进度条不更新的问题
- 增强事件处理和错误处理能力
- 改进调试信息输出

### v2.0.0
- 修复编辑界面切换阅读界面时进度条不更新的问题
- 改进滚动容器管理和事件监听器处理

### v1.0.9
- 缩短进度条长度，添加灰色底色
- 移除阴影效果，优化视觉体验
- 进度小于10%时不显示文字

### v1.0.7
- 修复插件关闭后仍然运行的问题
- 完善事件监听器清理机制

### v1.0.3
- 修复进度条不响应滚动的问题
- 改进滚动容器检测逻辑

[查看完整更新日志](更新版本.txt)

## 技术细节

### 文件结构
```
reading-progress-bar/
├── main.js          # 插件主逻辑
├── styles.css       # 样式定义
├── manifest.json    # 插件元数据
└── 更新版本.txt      # 版本历史记录
```

### 核心功能
- 使用Obsidian官方API开发，遵循最佳实践
- 智能检测编辑模式和阅读模式下的滚动容器
- 支持多种Obsidian主题和布局模式
- 高效的事件管理和资源清理机制

## 常见问题

### 进度条不显示或不动怎么办？
1. 检查插件是否已启用
2. 查看开发者控制台(Ctrl+Shift+I)是否有错误信息
3. 尝试禁用其他插件以排除冲突

### 如何调整进度条位置？
修改`styles.css`文件中`.reading-progress-container`的`bottom`和`left`属性值。

### 支持移动端吗？
是的，插件包含响应式设计，在移动设备上会自动调整尺寸和位置。

## 贡献指南

欢迎提交Issue和Pull Request来帮助改进这个插件。如果您有功能建议或发现了问题，请通过GitHub Issues反馈。

## 许可证

本项目采用MIT许可证。有关详细信息，请参阅LICENSE文件。

## 支持

如果您喜欢这个插件，请考虑：
- 在Obsidian社区插件页面给予好评
- 向朋友推荐这个插件
- 提交改进建议或代码贡献

---

**注意**: 此插件为社区开发项目，与Obsidian官方无关。