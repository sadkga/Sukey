# Sukey - 快捷键管理

## 概述

Sukey 是一个 uTools 插件，用于管理各软件的快捷键。当识别到特定软件为主窗口时，自动显示该软件的快捷键列表，支持查询和按键搜索。

## 核心功能

### 1. 软件识别
- 通过 `window` 匹配指令识别当前活动软件
- 显示对应软件的快捷键列表
- 支持 VSCode、Chrome、Edge、Firefox 等主流软件

### 2. 快捷键存储
- 按软件分类存储快捷键数据
- 支持 JSON 格式导入导出
- 内置常用软件快捷键数据

### 3. 查询能力
- 模糊搜索快捷键
- 按功能描述搜索
- 按按键组合搜索

### 4. 窗口自动切换
- 自动识别当前活动窗口软件
- 切换软件时自动更新快捷键列表

## 项目结构

```
/sukey
|-- plugin.json      # 插件配置
|-- preload.js       # 预加载脚本（读取本地 JSON 数据）
|-- index.html       # 主页面
|-- logo.png         # 128x128 图标
|-- data/            # 快捷键数据
|   |-- vscode.json  # VSCode 快捷键
|   |-- chrome.json  # Chrome 快捷键
```

## plugin.json 配置

```json
{
  "main": "index.html",
  "logo": "logo.png",
  "preload": "preload.js",
  "features": [
    {
      "code": "list",
      "explain": "查看当前软件快捷键列表",
      "cmds": [{
        "type": "window",
        "label": "快捷键列表",
        "match": {
          "app": ["Code.exe", "chrome.exe", "msedge.exe"]
        }
      }]
    },
    {
      "code": "search",
      "explain": "搜索快捷键",
      "cmds": ["sk", "快捷键"]
    }
  ]
}
```

## 快捷键数据格式

```json
{
  "software": "VSCode",
  "name": "Visual Studio Code",
  "shortcuts": [
    {
      "keys": ["Ctrl", "Shift", "P"],
      "command": "Command Palette",
      "category": "常用",
      "description": "打开命令面板"
    }
  ]
}
```

## 开发进度

### Phase 1 - MVP ✅
- [x] 项目初始化（目录结构）
- [x] 插件配置（plugin.json）
- [x] 预加载脚本（preload.js）
- [x] 基础 UI（index.html + 暗色主题）
- [x] VSCode 快捷键数据
- [x] Chrome 快捷键数据
- [x] Logo 生成
- [x] 数据格式统一（description 字段）
- [x] window 匹配配置扩展
- [ ] 在开发者工具中调试
- [ ] 窗口识别自动切换

### Phase 2 - 增强
- [ ] 添加更多软件（Photoshop, Firefox, Word 等）
- [ ] 按键组合精确查找
- [ ] 快捷键导入导出（JSON）
- [ ] 显示/隐藏快捷键提示

### Phase 3 - 完善
- [ ] 用户自定义快捷键
- [ ] 云同步
- [ ] 快捷键冲突检测

## 调试说明

1. 在 uTools 中安装「uTools 开发者工具」插件
2. 打开开发者工具，点击「选择工程 plugin.json 文件夹」
3. 选择 `D:\material\OneDrive\material\Sukey` 文件夹
4. 在搜索框输入 `sk` 或 `快捷键` 启动插件
5. 按 `Ctrl+Shift+I` 打开开发者工具进行调试
6. 开启「退出到后台立即结束运行」实现热重载

## 已知问题修复

- [x] preload.js 未被使用 - 重构 index.html 使用 sukeyApi
- [x] 数据格式不一致 - 统一使用 description 字段
- [x] console.log 残留 - 已清理
- [x] window 匹配配置 - 扩展更多进程名