/**
 * Data method untuk Laravel Routes
 * Berisi 50+ method dan pattern dengan penjelasan detail
 */

export interface RouteMethod {
  method: string;
  aliases?: string[];
  category: 'basic' | 'resource' | 'group' | 'parameter' | 'middleware' | 'advanced';
  id: string;
  en: string;
}

export const routeData: RouteMethod[] = [
  // ============================================
  // BASIC ROUTES
  // ============================================
  {
    method: "Route::get",
    category: "basic",
    id: "**Fungsi:** Mendefinisikan route untuk HTTP GET method.\n\n**Kapan dipakai:** Untuk menampilkan halaman, mengambil data, atau operasi read-only.\n\n**Contoh penggunaan:**\n```php\n// Basic route with closure\nRoute::get('/hello', function () {\n    return 'Hello World!';\n});\n\n// Route with controller\nRoute::get('/posts', [PostController::class, 'index']);\n\n// Route with name\nRoute::get('/posts', [PostController::class, 'index'])->name('posts.index');\n\n// Route with middleware\nRoute::get('/posts', [PostController::class, 'index'])\n    ->middleware('auth');\n\n// Route with parameters\nRoute::get('/posts/{id}', [PostController::class, 'show']);\n\n// Route with optional parameters\nRoute::get('/posts/{id?}', [PostController::class, 'show']);\n```\n\n⚠️ **Perhatian:**\n- GET adalah default method untuk menampilkan halaman\n- Jangan gunakan GET untuk mengubah/hapus data (idempotent)\n- Bisa di-chain dengan name(), middleware(), dll\n- Parameter wajib: `{id}`, optional: `{id?}`",
    en: "**Function:** Defines a route for HTTP GET method.\n\n**When to use:** To display pages, fetch data, or read-only operations.\n\n**Example:**\n```php\nRoute::get('/posts', [PostController::class, 'index']);\nRoute::get('/posts/{id}', [PostController::class, 'show']);\n```\n\n⚠️ **Attention:**\n- GET is default for displaying pages\n- Don't use GET to mutate/delete data (idempotent)\n- Chainable with name(), middleware(), etc"
  },
  {
    method: "Route::post",
    category: "basic",
    id: "**Fungsi:** Mendefinisikan route untuk HTTP POST method.\n\n**Kapan dipakai:** Untuk submit form, create data, atau operasi yang mengubah data.\n\n**Contoh penggunaan:**\n```php\n// Form submission\nRoute::post('/posts', [PostController::class, 'store']);\n\n// API endpoint\nRoute::post('/api/users', [UserController::class, 'create']);\n\n// With middleware\nRoute::post('/posts', [PostController::class, 'store'])\n    ->middleware(['auth', 'verified']);\n\n// With name\nRoute::post('/posts', [PostController::class, 'store'])\n    ->name('posts.store');\n```\n\n⚠️ **Perhatian:**\n- POST untuk create/submit data\n- CSRF protection otomatis (kecuali API)\n- Data dikirim di request body\n- Tidak idempotent (bisa create duplicate jika di-call berkali-kali)",
    en: "**Function:** Defines a route for HTTP POST method.\n\n**When to use:** To submit forms, create data, or operations that change data.\n\n**Example:**\n```php\nRoute::post('/posts', [PostController::class, 'store']);\n```\n\n⚠️ **Attention:**\n- POST for create/submit data\n- CSRF protection automatic (except API)\n- Data sent in request body\n- Not idempotent"
  },
  {
    method: "Route::put",
    category: "basic",
    id: "**Fungsi:** Mendefinisikan route untuk HTTP PUT method.\n\n**Kapan dipakai:** Untuk update/replace data secara keseluruhan.\n\n**Contoh penggunaan:**\n```php\n// Full update (replace)\nRoute::put('/posts/{id}', [PostController::class, 'update']);\n\n// With name\nRoute::put('/posts/{post}', [PostController::class, 'update'])\n    ->name('posts.update');\n\n// API resource\nRoute::apiResource('posts', PostController::class);\n// Auto creates PUT /posts/{post}\n```\n\n⚠️ **Perhatian:**\n- PUT untuk full update (replace semua field)\n- Idempotent (hasil sama jika di-call berkali-kali)\n- Untuk partial update, gunakan PATCH\n- Method spoofing di form: `@method('PUT')`",
    en: "**Function:** Defines a route for HTTP PUT method.\n\n**When to use:** To update/replace data entirely.\n\n**Example:**\n```php\nRoute::put('/posts/{id}', [PostController::class, 'update']);\n```\n\n⚠️ **Attention:**\n- PUT for full update (replace all fields)\n- Idempotent (same result if called multiple times)\n- For partial update, use PATCH\n- Method spoofing in forms: `@method('PUT')`"
  },
  {
    method: "Route::patch",
    category: "basic",
    id: "**Fungsi:** Mendefinisikan route untuk HTTP PATCH method.\n\n**Kapan dipakai:** Untuk partial update (update sebagian field).\n\n**Contoh penggunaan:**\n```php\n// Partial update\nRoute::patch('/posts/{id}', [PostController::class, 'partialUpdate']);\n\n// Common pattern\nRoute::patch('/users/{user}/password', [UserController::class, 'updatePassword']);\n\n// API resource\nRoute::apiResource('posts', PostController::class);\n// Auto creates PATCH /posts/{post}\n```\n\n⚠️ **Perhatian:**\n- PATCH untuk partial update (beberapa field saja)\n- Idempotent\n- Lebih efisien dari PUT untuk update kecil\n- Method spoofing di form: `@method('PATCH')`",
    en: "**Function:** Defines a route for HTTP PATCH method.\n\n**When to use:** For partial updates (some fields only).\n\n**Example:**\n```php\nRoute::patch('/posts/{id}', [PostController::class, 'partialUpdate']);\n```\n\n⚠️ **Attention:**\n- PATCH for partial update (some fields only)\n- Idempotent\n- More efficient than PUT for small updates"
  },
  {
    method: "Route::delete",
    category: "basic",
    id: "**Fungsi:** Mendefinisikan route untuk HTTP DELETE method.\n\n**Kapan dipakai:** Untuk delete/hapus data.\n\n**Contoh penggunaan:**\n```php\n// Delete resource\nRoute::delete('/posts/{id}', [PostController::class, 'destroy']);\n\n// With name\nRoute::delete('/posts/{post}', [PostController::class, 'destroy'])\n    ->name('posts.destroy');\n\n// Soft delete (same route)\n// Controller handles soft delete logic\n\n// API resource\nRoute::apiResource('posts', PostController::class);\n// Auto creates DELETE /posts/{post}\n```\n\n⚠️ **Perhatian:**\n- DELETE untuk hapus data\n- Idempotent (hapus data yang sudah hapus = no effect)\n- Method spoofing di form: `@method('DELETE')`\n- Untuk UI, gunakan form dengan JS submit atau link dengan confirm",
    en: "**Function:** Defines a route for HTTP DELETE method.\n\n**When to use:** To delete/remove data.\n\n**Example:**\n```php\nRoute::delete('/posts/{id}', [PostController::class, 'destroy']);\n```\n\n⚠️ **Attention:**\n- DELETE for deleting data\n- Idempotent (deleting already deleted = no effect)\n- Method spoofing in forms: `@method('DELETE')`"
  },
  {
    method: "Route::any",
    category: "basic",
    id: "**Fungsi:** Mendefinisikan route yang menerima SEMUA HTTP method.\n\n**Kapan dipakai:** Saat route harus handle GET, POST, PUT, DELETE, dll. Jarang digunakan.\n\n**Contoh penggunaan:**\n```php\n// Handle all methods\nRoute::any('/webhook', [WebhookController::class, 'handle']);\n\n// More specific (recommended)\nRoute::match(['get', 'post'], '/webhook', [WebhookController::class, 'handle']);\n```\n\n⚠️ **Perhatian:**\n- Jarang digunakan di production\n- Security concern (bisa accept method yang tidak diinginkan)\n- Lebih baik gunakan `match()` dengan method spesifik\n- Berguna untuk webhook endpoint",
    en: "**Function:** Defines a route that accepts ALL HTTP methods.\n\n**When to use:** When route must handle GET, POST, PUT, DELETE, etc. Rarely used.\n\n**Example:**\n```php\nRoute::any('/webhook', [WebhookController::class, 'handle']);\n```\n\n⚠️ **Attention:**\n- Rarely used in production\n- Security concern (could accept unwanted methods)\n- Better use `match()` with specific methods"
  },
  {
    method: "Route::match",
    category: "basic",
    id: "**Fungsi:** Mendefinisikan route untuk multiple HTTP methods.\n\n**Kapan dipakai:** Saat route harus handle beberapa method tertentu.\n\n**Contoh penggunaan:**\n```php\n// Handle GET and POST\nRoute::match(['get', 'post'], '/search', [SearchController::class, 'search']);\n\n// Handle GET and PUT\nRoute::match(['get', 'put'], '/settings', [SettingsController::class, 'handle']);\n\n// With closure\nRoute::match(['get', 'post'], '/contact', function (Request $request) {\n    if ($request->isMethod('post')) {\n        // Handle form\n    }\n    return view('contact');\n});\n```\n\n⚠️ **Perhatian:**\n- Array of methods\n- Berguna untuk form yang sama untuk display + submit\n- Check method di controller: `$request->isMethod('post')`",
    en: "**Function:** Defines a route for multiple HTTP methods.\n\n**When to use:** When route must handle specific methods.\n\n**Example:**\n```php\nRoute::match(['get', 'post'], '/search', [SearchController::class, 'search']);\n```\n\n⚠️ **Attention:**\n- Array of methods\n- Useful for same form for display + submit"
  },
  {
    method: "Route::view",
    category: "basic",
    id: "**Fungsi:** Mendefinisikan route yang langsung return view tanpa controller.\n\n**Kapan dipakai:** Untuk halaman statis yang tidak butuh logic controller.\n\n**Contoh penggunaan:**\n```php\n// Simple static page\nRoute::view('/about', 'pages.about');\n\n// With data\nRoute::view('/about', 'pages.about', ['title' => 'About Us']);\n\n// With name\nRoute::view('/contact', 'pages.contact')->name('contact');\n```\n\n⚠️ **Perhatian:**\n- Shortcut untuk return view tanpa controller\n- Tidak bisa handle POST/PUT/DELETE\n- Berguna untuk static pages: about, contact, terms, privacy",
    en: "**Function:** Defines a route that directly returns a view without controller.\n\n**When to use:** For static pages that don't need controller logic.\n\n**Example:**\n```php\nRoute::view('/about', 'pages.about');\nRoute::view('/about', 'pages.about', ['title' => 'About Us']);\n```\n\n⚠️ **Attention:**\n- Shortcut for returning view without controller\n- Cannot handle POST/PUT/DELETE\n- Useful for static pages: about, contact, terms, privacy"
  },
  {
    method: "Route::redirect",
    category: "basic",
    id: "**Fungsi:** Mendefinisikan route yang langsung redirect ke URL lain.\n\n**Kapan dipakai:** Untuk redirect URL lama ke baru, atau shortcut routes.\n\n**Contoh penggunaan:**\n```php\n// Simple redirect\nRoute::redirect('/old-page', '/new-page');\n\n// With status code\nRoute::redirect('/old-page', '/new-page', 301); // Permanent redirect\n\n// Named redirect\nRoute::redirect('/dashboard', '/admin/dashboard')->name('dashboard');\n```\n\n⚠️ **Perhatian:**\n- Default status: 302 (temporary)\n- Gunakan 301 untuk permanent redirect (SEO)\n- Tidak ada controller involvement\n- Berguna untuk URL migration",
    en: "**Function:** Defines a route that directly redirects to another URL.\n\n**When to use:** To redirect old URLs to new ones, or shortcut routes.\n\n**Example:**\n```php\nRoute::redirect('/old-page', '/new-page');\nRoute::redirect('/old-page', '/new-page', 301); // Permanent\n```\n\n⚠️ **Attention:**\n- Default status: 302 (temporary)\n- Use 301 for permanent redirect (SEO)"
  },
  
  // ============================================
  // ROUTE PARAMETERS
  // ============================================
  {
    method: "{",
    aliases: ["parameter", "route parameter"],
    category: "parameter",
    id: "**Fungsi:** Mendefinisikan route parameter.\n\n**Kapan dipakai:** Untuk membuat dynamic routes yang menerima input dari URL.\n\n**Contoh penggunaan:**\n```php\n// Required parameter\nRoute::get('/posts/{id}', function ($id) {\n    return \"Post ID: {$id}\";\n});\n\n// Multiple parameters\nRoute::get('/posts/{postId}/comments/{commentId}', function ($postId, $commentId) {\n    return \"Post: {$postId}, Comment: {$commentId}\";\n});\n\n// Optional parameter\nRoute::get('/posts/{id?}', function ($id = null) {\n    if ($id) {\n        return \"Post ID: {$id}\";\n    }\n    return \"All posts\";\n});\n\n// With default value\nRoute::get('/posts/{id?}', function ($id = 1) {\n    return \"Post ID: {$id}\";\n});\n```\n\n⚠️ **Perhatian:**\n- Required: `{id}` - wajib ada di URL\n- Optional: `{id?}` - boleh tidak ada\n- Parameter di-pass ke controller method\n- Nama parameter harus match dengan controller method parameter",
    en: "**Function:** Defines route parameters.\n\n**When to use:** To create dynamic routes that accept input from URL.\n\n**Example:**\n```php\nRoute::get('/posts/{id}', function ($id) {\n    return \"Post ID: {$id}\";\n});\n\nRoute::get('/posts/{id?}', function ($id = null) {\n    return $id ? \"Post ID: {$id}\" : \"All posts\";\n});\n```\n\n⚠️ **Attention:**\n- Required: `{id}` - must be in URL\n- Optional: `{id?}` - can be omitted\n- Parameters passed to controller method"
  },
  {
    method: "where",
    category: "parameter",
    id: "**Fungsi:** Menambahkan constraint/pattern ke route parameter.\n\n**Kapan dipakai:** Untuk membatasi format parameter (hanya numeric, slug, dll).\n\n**Contoh penggunaan:**\n```php\n// Numeric only\nRoute::get('/posts/{id}', function ($id) {\n    return \"Post: {$id}\";\n})->where('id', '[0-9]+');\n\n// Multiple constraints\nRoute::get('/posts/{id}/slug/{slug}', function ($id, $slug) {\n    // ...\n})->where(['id' => '[0-9]+', 'slug' => '[a-z0-9-]+']);\n\n// Common patterns\nRoute::get('/posts/{id}', [PostController::class, 'show'])\n    ->whereNumber('id'); // Laravel 9+\n\nRoute::get('/category/{slug}', [CategoryController::class, 'show'])\n    ->whereAlpha('slug'); // Laravel 9+\n\nRoute::get('/category/{slug}', [CategoryController::class, 'show'])\n    ->whereAlphaNumeric('slug'); // Laravel 9+\n```\n\n⚠️ **Perhatian:**\n- Regex pattern untuk validasi parameter\n- Jika tidak match, return 404\n- Laravel 9+: whereNumber, whereAlpha, whereAlphaNumeric shortcuts\n- Berguna untuk SEO-friendly URLs",
    en: "**Function:** Adds constraint/pattern to route parameters.\n\n**When to use:** To restrict parameter format (numeric only, slug, etc).\n\n**Example:**\n```php\nRoute::get('/posts/{id}', function ($id) {\n    return \"Post: {$id}\";\n})->where('id', '[0-9]+');\n\n// Laravel 9+ shortcuts\nRoute::get('/posts/{id}', [PostController::class, 'show'])\n    ->whereNumber('id');\n```\n\n⚠️ **Attention:**\n- Regex pattern for parameter validation\n- Returns 404 if not match\n- Laravel 9+: whereNumber, whereAlpha, whereAlphaNumeric shortcuts"
  },
  {
    method: "Route::pattern",
    category: "parameter",
    id: "**Fungsi:** Mendefinisikan global pattern untuk route parameters.\n\n**Kapan dipakai:** Saat semua route dengan parameter tertentu harus follow pattern yang sama.\n\n**Contoh penggunaan:**\n```php\n// In RouteServiceProvider::boot()\nRoute::pattern('id', '[0-9]+');\nRoute::pattern('slug', '[a-z0-9-]+');\n\n// Now all routes with {id} must be numeric\nRoute::get('/posts/{id}', [PostController::class, 'show']);\nRoute::get('/users/{id}', [UserController::class, 'show']);\n\n// Both will 404 if {id} is not numeric\n```\n\n⚠️ **Perhatian:**\n- Global pattern untuk semua routes\n- Define di RouteServiceProvider::boot()\n- Mengurangi duplikasi where() di setiap route\n- Berguna untuk standardisasi pattern",
    en: "**Function:** Defines global pattern for route parameters.\n\n**When to use:** When all routes with certain parameter must follow same pattern.\n\n**Example:**\n```php\n// In RouteServiceProvider::boot()\nRoute::pattern('id', '[0-9]+');\nRoute::pattern('slug', '[a-z0-9-]+');\n\n// Now all routes with {id} must be numeric\n```\n\n⚠️ **Attention:**\n- Global pattern for all routes\n- Define in RouteServiceProvider::boot()\n- Reduces where() duplication"
  },
  
  // ============================================
  // ROUTE NAMES
  // ============================================
  {
    method: "name",
    category: "basic",
    id: "**Fungsi:** Memberikan nama ke route untuk easy reference.\n\n**Kapan dipakai:** SELALU beri nama route untuk maintainable code.\n\n**Contoh penggunaan:**\n```php\n// Named route\nRoute::get('/posts', [PostController::class, 'index'])\n    ->name('posts.index');\n\nRoute::get('/posts/create', [PostController::class, 'create'])\n    ->name('posts.create');\n\n// Usage in code:\nredirect()->route('posts.index');\nroute('posts.show', ['post' => $post]);\n<a href=\"{{ route('posts.show', $post) }}\">Link</a>\n\n// Check current route\nif (request()->routeIs('posts.*')) {\n    // Active\n}\n```\n\n⚠️ **Perhatian:**\n- Naming convention: `resource.action` (posts.index, users.create)\n- Gunakan `route()` helper untuk generate URL\n- Jika URL berubah, tidak perlu update semua reference\n- Berguna untuk authorization: `request()->routeIs('admin.*')`",
    en: "**Function:** Gives a name to route for easy reference.\n\n**When to use:** ALWAYS name routes for maintainable code.\n\n**Example:**\n```php\nRoute::get('/posts', [PostController::class, 'index'])\n    ->name('posts.index');\n\n// Usage:\nredirect()->route('posts.index');\nroute('posts.show', ['post' => $post]);\n```\n\n⚠️ **Attention:**\n- Naming convention: `resource.action`\n- Use `route()` helper to generate URL\n- If URL changes, no need to update all references"
  },
  
  // ============================================
  // ROUTE GROUPS
  // ============================================
  {
    method: "Route::group",
    category: "group",
    id: "**Fungsi:** Mengelompokkan routes dengan attribute yang sama.\n\n**Kapan dipakai:** Untuk apply middleware, prefix, namespace ke multiple routes.\n\n**Contoh penggunaan:**\n```php\n// With middleware\nRoute::group(['middleware' => ['auth']], function () {\n    Route::get('/dashboard', [DashboardController::class, 'index']);\n    Route::get('/profile', [ProfileController::class, 'show']);\n});\n\n// With prefix\nRoute::group(['prefix' => 'admin'], function () {\n    Route::get('/dashboard', [AdminController::class, 'index']);\n    // URL: /admin/dashboard\n});\n\n// Combined\nRoute::group([\n    'middleware' => ['auth', 'admin'],\n    'prefix' => 'admin',\n    'as' => 'admin.', // Route name prefix\n], function () {\n    Route::get('/dashboard', [AdminController::class, 'index'])\n        ->name('dashboard'); // Full name: admin.dashboard\n});\n```\n\n⚠️ **Perhatian:**\n- Array options: middleware, prefix, as, namespace, domain\n- `as` untuk name prefix\n- `prefix` untuk URL prefix\n- Laravel 9+: Fluent syntax lebih clean",
    en: "**Function:** Groups routes with same attributes.\n\n**When to use:** To apply middleware, prefix, namespace to multiple routes.\n\n**Example:**\n```php\nRoute::group(['middleware' => ['auth']], function () {\n    Route::get('/dashboard', [DashboardController::class, 'index']);\n});\n\nRoute::group(['prefix' => 'admin'], function () {\n    Route::get('/dashboard', [AdminController::class, 'index']);\n});\n```\n\n⚠️ **Attention:**\n- Array options: middleware, prefix, as, namespace, domain\n- `as` for name prefix\n- `prefix` for URL prefix"
  },
  {
    method: "Route::middleware",
    category: "group",
    id: "**Fungsi:** Group routes dengan middleware (fluent syntax).\n\n**Kapan dipakai:** Cara modern (Laravel 9+) untuk group dengan middleware.\n\n**Contoh penggunaan:**\n```php\n// Fluent middleware group\nRoute::middleware(['auth'])->group(function () {\n    Route::get('/dashboard', [DashboardController::class, 'index']);\n    Route::get('/profile', [ProfileController::class, 'show']);\n});\n\n// Multiple middleware\nRoute::middleware(['auth', 'verified'])->group(function () {\n    Route::get('/settings', [SettingsController::class, 'show']);\n});\n\n// Chained\nRoute::middleware('auth')\n    ->name('admin.')\n    ->prefix('admin')\n    ->group(function () {\n        Route::get('/dashboard', [AdminController::class, 'index']);\n    });\n```\n\n⚠️ **Perhatian:**\n- Laravel 9+ fluent syntax\n- Lebih readable dari array syntax\n- Bisa di-chain dengan prefix(), name(), dll\n- Same functionality as Route::group",
    en: "**Function:** Groups routes with middleware (fluent syntax).\n\n**When to use:** Modern way (Laravel 9+) to group with middleware.\n\n**Example:**\n```php\nRoute::middleware(['auth'])->group(function () {\n    Route::get('/dashboard', [DashboardController::class, 'index']);\n});\n\n// Chained\nRoute::middleware('auth')\n    ->name('admin.')\n    ->prefix('admin')\n    ->group(function () {\n        Route::get('/dashboard', [AdminController::class, 'index']);\n    });\n```\n\n⚠️ **Attention:**\n- Laravel 9+ fluent syntax\n- More readable than array syntax\n- Chainable with prefix(), name(), etc"
  },
  {
    method: "Route::prefix",
    category: "group",
    id: "**Fungsi:** Group routes dengan URL prefix (fluent syntax).\n\n**Kapan dipakai:** Untuk membuat section/kategori routes dengan URL prefix yang sama.\n\n**Contoh penggunaan:**\n```php\n// Admin section\nRoute::prefix('admin')->group(function () {\n    Route::get('/dashboard', [AdminController::class, 'index']);\n    // URL: /admin/dashboard\n    \n    Route::get('/users', [UserController::class, 'index']);\n    // URL: /admin/users\n});\n\n// API versioning\nRoute::prefix('api/v1')->group(function () {\n    Route::get('/users', [UserController::class, 'index']);\n    // URL: /api/v1/users\n});\n\n// Combined with middleware\nRoute::middleware('auth')\n    ->prefix('dashboard')\n    ->group(function () {\n        Route::get('/', [DashboardController::class, 'index']);\n    });\n```\n\n⚠️ **Perhatian:**\n- Laravel 9+ fluent syntax\n- Prefix ditambahkan ke semua routes di group\n- Tidak affect route names\n- Berguna untuk section organization",
    en: "**Function:** Groups routes with URL prefix (fluent syntax).\n\n**When to use:** To create section/category routes with same URL prefix.\n\n**Example:**\n```php\nRoute::prefix('admin')->group(function () {\n    Route::get('/dashboard', [AdminController::class, 'index']);\n    // URL: /admin/dashboard\n});\n\n// API versioning\nRoute::prefix('api/v1')->group(function () {\n    Route::get('/users', [UserController::class, 'index']);\n});\n```\n\n⚠️ **Attention:**\n- Laravel 9+ fluent syntax\n- Prefix added to all routes in group\n- Doesn't affect route names"
  },
  {
    method: "Route::name",
    category: "group",
    id: "**Fungsi:** Group routes dengan name prefix (fluent syntax).\n\n**Kapan dipakai:** Untuk membuat namespace route names.\n\n**Contoh penggunaan:**\n```php\n// Admin routes\nRoute::name('admin.')->group(function () {\n    Route::get('/dashboard', [AdminController::class, 'index'])\n        ->name('dashboard'); // Full: admin.dashboard\n    \n    Route::get('/users', [UserController::class, 'index'])\n        ->name('users'); // Full: admin.users\n});\n\n// API routes\nRoute::name('api.')->prefix('api')->group(function () {\n    Route::get('/users', [UserController::class, 'index'])\n        ->name('users.index'); // Full: api.users.index\n});\n\n// Usage\nroute('admin.dashboard');\nroute('api.users.index');\n```\n\n⚠️ **Perhatian:**\n- Laravel 9+ fluent syntax\n- Prefix ditambahkan ke semua route names di group\n- Individual route name ditambahkan di akhir\n- Berguna untuk organization dan routeIs() check",
    en: "**Function:** Groups routes with name prefix (fluent syntax).\n\n**When to use:** To namespace route names.\n\n**Example:**\n```php\nRoute::name('admin.')->group(function () {\n    Route::get('/dashboard', [AdminController::class, 'index'])\n        ->name('dashboard'); // Full: admin.dashboard\n});\n\n// Usage\nroute('admin.dashboard');\n```\n\n⚠️ **Attention:**\n- Laravel 9+ fluent syntax\n- Prefix added to all route names in group\n- Individual route name appended at end"
  },
  
  // ============================================
  // RESOURCE ROUTES
  // ============================================
  {
    method: "Route::resource",
    category: "resource",
    id: "**Fungsi:** Membuat RESTful resource routes secara otomatis.\n\n**Kapan dipakai:** Untuk CRUD operations standard dengan satu baris.\n\n**Contoh penggunaan:**\n```php\n// Full resource (7 routes)\nRoute::resource('posts', PostController::class);\n\n// Creates:\n// GET    /posts              -> index\n// GET    /posts/create       -> create\n// POST   /posts              -> store\n// GET    /posts/{post}       -> show\n// GET    /posts/{post}/edit  -> edit\n// PUT    /posts/{post}       -> update\n// DELETE /posts/{post}       -> destroy\n\n// With name prefix\nRoute::resource('posts', PostController::class)\n    ->names('posts');\n\n// Partial resource\nRoute::resource('posts', PostController::class)\n    ->only(['index', 'show']); // Only these routes\n\nRoute::resource('posts', PostController::class)\n    ->except(['create', 'edit']); // All except these\n```\n\n⚠️ **Perhatian:**\n- Creates 7 RESTful routes\n- Route model binding otomatis ({post} bind ke Post model)\n- Use `->only()` atau `->except()` untuk customize\n- Check routes: `php artisan route:list`",
    en: "**Function:** Creates RESTful resource routes automatically.\n\n**When to use:** For standard CRUD operations with one line.\n\n**Example:**\n```php\nRoute::resource('posts', PostController::class);\n\n// Creates 7 routes:\n// GET    /posts              -> index\n// GET    /posts/create       -> create\n// POST   /posts              -> store\n// GET    /posts/{post}       -> show\n// GET    /posts/{post}/edit  -> edit\n// PUT    /posts/{post}       -> update\n// DELETE /posts/{post}       -> destroy\n```\n\n⚠️ **Attention:**\n- Creates 7 RESTful routes\n- Auto route model binding\n- Use `->only()` or `->except()` to customize"
  },
  {
    method: "Route::apiResource",
    category: "resource",
    id: "**Fungsi:** Membuat API resource routes (tanpa create/edit views).\n\n**Kapan dipakai:** Untuk API endpoints yang tidak butuh view routes.\n\n**Contoh penggunaan:**\n```php\n// API resource (5 routes - no create/edit)\nRoute::apiResource('posts', PostController::class);\n\n// Creates:\n// GET    /posts        -> index (return JSON)\n// POST   /posts        -> store (return JSON)\n// GET    /posts/{post} -> show (return JSON)\n// PUT    /posts/{post} -> update (return JSON)\n// DELETE /posts/{post} -> destroy (return 204)\n\n// Nested resource\nRoute::apiResource('posts.comments', CommentController::class);\n// URL: /posts/{post}/comments\n```\n\n⚠️ **Perhatian:**\n- Creates 5 routes (no create/edit - API tidak butuh form)\n- Controller methods return JSON, bukan view\n- Nested resource untuk related resources\n- Combine with middleware: `->middleware('auth:api')`",
    en: "**Function:** Creates API resource routes (without create/edit views).\n\n**When to use:** For API endpoints that don't need view routes.\n\n**Example:**\n```php\nRoute::apiResource('posts', PostController::class);\n\n// Creates 5 routes:\n// GET    /posts        -> index\n// POST   /posts        -> store\n// GET    /posts/{post} -> show\n// PUT    /posts/{post} -> update\n// DELETE /posts/{post} -> destroy\n```\n\n⚠️ **Attention:**\n- Creates 5 routes (no create/edit - API doesn't need forms)\n- Controller methods return JSON, not views"
  },
  {
    method: "Route::shallow",
    category: "resource",
    id: "**Fungsi:** Membuat shallow nested resource routes.\n\n**Kapan dipakai:** Untuk nested resources tanpa parent ID di URL untuk show/edit/update/destroy.\n\n**Contoh penggunaan:**\n```php\n// Normal nested\nRoute::resource('posts.comments', CommentController::class);\n// GET /posts/1/comments/5 (show)\n\n// Shallow nested\nRoute::shallow()->group(function () {\n    Route::resource('posts.comments', CommentController::class);\n});\n// GET /posts/1/comments (index) - needs parent\n// GET /comments/5 (show) - no parent needed!\n\n// Manual shallow\nRoute::resource('posts.comments', CommentController::class)\n    ->shallow();\n```\n\n⚠️ **Perhatian:**\n- Index/create/store tetap butuh parent ID\n- Show/edit/update/destroy tidak butuh parent ID\n- URL lebih clean untuk nested resources\n- Berguna untuk deeply nested resources",
    en: "**Function:** Creates shallow nested resource routes.\n\n**When to use:** For nested resources without parent ID in URL for show/edit/update/destroy.\n\n**Example:**\n```php\nRoute::shallow()->group(function () {\n    Route::resource('posts.comments', CommentController::class);\n});\n\n// Index needs parent: /posts/1/comments\n// Show doesn't: /comments/5\n```\n\n⚠️ **Attention:**\n- Index/create/store still need parent ID\n- Show/edit/update/destroy don't need parent ID\n- Cleaner URLs for nested resources"
  },
  {
    method: "Route::singleton",
    category: "resource",
    id: "**Fungsi:** Membuat singleton resource route (satu instance saja).\n\n**Kapan dipakai:** Untuk resource yang hanya ada satu instance, seperti settings, profile.\n\n**Contoh penggunaan:**\n```php\n// Singleton resource\nRoute::singleton('settings', SettingsController::class);\n\n// Creates:\n// GET    /settings       -> show\n// GET    /settings/edit  -> edit\n// PUT    /settings       -> update\n\n// Usage:\nroute('settings.show'); // /settings\nroute('settings.edit'); // /settings/edit\n```\n\n⚠️ **Perhatian:**\n- Laravel 10+\n- Untuk resource tanpa ID (hanya satu instance)\n- Creates show, edit, update routes\n- Berguna untuk: settings, profile, dashboard",
    en: "**Function:** Creates singleton resource route (single instance only).\n\n**When to use:** For resources that have only one instance, like settings, profile.\n\n**Example:**\n```php\nRoute::singleton('settings', SettingsController::class);\n\n// Creates:\n// GET    /settings       -> show\n// GET    /settings/edit  -> edit\n// PUT    /settings       -> update\n```\n\n⚠️ **Attention:**\n- Laravel 10+\n- For resources without ID (only one instance)\n- Creates show, edit, update routes"
  },
  
  // ============================================
  // ROUTE MODEL BINDING
  // ============================================
  {
    method: "Route::bind",
    category: "parameter",
    id: "**Fungsi:** Mendefinisikan custom route model binding.\n\n**Kapan dipakai:** Saat ingin custom logic untuk resolve route model.\n\n**Contoh penggunaan:**\n```php\n// In RouteServiceProvider::boot()\n\n// Custom binding\nRoute::bind('post', function ($value) {\n    return Post::where('slug', $value)->firstOrFail();\n});\n\n// Now {post} in routes will use slug instead of ID\nRoute::get('/posts/{post}', [PostController::class, 'show']);\n// URL: /posts/my-post-slug (not /posts/1)\n\n// With explicit binding (Laravel 8+)\nclass RouteServiceProvider extends ServiceProvider\n{\n    public function boot(): void\n    {\n        Route::bind('post', function ($value) {\n            return Post::where('slug', $value)->firstOrFail();\n        });\n    }\n}\n```\n\n⚠️ **Perhatian:**\n- Define di RouteServiceProvider::boot()\n- Override default ID binding\n- firstOrFail() untuk auto 404\n- Berguna untuk SEO-friendly URLs dengan slug",
    en: "**Function:** Defines custom route model binding.\n\n**When to use:** When you want custom logic to resolve route model.\n\n**Example:**\n```php\n// In RouteServiceProvider::boot()\nRoute::bind('post', function ($value) {\n    return Post::where('slug', $value)->firstOrFail();\n});\n\n// Now {post} uses slug instead of ID\nRoute::get('/posts/{post}', [PostController::class, 'show']);\n// URL: /posts/my-post-slug\n```\n\n⚠️ **Attention:**\n- Define in RouteServiceProvider::boot()\n- Overrides default ID binding\n- firstOrFail() for auto 404"
  },
  
  // ============================================
  // FALLBACK ROUTES
  // ============================================
  {
    method: "Route::fallback",
    category: "advanced",
    id: "**Fungsi:** Mendefinisikan fallback route untuk 404 handling.\n\n**Kapan dipakai:** Untuk custom 404 page handling.\n\n**Contoh penggunaan:**\n```php\n// Custom 404\nRoute::fallback(function () {\n    return view('errors.404', ['message' => 'Page not found']);\n});\n\n// API 404\nRoute::fallback(function () {\n    return response()->json([\n        'success' => false,\n        'message' => 'Endpoint not found',\n    ], 404);\n});\n\n// Redirect old routes\nRoute::fallback(function () {\n    return redirect()->route('home');\n});\n```\n\n⚠️ **Perhatian:**\n- Dipanggil jika tidak ada route yang match\n- Last resort untuk unmatched routes\n- Default Laravel 404 page bisa di-customize di resources/views/errors/404.blade.php\n- Untuk API, return JSON 404 response",
    en: "**Function:** Defines fallback route for 404 handling.\n\n**When to use:** For custom 404 page handling.\n\n**Example:**\n```php\nRoute::fallback(function () {\n    return view('errors.404', ['message' => 'Page not found']);\n});\n\n// API 404\nRoute::fallback(function () {\n    return response()->json([\n        'success' => false,\n        'message' => 'Endpoint not found',\n    ], 404);\n});\n```\n\n⚠️ **Attention:**\n- Called when no route matches\n- Last resort for unmatched routes\n- Default 404 page customizable in resources/views/errors/404.blade.php"
  },
  
  // ============================================
  // RATE LIMITING
  // ============================================
  {
    method: "throttle",
    category: "middleware",
    id: "**Fungsi:** Middleware untuk rate limiting (membatasi request per menit).\n\n**Kapan dipakai:** Untuk prevent abuse, brute force, atau overload.\n\n**Contoh penggunaan:**\n```php\n// Basic rate limiting\nRoute::post('/login', [AuthController::class, 'login'])\n    ->middleware('throttle:5,1'); // 5 requests per minute\n\n// API rate limiting\nRoute::middleware('throttle:60')->group(function () {\n    Route::apiResource('posts', PostController::class);\n});\n\n// Named limiter (define in RouteServiceProvider)\nRoute::middleware('throttle:api')->group(function () {\n    Route::apiResource('posts', PostController::class);\n});\n\n// Dynamic rate limiting\nRoute::post('/api/heavy-operation', [ApiController::class, 'heavy'])\n    ->middleware('throttle:10,1'); // 10 per minute for heavy ops\n```\n\n**Perhatian:**\n- Format: `throttle:maxRequests,decayMinutes`\n- Default: 60 requests per minute\n- Define custom limiters di RouteServiceProvider\n- Returns 429 Too Many Requests jika exceed",
    en: "**Function:** Middleware for rate limiting (limits requests per minute).\n\n**When to use:** To prevent abuse, brute force, or overload.\n\n**Example:**\n```php\nRoute::post('/login', [AuthController::class, 'login'])\n    ->middleware('throttle:5,1'); // 5 requests per minute\n\nRoute::middleware('throttle:60')->group(function () {\n    Route::apiResource('posts', PostController::class);\n});\n```\n\n**Attention:**\n- Format: `throttle:maxRequests,decayMinutes`\n- Default: 60 requests per minute\n- Returns 429 Too Many Requests if exceeded"
  },
  
  // ============================================
  // DOMAIN ROUTING
  // ============================================
  {
    method: "Route::domain",
    category: "advanced",
    id: "**Fungsi:** Mendefinisikan routes untuk specific domain/subdomain.\n\n**Kapan dipakai:** Untuk multi-tenant apps, admin panel di subdomain berbeda.\n\n**Contoh penggunaan:**\n```php\n// Subdomain routing\nRoute::domain('{tenant}.myapp.com')->group(function () {\n    Route::get('/', [TenantController::class, 'index']);\n});\n\n// Admin subdomain\nRoute::domain('admin.myapp.com')->group(function () {\n    Route::get('/', [AdminController::class, 'index']);\n});\n\n// With parameter\nRoute::domain('{account}.myapp.com')->group(function () {\n    Route::get('/', function ($account) {\n        // $account from domain\n    });\n    \n    Route::get('/users/{user}', function ($account, $user) {\n        // Both $account and $user available\n    });\n});\n```\n\n**Perhatian:**\n- Laravel 8+\n- Domain parameter di-pass ke controller\n- Berguna untuk SaaS multi-tenant\n- Configure DNS untuk subdomain wildcard",
    en: "**Function:** Defines routes for specific domain/subdomain.\n\n**When to use:** For multi-tenant apps, admin panel on different subdomain.\n\n**Example:**\n```php\nRoute::domain('{tenant}.myapp.com')->group(function () {\n    Route::get('/', [TenantController::class, 'index']);\n});\n\nRoute::domain('admin.myapp.com')->group(function () {\n    Route::get('/', [AdminController::class, 'index']);\n});\n```\n\n**Attention:**\n- Laravel 8+\n- Domain parameter passed to controller\n- Useful for SaaS multi-tenant"
  },
  
  // ============================================
  // AUTH ROUTES
  // ============================================
  {
    method: "Route::getVerifyEmail",
    aliases: ["verification"],
    category: "advanced",
    id: "**Fungsi:** Email verification routes.\n\n**Kapan dipakai:** Untuk fitur email verification Laravel Breeze/Jetstream.\n\n**Contoh penggunaan:**\n```php\n// In web.php (Laravel Breeze/Jetstream)\nRoute::middleware('auth')->group(function () {\n    Route::get('/email/verify', [VerifyEmailController::class, '__invoke'])\n        ->name('verification.notice');\n    \n    Route::get('/email/verify/{id}/{hash}', [VerifyEmailController::class, '__invoke'])\n        ->middleware(['signed', 'throttle:6,1'])\n        ->name('verification.verify');\n    \n    Route::post('/email/verification-notification', [VerifyEmailController::class, 'store'])\n        ->middleware('throttle:6,1')\n        ->name('verification.send');\n});\n\n// Or use Auth::routes() in Laravel UI\nAuth::routes(['verify' => true]);\n```\n\n**Perhatian:**\n- Requires VerifiesEmails trait di User model\n- Signed URL untuk verification link\n- Rate limited untuk prevent abuse\n- Model harus implement MustVerifyEmail interface",
    en: "**Function:** Email verification routes.\n\n**When to use:** For Laravel Breeze/Jetstream email verification feature.\n\n**Example:**\n```php\nRoute::middleware('auth')->group(function () {\n    Route::get('/email/verify', [VerifyEmailController::class, '__invoke'])\n        ->name('verification.notice');\n});\n```\n\n**Attention:**\n- Requires VerifiesEmails trait in User model\n- Signed URL for verification link\n- Rate limited to prevent abuse"
  },
  {
    method: "Auth::routes",
    category: "advanced",
    id: "**Fungsi:** Scaffold authentication routes (login, register, password reset).\n\n**Kapan dipakai:** Saat menggunakan Laravel UI package untuk authentication.\n\n**Contoh penggunaan:**\n```php\n// In routes/web.php\nuse Illuminate\\Support\\Facades\\Auth;\n\n// Full auth routes\nAuth::routes();\n\n// Specific routes only\nAuth::routes(['register' => false]); // Disable registration\nAuth::routes(['verify' => true]); // Enable email verification\nAuth::routes(['reset' => false]); // Disable password reset\n\n// Creates:\n// GET /login -> login form\n// POST /login -> login submit\n// GET /register -> register form\n// POST /register -> register submit\n// GET /password/reset -> forgot password\n// POST /password/email -> send reset link\n// GET /password/reset/{token} -> reset form\n// POST /password/reset -> reset submit\n```\n\n**Perhatian:**\n- Laravel UI package: `composer require laravel/ui`\n- Generate: `php artisan ui:vue --auth` atau `php artisan ui:react --auth`\n- Untuk Laravel Breeze/Jetstream, tidak pakai Auth::routes()\n- Routes bisa di-customize dengan options array",
    en: "**Function:** Scaffolds authentication routes (login, register, password reset).\n\n**When to use:** When using Laravel UI package for authentication.\n\n**Example:**\n```php\nuse Illuminate\\Support\\Facades\\Auth;\n\nAuth::routes();\n\n// Specific routes only\nAuth::routes(['register' => false]); // Disable registration\nAuth::routes(['verify' => true]); // Enable email verification\n```\n\n**Attention:**\n- Laravel UI package: `composer require laravel/ui`\n- For Laravel Breeze/Jetstream, don't use Auth::routes()"
  },

  // ============================================
  // ROUTE HELPERS & UTILITIES
  // ============================================
  {
    method: "Route::fallback",
    category: "advanced",
    id: "**Fungsi:** Mendefinisikan fallback route untuk URL yang tidak match.\n\n**Kapan dipakai:** Untuk custom 404 handling atau catch-all route.\n\n**Contoh penggunaan:**\n```php\n// Custom 404 page\nRoute::fallback(function () {\n    return view('errors.404');\n});\n\n// API fallback\nRoute::fallback(function () {\n    return response()->json(['message' => 'Not Found'], 404);\n});\n\n// Redirect to home\nRoute::fallback(function () {\n    return redirect('/');\n});\n```\n\n**Perhatian:**\n- Harus didefinisikan di akhir routes file\n- Berguna untuk SPA routing\n- Jangan forget status code 404",
    en: "**Function:** Defines fallback route for unmatched URLs.\n\n**When to use:** For custom 404 handling or catch-all route.\n\n**Example:**\n```php\nRoute::fallback(function () {\n    return view('errors.404');\n});\n```\n\n**Attention:**\n- Must be defined at end of routes file\n- Useful for SPA routing"
  },
  {
    method: "Route::permanentRedirect",
    category: "basic",
    id: "**Fungsi:** Redirect permanen dengan status 301.\n\n**Kapan dipakai:** Untuk redirect URL lama ke baru secara permanen (SEO friendly).\n\n**Contoh penggunaan:**\n```php\n// Permanent redirect (301)\nRoute::permanentRedirect('/old-page', '/new-page');\n\n// Same as\nRoute::redirect('/old-page', '/new-page', 301);\n```\n\n**Perhatian:**\n- Status 301 Moved Permanently\n- SEO: search engines update their index\n- Browser caches 301 redirects",
    en: "**Function:** Permanent redirect with 301 status.\n\n**When to use:** To redirect old URL to new permanently (SEO friendly).\n\n**Example:**\n```php\nRoute::permanentRedirect('/old-page', '/new-page');\n```\n\n**Attention:**\n- Status 301 Moved Permanently\n- SEO: search engines update their index"
  },
  {
    method: "Route::current",
    aliases: ["Route::currentRouteName", "request()->route()"],
    category: "advanced",
    id: "**Fungsi:** Mendapatkan informasi route yang sedang aktif.\n\n**Kapan dipakai:** Untuk conditional logic berdasarkan current route.\n\n**Contoh penggunaan:**\n```php\n// Get current route\n$route = Route::current();\n$name = Route::currentRouteName();\n$action = Route::currentRouteAction();\n\n// Check if current route matches\nif (request()->routeIs('posts.*')) {\n    // Currently on posts routes\n}\n\n// In Blade\n@if (request()->routeIs('home'))\n    <span class=\"active\">Home</span>\n@endif\n\n// Get route parameters\n$id = request()->route('id');\n```\n\n**Perhatian:**\n- routeIs() support wildcards (posts.*)\n- Berguna untuk active menu state\n- currentRouteName() return route name",
    en: "**Function:** Gets information about current active route.\n\n**When to use:** For conditional logic based on current route.\n\n**Example:**\n```php\n$name = Route::currentRouteName();\n\nif (request()->routeIs('posts.*')) {\n    // Currently on posts routes\n}\n```\n\n**Attention:**\n- routeIs() supports wildcards (posts.*)\n- Useful for active menu state"
  },
  {
    method: "Route::has",
    category: "advanced",
    id: "**Fungsi:** Check apakah named route exists.\n\n**Kapan dipakai:** Untuk conditional logic sebelum generate URL.\n\n**Contoh penggunaan:**\n```php\nif (Route::has('login')) {\n    $loginUrl = route('login');\n}\n\n// In Blade\n@if (Route::has('register'))\n    <a href=\"{{ route('register') }}\">Register</a>\n@endif\n```\n\n**Perhatian:**\n- Return boolean\n- Berguna untuk feature flags\n- Check sebelum route() untuk avoid exception",
    en: "**Function:** Checks if named route exists.\n\n**When to use:** For conditional logic before generating URL.\n\n**Example:**\n```php\nif (Route::has('login')) {\n    $loginUrl = route('login');\n}\n```\n\n**Attention:**\n- Returns boolean\n- Useful for feature flags"
  },
  {
    method: "Route::getRoutes",
    category: "advanced",
    id: "**Fungsi:** Mendapatkan semua registered routes.\n\n**Kapan dipakai:** Untuk debugging, documentation generation, atau admin panel.\n\n**Contoh penggunaan:**\n```php\n// Get all routes\n$routes = Route::getRoutes();\n\nforeach ($routes as $route) {\n    echo $route->uri();\n    echo $route->getName();\n    echo implode('|', $route->methods());\n    echo $route->getActionName();\n}\n\n// Artisan command\n// php artisan route:list\n```\n\n**Perhatian:**\n- Returns RouteCollection\n- Berguna untuk auto-documentation\n- `php artisan route:list` untuk CLI",
    en: "**Function:** Gets all registered routes.\n\n**When to use:** For debugging, documentation generation, or admin panel.\n\n**Example:**\n```php\n$routes = Route::getRoutes();\n\nforeach ($routes as $route) {\n    echo $route->uri();\n}\n```\n\n**Attention:**\n- Returns RouteCollection\n- `php artisan route:list` for CLI"
  },

  // ============================================
  // ROUTE CACHING
  // ============================================
  {
    method: "route:cache",
    aliases: ["Route::cache", "route:clear"],
    category: "advanced",
    id: "**Fungsi:** Cache routes untuk production performance.\n\n**Kapan dipakai:** Saat deploy ke production untuk speed up route registration.\n\n**Contoh penggunaan:**\n```bash\n# Cache routes\nphp artisan route:cache\n\n# Clear route cache\nphp artisan route:clear\n\n# List all routes\nphp artisan route:list\n```\n\n**Perhatian:**\n- Significant performance boost\n- Harus re-cache setiap kali routes berubah\n- Tidak bisa digunakan dengan Closure routes\n- Gunakan Controller-based routes untuk caching",
    en: "**Function:** Caches routes for production performance.\n\n**When to use:** When deploying to production to speed up route registration.\n\n**Example:**\n```bash\nphp artisan route:cache\nphp artisan route:clear\n```\n\n**Attention:**\n- Significant performance boost\n- Must re-cache when routes change\n- Cannot use with Closure routes"
  },

  // ============================================
  // ROUTE MODEL BINDING
  // ============================================
  {
    method: "Route::model",
    aliases: ["implicit binding", "explicit binding"],
    category: "parameter",
    id: "**Fungsi:** Configure route model binding.\n\n**Kapan dipakai:** Untuk auto-inject model instance berdasarkan route parameter.\n\n**Contoh penggunaan:**\n```php\n// Implicit binding (automatic)\nRoute::get('/posts/{post}', function (Post $post) {\n    return $post;\n});\n\n// Explicit binding (in RouteServiceProvider)\npublic function boot()\n{\n    Route::model('post', Post::class);\n}\n\n// Custom key (not id)\nRoute::get('/posts/{post:slug}', function (Post $post) {\n    return $post;\n});\n\n// In model\npublic function getRouteKeyName()\n{\n    return 'slug';\n}\n\n// Soft deleted models\nRoute::get('/posts/{post}', function (Post $post) {\n    return $post;\n})->withTrashed();\n```\n\n**Perhatian:**\n- Implicit binding: type-hint model di parameter\n- Custom key: {post:slug} untuk lookup by slug\n- withTrashed() untuk include soft deleted\n- Auto 404 jika model tidak ditemukan",
    en: "**Function:** Configures route model binding.\n\n**When to use:** To auto-inject model instance based on route parameter.\n\n**Example:**\n```php\n// Implicit binding\nRoute::get('/posts/{post}', function (Post $post) {\n    return $post;\n});\n\n// Custom key\nRoute::get('/posts/{post:slug}', function (Post $post) {\n    return $post;\n});\n```\n\n**Attention:**\n- Type-hint model in parameter\n- {post:slug} for lookup by slug\n- Auto 404 if model not found"
  },

  // ============================================
  // SIGNED ROUTES
  // ============================================
  {
    method: "Route::signedRoute",
    aliases: ["URL::signedRoute", "hasValidSignature"],
    category: "advanced",
    id: "**Fungsi:** Generate signed URL yang tamper-proof.\n\n**Kapan dipakai:** Untuk email verification, unsubscribe links, atau sensitive actions.\n\n**Contoh penggunaan:**\n```php\nuse Illuminate\\Support\\Facades\\URL;\n\n// Generate signed URL\n$url = URL::signedRoute('unsubscribe', ['user' => $user->id]);\n\n// Temporary signed URL\n$url = URL::temporarySignedRoute(\n    'unsubscribe',\n    now()->addMinutes(30),\n    ['user' => $user->id]\n);\n\n// In route\nRoute::get('/unsubscribe/{user}', [NewsletterController::class, 'unsubscribe'])\n    ->name('unsubscribe')\n    ->middleware('signed');\n\n// Manual validation\nif (! $request->hasValidSignature()) {\n    abort(401);\n}\n```\n\n**Perhatian:**\n- URL tidak bisa di-tamper (hash signature)\n- temporarySignedRoute() untuk expiring URLs\n- 'signed' middleware untuk auto-validate\n- Berguna untuk email links",
    en: "**Function:** Generates tamper-proof signed URL.\n\n**When to use:** For email verification, unsubscribe links, or sensitive actions.\n\n**Example:**\n```php\n$url = URL::signedRoute('unsubscribe', ['user' => $user->id]);\n\n$url = URL::temporarySignedRoute(\n    'unsubscribe',\n    now()->addMinutes(30),\n    ['user' => $user->id]\n);\n\nRoute::get('/unsubscribe/{user}', ...)\n    ->middleware('signed');\n```\n\n**Attention:**\n- URL cannot be tampered (hash signature)\n- temporarySignedRoute() for expiring URLs"
  },

  // ============================================
  // SINGLETON ROUTES
  // ============================================
  {
    method: "Route::singleton",
    category: "resource",
    id: "**Fungsi:** Resource route untuk single resource (tanpa ID).\n\n**Kapan dipakai:** Untuk resource yang hanya ada satu per user (profile, settings).\n\n**Contoh penggunaan:**\n```php\n// Singleton resource\nRoute::singleton('profile', ProfileController::class);\n\n// Creates:\n// GET /profile -> show\n// GET /profile/edit -> edit\n// PUT/PATCH /profile -> update\n\n// With additional methods\nRoute::singleton('profile', ProfileController::class)\n    ->creatable(); // Add create/store routes\n```\n\n**Perhatian:**\n- Laravel 9.38+\n- Tidak ada index atau destroy routes by default\n- No ID parameter (single resource per user)\n- creatable() untuk add create/store",
    en: "**Function:** Resource route for single resource (without ID).\n\n**When to use:** For resources with only one per user (profile, settings).\n\n**Example:**\n```php\nRoute::singleton('profile', ProfileController::class);\n\n// Creates: GET /profile, GET /profile/edit, PUT /profile\n```\n\n**Attention:**\n- Laravel 9.38+\n- No index or destroy routes by default"
  },

  // ============================================
  // SCOPED BINDINGS
  // ============================================
  {
    method: "scopeBindings",
    category: "parameter",
    id: "**Fungsi:** Enforce parent-child relationship di nested routes.\n\n**Kapan dipakai:** Untuk memastikan child resource belongs to parent.\n\n**Contoh penggunaan:**\n```php\n// Scoped binding\nRoute::get('/users/{user}/posts/{post}', function (User $user, Post $post) {\n    // $post is automatically scoped to $user\n    // If $post->user_id != $user->id, 404\n})->scopeBindings();\n\n// Group scoped bindings\nRoute::scopeBindings()->group(function () {\n    Route::get('/users/{user}/posts/{post}', ...);\n    Route::get('/users/{user}/comments/{comment}', ...);\n});\n```\n\n**Perhatian:**\n- Auto-validates parent-child relationship\n- 404 jika relationship tidak valid\n- Requires proper Eloquent relationships",
    en: "**Function:** Enforces parent-child relationship in nested routes.\n\n**When to use:** To ensure child resource belongs to parent.\n\n**Example:**\n```php\nRoute::get('/users/{user}/posts/{post}', function (User $user, Post $post) {\n    // $post automatically scoped to $user\n})->scopeBindings();\n```\n\n**Attention:**\n- Auto-validates parent-child relationship\n- 404 if relationship invalid"
  },

  // ============================================
  // ROUTE CONTROL
  // ============================================
  {
    method: "withoutMiddleware",
    category: "middleware",
    id: "**Fungsi:** Remove middleware dari route tertentu.\n\n**Kapan dipakai:** Saat route dalam group tapi tidak butuh semua middleware.\n\n**Contoh penggunaan:**\n```php\n// Remove specific middleware\nRoute::middleware(['auth', 'verified'])->group(function () {\n    Route::get('/dashboard', ...); // Both middlewares\n    \n    Route::get('/settings', ...)\n        ->withoutMiddleware(['verified']); // Only auth\n});\n\n// Remove from resource\nRoute::resource('posts', PostController::class)\n    ->withoutMiddleware(['auth'])\n    ->only(['index', 'show']);\n```\n\n**Perhatian:**\n- Exclude middleware dari group\n- Berguna untuk public routes dalam protected group",
    en: "**Function:** Removes middleware from specific route.\n\n**When to use:** When route in group but doesn't need all middlewares.\n\n**Example:**\n```php\nRoute::middleware(['auth', 'verified'])->group(function () {\n    Route::get('/settings', ...)\n        ->withoutMiddleware(['verified']);\n});\n```\n\n**Attention:**\n- Excludes middleware from group\n- Useful for public routes in protected group"
  },
  {
    method: "missing",
    category: "parameter",
    id: "**Fungsi:** Handle missing model binding dengan custom response.\n\n**Kapan dipakai:** Untuk custom 404 response saat model tidak ditemukan.\n\n**Contoh penggunaan:**\n```php\nRoute::get('/posts/{post}', [PostController::class, 'show'])\n    ->missing(function (Request $request) {\n        return redirect()->route('posts.index')\n            ->with('error', 'Post not found');\n    });\n\n// For API\nRoute::get('/api/posts/{post}', [PostController::class, 'show'])\n    ->missing(function (Request $request) {\n        return response()->json(['message' => 'Post not found'], 404);\n    });\n```\n\n**Perhatian:**\n- Custom handling untuk 404\n- Per-route basis\n- Berguna untuk redirect atau custom message",
    en: "**Function:** Handles missing model binding with custom response.\n\n**When to use:** For custom 404 response when model not found.\n\n**Example:**\n```php\nRoute::get('/posts/{post}', [PostController::class, 'show'])\n    ->missing(function (Request $request) {\n        return redirect()->route('posts.index');\n    });\n```\n\n**Attention:**\n- Custom handling for 404\n- Per-route basis"
  },

  // ============================================
  // CONTROLLER ROUTES
  // ============================================
  {
    method: "Route::controller",
    category: "group",
    id: "**Fungsi:** Group routes dengan controller yang sama.\n\n**Kapan dipakai:** Saat multiple routes menggunakan controller yang sama.\n\n**Contoh penggunaan:**\n```php\n// Controller group\nRoute::controller(PostController::class)->group(function () {\n    Route::get('/posts', 'index');\n    Route::get('/posts/{id}', 'show');\n    Route::post('/posts', 'store');\n});\n\n// With prefix and middleware\nRoute::controller(PostController::class)\n    ->prefix('posts')\n    ->middleware('auth')\n    ->group(function () {\n        Route::get('/', 'index')->name('posts.index');\n        Route::get('/{id}', 'show')->name('posts.show');\n    });\n```\n\n**Perhatian:**\n- Laravel 9+\n- Reduce repetition\n- Chainable dengan prefix, middleware, etc",
    en: "**Function:** Groups routes with same controller.\n\n**When to use:** When multiple routes use the same controller.\n\n**Example:**\n```php\nRoute::controller(PostController::class)->group(function () {\n    Route::get('/posts', 'index');\n    Route::get('/posts/{id}', 'show');\n});\n```\n\n**Attention:**\n- Laravel 9+\n- Reduces repetition"
  },

  // ============================================
  // INVOKABLE CONTROLLERS
  // ============================================
  {
    method: "__invoke",
    aliases: ["invokable controller", "single action controller"],
    category: "resource",
    id: "**Fungsi:** Single action controller dengan __invoke method.\n\n**Kapan dipakai:** Saat controller hanya punya satu method.\n\n**Contoh penggunaan:**\n```php\n// Create: php artisan make:controller ShowDashboard --invokable\n\n// Controller\nclass ShowDashboard extends Controller\n{\n    public function __invoke(Request $request)\n    {\n        return view('dashboard');\n    }\n}\n\n// Route - no method needed\nRoute::get('/dashboard', ShowDashboard::class);\n```\n\n**Perhatian:**\n- Tidak perlu specify method name di route\n- Clean untuk single-purpose controllers\n- Best practice untuk simple actions",
    en: "**Function:** Single action controller with __invoke method.\n\n**When to use:** When controller has only one method.\n\n**Example:**\n```php\nclass ShowDashboard extends Controller\n{\n    public function __invoke(Request $request)\n    {\n        return view('dashboard');\n    }\n}\n\nRoute::get('/dashboard', ShowDashboard::class);\n```\n\n**Attention:**\n- No method name needed in route\n- Clean for single-purpose controllers"
  },

  // ============================================
  // ROUTE MACROS
  // ============================================
  {
    method: "Route::macro",
    category: "advanced",
    id: "**Fungsi:** Extend Router dengan custom methods.\n\n**Kapan dipakai:** Untuk reusable custom routing patterns.\n\n**Contoh penggunaan:**\n```php\n// In AppServiceProvider boot()\nRoute::macro('softDeletes', function (string $uri, string $controller) {\n    Route::get(\"{$uri}/trashed\", [$controller, 'trashed'])->name(\"{$uri}.trashed\");\n    Route::post(\"{$uri}/{id}/restore\", [$controller, 'restore'])->name(\"{$uri}.restore\");\n    Route::delete(\"{$uri}/{id}/force\", [$controller, 'forceDelete'])->name(\"{$uri}.force-delete\");\n});\n\n// Usage\nRoute::softDeletes('posts', PostController::class);\n```\n\n**Perhatian:**\n- Define di ServiceProvider boot()\n- Reusable routing patterns\n- Extend Laravel's Router class",
    en: "**Function:** Extends Router with custom methods.\n\n**When to use:** For reusable custom routing patterns.\n\n**Example:**\n```php\nRoute::macro('softDeletes', function ($uri, $controller) {\n    Route::get(\"{$uri}/trashed\", [$controller, 'trashed']);\n});\n\nRoute::softDeletes('posts', PostController::class);\n```\n\n**Attention:**\n- Define in ServiceProvider boot()\n- Reusable routing patterns"
  },

  // ============================================
  // API VERSIONING
  // ============================================
  {
    method: "api versioning",
    aliases: ["api/v1", "api/v2"],
    category: "group",
    id: "**Fungsi:** Pattern untuk API versioning.\n\n**Kapan dipakai:** Untuk maintain backward compatibility saat API berubah.\n\n**Contoh penggunaan:**\n```php\n// routes/api.php\n\n// Version 1\nRoute::prefix('v1')->group(function () {\n    Route::apiResource('posts', App\\Http\\Controllers\\Api\\V1\\PostController::class);\n});\n\n// Version 2\nRoute::prefix('v2')->group(function () {\n    Route::apiResource('posts', App\\Http\\Controllers\\Api\\V2\\PostController::class);\n});\n\n// URL: /api/v1/posts, /api/v2/posts\n```\n\n**Perhatian:**\n- Separate controllers per version\n- URL prefix: /api/v1/, /api/v2/\n- Maintain old versions untuk backward compatibility",
    en: "**Function:** Pattern for API versioning.\n\n**When to use:** To maintain backward compatibility when API changes.\n\n**Example:**\n```php\nRoute::prefix('v1')->group(function () {\n    Route::apiResource('posts', V1\\PostController::class);\n});\n\nRoute::prefix('v2')->group(function () {\n    Route::apiResource('posts', V2\\PostController::class);\n});\n```\n\n**Attention:**\n- Separate controllers per version\n- URL prefix: /api/v1/, /api/v2/"
  },

  // ============================================
  // RATE LIMITING
  // ============================================
  {
    method: "RateLimiter::for",
    aliases: ["throttle", "rate limit"],
    category: "middleware",
    id: "**Fungsi:** Membuat custom rate limiter.\n\n**Kapan dipakai:** Untuk membatasi jumlah request per waktu.\n\n**Contoh penggunaan:**\n```php\n// In App\\Providers\\RouteServiceProvider\nRateLimiter::for('api', function (Request $request) {\n    return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());\n});\n\nRateLimiter::for('uploads', function (Request $request) {\n    return $request->user()?->isPremium()\n        ? Limit::none()\n        : Limit::perMinute(10);\n});\n\n// Apply in routes\nRoute::middleware(['throttle:api'])->group(function () {\n    Route::get('/posts', [PostController::class, 'index']);\n});\n```\n\n**Perhatian:**\n- Define di RouteServiceProvider boot()\n- Bisa conditional berdasarkan user\n- Limit::none() untuk unlimited",
    en: "**Function:** Creates custom rate limiter.\n\n**When to use:** To limit number of requests per time period.\n\n**Example:**\n```php\nRateLimiter::for('api', function (Request $request) {\n    return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());\n});\n\nRoute::middleware(['throttle:api'])->group(...);\n```\n\n**Attention:**\n- Define in RouteServiceProvider boot()\n- Can be conditional based on user"
  },
  {
    method: "Route::domain",
    aliases: ["subdomain routing"],
    category: "group",
    id: "**Fungsi:** Mendefinisikan route untuk domain/subdomain tertentu.\n\n**Kapan dipakai:** Untuk multi-tenant apps atau subdomain routing.\n\n**Contoh penggunaan:**\n```php\n// Subdomain routing\nRoute::domain('{account}.myapp.com')->group(function () {\n    Route::get('/dashboard', [AccountController::class, 'dashboard']);\n});\n\n// In controller\npublic function dashboard($account)\n{\n    $tenant = Tenant::where('subdomain', $account)->firstOrFail();\n    return view('dashboard', compact('tenant'));\n}\n\n// Specific domain\nRoute::domain('api.myapp.com')->group(function () {\n    Route::apiResource('posts', PostController::class);\n});\n```\n\n**Perhatian:**\n- Subdomain jadi parameter\n- Wildcard: {subdomain}\n- Bisa combine dengan prefix, middleware",
    en: "**Function:** Defines routes for specific domain/subdomain.\n\n**When to use:** For multi-tenant apps or subdomain routing.\n\n**Example:**\n```php\nRoute::domain('{account}.myapp.com')->group(function () {\n    Route::get('/dashboard', [AccountController::class, 'dashboard']);\n});\n```\n\n**Attention:**\n- Subdomain becomes parameter\n- Wildcard: {subdomain}\n- Combinable with prefix, middleware"
  },
  {
    method: "Route::pattern",
    aliases: ["global constraint"],
    category: "parameter",
    id: "**Fungsi:** Mendefinisikan global pattern constraint untuk parameter.\n\n**Kapan dipakai:** Untuk memastikan parameter selalu sesuai format.\n\n**Contoh penggunaan:**\n```php\n// In App\\Providers\\RouteServiceProvider boot()\nRoute::pattern('id', '[0-9]+');\nRoute::pattern('slug', '[a-z0-9-]+');\nRoute::pattern('uuid', '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}');\n\n// All routes with {id} will be numeric\nRoute::get('/posts/{id}', [PostController::class, 'show']); // Only numeric\nRoute::get('/posts/{slug}', [PostController::class, 'bySlug']); // Only lowercase alphanumeric + dash\n```\n\n**Perhatian:**\n- Define di RouteServiceProvider boot()\n- Applies globally ke semua routes\n- Override dengan ->where() per route",
    en: "**Function:** Defines global pattern constraint for parameters.\n\n**When to use:** To ensure parameters always match a format.\n\n**Example:**\n```php\n// In RouteServiceProvider boot()\nRoute::pattern('id', '[0-9]+');\nRoute::pattern('slug', '[a-z0-9-]+');\n\nRoute::get('/posts/{id}', ...); // Only numeric\n```\n\n**Attention:**\n- Define in RouteServiceProvider boot()\n- Applies globally\n- Override with ->where() per route"
  },
  {
    method: "Route::currentRouteName",
    aliases: ["current route", "active route"],
    category: "advanced",
    id: "**Fungsi:** Mendapatkan nama route yang sedang aktif.\n\n**Kapan dipakai:** Untuk navigation active state, conditional logic.\n\n**Contoh penggunaan:**\n```php\n// In Blade template\n<a href=\"{{ route('posts.index') }}\" \n   class=\"{{ Route::currentRouteName() === 'posts.index' ? 'active' : '' }}\">\n    Posts\n</a>\n\n// In controller\nif (Route::currentRouteName() === 'admin.dashboard') {\n    // Admin-specific logic\n}\n\n// Check with pattern\nif (str_starts_with(Route::currentRouteName(), 'admin.')) {\n    // Is in admin section\n}\n```\n\n**Perhatian:**\n- Returns null jika route tidak punya nama\n- Gunakan Route::is() untuk pattern matching\n- Bisa di Blade, Controller, Middleware",
    en: "**Function:** Gets the currently active route name.\n\n**When to use:** For navigation active state, conditional logic.\n\n**Example:**\n```php\n// In Blade\n<a class=\"{{ Route::currentRouteName() === 'posts.index' ? 'active' : '' }}\">\n\n// In controller\nif (Route::currentRouteName() === 'admin.dashboard') {\n    // Admin-specific logic\n}\n```\n\n**Attention:**\n- Returns null if route has no name\n- Use Route::is() for pattern matching"
  },
  {
    method: "Route::is",
    aliases: ["route is", "named route check"],
    category: "advanced",
    id: "**Fungsi:** Mengecek apakah current route cocok dengan pattern.\n\n**Kapan dipakai:** Untuk navigation, conditional rendering.\n\n**Contoh penggunaan:**\n```php\n// In Blade\n@if(Route::is('posts.*'))\n    <div>You are in the Posts section</div>\n@endif\n\n@if(Route::is('admin.*'))\n    @include('partials.admin-sidebar')\n@endif\n\n// Multiple patterns\n@if(Route::is('posts.index', 'posts.show'))\n    @include('partials.post-sidebar')\n@endif\n\n// In controller\nif (request()->routeIs('api.*')) {\n    return response()->json($data);\n}\n```\n\n**Perhatian:**\n- Supports wildcard patterns (*)\n- Multiple patterns allowed\n- Works in Blade, Controller, Middleware",
    en: "**Function:** Checks if current route matches a pattern.\n\n**When to use:** For navigation, conditional rendering.\n\n**Example:**\n```php\n@if(Route::is('posts.*'))\n    <div>You are in Posts section</div>\n@endif\n\n@if(Route::is('admin.*', 'user.*'))\n    // Multiple patterns\n@endif\n```\n\n**Attention:**\n- Supports wildcard patterns (*)\n- Multiple patterns allowed"
  },
  {
    method: "Route::substituteBindings",
    aliases: ["custom binding resolution"],
    category: "advanced",
    id: "**Fungsi:** Custom logic untuk resolve route model binding.\n\n**Kapan dipakai:** Untuk complex binding resolution scenarios.\n\n**Contoh penggunaan:**\n```php\n// In RouteServiceProvider boot()\nRoute::bind('post', function (string $value) {\n    return Post::where('slug', $value)\n        ->orWhere('id', $value)\n        ->firstOrFail();\n});\n\n// Can resolve by slug OR id\nRoute::get('/posts/{post}', [PostController::class, 'show']);\n// /posts/123 works\n// /posts/my-post-slug also works\n\n// Context-aware binding\nRoute::bind('post', function ($value, $route) {\n    $userId = $route->parameter('user');\n    return Post::where('user_id', $userId)\n        ->where('slug', $value)\n        ->firstOrFail();\n});\n```\n\n**Perhatian:**\n- Define di RouteServiceProvider boot()\n- Bisa access route parameters\n- Custom query logic",
    en: "**Function:** Custom logic for resolving route model bindings.\n\n**When to use:** For complex binding resolution scenarios.\n\n**Example:**\n```php\nRoute::bind('post', function (string $value) {\n    return Post::where('slug', $value)\n        ->orWhere('id', $value)\n        ->firstOrFail();\n});\n```\n\n**Attention:**\n- Define in RouteServiceProvider boot()\n- Can access route parameters\n- Custom query logic"
  },
  {
    method: "Route::dispatchToRoute",
    aliases: ["internal route dispatch"],
    category: "advanced",
    id: "**Fungsi:** Dispatch request ke route secara internal.\n\n**Kapan dipakai:** Untuk internal API calls tanpa HTTP overhead.\n\n**Contoh penggunaan:**\n```php\n// Internal API call\n$request = Request::create('/api/posts/1', 'GET');\n$response = Route::dispatchToRoute($request);\n$data = json_decode($response->getContent(), true);\n\n// With custom headers\n$request = Request::create('/api/posts', 'POST', [\n    'title' => 'Test',\n    'body' => 'Content'\n]);\n$request->headers->set('Authorization', 'Bearer ' . $token);\n$response = Route::dispatchToRoute($request);\n```\n\n**Perhatian:**\n- Bypasses HTTP layer\n- Useful untuk testing dan internal calls\n- Middleware masih dijalankan",
    en: "**Function:** Dispatches a request to a route internally.\n\n**When to use:** For internal API calls without HTTP overhead.\n\n**Example:**\n```php\n$request = Request::create('/api/posts/1', 'GET');\n$response = Route::dispatchToRoute($request);\n$data = json_decode($response->getContent(), true);\n```\n\n**Attention:**\n- Bypasses HTTP layer\n- Useful for testing and internal calls"
  },
  {
    method: "Route::substituteImplicitBindings",
    aliases: ["implicit binding", "auto binding"],
    category: "advanced",
    id: "**Fungsi:** Mengontrol implicit model binding pada route.\n\n**Kapan dipakai:** Untuk fine-grained control atas model binding.\n\n**Contoh penggunaan:**\n```php\n// Disable implicit bindings for specific routes\nRoute::get('/posts/{post}', [PostController::class, 'show'])\n    ->withoutMiddleware(SubstituteBindings::class);\n\n// Manual resolution in controller\npublic function show($post) // receives string/int instead of model\n{\n    $post = Post::withTrashed()->findOrFail($post);\n    return view('posts.show', compact('post'));\n}\n\n// Custom column for binding globally\n// In Model\npublic function getRouteKeyName()\n{\n    return 'slug';\n}\n```\n\n**Perhatian:**\n- SubstituteBindings middleware handles this\n- Override getRouteKeyName() in model\n- Disable untuk custom resolution",
    en: "**Function:** Controls implicit model binding on routes.\n\n**When to use:** For fine-grained control over model binding.\n\n**Example:**\n```php\nRoute::get('/posts/{post}', ...)\n    ->withoutMiddleware(SubstituteBindings::class);\n\n// In Model - custom key\npublic function getRouteKeyName() {\n    return 'slug';\n}\n```\n\n**Attention:**\n- SubstituteBindings middleware handles this\n- Override getRouteKeyName() in model"
  },
];

/**
 * Mencari penjelasan untuk method route tertentu
 * @param keyword Keyword yang dicari
 * @param lang Bahasa ('id' atau 'en')
 * @returns Penjelasan method atau null jika tidak ditemukan
 */
export const getRouteHover = (keyword: string, lang: 'id' | 'en'): string | null => {
  const lowerKeyword = keyword.toLowerCase();
  
  const match = routeData.find(d => {
    // Match exact method name
    if (d.method.toLowerCase() === lowerKeyword) return true;
    
    // Match keyword contains method (handle Route::get, etc)
    const cleanMethod = d.method.replace(/[^a-z0-9]/gi, '').toLowerCase();
    const cleanKeyword = lowerKeyword.replace(/[^a-z0-9]/gi, '').toLowerCase();
    if (cleanKeyword.includes(cleanMethod) || cleanMethod.includes(cleanKeyword)) return true;
    
    // Match aliases
    if (d.aliases?.some(alias => 
      alias.toLowerCase() === lowerKeyword || 
      lowerKeyword.includes(alias.toLowerCase())
    )) return true;
    
    return false;
  });
  
  if (match) {
    const content = lang === 'id' ? match.id : match.en;
    return `🔧 **${match.method}**\n\n${content}`;
  }
  
  return null;
};
