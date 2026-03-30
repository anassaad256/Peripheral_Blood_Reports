# Technical Documentation -- Peripheral Blood Smear Report Generator

> **Last updated:** 2026-03-30

This document provides a detailed technical reference for the architecture, data flow, state management, rendering engine, and component design of the Peripheral Blood Smear Report Generator.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Data Model](#data-model)
3. [State Management](#state-management)
4. [Rendering Engine](#rendering-engine)
5. [Component Architecture](#component-architecture)
6. [View Routing](#view-routing)
7. [Data Persistence](#data-persistence)
8. [Print / PDF Generation](#print--pdf-generation)
9. [Validation](#validation)
10. [Type System](#type-system)
11. [Styling](#styling)
12. [Build & Tooling](#build--tooling)

---

## Architecture Overview

The app is a client-side-only React SPA with three conceptual layers:

```
┌─────────────────────────────────────────────────┐
│  View Layer (SessionManager routes views)       │
│  ┌─────────────┬─────────────┬────────────────┐ │
│  │ Resume      │ Editing     │ Summary        │ │
│  │ Prompt      │ (Sidebar +  │ (All cases +   │ │
│  │             │  CaseEditor)│  Print)        │ │
│  └─────────────┴─────────────┴────────────────┘ │
├─────────────────────────────────────────────────┤
│  State Layer (useSession hook + reducer)         │
│  Single Session object managed by useReducer     │
│  Auto-persisted to localStorage                  │
├─────────────────────────────────────────────────┤
│  Engine Layer (pure functions, no React)          │
│  renderReport() converts ReportInput → string    │
│  validateInput() checks generation readiness     │
└─────────────────────────────────────────────────┘
```

**Key principle**: The rendering engine and validation are pure functions that accept a `ReportInput` and return strings/booleans. They have zero knowledge of React, sessions, or UI state. The `toReportInput()` adapter bridges the session data model to the engine's expected input format.

---

## Data Model

### Session (top-level state)

```typescript
interface Session {
  metadata: SessionMetadata;   // shared across all cases
  cases: CaseData[];           // ordered array of cases
  activeCaseIndex: number;     // index of currently edited case
  view: 'editing' | 'summary'; // current view
}
```

### SessionMetadata (shared across all cases)

```typescript
interface SessionMetadata {
  date: string;                // YYYY-MM-DD format from date picker
  signingPathologist: string;  // free text
  billingCode1: string;        // default: "85060"
  billingCode2: string;        // default: "R68.89"
}
```

### CaseData (per-case state)

```typescript
interface CaseData {
  id: string;                              // crypto.randomUUID() for React keys
  caseId: string;                          // user-entered Case Accession ID
  hasAbnormalities: boolean | null;        // null = not yet selected
  rbc: RbcGroup;                           // RBC morphology fields
  nrbc: NrbcGroup;                         // nucleated RBC fields
  wbc: WbcGroup;                           // WBC count + differentials
  abnormalPopulations: AbnormalPopulationsGroup;
  platelets: PlateletGroup;
  interpretations: InterpretationsGroup;
  generatedReport: string | null;          // finalized report text, null if not yet generated
}
```

### ReportInput (engine input -- reconstructed from Session + CaseData)

```typescript
interface ReportInput {
  metadata: ReportMetadata;    // date, caseId, signingPathologist, billingCode1, billingCode2
  hasAbnormalities: boolean | null;
  rbc: RbcGroup;
  nrbc: NrbcGroup;
  wbc: WbcGroup;
  abnormalPopulations: AbnormalPopulationsGroup;
  platelets: PlateletGroup;
  interpretations: InterpretationsGroup;
}
```

The `toReportInput(session.metadata, caseData)` function in `src/types/session.ts` merges session metadata with case data to produce a `ReportInput` for the engine.

---

## State Management

### Hook: `useSession()` (src/hooks/useSession.ts)

All application state lives in a single `useReducer` with the `Session` type. There is no React Context -- the hook is called once in `SessionManager` and props are drilled to children.

### Action Categories

The `SessionAction` discriminated union covers all state transitions:

**Session metadata actions** (update `session.metadata`):
- `SET_SESSION_DATE` -- date string
- `SET_SESSION_PATHOLOGIST` -- pathologist name
- `SET_SESSION_BILL1` -- billing code 1
- `SET_SESSION_BILL2` -- billing code 2

**Session flow actions**:
- `START_NEW_SESSION` -- resets to default state (new date, empty first case)
- `RESUME_SESSION` -- no-op, state already loaded from localStorage
- `ADD_CASE` -- appends a new empty case, sets it active
- `DELETE_CASE { index }` -- removes case at index (minimum 1 case enforced)
- `SELECT_CASE { index }` -- switches active case
- `RESET_CASE` -- clears the active case back to empty defaults (preserves its `id`)
- `SET_VIEW { view }` -- switches between 'editing' and 'summary'

**Case-level actions** (operate on `cases[activeCaseIndex]`):
- `SET_CASE_ID` -- case accession ID
- `SET_HAS_ABNORMALITIES` -- when set to `false`, clears all abnormality fields
- `SET_RBC_STATUS`, `SET_RBC_SIZE`, `SET_RBC_CHROMIA` -- RBC radio selections
- `TOGGLE_RBC_ADDITIONAL { field }` -- toggle boolean RBC findings; toggling poikilocytosis off clears all sub-findings and their quantifiers; toggling a sub-finding off clears its quantifier
- `SET_RBC_QUANTIFIER { field, value }` -- set quantifier (rare/few/occasional/increased/null) on a poikilocytosis sub-finding
- `SET_RBC_OTHER_TEXT` -- free-text RBC finding
- `TOGGLE_NRBC_INCREASED`, `TOGGLE_RETICULOCYTOSIS` -- NRBC toggles
- `SET_WBC_COUNT` -- WBC count category
- `TOGGLE_WBC_LEFT_SHIFT` -- WBC left shift toggle
- `TOGGLE_DIFFERENTIAL { diffType }` -- add/remove a differential
- `TOGGLE_DIFFERENTIAL_QUALIFIER { diffType, qualifier }` -- toggle absolute/relative
- `ADD_ABNORMAL_ENTRY`, `REMOVE_ABNORMAL_ENTRY { index }` -- manage abnormal population list
- `SET_ABNORMAL_AMOUNT_TYPE`, `SET_ABNORMAL_AMOUNT_VALUE`, `SET_ABNORMAL_POPULATION_TYPE` -- update abnormal entries
- `TOGGLE_NEUTROPHIL_MORPHOLOGY { index, morphology }` -- toggle neutrophil morphology (hyposegmented/hypersegmented/hypogranular) on an abnormal entry
- `SET_PLATELET_COUNT`, `TOGGLE_LARGE_PLATELETS`, `TOGGLE_PLATELET_CLUMPS` -- platelet fields
- `TOGGLE_INTERPRETATION { key }` -- toggle interpretation statements
- `SET_GENERATED_REPORT { text }` -- store finalized report text on the active case

### Reducer Pattern

All case-level actions use the `updateActiveCase(state, updater)` helper, which immutably updates the case at `activeCaseIndex`:

```typescript
function updateActiveCase(state: Session, updater: (c: CaseData) => CaseData): Session {
  const cases = [...state.cases];
  cases[state.activeCaseIndex] = updater(cases[state.activeCaseIndex]);
  return { ...state, cases };
}
```

### Abnormality Gate Behavior

When `SET_HAS_ABNORMALITIES` is dispatched with `value: false`, the `clearCaseAbnormalities()` function resets all clinical fields (rbc, nrbc, wbc, abnormalPopulations, platelets, interpretations) back to their empty defaults. This prevents stale data from appearing in the report when switching from abnormal to normal.

---

## Rendering Engine

Located in `src/engine/`. All functions are pure -- they take typed data and return strings.

### renderReport(input: ReportInput): string

Main orchestrator. Builds the report by concatenating sections separated by blank lines:

1. **Metadata header** (`renderMetadata`) -- Date (formatted M/D/YYYY), Case ID, Signing Pathologist
2. **Body** -- either "Within normal limits." (if `hasAbnormalities === false`) or finding lines:
   - `renderRbc()` -- RBC morphology line. Poikilocytosis sub-findings use "including" with quantifier-based ordering: unqualified first, then increased > occasional > few > rare; same-quantifier items are grouped (e.g., "few schistocytes and tear-drop cells"). Uses `formatSubFindings()` internally
   - `renderNrbc()` -- NRBC findings line (increased nucleated RBCs and/or reticulocytosis)
   - `renderWbc()` -- WBC count + optional left shift + differentials line
   - `renderAbnormalPopulations()` -- abnormal population entries
   - `renderPlatelets()` -- platelet findings line
3. **Interpretations** (`renderInterpretations`) -- newline-separated interpretation statements
4. **Footer** (`renderFooter`) -- Pathologist signature, billing codes

Each render function returns an empty string if its section has no data, and the orchestrator skips empty sections.

### Date Formatting

The `renderMetadata` function converts YYYY-MM-DD (from the HTML date picker) to M/D/YYYY format for the report output.

### Text Utilities (textUtils.ts)

Helper functions for formatting report text (e.g., joining lists with commas and "and").

---

## Component Architecture

### SessionManager (src/components/SessionManager.tsx)

The top-level orchestrator. Manages three states:

1. **Resume prompt**: Shown on first load if `localStorage` contains a saved session. Offers "Continue Session" or "Start New Session".
2. **Editing view**: Two-panel layout with `CaseSidebar` (left) + `SessionSetup` and `CaseEditor` (right).
3. **Summary view**: `SessionSummary` showing all finalized cases.

### SessionSetup (src/components/SessionSetup.tsx)

A 4-field form for session-wide metadata: Date (date picker), Signing Pathologist (text), Bill 1 (text, default "85060"), Bill 2 (text, default "R68.89"). Always visible above the case editor in editing view.

### CaseSidebar (src/components/CaseSidebar.tsx)

Left sidebar panel:
- Displays case count and list of all cases
- Each case shows its `caseId` (or "Case N" if empty) and a checkmark badge if `generatedReport` is non-null
- Click to switch active case (`SELECT_CASE`)
- Delete button per case (hidden when only 1 case remains)
- "New" button to add a case (`ADD_CASE`)
- "End Session & Generate Report" button at the bottom (`SET_VIEW` to 'summary')

### CaseEditor (src/components/CaseEditor.tsx)

The main case editing workspace. For the active case:
1. `MetadataSection` -- Case Accession ID input
2. `AbnormalityGate` -- Yes/No toggle for abnormalities
3. Conditionally rendered clinical groups (only when `hasAbnormalities === true`):
   - `RbcGroup`, `NrbcGroup`, `WbcGroup`, `AbnormalPopGroup`, `PlateletGroup`, `InterpretationGroup`
4. Action buttons: "Reset Case" and "Generate Report". The Generate Report button uses an IntersectionObserver to detect when it scrolls out of view, showing a sticky floating version pinned to the bottom of the viewport
5. `CaseReportPreview` -- shown after generation, with editable textarea

**Case switching**: Uses a `useRef` to track the previous case ID and `useEffect` to reset the preview text when switching cases.

**Report generation**: Calls `toReportInput(session.metadata, activeCase)` then `renderReport()` to produce the text. The preview text is stored in local component state until "Add to Report" is clicked, which dispatches `SET_GENERATED_REPORT`.

### CaseReportPreview (src/components/CaseReportPreview.tsx)

Displays the generated report text in an editable `<textarea>`. Actions:
- "Copy to clipboard" -- uses `navigator.clipboard.writeText()`
- "Add to Report" / "Added to Report" -- dispatches the text to session state. Shows visual confirmation when the stored report matches the current preview text.

### Clinical Group Components

These components are pure form renderers. They receive their data slice and a dispatch function, and render form controls. None have internal state:

- **AbnormalityGate**: Two radio-style buttons for Yes/No
- **RbcGroup**: Radio groups for status, size, chromia; checkboxes for anisocytosis/poikilocytosis. When poikilocytosis is selected, a sub-panel appears with a 2-column grid of clickable cards (schistocytes, elliptocytes, tear-drop cells, target cells) plus a free-text input. Each card displays the finding name (clickable toggle) and quantifier pills (Rare, Few, Occ., Incr.) as clickable buttons -- no checkboxes or radios. Clicking a quantifier enables the finding with that amount; clicking the name enables without quantifier. The free-text row has a white background card at half-width with inline quantifier pills that appear when text is entered
- **NrbcGroup**: Checkboxes for increased NRBCs and reticulocytosis
- **WbcGroup**: Radio group for count category; left shift checkbox; checkboxes for differentials with nested absolute/relative qualifier checkboxes. Left shift is rendered as "a left-shift" in the WBC line before differentials
- **AbnormalPopGroup**: Dynamic list with add/remove; each entry has amount type selector (qualitative dropdown or percentage input) and population type selector (blasts, atypical lymphocytes, blastoid forms, immature forms, neutrophils, free-text). When "neutrophils" is selected, a multi-select appears for morphology descriptors (hyposegmented, hypersegmented, hypogranular)
- **PlateletGroup**: Radio group for count; checkboxes for large platelets and clumps
- **InterpretationGroup**: Checkbox grid of pre-defined interpretation statements from `constants/interpretations.ts`. Clinical correlation is selected by default when abnormalities are first toggled on

### MetadataSection (src/components/MetadataSection.tsx)

Renders only the Case Accession ID input field. Session-level metadata (date, pathologist, billing) is handled by `SessionSetup`.

---

## View Routing

There is no client-side router. The `SessionManager` component uses the `session.view` field ('editing' | 'summary') plus local state for the resume prompt to determine which view to render. View transitions are triggered by dispatching `SET_VIEW` actions.

---

## Data Persistence

### localStorage Strategy

- **Key**: `pbs-session`
- **Save**: On every state change via `useEffect` in `useSession()` hook
- **Load**: On initial hook instantiation -- if `localStorage` has data, it's parsed and used as initial state; otherwise a fresh default session is created
- **Clear**: `clearSaved()` removes the key (called when "Start New Session" is chosen from the resume prompt)

### Data Size

Each session stores all case form states plus generated report text as JSON. For typical usage (dozens of cases), this is well within the ~5MB `localStorage` limit.

### Resume Prompt

`hasSavedSession()` checks if the storage key exists. `SessionManager` shows the resume prompt only on first load when saved data is detected.

---

## Print / PDF Generation

Located in `SessionSummary.handlePrint()`. Uses `window.open()` to create a new browser tab with a complete HTML document:

### Structure
1. **Cover page**: Title ("Peripheral Blood Smears"), date, case count, pathologist name. Centered vertically, fills one printed page.
2. **Case pages**: One page per case with the full report text in `<pre>` tags (monospace).

### CSS
- `@page { margin: 0.75in; size: letter; }` -- letter-size pages
- `page-break-after: always` on cover page and each case page
- Courier New monospace font at 11pt with 1.6 line-height
- `white-space: pre-wrap` on report text for wrapping

### Security
HTML content is escaped via `escHtml()` to prevent XSS from user-entered text.

---

## Validation

Located in `src/validation/validateInput.ts`. Two main exports:

### canGenerateReport(input: ReportInput): boolean
- Returns `false` if `hasAbnormalities` is `null`
- Returns `true` if `hasAbnormalities` is `false` (normal report)
- For abnormal reports, requires at least one valid reportable group (any non-empty field in RBC, NRBC, WBC, abnormal populations, platelets, or interpretations)

### isGenerateDisabled(input: ReportInput): boolean
- Returns `true` if `hasAbnormalities` is `null`
- Returns `true` if any WBC differential is toggled but has neither absolute nor relative qualifier selected
- Returns `true` if `canGenerateReport()` returns `false`

Note: The current `CaseEditor` uses a simpler check (`hasAbnormalities !== null`) to enable the Generate button, rather than the full validation. The validation module is available for stricter enforcement if needed.

---

## Type System

All types are in `src/types/` with a barrel export from `index.ts`.

### Core Clinical Types

| File | Types | Purpose |
|------|-------|---------|
| `rbc.ts` | `RbcStatus`, `RbcSize`, `RbcChromia`, `PoikilocytosisQuantifier`, `RbcAdditionalFindings`, `RbcGroup` | RBC morphology |
| `nrbc.ts` | `NrbcGroup` | Nucleated RBC findings |
| `wbc.ts` | `WbcCountCategory`, `DifferentialType`, `DifferentialAbnormality`, `WbcGroup` | WBC + differentials |
| `abnormalPopulations.ts` | `AmountType`, `NeutrophilMorphology`, `AbnormalEntry`, `AbnormalPopulationsGroup` | Abnormal populations |
| `platelets.ts` | `PlateletCount`, `PlateletGroup` | Platelet findings |
| `interpretations.ts` | `InterpretationKey`, `InterpretationsGroup` | Clinical interpretations |
| `metadata.ts` | `ReportMetadata` | Per-report metadata (engine input) |
| `report.ts` | `ReportInput` | Complete engine input type |
| `session.ts` | `SessionMetadata`, `CaseData`, `Session`, `toReportInput()` | Session state model |

### Action Types

`SessionAction` is defined in `src/hooks/useSession.ts` as a discriminated union covering all 37+ state transitions.

---

## Styling

All styles are in `src/App.css`. The design uses:

- **CSS custom properties** for theming (colors, spacing, border-radius)
- **Material Symbols Outlined** icon font for UI icons
- **Manrope** as the primary display font
- **Flexbox** layout throughout
- **No CSS modules or CSS-in-JS** -- single global stylesheet

### Key Layout Classes

| Class | Purpose |
|-------|---------|
| `.session-layout` | Two-column flex: sidebar + main content |
| `.case-sidebar` | Fixed-width left panel with case list |
| `.session-main` | Right panel containing setup + editor |
| `.case-editor` | Case editing form container |
| `.report-preview` | Generated report preview area |
| `.session-summary` | Summary view container |
| `.resume-prompt` | Session resume dialog overlay |
| `.form-actions-sticky` | Sticky Generate Report button pinned to viewport bottom |
| `.poik-grid` | 2-column grid for poikilocytosis finding cards |
| `.poik-card` | Individual finding card (name + quantifier pills) |
| `.poik-pill` | Clickable quantifier pill button |
| `.poik-other-wrapper` | Free-text finding row with white background |

---

## Build & Tooling

| Tool | Version | Purpose |
|------|---------|---------|
| Vite | 8.x | Dev server, HMR, production builds |
| TypeScript | 5.9 | Type checking (`tsc -b` runs before build) |
| ESLint | 9.x | Linting with React hooks + refresh plugins |
| Vitest | 4.x | Test runner (no test files currently in src/) |
| React | 19.x | UI framework |

### Scripts

```bash
npm run dev       # Start dev server with HMR
npm run build     # TypeScript check + production build
npm run lint      # Run ESLint
npm run preview   # Serve production build locally
```

### No External Runtime Dependencies

The only runtime dependencies are `react` and `react-dom`. Everything else (state management, routing, styling, persistence) is implemented from scratch.
