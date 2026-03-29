"use strict";
/**
 * Data method untuk Laravel Eloquent Model
 * Berisi 50+ method dan property dengan penjelasan detail
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getModelHover = exports.modelData = void 0;
exports.modelData = [
    // ============================================
    // MASS ASSIGNMENT PROTECTION
    // ============================================
    {
        method: "$fillable",
        category: "property",
        id: "**Fungsi:** Array yang berisi nama kolom yang BOLEH diisi menggunakan mass assignment.\n\n**Kapan dipakai:** SELALU definisikan ini di model untuk melindungi dari Mass Assignment Vulnerability. Ini adalah cara RECOMMENDED di Laravel modern.\n\n**Contoh penggunaan:**\n```php\nclass User extends Model\n{\n    protected $fillable = ['name', 'email', 'password'];\n}\n\n// Sekarang kamu bisa:\nUser::create(['name' => 'John', 'email' => 'john@example.com']);\n$user->update(['name' => 'Jane']);\n\n// Ini akan ERROR (kolom 'role' tidak di-fillable):\nUser::create(['name' => 'Hacker', 'role' => 'admin']); // ❌\n```\n\n⚠️ **Perhatian:**\n- JANGAN definisikan `$fillable` DAN `$guarded` bersamaan! Pilih salah satu.\n- `$fillable` = whitelist (hanya yang listed yang boleh diisi) - RECOMMENDED\n- `$guarded` = blacklist (yang listed TIDAK boleh diisi)\n- Best practice: gunakan `$fillable` untuk kontrol lebih eksplisit",
        en: "**Function:** Array of column names that are mass assignable.\n\n**When to use:** ALWAYS define this to protect against Mass Assignment Vulnerability. This is the RECOMMENDED approach.\n\n**Example:**\n```php\nclass User extends Model\n{\n    protected $fillable = ['name', 'email', 'password'];\n}\n\nUser::create(['name' => 'John', 'email' => 'john@example.com']);\n```\n\n⚠️ **Attention:**\n- Do NOT define both `$fillable` AND `$guarded`!\n- `$fillable` = whitelist (recommended)"
    },
    {
        method: "$guarded",
        category: "property",
        id: "**Fungsi:** Array yang berisi nama kolom yang TIDAK BOLEH diisi menggunakan mass assignment.\n\n**Kapan dipakai:** Alternatif dari `$fillable`. Gunakan jika kamu ingin semua kolom fillable kecuali beberapa yang sensitif.\n\n**Contoh penggunaan:**\n```php\nclass User extends Model\n{\n    // Semua boleh diisi KECUALI is_admin\n    protected $guarded = ['is_admin'];\n    \n    // Atau guard semua (tidak recommended):\n    protected $guarded = ['*'];\n}\n\n// Ini akan ERROR:\nUser::create(['name' => 'John', 'is_admin' => true]); // ❌ is_admin guarded\n```\n\n⚠️ **Perhatian:**\n- JANGAN definisikan `$fillable` DAN `$guarded` bersamaan!\n- `$guarded = ['*']` = semua kolom tidak boleh mass assign (sama dengan tidak ada fillable)\n- Lebih baik gunakan `$fillable` untuk explicit control",
        en: "**Function:** Array of column names that are NOT mass assignable.\n\n**When to use:** Alternative to `$fillable`. Use when you want all columns fillable except sensitive ones.\n\n**Example:**\n```php\nclass User extends Model\n{\n    protected $guarded = ['is_admin'];\n}\n```\n\n⚠️ **Attention:**\n- Do NOT use with `$fillable` together!\n- `$guarded = ['*']` blocks all mass assignment"
    },
    // ============================================
    // PRIMARY & SECONDARY KEYS
    // ============================================
    {
        method: "$primaryKey",
        category: "property",
        id: "**Fungsi:** Menentukan nama primary key tabel.\n\n**Kapan dipakai:** Saat primary key kamu bukan 'id' (default Laravel).\n\n**Contoh penggunaan:**\n```php\nclass User extends Model\n{\n    protected $primaryKey = 'user_id';\n}\n```\n\n⚠️ **Perhatian:**\n- Default: 'id'\n- Ubah jika primary key kamu berbeda\n- Affects all queries (find, where, etc)",
        en: "**Function:** Sets the primary key column name.\n\n**When to use:** When your primary key is not 'id' (Laravel default).\n\n**Example:**\n```php\nclass User extends Model\n{\n    protected $primaryKey = 'user_id';\n}\n```\n\n⚠️ **Attention:**\n- Default: 'id'"
    },
    {
        method: "$keyType",
        category: "property",
        id: "**Fungsi:** Menentukan tipe data primary key.\n\n**Kapan dipakai:** Saat primary key kamu bukan integer (misal: UUID string).\n\n**Contoh penggunaan:**\n```php\nclass User extends Model\n{\n    protected $keyType = 'string'; // untuk UUID\n    public $incrementing = false; // UUID tidak auto-increment\n}\n```\n\n⚠️ **Perhatian:**\n- Default: 'int'\n- Ubah ke 'string' untuk UUID/ULID\n- Biasanya dipasangkan dengan `$incrementing = false`",
        en: "**Function:** Sets the primary key data type.\n\n**When to use:** When your primary key is not integer (e.g., UUID string).\n\n**Example:**\n```php\nclass User extends Model\n{\n    protected $keyType = 'string';\n    public $incrementing = false;\n}\n```\n\n⚠️ **Attention:**\n- Default: 'int'"
    },
    {
        method: "$incrementing",
        category: "property",
        id: "**Fungsi:** Menentukan apakah primary key auto-increment.\n\n**Kapan dipakai:** Saat primary key kamu tidak auto-increment (misal: UUID).\n\n**Contoh penggunaan:**\n```php\nclass User extends Model\n{\n    public $incrementing = false; // UUID tidak auto-increment\n}\n```\n\n⚠️ **Perhatian:**\n- Default: true\n- Set false untuk UUID, ULID, atau custom ID\n- Biasanya dipasangkan dengan `$keyType = 'string'`",
        en: "**Function:** Sets whether the primary key auto-increments.\n\n**When to use:** When your primary key does not auto-increment (e.g., UUID).\n\n**Example:**\n```php\nclass User extends Model\n{\n    public $incrementing = false;\n}\n```\n\n⚠️ **Attention:**\n- Default: true"
    },
    // ============================================
    // TIMESTAMPS
    // ============================================
    {
        method: "$timestamps",
        category: "property",
        id: "**Fungsi:** Menentukan apakah model menggunakan timestamps.\n\n**Kapan dipakai:** Saat tabel kamu tidak punya created_at/updated_at.\n\n**Contoh penggunaan:**\n```php\nclass Session extends Model\n{\n    public $timestamps = false; // Tabel tidak punya timestamps\n}\n```\n\n⚠️ **Perhatian:**\n- Default: true\n- Set false jika tabel tidak punya created_at/updated_at\n- Laravel akan skip set timestamps otomatis",
        en: "**Function:** Sets whether the model uses timestamps.\n\n**When to use:** When your table doesn't have created_at/updated_at.\n\n**Example:**\n```php\nclass Session extends Model\n{\n    public $timestamps = false;\n}\n```\n\n⚠️ **Attention:**\n- Default: true"
    },
    {
        method: "CREATED_AT",
        category: "property",
        id: "**Fungsi:** Menentukan nama kolom created_at.\n\n**Kapan dipakai:** Saat nama kolom created_at kamu berbeda dari default.\n\n**Contoh penggunaan:**\n```php\nclass User extends Model\n{\n    const CREATED_AT = 'created';\n    const UPDATED_AT = 'updated';\n}\n```\n\n⚠️ **Perhatian:**\n- Default: 'created_at'\n- Harus constant (const), bukan property\n- Affects create() dan update() operations",
        en: "**Function:** Sets the created_at column name.\n\n**When to use:** When your created_at column has a different name.\n\n**Example:**\n```php\nclass User extends Model\n{\n    const CREATED_AT = 'created';\n}\n```\n\n⚠️ **Attention:**\n- Default: 'created_at'\n- Must be constant (const)"
    },
    {
        method: "UPDATED_AT",
        category: "property",
        id: "**Fungsi:** Menentukan nama kolom updated_at.\n\n**Kapan dipakai:** Saat nama kolom updated_at kamu berbeda dari default.\n\n**Contoh penggunaan:**\n```php\nclass User extends Model\n{\n    const UPDATED_AT = 'last_modified';\n}\n```\n\n⚠️ **Perhatian:**\n- Default: 'updated_at'\n- Harus constant (const), bukan property\n- Affects update() operations",
        en: "**Function:** Sets the updated_at column name.\n\n**When to use:** When your updated_at column has a different name.\n\n**Example:**\n```php\nclass User extends Model\n{\n    const UPDATED_AT = 'last_modified';\n}\n```\n\n⚠️ **Attention:**\n- Default: 'updated_at'"
    },
    // ============================================
    // CASTING & ATTRIBUTES
    // ============================================
    {
        method: "$casts",
        category: "property",
        id: "**Fungsi:** Array untuk casting atribut ke tipe data tertentu.\n\n**Kapan dipakai:** SELALU gunakan untuk kolom date, boolean, array, json, dll agar otomatis di-cast.\n\n**Contoh penggunaan:**\n```php\nclass User extends Model\n{\n    protected $casts = [\n        'email_verified_at' => 'datetime',\n        'is_active' => 'boolean',\n        'settings' => 'array',\n        'score' => 'integer',\n        'balance' => 'decimal:2',\n        'birthday' => 'date',\n    ];\n}\n\n// Usage:\n$user->is_active; // true/false (boolean)\n$user->settings; // array (auto json_decode)\n$user->email_verified_at; // Carbon instance\n```\n\n⚠️ **Perhatian:**\n- Available casts: array, boolean, collection, date, datetime, decimal, double, float, integer, json, object, real, string, timestamp\n- Untuk decimal: 'decimal:2' untuk 2 decimal places\n- datetime dan date return Carbon instance",
        en: "**Function:** Array for casting attributes to specific data types.\n\n**When to use:** ALWAYS use for date, boolean, array, json columns for auto-casting.\n\n**Example:**\n```php\nclass User extends Model\n{\n    protected $casts = [\n        'email_verified_at' => 'datetime',\n        'is_active' => 'boolean',\n        'settings' => 'array',\n    ];\n}\n```\n\n⚠️ **Attention:**\n- datetime returns Carbon instance\n- array auto json_encode/decode"
    },
    {
        method: "$dates",
        category: "property",
        id: "**Fungsi:** Array kolom yang akan di-cast ke Carbon instance (legacy).\n\n**Kapan dipakai:** Laravel < 8, sekarang gunakan `$casts` dengan 'datetime'.\n\n**Contoh penggunaan:**\n```php\n// Legacy (Laravel < 8)\nclass User extends Model\n{\n    protected $dates = ['email_verified_at', 'birth_date'];\n}\n\n// Modern (Laravel 8+)\nclass User extends Model\n{\n    protected $casts = [\n        'email_verified_at' => 'datetime',\n        'birth_date' => 'date',\n    ];\n}\n```\n\n⚠️ **Perhatian:**\n- Deprecated di Laravel 8+\n- Gunakan `$casts` instead\n- Masih support untuk backward compatibility",
        en: "**Function:** Array of columns to cast to Carbon instances (legacy).\n\n**When to use:** Laravel < 8, now use `$casts` with 'datetime'.\n\n**Example:**\n```php\n// Modern approach:\nprotected $casts = ['email_verified_at' => 'datetime'];\n```\n\n⚠️ **Attention:**\n- Deprecated in Laravel 8+\n- Use `$casts` instead"
    },
    {
        method: "$hidden",
        category: "property",
        id: "**Fungsi:** Array atribut yang akan di-hide saat toArray()/toJson().\n\n**Kapan dipakai:** Untuk menyembunyikan data sensitif seperti password, token, dll saat return JSON.\n\n**Contoh penggunaan:**\n```php\nclass User extends Model\n{\n    protected $hidden = ['password', 'remember_token', 'api_key'];\n}\n\n// Usage:\n$user->toArray(); // password TIDAK termasuk\n$user->toJson(); // password TIDAK termasuk\n$user->password; // Masih bisa akses langsung\n```\n\n⚠️ **Perhatian:**\n- Hanya affect toArray() dan toJson()\n- Masih bisa akses langsung: `$user->password`\n- Untuk API responses, gunakan juga `$visible` jika perlu whitelist",
        en: "**Function:** Array of attributes hidden from toArray()/toJson().\n\n**When to use:** To hide sensitive data like passwords, tokens, etc. when returning JSON.\n\n**Example:**\n```php\nclass User extends Model\n{\n    protected $hidden = ['password', 'remember_token'];\n}\n```\n\n⚠️ **Attention:**\n- Only affects toArray() and toJson()\n- Still accessible directly"
    },
    {
        method: "$visible",
        category: "property",
        id: "**Fungsi:** Array atribut yang akan di-show saat toArray()/toJson() (whitelist).\n\n**Kapan dipakai:** Saat kamu ingin hanya kolom tertentu yang muncul di JSON (lebih strict dari $hidden).\n\n**Contoh penggunaan:**\n```php\nclass User extends Model\n{\n    protected $visible = ['id', 'name', 'email'];\n}\n\n// Usage:\n$user->toArray(); // HANYA id, name, email\n$user->toJson(); // HANYA id, name, email\n```\n\n⚠️ **Perhatian:**\n- Kebalikan dari `$hidden`\n- Hanya kolom di array ini yang muncul\n- JANGAN definisikan `$hidden` DAN `$visible` bersamaan!",
        en: "**Function:** Array of attributes shown in toArray()/toJson() (whitelist).\n\n**When to use:** When you want only specific columns in JSON (stricter than $hidden).\n\n**Example:**\n```php\nclass User extends Model\n{\n    protected $visible = ['id', 'name', 'email'];\n}\n```\n\n⚠️ **Attention:**\n- Opposite of `$hidden`\n- Do NOT use with `$hidden` together!"
    },
    {
        method: "$appends",
        category: "property",
        id: "**Fungsi:** Array accessors yang akan di-append otomatis ke array/JSON.\n\n**Kapan dipakai:** Saat kamu ingin accessor selalu muncul di serialization tanpa perlu append manual.\n\n**Contoh penggunaan:**\n```php\nclass User extends Model\n{\n    protected $appends = ['full_name', 'avatar_url'];\n    \n    // Accessor\n    public function getFullNameAttribute()\n    {\n        return $this->first_name . ' ' . $this->last_name;\n    }\n}\n\n// Usage:\n$user->toArray(); // includes full_name\n$user->toJson(); // includes full_name\n```\n\n⚠️ **Perhatian:**\n- Harus ada accessor method: `get{AttributeName}Attribute()`\n- Otomatis append ke semua serialization\n- Bisa impact performance jika accessor heavy",
        en: "**Function:** Array of accessors auto-appended to array/JSON.\n\n**When to use:** When you want accessors to always appear in serialization.\n\n**Example:**\n```php\nclass User extends Model\n{\n    protected $appends = ['full_name'];\n    \n    public function getFullNameAttribute()\n    {\n        return $this->first_name . ' ' . $this->last_name;\n    }\n}\n```\n\n⚠️ **Attention:**\n- Must have accessor method\n- Auto-appends to all serialization"
    },
    // ============================================
    // RELATIONSHIPS - ONE TO ONE / MANY
    // ============================================
    {
        method: "hasOne",
        category: "relationship",
        id: "**Fungsi:** Mendefinisikan relasi One-to-One (satu model memiliki satu model lain).\n\n**Kapan dipakai:** Saat satu record di tabel ini punya satu record di tabel lain.\n\n**Contoh penggunaan:**\n```php\nclass User extends Model\n{\n    // Satu user punya satu profile\n    public function profile()\n    {\n        return $this->hasOne(Profile::class);\n        // Otomatis relasi ke profiles.user_id\n    }\n    \n    // Custom foreign key\n    public function profile()\n    {\n        return $this->hasOne(Profile::class, 'user_id');\n    }\n    \n    // Custom foreign & local key\n    public function profile()\n    {\n        return $this->hasOne(Profile::class, 'user_id', 'id');\n    }\n}\n\n// Usage:\n$user = User::find(1);\n$profile = $user->profile; // Single Profile instance\n$profile = $user->profile()->first(); // Dengan query\n```\n\n⚠️ **Perhatian:**\n- Nama method HARUS camelCase dan singular: `profile`, `setting`, `bio`\n- Laravel otomatis asumsikan foreign key adalah `{method}_id`\n- Return type relasi ini adalah Model instance atau null",
        en: "**Function:** Defines a One-to-One relationship.\n\n**When to use:** When one record has one related record in another table.\n\n**Example:**\n```php\nclass User extends Model\n{\n    public function profile()\n    {\n        return $this->hasOne(Profile::class);\n    }\n}\n\n// Usage:\n$profile = $user->profile; // Single instance\n```\n\n⚠️ **Attention:**\n- Method name MUST be camelCase and singular\n- Auto-assumes foreign key is `{method}_id`"
    },
    {
        method: "hasMany",
        category: "relationship",
        id: "**Fungsi:** Mendefinisikan relasi One-to-Many (satu model memiliki banyak model lain).\n\n**Kapan dipakai:** Saat satu record di tabel ini bisa memiliki banyak record di tabel lain.\n\n**Contoh penggunaan:**\n```php\nclass User extends Model\n{\n    // Satu user punya banyak posts\n    public function posts()\n    {\n        return $this->hasMany(Post::class);\n        // Otomatis relasi ke posts.user_id\n    }\n    \n    // Custom foreign key\n    public function articles()\n    {\n        return $this->hasMany(Article::class, 'author_id');\n    }\n    \n    // Custom foreign & local key\n    public function comments()\n    {\n        return $this->hasMany(Comment::class, 'user_id', 'id');\n    }\n}\n\n// Usage:\n$user = User::find(1);\n$posts = $user->posts; // Collection of Post\n$posts = $user->posts()->where('published', true)->get(); // Dengan query\n```\n\n⚠️ **Perhatian:**\n- Nama method HARUS camelCase dan PLURAL: `posts`, `comments`, `articles`\n- Laravel otomatis asumsikan foreign key adalah `{method}_id`\n- Return type relasi ini adalah Collection",
        en: "**Function:** Defines a One-to-Many relationship.\n\n**When to use:** When one record has many related records.\n\n**Example:**\n```php\nclass User extends Model\n{\n    public function posts()\n    {\n        return $this->hasMany(Post::class);\n    }\n}\n\n// Usage:\n$posts = $user->posts; // Collection\n```\n\n⚠️ **Attention:**\n- Method name MUST be camelCase and PLURAL"
    },
    {
        method: "belongsTo",
        category: "relationship",
        id: "**Fungsi:** Mendefinisikan relasi Belongs-To (inverse dari hasOne/hasMany).\n\n**Kapan dipakai:** Saat model ini punya foreign key ke model lain (child to parent).\n\n**Contoh penggunaan:**\n```php\nclass Post extends Model\n{\n    // Post punya satu author (User)\n    public function author()\n    {\n        return $this->belongsTo(User::class);\n        // Otomatis relasi ke posts.user_id -> users.id\n    }\n    \n    // Custom foreign key\n    public function author()\n    {\n        return $this->belongsTo(User::class, 'author_id');\n    }\n    \n    // Custom foreign & owner key\n    public function author()\n    {\n        return $this->belongsTo(User::class, 'author_id', 'id');\n    }\n}\n\n// Usage:\n$post = Post::find(1);\n$author = $post->author; // Single User instance\n```\n\n⚠️ **Perhatian:**\n- Nama method HARUS camelCase dan singular: `author`, `category`, `parent`\n- Laravel otomatis asumsikan foreign key adalah `{method}_id`\n- Return type relasi ini adalah Model instance atau null",
        en: "**Function:** Defines a Belongs-To relationship (inverse of hasOne/hasMany).\n\n**When to use:** When this model has a foreign key to another model (child to parent).\n\n**Example:**\n```php\nclass Post extends Model\n{\n    public function author()\n    {\n        return $this->belongsTo(User::class);\n    }\n}\n\n// Usage:\n$author = $post->author; // Single instance\n```\n\n⚠️ **Attention:**\n- Method name MUST be camelCase and singular"
    },
    // ============================================
    // RELATIONSHIPS - MANY TO MANY
    // ============================================
    {
        method: "belongsToMany",
        category: "relationship",
        id: "**Fungsi:** Mendefinisikan relasi Many-to-Many (banyak-ke-banyak).\n\n**Kapan dipakai:** Saat banyak record di tabel ini bisa berhubungan dengan banyak record di tabel lain (butuh pivot table).\n\n**Contoh penggunaan:**\n```php\nclass User extends Model\n{\n    // User bisa punya banyak roles, role bisa punya banyak users\n    public function roles()\n    {\n        return $this->belongsToMany(Role::class);\n        // Otomatis pivot table: role_user (alphabetical)\n    }\n    \n    // Custom pivot table\n    public function roles()\n    {\n        return $this->belongsToMany(Role::class, 'user_roles');\n    }\n    \n    // Custom foreign keys\n    public function roles()\n    {\n        return $this->belongsToMany(Role::class, 'user_roles', 'user_id', 'role_id');\n    }\n    \n    // Dengan pivot columns\n    public function roles()\n    {\n        return $this->belongsToMany(Role::class)\n            ->withPivot('created_at', 'assigned_by')\n            ->withTimestamps();\n    }\n}\n\n// Usage:\n$user = User::find(1);\n$roles = $user->roles; // Collection of Role\n$user->roles()->attach($roleId); // Attach role\n$user->roles()->detach($roleId); // Detach role\n$user->roles()->sync([1, 2, 3]); // Sync roles\n```\n\n⚠️ **Perhatian:**\n- BUTUH pivot table (nama: singular1_singular2, alphabetical)\n- Pivot table harus punya foreign keys ke kedua tabel\n- Gunakan `withPivot()` untuk akses kolom tambahan di pivot\n- Return type relasi ini adalah Collection",
        en: "**Function:** Defines a Many-to-Many relationship.\n\n**When to use:** When many records can relate to many other records (requires pivot table).\n\n**Example:**\n```php\nclass User extends Model\n{\n    public function roles()\n    {\n        return $this->belongsToMany(Role::class);\n    }\n}\n\n// Usage:\n$roles = $user->roles; // Collection\n$user->roles()->attach($roleId);\n```\n\n⚠️ **Attention:**\n- Requires pivot table\n- Use `withPivot()` for extra pivot columns"
    },
    // ============================================
    // RELATIONSHIPS - HAS MANY THROUGH
    // ============================================
    {
        method: "hasManyThrough",
        category: "relationship",
        id: "**Fungsi:** Mendefinisikan relasi Has-Many-Through (relasi tidak langsung).\n\n**Kapan dipakai:** Saat kamu ingin akses relasi melalui model perantara.\n\n**Contoh penggunaan:**\n```php\nclass Country extends Model\n{\n    // Country -> has many -> Users -> has many -> Posts\n    // Get all posts from all users in this country\n    public function posts()\n    {\n        return $this->hasManyThrough(Post::class, User::class);\n        // Country -> User -> Post\n    }\n    \n    // Custom keys\n    public function posts()\n    {\n        return $this->hasManyThrough(\n            Post::class,      // Final model\n            User::class,      // Intermediate model\n            'country_id',     // Foreign key on users table\n            'user_id',        // Foreign key on posts table\n            'id',             // Local key on countries\n            'id'              // Local key on users\n        );\n    }\n}\n\n// Usage:\n$country = Country::find(1);\n$posts = $country->posts; // All posts from users in this country\n```\n\n⚠️ **Perhatian:**\n- Relasi tidak langsung melalui model perantara\n- Minimal 3 tabel terlibat\n- Return type relasi ini adalah Collection",
        en: "**Function:** Defines a Has-Many-Through relationship (indirect relationship).\n\n**When to use:** When you want to access a relationship through an intermediate model.\n\n**Example:**\n```php\nclass Country extends Model\n{\n    public function posts()\n    {\n        return $this->hasManyThrough(Post::class, User::class);\n    }\n}\n\n// Usage:\n$posts = $country->posts; // All posts through users\n```\n\n⚠️ **Attention:**\n- Indirect relationship through intermediate model"
    },
    {
        method: "hasOneThrough",
        category: "relationship",
        id: "**Fungsi:** Mendefinisikan relasi Has-One-Through (relasi tidak langsung single result).\n\n**Kapan dipakai:** Sama seperti hasManyThrough tapi return single result.\n\n**Contoh penggunaan:**\n```php\nclass User extends Model\n{\n    // User -> has one -> Profile -> has one -> Address\n    public function address()\n    {\n        return $this->hasOneThrough(Address::class, Profile::class);\n    }\n}\n\n// Usage:\n$address = $user->address; // Single Address instance\n```\n\n⚠️ **Perhatian:**\n- Sama seperti hasManyThrough tapi return single model\n- Return type relasi ini adalah Model instance atau null",
        en: "**Function:** Defines a Has-One-Through relationship.\n\n**When to use:** Same as hasManyThrough but returns single result.\n\n**Example:**\n```php\nclass User extends Model\n{\n    public function address()\n    {\n        return $this->hasOneThrough(Address::class, Profile::class);\n    }\n}\n```\n\n⚠️ **Attention:**\n- Returns single model instance"
    },
    // ============================================
    // RELATIONSHIPS - POLYMORPHIC
    // ============================================
    {
        method: "morphOne",
        category: "relationship",
        id: "**Fungsi:** Mendefinisikan relasi Polymorphic One-to-One.\n\n**Kapan dipakai:** Saat satu model bisa punya satu model lain dari berbagai tipe.\n\n**Contoh penggunaan:**\n```php\nclass User extends Model\n{\n    // User bisa punya satu avatar\n    public function avatar()\n    {\n        return $this->morphOne(Image::class, 'imageable');\n        // images.imageable_id, images.imageable_type\n    }\n}\n\nclass Post extends Model\n{\n    // Post juga bisa punya satu avatar\n    public function avatar()\n    {\n        return $this->morphOne(Image::class, 'imageable');\n    }\n}\n\n// Usage:\n$user->avatar; // Single Image\n$post->avatar; // Single Image\n```\n\n⚠️ **Perhatian:**\n- Butuh kolom `{name}_id` dan `{name}_type` di tabel target\n- Satu tabel bisa relate ke banyak model berbeda\n- Return type relasi ini adalah Model instance atau null",
        en: "**Function:** Defines a Polymorphic One-to-One relationship.\n\n**When to use:** When one model can have one model of various types.\n\n**Example:**\n```php\nclass User extends Model\n{\n    public function avatar()\n    {\n        return $this->morphOne(Image::class, 'imageable');\n    }\n}\n```\n\n⚠️ **Attention:**\n- Requires `{name}_id` and `{name}_type` columns"
    },
    {
        method: "morphMany",
        category: "relationship",
        id: "**Fungsi:** Mendefinisikan relasi Polymorphic One-to-Many.\n\n**Kapan dipakai:** Saat satu model bisa punya banyak model lain dari berbagai tipe.\n\n**Contoh penggunaan:**\n```php\nclass User extends Model\n{\n    // User bisa punya banyak comments\n    public function comments()\n    {\n        return $this->morphMany(Comment::class, 'commentable');\n    }\n}\n\nclass Post extends Model\n{\n    // Post juga bisa punya banyak comments\n    public function comments()\n    {\n        return $this->morphMany(Comment::class, 'commentable');\n    }\n}\n\n// Usage:\n$comments = $user->comments; // Collection\n$comments = $post->comments; // Collection\n```\n\n⚠️ **Perhatian:**\n- Butuh kolom `{name}_id` dan `{name}_type` di tabel target\n- Return type relasi ini adalah Collection",
        en: "**Function:** Defines a Polymorphic One-to-Many relationship.\n\n**When to use:** When one model can have many models of various types.\n\n**Example:**\n```php\nclass User extends Model\n{\n    public function comments()\n    {\n        return $this->morphMany(Comment::class, 'commentable');\n    }\n}\n```\n\n⚠️ **Attention:**\n- Requires `{name}_id` and `{name}_type` columns"
    },
    {
        method: "morphTo",
        category: "relationship",
        id: "**Fungsi:** Mendefinisikan sisi inverse dari relasi polymorphic.\n\n**Kapan dipakai:** Di model target yang punya kolom polymorphic (commentable_id, commentable_type).\n\n**Contoh penggunaan:**\n```php\nclass Comment extends Model\n{\n    // Comment bisa ke User atau Post\n    public function commentable()\n    {\n        return $this->morphTo();\n    }\n}\n\n// Usage:\n$comment = Comment::find(1);\n$commentable = $comment->commentable; // User atau Post instance\n\n// Constraint morphTo (Laravel 9+)\npublic function commentable()\n{\n    return $this->morphTo()->constrain([\n        User::class => ['id'],\n        Post::class => ['id'],\n    ]);\n}\n```\n\n⚠️ **Perhatian:**\n- Harus ada kolom `{name}_id` dan `{name}_type`\n- Return type bisa berbagai model\n- Bisa N+1 query problem, eager load dengan `with()`",
        en: "**Function:** Defines the inverse side of polymorphic relationship.\n\n**When to use:** In the target model that has polymorphic columns.\n\n**Example:**\n```php\nclass Comment extends Model\n{\n    public function commentable()\n    {\n        return $this->morphTo();\n    }\n}\n\n// Usage:\n$commentable = $comment->commentable; // User or Post\n```\n\n⚠️ **Attention:**\n- Requires `{name}_id` and `{name}_type` columns"
    },
    {
        method: "morphToMany",
        category: "relationship",
        id: "**Fungsi:** Mendefinisikan relasi Polymorphic Many-to-Many.\n\n**Kapan dipakai:** Saat banyak model bisa relate ke banyak model lain dengan pivot table polymorphic.\n\n**Contoh penggunaan:**\n```php\nclass User extends Model\n{\n    // User bisa punya banyak tags\n    public function tags()\n    {\n        return $this->morphToMany(Tag::class, 'taggable');\n        // taggables: taggable_id, taggable_type, tag_id\n    }\n}\n\nclass Post extends Model\n{\n    // Post juga bisa punya banyak tags\n    public function tags()\n    {\n        return $this->morphToMany(Tag::class, 'taggable');\n    }\n}\n\n// Usage:\n$tags = $user->tags; // Collection of Tag\n$tags = $post->tags; // Collection of Tag\n```\n\n⚠️ **Perhatian:**\n- Butuh pivot table dengan kolom polymorphic\n- Pivot table: `{taggables}` dengan taggable_id, taggable_type, tag_id\n- Return type relasi ini adalah Collection",
        en: "**Function:** Defines a Polymorphic Many-to-Many relationship.\n\n**When to use:** When many models can relate to many models with polymorphic pivot.\n\n**Example:**\n```php\nclass User extends Model\n{\n    public function tags()\n    {\n        return $this->morphToMany(Tag::class, 'taggable');\n    }\n}\n```\n\n⚠️ **Attention:**\n- Requires polymorphic pivot table"
    },
    {
        method: "morphedByMany",
        category: "relationship",
        id: "**Fungsi:** Mendefinisikan inverse dari morphToMany.\n\n**Kapan dipakai:** Di model target (Tag) untuk akses model yang relate (User, Post).\n\n**Contoh penggunaan:**\n```php\nclass Tag extends Model\n{\n    // Tag bisa punya banyak users\n    public function users()\n    {\n        return $this->morphedByMany(User::class, 'taggable');\n    }\n    \n    // Tag bisa punya banyak posts\n    public function posts()\n    {\n        return $this->morphedByMany(Post::class, 'taggable');\n    }\n}\n\n// Usage:\n$tag = Tag::find(1);\n$users = $tag->users; // Collection of User\n$posts = $tag->posts; // Collection of Post\n```\n\n⚠️ **Perhatian:**\n- Inverse dari morphToMany\n- Return type relasi ini adalah Collection",
        en: "**Function:** Defines the inverse of morphToMany.\n\n**When to use:** In the target model to access relating models.\n\n**Example:**\n```php\nclass Tag extends Model\n{\n    public function users()\n    {\n        return $this->morphedByMany(User::class, 'taggable');\n    }\n}\n```\n\n⚠️ **Attention:**\n- Inverse of morphToMany"
    },
    // ============================================
    // ACCESSORS & MUTATORS
    // ============================================
    {
        method: "get",
        aliases: ["Attribute"],
        category: "accessor",
        id: "**Fungsi:** Mendefinisikan accessor untuk atribut computed.\n\n**Kapan dipakai:** Saat kamu ingin atribut yang nilainya dihitung/ditransform dari atribut lain.\n\n**Contoh penggunaan:**\n```php\n// Laravel 9+ style (recommended)\nuse Illuminate\\Database\\Eloquent\\Casts\\Attribute;\n\nclass User extends Model\n{\n    public function fullName(): Attribute\n    {\n        return Attribute::make(\n            get: fn ($value) => $this->attributes['first_name'] . ' ' . $this->attributes['last_name'],\n        );\n    }\n}\n\n// Legacy style (still works)\nclass User extends Model\n{\n    public function getFullNameAttribute()\n    {\n        return $this->first_name . ' ' . $this->last_name;\n    }\n}\n\n// Usage:\n$user->full_name; // \"John Doe\"\n```\n\n⚠️ **Perhatian:**\n- Laravel 9+: gunakan `Attribute::make()` style\n- Legacy: `get{AttributeName}Attribute()`\n- Accessor tidak di-cache, dipanggil setiap kali akses\n- Untuk auto-append ke JSON, tambahkan ke `$appends`",
        en: "**Function:** Defines an accessor for computed attributes.\n\n**When to use:** When you want an attribute computed/transformed from other attributes.\n\n**Example:**\n```php\n// Laravel 9+ style\npublic function fullName(): Attribute\n{\n    return Attribute::make(\n        get: fn ($value) => $this->first_name . ' ' . $this->last_name,\n    );\n}\n\n// Legacy style\npublic function getFullNameAttribute()\n{\n    return $this->first_name . ' ' . $this->last_name;\n}\n```\n\n⚠️ **Attention:**\n- Not cached, called every access"
    },
    {
        method: "set",
        aliases: ["Attribute"],
        category: "mutator",
        id: "**Fungsi:** Mendefinisikan mutator untuk transformasi nilai sebelum save.\n\n**Kapan dipakai:** Saat kamu ingin nilai di-transform sebelum disimpan ke database.\n\n**Contoh penggunaan:**\n```php\n// Laravel 9+ style (recommended)\nuse Illuminate\\Database\\Eloquent\\Casts\\Attribute;\n\nclass User extends Model\n{\n    public function firstName(): Attribute\n    {\n        return Attribute::make(\n            set: fn ($value) => strtolower($value),\n        );\n    }\n}\n\n// Legacy style (still works)\nclass User extends Model\n{\n    public function setFirstNameAttribute($value)\n    {\n        $this->attributes['first_name'] = strtolower($value);\n    }\n}\n\n// Usage:\n$user->first_name = 'JOHN'; // Saved as 'john'\n```\n\n⚠️ **Perhatian:**\n- Laravel 9+: gunakan `Attribute::make()` style\n- Legacy: `set{AttributeName}Attribute()`\n- Mutator dipanggil saat set attribute, bukan saat save\n- Untuk password hashing, gunakan `Hash::make()` di mutator",
        en: "**Function:** Defines a mutator for value transformation before save.\n\n**When to use:** When you want to transform values before saving to database.\n\n**Example:**\n```php\n// Laravel 9+ style\npublic function firstName(): Attribute\n{\n    return Attribute::make(\n        set: fn ($value) => strtolower($value),\n    );\n}\n\n// Legacy style\npublic function setFirstNameAttribute($value)\n{\n    $this->attributes['first_name'] = strtolower($value);\n}\n```\n\n⚠️ **Attention:**\n- Called when setting attribute, not on save"
    },
    // ============================================
    // SCOPES
    // ============================================
    {
        method: "scope",
        category: "scope",
        id: "**Fungsi:** Mendefinisikan query scope untuk reusable query constraints.\n\n**Kapan dipakai:** Saat kamu punya query pattern yang sering digunakan.\n\n**Contoh penggunaan:**\n```php\nclass User extends Model\n{\n    // Local scope\n    public function scopeActive($query)\n    {\n        return $query->where('is_active', true);\n    }\n    \n    // Scope dengan parameter\n    public function scopeRole($query, $role)\n    {\n        return $query->where('role', $role);\n    }\n    \n    // Scope chaining\n    public function scopeVerified($query)\n    {\n        return $query->whereNotNull('email_verified_at');\n    }\n}\n\n// Usage:\n$users = User::active()->verified()->get();\n$admins = User::role('admin')->active()->get();\n```\n\n⚠️ **Perhatian:**\n- Nama method HARUS diawali `scope`\n- Saat panggil, TIDAK pakai `scope`: `User::active()` bukan `User::scopeActive()`\n- Scope bisa di-chain\n- Return query builder instance",
        en: "**Function:** Defines query scopes for reusable query constraints.\n\n**When to use:** When you have frequently used query patterns.\n\n**Example:**\n```php\nclass User extends Model\n{\n    public function scopeActive($query)\n    {\n        return $query->where('is_active', true);\n    }\n}\n\n// Usage:\n$users = User::active()->get();\n```\n\n⚠️ **Attention:**\n- Method name MUST start with `scope`\n- When calling, DON'T use `scope`: `User::active()`"
    },
    {
        method: "where",
        category: "scope",
        id: "**Fungsi:** Menambahkan WHERE clause ke query.\n\n**Kapan dipakai:** Untuk filter data berdasarkan kondisi.\n\n**Contoh penggunaan:**\n```php\n// Basic\nUser::where('status', 'active')->get();\n\n// Operator\nUser::where('age', '>=', 18)->get();\n\n// Multiple\nUser::where('status', 'active')\n    ->where('role', 'admin')\n    ->get();\n\n// Array syntax\nUser::where([\n    ['status', '=', 'active'],\n    ['age', '>=', 18],\n])->get();\n```\n\n⚠️ **Perhatian:**\n- Bisa di-chain\n- Default operator: '='\n- Untuk OR, gunakan `orWhere()`",
        en: "**Function:** Adds a WHERE clause to the query.\n\n**When to use:** To filter data based on conditions.\n\n**Example:**\n```php\nUser::where('status', 'active')->get();\nUser::where('age', '>=', 18)->get();\n```\n\n⚠️ **Attention:**\n- Chainable\n- Default operator: '='"
    },
    // ============================================
    // CRUD METHODS
    // ============================================
    {
        method: "create",
        category: "method",
        id: "**Fungsi:** Membuat instance baru dan langsung save ke database.\n\n**Kapan dipakai:** Untuk create record baru dengan mass assignment.\n\n**Contoh penggunaan:**\n```php\n// Create and save\n$user = User::create([\n    'name' => 'John',\n    'email' => 'john@example.com',\n    'password' => Hash::make('password'),\n]);\n\n// Returns the created model\n$user->id; // Auto-generated ID\n```\n\n⚠️ **Perhatian:**\n- Kolom HARUS ada di `$fillable` atau tidak di `$guarded`\n- Auto-save ke database\n- Return model instance yang sudah saved\n- Trigger model events: creating, created",
        en: "**Function:** Creates a new instance and saves to database immediately.\n\n**When to use:** To create a new record with mass assignment.\n\n**Example:**\n```php\n$user = User::create([\n    'name' => 'John',\n    'email' => 'john@example.com',\n]);\n```\n\n⚠️ **Attention:**\n- Columns MUST be in `$fillable`\n- Auto-saves to database\n- Triggers: creating, created events"
    },
    {
        method: "update",
        category: "method",
        id: "**Fungsi:** Mengupdate record di database.\n\n**Kapan dipakai:** Untuk update record yang sudah ada.\n\n**Contoh penggunaan:**\n```php\n// Update single model\n$user = User::find(1);\n$user->update(['name' => 'Jane']);\n\n// Update multiple\nUser::where('status', 'inactive')\n    ->update(['status' => 'deleted']);\n\n// Returns number of affected rows\n$affected = User::where('status', 'old')\n    ->update(['status' => 'new']);\n```\n\n⚠️ **Perhatian:**\n- Kolom HARUS ada di `$fillable` untuk instance update\n- Bulk update tidak trigger model events\n- Returns affected rows count untuk bulk update",
        en: "**Function:** Updates a record in the database.\n\n**When to use:** To update existing records.\n\n**Example:**\n```php\n$user->update(['name' => 'Jane']);\n\n// Bulk update\nUser::where('status', 'inactive')\n    ->update(['status' => 'deleted']);\n```\n\n⚠️ **Attention:**\n- Columns MUST be in `$fillable` for instance update\n- Bulk update doesn't trigger model events"
    },
    {
        method: "delete",
        category: "method",
        id: "**Fungsi:** Menghapus record dari database.\n\n**Kapan dipakai:** Untuk delete record yang sudah ada.\n\n**Contoh penggunaan:**\n```php\n// Delete single model\n$user = User::find(1);\n$user->delete(); // Returns true/false\n\n// Delete multiple\nUser::where('status', 'inactive')->delete();\n\n// Returns number of affected rows\n$deleted = User::where('status', 'spam')->delete();\n```\n\n⚠️ **Perhatian:**\n- Permanent delete (kecuali pakai SoftDeletes)\n- Trigger model events: deleting, deleted\n- Returns true/false untuk instance, count untuk bulk",
        en: "**Function:** Deletes a record from the database.\n\n**When to use:** To delete existing records.\n\n**Example:**\n```php\n$user->delete(); // Returns true/false\n\n// Bulk delete\nUser::where('status', 'inactive')->delete();\n```\n\n⚠️ **Attention:**\n- Permanent delete (unless using SoftDeletes)\n- Triggers: deleting, deleted events"
    },
    {
        method: "find",
        category: "method",
        id: "**Fungsi:** Mencari record berdasarkan primary key.\n\n**Kapan dipakai:** Untuk get single record by ID.\n\n**Contoh penggunaan:**\n```php\n// Find by ID\n$user = User::find(1); // Returns User or null\n\n// Find with columns\n$user = User::find(1, ['id', 'name', 'email']);\n\n// Find or fail (Laravel 8+)\n$user = User::findOrFail(1); // Throws NotFoundHttpException\n\n// Find multiple\n$users = User::find([1, 2, 3]); // Returns Collection\n```\n\n⚠️ **Perhatian:**\n- Returns null jika tidak ditemukan\n- `findOrFail()` throw exception jika tidak ditemukan\n- Returns Collection untuk multiple IDs",
        en: "**Function:** Finds a record by primary key.\n\n**When to use:** To get a single record by ID.\n\n**Example:**\n```php\n$user = User::find(1); // Returns User or null\n$user = User::findOrFail(1); // Throws exception if not found\n```\n\n⚠️ **Attention:**\n- Returns null if not found\n- `findOrFail()` throws exception"
    },
    {
        method: "all",
        category: "method",
        id: "**Fungsi:** Mengambil semua records dari tabel.\n\n**Kapan dipakai:** Untuk get semua data (hati-hati dengan tabel besar!).\n\n**Contoh penggunaan:**\n```php\n// Get all\n$users = User::all(); // Returns Collection\n\n// Get specific columns\n$users = User::all(['id', 'name']);\n\n// With query builder\n$users = User::where('active', true)->all();\n```\n\n⚠️ **Perhatian:**\n- Returns Collection\n- Hati-hati dengan tabel besar!\n- Gunakan pagination untuk data banyak: `paginate()`",
        en: "**Function:** Retrieves all records from the table.\n\n**When to use:** To get all data (careful with large tables!).\n\n**Example:**\n```php\n$users = User::all(); // Returns Collection\n```\n\n⚠️ **Attention:**\n- Returns Collection\n- Be careful with large tables!\n- Use pagination: `paginate()`"
    },
    {
        method: "first",
        category: "method",
        id: "**Fungsi:** Mengambil record pertama dari hasil query.\n\n**Kapan dipakai:** Untuk get single record dari query.\n\n**Contoh penggunaan:**\n```php\n// First record\n$user = User::first();\n\n// First with condition\n$user = User::where('role', 'admin')->first();\n\n// First or fail (Laravel 8+)\n$user = User::where('email', $email)->firstOrFail();\n\n// First with columns\n$user = User::where('active', true)\n    ->first(['id', 'name']);\n```\n\n⚠️ **Perhatian:**\n- Returns single model atau null\n- `firstOrFail()` throw exception jika tidak ditemukan\n- Lebih efisien dari `get()[0]`",
        en: "**Function:** Gets the first record from query results.\n\n**When to use:** To get a single record from a query.\n\n**Example:**\n```php\n$user = User::first();\n$user = User::where('role', 'admin')->first();\n$user = User::where('email', $email)->firstOrFail();\n```\n\n⚠️ **Attention:**\n- Returns single model or null\n- `firstOrFail()` throws exception if not found"
    },
    {
        method: "get",
        category: "method",
        id: "**Fungsi:** Mengambil semua hasil query sebagai Collection.\n\n**Kapan dipakai:** Untuk execute query dan dapat results.\n\n**Contoh penggunaan:**\n```php\n// Get all with conditions\n$users = User::where('active', true)->get();\n\n// Get specific columns\n$users = User::where('active', true)\n    ->get(['id', 'name']);\n\n// With relationships\n$users = User::with('posts')->where('active', true)->get();\n\n// Map results\n$names = User::all()->pluck('name');\n```\n\n⚠️ **Perhatian:**\n- Returns Collection\n- Execute query saat dipanggil\n- Lazy collection untuk data besar: `cursor()`",
        en: "**Function:** Executes query and returns results as Collection.\n\n**When to use:** To execute query and get results.\n\n**Example:**\n```php\n$users = User::where('active', true)->get();\n```\n\n⚠️ **Attention:**\n- Returns Collection\n- Executes query when called"
    },
    {
        method: "paginate",
        category: "method",
        id: "**Fungsi:** Membagi hasil query menjadi halaman-halaman.\n\n**Kapan dipakai:** WAJIB untuk menampilkan data banyak di UI.\n\n**Contoh penggunaan:**\n```php\n// Simple paginate\n$users = User::paginate(15); // 15 per page\n\n// With where\n$users = User::where('active', true)->paginate(15);\n\n// With relationships\n$users = User::with('posts')->paginate(15);\n\n// Custom page name\n$users = User::paginate(15, ['*'], 'users');\n\n// In Blade:\n@foreach ($users as $user)\n    {{ $user->name }}\n@endforeach\n{{ $users->links() }} // Pagination links\n```\n\n⚠️ **Perhatian:**\n- Returns LengthAwarePaginator\n- Otomatis detect page dari query string\n- Gunakan `simplePaginate()` untuk next/prev only (lebih cepat)",
        en: "**Function:** Paginates query results into pages.\n\n**When to use:** REQUIRED for displaying large data in UI.\n\n**Example:**\n```php\n$users = User::paginate(15); // 15 per page\n\n// In Blade:\n@foreach ($users as $user)\n    {{ $user->name }}\n@endforeach\n{{ $users->links() }}\n```\n\n⚠️ **Attention:**\n- Returns LengthAwarePaginator\n- Auto-detects page from query string"
    },
    {
        method: "count",
        category: "method",
        id: "**Fungsi:** Menghitung jumlah records.\n\n**Kapan dipakai:** Untuk get total count tanpa load semua data.\n\n**Contoh penggunaan:**\n```php\n// Count all\n$count = User::count();\n\n// Count with condition\n$count = User::where('active', true)->count();\n\n// Count relationship\n$user = User::find(1);\n$postCount = $user->posts()->count();\n```\n\n⚠️ **Perhatian:**\n- Returns integer\n- Lebih efisien dari `all()->count()`\n- Untuk complex count, gunakan `DB::table()->count()`",
        en: "**Function:** Counts the number of records.\n\n**When to use:** To get total count without loading all data.\n\n**Example:**\n```php\n$count = User::count();\n$count = User::where('active', true)->count();\n```\n\n⚠️ **Attention:**\n- Returns integer\n- More efficient than `all()->count()`"
    },
    {
        method: "save",
        category: "method",
        id: "**Fungsi:** Menyimpan model ke database (create atau update).\n\n**Kapan dipakai:** Untuk save model yang sudah di-set attributenya.\n\n**Contoh penggunaan:**\n```php\n// Create new\n$user = new User();\n$user->name = 'John';\n$user->email = 'john@example.com';\n$user->save(); // Insert\n\n// Update existing\n$user = User::find(1);\n$user->name = 'Jane';\n$user->save(); // Update\n\n// Save returns true/false\nif ($user->save()) {\n    // Success\n}\n```\n\n⚠️ **Perhatian:**\n- Insert jika model baru, update jika existing\n- Trigger model events: saving, saved, creating/created, updating/updated\n- Returns true/false",
        en: "**Function:** Saves model to database (create or update).\n\n**When to use:** To save a model with set attributes.\n\n**Example:**\n```php\n// Create new\n$user = new User();\n$user->name = 'John';\n$user->save(); // Insert\n\n// Update existing\n$user->name = 'Jane';\n$user->save(); // Update\n```\n\n⚠️ **Attention:**\n- Insert if new, update if existing\n- Triggers model events"
    },
    {
        method: "refresh",
        category: "method",
        id: "**Fungsi:** Me-reload model dari database.\n\n**Kapan dipakai:** Saat kamu ingin refresh data model setelah ada perubahan di database.\n\n**Contoh penggunaan:**\n```php\n$user = User::find(1);\n// Another process updates user in database\n$user->refresh(); // Reload from database\n\n// Access fresh data\n$user->name; // Updated value\n```\n\n⚠️ **Perhatian:**\n- Reload semua atribut dari database\n- Override local changes\n- Returns the model instance",
        en: "**Function:** Reloads the model from the database.\n\n**When to use:** When you want to refresh model data after database changes.\n\n**Example:**\n```php\n$user->refresh(); // Reload from database\n```\n\n⚠️ **Attention:**\n- Reloads all attributes from database\n- Overrides local changes"
    },
    {
        method: "fresh",
        category: "method",
        id: "**Fungsi:** Mengambil ulang model dari database dengan relationships.\n\n**Kapan dipakai:** Saat kamu ingin fresh copy model dengan eager loading.\n\n**Contoh penggunaan:**\n```php\n$user = User::find(1);\n// Another process updates user\n\n$freshUser = $user->fresh(); // Fresh copy\n$freshUser = $user->fresh(['posts']); // With relationships\n\n// Original still has old data\n$user->name; // Old value\n$freshUser->name; // New value\n```\n\n⚠️ **Perhatian:**\n- Returns NEW instance, tidak modify original\n- Bisa load relationships\n- Returns null jika model sudah di-delete",
        en: "**Function:** Fetches fresh model copy from database with relationships.\n\n**When to use:** When you want a fresh model copy with eager loading.\n\n**Example:**\n```php\n$freshUser = $user->fresh(); // Fresh copy\n$freshUser = $user->fresh(['posts']); // With relationships\n```\n\n⚠️ **Attention:**\n- Returns NEW instance, doesn't modify original"
    },
    {
        method: "replicate",
        category: "method",
        id: "**Fungsi:** Membuat copy dari model.\n\n**Kapan dipakai:** Saat kamu ingin duplicate record dengan data yang sama.\n\n**Contoh penggunaan:**\n```php\n$user = User::find(1);\n$newUser = $user->replicate();\n$newUser->email = 'new@example.com';\n$newUser->save(); // New record\n\n// Exclude attributes\n$newUser = $user->replicate(['email', 'created_at']);\n```\n\n⚠️ **Perhatian:**\n- Tidak include primary key\n- Tidak include timestamps\n- Harus save() manual\n- Array parameter = attributes to exclude",
        en: "**Function:** Creates a copy of the model.\n\n**When to use:** When you want to duplicate a record.\n\n**Example:**\n```php\n$newUser = $user->replicate();\n$newUser->email = 'new@example.com';\n$newUser->save(); // New record\n```\n\n⚠️ **Attention:**\n- Doesn't include primary key\n- Doesn't include timestamps\n- Must save() manually"
    },
    {
        method: "touch",
        category: "method",
        id: "**Fungsi:** Mengupdate updated_at timestamp tanpa mengubah data lain.\n\n**Kapan dipakai:** Saat kamu ingin update timestamp tanpa modify data.\n\n**Contoh penggunaan:**\n```php\n$user->touch(); // Update updated_at to now\n\n// Touch with custom timestamp\n$user->touch('last_login_at');\n\n// Touch parent relationship\n$comment = Comment::find(1);\n$comment->post()->touch(); // Update post's updated_at\n```\n\n⚠️ **Perhatian:**\n- Hanya update updated_at (atau custom column)\n- Tidak trigger updating/updated events\n- Returns true/false",
        en: "**Function:** Updates updated_at timestamp without changing other data.\n\n**When to use:** When you want to update timestamp without modifying data.\n\n**Example:**\n```php\n$user->touch(); // Update updated_at to now\n```\n\n⚠️ **Attention:**\n- Only updates updated_at (or custom column)\n- Doesn't trigger updating/updated events"
    },
    {
        method: "increment",
        category: "method",
        id: "**Fungsi:** Menambah nilai kolom numerik.\n\n**Kapan dipakai:** Untuk increment counter seperti views, likes, dll.\n\n**Contoh penggunaan:**\n```php\n// Increment by 1\n$post->increment('views');\n\n// Increment by specific amount\n$post->increment('views', 5);\n\n// Increment with additional updates\n$post->increment('views', 1, [\n    'last_viewed_at' => now(),\n]);\n```\n\n⚠️ **Perhatian:**\n- Atomic operation (thread-safe)\n- Tidak trigger model events\n- Returns number of affected rows",
        en: "**Function:** Increments a numeric column value.\n\n**When to use:** To increment counters like views, likes, etc.\n\n**Example:**\n```php\n$post->increment('views'); // +1\n$post->increment('views', 5); // +5\n```\n\n⚠️ **Attention:**\n- Atomic operation (thread-safe)\n- Doesn't trigger model events"
    },
    {
        method: "decrement",
        category: "method",
        id: "**Fungsi:** Mengurangi nilai kolom numerik.\n\n**Kapan dipakai:** Untuk decrement counter seperti stock, credits, dll.\n\n**Contoh penggunaan:**\n```php\n// Decrement by 1\n$product->decrement('stock');\n\n// Decrement by specific amount\n$product->decrement('stock', 3);\n\n// Decrement with additional updates\n$product->decrement('stock', 1, [\n    'last_sold_at' => now(),\n]);\n```\n\n⚠️ **Perhatian:**\n- Atomic operation (thread-safe)\n- Tidak trigger model events\n- Returns number of affected rows",
        en: "**Function:** Decrements a numeric column value.\n\n**When to use:** To decrement counters like stock, credits, etc.\n\n**Example:**\n```php\n$product->decrement('stock'); // -1\n$product->decrement('stock', 3); // -3\n```\n\n⚠️ **Attention:**\n- Atomic operation (thread-safe)\n- Doesn't trigger model events"
    },
    {
        method: "isDirty",
        category: "method",
        id: "**Fungsi:** Cek apakah model memiliki perubahan yang belum saved.\n\n**Kapan dipakai:** Untuk check jika ada atribut yang berubah sejak fetch dari database.\n\n**Contoh penggunaan:**\n```php\n$user = User::find(1);\n$user->isDirty(); // false\n\n$user->name = 'New Name';\n$user->isDirty(); // true\n$user->isDirty('name'); // true\n$user->isDirty('email'); // false\n\n// Get dirty attributes\n$user->getDirty(); // ['name' => 'New Name']\n```\n\n⚠️ **Perhatian:**\n- Returns true jika ada perubahan\n- Bisa check specific attribute\n- Returns false setelah save()",
        en: "**Function:** Checks if model has unsaved changes.\n\n**When to use:** To check if attributes changed since fetching from database.\n\n**Example:**\n```php\n$user->name = 'New Name';\n$user->isDirty(); // true\n$user->isDirty('name'); // true\n```\n\n⚠️ **Attention:**\n- Returns true if there are changes\n- Can check specific attribute"
    },
    {
        method: "isClean",
        category: "method",
        id: "**Fungsi:** Kebalikan dari isDirty - cek apakah model tidak ada perubahan.\n\n**Kapan dipakai:** Untuk check jika tidak ada atribut yang berubah.\n\n**Contoh penggunaan:**\n```php\n$user = User::find(1);\n$user->isClean(); // true\n\n$user->name = 'New Name';\n$user->isClean(); // false\n$user->isClean('email'); // true (email tidak berubah)\n```\n\n⚠️ **Perhatian:**\n- Kebalikan dari isDirty\n- Returns true jika tidak ada perubahan\n- Returns true setelah save()",
        en: "**Function:** Opposite of isDirty - checks if model has no changes.\n\n**When to use:** To check if no attributes have changed.\n\n**Example:**\n```php\n$user->isClean(); // true if no changes\n```\n\n⚠️ **Attention:**\n- Opposite of isDirty"
    },
    {
        method: "wasChanged",
        category: "method",
        id: "**Fungsi:** Cek apakah atribut berubah saat last save operation.\n\n**Kapan dipakai:** Untuk check jika atribut benar-benar berubah setelah save.\n\n**Contoh penggunaan:**\n```php\n$user = User::find(1);\n$user->name = 'Same Name'; // Actually same value\n$user->save();\n$user->wasChanged('name'); // false (value sama)\n\n$user->email = 'new@example.com';\n$user->save();\n$user->wasChanged('email'); // true (value berubah)\n\n// Get all changed attributes\n$user->getChanges(); // ['email' => 'new@example.com']\n```\n\n⚠️ **Perhatian:**\n- Check perubahan setelah save()\n- Returns false jika value sama\n- Berguna untuk conditional logic setelah update",
        en: "**Function:** Checks if attribute changed during last save operation.\n\n**When to use:** To check if attribute actually changed after save.\n\n**Example:**\n```php\n$user->email = 'new@example.com';\n$user->save();\n$user->wasChanged('email'); // true\n```\n\n⚠️ **Attention:**\n- Checks changes after save()\n- Returns false if value is same"
    },
    {
        method: "toArray",
        category: "method",
        id: "**Fungsi:** Mengconvert model ke array.\n\n**Kapan dipakai:** Untuk serialisasi model ke array (untuk JSON, API, dll).\n\n**Contoh penggunaan:**\n```php\n$user = User::find(1);\n$array = $user->toArray();\n\n// Includes:\n// - All attributes\n// - Appended accessors ($appends)\n// - Relationships (if loaded)\n// - Excludes hidden attributes ($hidden)\n\n// Custom array\n$array = $user->only(['id', 'name'])->toArray();\n$array = $user->except(['password'])->toArray();\n```\n\n⚠️ **Perhatian:**\n- Includes relationships jika loaded\n- Excludes hidden attributes\n- Recursive (nested models juga di-convert)",
        en: "**Function:** Converts model to array.\n\n**When to use:** To serialize model to array (for JSON, API, etc).\n\n**Example:**\n```php\n$array = $user->toArray();\n```\n\n⚠️ **Attention:**\n- Includes relationships if loaded\n- Excludes hidden attributes"
    },
    {
        method: "toJson",
        category: "method",
        id: "**Fungsi:** Mengconvert model ke JSON string.\n\n**Kapan dipakai:** Untuk serialisasi model ke JSON (API responses, storage, dll).\n\n**Contoh penggunaan:**\n```php\n$user = User::find(1);\n$json = $user->toJson(); // JSON string\n$json = $user->toJson(JSON_PRETTY_PRINT); // Formatted\n\n// Returns:\n// {\"id\":1,\"name\":\"John\",\"email\":\"john@example.com\"}\n\n// Auto-convert di controller\nreturn response()->json($user); // Same as $user->toJson()\n```\n\n⚠️ **Perhatian:**\n- Calls toArray() internally\n- Same rules apply (hidden, appends, etc)\n- Laravel auto-convert models in JSON responses",
        en: "**Function:** Converts model to JSON string.\n\n**When to use:** To serialize model to JSON (API responses, storage, etc).\n\n**Example:**\n```php\n$json = $user->toJson(); // JSON string\n$json = $user->toJson(JSON_PRETTY_PRINT); // Formatted\n```\n\n⚠️ **Attention:**\n- Calls toArray() internally\n- Same rules apply (hidden, appends, etc)"
    },
    {
        method: "with",
        category: "method",
        id: "**Fungsi:** Eager load relationships untuk menghindari N+1 query problem.\n\n**Kapan dipakai:** WAJIB saat akses relationships untuk performa.\n\n**Contoh penggunaan:**\n```php\n// BAD: N+1 query problem\n$users = User::all();\nforeach ($users as $user) {\n    echo $user->posts->count(); // Query per user!\n}\n\n// GOOD: Eager loading\n$users = User::with('posts')->get();\nforeach ($users as $user) {\n    echo $user->posts->count(); // No additional queries!\n}\n\n// Multiple relationships\n$users = User::with(['posts', 'comments', 'roles'])->get();\n\n// Nested relationships\n$users = User::with('posts.comments')->get();\n\n// Constrained eager loading\n$users = User::with(['posts' => function ($query) {\n    $query->where('published', true);\n}])->get();\n```\n\n⚠️ **Perhatian:**\n- Mencegah N+1 query problem\n- Load relationships di awal\n- Bisa load nested: `with('posts.comments.user')`\n- Bisa constraint: `with(['posts' => fn($q) => $q->published()])`",
        en: "**Function:** Eager loads relationships to avoid N+1 query problem.\n\n**When to use:** REQUIRED when accessing relationships for performance.\n\n**Example:**\n```php\n// GOOD: Eager loading\n$users = User::with('posts')->get();\nforeach ($users as $user) {\n    echo $user->posts->count(); // No additional queries!\n}\n\n// Multiple relationships\n$users = User::with(['posts', 'comments'])->get();\n```\n\n⚠️ **Attention:**\n- Prevents N+1 query problem\n- Load relationships upfront"
    },
    {
        method: "load",
        category: "method",
        id: "**Fungsi:** Lazy eager load relationships ke model yang sudah loaded.\n\n**Kapan dipakai:** Saat kamu sudah punya model/collection dan ingin load relationships.\n\n**Contoh penggunaan:**\n```php\n// Load to single model\n$user = User::find(1);\n$user->load('posts');\n$user->load(['comments', 'roles']);\n\n// Load to collection\n$users = User::all();\n$users->load('posts');\n\n// Load with constraints\n$user->load(['posts' => function ($query) {\n    $query->where('published', true);\n}]);\n\n// Load missing (Laravel 9+)\n$user->loadMissing('posts'); // Only if not already loaded\n```\n\n⚠️ **Perhatian:**\n- Untuk model/collection yang sudah loaded\n- Lebih efisien dari akses langsung jika belum load\n- `loadMissing()` hanya load jika belum loaded",
        en: "**Function:** Lazy eager loads relationships to already loaded models.\n\n**When to use:** When you already have models and want to load relationships.\n\n**Example:**\n```php\n$user = User::find(1);\n$user->load('posts');\n\n$users = User::all();\n$users->load('posts');\n```\n\n⚠️ **Attention:**\n- For already loaded models/collections\n- `loadMissing()` only loads if not already loaded"
    },
    {
        method: "has",
        category: "method",
        id: "**Fungsi:** Filter model yang punya relationship.\n\n**Kapan dipakai:** Untuk query model yang memiliki related records.\n\n**Contoh penggunaan:**\n```php\n// Users that have posts\n$users = User::has('posts')->get();\n\n// Users with more than 5 posts\n$users = User::has('posts', '>', 5)->get();\n\n// Multiple conditions\n$users = User::has('posts')\n    ->has('comments')\n    ->get();\n\n// Or condition\n$users = User::has('posts')->orHas('comments')->get();\n```\n\n⚠️ **Perhatian:**\n- Menggunakan WHERE EXISTS query\n- Lebih efisien dari load + filter\n- Default operator: '>=', default count: 1",
        en: "**Function:** Filters models that have a relationship.\n\n**When to use:** To query models that have related records.\n\n**Example:**\n```php\n// Users that have posts\n$users = User::has('posts')->get();\n\n// Users with more than 5 posts\n$users = User::has('posts', '>', 5)->get();\n```\n\n⚠️ **Attention:**\n- Uses WHERE EXISTS query\n- More efficient than load + filter"
    },
    {
        method: "whereHas",
        category: "method",
        id: "**Fungsi:** Filter model dengan kondisi pada relationship.\n\n**Kapan dipakai:** Untuk query model dengan kondisi spesifik di relationship.\n\n**Contoh penggunaan:**\n```php\n// Users with published posts\n$users = User::whereHas('posts', function ($query) {\n    $query->where('published', true);\n})->get();\n\n// Users with posts in specific category\n$users = User::whereHas('posts', function ($query) use ($categoryId) {\n    $query->where('category_id', $categoryId);\n})->get();\n\n// Nested whereHas\n$users = User::whereHas('posts', function ($query) {\n    $query->whereHas('comments', function ($q) {\n        $q->where('approved', true);\n    });\n})->get();\n```\n\n⚠️ **Perhatian:**\n- Menggunakan WHERE EXISTS dengan kondisi\n- Closure untuk kondisi di related model\n- Bisa nested untuk deep relationships",
        en: "**Function:** Filters models with conditions on relationship.\n\n**When to use:** To query models with specific conditions on relationships.\n\n**Example:**\n```php\n// Users with published posts\n$users = User::whereHas('posts', function ($query) {\n    $query->where('published', true);\n})->get();\n```\n\n⚠️ **Attention:**\n- Uses WHERE EXISTS with conditions\n- Closure for conditions on related model"
    },
    {
        method: "doesntHave",
        category: "method",
        id: "**Fungsi:** Filter model yang TIDAK punya relationship.\n\n**Kapan dipakai:** Untuk query model yang tidak memiliki related records.\n\n**Contoh penggunaan:**\n```php\n// Users without posts\n$users = User::doesntHave('posts')->get();\n\n// Posts without comments\n$posts = Post::doesntHave('comments')->get();\n```\n\n⚠️ **Perhatian:**\n- Kebalikan dari has()\n- Menggunakan WHERE NOT EXISTS\n- Lebih efisien dari load + filter",
        en: "**Function:** Filters models that DON'T have a relationship.\n\n**When to use:** To query models without related records.\n\n**Example:**\n```php\n// Users without posts\n$users = User::doesntHave('posts')->get();\n```\n\n⚠️ **Attention:**\n- Opposite of has()\n- Uses WHERE NOT EXISTS"
    },
    {
        method: "whereDoesntHave",
        category: "method",
        id: "**Fungsi:** Filter model yang TIDAK punya relationship dengan kondisi.\n\n**Kapan dipakai:** Untuk query model yang tidak memiliki related records dengan kondisi spesifik.\n\n**Contoh penggunaan:**\n```php\n// Users without published posts\n$users = User::whereDoesntHave('posts', function ($query) {\n    $query->where('published', true);\n})->get();\n\n// Posts without approved comments\n$posts = Post::whereDoesntHave('comments', function ($query) {\n    $query->where('approved', true);\n})->get();\n```\n\n⚠️ **Perhatian:**\n- Kebalikan dari whereHas()\n- Menggunakan WHERE NOT EXISTS dengan kondisi\n- Closure untuk kondisi di related model",
        en: "**Function:** Filters models that DON'T have a relationship with conditions.\n\n**When to use:** To query models without related records matching conditions.\n\n**Example:**\n```php\n// Users without published posts\n$users = User::whereDoesntHave('posts', function ($query) {\n    $query->where('published', true);\n})->get();\n```\n\n⚠️ **Attention:**\n- Opposite of whereHas()\n- Uses WHERE NOT EXISTS with conditions"
    },
];
/**
 * Mencari penjelasan untuk method model tertentu
 * @param keyword Keyword yang dicari
 * @param lang Bahasa ('id' atau 'en')
 * @returns Penjelasan method atau null jika tidak ditemukan
 */
const getModelHover = (keyword, lang) => {
    const lowerKeyword = keyword.toLowerCase();
    const match = exports.modelData.find(d => {
        // Match exact method name
        if (d.method.toLowerCase() === lowerKeyword)
            return true;
        // Match keyword contains method (handle $fillable, $guarded, etc)
        const cleanMethod = d.method.replace('$', '');
        const cleanKeyword = lowerKeyword.replace('$', '');
        if (cleanKeyword.includes(cleanMethod) || cleanMethod.includes(cleanKeyword))
            return true;
        // Match aliases
        if (d.aliases?.some(alias => alias.toLowerCase() === lowerKeyword ||
            lowerKeyword.includes(alias.toLowerCase())))
            return true;
        return false;
    });
    if (match) {
        const content = lang === 'id' ? match.id : match.en;
        return `🔧 **${match.method}**\n\n${content}`;
    }
    return null;
};
exports.getModelHover = getModelHover;
//# sourceMappingURL=model.js.map