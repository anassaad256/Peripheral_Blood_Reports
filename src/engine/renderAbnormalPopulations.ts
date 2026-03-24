import type { AbnormalPopulationsGroup, AbnormalPopulationEntry } from '../types';
import { formatLine, formatList } from './textUtils';

const MORPHOLOGY_LABELS: Record<string, string> = {
  hyposegmented: 'hyposegmented (Pelgeroid)',
  hypersegmented: 'hypersegmented',
  hypogranular: 'hypogranular',
};

function isEntryValid(e: AbnormalPopulationEntry): boolean {
  if (!e.amountValue.trim()) return false;
  if (e.populationType === 'neutrophils') {
    return e.neutrophilMorphologies.length > 0;
  }
  return e.populationType.trim().length > 0;
}

function renderPopulationType(entry: AbnormalPopulationEntry): string {
  if (entry.populationType === 'neutrophils') {
    const morphLabels = entry.neutrophilMorphologies.map((m) => MORPHOLOGY_LABELS[m] || m);
    return `${formatList(morphLabels)} neutrophils`;
  }
  return entry.populationType;
}

export function renderAbnormalPopulations(group: AbnormalPopulationsGroup): string {
  const lines = group.entries
    .filter(isEntryValid)
    .map((entry) => {
      const popType = renderPopulationType(entry);
      if (entry.amountType === 'numeric') {
        return formatLine(`About ${entry.amountValue.trim()}% ${popType} present`);
      }
      // qualitative or freetext
      return formatLine(`${entry.amountValue.trim()} ${popType} present`);
    });

  return lines.join('\n');
}
