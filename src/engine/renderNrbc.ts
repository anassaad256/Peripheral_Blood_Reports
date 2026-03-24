import type { NrbcGroup } from '../types';
import { formatLine } from './textUtils';

export function renderNrbc(nrbc: NrbcGroup): string {
  const items: string[] = [];
  if (nrbc.increasedNucleatedRbcs) items.push('increased nucleated RBCs');
  if (nrbc.reticulocytosis) items.push('reticulocytosis');

  if (items.length === 0) return '';
  return formatLine(items.join(' and '));
}
