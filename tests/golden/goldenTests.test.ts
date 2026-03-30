import { describe, test, expect } from 'vitest';
import { renderReport } from '../../src/engine/renderReport';
import { ReportInput } from '../../src/types';

function emptyInput(overrides: Partial<ReportInput> = {}): ReportInput {
  return {
    metadata: { date: '', caseId: '', signingPathologist: '', billingCode1: '', billingCode2: '' },
    hasAbnormalities: null,
    rbc: {
      status: null,
      size: null,
      chromia: null,
      additional: {
        anisocytosis: false,
        poikilocytosis: false,
        schistocytes: false,
        schistocytesQuantifier: null,
        tearDropCells: false,
        tearDropCellsQuantifier: null,
        targetCells: false,
        targetCellsQuantifier: null,
        elliptocytes: false,
        elliptocytesQuantifier: null,
        otherText: '',
        otherTextQuantifier: null,
      },
    },
    nrbc: { increasedNucleatedRbcs: false, reticulocytosis: false },
    wbc: { countCategory: null, leftShift: false, differentials: [] },
    abnormalPopulations: { entries: [] },
    platelets: { count: null, largePlatelets: false, plateletClumps: false },
    interpretations: { selected: [] },
    ...overrides,
  };
}

describe('Golden Tests', () => {
  test('Test 1 — Within normal limits', () => {
    const input = emptyInput({ hasAbnormalities: false });
    expect(renderReport(input)).toBe('Within normal limits.');
  });

  test('Test 2 — RBC morphology only', () => {
    const input = emptyInput({
      hasAbnormalities: true,
      rbc: {
        status: null,
        size: null,
        chromia: null,
        additional: {
          anisocytosis: true,
          poikilocytosis: false,
          schistocytes: false, schistocytesQuantifier: null,
          tearDropCells: false, tearDropCellsQuantifier: null,
          targetCells: false, targetCellsQuantifier: null,
          elliptocytes: false, elliptocytesQuantifier: null,
          otherText: '', otherTextQuantifier: null,
        },
      },
    });
    expect(renderReport(input)).toBe('Anisocytosis.');
  });

  test('Test 3 — RBC descriptor without status', () => {
    const input = emptyInput({
      hasAbnormalities: true,
      rbc: {
        status: null,
        size: 'macrocytic',
        chromia: null,
        additional: {
          anisocytosis: false,
          poikilocytosis: false,
          schistocytes: false, schistocytesQuantifier: null,
          tearDropCells: false, tearDropCellsQuantifier: null,
          targetCells: false, targetCellsQuantifier: null,
          elliptocytes: false, elliptocytesQuantifier: null,
          otherText: '', otherTextQuantifier: null,
        },
      },
    });
    expect(renderReport(input)).toBe('Macrocytic RBCs.');
  });

  test('Test 4 — RBC derived state (no quantifiers)', () => {
    const input = emptyInput({
      hasAbnormalities: true,
      rbc: {
        status: null,
        size: 'macrocytic',
        chromia: null,
        additional: {
          anisocytosis: true,
          poikilocytosis: true,
          schistocytes: true, schistocytesQuantifier: null,
          tearDropCells: false, tearDropCellsQuantifier: null,
          targetCells: false, targetCellsQuantifier: null,
          elliptocytes: false, elliptocytesQuantifier: null,
          otherText: '', otherTextQuantifier: null,
        },
      },
    });
    expect(renderReport(input)).toBe(
      'Macrocytic RBCs with anisopoikilocytosis including schistocytes.'
    );
  });

  test('Test 5 — WBC count only', () => {
    const input = emptyInput({
      hasAbnormalities: true,
      wbc: { countCategory: 'leukopenia', leftShift: false, differentials: [] },
    });
    expect(renderReport(input)).toBe('Leukopenia.');
  });

  test('Test 6 — WBC differential only', () => {
    const input = emptyInput({
      hasAbnormalities: true,
      wbc: {
        countCategory: null,
        leftShift: false,
        differentials: [
          { type: 'lymphocytosis', absolute: true, relative: false },
        ],
      },
    });
    expect(renderReport(input)).toBe('Normal WBC count with absolute lymphocytosis.');
  });

  test('Test 7 — WBC count plus differential', () => {
    const input = emptyInput({
      hasAbnormalities: true,
      wbc: {
        countCategory: 'leukocytosis',
        leftShift: false,
        differentials: [
          { type: 'neutrophilia', absolute: true, relative: true },
          { type: 'lymphopenia', absolute: true, relative: false },
        ],
      },
    });
    expect(renderReport(input)).toBe(
      'Leukocytosis with neutrophilia and absolute lymphopenia.'
    );
  });

  test('Test 8 — Increased nucleated RBCs and reticulocytosis', () => {
    const input = emptyInput({
      hasAbnormalities: true,
      nrbc: { increasedNucleatedRbcs: true, reticulocytosis: true },
    });
    expect(renderReport(input)).toBe('Increased nucleated RBCs and reticulocytosis.');
  });

  test('Test 9 — Abnormal populations', () => {
    const input = emptyInput({
      hasAbnormalities: true,
      abnormalPopulations: {
        entries: [
          { amountType: 'numeric', amountValue: '4-5', populationType: 'blasts', neutrophilMorphologies: [] },
          { amountType: 'qualitative', amountValue: 'increased', populationType: 'atypical lymphocytes', neutrophilMorphologies: [] },
        ],
      },
    });
    expect(renderReport(input)).toBe(
      'About 4-5% blasts present.\nIncreased atypical lymphocytes present.'
    );
  });

  test('Test 10 — Platelet morphology only', () => {
    const input = emptyInput({
      hasAbnormalities: true,
      platelets: { count: null, largePlatelets: true, plateletClumps: true },
    });
    expect(renderReport(input)).toBe('Large platelets and platelet clumps.');
  });

  test('Test 11 — Interpretation lines', () => {
    const input = emptyInput({
      hasAbnormalities: true,
      interpretations: { selected: ['flow', 'hematology_consult'] },
    });
    expect(renderReport(input)).toBe(
      'Flow cytometry is recommended.\nHematology consultation is recommended.'
    );
  });

  test('Test 12 — Full formatted case', () => {
    const input = emptyInput({
      metadata: {
        date: '3/22/2026',
        caseId: 'PBS-26-1042',
        signingPathologist: 'Anas Saad, MD',
        billingCode1: '85060',
        billingCode2: 'R68.89',
      },
      hasAbnormalities: true,
      rbc: {
        status: null,
        size: 'macrocytic',
        chromia: null,
        additional: {
          anisocytosis: true,
          poikilocytosis: true,
          schistocytes: true, schistocytesQuantifier: null,
          tearDropCells: false, tearDropCellsQuantifier: null,
          targetCells: false, targetCellsQuantifier: null,
          elliptocytes: false, elliptocytesQuantifier: null,
          otherText: '', otherTextQuantifier: null,
        },
      },
      wbc: {
        countCategory: 'leukocytosis',
        leftShift: false,
        differentials: [
          { type: 'neutrophilia', absolute: true, relative: true },
          { type: 'lymphopenia', absolute: true, relative: false },
        ],
      },
      platelets: { count: 'thrombocytopenia', largePlatelets: true, plateletClumps: false },
      interpretations: { selected: ['flow', 'hematology_consult'] },
    });

    const expected = [
      'Date: 3/22/2026',
      'Case ID: PBS-26-1042',
      'Signing pathologist: Anas Saad, MD',
      '',
      'Macrocytic RBCs with anisopoikilocytosis including schistocytes.',
      'Leukocytosis with neutrophilia and absolute lymphopenia.',
      'Thrombocytopenia with large platelets.',
      '',
      'Flow cytometry is recommended.',
      'Hematology consultation is recommended.',
      '',
      'Pathologist signature: Anas Saad, MD',
      '85060',
      'R68.89',
    ].join('\n');

    expect(renderReport(input)).toBe(expected);
  });

  test('Test 13 — WBC with left shift', () => {
    const input = emptyInput({
      hasAbnormalities: true,
      wbc: {
        countCategory: 'leukocytosis',
        leftShift: true,
        differentials: [
          { type: 'neutrophilia', absolute: true, relative: true },
        ],
      },
    });
    expect(renderReport(input)).toBe(
      'Leukocytosis with a left-shift and neutrophilia.'
    );
  });

  test('Test 14 — Neutrophil morphology in abnormal populations', () => {
    const input = emptyInput({
      hasAbnormalities: true,
      abnormalPopulations: {
        entries: [
          { amountType: 'qualitative', amountValue: 'occasional', populationType: 'neutrophils', neutrophilMorphologies: ['hypersegmented', 'hypogranular'] },
        ],
      },
    });
    expect(renderReport(input)).toBe(
      'Occasional hypersegmented and hypogranular neutrophils present.'
    );
  });

  test('Test 15 — NRBC reticulocytosis only', () => {
    const input = emptyInput({
      hasAbnormalities: true,
      nrbc: { increasedNucleatedRbcs: false, reticulocytosis: true },
    });
    expect(renderReport(input)).toBe('Reticulocytosis.');
  });

  test('Test 16 — Poikilocytosis with single quantifier', () => {
    const input = emptyInput({
      hasAbnormalities: true,
      rbc: {
        status: null,
        size: null,
        chromia: null,
        additional: {
          anisocytosis: true,
          poikilocytosis: true,
          schistocytes: true, schistocytesQuantifier: 'few',
          tearDropCells: false, tearDropCellsQuantifier: null,
          targetCells: false, targetCellsQuantifier: null,
          elliptocytes: false, elliptocytesQuantifier: null,
          otherText: '', otherTextQuantifier: null,
        },
      },
    });
    expect(renderReport(input)).toBe(
      'Anisopoikilocytosis including few schistocytes.'
    );
  });

  test('Test 17 — Poikilocytosis with mixed quantifiers (unqualified first, then by priority)', () => {
    const input = emptyInput({
      hasAbnormalities: true,
      rbc: {
        status: null,
        size: null,
        chromia: null,
        additional: {
          anisocytosis: false,
          poikilocytosis: true,
          schistocytes: true, schistocytesQuantifier: 'rare',
          tearDropCells: true, tearDropCellsQuantifier: null,
          targetCells: false, targetCellsQuantifier: null,
          elliptocytes: false, elliptocytesQuantifier: null,
          otherText: '', otherTextQuantifier: null,
        },
      },
    });
    expect(renderReport(input)).toBe(
      'Poikilocytosis including tear-drop cells and rare schistocytes.'
    );
  });

  test('Test 18 — Anisopoikilocytosis with multiple quantifier groups', () => {
    const input = emptyInput({
      hasAbnormalities: true,
      rbc: {
        status: null,
        size: null,
        chromia: null,
        additional: {
          anisocytosis: true,
          poikilocytosis: true,
          schistocytes: true, schistocytesQuantifier: 'few',
          tearDropCells: true, tearDropCellsQuantifier: 'few',
          targetCells: false, targetCellsQuantifier: null,
          elliptocytes: true, elliptocytesQuantifier: 'increased',
          otherText: '', otherTextQuantifier: null,
        },
      },
    });
    expect(renderReport(input)).toBe(
      'Anisopoikilocytosis including increased elliptocytes and few schistocytes and tear-drop cells.'
    );
  });

  test('Test 19 — Anisopoikilocytosis with unqualified and qualified mixed', () => {
    const input = emptyInput({
      hasAbnormalities: true,
      rbc: {
        status: null,
        size: null,
        chromia: null,
        additional: {
          anisocytosis: true,
          poikilocytosis: true,
          schistocytes: true, schistocytesQuantifier: null,
          tearDropCells: false, tearDropCellsQuantifier: null,
          targetCells: true, targetCellsQuantifier: 'occasional',
          elliptocytes: false, elliptocytesQuantifier: null,
          otherText: '', otherTextQuantifier: null,
        },
      },
    });
    expect(renderReport(input)).toBe(
      'Anisopoikilocytosis including schistocytes and occasional target cells.'
    );
  });
});
