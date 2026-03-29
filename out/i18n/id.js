"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.id = void 0;
exports.id = {
    // Diagnostic messages - tone: santai tapi jelas, seperti senior yang ngajarin junior
    diag_no_timestamps: "Tabel ini nggak punya kolom timestamps. Tambahkan $table->timestamps() kecuali memang disengaja nggak mau tracking waktu created_at/updated_at.",
    diag_no_constrained: "Foreign key ini nggak punya constraint! Tambahkan ->constrained() biar data konsisten dan nggak ada orphan records (data yatim piatu).",
    diag_not_snake_case: "Nama tabel sebaiknya pakai snake_case dan plural. Contoh: 'blog_posts' bukan 'BlogPosts' atau 'post'.",
    diag_use_text_instead: "Kolom yang isinya teks panjang (seperti deskripsi, konten, body) lebih baik pakai ->text() daripada ->string() yang limitnya cuma 255 karakter.",
    diag_no_primary_key: "Tabel ini nggak punya primary key! Setiap tabel wajib punya $table->id() atau $table->increments() untuk identifikasi unik setiap record.",
    diag_fillable_guarded_conflict: "KONFLIK: Kamu definisikan $fillable DAN $guarded bersamaan! Pilih salah satu aja, nggak boleh keduanya.",
    diag_no_mass_protection: "Model ini nggak punya proteksi mass assignment! Tambahkan $fillable atau $guarded biar aman dari vulnerability.",
    diag_relation_not_camel: "Nama method relasi harus camelCase dan plural! Contoh: 'userPosts' bukan 'user_posts' atau 'userpost'.",
    diag_no_validation: "Data diproses tanpa validasi! Selalu gunakan $request->validate() sebelum simpan atau proses data dari user. Jangan pernah percaya input user!",
    diag_api_returns_view: "Method API seharusnya return JSON, bukan view! Gunakan response()->json() untuk API, reserve view() untuk halaman web.",
    diag_debug_statement: "Ada debug statement (dd/dump/var_dump)! Jangan lupa dihapus sebelum production ya, bisa bocorin data sensitif!",
    diag_route_no_name: "Route sebaiknya memiliki nama menggunakan ->name() biar gampang di-reference di code.",
    // Checklist messages - lebih pendek, to the point
    check_has_primary_key: "Punya primary key ($table->id() atau $table->increments())",
    check_has_timestamps: "Punya timestamps ($table->timestamps())",
    check_foreign_constrained: "Semua foreignId() pakai ->constrained()",
    check_snake_case: "Nama tabel snake_case dan plural",
    check_no_debug: "Nggak ada debug statement (dd, dump, var_dump)",
    check_has_fillable: "Punya $fillable atau $guarded (nggak keduanya)",
    check_has_casts: "Punya $casts untuk kolom tanggal/boolean",
    check_relation_camel: "Method relasi pakai camelCase",
    check_has_validation: "Pakai $request->validate() sebelum proses data",
    check_no_all_without_validation: "Nggak pakai $request->all() tanpa validasi",
    check_response_type: "Return response yang sesuai (JSON untuk API, view untuk halaman)",
    check_fillable_guarded_not_both: "Tidak menggunakan $fillable dan $guarded bersamaan",
    check_uses_route_facade: "Menggunakan Route Facade",
    check_defines_routes: "Mendefinisikan routes",
    check_routes_have_names: "Routes memiliki nama (->name())",
    // Status bar
    status_bar_label: "Laravel Tutor [ID]",
    // Inlay hints
    inlay_table_name: "nama_tabel (snake_case, plural)",
    inlay_column_name: "nama_kolom",
    inlay_foreign_key: "nama_tabel_id",
    inlay_route_path: "/path', [Controller::class, 'method']",
    inlay_route_name: "prefix.action (contoh: users.index)",
    inlay_fillable: "Kolom yang bisa mass assign",
    inlay_casts: "Attribute casts",
    inlay_returns_collection: "Mengembalikan Collection",
    inlay_returns_model: "Mengembalikan Model",
    // Panel messages
    panel_empty_title: "Buka file PHP Laravel untuk melihat checklist.",
    panel_empty_hint: "Supported: Migration, Model, Controller, Route files",
    panel_unknown_title: "File ini tidak terdeteksi sebagai file Laravel.",
    panel_unknown_hint: "Pastikan file berada di struktur folder Laravel yang benar.",
    panel_score: "Skor"
};
//# sourceMappingURL=id.js.map