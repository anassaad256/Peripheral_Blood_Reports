import type { RbcGroup } from '../types';
import { formatList, formatLine } from './textUtils';

export function renderRbc(rbc: RbcGroup): string {
  const hasStatus = rbc.status !== null;
  const hasSize = rbc.size !== null;
  const hasChromia = rbc.chromia !== null;
  const additionalItems = getAdditionalFindings(rbc);
  const hasAdditional = additionalItems.length > 0;

  if (!hasStatus && !hasSize && !hasChromia && !hasAdditional) {
    return '';
  }

  // Build descriptor (size and/or chromia)
  const descriptors: string[] = [];
  if (hasSize) descriptors.push(rbc.size!);
  if (hasChromia) descriptors.push(rbc.chromia!);

  // Determine anchor
  let anchor = '';
  if (hasStatus) {
    anchor = rbc.status!;
  } else if (descriptors.length > 0) {
    anchor = 'RBCs';
  }

  // Build the descriptor+anchor part
  let mainPart = '';
  if (anchor) {
    if (descriptors.length > 0) {
      mainPart = `${descriptors.join(' ')} ${anchor}`;
    } else {
      mainPart = anchor;
    }
  }

  // Build additional findings string
  const additionalStr = formatList(additionalItems);

  // Join
  let line = '';
  if (mainPart && additionalStr) {
    line = `${mainPart} with ${additionalStr}`;
  } else if (mainPart) {
    line = mainPart;
  } else {
    line = additionalStr;
  }

  return formatLine(line);
}

function getAdditionalFindings(rbc: RbcGroup): string[] {
  const items: string[] = [];
  const a = rbc.additional;

  // Derived: anisocytosis + poikilocytosis = anisopoikilocytosis
  if (a.anisocytosis && a.poikilocytosis) {
    items.push('anisopoikilocytosis');
  } else {
    if (a.anisocytosis) items.push('anisocytosis');
    if (a.poikilocytosis) items.push('poikilocytosis');
  }

  if (a.schistocytes) items.push('schistocytes');
  if (a.tearDropCells) items.push('tear-drop cells');
  if (a.targetCells) items.push('target cells');
  if (a.elliptocytes) items.push('elliptocytes');
  if (a.otherText.trim()) items.push(a.otherText.trim());

  return items;
}
