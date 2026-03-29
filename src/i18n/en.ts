import { I18nMessages } from './types';

export const en: I18nMessages = {
  // Diagnostic messages - tone: friendly and helpful, like a senior developer mentoring a junior
  diag_no_timestamps: "This table doesn't have timestamps. Add $table->timestamps() unless you intentionally don't want to track created_at/updated_at.",
  diag_no_constrained: "This foreign key has no constraint! Add ->constrained() to maintain data integrity and prevent orphan records.",
  diag_not_snake_case: "Table name should use snake_case and be plural. Example: 'blog_posts' not 'BlogPosts' or 'post'.",
  diag_use_text_instead: "Columns that contain long text (like description, content, body) should use ->text() instead of ->string() which is limited to 255 characters.",
  diag_no_primary_key: "This table has no primary key! Every table must have $table->id() or $table->increments() to uniquely identify each record.",
  diag_fillable_guarded_conflict: "CONFLICT: You defined both $fillable AND $guarded! Choose one, not both.",
  diag_no_mass_protection: "This model has no mass assignment protection! Add $fillable or $guarded to protect against vulnerabilities.",
  diag_relation_not_camel: "Relationship method name must be camelCase and plural! Example: 'userPosts' not 'user_posts' or 'userpost'.",
  diag_no_validation: "Data is being processed without validation! Always use $request->validate() before saving or processing user data. Never trust user input!",
  diag_api_returns_view: "API methods should return JSON, not views! Use response()->json() for APIs, reserve view() for web pages.",
  diag_debug_statement: "Debug statement found (dd/dump/var_dump)! Don't forget to remove it before production, it can leak sensitive data!",
  diag_route_no_name: "Route should have a name using ->name() for easy reference in code.",
  
  // Checklist messages - shorter, to the point
  check_has_primary_key: "Has primary key ($table->id() or $table->increments())",
  check_has_timestamps: "Has timestamps ($table->timestamps())",
  check_foreign_constrained: "All foreignId() have ->constrained()",
  check_snake_case: "Table name is snake_case and plural",
  check_no_debug: "No debug statements (dd, dump, var_dump)",
  check_has_fillable: "Has $fillable or $guarded (not both)",
  check_has_casts: "Has $casts for date/boolean columns",
  check_relation_camel: "Relationship methods use camelCase",
  check_has_validation: "Uses $request->validate() before processing data",
  check_no_all_without_validation: "No $request->all() without validation",
  check_response_type: "Returns appropriate response (JSON for API, view for pages)",
  check_fillable_guarded_not_both: "Does not use both $fillable and $guarded",
  check_uses_route_facade: "Uses Route Facade",
  check_defines_routes: "Defines routes",
  check_routes_have_names: "Routes have names (->name())",
  
  // Status bar
  status_bar_label: "Laravel Tutor [EN]",
  
  // Inlay hints
  inlay_table_name: "table_name (snake_case, plural)",
  inlay_column_name: "column_name",
  inlay_foreign_key: "table_name_id",
  inlay_route_path: "/path', [Controller::class, 'method']",
  inlay_route_name: "prefix.action (e.g.: users.index)",
  inlay_fillable: "Mass assignable columns",
  inlay_casts: "Attribute casts",
  inlay_returns_collection: "Returns Collection",
  inlay_returns_model: "Returns Model",
  
  // Panel messages
  panel_empty_title: "Open a Laravel PHP file to see the checklist.",
  panel_empty_hint: "Supported: Migration, Model, Controller, Route files",
  panel_unknown_title: "This file is not detected as a Laravel file.",
  panel_unknown_hint: "Make sure the file is in the correct Laravel folder structure.",
  panel_score: "Score"
} satisfies I18nMessages;
