# Peripheral Blood Smear Report Generator

> **Last updated:** 2026-03-30

A deterministic, rule-based peripheral blood smear report generator built with React, TypeScript, and Vite. Designed for pathology workflows where multiple cases are reviewed in a single session.

## Overview

Converts structured form inputs into standardized pathology report text. All output is traceable to explicit inputs, derived states, and fixed rendering rules -- no AI/LLM involved.

## Features

### Multi-Case Session Workflow
- **Session-based design**: Set session-wide metadata (date, pathologist, billing codes) once; it applies to all cases in the session
- **Case sidebar**: Add, switch between, delete, and track multiple cases from a persistent sidebar panel
- **Per-case reports**: Generate, preview, edit, and confirm report text for each case independently
- **Session summary**: Review all completed case reports in one view; print a multi-page PDF with a cover page and page breaks between cases

### Clinical Report Builder
- **Abnormality gate**: Quick toggle between normal ("Within normal limits") and abnormal smear paths
- **RBC morphology**: Status (anemia/polycythemia), size, chromia, plus additional findings:
  - **Anisocytosis / Poikilocytosis**: Primary checkboxes; selecting poikilocytosis reveals a sub-findings panel
  - **Poikilocytosis findings**: Schistocytes, elliptocytes, tear-drop cells, target cells, and free-text -- displayed as a 2-column grid of clickable cards. Each card has optional quantifier pills (Rare, Few, Occasional, Increased) that double as selection toggles. Clicking a quantifier enables the finding and sets the amount; clicking the finding name enables it without a quantifier
  - **Rendering**: Anisocytosis + poikilocytosis merges to "anisopoikilocytosis"; sub-findings use "including" (e.g., "anisopoikilocytosis including few schistocytes and rare elliptocytes"). Sub-findings are ordered: unqualified first, then by quantifier priority (increased > occasional > few > rare), with same-quantifier items grouped together
- **NRBC / Reticulocytosis**: Increased nucleated RBCs, reticulocytosis -- joined with "and" when both selected
- **WBC**: Count category (leukocytosis/normal/leukopenia), left shift, and differential abnormalities (neutropenia, neutrophilia, lymphopenia, lymphocytosis, monocytopenia, monocytosis, eosinophilia, basophilia) -- each with absolute/relative qualifiers. Left shift integrates into the WBC line (e.g., "leukocytosis with a left-shift, neutrophilia...")
- **Abnormal populations**: Dynamic list of entries with qualitative or percentage-based amounts; population types include blasts, atypical lymphocytes, blastoid forms, immature forms, neutrophil morphology (hyposegmented/hypersegmented/hypogranular -- multi-select), and free-text
- **Platelet assessment**: Count category, large platelets, platelet clumps
- **Clinical interpretations**: Pre-defined interpretation statements (flow cytometry, reactive changes, iron deficiency, B12/folate deficiency, acute leukemia, CLL, degenerating specimen, clinical correlation, hematology consult). Clinical correlation is selected by default

### Report Output
- **Deterministic rendering**: Same inputs always produce the same report text
- **Editable preview**: Generated text can be manually edited before finalizing
- **Copy to clipboard**: One-click copy of report text
- **Sticky Generate Report button**: Floats at the bottom of the viewport when the static button is scrolled out of view; auto-scrolls to the generated report on click
- **Multi-case PDF printing**: Cover page + one page per case, monospace formatting, letter-size pages

### Data Persistence
- **localStorage auto-save**: Session state is automatically saved on every change
- **Session resume**: On return, prompts to continue a previous session or start fresh

## Getting Started

```bash
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

## Build

```bash
npm run build        # TypeScript check + Vite production build
npm run preview      # Preview the production build locally
```

## Tech Stack

- **React 19** + **TypeScript 5.9**
- **Vite 8** (build tooling)
- **Vitest 4** (testing)
- No external UI library -- custom CSS with Material Symbols icons

## Project Structure

```
src/
├── components/         # React UI components
│   ├── SessionManager.tsx    # Top-level view router (resume prompt, editing, summary)
│   ├── SessionSetup.tsx      # Session metadata form (date, pathologist, billing)
│   ├── CaseSidebar.tsx       # Left sidebar with case list and navigation
│   ├── CaseEditor.tsx        # Main case editing form with report generation
│   ├── CaseReportPreview.tsx # Editable report preview with add/copy actions
│   ├── SessionSummary.tsx    # All-cases summary view with print
│   ├── MetadataSection.tsx   # Case accession ID input
│   ├── AbnormalityGate.tsx   # Normal vs abnormal toggle
│   ├── RbcGroup.tsx          # RBC morphology fields
│   ├── NrbcGroup.tsx         # NRBC fields
│   ├── WbcGroup.tsx          # WBC count + differentials
│   ├── AbnormalPopGroup.tsx  # Abnormal populations list
│   ├── PlateletGroup.tsx     # Platelet fields
│   └── InterpretationGroup.tsx # Clinical interpretations
├── hooks/
│   ├── useSession.ts         # Session reducer, localStorage persistence, all actions
│   └── useReportState.ts     # Legacy single-case reducer (no longer used in main app)
├── engine/                   # Deterministic report text rendering
│   ├── renderReport.ts       # Main rendering orchestrator
│   ├── renderMetadata.ts     # Header: date, case ID, pathologist
│   ├── renderRbc.ts          # RBC morphology line
│   ├── renderNrbc.ts         # NRBC line
│   ├── renderWbc.ts          # WBC + differentials line
│   ├── renderAbnormalPopulations.ts
│   ├── renderPlatelets.ts    # Platelet line
│   ├── renderInterpretations.ts
│   ├── renderFooter.ts       # Footer: pathologist signature, billing codes
│   └── textUtils.ts          # Text formatting helpers
├── types/                    # TypeScript type definitions
│   ├── session.ts            # Session, CaseData, SessionMetadata, toReportInput()
│   ├── report.ts             # ReportInput (engine input type)
│   ├── metadata.ts           # ReportMetadata
│   ├── rbc.ts, wbc.ts, nrbc.ts, platelets.ts, abnormalPopulations.ts, interpretations.ts
│   └── index.ts              # Barrel export
├── constants/
│   └── interpretations.ts    # Interpretation statements, labels, display order
├── validation/
│   └── validateInput.ts      # Report generation validation logic
├── App.tsx                   # Root component (header + SessionManager)
├── App.css                   # All application styles
└── main.tsx                  # Vite entry point
```

## Workflow

1. **Session setup**: On load, configure date, signing pathologist, and billing codes (shared across all cases)
2. **Case editing**: For each case, enter the Case Accession ID, select abnormality findings, and generate the report
3. **Add to report**: Review and optionally edit the generated text, then click "Add to Report" to finalize
4. **Repeat**: Add more cases via the sidebar; switch between cases freely (state is preserved)
5. **Session summary**: Click "End Session & Generate Report" to see all finalized cases
6. **Print**: Generate a multi-page PDF with cover page and individual case reports
