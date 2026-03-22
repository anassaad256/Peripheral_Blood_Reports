import type { InterpretationsGroup } from '../types';
import { INTERPRETATION_STATEMENTS, INTERPRETATION_ORDER } from '../constants/interpretations';

export function renderInterpretations(group: InterpretationsGroup): string {
  // Render in the fixed canonical order, not user selection order
  const lines = INTERPRETATION_ORDER
    .filter((key) => group.selected.includes(key))
    .map((key) => INTERPRETATION_STATEMENTS[key]);

  return lines.join('\n');
}
