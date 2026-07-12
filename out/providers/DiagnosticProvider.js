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
exports.LaravelDiagnosticProvider = void 0;
const vscode = __importStar(require("vscode"));
const detector_1 = require("../utils/detector");
const config_1 = require("../utils/config");
/**
 * Laravel Diagnostic Provider
 * Memberikan warning/error/info otomatis untuk code quality Laravel
 */
class LaravelDiagnosticProvider {
    constructor() {
        this.disposables = [];
        this.collection = vscode.languages.createDiagnosticCollection('laravelTutor');
        this.disposables.push(this.collection);
    }
    updateDiagnostics(document) {
        if (document.languageId !== 'php') {
            this.collection.delete(document.uri);
            return;
        }
        const fileType = (0, detector_1.detectFileType)(document);
        const messages = (0, config_1.getMessages)();
        const diagnostics = [];
        switch (fileType) {
            case 'migration':
                diagnostics.push(...this.checkMigration(document, messages));
                break;
            case 'model':
                diagnostics.push(...this.checkModel(document, messages));
                break;
            case 'controller':
                diagnostics.push(...this.checkController(document, messages));
                break;
            case 'route':
                diagnostics.push(...this.checkRoute(document, messages));
                break;
        }
        if (diagnostics.length === 0) {
            this.collection.delete(document.uri);
        }
        else {
            this.collection.set(document.uri, diagnostics);
        }
    }
    /**
     * Check migration files for common issues
     */
    checkMigration(document, messages) {
        const diagnostics = [];
        const text = document.getText();
        // Check: No timestamps (Warning)
        if (text.includes('Schema::create') && !text.includes('$table->timestamps()')) {
            const range = this.findLineRange(document, 'Schema::create');
            if (range) {
                diagnostics.push(this.createDiagnostic(range, messages.diag_no_timestamps, vscode.DiagnosticSeverity.Information));
            }
        }
        // Check: No constrained on foreignId (Warning) - improved detection
        // Find all foreignId occurrences and check if they have constrained on same or next line
        const foreignIdRegex = /\$table->foreignId\s*\(\s*['"][^'"]+['"]\s*\)/g;
        let foreignMatch;
        while ((foreignMatch = foreignIdRegex.exec(text)) !== null) {
            const startIdx = foreignMatch.index;
            const endIdx = startIdx + foreignMatch[0].length;
            // Check next 200 characters for ->constrained() (could be on same line or chained)
            const afterForeignId = text.substring(endIdx, endIdx + 200);
            const beforeNextStatement = afterForeignId.split(';')[0];
            if (!beforeNextStatement.includes('->constrained()')) {
                const pos = document.positionAt(startIdx);
                const endPos = document.positionAt(endIdx);
                const range = new vscode.Range(pos, endPos);
                diagnostics.push(this.createDiagnostic(range, messages.diag_no_constrained, vscode.DiagnosticSeverity.Warning));
            }
        }
        // Check: Not snake_case table name (Warning)
        const tableMatch = text.match(/Schema::create\s*\(\s*['"]([A-Za-z0-9_]+)['"]/);
        if (tableMatch) {
            const tableName = tableMatch[1];
            // Check if not snake_case (has uppercase) or not plural (doesn't end with 's')
            if (/[A-Z]/.test(tableName)) {
                const range = this.findLineRange(document, tableName);
                if (range) {
                    diagnostics.push(this.createDiagnostic(range, messages.diag_not_snake_case, vscode.DiagnosticSeverity.Warning));
                }
            }
        }
        // Check: Text column using string() instead of text() (Information)
        const longTextColumns = ['description', 'content', 'body', 'notes', 'details', 'message', 'bio', 'summary', 'excerpt'];
        const stringColRegex = /\$table->string\s*\(\s*['"]([^'"]+)['"]/g;
        let stringMatch;
        while ((stringMatch = stringColRegex.exec(text)) !== null) {
            const colName = stringMatch[1].toLowerCase();
            if (longTextColumns.some(col => colName.includes(col))) {
                const startIdx = stringMatch.index;
                const endIdx = startIdx + stringMatch[0].length;
                const pos = document.positionAt(startIdx);
                const endPos = document.positionAt(endIdx);
                const range = new vscode.Range(pos, endPos);
                diagnostics.push(this.createDiagnostic(range, messages.diag_use_text_instead, vscode.DiagnosticSeverity.Information));
            }
        }
        // Check: No primary key (Error)
        if (text.includes('Schema::create') && !text.includes('$table->id()') && !text.includes('$table->increments()') && !text.includes('$table->bigIncrements()')) {
            const range = this.findLineRange(document, 'Schema::create');
            if (range) {
                diagnostics.push(this.createDiagnostic(range, messages.diag_no_primary_key, vscode.DiagnosticSeverity.Error));
            }
        }
        // Check: Debug statements
        this.checkDebugStatements(document, text, messages, diagnostics);
        return diagnostics;
    }
    /**
     * Check model files for common issues
     */
    checkModel(document, messages) {
        const diagnostics = [];
        const text = document.getText();
        // Check: Fillable & guarded conflict (Error)
        if (text.includes('$fillable') && text.includes('$guarded')) {
            const range = this.findLineRange(document, '$fillable');
            if (range) {
                diagnostics.push(this.createDiagnostic(range, messages.diag_fillable_guarded_conflict, vscode.DiagnosticSeverity.Error));
            }
        }
        // Check: No mass protection (Warning)
        const hasClass = text.includes('class ') && text.includes('extends Model');
        if (hasClass && !text.includes('$fillable') && !text.includes('$guarded')) {
            // Find the class declaration line
            const classMatch = text.match(/class\s+\w+\s+extends\s+Model/);
            if (classMatch) {
                const range = this.findLineRange(document, classMatch[0]);
                if (range) {
                    diagnostics.push(this.createDiagnostic(range, messages.diag_no_mass_protection, vscode.DiagnosticSeverity.Warning));
                }
            }
        }
        // Check: Relation method not camelCase (Warning)
        const relationMethods = ['hasMany', 'hasOne', 'belongsTo', 'belongsToMany', 'morphMany', 'morphOne', 'morphToMany', 'morphedByMany'];
        for (const relation of relationMethods) {
            const regex = new RegExp(`public\\s+function\\s+([a-z_]+)\\s*\\([^)]*\\)\\s*[^{]*\\{[^}]*\\$this->${relation}`, 'gs');
            const matches = [...text.matchAll(regex)];
            for (const match of matches) {
                const funcName = match[1];
                // Check if not camelCase (has underscore)
                if (funcName.includes('_')) {
                    const range = this.findLineRange(document, `function ${funcName}`);
                    if (range) {
                        diagnostics.push(this.createDiagnostic(range, messages.diag_relation_not_camel, vscode.DiagnosticSeverity.Warning));
                    }
                }
            }
        }
        // Check: Debug statements
        this.checkDebugStatements(document, text, messages, diagnostics);
        return diagnostics;
    }
    /**
     * Check controller files for common issues
     */
    checkController(document, messages) {
        const diagnostics = [];
        const text = document.getText();
        // Check: No validation before using $request->all() (Warning)
        if (text.includes('$request->all()') && !text.includes('$request->validate') && !text.includes('$request->validated()')) {
            const range = this.findLineRange(document, '$request->all()');
            if (range) {
                diagnostics.push(this.createDiagnostic(range, messages.diag_no_validation, vscode.DiagnosticSeverity.Warning));
            }
        }
        // Check: API method returns view instead of JSON (Information)
        const isApiController = text.includes('ApiController') || (text.includes('Controller') && text.includes('api'));
        if (isApiController && text.includes('return view(') && !text.includes('return response()->json(')) {
            const range = this.findLineRange(document, 'return view');
            if (range) {
                diagnostics.push(this.createDiagnostic(range, messages.diag_api_returns_view, vscode.DiagnosticSeverity.Information));
            }
        }
        // Check: Debug statements
        this.checkDebugStatements(document, text, messages, diagnostics);
        return diagnostics;
    }
    /**
     * Check for debug statements in any file type
     */
    checkDebugStatements(document, _text, messages, diagnostics) {
        const debugPatterns = [
            /\bdd\s*\(/g,
            /\bdump\s*\(/g,
            /\bvar_dump\s*\(/g,
            /\bprint_r\s*\(/g,
        ];
        // Scan per baris supaya kita bisa membuang bagian komentar & string.
        // Statement debug adalah PHP yang valid (bukan syntax error), jadi cukup
        // Warning — bukan Error — supaya tidak terkesan kode user "rusak".
        for (let lineNum = 0; lineNum < document.lineCount; lineNum++) {
            const rawLine = document.lineAt(lineNum).text;
            const scannable = this.maskCommentsAndStrings(rawLine);
            for (const pattern of debugPatterns) {
                pattern.lastIndex = 0;
                let match;
                while ((match = pattern.exec(scannable)) !== null) {
                    const startIdx = match.index;
                    const endIdx = startIdx + match[0].length - 1; // exclude opening paren
                    const range = new vscode.Range(new vscode.Position(lineNum, startIdx), new vscode.Position(lineNum, endIdx));
                    diagnostics.push(this.createDiagnostic(range, messages.diag_debug_statement, vscode.DiagnosticSeverity.Warning));
                }
            }
        }
    }
    /**
     * Mengganti isi komentar (// # ) dan string literal ('...' / "...") pada satu
     * baris dengan spasi, sambil mempertahankan panjang & offset kolom.
     * Tujuannya agar pattern matching tidak false-positive di dalam komentar/string,
     * mis. `// pakai dd() buat debug` atau `$x = "print_r";`.
     */
    maskCommentsAndStrings(line) {
        const chars = line.split('');
        let inSingle = false;
        let inDouble = false;
        for (let i = 0; i < chars.length; i++) {
            const ch = chars[i];
            if (inSingle) {
                if (ch === '\\') {
                    chars[i] = ' ';
                    if (i + 1 < chars.length) {
                        chars[i + 1] = ' ';
                    }
                    i++;
                    continue;
                }
                if (ch === "'") {
                    inSingle = false;
                }
                chars[i] = ' ';
                continue;
            }
            if (inDouble) {
                if (ch === '\\') {
                    chars[i] = ' ';
                    if (i + 1 < chars.length) {
                        chars[i + 1] = ' ';
                    }
                    i++;
                    continue;
                }
                if (ch === '"') {
                    inDouble = false;
                }
                chars[i] = ' ';
                continue;
            }
            // Awal komentar satu baris: //, #  → buang sisa baris
            if ((ch === '/' && chars[i + 1] === '/') || ch === '#') {
                for (let j = i; j < chars.length; j++) {
                    chars[j] = ' ';
                }
                break;
            }
            if (ch === "'") {
                inSingle = true;
                chars[i] = ' ';
                continue;
            }
            if (ch === '"') {
                inDouble = true;
                chars[i] = ' ';
                continue;
            }
        }
        return chars.join('');
    }
    /**
     * Check route files for common issues
     */
    checkRoute(document, messages) {
        const diagnostics = [];
        const text = document.getText();
        // Check: Route without name (Information)
        const routeMatches = text.matchAll(/Route::(get|post|put|patch|delete)\s*\(\s*['"][^'"]+['"]/g);
        for (const match of routeMatches) {
            const lineStart = text.substring(0, match.index).split('\n').length - 1;
            const line = document.lineAt(lineStart);
            // Check if this route has ->name()
            const routeBlock = this.getRouteBlock(text, match.index ?? 0);
            if (!routeBlock.includes('->name(')) {
                const range = new vscode.Range(new vscode.Position(lineStart, 0), new vscode.Position(lineStart, line.text.length));
                diagnostics.push(this.createDiagnostic(range, messages.diag_route_no_name, vscode.DiagnosticSeverity.Information));
            }
        }
        return diagnostics;
    }
    /**
     * Get the full route definition block (including chained methods)
     */
    getRouteBlock(text, startIndex) {
        const substring = text.substring(startIndex);
        const lines = substring.split('\n');
        let block = '';
        let parenCount = 0;
        for (const line of lines) {
            block += line + '\n';
            parenCount += (line.match(/\(/g) || []).length;
            parenCount -= (line.match(/\)/g) || []).length;
            if (parenCount <= 0 && line.includes(');')) {
                break;
            }
            if (block.length > 500) { // Safety limit
                break;
            }
        }
        return block;
    }
    /**
     * Find the range of a line containing the keyword
     * Returns null if keyword not found
     */
    findLineRange(document, keyword) {
        const text = document.getText();
        const index = text.indexOf(keyword);
        if (index === -1) {
            return null;
        }
        const pos = document.positionAt(index);
        const keywordEnd = index + keyword.length;
        const keywordEndPos = document.positionAt(keywordEnd);
        // Return exact keyword range
        return new vscode.Range(pos, keywordEndPos);
    }
    /**
     * Create a diagnostic with proper formatting
     */
    createDiagnostic(range, message, severity) {
        const diagnostic = new vscode.Diagnostic(range, message, severity);
        diagnostic.source = 'Laravel Tutor';
        diagnostic.code = 'laravel-tutor';
        return diagnostic;
    }
    dispose() {
        this.disposables.forEach(d => d.dispose());
        this.disposables = [];
    }
}
exports.LaravelDiagnosticProvider = LaravelDiagnosticProvider;
//# sourceMappingURL=DiagnosticProvider.js.map