import type { NrbcGroup } from '../types';
import { formatLine } from './textUtils';

export function renderNrbc(nrbc: NrbcGroup): string {
  const items: string[] = [];
  if (nrbc.nucleatedRbcs) {
    if (nrbc.nucleatedRbcsQuantifier) {
      items.push(`${nrbc.nucleatedRbcsQuantifier} nucleated RBCs`);
    } else {
      items.push('nucleated RBCs seen');
    }
  }
  if (nrbc.reticulocytosis) items.push('reticulocytosis');

  if (items.length === 0) return '';
  if (nrbc.nucleatedRbcs && nrbc.reticulocytosis && !nrbc.nucleatedRbcsQuantifier) {
    return formatLine('nucleated RBCs seen with reticulocytosis');
  }
  return formatLine(items.join(' and '));
}
