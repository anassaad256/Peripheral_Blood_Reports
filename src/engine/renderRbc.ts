import type { RbcGroup, PoikilocytosisQuantifier } from '../types';
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

// Quantifier display order: no quantifier first, then increased, occasional, few, rare
const QUANTIFIER_ORDER: (PoikilocytosisQuantifier)[] = [null, 'increased', 'occasional', 'few', 'rare'];

interface SubFinding {
  name: string;
  quantifier: PoikilocytosisQuantifier;
}

/**
 * Groups sub-findings by quantifier and renders them in order:
 * 1. Items with no quantifier (bare names)
 * 2. increased items
 * 3. occasional items
 * 4. few items
 * 5. rare items
 *
 * Items sharing a quantifier are lumped: "few schistocytes and tear-drop cells"
 * Groups are joined with " and ": "tear-drop cells and few schistocytes"
 */
function formatSubFindings(findings: SubFinding[]): string {
  const groups: string[] = [];

  for (const q of QUANTIFIER_ORDER) {
    const items = findings.filter((f) => f.quantifier === q);
    if (items.length === 0) continue;
    const names = formatList(items.map((i) => i.name));
    if (q === null) {
      groups.push(names);
    } else {
      groups.push(`${q} ${names}`);
    }
  }

  return groups.join(' and ');
}

function getAdditionalFindings(rbc: RbcGroup): string[] {
  const items: string[] = [];
  const a = rbc.additional;

  // Collect poikilocytosis sub-findings with their quantifiers
  const subFindings: SubFinding[] = [];
  if (a.schistocytes) subFindings.push({ name: 'schistocytes', quantifier: a.schistocytesQuantifier });
  if (a.tearDropCells) subFindings.push({ name: 'tear-drop cells', quantifier: a.tearDropCellsQuantifier });
  if (a.targetCells) subFindings.push({ name: 'target cells', quantifier: a.targetCellsQuantifier });
  if (a.elliptocytes) subFindings.push({ name: 'elliptocytes', quantifier: a.elliptocytesQuantifier });
  if (a.otherText.trim()) subFindings.push({ name: a.otherText.trim(), quantifier: a.otherTextQuantifier });

  // Derived: anisocytosis + poikilocytosis = anisopoikilocytosis
  if (a.anisocytosis && a.poikilocytosis) {
    if (subFindings.length > 0) {
      items.push(`anisopoikilocytosis including ${formatSubFindings(subFindings)}`);
    } else {
      items.push('anisopoikilocytosis');
    }
  } else {
    if (a.anisocytosis) items.push('anisocytosis');
    if (a.poikilocytosis) {
      if (subFindings.length > 0) {
        items.push(`poikilocytosis including ${formatSubFindings(subFindings)}`);
      } else {
        items.push('poikilocytosis');
      }
    } else {
      // No poikilocytosis — sub-findings added individually (shouldn't happen with UI gate)
      items.push(...subFindings.map((f) => f.quantifier ? `${f.quantifier} ${f.name}` : f.name));
    }
  }

  return items;
}
