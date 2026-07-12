import * as vscode from 'vscode';
import { getLanguage, setLanguage, getMessages, setupConfigListener, clearCache } from './utils/config';
import { LaravelHoverProvider } from './providers/HoverProvider';
import { LaravelInlayHintProvider } from './providers/InlayHintProvider';
import { LaravelDiagnosticProvider } from './providers/DiagnosticProvider';
import { LaravelChecklistPanel } from './providers/ChecklistPanel';

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

let diagnosticProvider: LaravelDiagnosticProvider;
let hoverProvider: LaravelHoverProvider;
let inlayProvider: LaravelInlayHintProvider;
let checklistProvider: LaravelChecklistPanel;
let statusBarItem: vscode.StatusBarItem;

export function activate(context: vscode.ExtensionContext) {
  console.log('Laravel Tutor is now active! 🌱');

  // ============================================
  // INITIALIZE PROVIDERS
  // ============================================
  diagnosticProvider = new LaravelDiagnosticProvider();
  hoverProvider = new LaravelHoverProvider();
  inlayProvider = new LaravelInlayHintProvider();
  checklistProvider = new LaravelChecklistPanel(context.extensionUri);

  // ============================================
  // SUBSCRIBE PROVIDERS FOR DISPOSAL
  // ============================================
  context.subscriptions.push(
    diagnosticProvider,
    hoverProvider,
    inlayProvider,
    checklistProvider
  );

  // ============================================
  // SETUP CONFIG LISTENER
  // ============================================
  const configListener = setupConfigListener();
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
    const current = getLanguage();
    const nextResult = current === 'id' ? 'en' : 'id';
    
    try {
      await setLanguage(nextResult);
      
      // Clear cache to force refresh
      clearCache();
      
      // Update status bar
      updateStatusBar();
      
      // Show notification
      vscode.window.showInformationMessage(`Laravel Tutor: Language set to ${nextResult.toUpperCase()}`);
      
      // Refresh all providers
      refreshAllProviders();
    } catch (error) {
      vscode.window.showErrorMessage(`Failed to toggle language: ${error}`);
    }
  });
  context.subscriptions.push(toggleCmd);

  // ============================================
  // REGISTER WEBVIEW PROVIDER
  // ============================================
  const webviewReg = vscode.window.registerWebviewViewProvider(
    LaravelChecklistPanel.viewType,
    checklistProvider
  );
  context.subscriptions.push(webviewReg);

  // ============================================
  // REGISTER LANGUAGE PROVIDERS
  // ============================================
  const hoverReg = vscode.languages.registerHoverProvider(
    { scheme: 'file', language: 'php' },
    hoverProvider
  );
  
  const inlayReg = vscode.languages.registerInlayHintsProvider(
    { scheme: 'file', language: 'php' },
    inlayProvider
  );
  
  context.subscriptions.push(hoverReg, inlayReg);

  // ============================================
  // DOCUMENT CHANGE LISTENER
  // ============================================
  const docChangeListener = vscode.workspace.onDidChangeTextDocument(event => {
    try {
      diagnosticProvider.updateDiagnostics(event.document);
      checklistProvider.updateWebview();
    } catch (error) {
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
      } else {
        statusBarItem.hide();
      }
    } catch (error) {
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
function updateStatusBar(): void {
  const editor = vscode.window.activeTextEditor;
  if (!editor || editor.document.languageId !== 'php') {
    statusBarItem.hide();
    return;
  }
  const messages = getMessages();
  statusBarItem.text = messages.status_bar_label;
  statusBarItem.show();
}

/**
 * Refresh all providers after language change
 */
function refreshAllProviders(): void {
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
  } catch (error) {
    console.error('Error refreshing providers:', error);
  }
}

export function deactivate(): void {
  console.log('Laravel Tutor deactivated');
  // Cleanup is handled by context.subscriptions
  // All providers implement Disposable and will be cleaned up automatically
}
