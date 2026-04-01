import type { ReportInput } from '../types';

export function canGenerateReport(input: ReportInput): boolean {
  if (input.hasAbnormalities === null) return false;
  if (input.hasAbnormalities === false) return true;

  // hasAbnormalities === true: need at least one valid reportable group
  return hasValidRbc(input) ||
    hasValidNrbc(input) ||
    hasValidWbc(input) ||
    hasValidAbnormalPopulations(input) ||
    hasValidPlatelets(input) ||
    hasValidInterpretations(input);
}

function hasValidRbc(input: ReportInput): boolean {
  const { rbc } = input;
  return rbc.status !== null ||
    rbc.size !== null ||
    rbc.chromia !== null ||
    rbc.additional.anisocytosis ||
    rbc.additional.poikilocytosis ||
    rbc.additional.schistocytes ||
    rbc.additional.tearDropCells ||
    rbc.additional.targetCells ||
    rbc.additional.elliptocytes ||
    rbc.additional.otherText.trim().length > 0;
}

function hasValidNrbc(input: ReportInput): boolean {
  return input.nrbc.nucleatedRbcs || input.nrbc.reticulocytosis;
}

function hasValidWbc(input: ReportInput): boolean {
  const { wbc } = input;
  // WBC count alone is valid
  if (wbc.countCategory !== null) return true;
  if (wbc.leftShift) return true;
  // Differentials need at least one qualifier to be valid
  return wbc.differentials.some((d) => d.absolute || d.relative);
}

export function hasIncompleteWbcDifferentials(input: ReportInput): boolean {
  return input.wbc.differentials.some((d) => !d.absolute && !d.relative);
}

function hasValidAbnormalPopulations(input: ReportInput): boolean {
  return input.abnormalPopulations.entries.some((e) => {
    if (!e.amountValue.trim()) return false;
    if (e.populationType === 'neutrophils') return e.neutrophilMorphologies.length > 0;
    return e.populationType.trim().length > 0;
  });
}

function hasValidPlatelets(input: ReportInput): boolean {
  return input.platelets.count !== null ||
    input.platelets.largePlatelets ||
    input.platelets.plateletClumps;
}

function hasValidInterpretations(input: ReportInput): boolean {
  return input.interpretations.selected.length > 0;
}

export function isGenerateDisabled(input: ReportInput): boolean {
  if (input.hasAbnormalities === null) return true;
  if (hasIncompleteWbcDifferentials(input)) return true;
  return !canGenerateReport(input);
}
