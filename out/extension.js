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
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const config_1 = require("./utils/config");
const HoverProvider_1 = require("./providers/HoverProvider");
const InlayHintProvider_1 = require("./providers/InlayHintProvider");
const DiagnosticProvider_1 = require("./providers/DiagnosticProvider");
const ChecklistPanel_1 = require("./providers/ChecklistPanel");
/**
 * Laravel Tutor Extension
 *
 * Extension VSCode untuk membantu developer pemula belajar Laravel 13
 * dengan inline hints, tooltips, diagnostics, dan checklist interaktif.
 *
 * Fitur:
 * - Hover Provider: Tooltip penjelasan method Laravel
 * - Inlay Hint Provider: Ghost text inline di dalam kode
 * - Diagnostic Provider: Warning/error otomatis
 * - Checklist Panel: Panel WebviewView real-time
 * - Bilingual: Bahasa Indonesia & English
 */
let diagnosticProvider;
let hoverProvider;
let inlayProvider;
let checklistProvider;
let statusBarItem;
function activate(context) {
    console.log('Laravel Tutor is now active! 🌱');
    // ============================================
    // INITIALIZE PROVIDERS
    // ============================================
    diagnosticProvider = new DiagnosticProvider_1.LaravelDiagnosticProvider();
    hoverProvider = new HoverProvider_1.LaravelHoverProvider();
    inlayProvider = new InlayHintProvider_1.LaravelInlayHintProvider();
    checklistProvider = new ChecklistPanel_1.LaravelChecklistPanel(context.extensionUri);
    // ============================================
    // SUBSCRIBE PROVIDERS FOR DISPOSAL
    // ============================================
    context.subscriptions.push(diagnosticProvider, hoverProvider, inlayProvider, checklistProvider);
    // ============================================
    // SETUP CONFIG LISTENER
    // ============================================
    const configListener = (0, config_1.setupConfigListener)();
    context.subscriptions.push(configListener);
    // Refresh ghost text saat setting laravelTutor.inlayHints di-toggle,
    // supaya perubahan langsung terlihat tanpa perlu edit file dulu.
    const inlayConfigListener = vscode.workspace.onDidChangeConfiguration(e => {
        if (e.affectsConfiguration('laravelTutor.inlayHints')) {
            inlayProvider.refresh();
        }
    });
    context.subscriptions.push(inlayConfigListener);
    // ============================================
    // CREATE STATUS BAR ITEM
    // ============================================
    statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBarItem.command = 'laravelTutor.toggleLanguage';
    statusBarItem.tooltip = 'Laravel Tutor - Click to toggle language (ID/EN)';
    context.subscriptions.push(statusBarItem);
    // ============================================
    // REGISTER TOGGLE LANGUAGE COMMAND
    // ============================================
    const toggleCmd = vscode.commands.registerCommand('laravelTutor.toggleLanguage', async () => {
        const current = (0, config_1.getLanguage)();
        const nextResult = current === 'id' ? 'en' : 'id';
        try {
            await (0, config_1.setLanguage)(nextResult);
            // Clear cache to force refresh
            (0, config_1.clearCache)();
            // Update status bar
            updateStatusBar();
            // Show notification
            vscode.window.showInformationMessage(`Laravel Tutor: Language set to ${nextResult.toUpperCase()}`);
            // Refresh all providers
            refreshAllProviders();
        }
        catch (error) {
            vscode.window.showErrorMessage(`Failed to toggle language: ${error}`);
        }
    });
    context.subscriptions.push(toggleCmd);
    // ============================================
    // REGISTER WEBVIEW PROVIDER
    // ============================================
    const webviewReg = vscode.window.registerWebviewViewProvider(ChecklistPanel_1.LaravelChecklistPanel.viewType, checklistProvider);
    context.subscriptions.push(webviewReg);
    // ============================================
    // REGISTER LANGUAGE PROVIDERS
    // ============================================
    const hoverReg = vscode.languages.registerHoverProvider({ scheme: 'file', language: 'php' }, hoverProvider);
    const inlayReg = vscode.languages.registerInlayHintsProvider({ scheme: 'file', language: 'php' }, inlayProvider);
    context.subscriptions.push(hoverReg, inlayReg);
    // ============================================
    // DOCUMENT CHANGE LISTENER
    // ============================================
    const docChangeListener = vscode.workspace.onDidChangeTextDocument(event => {
        try {
            diagnosticProvider.updateDiagnostics(event.document);
            checklistProvider.updateWebview();
        }
        catch (error) {
            console.error('Error updating diagnostics on document change:', error);
        }
    });
    context.subscriptions.push(docChangeListener);
    // ============================================
    // ACTIVE EDITOR CHANGE LISTENER
    // ============================================
    const editorChangeListener = vscode.window.onDidChangeActiveTextEditor(editor => {
        try {
            if (editor) {
                diagnosticProvider.updateDiagnostics(editor.document);
                checklistProvider.updateWebview();
                updateStatusBar();
            }
            else {
                statusBarItem.hide();
            }
        }
        catch (error) {
            console.error('Error on editor change:', error);
        }
    });
    context.subscriptions.push(editorChangeListener);
    // ============================================
    // INITIAL UPDATE
    // ============================================
    updateStatusBar();
    if (vscode.window.activeTextEditor) {
        diagnosticProvider.updateDiagnostics(vscode.window.activeTextEditor.document);
    }
}
/**
 * Update status bar text based on current language
 */
function updateStatusBar() {
    const editor = vscode.window.activeTextEditor;
    if (!editor || editor.document.languageId !== 'php') {
        statusBarItem.hide();
        return;
    }
    const messages = (0, config_1.getMessages)();
    statusBarItem.text = messages.status_bar_label;
    statusBarItem.show();
}
/**
 * Refresh all providers after language change
 */
function refreshAllProviders() {
    try {
        // Refresh diagnostics
        if (vscode.window.activeTextEditor) {
            diagnosticProvider.updateDiagnostics(vscode.window.activeTextEditor.document);
        }
        // Refresh checklist
        checklistProvider.updateWebview();
        // Paksa inlay hints (ghost text) di-refresh agar ikut ganti bahasa.
        // Hover auto-refresh di hover berikutnya karena baca getLanguage() tiap request.
        inlayProvider.refresh();
    }
    catch (error) {
        console.error('Error refreshing providers:', error);
    }
}
function deactivate() {
    console.log('Laravel Tutor deactivated');
    // Cleanup is handled by context.subscriptions
    // All providers implement Disposable and will be cleaned up automatically
}
//# sourceMappingURL=extension.js.map