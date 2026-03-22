import type { NrbcGroup } from '../types';

export function renderNrbc(nrbc: NrbcGroup): string {
  if (nrbc.increasedNucleatedRbcs && nrbc.leftShift) {
    return 'Leukoerythroblastosis.';
  }
  if (nrbc.increasedNucleatedRbcs) {
    return 'Increased nucleated RBCs.';
  }
  if (nrbc.leftShift) {
    return 'Left shift.';
  }
  return '';
}
