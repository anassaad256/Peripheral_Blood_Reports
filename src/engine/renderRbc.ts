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

  // Collect poikilocytosis sub-findings
  const subFindings: string[] = [];
  if (a.schistocytes) subFindings.push('schistocytes');
  if (a.tearDropCells) subFindings.push('tear-drop cells');
  if (a.targetCells) subFindings.push('target cells');
  if (a.elliptocytes) subFindings.push('elliptocytes');
  if (a.otherText.trim()) subFindings.push(a.otherText.trim());

  // Derived: anisocytosis + poikilocytosis = anisopoikilocytosis
  if (a.anisocytosis && a.poikilocytosis) {
    if (subFindings.length > 0) {
      items.push(`anisopoikilocytosis including ${formatList(subFindings)}`);
    } else {
      items.push('anisopoikilocytosis');
    }
  } else {
    if (a.anisocytosis) items.push('anisocytosis');
    if (a.poikilocytosis) {
      if (subFindings.length > 0) {
        items.push(`poikilocytosis including ${formatList(subFindings)}`);
      } else {
        items.push('poikilocytosis');
      }
    } else {
      // No poikilocytosis — sub-findings added individually
      items.push(...subFindings);
    }
  }

  return items;
}
