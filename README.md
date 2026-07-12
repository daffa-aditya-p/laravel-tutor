# Laravel Tutor

**Belajar Laravel 13 jadi lebih mudah — langsung di dalam kode kamu.**

Laravel Tutor adalah ekstensi VSCode yang dirancang khusus untuk developer pemula yang sedang belajar Laravel. Ekstensi ini memberikan penjelasan, hint, dan feedback langsung saat kamu menulis kode Laravel — seperti punya mentor yang duduk di sebelah kamu.

Tersedia dalam dua bahasa: Bahasa Indonesia dan English.

---

## Fitur Utama

### 1. Tooltip Penjelasan Method

Arahkan mouse ke method Laravel apa saja, dan kamu akan mendapatkan penjelasan lengkap tentang apa fungsi method tersebut, kapan dipakai, dan contoh penggunaannya.

Cocok buat kamu yang masih sering lupa bedanya `hasMany` dan `belongsToMany`, atau kapan harus pakai `string()` vs `text()` di migration.

### 2. Ghost Text Inline

Saat kamu mengetik, Laravel Tutor menampilkan hint langsung di dalam editor. Kamu akan melihat informasi seperti:
- Tipe kolom yang sedang kamu definisikan
- Nama route yang sedang dibuat
- Return type dari relationship

Semuanya muncul inline, tanpa perlu pindah window atau buka dokumentasi.

### 3. Diagnostic Otomatis

Laravel Tutor akan memberikan warning atau error kalau ada masalah di kodemu, seperti:
- Migration tanpa primary key
- Foreign key tanpa constraint
- Model tanpa proteksi mass assignment
- Debug statement (dd/dump) yang lupa dihapus
- Controller yang proses data tanpa validasi

Ini bukan sekadar error checking — ini seperti punya senior developer yang ngasih tau kalau ada yang salah.

### 4. Checklist Panel

Di sidebar, ada panel checklist yang update real-time sesuai file yang sedang kamu buka. Panel ini akan menampilkan:
- Apa saja yang sudah benar di kodemu
- Apa saja yang perlu diperbaiki
- Skor kualitas kode (0-100)

Checklist berbeda untuk setiap tipe file: Migration, Model, Controller, dan Route.

### 5. Toggle Bahasa

Klik status bar di pojok kanan bawah untuk ganti bahasa antara Bahasa Indonesia dan English. Semua tooltip, hint, diagnostic, dan checklist akan ikut berubah.

---

## Cara Pakai

### Instalasi

1. Buka VSCode
2. Tekan `Ctrl+Shift+X` (atau `Cmd+Shift+X` di Mac) untuk buka Extensions
3. Cari "Laravel Tutor"
4. Klik Install

Atau download langsung dari [VSCode Marketplace](https://marketplace.visualstudio.com/items?itemName=daffa-aditya-p.laravel-tutor).

### Cara Kerja

Laravel Tutor otomatis aktif saat kamu buka file PHP di project Laravel. Tidak perlu setting apa-apa.

Ekstensi ini akan mendeteksi tipe file berdasarkan:
- **Path file** — apakah di folder `database/migrations/`, `app/Models/`, `app/Http/Controllers/`, dll
- **Konten file** — apakah ada `extends Migration`, `extends Model`, `Route::`, dll

Semakin standar struktur folder Laravel kamu, semakin akurat deteksinya.

### Ganti Bahasa

1. Klik tulisan "Laravel Tutor [ID]" atau "Laravel Tutor [EN]" di status bar (pojok kanan bawah)
2. Bahasa akan langsung berubah untuk semua tooltip, hint, dan checklist

Atau buka Settings (`Ctrl+,`), cari "Laravel Tutor Language", dan pilih bahasa yang kamu mau.

---

## Contoh Penggunaan

### Di Migration

```php
Schema::create('posts', function (Blueprint $table) {
    $table->id();              // Hover: penjelasan tentang primary key
    $table->string('title');   // Hover: VARCHAR(255), contoh penggunaan
    $table->text('content');   // Hover: TEXT column, kapan dipakai
    $table->foreignId('user_id'); // Diagnostic warning kalau lupa ->constrained()
    $table->timestamps();
});
```

Ghost text akan muncul inline menunjukkan tipe data setiap kolom.

### Di Model

```php
class Post extends Model
{
    protected $fillable = ['title', 'content', 'user_id'];
    // Hover: penjelasan mass assignment protection
    
    protected $casts = [
        'published_at' => 'datetime',
        'is_active' => 'boolean',
    ];
    // Hover: penjelasan type casting
    
    public function comments()
    {
        return $this->hasMany(Comment::class);
        // Hover: penjelasan relasi one-to-many
    }
}
```

Diagnostic akan warning kalau model tidak punya `$fillable` atau `$guarded`.

### Di Controller

```php
class PostController extends Controller
{
    public function store(Request $request)
    {
        // Diagnostic warning kalau langsung pakai $request->all() tanpa validasi
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
        ]);
        
        Post::create($validated);
        
        return redirect()->route('posts.index');
    }
}
```

Ghost text akan menunjukkan path view yang dituju atau tipe response yang di-return.

### Di Route

```php
Route::get('/posts', [PostController::class, 'index'])->name('posts.index');
// Hover: penjelasan Route::get, kapan dipakai
// Diagnostic info kalau route tidak punya nama
```

---

## Apa yang Didapat

### Untuk Pemula

- **Belajar sambil coding** — tidak perlu bolak-balik buka dokumentasi
- **Paham konsep, bukan sekadar hafal** — setiap method dijelaskan dengan contoh real
- **Terbiasa dengan best practice** — diagnostic dan checklist akan mengingatkan kalau ada yang salah
- **Bahasa yang mudah dimengerti** — penjelasan ditulis dengan bahasa santai, bukan bahasa dokumentasi yang kaku

### Untuk yang Sudah Agak Lancar

- **Refresher cepat** — lupa syntax? Hover aja
- **Code quality check** — pastikan kodemu follow Laravel best practice
- **Menghindari common mistakes** — seperti lupa validasi, lupa constrained, atau debug statement yang kebawa production

---

## Technical Details

### Requirements

- VSCode versi 1.85.0 atau lebih baru
- PHP 8.1+ (recommended untuk Laravel 10/11/12/13)
- Project Laravel (ekstensi ini didesain untuk struktur folder Laravel standar)

### Supported File Types

| Tipe File | Deteksi Berdasarkan | Fitur yang Aktif |
|-----------|---------------------|------------------|
| Migration | `database/migrations/`, `extends Migration`, `Schema::` | Hover, Inlay Hint, Diagnostic, Checklist |
| Model | `app/Models/`, `extends Model`, `$fillable` | Hover, Inlay Hint, Diagnostic, Checklist |
| Controller | `app/Http/Controllers/`, `extends Controller` | Hover, Inlay Hint, Diagnostic, Checklist |
| Route | `routes/web.php`, `routes/api.php`, `Route::` | Hover, Inlay Hint, Diagnostic, Checklist |

### Method yang Didukung

Ekstensi ini mendukung 200+ method Laravel yang paling sering digunakan:

- **Migration (50+ method)** — `Schema::create`, `Schema::table`, `$table->id()`, `$table->string()`, `$table->foreignId()`, dll
- **Model (50+ method)** — `$fillable`, `$guarded`, `$casts`, `hasMany`, `belongsTo`, `belongsToMany`, dll
- **Controller (50+ method)** — `$request->validate()`, `$request->all()`, `response()->json()`, `redirect()`, dll
- **Route (50+ method)** — `Route::get`, `Route::post`, `Route::resource`, `->name()`, `->middleware()`, dll

Dan masih banyak lagi — termasuk Eloquent query builder methods, relationship types, dan response helpers.

---

## FAQ

### Apakah ekstensi ini bekerja di project Laravel versi lama?

Ya, sebagian besar method yang didukung tersedia di Laravel 8, 9, 10, 11, dan 12. Beberapa method baru (seperti `whereNumber()`, `whereAlpha()`) hanya tersedia di Laravel 9+, tapi penjelasan akan tetap muncul.

### Apakah ini akan memperlambat VSCode?

Tidak. Ekstensi ini didesain dengan performa sebagai prioritas:
- File besar (>2000 baris) akan di-skip untuk inlay hints
- Update webview menggunakan debounce 300ms
- Cache system untuk konfigurasi bahasa
- Tidak ada dependency eksternal yang berat

### Kenapa diagnostic tidak muncul di file saya?

Pastikan file kamu terdeteksi sebagai file Laravel. Ekstensi ini mendeteksi berdasarkan:
1. **Path** — apakah di folder standar Laravel (`database/migrations/`, `app/Models/`, dll)
2. **Konten** — apakah ada pattern Laravel (`extends Migration`, `extends Model`, `Route::`, dll)

Kalau file kamu di luar struktur folder standar, diagnostic mungkin tidak aktif.

### Bisa tambah bahasa lain selain Indonesia dan English?

Saat ini hanya mendukung 2 bahasa. Kalau ada demand yang cukup, mungkin akan ditambah bahasa lain di update mendatang.

### Ada rencana support fitur lain?

Beberapa fitur yang sedang dipertimbangkan:
- Code snippets untuk boilerplate Laravel
- Integration dengan Laravel Artisan commands
- Live reload untuk config changes
- Custom diagnostic rules

Kalau ada request fitur, silakan buka issue di GitHub.

---

## Changelog

### Version 1.0.3

- **Ghost text (inlay hint) sekarang MATI secara default.** Fitur ini sering bikin bingung saat mengetik karena tampil inline seolah bagian dari kode. Penjelasan method tetap tersedia lewat **hover**. Yang mau mengaktifkannya lagi bisa nyalakan setting `laravelTutor.inlayHints` (Settings → cari "Laravel Tutor")
- Perubahan setting `laravelTutor.inlayHints` langsung berlaku tanpa perlu edit/reload file

### Version 1.0.2

- **Fix:** Diagnostic statement debug (`dd`, `dump`, `var_dump`, `print_r`) diturunkan dari **Error** menjadi **Warning** — statement ini PHP valid, bukan syntax error, jadi tidak lagi terkesan "kode kamu rusak"
- **Fix:** Deteksi debug statement sekarang mengabaikan yang ada di dalam komentar dan string (tidak lagi false-positive di `// pakai dd() buat debug` atau `"print_r"`)
- **Fix:** Deteksi tipe file lebih ketat — file PHP biasa di folder `app/` tidak lagi salah dianggap Model, sehingga hint & diagnostic tidak muncul di file non-Laravel
- **Fix:** Ghost text (inlay hint) sekarang ikut refresh saat bahasa di-toggle tanpa perlu mengedit file dulu
- **Security:** Webview checklist mematikan eksekusi script (`enableScripts: false`) dan meng-escape semua konten dinamis untuk mencegah HTML/JS injection (XSS)

### Version 1.0.0 (Initial Release)

- Hover Provider untuk tooltip penjelasan method
- Inlay Hint Provider untuk ghost text inline
- Diagnostic Provider untuk warning/error otomatis
- Checklist Panel di sidebar
- Bilingual support (Bahasa Indonesia & English)
- Status bar toggle untuk ganti bahasa
- Support 200+ Laravel methods
- Strict TypeScript mode untuk type safety
- Performance optimization (debounce, cache, file size guard)

---

## Kontribusi

Ekstensi ini open source. Kalau kamu mau kontribusi, silakan:

1. Fork repository di [GitHub](https://github.com/AxonLabs/laravel-tutor)
2. Clone ke lokal kamu
3. Install dependency: `npm install`
4. Buat branch baru: `git checkout -b feature/nama-fitur`
5. Commit perubahan kamu
6. Push ke branch: `git push origin feature/nama-fitur`
7. Buka Pull Request

### Development

```bash
# Install dependency
npm install

# Compile TypeScript
npm run compile

# Watch mode (auto-compile saat ada perubahan)
npm run watch

# Run di VSCode Extension Development Host
F5 (di VSCode)
```

### Melaporkan Bug

Kalau nemu bug atau ada method Laravel yang belum didukung, silakan buka issue di GitHub dengan detail:
- Versi VSCode kamu
- Versi Laravel project
- File tipe apa (migration/model/controller/route)
- Method apa yang bermasalah
- Screenshot atau code snippet (kalau ada)

---

## License

MIT License — silakan pakai untuk belajar, ngajar, atau project pribadi.

---

## Tentang Developer

Dikembangkan oleh Daffa Aditya Pratama

Kalau ekstensi ini membantu kamu, jangan lupa kasih rating di Marketplace ya!

---

## Resources

- [Dokumentasi Laravel (Official)](https://laravel.com/docs)
- [Laravel News](https://laravel-news.com)
- [Laracasts](https://laracasts.com)tuh
- [GitHub Repository](https://github.com/daffa-aditya-p/laravel-tutor)
- [Report Issue](https://github.com/daffa-aditya-p/laravel-tutor/issues)

---

**Selamat belajar Laravel!**
