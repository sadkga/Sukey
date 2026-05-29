// preload.js - Sukey 预加载脚本
// 用于读取本地快捷键数据文件

const fs = require('fs');
const path = require('path');

// 数据目录
const dataDir = path.join(__dirname, 'data');

// 读取快捷键数据
function loadShortcutData(software) {
    try {
        const filePath = path.join(dataDir, `${software}.json`);
        if (fs.existsSync(filePath)) {
            const content = fs.readFileSync(filePath, 'utf-8');
            return JSON.parse(content);
        }
    } catch (err) {
        // silent fail
    }
    return null;
}

// 获取所有可用软件列表
function getAvailableSoftware() {
    try {
        if (!fs.existsSync(dataDir)) {
            return [];
        }
        const files = fs.readdirSync(dataDir);
        return files
            .filter(f => f.endsWith('.json'))
            .map(f => f.replace('.json', ''));
    } catch (err) {
        return [];
    }
}

// 导出 API
window.sukeyApi = {
    loadShortcutData,
    getAvailableSoftware
};