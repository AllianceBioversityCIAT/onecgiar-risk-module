# PRMS Risk System — UI Changes Implementation Plan

**Date:** 2026-03-05
**Total estimated effort:** ~2 days

---

## A. Landscape PDF Report (4 tasks)

| # | Task | Files to Modify | What to Change | Size |
|---|------|----------------|----------------|------|
| A1 | Remove SPXX from title | `risk-report-table.component.ts` :614-631, `exports.component.ts` :211-229 | Remove `officialCode` from `headerTitle` — use only `programName` | S |
| A2 | Rename title to "Top 5 submitted risks for {Year}" | Same two files as A1 | Change `titleLabel` to `"Top 5 submitted risks for ${activePhaseYear}"`. Pull the active phase reporting year from the program entity | M |
| A3 | Rename column header | `risk-report-table.component.ts` :530, `exports.component.ts` :130 | Change `'Actions/Controls'` to `'Actions and controls to manage risk'` | S |
| A4 | Increase font size | `risk-report-table.component.ts` :537-538, `exports.component.ts` :136-137 | Increase base `fontSize` from 8 to 9 or 10, adjust `lineH` proportionally. Tune auto-scaling thresholds to keep content fitting | S |

> **Note:** "Deadline" and "Status" columns are NOT needed — removed from scope.

**Suggested order:** A1 → A3 → A4 → A2

**Key constraint:** Both `risk-report-table.component.ts` and `exports.component.ts` must be kept in sync for every change.

---

## B. Dashboard (6 tasks)

| # | Task | Files to Modify | What to Change | Size |
|---|------|----------------|----------------|------|
| B1 | Fixed 1–5 scale on risk profile charts | `dashboard.component.ts` :445-461 | Add `min: 1, max: 5` to both xAxis (Impact) and yAxis (Likelihood) in the `riskProfile()` chart config method | S |
| B2 | Sticky/frozen filters | `dashboard.component.html` :9-46, `dashboard.component.scss` | Add `position: sticky; top: 0; z-index: 10; background: white;` to the filter bar container so it stays visible when scrolling | S |
| B3 | Wider Program/Project dropdown | `dashboard.component.scss` or `.html` :10-18 | Increase `mat-form-field` width/min-width on the program dropdown to fit longer initiative names | S |
| B4 | Export dashboard as PDF (screenshot) | `dashboard.component.ts`, `dashboard.component.html`, `package.json` | Add `html2canvas` dependency. New export button + method that captures the dashboard DOM as-is into a jsPDF document (screenshot-style) | L |
| B5 | Tooltips on action status & risk categories | `dashboard.component.html` :159, :177, `dashboard.component.ts` | Add `matTooltip` on status and category cells. Pull definition text from the database (where status values are stored) and display on hover | M |
| B6 | Left-align all table cells | `dashboard.component.scss` | Add `text-align: left !important;` to all `td` and `th` elements in dashboard tables | S |

**Suggested order:** B1 → B6 → B3 → B2 → B5 → B4

**Dependencies:**
- B4 requires installing `html2canvas` (new npm dependency)
- B5 requires fetching status/category definitions from the back-end — may need a new API endpoint or to include definitions in existing data responses

---

## C. Risk Report (4 tasks)

| # | Task | Files to Modify | What to Change | Size |
|---|------|----------------|----------------|------|
| C1 | Hide Word export button | `search-risk.component.html` :207-231 | Hide the "Export to Word" button (keep code, add TODO comment for future removal). For PDF, remove the dropdown menu — single button that directly calls `exportPDF('landscape')` | S |
| C2 | Project name → "PRMS Risk Management" | `search-risk.component.ts` :239, :248, and PDF title in `risk-report-table.component.ts` | Change all instances of `"PRMS Risk"` to `"PRMS Risk Management"` | S |
| C3 | Narrative: 100 words, mandatory | `submit-risk-dialog.component.ts` :42-45, `submit-risk-dialog.component.html` :149, :157, :222, :230 | Change word limit from 50 → 100. Add required validation (narrative cannot be empty). Update display to show `/100 words` | S |
| C4 | Narrative hint/description text | `submit-risk-dialog.component.html` :148-158, :221-231 | Replace current label with: *"Summarize the key insights highlighting which risks materialized, how effectively they were managed, what new risks emerged, and how risk events affected results, timelines, or budgets. This will appear at the top of your PDF export and will be copied and pasted into your Annual Technical Report. (100 words or less)"* — style as hint/description text below or above the textarea | S |

**Suggested order:** C1 → C2 → C3 → C4

---

## Implementation Priority

| Order | Tasks | Effort | Notes |
|-------|-------|--------|-------|
| 1 | C1, C2, C3, C4 (Risk Report) | ~2 hrs | All small, self-contained |
| 2 | A1, A3, A4 (Landscape PDF quick wins) | ~1-2 hrs | Keep both files in sync |
| 3 | B1, B6, B3, B2 (Dashboard quick wins) | ~2-3 hrs | Config & styling changes |
| 4 | A2 (Year in PDF title) | ~1-2 hrs | Needs active phase year plumbed through |
| 5 | B5 (Tooltips with DB definitions) | ~2-3 hrs | May need back-end work for definitions |
| 6 | B4 (Dashboard PDF screenshot export) | ~4-6 hrs | New dependency, largest feature |

---

## Checklist

- [x] **A1** Remove SPXX from landscape PDF title
- [x] **A2** Title → "Top 5 submitted risks for {Active Phase Year}"
- [x] **A3** Column → "Actions and controls to manage risk"
- [x] **A4** Increase landscape PDF font size
- [x] **B1** Fixed 1–5 scale on risk profile charts
- [x] **B2** Sticky dashboard filters
- [x] **B3** Wider Program/Project dropdown
- [x] **B4** Dashboard screenshot PDF export
- [x] **B5** Tooltips on status & categories (from DB)
- [x] **B6** Left-align all dashboard table cells
- [x] **C1** Hide Word export, single landscape PDF button (TODO: remove Word code later)
- [x] **C2** Project name → "PRMS Risk Management"
- [x] **C3** Narrative: 100 words max, mandatory
- [x] **C4** Narrative hint/description text
