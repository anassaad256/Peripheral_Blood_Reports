import type { PlateletGroup } from '../types';
import { formatList, formatLine } from './textUtils';

export function renderPlatelets(platelets: PlateletGroup): string {
  const hasCount = platelets.count !== null;
  const morphItems: string[] = [];
  if (platelets.largePlatelets) morphItems.push('large platelets');
  if (platelets.plateletClumps) morphItems.push('platelet clumps');
  const hasMorph = morphItems.length > 0;

  if (!hasCount && !hasMorph) {
    return '';
  }

  const countLabel = platelets.count ?? '';
  const morphStr = formatList(morphItems);

  let line = '';
  if (hasCount && hasMorph) {
    line = `${countLabel} with ${morphStr}`;
  } else if (hasCount) {
    line = countLabel;
  } else {
    line = morphStr;
  }

  return formatLine(line);
}
