/**
 * Data method untuk Laravel Migration
 * Berisi 50+ method Schema dan Blueprint dengan penjelasan detail
 */

export interface MigrationMethod {
  method: string;
  aliases?: string[];
  category: 'schema' | 'blueprint' | 'column' | 'index' | 'foreign';
  id: string;
  en: string;
}

export const migrationData: MigrationMethod[] = [
  // ============================================
  // SCHEMA FACADE METHODS
  // ============================================
  {
    method: "Schema::create",
    category: "schema",
    id: "**Fungsi:** Membuat tabel baru di database.\n\n**Kapan dipakai:** Saat kamu membuat entitas baru di aplikasi Laravel, misalnya User, Post, Product, dll.\n\n**Contoh penggunaan:**\n```php\nuse Illuminate\\Support\\Facades\\Schema;\nuse Illuminate\\Database\\Schema\\Blueprint;\n\nSchema::create('users', function (Blueprint $table) {\n    $table->id();\n    $table->string('name');\n    $table->string('email')->unique();\n    $table->timestamp('email_verified_at')->nullable();\n    $table->string('password');\n    $table->rememberToken();\n    $table->timestamps();\n});\n```\n\n⚠️ **Perhatian:**\n- Nama tabel HARUS snake_case dan plural (contoh: 'blog_posts', BUKAN 'BlogPosts' atau 'post')\n- Selalu sertakan `$table->id()` sebagai primary key\n- Jangan lupa `$table->timestamps()` kecuali memang disengaja tidak mau tracking waktu",
    en: "**Function:** Creates a new database table.\n\n**When to use:** When creating a new entity in your Laravel application (User, Post, Product, etc.).\n\n**Example:**\n```php\nSchema::create('users', function (Blueprint $table) {\n    $table->id();\n    $table->string('name');\n    $table->timestamps();\n});\n```\n\n⚠️ **Attention:**\n- Table name MUST be snake_case and plural\n- Always include `$table->id()` as primary key\n- Don't forget `$table->timestamps()`"
  },
  {
    method: "Schema::table",
    category: "schema",
    id: "**Fungsi:** Memodifikasi tabel yang sudah ada.\n\n**Kapan dipakai:** Saat kamu ingin menambah, mengubah, atau menghapus kolom di tabel yang sudah ada.\n\n**Contoh penggunaan:**\n```php\nSchema::table('users', function (Blueprint $table) {\n    // Tambah kolom baru\n    $table->string('phone')->nullable();\n    \n    // Ubah kolom existing\n    $table->string('email')->unique()->change();\n    \n    // Hapus kolom\n    $table->dropColumn('nickname');\n});\n```\n\n⚠️ **Perhatian:**\n- Untuk modify column, pastikan driver database support (MySQL perlu doctrine/dbal di Laravel < 9)\n- Backup data sebelum modify production database",
    en: "**Function:** Modifies an existing table.\n\n**When to use:** When you want to add, change, or drop columns on an existing table.\n\n**Example:**\n```php\nSchema::table('users', function (Blueprint $table) {\n    $table->string('phone')->nullable();\n});\n```\n\n⚠️ **Attention:**\n- Modifying columns requires database driver support\n- Backup data before modifying production database"
  },
  {
    method: "Schema::drop",
    category: "schema",
    id: "**Fungsi:** Menghapus tabel dari database.\n\n**Kapan dipakai:** Saat kamu ingin menghapus tabel yang tidak dipakai lagi.\n\n**Contoh penggunaan:**\n```php\n// Drop table\nSchema::drop('users');\n\n// Drop if exists (Laravel 8+)\nSchema::dropIfExists('users');\n```\n\n⚠️ **Perhatian:**\n- Data akan HILANG PERMANEN!\n- Pastikan tidak ada foreign key yang mereferensi tabel ini\n- Gunakan dropIfExists untuk safety",
    en: "**Function:** Drops a table from the database.\n\n**When to use:** When you want to remove a table that's no longer needed.\n\n**Example:**\n```php\nSchema::dropIfExists('users');\n```\n\n⚠️ **Attention:**\n- Data will be PERMANENTLY LOST!\n- Ensure no foreign keys reference this table"
  },
  {
    method: "Schema::rename",
    category: "schema",
    id: "**Fungsi:** Mengganti nama tabel.\n\n**Kapan dipakai:** Saat kamu perlu rename tabel karena perubahan naming convention.\n\n**Contoh penggunaan:**\n```php\nSchema::rename('users', 'members');\n```\n\n⚠️ **Perhatian:**\n- Foreign keys tidak otomatis ikut rename\n- Update semua reference ke tabel ini di code",
    en: "**Function:** Renames a table.\n\n**When to use:** When you need to rename a table due to naming convention changes.\n\n**Example:**\n```php\nSchema::rename('users', 'members');\n```\n\n⚠️ **Attention:**\n- Foreign keys don't auto-rename\n- Update all references in your code"
  },
  {
    method: "Schema::hasTable",
    category: "schema",
    id: "**Fungsi:** Cek apakah tabel ada di database.\n\n**Kapan dipakai:** Saat kamu perlu validasi sebelum operasi tertentu.\n\n**Contoh penggunaan:**\n```php\nif (Schema::hasTable('users')) {\n    // Tabel ada, lakukan sesuatu\n}\n```\n\n⚠️ **Perhatian:**\n- Berguna untuk conditional migration\n- Tidak untuk production logic (gunakan model instead)",
    en: "**Function:** Checks if a table exists in the database.\n\n**When to use:** When you need validation before certain operations.\n\n**Example:**\n```php\nif (Schema::hasTable('users')) {\n    // Table exists\n}\n```"
  },
  {
    method: "Schema::hasColumn",
    category: "schema",
    id: "**Fungsi:** Cek apakah kolom ada di tabel.\n\n**Kapan dipakai:** Saat kamu perlu validasi struktur tabel.\n\n**Contoh penggunaan:**\n```php\nif (Schema::hasColumn('users', 'email')) {\n    // Kolom ada\n}\n```\n\n⚠️ **Perhatian:**\n- Berguna untuk conditional migration\n- Tidak untuk production logic (gunakan model instead)",
    en: "**Function:** Checks if a column exists in a table.\n\n**When to use:** When you need to validate table structure.\n\n**Example:**\n```php\nif (Schema::hasColumn('users', 'email')) {\n    // Column exists\n}\n```"
  },
  
  // ============================================
  // PRIMARY KEY & AUTO INCREMENT
  // ============================================
  {
    method: "id",
    aliases: ["increments"],
    category: "column",
    id: "**Fungsi:** Membuat primary key auto-increment.\n\n**Kapan dipakai:** SELALU gunakan ini di setiap tabel untuk identifikasi unik record.\n\n**Contoh penggunaan:**\n```php\n$table->id(); // BIGINT UNSIGNED (Laravel 7+)\n// atau\n$table->increments('id'); // INT UNSIGNED (legacy)\n```\n\n⚠️ **Perhatian:**\n- `$table->id()` = BIGINT (sampai 18 quintillion records)\n- `$table->increments()` = INT (sampai 4 billion records)\n- Gunakan `id()` untuk aplikasi modern",
    en: "**Function:** Creates an auto-incrementing primary key.\n\n**When to use:** ALWAYS use this in every table for unique record identification.\n\n**Example:**\n```php\n$table->id(); // BIGINT UNSIGNED (Laravel 7+)\n```\n\n⚠️ **Attention:**\n- `$table->id()` = BIGINT (up to 18 quintillion records)\n- Use `id()` for modern applications"
  },
  {
    method: "bigIncrements",
    category: "column",
    id: "**Fungsi:** Membuat kolom auto-increment BIGINT (tanpa primary key).\n\n**Kapan dipakai:** Saat kamu butuh auto-increment BIGINT tapi bukan sebagai primary key.\n\n**Contoh penggunaan:**\n```php\n$table->bigIncrements('sequence_number');\n```\n\n⚠️ **Perhatian:**\n- Tidak otomatis jadi primary key\n- Tambahkan manual jika perlu: `->primary()`",
    en: "**Function:** Creates a BIGINT auto-increment column (without primary key).\n\n**When to use:** When you need BIGINT auto-increment but not as primary key.\n\n**Example:**\n```php\n$table->bigIncrements('sequence_number');\n```"
  },
  {
    method: "primary",
    category: "index",
    id: "**Fungsi:** Menambahkan primary key ke kolom.\n\n**Kapan dipakai:** Saat kamu perlu composite primary key (lebih dari 1 kolom).\n\n**Contoh penggunaan:**\n```php\n// Single column\n$table->primary('id');\n\n// Composite key\n$table->primary(['user_id', 'role_id']);\n```\n\n⚠️ **Perhatian:**\n- Tabel hanya boleh punya 1 primary key\n- Composite key untuk pivot tables",
    en: "**Function:** Adds a primary key to columns.\n\n**When to use:** When you need composite primary key (multiple columns).\n\n**Example:**\n```php\n$table->primary(['user_id', 'role_id']);\n```"
  },
  
  // ============================================
  // STRING & TEXT COLUMNS
  // ============================================
  {
    method: "string",
    category: "column",
    id: "**Fungsi:** Membuat kolom VARCHAR(255).\n\n**Kapan dipakai:** Untuk teks pendek seperti nama, email, title, slug, dll.\n\n**Contoh penggunaan:**\n```php\n$table->string('name'); // VARCHAR(255)\n$table->string('email', 100); // VARCHAR(100)\n$table->string('name')->unique();\n$table->string('name')->nullable();\n```\n\n⚠️ **Perhatian:**\n- Default length 255 karakter\n- Untuk teks lebih panjang, gunakan `text()`\n- Gunakan `->unique()` untuk nilai unik",
    en: "**Function:** Creates a VARCHAR(255) column.\n\n**When to use:** For short text like names, emails, titles, slugs, etc.\n\n**Example:**\n```php\n$table->string('name'); // VARCHAR(255)\n$table->string('email', 100); // VARCHAR(100)\n```\n\n⚠️ **Attention:**\n- Default length is 255 characters\n- Use `text()` for longer content"
  },
  {
    method: "text",
    category: "column",
    id: "**Fungsi:** Membuat kolom TEXT untuk konten panjang.\n\n**Kapan dipakai:** Untuk artikel, deskripsi, konten blog, komentar, dll.\n\n**Contoh penggunaan:**\n```php\n$table->text('description');\n$table->text('content')->nullable();\n```\n\n⚠️ **Perhatian:**\n- TEDIUMTEXT di MySQL (16MB max)\n- Tidak bisa pakai `->change()` di beberapa database\n- Untuk sangat besar, gunakan `longText()`",
    en: "**Function:** Creates a TEXT column for long content.\n\n**When to use:** For articles, descriptions, blog content, comments, etc.\n\n**Example:**\n```php\n$table->text('description');\n```\n\n⚠️ **Attention:**\n- MEDIUMTEXT in MySQL (16MB max)\n- Use `longText()` for very large content"
  },
  {
    method: "longText",
    category: "column",
    id: "**Fungsi:** Membuat kolom LONGTEXT untuk konten sangat besar.\n\n**Kapan dipakai:** Untuk konten yang bisa sangat panjang seperti log, JSON besar, dll.\n\n**Contoh penggunaan:**\n```php\n$table->longText('content');\n```\n\n⚠️ **Perhatian:**\n- LONGTEXT di MySQL (4GB max)\n- Pertimbangkan storage terpisah untuk file besar",
    en: "**Function:** Creates a LONGTEXT column for very large content.\n\n**When to use:** For content that can be very large like logs, large JSON, etc.\n\n**Example:**\n```php\n$table->longText('content');\n```"
  },
  {
    method: "char",
    category: "column",
    id: "**Fungsi:** Membuat kolom CHAR dengan panjang fixed.\n\n**Kapan dipakai:** Untuk data dengan panjang tetap seperti kode pos, phone code, UUID, dll.\n\n**Contoh penggunaan:**\n```php\n$table->char('country_code', 2); // ID, US, SG\n$table->char('phone', 12); // +6281234567\n```\n\n⚠️ **Perhatian:**\n- CHAR lebih cepat dari VARCHAR untuk data fixed-length\n- Padding otomatis jika data lebih pendek",
    en: "**Function:** Creates a CHAR column with fixed length.\n\n**When to use:** For fixed-length data like postal codes, phone codes, UUIDs, etc.\n\n**Example:**\n```php\n$table->char('country_code', 2);\n```"
  },
  {
    method: "binary",
    category: "column",
    id: "**Fungsi:** Membuat kolom BINARY untuk data biner.\n\n**Kapan dipakai:** Untuk menyimpan data biner seperti hash, encrypted data, dll.\n\n**Contoh penggunaan:**\n```php\n$table->binary('data');\n$table->binary('hash', 64);\n```\n\n⚠️ **Perhatian:**\n- Jangan gunakan untuk file besar (gunakan storage instead)\n- BLOB di MySQL",
    en: "**Function:** Creates a BINARY column for binary data.\n\n**When to use:** For storing binary data like hashes, encrypted data, etc.\n\n**Example:**\n```php\n$table->binary('data');\n```"
  },
  
  // ============================================
  // NUMERIC COLUMNS
  // ============================================
  {
    method: "integer",
    category: "column",
    id: "**Fungsi:** Membuat kolom INT.\n\n**Kapan dipakai:** Untuk angka bulat seperti quantity, age, count, dll.\n\n**Contoh penggunaan:**\n```php\n$table->integer('quantity');\n$table->integer('age')->unsigned();\n$table->integer('views')->default(0);\n```\n\n⚠️ **Perhatian:**\n- Range: -2,147,483,648 to 2,147,483,647\n- Gunakan `unsigned()` untuk angka selalu positif\n- Untuk ID, gunakan `foreignId()` atau `id()`",
    en: "**Function:** Creates an INT column.\n\n**When to use:** For whole numbers like quantity, age, count, etc.\n\n**Example:**\n```php\n$table->integer('quantity');\n$table->integer('age')->unsigned();\n```\n\n⚠️ **Attention:**\n- Range: -2,147,483,648 to 2,147,483,647\n- Use `unsigned()` for always-positive numbers"
  },
  {
    method: "bigInteger",
    category: "column",
    id: "**Fungsi:** Membuat kolom BIGINT.\n\n**Kapan dipakai:** Untuk angka sangat besar seperti view count, follower count, dll.\n\n**Contoh penggunaan:**\n```php\n$table->bigInteger('views')->default(0);\n$table->bigInteger('external_id')->unsigned();\n```\n\n⚠️ **Perhatian:**\n- Range: -9,223,372,036,854,775,808 to 9,223,372,036,854,775,807\n- Gunakan `unsigned()` untuk angka selalu positif",
    en: "**Function:** Creates a BIGINT column.\n\n**When to use:** For very large numbers like view counts, follower counts, etc.\n\n**Example:**\n```php\n$table->bigInteger('views')->default(0);\n```"
  },
  {
    method: "smallInteger",
    category: "column",
    id: "**Fungsi:** Membuat kolom SMALLINT.\n\n**Kapan dipakai:** Untuk angka kecil seperti status code, priority, rating (1-5), dll.\n\n**Contoh penggunaan:**\n```php\n$table->smallInteger('status')->default(1);\n$table->smallInteger('priority')->unsigned();\n```\n\n⚠️ **Perhatian:**\n- Range: -32,768 to 32,767\n- Hemat storage untuk kolom dengan nilai terbatas",
    en: "**Function:** Creates a SMALLINT column.\n\n**When to use:** For small numbers like status codes, priority, ratings (1-5), etc.\n\n**Example:**\n```php\n$table->smallInteger('status')->default(1);\n```"
  },
  {
    method: "tinyInteger",
    category: "column",
    id: "**Fungsi:** Membuat kolom TINYINT.\n\n**Kapan dipakai:** Untuk angka sangat kecil seperti boolean (0/1), flag, status sederhana.\n\n**Contoh penggunaan:**\n```php\n$table->tinyInteger('is_active')->default(1);\n$table->tinyInteger('verified');\n```\n\n⚠️ **Perhatian:**\n- Range: -128 to 127\n- Untuk boolean, lebih baik gunakan `boolean()`",
    en: "**Function:** Creates a TINYINT column.\n\n**When to use:** For very small numbers like booleans (0/1), flags, simple status.\n\n**Example:**\n```php\n$table->tinyInteger('is_active')->default(1);\n```"
  },
  {
    method: "float",
    category: "column",
    id: "**Fungsi:** Membuat kolom FLOAT untuk angka desimal.\n\n**Kapan dipakai:** Untuk angka dengan desimal yang tidak butuh presisi tinggi.\n\n**Contoh penggunaan:**\n```php\n$table->float('rating', 3, 2); // 999.99\n$table->float('latitude', 10, 8);\n```\n\n⚠️ **Perhatian:**\n- Format: `float(column, total_digits, decimal_places)`\n- Jangan gunakan untuk uang (presisi tidak akurat)\n- Untuk uang, gunakan `decimal()`",
    en: "**Function:** Creates a FLOAT column for decimal numbers.\n\n**When to use:** For decimal numbers that don't need high precision.\n\n**Example:**\n```php\n$table->float('rating', 3, 2); // 999.99\n```\n\n⚠️ **Attention:**\n- Don't use for money (precision not accurate)\n- Use `decimal()` for money"
  },
  {
    method: "double",
    category: "column",
    id: "**Fungsi:** Membuat kolom DOUBLE untuk angka desimal presisi ganda.\n\n**Kapan dipakai:** Untuk angka desimal yang butuh range lebih besar dari float.\n\n**Contoh penggunaan:**\n```php\n$table->double('coordinates', 15, 10);\n```\n\n⚠️ **Perhatian:**\n- Lebih besar dari float tapi tetap ada floating point error\n- Jangan gunakan untuk uang",
    en: "**Function:** Creates a DOUBLE column for double-precision decimal numbers.\n\n**When to use:** For decimal numbers needing larger range than float.\n\n**Example:**\n```php\n$table->double('coordinates', 15, 10);\n```"
  },
  {
    method: "decimal",
    category: "column",
    id: "**Fungsi:** Membuat kolom DECIMAL untuk angka dengan presisi exact.\n\n**Kapan dipakai:** WAJIB untuk uang, harga, saldo, dll yang butuh presisi exact.\n\n**Contoh penggunaan:**\n```php\n$table->decimal('price', 10, 2); // 99999999.99\n$table->decimal('balance', 15, 4); // 99999999999.9999\n```\n\n⚠️ **Perhatian:**\n- Format: `decimal(total_digits, decimal_places)`\n- SELALU gunakan untuk uang/harga\n- Tidak ada floating point error",
    en: "**Function:** Creates a DECIMAL column for exact-precision numbers.\n\n**When to use:** REQUIRED for money, prices, balances, etc. needing exact precision.\n\n**Example:**\n```php\n$table->decimal('price', 10, 2); // 99999999.99\n```\n\n⚠️ **Attention:**\n- ALWAYS use for money/prices\n- No floating point errors"
  },
  
  // ============================================
  // BOOLEAN & NULL
  // ============================================
  {
    method: "boolean",
    category: "column",
    id: "**Fungsi:** Membuat kolom BOOLEAN.\n\n**Kapan dipakai:** Untuk nilai true/false seperti is_active, is_verified, dll.\n\n**Contoh penggunaan:**\n```php\n$table->boolean('is_active')->default(true);\n$table->boolean('verified')->default(false);\n```\n\n⚠️ **Perhatian:**\n- TINYINT(1) di MySQL\n- Default null, selalu set `->default()`\n- Di PHP: `true` = 1, `false` = 0",
    en: "**Function:** Creates a BOOLEAN column.\n\n**When to use:** For true/false values like is_active, is_verified, etc.\n\n**Example:**\n```php\n$table->boolean('is_active')->default(true);\n```\n\n⚠️ **Attention:**\n- TINYINT(1) in MySQL\n- Always set `->default()`"
  },
  {
    method: "nullableTimestamps",
    category: "column",
    id: "**Fungsi:** Membuat kolom created_at dan updated_at yang nullable.\n\n**Kapan dipakai:** Saat timestamps opsional, misal untuk data import dari sistem lama.\n\n**Contoh penggunaan:**\n```php\n$table->nullableTimestamps();\n// Sama dengan:\n$table->timestamp('created_at')->nullable();\n$table->timestamp('updated_at')->nullable();\n```\n\n⚠️ **Perhatian:**\n- Laravel 8+: deprecated, gunakan `timestamps()` saja\n- Hanya untuk kasus khusus",
    en: "**Function:** Creates nullable created_at and updated_at columns.\n\n**When to use:** When timestamps are optional.\n\n**Example:**\n```php\n$table->nullableTimestamps();\n```\n\n⚠️ **Attention:**\n- Deprecated in Laravel 8+\n- Only for special cases"
  },
  
  // ============================================
  // DATE & TIME COLUMNS
  // ============================================
  {
    method: "date",
    category: "column",
    id: "**Fungsi:** Membuat kolom DATE.\n\n**Kapan dipakai:** Untuk tanggal tanpa waktu seperti birth_date, hire_date, dll.\n\n**Contoh penggunaan:**\n```php\n$table->date('birth_date');\n$table->date('start_date')->nullable();\n```\n\n⚠️ **Perhatian:**\n- Format: YYYY-MM-DD\n- Tidak ada time component\n- Di model, tambahkan ke `$casts = ['birth_date' => 'date']`",
    en: "**Function:** Creates a DATE column.\n\n**When to use:** For dates without time like birth_date, hire_date, etc.\n\n**Example:**\n```php\n$table->date('birth_date');\n```\n\n⚠️ **Attention:**\n- Format: YYYY-MM-DD\n- Add to model `$casts` for Carbon instance"
  },
  {
    method: "dateTime",
    category: "column",
    id: "**Fungsi:** Membuat kolom DATETIME.\n\n**Kapan dipakai:** Untuk tanggal + waktu seperti scheduled_at, published_at, dll.\n\n**Contoh penggunaan:**\n```php\n$table->dateTime('scheduled_at');\n$table->dateTime('published_at')->nullable();\n```\n\n⚠️ **Perhatian:**\n- Format: YYYY-MM-DD HH:MM:SS\n- Range: 1000-01-01 00:00:00 to 9999-12-31 23:59:59\n- Di model, tambahkan ke `$casts`",
    en: "**Function:** Creates a DATETIME column.\n\n**When to use:** For date + time like scheduled_at, published_at, etc.\n\n**Example:**\n```php\n$table->dateTime('scheduled_at');\n```\n\n⚠️ **Attention:**\n- Format: YYYY-MM-DD HH:MM:SS"
  },
  {
    method: "dateTimeTz",
    category: "column",
    id: "**Fungsi:** Membuat kolom DATETIME dengan timezone.\n\n**Kapan dipakai:** Untuk aplikasi multi-timezone yang butuh tracking timezone.\n\n**Contoh penggunaan:**\n```php\n$table->dateTimeTz('scheduled_at');\n```\n\n⚠️ **Perhatian:**\n- TIMESTAMPTZ di PostgreSQL\n- MySQL tidak support timezone, disimpan sebagai DATETIME biasa\n- Pertimbangkan simpan semua UTC + user timezone terpisah",
    en: "**Function:** Creates a DATETIME column with timezone.\n\n**When to use:** For multi-timezone applications needing timezone tracking.\n\n**Example:**\n```php\n$table->dateTimeTz('scheduled_at');\n```\n\n⚠️ **Attention:**\n- MySQL doesn't support timezone, stored as DATETIME"
  },
  {
    method: "timestamp",
    category: "column",
    id: "**Fungsi:** Membuat kolom TIMESTAMP.\n\n**Kapan dipakai:** Untuk tracking waktu event seperti email_verified_at, deleted_at, dll.\n\n**Contoh penggunaan:**\n```php\n$table->timestamp('email_verified_at')->nullable();\n$table->timestamp('last_login_at')->useCurrent();\n```\n\n⚠️ **Perhatian:**\n- Range: 1970-01-01 00:00:01 UTC to 2038-01-19 03:14:07 UTC (32-bit)\n- Gunakan `->useCurrent()` untuk default now()\n- Untuk soft delete, gunakan `softDeletes()`",
    en: "**Function:** Creates a TIMESTAMP column.\n\n**When to use:** For tracking event times like email_verified_at, deleted_at, etc.\n\n**Example:**\n```php\n$table->timestamp('email_verified_at')->nullable();\n$table->timestamp('last_login_at')->useCurrent();\n```\n\n⚠️ **Attention:**\n- Use `->useCurrent()` for default now()"
  },
  {
    method: "timestampTz",
    category: "column",
    id: "**Fungsi:** Membuat kolom TIMESTAMP dengan timezone.\n\n**Kapan dipakai:** Untuk aplikasi multi-timezone yang butuh tracking timezone akurat.\n\n**Contoh penggunaan:**\n```php\n$table->timestampTz('created_at')->useCurrent();\n```\n\n⚠️ **Perhatian:**\n- TIMESTAMPTZ di PostgreSQL\n- MySQL tidak support, disimpan sebagai TIMESTAMP biasa",
    en: "**Function:** Creates a TIMESTAMP column with timezone.\n\n**When to use:** For multi-timezone applications needing accurate timezone tracking.\n\n**Example:**\n```php\n$table->timestampTz('created_at')->useCurrent();\n```"
  },
  {
    method: "time",
    category: "column",
    id: "**Fungsi:** Membuat kolom TIME.\n\n**Kapan dipakai:** Untuk waktu tanpa tanggal seperti opening_time, closing_time, dll.\n\n**Contoh penggunaan:**\n```php\n$table->time('opening_time');\n$table->time('closing_time');\n```\n\n⚠️ **Perhatian:**\n- Format: HH:MM:SS\n- Range: -838:59:59 to 838:59:59\n- Tidak ada date component",
    en: "**Function:** Creates a TIME column.\n\n**When to use:** For time without date like opening_time, closing_time, etc.\n\n**Example:**\n```php\n$table->time('opening_time');\n```\n\n⚠️ **Attention:**\n- Format: HH:MM:SS\n- No date component"
  },
  {
    method: "year",
    category: "column",
    id: "**Fungsi:** Membuat kolom YEAR.\n\n**Kapan dipakai:** Untuk tahun saja seperti birth_year, publication_year, dll.\n\n**Contoh penggunaan:**\n```php\n$table->year('birth_year');\n$table->year('publication_year');\n```\n\n⚠️ **Perhatian:**\n- Format: YYYY\n- Range: 1901 to 2155\n- MySQL specific",
    en: "**Function:** Creates a YEAR column.\n\n**When to use:** For year only like birth_year, publication_year, etc.\n\n**Example:**\n```php\n$table->year('birth_year');\n```\n\n⚠️ **Attention:**\n- Format: YYYY\n- MySQL specific"
  },
  
  // ============================================
  // SPECIAL COLUMNS
  // ============================================
  {
    method: "json",
    category: "column",
    id: "**Fungsi:** Membuat kolom JSON.\n\n**Kapan dipakai:** Untuk menyimpan data terstruktur seperti settings, metadata, preferences, dll.\n\n**Contoh penggunaan:**\n```php\n$table->json('settings')->nullable();\n$table->json('metadata');\n\n// Query JSON (PostgreSQL/MySQL 5.7+)\n$users = DB::table('users')\n    ->where('settings->theme', 'dark')\n    ->get();\n```\n\n⚠️ **Perhatian:**\n- JSON valid di MySQL 5.7+, PostgreSQL, SQLite 3.9+\n- Di model, tambahkan ke `$casts = ['settings' => 'array']`\n- Jangan overuse, normalisasi jika data sering di-query",
    en: "**Function:** Creates a JSON column.\n\n**When to use:** For storing structured data like settings, metadata, preferences, etc.\n\n**Example:**\n```php\n$table->json('settings')->nullable();\n```\n\n⚠️ **Attention:**\n- Add to model `$casts = ['settings' => 'array']`\n- Don't overuse, normalize if data is frequently queried"
  },
  {
    method: "jsonb",
    category: "column",
    id: "**Fungsi:** Membuat kolom JSONB (binary JSON).\n\n**Kapan dipakai:** PostgreSQL only, untuk JSON dengan query performance lebih baik.\n\n**Contoh penggunaan:**\n```php\n$table->jsonb('settings');\n```\n\n⚠️ **Perhatian:**\n- PostgreSQL ONLY\n- Lebih cepat untuk query tapi lebih lambat untuk write\n- Support indexing",
    en: "**Function:** Creates a JSONB column (binary JSON).\n\n**When to use:** PostgreSQL only, for JSON with better query performance.\n\n**Example:**\n```php\n$table->jsonb('settings');\n```\n\n⚠️ **Attention:**\n- PostgreSQL ONLY\n- Faster queries, slower writes\n- Supports indexing"
  },
  {
    method: "uuid",
    category: "column",
    id: "**Fungsi:** Membuat kolom UUID.\n\n**Kapan dipakai:** Untuk primary key alternatif atau tracking identifier eksternal.\n\n**Contoh penggunaan:**\n```php\n$table->uuid('id')->primary(); // UUID sebagai PK\n$table->uuid('tracking_id')->unique();\n\n// Auto-generate (Laravel 9+)\n$table->uuid('id')->primary()->default(DB::raw('(UUID())'));\n```\n\n⚠️ **Perhatian:**\n- CHAR(36) di MySQL\n- Lebih besar dari BIGINT, impact performance\n- Gunakan untuk distributed systems atau public IDs",
    en: "**Function:** Creates a UUID column.\n\n**When to use:** For alternative primary key or external tracking identifier.\n\n**Example:**\n```php\n$table->uuid('id')->primary();\n```\n\n⚠️ **Attention:**\n- CHAR(36) in MySQL\n- Larger than BIGINT, performance impact\n- Use for distributed systems or public IDs"
  },
  {
    method: "ulid",
    category: "column",
    id: "**Fungsi:** Membuat kolom ULID (Universally Unique Lexicographically Sortable Identifier).\n\n**Kapan dipakai:** Alternatif UUID yang lebih pendek dan sortable.\n\n**Contoh penggunaan:**\n```php\n$table->ulid('id')->primary();\n```\n\n⚠️ **Perhatian:**\n- Laravel 10+\n- CHAR(26) - lebih pendek dari UUID\n- Lexicographically sortable\n- Format: timestamp + random",
    en: "**Function:** Creates a ULID column.\n\n**When to use:** UUID alternative that's shorter and sortable.\n\n**Example:**\n```php\n$table->ulid('id')->primary();\n```\n\n⚠️ **Attention:**\n- Laravel 10+\n- CHAR(26) - shorter than UUID\n- Lexicographically sortable"
  },
  {
    method: "ipAddress",
    category: "column",
    id: "**Fungsi:** Membuat kolom IP address.\n\n**Kapan dipakai:** Untuk tracking user IP, login logs, audit trails, dll.\n\n**Contoh penggunaan:**\n```php\n$table->ipAddress('last_login_ip');\n$table->ipAddress('created_from');\n```\n\n⚠️ **Perhatian:**\n- Support IPv4 dan IPv6\n- VARCHAR di database yang tidak support IP native",
    en: "**Function:** Creates an IP address column.\n\n**When to use:** For tracking user IP, login logs, audit trails, etc.\n\n**Example:**\n```php\n$table->ipAddress('last_login_ip');\n```\n\n⚠️ **Attention:**\n- Supports IPv4 and IPv6"
  },
  {
    method: "macAddress",
    category: "column",
    id: "**Fungsi:** Membuat kolom MAC address.\n\n**Kapan dipakai:** Untuk tracking device hardware, network devices, dll.\n\n**Contoh penggunaan:**\n```php\n$table->macAddress('device_mac');\n```\n\n⚠️ **Perhatian:**\n- Format: 00:1B:44:11:3A:B7\n- VARCHAR(17) di sebagian besar database",
    en: "**Function:** Creates a MAC address column.\n\n**When to use:** For tracking device hardware, network devices, etc.\n\n**Example:**\n```php\n$table->macAddress('device_mac');\n```\n\n⚠️ **Attention:**\n- Format: 00:1B:44:11:3A:B7"
  },
  {
    method: "rememberToken",
    category: "column",
    id: "**Fungsi:** Membuat kolom remember_token untuk fitur 'Remember Me'.\n\n**Kapan dipakai:** WAJIB untuk tabel users yang pakai fitur remember me authentication.\n\n**Contoh penggunaan:**\n```php\n$table->rememberToken();\n// Sama dengan:\n$table->string('remember_token', 100)->nullable();\n```\n\n⚠️ **Perhatian:**\n- Harus nullable\n- Laravel otomatis manage token ini\n- Ada di default migration users table",
    en: "**Function:** Creates a remember_token column for 'Remember Me' feature.\n\n**When to use:** REQUIRED for users table using remember me authentication.\n\n**Example:**\n```php\n$table->rememberToken();\n```\n\n⚠️ **Attention:**\n- Must be nullable\n- Laravel auto-manages this token"
  },
  {
    method: "softDeletes",
    category: "column",
    id: "**Fungsi:** Membuat kolom deleted_at untuk soft delete.\n\n**Kapan dipakai:** Saat kamu ingin 'hapus' data tapi tetap simpan di database (bisa di-restore).\n\n**Contoh penggunaan:**\n```php\n$table->softDeletes();\n// Sama dengan:\n$table->timestamp('deleted_at')->nullable();\n\n// Di model:\nclass User extends Model {\n    use SoftDeletes;\n}\n\n// Usage:\n$user->delete(); // Soft delete\n$user->restore(); // Restore\nUser::withTrashed()->get(); // Include deleted\n```\n\n⚠️ **Perhatian:**\n- Harus pakai `SoftDeletes` trait di model\n- Query default tidak include deleted records\n- Gunakan `withTrashed()` atau `onlyTrashed()` untuk include",
    en: "**Function:** Creates a deleted_at column for soft deletes.\n\n**When to use:** When you want to 'delete' data but keep it in database (can be restored).\n\n**Example:**\n```php\n$table->softDeletes();\n```\n\n⚠️ **Attention:**\n- Must use `SoftDeletes` trait in model\n- Default queries exclude deleted records"
  },
  {
    method: "softDeletesTz",
    category: "column",
    id: "**Fungsi:** Membuat kolom deleted_at dengan timezone support.\n\n**Kapan dipakai:** Sama seperti softDeletes tapi untuk aplikasi multi-timezone.\n\n**Contoh penggunaan:**\n```php\n$table->softDeletesTz();\n```\n\n⚠️ **Perhatian:**\n- Sama seperti softDeletes tapi dengan timezone\n- MySQL tidak support timezone",
    en: "**Function:** Creates a deleted_at column with timezone support.\n\n**When to use:** Same as softDeletes but for multi-timezone applications.\n\n**Example:**\n```php\n$table->softDeletesTz();\n```"
  },
  
  // ============================================
  // FOREIGN KEY & RELATIONSHIP
  // ============================================
  {
    method: "foreignId",
    category: "foreign",
    id: "**Fungsi:** Membuat kolom foreign key BIGINT UNSIGNED.\n\n**Kapan dipakai:** SELALU gunakan ini untuk relasi ke tabel lain (cara modern Laravel 9+).\n\n**Contoh penggunaan:**\n```php\n// Recommended (Laravel 9+)\n$table->foreignId('user_id')->constrained();\n\n// Custom table name\n$table->foreignId('author_id')->constrained('users');\n\n// Cascade delete\n$table->foreignId('category_id')->constrained()->cascadeOnDelete();\n\n// Cascade update\n$table->foreignId('user_id')->constrained()->cascadeOnUpdate();\n\n// Set null on delete\n$table->foreignId('team_id')->constrained()->nullOnDelete();\n```\n\n⚠️ **Perhatian:**\n- SELALU gunakan `->constrained()` untuk referential integrity\n- Nama kolom HARUS: `{nama_tabel}_id` (user_id → users table)\n- Kalau tidak pakai constrained, harus manual add foreign key",
    en: "**Function:** Creates a BIGINT UNSIGNED foreign key column.\n\n**When to use:** ALWAYS use this for relationships to other tables (modern Laravel 9+ way).\n\n**Example:**\n```php\n$table->foreignId('user_id')->constrained();\n$table->foreignId('category_id')->constrained()->cascadeOnDelete();\n```\n\n⚠️ **Attention:**\n- ALWAYS use `->constrained()` for referential integrity\n- Column name MUST be: `{table_name}_id`"
  },
  {
    method: "foreignUuid",
    category: "foreign",
    id: "**Fungsi:** Membuat kolom foreign key UUID.\n\n**Kapan dipakai:** Saat relasi ke tabel yang menggunakan UUID sebagai primary key.\n\n**Contoh penggunaan:**\n```php\n$table->foreignUuid('user_id')->constrained();\n$table->foreignUuid('team_id')->constrained()->cascadeOnDelete();\n```\n\n⚠️ **Perhatian:**\n- Harus match dengan primary key tipe UUID di tabel referensi\n- Sama seperti foreignId tapi untuk UUID",
    en: "**Function:** Creates a UUID foreign key column.\n\n**When to use:** When relating to a table using UUID as primary key.\n\n**Example:**\n```php\n$table->foreignUuid('user_id')->constrained();\n```\n\n⚠️ **Attention:**\n- Must match UUID primary key in referenced table"
  },
  {
    method: "morphs",
    category: "foreign",
    id: "**Fungsi:** Membuat kolom untuk polymorphic relation.\n\n**Kapan dipakai:** Saat satu model bisa berhubungan dengan banyak model lain (contoh: Comment bisa ke Post atau Video).\n\n**Contoh penggunaan:**\n```php\n// Di tabel comments\n$table->morphs('commentable');\n// Sama dengan:\n$table->unsignedBigInteger('commentable_id');\n$table->string('commentable_type');\n\n// Di model Comment:\npublic function commentable() {\n    return $this->morphTo();\n}\n\n// Di model Post:\npublic function comments() {\n    return $this->morphMany(Comment::class, 'commentable');\n}\n```\n\n⚠️ **Perhatian:**\n- Membuat 2 kolom: `{name}_id` dan `{name}_type`\n- Lebih fleksibel tapi lebih kompleks\n- Index untuk performance",
    en: "**Function:** Creates columns for polymorphic relationships.\n\n**When to use:** When one model can relate to many other models (e.g., Comment can belong to Post or Video).\n\n**Example:**\n```php\n$table->morphs('commentable');\n```\n\n⚠️ **Attention:**\n- Creates 2 columns: `{name}_id` and `{name}_type`\n- More flexible but more complex"
  },
  {
    method: "nullableMorphs",
    category: "foreign",
    id: "**Fungsi:** Membuat kolom polymorphic relation yang nullable.\n\n**Kapan dipakai:** Sama seperti morphs tapi relasi opsional.\n\n**Contoh penggunaan:**\n```php\n$table->nullableMorphs('commentable');\n```\n\n⚠️ **Perhatian:**\n- Sama seperti morphs tapi nullable\n- Untuk relasi yang tidak wajib",
    en: "**Function:** Creates nullable polymorphic relationship columns.\n\n**When to use:** Same as morphs but optional relationship.\n\n**Example:**\n```php\n$table->nullableMorphs('commentable');\n```"
  },
  {
    method: "foreign",
    category: "foreign",
    id: "**Fungsi:** Menambahkan foreign key constraint manual.\n\n**Kapan dipakai:** Saat kamu butuh kontrol lebih detail atas foreign key constraint.\n\n**Contoh penggunaan:**\n```php\n$table->unsignedBigInteger('user_id');\n$table->foreign('user_id')\n    ->references('id')\n    ->on('users')\n    ->onDelete('cascade')\n    ->onUpdate('restrict');\n```\n\n⚠️ **Perhatian:**\n- Lebih verbose dari foreignId()->constrained()\n- Gunakan untuk custom constraint\n- Harus ada kolom dulu sebelum add foreign",
    en: "**Function:** Adds a foreign key constraint manually.\n\n**When to use:** When you need more control over foreign key constraint.\n\n**Example:**\n```php\n$table->foreign('user_id')\n    ->references('id')\n    ->on('users')\n    ->onDelete('cascade');\n```\n\n⚠️ **Attention:**\n- More verbose than foreignId()->constrained()\n- Use for custom constraints"
  },
  
  // ============================================
  // INDEXES
  // ============================================
  {
    method: "unique",
    category: "index",
    id: "**Fungsi:** Menambahkan unique index ke kolom.\n\n**Kapan dipakai:** Saat nilai kolom harus unik seperti email, username, slug, dll.\n\n**Contoh penggunaan:**\n```php\n// Single column\n$table->string('email')->unique();\n$table->unique('email');\n\n// Composite unique\n$table->unique(['user_id', 'role_id']);\n\n// Custom index name\n$table->unique('email', 'users_email_unique');\n```\n\n⚠️ **Perhatian:**\n- Error jika ada duplicate data saat add index\n- Case-sensitive di sebagian besar database\n- NULL values biasanya allowed multiple",
    en: "**Function:** Adds a unique index to a column.\n\n**When to use:** When column values must be unique like email, username, slug, etc.\n\n**Example:**\n```php\n$table->string('email')->unique();\n$table->unique(['user_id', 'role_id']);\n```\n\n⚠️ **Attention:**\n- Error if duplicate data exists\n- Case-sensitive in most databases"
  },
  {
    method: "index",
    category: "index",
    id: "**Fungsi:** Menambahkan index untuk performa query.\n\n**Kapan dipakai:** Untuk kolom yang sering di-search, sort, atau join.\n\n**Contoh penggunaan:**\n```php\n// Single column\n$table->index('email');\n\n// Multiple columns\n$table->index(['first_name', 'last_name']);\n\n// Custom name\n$table->index('email', 'users_email_index');\n\n// Index type\n$table->index('email', null, 'btree');\n```\n\n⚠️ **Perhatian:**\n- Index mempercepat READ tapi memperlambat WRITE\n- Jangan over-index\n- Index kolom yang sering di WHERE, ORDER BY, JOIN",
    en: "**Function:** Adds an index for query performance.\n\n**When to use:** For columns frequently searched, sorted, or joined.\n\n**Example:**\n```php\n$table->index('email');\n$table->index(['first_name', 'last_name']);\n```\n\n⚠️ **Attention:**\n- Index speeds up READ but slows down WRITE\n- Don't over-index"
  },
  {
    method: "fullText",
    category: "index",
    id: "**Fungsi:** Menambahkan full-text index untuk text search.\n\n**Kapan dipakai:** Untuk kolom text yang akan di-search dengan full-text search.\n\n**Contoh penggunaan:**\n```php\n$table->fullText('title');\n$table->fullText(['title', 'content']);\n\n// Query:\n$posts = Post::whereFullText('content', 'laravel')->get();\n```\n\n⚠️ **Perhatian:**\n- MySQL 5.6+, PostgreSQL, SQLite\n- Untuk search natural language\n- Bukan untuk exact match",
    en: "**Function:** Adds a full-text index for text search.\n\n**When to use:** For text columns that will be searched with full-text search.\n\n**Example:**\n```php\n$table->fullText('title');\n\n// Query:\n$posts = Post::whereFullText('content', 'laravel')->get();\n```\n\n⚠️ **Attention:**\n- MySQL 5.6+, PostgreSQL, SQLite\n- For natural language search"
  },
  {
    method: "dropIndex",
    category: "index",
    id: "**Fungsi:** Menghapus index.\n\n**Kapan dipakai:** Saat kamu perlu remove index yang tidak diperlukan lagi.\n\n**Contoh penggunaan:**\n```php\n// Auto-generated name\n$table->dropIndex('users_email_index');\n\n// From column\n$table->dropIndex(['email']);\n```\n\n⚠️ **Perhatian:**\n- Pastikan tidak ada query yang bergantung pada index ini\n- Bisa impact performance",
    en: "**Function:** Drops an index.\n\n**When to use:** When you need to remove an unneeded index.\n\n**Example:**\n```php\n$table->dropIndex('users_email_index');\n```\n\n⚠️ **Attention:**\n- Ensure no queries depend on this index"
  },
  {
    method: "dropForeign",
    category: "index",
    id: "**Fungsi:** Menghapus foreign key constraint.\n\n**Kapan dipakai:** Saat kamu perlu remove foreign key constraint.\n\n**Contoh penggunaan:**\n```php\n// Auto-generated name\n$table->dropForeign('posts_user_id_foreign');\n\n// From column\n$table->dropForeign(['user_id']);\n```\n\n⚠️ **Perhatian:**\n- Data tidak dihapus, hanya constraint\n- Hati-hati dengan orphan records",
    en: "**Function:** Drops a foreign key constraint.\n\n**When to use:** When you need to remove foreign key constraint.\n\n**Example:**\n```php\n$table->dropForeign(['user_id']);\n```\n\n⚠️ **Attention:**\n- Data not deleted, only constraint"
  },
  {
    method: "dropUnique",
    category: "index",
    id: "**Fungsi:** Menghapus unique constraint.\n\n**Kapan dipakai:** Saat kamu perlu remove unique constraint.\n\n**Contoh penggunaan:**\n```php\n$table->dropUnique('users_email_unique');\n$table->dropUnique(['email']);\n```\n\n⚠️ **Perhatian:**\n- Data tidak dihapus, hanya constraint\n- Sekarang bisa insert duplicate",
    en: "**Function:** Drops a unique constraint.\n\n**When to use:** When you need to remove unique constraint.\n\n**Example:**\n```php\n$table->dropUnique(['email']);\n```\n\n⚠️ **Attention:**\n- Data not deleted, only constraint"
  },
  
  // ============================================
  // COLUMN MODIFIERS
  // ============================================
  {
    method: "nullable",
    category: "column",
    id: "**Fungsi:** Membuat kolom bisa NULL.\n\n**Kapan dipakai:** Saat kolom ini opsional, tidak wajib diisi.\n\n**Contoh penggunaan:**\n```php\n$table->string('phone')->nullable();\n$table->timestamp('email_verified_at')->nullable();\n$table->text('bio')->nullable();\n```\n\n⚠️ **Perhatian:**\n- Default semua kolom NOT NULL\n- Selalu pertimbangkan apakah kolom harus nullable\n- Handle NULL di code dengan `??` atau `?->`",
    en: "**Function:** Makes a column nullable.\n\n**When to use:** When this column is optional, not required.\n\n**Example:**\n```php\n$table->string('phone')->nullable();\n```\n\n⚠️ **Attention:**\n- Default all columns are NOT NULL\n- Handle NULL in code with `??` or `?->`"
  },
  {
    method: "default",
    category: "column",
    id: "**Fungsi:** Menetapkan nilai default untuk kolom.\n\n**Kapan dipakai:** Saat kolom harus punya nilai awal jika tidak diisi.\n\n**Contoh penggunaan:**\n```php\n$table->boolean('is_active')->default(true);\n$table->integer('views')->default(0);\n$table->string('status')->default('pending');\n$table->json('settings')->default(json_encode([]));\n```\n\n⚠️ **Perhatian:**\n- Default value harus match column type\n- Untuk boolean, gunakan `true`/`false` bukan 1/0\n- Untuk JSON, gunakan string JSON",
    en: "**Function:** Sets a default value for a column.\n\n**When to use:** When column should have an initial value if not filled.\n\n**Example:**\n```php\n$table->boolean('is_active')->default(true);\n$table->integer('views')->default(0);\n```\n\n⚠️ **Attention:**\n- Default value must match column type"
  },
  {
    method: "unsigned",
    category: "column",
    id: "**Fungsi:** Membuat kolom integer unsigned (hanya positif).\n\n**Kapan dipakai:** Untuk angka yang tidak pernah negatif seperti quantity, views, age, dll.\n\n**Contoh penggunaan:**\n```php\n$table->integer('views')->unsigned();\n$table->bigInteger('external_id')->unsigned();\n\n// foreignId() sudah unsigned otomatis\n$table->foreignId('user_id'); // BIGINT UNSIGNED\n```\n\n⚠️ **Perhatian:**\n- Range jadi 2x lipat (hanya positif)\n- WAJIB untuk foreign key\n- Laravel 7+: foreignId() sudah unsigned otomatis",
    en: "**Function:** Makes an integer column unsigned (positive only).\n\n**When to use:** For numbers that are never negative like quantity, views, age, etc.\n\n**Example:**\n```php\n$table->integer('views')->unsigned();\n```\n\n⚠️ **Attention:**\n- Range doubles (positive only)\n- REQUIRED for foreign keys"
  },
  {
    method: "useCurrent",
    category: "column",
    id: "**Fungsi:** Menetapkan default value CURRENT_TIMESTAMP.\n\n**Kapan dipakai:** Untuk timestamp yang otomatis terisi saat insert.\n\n**Contoh penggunaan:**\n```php\n$table->timestamp('created_at')->useCurrent();\n$table->timestamp('published_at')->useCurrent();\n```\n\n⚠️ **Perhatian:**\n- Hanya untuk timestamp/datetime\n- Database yang set, bukan Laravel\n- `$table->timestamps()` sudah otomatis",
    en: "**Function:** Sets default value to CURRENT_TIMESTAMP.\n\n**When to use:** For timestamps that auto-fill on insert.\n\n**Example:**\n```php\n$table->timestamp('created_at')->useCurrent();\n```\n\n⚠️ **Attention:**\n- Only for timestamp/datetime columns\n- Database sets, not Laravel"
  },
  {
    method: "useCurrentOnUpdate",
    category: "column",
    id: "**Fungsi:** Menetapkan ON UPDATE CURRENT_TIMESTAMP.\n\n**Kapan dipakai:** Untuk timestamp yang otomatis update saat row di-update.\n\n**Contoh penggunaan:**\n```php\n$table->timestamp('updated_at')\n    ->useCurrent()\n    ->useCurrentOnUpdate();\n```\n\n⚠️ **Perhatian:**\n- MySQL only\n- `$table->timestamps()` sudah otomatis handle updated_at\n- Untuk custom timestamp columns",
    en: "**Function:** Sets ON UPDATE CURRENT_TIMESTAMP.\n\n**When to use:** For timestamps that auto-update on row update.\n\n**Example:**\n```php\n$table->timestamp('updated_at')\n    ->useCurrent()\n    ->useCurrentOnUpdate();\n```\n\n⚠️ **Attention:**\n- MySQL only"
  },
  {
    method: "change",
    category: "column",
    id: "**Fungsi:** Memodifikasi kolom yang sudah ada.\n\n**Kapan dipakai:** Saat kamu perlu mengubah tipe data atau modifier kolom existing.\n\n**Contoh penggunaan:**\n```php\nSchema::table('users', function (Blueprint $table) {\n    // Ubah length\n    $table->string('email', 100)->change();\n    \n    // Tambah nullable\n    $table->string('phone')->nullable()->change();\n    \n    // Ubah type\n    $table->integer('age')->unsigned()->change();\n});\n```\n\n⚠️ **Perhatian:**\n- Laravel < 9: butuh doctrine/dbal\n- Bisa ada data loss jika downgrade type\n- Backup sebelum modify production!",
    en: "**Function:** Modifies an existing column.\n\n**When to use:** When you need to change column type or modifiers.\n\n**Example:**\n```php\nSchema::table('users', function (Blueprint $table) {\n    $table->string('email', 100)->change();\n});\n```\n\n⚠️ **Attention:**\n- Laravel < 9: requires doctrine/dbal\n- Possible data loss if downgrading type\n- Backup before modifying production!"
  },
  {
    method: "dropColumn",
    category: "column",
    id: "**Fungsi:** Menghapus kolom dari tabel.\n\n**Kapan dipakai:** Saat kamu perlu remove kolom yang tidak dipakai lagi.\n\n**Contoh penggunaan:**\n```php\nSchema::table('users', function (Blueprint $table) {\n    $table->dropColumn('nickname');\n    \n    // Multiple columns\n    $table->dropColumn(['first_name', 'last_name']);\n});\n```\n\n⚠️ **Perhatian:**\n- DATA AKAN HILANG PERMANEN!\n- Pastikan tidak ada code yang reference kolom ini\n- Backup sebelum drop di production!",
    en: "**Function:** Drops a column from the table.\n\n**When to use:** When you need to remove an unused column.\n\n**Example:**\n```php\nSchema::table('users', function (Blueprint $table) {\n    $table->dropColumn('nickname');\n});\n```\n\n⚠️ **Attention:**\n- DATA WILL BE PERMANENTLY LOST!\n- Ensure no code references this column\n- Backup before dropping in production!"
  },
  {
    method: "renameColumn",
    category: "column",
    id: "**Fungsi:** Mengganti nama kolom.\n\n**Kapan dipakai:** Saat kamu perlu rename kolom karena perubahan naming.\n\n**Contoh penggunaan:**\n```php\nSchema::table('users', function (Blueprint $table) {\n    $table->renameColumn('nickname', 'display_name');\n});\n```\n\n⚠️ **Perhatian:**\n- Laravel < 9: butuh doctrine/dbal\n- Update semua reference di code\n- Foreign keys tidak otomatis update",
    en: "**Function:** Renames a column.\n\n**When to use:** When you need to rename a column due to naming changes.\n\n**Example:**\n```php\nSchema::table('users', function (Blueprint $table) {\n    $table->renameColumn('nickname', 'display_name');\n});\n```\n\n⚠️ **Attention:**\n- Laravel < 9: requires doctrine/dbal\n- Update all references in code"
  },
  {
    method: "after",
    category: "column",
    id: "**Fungsi:** Menempatkan kolom setelah kolom lain (MySQL only).\n\n**Kapan dipakai:** Saat kamu perlu urutan kolom tertentu di database.\n\n**Contoh penggunaan:**\n```php\nSchema::table('users', function (Blueprint $table) {\n    $table->string('phone')->after('email');\n    $table->text('bio')->after('name');\n});\n```\n\n⚠️ **Perhatian:**\n- MySQL only\n- Tidak affect functionality, hanya visual di DB viewer\n- Tidak perlu obsess dengan column order",
    en: "**Function:** Places a column after another column (MySQL only).\n\n**When to use:** When you need specific column order in database.\n\n**Example:**\n```php\nSchema::table('users', function (Blueprint $table) {\n    $table->string('phone')->after('email');\n});\n```\n\n⚠️ **Attention:**\n- MySQL only\n- Doesn't affect functionality, just visual in DB viewer"
  },
  {
    method: "first",
    category: "column",
    id: "**Fungsi:** Menempatkan kolom di awal tabel (MySQL only).\n\n**Kapan dipakai:** Saat kamu perlu kolom tertentu di posisi pertama.\n\n**Contoh penggunaan:**\n```php\nSchema::table('users', function (Blueprint $table) {\n    $table->string('code')->first();\n});\n```\n\n⚠️ **Perhatian:**\n- MySQL only\n- Tidak affect functionality\n- Primary key biasanya sudah di posisi pertama",
    en: "**Function:** Places a column first in the table (MySQL only).\n\n**When to use:** When you need a column at the first position.\n\n**Example:**\n```php\nSchema::table('users', function (Blueprint $table) {\n    $table->string('code')->first();\n});\n```\n\n⚠️ **Attention:**\n- MySQL only\n- Doesn't affect functionality"
  },
  {
    method: "comment",
    category: "column",
    id: "**Fungsi:** Menambahkan comment/deskripsi ke kolom.\n\n**Kapan dipakai:** Untuk dokumentasi di database level.\n\n**Contoh penggunaan:**\n```php\n$table->string('status')->comment('active, inactive, pending');\n$table->integer('role')->comment('1=admin, 2=editor, 3=user');\n```\n\n⚠️ **Perhatian:**\n- MySQL dan PostgreSQL support\n- Dokumentasi untuk DBA dan developer\n- Tidak affect code execution",
    en: "**Function:** Adds a comment/description to a column.\n\n**When to use:** For documentation at database level.\n\n**Example:**\n```php\n$table->string('status')->comment('active, inactive, pending');\n```\n\n⚠️ **Attention:**\n- MySQL and PostgreSQL support\n- Documentation for DBA and developers"
  },
  {
    method: "storedAs",
    category: "column",
    id: "**Fungsi:** Membuat generated column yang stored (disimpan fisik).\n\n**Kapan dipakai:** Untuk kolom yang nilainya dihitung dari kolom lain dan perlu di-index.\n\n**Contoh penggunaan:**\n```php\n// Full name dari first + last\n$table->string('first_name');\n$table->string('last_name');\n$table->string('full_name')->storedAs(\"CONCAT(first_name, ' ', last_name)\");\n\n// Bisa di-index\n$table->index('full_name');\n```\n\n⚠️ **Perhatian:**\n- MySQL 5.7+, PostgreSQL 12+\n- Disimpan fisik di disk (lebih besar tapi lebih cepat)\n- Expression syntax database-specific",
    en: "**Function:** Creates a stored generated column.\n\n**When to use:** For columns computed from other columns that need indexing.\n\n**Example:**\n```php\n$table->string('full_name')->storedAs(\"CONCAT(first_name, ' ', last_name)\");\n```\n\n⚠️ **Attention:**\n- MySQL 5.7+, PostgreSQL 12+\n- Stored physically on disk (larger but faster)"
  },
  {
    method: "virtualAs",
    category: "column",
    id: "**Fungsi:** Membuat generated column yang virtual (tidak disimpan).\n\n**Kapan dipakai:** Untuk kolom yang nilainya dihitung dari kolom lain tapi tidak perlu di-index.\n\n**Contoh penggunaan:**\n```php\n$table->string('first_name');\n$table->string('last_name');\n$table->string('full_name')->virtualAs(\"CONCAT(first_name, ' ', last_name)\");\n```\n\n⚠️ **Perhatian:**\n- MySQL 5.7+, PostgreSQL 12+\n- Tidak disimpan fisik (hemat storage, lebih lambat)\n- Tidak bisa di-index langsung",
    en: "**Function:** Creates a virtual generated column.\n\n**When to use:** For columns computed from other columns that don't need indexing.\n\n**Example:**\n```php\n$table->string('full_name')->virtualAs(\"CONCAT(first_name, ' ', last_name)\");\n```\n\n⚠️ **Attention:**\n- MySQL 5.7+, PostgreSQL 12+\n- Not stored physically (saves storage, slower)"
  },
  {
    method: "always",
    category: "column",
    id: "**Fungsi:** Membuat column yang always generated (read-only).\n\n**Kapan dipakai:** Untuk kolom yang selalu dihitung, tidak bisa di-set manual.\n\n**Contoh penggunaan:**\n```php\n$table->decimal('total', 10, 2);\n$table->decimal('tax', 10, 2);\n$table->decimal('total_with_tax', 10, 2)\n    ->alwaysAs('total + tax');\n```\n\n⚠️ **Perhatian:**\n- Laravel 9+\n- Column tidak bisa di-fill manual\n- Otomatis dihitung database",
    en: "**Function:** Creates an always-generated column (read-only).\n\n**When to use:** For columns that are always computed, cannot be set manually.\n\n**Example:**\n```php\n$table->decimal('total_with_tax', 10, 2)\n    ->alwaysAs('total + tax');\n```\n\n⚠️ **Attention:**\n- Laravel 9+\n- Column cannot be filled manually"
  },
  
  // ============================================
  // GEOMETRY COLUMNS (Laravel 9+)
  // ============================================
  {
    method: "geometry",
    category: "column",
    id: "**Fungsi:** Membuat kolom GEOMETRY untuk data spasial.\n\n**Kapan dipakai:** Untuk aplikasi mapping, GIS, location-based features.\n\n**Contoh penggunaan:**\n```php\n$table->geometry('location');\n$table->geometry('boundary');\n```\n\n⚠️ **Perhatian:**\n- MySQL 5.7+, PostgreSQL (PostGIS)\n- Butuh extension untuk query spasial\n- Simpan coordinates: [longitude, latitude]",
    en: "**Function:** Creates a GEOMETRY column for spatial data.\n\n**When to use:** For mapping applications, GIS, location-based features.\n\n**Example:**\n```php\n$table->geometry('location');\n```\n\n⚠️ **Attention:**\n- MySQL 5.7+, PostgreSQL (PostGIS)\n- Requires extension for spatial queries"
  },
  {
    method: "point",
    category: "column",
    id: "**Fungsi:** Membuat kolom POINT untuk koordinat tunggal.\n\n**Kapan dipakai:** Untuk menyimpan single location seperti alamat, toko, dll.\n\n**Contoh penggunaan:**\n```php\n$table->point('location');\n\n// Insert\nDB::table('stores')->insert([\n    'name' => 'Store A',\n    'location' => DB::raw(\"ST_GeomFromText('POINT(106.8456 -6.2088)')\")\n]);\n```\n\n⚠️ **Perhatian:**\n- Format: POINT(longitude latitude)\n- Butuh fungsi spasial untuk query\n- MySQL 5.7+, PostgreSQL (PostGIS)",
    en: "**Function:** Creates a POINT column for single coordinates.\n\n**When to use:** For storing single locations like addresses, stores, etc.\n\n**Example:**\n```php\n$table->point('location');\n```\n\n⚠️ **Attention:**\n- Format: POINT(longitude latitude)\n- Requires spatial functions for queries"
  },
  {
    method: "lineString",
    category: "column",
    id: "**Fungsi:** Membuat kolom LINESTRING untuk garis/rute.\n\n**Kapan dipakai:** Untuk menyimpan rute, jalan, path, dll.\n\n**Contoh penggunaan:**\n```php\n$table->lineString('route');\n```\n\n⚠️ **Perhatian:**\n- Array of points\n- Format: LINESTRING(x1 y1, x2 y2, ...)\n- MySQL 5.7+, PostgreSQL (PostGIS)",
    en: "**Function:** Creates a LINESTRING column for lines/routes.\n\n**When to use:** For storing routes, roads, paths, etc.\n\n**Example:**\n```php\n$table->lineString('route');\n```\n\n⚠️ **Attention:**\n- Array of points\n- MySQL 5.7+, PostgreSQL (PostGIS)"
  },
  {
    method: "polygon",
    category: "column",
    id: "**Fungsi:** Membuat kolom POLYGON untuk area.\n\n**Kapan dipakai:** Untuk menyimpan batas wilayah, coverage area, dll.\n\n**Contoh penggunaan:**\n```php\n$table->polygon('coverage_area');\n```\n\n⚠️ **Perhatian:**\n- Closed shape\n- Format: POLYGON((x1 y1, x2 y2, ..., x1 y1))\n- MySQL 5.7+, PostgreSQL (PostGIS)",
    en: "**Function:** Creates a POLYGON column for areas.\n\n**When to use:** For storing boundaries, coverage areas, etc.\n\n**Example:**\n```php\n$table->polygon('coverage_area');\n```\n\n⚠️ **Attention:**\n- Closed shape\n- MySQL 5.7+, PostgreSQL (PostGIS)"
  },
  {
    method: "geometryCollection",
    category: "column",
    id: "**Fungsi:** Membuat kolom GEOMETRYCOLLECTION untuk multiple geometry types.\n\n**Kapan dipakai:** Untuk menyimpan koleksi geometry yang berbeda tipe.\n\n**Contoh penggunaan:**\n```php\n$table->geometryCollection('features');\n```\n\n⚠️ **Perhatian:**\n- Collection of different geometry types\n- Complex, use only when needed\n- MySQL 5.7+, PostgreSQL (PostGIS)",
    en: "**Function:** Creates a GEOMETRYCOLLECTION column for multiple geometry types.\n\n**When to use:** For storing collections of different geometry types.\n\n**Example:**\n```php\n$table->geometryCollection('features');\n```\n\n⚠️ **Attention:**\n- Collection of different geometry types\n- Complex, use only when needed"
  },
  {
    method: "multiPoint",
    category: "column",
    id: "**Fungsi:** Membuat kolom MULTIPOINT untuk multiple points.\n\n**Kapan dipakai:** Untuk menyimpan multiple locations seperti cabang toko, dll.\n\n**Contoh penggunaan:**\n```php\n$table->multiPoint('store_locations');\n```\n\n⚠️ **Perhatian:**\n- Array of POINT\n- MySQL 5.7+, PostgreSQL (PostGIS)",
    en: "**Function:** Creates a MULTIPOINT column for multiple points.\n\n**When to use:** For storing multiple locations like store branches, etc.\n\n**Example:**\n```php\n$table->multiPoint('store_locations');\n```\n\n⚠️ **Attention:**\n- Array of POINT\n- MySQL 5.7+, PostgreSQL (PostGIS)"
  },
  {
    method: "multiLineString",
    category: "column",
    id: "**Fungsi:** Membuat kolom MULTILINESTRING untuk multiple lines.\n\n**Kapan dipakai:** Untuk menyimpan multiple routes, paths, dll.\n\n**Contoh penggunaan:**\n```php\n$table->multiLineString('routes');\n```\n\n⚠️ **Perhatian:**\n- Array of LINESTRING\n- MySQL 5.7+, PostgreSQL (PostGIS)",
    en: "**Function:** Creates a MULTILINESTRING column for multiple lines.\n\n**When to use:** For storing multiple routes, paths, etc.\n\n**Example:**\n```php\n$table->multiLineString('routes');\n```\n\n⚠️ **Attention:**\n- Array of LINESTRING\n- MySQL 5.7+, PostgreSQL (PostGIS)"
  },
  {
    method: "multiPolygon",
    category: "column",
    id: "**Fungsi:** Membuat kolom MULTIPOLYGON untuk multiple polygons.\n\n**Kapan dipakai:** Untuk menyimpan multiple areas seperti coverage zones, dll.\n\n**Contoh penggunaan:**\n```php\n$table->multiPolygon('coverage_zones');\n```\n\n⚠️ **Perhatian:**\n- Array of POLYGON\n- MySQL 5.7+, PostgreSQL (PostGIS)",
    en: "**Function:** Creates a MULTIPOLYGON column for multiple polygons.\n\n**When to use:** For storing multiple areas like coverage zones, etc.\n\n**Example:**\n```php\n$table->multiPolygon('coverage_zones');\n```\n\n⚠️ **Attention:**\n- Array of POLYGON\n- MySQL 5.7+, PostgreSQL (PostGIS)"
  },
  {
    method: "spatialIndex",
    category: "index",
    id: "**Fungsi:** Menambahkan spatial index untuk performa query spasial.\n\n**Kapan dipakai:** Untuk kolom geometry yang akan di-query dengan operasi spasial.\n\n**Contoh penggunaan:**\n```php\n$table->point('location')->spatialIndex();\n$table->spatialIndex('location');\n```\n\n⚠️ **Perhatian:**\n- Untuk performa query spasial\n- R-tree index di MySQL\n- GiST index di PostgreSQL",
    en: "**Function:** Adds a spatial index for spatial query performance.\n\n**When to use:** For geometry columns that will be queried with spatial operations.\n\n**Example:**\n```php\n$table->point('location')->spatialIndex();\n```\n\n⚠️ **Attention:**\n- For spatial query performance\n- R-tree index in MySQL\n- GiST index in PostgreSQL"
  },
];

/**
 * Mencari penjelasan untuk method migration tertentu
 * @param keyword Keyword yang dicari
 * @param lang Bahasa ('id' atau 'en')
 * @returns Penjelasan method atau null jika tidak ditemukan
 */
export const getMigrationHover = (keyword: string, lang: 'id' | 'en'): string | null => {
  const lowerKeyword = keyword.toLowerCase();
  
  const match = migrationData.find(d => {
    // Match exact method name
    if (d.method.toLowerCase() === lowerKeyword) return true;
    
    // Match keyword contains method
    if (lowerKeyword.includes(d.method.toLowerCase())) return true;
    
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
