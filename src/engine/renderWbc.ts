import type { WbcGroup, DifferentialAbnormality } from '../types';
import { formatList, formatLine } from './textUtils';

// Whether a differential type represents an elevated cell count (cytosis/philia)
function isCytosis(type: string): boolean {
  return type.endsWith('philia') || type.endsWith('cytosis');
}

function renderDifferentialLabel(diff: DifferentialAbnormality): string {
  const bothQualifiers = diff.absolute && diff.relative;
  if (bothQualifiers) {
    return diff.type;
  }
  if (diff.absolute) {
    return `absolute ${diff.type}`;
  }
  return `relative ${diff.type}`;
}

function qualifierGroup(diff: DifferentialAbnormality): number {
  if (diff.absolute && diff.relative) return 0; // both
  if (diff.absolute) return 1; // absolute only
  return 2; // relative only
}

function sortDifferentials(
  diffs: DifferentialAbnormality[],
  countCategory: string | null
): DifferentialAbnormality[] {
  // Assign indices to preserve user selection order as tertiary sort
  const indexed = diffs.map((d, i) => ({ diff: d, userIndex: i }));

  indexed.sort((a, b) => {
    // Primary: qualifier group
    const qA = qualifierGroup(a.diff);
    const qB = qualifierGroup(b.diff);
    if (qA !== qB) return qA - qB;

    // Secondary: count-sensitive ordering
    if (countCategory === 'leukocytosis') {
      // cytoses before penias
      const aCyt = isCytosis(a.diff.type) ? 0 : 1;
      const bCyt = isCytosis(b.diff.type) ? 0 : 1;
      if (aCyt !== bCyt) return aCyt - bCyt;
    } else if (countCategory === 'leukopenia') {
      // penias before cytoses
      const aCyt = isCytosis(a.diff.type) ? 1 : 0;
      const bCyt = isCytosis(b.diff.type) ? 1 : 0;
      if (aCyt !== bCyt) return aCyt - bCyt;
    }

    // Tertiary: user selection order
    return a.userIndex - b.userIndex;
  });

  return indexed.map((x) => x.diff);
}

export function renderWbc(wbc: WbcGroup): string {
  const hasCount = wbc.countCategory !== null;
  // Only include differentials that have at least one qualifier
  const validDiffs = wbc.differentials.filter((d) => d.absolute || d.relative);
  const hasDiffs = validDiffs.length > 0;

  if (!hasCount && !hasDiffs) {
    return '';
  }

  const countLabel = wbc.countCategory === 'normal_wbc_count'
    ? 'normal WBC count'
    : wbc.countCategory ?? '';

  const sorted = sortDifferentials(validDiffs, wbc.countCategory);
  const diffLabels = sorted.map(renderDifferentialLabel);
  const diffStr = formatList(diffLabels);

  let line = '';
  if (hasCount && hasDiffs) {
    line = `${countLabel} with ${diffStr}`;
  } else if (hasCount) {
    line = countLabel;
  } else {
    line = diffStr;
  }

  return formatLine(line);
}
