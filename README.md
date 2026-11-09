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
- 内置常用软件的快捷键数据（详见下表），首次运行时写入本地数据库
- 内置数据是普通可编辑条目：可修改/删除，已修改的条目不会被启动时的补齐逻辑覆盖
- 「更新内置数据」按钮可用内置数据强制恢复默认（不影响自己添加的软件）
- 支持 JSON 格式导入自定义数据
- 自定义数据保存在本地数据库

### 内置快捷键数据

`data/builtin-shortcuts.js` 内置了 10 款常用软件、共 362 条快捷键。标题栏会显示每条内置数据对应的软件版本；版本号是采集数据时对应的软件版本，仅作参考（软件更新后个别快捷键可能变化）。

| 软件标识 | 名称 | 条数 | 对应版本 | 数据来源（官方公开文档） |
| --- | --- | --- | --- | --- |
| vscode | Visual Studio Code | 46 | 1.145 | https://code.visualstudio.com/docs/reference/default-keybindings |
| chrome | Google Chrome | 37 | 158 | https://support.google.com/chrome/answer/157179 |
| edge | Microsoft Edge | 43 | 157 | https://support.microsoft.com/en-us/edge/keyboard-shortcuts-in-microsoft-edge |
| firefox | Mozilla Firefox | 52 | 159 | https://support.mozilla.org/en-US/kb/keyboard-shortcuts-perform-firefox-tasks-quickly |
| word | Microsoft Word | 33 | 365（滚动更新） | https://support.microsoft.com/en-us/office/keyboard-shortcuts-in-word-95ef89dd-7142-4b50-afb2-f762f663ceb2 |
| excel | Microsoft Excel | 34 | 365（滚动更新） | https://support.microsoft.com/en-us/office/keyboard-shortcuts-in-excel-1798d9d5-842a-42b8-9c99-9b7213f0040f |
| powerpoint | Microsoft PowerPoint | 27 | 365（滚动更新） | https://support.microsoft.com/en-us/office/keyboard-shortcuts-in-powerpoint-ebb3d20e-dcd4-444f-a38e-bb5c5ed180f4 |
| outlook | Microsoft Outlook | 29 | 新版 Windows 客户端 | https://support.microsoft.com/en-us/accessibility/outlook/keyboard-shortcuts-for-outlook |
| obsidian | Obsidian | 28 | 1.15 | https://help.obsidian.md/Editing+and+formatting/Editing+shortcuts |
| photoshop | Adobe Photoshop | 33 | 2024 | Photoshop 默认快捷键（Windows） |

> 快捷键均为 Windows 键位。`data/builtin-shortcuts.js` 由脚本集中生成，文件头记录了来源与采集版本，请勿逐条手改。

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
|   |-- builtin-shortcuts.js   # 内置快捷键数据（生成文件，来源/版本见文件头）
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

## AI Agent / MCP 工具

Sukey 通过 uTools MCP 服务向 AI Agent 暴露以下工具（在 `plugin.json` 的 `tools` 中声明，并由 `index.html` 中的 `utools.registerTool()` 注册）。在 uTools「设置 → AI 设置 → MCP 服务」开启本地 MCP 服务后，Claude Code、Codex 等 AI Agent 即可发现并调用。

| 工具 | 说明 | 主要参数 |
| --- | --- | --- |
| `list_software` | 列出所有软件及快捷键条数 | 无 |
| `get_shortcuts` | 获取某软件的全部快捷键 | `software`（软件标识或显示名称） |
| `search_shortcuts` | 全局模糊搜索快捷键 | `keyword` |
| `import_shortcuts` | 导入某软件的快捷键 | `software`、`shortcuts`（`keys`/`command`/`category`/`description`）、`overwrite`（可选） |
| `export_backup` | 导出全部数据为 JSON 备份 | `filePath`（可选，默认下载目录） |
| `import_backup` | 从备份文件恢复数据 | `filePath`、`overwrite`（可选） |

- `import_shortcuts` 默认按「按键组合」合并到已有软件（同名覆盖），`overwrite: true` 时整体替换该软件。
- `import_backup` 默认合并（同名软件整体覆盖），`overwrite: true` 时先清空现有软件再导入。
- 备份文件路径默认写入系统下载目录并自动命名；文件读写由 `preload.js` 暴露的 `sukeyApi.saveTextFile` / `sukeyApi.readTextFile` 负责。

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
2. 打开开发者工具，选择 Sukey 插件项目所在的文件夹
3. 在搜索框输入 `sk` 或 `快捷键` 启动插件
4. 按 `F12` 打开开发者工具进行调试
5. 修改代码后按 `Ctrl+Shift+P` 重新加载

## 更新日志

### 2026-11-09
- 新增 uTools MCP 工具：`list_software`、`get_shortcuts`、`search_shortcuts`、`import_shortcuts`、`export_backup`、`import_backup`，可被 AI Agent 调用完成快捷键导入与数据备份导出
- 修复「使用说明」弹层在浅色主题下仍显示深色背景的问题（背景改为随主题变化）
- 软件过多时，在侧栏「软件」标题旁新增 🔍 搜索按钮：点击展开搜索框，输入关键词过滤软件列表，回车（或点击匹配项）进入对应软件

### 2026-11-08
- 扩充内置快捷键：新增 Office（Word/Excel/PowerPoint/Outlook）、Edge、Firefox、Obsidian、Photoshop 等
- 内置数据抽到 `data/builtin-shortcuts.js`，首次运行写入数据库，数据来源与对应版本见文件头
- 标题栏显示内置数据对应的软件版本
- 新增「更新内置数据」按钮，可用内置数据恢复默认（保留自定义软件）

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