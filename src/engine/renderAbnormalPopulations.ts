import type { AbnormalPopulationsGroup } from '../types';
import { formatLine } from './textUtils';

export function renderAbnormalPopulations(group: AbnormalPopulationsGroup): string {
  const lines = group.entries
    .filter((e) => e.amountValue.trim() && e.populationType.trim())
    .map((entry) => {
      if (entry.amountType === 'numeric') {
        return formatLine(`About ${entry.amountValue.trim()}% ${entry.populationType} present`);
      }
      // qualitative or freetext
      return formatLine(`${entry.amountValue.trim()} ${entry.populationType} present`);
    });

  return lines.join('\n');
}
