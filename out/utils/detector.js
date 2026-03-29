"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectFileType = detectFileType;
exports.isPlainPhpFile = isPlainPhpFile;
exports.getFileTypeLabel = getFileTypeLabel;
/**
 * Mendeteksi tipe file Laravel berdasarkan path dan konten file
 * Menggunakan KEDUA cara: path structure dan content analysis
 * Case-insensitive untuk kompatibilitas Windows/Linux
 *
 * @param document VSCode TextDocument untuk dideteksi
 * @returns Tipe file Laravel atau 'unknown' jika tidak terdeteksi
 */
function detectFileType(document) {
    const uri = document.uri.fsPath.replace(/\\/g, '/').toLowerCase();
    const text = document.getText();
    const fileName = document.uri.fsPath.split(/[\\/]/).pop()?.toLowerCase() || '';
    // ============================================
    // MIGRATION DETECTION
    // ============================================
    // Path: /database/migrations/
    // Filename pattern: YYYY_MM_DD_HHMMSS_create_xxx_table.php atau create_xxx_table.php
    // Content: extends Migration, Schema::, Blueprint $table
    const isMigrationPath = uri.includes('/database/migrations/');
    const isMigrationContent = text.includes('extends Migration') ||
        text.includes('Schema::') ||
        text.includes('Blueprint $table');
    const isMigrationFilename = /^\d{4}_\d{2}_\d{2}_\d{6}_/.test(fileName) ||
        (fileName.includes('create_') && fileName.includes('_table')) ||
        (fileName.includes('add_') && fileName.includes('_to_')) ||
        (fileName.includes('delete_') && fileName.includes('_from_'));
    if (isMigrationPath || isMigrationFilename || isMigrationContent) {
        return 'migration';
    }
    // ============================================
    // MODEL DETECTION
    // ============================================
    // Path: /Models/, /app/ (tapi bukan /Http/, /Console/, /Exceptions/, /Providers/)
    // Content: extends Model, extends Authenticatable, extends Pivot, HasFactory, $fillable, $guarded
    const isModelPath = uri.includes('/models/') ||
        (uri.includes('/app/') &&
            !uri.includes('/http/') &&
            !uri.includes('/console/') &&
            !uri.includes('/exceptions/') &&
            !uri.includes('/providers/') &&
            !uri.includes('/jobs/') &&
            !uri.includes('/events/') &&
            !uri.includes('/listeners/') &&
            !uri.includes('/mail/') &&
            !uri.includes('/notifications/') &&
            !uri.includes('/policies/') &&
            !uri.includes('/rules/') &&
            !uri.includes('/services/'));
    const isModelContent = text.includes('extends Model') ||
        text.includes('extends Authenticatable') ||
        text.includes('extends Pivot') ||
        text.includes('HasFactory') ||
        (text.includes('$fillable') && text.includes('class')) ||
        (text.includes('$guarded') && text.includes('class')) ||
        (text.includes('$casts') && text.includes('class')) ||
        (text.includes('$with') && text.includes('class'));
    // Exclude migration content and non-model patterns from model detection
    const isNotModel = text.includes('Schema::') ||
        text.includes('extends Command') ||
        text.includes('extends Job') ||
        text.includes('extends Mailable') ||
        text.includes('extends Notification') ||
        text.includes('extends ServiceProvider') ||
        text.includes('extends FormRequest') ||
        text.includes('extends Exception');
    if ((isModelPath || isModelContent) && !isNotModel) {
        return 'model';
    }
    // ============================================
    // CONTROLLER DETECTION
    // ============================================
    // Path: /Http/Controllers/, /Controllers/
    // Content: extends Controller, extends BaseController, Request $request, __invoke
    const isControllerPath = uri.includes('/http/controllers/') ||
        uri.includes('/controllers/');
    const isControllerContent = text.includes('extends Controller') ||
        text.includes('extends BaseController') ||
        text.includes('extends ResourceController') ||
        (text.includes('Request $request') && text.includes('public function')) ||
        text.includes('public function __invoke');
    if (isControllerPath || isControllerContent) {
        return 'controller';
    }
    // ============================================
    // ROUTE DETECTION
    // ============================================
    // Path: web.php, api.php, console.php, channels.php, /routes/
    // Content: Route::, RouteFacade::
    const isRoutePath = uri.endsWith('web.php') ||
        uri.endsWith('api.php') ||
        uri.endsWith('console.php') ||
        uri.endsWith('channels.php') ||
        uri.endsWith('routes.php') ||
        uri.includes('/routes/');
    const isRouteContent = text.includes('Route::') ||
        text.includes('RouteFacade::') ||
        text.includes('Redirect::') ||
        text.includes('RateLimiter::');
    if (isRoutePath || isRouteContent) {
        return 'route';
    }
    // ============================================
    // UNKNOWN - tidak terdeteksi sebagai file Laravel
    // ============================================
    return 'unknown';
}
/**
 * Cek apakah file adalah file PHP biasa (bukan Laravel)
 * @param document VSCode TextDocument
 * @returns true jika file PHP tapi bukan file Laravel
 */
function isPlainPhpFile(document) {
    const fileType = detectFileType(document);
    return document.languageId === 'php' && fileType === 'unknown';
}
/**
 * Get label human-readable untuk tipe file
 * @param fileType Tipe file Laravel
 * @returns Label readable
 */
function getFileTypeLabel(fileType) {
    const labels = {
        migration: 'Migration',
        model: 'Model',
        controller: 'Controller',
        route: 'Route',
        unknown: 'Unknown'
    };
    return labels[fileType];
}
//# sourceMappingURL=detector.js.map