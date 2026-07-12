"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLanguage = getLanguage;
exports.setLanguage = setLanguage;
exports.getMessages = getMessages;
exports.getInlayHintsEnabled = getInlayHintsEnabled;
exports.setupConfigListener = setupConfigListener;
exports.clearCache = clearCache;
const vscode = __importStar(require("vscode"));
const id_1 = require("../i18n/id");
const en_1 = require("../i18n/en");
// Cache untuk performa - hindari call berulang ke workspace config
let cachedLanguage = null;
let cachedMessages = null;
/**
 * Mendapatkan bahasa yang aktif untuk Laravel Tutor
 * @returns 'id' untuk Bahasa Indonesia atau 'en' untuk English
 */
function getLanguage() {
    if (cachedLanguage !== null) {
        return cachedLanguage;
    }
    const config = vscode.workspace.getConfiguration('laravelTutor');
    cachedLanguage = config.get('language', 'id');
    return cachedLanguage;
}
/**
 * Mengatur bahasa Laravel Tutor
 * @param lang Bahasa yang dipilih ('id' atau 'en')
 */
function setLanguage(lang) {
    const config = vscode.workspace.getConfiguration('laravelTutor');
    // Invalidate cache
    cachedLanguage = null;
    cachedMessages = null;
    return config.update('language', lang, vscode.ConfigurationTarget.Global);
}
/**
 * Mendapatkan semua pesan i18n untuk bahasa yang aktif
 * @returns Object berisi semua pesan terjemahan
 */
function getMessages() {
    if (cachedMessages !== null) {
        return cachedMessages;
    }
    cachedMessages = getLanguage() === 'id' ? id_1.id : en_1.en;
    return cachedMessages;
}
/**
 * Cek apakah fitur inlay hint (ghost text inline) diaktifkan.
 * Default: false — ghost text mati supaya tidak mengganggu saat mengetik.
 * Penjelasan method tetap tersedia lewat hover.
 * @returns true jika user mengaktifkan lewat setting laravelTutor.inlayHints
 */
function getInlayHintsEnabled() {
    const config = vscode.workspace.getConfiguration('laravelTutor');
    return config.get('inlayHints', false);
}
/**
 * Setup listener untuk perubahan konfigurasi
 * Dipanggil sekali saat activate di extension.ts
 * @returns Disposable yang harus di-dispose saat deactivate
 */
function setupConfigListener() {
    const configDisposable = vscode.workspace.onDidChangeConfiguration(e => {
        if (e.affectsConfiguration('laravelTutor.language')) {
            // Clear cache saat konfigurasi berubah
            cachedLanguage = null;
            cachedMessages = null;
        }
    });
    // Also clear cache when workspace folders change (user opens different project)
    const workspaceDisposable = vscode.workspace.onDidChangeWorkspaceFolders(() => {
        cachedLanguage = null;
        cachedMessages = null;
    });
    return {
        dispose: () => {
            configDisposable.dispose();
            workspaceDisposable.dispose();
        }
    };
}
/**
 * Clear cache manual (dipanggil saat toggle language)
 */
function clearCache() {
    cachedLanguage = null;
    cachedMessages = null;
}
//# sourceMappingURL=config.js.map