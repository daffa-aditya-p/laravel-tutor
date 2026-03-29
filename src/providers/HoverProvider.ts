import * as vscode from 'vscode';
import { detectFileType } from '../utils/detector';
import { getLanguage } from '../utils/config';
import { getMigrationHover } from '../data/migration';
import { getModelHover } from '../data/model';
import { getControllerHover } from '../data/controller';
import { getRouteHover } from '../data/routes';

// Pattern definitions untuk hover (akan di-clone saat digunakan untuk menghindari lastIndex issues)
const HOVER_PATTERN_SOURCES = [
  // Schema methods: Schema::create, Schema::table
  /(Schema)::([A-Za-z_][A-Za-z0-9_]*)/,
  // Route methods: Route::get, Route::post
  /(Route)::([A-Za-z_][A-Za-z0-9_]*)/,
  // Table methods: $table->string(), $table->id()
  /(\$table)\s*->\s*([A-Za-z_][A-Za-z0-9_]*)/,
  // Request methods: $request->validate, $request->all
  /(\$request)\s*->\s*([A-Za-z_][A-Za-z0-9_]*)/,
  // Model properties: $fillable, $guarded, $casts
  /(protected\s+)?(\$[A-Za-z_][A-Za-z0-9_]*)/,
  // Model relationships: hasMany, belongsTo, etc
  /\b(hasMany|hasOne|belongsTo|belongsToMany|hasManyThrough|hasOneThrough|morphOne|morphMany|morphTo|morphToMany|morphedByMany)\b/,
  // Migration column types
  /\b(id|bigIncrements|increments|tinyInteger|smallInteger|mediumInteger|integer|bigInteger|unsignedTinyInteger|unsignedSmallInteger|unsignedMediumInteger|unsignedInteger|unsignedBigInteger|float|double|decimal|boolean|date|dateTime|dateTimeTz|time|timestamp|timestampTz|year|binary|blob|char|string|text|tinyText|mediumText|longText|json|jsonb|uuid|ulid|ipAddress|macAddress|geometry|point|lineString|polygon|geometryCollection|multiPoint|multiLineString|multiPolygon|foreignId|foreignUuid|morphs|nullableMorphs|rememberToken|softDeletes|softDeletesTz|nullableTimestamps|timestamps)\b/,
  // Controller methods
  /\b(validate|validated|authorize|dispatch|dispatchSync|dispatchNow)\b/,
  // Response methods
  /\b(view|response|redirect|back|abort|download|stream|file|json)\b/,
  // Query builder methods
  /\b(select|where|orWhere|whereIn|whereNotIn|whereNull|whereNotNull|whereBetween|whereNotBetween|whereColumn|whereExists|whereDoesntExist|join|leftJoin|rightJoin|crossJoin|orderBy|orderByDesc|groupBy|having|limit|offset|count|sum|avg|min|max|get|first|find|findOrFail|value|pluck|all|chunk|cursor|each|forPage|exists|doesntExist|insert|update|delete|truncate|create|updateOrInsert|updateOrCreate|firstOrCreate|firstOrNew|createOrFirst|paginate|simplePaginate|toSql|dump|dd)\b/,
  // Eloquent methods
  /\b(with|load|loadMissing|has|whereHas|whereDoesntHave|doesntHave|orHas|orWhereHas|orDoesntHave|orWhereDoesntHave|find|findOrFail|findMany|first|firstOrFail|firstOrCreate|firstOrNew|create|update|delete|restore|forceDelete|save|touch|increment|decrement|replicate|fresh|refresh|isDirty|isClean|wasChanged|getChanges|toArray|toJson)\b/,
];

/**
 * Laravel Hover Provider
 * Menampilkan tooltip penjelasan method Laravel saat di-hover
 */
export class LaravelHoverProvider implements vscode.HoverProvider, vscode.Disposable {
  private disposables: vscode.Disposable[] = [];

  constructor() {
    // No initialization needed - language is read fresh on each hover request
  }

  public provideHover(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.Hover> {
    const line = document.lineAt(position.line).text;
    const lang = getLanguage();
    const fileType = detectFileType(document);

    // Create fresh regex instances with global flag for each hover request
    const patterns = HOVER_PATTERN_SOURCES.map(p => new RegExp(p.source, 'g'));

    let matchedKeyword: string | null = null;

    for (const pattern of patterns) {
      const matches = [...line.matchAll(pattern)];
      for (const match of matches) {
        const startIdx = match.index ?? 0;
        const endIdx = startIdx + match[0].length;
        
        if (position.character >= startIdx && position.character <= endIdx) {
          // Extract the relevant part based on pattern
          if (match[0].includes('::') || match[0].includes('->')) {
            // For Schema::create, $table->string, etc - get the method part
            matchedKeyword = match[2] || match[1];
          } else {
            // For standalone methods like hasMany, validate, etc
            matchedKeyword = match[1] || match[0];
          }
          break;
        }
      }
      if (matchedKeyword) break;
    }

    if (!matchedKeyword) {
      // Fallback: get word at position
      const wordRange = document.getWordRangeAtPosition(position, /[A-Za-z_][A-Za-z0-9_]*/);
      if (wordRange) {
        matchedKeyword = document.getText(wordRange);
      }
    }

    if (!matchedKeyword) {
      return null;
    }

    let hoverText: string | null = null;
    
    switch (fileType) {
      case 'migration':
        hoverText = getMigrationHover(matchedKeyword, lang);
        break;
      case 'model':
        hoverText = getModelHover(matchedKeyword, lang);
        break;
      case 'controller':
        hoverText = getControllerHover(matchedKeyword, lang);
        break;
      case 'route':
        hoverText = getRouteHover(matchedKeyword, lang);
        break;
      case 'unknown':
        // For unknown PHP files, try all data sources
        // This allows hover to work in utility/helper files that use Laravel methods
        hoverText = getMigrationHover(matchedKeyword, lang)
          || getModelHover(matchedKeyword, lang)
          || getControllerHover(matchedKeyword, lang)
          || getRouteHover(matchedKeyword, lang);
        break;
    }

    if (hoverText) {
      const markdown = new vscode.MarkdownString(hoverText, true);
      markdown.supportHtml = true;
      // Note: isTrusted not set to true for security
      return new vscode.Hover(markdown);
    }

    return null;
  }

  public dispose(): void {
    this.disposables.forEach(d => d.dispose());
    this.disposables = [];
  }
}
