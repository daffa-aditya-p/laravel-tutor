# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

**Laravel Tutor** — a VSCode extension that teaches Laravel 13 to beginners with inline hints, hover tooltips, diagnostics, and a checklist panel, all bilingual (Bahasa Indonesia `id` / English `en`). It is educational tooling only: it never runs or parses Laravel projects, it pattern-matches PHP source text.

## Commands

```bash
npm install          # install deps
npm run compile      # tsc -p ./  → compiles src/ to out/
npm run watch        # tsc -watch, auto-recompile on save
```

- **Run/debug:** press `F5` in VSCode to launch the Extension Development Host (see `.vscode/launch.json`). There is no test suite and no linter configured — `tsc` (strict mode) is the only build/verify gate.
- **Package:** `vsce package` produces the `.vsix` (a checked-in `laravel-tutor-1.0.0.vsix` exists but `out/` is gitignored, so run `npm run compile` before packaging).
- `main` entry is `./out/extension.js`, so **you must compile before the extension will load** — editing `src/` alone does nothing until `tsc` runs.

## Architecture

Everything hangs off `src/extension.ts:activate()`, which wires four providers to VSCode APIs, all scoped to `{ language: 'php' }`. Two cross-cutting concerns run through the whole codebase: **file-type detection** and **i18n/language**.

### File-type detection (`src/utils/detector.ts`)
`detectFileType(document)` returns `'migration' | 'model' | 'controller' | 'route' | 'unknown'` by combining **path heuristics** (e.g. `/database/migrations/`, `/app/Models/`), **filename patterns**, and **content signatures** (`extends Migration`, `Route::`, `$fillable`). Order matters and there are explicit exclusion lists (e.g. model detection excludes `/http/`, `/jobs/`, `Schema::`). Every provider calls this first to decide which data set and rules apply. If a file isn't detected, all features go silent — so detection changes ripple into every feature.

### i18n / language (`src/utils/config.ts` + `src/i18n/`)
- Language is a VSCode setting `laravelTutor.language`; toggled via the status bar or the `laravelTutor.toggleLanguage` command.
- `config.ts` caches the current language and message bundle. **Any code path that changes language must invalidate this cache** — `toggleLanguage` calls `clearCache()` then `refreshAllProviders()`. A stale cache is the likely culprit for "language didn't update" bugs.
- Static UI strings live in `src/i18n/{id,en}.ts`, both keyed by the `I18nMessages` interface in `src/i18n/types.ts`. Adding a message means adding the key to `types.ts` **and** both locale files (strict TS enforces parity).
- Per-method explanations do NOT live in i18n — see below.

### Method data (`src/data/{migration,model,controller,routes}.ts`)
The bulk of the extension. Each file exports a typed array (`migrationData`, etc.) where every entry carries a `method` name, a `category`, and **both `id` and `en` markdown strings inline** (this is where all the Laravel teaching content lives — 200+ methods total). Each data file also exports a `get<Type>Hover(keyword, lang)` lookup used by the hover provider. To add support for a new Laravel method, add an entry here and, if it should be hoverable, make sure the keyword is covered by a regex in `HoverProvider`.

### Providers (`src/providers/`)
- **`HoverProvider.ts`** — matches the hovered word against a list of hardcoded regexes (`HOVER_PATTERN_SOURCES`), then dispatches to the matching `get*Hover` by file type. New hoverable keywords need both a data entry and regex coverage.
- **`InlayHintProvider.ts`** — the "ghost text" inline hints. Guarded for performance (skips very large files).
- **`DiagnosticProvider.ts`** — regex-based lint rules (missing primary key, unconstrained foreign key, missing mass-assignment protection, leftover `dd`/`dump`, unvalidated controllers, unnamed routes). Diagnostic message keys are the `diag_*` entries in i18n.
- **`ChecklistPanel.ts`** — a `WebviewViewProvider` (`laravelTutor.checklist`, in its own activity-bar container) showing a real-time, per-file-type quality checklist + 0–100 score. Checklist strings are the `check_*` i18n keys. Updates are debounced (~300ms).

### Refresh model
`extension.ts` listens to `onDidChangeTextDocument` and `onDidChangeActiveTextEditor` to re-run diagnostics and update the webview. Hover and inlay hints are pull-based (VSCode calls them on demand) and read `getLanguage()` fresh each time, so they don't need explicit refresh on language change — only diagnostics and the checklist do.

## Conventions
- Strict TypeScript throughout (`strict`, `noImplicitAny`, `noImplicitReturns`, `noFallthroughCasesInSwitch`). Keep it compiling clean.
- Source comments and detector logic are written in Bahasa Indonesia — match that when editing existing files.
- No runtime dependencies; only `@types/*` and `typescript` dev deps. Keep it dependency-free.
