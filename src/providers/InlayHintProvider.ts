import * as vscode from 'vscode';
import { detectFileType } from '../utils/detector';
import { getMessages } from '../utils/config';
import { I18nMessages } from '../i18n/types';

/**
 * Laravel Inlay Hint Provider
 * Menampilkan ghost text inline di dalam kode untuk hints dan informasi
 */
export class LaravelInlayHintProvider implements vscode.InlayHintsProvider, vscode.Disposable {
  private readonly MAX_FILE_SIZE = 2000; // Max lines to process for performance

  public provideInlayHints(
    document: vscode.TextDocument,
    range: vscode.Range,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.InlayHint[]> {
    const hints: vscode.InlayHint[] = [];
    const fileType = detectFileType(document);
    const messages = getMessages();

    // Performance guard - skip large files
    if (document.lineCount > this.MAX_FILE_SIZE) {
      return hints;
    }

    // Process lines in the visible range
    for (let lineNum = range.start.line; lineNum <= range.end.line; lineNum++) {
      if (token.isCancellationRequested) {
        return hints;
      }

      const line = document.lineAt(lineNum);
      const text = line.text;

      if (fileType === 'migration') {
        this.addMigrationHints(lineNum, text, messages, hints);
      } else if (fileType === 'route') {
        this.addRouteHints(lineNum, text, messages, hints);
      } else if (fileType === 'model') {
        this.addModelHints(lineNum, text, messages, hints);
      } else if (fileType === 'controller') {
        this.addControllerHints(lineNum, text, messages, hints);
      }
    }

    return hints;
  }

  /**
   * Add inlay hints for migration files
   */
  private addMigrationHints(
    lineNum: number,
    text: string,
    messages: I18nMessages,
    hints: vscode.InlayHint[]
  ): void {
    // Schema::create('table_name', ...)
    const createMatch = text.match(/Schema::create\s*\(\s*['"]([^'"]+)['"]/);
    if (createMatch) {
      const tableName = createMatch[1];
      const pos = new vscode.Position(lineNum, createMatch.index! + createMatch[0].length);
      const hint = new vscode.InlayHint(
        pos,
        `⬆ ${messages.inlay_table_name}`,
        vscode.InlayHintKind.Parameter
      );
      hint.tooltip = new vscode.MarkdownString(`**Table:** \`${tableName}\`\n\nNaming convention: snake_case, plural`);
      hint.paddingLeft = true;
      hints.push(hint);
    }

    // Schema::table('table_name', ...)
    const tableMatch = text.match(/Schema::table\s*\(\s*['"]([^'"]+)['"]/);
    if (tableMatch) {
      const tableName = tableMatch[1];
      const pos = new vscode.Position(lineNum, tableMatch.index! + tableMatch[0].length);
      const hint = new vscode.InlayHint(
        pos,
        `⬆ ${messages.inlay_table_name}`,
        vscode.InlayHintKind.Parameter
      );
      hint.tooltip = new vscode.MarkdownString(`**Modifying Table:** \`${tableName}\``);
      hint.paddingLeft = true;
      hints.push(hint);
    }

    // Column type hints - comprehensive list
    const columnPatterns: Array<{regex: RegExp, type: string, tooltip: string}> = [
      { regex: /\$table->string\s*\(\s*['"]([^'"]+)['"]/, type: 'VARCHAR 255', tooltip: 'VARCHAR(255)' },
      { regex: /\$table->text\s*\(\s*['"]([^'"]+)['"]/, type: 'TEXT', tooltip: 'TEXT (MEDIUMTEXT in MySQL)' },
      { regex: /\$table->longText\s*\(\s*['"]([^'"]+)['"]/, type: 'LONGTEXT', tooltip: 'LONGTEXT (4GB max)' },
      { regex: /\$table->integer\s*\(\s*['"]([^'"]+)['"]/, type: 'INT', tooltip: 'INT (-2,147,483,648 to 2,147,483,647)' },
      { regex: /\$table->bigInteger\s*\(\s*['"]([^'"]+)['"]/, type: 'BIGINT', tooltip: 'BIGINT (very large numbers)' },
      { regex: /\$table->smallInteger\s*\(\s*['"]([^'"]+)['"]/, type: 'SMALLINT', tooltip: 'SMALLINT (-32,768 to 32,767)' },
      { regex: /\$table->tinyInteger\s*\(\s*['"]([^'"]+)['"]/, type: 'TINYINT', tooltip: 'TINYINT (-128 to 127)' },
      { regex: /\$table->boolean\s*\(\s*['"]([^'"]+)['"]/, type: 'BOOLEAN', tooltip: 'BOOLEAN (TINYINT(1) in MySQL)' },
      { regex: /\$table->decimal\s*\(\s*['"]([^'"]+)['"]/, type: 'DECIMAL', tooltip: 'DECIMAL (precise numeric)' },
      { regex: /\$table->float\s*\(\s*['"]([^'"]+)['"]/, type: 'FLOAT', tooltip: 'FLOAT (approximate numeric)' },
      { regex: /\$table->double\s*\(\s*['"]([^'"]+)['"]/, type: 'DOUBLE', tooltip: 'DOUBLE (double precision)' },
      { regex: /\$table->date\s*\(\s*['"]([^'"]+)['"]/, type: 'DATE', tooltip: 'DATE (YYYY-MM-DD)' },
      { regex: /\$table->dateTime\s*\(\s*['"]([^'"]+)['"]/, type: 'DATETIME', tooltip: 'DATETIME (YYYY-MM-DD HH:MM:SS)' },
      { regex: /\$table->timestamp\s*\(\s*['"]([^'"]+)['"]/, type: 'TIMESTAMP', tooltip: 'TIMESTAMP' },
      { regex: /\$table->time\s*\(\s*['"]([^'"]+)['"]/, type: 'TIME', tooltip: 'TIME (HH:MM:SS)' },
      { regex: /\$table->json\s*\(\s*['"]([^'"]+)['"]/, type: 'JSON', tooltip: 'JSON (native JSON type)' },
      { regex: /\$table->uuid\s*\(\s*['"]([^'"]+)['"]/, type: 'UUID', tooltip: 'UUID (36 characters)' },
      { regex: /\$table->ulid\s*\(\s*['"]([^'"]+)['"]/, type: 'ULID', tooltip: 'ULID (26 characters, sortable)' },
      { regex: /\$table->enum\s*\(\s*['"]([^'"]+)['"]/, type: 'ENUM', tooltip: 'ENUM (predefined values)' },
    ];

    for (const pattern of columnPatterns) {
      const match = text.match(pattern.regex);
      if (match) {
        const columnName = match[1];
        const pos = new vscode.Position(lineNum, match.index! + match[0].length);
        const hint = new vscode.InlayHint(
          pos,
          `⬆ ${columnName} (${pattern.type})`,
          vscode.InlayHintKind.Type
        );
        hint.tooltip = new vscode.MarkdownString(`**Column:** \`${columnName}\`\n\n**Type:** ${pattern.tooltip}`);
        hint.paddingLeft = true;
        hints.push(hint);
      }
    }

    // $table->foreignId('user_id')
    const foreignMatch = text.match(/\$table->foreignId\s*\(\s*['"]([^'"]+)['"]/);
    if (foreignMatch) {
      const columnName = foreignMatch[1];
      const tableName = columnName.replace('_id', '') + 's';
      const pos = new vscode.Position(lineNum, foreignMatch.index! + foreignMatch[0].length);
      const hint = new vscode.InlayHint(
        pos,
        `⬆ ${messages.inlay_foreign_key}`,
        vscode.InlayHintKind.Parameter
      );
      hint.tooltip = new vscode.MarkdownString(`**Foreign Key:** \`${columnName}\`\n\n**References:** \`${tableName}.id\``);
      hint.paddingLeft = true;
      hints.push(hint);
    }

    // $table->id()
    const idMatch = text.match(/\$table->id\s*\(\s*\)/);
    if (idMatch) {
      const pos = new vscode.Position(lineNum, idMatch.index! + idMatch[0].length);
      const hint = new vscode.InlayHint(
        pos,
        `⬆ BIGINT UNSIGNED (Primary Key)`,
        vscode.InlayHintKind.Type
      );
      hint.tooltip = new vscode.MarkdownString('**Primary Key**\n\n**Type:** BIGINT UNSIGNED\nAuto-incrementing');
      hint.paddingLeft = true;
      hints.push(hint);
    }

    // $table->timestamps()
    const timestampsMatch = text.match(/\$table->timestamps\s*\(\s*\)/);
    if (timestampsMatch) {
      const pos = new vscode.Position(lineNum, timestampsMatch.index! + timestampsMatch[0].length);
      const hint = new vscode.InlayHint(
        pos,
        `⬆ created_at + updated_at`,
        vscode.InlayHintKind.Type
      );
      hint.tooltip = new vscode.MarkdownString('**Timestamps**\n\n- created_at (TIMESTAMP)\n- updated_at (TIMESTAMP)');
      hint.paddingLeft = true;
      hints.push(hint);
    }

    // $table->softDeletes()
    const softDeletesMatch = text.match(/\$table->softDeletes\s*\(\s*\)/);
    if (softDeletesMatch) {
      const pos = new vscode.Position(lineNum, softDeletesMatch.index! + softDeletesMatch[0].length);
      const hint = new vscode.InlayHint(
        pos,
        `⬆ deleted_at (TIMESTAMP)`,
        vscode.InlayHintKind.Type
      );
      hint.tooltip = new vscode.MarkdownString('**Soft Deletes**\n\nAdds `deleted_at` column for soft delete functionality');
      hint.paddingLeft = true;
      hints.push(hint);
    }

    // $table->rememberToken()
    const rememberTokenMatch = text.match(/\$table->rememberToken\s*\(\s*\)/);
    if (rememberTokenMatch) {
      const pos = new vscode.Position(lineNum, rememberTokenMatch.index! + rememberTokenMatch[0].length);
      const hint = new vscode.InlayHint(
        pos,
        `⬆ remember_token (VARCHAR 100)`,
        vscode.InlayHintKind.Type
      );
      hint.tooltip = new vscode.MarkdownString('**Remember Token**\n\nFor "remember me" authentication functionality');
      hint.paddingLeft = true;
      hints.push(hint);
    }
  }

  /**
   * Add inlay hints for route files
   */
  private addRouteHints(
    lineNum: number,
    text: string,
    messages: I18nMessages,
    hints: vscode.InlayHint[]
  ): void {
    // Route methods
    const routeMethods = ['get', 'post', 'put', 'patch', 'delete'];
    for (const method of routeMethods) {
      const regex = new RegExp(`Route::${method}\\s*\\(\\s*['\"]([^'\"]+)['\"]`);
      const match = text.match(regex);
      if (match) {
        const path = match[1];
        const pos = new vscode.Position(lineNum, match.index! + match[0].length);
        const hint = new vscode.InlayHint(
          pos,
          `⬆ ${method.toUpperCase()} ${path}`,
          vscode.InlayHintKind.Type
        );
        hint.tooltip = new vscode.MarkdownString(`**Route:** \`${method.toUpperCase()} ${path}\``);
        hint.paddingLeft = true;
        hints.push(hint);
      }
    }

    // ->name('route.name')
    const nameMatch = text.match(/->name\s*\(\s*['"]([^'"]+)['"]/);
    if (nameMatch) {
      const routeName = nameMatch[1];
      const pos = new vscode.Position(lineNum, nameMatch.index! + nameMatch[0].length);
      const hint = new vscode.InlayHint(
        pos,
        `⬆ ${messages.inlay_route_name}`,
        vscode.InlayHintKind.Parameter
      );
      hint.tooltip = new vscode.MarkdownString(`**Route Name:** \`${routeName}\`\n\nUsage: \`route('${routeName}')\``);
      hint.paddingLeft = true;
      hints.push(hint);
    }

    // Route::resource
    const resourceMatch = text.match(/Route::resource\s*\(\s*['"]([^'"]+)['"]/);
    if (resourceMatch) {
      const resource = resourceMatch[1];
      const pos = new vscode.Position(lineNum, resourceMatch.index! + resourceMatch[0].length);
      const hint = new vscode.InlayHint(
        pos,
        `⬆ CRUD: index, create, store, show, edit, update, destroy`,
        vscode.InlayHintKind.Type
      );
      hint.tooltip = new vscode.MarkdownString(`**Resource Route:** \`${resource}\`\n\nGenerates all 7 RESTful routes`);
      hint.paddingLeft = true;
      hints.push(hint);
    }

    // Route::apiResource
    const apiResourceMatch = text.match(/Route::apiResource\s*\(\s*['"]([^'"]+)['"]/);
    if (apiResourceMatch) {
      const resource = apiResourceMatch[1];
      const pos = new vscode.Position(lineNum, apiResourceMatch.index! + apiResourceMatch[0].length);
      const hint = new vscode.InlayHint(
        pos,
        `⬆ API: index, store, show, update, destroy`,
        vscode.InlayHintKind.Type
      );
      hint.tooltip = new vscode.MarkdownString(`**API Resource Route:** \`${resource}\`\n\nGenerates 5 API routes (no create/edit)`);
      hint.paddingLeft = true;
      hints.push(hint);
    }
  }

  /**
   * Add inlay hints for model files
   */
  private addModelHints(
    lineNum: number,
    text: string,
    messages: I18nMessages,
    hints: vscode.InlayHint[]
  ): void {
    // protected $fillable = [...]
    const fillableMatch = text.match(/protected\s+\$fillable\s*=\s*\[/);
    if (fillableMatch) {
      const pos = new vscode.Position(lineNum, fillableMatch.index! + fillableMatch[0].length);
      const hint = new vscode.InlayHint(
        pos,
        `:: ${messages.inlay_fillable}`,
        vscode.InlayHintKind.Type
      );
      hint.tooltip = new vscode.MarkdownString('**Fillable**\n\nColumns that can be mass assigned.\n\nUse with `create()` and `update()`.');
      hint.paddingLeft = true;
      hints.push(hint);
    }

    // protected $guarded = [...]
    const guardedMatch = text.match(/protected\s+\$guarded\s*=\s*\[/);
    if (guardedMatch) {
      const pos = new vscode.Position(lineNum, guardedMatch.index! + guardedMatch[0].length);
      const hint = new vscode.InlayHint(
        pos,
        `:: Columns protected from mass assignment`,
        vscode.InlayHintKind.Type
      );
      hint.tooltip = new vscode.MarkdownString('**Guarded**\n\nColumns that CANNOT be mass assigned.\n\nOpposite of `$fillable`.');
      hint.paddingLeft = true;
      hints.push(hint);
    }

    // protected $casts = [...]
    const castsMatch = text.match(/protected\s+\$casts\s*=\s*\[/);
    if (castsMatch) {
      const pos = new vscode.Position(lineNum, castsMatch.index! + castsMatch[0].length);
      const hint = new vscode.InlayHint(
        pos,
        `:: ${messages.inlay_casts}`,
        vscode.InlayHintKind.Type
      );
      hint.tooltip = new vscode.MarkdownString('**Casts**\n\nAttribute type casting.\n\nTypes: array, boolean, collection, date, datetime, decimal, float, integer, json, object, string, timestamp');
      hint.paddingLeft = true;
      hints.push(hint);
    }

    // protected $hidden = [...]
    const hiddenMatch = text.match(/protected\s+\$hidden\s*=\s*\[/);
    if (hiddenMatch) {
      const pos = new vscode.Position(lineNum, hiddenMatch.index! + hiddenMatch[0].length);
      const hint = new vscode.InlayHint(
        pos,
        `:: Hidden from JSON/array`,
        vscode.InlayHintKind.Type
      );
      hint.tooltip = new vscode.MarkdownString('**Hidden**\n\nAttributes hidden when model is converted to array or JSON.\n\nUseful for sensitive data like passwords.');
      hint.paddingLeft = true;
      hints.push(hint);
    }

    // Relationship hints - check for relationship method definitions
    // This handles both single-line and the relationship call itself
    const relationships = [
      { name: 'hasMany', returns: messages.inlay_returns_collection },
      { name: 'hasOne', returns: messages.inlay_returns_model },
      { name: 'belongsTo', returns: messages.inlay_returns_model },
      { name: 'belongsToMany', returns: messages.inlay_returns_collection },
      { name: 'hasManyThrough', returns: messages.inlay_returns_collection },
      { name: 'hasOneThrough', returns: messages.inlay_returns_model },
      { name: 'morphOne', returns: messages.inlay_returns_model },
      { name: 'morphMany', returns: messages.inlay_returns_collection },
      { name: 'morphTo', returns: messages.inlay_returns_model },
      { name: 'morphToMany', returns: messages.inlay_returns_collection },
      { name: 'morphedByMany', returns: messages.inlay_returns_collection },
    ];

    for (const rel of relationships) {
      // Check if this line contains the relationship call (e.g., $this->hasMany)
      const relationCallRegex = new RegExp(`\\$this->${rel.name}\\s*\\(`);
      const relationMatch = text.match(relationCallRegex);
      if (relationMatch) {
        const pos = new vscode.Position(lineNum, relationMatch.index! + relationMatch[0].length);
        const hint = new vscode.InlayHint(
          pos,
          `:: ${rel.returns}`,
          vscode.InlayHintKind.Type
        );
        hint.tooltip = new vscode.MarkdownString(`**Relationship: ${rel.name}**\n\nReturns: ${rel.returns}`);
        hint.paddingLeft = true;
        hints.push(hint);
      }
    }
  }

  /**
   * Add inlay hints for controller files
   */
  private addControllerHints(
    lineNum: number,
    text: string,
    messages: I18nMessages,
    hints: vscode.InlayHint[]
  ): void {
    // $request->validate([...])
    const validateMatch = text.match(/\$request->validate\s*\(\s*\[/);
    if (validateMatch) {
      const pos = new vscode.Position(lineNum, validateMatch.index! + validateMatch[0].length);
      const hint = new vscode.InlayHint(
        pos,
        `:: Validation rules`,
        vscode.InlayHintKind.Type
      );
      hint.tooltip = new vscode.MarkdownString('**Validation**\n\nValidate request data before processing.\n\nReturns validated data or throws ValidationException.');
      hint.paddingLeft = true;
      hints.push(hint);
    }

    // return view('...')
    const viewMatch = text.match(/return\s+view\s*\(\s*['"]([^'"]+)['"]/);
    if (viewMatch) {
      const viewName = viewMatch[1];
      const viewPath = viewName.replace(/\./g, '/') + '.blade.php';
      const pos = new vscode.Position(lineNum, viewMatch.index! + viewMatch[0].length);
      const hint = new vscode.InlayHint(
        pos,
        `⬆ resources/views/${viewPath}`,
        vscode.InlayHintKind.Type
      );
      hint.tooltip = new vscode.MarkdownString(`**View:** \`${viewName}\`\n\n**File:** \`resources/views/${viewPath}\``);
      hint.paddingLeft = true;
      hints.push(hint);
    }

    // return redirect()->route('...')
    const redirectRouteMatch = text.match(/redirect\s*\(\s*\)\s*->\s*route\s*\(\s*['"]([^'"]+)['"]/);
    if (redirectRouteMatch) {
      const routeName = redirectRouteMatch[1];
      const pos = new vscode.Position(lineNum, redirectRouteMatch.index! + redirectRouteMatch[0].length);
      const hint = new vscode.InlayHint(
        pos,
        `⬆ Redirects to route: ${routeName}`,
        vscode.InlayHintKind.Type
      );
      hint.tooltip = new vscode.MarkdownString(`**Redirect to Route:** \`${routeName}\``);
      hint.paddingLeft = true;
      hints.push(hint);
    }

    // response()->json([...])
    const jsonMatch = text.match(/response\s*\(\s*\)\s*->\s*json\s*\(/);
    if (jsonMatch) {
      const pos = new vscode.Position(lineNum, jsonMatch.index! + jsonMatch[0].length);
      const hint = new vscode.InlayHint(
        pos,
        `:: JSON Response`,
        vscode.InlayHintKind.Type
      );
      hint.tooltip = new vscode.MarkdownString('**JSON Response**\n\nReturns JSON with Content-Type: application/json');
      hint.paddingLeft = true;
      hints.push(hint);
    }

    // Model::findOrFail($id)
    const findOrFailMatch = text.match(/([A-Z][a-zA-Z0-9]*)::findOrFail\s*\(/);
    if (findOrFailMatch) {
      const modelName = findOrFailMatch[1];
      const pos = new vscode.Position(lineNum, findOrFailMatch.index! + findOrFailMatch[0].length);
      const hint = new vscode.InlayHint(
        pos,
        `:: Returns ${modelName} or 404`,
        vscode.InlayHintKind.Type
      );
      hint.tooltip = new vscode.MarkdownString(`**findOrFail**\n\nReturns \`${modelName}\` model or throws 404 ModelNotFoundException`);
      hint.paddingLeft = true;
      hints.push(hint);
    }

    // Model::create([...])
    const createMatch = text.match(/([A-Z][a-zA-Z0-9]*)::create\s*\(/);
    if (createMatch) {
      const modelName = createMatch[1];
      const pos = new vscode.Position(lineNum, createMatch.index! + createMatch[0].length);
      const hint = new vscode.InlayHint(
        pos,
        `:: Creates new ${modelName}`,
        vscode.InlayHintKind.Type
      );
      hint.tooltip = new vscode.MarkdownString(`**create**\n\nCreates and saves new \`${modelName}\` record.\n\nRequires \`$fillable\` in model.`);
      hint.paddingLeft = true;
      hints.push(hint);
    }

    // $model->update([...])
    const updateMatch = text.match(/\$([a-z][a-zA-Z0-9]*)->update\s*\(/);
    if (updateMatch) {
      const varName = updateMatch[1];
      const pos = new vscode.Position(lineNum, updateMatch.index! + updateMatch[0].length);
      const hint = new vscode.InlayHint(
        pos,
        `:: Updates $${varName}`,
        vscode.InlayHintKind.Type
      );
      hint.tooltip = new vscode.MarkdownString(`**update**\n\nUpdates existing model attributes.\n\nRequires \`$fillable\` in model.`);
      hint.paddingLeft = true;
      hints.push(hint);
    }

    // $model->delete()
    const deleteMatch = text.match(/\$([a-z][a-zA-Z0-9]*)->delete\s*\(\s*\)/);
    if (deleteMatch) {
      const varName = deleteMatch[1];
      const pos = new vscode.Position(lineNum, deleteMatch.index! + deleteMatch[0].length);
      const hint = new vscode.InlayHint(
        pos,
        `:: Deletes $${varName}`,
        vscode.InlayHintKind.Type
      );
      hint.tooltip = new vscode.MarkdownString(`**delete**\n\nDeletes the model from database.\n\nUse \`forceDelete()\` for soft-deleted models.`);
      hint.paddingLeft = true;
      hints.push(hint);
    }
  }

  public dispose(): void {
    // No disposables to clean up
  }
}
