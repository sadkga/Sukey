// preload.js - Sukey 预加载脚本
// 用于读取本地快捷键数据文件

const fs = require('fs');
const path = require('path');
const os = require('os');

// 数据目录
const dataDir = path.join(__dirname, 'data');

// 读取软件映射配置
function loadSoftwareMapping() {
    try {
        const filePath = path.join(dataDir, 'software-mapping.json');
        if (fs.existsSync(filePath)) {
            const content = fs.readFileSync(filePath, 'utf-8');
            return JSON.parse(content);
        }
    } catch (err) {
        // silent fail
    }
    return { softwareMapping: {} };
}

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
            .filter(f => f.endsWith('.json') && f !== 'software-mapping.json')
            .map(f => f.replace('.json', ''));
    } catch (err) {
        return [];
    }
}

// 解析默认备份目录：优先系统下载目录，取不到时退回用户主目录
function resolveDefaultSaveDir() {
    try {
        if (typeof utools !== 'undefined' && typeof utools.getPath === 'function') {
            const dir = utools.getPath('downloads');
            if (dir && fs.existsSync(dir)) return dir;
        }
    } catch (err) {
        // 取不到就用主目录
    }
    return os.homedir();
}

// 把文本内容写到指定文件；未指定 filePath 时写入下载目录下的自动命名文件
// 返回 { ok, filePath, error }
function saveTextFile(content, filePath, suggestedName) {
    try {
        let target = typeof filePath === 'string' && filePath.trim() ? filePath.trim() : '';
        if (!target) {
            const stamp = new Date().toISOString().replace(/[:.]/g, '-').replace('T', '_').slice(0, 19);
            const name = (typeof suggestedName === 'string' && suggestedName.trim())
                ? suggestedName.trim()
                : `sukey-backup-${stamp}.json`;
            target = path.join(resolveDefaultSaveDir(), name);
        }
        const dir = path.dirname(target);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(target, String(content == null ? '' : content), 'utf-8');
        return { ok: true, filePath: target };
    } catch (err) {
        return { ok: false, error: err && err.message ? err.message : String(err) };
    }
}

// 从指定文件读取文本内容
// 返回 { ok, content, filePath, error }
function readTextFile(filePath) {
    try {
        if (typeof filePath !== 'string' || !filePath.trim()) {
            return { ok: false, error: '缺少文件路径' };
        }
        const target = filePath.trim();
        if (!fs.existsSync(target)) {
            return { ok: false, error: `文件不存在: ${target}` };
        }
        const content = fs.readFileSync(target, 'utf-8');
        return { ok: true, content, filePath: target };
    } catch (err) {
        return { ok: false, error: err && err.message ? err.message : String(err) };
    }
}

// 导出 API
window.sukeyApi = {
    loadShortcutData,
    loadSoftwareMapping,
    getAvailableSoftware,
    saveTextFile,
    readTextFile
};