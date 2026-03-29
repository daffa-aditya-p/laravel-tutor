import * as vscode from 'vscode';
import { id } from '../i18n/id';
import { en } from '../i18n/en';
import { I18nMessages } from '../i18n/types';

// Cache untuk performa - hindari call berulang ke workspace config
let cachedLanguage: 'id' | 'en' | null = null;
let cachedMessages: I18nMessages | null = null;

/**
 * Mendapatkan bahasa yang aktif untuk Laravel Tutor
 * @returns 'id' untuk Bahasa Indonesia atau 'en' untuk English
 */
export function getLanguage(): 'id' | 'en' {
  if (cachedLanguage !== null) {
    return cachedLanguage;
  }
  
  const config = vscode.workspace.getConfiguration('laravelTutor');
  cachedLanguage = config.get<'id' | 'en'>('language', 'id');
  return cachedLanguage;
}

/**
 * Mengatur bahasa Laravel Tutor
 * @param lang Bahasa yang dipilih ('id' atau 'en')
 */
export function setLanguage(lang: 'id' | 'en'): Thenable<void> {
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
export function getMessages(): I18nMessages {
  if (cachedMessages !== null) {
    return cachedMessages;
  }
  
  cachedMessages = getLanguage() === 'id' ? id : en;
  return cachedMessages;
}

/**
 * Setup listener untuk perubahan konfigurasi
 * Dipanggil sekali saat activate di extension.ts
 * @returns Disposable yang harus di-dispose saat deactivate
 */
export function setupConfigListener(): vscode.Disposable {
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
export function clearCache(): void {
  cachedLanguage = null;
  cachedMessages = null;
}
