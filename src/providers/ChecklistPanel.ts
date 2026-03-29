import * as vscode from 'vscode';
import { detectFileType, getFileTypeLabel } from '../utils/detector';
import { getMessages } from '../utils/config';
import { I18nMessages } from '../i18n/types';

interface CheckItem {
  condition: boolean;
  message: string;
  severity: 'error' | 'warning' | 'info';
}

/**
 * Laravel Checklist Panel
 * WebviewView untuk menampilkan checklist code quality Laravel
 */
export class LaravelChecklistPanel implements vscode.WebviewViewProvider, vscode.Disposable {
  public static readonly viewType = 'laravelTutor.checklist';
  private _view?: vscode.WebviewView;
  private _debounceTimer?: NodeJS.Timeout;

  constructor(private readonly _extensionUri: vscode.Uri) {}

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ): void {
    this._view = webviewView;
    
    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this._extensionUri]
    };
    
    // Set initial HTML with CSP
    webviewView.webview.html = this.getHtmlContent('<div class="loading">Loading checklist...</div>');
    
    // Update webview after resolve
    this.updateWebview();
  }

  /**
   * Update webview content dengan debounce
   */
  public updateWebview(): void {
    if (this._debounceTimer) {
      clearTimeout(this._debounceTimer);
    }

    this._debounceTimer = setTimeout(() => {
      this._doUpdateWebview();
    }, 300); // 300ms debounce
  }

  /**
   * Actual webview update logic
   */
  private _doUpdateWebview(): void {
    if (!this._view) { 
      return; 
    }

    const editor = vscode.window.activeTextEditor;
    const messages = getMessages();

    // No active editor or not PHP
    if (!editor || editor.document.languageId !== 'php') {
      this._view.webview.html = this.getHtmlContent(`
        <div class="empty-state">
          <div class="icon">📂</div>
          <p>${messages.panel_empty_title}</p>
          <p class="hint">${messages.panel_empty_hint}</p>
        </div>
      `);
      return;
    }

    const doc = editor.document;
    const fileType = detectFileType(doc);
    const text = doc.getText();

    // Unknown Laravel file type
    if (fileType === 'unknown') {
      this._view.webview.html = this.getHtmlContent(`
        <div class="warning-state">
          <div class="icon">⚠️</div>
          <p>${messages.panel_unknown_title}</p>
          <p class="hint">${messages.panel_unknown_hint}</p>
        </div>
      `);
      return;
    }

    // Build checklist
    let checks: CheckItem[] = [];
    
    switch (fileType) {
      case 'migration':
        checks = this.getMigrationChecks(text, messages);
        break;
      case 'model':
        checks = this.getModelChecks(text, messages);
        break;
      case 'controller':
        checks = this.getControllerChecks(text, messages);
        break;
      case 'route':
        checks = this.getRouteChecks(text, messages);
        break;
    }

    // Build HTML
    let html = `<div class="header">
      <h3>📋 Checklist ${getFileTypeLabel(fileType)}</h3>
    </div>`;
    
    html += `<ul class="checklist">`;
    
    for (const check of checks) {
      const icon = check.condition ? '✅' : '❌';
      let colorClass: string;
      if (check.condition) {
        colorClass = 'pass';
      } else {
        switch (check.severity) {
          case 'error':
            colorClass = 'fail';
            break;
          case 'warning':
            colorClass = 'warning';
            break;
          case 'info':
            colorClass = 'info';
            break;
          default:
            colorClass = 'warning';
        }
      }
      html += `<li class="${colorClass}">${icon} ${check.message}</li>`;
    }
    
    html += `</ul>`;
    
    // Calculate and add score
    const score = this.calculateScoreFromChecks(checks);
    html += `<div class="score">${messages.panel_score}: ${score}/100</div>`;
    
    this._view.webview.html = this.getHtmlContent(html);
  }

  /**
   * Calculate score from check items
   */
  private calculateScoreFromChecks(checks: CheckItem[]): number {
    if (checks.length === 0) return 100;
    
    let score = 0;
    for (const check of checks) {
      if (check.condition) {
        score += 100;
      } else if (check.severity === 'info') {
        score += 50; // Info items that fail still give partial score
      }
      // error and warning that fail give 0
    }
    
    return Math.round(score / checks.length);
  }

  /**
   * Migration checks
   */
  private getMigrationChecks(text: string, messages: I18nMessages): CheckItem[] {
    return [
      {
        condition: text.includes('$table->id()') || text.includes('$table->increments()'),
        message: messages.check_has_primary_key,
        severity: 'error'
      },
      {
        condition: text.includes('$table->timestamps()'),
        message: messages.check_has_timestamps,
        severity: 'info'
      },
      {
        condition: !text.includes('foreignId') || text.includes('->constrained()'),
        message: messages.check_foreign_constrained,
        severity: 'warning'
      },
      {
        condition: (() => {
          const match = text.match(/Schema::create\s*\(\s*['"]([a-z_][a-z0-9_]*)['"]/);
          return match !== null && /^[a-z_][a-z0-9_]*$/.test(match[1]) && match[1].endsWith('s');
        })(),
        message: messages.check_snake_case,
        severity: 'warning'
      },
      {
        condition: !text.match(/\b(dd|dump|var_dump)\s*\(/),
        message: messages.check_no_debug,
        severity: 'error'
      }
    ];
  }

  /**
   * Model checks
   */
  private getModelChecks(text: string, messages: I18nMessages): CheckItem[] {
    return [
      {
        condition: text.includes('$fillable') || text.includes('$guarded'),
        message: messages.check_has_fillable,
        severity: 'error'
      },
      {
        condition: !(text.includes('$fillable') && text.includes('$guarded')),
        message: messages.check_fillable_guarded_not_both,
        severity: 'error'
      },
      {
        condition: text.includes('$casts'),
        message: messages.check_has_casts,
        severity: 'info'
      },
      {
        condition: (() => {
          const relationRegex = /public function ([a-z][a-zA-Z0-9]*)\s*\(\).*\b(hasMany|hasOne|belongsTo|belongsToMany)\b/g;
          const matches = [...text.matchAll(relationRegex)];
          return matches.length === 0 || matches.every(m => /^[a-z][a-zA-Z0-9]*$/.test(m[1]));
        })(),
        message: messages.check_relation_camel,
        severity: 'warning'
      },
      {
        condition: !text.match(/\b(dd|dump|var_dump)\s*\(/),
        message: messages.check_no_debug,
        severity: 'error'
      }
    ];
  }

  /**
   * Controller checks
   */
  private getControllerChecks(text: string, messages: I18nMessages): CheckItem[] {
    return [
      {
        condition: text.includes('$request->validate') || text.includes('FormRequest'),
        message: messages.check_has_validation,
        severity: 'error'
      },
      {
        condition: !text.includes('$request->all()') || text.includes('$request->validate') || text.includes('$request->validated()'),
        message: messages.check_no_all_without_validation,
        severity: 'warning'
      },
      {
        condition: !text.match(/\b(dd|dump|var_dump)\s*\(/),
        message: messages.check_no_debug,
        severity: 'error'
      },
      {
        condition: text.includes('return view(') || text.includes('response()->json(') || text.includes('return redirect(') || text.includes('return back('),
        message: messages.check_response_type,
        severity: 'info'
      }
    ];
  }

  /**
   * Route checks
   */
  private getRouteChecks(text: string, messages: I18nMessages): CheckItem[] {
    return [
      {
        condition: text.includes('Route::'),
        message: messages.check_uses_route_facade,
        severity: 'info'
      },
      {
        condition: (() => {
          const routes = [...text.matchAll(/Route::(get|post|put|patch|delete)\s*\(/g)];
          return routes.length > 0;
        })(),
        message: messages.check_defines_routes,
        severity: 'info'
      },
      {
        condition: (() => {
          // Check if routes have names - look at each route block
          const routeMatches = [...text.matchAll(/Route::(get|post|put|patch|delete)\s*\([^;]+/g)];
          if (routeMatches.length === 0) return true;
          return routeMatches.every(match => match[0].includes('->name('));
        })(),
        message: messages.check_routes_have_names,
        severity: 'warning'
      },
      {
        condition: !text.match(/\b(dd|dump|var_dump)\s*\(/),
        message: messages.check_no_debug,
        severity: 'error'
      }
    ];
  }

  /**
   * Get HTML content with proper styling and CSP
   */
  private getHtmlContent(body: string): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline';">
    <title>Laravel Tutor Checklist</title>
    <style>
      :root {
        --bg-color: var(--vscode-sideBar-background, #252526);
        --text-color: var(--vscode-sideBar-foreground, #cccccc);
        --pass-color: var(--vscode-testing-iconPassed, #4caf50);
        --fail-color: var(--vscode-testing-iconFailed, #f44336);
        --warning-color: var(--vscode-editor-warning-foreground, #ffa500);
        --info-color: var(--vscode-editor-info-foreground, #3794ff);
        --border-color: var(--vscode-widget-border, #454545);
      }
      
      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }
      
      body {
        font-family: var(--vscode-font-family, sans-serif);
        font-size: var(--vscode-font-size, 13px);
        padding: 12px;
        color: var(--text-color);
        background: var(--bg-color);
        line-height: 1.5;
      }
      
      .header h3 {
        font-size: 14px;
        font-weight: 600;
        margin-bottom: 12px;
        color: var(--vscode-sideBarSectionHeader-foreground, #ffffff);
        border-bottom: 1px solid var(--border-color);
        padding-bottom: 8px;
      }
      
      .checklist {
        list-style: none;
        padding: 0;
        margin: 0;
      }
      
      .checklist li {
        padding: 6px 0;
        font-size: 12px;
        display: flex;
        align-items: flex-start;
        gap: 8px;
      }
      
      .checklist li.pass {
        color: var(--pass-color);
      }
      
      .checklist li.fail {
        color: var(--fail-color);
      }
      
      .checklist li.warning {
        color: var(--warning-color);
      }
      
      .checklist li.info {
        color: var(--info-color);
      }
      
      .score {
        margin-top: 16px;
        padding: 8px 12px;
        background: var(--vscode-badge-background, #007acc);
        color: var(--vscode-badge-foreground, #ffffff);
        border-radius: 4px;
        text-align: center;
        font-weight: 600;
        font-size: 14px;
      }
      
      .empty-state,
      .warning-state {
        text-align: center;
        padding: 20px 10px;
        color: var(--vscode-descriptionForeground, #858585);
      }
      
      .empty-state .icon,
      .warning-state .icon {
        font-size: 48px;
        margin-bottom: 12px;
      }
      
      .empty-state p,
      .warning-state p {
        margin-bottom: 8px;
      }
      
      .hint {
        font-size: 11px;
        color: var(--vscode-descriptionForeground, #858585);
      }
      
      .loading {
        text-align: center;
        padding: 20px;
        color: var(--vscode-descriptionForeground, #858585);
      }
    </style>
</head>
<body>${body}</body>
</html>`;
  }

  public dispose(): void {
    if (this._debounceTimer) {
      clearTimeout(this._debounceTimer);
    }
  }
}
