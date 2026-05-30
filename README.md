# Sukey - 快捷键管理

## 概述

Sukey 是一个 uTools 插件，用于管理各软件的快捷键。进入插件时自动识别当前前台窗口软件，跳转到对应快捷键列表；支持关键字搜索和按键搜索。

## 核心功能

### 1. 自动窗口识别
- 进入插件时自动检测当前活动软件
- 自动跳转到对应软件的快捷键列表
- 未匹配的软件自动创建空条目，支持导入

### 2. 智能进程映射
- 大小写不敏感精确匹配
- 模糊匹配（进程名包含或被包含）
- 完全未匹配的进程自动创建空条目

### 3. 快捷键存储
- 内置 VSCode、Chrome 快捷键数据
- 支持 JSON 格式导入自定义数据
- 自定义数据保存在本地数据库

### 4. 查询能力
- 中英文模糊搜索
- 按功能分类筛选
- 直接按键跳转到对应记录

## 项目结构

```
/sukey
|-- plugin.json           # 插件配置
|-- preload.js            # 预加载脚本（读取本地 JSON 数据）
|-- index.html            # 主页面
|-- logo.png              # 128x128 图标
|-- data/                 # 配置文件
|   |-- software-mapping.json  # 进程名映射配置
```

## 配置说明

### 进程名映射 (data/software-mapping.json)

```json
{
    "softwareMapping": {
        "code": "vscode",
        "chrome": "chrome",
        "excel": "excel",
        "obsidian": "obsidian"
    }
}
```

- 键为进程名（小写），值为软件标识
- 可通过模糊匹配处理进程名差异
- 不配置则使用进程名直接作为 key

### plugin.json 配置

```json
{
    "main": "index.html",
    "logo": "logo.png",
    "preload": "preload.js",
    "features": [
        {
            "code": "list",
            "explain": "快捷键列表 - 自动识别当前窗口软件",
            "cmds": [
                {
                    "type": "window",
                    "label": "快捷键列表",
                    "match": {
                        "app": ["Code.exe", "chrome.exe", "msedge.exe", "Obsidian.exe"]
                    }
                }
            ]
        },
        {
            "code": "search",
            "explain": "搜索快捷键",
            "cmds": ["sk", "快捷键"]
        }
    ],
    "pluginSetting": {
        "height": 500
    }
}
```

## 快捷键数据格式

### 导入格式
```json
{
    "software": "软件名称",
    "shortcuts": [
        {
            "keys": ["Ctrl", "Shift", "P"],
            "command": "命令名称",
            "category": "分类",
            "description": "描述说明"
        }
    ]
}
```

### 内置数据 (index.html 内联)
```javascript
const shortcutsData = {
    vscode: {
        name: 'VSCode',
        shortcuts: [...]
    }
}
```

## 使用说明

### 方式一：窗口匹配进入
1. 在目标软件窗口（如 Obsidian）
2. 按下 uTools 全局快捷键
3. 选择「快捷键列表」
4. 自动跳转到该软件的快捷键页面

### 方式二：关键字搜索
1. 按下 uTools 全局快捷键
2. 输入 `sk` 或 `快捷键`
3. 在列表中选择软件查看

### 导入自定义快捷键
1. 点击「导入快捷键」按钮
2. 选择 JSON 文件或粘贴内容
3. 数据自动保存到本地数据库

## 开发调试

1. 在 uTools 中安装「uTools 开发者工具」插件
2. 打开开发者工具，选择 `D:\material\OneDrive\material\Sukey` 文件夹
3. 在搜索框输入 `sk` 或 `快捷键` 启动插件
4. 按 `F12` 打开开发者工具进行调试
5. 修改代码后按 `Ctrl+Shift+P` 重新加载

## 更新日志

### 2026-05-30
- 新增窗口自动识别功能
- 新增进程名智能映射（精确/模糊匹配）
- 新增未匹配软件自动创建空条目
- 配置分离到 `data/software-mapping.json`
- 清理调试日志

### 早期版本
- 项目初始化
- 基础 UI 实现
- VSCode/Chrome 快捷键数据