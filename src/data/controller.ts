/**
 * Data method untuk Laravel Controller
 * Berisi 50+ method dan pattern dengan penjelasan detail
 */

export interface ControllerMethod {
  method: string;
  aliases?: string[];
  category: 'request' | 'response' | 'validation' | 'middleware' | 'resource' | 'helper';
  id: string;
  en: string;
}

export const controllerData: ControllerMethod[] = [
  // ============================================
  // REQUEST METHODS
  // ============================================
  {
    method: "$request->validate",
    category: "validation",
    id: "**Fungsi:** Memvalidasi data input dari request dengan aturan tertentu.\n\n**Kapan dipakai:** SELALU gunakan ini SEBELUM menyimpan atau memproses data dari user. Jangan pernah percaya input user!\n\n**Contoh penggunaan:**\n```php\npublic function store(Request $request)\n{\n    // Validasi dengan aturan\n    $validated = $request->validate([\n        'title' => 'required|string|max:255',\n        'email' => 'required|email|unique:users,email',\n        'password' => 'required|min:8|confirmed',\n        'status' => 'sometimes|in:active,inactive,pending',\n        'tags' => 'nullable|array',\n        'tags.*' => 'string|distinct',\n        'birth_date' => 'date|before:today',\n        'website' => 'url',\n        'age' => 'integer|between:18,100',\n    ]);\n    \n    // $validated hanya berisi data yang lolos validasi\n    Post::create($validated);\n    \n    return redirect()->route('posts.index');\n}\n```\n\n⚠️ **Perhatian:**\n- Jika validasi gagal, Laravel OTOMATIS redirect back dengan error messages\n- Error akan tersedia di variable `$errors` di Blade template\n- Gunakan `confirmed` untuk password (akan cari field `password_confirmation`)\n- `unique:users,email` berarti unique di tabel users kolom email\n- Untuk custom error message: `['title.required' => 'Judul wajib diisi!']`\n- Returns validated data atau redirect dengan error",
    en: "**Function:** Validates request data against specified rules.\n\n**When to use:** ALWAYS use this BEFORE saving or processing user data. Never trust user input!\n\n**Example:**\n```php\npublic function store(Request $request)\n{\n    $validated = $request->validate([\n        'title' => 'required|string|max:255',\n        'email' => 'required|email|unique:users,email',\n        'password' => 'required|min:8|confirmed',\n    ]);\n    \n    Post::create($validated);\n}\n```\n\n⚠️ **Attention:**\n- If validation fails, Laravel automatically redirects back with errors\n- Errors available in `$errors` variable in Blade\n- Returns validated data or redirects with errors"
  },
  {
    method: "$request->validated",
    category: "validation",
    id: "**Fungsi:** Mendapatkan data yang sudah divalidasi (setelah validate() dipanggil).\n\n**Kapan dipakai:** Saat kamu ingin mendapatkan validated data tanpa assign ke variable baru.\n\n**Contoh penggunaan:**\n```php\npublic function store(Request $request)\n{\n    $request->validate([\n        'title' => 'required|string|max:255',\n        'content' => 'required|string',\n    ]);\n    \n    // Get validated data\n    $data = $request->validated();\n    \n    // Or use directly\n    Post::create($request->validated());\n}\n```\n\n⚠️ **Perhatian:**\n- Harus panggil `validate()` dulu\n- Returns array dengan data yang lolos validasi\n- Lebih clean dari assign ke variable",
    en: "**Function:** Gets validated data (after validate() is called).\n\n**When to use:** When you want validated data without assigning to new variable.\n\n**Example:**\n```php\npublic function store(Request $request)\n{\n    $request->validate([\n        'title' => 'required',\n    ]);\n    \n    Post::create($request->validated());\n}\n```\n\n⚠️ **Attention:**\n- Must call `validate()` first\n- Returns array with validated data"
  },
  {
    method: "$request->all",
    category: "request",
    id: "**Fungsi:** Mendapatkan SEMUA data input dari request.\n\n**Kapan dipakai:** HATI-HATI! Jangan gunakan ini tanpa validasi. Hanya untuk kasus khusus seperti debug atau saat semua data aman.\n\n**Contoh penggunaan:**\n```php\n// ⚠️ TIDAK AMAN - jangan lakukan ini!\nPost::create($request->all());\n\n// ✅ AMAN - validasi dulu\n$validated = $request->validate([...]);\nPost::create($validated);\n\n// ✅ OK - untuk debug\nlogger()->info('Request data:', $request->all());\n\n// ✅ OK - exclude tertentu\n$data = $request->except(['_token', '_method']);\n```\n\n⚠️ **Perhatian:**\n- ⚠️ MASS ASSIGNMENT VULNERABILITY!\n- User bisa inject field yang tidak seharusnya (seperti is_admin, role, dll)\n- SELALU validasi atau gunakan only()/except() sebelum pakai all()\n- Lebih baik gunakan validated() atau only()",
    en: "**Function:** Gets ALL input data from request.\n\n**When to use:** BE CAREFUL! Don't use without validation. Only for special cases like debug.\n\n**Example:**\n```php\n// ⚠️ UNSAFE - don't do this!\nPost::create($request->all());\n\n// ✅ SAFE - validate first\n$validated = $request->validate([...]);\nPost::create($validated);\n```\n\n⚠️ **Attention:**\n- ⚠️ MASS ASSIGNMENT VULNERABILITY!\n- User can inject unexpected fields (like is_admin, role, etc)\n- ALWAYS validate or use only()/except() before using all()"
  },
  {
    method: "$request->only",
    category: "request",
    id: "**Fungsi:** Mendapatkan hanya field tertentu dari request (whitelist).\n\n**Kapan dipakai:** Saat kamu ingin mengambil beberapa field spesifik dengan aman.\n\n**Contoh penggunaan:**\n```php\n// Get only specific fields\n$data = $request->only(['title', 'content', 'category_id']);\n\n// Create with safe data\nPost::create($request->only(['title', 'content']));\n\n// Returns array\n// ['title' => '...', 'content' => '...']\n```\n\n⚠️ **Perhatian:**\n- Whitelist approach - hanya field yang listed yang diambil\n- Lebih aman dari all()\n- Field yang tidak ada di array akan di-ignore (tidak error)",
    en: "**Function:** Gets only specific fields from request (whitelist).\n\n**When to use:** When you want to safely get specific fields.\n\n**Example:**\n```php\n$data = $request->only(['title', 'content', 'category_id']);\nPost::create($request->only(['title', 'content']));\n```\n\n⚠️ **Attention:**\n- Whitelist approach - only listed fields are taken\n- Safer than all()\n- Missing fields are ignored (no error)"
  },
  {
    method: "$request->except",
    category: "request",
    id: "**Fungsi:** Mendapatkan semua data KECUALI field tertentu (blacklist).\n\n**Kapan dipakai:** Saat kamu ingin mengambil semua data kecuali field sensitif.\n\n**Contoh penggunaan:**\n```php\n// Get all except sensitive fields\n$data = $request->except(['_token', '_method', 'password']);\n\n// Common usage for form submission\n$data = $request->except(['_token', '_method']);\n\n// Returns array without excluded fields\n```\n\n⚠️ **Perhatian:**\n- Blacklist approach - semua diambil kecuali yang listed\n- Kurang aman dari only() (bisa ada field lain yang berbahaya)\n- Gunakan untuk exclude CSRF token, hidden fields, dll",
    en: "**Function:** Gets all data EXCEPT specific fields (blacklist).\n\n**When to use:** When you want all data except sensitive fields.\n\n**Example:**\n```php\n$data = $request->except(['_token', '_method', 'password']);\n```\n\n⚠️ **Attention:**\n- Blacklist approach - all taken except listed\n- Less safe than only() (could have other dangerous fields)\n- Use for excluding CSRF token, hidden fields, etc"
  },
  {
    method: "$request->input",
    category: "request",
    id: "**Fungsi:** Mendapatkan nilai input tertentu dengan optional default value.\n\n**Kapan dipakai:** Saat kamu ingin mengambil single value dari request.\n\n**Contoh penggunaan:**\n```php\n// Get single value\n$title = $request->input('title');\n\n// With default value\n$page = $request->input('page', 1); // Default 1\n$search = $request->input('search', '');\n\n// Nested input (for arrays/objects)\n$name = $request->input('user.name');\n$email = $request->input('user.email', 'default@example.com');\n\n// Same as using property access\n$title = $request->title;\n$page = $request->page ?? 1;\n```\n\n⚠️ **Perhatian:**\n- Returns null jika field tidak ada (kecuali ada default)\n- Support nested input dengan dot notation\n- Property access (`$request->title`) sama dengan `input('title')`",
    en: "**Function:** Gets a specific input value with optional default.\n\n**When to use:** When you want to get a single value from request.\n\n**Example:**\n```php\n$title = $request->input('title');\n$page = $request->input('page', 1); // Default 1\n$name = $request->input('user.name'); // Nested\n```\n\n⚠️ **Attention:**\n- Returns null if field doesn't exist (unless default provided)\n- Supports nested input with dot notation"
  },
  {
    method: "$request->query",
    category: "request",
    id: "**Fungsi:** Mendapatkan query parameter dari URL.\n\n**Kapan dipakai:** Saat kamu ingin mengambil parameter dari query string (?key=value).\n\n**Contoh penggunaan:**\n```php\n// URL: /posts?search=laravel&page=2&sort=desc\n\n$search = $request->query('search'); // 'laravel'\n$page = $request->query('page', 1); // 2\n$sort = $request->query('sort', 'asc'); // 'desc'\n\n// Get all query parameters\n$allQueries = $request->query(); // ['search' => 'laravel', 'page' => 2, 'sort' => 'desc']\n\n// Same as input for query\n$search = $request->input('search');\n```\n\n⚠️ **Perhatian:**\n- Query string = parameter setelah ? di URL\n- `query()` tanpa parameter = semua query params\n- `input()` juga bisa akses query params",
    en: "**Function:** Gets query parameters from URL.\n\n**When to use:** When you want parameters from query string (?key=value).\n\n**Example:**\n```php\n// URL: /posts?search=laravel&page=2\n\n$search = $request->query('search'); // 'laravel'\n$page = $request->query('page', 1); // 2\n```\n\n⚠️ **Attention:**\n- Query string = parameters after ? in URL\n- `query()` without params = all query params"
  },
  {
    method: "$request->route",
    category: "request",
    id: "**Fungsi:** Mendapatkan parameter dari route.\n\n**Kapan dipakai:** Saat kamu ingin mengambil route parameter.\n\n**Contoh penggunaan:**\n```php\n// Route: /posts/{id}/comments/{commentId}\n// URL: /posts/1/comments/5\n\n$id = $request->route('id'); // 1\n$commentId = $request->route('commentId'); // 5\n\n// With default\n$categoryId = $request->route('category', 1);\n\n// Alternative (more common):\n$id = $request->id; // Direct property access\n```\n\n⚠️ **Perhatian:**\n- Route parameters dari URL path\n- Direct property access lebih umum: `$request->id`\n- Returns null jika parameter tidak ada",
    en: "**Function:** Gets parameters from route.\n\n**When to use:** When you want route parameters.\n\n**Example:**\n```php\n// Route: /posts/{id}\n$id = $request->route('id');\n\n// Alternative (more common):\n$id = $request->id;\n```\n\n⚠️ **Attention:**\n- Route parameters from URL path\n- Direct property access is more common"
  },
  {
    method: "$request->file",
    category: "request",
    id: "**Fungsi:** Mendapatkan file upload dari request.\n\n**Kapan dipakai:** Saat user upload file melalui form.\n\n**Contoh penggunaan:**\n```php\n// Get uploaded file\n$file = $request->file('avatar'); // Same as $request->avatar\n\n// Check if file exists\nif ($request->hasFile('avatar')) {\n    $file = $request->file('avatar');\n    \n    // Store file\n    $path = $file->store('avatars');\n    \n    // Or with custom name\n    $path = $file->storeAs('avatars', 'custom-name.jpg');\n}\n\n// Validate file\n$request->validate([\n    'avatar' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',\n]);\n```\n\n⚠️ **Perhatian:**\n- Returns UploadedFile instance atau null\n- Selalu check `hasFile()` sebelum akses\n- Validate file sebelum process (size, type, etc)",
    en: "**Function:** Gets uploaded file from request.\n\n**When to use:** When user uploads file through form.\n\n**Example:**\n```php\n$file = $request->file('avatar');\n\nif ($request->hasFile('avatar')) {\n    $path = $file->store('avatars');\n}\n```\n\n⚠️ **Attention:**\n- Returns UploadedFile instance or null\n- Always check `hasFile()` before access\n- Validate file before processing"
  },
  {
    method: "$request->has",
    category: "request",
    id: "**Fungsi:** Cek apakah input/key ada di request.\n\n**Kapan dipakai:** Untuk check keberadaan field sebelum akses.\n\n**Contoh penggunaan:**\n```php\n// Check if field exists\nif ($request->has('title')) {\n    $title = $request->input('title');\n}\n\n// Check multiple fields\nif ($request->has(['title', 'content'])) {\n    // Both exist\n}\n\n// Check if has file\nif ($request->hasFile('avatar')) {\n    // File uploaded\n}\n\n// Check if empty string counts as has\nif ($request->exists('title')) { // true even if empty\n}\n```\n\n⚠️ **Perhatian:**\n- Returns false untuk empty string\n- Gunakan `exists()` jika ingin check termasuk empty string\n- `hasFile()` khusus untuk file upload",
    en: "**Function:** Checks if input/key exists in request.\n\n**When to use:** To check field existence before access.\n\n**Example:**\n```php\nif ($request->has('title')) {\n    $title = $request->input('title');\n}\n\nif ($request->hasFile('avatar')) {\n    // File uploaded\n}\n```\n\n⚠️ **Attention:**\n- Returns false for empty string\n- Use `exists()` to include empty string"
  },
  {
    method: "$request->bearerToken",
    category: "request",
    id: "**Fungsi:** Mendapatkan Bearer token dari Authorization header.\n\n**Kapan dipakai:** Untuk API authentication dengan Bearer token.\n\n**Contoh penggunaan:**\n```php\n// Header: Authorization: Bearer abc123\n$token = $request->bearerToken(); // 'abc123'\n\n// Manual authentication\n$user = User::where('api_token', $request->bearerToken())->first();\n\n// Or use Laravel Sanctum/Passport\nauth()->check($request->bearerToken());\n```\n\n⚠️ **Perhatian:**\n- Extract dari 'Authorization: Bearer {token}' header\n- Returns null jika tidak ada token\n- Untuk API authentication",
    en: "**Function:** Gets Bearer token from Authorization header.\n\n**When to use:** For API authentication with Bearer token.\n\n**Example:**\n```php\n// Header: Authorization: Bearer abc123\n$token = $request->bearerToken(); // 'abc123'\n```\n\n⚠️ **Attention:**\n- Extracts from 'Authorization: Bearer {token}' header\n- Returns null if no token"
  },
  {
    method: "$request->ip",
    category: "request",
    id: "**Fungsi:** Mendapatkan IP address user.\n\n**Kapan dipakai:** Untuk logging, audit trail, rate limiting, geolocation, dll.\n\n**Contoh penggunaan:**\n```php\n// Get user IP\n$ip = $request->ip();\n\n// Log login\nLoginLog::create([\n    'user_id' => auth()->id(),\n    'ip_address' => $request->ip(),\n    'user_agent' => $request->userAgent(),\n]);\n\n// Rate limiting (Laravel handles this automatically)\n```\n\n⚠️ **Perhatian:**\n- Bisa spoofed, jangan trust untuk security-critical\n- Behind proxy = proxy IP (configure trusted proxies)\n- Untuk audit log, combine dengan user agent",
    en: "**Function:** Gets user's IP address.\n\n**When to use:** For logging, audit trail, rate limiting, geolocation, etc.\n\n**Example:**\n```php\n$ip = $request->ip();\n\nLoginLog::create([\n    'user_id' => auth()->id(),\n    'ip_address' => $request->ip(),\n]);\n```\n\n⚠️ **Attention:**\n- Can be spoofed, don't trust for security-critical\n- Behind proxy = proxy IP (configure trusted proxies)"
  },
  {
    method: "$request->userAgent",
    category: "request",
    id: "**Fungsi:** Mendapatkan User-Agent string dari browser/client.\n\n**Kapan dipakai:** Untuk logging, analytics, device detection, dll.\n\n**Contoh penggunaan:**\n```php\n// Get user agent\n$ua = $request->userAgent();\n\n// Log for security\nActivityLog::create([\n    'action' => 'login',\n    'user_agent' => $request->userAgent(),\n    'ip' => $request->ip(),\n]);\n\n// Simple device detection\n$isMobile = str_contains($ua, 'Mobile');\n```\n\n⚠️ **Perhatian:**\n- Bisa spoofed\n- String panjang, pertimbangkan hashing untuk storage\n- Untuk analytics, gunakan package seperti jenssegers/agent",
    en: "**Function:** Gets User-Agent string from browser/client.\n\n**When to use:** For logging, analytics, device detection, etc.\n\n**Example:**\n```php\n$ua = $request->userAgent();\n\nActivityLog::create([\n    'action' => 'login',\n    'user_agent' => $request->userAgent(),\n]);\n```\n\n⚠️ **Attention:**\n- Can be spoofed\n- Long string, consider hashing for storage"
  },
  {
    method: "$request->method",
    category: "request",
    id: "**Fungsi:** Mendapatkan HTTP method dari request.\n\n**Kapan dipakai:** Untuk conditional logic berdasarkan HTTP method.\n\n**Contoh penggunaan:**\n```php\n// Get HTTP method\n$method = $request->method(); // 'GET', 'POST', 'PUT', 'DELETE', etc\n\n// Conditional\nif ($request->method() === 'POST') {\n    // Handle POST\n}\n\n// Check if specific method\nif ($request->isMethod('post')) {\n    // Handle POST\n}\n\nif ($request->isMethod('post') || $request->isMethod('put')) {\n    // Handle POST or PUT\n}\n```\n\n⚠️ **Perhatian:**\n- Returns uppercase method name\n- `isMethod()` case-insensitive\n- Berguna untuk custom routing logic",
    en: "**Function:** Gets HTTP method from request.\n\n**When to use:** For conditional logic based on HTTP method.\n\n**Example:**\n```php\n$method = $request->method(); // 'GET', 'POST', 'PUT', 'DELETE'\n\nif ($request->isMethod('post')) {\n    // Handle POST\n}\n```\n\n⚠️ **Attention:**\n- Returns uppercase method name\n- `isMethod()` is case-insensitive"
  },
  {
    method: "$request->ajax",
    category: "request",
    id: "**Fungsi:** Cek apakah request adalah AJAX request.\n\n**Kapan dipakai:** Untuk return response berbeda untuk AJAX vs regular request.\n\n**Contoh penggunaan:**\n```php\npublic function store(Request $request)\n{\n    // Process...\n    \n    if ($request->ajax()) {\n        return response()->json(['success' => true]);\n    }\n    \n    return redirect()->route('posts.index');\n}\n\n// Or use expectsJson()\nif ($request->expectsJson()) {\n    return response()->json($data);\n}\n```\n\n⚠️ **Perhatian:**\n- Check X-Requested-With: XMLHttpRequest header\n- `expectsJson()` juga check Accept header\n- Berguna untuk API + Web hybrid controllers",
    en: "**Function:** Checks if request is an AJAX request.\n\n**When to use:** To return different responses for AJAX vs regular requests.\n\n**Example:**\n```php\nif ($request->ajax()) {\n    return response()->json(['success' => true]);\n}\n\nreturn redirect()->route('posts.index');\n```\n\n⚠️ **Attention:**\n- Checks X-Requested-With: XMLHttpRequest header\n- `expectsJson()` also checks Accept header"
  },
  
  // ============================================
  // RESPONSE METHODS
  // ============================================
  {
    method: "return view",
    category: "response",
    id: "**Fungsi:** Mengembalikan response berupa halaman HTML dari Blade template.\n\n**Kapan dipakai:** Saat ingin menampilkan halaman web ke user (bukan API).\n\n**Contoh penggunaan:**\n```php\n// Basic view\npublic function index()\n{\n    return view('posts.index');\n}\n\n// View with data\npublic function show($id)\n{\n    $post = Post::findOrFail($id);\n    return view('posts.show', compact('post'));\n}\n\n// With array data\npublic function create()\n{\n    $categories = Category::all();\n    return view('posts.create', [\n        'categories' => $categories,\n        'tags' => Tag::all(),\n    ]);\n}\n\n// With response chaining\npublic function edit(Post $post)\n{\n    return view('posts.edit', compact('post'))\n        ->with('success', 'Post loaded!');\n}\n```\n\n⚠️ **Perhatian:**\n- File Blade HARUS ada di `resources/views/posts/index.blade.php`\n- Dot notation = nested folder: `posts.show` = `posts/show.blade.php`\n- `compact('post')` = `['post' => $post]`\n- Pastikan data yang di-pass tidak null (gunakan `findOrFail` bukan `find`)",
    en: "**Function:** Returns HTML page response from Blade template.\n\n**When to use:** When displaying web pages to users (not API).\n\n**Example:**\n```php\npublic function index()\n{\n    return view('posts.index');\n}\n\npublic function show($id)\n{\n    $post = Post::findOrFail($id);\n    return view('posts.show', compact('post'));\n}\n```\n\n⚠️ **Attention:**\n- Blade file MUST exist at `resources/views/posts/index.blade.php`\n- Dot notation = nested folder\n- `compact('post')` = `['post' => $post]`"
  },
  {
    method: "response()->json",
    category: "response",
    id: "**Fungsi:** Mengembalikan response JSON untuk API.\n\n**Kapan dipakai:** WAJIB untuk API endpoints.\n\n**Contoh penggunaan:**\n```php\n// Simple JSON\npublic function index()\n{\n    return response()->json(Post::all());\n}\n\n// With status code\npublic function show($id)\n{\n    $post = Post::findOrFail($id);\n    return response()->json($post, 200);\n}\n\n// With custom structure\npublic function store(Request $request)\n{\n    $post = Post::create($request->validated());\n    \n    return response()->json([\n        'success' => true,\n        'data' => $post,\n        'message' => 'Post created successfully',\n    ], 201); // Created status\n}\n\n// With headers\nreturn response()->json($data)\n    ->header('X-Custom-Header', 'value');\n```\n\n⚠️ **Perhatian:**\n- Auto-sets Content-Type: application/json\n- Model/collection auto-serialize ke array\n- Status code default: 200\n- Untuk created resource, gunakan 201",
    en: "**Function:** Returns JSON response for API.\n\n**When to use:** REQUIRED for API endpoints.\n\n**Example:**\n```php\npublic function index()\n{\n    return response()->json(Post::all());\n}\n\npublic function store(Request $request)\n{\n    $post = Post::create($request->validated());\n    \n    return response()->json([\n        'success' => true,\n        'data' => $post,\n    ], 201);\n}\n```\n\n⚠️ **Attention:**\n- Auto-sets Content-Type: application/json\n- Model/collection auto-serialize to array"
  },
  {
    method: "return redirect",
    category: "response",
    id: "**Fungsi:** Redirect user ke URL/route lain.\n\n**Kapan dipakai:** Setelah form submission, successful action, atau perlu redirect user.\n\n**Contoh penggunaan:**\n```php\n// Redirect to route\npublic function store(Request $request)\n{\n    Post::create($request->validated());\n    return redirect()->route('posts.index');\n}\n\n// Redirect with parameters\nreturn redirect()->route('posts.show', ['post' => $post]);\n\n// Redirect to URL\nreturn redirect('/posts');\n\n// Redirect back (previous page)\nreturn redirect()->back();\n\n// Redirect with flash data\nreturn redirect()->route('posts.index')\n    ->with('success', 'Post created!');\n\n// Helper shortcut\nreturn redirect('/posts');\nreturn back(); // Same as redirect()->back()\n```\n\n⚠️ **Perhatian:**\n- 302 redirect by default\n- Flash data tersedia di session halaman berikutnya\n- `back()` = `redirect()->back()`\n- Untuk API, return JSON bukan redirect",
    en: "**Function:** Redirects user to another URL/route.\n\n**When to use:** After form submission, successful action, or when needing to redirect user.\n\n**Example:**\n```php\npublic function store(Request $request)\n{\n    Post::create($request->validated());\n    return redirect()->route('posts.index');\n}\n\n// With flash data\nreturn redirect()->route('posts.index')\n    ->with('success', 'Post created!');\n```\n\n⚠️ **Attention:**\n- 302 redirect by default\n- Flash data available in next page's session"
  },
  {
    method: "return abort",
    category: "response",
    id: "**Fungsi:** Mengembalikan error response dengan status code tertentu.\n\n**Kapan dipakai:** Saat resource tidak ditemukan, unauthorized, atau error lainnya.\n\n**Contoh penggunaan:**\n```php\n// 404 Not Found\npublic function show($id)\n{\n    $post = Post::find($id);\n    if (!$post) {\n        abort(404);\n    }\n    return view('posts.show', compact('post'));\n}\n\n// Or use findOrFail (recommended)\npublic function show($id)\n{\n    $post = Post::findOrFail($id); // Auto 404 if not found\n    return view('posts.show', compact('post'));\n}\n\n// 403 Forbidden\nif (!auth()->user()->can('update', $post)) {\n    abort(403, 'Unauthorized action.');\n}\n\n// 401 Unauthorized\nif (!auth()->check()) {\n    abort(401);\n}\n\n// Custom status\nabort(503, 'Service temporarily unavailable.');\n```\n\n⚠️ **Perhatian:**\n- Throw exception, stop execution\n- Laravel render error page sesuai status code\n- Custom error pages di `resources/errors/404.blade.php`\n- Untuk API, return JSON error response",
    en: "**Function:** Returns error response with specific status code.\n\n**When to use:** When resource not found, unauthorized, or other errors.\n\n**Example:**\n```php\npublic function show($id)\n{\n    $post = Post::findOrFail($id); // Auto 404 if not found\n    return view('posts.show', compact('post'));\n}\n\n// 403 Forbidden\nif (!auth()->user()->can('update', $post)) {\n    abort(403, 'Unauthorized action.');\n}\n```\n\n⚠️ **Attention:**\n- Throws exception, stops execution\n- Laravel renders error page per status code"
  },
  {
    method: "response()->download",
    category: "response",
    id: "**Fungsi:** Mengembalikan response untuk download file.\n\n**Kapan dipakai:** Saat user perlu download file.\n\n**Contoh penggunaan:**\n```php\n// Download file\npublic function download($id)\n{\n    $file = Storage::disk('public')->path(\"files/{$id}.pdf\");\n    return response()->download($file);\n}\n\n// With custom name\nreturn response()->download($file, 'custom-name.pdf');\n\n// With headers\nreturn response()->download($file, 'report.pdf', [\n    'X-Custom-Header' => 'value',\n]);\n\n// Force download\nreturn response()->download($file)->deleteFileAfterSend();\n```\n\n⚠️ **Perhatian:**\n- File harus ada di storage\n- Auto-sets Content-Type dan Content-Disposition\n- `deleteFileAfterSend()` hapus file setelah download (untuk temporary files)",
    en: "**Function:** Returns response for file download.\n\n**When to use:** When user needs to download a file.\n\n**Example:**\n```php\npublic function download($id)\n{\n    $file = Storage::disk('public')->path(\"files/{$id}.pdf\");\n    return response()->download($file);\n}\n\n// With custom name\nreturn response()->download($file, 'custom-name.pdf');\n```\n\n⚠️ **Attention:**\n- File must exist in storage\n- Auto-sets Content-Type and Content-Disposition"
  },
  {
    method: "response()->stream",
    category: "response",
    id: "**Fungsi:** Mengembalikan streaming response untuk data besar.\n\n**Kapan dipakai:** Untuk download file besar, export CSV, atau data yang di-generate on-the-fly.\n\n**Contoh penggunaan:**\n```php\n// Stream large file\npublic function export()\n{\n    return response()->stream(function() {\n        $handle = fopen('php://output', 'w');\n        fputcsv($handle, ['Name', 'Email']);\n        \n        User::chunk(100, function($users) use ($handle) {\n            foreach ($users as $user) {\n                fputcsv($handle, [$user->name, $user->email]);\n            }\n        });\n        \n        fclose($handle);\n    }, 200, [\n        'Content-Type' => 'text/csv',\n        'Content-Disposition' => 'attachment; filename=\"export.csv\"',\n    ]);\n}\n```\n\n⚠️ **Perhatian:**\n- Memory efficient untuk data besar\n- Callback di-execute saat streaming\n- Set proper headers untuk download",
    en: "**Function:** Returns streaming response for large data.\n\n**When to use:** For large file downloads, CSV exports, or on-the-fly generated data.\n\n**Example:**\n```php\npublic function export()\n{\n    return response()->stream(function() {\n        // Output data here\n    }, 200, [\n        'Content-Type' => 'text/csv',\n        'Content-Disposition' => 'attachment; filename=\"export.csv\"',\n    ]);\n}\n```\n\n⚠️ **Attention:**\n- Memory efficient for large data\n- Callback executed during streaming"
  },
  {
    method: "response()->noContent",
    category: "response",
    id: "**Fungsi:** Mengembalikan response 204 No Content.\n\n**Kapan dipakai:** Untuk DELETE endpoint atau operasi yang tidak return data.\n\n**Contoh penggunaan:**\n```php\n// Delete resource\npublic function destroy($id)\n{\n    Post::destroy($id);\n    return response()->noContent(); // 204\n}\n\n// With custom status\nreturn response('', 202); // 202 Accepted\n```\n\n⚠️ **Perhatian:**\n- 204 status code\n- No response body\n- Standard untuk successful DELETE",
    en: "**Function:** Returns 204 No Content response.\n\n**When to use:** For DELETE endpoints or operations that don't return data.\n\n**Example:**\n```php\npublic function destroy($id)\n{\n    Post::destroy($id);\n    return response()->noContent(); // 204\n}\n```\n\n⚠️ **Attention:**\n- 204 status code\n- No response body\n- Standard for successful DELETE"
  },
  
  // ============================================
  // MIDDLEWARE & AUTH
  // ============================================
  {
    method: "middleware",
    category: "middleware",
    id: "**Fungsi:** Menambahkan middleware ke controller atau method.\n\n**Kapan dipakai:** Untuk apply authentication, authorization, atau logic lain sebelum controller method di-execute.\n\n**Contoh penggunaan:**\n```php\n// In controller constructor\npublic function __construct()\n{\n    // Apply to all methods\n    $this->middleware('auth');\n    \n    // Apply to specific methods\n    $this->middleware('auth')->only(['create', 'store', 'edit', 'update']);\n    $this->middleware('auth')->except(['index', 'show']);\n    \n    // Multiple middleware\n    $this->middleware(['auth', 'verified']);\n}\n\n// In routes (recommended)\nRoute::middleware(['auth'])->group(function () {\n    Route::resource('posts', PostController::class);\n});\n```\n\n⚠️ **Perhatian:**\n- Bisa di constructor controller\n- Lebih baik define di routes untuk clarity\n- Custom middleware: `php artisan make:middleware CheckRole`",
    en: "**Function:** Adds middleware to controller or method.\n\n**When to use:** To apply authentication, authorization, or other logic before controller method executes.\n\n**Example:**\n```php\npublic function __construct()\n{\n    $this->middleware('auth');\n    $this->middleware('auth')->only(['create', 'store']);\n}\n```\n\n⚠️ **Attention:**\n- Can be in controller constructor\n- Better to define in routes for clarity"
  },
  {
    method: "authorize",
    category: "middleware",
    id: "**Fungsi:** Check authorization menggunakan Policy.\n\n**Kapan dipakai:** Untuk authorization berbasis resource/policy.\n\n**Contoh penggunaan:**\n```php\n// In controller method\npublic function update(Request $request, Post $post)\n{\n    // Authorize using policy\n    $this->authorize('update', $post);\n    \n    // If not authorized, throws 403\n    \n    $post->update($request->validated());\n}\n\n// In Form Request (recommended)\npublic function authorize()\n{\n    return $this->user()->can('update', $this->route('post'));\n}\n\n// Gate check (simple authorization)\nif (Gate::allows('update-post', $post)) {\n    // Authorized\n}\n\nif (Gate::denies('update-post', $post)) {\n    abort(403);\n}\n```\n\n⚠️ **Perhatian:**\n- Throws 403 jika tidak authorized\n- Policy: `php artisan make:policy PostPolicy --model=Post`\n- Gate: define di AuthServiceProvider\n- Untuk API, return 403 JSON response",
    en: "**Function:** Checks authorization using Policy.\n\n**When to use:** For policy-based authorization.\n\n**Example:**\n```php\npublic function update(Request $request, Post $post)\n{\n    $this->authorize('update', $post);\n    \n    $post->update($request->validated());\n}\n```\n\n⚠️ **Attention:**\n- Throws 403 if not authorized\n- Policy: `php artisan make:policy PostPolicy --model=Post`"
  },
  {
    method: "auth",
    category: "middleware",
    id: "**Fungsi:** Facade untuk authentication helper.\n\n**Kapan dipakai:** Untuk check authentication status, get current user, login/logout.\n\n**Contoh penggunaan:**\n```php\n// Check if authenticated\nif (auth()->check()) {\n    $user = auth()->user();\n}\n\n// Get current user\n$user = auth()->user();\n$user = Auth::user(); // Same\n\n// Login user\nauth()->login($user);\nAuth::login($user, $remember = true); // With remember me\n\n// Logout\nauth()->logout();\n\n// Attempt login\nif (auth()->attempt(['email' => $email, 'password' => $password])) {\n    // Success\n}\n\n// Check guest (not authenticated)\nif (auth()->guest()) {\n    // Not logged in\n}\n```\n\n⚠️ **Perhatian:**\n- `auth()` helper = `Auth::` facade\n- `check()` = is authenticated\n- `guest()` = is NOT authenticated\n- `attempt()` untuk login dengan credentials",
    en: "**Function:** Facade for authentication helpers.\n\n**When to use:** To check authentication status, get current user, login/logout.\n\n**Example:**\n```php\nif (auth()->check()) {\n    $user = auth()->user();\n}\n\nauth()->login($user);\nauth()->logout();\n\nif (auth()->attempt(['email' => $email, 'password' => $password])) {\n    // Success\n}\n```\n\n⚠️ **Attention:**\n- `auth()` helper = `Auth::` facade\n- `check()` = is authenticated\n- `guest()` = is NOT authenticated"
  },
  
  // ============================================
  // RESOURCE CONTROLLER METHODS
  // ============================================
  {
    method: "index",
    category: "resource",
    id: "**Fungsi:** Resource method untuk menampilkan list data.\n\n**Kapan dipakai:** Standard method untuk GET /resource endpoint.\n\n**Contoh penggunaan:**\n```php\npublic function index()\n{\n    // With pagination\n    $posts = Post::with('author')->latest()->paginate(15);\n    \n    // For API\n    // return PostResource::collection($posts);\n    \n    // For web\n    return view('posts.index', compact('posts'));\n}\n\n// With filters\npublic function index(Request $request)\n{\n    $query = Post::query();\n    \n    if ($request->filled('search')) {\n        $query->where('title', 'like', \"%{$request->search}%\");\n    }\n    \n    if ($request->filled('category')) {\n        $query->where('category_id', $request->category);\n    }\n    \n    $posts = $query->latest()->paginate(15);\n    \n    return view('posts.index', compact('posts'));\n}\n```\n\n⚠️ **Perhatian:**\n- GET /posts\n- Return list/collection\n- Selalu gunakan pagination untuk data banyak\n- Support filtering, sorting, searching",
    en: "**Function:** Resource method to display list of data.\n\n**When to use:** Standard method for GET /resource endpoint.\n\n**Example:**\n```php\npublic function index()\n{\n    $posts = Post::with('author')->latest()->paginate(15);\n    return view('posts.index', compact('posts'));\n}\n```\n\n⚠️ **Attention:**\n- GET /posts\n- Returns list/collection\n- Always use pagination for large data"
  },
  {
    method: "create",
    category: "resource",
    id: "**Fungsi:** Resource method untuk menampilkan form create.\n\n**Kapan dipakai:** Standard method untuk GET /resource/create endpoint.\n\n**Contoh penggunaan:**\n```php\npublic function create()\n{\n    // Load data for form\n    $categories = Category::all();\n    $tags = Tag::all();\n    \n    return view('posts.create', compact('categories', 'tags'));\n}\n```\n\n⚠️ **Perhatian:**\n- GET /posts/create\n- Return form view\n- Bukan untuk submit data\n- Prepare dropdown/options data here",
    en: "**Function:** Resource method to display create form.\n\n**When to use:** Standard method for GET /resource/create endpoint.\n\n**Example:**\n```php\npublic function create()\n{\n    $categories = Category::all();\n    return view('posts.create', compact('categories'));\n}\n```\n\n⚠️ **Attention:**\n- GET /posts/create\n- Returns form view\n- Not for submitting data"
  },
  {
    method: "store",
    category: "resource",
    id: "**Fungsi:** Resource method untuk menyimpan data baru.\n\n**Kapan dipakai:** Standard method untuk POST /resource endpoint.\n\n**Contoh penggunaan:**\n```php\npublic function store(Request $request)\n{\n    // Validate\n    $validated = $request->validate([\n        'title' => 'required|string|max:255',\n        'content' => 'required|string',\n        'category_id' => 'required|exists:categories,id',\n    ]);\n    \n    // Create\n    $post = Post::create($validated);\n    \n    // Redirect/Return\n    // For web:\n    return redirect()->route('posts.show', $post)\n        ->with('success', 'Post created successfully!');\n    \n    // For API:\n    // return new PostResource($post); // 201 Created\n}\n```\n\n⚠️ **Perhatian:**\n- POST /posts\n- Validate SEMUA input\n- Return redirect (web) atau JSON (API)\n- Flash success message untuk web",
    en: "**Function:** Resource method to store new data.\n\n**When to use:** Standard method for POST /resource endpoint.\n\n**Example:**\n```php\npublic function store(Request $request)\n{\n    $validated = $request->validate([\n        'title' => 'required|string|max:255',\n        'content' => 'required|string',\n    ]);\n    \n    $post = Post::create($validated);\n    \n    return redirect()->route('posts.show', $post)\n        ->with('success', 'Post created!');\n}\n```\n\n⚠️ **Attention:**\n- POST /posts\n- Validate ALL input\n- Return redirect (web) or JSON (API)"
  },
  {
    method: "show",
    category: "resource",
    id: "**Fungsi:** Resource method untuk menampilkan detail data.\n\n**Kapan dipakai:** Standard method untuk GET /resource/{id} endpoint.\n\n**Contoh penggunaan:**\n```php\npublic function show(Post $post)\n{\n    // Route model binding (recommended)\n    // $post already loaded\n    \n    // Load relationships\n    $post->load(['author', 'comments.user']);\n    \n    // For web:\n    return view('posts.show', compact('post'));\n    \n    // For API:\n    // return new PostResource($post);\n}\n\n// Or with explicit ID\npublic function show($id)\n{\n    $post = Post::with('author')->findOrFail($id);\n    return view('posts.show', compact('post'));\n}\n```\n\n⚠️ **Perhatian:**\n- GET /posts/{id}\n- Gunakan route model binding (type hint Post)\n- `findOrFail()` untuk auto 404\n- Load relationships untuk avoid N+1",
    en: "**Function:** Resource method to display single data detail.\n\n**When to use:** Standard method for GET /resource/{id} endpoint.\n\n**Example:**\n```php\npublic function show(Post $post)\n{\n    $post->load(['author', 'comments']);\n    return view('posts.show', compact('post'));\n}\n```\n\n⚠️ **Attention:**\n- GET /posts/{id}\n- Use route model binding (type hint Post)\n- `findOrFail()` for auto 404"
  },
  {
    method: "edit",
    category: "resource",
    id: "**Fungsi:** Resource method untuk menampilkan form edit.\n\n**Kapan dipakai:** Standard method untuk GET /resource/{id}/edit endpoint.\n\n**Contoh penggunaan:**\n```php\npublic function edit(Post $post)\n{\n    // Load data for form\n    $categories = Category::all();\n    $tags = Tag::all();\n    $selectedTags = $post->tags->pluck('id')->toArray();\n    \n    return view('posts.edit', compact('post', 'categories', 'tags', 'selectedTags'));\n}\n```\n\n⚠️ **Perhatian:**\n- GET /posts/{id}/edit\n- Return edit form view\n- Bukan untuk submit data\n- Load existing data + options",
    en: "**Function:** Resource method to display edit form.\n\n**When to use:** Standard method for GET /resource/{id}/edit endpoint.\n\n**Example:**\n```php\npublic function edit(Post $post)\n{\n    $categories = Category::all();\n    return view('posts.edit', compact('post', 'categories'));\n}\n```\n\n⚠️ **Attention:**\n- GET /posts/{id}/edit\n- Returns edit form view\n- Not for submitting data"
  },
  {
    method: "update",
    category: "resource",
    id: "**Fungsi:** Resource method untuk update data existing.\n\n**Kapan dipakai:** Standard method untuk PUT/PATCH /resource/{id} endpoint.\n\n**Contoh penggunaan:**\n```php\npublic function update(Request $request, Post $post)\n{\n    // Validate\n    $validated = $request->validate([\n        'title' => 'required|string|max:255',\n        'content' => 'required|string',\n        'category_id' => 'required|exists:categories,id',\n    ]);\n    \n    // Update\n    $post->update($validated);\n    \n    // Redirect/Return\n    // For web:\n    return redirect()->route('posts.show', $post)\n        ->with('success', 'Post updated successfully!');\n    \n    // For API:\n    // return new PostResource($post);\n}\n```\n\n⚠️ **Perhatian:**\n- PUT/PATCH /posts/{id}\n- Validate SEMUA input\n- Return redirect (web) atau JSON (API)\n- Flash success message untuk web",
    en: "**Function:** Resource method to update existing data.\n\n**When to use:** Standard method for PUT/PATCH /resource/{id} endpoint.\n\n**Example:**\n```php\npublic function update(Request $request, Post $post)\n{\n    $validated = $request->validate([\n        'title' => 'required|string|max:255',\n        'content' => 'required|string',\n    ]);\n    \n    $post->update($validated);\n    \n    return redirect()->route('posts.show', $post)\n        ->with('success', 'Post updated!');\n}\n```\n\n⚠️ **Attention:**\n- PUT/PATCH /posts/{id}\n- Validate ALL input\n- Return redirect (web) or JSON (API)"
  },
  {
    method: "destroy",
    category: "resource",
    id: "**Fungsi:** Resource method untuk delete data.\n\n**Kapan dipakai:** Standard method untuk DELETE /resource/{id} endpoint.\n\n**Contoh penggunaan:**\n```php\npublic function destroy(Post $post)\n{\n    // Delete\n    $post->delete();\n    \n    // Or soft delete\n    // $post->delete(); // With SoftDeletes trait\n    \n    // Or force delete\n    // $post->forceDelete();\n    \n    // Redirect/Return\n    // For web:\n    return redirect()->route('posts.index')\n        ->with('success', 'Post deleted successfully!');\n    \n    // For API:\n    // return response()->noContent(); // 204\n}\n```\n\n⚠️ **Perhatian:**\n- DELETE /posts/{id}\n- Permanent delete by default\n- Use SoftDeletes untuk soft delete\n- Return 204 No Content untuk API",
    en: "**Function:** Resource method to delete data.\n\n**When to use:** Standard method for DELETE /resource/{id} endpoint.\n\n**Example:**\n```php\npublic function destroy(Post $post)\n{\n    $post->delete();\n    \n    return redirect()->route('posts.index')\n        ->with('success', 'Post deleted!');\n}\n```\n\n⚠️ **Attention:**\n- DELETE /posts/{id}\n- Permanent delete by default\n- Use SoftDeletes for soft delete"
  },

  // ============================================
  // FORM REQUEST & VALIDATION
  // ============================================
  {
    method: "FormRequest",
    aliases: ["Request class", "Custom Request"],
    category: "validation",
    id: "**Fungsi:** Class khusus untuk validasi dan authorization request.\n\n**Kapan dipakai:** Saat validasi kompleks atau dipakai di multiple controller methods.\n\n**Contoh penggunaan:**\n```php\n// Create: php artisan make:request StorePostRequest\n\n// app/Http/Requests/StorePostRequest.php\nclass StorePostRequest extends FormRequest\n{\n    public function authorize(): bool\n    {\n        return $this->user()->can('create', Post::class);\n    }\n    \n    public function rules(): array\n    {\n        return [\n            'title' => 'required|string|max:255',\n            'content' => 'required|string',\n            'category_id' => 'required|exists:categories,id',\n        ];\n    }\n    \n    public function messages(): array\n    {\n        return [\n            'title.required' => 'Judul wajib diisi!',\n        ];\n    }\n}\n\n// In Controller\npublic function store(StorePostRequest $request)\n{\n    Post::create($request->validated());\n}\n```\n\n**Perhatian:**\n- Lebih clean dari validate() di controller\n- Reusable di multiple methods\n- authorize() untuk authorization check\n- messages() untuk custom error messages",
    en: "**Function:** Custom class for request validation and authorization.\n\n**When to use:** For complex validation or reusable across multiple controller methods.\n\n**Example:**\n```php\n// php artisan make:request StorePostRequest\n\nclass StorePostRequest extends FormRequest\n{\n    public function authorize(): bool\n    {\n        return $this->user()->can('create', Post::class);\n    }\n    \n    public function rules(): array\n    {\n        return [\n            'title' => 'required|string|max:255',\n        ];\n    }\n}\n\n// In Controller\npublic function store(StorePostRequest $request)\n{\n    Post::create($request->validated());\n}\n```\n\n**Attention:**\n- Cleaner than validate() in controller\n- Reusable across multiple methods"
  },
  {
    method: "prepareForValidation",
    category: "validation",
    id: "**Fungsi:** Hook untuk modify input sebelum validasi.\n\n**Kapan dipakai:** Untuk normalize data sebelum di-validate (trim, lowercase, dll).\n\n**Contoh penggunaan:**\n```php\nclass StorePostRequest extends FormRequest\n{\n    protected function prepareForValidation(): void\n    {\n        $this->merge([\n            'slug' => Str::slug($this->title),\n            'email' => strtolower($this->email),\n        ]);\n    }\n    \n    public function rules(): array\n    {\n        return [\n            'title' => 'required',\n            'slug' => 'required|unique:posts',\n            'email' => 'required|email',\n        ];\n    }\n}\n```\n\n**Perhatian:**\n- Dipanggil SEBELUM validasi\n- Gunakan merge() untuk modify input\n- Berguna untuk auto-generate slug, normalize email, dll",
    en: "**Function:** Hook to modify input before validation.\n\n**When to use:** To normalize data before validation (trim, lowercase, etc).\n\n**Example:**\n```php\nprotected function prepareForValidation(): void\n{\n    $this->merge([\n        'slug' => Str::slug($this->title),\n        'email' => strtolower($this->email),\n    ]);\n}\n```\n\n**Attention:**\n- Called BEFORE validation\n- Use merge() to modify input"
  },
  {
    method: "passedValidation",
    category: "validation",
    id: "**Fungsi:** Hook yang dipanggil setelah validasi berhasil.\n\n**Kapan dipakai:** Untuk modify data setelah validasi pass.\n\n**Contoh penggunaan:**\n```php\nclass StorePostRequest extends FormRequest\n{\n    protected function passedValidation(): void\n    {\n        $this->merge([\n            'published_at' => $this->publish_now ? now() : null,\n        ]);\n    }\n}\n```\n\n**Perhatian:**\n- Dipanggil SETELAH validasi berhasil\n- Data sudah valid\n- Berguna untuk post-processing",
    en: "**Function:** Hook called after validation passes.\n\n**When to use:** To modify data after validation passes.\n\n**Example:**\n```php\nprotected function passedValidation(): void\n{\n    $this->merge([\n        'published_at' => $this->publish_now ? now() : null,\n    ]);\n}\n```\n\n**Attention:**\n- Called AFTER validation passes\n- Data is already valid"
  },
  {
    method: "failedValidation",
    category: "validation",
    id: "**Fungsi:** Hook yang dipanggil saat validasi gagal.\n\n**Kapan dipakai:** Untuk custom response saat validasi gagal (API, custom redirect, dll).\n\n**Contoh penggunaan:**\n```php\nuse Illuminate\\Contracts\\Validation\\Validator;\nuse Illuminate\\Http\\Exceptions\\HttpResponseException;\n\nclass StorePostRequest extends FormRequest\n{\n    protected function failedValidation(Validator $validator): void\n    {\n        // For API - return JSON\n        throw new HttpResponseException(\n            response()->json([\n                'success' => false,\n                'errors' => $validator->errors(),\n            ], 422)\n        );\n    }\n}\n```\n\n**Perhatian:**\n- Override default redirect behavior\n- Berguna untuk API responses\n- Throw HttpResponseException untuk custom response",
    en: "**Function:** Hook called when validation fails.\n\n**When to use:** For custom response when validation fails (API, custom redirect, etc).\n\n**Example:**\n```php\nprotected function failedValidation(Validator $validator): void\n{\n    throw new HttpResponseException(\n        response()->json([\n            'success' => false,\n            'errors' => $validator->errors(),\n        ], 422)\n    );\n}\n```\n\n**Attention:**\n- Override default redirect behavior\n- Useful for API responses"
  },

  // ============================================
  // DISPATCH & JOBS
  // ============================================
  {
    method: "dispatch",
    category: "helper",
    id: "**Fungsi:** Mendispatch job ke queue.\n\n**Kapan dipakai:** Untuk proses background seperti send email, process file, dll.\n\n**Contoh penggunaan:**\n```php\n// Create job: php artisan make:job ProcessPodcast\n\n// Dispatch to queue\nProcessPodcast::dispatch($podcast);\n\n// With delay\nProcessPodcast::dispatch($podcast)->delay(now()->addMinutes(10));\n\n// To specific queue\nProcessPodcast::dispatch($podcast)->onQueue('processing');\n\n// Chain jobs\nBus::chain([\n    new ProcessPodcast($podcast),\n    new ReleasePodcast($podcast),\n])->dispatch();\n\n// Dispatch sync (no queue)\nProcessPodcast::dispatchSync($podcast);\n```\n\n**Perhatian:**\n- Job di-process async di background\n- Setup queue driver: database, redis, sqs\n- Run worker: `php artisan queue:work`\n- dispatchSync() untuk immediate execution",
    en: "**Function:** Dispatches job to queue.\n\n**When to use:** For background processing like send email, process file, etc.\n\n**Example:**\n```php\nProcessPodcast::dispatch($podcast);\n\n// With delay\nProcessPodcast::dispatch($podcast)->delay(now()->addMinutes(10));\n\n// To specific queue\nProcessPodcast::dispatch($podcast)->onQueue('processing');\n```\n\n**Attention:**\n- Job processed async in background\n- Setup queue driver: database, redis, sqs\n- Run worker: `php artisan queue:work`"
  },
  {
    method: "dispatchSync",
    category: "helper",
    id: "**Fungsi:** Dispatch job secara synchronous (tanpa queue).\n\n**Kapan dipakai:** Saat perlu execute job immediately tanpa queue.\n\n**Contoh penggunaan:**\n```php\n// Execute immediately without queue\nProcessPodcast::dispatchSync($podcast);\n\n// Useful for:\n// - Testing\n// - When queue not available\n// - Small tasks that must complete before response\n```\n\n**Perhatian:**\n- Blocking - menunggu sampai selesai\n- Tidak masuk queue\n- Berguna untuk testing atau small tasks",
    en: "**Function:** Dispatches job synchronously (without queue).\n\n**When to use:** When need to execute job immediately without queue.\n\n**Example:**\n```php\nProcessPodcast::dispatchSync($podcast);\n```\n\n**Attention:**\n- Blocking - waits until complete\n- Does not enter queue"
  },

  // ============================================
  // EVENTS
  // ============================================
  {
    method: "event",
    category: "helper",
    id: "**Fungsi:** Fire event untuk trigger listeners.\n\n**Kapan dipakai:** Untuk decouple logic dengan event-driven architecture.\n\n**Contoh penggunaan:**\n```php\n// Fire event\nevent(new OrderShipped($order));\n\n// Create event: php artisan make:event OrderShipped\n// Create listener: php artisan make:listener SendShipmentNotification --event=OrderShipped\n\n// In EventServiceProvider\nprotected $listen = [\n    OrderShipped::class => [\n        SendShipmentNotification::class,\n        UpdateInventory::class,\n    ],\n];\n```\n\n**Perhatian:**\n- Event-driven architecture\n- Decouple logic dari controller\n- Multiple listeners per event\n- Listeners bisa sync atau queued",
    en: "**Function:** Fires event to trigger listeners.\n\n**When to use:** To decouple logic with event-driven architecture.\n\n**Example:**\n```php\nevent(new OrderShipped($order));\n\n// EventServiceProvider\nprotected $listen = [\n    OrderShipped::class => [\n        SendShipmentNotification::class,\n    ],\n];\n```\n\n**Attention:**\n- Event-driven architecture\n- Decouple logic from controller"
  },

  // ============================================
  // CACHE
  // ============================================
  {
    method: "Cache::remember",
    aliases: ["cache()->remember"],
    category: "helper",
    id: "**Fungsi:** Cache data dengan auto-refresh.\n\n**Kapan dipakai:** Untuk cache expensive queries atau API calls.\n\n**Contoh penggunaan:**\n```php\nuse Illuminate\\Support\\Facades\\Cache;\n\n// Cache for 60 minutes\n$posts = Cache::remember('popular_posts', 60 * 60, function () {\n    return Post::withCount('views')\n        ->orderByDesc('views_count')\n        ->limit(10)\n        ->get();\n});\n\n// Cache forever\n$settings = Cache::rememberForever('settings', function () {\n    return Setting::all()->pluck('value', 'key');\n});\n\n// Forget cache\nCache::forget('popular_posts');\n\n// Flush all cache\nCache::flush();\n```\n\n**Perhatian:**\n- Kedua parameter adalah seconds (bukan minutes)\n- rememberForever() untuk cache permanent\n- forget() untuk hapus cache specific key\n- flush() untuk hapus semua cache",
    en: "**Function:** Caches data with auto-refresh.\n\n**When to use:** To cache expensive queries or API calls.\n\n**Example:**\n```php\n$posts = Cache::remember('popular_posts', 3600, function () {\n    return Post::withCount('views')\n        ->orderByDesc('views_count')\n        ->limit(10)\n        ->get();\n});\n```\n\n**Attention:**\n- Second parameter is seconds (not minutes)\n- rememberForever() for permanent cache\n- forget() to delete specific key"
  },
  {
    method: "Cache::put",
    aliases: ["cache()->put"],
    category: "helper",
    id: "**Fungsi:** Menyimpan value ke cache.\n\n**Kapan dipakai:** Untuk menyimpan data ke cache secara manual.\n\n**Contoh penggunaan:**\n```php\n// Store for 60 minutes\nCache::put('key', 'value', 3600);\n\n// Store forever\nCache::forever('key', 'value');\n\n// Get value\n$value = Cache::get('key');\n$value = Cache::get('key', 'default');\n\n// Check if exists\nif (Cache::has('key')) {\n    // ...\n}\n```\n\n**Perhatian:**\n- TTL dalam detik\n- get() dengan default value untuk fallback\n- has() untuk check existence",
    en: "**Function:** Stores value to cache.\n\n**When to use:** To manually store data to cache.\n\n**Example:**\n```php\nCache::put('key', 'value', 3600);\nCache::forever('key', 'value');\n$value = Cache::get('key', 'default');\n```\n\n**Attention:**\n- TTL in seconds\n- get() with default for fallback"
  },

  // ============================================
  // SESSION
  // ============================================
  {
    method: "session",
    category: "helper",
    id: "**Fungsi:** Mengakses session data.\n\n**Kapan dipakai:** Untuk menyimpan data sementara per user session.\n\n**Contoh penggunaan:**\n```php\n// Store\nsession(['key' => 'value']);\nsession()->put('key', 'value');\n\n// Get\n$value = session('key');\n$value = session('key', 'default');\n$value = session()->get('key');\n\n// Check\nif (session()->has('key')) {\n    // ...\n}\n\n// Remove\nsession()->forget('key');\n\n// Flash (available only for next request)\nsession()->flash('status', 'Task completed!');\n\n// In Blade\n@if (session('status'))\n    <div class=\"alert\">{{ session('status') }}</div>\n@endif\n```\n\n**Perhatian:**\n- Data per-user session\n- flash() untuk one-time messages\n- forget() untuk hapus\n- Session driver: file, cookie, database, redis",
    en: "**Function:** Accesses session data.\n\n**When to use:** To store temporary data per user session.\n\n**Example:**\n```php\nsession(['key' => 'value']);\n$value = session('key', 'default');\nsession()->flash('status', 'Success!');\n```\n\n**Attention:**\n- Data per-user session\n- flash() for one-time messages\n- forget() to remove"
  },

  // ============================================
  // LOGGING
  // ============================================
  {
    method: "Log",
    aliases: ["logger", "info", "error", "warning", "debug"],
    category: "helper",
    id: "**Fungsi:** Logging messages ke file/service.\n\n**Kapan dipakai:** Untuk debugging, audit trail, error tracking.\n\n**Contoh penggunaan:**\n```php\nuse Illuminate\\Support\\Facades\\Log;\n\n// Log levels\nLog::emergency('System is down!');\nLog::alert('Database connection failed');\nLog::critical('Critical error occurred');\nLog::error('Error processing request', ['user' => $user->id]);\nLog::warning('Low disk space');\nLog::notice('User logged in');\nLog::info('Order processed', ['order_id' => $order->id]);\nLog::debug('Variable value', ['data' => $data]);\n\n// Helper function\nlogger('Simple message');\nlogger()->error('Error with context', ['error' => $e->getMessage()]);\n\n// To specific channel\nLog::channel('slack')->critical('Server is down!');\n```\n\n**Perhatian:**\n- Log levels: emergency, alert, critical, error, warning, notice, info, debug\n- Context array untuk additional data\n- Channels: single, daily, slack, etc\n- Config di config/logging.php",
    en: "**Function:** Logs messages to file/service.\n\n**When to use:** For debugging, audit trail, error tracking.\n\n**Example:**\n```php\nLog::error('Error occurred', ['user' => $user->id]);\nLog::info('Order processed', ['order_id' => $order->id]);\nlogger('Simple message');\n```\n\n**Attention:**\n- Log levels: emergency, alert, critical, error, warning, notice, info, debug\n- Context array for additional data"
  },

  // ============================================
  // EXCEPTION HANDLING
  // ============================================
  {
    method: "abort",
    category: "helper",
    id: "**Fungsi:** Throw HTTP exception dengan status code.\n\n**Kapan dipakai:** Untuk return error response (404, 403, 500, dll).\n\n**Contoh penggunaan:**\n```php\n// 404 Not Found\nabort(404);\nabort(404, 'Page not found');\n\n// 403 Forbidden\nabort(403, 'Unauthorized action');\n\n// 500 Server Error\nabort(500, 'Something went wrong');\n\n// Conditional abort\nabort_if(!$post, 404);\nabort_unless($user->isAdmin(), 403);\n\n// Custom view\nabort(404); // Renders resources/views/errors/404.blade.php\n```\n\n**Perhatian:**\n- Auto-render error view jika ada\n- abort_if/abort_unless untuk conditional\n- Custom error views di resources/views/errors/",
    en: "**Function:** Throws HTTP exception with status code.\n\n**When to use:** To return error response (404, 403, 500, etc).\n\n**Example:**\n```php\nabort(404);\nabort(403, 'Unauthorized');\nabort_if(!$post, 404);\nabort_unless($user->isAdmin(), 403);\n```\n\n**Attention:**\n- Auto-render error view if exists\n- abort_if/abort_unless for conditional"
  },
  {
    method: "report",
    category: "helper",
    id: "**Fungsi:** Report exception tanpa throw.\n\n**Kapan dipakai:** Untuk log error tanpa menghentikan execution.\n\n**Contoh penggunaan:**\n```php\ntry {\n    // Risky operation\n    $result = $this->riskyMethod();\n} catch (Exception $e) {\n    // Log but continue\n    report($e);\n    $result = $fallbackValue;\n}\n\n// In exception handler\npublic function report(Throwable $e)\n{\n    if ($e instanceof CustomException) {\n        // Custom reporting\n        Log::channel('custom')->error($e->getMessage());\n    }\n    \n    parent::report($e);\n}\n```\n\n**Perhatian:**\n- Tidak throw exception\n- Berguna untuk non-critical errors\n- Integrates dengan error tracking (Sentry, Bugsnag)",
    en: "**Function:** Reports exception without throwing.\n\n**When to use:** To log error without stopping execution.\n\n**Example:**\n```php\ntry {\n    $result = $this->riskyMethod();\n} catch (Exception $e) {\n    report($e);\n    $result = $fallbackValue;\n}\n```\n\n**Attention:**\n- Does not throw exception\n- Useful for non-critical errors"
  },
  {
    method: "rescue",
    category: "helper",
    id: "**Fungsi:** Execute closure dengan fallback jika error.\n\n**Kapan dipakai:** Untuk graceful error handling dengan default value.\n\n**Contoh penggunaan:**\n```php\n// With default value\n$result = rescue(function () {\n    return $this->riskyMethod();\n}, 'default value');\n\n// With callback default\n$result = rescue(\n    fn() => $this->riskyMethod(),\n    fn() => $this->fallbackMethod()\n);\n\n// Without reporting\n$result = rescue(fn() => $this->riskyMethod(), report: false);\n```\n\n**Perhatian:**\n- Catch any exception\n- Return default jika error\n- Auto-report ke error tracker by default",
    en: "**Function:** Executes closure with fallback on error.\n\n**When to use:** For graceful error handling with default value.\n\n**Example:**\n```php\n$result = rescue(function () {\n    return $this->riskyMethod();\n}, 'default value');\n```\n\n**Attention:**\n- Catches any exception\n- Returns default on error"
  },

  // ============================================
  // FILE STORAGE
  // ============================================
  {
    method: "Storage::put",
    aliases: ["Storage::disk", "Storage::get"],
    category: "helper",
    id: "**Fungsi:** Menyimpan file ke storage.\n\n**Kapan dipakai:** Untuk file uploads, generated files, dll.\n\n**Contoh penggunaan:**\n```php\nuse Illuminate\\Support\\Facades\\Storage;\n\n// Store file\nStorage::put('file.txt', 'Contents');\n\n// Store uploaded file\n$path = Storage::put('avatars', $request->file('avatar'));\n\n// Store with custom name\n$path = Storage::putFileAs('avatars', $request->file('avatar'), 'avatar.jpg');\n\n// Get file\n$contents = Storage::get('file.txt');\n\n// Check exists\nif (Storage::exists('file.txt')) {\n    // ...\n}\n\n// Delete\nStorage::delete('file.txt');\n\n// URL\n$url = Storage::url('avatars/avatar.jpg');\n\n// Specific disk\nStorage::disk('s3')->put('file.txt', 'Contents');\n```\n\n**Perhatian:**\n- Default disk: local (storage/app)\n- Public disk: storage/app/public (symlink needed)\n- Run: `php artisan storage:link`\n- Config di config/filesystems.php",
    en: "**Function:** Stores file to storage.\n\n**When to use:** For file uploads, generated files, etc.\n\n**Example:**\n```php\nStorage::put('file.txt', 'Contents');\n$path = Storage::put('avatars', $request->file('avatar'));\n$contents = Storage::get('file.txt');\nStorage::delete('file.txt');\n```\n\n**Attention:**\n- Default disk: local (storage/app)\n- Run: `php artisan storage:link` for public"
  },

  // ============================================
  // URL & ROUTE HELPERS
  // ============================================
  {
    method: "route",
    category: "helper",
    id: "**Fungsi:** Generate URL dari named route.\n\n**Kapan dipakai:** SELALU gunakan ini daripada hardcode URL.\n\n**Contoh penggunaan:**\n```php\n// Basic\n$url = route('posts.index'); // /posts\n\n// With parameters\n$url = route('posts.show', $post); // /posts/1\n$url = route('posts.show', ['post' => $post]); // Same\n\n// Absolute vs relative\n$url = route('posts.index'); // http://app.test/posts\n$url = route('posts.index', [], false); // /posts\n\n// In redirect\nreturn redirect()->route('posts.index');\n\n// In Blade\n<a href=\"{{ route('posts.show', $post) }}\">View Post</a>\n```\n\n**Perhatian:**\n- Selalu gunakan named routes\n- Jika URL berubah, tidak perlu update code\n- Parameter bisa model instance atau array",
    en: "**Function:** Generates URL from named route.\n\n**When to use:** ALWAYS use this instead of hardcoding URLs.\n\n**Example:**\n```php\n$url = route('posts.index');\n$url = route('posts.show', $post);\nreturn redirect()->route('posts.index');\n```\n\n**Attention:**\n- Always use named routes\n- If URL changes, no code update needed"
  },
  {
    method: "url",
    category: "helper",
    id: "**Fungsi:** Generate URL absolut.\n\n**Kapan dipakai:** Untuk URL yang bukan dari route.\n\n**Contoh penggunaan:**\n```php\n// Full URL\n$url = url('/posts'); // http://app.test/posts\n\n// Current URL\n$current = url()->current(); // http://app.test/posts\n$full = url()->full(); // http://app.test/posts?page=2\n\n// Previous URL\n$previous = url()->previous();\n\n// Asset URL\n$css = asset('css/app.css'); // http://app.test/css/app.css\n```\n\n**Perhatian:**\n- Prefer route() untuk named routes\n- url() untuk external atau non-route URLs\n- asset() untuk static files",
    en: "**Function:** Generates absolute URL.\n\n**When to use:** For URLs that are not from routes.\n\n**Example:**\n```php\n$url = url('/posts');\n$current = url()->current();\n$previous = url()->previous();\n```\n\n**Attention:**\n- Prefer route() for named routes\n- url() for external or non-route URLs"
  },

  // ============================================
  // PAGINATION
  // ============================================
  {
    method: "paginate",
    category: "helper",
    id: "**Fungsi:** Paginate query results.\n\n**Kapan dipakai:** Untuk menampilkan data banyak dengan pagination.\n\n**Contoh penggunaan:**\n```php\n// Basic pagination\n$posts = Post::paginate(15); // 15 per page\n\n// Simple pagination (faster, no total count)\n$posts = Post::simplePaginate(15);\n\n// Cursor pagination (for large datasets)\n$posts = Post::cursorPaginate(15);\n\n// With query\n$posts = Post::where('published', true)\n    ->orderBy('created_at', 'desc')\n    ->paginate(15);\n\n// In Blade\n@foreach ($posts as $post)\n    {{ $post->title }}\n@endforeach\n\n{{ $posts->links() }}\n```\n\n**Perhatian:**\n- paginate() dengan total count\n- simplePaginate() tanpa total (faster)\n- cursorPaginate() untuk infinite scroll\n- links() untuk render pagination",
    en: "**Function:** Paginates query results.\n\n**When to use:** To display large data with pagination.\n\n**Example:**\n```php\n$posts = Post::paginate(15);\n$posts = Post::simplePaginate(15);\n\n// In Blade\n{{ $posts->links() }}\n```\n\n**Attention:**\n- paginate() with total count\n- simplePaginate() without total (faster)"
  },

  // ============================================
  // TRANSACTIONS
  // ============================================
  {
    method: "DB::transaction",
    aliases: ["transaction"],
    category: "helper",
    id: "**Fungsi:** Execute queries dalam database transaction.\n\n**Kapan dipakai:** Saat multiple queries harus sukses semua atau rollback semua.\n\n**Contoh penggunaan:**\n```php\nuse Illuminate\\Support\\Facades\\DB;\n\n// Automatic transaction\nDB::transaction(function () {\n    $user = User::create([...]);\n    $user->profile()->create([...]);\n    $user->roles()->attach([1, 2, 3]);\n}); // Auto commit or rollback\n\n// Manual transaction\nDB::beginTransaction();\ntry {\n    $user = User::create([...]);\n    $order = Order::create([...]);\n    \n    DB::commit();\n} catch (Exception $e) {\n    DB::rollBack();\n    throw $e;\n}\n\n// With retry attempts\nDB::transaction(function () {\n    // ...\n}, 5); // Retry 5 times on deadlock\n```\n\n**Perhatian:**\n- Semua atau tidak sama sekali (ACID)\n- Auto-rollback on exception\n- Berguna untuk related data operations\n- Retry parameter untuk handle deadlock",
    en: "**Function:** Executes queries in database transaction.\n\n**When to use:** When multiple queries must all succeed or all rollback.\n\n**Example:**\n```php\nDB::transaction(function () {\n    $user = User::create([...]);\n    $user->profile()->create([...]);\n});\n```\n\n**Attention:**\n- All or nothing (ACID)\n- Auto-rollback on exception\n- Useful for related data operations"
  },

  // ============================================
  // API RESOURCES
  // ============================================
  {
    method: "JsonResource",
    aliases: ["Resource", "API Resource"],
    category: "response",
    id: "**Fungsi:** Transform model ke JSON response.\n\n**Kapan dipakai:** Untuk API responses dengan format konsisten.\n\n**Contoh penggunaan:**\n```php\n// Create: php artisan make:resource PostResource\n\nclass PostResource extends JsonResource\n{\n    public function toArray(Request $request): array\n    {\n        return [\n            'id' => $this->id,\n            'title' => $this->title,\n            'content' => $this->content,\n            'author' => new UserResource($this->whenLoaded('author')),\n            'created_at' => $this->created_at->toISOString(),\n        ];\n    }\n}\n\n// In Controller\npublic function show(Post $post)\n{\n    return new PostResource($post);\n}\n\npublic function index()\n{\n    return PostResource::collection(Post::paginate());\n}\n```\n\n**Perhatian:**\n- Consistent API responses\n- whenLoaded() untuk conditional relations\n- collection() untuk multiple resources\n- Automatic pagination meta",
    en: "**Function:** Transforms model to JSON response.\n\n**When to use:** For API responses with consistent format.\n\n**Example:**\n```php\nclass PostResource extends JsonResource\n{\n    public function toArray(Request $request): array\n    {\n        return [\n            'id' => $this->id,\n            'title' => $this->title,\n        ];\n    }\n}\n\nreturn new PostResource($post);\n```\n\n**Attention:**\n- Consistent API responses\n- whenLoaded() for conditional relations"
  },

  // ============================================
  // NOTIFICATIONS
  // ============================================
  {
    method: "notify",
    category: "helper",
    id: "**Fungsi:** Send notification ke user.\n\n**Kapan dipakai:** Untuk email, SMS, database, Slack notifications.\n\n**Contoh penggunaan:**\n```php\n// Create: php artisan make:notification OrderShipped\n\n// Send to single user\n$user->notify(new OrderShipped($order));\n\n// Send to multiple users\nNotification::send($users, new OrderShipped($order));\n\n// On-demand (without user)\nNotification::route('mail', 'guest@example.com')\n    ->notify(new OrderShipped($order));\n\n// In Notification class\npublic function via($notifiable): array\n{\n    return ['mail', 'database', 'slack'];\n}\n\npublic function toMail($notifiable): MailMessage\n{\n    return (new MailMessage)\n        ->line('Your order has been shipped!')\n        ->action('View Order', url('/orders/'.$this->order->id));\n}\n```\n\n**Perhatian:**\n- Multiple channels: mail, database, slack, nexmo, etc\n- Queueable notifications\n- User must use Notifiable trait",
    en: "**Function:** Sends notification to user.\n\n**When to use:** For email, SMS, database, Slack notifications.\n\n**Example:**\n```php\n$user->notify(new OrderShipped($order));\nNotification::send($users, new OrderShipped($order));\n```\n\n**Attention:**\n- Multiple channels: mail, database, slack, etc\n- User must use Notifiable trait"
  },

  // ============================================
  // MAIL
  // ============================================
  {
    method: "Mail::send",
    aliases: ["Mail::to", "Mailable"],
    category: "helper",
    id: "**Fungsi:** Send email.\n\n**Kapan dipakai:** Untuk mengirim email transaksional atau marketing.\n\n**Contoh penggunaan:**\n```php\nuse Illuminate\\Support\\Facades\\Mail;\n\n// Create: php artisan make:mail OrderConfirmation\n\n// Send email\nMail::to($user)->send(new OrderConfirmation($order));\n\n// With CC/BCC\nMail::to($user)\n    ->cc($manager)\n    ->bcc($admin)\n    ->send(new OrderConfirmation($order));\n\n// Queue email\nMail::to($user)->queue(new OrderConfirmation($order));\n\n// Later\nMail::to($user)->later(now()->addMinutes(10), new OrderConfirmation($order));\n```\n\n**Perhatian:**\n- Configure mail driver: SMTP, Mailgun, SES\n- queue() untuk async sending\n- Mailable class untuk reusable emails",
    en: "**Function:** Sends email.\n\n**When to use:** For transactional or marketing emails.\n\n**Example:**\n```php\nMail::to($user)->send(new OrderConfirmation($order));\nMail::to($user)->queue(new OrderConfirmation($order));\n```\n\n**Attention:**\n- Configure mail driver: SMTP, Mailgun, SES\n- queue() for async sending"
  },
];

/**
 * Mencari penjelasan untuk method controller tertentu
 * @param keyword Keyword yang dicari
 * @param lang Bahasa ('id' atau 'en')
 * @returns Penjelasan method atau null jika tidak ditemukan
 */
export const getControllerHover = (keyword: string, lang: 'id' | 'en'): string | null => {
  const lowerKeyword = keyword.toLowerCase();
  
  const match = controllerData.find(d => {
    // Match exact method name
    if (d.method.toLowerCase() === lowerKeyword) return true;
    
    // Match keyword contains method (handle $request->validate, etc)
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
