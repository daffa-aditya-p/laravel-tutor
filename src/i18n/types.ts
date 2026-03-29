/**
 * Interface untuk semua pesan i18n di Laravel Tutor
 * Digunakan untuk type-safety dan memastikan semua key ada di setiap bahasa
 */
export interface I18nMessages {
  // Diagnostic messages
  diag_no_timestamps: string;
  diag_no_constrained: string;
  diag_not_snake_case: string;
  diag_use_text_instead: string;
  diag_no_primary_key: string;
  diag_fillable_guarded_conflict: string;
  diag_no_mass_protection: string;
  diag_relation_not_camel: string;
  diag_no_validation: string;
  diag_api_returns_view: string;
  diag_debug_statement: string;
  diag_route_no_name: string;
  
  // Checklist messages
  check_has_primary_key: string;
  check_has_timestamps: string;
  check_foreign_constrained: string;
  check_snake_case: string;
  check_no_debug: string;
  check_has_fillable: string;
  check_has_casts: string;
  check_relation_camel: string;
  check_has_validation: string;
  check_no_all_without_validation: string;
  check_response_type: string;
  check_fillable_guarded_not_both: string;
  check_uses_route_facade: string;
  check_defines_routes: string;
  check_routes_have_names: string;
  
  // Status bar
  status_bar_label: string;
  
  // Inlay hints
  inlay_table_name: string;
  inlay_column_name: string;
  inlay_foreign_key: string;
  inlay_route_path: string;
  inlay_route_name: string;
  inlay_fillable: string;
  inlay_casts: string;
  inlay_returns_collection: string;
  inlay_returns_model: string;
  
  // Panel messages
  panel_empty_title: string;
  panel_empty_hint: string;
  panel_unknown_title: string;
  panel_unknown_hint: string;
  panel_score: string;
}
