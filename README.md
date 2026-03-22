# Peripheral Blood Smear Report Generator

A deterministic, rule-based peripheral blood smear report generator built with React, TypeScript, and Vite.

## Overview

Converts structured form inputs into standardized pathology report text. All output is traceable to explicit inputs, derived states, and fixed rendering rules — no AI/LLM involved.

### Features

- **CBC Parameters**: WBC count, RBC morphology, platelet assessment
- **WBC Differentials**: With qualifier support (absolute, relative, or both)
- **Abnormal Populations**: Configurable entries with amount and type
- **Clinical Interpretations**: Pre-defined interpretation statements
- **Report Metadata**: Date, case ID, signing pathologist, billing codes
- **Deterministic Output**: Same inputs always produce the same report text

## Getting Started

```bash
npm install
npm run dev
```

## Testing

```bash
npx vitest run
```

All 12 golden tests validate exact string output against expected report text.

## Tech Stack

- React + TypeScript
- Vite (build tooling)
- Vitest (testing)
